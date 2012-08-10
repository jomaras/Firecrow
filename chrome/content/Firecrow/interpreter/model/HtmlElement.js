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
            fcModel.HtmlElement.notifyError("When creating HTMLElement the htmlElement must be of type HTMLElement: " + (typeof htmlElement));
            return;
        }

        this.proto = new fcModel.Object(this.globalObject);
        this.__proto__ = this.proto;

        this.globalObject = globalObject;
        this.htmlElement = htmlElement;

        if(htmlElement != null)
        {
            htmlElement.fcHtmlElementId = this.id;
            this.globalObject.document.htmlElementToFcMapping[this.id] = this;
        }

        for(var prop in fcModel.HtmlElementProto)
        {
            this[prop] = fcModel.HtmlElementProto[prop];
        }

        this.constructor = fcModel.HtmlElement;

        /*this.setChildRelatedProperties(codeConstruct);*/

        this.proto.addProperty.call(this, "attributes", fcModel.Attr.createAttributeList(this.htmlElement, this.globalObject, codeConstruct), codeConstruct);
        this.proto.addProperty.call(this, "classList", new fcModel.JsValue(htmlElement.classList, new fcModel.FcInternal(codeConstruct, new fcModel.ClassList(this.htmlElement, this.globalObject, codeConstruct))), codeConstruct);
        this.proto.addProperty.call(this, "ownerDocument", this.globalObject.jsFcDocument, codeConstruct);

        var styleValue = new fcModel.JsValue(htmlElement.style, new fcModel.FcInternal(codeConstruct, new fcModel.CSSStyleDeclaration(htmlElement, htmlElement.style, globalObject, codeConstruct)));
        this.proto.addProperty.call(this, "style", styleValue, codeConstruct);

        if(this.htmlElement.style != null)
        {
            this.htmlElement.style.jsValue = styleValue;
        }

        this.htmlElement.elementModificationPoints = [];

        this.addPrimitiveProperties(htmlElement, codeConstruct);
        this.addMethods(codeConstruct);

        this.registerGetPropertyCallback(function(getPropertyConstruct, propertyName)
        {
            var evaluationPositionId = this.globalObject.getPreciseEvaluationPositionId();

            this.addDependenciesToAllModifications(getPropertyConstruct);

            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                getPropertyConstruct,
                this.htmlElement.modelElement,
                evaluationPositionId
            );

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

fcModel.HtmlElement.notifyError = function(message) { alert("HtmlElement - " + message); }

fcModel.HtmlElement.prototype = new fcModel.Object(null);

fcModel.HtmlElementProto =
{
    setChildRelatedProperties: function(codeConstruct)
    {
        var childNodes = this.getChildNodes(codeConstruct);
        var children = this.getChildren(childNodes);

        this.proto.addProperty.call(this, "childNodes", this.globalObject.internalExecutor.createArray(codeConstruct, childNodes), codeConstruct);
        this.proto.addProperty.call(this, "children", this.globalObject.internalExecutor.createArray(codeConstruct, children), codeConstruct);
        this.proto.addProperty.call(this, "body", fcModel.HtmlElementExecutor.wrapToFcElement(this.htmlElement.body, this.globalObject, codeConstruct));
        this.proto.addProperty.call(this, "firstChild", fcModel.HtmlElementExecutor.wrapToFcElement(this.htmlElement.firstChild, this.globalObject, codeConstruct));
        this.proto.addProperty.call(this, "lastChild", fcModel.HtmlElementExecutor.wrapToFcElement(this.htmlElement.lastChild, this.globalObject, codeConstruct));
        this.proto.addProperty.call(this, "parentNode", fcModel.HtmlElementExecutor.wrapToFcElement(this.htmlElement.parentNode, this.globalObject, codeConstruct));
        this.proto.addProperty.call(this, "nextSibling", fcModel.HtmlElementExecutor.wrapToFcElement(this.htmlElement.nextSibling, this.globalObject, codeConstruct));
        this.proto.addProperty.call(this, "innerHTML", new fcModel.JsValue(this.htmlElement.innerHTML, new fcModel.FcInternal(codeConstruct)), codeConstruct);
    },

    addDependenciesToAllModifications: function(codeConstruct)
    {
        try
        {
            if(codeConstruct == null) { return; }

            var modifications = this.htmlElement.elementModificationPoints;

            for(var i = 0, length = modifications.length; i < length; i++)
            {
                var modification = modifications[i];

                this.globalObject.browser.callDataDependencyEstablishedCallbacks
                (
                    codeConstruct,
                    modification.codeConstruct,
                    this.globalObject.getPreciseEvaluationPositionId(),
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

    addPrimitiveProperties: function(htmlElement, codeConstruct)
    {
        try
        {
            var primitiveProperties = fcModel.HtmlElement.CONST.INTERNAL_PROPERTIES.PRIMITIVE_PROPERTIES;

            for(var i = 0, length = primitiveProperties.length; i < length; i++)
            {
                var propertyName = primitiveProperties[i];

                this.proto.addProperty.call(this, propertyName, new fcModel.JsValue(htmlElement[propertyName], new fcModel.FcInternal(codeConstruct)), codeConstruct);
            }
        }
        catch(e) { fcModel.HtmlElement.notifyError("Error when adding primitive properties: " + e); }
    },

    getHtmlPropertyValue: function(propertyName, codeConstruct)
    {
        if(propertyName == "childNodes")
        {
            var childNodes = this.getChildNodes(codeConstruct);
            this.proto.addProperty.call(this, "childNodes", this.globalObject.internalExecutor.createArray(codeConstruct, childNodes), codeConstruct);
        }
        else if(propertyName == "children")
        {
            var children = this.getChildren(this.getChildNodes(codeConstruct));
            this.proto.addProperty.call(this, "children", this.globalObject.internalExecutor.createArray(codeConstruct, children), codeConstruct);
        }
        else if (propertyName == "body" || propertyName == "firstChild"
              || propertyName == "parentNode" || propertyName == "lastChild"
              || propertyName == "nextSibling" || propertyName == "previousSibling")
        {
            this.proto.addProperty.call(this, propertyName, fcModel.HtmlElementExecutor.wrapToFcElement(this.htmlElement[propertyName], this.globalObject, codeConstruct));
        }
        else if(propertyName == "innerHTML")
        {
            this.proto.addProperty.call(this, "innerHTML", new fcModel.JsValue(this.htmlElement.innerHTML, new fcModel.FcInternal(codeConstruct)), codeConstruct);
        }
        else if(propertyName == "offsetHeight" || propertyName == "offsetWidth")
        {
            //TODO: HUGE HACK
            return new fcModel.JsValue(10, new fcModel.FcInternal());
        }

        return this.getPropertyValue(propertyName, codeConstruct);
    },

    addProperty: function(propertyName, propertyValue, codeConstruct, isEnumerable)
    {
        try
        {
            if(propertyName == "innerHTML") { /*this.setChildRelatedProperties(codeConstruct); */}
            else if(propertyName == "onclick")
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

            fcModel.HtmlElementExecutor.addDependencyIfImportantElement(this.htmlElement, this.globalObject, codeConstruct);

            this.htmlElement.elementModificationPoints.push({ codeConstruct: codeConstruct, evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()});

            this.proto.addProperty.call(this, propertyName, propertyValue, codeConstruct, isEnumerable);
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

                this.proto.addProperty.call(this, method, this.globalObject.internalExecutor.createInternalFunction(this.htmlElement[method], method, this, true), codeConstruct);
            }
        }
        catch(e) { fcModel.HtmlElement.notifyError("Error when adding methods: " + e);}
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
            "getBoundingRect", "getClientRects", "getElementsByClassName", "getElementsByTagName", "getElementsByTagNameNS",
            "getFeature", "getUserData", "hasAttribute", "hasAttributeNS", "hasAttributes", "hasChildNodes", "insertBefore",
            "isDefaultNamespace", "isEqualNode", "isSameNode", "isSupported", "lookupNamespaceURI", "lookupPrefix", "mozMatchesSelector",
            "mozRequestFullScreen", "normalize", "querySelector", "querySelectorAll", "removeAttribute", "removeAttributeNS", "removeAttributeNode",
            "removeChild", "removeEventListener", "replaceChild", "scrollIntoView", "setAttribute", "setAttributeNS", "setAttributeNode",
            "setAttributeNodeNS", "setCapture", "setIdAttribute", "setIdAttributeNS", "setIdAttributeNode", "setUserData", "insertAdjacentHTML",
            "mozMatchesSelector", "webkitMatchesSelector"
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
            "scrollTop", "scrollWidth", "spellcheck", "tabIndex", "tagName", "textContent", "title"
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
                var elements = thisObjectValue[functionName].apply(thisObjectValue, jsArguments);

                for(var i = 0, length = elements.length; i < length; i++)
                {
                    this.addDependencies(elements[i], callExpression, globalObject);
                }

                return this.wrapToFcElements(globalObject, callExpression, elements);
            case "getAttribute":
                var result = thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
                this.addDependencies(result, callExpression, globalObject);
                return new fcModel.JsValue(result, new fcModel.FcInternal(callExpression, null));
            case "setAttribute":
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
                /*fcThisValue.setChildRelatedProperties(callExpression);*/
                for(var i = 0; i < arguments.length; i++)
                {
                    if(arguments[i].fcInternal.object != null) //Because of comments
                    {
                        arguments[i].fcInternal.object.notifyElementInsertedIntoDom(callExpression);
                    }
                }
                return arguments[0];
            case "cloneNode":
                var clonedNode = thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
                return this.wrapToFcElement(clonedNode, globalObject, callExpression);
            case "addEventListener":
                fcModel.HtmlElementExecutor.addDependencyIfImportantElement(thisObjectValue, globalObject, callExpression);
                thisObjectValue.elementModificationPoints.push({ codeConstruct: callExpression, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()});
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
            case "matchesSelector":
            case "mozMatchesSelector":
            case "webkitMatchesSelector":
            case "compareDocumentPosition":
                var result = false;
                try
                {
                    result = thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
                }
                catch(e) {}

                return new fcModel.JsValue(result, new fcModel.FcInternal(callExpression));
            default:
                fcModel.HtmlElement.notifyError("Unhandled internal method:" + functionName); return;
        }
    },

    wrapToFcElements: function(globalObject, codeConstruct, items)
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
        catch(e) { fcModel.HtmlElement.notifyError("HtmlElementExecutor - error when wrapping: " + e);}
    },

    wrapToFcElement: function(item, globalObject, codeConstruct)
    {
       try
       {
           if(item == null) { return new fcModel.JsValue(item, new fcModel.FcInternal(codeConstruct)); }

           if(ValueTypeHelper.isOfType(item, HTMLElement) || ValueTypeHelper.isOfType(item, DocumentFragment))
           {
               var fcHtmlElement = globalObject.document.htmlElementToFcMapping[item.fcHtmlElementId];

               if(fcHtmlElement != null) { /*fcHtmlElement.setChildRelatedProperties(codeConstruct);*/ }
               else { fcHtmlElement = new fcModel.HtmlElement(item, globalObject, codeConstruct); }

               return new fcModel.JsValue(item, new fcModel.FcInternal(codeConstruct, fcHtmlElement));
           }
           else
           {
               return new fcModel.JsValue(item, new fcModel.FcInternal(codeConstruct, new fcModel.TextNode(item, globalObject, codeConstruct)));
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
                globalObject.browser.callDataDependencyEstablishedCallbacks (codeConstruct, element.modelElement, evaluationPositionId);
            }
            else if (element.creationPoint != null)
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