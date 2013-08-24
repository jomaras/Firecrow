var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

page.onConsoleMessage = function(msg) { system.stderr.writeLine('console: ' + msg); };
page.onAlert = function(msg) { console.log('ALERT: ' + msg); };

/*******************  my modules inclusions ************/
var ScenarioCollectionModule = require('C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\ScenarioCollection.js')
var EventModule = require('C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\Event.js')
var ScenarioModule = require('C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\Scenario.js');
var PathConstraintModule = require('C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\PathConstraint.js');
var ScenarioGeneratorHelper = require('C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\ScenarioGeneratorHelper.js').ScenarioGeneratorHelper;
var ValueTypeHelper = require("C:\\GitWebStorm\\Firecrow\\chrome\\content\\Firecrow\\helpers\\ValueTypeHelper.js").ValueTypeHelper;
var ASTHelper = require("C:\\GitWebStorm\\Firecrow\\chrome\\content\\Firecrow\\helpers\\ASTHelper.js").ASTHelper;
/*******************************************************/

/*!!!!!!!!!!!!!!!!!!  input data  !!!!!!!!!!!!!!!!!!!!!*/
var scenarioExecutorPageUrl = "http://localhost/Firecrow/phantomJs/helperPages/scenarioExecutor.html";
var pageModelUrl = "http://localhost/Firecrow/evaluation/fullPages/3dmodel/index.json";
var pageModelFilePath = "C:\\GitWebStorm\\Firecrow\\evaluation\\fullPages\\3dmodel\\index.json";
/*******************************************************/
var pageModel = JSON.parse(fs.read(pageModelFilePath));
var pageModelMapping = {};
var parametrizedEventsMap = {};
var scenarios = new ScenarioCollectionModule.ScenarioCollection();
var numberOfProcessedScenarios = 0;
var generateAdditionalTimingEvents = false;
var dependencyCache = {};
var traversedDependencies = {};

console.log("Scenario Generator started");

/***************** FUNCTION DEFINITIONS **********************/

function getScenarioExecutorUrl(scenarioExecutorPageUrl, pageModelUrl, events)
{
    return encodeURI(scenarioExecutorPageUrl + "?url=" + pageModelUrl + "&events=" + (events || "[]"));
}

function convertToFullObjects(executionInfo)
{
    executionInfo.pathConstraint = PathConstraintModule.PathConstraint.fromObjectLiteral(executionInfo.pathConstraint, pageModelMapping);
    executionInfo.undefinedGlobalPropertiesAccessMap = getUndefinedGlobalPropertiesAccessMap(executionInfo.undefinedGlobalPropertiesAccessMap);
    executionInfo.globalModifiedIdentifiers = convertToObjectWithCodeConstructs(executionInfo.globalModifiedIdentifiers);
    executionInfo.afterLoadingModifiedIdentifiers = convertToObjectWithCodeConstructs(executionInfo.afterLoadingModifiedIdentifiers);
    executionInfo.globalAccessedIdentifiers = convertToObjectWithCodeConstructs(executionInfo.globalAccessedIdentifiers);
    executionInfo.afterLoadingAccessedIdentifiers = convertToObjectWithCodeConstructs(executionInfo.afterLoadingAccessedIdentifiers);
    executionInfo.afterLoadingAccessedObjects = convertToObjectWithCodeConstructs(executionInfo.afterLoadingAccessedObjects);
    executionInfo.eventRegistrations = convertEventRegistrations(executionInfo.eventRegistrations);
    executionInfo.eventExecutionsMap = convertEventExecutionMap(executionInfo.eventExecutionsMap);
    executionInfo.typeExecutionMap = convertTypeExecutionMap(executionInfo.typeExecutionMap);
    executionInfo.eventExecutions = convertEventExecutions(executionInfo.eventExecutions);

    return executionInfo;
}

function convertEventExecutions(eventExecutionsJson)
{
    var eventExecutions = [];

    for(var i = 0; i < eventExecutionsJson.length; i++)
    {
        eventExecutions.push(convertEventExecution(eventExecutionsJson[i]));
    }

    return eventExecutions;
}

function convertEventExecution(eventExecution)
{
    return {
        baseObjectDescriptor: eventExecution.baseObjectDescriptor,
        branchingConstructs: convertToObjectWithCodeConstructs(eventExecution.branchingConstructs),
        eventDescriptor: eventExecution.eventDescriptor,
        eventRegistrations: convertEventRegistrations(eventExecution.eventRegistrations),
        eventType: eventExecution.eventType,
        globalAccessedIdentifiers: convertToObjectWithCodeConstructs(eventExecution.globalAccessedIdentifiers),
        /*SKIPPED GLOBAL ACCESSED OBJECTS, for now*/
        globalModifiedIdentifiers: convertToObjectWithCodeConstructs(eventExecution.globalModifiedIdentifiers),
        /*SKIPPED global modified objects, for now*/
        /*SKIPPED important modifications*/
        typeDescriptor: eventExecution.typeDescriptor,
        typeVisitedFunctionsMap: convertToObjectWithCodeConstructs(eventExecution.typeVisitedFunctionsMap),
        visitedFunctionsMap: convertToObjectWithCodeConstructs(eventExecution.visitedFunctionsMap)
    };
}

