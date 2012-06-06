/**
 * User: Jomaras
 * Date: 06.06.12.
 * Time: 11:12
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.TextNode = function(textNode, globalObject, codeConstruct)
{
    try
    {
        if(!ValueTypeHelper.isOfType(textNode, Text)) { this.notifyError("When creating TextNode the textNode must be of type TextNode"); return; }

        this.globalObject = globalObject;
        this.textNode = textNode;

        this.setChildRelatedProperties(codeConstruct);
        this.addPrimitiveProperties(textNode, codeConstruct);
    }
    catch(e) { this.notifyError("Error when creating TextNode object: " + e); }
};

fcModel.TextNode.prototype = new fcModel.Object(null);

fcModel.TextNode.prototype.setChildRelatedProperties = function(codeConstruct)
{
    this.addProperty.call(this, "childNodes", this.getChildNodes(codeConstruct), codeConstruct);
}

fcModel.TextNode.prototype.addPrimitiveProperties = function(textNode, codeConstruct)
{
    try
    {
        var primitiveProperties = fcModel.TextNode.CONST.INTERNAL_PROPERTIES.PRIMITIVE_PROPERTIES;

        for(var i = 0, length = primitiveProperties.length; i < length; i++)
        {
            var propertyName = primitiveProperties[i];

            this.addProperty(propertyName, new fcModel.JsValue(textNode[propertyName], new fcModel.FcInternal(codeConstruct)), codeConstruct);
        }
    }
    catch(e) { this.notifyError("Error when adding primitive properties:" + e); }
};

fcModel.TextNode.prototype.getChildNodes = function(codeConstruct)
{
    try
    {
        var childNodeList = [];
        for(var i = 0, childNodes = this.textNode.childNodes, length = childNodes.length; i < length; i++)
        {
            var childNode = childNodes[i];
            childNodeList.push
            (
                new fcModel.JsValue
                (
                    childNode,
                    new fcModel.FcInternal(codeConstruct, new fcModel.TextNode(childNode, this.globalObject, codeConstruct))
                )
            )
        }

        return this.globalObject.internalExecutor.createArray(codeConstruct, childNodeList);
    }
    catch(e) { this.notifyError("Error when getting child nodes:" + e);}
}

fcModel.TextNode.prototype.notifyError = function(message) { alert("TextNode - " + message); }

//https://developer.mozilla.org/en/DOM/element
fcModel.TextNode.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS:
        [
            "addEventListener", "removeEventListener", "dispatchEvent", "splitText",
            "insertBefore","replaceChild","removeChild","appendChild","hasChildNodes",
            "cloneNode","normalize","isSupported","hasAttributes",
            "compareDocumentPosition","lookupPrefix","isDefaultNamespace","lookupNamespaceURI",
            "isEqualNode","setUserData","getUserData","contains","substringData",
            "appendData","insertData","deleteData","replaceData"
        ],

        PROPERTIES:
        [
            "constructor", "baseURI", "childNodes", "length", "lastChild", "lastElementChild",
            "localName", "name", "namespaceURI", "nextSibling", "nextElementSibling", "nodeName",
            "nodePrincipal", "nodeType", "nodeValue", "ownerDocument", "wholeText",
            "parentNode", "prefix", "spellcheck", "tagName", "textContent", "title"
        ],
        PRIMITIVE_PROPERTIES:
        [
            "baseURI", "isContentEditable", "length", "localName", "name", "namespaceURI", "nodeName", "nodeType",
            "nodeValue", "prefix", "schemaTypeInfo", "spellcheck", "tabIndex", "tagName", "textContent", "title",
            "wholeText"
        ],
        COMPLEX_PROPERTIES:
        [
            "attributes","childNodes", "children", "classList", "dataset", "firstChild", "lastChild",
            "lastElementChild", "nextSibling", "nextElementSibling", "nodePrincipal", "offsetParent",
            "ownerDocument", "parentNode", "previousSibling", "previousElementSibling", "style"
        ]
    }
};
}});