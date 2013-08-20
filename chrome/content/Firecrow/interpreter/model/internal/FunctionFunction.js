FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var fcModel = Firecrow.Interpreter.Model;

Firecrow.Interpreter.Model.FunctionFunction = function(globalObject)
{
    this.initObject(globalObject, null, Function, globalObject.fcFunctionPrototype);

    this.addProperty("prototype", this.globalObject.fcFunctionPrototype);

    this.isInternalFunction = true;
    this.name = "Function";
};

Firecrow.Interpreter.Model.FunctionFunction.prototype = new fcModel.Object();
Firecrow.Interpreter.Model.FunctionFunction.prototype.getJsPropertyValue = function(propertyName, codeConstruct)
{
    return this.getPropertyValue(propertyName, codeConstruct);
};
/*************************************************************************************/
}});