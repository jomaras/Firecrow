/**
 * User: Jomaras
 * Date: 03.05.12.
 * Time: 09:11
 */
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

Firecrow.DoppelBrowser.Browser = function(pageModel)
{
    try
    {
        this.pageModel = pageModel;
        this.hostDocument = Firecrow.getDocument();
        this.documentFragment = this.hostDocument.createDocumentFragment();

        this.globalObject = new GlobalObject(this, this.documentFragment);

        this.nodeCreatedCallbacks = [];
        this.nodeInsertedCallbacks = [];
        this.interpretJsCallbacks = [];

        this.dataDependencyEstablishedCallbacks = [];
        this.controlDependencyEstablishedCallbacks = [];
        this.interpreterMessageGeneratedCallbacks = [];
        this.controlFlowConnectionCallbacks = [];
        this.importantConstructReachedCallbacks = [];
        this.documentReadyCallbacks = [];

        this.errorMessages = [];
        this.cssRules = [];

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
            Firecrow.Interpreter.Model.JsValue.notifyError = function(message) { errorMessages.push("JsValue - " + message); }
            Firecrow.Interpreter.Model.Object.notifyError = function(message) { errorMessages.push("Object - " + message); }
            Firecrow.Interpreter.Model.Math.notifyError = function(message) { errorMessages.push("Math - " + message); }
            Firecrow.Interpreter.Simulator.Evaluator.notifyError = function(message) { errorMessages.push("Evaluator - " + message); }
            Firecrow.Interpreter.Simulator.ExecutionContext.notifyError = function(message) { errorMessages.push("ExecutionContext - " + message); }
            Firecrow.Interpreter.Simulator.InternalExecutor.notifyError = function(message) { errorMessages.push("InternalExecutor - " + message); }
            Firecrow.Interpreter.Simulator.VariableObject.notifyError = function(message) { errorMessages.push("VariableObject - " + message); }
            Firecrow.Interpreter.InterpreterSimulator.notifyError = function(message) { errorMessages.push("InterpreterSimulator - " + message); }

            Firecrow.DependencyGraph.Node.LAST_ID = 0;
            Firecrow.Interpreter.Model.JsValue.LAST_ID = 0;
            Firecrow.Interpreter.Commands.Command.LAST_COMMAND_ID = 0;
            Firecrow.Interpreter.Model.Identifier.LAST_ID = 0;
            Firecrow.Interpreter.Model.Object.LAST_ID = 0;
        }
    }
    catch(e) { Firecrow.DoppelBrowser.Browser.notifyError("Error when initialising Doppel Browser.Browser: " + e); }
};

