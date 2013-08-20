/**
 * Created by Jomaras.
 * Date: 23.03.12.@13:20
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var fcModel = Firecrow.Interpreter.Model;

fcModel.Number = function(value, globalObject, codeConstruct, isLiteral)
{
    this.initObject(globalObject, codeConstruct);

    this.value = value;
    this.isLiteral = !!isLiteral;

    this.addProperty("__proto__", this.globalObject.fcNumberPrototype);
};

fcModel.Number.notifyError = function(message) { alert("Number - " + message); };
fcModel.Number.prototype = new fcModel.Object();
fcModel.Number.prototype.getJsPropertyValue = function(propertyName, codeConstruct)
{
    return this.getPropertyValue(propertyName, codeConstruct);
};

fcModel.NumberFunction = function(globalObject)
{
    this.initObject(globalObject, null, Number, globalObject.fcFunctionPrototype);
    this.constructor = fcModel.NumberPrototype;

    this.addProperty("prototype", globalObject.fcNumberPrototype);
    this.proto = globalObject.fcFunctionPrototype;

    this.isInternalFunction = true;
    this.name = "Number";

    this.addProperty("MIN_VALUE", this.globalObject.internalExecutor.createInternalPrimitiveObject(null, Number.MIN_VALUE), null);
    this.addProperty("MAX_VALUE", this.globalObject.internalExecutor.createInternalPrimitiveObject(null, Number.MAX_VALUE), null);

    this.addProperty("NEGATIVE_INFINITY", this.globalObject.internalExecutor.createInternalPrimitiveObject(null, Number.NEGATIVE_INFINITY), null);
    this.addProperty("POSITIVE_INFINITY", this.globalObject.internalExecutor.createInternalPrimitiveObject(null, Number.POSITIVE_INFINITY), null);

    this.addProperty("NaN", this.globalObject.internalExecutor.createInternalPrimitiveObject(null, Number.NaN), null);
};

fcModel.NumberFunction.prototype = new fcModel.Object();

fcModel.NumberPrototype = function(globalObject)
{
    this.initObject(globalObject, null, Number.prototype, globalObject.fcObjectPrototype);
};

fcModel.NumberPrototype.prototype = new fcModel.Object();
/*************************************************************************************/
}});