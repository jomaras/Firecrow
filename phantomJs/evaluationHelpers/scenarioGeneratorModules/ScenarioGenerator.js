var system = require('system');
var webPage = require('webpage');

var page = webPage.create();

page.onConsoleMessage = function(msg) { system.stderr.writeLine('console: ' + msg); };
page.onAlert = function(msg) { console.log('ALERT: ' + msg); };

/*******************  my modules inclusions ************/
var ScenarioCollectionModule = require('C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\ScenarioCollection.js')
var EventModule = require('C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\Event.js')
var ScenarioModule = require('C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\Scenario.js');
var ObjectConverter = require('C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\ObjectConverter.js').ObjectConverter;
var ValueTypeHelper = require("C:\\GitWebStorm\\Firecrow\\chrome\\content\\Firecrow\\helpers\\ValueTypeHelper.js").ValueTypeHelper;
var ASTHelper = require("C:\\GitWebStorm\\Firecrow\\chrome\\content\\Firecrow\\helpers\\ASTHelper.js").ASTHelper;
var CodeMarkupGenerator = require("C:\\GitWebStorm\\Firecrow\\chrome\\content\\Firecrow\\codeMarkupGenerator\\codeMarkupGenerator.js").CodeMarkupGenerator;
var CodeTextGenerator = require("C:\\GitWebStorm\\Firecrow\\chrome\\content\\Firecrow\\codeMarkupGenerator\\codeTextGenerator.js").CodeTextGenerator;
/*******************************************************/

var scenarioExecutorPageUrl = "http://localhost/Firecrow/phantomJs/helperPages/scenarioExecutor.html";
/*******************************************************/

