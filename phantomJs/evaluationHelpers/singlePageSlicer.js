var slicerUrl = "http://pzi.fesb.hr/josip.maras/Firecrow/phantomJs/helperPages/slicer.html?url=http://pzi.fesb.hr/josip.maras/Firecrow/evaluation/libraries/jQuery/adjusted_models/attributes-attr_string_object.json&executeRegisteredEvents=true&sliceType=sliceAll";
var webPage = require('webpage');
var page = webPage.create();

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
        return {
            source: document.getElementById("slicingResultTextArea").textContent,
            slicingTime: document.getElementById("loadingTimeTextArea").textContent,
            numberOfNodes: document.getElementById("astNodesTextArea").textContent,
            slicingCriteriaCount: document.getElementById("slicingCriteriaCountTextArea").textContent,
            evaluatedExpressionsCount: document.getElementById("noEvaluatedExpressionsTextArea").textContent
        }
    });

    console.log("Sliced in " + result.slicingTime + " msec " + " and has " + result.source.split("\n").length + " LOC" + "; SC: " + result.slicingCriteriaCount + " EXE: " + result.evaluatedExpressionsCount);
    phantom.exit();
};


