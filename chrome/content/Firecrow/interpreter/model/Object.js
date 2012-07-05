/**
 * User: Jomaras
 * Date: 07.05.12.
 * Time: 09:56
 */
/**
 * Created by Jomaras.
 * Date: 10.03.12.@20:10
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.ObjectFunction = function() { };

fcModel.Object = function(globalObject, codeConstruct, implementationObject, prototype)
{
    this.id = fcModel.Object.LAST_ID++;
    this.globalObject = globalObject;

    this.modifications = [];
    if(codeConstruct != null && globalObject != null)
    {
        this.addModification(codeConstruct, globalObject.getPreciseEvaluationPositionId());
    }

    this.implementationObject = implementationObject;

    this.proto = prototype != null ? prototype : null;
    this.properties = [];
    this.enumeratedProperties = [];

    this.prototypeDefinitionConstruct = null;
};

fcModel.Object.LAST_ID = 0;

fcModel.Object.prototype =
{
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

    registerGetPropertyCallback: function(callback, thisValue)
    {
        this.getPropertyCallbackDescriptor = { callback: callback, thisValue: thisValue};
    },

    addModification: function(codeConstruct, evaluationPositionId)
    {
        try
        {
            if(codeConstruct == null) { return; }

            var modificationDescription = { codeConstruct: codeConstruct, evaluationPositionId: evaluationPositionId };

            this.modifications.push(modificationDescription);
        }
        catch(e) { alert("Error when adding modification - Object:" + e);}
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
        catch(e) { alert("Object - error when setting proto: " + e); }
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
        }
        catch(e)
        {
            alert("Error when adding property - Object:" + e);
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
                if(this.properties[i].name == propertyName)
                {
                    ValueTypeHelper.removeFromArrayByIndex(this.properties, i);
                    break;
                }
            }
        }
        catch(e) { alert("Error when deleting property - Object:" + e);}
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
                    return property.name === propertyName;
                }
            );
        }
        catch(e) { alert("Error when getting own property - Object:" + e);}
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
                        readPropertyConstruct
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
            alert("Error when getting property - Object:" + e);
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

    getPropertyValue: function(propertyName)
    {
        try
        {
            var property = this.getProperty(propertyName);

            return property != null ? property.value
                                    : null;
        }
        catch(e) { alert("Error when getting property value - Object:" + e);}
    },

    isOwnProperty: function(propertyName)
    {
        return this.getOwnProperty(propertyName) != null;
    }
};

fcModel.ObjectPrototype = function(globalObject)
{
    this.globalObject = globalObject;
};

fcModel.ObjectPrototype.prototype = new fcModel.Object(null);
/*************************************************************************************/
}});