FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.Document = function(document, globalObject)
{
    try
    {
        this.initObject(globalObject);
        ValueTypeHelper.expand(this, fcModel.EventListenerMixin);

        this.document = document;
        this.implementationObject = document;

        this.constructor = fcModel.Document;

        this.htmlElementToFcMapping = { };

        this._createDefaultProperties();
    }
    catch(e) { fcModel.Document.notifyError("Error when creating Document object: " + e); }
};
fcModel.Document.notifyError = function(message) { alert("Document: " + message);}


fcModel.Document.prototype = new fcModel.Object();

//<editor-fold desc="Access Js Properties">
fcModel.Document.prototype.addJsProperty = function(propertyName, value, codeConstruct)
{
    this.addProperty(propertyName, value, codeConstruct);

    if(fcModel.DOM_PROPERTIES.isElementEventProperty(propertyName))
    {
        this.globalObject.registerHtmlElementEventHandler
        (
            this.globalObject.document, propertyName, value,
            {
                codeConstruct: codeConstruct,
                evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()
            }
        );
    }
};

fcModel.Document.prototype.getJsPropertyValue = function(propertyName, codeConstruct)
{
    var hasBeenHandled = false;

    if (fcModel.DOM_PROPERTIES.isDocumentElement(propertyName) || fcModel.DOM_PROPERTIES.isNodeElement(propertyName))
    {
        this.addProperty(propertyName, fcModel.HtmlElementExecutor.wrapToFcElement(this.document[propertyName], this.globalObject, codeConstruct));
        hasBeenHandled = true;
    }
    else if (fcModel.DOM_PROPERTIES.isDocumentElements(propertyName) || fcModel.DOM_PROPERTIES.isNodeElements(propertyName))
    {
        this.addProperty(propertyName, this._getElements(propertyName));
        hasBeenHandled = true;
    }
    else if(fcModel.DOM_PROPERTIES.isDocumentPrimitives(propertyName) || fcModel.DOM_PROPERTIES.isNodePrimitives(propertyName))
    {
        this.addProperty(propertyName, this.getPropertyValue(propertyName, codeConstruct));
        hasBeenHandled = true;
    }
    else if(fcModel.DOM_PROPERTIES.isDocumentOther(propertyName) || fcModel.DOM_PROPERTIES.isNodeOther(propertyName))
    {
        if(propertyName == "defaultView") { return this.globalObject; }

        if (propertyName == "readyState" || propertyName == "location")
        {
            this.addProperty(propertyName, this.getPropertyValue(propertyName, codeConstruct));
            hasBeenHandled = true;
        }
        else if (propertyName == "ownerDocument" || propertyName == "attributes")
        {

        }
    }

    if(!this._isMethodName(propertyName) && !hasBeenHandled)
    {
        fcModel.DOM_PROPERTIES.DOCUMENT.UNPREDICTED[propertyName] = propertyName;
    }

    return this.getPropertyValue(propertyName, codeConstruct);
};
//</editor-fold>

//<editor-fold desc="Fetch elements">
fcModel.Document.prototype.getElementByXPath = function(xPath)
{
    if(xPath == null || xPath == "") { return new fcModel.fcValue(null, null, null);}

    var simpleXPath = (new fcModel.SimpleXPath(xPath)).removeLevel();
    var foundElement = this._getHtmlElement();

    while(!simpleXPath.isEmpty() && foundElement != null)
    {
        foundElement = this._getChild(foundElement, simpleXPath.getCurrentTag(), simpleXPath.getIndex());
        simpleXPath.removeLevel();
    }

    return fcModel.HtmlElementExecutor.wrapToFcElement(foundElement, this.globalObject, null);
};

fcModel.Document.prototype._getHtmlElement = function()
{
    for(var i = 0; i < this.document.childNodes.length; i++)
    {
        var child = this.document.childNodes[i];

        if(child.tagName != null && child.tagName.toLowerCase() == "html")
        {
            return child;
        }
    }

    return null;
};
//</editor-fold>

//<editor-fold desc="'Private' methods">
fcModel.Document.prototype._createDefaultProperties = function()
{
    fcModel.DOM_PROPERTIES.DOCUMENT.METHODS.forEach(function(method)
    {
        this.addProperty(method, this.globalObject.internalExecutor.createInternalFunction(this.document[method], method, this, true));
    }, this);

    fcModel.DOM_PROPERTIES.setPrimitives(this, this.document, fcModel.DOM_PROPERTIES.DOCUMENT.PRIMITIVES);
    fcModel.DOM_PROPERTIES.setPrimitives(this, this.document, fcModel.DOM_PROPERTIES.NODE.PRIMITIVES);

    this.addProperty("readyState", this.globalObject.internalExecutor.createInternalPrimitiveObject(null, "loading"));
    this.addProperty("location", this.globalObject.internalExecutor.createLocationObject());
};

fcModel.Document.prototype._getElements = function(propertyName, codeConstruct)
{
    var implObj = {};
    var fcObj = new fcModel.Object(this.globalObject, codeConstruct, implObj);
    var returnObj = new fcModel.fcValue(implObj, fcObj, codeConstruct);

    var items = document[propertyName];

    if(items == null) { return returnObj; }

    for(var i = items.length - 1; i >= 0; i--)
    {
        var htmlItem = items[i];
        var wrappedElement = fcModel.HtmlElementExecutor.wrapToFcElement(htmlItem, this.globalObject, codeConstruct);

        implObj[i] = wrappedElement;
        fcObj.addProperty(i, wrappedElement, codeConstruct);

        if(htmlItem.name != "")
        {
            implObj[htmlItem.name] = wrappedElement;
            fcObj.addProperty(htmlItem.name, wrappedElement, codeConstruct);
        }

        if(htmlItem.id != "")
        {
            implObj[htmlItem.id] = wrappedElement;
            fcObj.addProperty(htmlItem.id, wrappedElement, codeConstruct);
        }
    }

    fcObj.addProperty(item.length, item.length, codeConstruct);

    return returnObj;
};

fcModel.Document.prototype._getChild = function(htmlElement, tagName, index)
{
    if(htmlElement == null || htmlElement.children == null) { return null;}

    var tagChildren = [];

    for(var i = 0; i < htmlElement.children.length; i++)
    {
        var child = htmlElement.children[i];

        if(child.nodeName.toUpperCase() == tagName.toUpperCase())
        {
            tagChildren.push(child);
        }
    }

    return tagChildren[index];
};

fcModel.Document.prototype._isMethodName = function(name)
{
    return fcModel.DOM_PROPERTIES.DOCUMENT.METHODS.indexOf(name) != -1;
};
//</editor-fold>

fcModel.DocumentFunction = function(globalObject)
{
    try
    {
        this.initObject(globalObject);
        this.name = "Document";

        this.addProperty("prototype", globalObject.fcDocumentPrototype);
        this.proto = globalObject.fcFunctionPrototype;
    }
    catch(e){ fcModel.Document.notifyError("Error when creating Document Function:" + e); }
};

fcModel.DocumentFunction.prototype = new fcModel.Object();

fcModel.DocumentPrototype = function(globalObject)
{
    this.initObject(globalObject);
    this.constructor = fcModel.DocumentPrototype;
};

fcModel.DocumentPrototype.prototype = new fcModel.Object();
/**************************************************************************************/
}});