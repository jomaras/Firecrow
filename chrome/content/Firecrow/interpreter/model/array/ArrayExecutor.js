/**
 * User: Jomaras
 * Date: 06.11.12.
 * Time: 11:12
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var fcSimulator = Firecrow.Interpreter.Simulator;
fcModel.ArrayExecutor =
{
    executeInternalArrayMethod : function(thisObject, functionObject, args, callExpression, callCommand)
    {
        try
        {
            if(!functionObject.isInternalFunction) { fcModel.Array.notifyError("The function should be internal when executing array method!"); return; }

            var functionObjectValue = functionObject.jsValue;
            var thisObjectValue = thisObject.jsValue;
            var functionName = functionObjectValue.name;
            var fcThisValue =  thisObject.iValue;
            var globalObject = thisObject.iValue.globalObject;

            var isCalledOnArray = fcThisValue.constructor === fcModel.Array;

            if(!isCalledOnArray && functionName != "push" && functionName != "slice")
            {
                console.log(functionName + " called on a non-array object!");
            }

            switch(functionName)
            {
                case "toString":
                    var returnValue = isCalledOnArray ? "[object Array]" : "[object Object]";
                    return globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, returnValue);
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
                    return fcModel.Array.prototype[functionName].apply(fcThisValue, [thisObjectValue, args, callExpression, thisObject]);
                case "sort":
                    //If there is no function argument to sort, execute the internal sort method
                    if(args == null || args.length == 0)
                    {
                        return fcModel.Array.prototype[functionName].apply(fcThisValue, [thisObjectValue, args, callExpression, thisObject]);
                    }
                    //If there is drop down and handle it as a callback method
                case "forEach":
                case "filter":
                case "every":
                case "some":
                case "map":
                    var callbackParams = callExpression.arguments != null ? callExpression.arguments[0].params : [];

                    callCommand.generatesNewCommands = true;
                    callCommand.generatesCallbacks = true;
                    callCommand.callbackFunction = args[0];
                    callCommand.callbackArgumentGroups = this._generateCallbackArguments(thisObject, callbackParams || [], functionName);
                    callCommand.thisObject =  args[1] || globalObject;
                    callCommand.originatingObject = thisObject;
                    callCommand.callerFunction = functionObject;

                    if(callCommand.originatingObject != null && callCommand.originatingObject.iValue != null && callCommand.originatingObject.iValue.addDependenciesToAllProperties)
                    {
                        callCommand.originatingObject.iValue.addDependenciesToAllProperties(callExpression)
                    }

                    if(functionName == "filter" || functionName == "map")
                    {
                        callCommand.targetObject = globalObject.internalExecutor.createArray(callExpression);
                        return callCommand.targetObject;
                    }
                    else if(functionName == "sort")
                    {
                        callCommand.targetObject = thisObject;
                        return callCommand.targetObject;
                    }
                    else
                    {
                        return new fcModel.fcValue(undefined, undefined, callExpression);
                    }

                default:
                    fcModel.Array.notifyError("Unknown internal array method: " + functionObjectValue.name);
            }
        }
        catch(e) { fcModel.Array.notifyError("Error when executing internal array method: " + e + e.fileName + e.lineNumber); }
    },

    _generateCallbackArguments: function(thisObject, callbackParams, functionName)
    {
        if(functionName == "sort") { return this._generateSortCallbackArguments(thisObject, callbackParams); }
        else { return this._generateIterateOverAllItemsCallbackArguments(thisObject, callbackParams); }
    },

    _generateSortCallbackArguments: function(thisObject, callbackParams)
    {
        var thisObjectValue = thisObject.jsValue;

        var callbackArguments = [];

        var length = thisObjectValue.length;
        for(var i = 0; i < length - 1; i++)
        {
            for(var j = i + 1; j < length; j++)
            {
                callbackArguments.push([thisObject.jsValue[i], thisObject.jsValue[j]]);
            }
        }

        return callbackArguments;
    },

    _generateIterateOverAllItemsCallbackArguments: function(thisObject, callbackParams)
    {
        var thisObjectValue = thisObject.jsValue;
        var globalObject = thisObject.iValue.globalObject;
        var callbackArguments = [];

        for(var i = 0, length = thisObjectValue.length; i < length; i++)
        {
            callbackArguments.push([thisObject.jsValue[i], globalObject.internalExecutor.createInternalPrimitiveObject(callbackParams[i], i), thisObject]);
        }

        return callbackArguments;
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
    }
};
/*************************************************************************************/
}});