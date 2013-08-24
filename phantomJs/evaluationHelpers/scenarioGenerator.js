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
var pageModelUrl = "http://localhost/Firecrow/evaluation/fullPages/rentingAgency/index.json";
var pageModelFilePath = "C:\\GitWebStorm\\Firecrow\\evaluation\\fullPages\\rentingAgency\\index.json";
/*******************************************************/
var pageModel = JSON.parse(fs.read(pageModelFilePath));
var pageModelMapping = {};
var parametrizedEventsMap = {};
var scenarios = new ScenarioCollectionModule.ScenarioCollection();
var numberOfProcessedScenarios = 0;

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

function getExecutionInfoSummaryFromPage(page)
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

        var executionInfoSummary = getExecutionInfoSummaryFromPage(page);

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

    page.open(pageUrl, function(status)
    {
        if(status != "success") { console.log ("Could not process scenario: " + page.url); }
        console.log("Processing time: " + (Date.now() - startTime) + " ms");

        var executionInfoSummary = getExecutionInfoSummaryFromPage(page);

        scenario.setExecutionInfo(executionInfoSummary);

        var achievedCoverage = executionInfoSummary.achievedCoverage;
        updateTotalCoverage(executionInfoSummary.executedConstructsIdMap);

        checkCoverage(achievedCoverage);

        printCoverage(achievedCoverage, "Scenario Coverage");
        printCoverage(ASTHelper.calculateCoverage(pageModel), "TotalApp Coverage");

        createInvertedPathScenarios(executionInfoSummary);
        createRegisteredEventsScenarios(executionInfoSummary);

        setTimeout(deriveScenarios, 1000);
        numberOfProcessedScenarios++;
    });
}

function createInvertedPathScenarios(executionInfoSummary)
{

}

function createRegisteredEventsScenarios(executionInfoSummary)
{

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
