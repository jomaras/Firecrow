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
        var propertyValue = new fcModel.JsValue(Math[property], new fcModel.FcInternal(null));
        this.addProperty(property, propertyValue, null);
        this[property] = propertyValue;
    }, this);

    fcModel.Math.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
    {
        var internalFunction = globalObject.internalExecutor.createInternalFunction(Math[propertyName], propertyName, this);
        this[propertyName] = internalFunction;
        this.addProperty(propertyName, internalFunction, null, false);
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
    executeInternalMethod: function(thisObject, functionObject, arguments, callExpression)
    {
        try
        {
            if(!functionObject.fcInternal.isInternalFunction) { fcModel.notifyError("The function should be internal when executing Math method!"); return; }

            return new fcModel.JsValue
            (
                Math[functionObject.value.name].apply(null, arguments.map(function(argument) { return argument.value; })),
                new fcModel.FcInternal(callExpression)
            );
        }
        catch(e) { fcModel.Math.notifyError("Error when executing internal math method: " + e);}
    }
}
/*************************************************************************************/
}});