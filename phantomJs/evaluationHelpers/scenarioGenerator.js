var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var ScenarioGenerator = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\ScenarioGenerator.js").ScenarioGenerator;

page.onConsoleMessage = function(msg) { system.stderr.writeLine('console: ' + msg); };
page.onAlert = function(msg) { console.log('ALERT: ' + msg); };

var visitedCodeTemplatePath = "C:\\GitWebStorm\\Firecrow\\phantomJs\\helperPages\\viewExecutedCodeTemplate.html"
var visitedCodePath = "C:\\GitWebStorm\\Firecrow\\phantomJs\\helperPages\\viewExecutedCode.html"

console.log("Starting scenario generator");

ScenarioGenerator.shouldPrintDetailedMessages = true;
ScenarioGenerator.generateScenarios("http://localhost/Firecrow/evaluation/fullPages/rentingAgency/index.json", function(scenarios, message)
{
    console.log(message);

    var markupCode = ScenarioGenerator.generateVisitedMarkup();

    var template = fs.read(visitedCodeTemplatePath);
    var content = template.replace("{SOURCE_CODE}", markupCode);

    fs.write(visitedCodePath, content);
    console.log("Generated executed code markup: " + visitedCodePath);

    phantom.exit();
})
