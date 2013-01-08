FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;
var WebFile = Firecrow.DoppelBrowser.WebFile;
var Node = Firecrow.DependencyGraph.Node;
var HtmlHelper = Firecrow.htmlHelper;

var Interpreter = Firecrow.Interpreter.InterpreterSimulator;
var GlobalObject = Firecrow.Interpreter.Model.GlobalObject;

var fcSimulator = Firecrow.Interpreter.Simulator;
var fcModel = Firecrow.Interpreter.Model;
var fcBrowser = Firecrow.DoppelBrowser;

fcBrowser.Browser = function(pageModel)
{
    try
    {
        this.pageModel = pageModel;
        this.hostDocument = Firecrow.getDocument();
        this.htmlWebFile = pageModel;

        this.globalObject = new GlobalObject(this, this.hostDocument);

        this.nodeCreatedCallbacks = [];
        this.nodeInsertedCallbacks = [];
        this.interpretJsCallbacks = [];

        this.dataDependencyEstablishedCallbacks = [];
        this.controlDependencyEstablishedCallbacks = [];
        this.interpreterMessageGeneratedCallbacks = [];
        this.controlFlowConnectionCallbacks = [];
        this.importantConstructReachedCallbacks = [];
        this.documentReadyCallbacks = [];
        this.breakContinueReturnEventsCallbacks = [];

        this.domQueriesMap = {};

        this.errorMessages = [];
        this.cssRules = [];

        this.executionInfo = new fcBrowser.ExecutionInfo();

        this._matchesSelector = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector;

        if(!Firecrow.IsDebugMode)
        {
            var errorMessages = this.errorMessages

            Firecrow.Interpreter.Commands.CommandGenerator.notifyError = function(message) { errorMessages.push("CommandGenerator - " + message); };
            Firecrow.Interpreter.Commands.Command.notifyError = function(message) { errorMessages.push("Command - " + message); };
            Firecrow.CodeTextGenerator.notifyError = function(message) { errorMessages.push("CodeTextGenerator - " + message); }
            Firecrow.DependencyGraph.DependencyGraph.notifyError = function(message) { errorMessages.push("DependencyGraph - " + message); }
            Firecrow.Interpreter.Model.GlobalObject.notifyError = function(message) { errorMessages.push("GlobalObject - " + message); }
            Firecrow.DependencyGraph.DependencyPostprocessor.notifyError = function(message) { errorMessages.push("DependencyPostprocessor - " + message); }
            Firecrow.DependencyGraph.Edge.notifyError = function(message) { errorMessages.push("Edge - " + message); }
            Firecrow.DependencyGraph.InclusionFinder.notifyError = function(message) { errorMessages.push("InclusionFinder - " + message); }
            Firecrow.DependencyGraph.Node.notifyError = function(message) { errorMessages.push("Node - " + message); }
            Firecrow.DoppelBrowser.Browser.notifyError = function(message) { errorMessages.push("Browser - " + message); }
            Firecrow.Interpreter.Model.RegEx.notifyError = function(message) { errorMessages.push("RegEx - " + message); }
            Firecrow.Interpreter.Model.String.notifyError = function(message) { errorMessages.push("String - " + message); }
            Firecrow.Interpreter.Model.Array.notifyError = function(message) { errorMessages.push("Array - " + message); }
            Firecrow.Interpreter.Model.Attr.notifyError = function(message) { errorMessages.push("Attr - " + message); }
            Firecrow.Interpreter.Model.Identifier.notifyError = function(message) { errorMessages.push("Identifier - " + message); }
            Firecrow.Interpreter.Model.fcValue.notifyError = function(message) { errorMessages.push("FcValue - " + message); }
            Firecrow.Interpreter.Model.Object.notifyError = function(message) { errorMessages.push("Object - " + message); }
            Firecrow.Interpreter.Model.Math.notifyError = function(message) { errorMessages.push("Math - " + message); }
            Firecrow.Interpreter.Simulator.Evaluator.notifyError = function(message) { errorMessages.push("Evaluator - " + message); }
            Firecrow.Interpreter.Simulator.ExecutionContext.notifyError = function(message) { errorMessages.push("ExecutionContext - " + message); }
            Firecrow.Interpreter.Simulator.InternalExecutor.notifyError = function(message) { errorMessages.push("InternalExecutor - " + message); }
            Firecrow.Interpreter.Simulator.VariableObject.notifyError = function(message) { errorMessages.push("VariableObject - " + message); }
            Firecrow.Interpreter.InterpreterSimulator.notifyError = function(message) { errorMessages.push("InterpreterSimulator - " + message); }

            Firecrow.DependencyGraph.Node.LAST_ID = 0;
            Firecrow.Interpreter.Model.fcValue.LAST_ID = 0;
            Firecrow.Interpreter.Commands.Command.LAST_COMMAND_ID = 0;
            Firecrow.Interpreter.Model.Identifier.LAST_ID = 0;
            Firecrow.Interpreter.Model.Object.LAST_ID = 0;
        }
    }
    catch(e) { fcBrowser.Browser.notifyError("Error when initialising Doppel Browser.Browser: " + e); }
};

