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
        if(!functionObject.fcInternal.isInternalFunction) { this.notifyError("The function should be internal when executing string method!"); return; }

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
                return this.wrapToFcElements(this);
                return
            default:
                this.notifyError("Unhandled internal method"); return;
        }
    },

    wrapToFcElements: function(items)
    {

    },

    notifyError: function(message) { alert("DocumentExecutor - " + message);}
}
}});