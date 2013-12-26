FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.GlobalObject = function(browser)
{
    try
    {
        this.initObject(this);

        this._expandToFcValue();
        ValueTypeHelper.expand(this, fcModel.EventListenerMixin);

        Firecrow.Interpreter.Simulator.VariableObject.liftToVariableObject(this);

        this.internalExecutor = new Firecrow.Interpreter.Simulator.InternalExecutor(this);

        this._setExecutionEnvironment(browser);
        this._detectExecutionEnvironmentProperties();

        this._createInternalPrototypes();
        this._createInternalObjects();
        this._createInternalVariables();
        this._createInternalFunctions();

        this._createSlicingVariables();

        this._createHandlerMaps();

        this._createEvaluationPositionProperties();

        this._EXECUTION_COMMAND_COUNTER = 0;
        this.TIMEOUT_ID_COUNTER = 0;
        this.DYNAMIC_NODE_COUNTER = 0;
    }
    catch(e)
    {
        fcModel.GlobalObject.notifyError("Error when initializing global object:" + e + ";; " + e.stack);
    }
};

//<editor-fold desc="'Static' properties">
fcModel.GlobalObject.notifyError = function(message) { debugger; alert("GlobalObject - " + message); }
fcModel.GlobalObject.CONST =
{
    INTERNAL_PROPERTIES:
    {
        METHODS :
        [
            "decodeURI", "decodeURIComponent", "encodeURI",
            "encodeURIComponent", "eval", "isFinite", "isNaN",
            "parseFloat", "parseInt", "addEventListener", "removeEventListener",
            "setTimeout", "clearTimeout", "setInterval", "clearInterval",
            "getComputedStyle", "unescape", "escape",
            //Testing methods
            "assert", "assertEquals", "assertMatch", "assertNull", "assertNotNull", "assertEqual", "assertNotEquals"
        ],
        EVENT_PROPERTIES:
        [
            "onabort", "onbeforeunload", "onblur", "onchange", "onclick", "onclose",
            "oncontextmenu", "ondevicemotion", "ondeviceorientation", "ondragdrop",
            "onerror", "onfocus", "onhaschange", "onkeydown", "onkeypress", "onkeyup",
            "onload", "onmousedown", "onmousemove", "onmouseout", "onmouseover", "onmouseup",
            "onmozbeforepaint", "onpaint", "onpopstate", "onreset", "onresize", "onscroll",
            "onselect", "onsubmit", "onunload", "onpageshow", "onpagehide"
        ]
    },
    isMethod: function(methodName) { return this.INTERNAL_PROPERTIES.METHODS.indexOf(methodName) != -1; },
    isEventProperty: function(propertyName) { return this.INTERNAL_PROPERTIES.EVENT_PROPERTIES.indexOf(propertyName) != -1; }
};
//</editor-fold>

fcModel.GlobalObject.prototype = new fcModel.Object();

//<editor-fold desc="Property Accessors">
fcModel.GlobalObject.prototype.getJsPropertyValue = function(propertyName, codeConstruct)
{
    var propertyValue = this.getPropertyValue(propertyName, codeConstruct);

    if(propertyValue === undefined) { this.browser.logAccessingUndefinedProperty(propertyName, codeConstruct); }

    return propertyValue;
};

fcModel.GlobalObject.prototype.addJsProperty = function(propertyName, value, codeConstruct)
{
    this.addProperty(propertyName, value, codeConstruct);

    if(fcModel.GlobalObject.CONST.isEventProperty(propertyName))
    {
        this.eventHandlerPropertiesMap[propertyName] = codeConstruct;
    }
};
//</editor-fold>

//<editor-fold desc="Event Handling">
fcModel.GlobalObject.prototype.registerTimeout = function(timeoutId, handler, timePeriod, callArguments, registrationPoint)
{
    this.timeoutHandlers.push
    ({
        timeoutId: timeoutId,
        handler: handler,
        timePeriod: timePeriod,
        callArguments: callArguments,
        registrationPoint: registrationPoint,
        registrationConstruct: registrationPoint.codeConstruct,
        handlerConstruct: handler.codeConstruct,
        thisObject: this.globalObject,
        eventType: "timeout",
        thisObjectDescriptor: "window",
        thisObjectModel: "window"
    });

    this.browser.executionInfo.logEventRegistered
    (
        "window",
        "window",
        "timeout",
        registrationPoint.codeConstruct,
        handler.codeConstruct,
        this.browser.loadingEventsExecuted,
        timeoutId,
        timePeriod
    );
};

