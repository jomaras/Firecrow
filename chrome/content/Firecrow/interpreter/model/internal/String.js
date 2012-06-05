/**
 * Created by Jomaras.
 * Date: 16.03.12.@15:36
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var fcModel = Firecrow.Interpreter.Model;

fcModel.String = function(value, globalObject, codeConstruct)
{
    try
    {
        this.value = value;
        this.globalObject = globalObject;
    }
    catch(e) { this.notifyError("Error when creating a String object: " + e); }
};

fcModel.String.prototype = new fcModel.Object(null);

fcModel.String.prototype.notifyError = function(message) { alert("String - " + message); }

fcModel.StringPrototype = function(globalObject)
{
    try
    {
        this.globalObject = globalObject;

        fcModel.StringPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            this.addProperty(propertyName, fcModel.Function.createInternalNamedFunction(globalObject, propertyName), null, false);
        }, this);
    }
    catch(e) { alert("StringPrototype - error when creating array prototype:" + e); }
};

fcModel.StringPrototype.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS:
        [
            "charAt","charCodeAt","concat","indexOf","lastIndexOf","localeCompare",
            "match","replace","search","slice","split","substr","substring","toLocaleLowerCase",
            "toLocaleUpperCase","toLowerCase","toString","toUpperCase","trim","trimLeft","trimRight","valueOf"
        ]
    }
};

fcModel.StringPrototype.prototype = new fcModel.Object(null);

fcModel.StringFunction = function(globalObject)
{
    try
    {
        this.addProperty("prototype", globalObject.stringPrototype);
        this.isInternalFunction = true;
        this.name = "String";
        this.fcInternal = this;
    }
    catch(e){ alert("String - error when creating String Function:" + e); }
};

fcModel.StringFunction.prototype = new fcModel.Object(null);
/*************************************************************************************/
}});