fcBrowser.Browser.notifyError = function(message) { alert("Browser - " + message); };

var Browser = Firecrow.DoppelBrowser.Browser;

Browser.prototype =
{
    evaluatePage: function()
    {
        try
        {
            this._buildSubtree(this.pageModel.htmlElement, null);
            this._handleEvents();
        }
        catch(e) { this.notifyError("Exception when building page from model: " + e); }
    },

    executeEvent: function(eventInfo, argumentValues)
    {
        var handlerConstruct = eventInfo.handler.codeConstruct;

        this._interpretJsCode
        (
            handlerConstruct.body,
            {
                functionHandler: eventInfo.handler,
                thisObject: eventInfo.thisObject,
                argumentValues: argumentValues,
                registrationPoint: eventInfo.registrationPoint
            }
        );
    },

    _buildSubtree: function(htmlModelElement, parentDomElement)
    {
        var htmlDomElement = this._createStaticHtmlNode(htmlModelElement);
        htmlModelElement.hasBeenExecuted = true;

        this._setAttributes(htmlDomElement, htmlModelElement);
        this._insertIntoDom(htmlDomElement, parentDomElement);

        if(this.globalObject.satisfiesDomSlicingCriteria(htmlDomElement))
        {
            Firecrow.includeNode(htmlModelElement);
        }

        if(this._isScriptNode(htmlModelElement) || this._isCssInclusionNode(htmlModelElement))
        {
            if(this._isScriptNode(htmlModelElement)) { this._handleScriptNode(htmlModelElement); }
            else if(this._isCssInclusionNode(htmlModelElement)) { this._buildCssNodes(htmlModelElement); }

            if(htmlModelElement.textContent)
            {
                htmlDomElement.textContent = htmlModelElement.textContent;
            }
        }

        this.createDependenciesBetweenHtmlNodeAndCssNodes(htmlModelElement);
        this._processChildren(htmlDomElement, htmlModelElement);
    },

    _handleScriptNode: function(htmlModelElement)
    {
        this._buildJavaScriptNodes(htmlModelElement);
        this._interpretJsCode(htmlModelElement.pathAndModel.model, null);
        this._callInterpretJsCallbacks(htmlModelElement.pathAndModel.model);
    },

    _isScriptNode: function(htmlModelElement)
    {
        if(htmlModelElement == null) { return false; }

        return  htmlModelElement.type == "script";
    },

    _isCssInclusionNode: function(htmlModelElement)
    {
        if(htmlModelElement == null) { return false; }

        return htmlModelElement.type == "style" || this._isExternalStyleLink(htmlModelElement);
    },

    _setAttributes: function(htmlDomElement, htmlModelElement)
    {
        var attributes = htmlModelElement.attributes;

        for(var i = 0, length = attributes.length; i < length; i++)
        {
            var attribute = attributes[i];
            htmlDomElement.setAttribute(attribute.name, attribute.value);
        }
    },

    _processChildren: function(htmlDomElement, htmlModelElement)
    {
        var childNodes = htmlModelElement.childNodes;

        for(var i = 0, length = childNodes.length; i < length; i++)
        {
            this._buildSubtree(childNodes[i], htmlDomElement);
        }
    },

    _createStaticHtmlNode: function(htmlModelNode)
    {
        var htmlDomElement = null;

        if(htmlModelNode.type == "html") { htmlDomElement = this.hostDocument.documentElement; }
        else if (htmlModelNode.type == "head" || htmlModelNode.type == "body") { htmlDomElement = this.hostDocument[htmlModelNode.type]; }
        else if (htmlModelNode.type == "textNode") { htmlDomElement = this.hostDocument.createTextNode(htmlModelNode.textContent); }
        else
        {
            if(this._isExternalStyleLink(htmlModelNode))
            {
                htmlDomElement = this.hostDocument.createElement("style");
            }
            else
            {
                htmlDomElement = this.hostDocument.createElement(htmlModelNode.type);
            }
        }

        htmlDomElement.modelElement = htmlModelNode;
        htmlModelNode.domElement = htmlDomElement;

        this.callNodeCreatedCallbacks(htmlModelNode, "html", false);

        return htmlDomElement;
    },

    _isExternalStyleLink: function(htmlModelElement)
    {
        if(htmlModelElement == null || htmlModelElement.type != "link"
        || htmlModelElement.attributes == null || htmlModelElement.attributes.length == 0) { return false; }

        for(var i = 0; i < htmlModelElement.attributes.length; i++)
        {
            var attribute = htmlModelElement.attributes[i];

            if(attribute.name == "type" && attribute.value == "text/css") { return true; }
            else if (attribute.name == "rel" && attribute.value == "stylesheet") { return true; }
        }

        return false;
    },

    _interpretJsCode: function(codeModel, handlerInfo)
    {
        try
        {
            //console.log("Interpreting @ " + codeModel.loc.start.line);
            var interpreter = new Interpreter(codeModel, this.globalObject, handlerInfo);

            interpreter.registerMessageGeneratedCallback(function(message)
            {
                this._callInterpreterMessageGeneratedCallbacks(message);
            }, this);

            interpreter.registerControlFlowConnectionCallback(function(codeConstruct)
            {
                this._callControlFlowConnectionCallbacks(codeConstruct);
            }, this);

            interpreter.runSync();
        }
        catch(e)
        {
            this.notifyError("DoppelBrowser.browser error when interpreting js code: " + e + "@" + e.fileName + " " + e.lineNumber);
        }
    },

    getExecutionInfo: function()
    {
        return this.executionInfo;
    },

    getUndefinedGlobalPropertiesAccessMap: function()
    {
        var map = {};

        var itemMap = this.executionInfo.undefinedGlobalPropertiesAccessMap;

        for(var propertyName in itemMap)
        {
            if(propertyName == "") { continue; }

            if(map[propertyName] == null)
            {
                map[propertyName] = itemMap[propertyName];
            }
            else
            {
                var expanderObject = itemMap[propertyName];
                var expandedObject = map[propertyName];

                for(var codeConstructId in expanderObject)
                {
                    expandedObject[codeConstructId] = expanderObject[codeConstructId];
                }
            }
        }

        return map;
    },

    getResourceSetterMap: function()
    {
        var map = {};

        var itemMap = this.executionInfo.resourceSetterPropertiesMap;

        for(var propName in itemMap)
        {
            map[propName] = itemMap[propName];
        }

        return map;
    },

    getForInIterationsLog: function()
    {
        return this.executionInfo.objectForInIterations;
    },

    logAccessingUndefinedProperty: function(propertyName, codeConstruct)
    {
        this.executionInfo.logAccessingUndefinedProperty(propertyName, codeConstruct);
    },

    logResourceSetting: function(codeConstruct, resourcePath)
    {
        this.executionInfo.logResourceSetting(codeConstruct, resourcePath);
    },

    logForInIteration: function(codeConstruct, objectPrototype)
    {
        this.executionInfo.logForInIteration(codeConstruct, objectPrototype);
    },

    logSettingOutsideCurrentScopeIdentifierValue: function(identifier)
    {
        this.executionInfo.logSettingOutsideCurrentScopeIdentifierValue(identifier);
    },

    logReadingIdentifierOutsideCurrentScope: function(identifier, codeConstruct)
    {
        this.executionInfo.logReadingIdentifierOutsideCurrentScope(identifier, codeConstruct);
    },

    logReadingObjectPropertyOutsideCurrentScope: function(baseObjectId, propertyName, codeConstruct)
    {
        this.executionInfo.logReadingObjectPropertyOutsideCurrentScope(baseObjectId, propertyName, codeConstruct);
    },

    logModifyingExternalContextObject: function(baseObjectId, propertyName, codeConstruct)
    {
        this.executionInfo.logModifyingExternalContextObject(baseObjectId, propertyName, codeConstruct);
    },

    addPathConstraint: function(codeConstruct, constraint, inverse)
    {
        this.executionInfo.addConstraint(codeConstruct, constraint, inverse);
    },

    _insertIntoDom: function(htmlDomElement, parentDomElement)
    {
        if (htmlDomElement.tagName != null
         &&(htmlDomElement.tagName.toLowerCase() == "html"
         || htmlDomElement.tagName.toLowerCase() == "head"
         || htmlDomElement.tagName.toLowerCase() == "body"))
        {
            return;
        }

        if(htmlDomElement.tagName != null && htmlDomElement.tagName.toLowerCase() == "script")
        {
            //This is necessary in order to disable the automatic in-browser interpretation of script code
            htmlDomElement.type="DONT_PROCESS_SCRIPT";
        }

        parentDomElement == null ? this.hostDocument.appendChild(htmlDomElement)
                                 : parentDomElement.appendChild(htmlDomElement);

        this._callNodeInsertedCallbacks(htmlDomElement.modelElement, parentDomElement != null ? parentDomElement.modelElement : null);
    },

    _buildCssNodes: function(cssHtmlElementModelNode)
    {
        cssHtmlElementModelNode.cssRules = cssHtmlElementModelNode.pathAndModel.model.rules;
        var cssText = "";
        cssHtmlElementModelNode.cssRules.forEach(function(cssRule)
        {
            cssRule.hasBeenExecuted = true;
            this.callNodeCreatedCallbacks(cssRule, "css", false);
            this._callNodeInsertedCallbacks(cssRule, cssHtmlElementModelNode);
            cssText += cssRule.cssText;
            this.cssRules.push(cssRule);
        }, this);

        if(this._isExternalStyleLink(cssHtmlElementModelNode))
        {
            cssHtmlElementModelNode.domElement.textContent = cssText;
        }
    },

    createDependenciesBetweenHtmlNodeAndCssNodes: function(htmlModelNode)
    {
        if(htmlModelNode.type == "textNode") { return; }

        var cssRules = this.cssRules;

        for(var i = 0, length = cssRules.length; i < length; i++)
        {
           var cssRule = cssRules[i];

            if(this.matchesSelector(htmlModelNode.domElement, cssRule.selector))
           {
                this.callDataDependencyEstablishedCallbacks(htmlModelNode, cssRule, this.globalObject.getPreciseEvaluationPositionId());
           }
        }
    },

    matchesSelector: function(htmlElement, selector)
    {
        if(this._matchesSelector == null || htmlElement instanceof DocumentFragment || htmlElement instanceof Text) { return false; }

        return this._matchesSelector.call(htmlElement, selector);
    },

    _buildJavaScriptNodes: function(scriptHtmlElementModelNode)
    {
        try
        {
            var that = this;
            ASTHelper.traverseAst(scriptHtmlElementModelNode.pathAndModel.model, function(currentNode, nodeName, parentNode)
            {
                that.callNodeCreatedCallbacks(currentNode, "js", false);
                that._callNodeInsertedCallbacks(currentNode, ASTHelper.isProgram(parentNode) ? scriptHtmlElementModelNode : parentNode);
            });
        }
        catch(e) { this.notifyError("DoppelBrowser.browser error when building js nodes: " + e); }
    },

    _isExecutionWithinHandler: function(eventTrace, handlerConstruct)
    {
        if(eventTrace == null || handlerConstruct == null) { return false; }

        //TODO FF15 removed source: handlerConstruct.loc.source.replace("///", "/") == eventFile add this also when compensate
        return eventTrace.line >= handlerConstruct.loc.start.line && eventTrace.line <= handlerConstruct.loc.end.line;
    },

    _isBrowserGeneratedEvent: function(eventTrace)
    {
        if (eventTrace == null || eventTrace.args == null) { return false; }

        return eventTrace.args.type === "" || eventTrace.args.type == "load"
            || eventTrace.args.type == "DOMContentLoaded";
    },

    _isElementEvent: function(eventTrace, eventType)
    {
        if (eventTrace == null || eventTrace.args == null) { return false; }

        return eventTrace.args.type == eventType || "on" + eventTrace.args.type == eventType
            || eventTrace.args.type == "elementEvent";
    },

    _handleEvents: function()
    {
        try
        {
            if(this.pageModel.eventTraces == null) { return; }

            this.globalObject.document.addProperty("readyState", new fcModel.fcValue("complete", null, null));

            var eventTraces = this.pageModel.eventTraces;

            var domContentReadyMethods = this.globalObject.getDOMContentLoadedHandlers();
            var onLoadFunctions = this.globalObject.getOnLoadFunctions();

            var htmlElementEvents = this.globalObject.htmlElementEventHandlingRegistrations;
            var timeoutEvents = this.globalObject.timeoutHandlers;
            var intervalEvents = this.globalObject.intervalHandlers;

            for(var i = 0, length = eventTraces.length; i < length; i++)
            {
                var eventTrace = eventTraces[i];
                this._adjustCurrentInputStates(eventTrace.args.currentInputStates);
                var eventFile = eventTrace.filePath;
                this.globalObject.currentEventTime = eventTrace.currentTime;

                if(this._isBrowserGeneratedEvent(eventTrace))
                {
                    if(this._handleDomContentReadyMethods(domContentReadyMethods, eventTrace)) { continue; }
                    if(this._handleOnLoadMethod(onLoadFunctions, eventTrace)) { continue; }
                    if(this._handleTimingEvents(intervalEvents, timeoutEvents, eventTrace)) { continue; }
                }
                else
                {
                    this._handleHtmlEvents(htmlElementEvents, eventTrace);
                }

                if(!eventTrace.hasBeenHandled)
                {
                    console.log(eventTrace.args.type + "@" + eventTrace.line + " not handled!");
                }
            }
        }
        catch(e)
        {
            this.notifyError("Error when handling events: " + e + this.url + e.fileName +  e.lineNumber );
        }
    },

    _handleDomContentReadyMethods: function(domContentReadyMethods, eventTrace)
    {
        var domContentReadyInfo = domContentReadyMethods[0];

        if(domContentReadyInfo != null)
        {
            var handlerConstruct = domContentReadyInfo.handler.codeConstruct;

            if(this._isExecutionWithinHandler(eventTrace, handlerConstruct))
            {
                this._interpretJsCode
                (
                    handlerConstruct.body,
                    {
                        functionHandler: domContentReadyInfo.handler,
                        thisObject: domContentReadyInfo.thisObject,
                        argumentValues: [],
                        registrationPoint: domContentReadyInfo.registrationPoint
                    }
                );

                eventTrace.hasBeenHandled = true;

                domContentReadyMethods.shift();
                return true;
            }
        }

        return false;
    },

    _handleOnLoadMethod: function(onLoadFunctions, eventTrace)
    {
        var onLoadInfo = onLoadFunctions[0];

        if(onLoadInfo != null)
        {
            var handlerConstruct = onLoadInfo.handler.codeConstruct;

            if(this._isExecutionWithinHandler(eventTrace, handlerConstruct))
            {
                this._interpretJsCode
                (
                    handlerConstruct.body,
                    {
                        functionHandler: onLoadInfo.handler,
                        thisObject: this.globalObject,
                        argumentValues: [],
                        registrationPoint: onLoadInfo.registrationPoint
                    }
                );

                eventTrace.hasBeenHandled = true;

                onLoadFunctions.shift();
                return true;
            }
        }

        return false;
    },

    _handleTimingEvents: function(intervalEvents, timeoutEvents, eventTrace)
    {
        for(var j = 0, intervalLength = intervalEvents.length; j < intervalLength; j++)
        {
            var event = intervalEvents[j];

            var handlerConstruct = event.handler.codeConstruct;

            if(this._isExecutionWithinHandler(eventTrace, handlerConstruct))
            {
                this._interpretJsCode
                (
                    handlerConstruct.body,
                    {
                        functionHandler: event.handler,
                        thisObject: this.globalObject,
                        argumentValues: event.callArguments,
                        registrationPoint: event.registrationPoint
                    }
                );

                eventTrace.hasBeenHandled = true;

                break;
            }
        }

        for(var j = 0, timeoutLength = timeoutEvents.length; j < timeoutLength; j++)
        {
            var event = timeoutEvents[j];

            var handlerConstruct = event.handler.codeConstruct;

            if(this._isExecutionWithinHandler(eventTrace, handlerConstruct))
            {
                this._interpretJsCode
                (
                    handlerConstruct.body,
                    {
                        functionHandler: event.handler,
                        thisObject: this.globalObject,
                        argumentValues: event.callArguments,
                        registrationPoint: event.registrationPoint
                    }
                );

                eventTrace.hasBeenHandled = true;

                ValueTypeHelper.removeFromArrayByIndex(timeoutEvents, j);
                break;
            }
        }
    },

    _handleHtmlEvents: function(htmlElementEvents, eventTrace)
    {
        for(var j = 0, htmlEventsLength = htmlElementEvents.length; j < htmlEventsLength; j++)
        {
            var event = htmlElementEvents[j];
            var fcHtmlElement = event.fcHtmlElement;
            var xPath = this._getElementXPath(fcHtmlElement.htmlElement);

            if(xPath != eventTrace.args.targetXPath && xPath != eventTrace.thisValue.xPath ) { continue; }

            if(this._isElementEvent(eventTrace, event.eventType))
            {
                var handlerConstruct = event.handler.codeConstruct;

                if(this._isExecutionWithinHandler(eventTrace, handlerConstruct))
                {
                    var eventThisObject = new fcModel.fcValue(fcHtmlElement.htmlElement, fcHtmlElement, null);
                    this._interpretJsCode
                    (
                        handlerConstruct.body,
                        {
                            functionHandler: event.handler,
                            thisObject: eventThisObject,
                            argumentValues: this._getArguments(eventTrace.args, eventThisObject),
                            registrationPoint: event.registrationPoint
                        }
                    );

                    eventTrace.hasBeenHandled = true;
                    break;
                }
            }
        }
    },

    _adjustCurrentInputStates: function(currentInputStates)
    {
        if(currentInputStates == null || currentInputStates.length == 0) { return; }

        for(var i = 0, length = currentInputStates.length; i < length; i++)
        {
            var inputState = currentInputStates[i];

            var wrappedElement = this.globalObject.document.getElementByXPath(inputState.elementXPath)

            if(wrappedElement != null && wrappedElement.value != null)
            {
                var element = wrappedElement.value;
                element.checked = inputState.checked;
                element.value = inputState.value;
            }
        }
    },

    registerNodeCreatedCallback: function(callback, thisObject)
    {
        if(!ValueTypeHelper.isOfType(callback, Function)) { this.notifyError("DoppelBrowser.Browser - node created callback has to be a function!"); return; }

        this.nodeCreatedCallbacks.push({callback: callback, thisObject: thisObject || this});
    },

    registerNodeInsertedCallback: function(callback, thisObject)
    {
        if(!ValueTypeHelper.isOfType(callback, Function)) { this.notifyError("DoppelBrowser.Browser - node inserted callback has to be a function!"); return; }

        this.nodeInsertedCallbacks.push({callback: callback, thisObject: thisObject || this});
    },

    registerInterpretJsCallback: function(callback, thisObject)
    {
        if(!ValueTypeHelper.isOfType(callback, Function)) { this.notifyError("DoppelBrowser.Browser - interpret js callback has to be a function!"); return; }

        this.interpretJsCallbacks.push({callback: callback, thisObject: thisObject || this});
    },

    registerInterpreterMessageGeneratedCallback: function(callback, thisObject)
    {
        if(!ValueTypeHelper.isOfType(callback, Function)) { this.notifyError("DoppelBrowser.Browser - interpreter message generated callback has to be a function!"); return; }

        this.interpreterMessageGeneratedCallbacks.push({callback: callback, thisObject: thisObject || this});
    },

    registerInterpretJsCallback: function(callback, thisObject)
    {
        if(!ValueTypeHelper.isOfType(callback, Function)) { this.notifyError("DoppelBrowser.Browser - interpret js callback has to be a function!"); return; }

        this.interpretJsCallbacks.push({callback: callback, thisObject: thisObject || this});
    },

    registerControlFlowConnectionCallback: function(callback, thisObject)
    {
        if(!ValueTypeHelper.isOfType(callback, Function)) { this.notifyError("DoppelBrowser.Browser - control flow connection callback has to be a function!"); return; }

        this.controlFlowConnectionCallbacks.push({callback: callback, thisObject: thisObject || this});
    },

    registerControlDependencyEstablishedCallback: function(callback, thisObject)
    {
        if(!ValueTypeHelper.isOfType(callback, Function)) { this.notifyError("DoppelBrowser.Browser - control dependency established callback has to be a function!"); return; }

        this.controlDependencyEstablishedCallbacks.push({callback: callback, thisObject: thisObject || this});
    },

    registerDataDependencyEstablishedCallback: function(callback, thisObject)
    {
        if(!ValueTypeHelper.isOfType(callback, Function)) { this.notifyError("DoppelBrowser.Browser - data dependency established callback has to be a function!"); return; }

        this.dataDependencyEstablishedCallbacks.push({callback: callback, thisObject: thisObject || this});
    },

    registerImportantConstructReachedCallback: function(callback, thisObject)
    {
        if(!ValueTypeHelper.isOfType(callback, Function)) { this.notifyError("DoppelBrowser.Browser - important construct reached callback has to be a function!"); return; }

        this.importantConstructReachedCallbacks.push({callback: callback, thisObject: thisObject || this});
    },

    registerBreakContinueReturnEventReached: function(callback, thisObject)
    {
        if(!ValueTypeHelper.isOfType(callback, Function)) { this.notifyError("DoppelBrowser.Browser - break continue return event construct reached callback has to be a function!"); return; }

        this.breakContinueReturnEventsCallbacks.push({callback: callback, thisObject: thisObject || this});
    },

    registerDocumentReadyCallback: function(callback, thisObject)
    {
        if(!ValueTypeHelper.isOfType(callback, Function)) { this.notifyError("DoppelBrowser.Browser - important document ready callback has to be a function!"); return; }

        this.documentReadyCallbacks.push({callback: callback, thisObject: thisObject || this});
    },

    _callDocumentReadyCallbacks: function()
    {
        this.documentReadyCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject);
        });
    },

    callNodeCreatedCallbacks: function(nodeModelObject, nodeType, isDynamic)
    {
        this.nodeCreatedCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, nodeModelObject, nodeType, isDynamic);
        });
    },

    _callNodeInsertedCallbacks: function(nodeModelObject, nodeType, isDynamic)
    {
        this.nodeInsertedCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, nodeModelObject, nodeType, isDynamic);
        });
    },

    _callInterpreterMessageGeneratedCallbacks: function(message)
    {
        this.interpreterMessageGeneratedCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, message);
        });
    },

    _callInterpretJsCallbacks: function(programModel)
    {
        this.interpretJsCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, programModel);
        });
    },

    _callControlFlowConnectionCallbacks: function(codeConstruct)
    {
        this.controlFlowConnectionCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, codeConstruct);
        });
    },

    callControlDependencyEstablishedCallbacks: function(sourceNode, targetNode, dependencyCreationInfo, destinationNodeDependencyInfo, isPreviouslyExecutedBlockStatementDependency)
    {
        this.controlDependencyEstablishedCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, sourceNode, targetNode, dependencyCreationInfo, destinationNodeDependencyInfo, isPreviouslyExecutedBlockStatementDependency);
        });
    },

    callDataDependencyEstablishedCallbacks: function(sourceNode, targetNode, dependencyCreationInfo, destinationNodeDependencyInfo, shouldNotFollowDependencies)
    {
        if(sourceNode == null || targetNode == null) { return; }

        this.dataDependencyEstablishedCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, sourceNode, targetNode, dependencyCreationInfo, destinationNodeDependencyInfo, shouldNotFollowDependencies);
        });
    },

    logDomQueried: function(methodName, selector, codeConstruct)
    {
        if(this.domQueriesMap[codeConstruct.nodeId] == null)
        {
            this.domQueriesMap[codeConstruct.nodeId] = { methodName: methodName, selectorsMap: {}, codeConstruct: codeConstruct};
        }

        this.domQueriesMap[codeConstruct.nodeId].selectorsMap[selector] = true;
    },

    //TODO - think about new name
    callBreakContinueReturnEventCallbacks: function(node, evaluationPosition)
    {
        this.breakContinueReturnEventsCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, node, evaluationPosition);
        });
    },

    callImportantConstructReachedCallbacks: function(importantNode)
    {
        this.importantConstructReachedCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, importantNode);
        });
    },

    _getDocumentObject: function()
    {
        return Firecrow.IsDebugMode ? document : Firecrow.fbHelper.getCurrentPageDocument();
    },

    registerSlicingCriteria: function(slicingCriteria)
    {
        this.globalObject.registerSlicingCriteria(slicingCriteria);
    },

    clean: function() {},

    _getElementXPath: function(element)
    {
        var paths = [];

        for (; element && element.nodeType == 1; element = element.parentNode)
        {
            var index = 0;
            for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling)
            {
                if (sibling.localName == element.localName)
                    ++index;
            }

            var tagName = element.localName.toLowerCase();
            var pathIndex = (index ? "[" + (index+1) + "]" : "");
            paths.splice(0, 0, tagName + pathIndex);
        }

        return paths.length ? "/" + paths.join("/") : "";
    },

    _getArguments: function(eventTraceArgs, thisValue)
    {
        var arguments = [];

        var eventInfo = {};
        var eventInfoJsObject = new fcModel.Event(eventInfo, this.globalObject, thisValue);

        for(var propName in eventTraceArgs)
        {
            if(propName.indexOf("XPath") != -1)
            {
                var element =  this.globalObject.document.getElementByXPath(eventTraceArgs[propName]);
                propName = propName.replace("XPath", "");
                eventInfoJsObject.addProperty(propName, element);
                eventInfo[propName] = element;
            }
            else
            {
                var value = new fcModel.fcValue(eventTraceArgs[propName], null, null);
                eventInfoJsObject.addProperty(propName, value);
                eventInfo[propName] = value;
            }
        }

        arguments.push(new fcModel.fcValue(eventInfo, eventInfoJsObject, null));

        return arguments;
    },

    notifyError: function(message) { Firecrow.DoppelBrowser.Browser.notifyError(message); }
};
}});