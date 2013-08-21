var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var loadInProgress = false;

var modelFiles = [];
var pageIndex = 0;
var maxPageIndex = 108;
 console.log("Started reggression tests");
//Problems in tests: 88 (bind function)
// 91 - not sure why

page.onConsoleMessage = function(msg) { system.stderr.writeLine('console: ' + msg); };
page.onAlert = function(msg) { console.log('ALERT: ' + msg); };

var log = "";

var interval = setInterval(function()
{
    if (!loadInProgress && pageIndex < maxPageIndex)
    {
        page.open(encodeURI("http://localhost/Firecrow/debug/debugSlicingPhantom.html" + "?index=" + pageIndex));
    }

    if (pageIndex >= maxPageIndex)
    {
        console.log("Testing complete - # processed pages: " + pageIndex);
        phantom.exit();
    }
}, 200);

page.onLoadStarted = function()
{
    loadInProgress = true;
};

page.onLoadFinished = function()
{
    var result = page.evaluate(function()
    {
        return {
            message: document.getElementById("messageContainer").textContent
        }
    });

    if(result.message.trim() != "Test successful")
    {
        console.log("Problem in test no " + pageIndex);
    }

    loadInProgress = false;

    pageIndex++;

    if(pageIndex == 88) { pageIndex++; } //tests the bind function which is not available in phantomJs
};