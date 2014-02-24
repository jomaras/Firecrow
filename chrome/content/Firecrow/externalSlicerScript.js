var webPage = require('webpage');
var system = require('system');
var fs = require('fs');

var currentFilePath = system.args[0];
var currentDirectoryPath = currentFilePath.replace(/[a-zA-Z]+\.[a-zA-Z]+$/,"");

fs.changeWorkingDirectory(currentDirectoryPath);

var page = webPage.create();

var resultFilePath = currentDirectoryPath + "result.txt";
var slicerUrl = currentDirectoryPath + "externalSlicer.html";

console.log("Single page slicer starting..");

var loadInProgress = false;

page.onConsoleMessage = function(msg) { system.stderr.writeLine('console: ' + msg); };
page.onAlert = function(msg) { console.log('ALERT: ' + msg); };

page.onLoadStarted = onLoadStarted;
page.onLoadFinished = onLoadFinished;

page.open(encodeURI(slicerUrl));

function onLoadStarted()
{
    loadInProgress = true;
};

function onLoadFinished()
{
    var result = page.evaluate(function()
    {
        var slicedCodeContainer = document.getElementById("slicedCodeContainer");

        var result = "";

        if(slicedCodeContainer != null)
        {
            result = slicedCodeContainer.textContent.trim() || slicedCodeContainer.innerHTML;
        }

        return result.trim() || "ERROR WHEN SLICING WITH EXTERNAL TOOL!"
    });

    console.log("Writing result to: " + resultFilePath);
    fs.write(resultFilePath, result);

    phantom.exit();
};