function convertTypeExecutionMap(typeExecutionMap)
{
    var object = { };

    for(var eventTypeId in typeExecutionMap)
    {
        object[eventTypeId] = {};

        for(var functionConstructId in typeExecutionMap[eventTypeId])
        {
            object[eventTypeId][functionConstructId] = pageModelMapping[functionConstructId];
        }
    }

    return object;
}

function convertEventExecutionMap(eventExecutionsMap)
{
    var object = {};

    for(var thisDescriptor in eventExecutionsMap)
    {
        object[thisDescriptor] = {};

        for(var eventType in eventExecutionsMap[thisDescriptor])
        {
            object[thisDescriptor][eventType] = {};

            for(var functionNodeId in eventExecutionsMap[thisDescriptor][eventType])
            {
                object[thisDescriptor][eventType][functionNodeId] = pageModelMapping[functionNodeId];
            }
        }
    }

    return object;
}

function convertEventRegistrations(eventRegistrations)
{
    for(var i = 0; i < eventRegistrations.length; i++)
    {
        var eventRegistration = eventRegistrations[i];

        eventRegistration.handlerConstruct = pageModelMapping[eventRegistration.handlerConstructNodeId];
        eventRegistration.registrationConstruct = pageModelMapping[eventRegistration.registrationConstructNodeId];
        eventRegistration.thisObjectModel = pageModelMapping[eventRegistration.thisObjectModelNodeId] || eventRegistration.thisObjectModelNodeId;
    }

    return eventRegistrations;
}

function convertToObjectWithCodeConstructs(arr)
{
    var obj = {};

    for(var i = 0; i < arr.length; i++)
    {
        obj[arr[i]] = pageModelMapping[arr[i]];
    }

    return obj;
}

function getUndefinedGlobalPropertiesAccessMap(undefinedGlobalPropertiesAccessMap)
{
    var obj = {};

    for(var propertyName in undefinedGlobalPropertiesAccessMap)
    {
        if(obj[propertyName] == null) { obj[propertyName] = {} }

        for(var constructId in this.undefinedGlobalPropertiesAccessMap[propertyName])
        {
            obj[propertyName][constructId] = pageModelMapping[constructId];
        }
    }


    return obj;
}

function getExecutionInfoFromPage(page)
{
    return convertToFullObjects(JSON.parse(page.evaluate(function()
    {
        return document.querySelector("#executionInfo").value;
    })));
}

function trimReportNum(str)
{
    return (str + "").substr(0, 4);
}

function checkCoverage(coverage)
{
    if(coverage.expressionCoverage == 1)
    {
        console.log("The process has achieved full coverage, shutting down...");
        phantom.exit();
    }
}

function printCoverage(coverage, message)
{
    console.log(message + " - "
                + " EC: " + trimReportNum(coverage.expressionCoverage)
                + " SC: " + trimReportNum(coverage.statementCoverage)
                + " BC: " + trimReportNum(coverage.branchCoverage));
}

function updateTotalCoverage(executedConstructIds)
{

    for(var i = 0; i < executedConstructIds.length; i++)
    {
        pageModelMapping[executedConstructIds[i]].hasBeenExecuted = true;
    }
}

function allParametrizedEventsAlreadyMapped(parametrizedEvents)
{
    if(parametrizedEvents == null || parametrizedEvents.length == 0) { return true; }

    for(var i = 0; i < parametrizedEvents.length; i++)
    {
        var parametrizedEvent = parametrizedEvents[i];
        if(parametrizedEventsMap[parametrizedEvent.baseEvent.fingerprint] == null
        || parametrizedEventsMap[parametrizedEvent.baseEvent.fingerprint][parametrizedEvent.fingerprint] == null)
        {
            return false;
        }
    }

    return true;
}

/****************************** PROCESS STEPS ***************************/

(function setUpPageModel()
{
    ASTHelper.setParentsChildRelationships(pageModel);

    ASTHelper.traverseAst(pageModel, function(astNode)
    {
        pageModelMapping[astNode.nodeId] = astNode;
    });
}());

