/**
 * Created by Jomaras.
 * Date: 11.03.12.@12:25
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var fcModel = Firecrow.Interpreter.Model;

Firecrow.Interpreter.Model.BooleanFunction = function(globalObject)
{
    this.initObject(globalObject);

    this.prototype = new fcModel.JsValue(globalObject.booleanPrototype, new fcModel.FcInternal(null, globalObject.booleanPrototype)) ;
    this.addProperty("prototype", globalObject.booleanPrototype);

    this.isInternalFunction = true;
    this.name = "Boolean";
    this.fcInternal = this;
};

Firecrow.Interpreter.Model.BooleanFunction.prototype = new fcModel.Object();

Firecrow.Interpreter.Model.BooleanPrototype = function(globalObject)
{
    this.initObject(globalObject);
    this.fcInternal = { object: this };
};

Firecrow.Interpreter.Model.BooleanPrototype.prototype = new fcModel.Object();
/*************************************************************************************/
}});