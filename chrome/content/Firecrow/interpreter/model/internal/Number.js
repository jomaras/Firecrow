/**
 * Created by Jomaras.
 * Date: 23.03.12.@13:20
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var fcModel = Firecrow.Interpreter.Model;

Firecrow.Interpreter.Model.NumberFunction = function(globalObject)
{
    this.__proto__ = new fcModel.Object(globalObject);

    this.prototype = new fcModel.JsValue(globalObject.numberPrototype, new fcModel.FcInternal(null, globalObject.numberPrototype)) ;
    this.addProperty("prototype", globalObject.numberPrototype);

    this.isInternalFunction = true;
    this.name = "Number";
    this.fcInternal = this;

    this.addProperty("MIN_VALUE", new fcModel.JsValue(Number.MIN_VALUE, new fcModel.FcInternal()));
    this.addProperty("MAX_VALUE", new fcModel.JsValue(Number.MAX_VALUE, new fcModel.FcInternal()));

    this.addProperty("NEGATIVE_INFINITY", new fcModel.JsValue(Number.NEGATIVE_INFINITY, new fcModel.FcInternal()));
    this.addProperty("POSITIVE_INFINITY", new fcModel.JsValue(Number.POSITIVE_INFINITY, new fcModel.FcInternal()));

    this.addProperty("NaN", new fcModel.JsValue(Number.NaN, new fcModel.FcInternal()));
};

Firecrow.Interpreter.Model.NumberPrototype = function(globalObject)
{
    this.globalObject = globalObject;

    this.__proto__ = new fcModel.Object(globalObject);

    this.fcInternal = { object: this };
}
/*************************************************************************************/
}});