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
        fcModel.Object.prototype.addDependencyToAllModifications.call
        (
            {
                htmlElement:htmlElement,
                globalObject:globalObject,
                dependencyCreator: globalObject.dependencyCreator
            },
            codeConstruct,
            htmlElement.elementModificationPoints
        );

        var childNodes = htmlElement.childNodes;

        for(var i = 0, length = childNodes.length; i < length; i++)
        {
            this.addDependenciesToAllDescendantsModifications(childNodes[i], codeConstruct, globalObject);
        }
    },

    executeInternalMethod: function(thisObject, functionObject, args, callExpression)
    {
        if(!functionObject.isInternalFunction) { fcModel.HtmlElement.notifyError("The function should be internal when executing html method!"); return; }

        var functionObjectValue = functionObject.jsValue;
        var thisObjectValue = thisObject.jsValue;
        var functionName = functionObjectValue.name;
        var fcThisValue =  thisObject.iValue;
        var globalObject = fcThisValue.globalObject;
        var jsArguments =  globalObject.getJsValues(args)

        switch(functionName)
        {
            case "getElementsByTagName":
            case "getElementsByClassName":
            case "querySelectorAll":
                return this._getElements(functionName, globalObject, args[0].jsValue, thisObjectValue, jsArguments, callExpression);
            case "getAttribute":
                return this._getAttribute(functionName, thisObjectValue, jsArguments, globalObject, callExpression);
            case "getAttributeNode":
                return this._getAttributeNode(functionName, thisObjectValue, jsArguments, globalObject, callExpression);
            case "setAttribute":
            case "removeAttribute":
                return this._modifyAttribute(functionName, thisObjectValue, jsArguments, globalObject, callExpression);
            case "appendChild":
            case "removeChild":
            case "insertBefore":
            case "replaceChild":
                return this._modifyDOM(functionName, thisObjectValue, args, jsArguments, globalObject, callExpression);
            case "cloneNode":
                return this._cloneNode(functionName, thisObjectValue, jsArguments, globalObject, callExpression);
            case "addEventListener":
                this._registerEventHandler(fcThisValue, jsArguments, args[1], globalObject, callExpression);
            case "removeEventListener":
                this._removeEventHandler(thisObjectValue, globalObject, callExpression);
                return globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, undefined);
            case "matchesSelector":
            case "mozMatchesSelector":
            case "webkitMatchesSelector":
                globalObject.browser.logDomQueried(functionName, args[0].jsValue, callExpression);
            case "compareDocumentPosition":
            case "contains":
                return this._queryDocument(functionName, thisObjectValue, jsArguments, globalObject, callExpression);
            case "getBoundingClientRect":
                return this._getBoundingClientRectangle(functionName, thisObjectValue, jsArguments, globalObject, callExpression);
            case "getContext":
                if(ValueTypeHelper.isCanvasElement(thisObjectValue))
                {
                    return fcModel.CanvasExecutor.executeCanvasMethod(thisObject, functionObject, args, callExpression);
                }
            case "click":
            case "reset":
                if(thisObjectValue[functionName] != null)
                {
                    try{thisObjectValue[functionName]();}catch(e){}
                    thisObjectValue.elementModificationPoints.push({ codeConstruct: callExpression, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()});
                    fcModel.HtmlElementExecutor.addDependencyIfImportantElement(thisObjectValue, globalObject, callExpression);
                }
                break;
                break;
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
            if(item == null) { return new fcModel.fcValue(item, item, codeConstruct); }

            if(ValueTypeHelper.isHtmlElement(item) || ValueTypeHelper.isDocumentFragment(item) || ValueTypeHelper.isImageElement(item))
            {
                var fcHtmlElement = globalObject.document.htmlElementToFcMapping[item.fcHtmlElementId];

                if(fcHtmlElement == null) { fcHtmlElement = new fcModel.HtmlElement(item, globalObject, codeConstruct); }

                if(ValueTypeHelper.isImageElement(item))
                {
                    fcHtmlElement.addProperty("__proto__", globalObject.fcHtmlImagePrototype);
                }
                else if (ValueTypeHelper.isCanvasElement(item))
                {
                    fcHtmlElement.addProperty("__proto__", globalObject.fcCanvasPrototype);
                }

                return new fcModel.fcValue(item, fcHtmlElement, codeConstruct);
            }
            else if (ValueTypeHelper.isTextNode(item))
            {
                return new fcModel.fcValue(item, new fcModel.TextNode(item, globalObject, codeConstruct), codeConstruct);
            }
            else if (ValueTypeHelper.isDocument(item))
            {
                return globalObject.jsFcDocument;
            }
            else
            {
                debugger;
                fcModel.HtmlElement.notifyError("HtmlElementExecutor - when wrapping should not be here: " + item);
            }
        }
        catch(e)
        {
            debugger;
            fcModel.HtmlElement.notifyError("HtmlElementExecutor - error when wrapping: " + e);
        }
    },

    addDependencies: function(element, codeConstruct, globalObject)
    {
        try
        {
            if(element == null) { return; }

            if(ValueTypeHelper.isArray(element))
            {
                for(var i = 0; i < element.length; i++)
                {
                    this.addDependencies(element[i], codeConstruct, globalObject);
                }

                return;
            }

            var evaluationPositionId = globalObject.getPreciseEvaluationPositionId();

            if(element.modelElement != null)
            {
                globalObject.dependencyCreator.createDataDependency(codeConstruct, element.modelElement, evaluationPositionId);
            }

            if (element.creationPoint != null)
            {
                globalObject.dependencyCreator.createDataDependency
                (
                    codeConstruct,
                    element.creationPoint.codeConstruct,
                    evaluationPositionId,
                    element.creationPoint.evaluationPositionId
                );
            }

            if(element.domInsertionPoint != null)
            {
                globalObject.dependencyCreator.createDataDependency
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

                    globalObject.dependencyCreator.createDataDependency
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
                    isDomStringException: true
                }
            );
        }

        for(var i = 0, length = elements.length; i < length; i++)
        {
            this.addDependencies(elements[i], callExpression, globalObject);
        }

        var wrappedArray = this.wrapToFcElements(elements, globalObject, callExpression);

        wrappedArray.iValue.markAsNodeList();

        return wrappedArray;
    },

    _getAttribute: function(functionName, thisObjectValue, jsArguments, globalObject, callExpression)
    {
        var result = thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
        this.addDependencies(thisObjectValue, callExpression, globalObject);

        return globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, result);
    },

    _getAttributeNode: function(functionName, thisObjectValue, jsArguments, globalObject, callExpression)
    {
        try
        {
           var attribute = thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
        }
        catch(e) { console.log("Exception when getAttributeNode - probably irrelevant"); }

        if(attribute == null) { return globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, null); }

        this.addDependencies(thisObjectValue, callExpression, globalObject);

        return fcModel.Attr.wrapAttribute(attribute, globalObject, callExpression);

    },

    _modifyAttribute: function(functionName, thisObjectValue, jsArguments, globalObject, callExpression)
    {
        thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
        thisObjectValue.elementModificationPoints.push({ codeConstruct: callExpression, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()});
        fcModel.HtmlElementExecutor.addDependencyIfImportantElement(thisObjectValue, globalObject, callExpression);

        return globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, undefined);
    },

    _modifyDOM: function(functionName, thisObjectValue, args, jsArguments, globalObject, callExpression)
    {
        thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
        thisObjectValue.elementModificationPoints.push({ codeConstruct: callExpression, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()});
        fcModel.HtmlElementExecutor.addDependencyIfImportantElement(thisObjectValue, globalObject, callExpression);
        for(var i = 0; i < args.length; i++)
        {
            var manipulatedElement = args[i].iValue;

            if(manipulatedElement != null && !manipulatedElement.isComment) //Because of comments
            {
                try
                {
                    manipulatedElement.notifyElementInsertedIntoDom(callExpression);
                }
                catch(e) { debugger;}

            }
        }

        if(functionName == "replaceChild") { return args[args.length - 1]; }

        return args[0];
    },

    _cloneNode: function(functionName, thisObjectValue, jsArguments, globalObject, callExpression)
    {
        this.addDependenciesToAllDescendantsModifications(thisObjectValue, callExpression, globalObject);

        var clonedNode = thisObjectValue[functionName].apply(thisObjectValue, jsArguments,
        {
            codeConstruct: callExpression,
            evaluationPositionId: globalObject.getPreciseEvaluationPositionId()
        });

        this._copyModelElements(thisObjectValue, clonedNode);

        return this.wrapToFcElement(clonedNode, globalObject, callExpression);
    },

    _copyModelElements: function(originalElement, clonedElement, creationPoint)
    {
        clonedElement.modelElement = originalElement.modelElement;
        clonedElement.creationPoint = creationPoint;

        for(var i = 0; i < originalElement.childNodes.length; i++)
        {
            this._copyModelElements(originalElement.childNodes[i], clonedElement.childNodes[i], creationPoint);
        }
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
                    isDomStringException: true
                }
            );
        }

        return globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, result);
    },

    _getBoundingClientRectangle: function(functionName, thisObjectValue, jsArguments, globalObject, callExpression)
    {
        try
        {
            var result = thisObjectValue[functionName].apply(thisObjectValue, jsArguments);

            var nativeObj =
            {
                bottom: globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, result.bottom),
                top: globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, result.top),
                left: globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, result.left),
                right: globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, result.right),
                height: globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, result.height),
                width: globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, result.width)
            };

            var fcObj = fcModel.Object.createObjectWithInit(globalObject, callExpression, nativeObj);

            fcObj.addProperty("bottom", nativeObj.bottom, callExpression);
            fcObj.addProperty("top", nativeObj.top, callExpression);
            fcObj.addProperty("left", nativeObj.left, callExpression);
            fcObj.addProperty("right", nativeObj.right, callExpression);
            fcObj.addProperty("height", nativeObj.height, callExpression);
            fcObj.addProperty("width", nativeObj.width, callExpression);

            return new fcModel.fcValue(nativeObj, fcObj, callExpression);
        }
        catch(e) { fcModel.HtmlElement.notifyError("Error when adding dependencies: " + e); }

        return new fcModel.fcValue(undefined, null, callExpression);
    },

    notifyError: function(message) { alert("HtmlElementExecutor - " + message); }
}
/*************************************************************************************/
}});