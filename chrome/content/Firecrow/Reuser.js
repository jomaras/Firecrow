/**
 * User: Jomaras
 * Date: 08.10.12.
 * Time: 10:52
 */
FBL.ns(function() { with (FBL) {
// ************************************************************************************************
var fcModel = Firecrow.Interpreter.Model;
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

            Firecrow.ConflictFixer.fixResourceConflicts(reuseAppGraph, reuseIntoAppGraph, reuseAppBrowser, reuseIntoAppBrowser);
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
            mergedModel.childNodes = [mergedHtmlElement];

            var reusedHeadNode = this.getHeadElement(reusedAppModel);
            var reuseIntoHeadNode = this.getHeadElement(reuseIntoAppModel);
            var mergedHeadNode = this._cloneShallowMarkConflicts(reuseIntoHeadNode, reusedHeadNode);
            mergedHtmlElement.childNodes.push(mergedHeadNode);
            this._createChildren(mergedHeadNode, reuseIntoHeadNode);
            this._createChildren(mergedHeadNode, reusedHeadNode, "reuse");


            var reusedBodyNode = this.getBodyElement(reusedAppModel);
            var reuseIntoBodyNode = this.getBodyElement(reuseIntoAppModel);
            var mergedBodyNode = this._cloneShallowMarkConflicts(reuseIntoBodyNode, reusedBodyNode);
            mergedHtmlElement.childNodes.push(mergedBodyNode);
            this._createChildren(mergedBodyNode, reuseIntoBodyNode, null, hasFixedCssConflicts);
            this._createChildren(mergedBodyNode, reusedBodyNode, "reuse", hasFixedCssConflicts);

            if(!this._areSelectorsSupported(reuseSelectors.concat(reuseIntoDestinationSelectors)))
            {
                alert("Used selectors are not supported in Reuser - only simple selectors by class and id!");
            }

            this._moveNodesTo(mergedModel, reuseSelectors, reuseIntoDestinationSelectors);

            Firecrow.ASTHelper.setParentsChildRelationships(mergedModel);

            return mergedModel;

        } catch(e)
        {
            alert("Error when creating merged model:" + e);
        }
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
            Firecrow.ValueTypeHelper.removeFromArrayByElement(node.parent.childNodes, node);

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
        if(mergedNode == null || originalNode == null || originalNode.childNodes == null || originalNode.childNodes.length == 0) { return; }

        for(var i = 0; i < originalNode.childNodes.length; i++)
        {
            var child = originalNode.childNodes[i];

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

            mergedNode.childNodes.push(mergedChild);

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

    getHeadElement: function(model)
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

    getBodyElement: function(model)
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

Firecrow.ConflictFixer =
{
    fixResourceConflicts: function(reusedAppGraph, reuseIntoAppGraph, reuseAppBrowser, reuseIntoAppBrowser)
    {
        try
        {
            this._fixResourceConflictsInCss(reusedAppGraph, reuseAppBrowser);
            this._fixResourceConflictsInHtml(reusedAppGraph, reuseAppBrowser);
            this._fixResourceConflictsInJs(reusedAppGraph, reuseAppBrowser);
        }
        catch(e) { alert("Error when fixing resource conflicts: " + e); }
    },

    _fixResourceConflictsInCss: function(reusedAppGraph, reuseAppBrowser)
    {
        var cssNodes = reusedAppGraph.cssNodes;

        for(var i = 0, length = cssNodes.length; i < length; i++)
        {
            var cssNode = cssNodes[i];
            if(cssNode.model == null || cssNode.model.declarations == null) { continue; }

            var declarations = cssNode.model.declarations;

            this._replaceImageUrlInCss(declarations, "background");
            this._replaceImageUrlInCss(declarations, "background-image");
            this._replaceImageUrlInCss(declarations, "list-style-image");
        }
    },

    _replaceImageUrlInCss: function(cssDeclarationsObject, propertyName)
    {
        var propertyValue = cssDeclarationsObject[propertyName];

        if(propertyValue == null) { return; }

        var currentUrl = this._getPathFromCssUrl(propertyValue);

        if(currentUrl == null) { return; }

        var cssFilePath = Firecrow.ASTHelper.getCssFilePathFromDeclaration(cssDeclarationsObject);
        var relativePath = this._getRelativePath(currentUrl, cssFilePath);

        cssDeclarationsObject[propertyName] = propertyValue.replace(currentUrl, this._wrapInReuseFolder(relativePath));
        cssDeclarationsObject.parent.cssText = cssDeclarationsObject.parent.cssText.replace(propertyValue, "url('" + this._wrapInReuseFolder(relativePath) + "')");
    },

    _getRelativePath: function(path, basePath)
    {
        return Firecrow.UriHelper.getRelativeFrom(Firecrow.UriHelper.getAbsoluteUrl(path, basePath), basePath);
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

    _fixResourceConflictsInHtml: function(reusedAppGraph, reuseAppBrowser)
    {
        var htmlNodes = reusedAppGraph.htmlNodes;

        for(var i = 0, length = htmlNodes.length; i < length; i++)
        {
            var htmlNode = htmlNodes[i];

            if(htmlNode.model == null || htmlNode.model.type != "img"){ continue; }

            htmlNode.model.attributes.forEach(function(attribute)
            {
                if(attribute.name == "src")
                {
                    attribute.value = this._wrapInReuseFolder(this._getRelativePath(attribute.value, reuseAppBrowser.pageModel.pageUrl));
                }
            }, this);
        }
    },

    _wrapInReuseFolder: function(path)
    {     //TODO
        //return "reuse/" + path;
        return path;
    },

    _fixResourceConflictsInJs: function(reusedAppGraph, reusedAppBrowser)
    {
        if(reusedAppBrowser == null || reusedAppBrowser.globalObject == null)

        var mapping;

        mapping = reusedAppBrowser.globalObject.resourceSetterPropertiesMap;

        for(var prop in mapping)
        {
            var setObject = mapping[prop];

            var change =
            {
                oldValue: setObject.resourceValue,
                newValue: this._wrapInReuseFolder(this._getRelativePath(setObject.resourceValue, reusedAppBrowser.pageModel.pageUrl))
            };

            if(Firecrow.ASTHelper.isAssignmentExpression(setObject.codeConstruct))
            {
                this._replaceLiteralOrDirectIdentifierValue(change, setObject.codeConstruct.right);
                continue;
            }

            this._addCommentToParentStatement(setObject.codeConstruct, "Firecrow - Could not rename " + change.oldValue + " -> " + change.newValue);
        }
    },

    fixJsConflicts: function(reusedAppGraph, reuseIntoAppGraph, reuseAppBrowser, reuseIntoAppBrowser)
    {
        this._fixGlobalPropertyConflicts(reuseAppBrowser, reuseIntoAppBrowser);
        this._fixEventHandlerProperties(reuseAppBrowser, reuseIntoAppBrowser);
    },

    _CONFLICT_COUNTER: 0,

    _fixEventHandlerProperties: function(reuseAppBrowser, reuseIntoAppBrowser)
    {
        var conflictedHandlers = this._getConflictedHandlers(reuseAppBrowser, reuseIntoAppBrowser);

        if(conflictedHandlers.length == 0) { return; }

        conflictedHandlers.forEach(function(conflictedHandler)
        {
            var reuseHandler = conflictedHandler.reuseConflictConstruct;
            var reuseIntoHandler = conflictedHandler.reuseIntoConflictConstruct;

            this._replaceWithFirecrowHandler(reuseHandler);
            this._replaceWithFirecrowHandler(reuseIntoHandler);
        }, this);

        this._insertFirecrowHandleConflictsCode(reuseIntoAppBrowser.pageModel, reuseAppBrowser.pageModel);
    },

    _insertFirecrowHandleConflictsCode: function(reuseIntoPageModel, reusePageModel)
    {
        var headElement = Firecrow.Reuser.getHeadElement(reuseIntoPageModel);

        if(headElement == null) { alert("There is no head element"); return; }

        var handlerMapperScript = Firecrow.ValueTypeHelper.deepClone(Firecrow.Reuser.Templates._HANDLER_MAPPER_SCRIPT_CREATION_TEMPLATE);

        Firecrow.ValueTypeHelper.insertIntoArrayAtIndex(headElement.childNodes, handlerMapperScript, 0);

        var bodyElement = Firecrow.Reuser.getBodyElement(reusePageModel);

        if(bodyElement == null) { alert("There is no body element"); return; }

        var scriptInvokerScriptElement =
        {
            type: "script", childNodes:[], attributes:[{name:"origin", value: "Firecrow"}],
            sourceCode: atob(Firecrow.Reuser.Templates._HANDLER_MAPPER_SCRIPT_INVOKER),
            shouldBeIncluded: true
        };

        bodyElement.childNodes.push(scriptInvokerScriptElement);
    },

    _replaceWithFirecrowHandler: function(codeConstruct)
    {
        var conflictCounter = this._CONFLICT_COUNTER;
        var handlerParent = null;
        var propertyNameParent = null;
        var conflictTemplate = Firecrow.ValueTypeHelper.deepClone(Firecrow.Reuser.Templates._HANDLER_CONFLICT_TEMPLATE);

        Firecrow.ASTHelper.traverseWholeAST(conflictTemplate, function(propertyValue, propertyName, parentObject)
        {
            if(propertyName == "nodeId")
            {
                parentObject[propertyName] = propertyValue.replace("{ID_PREFIX}", "FirecrowHandler" + conflictCounter);
            }

            if(propertyName == "value")
            {
                if(propertyValue != null && propertyValue.value == "{HANDLER_LITERAL_TEMPLATE}")
                {
                    handlerParent = parentObject;
                }
                else if (propertyValue == "{PROPERTY_NAME}")
                {
                    propertyNameParent = parentObject;
                }
            }
        });

        Firecrow.ASTHelper.setParentsChildRelationships(conflictTemplate);

        if(handlerParent != null && propertyNameParent != null)
        {
            if(Firecrow.ASTHelper.isAssignmentExpression(codeConstruct))
            {
                var parent = codeConstruct.parent;

                parent.expression = conflictTemplate;
                parent.children = [conflictTemplate];

                conflictTemplate.parent = parent;

                if(Firecrow.ASTHelper.isMemberExpression(codeConstruct.left))
                {
                    propertyNameParent.value = codeConstruct.left.property.name;
                }
                else if (Firecrow.ASTHelper.isIdentifier(codeConstruct.left))
                {
                    propertyNameParent.value = codeConstruct.left.name;
                }
                else { alert("Unknown left hand side when replacing handlers");}

                handlerParent.value = codeConstruct.right;
                codeConstruct.right.parent = handlerParent;
            }
            else
            {
                alert("Unhandled expression when replacing handlers");
            }
        }

        this._CONFLICT_COUNTER++;
    },

    _getConflictedHandlers: function(reuseAppBrowser, reuseIntoAppBrowser)
    {
        if(reuseAppBrowser == null || reuseIntoAppBrowser == null || reuseAppBrowser.globalObject == null || reuseIntoAppBrowser.globalObject == null) { return []; }

        var reuseHandlerPropertiesMap = reuseAppBrowser.globalObject.eventHandlerPropertiesMap;
        var reuseIntoHandlerPropertiesMap = reuseIntoAppBrowser.globalObject.eventHandlerPropertiesMap;

        var conflictingHandlers = [];

        for(var reuseProperty in reuseHandlerPropertiesMap)
        {
            for(var reuseIntoProperty in reuseIntoHandlerPropertiesMap)
            {
                if(reuseProperty == reuseIntoProperty && reuseHandlerPropertiesMap[reuseProperty].shouldBeIncluded)
                {
                    conflictingHandlers.push({
                        reuseConflictConstruct : reuseHandlerPropertiesMap[reuseProperty],
                        reuseIntoConflictConstruct : reuseIntoHandlerPropertiesMap[reuseIntoProperty]
                    });
                }
            }
        }

        return conflictingHandlers;
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
            else if (Firecrow.ASTHelper.isVariableDeclarator(declarationConstruct))
            {
                declarationConstruct.id.name = newName;
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

                if(reuseGlobal.name == reuseIntoGlobal.name && !fcModel.GlobalObject.CONST.isEventProperty(reuseGlobal.name))
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

            this._addCommentToParentStatement(change.setConstruct, "Firecrow - Could not rename: " + change.oldValue + " -> " + change.newValue);
        }
    },

    _replaceLiteralOrDirectIdentifierValue: function(change, codeConstruct)
    {
        var renameMessage = "Firecrow - Rename:" + change.oldValue + " -> " + change.newValue;

        if(Firecrow.ASTHelper.isLiteral(codeConstruct))
        {
            codeConstruct.value = codeConstruct.value.replace(change.oldValue, change.newValue);
            this._addCommentToParentStatement(codeConstruct, renameMessage);
            return;
        }
        else if (Firecrow.ASTHelper.isIdentifier(codeConstruct))
        {
            var identifierDeclarator = Firecrow.ASTHelper.getDeclarator(codeConstruct);

            if(identifierDeclarator != null && Firecrow.ASTHelper.isLiteral(identifierDeclarator.init))
            {
                identifierDeclarator.init.value = identifierDeclarator.init.value.replace(change.oldValue, change.newValue);
                this._addCommentToParentStatement(identifierDeclarator, renameMessage);
                return;
            }
        }
        else if(Firecrow.ASTHelper.isMemberExpression(codeConstruct))
        {
            if(codeConstruct.property != null && codeConstruct.property.graphNode != null)
            {
                var dependencies = codeConstruct.property.graphNode.dataDependencies;
                var hasReplaced = false;

                for(var i = 0; i < dependencies.length; i++)
                {
                    var dependency = dependencies[i];

                    if(Firecrow.ASTHelper.isLiteral(dependency.destinationNode.model))
                    {
                        dependency.destinationNode.model.value = dependency.destinationNode.model.value.replace(change.oldValue, change.newValue);
                        this._addCommentToParentStatement(dependency.destinationNode.model, renameMessage);
                        hasReplaced = true;
                    }
                }

                if(hasReplaced) { return; }
            }
        }

        this._addCommentToParentStatement(codeConstruct, "Could not rename");
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