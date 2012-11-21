FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var fcModel = Firecrow.Interpreter.Model;

fcModel.Boolean = function(value, globalObject, codeConstruct, isLiteral)
{
    this.initObject(globalObject, codeConstruct);

    this.value = value;
    this.isLiteral = !!isLiteral;

    this.addProperty("__proto__", this.globalObject.fcBooleanPrototype);
};

fcModel.Boolean.prototype = new fcModel.Object();
fcModel.Boolean.prototype.getJsPropertyValue = function(propertyName, codeConstruct)
{
    return this.getPropertyValue(propertyName, codeConstruct);
};

fcModel.BooleanFunction = function(globalObject)
{
    this.initObject(globalObject);

    this.addProperty("prototype", globalObject.booleanPrototype);
    this.proto = globalObject.functionPrototype;

    this.isInternalFunction = true;
    this.name = "Boolean";
};

fcModel.BooleanFunction.prototype = new fcModel.Object();

fcModel.BooleanPrototype = function(globalObject)
{
    this.initObject(globalObject);
};

fcModel.BooleanPrototype.prototype = new fcModel.Object();
/*************************************************************************************/
}});