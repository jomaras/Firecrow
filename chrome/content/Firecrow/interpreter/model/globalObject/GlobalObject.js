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

        this._createInternalPrototypes();
        this._createInternalObjects();
        this._createInternalVariables();
        this._createInternalFunctions();

        this._createSlicingVariables();

        this._createTrackerMaps();
        this._createHandlerMaps();

        this._createEvaluationPositionProperties();

        this._EXECUTION_COMMAND_COUNTER = 0;
    }
    catch(e)
    {
        fcModel.GlobalObject.notifyError("Error when initializing global object:" + e);
    }
};

//<editor-fold desc="'Static' properties">
fcModel.GlobalObject.notifyError = function(message) { alert("GlobalObject - " + message); }
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
            "getComputedStyle", "unescape"
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

    if(propertyValue === undefined) { this._logAccessingUndefinedProperty(propertyName, codeConstruct); }

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
        thisObject: this.globalObject,
        executionInfos: [],
        eventType: "timeout"
    });
};

fcModel.GlobalObject.prototype.unregisterTimeout = function(timeoutId, codeConstruct)
{
    if(timeoutId == null) { return; }

    for(var i = 0; i < this.timeoutHandlers.length; i++)
    {
        if(this.timeoutHandlers[i].timeoutId == timeoutId)
        {
            this.browser.callDataDependencyEstablishedCallbacks
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

fcModel.GlobalObject.prototype.registerInterval = function(intervalId, handler, timePeriod, callArguments, registrationPoint)
{
    this.intervalHandlers.push(
    {
        intervalId: intervalId,
        handler: handler,
        timePeriod: timePeriod,
        callArguments: callArguments,
        registrationPoint: registrationPoint,
        thisObject: this.globalObject,
        executionInfos: [],
        eventType: "interval"
    });
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

            this.browser.callDataDependencyEstablishedCallbacks
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
};

fcModel.GlobalObject._EVENT_HANDLER_REGISTRATION_POINT_LAST_ID = 0;
fcModel.GlobalObject.prototype.registerHtmlElementEventHandler = function(fcHtmlElement, eventType, handler, evaluationPosition)
{
    this.htmlElementEventHandlingRegistrations.push
    ({
        fcHtmlElement: fcHtmlElement,
        eventType: eventType,
        handler: handler,
        registrationPoint: evaluationPosition,
        thisObject: fcHtmlElement,
        id: fcModel.GlobalObject._EVENT_HANDLER_REGISTRATION_POINT_LAST_ID++,
        executionInfos: []
    });
};
//</editor-fold>

//<editor-fold desc="'Public' methods">
fcModel.GlobalObject.prototype.isPrimitive = function() { return false; }

fcModel.GlobalObject.prototype.getUserSetGlobalProperties = function()
{
    var userSetGlobalProperties = [];

    for(var i = 0; i < this.properties.length; i++)
    {
        var property = this.properties[i];

        if(property.declarationConstruct == null) { continue; }

        userSetGlobalProperties.push(property);
    }

    return userSetGlobalProperties;
};

fcModel.GlobalObject.prototype.getLoadedHandlers = function()
{
    return this.getDOMContentLoadedHandlers().concat(this.getOnLoadFunctions());
};

fcModel.GlobalObject.prototype.getDOMContentLoadedHandlers = function()
{
    return this.document.getEventListeners("DOMContentLoaded").concat(this.getEventListeners("DOMContentLoaded"));
};

fcModel.GlobalObject.prototype.getOnLoadFunctions = function()
{
    var onLoadFunctions =  this.getEventListeners("load");
    var onLoadFunction = this.getPropertyValue("onload");

    if(onLoadFunction != null)
    {
        onLoadFunctions.push({handler: onLoadFunction, registrationPoint: this.getProperty("onload").lastModificationPosition, eventType: "onload", thisObject: this });
    }

    return onLoadFunctions;
};
//</editor-fold>

//<editor-fold desc="Evaluation Position">
fcModel.GlobalObject.prototype.getPreciseEvaluationPositionId = function()
{
    return {
        groupId : this.evaluationPositionId,
        currentCommandId : (this.currentCommand != null ? this.currentCommand.executionId : "0")
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
fcModel.GlobalObject.prototype._setExecutionEnvironment = function(browser)
{
    this.browser = browser;

    this.origWindow = Firecrow.getWindow();
    this.origDocument = Firecrow.getDocument();
};

fcModel.GlobalObject.prototype._createInternalPrototypes = function ()
{
    this.objectPrototype = new fcModel.ObjectPrototype(this);
    this.fcObjectPrototype = new fcModel.fcValue(Object.prototype, this.objectPrototype, null);

    this.functionPrototype = new fcModel.FunctionPrototype(this);
    this.fcFunctionPrototype = new fcModel.fcValue(Function.prototype, this.functionPrototype, null);

    this.objectPrototype.initMethods();

    this.booleanPrototype = new fcModel.BooleanPrototype(this);
    this.fcBooleanPrototype = new fcModel.fcValue(Boolean.prototype, this.booleanPrototype, null);

    this.arrayPrototype = new fcModel.ArrayPrototype(this);
    this.fcArrayPrototype = new fcModel.fcValue(Array.prototype, this.arrayPrototype, null);

    this.regExPrototype = new fcModel.RegExPrototype(this);
    this.fcRegExPrototype = new fcModel.fcValue(RegExp.prototype, this.regExPrototype, null);

    this.stringPrototype = new fcModel.StringPrototype(this);
    this.fcStringPrototype = new fcModel.fcValue(String.prototype, this.stringPrototype, null);

    this.numberPrototype = new fcModel.NumberPrototype(this);
    this.fcNumberPrototype = new fcModel.fcValue(Number.prototype, this.numberPrototype, null);

    this.datePrototype = new fcModel.DatePrototype(this);
    this.fcDatePrototype = new fcModel.fcValue(Date.prototype, this.datePrototype, null);

    this.htmlImageElementPrototype = new fcModel.HTMLImageElementPrototype(this);
    this.fcHtmlImagePrototype = new fcModel.fcValue(HTMLImageElement.prototype, this.htmlImageElementPrototype, null);

    this.canvasPrototype = new fcModel.CanvasPrototype(this);
    this.fcCanvasPrototype = new fcModel.fcValue(HTMLCanvasElement.prototype, this.canvasPrototype, null);

    this.canvasContextPrototype = new fcModel.CanvasContextPrototype(this);
    this.fcCanvasContextPrototype = new fcModel.fcValue(CanvasRenderingContext2D.prototype, this.canvasContextPrototype, null);

    this.elementPrototype = new fcModel.ElementPrototype(this);
    this.fcElementPrototype = new fcModel.fcValue(Element.prototype, this.elementPrototype, null);

    this.windowPrototype = new fcModel.WindowPrototype(this);
    this.fcWindowPrototype = new fcModel.fcValue(Window.prototype, this.windowPrototype, null);

    this.documentPrototype = new fcModel.DocumentPrototype(this);
    this.fcDocumentPrototype = new fcModel.fcValue(Document.prototype, this.documentPrototype, null);

    this.internalPrototypes =
    [
        this.objectPrototype, this.functionPrototype, this.booleanPrototype,
        this.arrayPrototype, this.regExPrototype, this.stringPrototype,
        this.numberPrototype, this.datePrototype, this.htmlImageElementPrototype,
        this.elementPrototype, this.canvasPrototype
    ];
};

fcModel.GlobalObject.prototype._createInternalFunctions = function()
{
    this.objectFunction = new fcModel.ObjectFunction(this);
    this.fcObjectFunction = new fcModel.fcValue(Object, this.objectFunction);
    this.addProperty("Object", new fcModel.fcValue(Object, this.objectFunction, null), null);
    this.objectPrototype.addProperty("constructor", this.fcObjectFunction, null, false);

    this.arrayFunction = new fcModel.ArrayFunction(this);
    this.addProperty("Array", new fcModel.fcValue(Array, this.arrayFunction, null), null);

    this.booleanFunction = new fcModel.BooleanFunction(this);
    this.addProperty("Boolean", new fcModel.fcValue(Boolean, this.booleanFunction, null), null);

    this.stringFunction = new fcModel.StringFunction(this);
    this.addProperty("String", new fcModel.fcValue(String, this.stringFunction, null), null);

    this.imageFunction = new fcModel.ImageFunction(this);
    this.addProperty("Image", new fcModel.fcValue(Image, this.imageFunction, null), null);

    this.regExFunction = new fcModel.RegExFunction(this);
    this.addProperty("RegExp", new fcModel.fcValue(RegExp, this.regExFunction, null), null);

    this.numberFunction = new fcModel.NumberFunction(this);
    this.addProperty("Number", new fcModel.fcValue(Number, this.numberFunction, null), null);

    this.dateFunction = new fcModel.DateFunction(this);
    this.addProperty("Date", new fcModel.fcValue(Date, this.dateFunction, this.dateFunction), null);

    this.functionFunction = new fcModel.FunctionFunction(this);
    this.addProperty("Function", new fcModel.fcValue(Function, this.functionFunction), null);

    this.xmlHttpRequestFunction = new fcModel.XMLHttpRequestFunction(this);
    this.addProperty("XMLHttpRequest", new fcModel.fcValue(XMLHttpRequest, this.xmlHttpRequestFunction, null), null);

    this.windowFunction = new fcModel.WindowFunction(this);
    this.addProperty("Window", new fcModel.fcValue(Window, this.windowFunction, null), null);

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
        this.xmlHttpRequestFunction
    ];
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

    this.fcHTMLImageElement = new fcModel.HTMLImageElement(this);
    this.htmlImageElement = new fcModel.fcValue(HTMLImageElement, this.fcHTMLImageElement, null);
    this.addProperty("HTMLImageElement", this.htmlImageElement, null);

    this.fcElement = new fcModel.Element(this);
    this.element = new fcModel.fcValue(Element, this.fcElement, null);
    this.addProperty("Element", this.element, null);
};

fcModel.GlobalObject.prototype._createInternalVariables = function()
{
    this.addProperty("undefined", new fcModel.fcValue(undefined, undefined, null));
    this.addProperty("Infinity", new fcModel.fcValue(Infinity, Infinity, null));
    this.addProperty("mozInnerScreenX", this.internalExecutor.createInternalPrimitiveObject(null, window.mozInnerScreenX));
    this.addProperty("mozInnerScreenY", this.internalExecutor.createInternalPrimitiveObject(null, window.mozInnerScreenY));
};

fcModel.GlobalObject.prototype._createTrackerMaps = function()
{
    this.undefinedGlobalPropertiesAccessMap = {};
    this.resourceSetterPropertiesMap = {};
    this.objectForInIterations = [];
};

fcModel.GlobalObject.prototype._createHandlerMaps = function()
{
    this.eventHandlerPropertiesMap = {};
    this.htmlElementEventHandlingRegistrations = [];

    this.timeoutHandlers = [];
    this.intervalHandlers = [];
};

fcModel.GlobalObject.prototype._logAccessingUndefinedProperty = function(propertyName, codeConstruct)
{
    if(codeConstruct == null || fcModel.GlobalObject.CONST.isEventProperty(propertyName)) { return; }

    if(this.undefinedGlobalPropertiesAccessMap[propertyName] == null)
    {
        this.undefinedGlobalPropertiesAccessMap[propertyName] = {};
    }

    this.undefinedGlobalPropertiesAccessMap[propertyName][codeConstruct.nodeId] = codeConstruct;
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