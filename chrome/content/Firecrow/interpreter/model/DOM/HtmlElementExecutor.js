FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.HtmlElementExecutor =
{
    addDependencyIfImportantElement: function(htmlElement, globalObject, codeConstruct)
    {
        if(globalObject.satisfiesDomSlicingCriteria(htmlElement))
        {
            globalObject.browser.callImportantConstructReachedCallbacks(codeConstruct);
        }
    },

    addDependenciesToAllDescendantsModifications: function(htmlElement, codeConstruct, globalObject)
    {
        fcModel.Object.prototype.addDependencyToAllModifications.call({htmlElement:htmlElement, globalObject:globalObject}, codeConstruct, htmlElement.elementModificationPoints);

        var childNodes = htmlElement.childNodes;

        for(var i = 0, length = childNodes.length; i < length; i++)
        {
            this.addDependenciesToAllDescendantsModifications(childNodes[i], codeConstruct, globalObject);
        }
    },

    executeInternalMethod: function(thisObject, functionObject, arguments, callExpression)
    {
        if(!functionObject.fcInternal.isInternalFunction) { fcModel.HtmlElement.notifyError("The function should be internal when executing html method!"); return; }

        var functionObjectValue = functionObject.value;
        var thisObjectValue = thisObject.value;
        var functionName = functionObjectValue.name;
        var fcThisValue =  thisObject.fcInternal.object;
        var globalObject = fcThisValue.globalObject;
        var jsArguments =  arguments.map(function(argument){ return argument.value;});

        switch(functionName)
        {
            case "getElementsByTagName":
            case "getElementsByClassName":
            case "querySelectorAll":
                return this._getElements(functionName, globalObject, arguments[0].value, thisObjectValue, jsArguments, callExpression);
            case "getAttribute":
                return this._getAttribute(functionName, thisObjectValue, jsArguments, globalObject, callExpression);
            case "setAttribute":
            case "removeAttribute":
                return this._modifyAttribute(functionName, thisObjectValue, jsArguments, globalObject, callExpression);
            case "appendChild":
            case "removeChild":
            case "insertBefore":
                return this._modifyDOM(functionName, thisObjectValue, arguments, jsArguments, globalObject, callExpression);
            case "cloneNode":
                return this._cloneNode(functionName, thisObjectValue, jsArguments, globalObject, callExpression);
            case "addEventListener":
                this._registerEventHandler(fcThisValue, jsArguments, arguments[1], globalObject, callExpression);
            case "removeEventListener":
                this._removeEventHandler(thisObjectValue, globalObject, callExpression);
                return new fcModel.JsValue(undefined, new fcModel.FcInternal(callExpression));
            case "matchesSelector":
            case "mozMatchesSelector":
            case "webkitMatchesSelector":
                globalObject.browser.logDomQueried(functionName, arguments[0].value, callExpression);
            case "compareDocumentPosition":
            case "contains":
                return this._queryDocument(functionName, thisObjectValue, jsArguments, globalObject, callExpression);
            case "getBoundingClientRect":
                return this._getBoundingClientRectangle(functionName, thisObjectValue, jsArguments, globalObject, callExpression);
            default:
                fcModel.HtmlElement.notifyError("Unhandled internal method:" + functionName); return;
        }
    },

    wrapToFcElements: function(items, globalObject, codeConstruct)
    {
        try
        {
            var fcItems = [];

            for(var i = 0, length = items.length; i < length; i++)
            {
                var item = items[i];
                fcItems.push(this.wrapToFcElement(item, globalObject, codeConstruct));
            }

            return globalObject.internalExecutor.createArray(codeConstruct, fcItems);
        }
        catch(e)
        {
            fcModel.HtmlElement.notifyError("HtmlElementExecutor - error when wrapping: " + e);
        }
    },

    wrapToFcElement: function(item, globalObject, codeConstruct)
    {
        try
        {
            if(item == null) { return new fcModel.JsValue(item, new fcModel.FcInternal(codeConstruct)); }

            if(ValueTypeHelper.isOfType(item, HTMLElement) || ValueTypeHelper.isOfType(item, DocumentFragment))
            {
                var fcHtmlElement = globalObject.document.htmlElementToFcMapping[item.fcHtmlElementId]
                    || new fcModel.HtmlElement(item, globalObject, codeConstruct);

                return new fcModel.JsValue(item, new fcModel.FcInternal(codeConstruct, fcHtmlElement));
            }
            else if (ValueTypeHelper.isOfType(item, Text))
            {
                return new fcModel.JsValue(item, new fcModel.FcInternal(codeConstruct, new fcModel.TextNode(item, globalObject, codeConstruct)));
            }
            else if (ValueTypeHelper.isOfType(item, Document))
            {
                return globalObject.jsFcDocument;
            }
            else
            {
                fcModel.HtmlElement.notifyError("HtmlElementExecutor - when wrapping should not be here: " + globalObject.browser.url);
            }
        }
        catch(e)
        {
            fcModel.HtmlElement.notifyError("HtmlElementExecutor - error when wrapping: " + e);
        }
    },

    addDependencies: function(element, codeConstruct, globalObject)
    {
        try
        {
            var evaluationPositionId = globalObject.getPreciseEvaluationPositionId();

            if(element.modelElement != null)
            {
                globalObject.browser.callDataDependencyEstablishedCallbacks(codeConstruct, element.modelElement, evaluationPositionId);
            }

            if (element.creationPoint != null)
            {
                globalObject.browser.callDataDependencyEstablishedCallbacks
                    (
                        codeConstruct,
                        element.creationPoint.codeConstruct,
                        evaluationPositionId,
                        element.creationPoint.evaluationPositionId
                    );
            }

            if(element.domInsertionPoint != null)
            {
                globalObject.browser.callDataDependencyEstablishedCallbacks
                    (
                        codeConstruct,
                        element.domInsertionPoint.codeConstruct,
                        evaluationPositionId,
                        element.domInsertionPoint.evaluationPositionId
                    );
            }

            if(element.elementModificationPoints != null)
            {
                var elementModificationPoints = element.elementModificationPoints;

                for(var i = 0, length = elementModificationPoints.length; i < length; i++)
                {
                    var elementModificationPoint = elementModificationPoints[i];

                    globalObject.browser.callDataDependencyEstablishedCallbacks
                    (
                        codeConstruct,
                        elementModificationPoint.codeConstruct,
                        evaluationPositionId,
                        elementModificationPoint.evaluationPositionId
                    );
                }
            }
        }
        catch(e) { fcModel.HtmlElement.notifyError("Error when adding dependencies: " + e); }
    },

    _getElements: function(functionName, globalObject, argument, thisObjectValue, jsArguments, callExpression)
    {
        var elements = [];

        try
        {
            globalObject.browser.logDomQueried(functionName, argument, callExpression);
            elements = thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
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
            this.addDependencies(elements[i], callExpression, globalObject);
        }

        return this.wrapToFcElements(elements, globalObject, callExpression);
    },

    _getAttribute: function(functionName, thisObjectValue, jsArguments, globalObject, callExpression)
    {
        var result = thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
        this.addDependencies(thisObjectValue, callExpression, globalObject);
        return new fcModel.JsValue(result, new fcModel.FcInternal(callExpression, null));
    },

    _modifyAttribute: function(functionName, thisObjectValue, jsArguments, globalObject, callExpression)
    {
        thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
        thisObjectValue.elementModificationPoints.push({ codeConstruct: callExpression, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()});
        fcModel.HtmlElementExecutor.addDependencyIfImportantElement(thisObjectValue, globalObject, callExpression);

        return new fcModel.JsValue(undefined, new fcModel.FcInternal(callExpression, null));
    },

    _modifyDOM: function(functionName, thisObjectValue, args, jsArguments, globalObject, callExpression)
    {
        thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
        thisObjectValue.elementModificationPoints.push({ codeConstruct: callExpression, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()});
        fcModel.HtmlElementExecutor.addDependencyIfImportantElement(thisObjectValue, globalObject, callExpression);
        for(var i = 0; i < args.length; i++)
        {
            var manipulatedElement = args[i].fcInternal.object;

            if(manipulatedElement != null) //Because of comments
            {
                manipulatedElement.notifyElementInsertedIntoDom(callExpression);
            }
        }
        return arguments[0];
    },

    _cloneNode: function(functionName, thisObjectValue, jsArguments, globalObject, callExpression)
    {
        this.addDependenciesToAllDescendantsModifications(thisObjectValue, callExpression, globalObject);
        var clonedNode = thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
        return this.wrapToFcElement(clonedNode, globalObject, callExpression);
    },

    _registerEventHandler: function(fcThisValue, jsArguments, handler, globalObject, callExpression)
    {
        globalObject.registerHtmlElementEventHandler
        (
            fcThisValue,
            jsArguments[0],
            handler,
            {
                codeConstruct: callExpression,
                evaluationPositionId: globalObject.getPreciseEvaluationPositionId()
            }
        );
    },

    _removeEventHandler: function(thisObjectValue, globalObject, callExpression)
    {
        fcModel.HtmlElementExecutor.addDependencyIfImportantElement(thisObjectValue, globalObject, callExpression);
        thisObjectValue.elementModificationPoints.push({ codeConstruct: callExpression, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()});
    },

    _queryDocument: function(functionName, thisObjectValue, jsArguments, globalObject, callExpression)
    {
        var result = false;
        try
        {
            result = thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
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

        return new fcModel.JsValue(result, new fcModel.FcInternal(callExpression));
    },

    _getBoundingClientRectangle: function(functionName, thisObjectValue, jsArguments, globalObject, callExpression)
    {
        try
        {
            var result = thisObjectValue[functionName].apply(thisObjectValue, jsArguments);

            var nativeObj =
            {
                bottom: new fcModel.JsValue(result.bottom, new fcModel.FcInternal(callExpression)),
                top: new fcModel.JsValue(result.top, new fcModel.FcInternal(callExpression)),
                left: new fcModel.JsValue(result.left, new fcModel.FcInternal(callExpression)),
                right: new fcModel.JsValue(result.right, new fcModel.FcInternal(callExpression)),
                height: new fcModel.JsValue(result.height, new fcModel.FcInternal(callExpression)),
                width: new fcModel.JsValue(result.width, new fcModel.FcInternal(callExpression))
            };

            var fcObj = fcModel.Object.createObjectWithInit(globalObject, callExpression, nativeObj);

            fcObj.addProperty("bottom", nativeObj.bottom, callExpression);
            fcObj.addProperty("top", nativeObj.top, callExpression);
            fcObj.addProperty("left", nativeObj.left, callExpression);
            fcObj.addProperty("right", nativeObj.right, callExpression);
            fcObj.addProperty("height", nativeObj.height, callExpression);
            fcObj.addProperty("width", nativeObj.width, callExpression);

            return new fcModel.JsValue(nativeObj, new fcModel.FcInternal(callExpression, fcObj));
        }
        catch(e) { fcModel.HtmlElement.notifyError("Error when adding dependencies: " + e); }

        return new fcModel.JsValue(undefined, new fcModel.FcInternal(callExpression));
    },

    notifyError: function(message) { alert("HtmlElementExecutor - " + message); }
}
/*************************************************************************************/
}});