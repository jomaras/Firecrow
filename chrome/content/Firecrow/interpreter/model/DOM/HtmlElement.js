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
        this.implementationObject = this.htmlElement;

        if(this.htmlElement != null)
        {
            this.htmlElement.fcHtmlElementId = this.id;
            this.globalObject.document.htmlElementToFcMapping[this.id] = this;

            this._expandWithDefaultProperties();

            if(this.htmlElement.modelElement == null && this.htmlElement.tagName != "BODY")
            {
                //debugger;
            }
        }
    }
    catch(e) { fcModel.HtmlElement.notifyError("Error when creating HTML node: " + e); }
};

//<editor-fold desc="'Static' Methods">
fcModel.HtmlElement.accessedProperties = {};
fcModel.HtmlElement.notifyError = function(message) { debugger; alert("HtmlElement - " + message); }
//</editor-fold>

//<editor-fold desc="Prototype Definition">
fcModel.HtmlElement.prototype = new fcModel.Object();

//<editor-fold desc="JsProperty Accessors">
fcModel.HtmlElement.prototype.getJsPropertyValue = function(propertyName, codeConstruct)
{
    fcModel.HtmlElement.accessedProperties[propertyName] = true;
    var creationConstruct = this.htmlElement != null && this.htmlElement.modelElement != null ? this.htmlElement.modelElement : this.creationCodeConstruct;

    //TODO - it is a bad idea to create objects on each access, maybe utilize DOM level2 events
    //So that they are only created on attribute changed, or DOM modified!?

    var currentPropertyValue = this.getPropertyValue(propertyName, codeConstruct);

    if(this._isMethod(propertyName)) { return currentPropertyValue; }

    if(fcModel.DOM_PROPERTIES.isElementOther(propertyName) || fcModel.DOM_PROPERTIES.isNodeOther(propertyName))
    {
        if(propertyName == "ownerDocument") { return currentPropertyValue; }
        else if(propertyName == "attributes") { this.addProperty(propertyName, fcModel.Attr.createAttributeList(this.htmlElement, this.globalObject, codeConstruct), creationConstruct); }
        else if(propertyName == "style") { this.addProperty(propertyName, fcModel.CSSStyleDeclaration.createStyleDeclaration(this.htmlElement, this.htmlElement.style, this.globalObject, creationConstruct), creationConstruct); }
    }

    if(fcModel.DOM_PROPERTIES.isNodeElements(propertyName) || fcModel.DOM_PROPERTIES.isElementElements(propertyName))
    {
        var elements = this._getElements(propertyName, codeConstruct);
        var array = this.globalObject.internalExecutor.createArray(codeConstruct, elements);
        array.iValue.removePrototypeMethods();

        this.addProperty(propertyName, array, creationConstruct);

        fcModel.HtmlElementExecutor.addDependencies(elements, codeConstruct, this.globalObject);
    }

    if(fcModel.DOM_PROPERTIES.isNodeElement(propertyName) || fcModel.DOM_PROPERTIES.isElementElement(propertyName) || (ValueTypeHelper.isHtmlFormElement(this.htmlElement) && ValueTypeHelper.isHtmlElement(this.htmlElement[propertyName])))
    {
        this.addProperty(propertyName, fcModel.HtmlElementExecutor.wrapToFcElement(this.htmlElement[propertyName], this.globalObject, creationConstruct), creationConstruct);

        fcModel.HtmlElementExecutor.addDependencies(this.htmlElement[propertyName], codeConstruct, this.globalObject);
    }

    if(fcModel.DOM_PROPERTIES.isNodePrimitives(propertyName) || fcModel.DOM_PROPERTIES.isElementPrimitives(propertyName))
    {
        if(ValueTypeHelper.isPrimitive(this.htmlElement[propertyName]))
        {
            this.addProperty(propertyName, this.globalObject.internalExecutor.createInternalPrimitiveObject(creationConstruct, this.htmlElement[propertyName]), creationConstruct);
        }
        else if (ValueTypeHelper.isHtmlElement(this.htmlElement[propertyName]))
        {
            this.addProperty(propertyName, fcModel.HtmlElementExecutor.wrapToFcElement(this.htmlElement[propertyName], this.globalObject, creationConstruct), creationConstruct);
        }

        fcModel.HtmlElementExecutor.addDependencies(this.htmlElement, codeConstruct, this.globalObject);
    }

    var propertyValue = this.getPropertyValue(propertyName, codeConstruct);

    if(this._isInputElement() && propertyName == "value") { return this._expandWithSymbolic(propertyName, propertyValue); }

    return propertyValue;
};

