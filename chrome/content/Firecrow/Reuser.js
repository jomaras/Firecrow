/**
 * User: Jomaras
 * Date: 08.10.12.
 * Time: 10:52
 */
FBL.ns(function() { with (FBL) {
// ************************************************************************************************
Firecrow.Reuser =
{
    getMergedModel: function(reusedAppModel, reuseIntoAppModel, reuseAppGraph, reuseIntoAppGraph, reuseSelectors, reuseIntoDestinationSelectors, reuseAppBrowser, reuseIntoAppBrowser)
    {
        try
        {
            //The idea is to first merge them, and then to move the UI control to the designated place
            if(reusedAppModel == null || reuseIntoAppModel == null) { alert("Reuser - inputs can not be null"); return null; }
            if((reusedAppModel.children == null || reusedAppModel.children.length == 0) && (reuseIntoAppModel.children == null || reuseIntoAppModel.children.length == 0)) { return null; }
            if(reusedAppModel.children == null || reusedAppModel.children.length == 0) { return reuseIntoAppModel; }
            if(reuseIntoAppModel.children == null || reuseIntoAppModel.children.length == 0) { return reusedAppModel; }

            Firecrow.ConflictFixer.fixHtmlConflicts(reuseAppGraph, reuseIntoAppGraph, reuseSelectors, reuseAppBrowser);
            Firecrow.ConflictFixer.fixJsConflicts(reuseAppGraph, reuseIntoAppGraph, reuseAppBrowser, reuseIntoAppBrowser);
            var hasFixedCssConflicts = Firecrow.ConflictFixer.fixCssConflicts(reuseAppGraph, reuseIntoAppGraph);

            //The head and the body nodes will be kept, and that all other nodes will be appended
            //Elements contained in the head or body nodes of the reused app will be added after the elements from the reuseInto application
            var reuseIntoHtmlNode = reuseIntoAppModel.htmlElement;
            var reusedHtmlNode = reusedAppModel.htmlElement;

            var mergedModel = this._createMergedModelWithDocType(reusedAppModel, reuseIntoAppModel);

            var mergedHtmlElement = this._cloneShallowMarkConflicts(reuseIntoAppModel.htmlElement, reusedAppModel.htmlElement);

            mergedModel.htmlElement = mergedHtmlElement;
            mergedModel.children = [mergedHtmlElement];


            var reusedHeadNode = this._getHeadElement(reusedAppModel);
            var reuseIntoHeadNode = this._getHeadElement(reuseIntoAppModel);
            var mergedHeadNode = this._cloneShallowMarkConflicts(reuseIntoHeadNode, reusedHeadNode);
            mergedHtmlElement.children.push(mergedHeadNode);
            this._createChildren(mergedHeadNode, reuseIntoHeadNode);
            this._createChildren(mergedHeadNode, reusedHeadNode, "reuse");


            var reusedBodyNode = this._getBodyElement(reusedAppModel);
            var reuseIntoBodyNode = this._getBodyElement(reuseIntoAppModel);
            var mergedBodyNode = this._cloneShallowMarkConflicts(reuseIntoBodyNode, reusedBodyNode);
            mergedHtmlElement.children.push(mergedBodyNode);
            this._createChildren(mergedBodyNode, reuseIntoBodyNode, null, hasFixedCssConflicts);
            this._createChildren(mergedBodyNode, reusedBodyNode, "reuse", hasFixedCssConflicts);

            if(!this._areSelectorsSupported(reuseSelectors.concat(reuseIntoDestinationSelectors)))
            {
                alert("Used selectors are not supported in Reuser - only simple selectors by class and id!");
            }

            this._moveNodesTo(mergedModel, reuseSelectors, reuseIntoDestinationSelectors);

            return mergedModel;

        }catch(e) { alert("Error when creating merged model:" + e); }
    },

    _moveNodesTo: function(mergedModel, reuseSelectors, reuseIntoDestinationSelectors)
    {
        var nodesToMove = this._getNodesBySelectors(mergedModel, reuseSelectors);
        var newParents = this._getNodesBySelectors(mergedModel, reuseIntoDestinationSelectors);

        if(nodesToMove == null || nodesToMove.length == 0) { return; }
        if(newParents == null || newParents.length != 1) { alert("A node should be moved to only one parent!"); return; }

        var newParent = newParents[0];

        for(var i = 0; i < nodesToMove.length; i++)
        {
            var node = nodesToMove[i];

            if(node.parent == newParent) { continue; }

            //remove from previous position
            Firecrow.ValueTypeHelper.removeFromArrayByElement(node.parent.children, node);

            newParent.children.push(node);
            node.parent = newParent;
        }
    },

    _getNodesBySelectors: function(node, selectors)
    {
        if(node == null || node.children == null || node.children.length == 0) { return []; }

        var resultingNodes = [];

        for(var i = 0; i < node.children.length; i++)
        {
            var child = node.children[i];

            if(this._matchesSelectors(child, selectors))
            {
                resultingNodes.push(child);
            }

            Firecrow.ValueTypeHelper.pushAll(resultingNodes, this._getNodesBySelectors(child, selectors));
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
        if(this._isClassSelector(selector))
        {
            var classAttr = this._getAttribute(node, "class");

            if(classAttr == null) { return false; }

            return classAttr.value == selector.substring(1);
        }
        else if (this._isIdSelector(selector))
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

    _isClassSelector: function(selector) { return selector != null && selector.indexOf(".") == 0; },
    _isIdSelector: function(selector) { return selector != null && selector.indexOf("#") == 0; },

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

    _createChildren: function(mergedNode, originalNode, origin, hasFixedCssConflicts)
    {
        if(mergedNode == null || originalNode == null || originalNode.children == null || originalNode.children.length == 0) { return; }

        for(var i = 0; i < originalNode.children.length; i++)
        {
            var child = originalNode.children[i];

            if(origin == "reuse" && (child.type == "title" || !child.shouldBeIncluded)) { continue; }

            var mergedChild = this._cloneShallow(child);
            mergedChild.parent = mergedNode;

            if(origin != null && mergedChild.attributes != null)
            {
                mergedChild.attributes.push({name:"origin", value: origin});
            }

            if(mergedNode.type == "body" && hasFixedCssConflicts)
            {
                this._appendDifferentiatingStructureClassAttribute(mergedChild, origin);
            }

            mergedNode.children.push(mergedChild);

            if(mergedChild.type == "script" || mergedChild.type == "style" || mergedChild.type == "link")
            {
                this._createChildrenForNonHtmlContent(mergedChild, child, origin);
            }
            else
            {
                this._createChildren(mergedChild, child, origin, hasFixedCssConflicts);
            }
        }
    },

    _appendDifferentiatingStructureClassAttribute: function(node, origin)
    {
        var classAttribute = this._getAttribute(node, "class");

        //TODO possible problem with dynamically set class attributes
        if(classAttribute == null)
        {
            node.attributes.push
            ({
                name:"class",
                value: origin == "reuse" ? Firecrow.ConflictFixer.generateReusePrefix()
                                         : Firecrow.ConflictFixer.generateOriginalPrefix()
            });
        }
        else
        {
            classAttribute.value += " " + (origin == "reuse" ? Firecrow.ConflictFixer.generateReusePrefix()
                                                             : Firecrow.ConflictFixer.generateOriginalPrefix()) + " ";
        }
    },

    _createChildrenForNonHtmlContent: function(mergedNode, originalNode, origin)
    {
        if(mergedNode == null || originalNode == null) { return; }

        mergedNode.pathAndModel =
        {
            path: originalNode.pathAndModel.path,
            model: this._createCodeModel(originalNode.pathAndModel.model, origin)
        }

        mergedNode.cssRules = mergedNode.pathAndModel.model.rules;
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
            var programModel = this._createProgramModel(originalModel, origin);

            if(origin == "reuse")
            {
                Firecrow.ASTHelper.wrapInSelfExecutingFunctionExpression(programModel);
            }

            return programModel;
        }
        else
        {
            alert("Unknown code model!");
        }
    },

    _createCssCodeModel: function(originalModel, origin)
    {
        if(originalModel == null || originalModel.rules == null) { return null; }

        var shouldSlice = origin == "reuse";

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

        return Firecrow.ASTHelper.createCopy(originalModel, origin == "reuse");
    },

    _getHeadElement: function(model)
    {
        if(model == null) { return null; }
        if(model.htmlElement == null) { return null; }

        var children = model.htmlElement.children;

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

        var children = model.htmlElement.children;

        for(var i = 0; i < children.length; i++)
        {
            if(children[i].type === "body")
            {
                return children[i];
            }
        }

        return null;
    },

    _createMergedModelWithDocType: function(reusedAppModel, reuseIntoAppModel)
    {
        var mergedModel = { docType: reuseIntoAppModel.docType };

        if(reuseIntoAppModel.docType != reusedAppModel.docType)
        {
            mergedModel.conflicts = [{ type: "DocTypeConflict", value: reusedAppModel.docType}];
        }

        return mergedModel;
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

        clonedNode.children = [];
        clonedNode.childNodes = clonedNode.children;

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

Firecrow.ConflictFixer =
{
    fixJsConflicts: function(reusedAppGraph, reuseIntoAppGraph, reuseAppBrowser, reuseIntoAppBrowser)
    {
        this._fixGlobalPropertyConflicts(reuseAppBrowser, reuseIntoAppBrowser);
        this._fixEventHandlerProperties(reuseAppBrowser, reuseIntoAppBrowser);
    },

    _fixEventHandlerProperties: function(reuseAppBrowser, reuseIntoAppBrowser)
    {
        var conflictedHandlers = this._getConflictedHandlers(reuseAppBrowser, reuseIntoAppBrowser);
    },

    _getConflictedHandlers: function(reuseAppBrowser, reuseIntoAppBrowser)
    {
        if(reuseAppBrowser == null || reuseIntoAppBrowser == null || reuseAppBrowser.globalObject == null || reuseIntoAppBrowser.globalObject == null) { return []; }

        var reuseHandlerPropertiesMap = reuseAppBrowser.globalObject.eventHandlerPropertiesMap;
        var reuseIntoHandlerPropertiesMap = reuseIntoAppBrowser.globalObject.eventHandlerPropertiesMap;



    },

    _fixGlobalPropertyConflicts: function(reuseAppBrowser, reuseIntoAppBrowser)
    {
        var conflictedProperties = this._getConflictingProperties(reuseAppBrowser, reuseIntoAppBrowser);

        conflictedProperties.forEach(function(conflictedProperty)
        {
            if(conflictedProperty == null || conflictedProperty.declarationConstruct == null || conflictedProperty.declarationConstruct.codeConstruct == null) { return; }

            var newName = this.generateReusePrefix() + conflictedProperty.name;

            var declarationConstruct = conflictedProperty.declarationConstruct.codeConstruct;

            this._addCommentToParentStatement(declarationConstruct, "Firecrow - Rename global property");

            if(Firecrow.ASTHelper.isAssignmentExpression(declarationConstruct))
            {
                if(Firecrow.ASTHelper.isIdentifier(declarationConstruct.left))
                {
                    declarationConstruct.left.name = newName;
                }
                else
                {
                    alert("Unhandled expression when fixing global properties conflicts in assignment expression");
                }
            }
            else { alert("Unhandled expression when fixing global properties conflicts"); }

            var dependentEdges = declarationConstruct.graphNode.reverseDependencies;

            for(var i = 0, length = dependentEdges.length; i < length; i++)
            {
                var edge = dependentEdges[i];

                this._addCommentToParentStatement(edge.sourceNode.model, "Firecrow - Rename global property");

                if(!Firecrow.ASTHelper.isIdentifier(edge.sourceNode.model) || edge.sourceNode.model.name != conflictedProperty.name) { continue; }

                edge.sourceNode.model.name = this.generateReusePrefix() + edge.sourceNode.model.name;
            }

            var undefinedGlobalPropertiesMap = reuseAppBrowser.globalObject.undefinedGlobalPropertiesAccessMap;

            for(var propertyName in undefinedGlobalPropertiesMap)
            {
                for(var propertyAccess in undefinedGlobalPropertiesMap[propertyName])
                {
                    var codeConstruct = undefinedGlobalPropertiesMap[propertyName][propertyAccess];

                    var identifiers = Firecrow.ASTHelper.getAllElementsOfType(codeConstruct, [Firecrow.ASTHelper.CONST.Identifier]);

                    identifiers.forEach(function(identifier)
                    {
                        if(identifier.name == conflictedProperty.name)
                        {
                            identifier.name = newName;

                            this._addCommentToParentStatement(identifier, "Firecrow - Rename global property");
                        }
                    }, this);
                }
            }

        }, this);
    },

    _addCommentToParentStatement: function(codeConstruct, comment)
    {
        if(codeConstruct == null || comment == null || comment == "") { return; }

        var parentStatement = Firecrow.ASTHelper.getParentStatement(codeConstruct);

        if(parentStatement == null) { return; }

        if(parentStatement.comments == null) { parentStatement.comments = []; }

        parentStatement.comments.push(comment);
    },

    _getConflictingProperties: function(reuseAppBrowser, reuseIntoAppBrowser)
    {
        if(reuseAppBrowser == null || reuseIntoAppBrowser == null) { return []; }

        var reuseGlobalProperties = reuseAppBrowser.globalObject.getUserSetGlobalProperties();
        var reuseIntoGlobalProperties = reuseIntoAppBrowser.globalObject.getUserSetGlobalProperties();
        var conflictedProperties = [];

        for(var i = 0; i < reuseIntoGlobalProperties.length; i++)
        {
            var reuseIntoGlobal = reuseIntoGlobalProperties[i];

            for(var j = 0; j < reuseGlobalProperties.length; j++)
            {
                var reuseGlobal = reuseGlobalProperties[j];

                if(reuseGlobal.name == reuseIntoGlobal.name && !reuseAppBrowser.globalObject.isEventHandlerProperty(reuseGlobal.name))
                {
                    conflictedProperties.push(reuseGlobal);
                }
            }
        }

        return conflictedProperties;
    },

    fixHtmlConflicts: function(reusedAppGraph, reuseIntoAppGraph, reuseSelectors, reuseAppBrowser)
    {
        if(reusedAppGraph == null || reuseIntoAppGraph == null) { return null; }

        var reusedHtmlNodes = reusedAppGraph.htmlNodes;
        var reuseIntoHtmlNodes = reuseIntoAppGraph.htmlNodes;

        var changes = [];

        for(var i = 0; i < reusedHtmlNodes.length; i++)
        {
            var reusedNode = reusedHtmlNodes[i].model;

            for(var j = 0; j < reuseIntoHtmlNodes.length; j++)
            {
                var reuseIntoNode = reuseIntoHtmlNodes[j].model;

                var conflictingAttributes = this._getClassesAndIdsWithEqualValue(reusedNode, reuseIntoNode);

                conflictingAttributes.forEach(function(conflictingArgument)
                {
                    changes.push({oldValue:conflictingArgument.value, newValue: this.generateReusePrefix() + conflictingArgument.value, setConstruct: conflictingArgument.setConstruct});
                    conflictingArgument.value = this.generateReusePrefix() + conflictingArgument.value;
                }, this);
            }
        }

        for(var i = 0; i < changes.length; i++)
        {
            var change = changes[i];

            //TODO - SELECTOR HAZARD!
            for(var j = 0; j < reuseSelectors.length; j++)
            {
                reuseSelectors[j] = reuseSelectors[j].replace(change.oldValue, change.newValue);
            }

            for(var j = 0; j < reusedAppGraph.cssNodes.length; j++)
            {
                var cssNode = reusedAppGraph.cssNodes[j].model;

                cssNode.selector = cssNode.selector.replace(change.oldValue, change.newValue);
                cssNode.cssText = cssNode.cssText.replace(change.oldValue, change.newValue);
            }

            this._fixDynamicallySetAttributes(change);
            this._fixDomQueries(change, reuseAppBrowser);
        }
    },

    _fixDynamicallySetAttributes: function(change)
    {
        if(change.setConstruct != null)
        {
            if(Firecrow.ASTHelper.isAssignmentExpression(change.setConstruct))
            {
                this._replaceLiteralOrDirectIdentifierValue(change, change.setConstruct.right);
                return;
            }

            var parentStatement = Firecrow.ASTHelper.getParentStatement(change.setConstruct);

            if(parentStatement != null)
            {
                if(parentStatement.comments == null) { parentStatement.comments = []; }
                parentStatement.comments.push("Firecrow - Could not rename: " + change.oldValue + " -> " + change.newValue);
            }
        }
    },

    _replaceLiteralOrDirectIdentifierValue: function(change, codeConstruct)
    {
        var parentStatement = Firecrow.ASTHelper.getParentStatement(codeConstruct);

        if(parentStatement != null)
        {
            if(parentStatement.comments == null) { parentStatement.comments = []; }

            parentStatement.comments.push("Firecrow - Rename:" + change.oldValue + " -> " + change.newValue);
        }

        if(Firecrow.ASTHelper.isLiteral(codeConstruct))
        {
            codeConstruct.value = codeConstruct.value.replace(change.oldValue, change.newValue);
            return;
        }
        else if (Firecrow.ASTHelper.isIdentifier(codeConstruct))
        {
            var identifierDeclarator = Firecrow.ASTHelper.getDeclarator(codeConstruct);

            if(identifierDeclarator != null && Firecrow.ASTHelper.isLiteral(identifierDeclarator.init))
            {
                identifierDeclarator.init.value = identifierDeclarator.init.value.replace(change.oldValue, change.newValue);
                return;
            }
        }

        parentStatement.comments.push("Could not rename");
    },

    _fixDomQueries: function(change, reuseAppBrowser)
    {
        if(change == null || reuseAppBrowser == null) { return; }
        if(reuseAppBrowser.domQueriesMap == null) { return;}

        for(var domQueryProp in reuseAppBrowser.domQueriesMap)
        {
            var domQuery = reuseAppBrowser.domQueriesMap[domQueryProp];
            var callExpressionFirstArgument = Firecrow.ASTHelper.getFirstArgumentOfCallExpression(domQuery.codeConstruct);

            for(var selector in domQuery.selectorsMap)
            {
                if(selector.indexOf(change.oldValue) != -1)
                {
                    this._replaceLiteralOrDirectIdentifierValue(change, callExpressionFirstArgument);
                }
            }
        }
    },

    fixCssConflicts: function(reusedAppGraph, reuseIntoAppGraph)
    {
        var reusedCssNodes = reusedAppGraph.cssNodes;
        var reuseIntoCssNodes = reuseIntoAppGraph.cssNodes;

        var reusedCssSelectors = this._getTypeSelectors(reusedCssNodes);
        var reuseIntoCssSelectors = this._getTypeSelectors(reuseIntoCssNodes);

        if(reusedCssSelectors.length == 0 && reuseIntoCssSelectors == 0) { return false; }

        for(var i = 0; i < reusedCssSelectors.length; i++)
        {
           var cssSelector = reusedCssSelectors[i];

           //TODO CSS SELECTORS HAZARD
           cssSelector.cssText = "." + this.generateReusePrefix() + " " + cssSelector.selector + ", "
                               + cssSelector.selector + "." + this.generateReusePrefix() + cssSelector.cssText.replace(cssSelector.selector, "");

           cssSelector.selector = "." + this.generateReusePrefix() + " " + cssSelector.selector + ", "
                                + cssSelector.selector + this.generateReusePrefix();
        }

        for(var i = 0; i < reuseIntoCssSelectors.length; i++)
        {
            var cssSelector = reuseIntoCssSelectors[i];

            //TODO CSS SELECTORS HAZARD
            cssSelector.cssText = "." + this.generateOriginalPrefix() + " " + cssSelector.selector + ", "
                                + cssSelector.selector + "." + this.generateOriginalPrefix() + cssSelector.cssText.replace(cssSelector.selector, "");

            cssSelector.selector = "." + this.generateOriginalPrefix() + " " + cssSelector.selector + ", "
                                 + cssSelector.selector + this.generateOriginalPrefix();
        }

        return true;
    },

    _getTypeSelectors: function(cssNodes)
    {
        var typeSelectors = [];

        for(var i = 0; i < cssNodes.length; i++)
        {
            var cssSelector = cssNodes[i].model;

            //TODO CSS SELECTORS HAZARD
            if(this._isTypeSelector(cssSelector.selector))
            {
                typeSelectors.push(cssSelector);
            }
        }

        return typeSelectors;
    },

    _isTypeSelector: function(selector)
    {
        if(selector == null || selector == "") { return false; }

        return selector.indexOf(".") == -1 && selector.indexOf("#") == -1;
    },

    generateOriginalPrefix: function()
    {
        return "_OR_";
    },

    generateReusePrefix: function()
    {
        return "_RU_";
    },

    _getClassesAndIdsWithEqualValue: function(reusedNode, reuseIntoNode)
    {
        if(reusedNode == null || reuseIntoNode == null) { return []; }

        var reusedAttributes = (reusedNode.attributes || []).concat(reusedNode.dynamicClasses || []).concat(reusedNode.dynamicIds || []);
        var reusedIntoAttributes = (reuseIntoNode.attributes || []).concat(reuseIntoNode.dynamicClasses || []).concat(reuseIntoNode.dynamicIds || []);

        if(reusedAttributes.length == 0) { return []; }
        if(reusedIntoAttributes.length == 0) { return []; }

        var matchingAttributes = [];

        for(var i = 0; i < reusedAttributes.length; i++)
        {
            var reusedAttribute = reusedAttributes[i];
            if(reusedAttribute.name != "class" && reusedAttribute.name != "name" && reusedAttribute.name != "id") { continue; }

            for(var j = 0; j < reusedIntoAttributes.length; j++)
            {
                var reusedIntoAttribute = reusedIntoAttributes[j];

                if(reusedIntoAttribute.name != "class" && reusedIntoAttribute.name != "name" && reusedIntoAttribute.name != "id") { continue; }

                if(reusedAttribute.value == reusedIntoAttribute.value)
                {
                    matchingAttributes.push(reusedAttribute);
                }
            }
        }

        return matchingAttributes;
    }
};
// ************************************************************************************************
}});