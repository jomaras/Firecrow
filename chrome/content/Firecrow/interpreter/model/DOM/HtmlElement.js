FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.HtmlElement = function(htmlElement, globalObject, codeConstruct)
{
    try
    {
        this.initObject(globalObject, codeConstruct);
        ValueTypeHelper.expand(this, fcModel.EventListenerMixin);

        this.constructor = fcModel.HtmlElement;

        this.registerGetPropertyCallback(this._getPropertyHandler, this);

        this.htmlElement = htmlElement;

        if(this.htmlElement != null)
        {
            this.htmlElement.fcHtmlElementId = this.id;
            this.globalObject.document.htmlElementToFcMapping[this.id] = this;

            this._expandWithDefaultProperties();
        }
    }
    catch(e) { fcModel.HtmlElement.notifyError("Error when creating HTML node: " + e); }
};

//<editor-fold desc="'Static' Methods">
fcModel.HtmlElement.accessedProperties = {};
fcModel.HtmlElement.notifyError = function(message) { alert("HtmlElement - " + message); }
//</editor-fold>

//<editor-fold desc="Prototype Definition">
fcModel.HtmlElement.prototype = new fcModel.Object();

//<editor-fold desc="JsProperty Accessors">
fcModel.HtmlElement.prototype.getJsPropertyValue = function(propertyName, codeConstruct)
{
    fcModel.HtmlElement.accessedProperties[propertyName] = true;
    //TODO - it is a bad idea to create objects on each access, maybe utilize DOM level2 events
    //So that they are only created on attribute changed, or DOM modified!?

    if(this._isMethod(propertyName)) { return this.getPropertyValue(propertyName, codeConstruct); }

    if(fcModel.DOM_PROPERTIES.isElementOther(propertyName) || fcModel.DOM_PROPERTIES.isNodeOther(propertyName))
    {
        if(propertyName == "ownerDocument") { return this.getPropertyValue(propertyName, codeConstruct); }
        else if(propertyName == "attributes") { this.addProperty(propertyName, fcModel.Attr.createAttributeList(this.htmlElement, this.globalObject, codeConstruct), this.creationCodeConstruct); }
        else if(propertyName == "style") { this.addProperty(propertyName, fcModel.CSSStyleDeclaration.createStyleDeclaration(this.htmlElement, this.htmlElement.style, this.globalObject, this.creationCodeConstruct), this.creationCodeConstruct); }
    }

    if(fcModel.DOM_PROPERTIES.isNodeElements(propertyName) || fcModel.DOM_PROPERTIES.isElementElements(propertyName))
    {
        this.addProperty(propertyName, this.globalObject.internalExecutor.createArray(codeConstruct, this._getElements(propertyName, codeConstruct)), this.creationCodeConstruct);
    }

    if(fcModel.DOM_PROPERTIES.isNodeElement(propertyName) || fcModel.DOM_PROPERTIES.isElementElement(propertyName) || (this.htmlElement instanceof HTMLFormElement && this.htmlElement[propertyName] instanceof Element))
    {
        this.addProperty(propertyName, fcModel.HtmlElementExecutor.wrapToFcElement(this.htmlElement[propertyName], this.globalObject, this.creationCodeConstruct), this.creationCodeConstruct);
    }

    if(fcModel.DOM_PROPERTIES.isNodePrimitives(propertyName) || fcModel.DOM_PROPERTIES.isElementPrimitives(propertyName))
    {
        this.addProperty(propertyName, this.globalObject.internalExecutor.createInternalPrimitiveObject(this.creationCodeConstruct, this.htmlElement[propertyName]), this.creationCodeConstruct);
    }

    return this.getPropertyValue(propertyName, codeConstruct);
};

fcModel.HtmlElement.prototype.addJsProperty = function(propertyName, propertyValue, codeConstruct, isEnumerable)
{
    try
    {
        this.htmlElement[propertyName] = propertyValue.jsValue;

        this._createDependencies(propertyName, codeConstruct);
        this._logDynamicPropertyModification(propertyName, propertyValue, codeConstruct);

        if(propertyName == "innerHTML") { this._createModelsForDynamicChildNodes(this.htmlElement, codeConstruct); }
        else if(fcModel.DOM_PROPERTIES.isElementEventProperty(propertyName)) { this._registerEventHandler(propertyName, propertyValue, codeConstruct); }

        this.addProperty(propertyName, propertyValue, codeConstruct, isEnumerable);
    }
    catch(e) { fcModel.HtmlElement.notifyError("Error when adding property: " + e);}
};
//</editor-fold>

