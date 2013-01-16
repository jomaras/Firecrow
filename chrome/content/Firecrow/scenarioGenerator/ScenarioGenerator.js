FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcScenarioGenerator = Firecrow.ScenarioGenerator;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;
var fcSymbolic = fcScenarioGenerator.Symbolic;

fcScenarioGenerator.ScenarioGenerator =
{
    generateScenarios: function(pageModel, scenarioCreatedCallback)
    {
        ASTHelper.setParentsChildRelationships(pageModel);

        var scenarios = new fcScenarioGenerator.ScenarioCollection(scenarioCreatedCallback);

        var browser = this._executeApplication(pageModel);

        this._createRegisteredEventsScenarios(browser, scenarios, scenarioCreatedCallback);

        var processedScenarioCounter = 0;

        var currentScenario = scenarios.getNext();
        var that = this;

        var asyncLoop = function()
        {
            if(currentScenario == null || processedScenarioCounter > 60 || ASTHelper.calculatePageExpressionCoverage(pageModel) == 1)
            {
                scenarioCreatedCallback(scenarios.getProcessedScenarios());

                return;
            }

            that._createDerivedScenarios(pageModel, currentScenario, scenarios);

            if(scenarios.isLastScenario(currentScenario))
            {
                that._createMergedScenarios(pageModel, scenarios);
            }

            currentScenario = scenarios.getNext();
            processedScenarioCounter++;
            setTimeout(asyncLoop, 100);
        };

        setTimeout(asyncLoop, 100);
    },

    generateScenariosSync: function(pageModel, scenarioCreatedCallback)
    {
        ASTHelper.setParentsChildRelationships(pageModel);

        var scenarios = new fcScenarioGenerator.ScenarioCollection(scenarioCreatedCallback);

        var browser = this._executeApplication(pageModel);

        this._createRegisteredEventsScenarios(browser, scenarios, scenarioCreatedCallback);

        var processedScenarioCounter = 0;

        var currentScenario = scenarios.getNext();

        while (currentScenario != null)
        {
            if(processedScenarioCounter > 60 || ASTHelper.calculatePageExpressionCoverage(pageModel) == 1) { break; }

            this._createDerivedScenarios(pageModel, currentScenario, scenarios);

            if(scenarios.isLastScenario(currentScenario))
            {
                this._createMergedScenarios(pageModel, scenarios);
            }

            currentScenario = scenarios.getNext();
            processedScenarioCounter++;
        }

        return scenarioCreatedCallback(scenarios.getProcessedScenarios());
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
        this._createEventsScenarios(browser.globalObject.timeoutHandlers, scenarios, scenarioCreatedCallback)
        this._createEventsScenarios(browser.globalObject.intervalHandlers, scenarios, scenarioCreatedCallback)
        this._createEventsScenarios(browser.globalObject.htmlElementEventHandlingRegistrations, scenarios, scenarioCreatedCallback)
    },

    _createEventsScenarios: function(eventRegistrations, scenarios)
    {
        for(var i = 0; i < eventRegistrations.length; i++)
        {
            var eventRegistration = eventRegistrations[i];

            scenarios.addScenario(new fcScenarioGenerator.Scenario
            ([
                new fcScenarioGenerator.Event
                (
                    eventRegistration.thisObjectDescriptor,
                    eventRegistration.thisObjectModel,
                    eventRegistration.eventType,
                    eventRegistration.handler.codeConstruct
                )
            ]));
        }
    },

    _createDerivedScenarios: function(pageModel, scenario, scenarios)
    {
        var executionSummary = this._executeScenario(pageModel, scenario);

        this._createInvertedPathScenarios(executionSummary, scenario, scenarios);
        this._createNewlyRegisteredEventsScenarios(executionSummary, scenario, scenarios);
    },

    _createInvertedPathScenarios: function(executionSummary, scenario, scenarios)
    {
        var invertedPaths = executionSummary.pathConstraint.getAllResolvedInversions();

        for(var i = 0; i < invertedPaths.length; i++)
        {
            scenarios.addScenario(new fcScenarioGenerator.Scenario(scenario.events, invertedPaths[i], [scenario]));
        }
    },

    _createNewlyRegisteredEventsScenarios: function(executionSummary, scenario, scenarios)
    {
        if(scenario.parentScenarios.length == 0)
        {
            var eventsRegisteredAfterLoadingPhase = executionSummary.eventRegistrations.filter(function(eventRegistration)
            {
                return eventRegistration.loadingEventsExecuted;
            });

            for(var i = 0; i < eventsRegisteredAfterLoadingPhase.length; i++)
            {
                var eventRegistration = eventsRegisteredAfterLoadingPhase[i];

                var newScenario = scenario.createCopy();

                newScenario.events.push(new fcScenarioGenerator.Event
                (
                    eventRegistration.thisObjectDescriptor,
                    eventRegistration.thisObjectModel,
                    eventRegistration.eventType,
                    eventRegistration.handlerConstruct
                ));

                scenarios.addScenario(newScenario);
            }
        }
    },

    _createMergedScenarios: function(pageModel, scenarios)
    {
        //Has to be cached because new scenarios are added, and we don't want to take them into account
        var allScenarios = scenarios.getAllScenarios();
        var scenariosLength = allScenarios.length;

        for(var i = 0; i < scenariosLength; i++)
        {
            var ithScenario = allScenarios[i];

            for(var j = 0; j < scenariosLength; j++)
            {
                var jthScenario = allScenarios[j];

                if(jthScenario.executionInfo.isDependentOn(ithScenario.executionInfo))
                {
                    scenarios.addScenario(fcScenarioGenerator.Scenario.mergeScenarios(ithScenario, jthScenario))
                }
            }
        }
    },

    _executeScenario: function(pageModel, scenario)
    {
        var browser = this._executeApplication(pageModel);
        var parametrizedEvents = this._createParametrizedEvents(scenario);

        for(var i = 0; i < parametrizedEvents.length; i++)
        {
            this._executeEvent(browser, parametrizedEvents[i], scenario, i);
        }

        scenario.executionInfo = browser.getExecutionInfo();
        this._addDefaultPathConstraintsAndSolutions(scenario);

        return scenario.executionInfo;
    },

    _addDefaultPathConstraintsAndSolutions: function(scenario)
    {
        var pathConstraint = scenario.executionInfo.pathConstraint;

        if(scenario.pathConstraint == null)
        {
            scenario.pathConstraint = pathConstraint;
        }

        var identifiersMap = pathConstraint.getSymbolicIdentifierNameMap();
        var solutionsMap = {};

        for(var identifierName in identifiersMap)
        {
            if(this._isPositiveNumberIdentifier(identifierName))
            {
                solutionsMap[identifierName] = 0;

                var identifier = new fcSymbolic.Identifier(identifierName);

                var binary = new fcSymbolic.Binary(identifier, new fcSymbolic.Literal(0), ">=");
                binary.markAsCanNotBeInverted();

                pathConstraint.addConstraintToBeginning(null, binary, false);
            }
        }

        if(ValueTypeHelper.isEmptyObject(pathConstraint.resolvedResult))
        {
            pathConstraint.resolvedResult = fcSymbolic.PathConstraint.groupSolutionsByIndex(solutionsMap);
        }
    },

    _createParametrizedEvents: function(scenario)
    {
        if(scenario.pathConstraint == null)
        {
            return scenario.events.map(function(event)
            {
                return new fcScenarioGenerator.ParametrizedEvent(event, null);
            });
        }

        var parametrizedEvents = [];

        var resolvedResults = scenario.pathConstraint.resolvedResult;
        var events = scenario.events;

        for(var i = 0; i < events.length; i++)
        {
            parametrizedEvents.push(new fcScenarioGenerator.ParametrizedEvent(events[i], resolvedResults[i]))
        }

        return parametrizedEvents;
    },

    _executeEvent: function(browser, parametrizedEvent, scenario, eventIndex)
    {
        browser.eventIndex = eventIndex;
        var eventRegistration = this._getMatchingEventRegistration(browser, parametrizedEvent.baseEvent.baseObjectModel, parametrizedEvent.baseEvent.eventRegistrationConstruct);

        var handlerArguments = this._getArguments(eventRegistration, browser, parametrizedEvent.parameters, eventIndex);
        this._modifyDom(eventRegistration, scenario, parametrizedEvent.parameters);

        browser.executeEvent(eventRegistration, handlerArguments);
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

    _getMatchingEventRegistration: function(browser, thisObjectModel, eventRegistrationConstruct)
    {
        var intervalHandlers = browser.globalObject.intervalHandlers;
        for(var i = 0; i < intervalHandlers.length; i++)
        {
            var intervalHandler = intervalHandlers[i];

            if(intervalHandler.handler.codeConstruct == eventRegistrationConstruct)
            {
                return intervalHandler;
            }
        }

        var timeoutHandlers = browser.globalObject.timeoutHandlers;
        for(var i = 0; i < timeoutHandlers.length; i++)
        {
            var timeoutHandler = timeoutHandlers[i];

            if(timeoutHandler.handler.codeConstruct == eventRegistrationConstruct)
            {
                return timeoutHandler;
            }
        }

        var domHandlers = browser.globalObject.htmlElementEventHandlingRegistrations;

        for(var i = 0; i < domHandlers.length; i++)
        {
            var domHandler = domHandlers[i];

            if(domHandler.handler.codeConstruct != eventRegistrationConstruct) { continue; }

            if(domHandler.thisObjectModel == thisObjectModel)
            {
                return domHandler;
            }
        }

        debugger;

        return null;
    },

    _getArguments: function(eventRegistration, browser, parameters, eventIndex)
    {
        switch(eventRegistration.eventType)
        {
            case "onclick":
            case "onmousedown":
            case "onmouseup":
            case "onmousemove":
                return this._generateMouseHandlerArguments(eventRegistration, browser, parameters, eventIndex);
            case "onkeydown":
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
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "type", eventRegistration.eventType, browser, eventIndex);

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
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "which", 0, browser, eventIndex);

        this._updateWithConstraintInfo(eventInfo, eventInfoFcObject, eventRegistration, browser, parameters, eventIndex);

        args.push(new fcModel.fcValue(eventInfo, eventInfoFcObject, null));

        return args;
    },

    addSuffix: function(name, suffixID)
    {
        return name + "_FC_" + suffixID;
    },

    removeSuffix: function(name)
    {
        return name.substr(0, name.indexOf("_FC_"));
    },

    replaceSuffix: function(value, replacementArgument)
    {
        return value.replace(/_FC_([0-9+])/gi, replacementArgument)
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

    _addEventObjectProperty: function(eventInfo, eventInfoFcObject, propertyName, propertyValue, browser, executionOrderId)
    {
        eventInfo[propertyName] = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, propertyValue, new fcSymbolic.Identifier(this.addSuffix(propertyName, executionOrderId)));
        eventInfoFcObject.addProperty(propertyName, eventInfo[propertyName]);
    },

    _updateWithConstraintInfo: function(eventInfo, eventInfoFcObject, eventRegistration, browser, parameters, eventIndex)
    {
        if(parameters == null) { return; }

        for(var propName in parameters)
        {
            var propValue = parameters[propName];
            var identifier = this.removeSuffix(propName);

            eventInfo[identifier] = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, propValue, new fcSymbolic.Identifier(this.addSuffix(identifier, eventIndex)));
            eventInfoFcObject.addProperty(identifier, eventInfo[identifier]);
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

                    if(htmlElement instanceof HTMLSelectElement)
                    {
                        var updateResult = fcSymbolic.ConstraintResolver.updateSelectElement(cleansedProperty, htmlElement);

                        scenario.pathConstraint.resolvedResult[eventRegistration.thisObject.globalObject.browser.eventIndex][parameterName] = updateResult.oldValue + " -&gt; " + updateResult.newValue;
                    }
                }
                else
                {
                    alert("When updating DOM can not find ID!");
                }
            }
        }
    },


    notifyError: function(message) { alert("UsageScenarioGenerator Error: " + message); }
};
/*****************************************************/
}});
