FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcScenarioGenerator = Firecrow.ScenarioGenerator;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;
var fcSymbolic = fcScenarioGenerator.Symbolic;

fcScenarioGenerator.ScenarioGenerator =
{
    achievedCoverage: 0,
    achievedCoverages: [],
    scenarios: null,
    scenarioProcessingLimit: 100,

    generateScenarios: function(pageModel, scenarioExecutedCallback)
    {
        ASTHelper.setParentsChildRelationships(pageModel);

        var scenarios = new fcScenarioGenerator.ScenarioCollection();
        this.scenarios = scenarios;

        var browser = this._executeApplication(pageModel);
        this.achievedCoverage = ASTHelper.calculateCoverage(pageModel).expressionCoverage;

        this._createRegisteredEventsScenarios(browser, scenarios);

        var processedScenarioCounter = 0;

        var currentScenario = scenarios.getNext();
        var that = this;

        var asyncLoop = function()
        {
            if(currentScenario == null || processedScenarioCounter > that.scenarioProcessingLimit
            || that.achievedCoverage == 1)
            {
                scenarioExecutedCallback(scenarios.getSubsumedProcessedScenarios());
                return;
            }

            that._createDerivedScenarios(pageModel, currentScenario, scenarios, scenarioExecutedCallback);

            processedScenarioCounter++;

            if(scenarios.isLastScenario(currentScenario) || that._isStuck())
            {
                that._createMergedScenarios(pageModel, scenarios)
            }

            currentScenario = scenarios.getNext();

            setTimeout(asyncLoop, 1500);
        };

        setTimeout(asyncLoop, 100);
    },

    _isStuck: function()
    {
        if(this.achievedCoverages.length <= 10) { return false; }

        var lastItem = this.achievedCoverages[this.achievedCoverages.length-1];

        for(var i = this.achievedCoverages.length - 2; i >= this.achievedCoverages.length - 10; i--)
        {
            if(lastItem.branchCoverage != this.achievedCoverages[i].branchCoverage) { return false; }
        }

        return true;
    },

    _hasAchievedEnoughCoverage: function(pageModel, scenarios)
    {
        return (ASTHelper.calculatePageExpressionCoverage(pageModel) + scenarios.calculateEventCoverage() - 1) >= 0.99
    },

    _executeApplication: function(pageModel)
    {
        var browser = new FBL.Firecrow.DoppelBrowser.Browser(pageModel);

        browser.evaluatePage();

        this._executeLoadingEvents(browser);

        browser.setLoadingEventsExecuted();

        return browser;
    },

    _executeLoadingEvents: function(browser)
    {
        var loadingEvents = browser.globalObject.getLoadedHandlers();

        loadingEvents.forEach(function(loadingEvent)
        {
            browser.executeEvent(loadingEvent);
        }, this);
    },

    _createRegisteredEventsScenarios: function(browser, scenarios, scenarioCreatedCallback)
    {
        this._createEventsScenarios(browser.globalObject.timeoutHandlers, scenarios)
        this._createEventsScenarios(browser.globalObject.intervalHandlers, scenarios)
        this._createEventsScenarios(browser.globalObject.htmlElementEventHandlingRegistrations, scenarios)
    },

    _createEventsScenarios: function(eventRegistrations, scenarios)
    {
        for(var i = 0; i < eventRegistrations.length; i++)
        {
            var eventRegistration = eventRegistrations[i];

            var newScenario = new fcScenarioGenerator.Scenario
            ([new fcScenarioGenerator.Event
            (
                eventRegistration.thisObjectDescriptor,
                eventRegistration.thisObjectModel,
                eventRegistration.eventType,
                eventRegistration.registrationConstruct,
                eventRegistration.handlerConstruct
            )]);

            newScenario.createdBy = "eventRegistration";

            scenarios.addScenario(newScenario);
        }
    },

    _createDerivedScenarios: function(pageModel, scenario, scenarios, scenarioExecutedCallback)
    {
        var executionSummary = this._executeScenario(pageModel, scenario, scenarios);

        if(scenarioExecutedCallback != null) { scenarioExecutedCallback(scenario); }

        this._createInvertedPathScenarios(executionSummary, scenario, scenarios);
        this._createNewlyRegisteredEventsScenarios(executionSummary, scenario, scenarios);
    },

    _createInvertedPathScenarios: function(executionSummary, scenario, scenarios)
    {
        var invertedPaths = executionSummary.pathConstraint.getAllResolvedInversions();

        for(var i = 0; i < invertedPaths.length; i++)
        {
            scenarios.addScenarioByComponents(scenario.events, invertedPaths[i], [scenario]);
        }
    },

    _createNewlyRegisteredEventsScenarios: function(executionSummary, scenario, scenarios)
    {
        var newlyRegisteredEvents = this._getNewlyRegisteredEventsComparedToParents(scenario);

        for(var i = 0; i < newlyRegisteredEvents.length; i++)
        {
            var eventRegistration = newlyRegisteredEvents[i];

            var newScenario = scenario.createCopy();

            newScenario.events.push(new fcScenarioGenerator.Event
            (
                eventRegistration.thisObjectDescriptor,
                eventRegistration.thisObjectModel,
                eventRegistration.eventType,
                eventRegistration.registrationConstruct,
                eventRegistration.handlerConstruct
            ));

            newScenario.parentScenarios.push(scenario);

            scenarios.addScenario(newScenario);
        }
    },

    _getNewlyRegisteredEventsComparedToParents: function(scenario)
    {
        if(scenario.parentScenarios.length == 0)
        {
            return scenario.executionInfo.eventRegistrations.filter(function(eventRegistration)
            {
                return eventRegistration.loadingEventsExecuted;
            });
        }
        else
        {
            var parentScenariosEventRegistrations = [];

            scenario.parentScenarios.forEach(function(parentScenario)
            {
                parentScenariosEventRegistrations = parentScenariosEventRegistrations.concat(parentScenario.executionInfo.eventRegistrations);
            });

            return scenario.filterEvents(parentScenariosEventRegistrations);
        }
    },

    allReadyComparedScenarios: {},

    _createMergedScenarios: function(pageModel, scenarios)
    {
        console.log("Merging scenarios");
        //Has to be cached because new scenarios are added, and we don't want to take them into account
        var executedScenarios = scenarios.getExecutedScenarios();
        var scenariosLength = executedScenarios.length;

        for(var i = 0; i < scenariosLength; i++)
        {
            var ithScenario = executedScenarios[i];

            if(ithScenario == null) { callbackFunction(); return; }

            for(var j = 0; j < scenariosLength; j++)
            {
                var jthScenario = executedScenarios[j];

                if(this.allReadyComparedScenarios[i + "-" + j]) { continue; }

                var areCreatedByMerging = ithScenario.parentScenarios.length > 1 && jthScenario.parentScenarios.length > 1;

                if(jthScenario.executionInfo.isDependentOn(ithScenario.executionInfo, areCreatedByMerging))
                {
                    scenarios.addScenario(fcScenarioGenerator.Scenario.mergeScenarios(ithScenario, jthScenario));
                }

                this.allReadyComparedScenarios[i + "-" + j] = true;
            }
        }
    },

    _executeScenario: function(pageModel, scenario, scenarios)
    {
        var browser = this._executeApplication(pageModel);
        var parametrizedEvents = this._createParametrizedEvents(scenario);

        scenario.setParametrizedEvents(parametrizedEvents);

        for(var i = 0; i < parametrizedEvents.length; i++)
        {
            this._executeEvent(browser, parametrizedEvents[i], scenario, i);
        }

        var executionInfo = browser.getExecutionInfo();

        this._addDefaultConstraints(browser, scenario, parametrizedEvents);

        scenario.setExecutionInfo(executionInfo);

        var coverage = ASTHelper.calculateCoverage(pageModel);
        this.achievedCoverage = coverage.branchCoverage;
        this.achievedCoverages.push(coverage);

        return executionInfo;
    },

    _createParametrizedEvents: function(scenario)
    {
        if(scenario.inputConstraint == null)
        {
            return scenario.events.map(function(event)
            {
                return new fcScenarioGenerator.ParametrizedEvent(event, null);
            });
        }

        var parametrizedEvents = [];

        var resolvedResults = scenario.inputConstraint.resolvedResult;
        var events = scenario.events;

        for(var i = 0; i < events.length; i++)
        {
            var event = events[i];
            var resolvedResult = resolvedResults[i];
            parametrizedEvents.push(new fcScenarioGenerator.ParametrizedEvent(event, resolvedResult));
        }

        return parametrizedEvents;
    },

    _executeEvent: function(browser, parametrizedEvent, scenario, eventIndex)
    {
        browser.eventIndex = eventIndex;
        var eventRegistration = this._getMatchingEventRegistration(browser, parametrizedEvent.baseEvent.thisObjectModel, parametrizedEvent.baseEvent.registrationConstruct);

        if(eventRegistration == null) { return; }

        var handlerArguments = this._getArguments(eventRegistration, browser, parametrizedEvent.parameters, eventIndex);
        this._modifyDom(eventRegistration, scenario, parametrizedEvent.parameters);

        browser.executeEvent(eventRegistration, handlerArguments);
    },

    _addDefaultConstraints: function(browser, scenario, parametrizedEvents)
    {
        var executionInfo = browser.getExecutionInfo();
        var identifiersMap = executionInfo.pathConstraint.getSymbolicIdentifierNameMap();

        for(var identifierName in identifiersMap)
        {
            if(this._isPositiveNumberIdentifier(identifierName))
            {
                var binary = new fcSymbolic.Binary(new fcSymbolic.Identifier(identifierName), new fcSymbolic.Literal(0), ">=");

                binary.markAsIrreversible();

                var pathConstraintItem = new fcSymbolic.PathConstraintItem(null, binary);

                executionInfo.addPathConstraintItemToBeginning(pathConstraintItem);
                scenario.addInputConstraintItem(pathConstraintItem);
                scenario.addSolutionIfNotExistent(identifierName, 0);
            }
            else if(identifierName.indexOf("DOM_") == 0)
            {
                var id = fcSymbolic.ConstraintResolver.getHtmlElementIdFromSymbolicParameter(identifierName);
                var cleansedProperty = fcSymbolic.ConstraintResolver.getHtmlElementPropertyFromSymbolicParameter(identifierName);
                if(id != "")
                {
                    var htmlElement = browser.hostDocument.getElementById(id);

                    if(ValueTypeHelper.isHtmlSelectElement(htmlElement))
                    {
                        var availableValues = this._getSelectAvailableValues(htmlElement);
                        var binaryExpressions = [];

                        var compoundLogical = null;

                        for(var i = 0; i < availableValues.length; i++)
                        {
                            var binary = new fcSymbolic.Binary(new fcSymbolic.Identifier(identifierName), new fcSymbolic.Literal(availableValues[i]), "==");
                            binary.markAsIrreversible();
                            binaryExpressions.push(binary);

                            var previousBinary = binaryExpressions[i-1];
                            var currentBinary = binaryExpressions[i];

                            if(previousBinary != null && currentBinary != null)
                            {
                                if(compoundLogical == null)
                                {
                                    compoundLogical = new fcSymbolic.Logical(previousBinary, currentBinary, "||");
                                    compoundLogical.markAsIrreversible();
                                }
                                else
                                {
                                    compoundLogical = new fcSymbolic.Logical(compoundLogical, currentBinary, "||");
                                    compoundLogical.markAsIrreversible();
                                }
                            }
                        }

                        var pathConstraintItem = new fcSymbolic.PathConstraintItem(null, compoundLogical);
                        executionInfo.addPathConstraintItemToBeginning(pathConstraintItem);
                        scenario.addInputConstraintItem(pathConstraintItem);
                        scenario.addSolutionIfNotExistent(identifierName, availableValues[0]);
                    }
                    else
                    {
                        debugger;
                        alert("Unhandled HTMLElement in ScenarioGenerator when adding default constraints");
                    }
                }
                else
                {
                    debugger;
                    alert("No id in ScenarioGenerator when adding default constraints");
                }
            }
        }

        for(var i = 0; i < parametrizedEvents.length; i++)
        {
            var event = parametrizedEvents[i];

            for(var identifierName in identifiersMap)
            {
                if(this._isPositiveNumberIdentifier(identifierName))
                {
                    if(this.endsWithSuffix(identifierName, i))
                    {
                        var identifier = this.removeSuffix(identifierName);

                        if(event.parameters[identifier] == null)
                        {
                            event.parameters[identifier] = 0;
                        }
                    }
                }
            }
        }
    },

    _getSelectAvailableValues: function(selectElement)
    {
        var values = [];

        if(selectElement == null) { return values; }

        for(var i = 0; i < selectElement.children.length; i++)
        {
            values.push(selectElement.children[i].value);
        }

        return values;
    },

    _isPositiveNumberIdentifier: function(identifierName)
    {
        return identifierName.indexOf("page") == 0
            || identifierName.indexOf("client") == 0
            || identifierName.indexOf("layer") == 0
            || identifierName.indexOf("range") == 0
            || identifierName.indexOf("keyCode") == 0
            || identifierName.indexOf("screen") == 0
            || identifierName.indexOf("which") == 0;
    },

    _getMatchingEventRegistration: function(browser, thisObjectModel, registrationConstruct)
    {
        var intervalHandlers = browser.globalObject.intervalHandlers;
        for(var i = 0; i < intervalHandlers.length; i++)
        {
            var intervalHandler = intervalHandlers[i];

            if(intervalHandler.registrationConstruct == registrationConstruct)
            {
                return intervalHandler;
            }
        }

        var timeoutHandlers = browser.globalObject.timeoutHandlers;
        for(var i = 0; i < timeoutHandlers.length; i++)
        {
            var timeoutHandler = timeoutHandlers[i];

            if(timeoutHandler.registrationConstruct == registrationConstruct)
            {
                return timeoutHandler;
            }
        }

        var domHandlers = browser.globalObject.htmlElementEventHandlingRegistrations;

        for(var i = 0; i < domHandlers.length; i++)
        {
            var domHandler = domHandlers[i];

            if(domHandler.registrationConstruct != registrationConstruct) { continue; }

            if(domHandler.thisObjectModel == thisObjectModel)
            {
                return domHandler;
            }
        }

        console.log("Could not find eventRegistration: " + registrationConstruct.nodeId);

        return null;
    },

    _getArguments: function(eventRegistration, browser, parameters, eventIndex)
    {
        switch(eventRegistration.eventType)
        {
            case "onclick":
            case "click":
            case "onmousedown":
            case "onmouseup":
            case "onmousemove":
            case "mousedown":
            case "mouseup":
            case "mousemove":
            case "onmouseover":
            case "mouseover":
                return this._generateMouseHandlerArguments(eventRegistration, browser, parameters, eventIndex);
            case "onkeydown":
            case "keydown":
                return this._generateKeyHandlerArguments(eventRegistration, browser, parameters, eventIndex);
            default:
                break;
        }

        return [];
    },

    _modifyDom: function(eventRegistration, scenario, parameters)
    {
        return this._updateDomWithConstraintInfo(eventRegistration, scenario, parameters);
    },

    _generateMouseHandlerArguments: function(eventRegistration, browser, parameters, eventIndex)
    {
        var args = [];
        var fcModel = FBL.Firecrow.Interpreter.Model;

        var eventInfo = {};
        var eventInfoFcObject = new fcModel.Event(eventInfo, browser.globalObject, eventRegistration.thisObject);

        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "target", null, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "currentTarget", null, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "pageX", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "pageY", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "clientX", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "clientY", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "screenX", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "screenY", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "type", eventRegistration.eventType, browser, eventIndex, true);

        this._updateWithConstraintInfo(eventInfo, eventInfoFcObject, eventRegistration, browser, parameters, eventIndex);

        args.push(new fcModel.fcValue(eventInfo, eventInfoFcObject, null));

        return args;
    },

    _generateKeyHandlerArguments: function(eventRegistration, browser, parameters, eventIndex)
    {
        var args = [];
        var fcModel = FBL.Firecrow.Interpreter.Model;

        var eventInfo = {};
        var eventInfoFcObject = new fcModel.Event(eventInfo, browser.globalObject, eventRegistration.thisObject);

        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "altKey", false, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "bubbles", true, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "cancelBubble", false, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "cancelable", true, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "charCode", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "ctrlKey", false, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "currentTarget", null, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "detail", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "eventPhase", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "explicitOriginalTarget", null, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "isChar", false, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "isTrusted", true, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "keyCode", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "layerX", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "layerY", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "rangeOffset", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "rangeParent", 0, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "shiftKey", false, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "target", null, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "type", eventRegistration.eventType, browser, eventIndex);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "which", 1, browser, eventIndex);

        this._updateWithConstraintInfo(eventInfo, eventInfoFcObject, eventRegistration, browser, parameters, eventIndex);

        args.push(new fcModel.fcValue(eventInfo, eventInfoFcObject, null));

        return args;
    },

    endsWithSuffix: function(name, suffixID)
    {
        return name.match(new RegExp("_FC_" + suffixID + "$")) != null;
    },

    addSuffix: function(name, suffixID)
    {
        return name + "_FC_" + suffixID;
    },

    replaceSuffix: function(value, replacementArgument)
    {
        return value.replace(/_FC_([0-9+])/gi, replacementArgument)
    },

    removeSuffix: function(name)
    {
        var indexOfFcStart = name.indexOf("_FC_");

        if(indexOfFcStart == -1) { return name; }

        return name.substr(0, indexOfFcStart);
    },

    addToPropertyName: function(name, increment)
    {
        return this.replaceSuffix(name, function(match, number)
        {
            if(number !== undefined)
            {
                return match.replace(number, parseInt(number) + increment);
            }

            return match;
        });
    },

    _addEventObjectProperty: function(eventInfo, eventInfoFcObject, propertyName, propertyValue, browser, executionOrderId, dontCreateSymbolicValue)
    {
        var symbolicValue = null;
        if(!dontCreateSymbolicValue)
        {
            symbolicValue = new fcSymbolic.Identifier(this.addSuffix(propertyName, executionOrderId));
        }

        eventInfo[propertyName] = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, propertyValue, symbolicValue);
        eventInfoFcObject.addProperty(propertyName, eventInfo[propertyName]);
    },

    _updateWithConstraintInfo: function(eventInfo, eventInfoFcObject, eventRegistration, browser, parameters, eventIndex)
    {
        if(parameters == null) { return; }

        for(var propName in parameters)
        {
            var propValue = parameters[propName];

            eventInfo[propName] = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, propValue, new fcSymbolic.Identifier(this.addSuffix(propName, eventIndex)));
            eventInfoFcObject.addProperty(propName, eventInfo[propName]);
        }
    },

    _updateDomWithConstraintInfo: function(eventRegistration, scenario, parameters)
    {
        if(parameters == null) { return; }

        for(var parameterName in parameters)
        {
            if(parameterName.indexOf("DOM_") == 0)
            {
                var id = fcSymbolic.ConstraintResolver.getHtmlElementIdFromSymbolicParameter(parameterName);
                var cleansedProperty = fcSymbolic.ConstraintResolver.getHtmlElementPropertyFromSymbolicParameter(parameterName);
                if(id != "")
                {
                    var htmlElement = eventRegistration.thisObject.globalObject.document.document.getElementById(id);

                    if(ValueTypeHelper.isHtmlSelectElement(htmlElement))
                    {
                        var updateResult = fcSymbolic.ConstraintResolver.updateSelectElement(cleansedProperty, htmlElement, parameters[parameterName]);

                        scenario.inputConstraint.resolvedResult[eventRegistration.thisObject.globalObject.browser.eventIndex][parameterName] = updateResult.oldValue + " -&gt; " + updateResult.newValue;
                        parameters.value = updateResult.newValue;
                    }
                }
                else
                {
                    debugger;
                    alert("When updating DOM can not find ID!");
                }
            }
        }
    },


    notifyError: function(message) { alert("UsageScenarioGenerator Error: " + message); }
};
/*****************************************************/
}});
