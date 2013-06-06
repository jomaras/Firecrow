FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.TextNode = function(textNode, globalObject, codeConstruct)
{
    try
    {
        if(!ValueTypeHelper.isTextNode(textNode) && !ValueTypeHelper.isComment(textNode)) { fcModel.TextNode.notifyError("When creating TextNode the textNode must be of type TextNode"); return; }

        this.initObject(globalObject, codeConstruct);

        this.textNode = textNode;
        this.textNode.elementModificationPoints = [];

        this._setDefaultProperties();

        this.registerGetPropertyCallback(this._getPropertyCallback, this);
    }
    catch(e) { fcModel.TextNode.notifyError("Error when creating TextNode object: " + e); }
};

//<editor-fold desc="'Static' Methods">
fcModel.TextNode.accessedProperties = {};
fcModel.TextNode.notifyError = function(message) { fcModel.TextNode.notifyError("TextNode - " + message); };
//</editor-fold>

//<editor-fold desc="Prototype Definition">
fcModel.TextNode.prototype = new fcModel.Object();

//<editor-fold desc="Property Accessor">
fcModel.TextNode.prototype.getJsPropertyValue = function(propertyName, codeConstruct)
{
    fcModel.TextNode.accessedProperties[propertyName] = true;

    if (fcModel.DOM_PROPERTIES.isNodeElement(propertyName)) { return fcModel.HtmlElementExecutor.wrapToFcElement(this.textNode[propertyName], this.globalObject, codeConstruct) }
    else if(fcModel.DOM_PROPERTIES.isNodePrimitives(propertyName)) { return this.getPropertyValue(propertyName, codeConstruct); }
    else { fcModel.TextNode.notifyError("Text node get element property not yet handled: " + propertyName); }
};

fcModel.TextNode.prototype.addJsProperty = function(propertyName, propertyFcValue, codeConstruct)
{
    fcModel.TextNode.accessedProperties[propertyName] = true;

    if(propertyName != "textContent") { fcModel.TextNode.notifyError("Add property to text node not yet implemented"); return; }

    this.textNode[propertyName] = propertyFcValue.jsValue;
    this.addProperty(propertyName, propertyFcValue, codeConstruct);
};
    //</editor-fold>

//<editor-fold desc="'Private' methods">
fcModel.TextNode.prototype._setDefaultProperties = function()
{
    fcModel.DOM_PROPERTIES.setPrimitives(this, this.textNode, fcModel.DOM_PROPERTIES.NODE.PRIMITIVES);

    this.addProperty("ownerDocument", this.globalObject.jsFcDocument, this.creationCodeConstruct);
    this.addProperty("childNodes", this._getChildNodes(this.creationCodeConstruct), this.creationCodeConstruct);
};

fcModel.TextNode.prototype._getPropertyCallback = function(getPropertyConstruct)
{
    var evaluationPositionId = this.globalObject.getPreciseEvaluationPositionId();

    this.addDependencyToAllModifications(getPropertyConstruct, this.textNode.elementModificationPoints);

    this.globalObject.dependencyCreator.createDataDependency
    (
        getPropertyConstruct,
        this.textNode.modelElement,
        evaluationPositionId
    );
};

fcModel.TextNode.prototype._getChildNodes = function(codeConstruct)
{
    try
    {
        var childNodeList = [];
        for(var i = 0, childNodes = this.textNode.childNodes, length = childNodes.length; i < length; i++)
        {
            var childNode = childNodes[i];
            childNodeList.push
            (
                new fcModel.fcValue
                (
                    childNode,
                    new fcModel.TextNode(childNode, this.globalObject, codeConstruct),
                    codeConstruct
                )
            )
        }

        return this.globalObject.internalExecutor.createArray(codeConstruct, childNodeList);
    }
    catch(e) { this.notifyError("Error when getting child nodes:" + e);}
};

fcModel.TextNode.prototype.notifyElementInsertedIntoDom = function(callExpression){ };
    //</editor-fold>
//</editor-fold>

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
        ]
    }
};
/*************************************************************************************/
}});