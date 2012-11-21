FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.GlobalObjectExecutor =
{
    executeInternalFunction: function(fcFunction, arguments, callExpression, globalObject)
    {
        try
        {
                 if (fcFunction.jsValue.name == "eval") { return _handleEval(fcFunction, arguments, callExpression, globalObject); }
            else if (fcFunction.jsValue.name == "addEventListener") { return globalObject.addEventListener(arguments, callExpression, globalObject); }
            else if (fcFunction.jsValue.name == "removeEventListener") { return globalObject.removeEventListener(arguments, callExpression, globalObject); }
            else if (fcFunction.jsValue.name == "setTimeout" || fcFunction.jsValue.name == "setInterval") { return this._setTimingEvents(fcFunction.jsValue.name, arguments[0], arguments[1].jsValue, arguments.slice(2), globalObject, callExpression); }
            else if (fcFunction.jsValue.name == "clearTimeout" || fcFunction.jsValue.name == "clearInterval") { return this._clearTimingEvents(fcFunction.jsValue.name, arguments[0].jsValue, globalObject, callExpression); }
            else if (fcFunction.jsValue.name == "getComputedStyle") { return this._getComputedStyle(arguments[0], arguments.map(function(argument) { return argument.jsValue; }), globalObject, callExpression) }
            else if (globalObject.internalExecutor.isInternalConstructor(fcFunction))
            {
                return globalObject.internalExecutor.executeInternalConstructor(callExpression, fcFunction, arguments);
            }
            else
            {
                fcModel.GlobalObject.notifyError("Unhandled internal function: " + e);
            }

            var result = globalObject.origWindow[fcFunction.jsValue.name].apply(globalObject.origWindow, arguments.map(function(argument) { return argument.jsValue; }));

            return new fcModel.fcValue(result, result, callExpression);
        }
        catch(e)
        {
            fcModel.GlobalObject.notifyError("Error when executing global object function internal function: " + e);
        }
    },

    _getComputedStyle: function(jsHtmlElement, args, globalObject, callExpression)
    {
        if(!(jsHtmlElement.jsValue instanceof HTMLElement)) { this.notifyError("Wrong argument when getting computed style"); return; }

        var htmlElement = jsHtmlElement.jsValue;
        var computedStyle = globalObject.origWindow.getComputedStyle.apply(globalObject.origWindow, args);

        return fcModel.CSSStyleDeclaration.createStyleDeclaration(htmlElement, computedStyle, globalObject, callExpression);
    },

    _setTimingEvents: function(functionName, handler, timePeriod, sentArguments, globalObject, callExpression)
    {
        var timeoutId = setTimeout(function(){});

        var timingEventArguments = [timeoutId, handler, timePeriod, sentArguments, { codeConstruct:callExpression, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()}];

        if(functionName == "setTimeout") { globalObject.registerTimeout.apply(globalObject, timingEventArguments); }
        else if(functionName == "setInterval") { globalObject.registerInterval.apply(globalObject, timingEventArguments); }

        return new fcModel.fcValue(timeoutId, null, null);
    },

    _clearTimingEvents: function(functionName, timerId, globalObject, callExpression)
    {
        if(functionName == "clearTimeout") { globalObject.unregisterTimeout(arguments[0] != null ? timerId : null, callExpression); }
        else { globalObject.unregisterInterval(arguments[0] != null ? timerId : null, callExpression); }

        return new fcModel.fcValue(undefined, undefined, null);
    },

    _handleEval: function(fcFunction, arguments, callExpression, globalObject)
    {
        fcModel.GlobalObject.notifyError("Not handling eval function!");

        return new fcModel.fcValue(null, null, callExpression);
    },

    executesFunction: function(globalObject, functionName)
    {
        return globalObject.origWindow[functionName] != null && ValueTypeHelper.isFunction(globalObject.origWindow[functionName]);
    }
};
/*************************************************************************************/
}});