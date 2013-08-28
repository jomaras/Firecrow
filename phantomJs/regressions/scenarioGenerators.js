var system = require('system');
var fs = require('fs');

var ScenarioGenerator = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\ScenarioGenerator.js").ScenarioGenerator;

var pageModelRoot = "C:\\GitWebStorm\\Firecrow\\debug\\usageScenarioGenerator";
var modelFiles = fs.list(pageModelRoot).map(function(folder)
{
    var caseFolder = pageModelRoot + fs.separator + folder;
    if(fs.isDirectory(caseFolder) && caseFolder.indexOf(".") == -1 && caseFolder.indexOf("fullPages") == -1)
    {
        return (caseFolder + fs.separator + "index.json").replace("C:\\GitWebStorm\\", "http:\\\\localhost\\").replace(/\\/g, "/");
    }
}).filter(function(item){ return item != null; });

if(modelFiles.length == 0) { console.log("No model files have been found"); phantom.exit(); }
var currentModelFileIndex = 0;

ScenarioGenerator.shouldPrintDetailedMessages = false;
ScenarioGenerator.generateAdditionalMouseMoveEvents = true;
ScenarioGenerator.generateAdditionalTimingEvents = true;
(function generateScenarios()
{
    var pageModelPath = modelFiles[currentModelFileIndex];

    if(pageModelPath == null) { console.log("All models have been processed"); phantom.exit();}

    console.log("************************************   " + pageModelPath + "   ************************************");
    ScenarioGenerator.generateScenarios(pageModelPath, function(scenarios, message, coverage)
    {
        console.log("ScenarioGeneratorMessage: " + message);

        if(coverage != null)
        {
            console.log("Statement coverage: " + coverage.statementCoverage + ", for page:" + pageModelPath);
            console.log("Generated scenarios: " + scenarios.scenarios.length);
        }
        else
        {
            console.log("No coverage for: " + pageModelPath);
        }

        currentModelFileIndex++;
        setTimeout(generateScenarios, 1000);
    })
})();



