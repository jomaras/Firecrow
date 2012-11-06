FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.Attr = function(attr, htmlElement, globalObject, codeConstruct)
{
    try
    {
        this.__proto__ = new fcModel.Object(this.globalObject, codeConstruct, attr);

        this.htmlElement = htmlElement;
        this.attr = attr;

        this.constructor = fcModel.Attr;

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

        this.registerAddPropertyCallback(function(propertyName, propertyValue, codeConstruct)
        {
            fcModel.HtmlElementExecutor.addDependencyIfImportantElement(this.htmlElement, this.globalObject, codeConstruct);
        }, this);

        this.getJsPropertyValue = function(propertyName, codeConstruct) { fcModel.Attr.notifyError("get property Attr not yet handled"); };
        this.addJsProperty = function(propertyName, value, codeConstruct) { fcModel.Attr.notifyError("add property Attr not yet handled"); };
    }
    catch(e) { fcModel.Attr.notifyError("Error when creating Html Attr object: " + e); }
};
fcModel.Attr.notifyError = function(message) { alert("Attr - " + message); }

fcModel.Attr.createAttributeList = function(htmlElement, globalObject, codeConstruct)
{
    try
    {
        if(!ValueTypeHelper.isOfType(htmlElement, HTMLElement) && !ValueTypeHelper.isOfType(htmlElement, DocumentFragment))  {  fcModel.Attr.notifyError("Attr - when creating attribute list, the argument has to be an HTMLElement!"); }

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
                            new fcModel.Attr(attribute, htmlElement, globalObject, codeConstruct)
                        )
                    )
                );
            }
        }

        return globalObject.internalExecutor.createArray(codeConstruct, attributeList);
    }
    catch(e) { fcModel.Attr.notifyError("Attr - error when creating attribute list:" + e); }
};

//https://developer.mozilla.org/en/DOM/element
fcModel.Attr.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS:[],
        PROPERTIES:
        [
            "childNodes", "firstChild", "isId", "lastChild", "localName", "name", "namespaceURI",
            "nextSibling", "nodeName", "nodeType", "nodeValue", "ownerDocument", "ownerElement", "parentElement",
            "parentNode", "prefix", "previousSibling", "specified", "textContent", "value"
        ]
    }
};
}});