fcModel.GlobalObject.prototype.unregisterTimeout = function(timeoutId, codeConstruct)
{
    if(timeoutId == null) { return; }

    for(var i = 0; i < this.timeoutHandlers.length; i++)
    {
        if(this.timeoutHandlers[i].timeoutId == timeoutId)
        {
            this.dependencyCreator.createDataDependency
            (
                this.timeoutHandlers[i].registrationPoint.codeConstruct,
                codeConstruct,
                this.timeoutHandlers[i].registrationPoint.evaluationPositionId,
                this.getPreciseEvaluationPositionId()
            );

            ValueTypeHelper.removeFromArrayByIndex(this.timeoutHandlers, i);
            return;
        }
    }
};

fcModel.GlobalObject.prototype.preRegisterAjaxEvent = function(baseObject, registrationPoint)
{
    this.ajaxPreregistrations.push({
        baseObject: baseObject,
        registrationPoint: registrationPoint
    });
};

fcModel.GlobalObject.prototype.registerPreRegisteredAjaxEvents = function()
{
    for(var i = 0; i < this.ajaxPreregistrations.length; i++)
    {
        var ajaxPreregistration = this.ajaxPreregistrations[i];

        this.registerAjaxEvent
        (
            ajaxPreregistration.baseObject,
            ajaxPreregistration.baseObject.getPropertyValue("onreadystatechange"),
            ajaxPreregistration.registrationPoint
        );
    }

    this.ajaxPreregistrations = [];
};

fcModel.GlobalObject.prototype.registerAjaxEvent = function(baseObject, handler, registrationPoint)
{
    //the onreadystatechange property does not have to be set before the
    this.ajaxHandlers.push
    ({
        thisObject: baseObject,
        ajaxObject: baseObject,
        handler: handler,
        registrationPoint: registrationPoint,
        registrationConstruct: registrationPoint.codeConstruct,
        handlerConstruct: handler.codeConstruct,
        eventType: "onreadystatechange",
        thisObjectDescriptor: "ajax",
        thisObjectModel: "ajax"
    });

    this.browser.executionInfo.logEventRegistered
    (
        "ajax",
        "ajax",
        "onreadystatechange",
        registrationPoint.codeConstruct,
        handler.codeConstruct,
        this.browser.loadingEventsExecuted
    );
};

fcModel.GlobalObject.prototype.registerInterval = function(intervalId, handler, timePeriod, callArguments, registrationPoint)
{
    this.intervalHandlers.push
    ({
        intervalId: intervalId,
        handler: handler,
        timePeriod: timePeriod,
        callArguments: callArguments,
        registrationPoint: registrationPoint,
        registrationConstruct: registrationPoint.codeConstruct,
        handlerConstruct: handler.codeConstruct,
        thisObject: this.globalObject,
        eventType: "interval",
        thisObjectDescriptor: "window",
        thisObjectModel: "window"
    });

    this.browser.executionInfo.logEventRegistered
    (
        "window",
        "window",
        "interval",
        registrationPoint.codeConstruct,
        handler.codeConstruct,
        this.browser.loadingEventsExecuted,
        intervalId,
        timePeriod
    );
};

fcModel.GlobalObject.prototype.unregisterInterval = function(intervalId, codeConstruct)
{
    if(intervalId == null) { return; }

    for(var i = 0; i < this.intervalHandlers.length; i++)
    {
        if(this.intervalHandlers[i].intervalId == intervalId)
        {
            var dependencyCreationInfo = this.getPreciseEvaluationPositionId();
            dependencyCreationInfo.shouldAlwaysBeFollowed = true;

            this.dependencyCreator.createDataDependency
            (
                this.intervalHandlers[i].registrationPoint.codeConstruct,
                codeConstruct,
                dependencyCreationInfo,
                this.getPreciseEvaluationPositionId()
            );

            ValueTypeHelper.removeFromArrayByIndex(this.intervalHandlers, i);

            return;
        }
    }

    this.browser.executionInfo.logEventDeRegistered(null, "interval", codeConstruct, intervalId);
};

fcModel.GlobalObject._EVENT_HANDLER_REGISTRATION_POINT_LAST_ID = 0;
fcModel.GlobalObject.prototype.registerHtmlElementEventHandler = function(fcHtmlElement, eventType, handler, evaluationPosition)
{
    var eventDescriptor =
    {
        fcHtmlElement: fcHtmlElement,
        eventType: eventType,
        handler: handler,
        registrationPoint: evaluationPosition,
        registrationConstruct: evaluationPosition.codeConstruct,
        handlerConstruct: handler.codeConstruct,
        thisObject: fcHtmlElement,
        id: fcModel.GlobalObject._EVENT_HANDLER_REGISTRATION_POINT_LAST_ID++,
        thisObjectModel: this._getEventObjectModel(fcHtmlElement),
        thisObjectDescriptor: this._getEventObjectDescriptor(fcHtmlElement),
        thisObjectCssSelector: this._getEventObjectCssSelector(fcHtmlElement)
    };

    this.htmlElementEventHandlingRegistrations.push(eventDescriptor);

    this.browser.executionInfo.logEventRegistered
    (
        eventDescriptor.thisObjectDescriptor,
        eventDescriptor.thisObjectModel,
        eventType,
        evaluationPosition.codeConstruct,
        handler.codeConstruct,
        this.browser.loadingEventsExecuted,
        null,
        null,
        eventDescriptor.thisObjectCssSelector
    );
};


