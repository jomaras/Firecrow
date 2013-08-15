var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var esprima = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\esprima");
var escodegen = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\escodegen");

page.onConsoleMessage = function(msg) { system.stderr.writeLine('console: ' + msg); };
page.onAlert = function(msg) { console.log('ALERT: ' + msg); };

//http://localhost/Firecrow/evaluation/libraries/sylvester/test/specs/line_segment_spec.js

var url = "http://localhost/Firecrow/phantomJs/helperPages/createJavaScriptModel.html";
url += "?url=http://localhost/Firecrow/evaluation/libraries/gauss/test/toDeriveFrom/vector.js";

var EsprimaHelper = {
    getTestObjects: function(sourceModel)
    {
        return sourceModel.body[0].expression.callee.object.arguments[0].properties;
    },

    getTestName: function(testProperty)
    {
        return encodeURI(testProperty.key.value);
    },

    getTopicCode: function(testProperty)
    {
        return escodegen.generate(testProperty.value.properties[0].value);
    },

    getTopicTests: function(testProperty)
    {
        var testProperties = [];

        var properties = testProperty.value.properties;

        for(var i = 1; i < properties.length; i++)
        {
            testProperties.push(properties[i]);
        }

        return testProperties
    },

    getTestCode: function(testProperty)
    {
        return escodegen.generate(testProperty.value.body);
    },

    getCode: function(statements)
    {
        var code = "";

        statements.forEach(function(statement)
        {
            try
            {
                var statementCode = escodegen.generate(statement);

                code += statementCode + "\n";
            }
            catch(e) { debugger; }
        });

        return code;
    }
};

function saveTestCode(rootFolder, suiteName, testName, testCode)
{
    var html = "<html>\n"
             + "    <head><title>Sylvester Test: " + suiteName + "-" + testName  + "</title><meta charset='UTF-8'></head>\n"
             + "    <body>\n"
             + "        <script src='http://localhost/Firecrow/evaluation/libraries/gauss/gauss-src.js'></script>\n"
             + "        <script>\n"
             +          testCode
             + "        </script>\n"
             + "    </body>\n"
             + "</html>" ;

    var filePath = rootFolder + fs.separator + suiteName + "-" + testName + ".html";

    if(!fs.exists(rootFolder)) { fs.makeDirectory(rootFolder); }

    fs.write(filePath, html);
};

console.log("Started loading page");

page.open(encodeURI(url), function(status)
{
    if(status != "success")
    {
        console.log("Could not load page: " + url);
    }
    else
    {
        console.log("Page loaded");

        var sourceAstJson = page.evaluate(function()
        {
            return document.getElementById("astContainer").textContent;
        });

        var sourceAST = JSON.parse(sourceAstJson);

        var testProperties = EsprimaHelper.getTestObjects(sourceAST);

        var beforeCode = fs.read("C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\gauss\\test\\toDeriveFrom\\vectorSetup.js");

        testProperties.forEach(function(testProperty)
        {
            var testSuiteName = EsprimaHelper.getTestName(testProperty);
            var variableInitCode = "var topic = " + EsprimaHelper.getTopicCode(testProperty);
            var topicTests = EsprimaHelper.getTopicTests(testProperty);
            topicTests.forEach(function(topicTest)
            {
                var testName = EsprimaHelper.getTestName(topicTest);
                var testCode = variableInitCode + "\n" + EsprimaHelper.getTestCode(topicTest);

                saveTestCode("C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\gauss\\adjusted", testSuiteName, testName, beforeCode + testCode);
            });

        });

        phantom.exit();
    }
});