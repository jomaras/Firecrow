var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var loadInProgress = false;

var PAGE_ASSERTION_FAILS = 0;
var TOTAL_ASSERTION_FAILS = 0;
var PAGE_FAILS = 0;

page.onConsoleMessage = function(msg) { system.stderr.writeLine('console: ' + msg); PAGE_ASSERTION_FAILS++; };
page.onAlert = function(msg) { console.log('ALERT: ' + msg); };

var htmlFiles = [];

var rootFolder = "C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\";
var libraryName = "prototype";
var sliceType = "slicedWithoutSliceUnions"; //profiled, slicedAll, slicedWithoutSliceUnions
var libraryFolder = rootFolder + libraryName + fs.separator;
var checkFolder = libraryFolder + sliceType + fs.separator;

htmlFiles = fs.list(checkFolder).map(function(fileName)
{
    var fullPath = checkFolder + fileName;

    if(fs.isFile(fullPath) && fullPath.indexOf('.html') != -1)
    {
        return fullPath
    }
}).filter(function(item){ return item != null; });

var pageIndex = 0;
var startTime = null;

var log = "";

var interval = setInterval(function() {
    if (!loadInProgress && pageIndex < htmlFiles.length)
    {
        page.open(htmlFiles[pageIndex]);
    }
    if (pageIndex == htmlFiles.length)
    {
        console.log("Testing complete - # processed pages: " + pageIndex + ", fails: " + PAGE_FAILS);
        fs.write(checkFolder + "timingLog.txt", log);
        phantom.exit();
    }
}, 250);

page.onInitialized = function() {
    page.injectJs("./evaluationHelpers/injections/assertDefinitions.js");
    PAGE_ASSERTION_FAILS = 0;
};

page.onLoadStarted = function() {
    startTime = Date.now();
    loadInProgress = true;
};

page.onLoadFinished = function() {
    loadInProgress = false;

    TOTAL_ASSERTION_FAILS += PAGE_ASSERTION_FAILS;

    if(PAGE_ASSERTION_FAILS != 0)
    {
        PAGE_FAILS++;
        console.log("ERROR - Assertions failed in file: " + htmlFiles[pageIndex]);
    }
    else
    {
        log += htmlFiles[pageIndex] + "---" + (Date.now() - startTime) + "\r\n";
        console.log("OK - " + htmlFiles[pageIndex] + " in " + (Date.now() - startTime) + "msec");
    }

    pageIndex++;
}