fcModel.GlobalObject.prototype._getEventObjectDescriptor = function(eventObject)
{
    if(eventObject.globalObject.document == eventObject) { return "document"; }
    if(eventObject.htmlElement != null) { return Firecrow.htmlHelper.getElementXPath(eventObject.htmlElement); }
    if(eventObject.globalObject == eventObject) { return "window"; }

    debugger;

    return "unknown base object in event";
};

fcModel.GlobalObject.prototype._getEventObjectCssSelector = function(eventObject)
{
    if(eventObject.globalObject.document == eventObject) { return "document"; }
    if(eventObject.globalObject == eventObject) { return "window"; }
    if(eventObject.htmlElement != null)
    {
        if(eventObject.htmlElement.nodeName == null) { debugger; }
        var type = eventObject.htmlElement.nodeName.toLowerCase();
        var id = eventObject.htmlElement.id;
        var classes = eventObject.htmlElement.className.replace(/(\s)+/g, ".")

        return type + (id != null && id != "" ? ("#" + id) : "")
                    + (classes != null && classes != "" ? ("." + classes) : "");
    }

    debugger;

    return "unknown base object in event";
};

fcModel.GlobalObject.prototype._getEventObjectModel = function(eventObject)
{
    if(eventObject.htmlElement != null) { return eventObject.htmlElement.modelElement; }
    if(eventObject.globalObject.document == eventObject) { return "document"; }
    if(eventObject.globalObject == eventObject) { return "window"; }

    debugger;

    return null;
};
//</editor-fold>

//<editor-fold desc="'Public' methods">
fcModel.GlobalObject.prototype.isPrimitive = function() { return false; }

fcModel.GlobalObject.prototype.getSimplifiedUserSetGlobalProperties = function()
{
    return this.convertToSimplifiedUserSetProperties(this.getUserSetGlobalProperties());

};

fcModel.GlobalObject.prototype.convertToSimplifiedUserSetProperties = function(properties)
{
    var simplifiedProperties = [];

    for(var i = 0; i < properties.length; i++)
    {
        var property = properties[i];
        simplifiedProperties.push
        ({
            name: property.name,
            declarationConstructId: property.declarationPosition.codeConstruct != null
                                  ? property.declarationPosition.codeConstruct.nodeId
                                  : -1,
            isEventProperty: fcModel.GlobalObject.CONST.isEventProperty(property.name)
        });
    }

    return simplifiedProperties;
};

fcModel.GlobalObject.prototype.getUserSetGlobalProperties = function()
{
    var userSetGlobalProperties = [];

    for(var i = 0; i < this.properties.length; i++)
    {
        var property = this.properties[i];

        if(property.declarationPosition == null) { continue; }

        userSetGlobalProperties.push(property);
    }

    return userSetGlobalProperties;
};

fcModel.GlobalObject.prototype.getSimplifiedEventHandlerPropertiesMap = function()
{
    var simplifiedEventHandlerPropertiesMap = {};

    for(var handlerName in this.eventHandlerPropertiesMap)
    {
        simplifiedEventHandlerPropertiesMap[handlerName] = this.eventHandlerPropertiesMap[handlerName].nodeId;
    }

    return simplifiedEventHandlerPropertiesMap;
}

fcModel.GlobalObject.prototype.getSimplifiedUserSetDocumentProperties = function()
{
    return this.convertToSimplifiedUserSetProperties(this.document.getUserDefinedProperties());
};

fcModel.GlobalObject.prototype.getUserSetDocumentProperties = function()
{
    return this.document.getUserDefinedProperties();
};

fcModel.GlobalObject.prototype.logCallbackExecution = function(callbackConstruct, callCallbackConstruct)
{
    if(callbackConstruct == null) { return; }

    this.browser.callCallbackCalledCallbacks(callbackConstruct, callCallbackConstruct, this.getPreciseEvaluationPositionId());
};

fcModel.GlobalObject.prototype.logResourceSetting = function(codeConstruct, resourcePath)
{
    this.browser.logResourceSetting(codeConstruct, resourcePath);
};

fcModel.GlobalObject.prototype.logForInIteration = function(codeConstruct, objectPrototype)
{
    this.browser.logForInIteration(codeConstruct, objectPrototype);
};

