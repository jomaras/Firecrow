FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
fcModel.Object = function(globalObject, codeConstruct, implementationObject, proto)
{
    this.id = fcModel.Object.LAST_ID++;

    this.globalObject = globalObject;
    this.implementationObject = implementationObject;
    this.creationCodeConstruct = codeConstruct;

    this.properties = [];
    this.enumeratedProperties = [];

    this.proto = proto;
    this.prototypeDefinitionConstruct = null;

    this.modifications = [];

    if(codeConstruct != null && globalObject != null)
    {
        this._addModification(codeConstruct, globalObject.getPreciseEvaluationPositionId());
    }

    this.eventListenerInfo = {};

    this.objectModifiedCallbackDescriptors = null;
    this.addPropertyCallbackDescriptors = null;
    this.getPropertyCallbackDescriptors = null;
};

fcModel.Object.LAST_ID = 0;
fcModel.Object.notifyError = function(message) { alert("Object - " + message); }
fcModel.Object.prototype =
{
    //<editor-fold desc="Property Getters">
    getOwnProperty: function(propertyName)
    {
        return ValueTypeHelper.findInArray
        (
            this.properties,
            propertyName,
            function(property, propertyName) { return property.name == propertyName; }
        );
    },

    isOwnProperty: function(propertyName)
    {
        return this.getOwnProperty(propertyName) != null;
    },

    getProperty: function(propertyName, readPropertyConstruct)
    {
        try
        {
            var property = this.getOwnProperty(propertyName);

            if(property != null)
            {
                this._callCallbacks(this.getPropertyCallbackDescriptors, [readPropertyConstruct, propertyName]);

                return property;
            }

            if(this.proto == null || (this.proto.fcInternal == null && this.proto.jsValue == null)) { return null; }

            if(this.proto.fcInternal != null && this.proto.fcInternal.object != null)
            {
                property = this.proto.fcInternal.object.getProperty(propertyName, readPropertyConstruct);
            }
            else if (this.proto.jsValue != null && this.proto.jsValue.fcInternal.object != null)
            {
                property = this.proto.jsValue.fcInternal.object.getProperty(propertyName, readPropertyConstruct);
            }

            this._addDependenciesToPrototypeProperty(property, readPropertyConstruct);

            return property;
        }
        catch(e) { fcModel.Object.notifyError("Error when getting property:" + e); }
    },

    getPropertyValue: function(propertyName, codeConstruct)
    {
        var property = this.getProperty(propertyName, codeConstruct);

        return property != null ? property.value
                                : undefined;
    },

    getLastPropertyModifications: function(codeConstruct)
    {
        var propertyNames = this._getEnumeratedPropertiesFromImplementationObject();

        var lastModifications = [];

        for(var i = 0, length = propertyNames.length; i < length; i++)
        {
            var property = this.getProperty(propertyNames[i], codeConstruct);

            if(property != null && property.lastModificationConstruct != null)
            {
                lastModifications.push(property.lastModificationConstruct);
            }
        }

        return lastModifications;
    },

    getPropertyNameAtIndex: function(index, codeConstruct)
    {
        return new fcModel.JsValue
        (
            this._getEnumeratedPropertiesFromImplementationObject()[index],
            new fcModel.FcInternal(codeConstruct)
        );
    },

    getPropertiesWithIndexNames: function()
    {
        var indexProperties = [];

        for(var i = 0; i < this.properties.length; i++)
        {
            if(ValueTypeHelper.isInteger(this.properties[i].name))
            {
                indexProperties.push(this.properties[i]);
            }
        }

        return indexProperties;
    },
    //</editor-fold>

    //<editor-fold desc="Property Setters">
    addProperty: function(propertyName, propertyValue, codeConstruct, isEnumerable)
    {
        try
        {
            if(propertyName == "__proto__") { this.setProto(propertyValue, codeConstruct); return; }

            var existingProperty = this.getOwnProperty(propertyName);

            if(existingProperty == null)
            {
                var property = new fcModel.Identifier(propertyName, propertyValue, codeConstruct, this.globalObject);

                this.properties.push(property);

                if(isEnumerable) { this.enumeratedProperties.push(property); }
            }
            else
            {
                existingProperty.setValue(propertyValue, codeConstruct);
            }

            if(propertyName == "prototype" && propertyValue != null && codeConstruct != null)
            {
                this.prototypeDefinitionConstruct = { codeConstruct: codeConstruct, evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()};
            }

            if(codeConstruct != null)
            {
                this._addModification(codeConstruct, this.globalObject.getPreciseEvaluationPositionId());
            }

            this._callCallbacks(this.addPropertyCallbackDescriptors, [propertyName, propertyValue, codeConstruct]);
        }
        catch(e) { fcModel.Object.notifyError("Error when adding property:" + e); }
    },

    setProto: function(proto, codeConstruct)
    {
        try
        {
            this.proto = proto;

            if(codeConstruct != null)
            {
                this._addModification(codeConstruct, this.globalObject.getPreciseEvaluationPositionId());
            }
        }
        catch(e) { fcModel.Object.notifyError("Error when setting proto: " + e); }
    },
    //</editor-fold>

    //<editor-fold desc="Property Deleter">
    deleteProperty: function(propertyName, codeConstruct)
    {
        try
        {
            for(var i = 0; i < this.properties.length; i++)
            {
                if(this.properties[i].name == propertyName)
                {
                    ValueTypeHelper.removeFromArrayByIndex(this.properties, i);
                    break;
                }
            }

            for(var i = 0; i < this.enumeratedProperties.length; i++)
            {
                if(this.enumeratedProperties[i].name == propertyName)
                {
                    ValueTypeHelper.removeFromArrayByIndex(this.enumeratedProperties, i);
                    break;
                }
            }
        }
        catch(e) { fcModel.Object.notifyError("Error when deleting property:" + e);}
    },
    //</editor-fold>

    //<editor-fold desc="Callbacks">
    registerObjectModifiedCallbackDescriptor: function(callback, thisValue)
    {
        if(this.objectModifiedCallbackDescriptors == null) { this.objectModifiedCallbackDescriptors = [];}

        this.objectModifiedCallbackDescriptors.push({callback: callback, thisValue: thisValue});
    },

    registerGetPropertyCallback: function(callback, thisValue)
    {
        if(this.getPropertyCallbackDescriptors == null) { this.getPropertyCallbackDescriptors = []; }

        this.getPropertyCallbackDescriptors.push({ callback: callback, thisValue: thisValue});
    },

    registerAddPropertyCallback: function(callback, thisValue)
    {
        if(this.addPropertyCallbackDescriptors == null) { this.addPropertyCallbackDescriptors = []; }

        this.addPropertyCallbackDescriptors.push({ callback: callback, thisValue: thisValue});
    },

    _callCallbacks: function(callbackDescriptors, args)
    {
        if(callbackDescriptors == null || callbackDescriptors.length == 0) { return; }

        for(var i = 0, length = callbackDescriptors.length; i < length; i++)
        {
            var callbackDescriptor = callbackDescriptors[i];
            callbackDescriptor.callback.apply(callbackDescriptor.thisValue, args);
        }
    },
    //</editor-fold>

    //<editor-fold desc="Event listeners">
    addEventListener: function(args, callExpression, globalObject)
    {
        try
        {
            if(args.length < 2) { this.notifyError("Too few arguments when executing addEventListener"); return; }

            var eventTypeName = args[0].value;
            var handler = args[1];

            if(this.eventListenerInfo[eventTypeName] == null) { this.eventListenerInfo[eventTypeName] = []; }

            this.eventListenerInfo[eventTypeName].push
                ({
                    handler: handler,
                    registrationPoint:
                    {
                        codeConstruct: callExpression,
                        evaluationPositionId: globalObject.getPreciseEvaluationPositionId()
                    }
                });
        }
        catch(e) { fcModel.Object.notifyError("Error when adding event listener: " + e); }
    },

    removeEventListener: function(args, callExpression, globalObject)
    {
        try
        {
            if(args.length < 2) { this.notifyError("Too few arguments when executing addEventListener"); return;}

            var eventTypeName = args[0].value;
            var handler = args[1].value;

            var eventHandlers = this.eventListenerInfo[eventTypeName];

            if(eventHandlers == null) { return; }

            for(var i = 0; i < eventHandlers.length; i++)
            {
                if(eventHandlers[i].handler === handler)
                {
                    ValueTypeHelper.removeFromArrayByIndex(eventHandlers, i);
                    i--;
                }
            }
        }
        catch(e) { fcModel.Object.notifyError ("Error when removing event listener: " + e); }
    },
    //</editor-fold>

    //<editor-fold desc="Dependencies to Modifications">
    addDependencyToAllModifications: function(codeConstruct)
    {
        for(var i = 0, length = this.modifications.length; i < length; i++)
        {
            var modification = this.modifications[i];
            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                codeConstruct,
                modification.codeConstruct,
                this.globalObject.getPreciseEvaluationPositionId(),
                modification.evaluationPositionId
            );
        }
    },
    //</editor-fold>

    //<editor-fold desc="'Private' methods">
    _addModification: function(codeConstruct, evaluationPositionId)
    {
        try
        {
            if(codeConstruct == null) { return; }

            var modificationDescription = { codeConstruct: codeConstruct, evaluationPositionId: evaluationPositionId };

            this.modifications.push(modificationDescription);

            this._callCallbacks(this.objectModifiedCallbackDescriptors, [modificationDescription]);
        }
        catch(e) { fcModel.Object.notifyError("Error when adding modification:" + e);}
    },

    _addDependenciesToPrototypeProperty: function(property, readPropertyConstruct)
    {
        if(property == null) { return; }

        if(this.prototypeDefinitionConstruct != null)
        {
            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                readPropertyConstruct,
                this.prototypeDefinitionConstruct.codeConstruct,
                this.globalObject.getPreciseEvaluationPositionId(),
                this.prototypeDefinitionConstruct.evaluationPositionId
            );
        }

        if(property.lastModificationConstruct != null)
        {
            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                readPropertyConstruct,
                property.lastModificationConstruct.codeConstruct,
                this.globalObject.getPreciseEvaluationPositionId(),
                property.lastModificationConstruct.evaluationPositionId
            );
        }
    },

    _getEnumeratedPropertiesFromImplementationObject: function()
    {
        var properties = [];

        if(this.implementationObject != null)
        {
            for(var property in this.implementationObject)
            {
                properties.push(property);
            }
        }

        return properties;
    }
    //</editor-fold>
};
/*************************************************************************************/
}});