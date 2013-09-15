var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var loadInProgress = false;

var modelFiles = [];
var pageIndex = 0;

var libraryFolder = "C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\jQuery\\";
var rootName = "adjusted_models";
var rootFolder = libraryFolder + rootName;
var destinationName = "slicedAll";//slicedAll; slicedWithoutSliceUnions; slicedWithoutSliceUnionsAndArrays
var destinationFolder = libraryFolder + destinationName;
var logFile = destinationFolder + "\\logAll.txt";

page.onConsoleMessage = function(msg) { system.stderr.writeLine('console: ' + msg); };
page.onAlert = function(msg) { console.log('ALERT: ' + msg); };


var log = "";

modelFiles = fs.list(rootFolder).map(function(fileName)
{
    var fullPath = rootFolder + fs.separator + fileName;

    if(fs.isFile(fullPath) && fullPath.indexOf('.json') != -1 && fullPath.indexOf("effects03") != -1)
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
}, 500);

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
            slicingTime: document.getElementById("loadingTimeTextArea").textContent,
            numberOfNodes: document.getElementById("astNodesTextArea").textContent
        }
    });

    fs.write(modelFiles[pageIndex].replace(".json", ".html").replace(rootName, destinationName), result.source);
    console.log(modelFiles[pageIndex] + " sliced in " + result.slicingTime + " msec " + " and has " + result.source.split("\n").length + " LOC");
    //file name --- time required in ms --- number of lines --- number of ast nodes
    log += modelFiles[pageIndex] + " --- " + result.slicingTime + " --- " + result.source.split("\n").length + " --- " + result.numberOfNodes + "\n";

    loadInProgress = false;

    pageIndex++;
};