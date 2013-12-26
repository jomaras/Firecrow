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
            "lastModified", "lastStyleSheetSet",
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
            "validity", "valueAsNumber", "width", "cols", "rows", "wrap", "value",
            "htmlFor", "hash", "coords", "host", "hreflang", "pathname", "port", "protocol", "rev", "search",
            "shape", "caption", "align", "bgColor", "border", "cellPadding", "cellSpacing", "frame", "rules",
            "summary", "ch", "chOff", "rowIndex", "sectionRowIndex", "vAlign", "rowSpan", "rowspan", "colspan", "colSpan"
        ],
        EVENT_PROPERTIES:
        [
            "oncopy", "oncut", "onpaste", "onbeforeunload", "onblur", "onchange", "onclick",
            "oncontextmenu", "ondblclick", "onfocus", "onkeydown", "onkeypress", "onkeyup",
            "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup", "onresize",
            "onscroll", "onwheel", "click", "keydown", "keyup", "keypress", "touchstart", "touchend",
            "touchcancel", "touchleave", "touchmove", "ontouchstart", "ontouchend",
            "ontouchcancel", "ontouchleave", "ontouchmove", "selectstart", "onselectstart"
        ],
        OTHER: ["dataset", "style", "classList", "files", "valueAsDate"]
    },

    isDocumentElement: function(propertyName) { return this._isPropertyOf(this.DOCUMENT.ELEMENT, propertyName); },
    isDocumentElements: function(propertyName) { return this._isPropertyOf(this.DOCUMENT.ELEMENTS, propertyName); },
    isDocumentPrimitives: function(propertyName) { return this._isPropertyOf(this.DOCUMENT.PRIMITIVES, propertyName); },
    isDocumentOther: function(propertyName) { return this._isPropertyOf(this.DOCUMENT.OTHER, propertyName); },
    isDocumentMethod: function(propertyName) { return this._isPropertyOf(this.DOCUMENT.METHODS, propertyName); },

    isNodeElement: function(propertyName) { return this._isPropertyOf(this.NODE.ELEMENT, propertyName); },
    isNodeElements: function(propertyName) { return this._isPropertyOf(this.NODE.ELEMENTS, propertyName); },
    isNodePrimitives: function(propertyName) { return this._isPropertyOf(this.NODE.PRIMITIVES, propertyName); },
    isNodeOther: function(propertyName) { return this._isPropertyOf(this.NODE.OTHER, propertyName); },

    isElementElement: function(propertyName) { return this._isPropertyOf(this.ELEMENT.ELEMENT, propertyName); },
    isElementElements: function(propertyName) { return this._isPropertyOf(this.ELEMENT.ELEMENTS, propertyName); },
    isElementPrimitives: function(propertyName) { return this._isPropertyOf(this.ELEMENT.PRIMITIVES, propertyName); },
    isElementOther: function(propertyName) { return this._isPropertyOf(this.ELEMENT.OTHER, propertyName); },
    isElementEventProperty: function(propertyName) { return this._isPropertyOf(this.ELEMENT.EVENT_PROPERTIES, propertyName);},


    _isPropertyOf: function(array, propertyName) { return array.indexOf(propertyName) != -1; },

    setPrimitives: function(fcObject, object, names)
    {
        for(var i = 0, length = names.length; i < length; i++)
        {
            var name = names[i];
            fcObject.addProperty(name, fcObject.globalObject.internalExecutor.createInternalPrimitiveObject(null, object[name]));
        }
    }
};
/*************************************************************************************/
}});