var system = require('system');
var fs = require('fs');

var ScenarioGenerator = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\ScenarioGenerator.js").ScenarioGenerator;

var visitedCodeTemplatePath = "C:\\GitWebStorm\\Firecrow\\phantomJs\\helperPages\\viewExecutedCodeTemplate.html"
var visitedCodePath = "C:\\GitWebStorm\\Firecrow\\phantomJs\\helperPages\\viewExecutedCode.html"

console.log("Starting scenario generator");

ScenarioGenerator.shouldPrintDetailedMessages = true;
ScenarioGenerator.generateAdditionalMouseMoveEvents = true;
ScenarioGenerator.generateAdditionalTimingEvents = true;
ScenarioGenerator.generateScenarios("http://localhost/Firecrow/evaluation/fullPages/tinySlider/index.json", function(scenarios, message, coverage)
{
    console.log(message);
    console.log("The process has achieved branch coverage: " + coverage.branchCoverage);

    var markupCode = ScenarioGenerator.generateVisitedMarkup();

    var template = fs.read(visitedCodeTemplatePath);
    var content = template.replace("{SOURCE_CODE}", markupCode);

    fs.write(visitedCodePath, content);
    console.log("Generated executed code markup: " + visitedCodePath);

    phantom.exit();
});