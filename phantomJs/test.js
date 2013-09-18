var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var url = "file:///C:/GitWebStorm/Firecrow/evaluation/libraries/underscore/adjusted/playground.html";

console.log("Started loading page");

page.onConsoleMessage = function(msg) {
    system.stderr.writeLine('console: ' + msg);
};

page.onAlert = function(msg) {
    console.log('ALERT: ' + msg);
};

page.onShouldInterruptJs = function()
{
    console.log("considering interrupting page");
}

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

        /*var result = page.evaluate(function()
        {
            return document.documentElement.innerHTML;
        });*/

        //console.log(result);

        setTimeout(function()
        {
            console.log("After some time:");
            console.log(page.evaluate(function()
            {
                //return document.documentElement.innerHTML;
            }));

            phantom.exit();
        }, 2000);
    }
});