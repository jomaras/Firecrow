var webPage = require('webpage');

var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var currentFilePath = system.args[0];
var currentDirectoryPath = currentFilePath.replace(/[a-zA-Z]+\.[a-zA-Z]+/,"");

fs.changeWorkingDirectory(currentDirectoryPath);

var scenarioExecutorUrl = system.args[1] || "";
var scenarioExecutorDataFile = fs.absolute("../dataFiles/scenarioExecutor.txt");

fs.write(scenarioExecutorDataFile, "");

page.onConsoleMessage = function(msg) { system.stderr.writeLine('console: ' + msg); };
page.onAlert = function(msg) { console.log('ALERT: ' + msg); };

page.open(encodeURI(scenarioExecutorUrl), function(status)
{
    if(status != "success") { fs.write(scenarioExecutorDataFile, "ERROR - Can not load scenario for: " + page.url ); phantom.exit();}

    var executionInfoString = page.evaluate(function()
    {
        var executionInfo = document.querySelector("#executionInfo");
        return executionInfo != null ? executionInfo.value || "{}" : "{}";
    });

    fs.write(scenarioExecutorDataFile, executionInfoString);
    console.log("Exiting from scenarioExecutor phantomJs script!");
    phantom.exit();
});