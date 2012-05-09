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
const fcModel = Firecrow.Interpreter.Model;
const ValueTypeHelper = Firecrow.ValueTypeHelper;

Firecrow.Interpreter.Model.Object = function(globalObject, codeConstruct)
{
    this.id = fcModel.Object.LAST_ID++;
    this.globalObject = globalObject;

    this.modifications = [];
    this.addModification(codeConstruct);

    this.proto = null;
    this.properties = [];
    this.enumeratedProperties = [];
};

Firecrow.Interpreter.Model.Object.LAST_ID = 0;

Firecrow.Interpreter.Model.Object.prototype =
{
    addModification: function(codeConstruct)
    {
        try
        {
            if(codeConstruct == null) { return; }

            this.modifications.push(codeConstruct);
        }
        catch(e) { alert("Error when adding modification - Object:" + e);}
    },

    addProperty: function(propertyName, propertyValue, codeConstruct, isEnumerable)
    {
        try
        {
            if(propertyName == "__proto__") { this.proto = propertyValue; return; }

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

    deleteProperty: function(propertyName)
    {
        try
        {
            for(var i = 0; i < this.properties.length; i++)
            {
                if(properties[i].name == propertyName)
                {
                    ValueTypeHelper.removeFromArrayByIndex(this.properties, i);
                    break;
                }
            }

            for(var i = 0; i < this.enumeratedProperties.length; i++)
            {
                if(properties[i].name == propertyName)
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

    getProperty: function(propertyName)
    {
        try
        {
            var property = this.getOwnProperty(propertyName);

            if(property != null) { return property; }
            if(this.proto == null) { return null; }

            this.addDependencyToPrototypeDefinition();

            return proto.getProperty(name);
        }
        catch(e) { alert("Error when getting property - Object:" + e); }
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

            this.proto.modifications.forEach(function(protoModificationConstruct)
            {
                this.modifications.push(protoModificationConstruct);
            }, this);
        }
        catch(e) { alert("Error when adding dependency to prototype definition - Object:" + e);}
    },

    isOwnProperty: function(propertyName)
    {
        return this.getOwnProperty(propertyName) != null;
    }
};
/*************************************************************************************/
}});