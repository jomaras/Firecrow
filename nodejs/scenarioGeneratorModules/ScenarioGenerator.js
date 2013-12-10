var fs = require('fs');
var sh = require('execSync');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var path = require('path');

/**/
var os = require('os');
var isWin = os.platform().indexOf("win") != -1 ? true : false;

var scenarioExecutorPageUrl = isWin ? "http://localhost/Firecrow/phantomJs/helperPages/scenarioExecutor.html"
                                    : "http://pzi.fesb.hr/josip.maras/Firecrow/phantomJs/helperPages/scenarioExecutor.html";
/**/

var os = require('os');
var isWin = os.platform().indexOf("win") != -1 ? true : false;

var phantomJsPath = isWin ? 'C:\\phantomJs\\phantomjs.exe' : "/home/jomaras/phantomJs/phantomjs/bin/phantomjs";

/*******************  my modules inclusions ************/
var ScenarioCollectionModule = require(path.resolve(__dirname, "ScenarioCollection.js"));
var EventModule = require(path.resolve(__dirname, 'Event.js'));
var ScenarioModule = require(path.resolve(__dirname, 'Scenario.js'));
var ScenarioGeneratorHelper = require(path.resolve(__dirname, 'ScenarioGeneratorHelper.js')).ScenarioGeneratorHelper;
var ObjectConverter = require(path.resolve(__dirname, 'ObjectConverter.js')).ObjectConverter;

