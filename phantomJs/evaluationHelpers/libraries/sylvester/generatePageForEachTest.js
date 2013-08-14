var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var esprima = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\esprima");
var escodegen = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\escodegen");

page.onConsoleMessage = function(msg) { system.stderr.writeLine('console: ' + msg); };
page.onAlert = function(msg) { console.log('ALERT: ' + msg); };

//http://localhost/Firecrow/evaluation/libraries/sylvester/test/specs/line_segment_spec.js

var url = "http://localhost/Firecrow/phantomJs/evaluationHelpers/helperPages/createJavaScriptModel.html";
url += "?url=http://localhost/Firecrow/evaluation/libraries/sylvester/test/specs/matrix_spec.js";

var EsprimaHelper = {

    getTestDescriptionName: function(sourceAST)
    {
        return sourceAST.body[0].expression.right.arguments[0].value
    },

    getTestDescriptionExpressions: function(sourceAST)
    {
        return sourceAST.body[0].expression.right.arguments[1].body.body[0].body.body;
    },

    getBeforeCallExpressionStatements: function(sourceAST)
    {
        return this.getTestDescriptionExpressions(sourceAST).filter(function(testDescriptionExpression)
        {
            return testDescriptionExpression.expression.callee.name == "before";
        });
    },

    getBeforeBodyStatements: function(sourceAST)
    {
        var beforeCallExpressions = this.getBeforeCallExpressionStatements(sourceAST);

        var statements = [];

        beforeCallExpressions.forEach(function(callExpressionStatement)
        {
            statements = statements.concat(callExpressionStatement.expression.arguments[0].body.body[0].body.body);
        }, this);

        return statements;
    },

    getTestCallExpressionStatements: function(sourceAST)
    {
        return this.getTestDescriptionExpressions(sourceAST).filter(function(testDescriptionExpression)
        {
            return testDescriptionExpression.expression.callee.name == "test";
        });
    },

    getTestName: function(testCallStatement)
    {
        return testCallStatement.expression.arguments[0].value;
    },

    getTestStatements: function(testCallStatement)
    {
        return testCallStatement.expression.arguments[1].body.body[0].body.body;
    },

    getCode: function(statements)
    {
        var code = "";

        statements.forEach(function(statement)
        {
            try
            {
                var statementCode = escodegen.generate(statement);

                if(statementCode.indexOf("assertMatch") != -1)
                {
                    console.log(JSON.stringify(statement));
                }

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
             + "        <script src='http://localhost/Firecrow/evaluation/libraries/sylvester/sylvester.src.js'></script>\n"
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

        var testStatements = EsprimaHelper.getTestCallExpressionStatements(sourceAST);
        var suiteName = EsprimaHelper.getTestDescriptionName(sourceAST);

        var beforeCode = EsprimaHelper.getCode(EsprimaHelper.getBeforeBodyStatements(sourceAST));

        testStatements.forEach(function(testStatement)
        {
            var testName = EsprimaHelper.getTestName(testStatement);
            var testCode = beforeCode + EsprimaHelper.getCode(EsprimaHelper.getTestStatements(testStatement));

            saveTestCode("C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\sylvester\\adjusted", suiteName, testName, testCode);
        });

        phantom.exit();
    }
});