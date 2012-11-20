FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var fcModel = Firecrow.Interpreter.Model;

Firecrow.Interpreter.Model.BooleanFunction = function(globalObject)
{
    this.initObject(globalObject);

    this.addProperty("prototype", globalObject.booleanPrototype);
    this.proto = globalObject.functionPrototype;

    this.isInternalFunction = true;
    this.name = "Boolean";
};

Firecrow.Interpreter.Model.BooleanFunction.prototype = new fcModel.Object();

Firecrow.Interpreter.Model.BooleanPrototype = function(globalObject)
{
    this.initObject(globalObject);
};

Firecrow.Interpreter.Model.BooleanPrototype.prototype = new fcModel.Object();
/*************************************************************************************/
}});