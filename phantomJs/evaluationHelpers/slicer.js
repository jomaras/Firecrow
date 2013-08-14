var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var loadInProgress = false;

var modelFiles = [];
var pageIndex = 0;

var rootFolder = "C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\sylvester\\adjusted_models";
var logFile = rootFolder + "\\logAll.txt";

var log = "";

modelFiles = fs.list(rootFolder).map(function(fileName)
{
    var fullPath = rootFolder + fs.separator + fileName;

    if(fs.isFile(fullPath) && fullPath.indexOf('.json') != -1)
    {
        return fullPath;
    }
}).filter(function(item){ return item != null; });

var interval = setInterval(function()
{
    if (!loadInProgress && pageIndex < modelFiles.length)
    {
        var modelUrl = modelFiles[pageIndex].replace("C:\\GitWebStorm\\", "http:\\\\localhost\\").replace(/\\/g, "/");
        var slicerPageUrl = "http://localhost/Firecrow/phantomJs/helperPages/slicer.html"
                        + "?url=" + modelUrl;

        page.open(encodeURI(slicerPageUrl));
    }
    if (pageIndex == modelFiles.length)
    {
        console.log("Testing complete - # processed pages: " + pageIndex);
        fs.write(logFile, log);
        phantom.exit();
    }
}, 250);

page.onLoadStarted = function()
{
    loadInProgress = true;
};

page.onLoadFinished = function()
{
    var result = page.evaluate(function()
    {
        return {
            source: document.getElementById("slicingResultTextArea").textContent,
            slicingTime: document.getElementById("loadingTimeTextArea").textContent
        }
    });

    fs.write(modelFiles[pageIndex].replace(".json", ".html").replace("adjusted_models", "slicedAll"), result.source);
    console.log(modelFiles[pageIndex] + " sliced in " + result.slicingTime + " msec");
    log += modelFiles[pageIndex] + " --- " + result.slicingTime + "\n";

    loadInProgress = false;

    pageIndex++;
};