fcModel.HtmlElement.prototype.addJsProperty = function(propertyName, propertyValue, codeConstruct, isEnumerable)
{
    try
    {
        if(propertyName == "src" && (ValueTypeHelper.isScriptElement(this.htmlElement) || ValueTypeHelper.isIFrameElement(this.htmlElement))
        && Firecrow.isIgnoredScript(propertyValue.jsValue))
        {
            //Do not write to a src property of script elements that should be skipped
        }
        else
        {
            this.htmlElement[propertyName] = propertyValue.jsValue;
        }

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

        this.globalObject.dependencyCreator.createDataDependency
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

    this.globalObject.dependencyCreator.createDataDependency(getPropertyConstruct, this.htmlElement.modelElement, evaluationPositionId);

    if(fcModel.DOM_PROPERTIES.isElementElements(propertyName) || fcModel.DOM_PROPERTIES.isNodeElements(propertyName))
    {
        var descendents = this.htmlElement[propertyName];

        if(descendents != null)
        {
            for(var i = 0; i < descendents.length; i++)
            {
                var descendant = descendents[i];

                if(descendant == null) { continue; }

                this.globalObject.dependencyCreator.createDataDependency(getPropertyConstruct, descendant.modelElement, evaluationPositionId);
            }
        }
    }
    else if (fcModel.DOM_PROPERTIES.isElementElement(propertyName) || fcModel.DOM_PROPERTIES.isNodeElement(propertyName))
    {
        var element = this.htmlElement[propertyName];

        if(element == null) { return; }

        this.globalObject.dependencyCreator.createDataDependency(getPropertyConstruct, element.modelElement, evaluationPositionId);
    }
};

fcModel.HtmlElement.prototype._expandWithDefaultProperties = function()
{
    //fcModel.DOM_PROPERTIES.setPrimitives(this, this.htmlElement, fcModel.DOM_PROPERTIES.NODE.PRIMITIVES);
    //fcModel.DOM_PROPERTIES.setPrimitives(this, this.htmlElement, fcModel.DOM_PROPERTIES.ELEMENT.PRIMITIVES);

    var creationConstruct = this.htmlElement != null && this.htmlElement.modelElement != null ? this.htmlElement.modelElement : this.creationCodeConstruct;

    this.addProperty("ownerDocument", this.globalObject.jsFcDocument, creationConstruct);
    this._addMethods(creationConstruct);

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

        this.globalObject.dependencyCreator.createDataDependency(htmlElement.modelElement, childNode.modelElement, evaluationPosition);
        this.globalObject.dependencyCreator.createDataDependency(childNode.modelElement, codeConstruct, evaluationPosition);

        if(childNode.id != null && childNode.id != "")
        {
            childNode.modelElement.dynamicIds = {};
            var codeConstructId = codeConstruct != null ? codeConstruct.nodeId : 0;
            childNode.modelElement.dynamicIds[childNode.id + codeConstructId] = {name:'id', value: childNode.id, setConstruct: codeConstruct};
        }

        if(childNode.className != null && childNode.className != "")
        {
            childNode.modelElement.dynamicClasses = {};
            var codeConstructId = codeConstruct != null ? codeConstruct.nodeId : 0;
            childNode.modelElement.dynamicClasses[childNode.className + codeConstructId] = {name:'class', value: childNode.className, setConstruct: codeConstruct};
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
    this.globalObject.dependencyCreator.createDataDependency(this.htmlElement.modelElement, codeConstruct, this.globalObject.getPreciseEvaluationPositionId());
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
        if(this.htmlElement.modelElement.dynamicIds == null) { this.htmlElement.modelElement.dynamicIds = {}; }

        var codeConstructId = codeConstruct != null ? codeConstruct.nodeId : 0;
        this.htmlElement.modelElement.dynamicIds[propertyValue.jsValue + codeConstructId] = {name:'id', value: propertyValue.jsValue, setConstruct: codeConstruct};
    }
    else if(propertyName == "className")
    {
        if(this.htmlElement.modelElement.dynamicClasses == null) { this.htmlElement.modelElement.dynamicClasses = {}; }

        var codeConstructId = codeConstruct != null ? codeConstruct.nodeId : 0;
        this.htmlElement.modelElement.dynamicClasses[propertyValue.jsValue + codeConstructId] = {name:'class', value: propertyValue.jsValue, setConstruct: codeConstruct};
    }
    else if(propertyName == "src")
    {
        this.globalObject.logResourceSetting(codeConstruct, propertyValue.jsValue);
    }
};

fcModel.HtmlElement.prototype._isInputElement = function()
{
    return ValueTypeHelper.isHtmlSelectElement(this.htmlElement)
        || ValueTypeHelper.isHtmlInputElement(this.htmlElement)
        || ValueTypeHelper.isHtmlTextAreaElement(this.htmlElement);
};

fcModel.HtmlElement.prototype._expandWithSymbolic = function(propertyName, propertyValue)
{
    if(propertyValue == null || propertyValue.iValue == null) { return; }

    propertyValue.symbolicValue = new FBL.Firecrow.ScenarioGenerator.Symbolic.Identifier(this._expandPropertyName(propertyName));

    return propertyValue;
};

fcModel.HtmlElement.prototype._expandPropertyName = function(propertyName)
{
    var eventIndex = this.globalObject.browser.eventIndex || 0;

    propertyName = "DOM_" + propertyName + "_FC_" + eventIndex;

    //format: DOM_PROPERTY_NAME_FC_EVENT_INDEX_ID_XX_CLASS_
    if(this.htmlElement.id) { propertyName += "_ID_" + this.htmlElement.id.replace(/\s+/g, ""); }
    if(this.htmlElement.className) { propertyName += "_CLASS_" + this.htmlElement.className.replace(/\s+/g, ""); }

    return propertyName;
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
            "mozMatchesSelector", "webkitMatchesSelector", "contains",
            "getContext", "reset"
        ]
    }
};
}});