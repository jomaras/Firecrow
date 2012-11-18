FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var fcModel = Firecrow.Interpreter.Model;

Firecrow.Interpreter.Model.FunctionFunction = function(globalObject)
{
    this.initObject(globalObject);

    this.prototype = new fcModel.JsValue(globalObject.functionFunctionPrototype, new fcModel.FcInternal(null, globalObject.functionFunctionPrototype)) ;
    this.addProperty("prototype", globalObject.functionFunctionPrototype);

    this.isInternalFunction = true;
    this.name = "Function";
    this.fcInternal = this;
};

Firecrow.Interpreter.Model.FunctionFunction.prototype = new fcModel.Object();

Firecrow.Interpreter.Model.FunctionFunctionPrototype = function(globalObject)
{
    this.initObject(globalObject);
    this.fcInternal = { object: this };
};

Firecrow.Interpreter.Model.FunctionFunctionPrototype.prototype = new fcModel.Object();
/*************************************************************************************/
}});