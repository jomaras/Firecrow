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
    this.initObject(globalObject);

    fcModel.Math.CONST.INTERNAL_PROPERTIES.PROPERTIES.forEach(function(property)
    {
        var propertyValue = this.globalObject.internalExecutor.createInternalPrimitiveObject(null, Math[property]);
        this.addProperty(property, propertyValue, null);
        this[property] = propertyValue;
    }, this);

    fcModel.Math.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
    {
        this.addProperty
        (
            propertyName,
            new fcModel.fcValue
            (
                Math[propertyName],
                fcModel.Function.createInternalNamedFunction(globalObject, propertyName, this),
                null
            ),
            null,
            false
        );
    }, this);
};

Firecrow.Interpreter.Model.Math.prototype = new fcModel.Object();

Firecrow.Interpreter.Model.Math.notifyError = function(message){ alert("Math - " + message); };

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

fcModel.Math.prototype = new fcModel.Object();
fcModel.MathExecutor =
{
    executeInternalMethod: function(thisObject, functionObject, args, callExpression)
    {
        try
        {
            if(!functionObject.isInternalFunction) { fcModel.notifyError("The function should be internal when executing Math method!"); return; }

            return new fcModel.fcValue
            (
                Math[functionObject.jsValue.name].apply(null, functionObject.iValue.globalObject.getJsValues(args)),
                null,
                callExpression
            );
        }
        catch(e) { fcModel.Math.notifyError("Error when executing internal math method: " + e);}
    },

    isInternalMathMethod: function(functionObject)
    {
        return fcModel.Math.CONST.INTERNAL_PROPERTIES.METHODS.indexOf(functionObject.name) != -1;
    }
}
/*************************************************************************************/
}});