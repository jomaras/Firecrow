FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.Object = function() {};

//<editor-fold desc="'Static' functions">
fcModel.Object.createObjectWithInit = function(globalObject, codeConstruct, implementationObject, proto)
{
    return (new fcModel.Object()).initObject(globalObject, codeConstruct, implementationObject, proto);
}

fcModel.Object.LAST_ID = 0;

fcModel.Object.notifyError = function(message) { alert("Object - " + message); }
//</editor-fold>

//<editor-fold desc="Prototype definition">
fcModel.Object.prototype =
{
    //<editor-fold desc="Object Initialization">
    initObject: function(globalObject, codeConstruct, implementationObject, proto)
    {
        this.id = fcModel.Object.LAST_ID++;

        this.globalObject = globalObject;
        this.implementationObject = implementationObject;
        this.creationCodeConstruct = codeConstruct;

        this.properties = [];
        this.enumeratedProperties = [];

        this.proto = proto;
        this.modifications = [];

        if(codeConstruct != null && globalObject != null)
        {
            this._addModification(codeConstruct, globalObject.getPreciseEvaluationPositionId());
        }

        this.objectModifiedCallbackDescriptors = null;
        this.addPropertyCallbackDescriptors = null;
        this.getPropertyCallbackDescriptors = null;

        return this;
    },
    //</editor-fold>

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
            if(propertyName == undefined || propertyName == null)
            {
                alert("Invalid property name!");
            }

            var property = this.getOwnProperty(propertyName);

            if(property != null)
            {
                this._callCallbacks(this.getPropertyCallbackDescriptors, [readPropertyConstruct, propertyName]);

                return property;
            }

            if(this.proto == null) { return null; }

            property = this.proto.iValue.getProperty(propertyName, readPropertyConstruct);

            this._addDependenciesToPrototypeProperty(property, readPropertyConstruct);

            return property;
        }
        catch(e)
        {
            fcModel.Object.notifyError("Error when getting property:" + e);
        }
    },

    getJsPropertyValue: function(propertyName, codeConstruct)
    {
        return this.getPropertyValue(propertyName, codeConstruct);
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

            if(property != null && property.lastModificationPosition != null)
            {
                lastModifications.push(property.lastModificationPosition);
            }
        }

        return lastModifications;
    },

    getPropertyNameAtIndex: function(index, codeConstruct)
    {
        var propertyName = this._getEnumeratedPropertiesFromImplementationObject()[index];
        return this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, propertyName);
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

    //<editor-fold desc="Dependencies to Modifications">
    addDependencyToAllModifications: function(codeConstruct, modifications)
    {
        modifications = modifications || this.modifications;
        if(codeConstruct == null || modifications == null || modifications.length == 0) { return; }

        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

        for(var i = 0, length = modifications.length; i < length; i++)
        {
            var modification = modifications[i];

            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                codeConstruct,
                modification.codeConstruct,
                evaluationPosition,
                modification.evaluationPositionId
            );
        }
    },

    addDependenciesToAllProperties: function(codeConstruct)
    {
        try
        {
            if(codeConstruct == null) { return; }
            if(this.dummyDependencyNode == null)
            {
                this.dummyDependencyNode = { type: "DummyCodeElement" };
                this.globalObject.browser.callNodeCreatedCallbacks(this.dummyDependencyNode, "js", true);
            }

            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                codeConstruct,
                this.dummyDependencyNode,
                this.globalObject.getPreciseEvaluationPositionId()
            );
        }
        catch(e) { fcModel.Object.notifyError("Error when adding dependencies to all properties: " + e + " " + codeConstruct.loc.source); }
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

        if(property.lastModificationPosition != null)
        {
            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                readPropertyConstruct,
                property.lastModificationPosition.codeConstruct,
                this.globalObject.getPreciseEvaluationPositionId(),
                property.lastModificationPosition.evaluationPositionId
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
//</editor-fold>
/*************************************************************************************/
}});