FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.TextNode = function(textNode, globalObject, codeConstruct)
{
    try
    {
        if(!ValueTypeHelper.isOfType(textNode, Text) && !ValueTypeHelper.isOfType(textNode, Comment)) { alert("When creating TextNode the textNode must be of type TextNode"); return; }

        for(var prop in fcModel.TextNodeProto)
        {
            this[prop] = fcModel.TextNodeProto[prop];
        }

        this.globalObject = globalObject;
        this.textNode = textNode;
        this.__proto__ = new fcModel.Object(globalObject);

        this.textNode.elementModificationPoints = [];

        fcModel.DOM_PROPERTIES.setPrimitives(this, this.textNode, fcModel.DOM_PROPERTIES.NODE.PRIMITIVES);
        this.addProperty("ownerDocument", this.globalObject.jsFcDocument, codeConstruct);

        this.setChildRelatedProperties(codeConstruct);

        this.registerGetPropertyCallback(function(getPropertyConstruct)
        {
            var evaluationPositionId = this.globalObject.getPreciseEvaluationPositionId();

            this.addDependenciesToAllModifications(getPropertyConstruct);

            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                getPropertyConstruct,
                this.textNode.modelElement,
                evaluationPositionId
            );
        }, this);
    }
    catch(e) { alert("Error when creating TextNode object: " + e); }
};

fcModel.TextNode.prototype = new fcModel.Object(null);

fcModel.TextNodeProto =
{
    addDependenciesToAllModifications: function(codeConstruct)
    {
        try
        {
            if(codeConstruct == null) { return; }

            var modifications = this.textNode.elementModificationPoints;

            if(modifications == null || modifications.length == 0) { return; }

            var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

            for(var i = 0, length = modifications.length; i < length; i++)
            {
                var modification = modifications[i];

                this.globalObject.browser.callDataDependencyEstablishedCallbacks
                (
                    codeConstruct,
                    modification.codeConstruct,
                    evaluationPosition,
                    modification.evaluationPositionId
                );
            }
        }
        catch(e)
        {
            this.notifyError("Error when adding dependencies to all modifications " + e);
        }
    },

    setChildRelatedProperties: function(codeConstruct)
    {
        this.addProperty("childNodes", this.getChildNodes(codeConstruct), codeConstruct);
    },

    addPrimitiveProperties: function(textNode, codeConstruct)
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
    },

    getChildNodes: function(codeConstruct)
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
    },

    getJsPropertyValue: function(propertyName, codeConstruct)
    {
        fcModel.TextNode.accessedProperties[propertyName] = true;

        if (fcModel.DOM_PROPERTIES.NODE.ELEMENT.indexOf(propertyName) != -1)
        {
            return fcModel.HtmlElementExecutor.wrapToFcElement(this.textNode[propertyName], this.globalObject, codeConstruct)
        }
        else if(fcModel.DOM_PROPERTIES.NODE.PRIMITIVES.indexOf(propertyName) != -1)
        {
            return this.getPropertyValue(propertyName, codeConstruct);
        }
        else
        {
            alert("Text node get element property not yet handled: " + propertyName);
        }
    },

    addJsProperty: function(propertyName, propertyJsValue, codeConstruct)
    {
        fcModel.TextNode.accessedProperties[propertyName] = true;

        if(propertyName == "textContent")
        {
            this.textNode[propertyName] = propertyJsValue.value;
            this.addProperty(propertyName, propertyJsValue, codeConstruct);
            return;
        }

        alert("add property to text node not yet implemented");
    },

    notifyElementInsertedIntoDom: function(callExpression)
    {},

    notifyError: function(message) { alert("TextNode - " + message); }
};
fcModel.TextNode.accessedProperties = {};
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
}});