Firecrow.DoppelBrowser.Browser.notifyError = function(message) { alert("Browser - " + message); };

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

    _buildSubtree: function(htmlModelElement, parentDomElement)
    {
        try
        {
            var htmlDomElement = this._createStaticHtmlNode(htmlModelElement);

            this._setAttributes(htmlDomElement, htmlModelElement);

            this._insertIntoDom(htmlDomElement, parentDomElement);

            if(htmlModelElement.type == "script" || htmlModelElement.type == "style")
            {
                if(htmlModelElement.type == "script")
                {
                    this._buildJavaScriptNodes(htmlModelElement);
                    this._interpretJsCode(htmlModelElement.pathAndModel.model, null);
                    this._callInterpretJsCallbacks(htmlModelElement.pathAndModel.model);
                }
                else if(htmlModelElement.type == "style" || htmlModelElement.type == "link")
                {
                    this._buildCssNodes(htmlModelElement);
                }

                htmlDomElement.textContent = htmlModelElement.textContent
            }

            this._createDependenciesBetweenHtmlNodeAndCssNodes(htmlModelElement);
            this._processChildren(htmlDomElement, htmlModelElement);
        }
        catch(e)
        {
            this.notifyError("Error when building a subtree of an html element in DoppelBrowser.browser: " + e);
        }
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
            var childNode = childNodes[i];

            if(childNode.type != "textNode") { this._buildSubtree(childNode, htmlDomElement); }
            else { htmlDomElement.appendChild(this.hostDocument.createTextNode(childNode.textContent)); }
        }
    },

    _createStaticHtmlNode: function(htmlModelNode)
    {
        var htmlDomElement = this.hostDocument.createElement(htmlModelNode.type);

        htmlDomElement.modelElement = htmlModelNode;
        htmlModelNode.domElement = htmlDomElement;

        this._callNodeCreatedCallbacks(htmlModelNode, "html", false);

        return htmlDomElement;
    },

    _interpretJsCode: function(codeModel, handlerInfo)
    {
        try
        {
            var interpreter = new Interpreter(codeModel, this.globalObject, handlerInfo);
            this.globalObject.document.reevaluateProperties();

            interpreter.registerMessageGeneratedCallback(function(message)
            {
                this._callInterpreterMessageGeneratedCallbacks(message);
            }, this);

            interpreter.registerControlFlowConnectionCallback(function(codeConstruct)
            {
                this._callControlFlowConnectionCallbacks(codeConstruct);
            }, this);

            interpreter.runSync();

            if(interpreter.executionContextStack.blockCommandStack.length != 0) { this.notifyError("There are still commands in the block command stack" + scriptModelNode.pathAndModel.path); }
        }
        catch(e) { this.notifyError("DoppelBrowser.browser error when interpreting js code: " + e); }
    },

    _insertIntoDom: function(htmlDomElement, parentDomElement)
    {
        parentDomElement == null ? this.documentFragment.appendChild(htmlDomElement)
                                 : parentDomElement.appendChild(htmlDomElement);

        this._callNodeInsertedCallbacks(htmlDomElement.modelElement, parentDomElement != null ? parentDomElement.modelElement : null);
    },

    _buildCssNodes: function(cssHtmlElementModelNode)
    {
        try
        {
            cssHtmlElementModelNode.cssRules = cssHtmlElementModelNode.pathAndModel.model.rules;
            cssHtmlElementModelNode.cssRules.forEach(function(cssRule)
            {
                this._callNodeCreatedCallbacks(cssRule, "css", false);
                this._callNodeInsertedCallbacks(cssRule, cssHtmlElementModelNode);
                this.cssRules.push(cssRule);
            }, this);
        }
        catch(e) { this.notifyError("DoppelBrowser.browser error when building css nodes: " + e);}
    },

    _createDependenciesBetweenHtmlNodeAndCssNodes: function(htmlModelNode)
    {
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
        if(this._matchesSelector == null) { return false; }

        return this._matchesSelector.call(htmlElement, selector);
    },

    _buildJavaScriptNodes: function(scriptHtmlElementModelNode)
    {
        try
        {
            var that = this;
            ASTHelper.traverseAst(scriptHtmlElementModelNode.pathAndModel.model, function(currentNode, nodeName, parentNode)
            {
                that._callNodeCreatedCallbacks(currentNode, "js", false);
                that._callNodeInsertedCallbacks(currentNode, ASTHelper.isProgram(parentNode) ? scriptHtmlElementModelNode : parentNode);
            });
        }
        catch(e) { this.notifyError("DoppelBrowser.browser error when building js nodes: " + e); }
    },

    _handleEvents: function()
    {
        try
        {
            if(this.pageModel.eventTraces == null) { return; }

            var eventTraces = this.pageModel.eventTraces;

            var documentDomContentReadyMethods = this.globalObject.document.eventListenerInfo["DOMContentLoaded"] || [];
            var windowDomContentReadyMethods = this.globalObject.eventListenerInfo["DOMContentLoaded"] || [];
            var onLoadFunction = this.globalObject.getPropertyValue("onload");
            var htmlElementEvents = this.globalObject.htmlElementEventHandlingRegistrations;
            var timeoutEvents = this.globalObject.timeoutHandlers;
            var intervalEvents = this.globalObject.intervalHandlers;

            for(var i = 0, length = eventTraces.length; i < length; i++)
            {
                var eventTrace = eventTraces[i];
                var eventFile = eventTrace.filePath;

                if(eventTrace.args.type == "")
                {
                    var domContentReadyInfo = documentDomContentReadyMethods[0];

                    if(domContentReadyInfo != null)
                    {
                        var handlerConstruct = domContentReadyInfo.handler.fcInternal.object.codeConstruct;

                        if(handlerConstruct.loc.source.replace("///", "/") == eventFile
                        && eventTrace.line >= handlerConstruct.loc.start.line && eventTrace.line <= handlerConstruct.loc.end.line)
                        {
                            this._interpretJsCode
                            (
                                handlerConstruct.body,
                                {
                                    functionHandler: domContentReadyInfo.handler,
                                    thisObject: this.globalObject.document,
                                    argumentValues: [],
                                    registrationPoint: domContentReadyInfo.registrationPoint
                                }
                            );

                            documentDomContentReadyMethods.shift();
                            continue;
                        }
                    }

                    domContentReadyInfo = windowDomContentReadyMethods[0];

                    if(domContentReadyInfo != null)
                    {
                        var handlerConstruct = domContentReadyInfo.handler.fcInternal.object.codeConstruct;

                        if(handlerConstruct.loc.source.replace("///", "/") == eventFile
                        && eventTrace.line >= handlerConstruct.loc.start.line && eventTrace.line <= handlerConstruct.loc.end.line)
                        {
                            this._interpretJsCode
                            (
                                handlerConstruct.body,
                                {
                                    functionHandler: domContentReadyInfo.handler,
                                    thisObject: this.globalObject,
                                    argumentValues: [],
                                    registrationPoint: domContentReadyInfo.registrationPoint
                                }
                            );

                            windowDomContentReadyMethods.shift();
                            continue;
                        }
                    }

                    if(onLoadFunction != null)
                    {
                        var handlerConstruct = onLoadFunction.fcInternal.object.codeConstruct;

                        if(handlerConstruct.loc.source.replace("///", "/") == eventFile
                        && eventTrace.line >= handlerConstruct.loc.start.line && eventTrace.line <= handlerConstruct.loc.end.line)
                        {
                            this._interpretJsCode
                            (
                                handlerConstruct.body,
                                {
                                    functionHandler: onLoadFunction,
                                    thisObject: this.globalObject,
                                    argumentValues: [],
                                    registrationPoint: this.globalObject.getProperty("onload").lastModificationConstruct
                                }
                            );

                            onLoadFunction = null;
                            continue;
                        }
                    }

                    for(var j = 0, intervalLength = intervalEvents.length; j < intervalLength; j++)
                    {
                        var event = intervalEvents[j];

                        var handlerConstruct = event.handler.fcInternal.object.codeConstruct;

                        if(handlerConstruct.loc.source.replace("///", "/") == eventFile
                        && eventTrace.line >= handlerConstruct.loc.start.line && eventTrace.line <= handlerConstruct.loc.end.line)
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
                            break;
                        }
                    }

                    for(var j = 0, timeoutLength = timeoutEvents.length; j < timeoutLength; j++)
                    {
                        var event = timeoutEvents[j];

                        var handlerConstruct = event.handler.fcInternal.object.codeConstruct;

                        if(handlerConstruct.loc.source.replace("///", "/") == eventFile
                            && eventTrace.line >= handlerConstruct.loc.start.line && eventTrace.line <= handlerConstruct.loc.end.line)
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

                            ValueTypeHelper.removeFromArrayByIndex(timeoutEvents, j);
                            break;
                        }
                    }
                }
                else
                {
                    for(var j = 0, htmlEventsLength = htmlElementEvents.length; j < htmlEventsLength; j++)
                    {
                        var event = htmlElementEvents[j];
                        var fcHtmlElement = event.fcHtmlElement;
                        var xPath = this._getElementXPath(fcHtmlElement.htmlElement);

                        if(xPath != eventTrace.args.targetXPath
                        && xPath != eventTrace.thisValue.xPath ) { continue; }

                        if(eventTrace.args.type == event.eventType || "on" + eventTrace.args.type == event.eventType
                        || eventTrace.args.type == "elementEvent")
                        {
                            var handlerConstruct = event.handler.fcInternal.object.codeConstruct;

                            if(handlerConstruct.loc.source.replace("///", "/") == eventFile
                            && eventTrace.line >= handlerConstruct.loc.start.line && eventTrace.line <= handlerConstruct.loc.end.line)
                            {
                                this._interpretJsCode
                                (
                                    handlerConstruct.body,
                                    {
                                        functionHandler: event.handler,
                                        thisObject: fcHtmlElement,
                                        argumentValues: this._getArguments(eventTrace.args),
                                        registrationPoint: event.registrationPoint
                                    }
                                );

                                ValueTypeHelper.removeFromArrayByIndex(htmlElementEvents, j);
                                break;
                            }
                        }
                    }
                }
            }
        }
        catch(e) { this.notifyError("Error when handling events: " + e); }
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

    _callNodeCreatedCallbacks: function(nodeModelObject, nodeType, isDynamic)
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

    callControlDependencyEstablishedCallbacks: function(sourceNode, targetNode, dependencyCreationInfo, destinationNodeDependencyInfo)
    {
        this.controlDependencyEstablishedCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, sourceNode, targetNode, dependencyCreationInfo, destinationNodeDependencyInfo);
        });
    },

    callDataDependencyEstablishedCallbacks: function(sourceNode, targetNode, dependencyCreationInfo, destinationNodeDependencyInfo)
    {
        this.dataDependencyEstablishedCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, sourceNode, targetNode, dependencyCreationInfo, destinationNodeDependencyInfo);
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

    clean: function()
    {
        this.globalObject.internalExecutor.removeInternalFunctions();
    },

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

    _getArguments: function(eventTraceArgs)
    {
        var arguments = [];

        var eventInfo = new fcModel.Object(this.globalObject);

        for(var propName in eventTraceArgs)
        {
            if(propName.indexOf("XPath") != -1)
            {
                eventInfo.addProperty(propName.replace("XPath", ""), this.globalObject.document.getElementByXPath(eventTraceArgs[propName]));
            }
            else
            {
                eventInfo.addProperty(propName.replace("XPath", ""), new fcModel.JsValue(eventTraceArgs[propName], new fcModel.FcInternal()));
            }
        }

        arguments.push(eventInfo);

        return arguments;
    },

    notifyError: function(message) { Firecrow.DoppelBrowser.Browser.notifyError(message); }
};
}});