FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;

fcModel.DocumentExecutor =
{
    executeInternalMethod: function(thisObject, functionObject, arguments, callExpression)
    {
        if(!functionObject.fcInternal.isInternalFunction) { this.notifyError("The function should be internal when executing document method!"); return; }

        var functionObjectValue = functionObject.value;
        var thisObjectValue = thisObject.value;
        var functionName = functionObjectValue.name;
        var fcThisValue =  thisObject.fcInternal.object;
        var globalObject = fcThisValue.globalObject;

        if (functionName == "createElement") { return globalObject.internalExecutor.createHtmlElement(callExpression, arguments[0].value); }
        else if (functionName == "createTextNode") { return globalObject.internalExecutor.createTextNode(callExpression, arguments[0].value);}
        else if (functionName == "addEventListener") { return globalObject.document.addEventListener(arguments, callExpression, globalObject); }
        else if (functionName == "removeEventListener") { return globalObject.document.removeEventListener(arguments, callExpression, globalObject); }
        else if (functionName == "createDocumentFragment") { return globalObject.internalExecutor.createDocumentFragment(callExpression, globalObject); }
        else if (functionName == "createComment") { return new fcModel.JsValue(globalObject.origDocument.createComment(""), new fcModel.FcInternal(callExpression))}
        else if (functionName == "getElementsByTagName" || functionName == "querySelectorAll" || functionName == "getElementsByClassName")
        {
            var selector = arguments[0].value;

            globalObject.browser.logDomQueried(functionName, selector, callExpression);

            if(functionName == "getElementsByClassName") { selector = "." + selector; }
            var elements = [];
            try
            {
                elements = thisObjectValue.querySelectorAll(selector);
            }
            catch(e)
            {
                globalObject.executionContextStack.callExceptionCallbacks
                    (
                        {
                            exceptionGeneratingConstruct: callExpression,
                            isMatchesSelectorException: true
                        }
                    );
            }

            for(var i = 0, length = elements.length; i < length; i++)
            {
                fcModel.HtmlElementExecutor.addDependencies(elements[i], callExpression, globalObject);
            }

            return fcModel.HtmlElementExecutor.wrapToFcElements(elements, globalObject, callExpression);
        }
        else if(functionName == "getElementById" || functionName == "querySelector")
        {
            var selector = arguments[0].value;

            globalObject.browser.logDomQueried(functionName, selector, callExpression);

            if(functionName == "getElementById") { selector = "#" + selector; }

            var element = null;
            try
            {
                element = thisObjectValue.querySelector(selector);
            }
            catch(e)
            {
                globalObject.executionContextStack.callExceptionCallbacks
                    (
                        {
                            exceptionGeneratingConstruct: callExpression,
                            isMatchesSelectorException: true
                        }
                    );
            }

            if(element == null) { return new fcModel.JsValue(null, new fcModel.FcInternal(callExpression)); }

            fcModel.HtmlElementExecutor.addDependencies(element, callExpression, globalObject);

            return fcModel.HtmlElementExecutor.wrapToFcElement(element, globalObject, callExpression);
        }

        this.notifyError("Unknown document method: " +  functionName);

        return null;
    },

    notifyError: function(message) { alert("DocumentExecutor - " + message);}
};
/**************************************************************************************/
}});