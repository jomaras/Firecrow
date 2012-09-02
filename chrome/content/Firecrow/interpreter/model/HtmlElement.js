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
            this.globalObject.document.htmlElementToFcMapping[this.id] = this;

            this.addProperty("nodeType", new fcModel.JsValue(this.htmlElement.nodeType, new fcModel.FcInternal(codeConstruct)), codeConstruct);
            this.addProperty("nodeName", new fcModel.JsValue(this.htmlElement.nodeName, new fcModel.FcInternal(codeConstruct)), codeConstruct);
            this.addProperty("ownerDocument", this.globalObject.jsFcDocument, codeConstruct);
        }

        this.htmlElement.elementModificationPoints = [];

        this.addMethods(codeConstruct);

        this.registerGetPropertyCallback(function(getPropertyConstruct, propertyName)
        {
            var evaluationPositionId = this.globalObject.getPreciseEvaluationPositionId();

            this.addDependenciesToAllModifications(getPropertyConstruct);

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(getPropertyConstruct, this.htmlElement.modelElement, evaluationPositionId);

            if(propertyName == "children" || propertyName == "childNodes")
            {
                var descendents = this.htmlElement[propertyName];

                for(var i = 0; i < descendents.length; i++)
                {
                    this.globalObject.browser.callDataDependencyEstablishedCallbacks
                    (
                        getPropertyConstruct,
                        descendents[i].modelElement,
                        evaluationPositionId
                    );
                }
            }
        }, this);
    }
    catch(e) { fcModel.HtmlElement.notifyError("Error when creating HTML node: " + e); }
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

               if(ValueTypeHelper.isOfType(child.value, HTMLElement) || ValueTypeHelper.isOfType(child.value, DocumentFragment)) { children.push(child); }
           }
        }
        catch(e) { fcModel.HtmlElement.notifyError("Error when getting children from child nodes: " + e); }

        return children;
    },

    getJsPropertyValue: function(propertyName, codeConstruct)
    {
        fcModel.HtmlElement.accessedProperties[propertyName] = true;

        if(propertyName == "attributes")
        {
            this.addProperty("attributes", fcModel.Attr.createAttributeList(this.htmlElement, this.globalObject, codeConstruct), codeConstruct);
        }
        else if(propertyName == "style")
        {
            this.addProperty(propertyName, fcModel.CSSStyleDeclaration.createStyleDeclaration(this.htmlElement, this.htmlElement.style, this.globalObject, this.creationConstruct), this.creationConstruct);
        }

        var propertyValue = this.getPropertyValue(propertyName, codeConstruct);

        if(this.isMethod(propertyName)) { return propertyValue; }

        if(propertyName == "childNodes"
        || propertyName == "children")
        {
            var childNodes = this.getChildNodes(codeConstruct);
            propertyValue = this.globalObject.internalExecutor.createArray
            (
                this.creationConstruct,
                propertyName == "childNodes" ? childNodes : this.getChildren(childNodes)
            );
            this.addProperty(propertyName, propertyValue, this.creationConstruct);
        }
        else if (propertyName == "body" || propertyName == "firstChild"
              || propertyName == "parentNode" || propertyName == "lastChild"
              || propertyName == "nextSibling" || propertyName == "previousSibling"
              || (this.htmlElement instanceof HTMLFormElement && this.htmlElement[propertyName] instanceof Element))
        {
            if(propertyValue == null || propertyValue.value == null || this.htmlElement[propertyName] == null
            || propertyValue.value.fcHtmlElementId == undefined
            || propertyValue.value.fcHtmlElementId != this.htmlElement[propertyName].fcHtmlElementId)
            {
                propertyValue = fcModel.HtmlElementExecutor.wrapToFcElement(this.htmlElement[propertyName], this.globalObject, this.creationConstruct);
                this.addProperty(propertyName, propertyValue, this.creationConstruct);
            }
        }
        else if (propertyName == "textContent"  || propertyName == "id" || propertyName == "checked"
              || propertyName == "value" || propertyName == "innerHTML" || propertyName == "nodeType"
              || propertyName == "offsetWidth" || propertyName == "offsetHeight" || propertyName == "offsetTop" || propertyName == "rel"
              || propertyName == "selected" || propertyName == "className" || propertyName == "enctype"
              || propertyName == "outerHTML" || propertyName == "disabled" || propertyName == "nodeName"
              || propertyName == "scrollLeft" || propertyName == "scrollTop" || propertyName == "clientTop" || propertyName == "clientLeft"
              || propertyName == "href" || propertyName == "src" || propertyName == "namespaceURI"
              //TODO - remove this jQuery stuff below
              || propertyName == "test" || propertyName == "attachEvent" || propertyName == "matchesSelector" || propertyName == "opacity"
              || propertyName == "createElement" || propertyName == "currentStyle" || propertyName.toLowerCase().indexOf("jquery") != -1
              || propertyName == "left" || propertyName == "top" || propertyName == "width" || propertyName == "height" || propertyName == "hash"
              || propertyName == "is" || propertyName == "window" || propertyName == "paddingTop" || propertyName == "paddingBottom" || propertyName == "marginTop"
              || propertyName == "marginBottom" || propertyName == "marginLeft"|| propertyName == "marginRight" || propertyName == "ai" || propertyName == "si"
              || propertyName == "type" || propertyName == "cycleStop" || propertyName == "cycleTimeout" || propertyName == "cyclePause"
              || propertyName == "cycleH" || propertyName == "cycleW" || propertyName == "ontooltiprender" || propertyName == "tooltiprender"
              || propertyName == "ontooltipshow" || propertyName == "tooltipshow" || propertyName == "ontooltipfocus" || propertyName == "tooltipfocus")
        {
            if(propertyValue == null || this.htmlElement[propertyName] != propertyValue.value)
            {
                propertyValue = new fcModel.JsValue(this.htmlElement[propertyName], new fcModel.FcInternal(this.creationConstruct));
                this.addProperty(propertyName, propertyValue, this.creationConstruct);
            }
        }
        else if(propertyName == "onclick" || propertyName == "ownerDocument"
             || propertyName == "onkeyup" || propertyName == "onmousedown"
             || propertyName == "onselectstart" || propertyName == "onsubmit"
             || propertyName == "attributes" || propertyName == "style" || propertyName == "getContext")
        {
            //nothing
        }
        else
        {
            alert("Unhandled get html property: " + propertyName + "@" + codeConstruct.loc.start.line);
        }

        return propertyValue;
    },

    addJsProperty: function(propertyName, propertyValue, codeConstruct, isEnumerable)
    {
        try
        {
            fcModel.HtmlElement.accessedProperties[propertyName] = "writes";

            if(propertyName == "onclick" || propertyName == "onkeyup" || propertyName == "onmousedown"
            || propertyName == "onselectstart"|| propertyName == "onsubmit")
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
            else if (propertyName == "textContent" || propertyName == "id" || propertyName == "value"
                  || propertyName == "checked" || propertyName == "innerHTML" || propertyName == "selected"
                  || propertyName == "className" || propertyName == "enctype" || propertyName == "outerHTML" || propertyName == "src"
                  || propertyName == "disabled" || propertyName.indexOf("jQuery") != -1 || propertyName == "ai" || propertyName == "si"
                  || propertyName == "cycleStop" || propertyName == "cycleTimeout" || propertyName == "cyclePause"
                  || propertyName == "cycleH" || propertyName == "cycleW")
            {
                this.htmlElement[propertyName] = propertyValue.value;
            }
            else
            {
                alert("Unhandled add property to html element " + propertyName);
            }

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(this.htmlElement.modelElement, codeConstruct, this.globalObject.getPreciseEvaluationPositionId());
            fcModel.HtmlElementExecutor.addDependencyIfImportantElement(this.htmlElement, this.globalObject, codeConstruct);

            this.htmlElement.elementModificationPoints.push({ codeConstruct: codeConstruct, evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()});

            this.addProperty(propertyName, propertyValue, codeConstruct, isEnumerable);
        }
        catch(e) { fcModel.HtmlElement.notifyError("Error when adding property: " + e);}
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
        ],
        PROPERTIES:
        [
            "attributes", "baseURI", "childElementCount", "childNodes", "children",
            "classList", "className", "clientHeight", "clientLeft", "clientTop", "clientWidth", "contentEditable",
            "dataset", "dir", "firstChild", "id", "innerHTML", "isContentEditable", "lang", "lastChild", "lastElementChild",
            "localName", "name", "namespaceURI", "nextSibling", "nextElementSibling", "nodeName", "nodePrincipal", "nodeType",
            "nodeValue", "offsetHeight", "offsetLeft", "offsetParent", "offsetTop", "offsetWidth", "outerHTML", "ownerDocument",
            "parentNode", "prefix", "previousSibling", "previousElementSibling", "schemaTypeInfo", "scrollHeight", "scrollLeft",
            "scrollTop", "scrollWidth", "spellcheck", "style", "tabIndex", "tagName", "textContent", "title"
        ],
        PRIMITIVE_PROPERTIES:
        [
            "baseURI", "childElementCount", "className", "clientHeight", "clientLeft", "clientTop", "clientWidth",
            "contentEditable","dir", "id", "innerHTML", "isContentEditable", "lang",
            "localName", "name", "namespaceURI", "nodeName", "nodeType",
            "nodeValue", "offsetHeight", "offsetLeft", "offsetTop", "offsetWidth", "outerHTML",
            "prefix", "schemaTypeInfo", "scrollHeight", "scrollLeft",
            "scrollTop", "scrollWidth", "spellcheck", "tabIndex", "tagName", "textContent", "title",
            "rel", "checked"
        ],
        COMPLEX_PROPERTIES:
        [
            "attributes","childNodes", "children", "classList", "dataset", "firstChild", "lastChild",
            "lastElementChild", "nextSibling", "nextElementSibling", "nodePrincipal", "offsetParent",
            "ownerDocument", "parentNode", "previousSibling", "previousElementSibling", "style"
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