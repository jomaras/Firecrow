var fs = require('fs');
var path = require('path');

/*
 process.argv[0] - node.exe
 process.argv[1] - file location
 process.argv[2] - coverageType
 process.argv[3] - phantomJs path
 process.argv[4] - number of analyzed scenarios
 process.argv[5] - feature selectors
 process.argv[6]... - script paths to ignore
* */

var ScenarioGenerator = require(path.resolve(__dirname, "scenarioGeneratorModules/ScenarioGenerator.js")).ScenarioGenerator;

ScenarioGenerator.includeNecessaryFilesPlugin();

ScenarioGenerator.prioritization = process.argv[2] || "test";
ScenarioGenerator.phantomJsPath = process.argv[3] || "";
ScenarioGenerator.MAX_NUMBER_OF_SCENARIOS = process.argv[4] != null ? parseInt(process.argv[4]) : 100;
ScenarioGenerator.selector = process.argv[5] || "*";

ScenarioGenerator.scriptPathsToIgnore = [];

var i = 6;
while(process.argv[i] != null)
{
    ScenarioGenerator.scriptPathsToIgnore.push(process.argv[i]);
    i++;
}

ScenarioGenerator.shouldPrintDetailedMessages = true;

ScenarioGenerator.generateAdditionalMouseMoveEvents = true;
ScenarioGenerator.generateAdditionalTimingEvents = false;

var pageName = "page";
ScenarioGenerator.prioritization = process.argv[3] || ScenarioGenerator.PRIORITIZATION.symbolicNewCoverage;
ScenarioGenerator.MAX_NUMBER_OF_SCENARIOS = process.argv[4] != null ? parseInt(process.argv[4]) : 50;

console.log("Starting scenario generator: ", ScenarioGenerator.prioritization, ScenarioGenerator.MAX_NUMBER_OF_SCENARIOS);

var scenarioModelPath = path.resolve(__dirname, "model.js");
var generatedScenariosFile = path.resolve(__dirname, "generatedScenarios.txt");
var filteredScenariosFile = path.resolve(__dirname, "filteredScenarios.txt");
var coverageFile = path.resolve(__dirname, "achievedCoverage.txt");
var visitedCodeTemplatePath = path.resolve(__dirname, "viewExecutedCode.html")
var achievedCoveragePath = path.resolve(__dirname, "achievedCoverage.txt");

var startTime = Date.now();

ScenarioGenerator.generateScenarios(scenarioModelPath, pageName, function(scenarios, message, coverage)
{
    console.log("ScenarioGenerator", message);

    console.log("The process has achieved statement coverage: " + (coverage != null ? coverage.statementCoverage : 0));

    fs.writeFileSync(coverageFile, getCoverageData());

    fs.writeFileSync(generatedScenariosFile, JSON.stringify(scenarios.getAllScenarios()));
    fs.writeFileSync(filteredScenariosFile, JSON.stringify(scenarios.getSubsumedProcessedScenarios()));

    var markupCode = ScenarioGenerator.generateVisitedMarkup();

    var template = fs.readFileSync(visitedCodeTemplatePath, {encoding:"utf8"});
    var content = template.replace("{SOURCE_CODE}", markupCode);

    fs.writeFileSync(visitedCodeTemplatePath , content);
    fs.writeFileSync(achievedCoveragePath, ScenarioGenerator.coverages[ScenarioGenerator.coverages.length - 1].statementCoverage);
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