fcModel.GlobalObject.prototype.getLoadedHandlers = function()
{
    return this.getDOMContentLoadedHandlers().concat(this.getOnLoadFunctions());
};

fcModel.GlobalObject.prototype.simpleDependencyEstablished = function(fromConstruct, toConstruct)
{
    this.browser.simpleDependencyEstablished(fromConstruct, toConstruct);
};

fcModel.GlobalObject.prototype.getDOMContentLoadedHandlers = function()
{
    if(this.document == null || this.document.getEventListeners == null) { return this.getEventListeners("DOMContentLoaded"); }

    return this.document.getEventListeners("DOMContentLoaded").concat(this.getEventListeners("DOMContentLoaded"));
};

fcModel.GlobalObject.prototype.getOnLoadFunctions = function()
{
    var onLoadFunctions =  this.getEventListeners("load");
    var onLoadFunction = this.getPropertyValue("onload");

    if(onLoadFunction != null && onLoadFunction.jsValue != null)
    {
        var registrationPoint = this.getProperty("onload").lastModificationPosition;
        onLoadFunctions.push
        ({
            handler: onLoadFunction,
            registrationPoint: registrationPoint,
            eventType: "onload",
            thisObject: this,
            registrationConstruct: registrationPoint.codeConstruct,
            handlerConstruct: onLoadFunction.codeConstruct,
            thisObjectDescriptor: "window",
            thisObjectModel: "window"
        });
    }
    else //if window.onload is not set check the body element onload attribute
    {

    }

    return onLoadFunctions;
};

fcModel.GlobalObject.prototype.destruct = function()
{
    this._retractFromFcValue();
    this._removeExecutionEnvironment();

    this._deleteInternalPrototypes();
    this._deleteInternalFunctions();
    this._deleteHandlerMaps();
    this._deleteInternalObjects();
    this._deleteInternalPrototypes();

    this.deconstructObject();
};

fcModel.GlobalObject.prototype.getJsValues = function(internalValues)
{
    var jsValues = [];

    for(var i = 0; i < internalValues.length; i++)
    {
        jsValues.push(internalValues[i].jsValue);
    }

    return jsValues;
},
//</editor-fold>

//<editor-fold desc="Evaluation Position">
fcModel.GlobalObject.prototype.getPreciseEvaluationPositionId = function()
{
    return {
        groupId : this.evaluationPositionId,
        currentCommandId : (this.currentCommand != null ? this.currentCommand.executionId : "0")
    };
};

fcModel.GlobalObject.prototype.getPrecisePreviousEvaluationPositionId = function()
{
    return {
        groupId : this.evaluationPositionId,
        currentCommandId : (this.currentCommand != null ? this.currentCommand.executionId-1 : "0")
    };
};

fcModel.GlobalObject.prototype.getReturnExpressionPreciseEvaluationPositionId = function()
{
    var evaluationPositionId = this.getPreciseEvaluationPositionId();
    evaluationPositionId.isReturnDependency = true;

    var offset = null;
    evaluationPositionId.groupId.replace(/-[0-9]+f/g, function(match)
    {
        offset = arguments[arguments.length - 2];
    });

    if(offset)
    {
        evaluationPositionId.groupId = evaluationPositionId.groupId.substring(0, offset);
    }

    return evaluationPositionId;
};

fcModel.GlobalObject.prototype.setCurrentCommand = function(command)
{
    if(command == null) { fcModel.GlobalObject.notifyError("Command can not be null!");}

    this.currentCommand = command;
    this.currentCommand.executionId = this._EXECUTION_COMMAND_COUNTER++;
};

fcModel.GlobalObject.prototype._createEvaluationPositionProperties = function()
{
    this.evaluationPositionId = "root";
    this.currentCommand = null;
};
//</editor-fold>

//<editor-fold desc="Slicing Criteria">
fcModel.GlobalObject.prototype.registerSlicingCriteria = function(slicingCriteria)
{
    if(slicingCriteria == null) { return; }

    this.identifierSlicingCriteria = [];
    this.domModificationSlicingCriteria = [];

    for(var i = 0; i < slicingCriteria.length; i++)
    {
        var criterion = slicingCriteria[i];

        if(criterion.type == "READ_IDENTIFIER") { this.identifierSlicingCriteria.push(criterion); }
        else if (criterion.type == "DOM_MODIFICATION")
        {
            if(criterion.cssSelector === "all") { this.includeAllDomModifications = true; }
            this.domModificationSlicingCriteria.push(criterion);
        }
    }
};

