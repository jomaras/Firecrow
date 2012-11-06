FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
fcModel.Object = function(globalObject, codeConstruct, implementationObject, prototype)
{
    this.id = fcModel.Object.LAST_ID++;
    this.globalObject = globalObject;
    this.implementationObject = implementationObject;
    this.proto = prototype != null ? prototype : null;

    this.modifications = [];

    if(codeConstruct != null && globalObject != null)
    {
        this.addModification(codeConstruct, globalObject.getPreciseEvaluationPositionId());
    }

    this.prototypeDefinitionConstruct = null;

    this.properties = [];
    this.enumeratedProperties = [];

    this.eventListenerInfo = {};
};

fcModel.Object.LAST_ID = 0;
fcModel.Object.notifyError = function(message) { alert("Object - " + message); }
fcModel.Object.prototype =
{
    objectModifiedCallbackDescriptor: null,

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

    addEventListener: function(arguments, callExpression, globalObject)
    {
        try
        {
            if(arguments.length < 2) { this.notifyError("Too few arguments when executing addEventListener"); }

            var eventTypeName = arguments[0].value;
            var handler = arguments[1];

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
        catch(e) { fcModel.Object.notifyError("Error when adding event listener"); }
    },

    removeEventListener: function(arguments, callExpression, globalObject)
    {
        try
        {
            if(arguments.length < 2) { this.notifyError("Too few arguments when executing addEventListener"); return;}

            var eventTypeName = arguments[0].value;
            var handler = arguments[1].value;

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
        catch(e) { fcModel.Object.notifyError ("Error when removing event listener"); }
    },

    registerGetPropertyCallback: function(callback, thisValue)
    {
        this.getPropertyCallbackDescriptor = { callback: callback, thisValue: thisValue};
    },

    registerAddPropertyCallback: function(callback, thisValue)
    {
        this.addPropertyCallbackDescriptor = { callback: callback, thisValue: thisValue};
    },

    addModification: function(codeConstruct, evaluationPositionId)
    {
        try
        {
            if(codeConstruct == null) { return; }

            var modificationDescription = { codeConstruct: codeConstruct, evaluationPositionId: evaluationPositionId };

            this.modifications.push(modificationDescription);

            if(this.objectModifiedCallbackDescriptor != null)
            {
                this.objectModifiedCallbackDescriptor.callback.call(this.objectModifiedCallbackDescriptor.thisValue, modificationDescription);
            }
        }
        catch(e) { fcModel.Object.notifyError("Error when adding modification:" + e);}
    },

    setProto: function(proto, codeConstruct)
    {
        try
        {
            this.proto = proto;

            if(codeConstruct != null)
            {
                this.addModification(codeConstruct, this.globalObject.getPreciseEvaluationPositionId());
            }
        }
        catch(e) { fcModel.Object.notifyError("Error when setting proto: " + e); }
    },

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
                this.addModification(codeConstruct, this.globalObject.getPreciseEvaluationPositionId());
            }

            if(this.addPropertyCallbackDescriptor != null)
            {
                this.addPropertyCallbackDescriptor.callback.call
                (
                    this.addPropertyCallbackDescriptor.thisValue || this,
                    propertyName,
                    propertyValue,
                    codeConstruct
                );
            }
        }
        catch(e)
        {
            fcModel.Object.notifyError("Error when adding property:" + e);
        }
    },

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

    getOwnProperty: function(propertyName)
    {
        try
        {
            return ValueTypeHelper.findInArray
                (
                    this.properties,
                    propertyName,
                    function(property, propertyName)
                    {
                        return property.name == propertyName;
                    }
                );
        }
        catch(e) { fcModel.Object.notifyError("Error when getting own property:" + e);}
    },

    getProperty: function(propertyName, readPropertyConstruct)
    {
        try
        {
            var property = this.getOwnProperty(propertyName);

            if(property != null)
            {
                if(this.getPropertyCallbackDescriptor != null)
                {
                    this.getPropertyCallbackDescriptor.callback.call
                        (
                            this.getPropertyCallbackDescriptor.thisValue || this,
                            readPropertyConstruct,
                            propertyName
                        );
                }
                return property;
            }
            if(this.proto == null) { return null; }

            if(this.proto.fcInternal == null && this.proto.jsValue == null) { return null; }

            var property = null;

            if(this.proto.fcInternal != null && this.proto.fcInternal.object != null)
            {
                property = this.proto.fcInternal.object.getProperty(propertyName, readPropertyConstruct);
            }
            else if (this.proto.jsValue != null && this.proto.jsValue.fcInternal.object != null)
            {
                property = this.proto.jsValue.fcInternal.object.getProperty(propertyName, readPropertyConstruct);
            }

            if(property != null)
            {
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
            }

            return property;
        }
        catch(e)
        {
            fcModel.Object.notifyError("Error when getting property:" + e);
        }
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
    },

    getPropertyValue: function(propertyName, codeConstruct)
    {
        try
        {
            var property = this.getProperty(propertyName, codeConstruct);

            return property != null ? property.value
                : undefined;
        }
        catch(e) { fcModel.Object.notifyError("Error when getting property value:" + e);}
    },

    isOwnProperty: function(propertyName)
    {
        return this.getOwnProperty(propertyName) != null;
    }
};
/*************************************************************************************/
}});