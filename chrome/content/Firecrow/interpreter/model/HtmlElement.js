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
        if(!ValueTypeHelper.isOfType(htmlElement, HTMLElement)) { this.notifyError("When creating HTMLElement the htmlElement must be of type HTMLElement: " + (typeof htmlElement)); return; }

        this.proto = new fcModel.Object(this.globalObject);
        this.__proto__ = this.proto;

        this.globalObject = globalObject;
        this.htmlElement = htmlElement;

        for(var prop in fcModel.HtmlElementProto)
        {
            this[prop] = fcModel.HtmlElementProto[prop];
        }

        this.setChildRelatedProperties(codeConstruct);

        this.proto.addProperty.call(this, "attributes", fcModel.Attr.createAttributeList(this.htmlElement, this.globalObject, codeConstruct), codeConstruct);
        this.proto.addProperty.call(this, "classList", new fcModel.JsValue(htmlElement.classList, new fcModel.FcInternal(codeConstruct, new fcModel.ClassList(this.htmlElement, this.globalObject, codeConstruct))), codeConstruct);
        this.proto.addProperty.call(this, "ownerDocument", this.globalObject.jsFcDocument, codeConstruct);

        var styleValue = new fcModel.JsValue(htmlElement.style, new fcModel.FcInternal(codeConstruct, new fcModel.CSSStyleDeclaration(htmlElement, htmlElement.style, globalObject, codeConstruct)));
        this.proto.addProperty.call(this, "style", styleValue, codeConstruct);

        this.htmlElement.style.jsValue = styleValue;
        this.htmlElement.attributeModificationPoints = [];

        this.addPrimitiveProperties(htmlElement, codeConstruct);
        this.addMethods(codeConstruct);

        this.registerGetPropertyCallback(function(getPropertyConstruct, propertyName)
        {
            var evaluationPositionId = this.globalObject.getPreciseEvaluationPositionId();
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
    catch(e) { alert("Error when creating HTML node: " + e); }//this.notifyError("Error when creating HtmlElement object: " + e); }
};

fcModel.HtmlElement.prototype = new fcModel.Object(null);

fcModel.HtmlElementProto =
{
    setChildRelatedProperties: function(codeConstruct)
    {
        var childNodes = this.getChildNodes(codeConstruct);
        var children = this.getChildren(childNodes);

        this.proto.addProperty.call(this, "childNodes", this.globalObject.internalExecutor.createArray(codeConstruct, childNodes), codeConstruct);
        this.proto.addProperty.call(this, "children", this.globalObject.internalExecutor.createArray(codeConstruct, children), codeConstruct);
        this.proto.addProperty.call(this, "innerHTML", new fcModel.JsValue(this.htmlElement.innerHTML, new fcModel.FcInternal(codeConstruct)), codeConstruct);
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
                            ValueTypeHelper.isOfType(childNode, HTMLElement) ?  new fcModel.HtmlElement(childNode, this.globalObject, codeConstruct)
                                                                             :  new fcModel.TextNode(childNode, this.globalObject, codeConstruct)
                        )
                    )
                )
            }
        }
        catch(e) { this.notifyError("Error when getting child nodes:" + e); }

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

               if(ValueTypeHelper.isOfType(child.value, HTMLElement)) { children.push(child); }
           }
        }
        catch(e) { this.notifyError("Error when getting children from child nodes: " + e); }

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
        catch(e) { this.notifyError("Error when adding primitive properties: " + e); }
    },

    addProperty: function(propertyName, propertyValue, codeConstruct, isEnumerable)
    {
        try
        {
            if(propertyName == "innerHTML")
            {
                this.setChildRelatedProperties(codeConstruct);
            }

            this.htmlElement.attributeModificationPoints.push({ codeConstruct: codeConstruct, evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()});

            this.proto.addProperty.call(this, propertyName, propertyValue, codeConstruct, isEnumerable);
        }
        catch(e) { this.notifyError("Error when adding property: " + e);}
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
        catch(e) { this.notifyError("Error when adding methods: " + e);}
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
        catch(e) { this.notifyError("Error when handling element inserted into dom!"); }
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
            "setAttributeNodeNS", "setCapture", "setIdAttribute", "setIdAttributeNS", "setIdAttributeNode", "setUserData", "insertAdjacentHTML"
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
    executeInternalMethod: function(thisObject, functionObject, arguments, callExpression)
    {
        if(!functionObject.fcInternal.isInternalFunction) { this.notifyError("The function should be internal when executing string method!"); return; }

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
            case "appendChild":
                thisObjectValue[functionName].apply(thisObjectValue, jsArguments);
                for(var i = 0; i < arguments.length; i++)
                {
                    arguments[i].fcInternal.object.notifyElementInsertedIntoDom(callExpression);
                }
                return arguments[0];
            default:
                this.notifyError("Unhandled internal method:" + functionName); return;
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
                fcItems.push(new fcModel.JsValue(item, new fcModel.FcInternal(codeConstruct, new fcModel.HtmlElement(item, globalObject, codeConstruct))))
            }

            return globalObject.internalExecutor.createArray(codeConstruct, fcItems);
        }
        catch(e) {alert("HtmlElementExecutor - error when wrapping: " + e);}
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

            if(element.attributeModificationPoints != null)
            {
                var attributeModificationPoints = element.attributeModificationPoints;

                for(var i = 0, length = attributeModificationPoints.length; i < length; i++)
                {
                    var attributeModificationPoint = attributeModificationPoints[i];

                    globalObject.browser.callDataDependencyEstablishedCallbacks
                    (
                        codeConstruct,
                        attributeModificationPoint.codeConstruct,
                        evaluationPositionId,
                        attributeModificationPoint.evaluationPositionId
                    );
                }
            }
        }
        catch(e) { this.notifyError("Error when adding dependencies: " + e);}
    },


    notifyError: function(message) { alert("HtmlElementExecutor - " + message);}
}
}});