fcModel.GlobalObject.prototype.satisfiesDomSlicingCriteria = function(htmlElement)
{
    try
    {
        if(htmlElement == null || htmlElement instanceof Text) { return false; }
        if(this.domModificationSlicingCriteria.length == 0) { return false; }

        if(this.includeAllDomModifications) { return true; }

        for(var i = 0; i < this.domModificationSlicingCriteria.length; i++)
        {
            var element = htmlElement;

            while(element != null)
            {
                if(this.browser.matchesSelector(element, this.domModificationSlicingCriteria[i].cssSelector))
                {
                    return true;
                }

                element = element.parentElement;
            }
        }
    }
    catch(e) { fcModel.GlobalObject.notifyError("Global object error when checking if satisfies dom slicing: " + e);}

    return false;
};

fcModel.GlobalObject.prototype.satisfiesIdentifierSlicingCriteria = function(codeConstruct)
{
    if(codeConstruct == null || this.identifierSlicingCriteria.length == 0) { return false; }

    for(var i = 0; i < this.identifierSlicingCriteria.length; i++)
    {
        var slicingCriterion = this.identifierSlicingCriteria[i];

        //if(slicingCriterion.fileName != codeConstruct.loc.source) { continue; }
        //TODO - uncomment this!
        //if(slicingCriterion.lineNumber != codeConstruct.loc.start.line) { continue; }
        if(slicingCriterion.identifierName != codeConstruct.name) { continue; }

        return true;
    }

    return false;
};

fcModel.GlobalObject.prototype._createSlicingVariables = function()
{
    this.identifierSlicingCriteria = [];
    this.domModificationSlicingCriteria = [];
    this.includeAllDomModifications = false;
};
//</editor-fold>

//<editor-fold desc="'Private methods'">
fcModel.GlobalObject.prototype._expandToFcValue = function()
{
    this.iValue = this;
    this.jsValue = this;
    this.codeConstruct = null;

    this.isFunction = function() { return false; };
    this.isPrimitive = function() { return false; };
    this.isSymbolic = function() { return false; }
    this.isNotSymbolic = function() { return true; }
};

fcModel.GlobalObject.prototype._retractFromFcValue = function()
{
    delete this.iValue;
    delete this.jsValue;
    delete this.codeConstruct;

    delete this.isFunction;
    delete this.isPrimitive;
    delete this.isSymbolic;
    delete this.isNotSymbolic;
};

fcModel.GlobalObject.prototype._setExecutionEnvironment = function(browser)
{
    this.browser = browser;

    this.origWindow = Firecrow.getWindow();
    this.origDocument = Firecrow.getDocument();

    this.origWindow.assert = function assert(){};
    this.origWindow.assertEquals = function assertEquals(){};
    this.origWindow.assertEqual = function assertEqual(){};
    this.origWindow.assertMatch = function assertMatch(){};
    this.origWindow.assertNull = function assertNull(){};
    this.origWindow.assertNotNull = function assertNotNull(){};
    this.origWindow.assertNotEquals = function assertNotEquals(){};
};

fcModel.GlobalObject.prototype._detectExecutionEnvironmentProperties = function()
{
    this.throwsExceptionOnPushWithNodeList = (function()
    {
        try
        {
            Array.prototype.push.apply([], this.origDocument.childNodes);
            return false;
        }
        catch(e)
        {
            return true;
        }
    }).call(this);
};

fcModel.GlobalObject.prototype._removeExecutionEnvironment = function()
{
    delete this.browser;

    delete this.origWindow;
    delete this.origDocument;
};

