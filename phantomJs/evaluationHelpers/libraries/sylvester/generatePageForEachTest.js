var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var esprima = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\esprima");
var escodegen = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\escodegen");

page.onConsoleMessage = function(msg) { system.stderr.writeLine('console: ' + msg); };
page.onAlert = function(msg) { console.log('ALERT: ' + msg); };

VARIABLE_INDEX = 0;

//http://localhost/Firecrow/evaluation/libraries/sylvester/test/specs/line_segment_spec.js

var url = "http://localhost/Firecrow/phantomJs/evaluationHelpers/createJavaScriptModel.html";
url += "?url=http://localhost/Firecrow/evaluation/libraries/sylvester/test/specs/line_segment_spec.js";

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

    convertTestStatements: function(testCallStatement)
    {
        var originalTestStatements = this.getTestStatements(testCallStatement);

        return originalTestStatements.map(function(originalTestStatement)
        {
            var converted = this.convertOriginalTestStatement(originalTestStatement);

            if(converted == null) debugger;

            return converted;
        }, this);
    },

    convertOriginalTestStatement: function(originalTestStatement)
    {
        var callExpression = originalTestStatement.expression;

        if(callExpression == null || callExpression.callee == null) { return originalTestStatement; }

        if(callExpression.callee.name == "assert")
        {
            return this.convertAssert(originalTestStatement, VARIABLE_INDEX++);
        }
        else if(callExpression.callee.name == "assertNull")
        {
            return this.convertAssertNull(originalTestStatement, VARIABLE_INDEX++);
        }
        else if (callExpression.callee.name == "assertEqual")
        {
            return this.convertAssertEqual(originalTestStatement, VARIABLE_INDEX++);
        }

        return originalTestStatement;
    },

    convertAssert: function(originalTestStatement, index)
    {
        var callExpression = originalTestStatement.expression;

        return {
            type: "AssignmentExpression",
            operator: "=",
            left: { type: "Identifier", name: "a" + index},
            right:
            {
                type: "BinaryExpression",
                operator: "==",
                left: callExpression.arguments[0],
                right: { type: "Literal", value: true, raw: "true" }
            }
        };
    },

    convertAssertNull: function(originalTestStatement, index)
    {
        var callExpression = originalTestStatement.expression;

        return {
            type: "AssignmentExpression",
            operator: "=",
            left: { type: "Identifier", name: "a" + index},
            right:
            {
                type: "BinaryExpression",
                operator: "==",
                left: callExpression.arguments[0],
                right: { type: "Literal", value: null, raw: "null" }
            }
        };
    },

    convertAssertEqual: function(originalTestStatement, index)
    {
        var callExpression = originalTestStatement.expression;

        return {
            type: "AssignmentExpression",
            operator: "=",
            left: { type: "Identifier", name: "a" + index},
            right:
            {
                type: "BinaryExpression",
                operator: "==",
                left: callExpression.arguments[0],
                right: callExpression.arguments[1]
            }
        };
    },

    getCode: function(statements)
    {
        var code = "";

        statements.forEach(function(statement)
        {
            try
            {
                code += escodegen.generate(statement, {format:{indent:{style: '    ', base: 1}}}) + "\n";
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
             + "        <script src='../sylvester.src.js'></script>\n"
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
            VARIABLE_INDEX = 0;

            var testName = EsprimaHelper.getTestName(testStatement);
            var testCode = beforeCode + EsprimaHelper.getCode(EsprimaHelper.convertTestStatements(testStatement)) + "\n MAX_INDEX = " + VARIABLE_INDEX + ";";


            saveTestCode("C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\sylvester\\adjusted", suiteName, testName, testCode);
        });

        phantom.exit();
    }
});