//<editor-fold desc="Handlers">
fcModel.HtmlElement.prototype.notifyElementInsertedIntoDom = function(callExpression)
{
    try
    {
        this.htmlElement.domInsertionPoint =
        {
            codeConstruct: callExpression,
            evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()
        };

        this.globalObject.browser.callDataDependencyEstablishedCallbacks
        (
            this.htmlElement.modelElement,
            callExpression,
            this.globalObject.getPreciseEvaluationPositionId()
        );
    }
    catch(e) { fcModel.HtmlElement.notifyError("Error when handling element inserted into dom!"); }
};
//</editor-fold>

//<editor-fold desc="'Private' Methods">
fcModel.HtmlElement.prototype._registerEventHandler = function (propertyName, propertyValue, codeConstruct)
{
    this.globalObject.registerHtmlElementEventHandler
    (
        this,
        propertyName,
        propertyValue,
        {
            codeConstruct: codeConstruct,
            evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()
        }
    );
}

fcModel.HtmlElement.prototype._getPropertyHandler = function(getPropertyConstruct, propertyName)
{
    var evaluationPositionId = this.globalObject.getPreciseEvaluationPositionId();

    this.addDependencyToAllModifications(getPropertyConstruct, this.htmlElement.elementModificationPoints);

    this.globalObject.browser.callDataDependencyEstablishedCallbacks(getPropertyConstruct, this.htmlElement.modelElement, evaluationPositionId);

    if(fcModel.DOM_PROPERTIES.isElementElements(propertyName) || fcModel.DOM_PROPERTIES.isNodeElements(propertyName))
    {
        var descendents = this.htmlElement[propertyName];

        for(var i = 0; i < descendents.length; i++)
        {
            var descendant = descendents[i];

            if(descendant == null) { continue; }

            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                getPropertyConstruct,
                descendant.modelElement,
                evaluationPositionId
            );
        }
    }
    else if (fcModel.DOM_PROPERTIES.isElementElement(propertyName) || fcModel.DOM_PROPERTIES.isNodeElement(propertyName))
    {
        var element = this.htmlElement[propertyName];

        if(element == null) { return; }

        this.globalObject.browser.callDataDependencyEstablishedCallbacks(getPropertyConstruct, element.modelElement, evaluationPositionId);
    }
};

fcModel.HtmlElement.prototype._expandWithDefaultProperties = function()
{
    //fcModel.DOM_PROPERTIES.setPrimitives(this, this.htmlElement, fcModel.DOM_PROPERTIES.NODE.PRIMITIVES);
    //fcModel.DOM_PROPERTIES.setPrimitives(this, this.htmlElement, fcModel.DOM_PROPERTIES.ELEMENT.PRIMITIVES);

    this.addProperty("ownerDocument", this.globalObject.jsFcDocument, this.creationCodeConstruct);
    this._addMethods(this.creationCodeConstruct);

    this.htmlElement.elementModificationPoints = [];
};

fcModel.HtmlElement.prototype._getElements = function(propertyName, codeConstruct)
{
    var array = [];
    var items = this.htmlElement[propertyName];

    if(items == null) { return array; }

    for(var i = 0, length = items.length; i < length; i++)
    {
        array.push(fcModel.HtmlElementExecutor.wrapToFcElement(items[i], this.globalObject, codeConstruct));
    }

    return array;
};

fcModel.HtmlElement.prototype._createModelsForDynamicChildNodes = function(htmlElement, codeConstruct)
{
    var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

    for(var i = 0; i < htmlElement.childNodes.length; i++)
    {
        var childNode = htmlElement.childNodes[i];

        childNode.creationPoint =
        {
            codeConstruct: codeConstruct,
            evaluationPositionId: evaluationPosition
        };

        childNode.modelElement = { type: childNode.nodeName.toLowerCase(), domElement: childNode , isDummyElement: true};
        this.globalObject.browser.callNodeCreatedCallbacks(childNode.modelElement, "html", true);

        this.globalObject.browser.callDataDependencyEstablishedCallbacks(htmlElement.modelElement, childNode.modelElement, evaluationPosition);
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(childNode.modelElement, codeConstruct, evaluationPosition);

        if(childNode.id != null && childNode.id != "")
        {
            childNode.modelElement.dynamicIds = [{name:'id', value: childNode.id, setConstruct: codeConstruct}];
        }

        if(childNode.className != null && childNode.className != "")
        {
            childNode.modelElement.dynamicClasses = [{name:'class', value: childNode.className, setConstruct: codeConstruct}];
        }

        this.globalObject.browser.createDependenciesBetweenHtmlNodeAndCssNodes(childNode.modelElement);
        this._createModelsForDynamicChildNodes(childNode, codeConstruct);
    }
};

