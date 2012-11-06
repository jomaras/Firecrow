FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.DOM_PROPERTIES =
{
    DOCUMENT:
    {
        ELEMENT: ["activeElement", "body", "documentElement", "head", "mozFullScreenElement"],
        ELEMENTS: ["anchors", "embeds", "forms", "images", "links", "scripts"],
        PRIMITIVES:
        [
            "async", "characterSet", "compatMode", "contentType",
            "cookie", "designMode", "dir", "documentURI", "domain",
            "inputEncoding", "lastModified", "lastStyleSheetSet",
            "mozSyntheticDocument", "mozFullScreen", "mozFullScreenEnabled",
            "preferredStyleSheetSet", "readyState", "referrer", "selectedStyleSheetSet",
            "title", "URL", "vlinkColor"
        ],
        OTHER:
        [
            "defaultView", "location", "ownerDocument", "plugins", "readyState",
            "doctype", "implementation", "styleSheetSets", "styleSheets"
        ],
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
        UNPREDICTED: {}
    },

    NODE:
    {
        ELEMENT: ["firstChild", "lastChild", "nextSibling", "previousSibling", "parentNode", "parentElement"],
        ELEMENTS:  ["childNodes"],
        PRIMITIVES:
        [
            "baseURI", "localName", "textContent", "namespaceURI", "nodeName",
            "nodeName", "nodeType", "nodeValue", "prefix", "childElementCount"
        ],
        OTHER: ["attributes", "ownerDocument"]
    },

    ELEMENT:
    {
        ELEMENT: ["firstElementChild", "lastElementChild", "nextElementSibling", "previousElementSibling", "form", "tHead", "tFoot", "offsetParent"],
        ELEMENTS: ["children", "elements", "options", "labels", "list", "rows", "tBodies", "cells"],
        PRIMITIVES:
        [
            "className", "clientHeight", "clientLeft", "clientTop",
            "clientWidth", "contentEditable", "id", "innerHTML",
            "isContentEditable", "lang", "name", "text",
            "offsetHeight", "offsetLeft", "offsetTop", "offsetWidth",
            "outerHTML", "scrollHeight", "scrollLeft", "scrollTop", "scrollWidth",
            "spellcheck", "tabIndex", "tagName", "textContent", "title",
            "charset", "disabled", "href", "hreflang", "media", "rel", "rev", "target", "type",
            "content", "httpEquiv", "scheme", "autocomplete", "action", "acceptCharset",
            "encoding", "enctype", "length", "method", "noValidate", "autofocus", "disabled",
            "multiple", "required", "selectedIndex", "size", "validationMessage", "willValidate",
            "accept", "alt", "checked", "defaultChecked", "defaultValue", "formAction", "formEncType",
            "formMethod", "formNoValidate", "formTarget", "height", "indeterminate", "max", "maxLength",
            "min", "multiple", "pattern", "placeholder", "readOnly", "src", "useMap", "validationMessage",
            "validity", "valueAsNumber", "width", "cols", "rows", "wrap",
            "htmlFor", "hash", "coords", "host", "hreflang", "pathname", "port", "protocol", "rev", "search",
            "shape", "caption", "align", "bgColor", "border", "cellPadding", "cellSpacing", "frame", "rules",
            "summary", "ch", "chOff", "rowIndex", "sectionRowIndex", "vAlign"
        ],
        EVENT_PROPERTIES:
        [
            "oncopy", "oncut", "onpaste", "onbeforeunload", "onblur", "onchange", "onclick",
            "oncontextmenu", "ondblclick", "onfocus", "onkeydown", "onkeypress", "onkeyup",
            "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onresize",
            "onscroll", "onwheel"
        ],
        OTHER: ["dataset", "style", "classList", "files", "valueAsDate"]
    },

    setPrimitives: function(fcObject, object, names)
    {
        for(var i = 0, length = names.length; i < length; i++)
        {
            var name = names[i];
            fcObject.addProperty(name, new fcModel.JsValue(object[name], new fcModel.FcInternal()));
        }
    }
};
/*************************************************************************************/
}});