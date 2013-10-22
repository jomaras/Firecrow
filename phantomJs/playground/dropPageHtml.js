var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var url = "https://c9.io/josipmaras/pzi/workspace/Vjezba2/index.html";

console.log("Started loading page");

page.onConsoleMessage = function(msg) {
    system.stderr.writeLine('console: ' + msg);
};

page.onAlert = function(msg) {
    console.log('ALERT: ' + msg);
};

page.onInitialized = function() {
    page.injectJs("./evaluationHelpers/assertDefinitions.js");
};
page.viewportSize = { width: 1024, height: 800 };
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
            return document.getElementById("sourceTextArea").value;
        });

        console.log(result);

        page.render("C:\\GitWebStorm\\Firecrow\\phantomJs\\playground\\page.png");

        phantom.exit();
    }
});