/**
 * User: Jomaras
 * Date: 05.06.12.
 * Time: 08:03
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.Document = function(document, globalObject)
{
    try
    {
        this.globalObject = globalObject;
        this.document = document;
        this.constructor = fcModel.Document;

        this.__proto__ = new fcModel.Object(globalObject);

        this.fcInternal = { object: this };
        this.htmlElementToFcMapping = {};

        var methodNames = fcModel.Document.CONST.INTERNAL_PROPERTIES.METHODS;

        methodNames.forEach(function(method)
        {
            this.addProperty(method, this.globalObject.internalExecutor.createInternalFunction(this.document[method], method, this, true));
        }, this);

        this.addProperty("nodeType", new fcModel.JsValue(this.document.nodeType, new fcModel.FcInternal()));
        this.addProperty("compatMode", new fcModel.JsValue(this.document.compatMode, new fcModel.FcInternal()));
        this.addProperty("parentNode", new fcModel.JsValue(this.document.parentNode, new fcModel.FcInternal()));
        this.addProperty("nodeName", new fcModel.JsValue(this.document.nodeName, new fcModel.FcInternal()));
        this.addProperty("ownerDocument", new fcModel.JsValue(this.document.ownerDocument, new fcModel.FcInternal()));

        function _getChild(htmlElement, tagName, index)
        {
            if(htmlElement == null) { return null;}
            var tagChildren = [];

            for(var i = 0; i < htmlElement.children.length; i++)
            {
                var child = htmlElement.children[i];

                if(child.nodeName.toUpperCase() == tagName.toUpperCase())
                {
                    tagChildren.push(child);
                }
            }

            return tagChildren[index];
        };

        this.getElementByXPath = function(xPath)
        {
            var simpleXPath = new fcModel.SimpleXPath(xPath);
            simpleXPath.removeLevel();
            var foundElement = this.document.childNodes[0];

            while(!simpleXPath.isEmpty() && foundElement != null)
            {
                foundElement = _getChild(foundElement, simpleXPath.getCurrentTag(), simpleXPath.getIndex());
                simpleXPath.removeLevel();
            }

            return fcModel.HtmlElementExecutor.wrapToFcElement(foundElement, this.globalObject, null);
        };

        this.getJsPropertyValue = function(propertyName, codeConstruct)
        {
            if(_isMethod(propertyName) || propertyName == "nodeType"
             || propertyName == "compatMode" || propertyName == "parentNode"
             || propertyName == "nodeName"  || propertyName == "onready" || propertyName == "ownerDocument"
             || propertyName == "oninit"|| propertyName == "init" || propertyName.toLowerCase().indexOf("jquery") != -1) //jQuery property accessors - remove
            {
                return this.getPropertyValue(propertyName, codeConstruct);
            }

            if(propertyName == "defaultView") { return this.globalObject; }
            else if (propertyName == "readyState" || propertyName == "ready")
            {
                return new fcModel.JsValue(document[propertyName], new fcModel.FcInternal());
            }
            else if (propertyName == "documentElement" || propertyName == "body" || propertyName == "head")
            {
                return fcModel.DocumentExecutor.wrapToFcHtmlElement(this.document[propertyName], codeConstruct, globalObject)
            }
            else if (propertyName == "window")
            {
                return this.globalObject;
            }

            alert("Unhandled document property: " + propertyName);
        };

        this.addJsProperty = function(propertyName, value, codeConstruct)
        {
            if(propertyName.indexOf("jQuery") != -1)
            {
                this.addProperty(propertyName, value, codeConstruct);
            }
            else
            {
                alert("add property document");
            }
        };

        function _isMethod(methodName){ return methodNames.indexOf(methodName) != -1; }
    }
    catch(e) { fcModel.Document.notifyError("Error when creating Document object: " + e); }
};
fcModel.Document.notifyError = function(message) { alert("Document: " + message);}

fcModel.Document.prototype = new fcModel.Object(null);

fcModel.Document.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS:
        [
            "addEventListener", "adoptNode", "appendChild", "appendChild", "captureEvents",
            "cloneNode", "close", "compareDocumentPosition", "createAttribute", "createAttributeNS",
            "createCDATASection", "createComment", "createDocumentFragment", "createElement", "createElementNS",
            "createEvent", "createExpression", "createNSResolver", "createTextNode", "elementFromPoint",
            "getElementById", "getElementsByClassName", "getElementsByName", "getElementsByTagName",
            "hasAttributes", "hasChildNodes", "hasFocus", "importNode", "insertBefore", "isEqualNode", "isSameNode",
            "isSupported", "querySelector", "querySelectorAll", "removeChild", "releaseEvents", "removeEventListener",
            "replaceChild", "routeEvent", "write", "writeln"
        ],
        PROPERTIES:
        [
            "activeElement", "alinkColor", "anchors", "async", "attributes", "baseURI", "baseURIObject",
            "body", "characterSet", "childNodes", "compatMode", "cookie", "defaultView", "designMode",
            "dir", "doctype", "documentElement", "documentURI", "documentURIObject", "domain", "embeds",
            "fgColor", "fileSize", "firstChild", "firstChild", "forms", "head", "height","images", "implementation",
            "inputEncoding", "lastChild", "lastModified", "links", "localName", "location", "namespaceURI",
            "nextSibling", "nodeName", "nodeType", "nodeValue", "parentNode", "plugins",
            "popupNode", "preferredStyleSheetSet", "prefix", "previousSibling", "readyState", "scripts", "styleSheets",
            "textContent", "title", "tooltipNode", "URL"
        ]
    }
};

fcModel.SimpleXPath = function(xPathExpression)
{
    this.xPathExpression = xPathExpression;
};
fcModel.SimpleXPath.prototype =
{
    getCurrentTag: function()
    {
        var elementRegEx = new RegExp("^/([^/[])*");

        var match = this.xPathExpression.match(elementRegEx);

        if(match != null)
        {
            var matchedString = match[0];

            if(matchedString == null) { return ""; }

            if(matchedString.indexOf("/") == 0) { return matchedString.substring(1);}
        }

        return "";
    },

    getIndex: function()
    {
        var indexRegEx = new RegExp("\\[[^\\]]\\]");

        var match = this.xPathExpression.match(indexRegEx);

        if(match != null)
        {
            var matchedString = match[0];

            if(matchedString != null)
            {
                var result =  matchedString.replace(/\]$/, "").replace(/^\[/,"");

                if(result != "") { return result - 1; }
            }
        }

        return 0;
    },

    removeLevel: function()
    {
        this.xPathExpression = this.xPathExpression.substring(this.getCurrentTag().length + 1); // +1 because xPath goes like /html..
        return this;
    },

    isEmpty: function() { return this.xPathExpression == ""; }
};

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

            return this.wrapToFcHtmlElements(elements, callExpression, globalObject);
        }
        else if(functionName == "getElementById" || functionName == "querySelector")
        {
            var selector = arguments[0].value;

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

            return this.wrapToFcHtmlElement(element, callExpression, globalObject);
        }

        this.notifyError("Unknown document method: " +  functionName);
        return null;
    },

    wrapToFcHtmlElements: function(items, callExpression, globalObject)
    {
        try
        {
            var elements = [];

            for(var i = 0, length = items.length; i < length; i++)
            {
                elements.push(this.wrapToFcHtmlElement(items[i], callExpression, globalObject));
            }

            return globalObject.internalExecutor.createArray(callExpression, elements);
        }
        catch(e) { this.notifyError("Error when wrapping to htmlElements:" + e); }
    },

    wrapToFcHtmlElement: function(htmlElement, callExpression, globalObject)
    {
        try
        {
            return new fcModel.JsValue
            (
                htmlElement,
                new fcModel.FcInternal
                (
                    callExpression,
                    new fcModel.HtmlElement(htmlElement, globalObject, callExpression)
                )
            );
        }
        catch(e) { this.notifyError("Error when wrapping to fcHtmlElement:" + e); }
    },

    notifyError: function(message) { alert("DocumentExecutor - " + message);}
}
}});