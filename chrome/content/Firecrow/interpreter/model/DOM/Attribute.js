FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.Attr = function(attr, htmlElement, globalObject, codeConstruct)
{
    try
    {
        this.initObject(this.globalObject, codeConstruct, attr);

        this.htmlElement = htmlElement;
        this.attr = attr;

        this.constructor = fcModel.Attr;

        this.addProperty("isId", new fcModel.fcValue(this.attr.isId, this.attr.isId, null), null);
        this.addProperty("localName", new fcModel.fcValue(this.attr.localName, this.attr.localName, null));
        this.addProperty("name", new fcModel.fcValue(this.attr.name, this.attr.name, null));
        this.addProperty("namespaceURI", new fcModel.fcValue(this.attr.namespaceURI, this.attr.namespaceURI, null));
        this.addProperty("nodeName", new fcModel.fcValue(this.attr.nodeName, this.attr.nodeName, null));
        this.addProperty("nodeType", new fcModel.fcValue(this.attr.nodeType, this.attr.nodeType, null));
        this.addProperty("nodeValue", new fcModel.fcValue(this.attr.nodeValue, this.attr.nodeValue, null));
        this.addProperty("specified", new fcModel.fcValue(this.attr.specified, this.attr.specified, null));
        this.addProperty("textContent", new fcModel.fcValue(this.attr.textContent, this.attr.textContent, null));
        this.addProperty("value", new fcModel.fcValue(this.attr.value, this.attr.value, null));

        this.registerAddPropertyCallback(function(propertyName, propertyValue, codeConstruct)
        {
            fcModel.HtmlElementExecutor.addDependencyIfImportantElement(this.htmlElement, this.globalObject, codeConstruct);
        }, this);

        this.getJsPropertyValue = function(propertyName, codeConstruct) { fcModel.Attr.notifyError("get property Attr not yet handled"); };
        this.addJsProperty = function(propertyName, value, codeConstruct) { fcModel.Attr.notifyError("add property Attr not yet handled"); };
    }
    catch(e) { fcModel.Attr.notifyError("Error when creating Html Attr object: " + e); }
};
fcModel.Attr.notifyError = function(message) { alert("Attr - " + message); };

fcModel.Attr.prototype = new fcModel.Object();

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
                    new fcModel.fcValue
                    (
                        attribute,
                        new fcModel.Attr(attribute, htmlElement, globalObject, codeConstruct),
                        codeConstruct
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