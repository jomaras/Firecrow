var page = require('webpage').create();
var system = require('system');
var fs = require('fs');
var pageUrl = "http://www.fesb.hr";

page.onConsoleMessage = function(msg)
{
    console.log(msg);
};

system.args.length < 2 ? console.log("Usage: savePageModel.js [url]")
    : pageUrl = system.args[1];

console.log("*** Saving page model for page " + pageUrl + " ***\n");

var encodedPageName = encodeURIComponent(pageUrl);
var mainFolder = "webPages" + fs.separator;
var pageFolder = mainFolder + encodedPageName + fs.separator;
var currentFolder = pageFolder + fs.separator + getCurrentTime() + fs.separator;

if(!fs.exists(mainFolder)) { fs.makeDirectory(mainFolder); }
if(!fs.exists(pageFolder)) { fs.makeDirectory(pageFolder); }
if(!fs.exists(currentFolder)) { fs.makeDirectory(currentFolder); }

page.open(encodeURI(pageUrl), function (status)
{
    // Check for page load success
    if (status !== "success")
    {
        console.log("Unable to access network");
    }
    else
    {
        var result = page.evaluate(function()
        {
            var documentElement = document.documentElement;
            var externalScripts = [];
            var externalStyles = [];

            function getSimplifiedElement(element)
            {
                var elem =
                {
                    type: rootElement.nodeType != 3 ? rootElement.localName : "textNode",
                    attributes: this.getAttributes(rootElement),
                    childNodes: this.getChildren(rootElement, scriptPathsAndModels, stylesPathsAndModels),
                    nodeId: this._lastUsedId++
                };

                if(elem.type == null) { return null;}

                var that = this;

                if(rootElement.nodeType == 3 //is text node
                    || rootElement.tagName == "SCRIPT"
                    || rootElement.tagName == "STYLE")
                {
                    elem.textContent = rootElement.textContent;
                }

                if(rootElement.tagName == "SCRIPT" && rootElement.src != "")
                {
                    externalScripts.push(rootElement.src);
                }
                else if (rootElement.tagName == "LINK" && rootElement.rel != "" && rootElement.rel.toLowerCase() == "stylesheet")
                {
                    externalStyles.push(rootElement.href);
                }

                return elem;
            };

            return {
                htmlModel: JSON.stringify(getSimplifiedElement(document.documentElement)),
                externalScripts: externalScripts,
                externalStyles: externalStyles
            };
        });

        fs.write(currentFolder + "index.json", result.htmlModel, 'w');

        result.externalScripts.forEach(function(externalScript)
        {
            fs.write(currentFolder + encodeURIComponent(externalScript) + ".js", "JavaScriptCode", 'w');
        });

        result.externalStyles.forEach(function(externalStyle)
        {
            fs.write(currentFolder + encodeURIComponent(externalStyle) + ".css", "CSS code", 'w');
        });
    }

    phantom.exit();
});


function getCurrentTime()
{
    var now = new Date();

    function addZero(num) { return (num >= 0 && num < 10) ? "0" + num : num + ""; }

    return now.getFullYear() + "_" +addZero(now.getMonth() + 1) + "_" + addZero(now.getDate())
        + "__" + addZero(now.getHours()) + "_" + addZero(now.getMinutes());
}