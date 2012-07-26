/**
 * User: Jomaras
 * Date: 05.06.12.
 * Time: 16:03
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.Attr = function(attr, globalObject, codeConstruct)
{
    try
    {
        this.globalObject = globalObject;
        this.attr = attr;

        this.__proto__ = new fcModel.Object(this.globalObject);

        this.addProperty("isId", new fcModel.JsValue(this.attr.isId, new fcModel.FcInternal(null)), null);
        this.addProperty("localName", new fcModel.JsValue(this.attr.localName, new fcModel.FcInternal(null)), null);
        this.addProperty("name", new fcModel.JsValue(this.attr.name, new fcModel.FcInternal(null)), null);
        this.addProperty("namespaceURI", new fcModel.JsValue(this.attr.namespaceURI, new fcModel.FcInternal(null)), null);
        this.addProperty("nodeName", new fcModel.JsValue(this.attr.nodeName, new fcModel.FcInternal(null)), null);
        this.addProperty("nodeType", new fcModel.JsValue(this.attr.nodeType, new fcModel.FcInternal(null)), null);
        this.addProperty("nodeValue", new fcModel.JsValue(this.attr.nodeValue, new fcModel.FcInternal(null)), null);
        this.addProperty("specified", new fcModel.JsValue(this.attr.specified, new fcModel.FcInternal(null)), null);
        this.addProperty("textContent", new fcModel.JsValue(this.attr.textContent, new fcModel.FcInternal(null)), null);
        this.addProperty("value", new fcModel.JsValue(this.attr.value, new fcModel.FcInternal(null)), null);

        this.notifyError = function(message) { alert("Attr - " + message); }
    }
    catch(e) { this.notifyError("Error when creating HtmlElement object: " + e); }
};
Firecrow.Interpreter.Model.Attr.notifyError = function(message) { alert("Attr - " + message); }

fcModel.Attr.prototype = new fcModel.Object(null);

fcModel.Attr.createAttributeList = function(htmlElement, globalObject, codeConstruct)
{
    try
    {
        if(!ValueTypeHelper.isOfType(htmlElement, HTMLElement) && !ValueTypeHelper.isOfType(htmlElement, DocumentFragment)) { Firecrow.Interpreter.Model.Attr.notifyError("Attr - when creating attribute list, the argument has to be an HTMLElement!"); }

        var attributeList = [];
        var attributes = htmlElement.attributes;

        if(attributes != null)
        {
            for(var i = 0, length = attributes.length; i < length; i++)
            {
                var attribute = attributes[i];
                attributeList.push
                (
                    new fcModel.JsValue
                    (
                        attribute,
                        new fcModel.FcInternal
                        (
                            codeConstruct,
                            new fcModel.Attr(attribute, globalObject, codeConstruct)
                        )
                    )
                );
            }
        }

        return globalObject.internalExecutor.createArray(codeConstruct, attributeList);
    }
    catch(e) { Firecrow.Interpreter.Model.Attr.notifyError("Attr - error when creating attribute list:" + e); }
};

//https://developer.mozilla.org/en/DOM/element
fcModel.Attr.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS:
        [

        ],
        PROPERTIES:
        [
            "childNodes", "firstChild", "isId", "lastChild", "localName", "name", "namespaceURI",
            "nextSibling", "nodeName", "nodeType", "nodeValue", "ownerDocument", "ownerElement", "parentElement",
            "parentNode", "prefix", "previousSibling", "specified", "textContent", "value"
        ]
    }
};
}});