var path = require('path');

var ValueTypeHelper = require(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/valueTypeHelper.js")).ValueTypeHelper;
var ASTHelper = require(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/ASTHelper.js")).ASTHelper;
var CssSelectorParser = require(path.resolve(__dirname, "../../chrome/content/Firecrow/parsers/CssSelectorParser.js")).CssSelectorParser;

var ConflictFixer =
{
    replacementsMap: {},

    fixConflicts: function(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary)
    {
        this._fixHtmlConflicts(pageAModel, pageBModel, pageAExecutionSummary);
        this._fixResourceConflicts(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary);
        this._fixJsConflicts(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary);
        this._fixCssConflicts(pageAModel, pageBModel);
    },

    _fixHtmlConflicts: function(pageAModel, pageBModel, pageAExecutionSummary)
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

                this._replaceSelectorInCssNode(cssNode, change.oldValue, change.newValue);
            }

            this._fixDynamicallySetAttributes(change);
            this._fixHtmlAttributeConflictsDomQueries(change, pageAExecutionSummary);
        }
    },

    _fixResourceConflicts: function(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary)
    {

    },

    _fixJsConflicts: function(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary)
    {

    },

    _fixCssConflicts: function(pageAModel, pageBModel)
    {
        this._migrateNonMovableNodeAttributes(pageAModel.cssNodes, pageAModel.trackedElementsSelectors, pageAModel);

        this._expandAllSelectors(pageAModel.cssNodes, "r");
        this._expandAllSelectors(pageBModel.cssNodes, null);
    },

    _expandAllSelectors: function(cssNodes, origin)
    {
        var attributeSelector = origin == "r" ? this.generateReuseAttributeSelector()
                                              : this.generateOriginalAttributeSelector();

        for(var i = 0; i < cssNodes.length; i++)
        {
            var cssNode = cssNodes[i];

            var simpleSelectors = this._getSimpleSelectors(cssNode);
            var updatedSelectors = [];
            var newSelectorValue = "";

            for(var j = 0; j < simpleSelectors.length; j++)
            {
                var simpleSelector = simpleSelectors[j];
                var cleansedSelector = simpleSelector.trim();

                if(updatedSelectors.length != 0) { newSelectorValue += ", "; }

                if(cleansedSelector == "body" || cleansedSelector == "html")
                {
                    updatedSelectors.push(cleansedSelector);
                    newSelectorValue += cleansedSelector;
                    continue;
                }

                if(CssSelectorParser.endsWithPseudoSelector(cleansedSelector))
                {
                    var modifiedSelector = CssSelectorParser.appendBeforeLastPseudoSelector(cleansedSelector, attributeSelector);
                    updatedSelectors.push(modifiedSelector);
                    newSelectorValue += modifiedSelector;
                }
                else
                {
                    updatedSelectors.push(cleansedSelector + attributeSelector);
                    newSelectorValue += cleansedSelector + attributeSelector;
                }
            }

            if(newSelectorValue.trim() == "") { continue; }

            cssNode.selector = newSelectorValue;

            if(cssNode.selector.trim() == "[o=r], body") { debugger; }
            cssNode.cssText = cssNode.cssText.replace(this._getSelectorPartFromCssText(cssNode.cssText), cssNode.selector + "{ ");
        }
    },

    _getSimpleSelectors: function(cssNode)
    {
        if(cssNode == null || cssNode.selector == null) { return []; }

        return cssNode.selector.split(",");
    },

    _migrateNonMovableNodeAttributes: function(cssNodes, selectors, appModel)
    {
        var nonMovableCssSelectorNodes = this._getNonMovableTypesCssNodes(cssNodes);
        var selectedNodes = this._getNodesBySelectors(appModel.htmlElement, selectors);

        for(var i = 0; i < nonMovableCssSelectorNodes.length; i++)
        {
            var cssSelectorNode = nonMovableCssSelectorNodes[i];
            var cssProperties = this._getCssPropertiesFromCssNode(cssSelectorNode);

            for(var j = 0; j < selectedNodes.length; j++)
            {
                var selectedHtmlNode = selectedNodes[j];

                var styleAttribute = this._getAttribute(selectedHtmlNode, "style");

                if(styleAttribute == null)
                {
                    selectedHtmlNode.attributes.push
                    ({
                        name:"style",
                        value: cssProperties
                    });
                }
                else
                {
                    styleAttribute.value += " " + cssProperties;
                }

                var processedSelector = cssSelectorNode.selector.trim();

                if(processedSelector == "html" || processedSelector == "body")
                {
                    this._removeFromParent(cssSelectorNode);
                }
                else
                {
                    if(processedSelector.indexOf("html") != -1)
                    {
                        this._replaceSelectorInCssNode(cssSelectorNode, "html", "");
                    }
                    else if(processedSelector.indexOf("body") != -1)
                    {
                        this._replaceSelectorInCssNode(cssSelectorNode, "body", "");
                    }
                }
            }
        }
    },

    _getNonMovableTypesCssNodes: function(cssNodes)
    {
        var nonMovableSelectorNodes = [];

        for(var i = 0; i < cssNodes.length; i++)
        {
            var cssNode = cssNodes[i];

            if(this._containsNonMovableTypeSelector(cssNode.selector))
            {
                nonMovableSelectorNodes.push(cssNode);
            }
        }

        return nonMovableSelectorNodes;
    },

    _containsNonMovableTypeSelector: function(selector)
    {
        if(selector == null || selector == "") { return false; }

        var simpleSelectors = selector.split(",");

        for(var i = 0; i < simpleSelectors.length; i++)
        {
            var simpleSelector = simpleSelectors[i].trim();

            if(simpleSelector == "body" || simpleSelector == "html")
            {
                return true;
            }
        }

        return false;
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

    _aggregateConflictChanges: function(changes, conflictingAttributes, reuseSelectors)
    {
        if(changes == null || conflictingAttributes == null || conflictingAttributes.length == 0) { return; }

        for(var i = 0; i < conflictingAttributes.length; i++)
        {
            var conflictingAttribute = conflictingAttributes[i];

            var change = { oldValue:conflictingAttribute.value, newValue: this.generateReusePrefix() + conflictingAttribute.value, setConstruct: conflictingAttribute.setConstruct};
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

    _fixDynamicallySetAttributes: function(change)
    {
        if(change.setConstruct != null)
        {
            if(ASTHelper.isAssignmentExpression(change.setConstruct))
            {
                this._replaceLiteralOrDirectIdentifierValue(change, change.setConstruct.right);
                return;
            }

            this._addCommentToParentStatement(change.setConstruct, "Firecrow - Could not rename: " + change.oldValue + " -> " + change.newValue);
        }
    },

    _replaceLiteralOrDirectIdentifierValue: function(change, codeConstruct)
    {
        var renameMessage = "Firecrow - Rename:" + change.oldValue + " -> " + change.newValue;
        this.replacementsMap[change.oldValue] = change.newValue;

        if(ASTHelper.isLiteral(codeConstruct))
        {
            codeConstruct.value = codeConstruct.value.replace(change.oldValue, change.newValue);
            this._addCommentToParentStatement(codeConstruct, renameMessage);
            return;
        }
        else if (ASTHelper.isIdentifier(codeConstruct))
        {
            var identifierDeclarator = ASTHelper.getDeclarator(codeConstruct);

            if(identifierDeclarator != null && ASTHelper.isLiteral(identifierDeclarator.init))
            {
                identifierDeclarator.init.value = identifierDeclarator.init.value.replace(change.oldValue, change.newValue);
                this._addCommentToParentStatement(identifierDeclarator, renameMessage);
                return;
            }

            //Declarator was not find, maybe it's a literal sent as an argument to a call expression
            var identifierSource = ASTHelper.getValueLiteral(codeConstruct);

            if(identifierSource != null && identifierSource.value.indexOf(change.oldValue) != -1)
            {
                identifierSource.value = this._getReplacedCssSelector(identifierSource.value, change.oldValue, change.newValue);
                this._addCommentToParentStatement(identifierSource, renameMessage);
                return;
            }
        }
        else if(ASTHelper.isMemberExpression(codeConstruct))
        {
            if(codeConstruct.property != null)
            {
                var dependencies = codeConstruct.property.dataDependencies;
                var hasReplaced = false;

                for(var i = 0; i < dependencies.length; i++)
                {
                    var dependency = dependencies[i];

                    if(ASTHelper.isLiteral(dependency.destinationNode))
                    {
                        dependency.destinationNode.value = dependency.destinationNode.value.replace(change.oldValue, change.newValue);
                        this._addCommentToParentStatement(dependency.destinationNode, renameMessage);
                        hasReplaced = true;
                    }
                }

                if(hasReplaced) { return; }
            }
        }

        this._addCommentToParentStatement(codeConstruct, "Could not rename");
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
                    this._replaceLiteralOrDirectIdentifierValue(change, callExpressionFirstArgument);
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

    generateReusePrefix: function()
    {
        return "_RU_";
    },

    generateOriginalAttributeSelector: function()
    {
        return ":not([o=r])";
    },

    generateReuseAttributeSelector: function()
    {
        return "[o=r]";
    },

    _getClassesAndIdsWithEqualValue: function(pageANode, pageBNode)
    {
        if(pageANode == null || pageBNode == null) { return []; }

        var pageAAttributes = (pageANode.attributes || []) //.concat(ValueTypeHelper.convertObjectMapToArray(pageANode.dynamicClasses)).concat(ValueTypeHelper.convertObjectMapToArray(pageANode.dynamicIds));
        var pageBAttributes = (pageBNode.attributes || []) //.concat(ValueTypeHelper.convertObjectMapToArray(pageBNode.dynamicClasses)).concat(ValueTypeHelper.convertObjectMapToArray(pageBNode.dynamicIds));

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

                if(pageAAttribute.value == pageBAttribute.value)
                {
                    var uniqueName = pageAAttribute.name + pageAAttribute.value;
                    uniqueName += pageAAttribute.setConstruct != null ? pageAAttribute.setConstruct.nodeId : "";
                    matchingAttributes[uniqueName] = pageAAttribute;
                }
            }
        }

        return ValueTypeHelper.convertObjectMapToArray(matchingAttributes);
    },

    _replaceSelectorInCssNode: function(cssNode, oldValue, newValue)
    {
        var oldSelectorValue = cssNode.selector;

        if(oldSelectorValue == null) { return; }

        this.replacementsMap[oldValue] = newValue;

        var replacedCssSelector = this._getReplacedCssSelector(oldSelectorValue, oldValue, newValue);

        cssNode.selector = replacedCssSelector;
        cssNode.cssText = cssNode.cssText.replace(this._getSelectorPartFromCssText(cssNode.cssText), replacedCssSelector + "{ ");
    },

    _getReplacedCssSelector: function(selector, oldValue, newValue)
    {
        var simpleSelectors = selector.split(",");

        if(CssSelectorParser.isIdSelector(oldValue) || CssSelectorParser.isClassSelector(oldValue)) { oldValue = oldValue.substring(1, oldValue.length); }
        if(CssSelectorParser.isIdSelector(newValue) || CssSelectorParser.isClassSelector(newValue)) { newValue = newValue.substring(1, newValue.length); }

        for(var i = 0; i < simpleSelectors.length; i++)
        {
            var trimmed = simpleSelectors[i].trim();
            var cssPrimitives = CssSelectorParser.getCssPrimitives(trimmed);

            var joined = "";
            for(var j = 0; j < cssPrimitives.length; j++)
            {
                var cssPrimitive = cssPrimitives[j];

                if(!cssPrimitive.isSeparator && cssPrimitive.value.trim() == oldValue)
                {
                    cssPrimitive.value = newValue;
                }

                joined += cssPrimitive.value;
            }

            simpleSelectors[i] = joined;
        }

        var nonNullSelectors = [];
        var joined = "";

        for(var i = 0; i < simpleSelectors.length;i++)
        {
            var simpleSelector = simpleSelectors[i];

            if(nonNullSelectors.length != 0) { joined += ","; }

            if(simpleSelector != null && simpleSelector != "")
            {
                nonNullSelectors.push(simpleSelector);
                joined += simpleSelector;
            }
        }

        return joined;
    },

    _getSelectorPartFromCssText: function(cssText)
    {
        var parenthesisIndex = cssText.indexOf("{");

        if(parenthesisIndex != -1)
        {
            return cssText.substring(0, parenthesisIndex + 1);
        }

        console.log("There is no parenthesis in css rule!");

        return "";
    },

    _getNodesBySelectors: function(node, selectors)
    {
        if(node == null || node.childNodes == null || node.childNodes.length == 0) { return []; }

        var resultingNodes = [];

        for(var i = 0; i < node.childNodes.length; i++)
        {
            var child = node.childNodes[i];
            var lowerType = child.type.toLowerCase();

            if(lowerType == "textnode" || child.type == "meta" || child.type == "script") { continue; }

            if(this._matchesSelectors(child, selectors))
            {
                resultingNodes.push(child);
            }

            ValueTypeHelper.pushAll(resultingNodes, this._getNodesBySelectors(child, selectors));
        }

        return resultingNodes;
    },

    _matchesSelectors: function(node, selectors)
    {
        if(node == null || selectors == null || selectors.length == 0) { return false; }

        for(var i = 0; i < selectors.length; i++)
        {
            if(this._matchesSelector(node, selectors[i]))
            {
                return true;
            }
        }

        return false;
    },

    _matchesSelector: function(node, selector)
    {
        if(node == null || selector == null) { return false; }

        //TODO - make bulletproof; should break classes into sections...
        if(CssSelectorParser.isClassSelector(selector))
        {
            var classAttr = this._getAttribute(node, "class");

            if(classAttr == null || classAttr.value == "") { return false; }

            return classAttr.value.split(/(\s)+/).indexOf(selector.substring(1)) != -1;
        }
        else if (CssSelectorParser.isIdSelector(selector))
        {
            var idAttr = this._getAttribute(node, "id");

            if(idAttr == null) { return false; }

            return idAttr.value == selector.substring(1);
        }
        else
        {
            return node.type == selector;
        }
    },

    _getAttribute: function(node, attributeName)
    {
        if(node == null || node.attributes == null || node.attributes.length == 0 || attributeName == null || attributeName == "") { return null; }

        for(var i = 0; i < node.attributes.length; i++)
        {
            var attribute = node.attributes[i];

            if(attribute.name == attributeName) { return attribute; }
        }

        return null;
    }
};

exports.ConflictFixer = ConflictFixer;
