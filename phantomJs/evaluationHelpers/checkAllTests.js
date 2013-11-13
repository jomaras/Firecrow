var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var loadInProgress = false;

var PAGE_ASSERTION_FAILS = 0;
var TOTAL_ASSERTION_FAILS = 0;
var PAGE_FAILS = 0;

var htmlFiles = [];

var rootFolder = "C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\";
var libraryName = system.args[1] || "jQuery";
var sliceType = system.args[2] || "slicedWithoutSliceUnions"; //profiled, slicedAll, slicedWithoutSliceUnions, adjusted (for original)
var libraryFolder = rootFolder + libraryName + fs.separator;
var checkFolder = libraryFolder + sliceType + fs.separator;

var emptyPageUrl = "http://localhost/Firecrow/phantomJs/helperPages/emptyPage.html";

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

page.onInitialized = function() {  page.injectJs("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\injections\\assertDefinitions.js");};
page.onLoadStarted = function() { };
page.onLoadFinished = function()
{
    page.onConsoleMessage = function(msg) { system.stderr.writeLine('console: ' + msg); PAGE_ASSERTION_FAILS++; };
    page.onAlert = function(msg) { console.log('ALERT: ' + msg); };

    startChecking();
}

page.open(htmlFiles[0] || emptyPageUrl);
var htmlCode = "";
function startChecking()
{
    htmlCode +="<table>";

    var interval = setInterval(function() {
        if (!loadInProgress && pageIndex < htmlFiles.length)
        {
            page.open(htmlFiles[pageIndex]);
        }
        if (pageIndex == htmlFiles.length)
        {
            console.log("Testing complete - # processed pages: " + pageIndex + ", fails: " + PAGE_FAILS);
            htmlCode += "</table>";
            fs.write(checkFolder + "timingLog.txt", log);
            fs.write(checkFolder + "timingLog.htm", htmlCode);
            phantom.exit();
        }
    }, 250);

    page.onInitialized = function() {
        page.injectJs("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\injections\\assertDefinitions.js");
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
            htmlCode +="<tr><td>" + htmlFiles[pageIndex] + "</td>" + "<td>" + (Date.now() - startTime) + "</td></tr>";
            console.log("OK - " + htmlFiles[pageIndex] + " in " + (Date.now() - startTime) + "msec");
        }

        pageIndex++;
    }
}