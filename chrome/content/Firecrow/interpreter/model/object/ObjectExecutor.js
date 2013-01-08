/**
 * User: Jomaras
 * Date: 06.11.12.
 * Time: 08:50
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.ObjectExecutor =
{
    executeInternalMethod: function(thisObject, functionObject, args, callExpression, callCommand)
    {
        if(functionObject.jsValue.name == "hasOwnProperty")
        {
            return this._executeHasOwnProperty(thisObject, args, callExpression);
        }
        else if (functionObject.jsValue.name == "toString")
        {
            var result = "";
            if(callCommand != null && (callCommand.isCall || callCommand.isApply))
            {
                result = Object.prototype.toString.call(thisObject.jsValue);
            }
            else
            {
                result = thisObject.jsValue.toString();
            }

            return thisObject.iValue.globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, result);
        }
        else
        {
            fcModel.Object.notifyError("Unknown ObjectExecutor method");
        }
    },

    executeInternalConstructor: function(constructorConstruct, args, globalObject)
    {
        var newlyCreatedObject = null;

        if (args.length == 0)
        {
            return globalObject.internalExecutor.createNonConstructorObject(constructorConstruct, new Object());
        }

        var firstArgument = args[0];

        if(firstArgument.jsValue == null)
        {
            return globalObject.internalExecutor.createNonConstructorObject(constructorConstruct, new Object(firstArgument.jsValue));
        }
        else if (ValueTypeHelper.isBoolean(firstArgument.jsValue))
        {
            return new fcModel.fcValue
            (
                new Boolean(firstArgument.jsValue),
                new fcModel.Boolean(firstArgument.jsValue, globalObject, constructorConstruct),
                constructorConstruct
            );
        }
        else if(ValueTypeHelper.isString(firstArgument.jsValue))
        {
            return new fcModel.fcValue
            (
                new String(firstArgument.jsValue),
                new fcModel.String(firstArgument.jsValue, globalObject, constructorConstruct),
                constructorConstruct
            );
        }
        else if(ValueTypeHelper.isNumber(firstArgument.jsValue))
        {
            return new fcModel.fcValue
            (
                new Number(firstArgument.jsValue),
                new fcModel.Number(firstArgument.jsValue, globalObject, constructorConstruct),
                constructorConstruct
            );
        }
        else
        {
            return args[0];
        }
    },

    _executeHasOwnProperty: function(thisObject, args, callExpression)
    {
        if(thisObject == null || thisObject.iValue == null || args == null || args.length <= 0) { fcModel.Object.notifyError("Invalid argument when executing hasOwnProperty");}

        var result = thisObject.iValue.isOwnProperty(args[0].jsValue);

        return thisObject.iValue.globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, result);
    }
};
/*************************************************************************************/
}});