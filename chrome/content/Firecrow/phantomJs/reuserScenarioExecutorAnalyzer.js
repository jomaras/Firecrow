var webPage = require('webpage');

var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var currentFilePath = system.args[0];
var currentDirectoryPath = currentFilePath.replace(/[a-zA-Z]+\.[a-zA-Z]+$/,"");

fs.changeWorkingDirectory(currentDirectoryPath);

var scenarioExecutorUrl = fs.absolute("reuserScenarioExecutorAnalyzer.html");
var scenarioExecutorDataFile = fs.absolute("scenarioExecutorAnalyzer.txt");

page.onConsoleMessage = function(msg) { system.stderr.writeLine('analyzer console: ' + msg); };
page.onAlert = function(msg) { console.log('analyzer ALERT: ' + msg); };

fs.write(scenarioExecutorDataFile, "");

page.open(encodeURI(scenarioExecutorUrl), function(status)
{
    if(status != "success") { fs.write(scenarioExecutorDataFile, "ERROR - Can not load scenario for: " + page.url ); phantom.exit();}

    var executionInfoString = page.evaluate(function()
    {
        var executionInfo = document.querySelector("#executionInfo");
        return executionInfo != null ? executionInfo.value || "{}" : "{}";
    });

    fs.write(scenarioExecutorDataFile, executionInfoString);
    phantom.exit();
});