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
    this.initObject(globalObject);

    this.addProperty("prototype", globalObject.fcNumberPrototype);

    this.isInternalFunction = true;
    this.name = "Number";

    this.addProperty("MIN_VALUE", new fcModel.fcValue(Number.MIN_VALUE, Number.MIN_VALUE, null));
    this.addProperty("MAX_VALUE", new fcModel.fcValue(Number.MAX_VALUE, Number.MAX_VALUE, null));

    this.addProperty("NEGATIVE_INFINITY", new fcModel.fcValue(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, null));
    this.addProperty("POSITIVE_INFINITY", new fcModel.fcValue(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, null));

    this.addProperty("NaN", new fcModel.fcValue(Number.NaN, Number.NaN, null));
};

Firecrow.Interpreter.Model.NumberFunction.prototype = new fcModel.Object();

Firecrow.Interpreter.Model.NumberPrototype = function(globalObject)
{
    this.initObject(globalObject);
};

Firecrow.Interpreter.Model.NumberPrototype.prototype = new fcModel.Object();
/*************************************************************************************/
}});