fcModel.GlobalObject.prototype._createInternalPrototypes = function ()
{
    this.objectPrototype = new fcModel.ObjectPrototype(this);
    this.fcObjectPrototype = new fcModel.fcValue(Object.prototype, this.objectPrototype, null);

    this.functionPrototype = new fcModel.FunctionPrototype(this);
    this.fcFunctionPrototype = new fcModel.fcValue(Function.prototype, this.functionPrototype, null);
    this.functionPrototype.initFunctionPrototype();

    this.objectPrototype.initMethods();

    this.booleanPrototype = new fcModel.BooleanPrototype(this);
    this.fcBooleanPrototype = new fcModel.fcValue(Boolean.prototype, this.booleanPrototype, null);

    this.arrayPrototype = new fcModel.ArrayPrototype(this);
    this.fcArrayPrototype = new fcModel.fcValue(Array.prototype, this.arrayPrototype, null);

    this.regExPrototype = new fcModel.RegExPrototype(this);
    this.fcRegExPrototype = new fcModel.fcValue(RegExp.prototype, this.regExPrototype, null);

    this.xmlHttpRequestPrototype = new fcModel.XMLHttpRequestPrototype(this);
    this.fcXMLHttpRequestPrototype = new fcModel.fcValue(XMLHttpRequest.prototype, this.xmlHttpRequestPrototype, null);

    this.stringPrototype = new fcModel.StringPrototype(this);
    this.fcStringPrototype = new fcModel.fcValue(String.prototype, this.stringPrototype, null);

    this.numberPrototype = new fcModel.NumberPrototype(this);
    this.fcNumberPrototype = new fcModel.fcValue(Number.prototype, this.numberPrototype, null);

    this.datePrototype = new fcModel.DatePrototype(this);
    this.fcDatePrototype = new fcModel.fcValue(Date.prototype, this.datePrototype, null);

    this.errorPrototype = new fcModel.ErrorPrototype(this);
    this.fcErrorPrototype = new fcModel.fcValue(Error.prototype, this.errorPrototype, null);

    this.eventPrototype = new fcModel.EventPrototype(this);
    this.fcEventPrototype = new fcModel.fcValue(Event.prototype, this.eventPrototype, null);

    this.htmlImageElementPrototype = new fcModel.HTMLImageElementPrototype(this);
    this.fcHtmlImagePrototype = new fcModel.fcValue(HTMLImageElement.prototype, this.htmlImageElementPrototype, null);

    this.canvasPrototype = new fcModel.CanvasPrototype(this);
    this.fcCanvasPrototype = new fcModel.fcValue(HTMLCanvasElement.prototype, this.canvasPrototype, null);

    this.canvasContextPrototype = new fcModel.CanvasContextPrototype(this);
    this.fcCanvasContextPrototype = new fcModel.fcValue(CanvasRenderingContext2D.prototype, this.canvasContextPrototype, null);

    this.elementPrototype = new fcModel.ElementPrototype(this);
    this.fcElementPrototype = new fcModel.fcValue(Element.prototype, this.elementPrototype, null);

    this.htmlElementPrototype = new fcModel.HTMLElementPrototype(this);
    this.fcHtmlElementPrototype = new fcModel.fcValue(HTMLElement.prototype, this.htmlElementPrototype, null);

    if(typeof Window !== "undefined")
    {
        this.windowPrototype = new fcModel.WindowPrototype(this);
        this.fcWindowPrototype = new fcModel.fcValue(Window.prototype, this.windowPrototype, null);
    }

    this.documentPrototype = new fcModel.DocumentPrototype(this);
    this.fcDocumentPrototype = new fcModel.fcValue(Document.prototype, this.documentPrototype, null);

    this.internalPrototypes =
    [
        this.objectPrototype, this.functionPrototype, this.booleanPrototype,
        this.arrayPrototype, this.regExPrototype, this.stringPrototype,
        this.numberPrototype, this.datePrototype, this.htmlImageElementPrototype,
        this.elementPrototype, this.canvasPrototype, this.xmlHttpRequestPrototype,
        this.eventPrototype, this.errorPrototype
    ];
};

fcModel.GlobalObject.prototype._deleteInternalPrototypes = function ()
{
    delete this.objectPrototype;
    delete this.fcObjectPrototype;

    delete this.functionPrototype;
    delete this.fcFunctionPrototype;

    delete this.objectPrototype;

    delete this.booleanPrototype;
    delete this.fcBooleanPrototype;

    delete this.arrayPrototype;
    delete this.fcArrayPrototype;

    delete this.regExPrototype;
    delete this.fcRegExPrototype;

    delete this.xmlHttpRequestPrototype;
    delete this.fcXMLHttpRequestPrototype;

    delete this.stringPrototype;
    delete this.fcStringPrototype;

    delete this.numberPrototype;
    delete this.fcNumberPrototype;

    delete this.datePrototype;
    delete this.fcDatePrototype;

    delete this.errorPrototype;
    delete this.fcErrorPrototype;

    delete this.eventPrototype;
    delete this.fcEventPrototype;

    delete this.htmlImageElementPrototype;
    delete this.fcHtmlImagePrototype;

    delete this.canvasPrototype;
    delete this.fcCanvasPrototype;

    delete this.canvasContextPrototype;
    delete this.fcCanvasContextPrototype;

    delete this.elementPrototype;
    delete this.fcElementPrototype;

    delete this.windowPrototype;
    delete this.fcWindowPrototype;

    delete this.documentPrototype;
    delete this.fcDocumentPrototype;

    delete this.internalPrototypes;
};

