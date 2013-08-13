var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var url = "file:///C:/GitWebStorm/Firecrow/debug/debugSlicing.html";

console.log("Started loading page");

page.onConsoleMessage = function(msg) {
    system.stderr.writeLine('console: ' + msg);
};

page.onAlert = function(msg) {
    console.log('ALERT: ' + msg);
};

var t = Date.now();
page.open(encodeURI(url), function(status)
{
    if(status != "success")
    {
        console.log("Could not load page");
    }
    else
    {
        console.log("Page loaded");
        t = Date.now() - t;
        console.log('Loading time ' + t + ' msec');

        var result = page.evaluate(function()
        {
            return document.getElementById("slicedSourceTextContainer").value;
        });

        console.log(result);

        phantom.exit();
    }
});