/**
 * User: Jomaras
 * Date: 06.11.12.
 * Time: 11:12
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
fcModel.ArrayExecutor =
{
    executeInternalArrayMethod : function(thisObject, functionObject, arguments, callExpression, callCommand)
    {
        try
        {
            if(!functionObject.fcInternal.isInternalFunction) { fcModel.Array.notifyError("The function should be internal when executing array method!"); return; }

            var functionObjectValue = functionObject.value;
            var thisObjectValue = thisObject.value;
            var functionName = functionObjectValue.name;
            var fcThisValue =  thisObject.fcInternal.object;
            var globalObject = thisObject.fcInternal.object.globalObject;

            var isCalledOnArray = fcThisValue.constructor === fcModel.Array;

            if(!isCalledOnArray && functionName != "push" && functionName != "slice")
            {
                console.log(functionName + " called on a non-array object!");
            }

            switch(functionName)
            {
                case "toString":
                    return new fcModel.JsValue(isCalledOnArray ? "[object Array]" : "[object Object]", new fcModel.FcInternal(callExpression));
                case "pop":
                case "reverse":
                case "shift":
                case "push":
                case "concat":
                case "slice":
                case "indexOf":
                case "lastIndexOf":
                case "unshift":
                case "splice":
                case "join":
                case "sort":
                    return fcModel.Array.prototype[functionName].apply(fcThisValue, [thisObjectValue, arguments, callExpression, thisObject]);
                case "forEach":
                case "filter":
                case "every":
                case "some":
                case "map":
                    var allCallbackArguments = [];
                    var callbackParams = callExpression.arguments != null ? callExpression.arguments[0].params : [];
                    callbackParams = callbackParams || [];

                    for(var i = 0, length = thisObjectValue.length; i < length; i++)
                    {
                        allCallbackArguments.push([thisObject.value[i], new fcModel.JsValue(i, new fcModel.FcInternal(callbackParams[i])), thisObject]);
                    }

                    callCommand.generatesNewCommands = true;
                    callCommand.generatesCallbacks = true;
                    callCommand.callbackFunction = arguments[0];
                    callCommand.callbackArgumentGroups = allCallbackArguments;
                    callCommand.thisObject = arguments[2] || globalObject;
                    callCommand.originatingObject = thisObject;
                    callCommand.callerFunction = functionObject;

                    if(functionName == "filter" || functionName == "map")
                    {
                        callCommand.targetObject = globalObject.internalExecutor.createArray(callExpression);
                        return callCommand.targetObject;
                    }
                    else
                    {
                        return new fcModel.JsValue(undefined, new fcModel.FcInternal(callExpression));
                    }

                default:
                    fcModel.Array.notifyError("Unknown internal array method: " + functionObjectValue.name);
            }
        }
        catch(e) { fcModel.Array.notifyError("Error when executing internal array method: " + e + e.fileName + e.lineNumber); }
    },

    isInternalArrayMethod: function(potentialFunction)
    {
        var methods = fcModel.ArrayPrototype.CONST.INTERNAL_PROPERTIES.METHODS;

        for(var i = 0; i < methods.length; i++)
        {
            if(Array.prototype[methods[i]] === potentialFunction)
            {
                return true;
            }
        }

        return false;
    },

    notifyError: function(message) { Firecrow.Interpreter.Model.Array.notifyError(message); }
};
/*************************************************************************************/
}});