var ASTHelper = require(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/ASTHelper.js")).ASTHelper;
var ValueTypeHelper = require(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/valueTypeHelper.js")).ValueTypeHelper;
var CodeMarkupGenerator = require(path.resolve(__dirname, "../../chrome/content/Firecrow/codeMarkupGenerator/codeMarkupGenerator.js")).CodeMarkupGenerator;
var CodeTextGenerator = require(path.resolve(__dirname, "../../chrome/content/Firecrow/codeMarkupGenerator/codeTextGenerator.js")).CodeTextGenerator;
/*******************************************************/
var scenarioExecutorPhantomScriptPath = path.resolve(__dirname, "../../phantomJs/evaluationHelpers/scenarioExecutor.js");
var scenarioExecutorDataFile = path.resolve(__dirname, "../../phantomJs/dataFiles/scenarioExecutor.txt");
var memoryOutputDataFile = path.resolve(__dirname, "../../phantomJs/dataFiles/memoryOutput.txt");
/*******************************************************/

var ScenarioGenerator =
{
    shouldPrintDetailedMessages: false,
    MAX_NUMBER_OF_SCENARIOS: 30,
    numberOfProcessedScenarios: 0,

    generateAdditionalTimingEvents: false,
    generateAdditionalMouseMoveEvents: false,

    PRIORITIZATION:
    {
        fifo: "fifo",
        random: "random",
        eventLength: "eventLength",
        pathCoverage: "pathCoverage",
        pathCoverageSequential: "pathCoverageSequential",
        symbolicNew: "symbolicNew",
        symbolicNewCoverage: "symbolicNewCoverage",
        empirical: "empirical",
        symbolicNewCoverageSequential: "symbolicNewCoverageSequential"
    },

    prioritization: "symbolicNewCoverage",
    coverages: [],

    setEmpiricalData: function(empiricalData)
    {
        this.empiricalData = empiricalData;
    },

    generateScenarios: function(pageModelUrl, completedCallback)
    {
        this.pageModelUrl = pageModelUrl;
        this.scenarios = new ScenarioCollectionModule.ScenarioCollection(ScenarioGenerator.prioritization);
        this.scenarios.setEmpiricalData(this.empiricalData);
        this.completedCallback = completedCallback;
        this.lastCoverage = null;

        this.numberOfProcessedScenarios = 0;

        this._pageModelMapping = {};
        this._parametrizedEventsMap = {};
        this._dependencyCache = {};
        this._traversedDependencies = {};

        fs.writeFileSync(memoryOutputDataFile, "");
        this._getPageModelContent();
    },

    generateVisitedMarkup: function()
    {
        return CodeMarkupGenerator.generateHtmlRepresentation(this.pageModel);
    },

    _callCallback: function(message)
    {
        this.completedCallback != null && this.completedCallback(this.scenarios, message, this.lastCoverage);
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
         ScenarioGenerator.pageModel = JSON.parse(fs.readFileSync( this.pageModelUrl, {encoding:"utf8"}));

        ScenarioGenerator._setUpPageModel();
        ScenarioGenerator._generateScenarios();
    },

    _getScenarioExecutorUrl: function(scenarioExecutorPageUrl, pageModelUrl)
    {
        return encodeURI(scenarioExecutorPageUrl + "?url=" + pageModelUrl);
    },

    _trimReportNum: function(str)
    {
        return (str + "").substr(0, 4);
    },

    _hasAchievedFullCoverage: function(coverage)
    {
        ScenarioGenerator.lastCoverage = coverage;
        if(coverage.statementCoverage == 1)
        {
            ScenarioGenerator._callCallback("The process has achieved full coverage: " + ScenarioGenerator.pageModelUrl);
            return true;
        }

        return false;
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

    _memoryLimitReached: function()
    {
        ScenarioGenerator._callCallback("Memory limit has been reached: " + ScenarioGenerator.pageModelUrl);
        return;
    },

    _killPhantomJs: function()
    {
        console.log("!!!!!! KILLING phantomJs!");
        sh.run("taskkill /IM phantomjs.exe -f");
    },

    _hasUsedTooMuchMemory: function()
    {
        sh.run('tasklist /fi "memusage gt 1200000" > ' + memoryOutputDataFile);

        var fileContent = fs.readFileSync(memoryOutputDataFile, { encoding:"utf8"});

        var containsInfo = fileContent.indexOf("INFO:") != -1;

        if(!containsInfo)
        {
            console.log("Memory limit: ", fileContent);
        }

        return !containsInfo;
    },

    _getPhantomJsMemoryConsumption: function()
    {
        sh.run('tasklist /fi "imagename eq phantomjs.exe" > ' + memoryOutputDataFile);

        var fileContent = fs.readFileSync(memoryOutputDataFile, { encoding:"utf8"});

        if(fileContent == "" || fileContent == null) { return 0; }

        var decimalNumberRegEx = /[0-9]+\.[0-9]+/;

        var result = fileContent.match(decimalNumberRegEx);

        if(result == null || result[0] == null) { return 0; }

        var memory = parseFloat(result[0]);

        return !Number.isNaN(memory) ? memory : 0;
    },

    _generateScenarios: function()
    {
        this._generateInitialScenarios();
    },

    _generateInitialScenarios: function()
    {
        var scenarioExecutorUrl = this._getScenarioExecutorUrl(scenarioExecutorPageUrl, this.pageModelUrl);

        console.log("Executing empty scenario: ", scenarioExecutorUrl);

        ScenarioGenerator._saveScenarioInfoToFile();

        spawnPhantomJsProcess
        (
            scenarioExecutorPhantomScriptPath,
            [scenarioExecutorUrl],
            function(data)
            {
                console.log(data.toString());
            },
            function()
            {
                var scenarioExecutorStringData = fs.readFileSync(scenarioExecutorDataFile, {encoding:"utf8"});

                if(scenarioExecutorStringData == "" && scenarioExecutorStringData.indexOf("ERROR") == 0)
                {
                    console.log("Error when executing scenario: ", scenarioExecutorStringData);
                    return;
                }

                var executionInfoSummary = ObjectConverter.convertToFullObjects(JSON.parse(scenarioExecutorStringData), ScenarioGenerator._pageModelMapping);

                if(executionInfoSummary != null)
                {
                    var eventRegistrations = executionInfoSummary.eventRegistrations;
                    var achievedCoverage = executionInfoSummary.achievedCoverage;

                    if(ScenarioGenerator.shouldPrintDetailedMessages)
                    {
                        ScenarioGenerator._printCoverage(achievedCoverage, "Page loading Coverage");
                    }

                    if(ScenarioGenerator._hasAchievedFullCoverage(achievedCoverage))
                    {
                        return;
                    }

                    if(eventRegistrations.length == 0)
                    {
                        ScenarioGenerator._noMoreScenariosForProcessing();
                        return;
                    }

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
                }

                setTimeout(ScenarioGenerator._deriveScenarios, 500);
            },
            function(error)
            {
                if(error != null)
                {
                    console.log("ScenarioGenerator error: ", error );
                }
            }
        );
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

        if(ScenarioGenerator._hasUsedTooMuchMemory())
        {
            ScenarioGenerator._memoryLimitReached();
            return;
        }

        var startTime = Date.now();
        var pageUrl = ScenarioGenerator._getScenarioExecutorUrl(scenarioExecutorPageUrl, ScenarioGenerator.pageModelUrl);

        ScenarioGenerator._saveScenarioInfoToFile(scenario);

        if(ScenarioGenerator.shouldPrintDetailedMessages)
        {
            var now = new Date();
            console.log("****** Processing Scenario No. " + ScenarioGenerator.numberOfProcessedScenarios + " with id: " + scenario.id + " " + pageUrl, now.getHours() + ":" + now.getMinutes() );
            //console.log("Input Constraint: " + scenario.inputConstraint);
            //console.log("Events: ");
            //console.log(scenario.getEventsInfo());
        }

        ScenarioGenerator._startMonitoringPhantomJs();

        spawnPhantomJsProcess
        (
            scenarioExecutorPhantomScriptPath,
            [encodeURI(pageUrl)],
            function(data)
            {
                console.log("PhantomJs: " + data.toString());
            },
            function()
            {
                ScenarioGenerator._stopMonitoringPhantomJs();

                var scenarioExecutorStringData = fs.readFileSync(scenarioExecutorDataFile, {encoding:"utf8"});
                console.log("Scenario info size:", scenarioExecutorStringData.length/1000);

                if(scenarioExecutorStringData == "" && scenarioExecutorStringData.indexOf("ERROR") == 0)
                {
                    console.log("Error when executing scenario: ", scenarioExecutorStringData);
                    return;
                }

                if(ScenarioGenerator.shouldPrintDetailedMessages)
                {
                    console.log("Processing time:", Date.now() - startTime,"msec");
                }

                try
                {
                    var executionInfo = ObjectConverter.convertToFullObjects(JSON.parse(scenarioExecutorStringData), ScenarioGenerator._pageModelMapping);
                }
                catch(e)
                {
                    console.log("!!!!!!!!!!!!!ScenarioGenerator could not parse scenarioExecutor data: " + e + scenarioExecutorStringData);
                }

                if(executionInfo != null)
                {
                    scenario.setExecutionInfo(executionInfo);

                    var achievedCoverage = executionInfo.achievedCoverage;
                    ScenarioGenerator._updateTotalCoverage(executionInfo.executedConstructsIdMap);

                    var totalCoverage = ASTHelper.calculateCoverage(ScenarioGenerator.pageModel, ScenarioGenerator.scriptPathsToIgnore);
                    ScenarioGenerator.coverages.push(totalCoverage);

                    if(ScenarioGenerator._hasAchievedFullCoverage(totalCoverage)) { return; }

                    if(ScenarioGenerator.shouldPrintDetailedMessages)
                    {
                        ScenarioGenerator._printCoverage(achievedCoverage, "Scenario Coverage");
                        ScenarioGenerator._printCoverage(totalCoverage, "TotalApp Coverage");
                    }

                    ScenarioGenerator._createInvertedPathScenarios(scenario);
                    ScenarioGenerator._createRegisteredEventsScenarios(scenario);
                }

                ScenarioGenerator.numberOfProcessedScenarios++;

                setTimeout(ScenarioGenerator._deriveScenarios, 500);
            },
            function(error)
            {
                if(error)
                {
                    console.log("PhantomJs scenario execution error:", error);
                }
            }
        );
    },

    _lastLoggedMemoryConsumption: null,

    _startMonitoringPhantomJs: function()
    {
        ScenarioGenerator._monitoringPhantomJsInterval = setInterval(function()
        {
            var memory = ScenarioGenerator._getPhantomJsMemoryConsumption();

            if(ScenarioGenerator._lastLoggedMemoryConsumption !== null)
            {
                if(memory === ScenarioGenerator._lastLoggedMemoryConsumption)
                {
                    ScenarioGenerator._killPhantomJs();
                }

                ScenarioGenerator._lastLoggedMemoryConsumption = memory;
            }

            ScenarioGenerator._lastLoggedMemoryConsumption = memory;

        }, 10000);
    },

    _stopMonitoringPhantomJs: function()
    {
        clearInterval(ScenarioGenerator._monitoringPhantomJsInterval);
        ScenarioGenerator._lastLoggedMemoryConsumption = null;
    },

    _saveScenarioInfoToFile: function(scenario)
    {
        fs.writeFileSync
        (
            scenarioExecutorPageUrl.replace("http://localhost/", "c:/GitWebStorm/").replace(/\//g, "\\").replace("scenarioExecutor.html", "scenarioData.js"),
            "var scenarioData = " + JSON.stringify
            ({
                events: scenario != null ? scenario.getEventsQuery() : "[]",
                scriptsToIgnore: (JSON.stringify(ScenarioGenerator.scriptPathsToIgnore) || "[]")
            })
        );
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

        if(newEvent.isMouseMoveEvent())
        {
            ScenarioGenerator._createAdditionalMouseMoveEvents(newParametrizedEvent, newScenario.events, newScenario.parametrizedEvents, null, newScenario);
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
        if(parametrizedEvent.baseEvent.isMouseMoveEvent())
        {
            ScenarioGenerator._createAdditionalMouseMoveEvents(parametrizedEvent, mergedEvents, mergedParametrizedEvents, mergedInputConstraint, scenario);
        }
    },

    _createAdditionalMouseMoveEvents: function(parametrizedEvent, previousEvents, previousParametrizedEvents, inputConstraint, parentScenario)
    {
        if(!ScenarioGenerator.generateAdditionalMouseMoveEvents) { return; }

        //generate events in four directions - move left, right, up, down, up right..
        var delta = 10;
        var deltas = [
                        {x:-1*delta, y:0}, {x:delta, y:0}, {x:0, y:delta}, {x:0, y:-1*delta},
                        {x:-1*delta, y:-1*delta}, {x:delta, y:-1*delta}, {x:delta, y:delta}, {x:-1*delta, y:delta}
                     ];

        for(var i = 0; i < deltas.length; i++)
        {
            var change = deltas[i];
            var events = previousEvents.slice();
            var parametrizedEvents = previousParametrizedEvents.slice();

            events.push(parametrizedEvent.baseEvent);
            var parametrizedEventCopy = parametrizedEvent.createCopy();

            var eventIndex = parametrizedEvents.length;

            var previousXProperty = ScenarioGeneratorHelper.addSuffix("pageX", eventIndex-1);
            var previousYProperty = ScenarioGeneratorHelper.addSuffix("pageY", eventIndex-1);

            var previousXValue = parametrizedEventCopy.parameters[previousXProperty] || parametrizedEventCopy.parameters["pageX"] || 0;
            var previousYValue = parametrizedEventCopy.parameters[previousYProperty] || parametrizedEventCopy.parameters["pageY"] || 0;

            delete parametrizedEventCopy[previousXProperty];
            delete parametrizedEventCopy[previousYProperty];

            parametrizedEventCopy.parameters[ScenarioGeneratorHelper.addSuffix("pageX", eventIndex)] = previousXValue + change.x;
            parametrizedEventCopy.parameters[ScenarioGeneratorHelper.addSuffix("pageY", eventIndex)] = previousYValue + change.y;
            parametrizedEventCopy.parameters.pageX = previousXValue + change.x;
            parametrizedEventCopy.parameters.pageY = previousYValue + change.y;

            parametrizedEvents.push(parametrizedEventCopy);

            var newScenario = new ScenarioModule.Scenario
            (
                events,
                inputConstraint && inputConstraint.createCopy(),
                [parentScenario],
                ScenarioModule.Scenario.CREATION_TYPE.mouseMoveEvents
            );

            newScenario.setParametrizedEvents(parametrizedEvents);

            ScenarioGenerator.scenarios.addScenario(newScenario);
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
                if(ScenarioGenerator._dependencyExists(branchingConstructId, modifiedIdentifierId, executionInfo))
                {
                    return true;
                }
            }

            for(var modifiedObjectId in scenarioExecutionInfo.afterLoadingModifiedObjects)
            {
                if(ScenarioGenerator._dependencyExists(branchingConstructId, modifiedObjectId, executionInfo))
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
            return ASTHelper.isIfStatementBodyExecuted(parent) && (parent.alternate != null && ASTHelper.isIfStatementElseExecuted(parent));
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

function spawnPhantomJsProcess(pathToFile, args, onDataFunction, onCloseFunction, onErrorFunction)
{
    var command = phantomJsPath + " " + pathToFile + " " + args.join(" ");
    var prc = exec( command, onErrorFunction);

    prc.stdout.setEncoding('utf8');

    prc.stdout.on('data', onDataFunction);
    prc.on('close', onCloseFunction);
}

exports.ScenarioGenerator = ScenarioGenerator;