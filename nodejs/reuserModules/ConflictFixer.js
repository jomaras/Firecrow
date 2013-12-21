var path = require('path');

var HtmlConflictFixer = require(path.resolve(__dirname, "HtmlConflictFixer.js")).HtmlConflictFixer;
var CssConflictFixer = require(path.resolve(__dirname, "CssConflictFixer.js")).CssConflictFixer;
var JsConflictFixer = require(path.resolve(__dirname, "JsConflictFixer.js")).JsConflictFixer;
var ResourceConflictFixer = require(path.resolve(__dirname, "ResourceConflictFixer.js")).ResourceConflictFixer;

var ConflictFixer =
{
    fixConflicts: function(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary)
    {
        HtmlConflictFixer.fixHtmlConflicts(pageAModel, pageBModel, pageAExecutionSummary);
        ResourceConflictFixer.fixResourceConflicts(pageAModel, pageAExecutionSummary);
        CssConflictFixer.fixCssConflicts(pageAModel, pageBModel);
        JsConflictFixer.fixJsConflicts(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary);
    }
};

exports.ConflictFixer = ConflictFixer;