fcModel.HtmlElement.prototype._addMethods = function(codeConstruct)
{
    try
    {
        var methods = fcModel.HtmlElement.CONST.INTERNAL_PROPERTIES.METHODS;

        for(var i = 0, length = methods.length; i < length; i++)
        {
            var method = methods[i];

            this.addProperty(method, this.globalObject.internalExecutor.createInternalFunction(this.htmlElement[method], method, this), codeConstruct);
        }
    }
    catch(e) { fcModel.HtmlElement.notifyError("Error when adding methods: " + e);}
};

fcModel.HtmlElement.prototype._isMethod = function(propertyName)
{
    return fcModel.HtmlElement.CONST.INTERNAL_PROPERTIES.METHODS.indexOf(propertyName) != -1;
};

fcModel.HtmlElement.prototype._createDependencies = function(propertyName, codeConstruct)
{
    this.globalObject.browser.callDataDependencyEstablishedCallbacks(this.htmlElement.modelElement, codeConstruct, this.globalObject.getPreciseEvaluationPositionId());
    fcModel.HtmlElementExecutor.addDependencyIfImportantElement(this.htmlElement, this.globalObject, codeConstruct);

    if(propertyName == "className" || propertyName == "id")
    {
        this.globalObject.browser.createDependenciesBetweenHtmlNodeAndCssNodes(this.htmlElement.modelElement);
    }
};

fcModel.HtmlElement.prototype._logDynamicPropertyModification = function(propertyName, propertyValue, codeConstruct)
{
    fcModel.HtmlElement.accessedProperties[propertyName] = true;
    this.htmlElement.elementModificationPoints.push({ codeConstruct: codeConstruct, evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()});

    if(propertyName == "id")
    {
        if(this.htmlElement.modelElement.dynamicIds == null) { this.htmlElement.modelElement.dynamicIds = []; }
        this.htmlElement.modelElement.dynamicIds.push({name:'id', value: propertyValue.jsValue, setConstruct: codeConstruct});
    }
    else if(propertyName == "className")
    {
        if(this.htmlElement.modelElement.dynamicClasses == null) { this.htmlElement.modelElement.dynamicClasses = []; }
        this.htmlElement.modelElement.dynamicClasses.push({name:'class', value: propertyValue.jsValue, setConstruct: codeConstruct});
    }
    else if(propertyName == "src")
    {
        this.globalObject.resourceSetterPropertiesMap[codeConstruct.nodeId] =
        {
            codeConstruct: codeConstruct,
            resourceValue: propertyValue.jsValue
        };
    }
};
//</editor-fold>
//</editor-fold>

//https://developer.mozilla.org/en/DOM/element
fcModel.HtmlElement.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS:
        [
            "addEventListener", "appendChild","blur", "click", "cloneNode", "compareDocumentPosition",
            "dispatchEvent", "focus", "getAttribute", "getAttributeNS", "getAttributeNode", "getAttributeNodeNS",
            "getBoundingRect", "getClientRects", "getBoundingClientRect", "getElementsByClassName", "getElementsByTagName", "getElementsByTagNameNS",
            "getFeature", "getUserData", "hasAttribute", "hasAttributeNS", "hasAttributes", "hasChildNodes", "insertBefore",
            "isDefaultNamespace", "isEqualNode", "isSameNode", "isSupported", "lookupNamespaceURI", "lookupPrefix", "mozMatchesSelector",
            "mozRequestFullScreen", "normalize", "querySelector", "querySelectorAll", "removeAttribute", "removeAttributeNS", "removeAttributeNode",
            "removeChild", "removeEventListener", "replaceChild", "scrollIntoView", "setAttribute", "setAttributeNS", "setAttributeNode",
            "setAttributeNodeNS", "setCapture", "setIdAttribute", "setIdAttributeNS", "setIdAttributeNode", "setUserData", "insertAdjacentHTML",
            "mozMatchesSelector", "webkitMatchesSelector", "contains"
        ]
    }
};
}});