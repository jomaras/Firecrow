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

var rootFolder = "C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\jQuery\\adjusted";

htmlFiles = fs.list(rootFolder).map(function(fileName)
{
    var fullPath = rootFolder + fs.separator + fileName;

    if(fs.isFile(fullPath) && fullPath.indexOf('.html') != -1 && fullPath.indexOf('manipulation') != -1)
    {
        return fullPath
    }
}).filter(function(item){ return item != null; });

var pageIndex = 0;

var interval = setInterval(function() {
    if (!loadInProgress && pageIndex < htmlFiles.length)
    {
        page.open(htmlFiles[pageIndex]);
    }
    if (pageIndex == htmlFiles.length)
    {
        console.log("Testing complete - # processed pages: " + pageIndex + ", fails: " + PAGE_FAILS);
        phantom.exit();
    }
}, 250);

page.onInitialized = function() {
    page.injectJs("./evaluationHelpers/injections/assertDefinitions.js");
    PAGE_ASSERTION_FAILS = 0;
};

page.onLoadStarted = function() {
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
        console.log("OK - " + htmlFiles[pageIndex]);
    }

    pageIndex++;
}