var path = require('path');
var fs = require('fs');

if(fs.existsSync(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/valueTypeHelper.js"))) //Standalone
{
    var ValueTypeHelper = require(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/valueTypeHelper.js")).ValueTypeHelper;
    var ASTHelper = require(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/ASTHelper.js")).ASTHelper;
    var CssSelectorParser = require(path.resolve(__dirname, "../../chrome/content/Firecrow/parsers/CssSelectorParser.js")).CssSelectorParser;
}
else
{
    var ValueTypeHelper = require(path.resolve(__dirname, "../valueTypeHelper.js")).ValueTypeHelper;
    var ASTHelper = require(path.resolve(__dirname, "../ASTHelper.js")).ASTHelper;
    var CssSelectorParser = require(path.resolve(__dirname, "../CssSelectorParser.js")).CssSelectorParser;
}

var ConflictFixerCommon =
{
    replacementsMap: {},

    replaceLiteralOrDirectIdentifierValue: function(change, codeConstruct)
    {
        var renameMessage = "Firecrow - Rename:" + change.oldValue + " -> " + change.newValue;
        this.replacementsMap[change.oldValue] = change.newValue;

        if(change.oldValue == "window")
        {
            debugger;
        }

        if(ASTHelper.isLiteral(codeConstruct))
        {
            codeConstruct.value = codeConstruct.value.replace(change.oldValue, change.newValue);
            this.addCommentToParentStatement(codeConstruct, renameMessage);

            return codeConstruct.shouldBeIncluded;
        }
        else if (ASTHelper.isIdentifier(codeConstruct))
        {
            var identifierDeclarator = ASTHelper.getDeclarator(codeConstruct);

            if(identifierDeclarator != null && ASTHelper.isLiteral(identifierDeclarator.init))
            {
                identifierDeclarator.init.value = identifierDeclarator.init.value.replace(change.oldValue, change.newValue);
                this.addCommentToParentStatement(identifierDeclarator, renameMessage);
                return identifierDeclarator.init.shouldBeIncluded;
            }

            //Declarator was not find, maybe it's a literal sent as an argument to a call expression
            var identifierSource = ASTHelper.getValueLiteral(codeConstruct);

            if(identifierSource != null && identifierSource.value.indexOf(change.oldValue) != -1)
            {
                identifierSource.value = this._getReplacedCssSelector(identifierSource.value, change.oldValue, change.newValue);
                this.addCommentToParentStatement(identifierSource, renameMessage);

                return identifierSource.shouldBeIncluded;
            }
        }
        else if(ASTHelper.isMemberExpression(codeConstruct))
        {
            var dependencies = codeConstruct.dependencies.concat(codeConstruct.property.dependencies);
            var hasReplaced = false;
            var replacedElement = null;

            for(var i = 0; i < dependencies.length; i++)
            {
                var dependency = dependencies[i];

                if(ASTHelper.isLiteral(dependency.destinationNode))
                {
                    dependency.destinationNode.value = dependency.destinationNode.value.replace(change.oldValue, change.newValue);
                    this.addCommentToParentStatement(dependency.destinationNode, renameMessage);

                    hasReplaced = true;
                    replacedElement = dependency.destinationNode;
                }
            }

            if(hasReplaced) { return replacedElement && replacedElement.shouldBeIncluded; }
        }

        this.addCommentToParentStatement(codeConstruct, "Could not rename");
        return false;
    },

    addCommentToParentStatement: function(codeConstruct, comment)
    {
        if(codeConstruct == null || comment == null || comment == "") { return; }

        var parentStatement = ASTHelper.getParentStatement(codeConstruct);

        if(parentStatement == null) { return; }

        if(parentStatement.comments == null) { parentStatement.comments = []; }

        if(parentStatement.comments.indexOf(comment) == -1)
        {
            parentStatement.comments.push(comment);
        }
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

    replaceSelectorInCssNode: function(cssNode, oldValue, newValue)
    {
        var oldSelectorValue = cssNode.selector;

        if(oldSelectorValue == null) { return; }

        this.replacementsMap[oldValue] = newValue;

        var replacedCssSelector = this._getReplacedCssSelector(oldSelectorValue, oldValue, newValue);

        cssNode.selector = replacedCssSelector;
        cssNode.cssText = cssNode.cssText.replace(this.getSelectorPartFromCssText(cssNode.cssText), replacedCssSelector + "{ ");
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

    getSelectorPartFromCssText: function(cssText)
    {
        var parenthesisIndex = cssText.indexOf("{");

        if(parenthesisIndex != -1)
        {
            return cssText.substring(0, parenthesisIndex + 1);
        }

        console.log("There is no parenthesis in css rule!");

        return "";
    },

    getNodesBySelectors: function(node, selectors)
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

            ValueTypeHelper.pushAll(resultingNodes, this.getNodesBySelectors(child, selectors));
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
            var classAttr = this.getAttribute(node, "class");

            if(classAttr == null || classAttr.value == "") { return false; }

            return classAttr.value.split(/(\s)+/).indexOf(selector.substring(1)) != -1;
        }
        else if (CssSelectorParser.isIdSelector(selector))
        {
            var idAttr = this.getAttribute(node, "id");

            if(idAttr == null) { return false; }

            return idAttr.value == selector.substring(1);
        }
        else
        {
            return node.type == selector;
        }
    },

    getAttribute: function(node, attributeName)
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

exports.ConflictFixerCommon = ConflictFixerCommon;