var startTime = Date.now();
(function createInitialScenarios()
{
    page.open(getScenarioExecutorUrl(scenarioExecutorPageUrl, pageModelUrl), function(status)
    {
        if(status != "success") { console.log("Could not load: " + page.url); phantom.exit();}
        console.log("Executed page without user events in " + (Date.now() - startTime) + " ms");

        var executionInfoSummary = getExecutionInfoFromPage(page);

        var eventRegistrations = executionInfoSummary.eventRegistrations;
        var achievedCoverage = executionInfoSummary.achievedCoverage;
        printCoverage(achievedCoverage, "Page loading Coverage");

        if(eventRegistrations.length == 0)
        {
            console.log("There are no event registrations to follow, shutting down...");
            phantom.exit();
        }

        checkCoverage(achievedCoverage);
        updateTotalCoverage(executionInfoSummary.executedConstructsIdMap);

        for(var i = 0; i < eventRegistrations.length; i++)
        {
            var eventRegistration = eventRegistrations[i];

            var event = EventModule.Event.createFromEventRegistration(eventRegistration);

            var newScenario = new ScenarioModule.Scenario([event], null, null, ScenarioModule.Scenario.CREATION_TYPE.newEvent);
            var parametrizedEvents = EventModule.ParametrizedEvent.createFromEvents(newScenario.events, newScenario.inputConstraint);
            newScenario.setParametrizedEvents(parametrizedEvents);
            mapParametrizedEvents(newScenario, parametrizedEvents);
            scenarios.addScenario(newScenario);
        }

        setTimeout(deriveScenarios, 1000);
    });
})();

function deriveScenarios()
{
    var scenario = scenarios.getNext();

    if(scenario == null)
    {
        console.log("There are no more scenarios for execution. Exiting..");
        phantom.exit();
    }

    startTime = Date.now();
    var pageUrl = getScenarioExecutorUrl(scenarioExecutorPageUrl, pageModelUrl, scenario.getEventsQuery());

    console.log("****** Processing Scenario No. " + numberOfProcessedScenarios + " " + pageUrl);
    console.log("Input Constraint: " + scenario.inputConstraint);
    console.log("Events: " + scenario.getEventsInfo());

    page.open(pageUrl, function(status)
    {
        if(status != "success") { console.log ("Could not process scenario: " + page.url); }
        console.log("Processing time: " + (Date.now() - startTime) + " ms");

        var executionInfo = getExecutionInfoFromPage(page);

        scenario.setExecutionInfo(executionInfo);

        var achievedCoverage = executionInfo.achievedCoverage;
        updateTotalCoverage(executionInfo.executedConstructsIdMap);

        checkCoverage(achievedCoverage);

        printCoverage(achievedCoverage, "Scenario Coverage");
        printCoverage(ASTHelper.calculateCoverage(pageModel), "TotalApp Coverage");

        createInvertedPathScenarios(scenario);
        createRegisteredEventsScenarios(scenario);

        setTimeout(deriveScenarios, 1000);
        numberOfProcessedScenarios++;
    });
}

function createInvertedPathScenarios(scenario)
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

            if(!allParametrizedEventsAlreadyMapped(parametrizedEvents))
            {
                var createdScenario = scenarios.addScenarioByComponents(influencedEvents, invertedPath, [scenario]);

                if(createdScenario != null)
                {
                    createdScenario.setParametrizedEvents(parametrizedEvents);
                    createdScenario.setCreationTypeSymbolic();
                }
            }
        }
    }
}

function createRegisteredEventsScenarios(scenario)
{
    var executionInfo = scenario.executionInfo;
    var eventRegistrations = executionInfo.eventRegistrations;

    for(var i = 0; i < eventRegistrations.length; i++)
    {
        var eventRegistration = eventRegistrations[i];

        if(!ASTHelper.isFunction(eventRegistration.handlerConstruct)) { return; }

        var eventRegistrationFingerprint = eventRegistration.thisObjectDescriptor + eventRegistration.eventType + eventRegistration.handlerConstruct.nodeId

        //has not been executed so far
        if(parametrizedEventsMap[eventRegistrationFingerprint] == null)
        {
            createNewScenarioByAppendingNewEvent(scenario, scenarios, eventRegistration);
        }
        else //this event was executed so far
        {
            var parametrizedEventsLog = parametrizedEventsMap[eventRegistrationFingerprint];
            createNewScenariosByAppendingParametrizedEvents(scenario, scenarios, eventRegistration, parametrizedEventsLog);
        }
    }
}

function createNewScenarioByAppendingNewEvent(scenario, scenarios, eventRegistration)
{
    var newScenario = scenario.createCopy();

    var newEvent = EventModule.Event.createFromEventRegistration(eventRegistration);
    this.scenarios.assignEventPriority(eventRegistration, 0.4);

    newScenario.events.push(newEvent);
    newScenario.setCreationTypeNewEvent();
    newScenario.generateFingerprint();

    newScenario.parentScenarios.push(scenario);

    scenarios.addScenario(newScenario);

    if(newEvent.isTimingEvent())
    {
        createAdditionalTimingEvents(newEvent, newScenario.events, null, newScenario);
    }
}

