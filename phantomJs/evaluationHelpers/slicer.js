var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var loadInProgress = false;

var modelFiles = [];
var pageIndex = 0;

var libraryName = "prototype";
var executeRegisteredEvents = libraryName == "jQuery";
var libraryFolder = "C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\" + libraryName + "\\";
var rootName = "adjusted_models";
var rootFolder = libraryFolder + rootName;
var destinationName = "slicedWithoutSliceUnions";//profiled; slicedAll; slicedWithoutSliceUnions;
var destinationFolder = libraryFolder + destinationName;
var logFile = destinationFolder + "\\logAll.txt";

var emptyPageUrl = "http://localhost/Firecrow/phantomJs/helperPages/emptyPage.html";

page.onConsoleMessage = function(msg) { system.stderr.writeLine('console: ' + msg); };
page.onAlert = function(msg) { console.log('ALERT: ' + msg); };

console.log("Slicer started!");
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
                        + "?url=" + modelUrl
                        + (executeRegisteredEvents ? ("&executeRegisteredEvents=" + executeRegisteredEvents)  : "")
                        + (destinationName == "profiled" ? ("&sliceType=profile")  : "")
                        + (destinationName == "slicedAll" ? ("&sliceType=sliceAll")  : "")
                        + (destinationName == "slicedWithoutSliceUnions" ? ("&sliceType=sliceWithoutUnions")  : "");

        page.open(encodeURI(slicerPageUrl));
    }
    if (pageIndex == modelFiles.length)
    {
        console.log("Testing complete - # processed pages: " + pageIndex);
        fs.write(logFile, log);
        phantom.exit();
    }
}, 1000);

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
            slicingCriteriaCount: document.getElementById("slicingCriteriaCountTextArea").textContent
        }
    });

    fs.write(modelFiles[pageIndex].replace(".json", ".html").replace(rootName, destinationName), result.source);
    console.log(modelFiles[pageIndex] + " sliced in " + result.slicingTime + " msec " + " and has " + result.source.split("\n").length + " LOC" + "; SC: " + result.slicingCriteriaCount);
    //file name --- time required in ms --- number of lines --- number of ast nodes -- slicingCriteriaCount
    log += modelFiles[pageIndex] + " --- " + result.slicingTime + " --- " + result.source.split("\n").length + " --- " + result.numberOfNodes + " --- " + result.slicingCriteriaCount + "\n";

    page.onLoadStarted = null;
    page.onLoadFinished = null;
    page.open(emptyPageUrl);

    setTimeout(function()
    {
        loadInProgress = false;

        pageIndex++;

        page.onLoadStarted = onLoadStarted;
        page.onLoadFinished = onLoadFinished;
    }, 1500);
};

page.onLoadStarted = onLoadStarted;
page.onLoadFinished = onLoadFinished;