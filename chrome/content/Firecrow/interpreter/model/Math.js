/**
 * User: Jomaras
 * Date: 13.06.12.
 * Time: 10:36
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.Math = function(globalObject)
{
    this.globalObject = globalObject;

    fcModel.Math.CONST.INTERNAL_PROPERTIES.PROPERTIES.forEach(function(property)
    {
        var propertyValue = new fcModel.JsValue(Math[property], new fcModel.FcInternal(null));
        this.addProperty(property, propertyValue, null);
        this[property] = propertyValue;
    }, this);

    fcModel.Math.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(property)
    {
        var propertyValue = new fcModel.JsValue(Math[property], new fcModel.FcInternal(null, fcModel.Function.createInternalNamedFunction(this.globalObject, property)));
        this.addProperty(property, propertyValue, null);
        this[property] = propertyValue;
    }, this);
};

fcModel.Math.CONST =
{
    INTERNAL_PROPERTIES:
    {
        PROPERTIES: ["E", "LN2", "LN10", "LOG2E", "LOG10E", "PI", "SQRT1_2", "SQRT2"],
        METHODS:
        [
            "abs", "acos", "asin", "atan", "atan2", "ceil", "cos", "exp", "floor",
            "log", "max", "min", "pow", "random", "round", "sin", "sqrt", "tan"
        ]
    }
}

fcModel.Math.prototype = new fcModel.Object(null);
fcModel.MathExecutor =
{
    executeInternalMethod: function(thisObject, functionObject, arguments, callExpression)
    {
        try
        {
            if(!functionObject.fcInternal.isInternalFunction) { this.notifyError("The function should be internal when executing Math method!"); return; }

            return new fcModel.JsValue
            (
                Math[functionObject.value.name](arguments[0] != null ? arguments[0].value : null),
                new fcModel.FcInternal(callExpression)
            );
        }
        catch(e) { this.notifyError("Error when executing internal math method: " + e);}
    },

    notifyError: function(message){ alert("Math Executor error -  " );}
}
/*************************************************************************************/
}});