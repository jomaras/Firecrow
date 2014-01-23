var path = require('path');

var HtmlConflictFixer = require(path.resolve(__dirname, "HtmlConflictFixer.js")).HtmlConflictFixer;
var CssConflictFixer = require(path.resolve(__dirname, "CssConflictFixer.js")).CssConflictFixer;
var JsConflictFixer = require(path.resolve(__dirname, "JsConflictFixer.js")).JsConflictFixer;
var ResourceConflictFixer = require(path.resolve(__dirname, "ResourceConflictFixer.js")).ResourceConflictFixer;

var Changes = {
    "A": {
        html: 0,
        js: 0,
        css: 0
    },
    "B": {
        html: 0,
        js: 0,
        css: 0
    },
    jsF: 0
};

var ConflictFixer =
{
    fixConflicts: function(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary)
    {
        var htmlChange = HtmlConflictFixer.fixHtmlConflicts(pageAModel, pageBModel, pageAExecutionSummary);
        var resourceChange = ResourceConflictFixer.fixResourceConflicts(pageAModel, pageAExecutionSummary);
        var cssChange = CssConflictFixer.fixCssConflicts(pageAModel, pageBModel);
        var jsChange = JsConflictFixer.fixJsConflicts(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary);

        Changes.A.html += htmlChange.html;
        Changes.A.js += htmlChange.js;
        Changes.A.css += htmlChange.css;

        Changes.A.css += cssChange.cssA;
        Changes.B.css += cssChange.cssB;

        Changes.A.js += jsChange.jsA;
        Changes.B.js += jsChange.jsB;
        Changes.jsF  += jsChange.jsF;

        Changes.A.html += resourceChange.html;

        return Changes;
    }
};

exports.ConflictFixer = ConflictFixer;
