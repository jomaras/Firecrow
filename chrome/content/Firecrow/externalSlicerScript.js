var webPage = require('webpage');
var system = require('system');
var fs = require('fs');

var currentFilePath = system.args[0];
var shouldProduceMarkup = system.args[1];
var currentDirectoryPath = currentFilePath.replace(/[a-zA-Z]+\.[a-zA-Z]+$/,"");

fs.changeWorkingDirectory(currentDirectoryPath);

var page = webPage.create();

var resultFilePath = currentDirectoryPath + "result.txt";
var slicerUrl = currentDirectoryPath + (!shouldProduceMarkup ? "externalSlicer.html" : "externalSlicedMarker.html");

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

        if(slicedCodeContainer != null)
        {
            return slicedCodeContainer.nodeName == "DIV" ? slicedCodeContainer.innerHTML
                                                         : slicedCodeContainer.textContent;
        }

        return "ERROR WHEN SLICING WITH EXTERNAL TOOL!"
    });

    console.log("Writing result to: " + resultFilePath);
    fs.write(resultFilePath, result);

    setTimeout(function()
    {
        phantom.exit();
    }, 2000);
};