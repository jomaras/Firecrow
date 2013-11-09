var system = require('system');
var fs = require('fs');

var ScenarioGenerator = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\ScenarioGenerator.js").ScenarioGenerator;

var scenarioEmpiricalDataPath = "C:\\GitWebStorm\\EventRecorder\\recordings\\aggregateJsonData.txt";

var visitedCodeTemplatePath = "C:\\GitWebStorm\\Firecrow\\phantomJs\\helperPages\\viewExecutedCodeTemplate.html";
var visitedCodePath = "C:\\GitWebStorm\\Firecrow\\phantomJs\\helperPages\\viewExecutedCode.html";


var pageName = system.args[1] || "3dMaker";
console.log("Starting scenario generator");

ScenarioGenerator.shouldPrintDetailedMessages = true;

ScenarioGenerator.generateAdditionalMouseMoveEvents = true;
ScenarioGenerator.generateAdditionalTimingEvents = false;

ScenarioGenerator.prioritization = system.args[2] || ScenarioGenerator.PRIORITIZATION.empirical;
ScenarioGenerator.MAX_NUMBER_OF_SCENARIOS = system.args[3] != null ? parseInt(system.args[3]) : 100;

var coverageFolder = "C:\\GitWebStorm\\Firecrow\\evaluation\\results\\coverage\\" + ScenarioGenerator.prioritization + "\\";

ScenarioGenerator.setEmpiricalData(JSON.parse(fs.read(scenarioEmpiricalDataPath)));

ScenarioGenerator.generateScenarios("http://localhost/Firecrow/evaluation/fullPages/" + pageName + "/index.json", function(scenarios, message, coverage)
{
    console.log(message);
    console.log("The process has achieved branch coverage: " + (coverage != null ? coverage.branchCoverage : 0));

    var markupCode = ScenarioGenerator.generateVisitedMarkup();

    var template = fs.read(visitedCodeTemplatePath);
    var content = template.replace("{SOURCE_CODE}", markupCode);

    fs.write(visitedCodePath, content);
    fs.write(coverageFolder + pageName + ".txt", getCoverageData());
    console.log("Generated executed code markup: " + visitedCodePath);

    phantom.exit();
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