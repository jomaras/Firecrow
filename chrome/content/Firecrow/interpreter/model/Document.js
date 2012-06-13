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
        this.globalObject = globalObject;
        this.documentFragment = documentFragment;

        //Extend the fragment just to support createElement function
        this.documentFragment.createElement = document.createElement;
        this.documentFragment.getElementById = document.getElementById;
        this.documentFragment.getElementsByClassName = document.getElementsByClassName;
        this.documentFragment.getElementsByTagName = document.getElementsByTagName;

        this.fcInternal = { object: this };
        //this.addProperty("lastIndex", new fcModel.JsValue(0, new fcModel.FcInternal(codeConstruct)), codeConstruct);
    }
    catch(e) { this.notifyError("Error when creating Document object: " + e); }
};

fcModel.Document.prototype = new fcModel.Object(null);

fcModel.Document.prototype.notifyError = function(message) { alert("Document - " + message); }

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

        switch(functionName)
        {
            case "createElement":
                return globalObject.internalExecutor.createHtmlElement(callExpression, arguments[0].value);
            case "getElementsByTagName":
                return this.wrapToFcHtmlElements(thisObjectValue.querySelectorAll("." + arguments[0].value), callExpression, globalObject);
            case "getElementById":
                return this.wrapToFcHtmlElement(thisObjectValue.querySelector("#" + arguments[0].value), callExpression, globalObject);
            default:
                this.notifyError("Unhandled internal method - " + functionName); return;
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