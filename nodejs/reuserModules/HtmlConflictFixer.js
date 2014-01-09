var path = require('path');

var ValueTypeHelper = require(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/valueTypeHelper.js")).ValueTypeHelper;
var ASTHelper = require(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/ASTHelper.js")).ASTHelper;
var ConflictFixerCommon = require(path.resolve(__dirname, "ConflictFixerCommon.js")).ConflictFixerCommon;

var HtmlConflictFixer =
{
    replacementsMap: {},

    fixHtmlConflicts: function(pageAModel, pageBModel, pageAExecutionSummary)
    {
        var changes = this._getHtmlConflictChanges(pageAModel, pageBModel, pageAModel.trackedElementsSelectors);
        var reusedCssNodes = pageAModel.cssNodes;

        for(var i = 0; i < changes.length; i++)
        {
            var change = changes[i];

            for(var j = 0; j < reusedCssNodes.length; j++)
            {
                var cssNode = reusedCssNodes[j];

                if(cssNode.selector == null || cssNode.selector.indexOf(change.oldValue) == -1) { continue; }

                ConflictFixerCommon.replaceSelectorInCssNode(cssNode, change.oldValue, change.newValue);
            }

            this._fixDynamicallySetAttributes(change);
            this._fixHtmlAttributeConflictsDomQueries(change, pageAExecutionSummary);
        }
    },

    _getHtmlConflictChanges: function(pageAModel, pageBModel, reuseSelectors)
    {
        var pageAHtmlNodes = pageAModel.htmlNodes;
        var pageBHtmlNodes = pageBModel.htmlNodes;

        var changes = {};

        for(var i = 0; i < pageAHtmlNodes.length; i++)
        {
            var pageANode = pageAHtmlNodes[i];

            for(var j = 0; j < pageBHtmlNodes.length; j++)
            {
                var pageBNode = pageBHtmlNodes[j];

                this._aggregateConflictChanges(changes, this._getClassesAndIdsWithEqualValue(pageANode, pageBNode), reuseSelectors);
            }
        }

        return ValueTypeHelper.convertObjectMapToArray(changes);
    },

    _fixDynamicallySetAttributes: function(change)
    {
        if(change.setConstruct != null)
        {
            if(ASTHelper.isAssignmentExpression(change.setConstruct))
            {
                ConflictFixerCommon.replaceLiteralOrDirectIdentifierValue(change, change.setConstruct.right);
                return;
            }

            ConflictFixerCommon.addCommentToParentStatement(change.setConstruct, "Firecrow - Could not rename: " + change.oldValue + " -> " + change.newValue);
        }
    },

    _fixHtmlAttributeConflictsDomQueries: function(change, pageAExecutionSummary)
    {
        if(change == null) { return; }
        if(pageAExecutionSummary.domQueriesMap == null) { return;}

        for(var domQueryProp in pageAExecutionSummary.domQueriesMap)
        {
            var domQuery = pageAExecutionSummary.domQueriesMap[domQueryProp];
            var callExpressionFirstArgument = ASTHelper.getFirstArgumentOfCallExpression(domQuery.codeConstruct);

            for(var selector in domQuery.selectorsMap)
            {
                if(this._containsCssFragment(selector, change.oldValue))
                {
                    ConflictFixerCommon.replaceLiteralOrDirectIdentifierValue(change, callExpressionFirstArgument);
                }
            }
        }
    },

    _containsCssFragment: function(selector, needle)
    {
        var parts = selector.split(/(\s)+|\.|#|>/gi);

        for(var i = 0; i < parts.length; i++)
        {
            if(parts[i] == needle) { return true; }
        }

        return false;
    },

    _aggregateConflictChanges: function(changes, conflictingAttributes, reuseSelectors)
    {
        if(changes == null || conflictingAttributes == null || conflictingAttributes.length == 0) { return; }

        for(var i = 0; i < conflictingAttributes.length; i++)
        {
            var conflictingAttribute = conflictingAttributes[i];

            var change = { oldValue:conflictingAttribute.value, newValue: ConflictFixerCommon.generateReusePrefix() + conflictingAttribute.value, setConstruct: conflictingAttribute.setConstruct};
            var changeId = change.oldValue + change.newValue + (conflictingAttribute.setConstruct != null ? conflictingAttribute.setConstruct.nodeId : "");

            changes[changeId] = change;

            this._handleSelectorChange(reuseSelectors, change);

            conflictingAttribute.value = change.newValue;
        }
    },

    _handleSelectorChange: function(reuseSelectors, change)
    {
        for(var i = 0; i < reuseSelectors.length; i++)
        {
            var selector = reuseSelectors[i];

            if(selector == "." + change.oldValue)
            {
                reuseSelectors[i] = "." + change.newValue;
            }
            else if(selector == "#" + change.oldValue)
            {
                reuseSelectors[i] = "#" + change.newValue;
            }
        }

        this.replacementsMap[change.oldValue] = change.newValue;
    },

    _getClassesAndIdsWithEqualValue: function(pageANode, pageBNode)
    {
        if(pageANode == null || pageBNode == null) { return []; }

        var pageAAttributes = (pageANode.attributes || []).concat(pageANode.dynamicClasses || []).concat(pageANode.dynamicIds || []);
        var pageBAttributes = (pageBNode.attributes || []).concat(pageBNode.dynamicClasses || []).concat(pageBNode.dynamicIds || []);

        if(pageAAttributes.length == 0) { return []; }
        if(pageBAttributes.length == 0) { return []; }

        var matchingAttributes = {};

        for(var i = 0; i < pageAAttributes.length; i++)
        {
            var pageAAttribute = pageAAttributes[i];

            if(pageAAttribute.name != "class" && pageAAttribute.name != "name" && pageAAttribute.name != "id") { continue; }
            if(pageAAttribute.value == "") { continue; }

            for(var j = 0; j < pageBAttributes.length; j++)
            {
                var pageBAttribute = pageBAttributes[j];

                if(pageBAttribute.name != "class" && pageBAttribute.name != "name" && pageBAttribute.name != "id") { continue; }

                if(pageAAttribute.value == pageBAttribute.value && pageAAttribute.name == pageBAttribute.name)
                {
                    var uniqueName = pageAAttribute.name + pageAAttribute.value;
                    uniqueName += pageAAttribute.setConstruct != null ? pageAAttribute.setConstruct.nodeId : "";
                    matchingAttributes[uniqueName] = pageAAttribute;
                }
            }
        }

        return ValueTypeHelper.convertObjectMapToArray(matchingAttributes);
    }
}

exports.HtmlConflictFixer = HtmlConflictFixer;