var webPage = require('webpage');

var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var scenarioExecutorUrl = system.args[1] || "";
var scenarioExecutorDataFile = "C:\\GitWebStorm\\Firecrow\\phantomJs\\dataFiles\\scenarioExecutor.txt";

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