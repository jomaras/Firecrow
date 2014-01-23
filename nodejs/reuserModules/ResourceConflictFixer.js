var path = require('path');

var ASTHelper = require(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/ASTHelper.js")).ASTHelper;
var ConflictFixerCommon = require(path.resolve(__dirname, "ConflictFixerCommon.js")).ConflictFixerCommon;
var UriHelper = require(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/UriHelper.js")).UriHelper;

var Change = {
    html: 0,
    css: 0,
    js: 0
};

var ResourceConflictFixer =
{
    fixResourceConflicts: function(pageAModel, pageAExecutionSummary)
    {
        this._fixResourceConflictsInCss(pageAModel);
        this._fixResourceConflictsInHtml(pageAModel);
        this._fixResourceConflictsInJs(pageAModel, pageAExecutionSummary);

        return Change;
    },

    _fixResourceConflictsInCss: function(pageModel)
    {
        var cssNodes = pageModel.cssNodes;

        for(var i = 0, length = cssNodes.length; i < length; i++)
        {
            var cssNode = cssNodes[i];
            if(cssNode == null || cssNode.declarations == null) { continue; }

            var declarations = cssNode.declarations;

            this._replaceImageUrlInCss(declarations, "background");
            this._replaceImageUrlInCss(declarations, "background-image");
            this._replaceImageUrlInCss(declarations, "list-style-image");
        }
    },

    _fixResourceConflictsInHtml: function(pageModel)
    {
        var htmlNodes = pageModel.htmlNodes;

        for(var i = 0, length = htmlNodes.length; i < length; i++)
        {
            var htmlNode = htmlNodes[i];

            if(htmlNode == null || htmlNode.type != "img"){ continue; }

            htmlNode.attributes.forEach(function(attribute)
            {
                if(attribute.name == "src")
                {
                    attribute.value = this._wrapInReuseFolder(this._getRelativePath(attribute.value, pageModel.pageUrl));
                }
            }, this);
        }
    },

    _fixResourceConflictsInJs: function(pageModel, pageExecutionSummary)
    {
        var mapping = pageExecutionSummary.resourceSetterMap;

        for(var prop in mapping)
        {
            var setObject = mapping[prop];

            var change =
            {
                oldValue: setObject.resourceValue,
                newValue: this._wrapInReuseFolder(this._getRelativePath(setObject.resourceValue, pageModel.pageUrl))
            };

            if(change.oldValue != change.newValue)
            {
                if(ASTHelper.isAssignmentExpression(setObject.codeConstruct))
                {
                    ConflictFixerCommon.replaceLiteralOrDirectIdentifierValue(change, setObject.codeConstruct.right);
                    continue;
                }

                ConflictFixerCommon.addCommentToParentStatement(setObject.codeConstruct, "Firecrow - Could not rename " + change.oldValue + " -> " + change.newValue);
            }
        }
    },

    _replaceImageUrlInCss: function(cssDeclarationsObject, propertyName)
    {
        var propertyValue = cssDeclarationsObject[propertyName];

        if(propertyValue == null) { return; }

        var currentUrl = this._getPathFromCssUrl(propertyValue);

        if(currentUrl == null) { return; }

        var cssFilePath = ASTHelper.getCssFilePathFromDeclaration(cssDeclarationsObject);
        var relativePath = this._getRelativePath(currentUrl, cssFilePath);

        cssDeclarationsObject[propertyName] = propertyValue.replace(currentUrl, this._wrapInReuseFolder(relativePath));
        cssDeclarationsObject.parent.cssText = cssDeclarationsObject.parent.cssText.replace(propertyValue, "url('" + this._wrapInReuseFolder(relativePath) + "')");
    },

    _getRelativePath: function(path, basePath)
    {
        return basePath ? UriHelper.getRelativeFrom(UriHelper.getAbsoluteUrl(path, basePath), basePath)
                        : path;
    },

    _getPathFromCssUrl: function(cssUrl)
    {
        if(cssUrl == null) { return null; }

        var startRegEx = /url(\s)*\(('|")?/gi;
        var usedStartRegExQuery = cssUrl.match(startRegEx);

        if(usedStartRegExQuery == null) { return null; }

        var usedStart = usedStartRegExQuery[0];

        var startUrlIndex = cssUrl.indexOf(usedStart) + usedStart.length;

        var endUrlChar = usedStart[usedStart.length - 1] == "(" ? ")" : usedStart[usedStart.length - 1];
        var endUrlIndex = cssUrl.indexOf(endUrlChar, startUrlIndex);

        return cssUrl.substring(startUrlIndex, endUrlIndex);
    },

    _wrapInReuseFolder: function(path)
    {     //TODO
        //return "reuse/" + path;
        return path;
    }
};

exports.ResourceConflictFixer = ResourceConflictFixer;