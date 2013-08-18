FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;

fcModel.DocumentExecutor =
{
    executeInternalMethod: function(thisObject, functionObject, args, callExpression)
    {
        if(!functionObject.isInternalFunction) { this.notifyError("The function should be internal when executing document method!"); return; }

        var functionObjectValue = functionObject.jsValue;
        var thisObjectValue = thisObject.jsValue;
        var functionName = functionObjectValue.name;
        var fcThisValue =  thisObject.iValue;
        var globalObject = fcThisValue.globalObject;

             if (functionName == "createElement") { return globalObject.internalExecutor.createHtmlElement(callExpression, args[0].jsValue); }
        else if (functionName == "createTextNode") { return globalObject.internalExecutor.createTextNode(callExpression, args[0].jsValue);}
        else if (functionName == "addEventListener") { return globalObject.document.addEventListener(args, callExpression, globalObject); }
        else if (functionName == "removeEventListener") { return globalObject.document.removeEventListener(args, callExpression, globalObject); }
        else if (functionName == "createDocumentFragment") { return globalObject.internalExecutor.createDocumentFragment(callExpression, globalObject); }
        else if (functionName == "createComment")
        {
            var fcComment = fcModel.Object.createObjectWithInit(globalObject, callExpression, {});
            fcComment.addProperty("nodeType", globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, 8));
            fcComment.isComment = true;

            return new fcModel.fcValue(globalObject.origDocument.createComment(""), fcComment, callExpression);
        }
        else if (functionName == "getElementsByTagName" || functionName == "querySelectorAll" || functionName == "getElementsByClassName" || functionName == "getElementsByName") { return this.getElements(globalObject, functionName, args[0].jsValue, callExpression, functionName);}
        else if (functionName == "getElementById" || functionName == "querySelector") { return this.getElement(globalObject, functionName, args[0].jsValue, callExpression); }
        else if (functionName == "createAttribute") { return fcModel.Attr.wrapAttribute(globalObject.origDocument.createAttribute(args[0].jsValue), globalObject, callExpression);}

        this.notifyError("Unhandled document method: " +  functionName);

        return null;
    },

    getElements: function(globalObject, queryType, selector, callExpression, functionName)
    {
        globalObject.browser.logDomQueried(queryType, selector, callExpression);

        var elements = [];
        try
        {
            elements = globalObject.origDocument[queryType](selector);
        }
        catch(e)
        {
            globalObject.executionContextStack.callExceptionCallbacks
            (
                {
                    exceptionGeneratingConstruct: callExpression,
                    isDomStringException: true
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

        var element = null;
        try
        {
            element = globalObject.origDocument[queryType](selector);
        }
        catch(e)
        {
            globalObject.executionContextStack.callExceptionCallbacks
            (
                {
                    exceptionGeneratingConstruct: callExpression,
                    isDomStringException: true
                }
            );
        }

        if(element == null) { return new fcModel.fcValue(null, null, callExpression); }

        fcModel.HtmlElementExecutor.addDependencies(element, callExpression, globalObject);

        return fcModel.HtmlElementExecutor.wrapToFcElement(element, globalObject, callExpression);
    },

    notifyError: function(message) { debugger; alert("DocumentExecutor - " + message);}
};
/**************************************************************************************/
}});