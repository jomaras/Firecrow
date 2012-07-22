/**
 * User: Jomaras
 * Date: 05.06.12.
 * Time: 08:03
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.Document = function(documentFragment, globalObject)
{
    try
    {
        this.notifyError = function(message) { alert("Document - " + message); }

        this.globalObject = globalObject;
        this.documentFragment = documentFragment;
        this.__proto__ = new fcModel.Object(globalObject);

        //Extend the fragment just to support createElement function
        this.documentFragment.createElement = this.globalObject.origDocument.createElement;
        this.documentFragment.getElementById = this.globalObject.origDocument.getElementById;
        this.documentFragment.getElementsByClassName = this.globalObject.origDocument.getElementsByClassName;
        this.documentFragment.getElementsByTagName = this.globalObject.origDocument.getElementsByTagName;

        this.fcInternal = { object: this };
        this.addProperty("location", this.globalObject.getPropertyValue("location"));
        //this.addProperty("lastIndex", new fcModel.JsValue(0, new fcModel.FcInternal(codeConstruct)), codeConstruct);
    }
    catch(e) { this.notifyError("Error when creating Document object: " + e); }
};

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
            "nextSibling", "nodeName", "nodeType", "nodeValue", "ownerDocument", "parentNode", "plugins",
            "popupNode", "preferredStyleSheetSet", "prefix", "previousSibling", "readyState", "scripts", "styleSheets",
            "textContent", "title", "tooltipNode", "URL"
        ]
    }
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
        else if(functionName == "addEventListener") { return globalObject.document.addEventListener(arguments, callExpression, globalObject); }
        else if(functionName == "removeEventListener") { return globalObject.document.removeEventListener(arguments, callExpression, globalObject); }
        else
        {
            var result;
            if(functionName == "getElementsByTagName"
            || functionName == "querySelectorAll")
            {
                var elements = thisObjectValue.querySelectorAll(arguments[0].value);

                for(var i = 0, length = elements.length; i < length; i++)
                {
                    fcModel.HtmlElementExecutor.addDependencies(elements[i], callExpression, globalObject);
                }

                return this.wrapToFcHtmlElements(elements, callExpression, globalObject);
            }
            else if(functionName == "getElementById"
                 || functionName == "querySelector")
            {
                var element = thisObjectValue.querySelector(functionName == "getElementById" ? ("#" + arguments[0].value) : (arguments[0].value));

                fcModel.HtmlElementExecutor.addDependencies(element, callExpression, globalObject);

                return this.wrapToFcHtmlElement(element, callExpression, globalObject);
            }
            else
            {
                this.notifyError("Unknown document method!");
            }
        }
    },

    wrapToFcHtmlElements: function(items, callExpression, globalObject)
    {
        try
        {
            var elements = [];

            for(var i = 0, length = items.length; i < length; i++)
            {
                elements.push(this.wrapToFcHtmlElement(items[i], callExpression));
            }

            return globalObject.internalExecutor.createArray(callExpression, elements);
        }
        catch(e) { alert("Error when wrapping to htmlElements:" + e); }
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