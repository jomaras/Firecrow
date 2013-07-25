FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcScenarioGenerator = Firecrow.ScenarioGenerator;
var sgBrowserHelper = fcScenarioGenerator.ScenarioBrowserHelper;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;
var fcSymbolic = fcScenarioGenerator.Symbolic;

fcScenarioGenerator.ScenarioGenerator =
{
    achievedCoverage: 0,
    achievedCoverages: [],
    scenarios: null,
    scenarioProcessingLimit: 5,
    uiControlsSelectors: null,
    uiControlsJointSelector: "",

    processedScenarioCounter: 0,
    dependencyCache: {},

    traversedDependencies: {},
    parametrizedEventsMap: {},

    uiControlEventPriority: 0.4,
    globalObjectEventPriority: 0.6,
    externalEventPriority: 1,

    generateAdditionalTimingEvents: true,

    generateScenarios: function(pageModel, uiControlsSelectors, scenarioExecutedCallback, scenariosSubsumedCallback, coverageIgnoreScripts)
    {
        ASTHelper.setParentsChildRelationships(pageModel);

        this._setUiControlsSelectors(uiControlsSelectors);

        this.scenarios = new fcScenarioGenerator.ScenarioCollection();
        this.coverageIgnoreScripts = coverageIgnoreScripts || [];

        var browser = this._executeApplication(pageModel);
        var coverage = ASTHelper.calculateCoverage(pageModel, this.coverageIgnoreScripts);
        this.achievedCoverage = coverage.expressionCoverage;

        this._createInitialRegisteredEventsScenarios(browser, this.scenarios);
        this._executeInitialScenarios(pageModel, this.scenarios, scenarioExecutedCallback);

        var currentScenario = this.scenarios.getNext();
        var that = this;

        var asyncLoop = function()
        {
            if(currentScenario == null || that.processedScenarioCounter >= that.scenarioProcessingLimit || that.achievedCoverage == 1)
            {
                scenariosSubsumedCallback(that.scenarios.getSubsumedProcessedScenarios());
                return;
            }

            that._createDerivedScenarios(pageModel, currentScenario, that.scenarios, scenarioExecutedCallback);

            that.processedScenarioCounter++;

            currentScenario = that.scenarios.getNext();

            setTimeout(asyncLoop, 1500);
        };

        setTimeout(asyncLoop, 100);
    },

    /*START SCENARIO EXECUTION*/
    _executeApplication: function(pageModel)
    {
        var browser = new FBL.Firecrow.DoppelBrowser.Browser(pageModel);
        browser.url = pageModel.pageUrl;

        browser.registerSlicingCriteria(this.slicingCriteria);

        browser.evaluatePage();

        this._executeLoadingEvents(browser);

        browser.setLoadingEventsExecuted();

        return browser;
    },

    _executeLoadingEvents: function(browser)
    {
        browser.globalObject.getLoadedHandlers().forEach(function(loadingEvent)
        {
            browser.executeEvent(loadingEvent);
        }, this);
    },

    _executeInitialScenarios: function(pageModel, scenarios, scenarioExecutedCallback)
    {
        var scenario = scenarios.getNext();

        var executionResultsScenarios = [];

        while(scenario != null)
        {
            executionResultsScenarios.push
            ({
               scenario: scenario,
               executionResult: this._executeScenario(pageModel, scenario)
            });

            scenarioExecutedCallback != null && scenarioExecutedCallback(scenario);

            this.processedScenarioCounter++;

            scenario = scenarios.getNext();
        }

        for(var i = 0; i < executionResultsScenarios.length; i++)
        {
            var executionResultScenario = executionResultsScenarios[i];

            this._createInvertedPathScenarios(executionResultScenario.scenario, scenarios);
            this._createRegisteredEventsScenarios(executionResultScenario.scenario, scenarios, executionResultScenario.executionResult.browser);
        }
    },

    _executeScenario: function(pageModel, scenario)
    {
        var browser = this._executeApplication(pageModel);

        var parametrizedEvents = fcScenarioGenerator.ParametrizedEvent.createFromEvents(scenario.events, scenario.inputConstraint);

        scenario.setParametrizedEvents(parametrizedEvents);

        this._mapParametrizedEvents(scenario, parametrizedEvents);

        for(var i = 0; i < parametrizedEvents.length; i++)
        {
            this._executeEvent(browser, parametrizedEvents[i], scenario, i);
        }

        this._addDefaultConstraints(browser, scenario, parametrizedEvents);

        var executionInfo = browser.getExecutionInfo();

        scenario.setExecutionInfo(executionInfo);

        var coverage = ASTHelper.calculateCoverage(pageModel, this.coverageIgnoreScripts);

        this.achievedCoverage = coverage.expressionCoverage;
        this.achievedCoverages.push(coverage);

        return {
            executionInfo: executionInfo,
            browser: browser
        };
    },

    _executeEvent: function(browser, parametrizedEvent, scenario, eventIndex)
    {
        browser.eventIndex = eventIndex;
        var eventRegistration = sgBrowserHelper.getMatchingEventRegistration(browser, parametrizedEvent.baseEvent.thisObjectModel, parametrizedEvent.baseEvent.registrationConstruct);

        if(eventRegistration == null) { return; }

        sgBrowserHelper.modifyDom(eventRegistration, scenario, parametrizedEvent.parameters);

        browser.executeEvent(eventRegistration, sgBrowserHelper.getEventArguments(eventRegistration, browser, parametrizedEvent.parameters, eventIndex));
    },
    /*END SCENARIO EXECUTION*/

    _createInitialRegisteredEventsScenarios: function(browser, scenarios)
    {
        this._createEventsScenarios(browser.getEventRegistrations(), scenarios, browser)
    },

    _createEventsScenarios: function(eventRegistrations, scenarios, browser)
    {
        for(var i = 0; i < eventRegistrations.length; i++)
        {
            var eventRegistration = eventRegistrations[i];

            if(eventRegistration.handler.jsValue == null) { continue; }

            var event = fcScenarioGenerator.Event.createFromEventRegistration(eventRegistration);
            this.scenarios.assignEventPriority(eventRegistration, this._getEventPriority(eventRegistration, browser));

            var newScenario = new fcScenarioGenerator.Scenario([event], null, null, fcScenarioGenerator.Scenario.CREATION_TYPE.newEvent);

            scenarios.addScenario(newScenario);

            if(event.isTimingEvent())
            {
                this._createAdditionalTimingEvents(event, newScenario.events, null, newScenario);
            }
        }
    },

    _createDerivedScenarios: function(pageModel, scenario, scenarios, scenarioExecutedCallback)
    {
        var executionResult = this._executeScenario(pageModel, scenario);

        if(scenarioExecutedCallback != null) { scenarioExecutedCallback(scenario); }

        this._createInvertedPathScenarios(scenario, scenarios);
        this._createRegisteredEventsScenarios(scenario, scenarios, executionResult.browser);

        executionResult.browser.destruct();
    },

    _createInvertedPathScenarios: function(scenario, scenarios)
    {
        var invertedPaths = scenario.executionInfo.pathConstraint.getAllResolvedInversions();

        for(var i = 0; i < invertedPaths.length; i++)
        {
            var invertedPath = invertedPaths[i];

            //if(this._haveAlternativesBeenExecuted(invertedPath.getLastPathConstraintItemCodeConstruct())) { continue; }

            var highestIndexProperty = ValueTypeHelper.getHighestIndexProperty(invertedPath.resolvedResult);

            if(highestIndexProperty !== null)
            {
                var influencedEvents = scenario.events.slice(0, highestIndexProperty + 1);
                var parametrizedEvents = fcScenarioGenerator.ParametrizedEvent.createFromEvents(influencedEvents, invertedPath);

                if(!this._allParametrizedEventsAlreadyMapped(parametrizedEvents))
                {
                    var createdScenario = scenarios.addScenarioByComponents(influencedEvents, invertedPath, [scenario]);

                    if(createdScenario != null)
                    {
                        createdScenario.setCreationTypeSymbolic();
                    }
                }
            }
        }
    },

    _createRegisteredEventsScenarios: function(scenario, scenarios, browser)
    {
        var eventRegistrations = browser.getEventRegistrations();

        for(var i = 0; i < eventRegistrations.length; i++)
        {
            var eventRegistration = eventRegistrations[i];

            if(!ASTHelper.isFunction(eventRegistration.handlerConstruct)) { return; }

            var eventRegistrationFingerprint = sgBrowserHelper.getEventRegistrationFingerprint(eventRegistration);

            //has not been executed so far
            if(this.parametrizedEventsMap[eventRegistrationFingerprint] == null)
            {
                this._createNewScenarioByAppendingNewEvent(scenario, scenarios, eventRegistration, browser);
            }
            else //this event was executed so far
            {
                var parametrizedEventsLog = this.parametrizedEventsMap[eventRegistrationFingerprint];
                this._createNewScenariosByAppendingParametrizedEvents(scenario, scenarios, eventRegistration, parametrizedEventsLog);
            }
        }
    },

    _createNewScenarioByAppendingNewEvent: function(scenario, scenarios, eventRegistration, browser)
    {
        var newScenario = scenario.createCopy();

        var newEvent = fcScenarioGenerator.Event.createFromEventRegistration(eventRegistration);
        this.scenarios.assignEventPriority(eventRegistration, this._getEventPriority(eventRegistration, browser));

        newScenario.events.push(newEvent);
        newScenario.setCreationTypeNewEvent();
        newScenario.generateFingerprint();

        newScenario.parentScenarios.push(scenario);

        scenarios.addScenario(newScenario);

        if(newEvent.isTimingEvent())
        {
            this._createAdditionalTimingEvents(newEvent, newScenario.events, null, newScenario);
        }
    },

    _createNewScenariosByAppendingParametrizedEvents: function(scenario, scenarios, eventRegistration, parametrizedEventsLog)
    {
        for(var propName in parametrizedEventsLog)
        {
            var log = parametrizedEventsLog[propName];

            for(var i = 0; i < log.scenarios.length; i++)
            {
                var scenarioWithParametrizedEvent = log.scenarios[i];

                var executionsInfo = scenarioWithParametrizedEvent.getEventExecutionsInfo(eventRegistration.thisObjectDescriptor, eventRegistration.eventType);

                for(var j = 0; j < executionsInfo.length; j++)
                {
                    var executionInfo = executionsInfo[j];

                    if(this._isExecutionInfoDependentOnScenario(executionInfo, scenario))
                    {
                        this._createNewScenarioByAppendingExistingEvent(scenario, scenarios, log.parametrizedEvents[i], scenarioWithParametrizedEvent);
                    }
                }
            }
        }
    },

    _createNewScenarioByAppendingExistingEvent: function(scenario, scenarios, parametrizedEvent, scenarioWithParametrizedEvent)
    {
        var mergedEvents = scenario.events.concat([parametrizedEvent.baseEvent]);
        var mergedInputConstraint = scenario.inputConstraint.createCopyUpgradedByIndex(0);

        var singleItemConstraint = scenarioWithParametrizedEvent.inputConstraint.createSingleItemBasedOnIndex
        (
            scenarioWithParametrizedEvent.parametrizedEvents.indexOf(parametrizedEvent),
            mergedEvents.length - 1
        );

        if(singleItemConstraint != null)
        {
            mergedInputConstraint.append(singleItemConstraint);
        }

        var newScenario = new fcScenarioGenerator.Scenario(mergedEvents, mergedInputConstraint, [scenario], fcScenarioGenerator.Scenario.CREATION_TYPE.existingEvent);
        scenarios.addScenario(newScenario);

        if(parametrizedEvent.baseEvent.isTimingEvent())
        {
            this._createAdditionalTimingEvents(parametrizedEvent.baseEvent, mergedEvents, mergedInputConstraint, scenario);
        }
    },

    _createAdditionalTimingEvents: function(event, previousEvents, inputConstraint, parentScenario)
    {
        if(!this.generateAdditionalTimingEvents) { return; }

        if(parentScenario != null && parentScenario.isCreatedByWithTimingEvents()) { return; }

        var times = Math.floor(250/event.timePeriod);

        if(!Number.isNaN(times) && times > 0)
        {
            previousEvents = previousEvents.slice();

            for(var i = 0; i < times; i++)
            {
                previousEvents.push(event);

                this.scenarios.addScenario(new fcScenarioGenerator.Scenario
                (
                    previousEvents,
                    inputConstraint && inputConstraint.createCopy(),
                    [parentScenario],
                    fcScenarioGenerator.Scenario.CREATION_TYPE.timingEvents
                ));
            }
        }
    },

    _allParametrizedEventsAlreadyMapped: function(parametrizedEvents)
    {
        if(parametrizedEvents == null || parametrizedEvents.length == 0) { return true; }

        for(var i = 0; i < parametrizedEvents.length; i++)
        {
            var parametrizedEvent = parametrizedEvents[i];
            if(this.parametrizedEventsMap[parametrizedEvent.baseEvent.fingerprint] == null
            || this.parametrizedEventsMap[parametrizedEvent.baseEvent.fingerprint][parametrizedEvent.fingerprint] == null)
            {
                return false;
            }
        }

        return true;
    },

    _isExecutionInfoDependentOnScenario: function(executionInfo, scenario)
    {
        var scenarioExecutionInfo = scenario.executionInfo;
        for(var branchingConstructId in executionInfo.branchingConstructs)
        {
            for(var modifiedIdentifierId in scenarioExecutionInfo.afterLoadingModifiedIdentifiers)
            {
                if(this._dependencyExists(branchingConstructId, modifiedIdentifierId))
                {
                    return true;
                }
            }

            for(var modifiedObjectId in scenarioExecutionInfo.afterLoadingModifiedObjects)
            {
                if(this._dependencyExists(branchingConstructId, modifiedObjectId))
                {
                    return true;
                }
            }
        }

        return false;
    },

    _dependencyExists: function(sourceNodeId, targetNodeId)
    {
        if(this.dependencyCache[sourceNodeId + "-" + targetNodeId]) { return true; }

        this.traversedDependencies = {};

        return this._pathExists(sourceNodeId, targetNodeId);
    },

    _pathExists: function(sourceNodeId, targetNodeId)
    {
        var dataDependencies = Firecrow.DATA_DEPENDENCIES;

        if(dataDependencies[sourceNodeId] == null) { return false; }

        if(dataDependencies[sourceNodeId][targetNodeId])
        {
            this.dependencyCache[sourceNodeId + "-" + targetNodeId] = true;
            return true;
        }

        this.traversedDependencies[sourceNodeId] = true;

        for(var dependencyId in dataDependencies[sourceNodeId])
        {
            if(this.traversedDependencies[dependencyId]) { continue; }

            if(this._pathExists(dependencyId, targetNodeId))
            {
                return true;
            }
        }

        return false;
    },

    _mapParametrizedEvents: function(scenario, parametrizedEvents)
    {
        for(var i = 0; i < parametrizedEvents.length; i++)
        {
            var parametrizedEvent = parametrizedEvents[i];
            var baseEventFingerPrint = parametrizedEvent.baseEvent.fingerprint;

            if(this.parametrizedEventsMap[baseEventFingerPrint] == null)
            {
                this.parametrizedEventsMap[baseEventFingerPrint] = { };
            }

            if(this.parametrizedEventsMap[baseEventFingerPrint][parametrizedEvent.fingerprint] == null)
            {
                this.parametrizedEventsMap[baseEventFingerPrint][parametrizedEvent.fingerprint] = {
                    scenarios: [],
                    parametrizedEvents: []
                };
            }

            this.parametrizedEventsMap[baseEventFingerPrint][parametrizedEvent.fingerprint].scenarios.push(scenario);
            this.parametrizedEventsMap[baseEventFingerPrint][parametrizedEvent.fingerprint].parametrizedEvents.push(parametrizedEvent);
        }
    },

    _addDefaultConstraints: function(browser, scenario, parametrizedEvents)
    {
        var executionInfo = browser.getExecutionInfo();
        var identifiersMap = executionInfo.pathConstraint.getSymbolicIdentifierNameMap();

        for(var identifierName in identifiersMap)
        {
            if(sgBrowserHelper.isEventPropertyWhich(identifierName))
            {
                var pathConstraintItem = new fcSymbolic.PathConstraintItem(null, fcSymbolic.Logical.createIrreversibleOr
                (
                    fcSymbolic.Logical.createIrreversibleOr
                    (
                        fcSymbolic.Binary.createIrreversibleIdentifierEqualsLiteral(identifierName, 1),
                        fcSymbolic.Binary.createIrreversibleIdentifierEqualsLiteral(identifierName, 2)
                    ),
                    fcSymbolic.Binary.createIrreversibleIdentifierEqualsLiteral(identifierName, 3)
                ));

                executionInfo.addPathConstraintItemToBeginning(pathConstraintItem);
                scenario.addInputConstraintItem(pathConstraintItem);
                scenario.addSolutionIfNotExistent(identifierName, 1);
            }
            else if(sgBrowserHelper.isEventPropertyWithPositiveNumberValue(identifierName))
            {
                var pathConstraintItem = new fcSymbolic.PathConstraintItem(null, fcSymbolic.Binary.createIrreversibleIdentifierGreaterEqualsThanLiteral(identifierName, 0));

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
                        var availableValues = sgBrowserHelper.getSelectElementAvailableValues(htmlElement);
                        var binaryExpressions = [];

                        var compoundLogical = null;

                        for(var i = 0; i < availableValues.length; i++)
                        {
                            binaryExpressions.push(fcSymbolic.Binary.createIrreversibleIdentifierEqualsLiteral(identifierName, availableValues[i]));

                            var previousBinary = binaryExpressions[i-1];
                            var currentBinary = binaryExpressions[i];

                            if(previousBinary != null && currentBinary != null)
                            {
                                compoundLogical = compoundLogical == null ? fcSymbolic.Logical.createIrreversibleOr(previousBinary, currentBinary)
                                                                          : fcSymbolic.Logical.createIrreversibleOr(compoundLogical, currentBinary);
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
                if(sgBrowserHelper.isEventPropertyWithPositiveNumberValue(identifierName))
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

    updatePropertyNameWithNewIndex: function(name, newNumber)
    {
        return this.replaceSuffix(name, function(match, number)
        {
            if(number !== undefined)
            {
                return match.replace(number, newNumber);
            }

            return match;
        });
    },

    _getEventPriority: function(eventRegistration, browser)
    {
        if(eventRegistration.thisObjectDescriptor == "window" || eventRegistration.thisObjectDescriptor == "document"
        || eventRegistration.thisObjectDescriptor.indexOf("ajax") == 0)
        {
            return this.globalObjectEventPriority;
        }

        if(browser.matchesSelector(eventRegistration.thisObject.implementationObject, this.uiControlsJointSelector))
        {
            return this.uiControlEventPriority;
        }

        return this.externalEventPriority;
    },

    _setUiControlsSelectors: function(uiControlsSelectors)
    {
        this.slicingCriteria = [];

        if(uiControlsSelectors != null)
        {
            uiControlsSelectors.forEach(function(selector)
            {
                this.slicingCriteria.push(Firecrow.DependencyGraph.SlicingCriterion.createModifyDomCriterion(selector));
            }, this);
        }
        else
        {
            this.slicingCriteria.push(Firecrow.DependencyGraph.SlicingCriterion.createModifyDomCriterion("*"));
        }

        this.uiControlsSelectors = uiControlsSelectors;
        this.uiControlsJointSelector = uiControlsSelectors == null || uiControlsSelectors.length == 0 ? "*" : uiControlsSelectors.join(" *, ");
    },

    _hasFullEventCoverage: function()
    {
        var eventCoverageInfo = this.scenarios.eventCoverageInfo;

        for(var baseObjectDescriptor in eventCoverageInfo)
        {
            for(var eventType in eventCoverageInfo[baseObjectDescriptor])
            {
                var coverage = eventCoverageInfo[baseObjectDescriptor][eventType].coverage;
                if(!Number.isNaN(coverage) && coverage != 1)
                {
                    return false;
                }
            }
        }

        return true;
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

    notifyError: function(message) { alert("ScenarioGenerator Error: " + message); }
};
/*****************************************************/
}});
