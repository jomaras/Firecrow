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
        this.globalObject = globalObject;
        this.htmlElement = htmlElement;

        //this.addProperty("source", new fcModel.JsValue(jsRegExp.source, new fcModel.FcInternal(codeConstruct)), codeConstruct);
    }
    catch(e) { this.notifyError("Error when creating HtmlElement object: " + e); }
};

fcModel.HtmlElement.prototype = new fcModel.Object(null);

fcModel.HtmlElement.prototype.notifyError = function(message) { alert("RegEx - " + message); }

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
            "attributes", "baseURI", "baseURIObject", "childElementCount", "childNodes", "children",
            "classList", "className", "clientHeight", "clientLeft", "clientTop", "clientWidth", "contentEditable",
            "dataset", "dir", "firstChild", "id", "innerHTML", "isContentEditable", "lang", "lastChild", "lastElementChild",
            "localName", "name", "namespaceURI", "nextSibling", "nextElementSibling", "nodeName", "nodePrincipal", "nodeType",
            "nodeValue", "offsetHeight", "offsetLeft", "offsetParent", "offsetTop", "offsetWidth", "outerHTML", "ownerDocument",
            "parentNode", "prefix", "previousSibling", "previousElementSibling", "schemaTypeInfo", "scrollHeight", "scrollLeft",
            "scrollTop", "scrollWidth", "spellcheck", "style", "tabIndex", "tagName", "textContent", "title"
        ]
    }
};
}});