fcModel.GlobalObject.prototype._createInternalFunctions = function()
{
    this.objectFunction = new fcModel.ObjectFunction(this);
    this.fcObjectFunction = new fcModel.fcValue(Object, this.objectFunction);
    this.addProperty("Object", this.fcObjectFunction, null);
    this.objectPrototype.addProperty("constructor", this.fcObjectFunction, null, false);

    this.arrayFunction = new fcModel.ArrayFunction(this);
    this.fcArrayFunction = new fcModel.fcValue(Array, this.arrayFunction, null);
    this.addProperty("Array", this.fcArrayFunction, null);

    this.booleanFunction = new fcModel.BooleanFunction(this);
    this.addProperty("Boolean", new fcModel.fcValue(Boolean, this.booleanFunction, null), null);

    this.stringFunction = new fcModel.StringFunction(this);
    this.fcStringFunction = new fcModel.fcValue(String, this.stringFunction, null);
    this.addProperty("String", this.fcStringFunction, null);

    this.imageFunction = new fcModel.ImageFunction(this);
    this.addProperty("Image", new fcModel.fcValue(Image, this.imageFunction, null), null);

    this.regExFunction = new fcModel.RegExFunction(this);
    this.addProperty("RegExp", new fcModel.fcValue(RegExp, this.regExFunction, null), null);

    this.numberFunction = new fcModel.NumberFunction(this);
    this.addProperty("Number", new fcModel.fcValue(Number, this.numberFunction, null), null);

    this.dateFunction = new fcModel.DateFunction(this);
    this.addProperty("Date", new fcModel.fcValue(Date, this.dateFunction, null), null);

    this.errorFunction = new fcModel.ErrorFunction(this);
    this.addProperty("Error", new fcModel.fcValue(Error, this.errorFunction, null), null);

    this.eventFunction = new fcModel.EventFunction(this);
    this.addProperty("Event", new fcModel.fcValue(Event, this.eventFunction, null), null),

    this.functionFunction = new fcModel.FunctionFunction(this);
    this.addProperty("Function", new fcModel.fcValue(Function, this.functionFunction), null);

    this.xmlHttpRequestFunction = new fcModel.XMLHttpRequestFunction(this);
    this.addProperty("XMLHttpRequest", new fcModel.fcValue(XMLHttpRequest, this.xmlHttpRequestFunction, null), null);

    this.windowFunction = new fcModel.WindowFunction(this);

    if(typeof Window !== "undefined")
    {
        this.addProperty("Window", new fcModel.fcValue(Window, this.windowFunction, null), null);
    }

    this.documentFunction = new fcModel.DocumentFunction(this);
    this.addProperty("Document", new fcModel.fcValue(Document, this.documentFunction, null), null);

    fcModel.GlobalObject.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(methodName)
    {
        this.addProperty
        (
            methodName,
            new fcModel.fcValue
            (
                this.origWindow[methodName],
                fcModel.Function.createInternalNamedFunction(this, methodName, this),
                null
            ),
            null,
            false
        );
    }, this);

    this.internalFunctions =
    [
        this.objectFunction, this.arrayFunction, this.booleanFunction,
        this.stringFunction, this.imageFunction, this.regExFunction,
        this.numberFunction, this.dateFunction, this.functionFunction,
        this.xmlHttpRequestFunction, this.eventFunction, this.errorFunction
    ];
};

fcModel.GlobalObject.prototype._deleteInternalFunctions = function()
{
    delete this.objectFunction;
    delete this.fcObjectFunction;

    delete this.arrayFunction;
    delete this.fcArrayFunction;

    delete this.booleanFunction;

    delete this.stringFunction;
    delete this.fcStringFunction;

    delete this.imageFunction;
    delete this.regExFunction;

    delete this.numberFunction;

    delete this.dateFunction;

    delete this.errorFunction;

    delete this.eventFunction;

    delete this.functionFunction;

    delete this.xmlHttpRequestFunction;

    delete this.windowFunction;

    delete this.documentFunction;

    delete this.internalFunctions;
};

fcModel.GlobalObject.prototype._createInternalObjects = function()
{
    this.document = new fcModel.Document(this.origDocument, this);
    this.jsFcDocument = new fcModel.fcValue(this.origDocument, this.document, null);
    this.addProperty("document", this.jsFcDocument, null);

    this.math = new fcModel.Math(this);
    this.fcMath = new fcModel.fcValue(Math, this.math, null);
    this.addProperty("Math", this.fcMath, null);

    this.addProperty("window", this, null);

    this.addProperty("location", this.internalExecutor.createLocationObject());
    this.addProperty("navigator", this.internalExecutor.createNavigatorObject());
    this.addProperty("screen", this.internalExecutor.createScreenObject());

    this.fcHTMLImageElement = new fcModel.HTMLImageElement(this);
    this.htmlImageElement = new fcModel.fcValue(HTMLImageElement, this.fcHTMLImageElement, null);
    this.addProperty("HTMLImageElement", this.htmlImageElement, null);

    this.fcElement = new fcModel.Element(this);
    this.element = new fcModel.fcValue(Element, this.fcElement, null);
    this.addProperty("Element", this.element, null);

    this.fcHtmlElement = new fcModel.HTMLElement(this);
    this.htmlElement = new fcModel.fcValue(HTMLElement, this.fcHtmlElement, null);
    this.addProperty("HTMLElement", this.htmlElement, null);

    //this.fcEvent = new fcModel.Event(this);
    //this.event = new fcModel.fcValue(Event, this.fcEvent, null);
    //this.addProperty("Event", this.event, null);
};

