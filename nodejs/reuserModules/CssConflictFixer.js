var path = require('path');

var ValueTypeHelper = require(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/valueTypeHelper.js")).ValueTypeHelper;
var ASTHelper = require(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/ASTHelper.js")).ASTHelper;
var CssSelectorParser = require(path.resolve(__dirname, "../../chrome/content/Firecrow/parsers/CssSelectorParser.js")).CssSelectorParser;

var ConflictFixerCommon = require(path.resolve(__dirname, "ConflictFixerCommon.js")).ConflictFixerCommon;

var Changes = { html: 0, js: 0, cssA: 0, cssB: 0};

var CssConflictFixer =
{
    fixCssConflicts: function(pageAModel, pageBModel)
    {
        this._migrateNonMovableNodeAttributes(pageAModel.cssNodes, pageAModel.trackedElementsSelectors, pageAModel);

        this._expandAllSelectors(pageAModel.cssNodes, "r");
        this._expandAllSelectors(pageBModel.cssNodes, null);

        return Changes;
    },

    _migrateNonMovableNodeAttributes: function(cssNodes, selectors, appModel)
    {
        var nonMovableCssSelectorNodes = this._getNonMovableTypesCssNodes(cssNodes);
        var selectedNodes = ConflictFixerCommon.getNodesBySelectors(appModel.htmlElement, selectors);

        for(var i = 0; i < nonMovableCssSelectorNodes.length; i++)
        {
            var cssSelectorNode = nonMovableCssSelectorNodes[i];
            var cssProperties = CssSelectorParser.getCssProperties(cssSelectorNode.cssText);

            for(var j = 0; j < selectedNodes.length; j++)
            {
                var selectedHtmlNode = selectedNodes[j];

                var styleAttribute = ConflictFixerCommon.getAttribute(selectedHtmlNode, "style");

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
                    ASTHelper.removeFromParent(cssSelectorNode);
                }
                else
                {
                    if(processedSelector.indexOf("html") != -1)
                    {
                        ConflictFixerCommon.replaceSelectorInCssNode(cssSelectorNode, "html", "");
                    }
                    else if(processedSelector.indexOf("body") != -1)
                    {
                        ConflictFixerCommon.replaceSelectorInCssNode(cssSelectorNode, "body", "");
                    }
                }
            }
        }
    },

    _expandAllSelectors: function(cssNodes, origin)
    {
        var attributeSelector = origin == "r" ? ConflictFixerCommon.generateReuseAttributeSelector()
                                              : ConflictFixerCommon.generateOriginalAttributeSelector();

        for(var i = 0; i < cssNodes.length; i++)
        {
            var cssNode = cssNodes[i];

            var simpleSelectors = CssSelectorParser.getSimpleSelectors(cssNode.selector);
            var updatedSelectors = [];
            var newSelectorValue = "";
            var hasTypeSelectorBeenModified = false;

            for(var j = 0; j < simpleSelectors.length; j++)
            {
                var simpleSelector = simpleSelectors[j];
                var cleansedSelector = simpleSelector.trim();

                if(updatedSelectors.length != 0) { newSelectorValue += ", "; }

                if(cleansedSelector == "body" || cleansedSelector == "html"
                || CssSelectorParser.isIdSelector(cleansedSelector) || CssSelectorParser.isClassSelector(cleansedSelector))
                {
                    updatedSelectors.push(cleansedSelector);
                    newSelectorValue += cleansedSelector;
                    continue;
                }

                //Type only selectors arrive here
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

                hasTypeSelectorBeenModified = true;
            }

            if(newSelectorValue.trim() == "") { continue; }

            cssNode.selector = newSelectorValue;

            if(hasTypeSelectorBeenModified && cssNode.shouldBeIncluded)
            {
                origin == "r" ? Changes.cssA++
                              : Changes.cssB++;
            }

            cssNode.cssText = cssNode.cssText.replace(ConflictFixerCommon.getSelectorPartFromCssText(cssNode.cssText), cssNode.selector + "{ ");
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
    }
};

exports.CssConflictFixer = CssConflictFixer;
