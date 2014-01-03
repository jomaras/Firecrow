var fs = require('fs');
var path = require('path');

var ScenarioGenerator = require(path.resolve(__dirname, "scenarioGeneratorModules/ScenarioGenerator.js")).ScenarioGenerator;

var visitedCodeTemplatePath = path.resolve(__dirname, "../phantomJs/helperPages/viewExecutedCodeTemplate.html");
var visitedCodeDestinationFolder = path.resolve(__dirname, "../evaluation/results/coverageMarkup") + path.sep;
ScenarioGenerator.scriptPathsToIgnore = [];
ScenarioGenerator.shouldPrintDetailedMessages = true;

ScenarioGenerator.generateAdditionalMouseMoveEvents = true;
ScenarioGenerator.generateAdditionalTimingEvents = false;

var pageName = process.argv[2] || "testApplication"//"28-floatwar";
ScenarioGenerator.prioritization = process.argv[3] || ScenarioGenerator.PRIORITIZATION.symbolicNewCoverage;
ScenarioGenerator.MAX_NUMBER_OF_SCENARIOS = process.argv[4] != null ? parseInt(process.argv[4]) : 30;

console.log("Starting scenario generator: ", pageName ,  ScenarioGenerator.prioritization, ScenarioGenerator.MAX_NUMBER_OF_SCENARIOS);

var coverageFolder = process.argv[5] || path.resolve(__dirname, "../evaluation/results/coverage") + path.sep + ScenarioGenerator.prioritization + path.sep;
var generatedScenariosFolder = process.argv[5] || path.resolve(__dirname, "../evaluation/results/generatedScenarios") + path.sep + ScenarioGenerator.prioritization + path.sep;
var scenarioModelPath = process.argv[6] || "C:\\GitWebStorm\\CodeModels\\evaluation\\scenarioGeneratorTests\\54.json"//path.resolve(__dirname, "../../CodeModels/evaluation/scenarioGenerator/" + pageName + "/index.json"); //"C:\\GitWebStorm\\CodeModels\\evaluation\\scenarioGeneratorTests\\40.json";
var eventExecutionsFolder = path.resolve(__dirname, "../phantomJs/dataFiles/eventExecutions/");
var achievedCoverageFile = path.resolve(__dirname, "../evaluation/results/achievedCoverage.txt");

fs.writeFileSync(achievedCoverageFile, "");

function deleteEventExecutionFiles()
{
    fs.readdirSync(eventExecutionsFolder).forEach(function(file)
    {
        fs.unlinkSync(eventExecutionsFolder + path.sep + file);
    });
}

ScenarioGenerator.generateScenarios(scenarioModelPath, pageName, function(scenarios, message, coverage)
{
    console.log("ScenarioGenerator", message);
    console.log("The process has achieved statement coverage: " + (coverage != null ? coverage.statementCoverage : 0));
    fs.writeFileSync(achievedCoverageFile, (coverage != null ? coverage.statementCoverage : 0));

    var coverageFile = coverageFolder + pageName + ".txt";
    var generatedScenariosFile = generatedScenariosFolder + pageName + ".txt";

    if(!fs.existsSync(coverageFolder))
    {
        fs.mkdirSync(coverageFolder);
    }

    fs.writeFileSync(coverageFile, getCoverageData());

    var filteredScenarios = scenarios.getSubsumedProcessedScenarios();

    var numberOfEvents = 0;
    for(var i = 0; i < filteredScenarios.length; i++)
    {
        numberOfEvents += filteredScenarios[i].events.length;
    }

    console.log("Kept scenarios: ", filteredScenarios.length, "with ", numberOfEvents, " of events");
    fs.writeFileSync(generatedScenariosFile, filteredScenarios.length + " - " + numberOfEvents);

    console.log("Deleting event execution files");
    deleteEventExecutionFiles();

    var markupCode = ScenarioGenerator.generateVisitedMarkup();

    var template = fs.readFileSync(visitedCodeTemplatePath, {encoding:"utf8"});
    var content = template.replace("{SOURCE_CODE}", markupCode);

    var coveredCodePage = visitedCodeDestinationFolder + pageName + "-" + ScenarioGenerator.prioritization + ".htmla";

    fs.writeFileSync(coveredCodePage , content);
    console.log("Covered code html: ", coveredCodePage);
});

function getCoverageData()
{
    var data = "";

    ScenarioGenerator.coverages.forEach(function(item, index)
    {
        data += item.expressionCoverage + "@" + item.branchCoverage + "@" + item.statementCoverage;

        if(index != ScenarioGenerator.coverages.length - 1)
        {
            data += "\r\n";
        }
    });

    return data;
}