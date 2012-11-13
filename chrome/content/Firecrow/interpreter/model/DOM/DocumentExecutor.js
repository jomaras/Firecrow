FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;

fcModel.DocumentExecutor =
{
    executeInternalMethod: function(thisObject, functionObject, args, callExpression)
    {
        if(!functionObject.fcInternal.isInternalFunction) { this.notifyError("The function should be internal when executing document method!"); return; }

        var functionObjectValue = functionObject.value;
        var thisObjectValue = thisObject.value;
        var functionName = functionObjectValue.name;
        var fcThisValue =  thisObject.fcInternal.object;
        var globalObject = fcThisValue.globalObject;

             if (functionName == "createElement") { return globalObject.internalExecutor.createHtmlElement(callExpression, args[0].value); }
        else if (functionName == "createTextNode") { return globalObject.internalExecutor.createTextNode(callExpression, args[0].value);}
        else if (functionName == "addEventListener") { return globalObject.document.addEventListener(args, callExpression, globalObject); }
        else if (functionName == "removeEventListener") { return globalObject.document.removeEventListener(args, callExpression, globalObject); }
        else if (functionName == "createDocumentFragment") { return globalObject.internalExecutor.createDocumentFragment(callExpression, globalObject); }
        else if (functionName == "createComment") { return new fcModel.JsValue(globalObject.origDocument.createComment(""), new fcModel.FcInternal(callExpression))}
        else if (functionName == "getElementsByTagName" || functionName == "querySelectorAll" || functionName == "getElementsByClassName") { return this.getElements(globalObject, functionName, args[0].value, callExpression);}
        else if (functionName == "getElementById" || functionName == "querySelector") { return this.getElement(globalObject, functionName, args[0].value, callExpression); }

        this.notifyError("Unhandled document method: " +  functionName);

        return null;
    },

    getElements: function(globalObject, queryType, selector, callExpression)
    {
        globalObject.browser.logDomQueried(queryType, selector, callExpression);

        if(queryType == "getElementsByClassName") { selector = "." + selector; }

        var elements = [];
        try
        {
            elements = globalObject.origDocument.querySelectorAll(selector);
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
    },

    getElement: function(globalObject, queryType, selector, callExpression)
    {
        globalObject.browser.logDomQueried(queryType, selector, callExpression);

        if(queryType == "getElementById") { selector = "#" + selector; }

        var element = null;
        try
        {
            element = globalObject.origDocument.querySelector(selector);
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
    },

    notifyError: function(message) { alert("DocumentExecutor - " + message);}
};
/**************************************************************************************/
}});