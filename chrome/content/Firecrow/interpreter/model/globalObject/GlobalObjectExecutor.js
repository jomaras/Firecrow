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
                 if (fcFunction.value.name == "eval") { return _handleEval(fcFunction, arguments, callExpression, globalObject); }
            else if (fcFunction.value.name == "addEventListener") { return globalObject.addEventListener(arguments, callExpression, globalObject); }
            else if (fcFunction.value.name == "removeEventListener") { return globalObject.removeEventListener(arguments, callExpression, globalObject); }
            else if (fcFunction.value.name == "setTimeout" || fcFunction.value.name == "setInterval") { return this._setTimingEvents(fcFunction.value.name, arguments[0], arguments[1].value, arguments.slice(2), globalObject, callExpression); }
            else if (fcFunction.value.name == "clearTimeout" || fcFunction.value.name == "clearInterval") { return this._clearTimingEvents(fcFunction.value.name, arguments[0].value, globalObject, callExpression); }
            else if (fcFunction.value.name == "getComputedStyle") { return this._getComputedStyle(arguments[0], arguments.map(function(argument) { return argument.value; }), globalObject, callExpression) }

            return new fcModel.JsValue
            (
                globalObject.origWindow[fcFunction.value.name].apply(globalObject.origWindow, arguments.map(function(argument) { return argument.value; })),
                new fcModel.FcInternal(callExpression, null)
            );
        }
        catch(e)
        {
            fcModel.GlobalObject.notifyError("Error when executing global object function internal function: " + e);
        }
    },

    _getComputedStyle: function(jsHtmlElement, args, globalObject, callExpression)
    {
        if(!(jsHtmlElement.value instanceof HTMLElement)) { this.notifyError("Wrong argument when getting computed style"); return; }

        var htmlElement = jsHtmlElement.value;
        var computedStyle = globalObject.origWindow.getComputedStyle.apply(globalObject.origWindow, args);

        return fcModel.CSSStyleDeclaration.createStyleDeclaration(htmlElement, computedStyle, globalObject, callExpression);
    },

    _setTimingEvents: function(functionName, handler, timePeriod, sentArguments, globalObject, callExpression)
    {
        var timeoutId = setTimeout(function(){});

        var timingEventArguments = [timeoutId, handler, timePeriod, sentArguments, { codeConstruct:callExpression, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()}];

        if(functionName == "setTimeout") { globalObject.registerTimeout.apply(globalObject, timingEventArguments); }
        else if(functionName == "setInterval") { globalObject.registerInterval.apply(globalObject, timingEventArguments); }

        return new fcModel.JsValue(timeoutId, new fcModel.FcInternal());
    },

    _clearTimingEvents: function(functionName, timerId, globalObject, callExpression)
    {
        if(functionName == "clearTimeout") { globalObject.unregisterTimeout(arguments[0] != null ? timerId : null, callExpression); }
        else { globalObject.unregisterInterval(arguments[0] != null ? timerId : null, callExpression); }

        return new fcModel.JsValue(undefined, new fcModel.FcInternal());
    },

    _handleEval: function(fcFunction, arguments, callExpression, globalObject)
    {
        fcModel.GlobalObject.notifyError("Not handling eval function!");

        return new fcModel.JsValue(null, new fcModel.FcInternal(callExpression));
    },

    executesFunction: function(globalObject, functionName)
    {
        return globalObject.origWindow[functionName] != null && ValueTypeHelper.isFunction(globalObject.origWindow[functionName]);
    }
};
/*************************************************************************************/
}});