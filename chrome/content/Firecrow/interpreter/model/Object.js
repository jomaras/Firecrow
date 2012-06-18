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

fcModel.ObjectFunction = function()
{

};

fcModel.Object = function(globalObject, codeConstruct, implementationObject)
{
    this.id = fcModel.Object.LAST_ID++;
    this.globalObject = globalObject;

    this.modifications = [];
    this.addModification(codeConstruct);

    this.implementationObject = implementationObject;

    this.proto = null;
    this.properties = [];
    this.enumeratedProperties = [];
};

fcModel.Object.LAST_ID = 0;

fcModel.Object.prototype =
{
    registerModificationAddedCallback: function(callback, thisValue)
    {
        this.modificationCallbackDescriptor = { callback: callback, thisValue: thisValue};
    },

    registerGetPropertyCallback: function(callback, thisValue)
    {
        this.getPropertyCallbackDescriptor = { callback: callback, thisValue: thisValue};
    },

    addModification: function(codeConstruct)
    {
        try
        {
            if(codeConstruct == null) { return; }

            this.modifications.push(codeConstruct);

            if(this.modificationCallbackDescriptor != null)
            {
                this.modificationCallbackDescriptor.callback.call
                (
                    this.modificationCallbackDescriptor.thisValue || this,
                    codeConstruct,
                    this.modifications
                );
            }
        }
        catch(e) { alert("Error when adding modification - Object:" + e);}
    },

    setProto: function(proto, codeConstruct)
    {
        try
        {
            this.proto = proto;
            this.addModification(codeConstruct);
        }
        catch(e) { alert("Object - error "); }
    },

    addProperty: function(propertyName, propertyValue, codeConstruct, isEnumerable)
    {
        try
        {
            if(propertyName == "__proto__") { this.setProto(propertyValue, codeConstruct); return; }

            var existingProperty = this.getOwnProperty(propertyName);

            if(existingProperty == null)
            {
                var property = new fcModel.Identifier(propertyName, propertyValue, codeConstruct);

                this.properties.push(property);

                if(isEnumerable) { this.enumeratedProperties.push(property); }
            }
            else
            {
                existingProperty.setValue(propertyValue, codeConstruct);
            }

            this.addModification(codeConstruct);
        }
        catch(e) { alert("Error when adding property - Object:" + e);}
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

            if(this.proto.fcInternal == null) { return null; }

            this.addDependencyToPrototypeDefinition();

            return this.proto.fcInternal.object.getProperty(name, readPropertyConstruct);
        }
        catch(e)
        {
            alert("Error when getting property - Object:" + e);
        }
    },

    getPropertyNameAtIndex: function(index, codeConstruct)
    {
        return new fcModel.JsValue(this._getEnumeratedPropertiesFromImplementationObject()[index], new fcModel.FcInternal(codeConstruct));
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

    addDependencyToPrototypeDefinition: function()
    {
        try
        {
            if(this.proto == null) { return; }
            if(this.proto.modifications == null) { return; }

            var protoModifications = this.proto.modifications;

            for(var i = 0, length = protoModifications.length; i < length; i++)
            {
                this.addModification(protoModifications[i]);
            }
        }
        catch(e)
        {
            alert("Error when adding dependency to prototype definition - Object:" + e);
        }
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