function createNewScenariosByAppendingParametrizedEvents(scenario, scenarios, eventRegistration, parametrizedEventsLog)
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

                if(isExecutionInfoDependentOnScenario(executionInfo, scenario))
                {
                    createNewScenarioByAppendingExistingEvent(scenario, scenarios, log.parametrizedEvents[i], scenarioWithParametrizedEvent);
                }
            }
        }
    }
}

function createNewScenarioByAppendingExistingEvent(scenario, scenarios, parametrizedEvent, scenarioWithParametrizedEvent)
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

    var newScenario = new ScenarioModule.Scenario(mergedEvents, mergedInputConstraint, [scenario], ScenarioModule.Scenario.CREATION_TYPE.existingEvent);
    scenarios.addScenario(newScenario);

    if(parametrizedEvent.baseEvent.isTimingEvent())
    {
        createAdditionalTimingEvents(parametrizedEvent.baseEvent, mergedEvents, mergedInputConstraint, scenario);
    }
}

function createAdditionalTimingEvents(event, previousEvents, inputConstraint, parentScenario)
{
    if(!generateAdditionalTimingEvents) { return; }

    if(parentScenario != null && parentScenario.isCreatedByWithTimingEvents()) { return; }

    var times = Math.floor(250/event.timePeriod);

    if(!Number.isNaN(times) && times > 0)
    {
        previousEvents = previousEvents.slice();

        for(var i = 0; i < times; i++)
        {
            previousEvents.push(event);

            this.scenarios.addScenario(new ScenarioModule.Scenario
            (
                previousEvents,
                inputConstraint && inputConstraint.createCopy(),
                [parentScenario],
                ScenarioModule.Scenario.CREATION_TYPE.timingEvents
            ));
        }
    }
}

function mapParametrizedEvents (scenario, parametrizedEvents)
{
    for(var i = 0; i < parametrizedEvents.length; i++)
    {
        var parametrizedEvent = parametrizedEvents[i];
        var baseEventFingerPrint = parametrizedEvent.baseEvent.fingerprint;

        if(parametrizedEventsMap[baseEventFingerPrint] == null)
        {
            parametrizedEventsMap[baseEventFingerPrint] = { };
        }

        if(parametrizedEventsMap[baseEventFingerPrint][parametrizedEvent.fingerprint] == null)
        {
            parametrizedEventsMap[baseEventFingerPrint][parametrizedEvent.fingerprint] = {
                scenarios: [],
                parametrizedEvents: []
            };
        }

        parametrizedEventsMap[baseEventFingerPrint][parametrizedEvent.fingerprint].scenarios.push(scenario);
        parametrizedEventsMap[baseEventFingerPrint][parametrizedEvent.fingerprint].parametrizedEvents.push(parametrizedEvent);
    }
}


function isExecutionInfoDependentOnScenario(executionInfo, scenario)
{
    var scenarioExecutionInfo = scenario.executionInfo;
    if(scenarioExecutionInfo == null) { return false;}

    for(var branchingConstructId in executionInfo.branchingConstructs)
    {
        for(var modifiedIdentifierId in scenarioExecutionInfo.afterLoadingModifiedIdentifiers)
        {
            if(dependencyExists(branchingConstructId, modifiedIdentifierId, scenarioExecutionInfo))
            {
                return true;
            }
        }

        for(var modifiedObjectId in scenarioExecutionInfo.afterLoadingModifiedObjects)
        {
            if(dependencyExists(branchingConstructId, modifiedObjectId, scenarioExecutionInfo))
            {
                return true;
            }
        }
    }

    return false;
}

function dependencyExists(sourceNodeId, targetNodeId, executionInfo)
{
    if(dependencyCache[sourceNodeId + "-" + targetNodeId]) { return true; }

    traversedDependencies = {};

    return pathExists(sourceNodeId, targetNodeId, executionInfo);
}

function pathExists(sourceNodeId, targetNodeId, executionInfo)
{
    var dataDependencies = executionInfo.dataDependencies;

    if(dataDependencies[sourceNodeId] == null) { return false; }

    if(dataDependencies[sourceNodeId][targetNodeId])
    {
        dependencyCache[sourceNodeId + "-" + targetNodeId] = true;
        return true;
    }

    traversedDependencies[sourceNodeId] = true;

    for(var dependencyId in dataDependencies[sourceNodeId])
    {
        if(traversedDependencies[dependencyId]) { continue; }

        if(pathExists(dependencyId, targetNodeId, executionInfo))
        {
            return true;
        }
    }

    return false;
}