var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

page.onConsoleMessage = function(msg) { system.stderr.writeLine('console: ' + msg); PAGE_ASSERTION_FAILS++; };
page.onAlert = function(msg) { console.log('ALERT: ' + msg); };

/********************************/
//targetPageUrl has to be localhost
var targetPageUrl = "http://localhost/Firecrow/evaluation/fullPages/testApplication/index.html";
var iFramePageTemplateDiskLocation = "C:\\GitWebStorm\\Firecrow\\phantomJs\\helperPages\\pageModelerHelperTemplate.html";
var iFramePageDiskLocation = "C:\\GitWebStorm\\Firecrow\\phantomJs\\helperPages\\pageModelerHelper.html";
var iFramePageUrl = "http://localhost/Firecrow/phantomJs/helperPages/pageModelerHelper.html";
var modelDestinationLocation = "C:\\GitWebStorm\\Firecrow\\evaluation\\fullPages\\testApplication\\index.json";
/********************************/

console.log("Single page modeler started!");

var templateContent = fs.read(iFramePageTemplateDiskLocation);
fs.write(iFramePageDiskLocation, templateContent.replace("PAGE_SOURCE", targetPageUrl));

page.open(iFramePageUrl, function(status)
{
    page.injectJs("./evaluationHelpers/injections/getIFrameExternalSources.js");

    var externalFiles = page.evaluate(function()
    {
        return FIRECROW_EXTERNAL_SOURCES;
    });

    var pageJSON = page.evaluate(function(externalFiles)
    {
        var processedStyleSheets = 0;

        function getSimplifiedElement(rootElement)
        {
            var elem = { type: rootElement.nodeType != 3 ? rootElement.localName : "textNode" };

            var attributes = getAttributes(rootElement);
            if(attributes.length != 0) { elem.attributes = attributes; }

            var childNodes = getChildren(rootElement)
            if(childNodes.length != 0) { elem.childNodes = childNodes; }

            if(rootElement.tagName == "SCRIPT" || rootElement.tagName == "STYLE" || rootElement.nodeType == 3)
            {
                elem.textContent = rootElement.textContent;

                if(rootElement.src != null)
                {
                    elem.textContent = externalFiles[rootElement.src];
                }
            }

            if(rootElement.tagName == "STYLE" || (rootElement.tagName == "LINK" && rootElement.rel != null && rootElement.rel.toLowerCase() == "stylesheet"))
            {
                var iFrame = document.querySelector("iframe");
                var styleSheet = iFrame.contentDocument.styleSheets[processedStyleSheets];
                if(styleSheet.rules != null)
                {
                    var path = styleSheet.href != null ? styleSheet.href : document.baseURI;
                    var model = { rules: [] };

                    fillStyleSheetModel(model, styleSheet, path);
                    elem.pathAndModel = { path: path, model: model};
                }

                processedStyleSheets++;
            }

            return elem;
        };

        function fillStyleSheetModel(model, styleSheet, path)
        {
            if(styleSheet == null) { return model; }

            var cssRules = styleSheet.cssRules;

            for(var i = 0; i < cssRules.length; i++)
            {
                var cssRule = cssRules[i];

                if(cssRule.type == 3)//import command
                {
                    fillStyleSheetModel(model, cssRule.styleSheet, cssRule.href)
                }
                else
                {
                    var result = getStyleDeclarationsAndUpdatedCssText(cssRule, path);

                    model.rules.push({
                        selector: cssRule.selectorText,
                        cssText: result.cssText,
                        declarations: result.declarations
                    });
                }
            }
        }

        function getStyleDeclarationsAndUpdatedCssText(cssRule, path)
        {
            var result = { declarations: [], cssText: cssRule.cssText };

            if(cssRule == null || cssRule.style == null || cssRule.type != 1) { return result;}

            var style = cssRule.style;

            for(var i = 0; i < style.length; i++)
            {
                var key = style[i].toLowerCase();

                var value = style.getPropertyValue(key);

                result.declarations[key] = value;
            }

            return result;
        }

        function getAttributes(element)
        {
            var attributes = [];

            if(element.attributes == null) { return attributes; }

            for(var i = 0; i < element.attributes.length; i++)
            {
                var currentAttribute = element.attributes[i];
                attributes.push
                ({
                    name: currentAttribute.name,
                    value: currentAttribute.value
                });
            }

            return attributes;
        }

        function getChildren(rootElement)
        {
            var allNodes = [];
            if(rootElement.childNodes == null) { return allNodes;}

            for(var i = 0; i < rootElement.childNodes.length;i++)
            {
                var simplifiedNode = getSimplifiedElement(rootElement.childNodes[i]);
                if(simplifiedNode != null)
                {
                    allNodes.push(simplifiedNode);
                }
            }

            return allNodes;
        }

        var iFrame = document.querySelector("iframe");
        return JSON.stringify(getSimplifiedElement(iFrame.contentDocument.documentElement));
    }, externalFiles);

    fs.write(modelDestinationLocation, pageJSON);

    phantom.exit();
});