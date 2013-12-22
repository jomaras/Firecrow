var fs = require('fs');
var path = require('path');

var ScenarioGenerator = require(path.resolve(__dirname, "scenarioGeneratorModules/ScenarioGenerator.js")).ScenarioGenerator;
var scenarioEmpiricalDataPath = path.resolve(__dirname, "../../EventRecorder/recordings/aggregateJsonData.txt");

var visitedCodeTemplatePath = path.resolve(__dirname, "../phantomJs/helperPages/viewExecutedCodeTemplate.html");
var visitedCodeDestinationFolder = path.resolve(__dirname, "../evaluation/results/coverageMarkup") + path.sep;
ScenarioGenerator.scriptPathsToIgnore = [];
ScenarioGenerator.shouldPrintDetailedMessages = true;

ScenarioGenerator.generateAdditionalMouseMoveEvents = true;
ScenarioGenerator.generateAdditionalTimingEvents = false;

var pageName = process.argv[2] || "04-dragable-boxes";
ScenarioGenerator.prioritization = process.argv[3] || ScenarioGenerator.PRIORITIZATION.fifo;
ScenarioGenerator.MAX_NUMBER_OF_SCENARIOS = process.argv[4] != null ? parseInt(process.argv[4]) : 3;

console.log("Starting scenario generator: ", pageName ,  ScenarioGenerator.prioritization, ScenarioGenerator.MAX_NUMBER_OF_SCENARIOS);

var coverageFolder = path.resolve(__dirname, "../evaluation/results/coverage") + path.sep + ScenarioGenerator.prioritization + path.sep;
var scenarioModelPath = path.resolve(__dirname, "../../CodeModels/evaluation/scenarioGenerator/" + pageName + "/index.json");
var eventExecutionsFolder = path.resolve(__dirname, "../phantomJs/dataFiles/eventExecutions/");

//ScenarioGenerator.setEmpiricalData(JSON.parse(fs.readFileSync(scenarioEmpiricalDataPath, { encoding: "utf-8"})));

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

    var coverageFile = coverageFolder + pageName + ".txt";
    try
    {
        fs.mkdirSync(coverageFolder);
    }
    catch(e) { console.log("Error when creating coverageFolders", e);}

    fs.writeFileSync(coverageFile, getCoverageData());

    var filteredScenarios = scenarios.getSubsumedProcessedScenarios();

    console.warn("Kept scenarios: ", filteredScenarios.length);

    for(var i = 0; i < filteredScenarios.length; i++)
    {
        console.warn("Scenario", i, filteredScenarios[i].getEventsQuery());
    }

    console.warn("Deleting event execution files");
    deleteEventExecutionFiles();

    var markupCode = ScenarioGenerator.generateVisitedMarkup();

    var template = fs.readFileSync(visitedCodeTemplatePath, {encoding:"utf8"});
    var content = template.replace("{SOURCE_CODE}", markupCode);

    var coveredCodePage = visitedCodeDestinationFolder + pageName + "-" + ScenarioGenerator.prioritization + ".htmla";

    fs.writeFileSync(coveredCodePage , content);
    console.warn("Covered code html: ", coveredCodePage);

    process.exit();
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