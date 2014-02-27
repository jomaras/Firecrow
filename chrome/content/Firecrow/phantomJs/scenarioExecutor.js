var webPage = require('webpage');

var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var currentFilePath = system.args[0];
var currentDirectoryPath = currentFilePath.replace(/[a-zA-Z]+\.[a-zA-Z]+$/,"");

fs.changeWorkingDirectory(currentDirectoryPath);

var scenarioExecutorUrl = fs.absolute("scenarioExecutor.html");
var scenarioExecutorDataFile = fs.absolute("scenarioExecutor.txt");

console.log("Staring scenarioExecutor phantomJs script, executing: " + scenarioExecutorUrl);
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

    console.log("Saving scenario execution info to: " + scenarioExecutorDataFile);

    fs.write(scenarioExecutorDataFile, executionInfoString);
    phantom.exit();
});