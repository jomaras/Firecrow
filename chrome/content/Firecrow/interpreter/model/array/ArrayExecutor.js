/**
 * User: Jomaras
 * Date: 06.11.12.
 * Time: 11:12
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var fcSimulator = Firecrow.Interpreter.Simulator;
var ASTHelper = Firecrow.ASTHelper;
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

            if(functionName == "reduce" || functionName == "reduceRight")
            {
                if(thisObjectValue.length == 1 && args[1] == null) { return thisObjectValue[0]; }
                else if (thisObjectValue.length == 0) { return args[1] || globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, undefined); }
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
                case "slice":
                case "unshift":
                case "splice":
                    if(callExpression != null && ASTHelper.isMemberExpression(callExpression.callee) && ASTHelper.isIdentifier(callExpression.callee.object))
                    {
                        if(!fcThisValue.isDefinedInCurrentContext())
                        {
                            globalObject.browser.logModifyingExternalContextObject(fcThisValue.creationCodeConstruct != null ? fcThisValue.creationCodeConstruct.nodeId : -1, callExpression.callee.object.name)
                        }
                    }
                case "concat":
                case "indexOf":
                case "lastIndexOf":
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
                case "reduce":
                    var callbackParams = null;

                    if(callCommand.isCall)
                    {
                        callbackParams = callExpression.arguments != null ? callExpression.arguments[1].params : [];
                    }
                    else if (callCommand.isApply)
                    {
                        //debugger;
                    }
                    else
                    {
                        callbackParams = callExpression.arguments != null ? callExpression.arguments[0].params : [];
                    }

                    callCommand.generatesNewCommands = true;
                    callCommand.generatesCallbacks = true;
                    callCommand.setCallbackFunction(args[0]);
                    callCommand.callbackArgumentGroups = this._generateCallbackArguments(thisObject, callbackParams || [], functionName, args, callExpression);
                    callCommand.thisObject =  args[1] || globalObject;
                    callCommand.originatingObject = thisObject;
                    callCommand.callerFunction = functionObject;

                    if(callCommand.originatingObject != null && callCommand.originatingObject.iValue != null && callCommand.originatingObject.iValue.addDependenciesToAllProperties)
                    {
                        callCommand.originatingObject.iValue.addDependenciesToAllProperties(callExpression)
                        if(callCommand.originatingObject.jsValue != null && callCommand.originatingObject.jsValue.length !== null
                        && callCommand.originatingObject.jsValue.length.jsValue != null)
                        {
                            var lengthProperty = callCommand.originatingObject.iValue.getProperty("length");

                            globalObject.internalExecutor.dependencyCreator.createDataDependency
                            (
                                callExpression,
                                lengthProperty.lastModificationPosition.codeConstruct,
                                globalObject.getPreciseEvaluationPositionId()
                            )
                        }
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
                break;
                    break;
                default:
                    fcModel.Array.notifyError("Unknown internal array method: " + functionObjectValue.name);
            }
        }
        catch(e) { fcModel.Array.notifyError("Error when executing internal array method: " + e + e.fileName + e.lineNumber); }
    },

    _generateCallbackArguments: function(thisObject, callbackParams, functionName, callArgs, callExpression)
    {
        if(functionName == "sort") { return this._generateSortCallbackArguments(thisObject, callbackParams); }
        if(functionName == "reduce") { return this._generateReduceCallbackArguments(thisObject, callbackParams, callArgs, callExpression);}
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

    _generateReduceCallbackArguments: function(thisObject, callbackParams, callArgs, callExpression)
    {
        var callbackArguments = [];
        var hasInitialValue = callArgs[1] != null;
        var thisObjectValue = thisObject.jsValue;

        var length = thisObjectValue.length;
        for(var i = hasInitialValue ? 0 : 1; i < length; i++)
        {
            callbackArguments.push
            ([
                i == 0 ? callArgs[1] : thisObject.jsValue[i - 1],
                thisObject.jsValue[i],
                thisObject.iValue.globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, i),
                thisObject
            ]);
        }

        return callbackArguments;
    },

    _generateIterateOverAllItemsCallbackArguments: function(thisObject, callbackParams)
    {
        var thisObjectValue = thisObject.jsValue;
        var globalObject = thisObject.iValue.globalObject;
        var callbackArguments = [];

        var length = thisObjectValue.length !== null && thisObjectValue.length.jsValue == null
                   ? thisObjectValue.length
                   : thisObjectValue.length.jsValue;

        for(var i = 0; i < length; i++)
        {
            var item = thisObjectValue[i];
            if(item !== undefined)
            {
                callbackArguments.push([item, globalObject.internalExecutor.createInternalPrimitiveObject(callbackParams[i], i), thisObject]);
            }
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