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
url += "?url=http://localhost/Firecrow/evaluation/libraries/underscore/test/original/array.js";

var EsprimaHelper = {

    getTestSuiteName: function(sourceAST)
    {
        return sourceAST.body[0].expression.arguments[0].body.body[0].expression.arguments[0].value;
    },

    getTestName: function(testCaseStatement)
    {
        return testCaseStatement.expression.arguments[0].value;
    },

    getTestCallStatements: function(sourceAST)
    {
        return sourceAST.body[0].expression.arguments[0].body.body.slice(1);
    },

    getTestStatements: function (testCaseStatement)
    {
        return testCaseStatement.expression.arguments[1].body.body;
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
             + "        <script src='http://localhost/Firecrow/evaluation/libraries/underscore/underscore-src.js'></script>\n"
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

        var testSuiteName = EsprimaHelper.getTestSuiteName(sourceAST);
        var testCallStatements = EsprimaHelper.getTestCallStatements(sourceAST);

        testCallStatements.forEach(function (testCallStatement)
        {
            var testName = EsprimaHelper.getTestName(testCallStatement);
            var testStatements = EsprimaHelper.getTestStatements(testCallStatement);
            var testCode = EsprimaHelper.getCode(testStatements);
            testCode = testCode.replace(/equal\(/g, "assertEqual(").replace(/deepEqual\(/g, "assertEqual(").replace(/ok\(/g, "assert(");

            saveTestCode("C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\underscore\\adjusted", testSuiteName, testName, testCode);
        });

        phantom.exit();
    }
});