/**
 * Created by Jomaras.
 * Date: 10.03.12.@20:02
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.GlobalObject = function(browser, documentFragment)
{
    try
    {
        this.__proto__ = new fcModel.Object(this);
        this.browser = browser;

        this.origWindow = Firecrow.getWindow();
        this.origDocument = Firecrow.getDocument();

        this.jsValue = this;
        this.value = this;
        this.fcInternal = new fcModel.FcInternal(null, this);
        this.internalExecutor = new Firecrow.Interpreter.Simulator.InternalExecutor(this);

        Firecrow.Interpreter.Simulator.VariableObject.liftToVariableObject(this);

        this.booleanPrototype = new fcModel.BooleanPrototype(this);
        this.arrayPrototype = new fcModel.ArrayPrototype(this);
        this.objectPrototype = new fcModel.ObjectPrototype(this);
        this.functionPrototype = new fcModel.FunctionPrototype(this);
        this.regExPrototype = new fcModel.RegExPrototype(this);
        this.stringPrototype = new fcModel.StringPrototype(this);
        this.numberPrototype = new fcModel.NumberPrototype(this);
        this.datePrototype = new fcModel.DatePrototype(this);

        this.booleanFunction = new fcModel.BooleanFunction(this);
        this.stringFunction = new fcModel.StringFunction(this);
        this.arrayFunction = new fcModel.ArrayFunction(this);
        this.regExFunction = new fcModel.RegExFunction(this);
        this.objectFunction = new fcModel.ObjectFunction(this);
        this.numberFunction = new fcModel.NumberFunction(this);
        this.dateFunction = new fcModel.DateFunction(this);
        this.xmlHttpRequestFunction = new fcModel.XMLHttpRequestFunction(this);

        this.fcMath = new fcModel.Math(this);
        this.math = new fcModel.JsValue(this.fcMath, new fcModel.FcInternal(null, this.fcMath));
        this.document = new fcModel.Document(this.origDocument, this);
        this.jsFcDocument = new fcModel.JsValue(this.origDocument, new fcModel.FcInternal(null, this.document));

        this.addProperty("Array", new fcModel.JsValue(this.arrayFunction, new fcModel.FcInternal(null, this.arrayFunction)) , null);
        this.addProperty("RegExp", new fcModel.JsValue(this.regExFunction, new fcModel.FcInternal(null, this.regExFunction)) , null);
        this.addProperty("String", new fcModel.JsValue(this.stringFunction, new fcModel.FcInternal(null, this.stringFunction)) , null);
        this.addProperty("Object", new fcModel.JsValue(this.objectFunction, new fcModel.FcInternal(null, this.objectFunction)) , null);
        this.addProperty("Boolean", new fcModel.JsValue(this.booleanFunction, new fcModel.FcInternal(null, this.booleanFunction)) , null);
        this.addProperty("Number", new fcModel.JsValue(this.numberFunction, new fcModel.FcInternal(null, this.numberFunction)) , null);
        this.addProperty("Date", new fcModel.JsValue(this.dateFunction, new fcModel.FcInternal(null, this.dateFunction)), null);
        this.addProperty("XMLHttpRequest", new fcModel.JsValue(this.xmlHttpRequestFunction, new fcModel.FcInternal(null, this.xmlHttpRequestFunction)), null);
        this.addProperty("document", this.jsFcDocument, null);
        this.addProperty("Math", this.math, null);
        this.addProperty("window", this, null);
        this.addProperty("undefined", new fcModel.JsValue(undefined, new fcModel.FcInternal()));
        this.addProperty("Infinity", new fcModel.JsValue(Infinity, new fcModel.FcInternal()));
        this.addProperty("location", this.internalExecutor.createLocationObject());
        this.addProperty("navigator", this.internalExecutor.createNavigatorObject());

        this.currentCommand = null;

        var methods = fcModel.GlobalObject.CONST.INTERNAL_PROPERTIES.METHODS;
        function _isMethod(method) { return methods.indexOf(method) != -1; }

        this.internalExecutor.expandInternalFunctions();

        methods.forEach(function(methodName)
        {
            try
            {
                this.addProperty(methodName,  this.origWindow[methodName].jsValue);
            }
            catch(e) { fcModel.GlobalObject.notifyError("Global object error when adding property: " + methodName +", error: " + e);}
        }, this);

        this.identifierSlicingCriteria = [];
        this.domModificationSlicingCriteria = [];
        this.includeAllDomModifications = false;

        this.getJsPropertyValue = function(propertyName, codeConstruct)
        {
            return this.getPropertyValue(propertyName, codeConstruct);
        };

        this.addJsProperty = function(propertyName, value, codeConstruct)
        {
            this.addProperty(propertyName, value, codeConstruct);
        };

        this.registerSlicingCriteria = function(slicingCriteria)
        {
            if(slicingCriteria == null) { return; }

            this.identifierSlicingCriteria = [];
            this.domModificationSlicingCriteria = [];

            for(var i = 0; i < slicingCriteria.length; i++)
            {
                var criterion = slicingCriteria[i];

                if(criterion.type == Firecrow.DependencyGraph.SlicingCriterion.TYPES.READ_IDENTIFIER)
                {
                    this.identifierSlicingCriteria.push(criterion);
                }
                else if (criterion.type == Firecrow.DependencyGraph.SlicingCriterion.TYPES.DOM_MODIFICATION)
                {
                    if(criterion.cssSelector === "all") { this.includeAllDomModifications = true; }
                    this.domModificationSlicingCriteria.push(criterion);
                }
            }
        };

        this.checkIfSatisfiesDomSlicingCriteria = function(htmlElement)
        {
            try
            {
                if(htmlElement == null) { return false; }
                if(!(htmlElement instanceof HTMLElement)) { return false; }
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

        this.checkIfSatisfiesIdentifierSlicingCriteria = function(codeConstruct)
        {
            if(codeConstruct == null) { return false; }
            if(this.identifierSlicingCriteria.length == 0) { return false; }

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

        this.evaluationPositionId = "root";
        this.getPreciseEvaluationPositionId = function()
        {
            return { groupId : this.evaluationPositionId, currentCommandId : (this.currentCommand != null ? this.currentCommand.executionId : "0") };
        };

        this.getReturnExpressionPreciseEvaluationPositionId = function()
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

        this.setCurrentCommand = function(command)
        {
            if(command == null) { fcModel.GlobalObject.notifyError("Command can not be null!");}

            this.currentCommand = command;
            this.currentCommand.executionId = this._EXECUTION_COMMAND_COUNTER++;
        };

        this.htmlElementEventHandlingRegistrations = [];

        this.registerHtmlElementEventHandler = function(fcHtmlElement, eventType, handler, evaluationPosition)
        {
            this.htmlElementEventHandlingRegistrations.push(
            {
                fcHtmlElement: fcHtmlElement,
                eventType: eventType,
                handler: handler,
                registrationPoint: evaluationPosition
            });
        };

        this.timeoutHandlers = [];

        this.registerTimeout = function(timeoutId, handler, timePeriod, callArguments, registrationPoint)
        {
            this.timeoutHandlers.push(
            {
                timeoutId: timeoutId,
                handler: handler,
                timePeriod: timePeriod,
                callArguments: callArguments,
                registrationPoint: registrationPoint
            });
        };

        this.unregisterTimeout = function(timeoutId, codeConstruct)
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
                        dependencyCreationInfo,
                        this.getPreciseEvaluationPositionId()
                    );

                    ValueTypeHelper.removeFromArrayByIndex(this.timeoutHandlers, i);
                    return;
                }
            }
        };

        this.intervalHandlers = [];

        this.registerInterval = function(intervalId, handler, timePeriod, callArguments, registrationPoint)
        {
            this.intervalHandlers.push(
            {
                intervalId: intervalId,
                handler: handler,
                timePeriod: timePeriod,
                callArguments: callArguments,
                registrationPoint: registrationPoint
            });
        };

        this.unregisterInterval = function(intervalId, codeConstruct)
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

        this.isPrimitive = function() { return false;}

        this._EXECUTION_COMMAND_COUNTER = 0;
    }
    catch(e)
    {
        fcModel.GlobalObject.notifyError("Error when initializing global object:" + e);
    }
};

fcModel.GlobalObject.notifyError = function(message) { alert("GlobalObject - " + message); }

fcModel.GlobalObject.prototype = new fcModel.Object(null);

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
            "getComputedStyle"
        ]
    }
}

fcModel.GlobalObjectExecutor =
{
    executeInternalFunction: function(fcFunction, arguments, callExpression, globalObject)
    {
        try
        {
            if(fcFunction.value.name == "eval") { return _handleEval(fcFunction, arguments, callExpression, globalObject); }
            else if (fcFunction.value.name == "addEventListener") { return globalObject.addEventListener(arguments, callExpression, globalObject); }
            else if (fcFunction.value.name == "removeEventListener") { return globalObject.removeEventListener(arguments, callExpression, globalObject); }
            else if (fcFunction.value.name == "setTimeout" || fcFunction.value.name == "setInterval")
            {
                var timeoutId = setTimeout(function(){});

                var timingEventArguments = [timeoutId, arguments[0], arguments[1].value, arguments.slice(2), { codeConstruct:callExpression, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()}];

                if(fcFunction.value.name == "setTimeout")
                {
                    globalObject.registerTimeout.apply(globalObject, timingEventArguments);
                }
                else if(fcFunction.value.name == "setInterval")
                {
                    globalObject.registerInterval.apply(globalObject, timingEventArguments);
                }

                return new fcModel.JsValue(timeoutId, new fcModel.FcInternal());
            }
            else if (fcFunction.value.name == "clearTimeout" || fcFunction.value.name == "clearInterval")
            {
                if(fcFunction.value.name == "clearTimeout")
                {
                    globalObject.unregisterTimeout(arguments[0] != null ? arguments[0].value : null, callExpression);
                }
                else
                {
                    globalObject.unregisterInterval(arguments[0] != null ? arguments[0].value : null, callExpression);
                }


                return new fcModel.JsValue(undefined, new fcModel.FcInternal());
            }
            else if (fcFunction.value.name == "getComputedStyle")
            {
                var jsHtmlElement = arguments[0];

                if(!(jsHtmlElement.value instanceof HTMLElement)) { this.notifyError("Wrong argument when getting computed style");}

                var htmlElement = jsHtmlElement.value;
                var computedStyle = globalObject.origWindow[fcFunction.value.name].apply(globalObject.origWindow, arguments.map(function(argument) { return argument.value; }));

                return fcModel.CSSStyleDeclaration.createStyleDeclaration(htmlElement, computedStyle, globalObject, callExpression);
            }

            return new fcModel.JsValue
            (
                globalObject.origWindow[fcFunction.value.name].apply(globalObject.origWindow, arguments.map(function(argument) { return argument.value; })),
                new fcModel.FcInternal(callExpression, null)
            )
        }
        catch(e)
        {
            fcModel.GlobalObject.notifyError("Error when executing global object function internal function: " + e);
        }
    },

    _handleEval: function(fcFunction, arguments, callExpression, globalObject)
    {
        fcModel.GlobalObject.notifyError("Not handling eval function!");

        return new fcModel.JsValue(null, new fcModel.FcInternal(callExpression));
    },

    executesFunction: function(globalObject, functionName)
    {
        return globalObject.origWindow[functionName] != null && ValueTypeHelper.isFunction(globalObject.origWindow[functionName]);
    }
};

/*************************************************************************************/
}});