var ScenarioGenerator =
{
    shouldPrintDetailedMessages: false,
    MAX_NUMBER_OF_SCENARIOS: 200,
    numberOfProcessedScenarios: 0,
    generateAdditionalTimingEvents: true,
    generateScenarios: function(pageModelUrl, completedCallback)
    {
        this.pageModelUrl = pageModelUrl;
        this.scenarios = new ScenarioCollectionModule.ScenarioCollection();
        this.completedCallback = completedCallback;

        this._pageModelMapping = {};
        this._parametrizedEventsMap = {};
        this._dependencyCache = {};
        this._traversedDependencies = {};

        this._getPageModelContent();
    },

    generateVisitedMarkup: function()
    {
        return CodeMarkupGenerator.generateHtmlRepresentation(this.pageModel);
    },

    _callCallback: function(message)
    {
        this.completedCallback != null && this.completedCallback(this.scenarios, message);
    },

    _setUpPageModel: function()
    {
        ASTHelper.setParentsChildRelationships(this.pageModel);

        ASTHelper.traverseAst(this.pageModel, function(astNode)
        {
            ScenarioGenerator._pageModelMapping[astNode.nodeId] = astNode;
        });
    },

    _getPageModelContent: function()
    {
        page.open(this.pageModelUrl, function(status)
        {
            if(status != "success")
            {
                ScenarioGenerator._callCallback("ERROR: Could not load page model from: " + ScenarioGenerator.pageModelUrl);
                return;
            }

            try
            {
                ScenarioGenerator.pageModel = JSON.parse(page.evaluate(function()
                {
                    return document.documentElement.textContent;
                }));

                ScenarioGenerator._setUpPageModel();
                ScenarioGenerator._generateScenarios();
            }
            catch(e)
            {
                ScenarioGenerator._callCallback("ERROR: Could not parse page model from: " + ScenarioGenerator.pageModelUrl);
                return;
            }
        });
    },

    _getScenarioExecutorUrl: function(scenarioExecutorPageUrl, pageModelUrl, events)
    {
        return encodeURI(scenarioExecutorPageUrl + "?url=" + pageModelUrl + "&events=" + (events || "[]"));
    },

    _getExecutionInfoFromPage: function(page)
    {
        return ObjectConverter.convertToFullObjects(JSON.parse(page.evaluate(function()
        {
            return document.querySelector("#executionInfo").value;
        })), this._pageModelMapping);
    },

    _trimReportNum: function(str)
    {
        return (str + "").substr(0, 4);
    },

    _checkCoverage: function(coverage)
    {
        if(coverage.branchCoverage == 1)
        {
            ScenarioGenerator._callCallback("The process has achieved full coverage: " + ScenarioGenerator.pageModelUrl);
        }
    },

    _printCoverage: function (coverage, message)
    {
        console.log(message + " - "
            + " EC: " + this._trimReportNum(coverage.expressionCoverage)
            + " SC: " + this._trimReportNum(coverage.statementCoverage)
            + " BC: " + this._trimReportNum(coverage.branchCoverage));
    },

    _updateTotalCoverage: function (executedConstructIds)
    {
        for(var i = 0; i < executedConstructIds.length; i++)
        {
            this._pageModelMapping[executedConstructIds[i]].hasBeenExecuted = true;
        }
    },

    _allParametrizedEventsAlreadyMapped: function(parametrizedEvents)
    {
        if(parametrizedEvents == null || parametrizedEvents.length == 0) { return true; }

        for(var i = 0; i < parametrizedEvents.length; i++)
        {
            var parametrizedEvent = parametrizedEvents[i];
            if(this._parametrizedEventsMap[parametrizedEvent.baseEvent.fingerprint] == null
            || this._parametrizedEventsMap[parametrizedEvent.baseEvent.fingerprint][parametrizedEvent.fingerprint] == null)
            {
                return false;
            }
        }

        return true;
    },

    _noMoreScenariosForProcessing: function()
    {
        ScenarioGenerator._callCallback("There are no more scenarios for processing: " + ScenarioGenerator.pageModelUrl);
        return;
    },

    _scenarioLimitReached: function()
    {
        ScenarioGenerator._callCallback("The scenario limit has been reached: " + ScenarioGenerator.pageModelUrl);
        return;
    },

    _generateScenarios: function()
    {
        this._generateInitialScenarios();
    },

    _generateInitialScenarios: function()
    {
        var startTime = Date.now();

        page.open(this._getScenarioExecutorUrl(scenarioExecutorPageUrl, this.pageModelUrl), function(status)
        {
            if(status != "success") { ScenarioGenerator._callCallback("Could not load scenario for: " + page.url);}

            if(ScenarioGenerator.shouldPrintDetailedMessages)
            {
                console.log("Executed page without user events in " + (Date.now() - startTime) + " ms");
            }

            var executionInfoSummary = ScenarioGenerator._getExecutionInfoFromPage(page);

            var eventRegistrations = executionInfoSummary.eventRegistrations;
            var achievedCoverage = executionInfoSummary.achievedCoverage;

            if(ScenarioGenerator.shouldPrintDetailedMessages)
            {
                ScenarioGenerator._printCoverage(achievedCoverage, "Page loading Coverage");
            }

            if(eventRegistrations.length == 0)
            {
                ScenarioGenerator._noMoreScenariosForProcessing();
                return;
            }

            ScenarioGenerator._checkCoverage(achievedCoverage);
            ScenarioGenerator._updateTotalCoverage(executionInfoSummary.executedConstructsIdMap);

            for(var i = 0; i < eventRegistrations.length; i++)
            {
                var eventRegistration = eventRegistrations[i];

                var event = EventModule.Event.createFromEventRegistration(eventRegistration);

                var newScenario = new ScenarioModule.Scenario([event], null, null, ScenarioModule.Scenario.CREATION_TYPE.newEvent);
                var parametrizedEvents = EventModule.ParametrizedEvent.createFromEvents(newScenario.events, newScenario.inputConstraint);
                newScenario.setParametrizedEvents(parametrizedEvents);
                ScenarioGenerator._mapParametrizedEvents(newScenario, parametrizedEvents);

                ScenarioGenerator.scenarios.addScenario(newScenario);
            }

            setTimeout(ScenarioGenerator._deriveScenarios, 1000);
        });
    },

    _deriveScenarios: function()
    {
        var scenario = ScenarioGenerator.scenarios.getNext();

        if(scenario == null)
        {
            ScenarioGenerator._noMoreScenariosForProcessing();
            return;
        }

        if(ScenarioGenerator.numberOfProcessedScenarios > ScenarioGenerator.MAX_NUMBER_OF_SCENARIOS)
        {
            ScenarioGenerator._scenarioLimitReached();
            return;
        }

        var startTime = Date.now();
        var pageUrl = ScenarioGenerator._getScenarioExecutorUrl(scenarioExecutorPageUrl, ScenarioGenerator.pageModelUrl, scenario.getEventsQuery());

        if(ScenarioGenerator.shouldPrintDetailedMessages)
        {
            console.log("****** Processing Scenario No. " + ScenarioGenerator.numberOfProcessedScenarios + " " + pageUrl);
            console.log("Input Constraint: " + scenario.inputConstraint);
            console.log("Events: ");
            console.log(scenario.getEventsInfo());
        }

        page.open(pageUrl, function(status)
        {
            if(status != "success") { ScenarioGenerator._callCallback("Could not load scenario for: " + page.url); }

            if(ScenarioGenerator.shouldPrintDetailedMessages)
            {
                console.log("Processing time: " + (Date.now() - startTime) + " ms");
            }

            var executionInfo = ScenarioGenerator._getExecutionInfoFromPage(page);

            scenario.setExecutionInfo(executionInfo);

            var achievedCoverage = executionInfo.achievedCoverage;
            ScenarioGenerator._updateTotalCoverage(executionInfo.executedConstructsIdMap);

            ScenarioGenerator._checkCoverage(achievedCoverage);

            if(ScenarioGenerator.shouldPrintDetailedMessages)
            {
                ScenarioGenerator._printCoverage(achievedCoverage, "Scenario Coverage");
                ScenarioGenerator._printCoverage(ASTHelper.calculateCoverage(ScenarioGenerator.pageModel), "TotalApp Coverage");
            }

            ScenarioGenerator._createInvertedPathScenarios(scenario);
            ScenarioGenerator._createRegisteredEventsScenarios(scenario);

            setTimeout(ScenarioGenerator._deriveScenarios, 1000);
            ScenarioGenerator.numberOfProcessedScenarios++;
        });
    },

    _createInvertedPathScenarios: function (scenario)
    {
        var executionInfo = scenario.executionInfo;
        var invertedPaths = executionInfo.pathConstraint.getAllResolvedInversions();

        for(var i = 0; i < invertedPaths.length; i++)
        {
            var invertedPath = invertedPaths[i];

            var highestIndexProperty = ValueTypeHelper.getHighestIndexProperty(invertedPath.resolvedResult);

            if(highestIndexProperty !== null)
            {
                var influencedEvents = scenario.events.slice(0, highestIndexProperty + 1);
                var parametrizedEvents = EventModule.ParametrizedEvent.createFromEvents(influencedEvents, invertedPath);

                if(!ScenarioGenerator._allParametrizedEventsAlreadyMapped(parametrizedEvents))
                {
                    var createdScenario = ScenarioGenerator.scenarios.addScenarioByComponents(influencedEvents, invertedPath, [scenario]);

                    if(createdScenario != null)
                    {
                        createdScenario.setParametrizedEvents(parametrizedEvents);
                        createdScenario.setCreationTypeSymbolic();
                    }
                }
            }
        }
    },

    _createRegisteredEventsScenarios: function (scenario)
    {
        var executionInfo = scenario.executionInfo;
        var eventRegistrations = executionInfo.eventRegistrations;

        for(var i = 0; i < eventRegistrations.length; i++)
        {
            var eventRegistration = eventRegistrations[i];

            if(!ASTHelper.isFunction(eventRegistration.handlerConstruct)) { return; }

            var eventRegistrationFingerprint = eventRegistration.thisObjectDescriptor + eventRegistration.eventType + eventRegistration.handlerConstruct.nodeId

            //has not been executed so far
            if(ScenarioGenerator._parametrizedEventsMap[eventRegistrationFingerprint] == null)
            {
                ScenarioGenerator._createNewScenarioByAppendingNewEvent(scenario, ScenarioGenerator.scenarios, eventRegistration);
            }
            else //this event was executed so far
            {
                var parametrizedEventsLog = ScenarioGenerator._parametrizedEventsMap[eventRegistrationFingerprint];
                ScenarioGenerator._createNewScenariosByAppendingParametrizedEvents(scenario, ScenarioGenerator.scenarios, eventRegistration, parametrizedEventsLog);
            }
        }
    },

    _createNewScenarioByAppendingNewEvent: function (scenario, scenarios, eventRegistration)
    {
        var newScenario = scenario.createCopy();

        var newEvent = EventModule.Event.createFromEventRegistration(eventRegistration);
        var newParametrizedEvent = new EventModule.ParametrizedEvent(newEvent);
        scenarios.assignEventPriority(eventRegistration, 0.4);

        newScenario.events.push(newEvent);
        newScenario.parametrizedEvents.push(newParametrizedEvent);
        newScenario.setCreationTypeNewEvent();
        newScenario.generateFingerprint();

        newScenario.parentScenarios.push(scenario);

        scenarios.addScenario(newScenario);

        if(newEvent.isIntervalEvent())
        {
            ScenarioGenerator._createAdditionalTimingEvents(newParametrizedEvent, newScenario.events, newScenario.parametrizedEvents, null, newScenario);
        }
    },

    _createNewScenariosByAppendingParametrizedEvents: function (scenario, scenarios, eventRegistration, parametrizedEventsLog)
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

                    if(ScenarioGenerator._isExecutionInfoDependentOnScenario(executionInfo, scenario))
                    {
                        ScenarioGenerator._createNewScenarioByAppendingExistingEvent(scenario, scenarios, log.parametrizedEvents[i], scenarioWithParametrizedEvent);
                    }
                }
            }
        }
    },

    _createNewScenarioByAppendingExistingEvent: function (scenario, scenarios, parametrizedEvent, scenarioWithParametrizedEvent)
    {
        var mergedEvents = scenario.events.concat([parametrizedEvent.baseEvent]);
        var mergedParametrizedEvents = scenario.parametrizedEvents.concat([parametrizedEvent]);
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

        var newScenario = new ScenarioModule.Scenario(mergedEvents, mergedInputConstraint, [scenario], ScenarioModule.Scenario.CREATION_TYPE.existingEvent);
        newScenario.setParametrizedEvents(mergedParametrizedEvents);
        scenarios.addScenario(newScenario);

        if(parametrizedEvent.baseEvent.isIntervalEvent())
        {
            ScenarioGenerator._createAdditionalTimingEvents(parametrizedEvent, mergedEvents, mergedParametrizedEvents, mergedInputConstraint, scenario);
        }
    },

    _createAdditionalTimingEvents: function (parametrizedEvent, previousEvents, previousParametrizedEvents, inputConstraint, parentScenario)
    {
        if(!ScenarioGenerator.generateAdditionalTimingEvents) { return; }

        if(parentScenario != null && parentScenario.isCreatedByWithTimingEvents()) { return; }
        var timePeriod = parametrizedEvent.baseEvent.timePeriod;

        var times = Math.floor(250/timePeriod);

        if(timePeriod > 0 && times > 0)
        {
            previousEvents = previousEvents.slice();
            previousParametrizedEvents = previousParametrizedEvents.slice();

            for(var i = 0; i < times; i++)
            {
                previousEvents.push(parametrizedEvent.baseEvent);
                previousParametrizedEvents.push(parametrizedEvent);

                var newScenario = new ScenarioModule.Scenario
                (
                    previousEvents,
                    inputConstraint && inputConstraint.createCopy(),
                    [parentScenario],
                    ScenarioModule.Scenario.CREATION_TYPE.timingEvents
                );

                newScenario.setParametrizedEvents(previousParametrizedEvents);

                ScenarioGenerator.scenarios.addScenario(newScenario);
            }
        }
    },

    _mapParametrizedEvents: function  (scenario, parametrizedEvents)
    {
        for(var i = 0; i < parametrizedEvents.length; i++)
        {
            var parametrizedEvent = parametrizedEvents[i];
            var baseEventFingerPrint = parametrizedEvent.baseEvent.fingerprint;

            if(ScenarioGenerator._parametrizedEventsMap[baseEventFingerPrint] == null)
            {
                ScenarioGenerator._parametrizedEventsMap[baseEventFingerPrint] = { };
            }

            if(ScenarioGenerator._parametrizedEventsMap[baseEventFingerPrint][parametrizedEvent.fingerprint] == null)
            {
                ScenarioGenerator._parametrizedEventsMap[baseEventFingerPrint][parametrizedEvent.fingerprint] = {
                    scenarios: [],
                    parametrizedEvents: []
                };
            }

            ScenarioGenerator._parametrizedEventsMap[baseEventFingerPrint][parametrizedEvent.fingerprint].scenarios.push(scenario);
            ScenarioGenerator._parametrizedEventsMap[baseEventFingerPrint][parametrizedEvent.fingerprint].parametrizedEvents.push(parametrizedEvent);
        }
    },

    _isExecutionInfoDependentOnScenario: function(executionInfo, scenario)
    {
        var scenarioExecutionInfo = scenario.executionInfo;
        if(scenarioExecutionInfo == null) { return false;}

        for(var branchingConstructId in executionInfo.branchingConstructs)
        {
            if(ScenarioGenerator._isBodyExecuted(ScenarioGenerator._pageModelMapping[branchingConstructId])) { continue; }

            //Track only branching constructs which don't have their bodies executed!
            for(var modifiedIdentifierId in scenarioExecutionInfo.afterLoadingModifiedIdentifiers)
            {
                if(ScenarioGenerator._dependencyExists(branchingConstructId, modifiedIdentifierId, scenarioExecutionInfo))
                {
                    return true;
                }
            }

            for(var modifiedObjectId in scenarioExecutionInfo.afterLoadingModifiedObjects)
            {
                if(ScenarioGenerator._dependencyExists(branchingConstructId, modifiedObjectId, scenarioExecutionInfo))
                {
                    return true;
                }
            }
        }

        return false;
    },

    _isBodyExecuted: function (branchingConditionConstruct)
    {
        //can be if, loop, conditionalExpression
        var parent = branchingConditionConstruct.parent;

        if(ASTHelper.isLoopStatement(parent))
        {
            return ASTHelper.isLoopStatementExecuted(parent);
        }
        else if(ASTHelper.isIfStatement(parent))
        {
            return ASTHelper.isIfStatementBodyExecuted(parent) && (parent.alternate == null || ASTHelper.isIfStatementElseExecuted(parent));
        }
        else if(ASTHelper.isSwitchStatement(parent))
        {
            return false;
        }
        else if(ASTHelper.isConditionalExpression(parent))
        {
            return parent.consequent.hasBeenExecuted && parent.alternate.hasBeenExecuted;
        }
        else if(ASTHelper.isSwitchCase(parent))
        {
            return ASTHelper.isSwitchCaseExecuted(parent);
        }
        else
        {
            console.log("Unrecognized construct when checking is body executed!");
            console.log(CodeTextGenerator.generateJsCode(parent));
            phantom.exit(-1);
        }

        return false;
    },

    _dependencyExists: function (sourceNodeId, targetNodeId, executionInfo)
    {
        if(ScenarioGenerator._dependencyCache[sourceNodeId + "-" + targetNodeId]) { return true; }

        ScenarioGenerator._traversedDependencies = {};

        return ScenarioGenerator._pathExists(sourceNodeId, targetNodeId, executionInfo);
    },

    _pathExists: function(sourceNodeId, targetNodeId, executionInfo)
    {
        var dataDependencies = executionInfo.dataDependencies;

        if(dataDependencies[sourceNodeId] == null) { return false; }

        if(dataDependencies[sourceNodeId][targetNodeId])
        {
            ScenarioGenerator._dependencyCache[sourceNodeId + "-" + targetNodeId] = true;
            return true;
        }

        ScenarioGenerator._traversedDependencies[sourceNodeId] = true;

        for(var destinationId in dataDependencies[sourceNodeId])
        {
            if(ScenarioGenerator._traversedDependencies[destinationId]) { continue; }

            if(ScenarioGenerator._pathExists(destinationId, targetNodeId, executionInfo))
            {
                ScenarioGenerator._dependencyCache[sourceNodeId + "-" + targetNodeId] = true;
                return true;
            }
        }

        return false;
    }
}

exports.ScenarioGenerator = ScenarioGenerator;