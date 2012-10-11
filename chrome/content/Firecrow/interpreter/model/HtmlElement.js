/**
 * User: Jomaras
 * Date: 05.06.12.
 * Time: 08:19
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.HtmlElement = function(htmlElement, globalObject, codeConstruct)
{
    try
    {
        if(!ValueTypeHelper.isOfType(htmlElement, HTMLElement) && !ValueTypeHelper.isOfType(htmlElement, DocumentFragment))
        {
            fcModel.HtmlElement.notifyError("When creating HTMLElement the htmlElement must be of type HTMLElement or DocumentFragment: " + (typeof htmlElement));
            return;
        }

        this.proto = new fcModel.Object(this.globalObject);
        this.__proto__ = this.proto;
        this.constructor = fcModel.HtmlElement;
        this.creationConstruct = codeConstruct;

        for(var prop in fcModel.HtmlElementProto)
        {
            this[prop] = fcModel.HtmlElementProto[prop];
        }

        this.globalObject = globalObject;
        this.htmlElement = htmlElement;

        if(htmlElement != null)
        {
            htmlElement.fcHtmlElementId = this.id;
            this .globalObject.document.htmlElementToFcMapping[this.id] = this;

            fcModel.DOM_PROPERTIES.setPrimitives(this, this.htmlElement, fcModel.DOM_PROPERTIES.NODE.PRIMITIVES);
            fcModel.DOM_PROPERTIES.setPrimitives(this, this.htmlElement, fcModel.DOM_PROPERTIES.ELEMENT.PRIMITIVES);

            this.addProperty("ownerDocument", this.globalObject.jsFcDocument, codeConstruct);
        }

        this.htmlElement.elementModificationPoints = [];

        this.addMethods(codeConstruct);

        this.registerGetPropertyCallback(function(getPropertyConstruct, propertyName)
        {
            var evaluationPositionId = this.globalObject.getPreciseEvaluationPositionId();

            this.addDependenciesToAllModifications(getPropertyConstruct);

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(getPropertyConstruct, this.htmlElement.modelElement, evaluationPositionId);

            if(fcModel.DOM_PROPERTIES.ELEMENT.ELEMENTS.indexOf(propertyName) != -1
            || fcModel.DOM_PROPERTIES.NODE.ELEMENTS.indexOf(propertyName) != -1)
            {
                var descendents = this.htmlElement[propertyName];

                for(var i = 0; i < descendents.length; i++)
                {
                    var descendant = descendents[i];

                    if(descendant == null) { continue; }

                    this.globalObject.browser.callDataDependencyEstablishedCallbacks
                    (
                        getPropertyConstruct,
                        descendant.modelElement,
                        evaluationPositionId
                    );
                }
            }
            else if (fcModel.DOM_PROPERTIES.ELEMENT.ELEMENT.indexOf(propertyName) != -1
                  || fcModel.DOM_PROPERTIES.NODE.ELEMENT.indexOf(propertyName) != -1)
            {
                var element = this.htmlElement[propertyName];

                if(element == null) { return}

                this.globalObject.browser.callDataDependencyEstablishedCallbacks
                (
                    getPropertyConstruct,
                    element.modelElement,
                    evaluationPositionId
                );
            }
        }, this);
    }
    catch(e)
    {
        fcModel.HtmlElement.notifyError("Error when creating HTML node: " + e);
    }
};
fcModel.HtmlElement.accessedProperties = {};

fcModel.HtmlElement.notifyError = function(message) { alert("HtmlElement - " + message); }

fcModel.HtmlElement.prototype = new fcModel.Object(null);

fcModel.HtmlElementProto =
{
    addDependenciesToAllModifications: function(codeConstruct)
    {
        try
        {
            if(codeConstruct == null) { return; }

            var modifications = this.htmlElement.elementModificationPoints;

            if(modifications == null || modifications.length == 0) { return; }

            var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

            for(var i = 0, length = modifications.length; i < length; i++)
            {
                var modification = modifications[i];

                this.globalObject.browser.callDataDependencyEstablishedCallbacks
                (
                    codeConstruct,
                    modification.codeConstruct,
                    evaluationPosition,
                    modification.evaluationPositionId
                );
            }
        }
        catch(e)
        {
            this.notifyError("Error when adding dependencies to all modifications " + e);
        }
    },

    getElements: function(propertyName, codeConstruct)
    {
        var array = [];
        var items = this.htmlElement[propertyName];

        if(items == null) { return array; }

        for(var i = 0, length = items.length; i < length; i++)
        {
            array.push(fcModel.HtmlElementExecutor.wrapToFcElement(items[i], this.globalObject, codeConstruct));
        }

        return array;
    },

    getChildNodes: function(codeConstruct)
    {
        var childNodeList = [];
        try
        {
            for(var i = 0, childNodes = this.htmlElement.childNodes, length = childNodes.length; i < length; i++)
            {
                var childNode = childNodes[i];
                childNodeList.push
                (
                    new fcModel.JsValue
                    (
                        childNode,
                        new fcModel.FcInternal
                        (
                            codeConstruct,
                            ValueTypeHelper.isOfType(childNode, HTMLElement) || ValueTypeHelper.isOfType(childNode, DocumentFragment)
                                                                             ?  new fcModel.HtmlElement(childNode, this.globalObject, codeConstruct)
                                                                             :  new fcModel.TextNode(childNode, this.globalObject, codeConstruct)
                        )
                    )
                )
            }
        }
        catch(e) { fcModel.HtmlElement.notifyError("Error when getting child nodes:" + e); }

        return childNodeList;
    },

    getChildren: function(childNodes)
    {
        var children = [];
        try
        {
           for(var i = 0, length = childNodes.length; i < length; i++)
           {
               var child = childNodes[i];

               if(ValueTypeHelper.isOfType(child.value, HTMLElement)
               || ValueTypeHelper.isOfType(child.value, DocumentFragment))
               {
                   children.push(child);
               }
           }
        }
        catch(e) { fcModel.HtmlElement.notifyError("Error when getting children from child nodes: " + e); }

        return children;
    },

    getJsPropertyValue: function(propertyName, codeConstruct)
    {
        fcModel.HtmlElement.accessedProperties[propertyName] = true;
        //TODO - it is a bad idea to create objects on each access, maybe utilize DOM level2 events
        //So that they are only created on attribute changed, or DOM modified!?

        if(this.isMethod(propertyName))
        {
            return this.getPropertyValue(propertyName, codeConstruct);
        }

        if(fcModel.DOM_PROPERTIES.ELEMENT.OTHER.indexOf(propertyName) != -1
        || fcModel.DOM_PROPERTIES.NODE.OTHER.indexOf(propertyName) != -1)
        {
            if(propertyName == "ownerDocument")
            {
                return this.getPropertyValue(propertyName, codeConstruct);
            }
            else if(propertyName == "attributes")
            {
                this.addProperty(propertyName, fcModel.Attr.createAttributeList(this.htmlElement, this.globalObject, codeConstruct), this.creationConstruct);
            }
            else if(propertyName == "style")
            {
                this.addProperty(propertyName, fcModel.CSSStyleDeclaration.createStyleDeclaration(this.htmlElement, this.htmlElement.style, this.globalObject, this.creationConstruct), this.creationConstruct);
            }
        }

        if(fcModel.DOM_PROPERTIES.NODE.ELEMENTS.indexOf(propertyName) != -1
        || fcModel.DOM_PROPERTIES.ELEMENT.ELEMENTS.indexOf(propertyName) != -1)
        {
            this.addProperty(propertyName, this.globalObject.internalExecutor.createArray(codeConstruct, this.getElements(propertyName, codeConstruct)), this.creationConstruct);
        }

        if(fcModel.DOM_PROPERTIES.NODE.ELEMENT.indexOf(propertyName) != -1
        || fcModel.DOM_PROPERTIES.ELEMENT.ELEMENT.indexOf(propertyName) != -1
        || (this.htmlElement instanceof HTMLFormElement && this.htmlElement[propertyName] instanceof Element))
        {
            this.addProperty(propertyName, fcModel.HtmlElementExecutor.wrapToFcElement(this.htmlElement[propertyName], this.globalObject, this.creationConstruct), this.creationConstruct);
        }

        if(fcModel.DOM_PROPERTIES.NODE.PRIMITIVES.indexOf(propertyName) != -1
        || fcModel.DOM_PROPERTIES.ELEMENT.PRIMITIVES.indexOf(propertyName) != -1)
        {
            this.addProperty(propertyName, new fcModel.JsValue(this.htmlElement[propertyName], new fcModel.FcInternal(this.creationConstruct)), this.creationConstruct);
        }

        return this.getPropertyValue(propertyName, codeConstruct);
    },

    addJsProperty: function(propertyName, propertyValue, codeConstruct, isEnumerable)
    {
        try
        {
            fcModel.HtmlElement.accessedProperties[propertyName] = "writes";

            if(fcModel.DOM_PROPERTIES.ELEMENT.EVENT_PROPERTIES.indexOf(propertyName) != -1)
            {
                this.globalObject.registerHtmlElementEventHandler
                (
                    this,
                    propertyName,
                    propertyValue,
                    {
                        codeConstruct: codeConstruct,
                        evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()
                    }
                );
            }

            this.htmlElement[propertyName] = propertyValue.value;

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(this.htmlElement.modelElement, codeConstruct, this.globalObject.getPreciseEvaluationPositionId());
            fcModel.HtmlElementExecutor.addDependencyIfImportantElement(this.htmlElement, this.globalObject, codeConstruct);

            this.htmlElement.elementModificationPoints.push({ codeConstruct: codeConstruct, evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()});

            if(propertyName == "className" || propertyName == "id")
            {
                this.globalObject.browser.createDependenciesBetweenHtmlNodeAndCssNodes(this.htmlElement.modelElement);

                if(propertyName == "id")
                {
                    if(this.htmlElement.modelElement.dynamicIds == null) { this.htmlElement.modelElement.dynamicIds = []; }
                    this.htmlElement.modelElement.dynamicIds.push({name:'id', value: propertyValue.value, setConstruct: codeConstruct});
                }
                else
                {
                    if(this.htmlElement.modelElement.dynamicClasses == null) { this.htmlElement.modelElement.dynamicClasses = []; }
                    this.htmlElement.modelElement.dynamicClasses.push({name:'class', value: propertyValue.value, setConstruct: codeConstruct});
                }
            }
            else if(propertyName == "innerHTML")
            {
                this._createModelsForDynamicChildNodes(this.htmlElement, codeConstruct);
            }

            this.addProperty(propertyName, propertyValue, codeConstruct, isEnumerable);
        }
        catch(e) { fcModel.HtmlElement.notifyError("Error when adding property: " + e);}
    },

    _createModelsForDynamicChildNodes: function(htmlElement, codeConstruct)
    {
        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

        for(var i = 0; i < htmlElement.childNodes.length; i++)
        {
            var childNode = htmlElement.childNodes[i];

            childNode.creationPoint =
            {
                codeConstruct: codeConstruct,
                evaluationPositionId: evaluationPosition
            };

            childNode.modelElement = { type: "DummyCodeElement", domElement: childNode };
            this.globalObject.browser.callNodeCreatedCallbacks(childNode.modelElement, "html", true);

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(htmlElement.modelElement, childNode.modelElement, evaluationPosition);
            this.globalObject.browser.callDataDependencyEstablishedCallbacks(childNode.modelElement, codeConstruct, evaluationPosition);

            if(childNode.id != null && childNode.id != "")
            {
                childNode.modelElement.dynamicIds = [{name:'id', value: childNode.id, setConstruct: codeConstruct}];
            }

            if(childNode.className != null && childNode.className != "")
            {
                childNode.modelElement.dynamicClasses = [{name:'class', value: childNode.className, setConstruct: codeConstruct}];
            }

            this.globalObject.browser.createDependenciesBetweenHtmlNodeAndCssNodes(childNode.modelElement);
            this._createModelsForDynamicChildNodes(childNode, codeConstruct);
        }
    },

    addMethods: function(codeConstruct)
    {
        try
        {
            var methods = fcModel.HtmlElement.CONST.INTERNAL_PROPERTIES.METHODS;

            for(var i = 0, length = methods.length; i < length; i++)
            {
                var method = methods[i];

                this.globalObject.internalExecutor.expandWithInternalFunction(this.htmlElement, method);

                this.addProperty(method, this.globalObject.internalExecutor.createInternalFunction(this.htmlElement[method], method, this), codeConstruct);
            }
        }
        catch(e) { fcModel.HtmlElement.notifyError("Error when adding methods: " + e);}
    },

    isMethod: function(propertyName)
    {
        return fcModel.HtmlElement.CONST.INTERNAL_PROPERTIES.METHODS.indexOf(propertyName) != -1;
    },

    notifyElementInsertedIntoDom: function(callExpression)
    {
        try
        {
            this.htmlElement.domInsertionPoint =
            {
                codeConstruct: callExpression,
                evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()
            };

            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                this.htmlElement.modelElement,
                callExpression,
                this.globalObject.getPreciseEvaluationPositionId()
            );

        }
        catch(e) { fcModel.HtmlElement.notifyError("Error when handling element inserted into dom!"); }
    },

    notifyError: function(message) { alert("HtmlElement - " + message); }
}

//https://developer.mozilla.org/en/DOM/element
fcModel.HtmlElement.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS:
        [
            "addEventListener", "appendChild","blur", "click", "cloneNode", "compareDocumentPosition",
            "dispatchEvent", "focus", "getAttribute", "getAttributeNS", "getAttributeNode", "getAttributeNodeNS",
            "getBoundingRect", "getClientRects", "getBoundingClientRect", "getElementsByClassName", "getElementsByTagName", "getElementsByTagNameNS",
            "getFeature", "getUserData", "hasAttribute", "hasAttributeNS", "hasAttributes", "hasChildNodes", "insertBefore",
            "isDefaultNamespace", "isEqualNode", "isSameNode", "isSupported", "lookupNamespaceURI", "lookupPrefix", "mozMatchesSelector",
            "mozRequestFullScreen", "normalize", "querySelector", "querySelectorAll", "removeAttribute", "removeAttributeNS", "removeAttributeNode",
            "removeChild", "removeEventListener", "replaceChild", "scrollIntoView", "setAttribute", "setAttributeNS", "setAttributeNode",
            "setAttributeNodeNS", "setCapture", "setIdAttribute", "setIdAttributeNS", "setIdAttributeNode", "setUserData", "insertAdjacentHTML",
            "mozMatchesSelector", "webkitMatchesSelector", "contains"
        ]
    }
};

fcModel.HtmlElementExecutor =
{
    addDependencyIfImportantElement: function(htmlElement, globalObject, codeConstruct)
    {
        if(globalObject.checkIfSatisfiesDomSlicingCriteria(htmlElement))
        {
            globalObject.browser.callImportantConstructReachedCallbacks(codeConstruct);
        }
    },

    addDependenciesToAllDescendantsModifications: function(htmlElement, codeConstruct, globalObject)
    {
        fcModel.HtmlElementProto.addDependenciesToAllModifications.call({htmlElement: htmlElement, globalObject:globalObject}, codeConstruct);
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
                var elements = [];

                try
                {
                    globalObject.browser.logDomQueried(functionName, arguments[0].value, callExpression);
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
            case "getAttribute":
                var result = thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
                this.addDependencies(thisObjectValue, callExpression, globalObject);
                return new fcModel.JsValue(result, new fcModel.FcInternal(callExpression, null));
            case "setAttribute":
            case "removeAttribute":
                thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
                thisObjectValue.elementModificationPoints.push({ codeConstruct: callExpression, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()});
                fcModel.HtmlElementExecutor.addDependencyIfImportantElement(thisObjectValue, globalObject, callExpression);
                return new fcModel.JsValue(undefined, new fcModel.FcInternal(callExpression, null));
            case "appendChild":
            case "removeChild":
            case "insertBefore":
                thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
                thisObjectValue.elementModificationPoints.push({ codeConstruct: callExpression, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()});
                fcModel.HtmlElementExecutor.addDependencyIfImportantElement(thisObjectValue, globalObject, callExpression);
                for(var i = 0; i < arguments.length; i++)
                {
                    var manipulatedElement = arguments[i].fcInternal.object;

                    if(manipulatedElement != null) //Because of comments
                    {
                        manipulatedElement.notifyElementInsertedIntoDom(callExpression);
                    }
                }
                return arguments[0];
            case "cloneNode":
                this.addDependenciesToAllDescendantsModifications(thisObjectValue, callExpression, globalObject);
                var clonedNode = thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
                return this.wrapToFcElement(clonedNode, globalObject, callExpression);
            case "addEventListener":
                globalObject.registerHtmlElementEventHandler
                (
                    fcThisValue,
                    jsArguments[0],
                    arguments[1],
                    {
                        codeConstruct: callExpression,
                        evaluationPositionId: globalObject.getPreciseEvaluationPositionId()
                    }
                );
            case "removeEventListener":
                fcModel.HtmlElementExecutor.addDependencyIfImportantElement(thisObjectValue, globalObject, callExpression);
                thisObjectValue.elementModificationPoints.push({ codeConstruct: callExpression, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()});
                return new fcModel.JsValue(undefined, new fcModel.FcInternal(callExpression));
            case "matchesSelector":
            case "mozMatchesSelector":
            case "webkitMatchesSelector":
                globalObject.browser.logDomQueried(functionName, arguments[0].value, callExpression);
            case "compareDocumentPosition":
            case "contains":
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
            case "getBoundingClientRect":
                try
                {
                    var result = thisObjectValue[functionName].apply(thisObjectValue, jsArguments);

                    var nativeObj = {
                        bottom: new fcModel.JsValue(result.bottom, new fcModel.FcInternal(callExpression)),
                        top: new fcModel.JsValue(result.top, new fcModel.FcInternal(callExpression)),
                        left: new fcModel.JsValue(result.left, new fcModel.FcInternal(callExpression)),
                        right: new fcModel.JsValue(result.right, new fcModel.FcInternal(callExpression)),
                        height: new fcModel.JsValue(result.height, new fcModel.FcInternal(callExpression)),
                        width: new fcModel.JsValue(result.width, new fcModel.FcInternal(callExpression))
                    };
                    var fcObj = new fcModel.Object(globalObject, callExpression, nativeObj);
                    fcObj.addProperty("bottom", nativeObj.bottom, callExpression);
                    fcObj.addProperty("top", nativeObj.top, callExpression);
                    fcObj.addProperty("left", nativeObj.left, callExpression);
                    fcObj.addProperty("right", nativeObj.right, callExpression);
                    fcObj.addProperty("height", nativeObj.height, callExpression);
                    fcObj.addProperty("width", nativeObj.width, callExpression);

                    return new fcModel.JsValue(nativeObj, new fcModel.FcInternal(callExpression, fcObj));
                }
                catch(e)
                {
                    alert("Error when executing getBoundingClientRect");
                }

                return new fcModel.JsValue(undefined, new fcModel.FcInternal(callExpression));
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

           fcModel.HtmlElement.notifyError("HtmlElementExecutor - when wrapping should not be here: ");
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

    notifyError: function(message) { alert("HtmlElementExecutor - " + message); }
}
}});