fcModel.GlobalObject.prototype._deleteInternalObjects = function()
{
    delete this.document;
    delete this.jsFcDocument;

    delete this.math;
    delete this.fcMath;

    delete this.fcHTMLImageElement;
    delete this.htmlImageElement;

    delete this.fcElement;
    delete this.element;

    delete this.fcEvent;
    delete this.event;
};

fcModel.GlobalObject.prototype.isInternalPrototype = function(object)
{
    for(var i = 0; i < this.internalPrototypes.length; i++)
    {
        if(this.internalPrototypes[i] == object) { return true;}
    }

    return false;
};

fcModel.GlobalObject.prototype._createInternalVariables = function()
{
    this.addProperty("undefined", this.internalExecutor.createInternalPrimitiveObject(null, undefined));
    this.addProperty("Infinity", this.internalExecutor.createInternalPrimitiveObject(null, Infinity));
    this.addProperty("NaN", this.internalExecutor.createInternalPrimitiveObject(null, NaN));
    this.addProperty("mozInnerScreenX", this.internalExecutor.createInternalPrimitiveObject(null, window.mozInnerScreenX));
    this.addProperty("mozInnerScreenY", this.internalExecutor.createInternalPrimitiveObject(null, window.mozInnerScreenY));

    var eventHandlerNames = ("onafterprint, onbeforeprint, onbeforeunload, onhashchange, onmessage, onoffline, ononline, onpopstate"
    +"onpagehide, onpageshow, onresize, onunload, ondevicemotion, ondeviceorientation, ondeviceproximity"
    +"onuserproximity, ondevicelight, onabort, onblur, oncanplay, oncanplaythrough, onchange, onclick"
    +"oncontextmenu, ondblclick, ondrag, ondragend, ondragenter, ondragleave, ondragover, ondragstart"
    + "ondrop, ondurationchange, onemptied, onended, onerror, onfocus, oninput, oninvalid, onkeydown, onkeypress"
    + "onkeyup, onload, onloadeddata, onloadedmetadata, onloadstart, onmousedown, onmousemove, onmouseout, onmouseover"
    + "onmouseup, onmozfullscreenchange, onmozfullscreenerror, onmozpointerlockchange, onmozpointerlockerror, onpause"
    + "onplay, onplaying, onprogress, onratechange, onreset, onscroll, onseeked, onseeking, onselect, onshow, onstalled"
    + "onsubmit, onsuspend, ontimeupdate, onvolumechange, onwaiting, oncopy, oncut, onpaste, onbeforescriptexecute, onafterscriptexecute").split(",");

    for(var i = 0 ; i < eventHandlerNames.length; i++)
    {
        var eventHandlerName = eventHandlerNames[i].trim();

        this.addProperty(eventHandlerName, this.internalExecutor.createInternalPrimitiveObject(null, null));
    }
};

fcModel.GlobalObject.prototype._createHandlerMaps = function()
{
    this.eventHandlerPropertiesMap = {};
    this.htmlElementEventHandlingRegistrations = [];
    this.ajaxPreregistrations = [];
    this.ajaxHandlers = [];

    this.timeoutHandlers = [];
    this.intervalHandlers = [];
};
fcModel.GlobalObject.prototype._deleteHandlerMaps = function()
{
    delete this.eventHandlerPropertiesMap;
    delete this.htmlElementEventHandlingRegistrations;
    delete this.ajaxHandlers;
    delete this.ajaxPreregistrations;

    delete this.timeoutHandlers;
    delete this.intervalHandlers;
};
//</editor-fold>

fcModel.WindowFunction = function(globalObject)
{
    try
    {
        this.initObject(globalObject);

        this.name = "Window";

        this.addProperty("prototype", globalObject.fcWindowPrototype);
        this.proto = globalObject.fcFunctionPrototype;
    }
    catch(e){ fcModel.GlobalObject.notifyError("Error when creating Window Function:" + e); }
};

fcModel.WindowFunction.prototype = new fcModel.Object();

fcModel.WindowPrototype = function(globalObject)
{
    this.initObject(globalObject);
    this.constructor = fcModel.WindowPrototype;
};

fcModel.WindowPrototype.prototype = new fcModel.Object();
/*************************************************************************************/
}});