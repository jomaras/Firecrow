var path = require('path');

var ASTHelper = require(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/ASTHelper.js")).ASTHelper;
var CssSelectorParser = require(path.resolve(__dirname, "../../chrome/content/Firecrow/parsers/CssSelectorParser.js")).CssSelectorParser;
var ValueTypeHelper = require(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/valueTypeHelper.js")).ValueTypeHelper;
var ConflictFixer = require(path.resolve(__dirname, "ConflictFixer.js")).ConflictFixer;
var CodeTextGenerator = require(path.resolve(__dirname, "../../chrome/content/Firecrow/codeMarkupGenerator/codeTextGenerator.js")).CodeTextGenerator;

var Reuser =
{
    getMergedModel: function(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary)
    {
        ConflictFixer.fixConflicts(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary);

        var mergedModel = this._createMergedModelWithDocType(pageAModel, pageBModel);

        var mergedHtmlElement = this._cloneShallowMarkConflicts(pageBModel.htmlElement, pageAModel.htmlElement);

        mergedModel.htmlElement = mergedHtmlElement;
        mergedModel.childNodes = [mergedHtmlElement];

        var pageAHeadNode = this._getHeadElement(pageAModel);
        var pageBHeadNode = this._getHeadElement(pageBModel);

        var mergedHeadNode = this._cloneShallowMarkConflicts(pageBHeadNode, pageAHeadNode);
        mergedHtmlElement.childNodes.push(mergedHeadNode);

        this._createChildren(mergedHeadNode, pageBHeadNode);
        this._createChildren(mergedHeadNode, pageAHeadNode, "r");

        var pageABodyNode = this._getBodyElement(pageAModel);
        var pageBBodyNode = this._getBodyElement(pageBModel);

        var mergedBodyNode = this._cloneShallowMarkConflicts(pageBBodyNode, pageABodyNode);
        mergedHtmlElement.childNodes.push(mergedBodyNode);

        this._createChildren(mergedBodyNode, pageBBodyNode, null);
        this._createChildren(mergedBodyNode, pageABodyNode, "r");

        if(!this._areSelectorsSupported(pageAModel.trackedElementsSelectors.concat(pageBModel.reuseIntoDestinationSelectors)))
        {
            console.warn("Used selectors are not supported in Reuser - only simple selectors by class and id!");
        }

        this._moveNodesTo(mergedModel, pageAModel.trackedElementsSelectors, pageBModel.reuseIntoDestinationSelectors);

        ASTHelper.setParentsChildRelationships(mergedModel);

        return mergedModel;
    },

    _moveNodesTo: function(mergedModel, reuseSelectors, reuseIntoDestinationSelectors)
    {
        var nodesToMove = this._getNodesBySelectors(mergedModel, reuseSelectors);
        var newParents = this._getNodesBySelectors(mergedModel, reuseIntoDestinationSelectors);

        if(nodesToMove == null || nodesToMove.length == 0) { return; }
        if(newParents == null || newParents.length == 0) { debugger; console.log("A node should be moved!"); return; }

        var newParent = newParents[0];

        for(var i = 0; i < nodesToMove.length; i++)
        {
            var node = nodesToMove[i];

            if(node.parent == newParent) { continue; }

            ValueTypeHelper.removeFromArrayByElement(node.parent.childNodes, node);

            newParent.childNodes.push(node);
            node.parent = newParent;
        }
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

    _areSelectorsSupported: function(selectors)
    {
        if(selectors == null || selectors.length == 0) { return true; }

        for(var i = 0; i < selectors.length; i++)
        {
            if(!this._isSelectorSupported(selectors[i]))
            {
                return false;
            }
        }

        return true;
    },

    _isSelectorSupported: function(selector)
    {
        if(selector == null || selector == "") { return false; }

        //TODO - currently supports only select by class and by ID
        return selector.match(/(\.|#)?([0-9]?)([a-z|A-Z])+/) != null;
    },

    _createMergedModelWithDocType: function(pageAModel, pageBModel)
    {
        var mergedModel = { docType: pageBModel.docType };

        if(pageBModel.docType != pageAModel.docType)
        {
            mergedModel.conflicts = [{ type: "DocTypeConflict", value: pageAModel.docType}];
        }

        return mergedModel;
    },

    _getHeadElement: function(model)
    {
        if(model == null) { return null; }
        if(model.htmlElement == null) { return null; }

        var children = model.htmlElement.childNodes;

        for(var i = 0; i < children.length; i++)
        {
            if(children[i].type === "head")
            {
                return children[i];
            }
        }

        return null;
    },

    _getBodyElement: function(model)
    {
        if(model == null) { return null; }
        if(model.htmlElement == null) { return null; }

        var children = model.htmlElement.childNodes;

        for(var i = 0; i < children.length; i++)
        {
            if(children[i].type === "body")
            {
                return children[i];
            }
        }

        return null;
    },

    _createChildren: function(mergedNode, originalNode, origin)
    {
        if(mergedNode == null || originalNode == null || originalNode.childNodes == null || originalNode.childNodes.length == 0) { return; }

        for(var i = 0; i < originalNode.childNodes.length; i++)
        {
            var child = originalNode.childNodes[i];

            if(origin == "r" && (child.type == "title" || !child.shouldBeIncluded)) { continue; }

            var mergedChild = this._cloneShallow(child);
            mergedChild.parent = mergedNode;

            if(origin != null && mergedChild.attributes != null && mergedChild.type != "textNode")
            {
                mergedChild.attributes.push({name:"o", value: origin});
            }

            mergedNode.childNodes.push(mergedChild);

            if(mergedChild.type == "script" || mergedChild.type == "style" || mergedChild.type == "link")
            {
                this._createChildrenForNonHtmlContent(mergedChild, child, origin);
            }
            else
            {
                this._createChildren(mergedChild, child, origin);
            }
        }
    },

    _createChildrenForNonHtmlContent: function(mergedNode, originalNode, origin)
    {
        if(mergedNode == null || originalNode == null) { return; }

        if(originalNode.pathAndModel != null)
        {
            mergedNode.pathAndModel =
            {
                path: originalNode.pathAndModel.path,
                model: this._createCodeModel(originalNode.pathAndModel.model, origin)
            }

            mergedNode.cssRules = mergedNode.pathAndModel.model.rules;
        }

        if(originalNode.sourceCode != null)
        {
            mergedNode.sourceCode = originalNode.sourceCode;
        }
    },

    _createCodeModel: function(originalModel, origin)
    {
        if(originalModel == null) { return null; }

        if(originalModel.rules != null)
        {
            return this._createCssCodeModel(originalModel, origin);
        }
        else if (originalModel.type == "Program")
        {
            return this._createProgramModel(originalModel, origin);
        }
        else
        {
            console.log("Unknown code model!");
        }
    },

    _createCssCodeModel: function(originalModel, origin)
    {
        if(originalModel == null || originalModel.rules == null) { return null; }

        var shouldSlice = origin == "r";

        var mergedRules = [];
        var rules = originalModel.rules;

        for(var i = 0; i < rules.length; i++)
        {
            var rule = rules[i];

            if(!shouldSlice || rule.shouldBeIncluded)
            {
                mergedRules.push(rule);
            }
        }

        return { rules: mergedRules };
    },

    _createProgramModel: function(originalModel, origin)
    {
        if(originalModel == null || originalModel.type != "Program") { return null; }

        return ASTHelper.createCopy(originalModel, origin == "r");
    },

    _cloneShallowMarkConflicts: function(node, conflictedNode)
    {
        var clonedNode = this._cloneShallow(node);

        if(clonedNode == null) { return null; }

        for(var i = 0; i < clonedNode.attributes.length; i++)
        {
            var attribute = clonedNode.attributes[i];

            var conflictedAttribute = this._getAttribute(conflictedNode, attribute.name);

            if(conflictedAttribute != null)
            {
                if(clonedNode.conflicts == null) { clonedNode.conflicts = []; }

                clonedNode.conflicts.push({type:"AttributeConflict", name: conflictedAttribute.name, value: conflictedAttribute.value });
            }
        }

        return clonedNode;
    },

    _cloneShallow: function(node)
    {
        if(node == null) { return null;}

        var clonedNode = {};

        clonedNode.type = node.type;
        clonedNode.attributes = [];

        for(var i = 0; i < node.attributes.length; i++)
        {
            var attribute = node.attributes[i];
            clonedNode.attributes.push({name: attribute.name, value: attribute.value});
        }

        if(node.textContent != null) { clonedNode.textContent = node.textContent; }

        clonedNode.childNodes = [];

        return clonedNode;
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

exports.Reuser = Reuser;