var path = require('path');
var atob = require("atob");

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
        this._fixGlobalPropertyConflicts(pageAExecutionSummary, pageBExecutionSummary);
        this._fixEventHandlerProperties(pageAExecutionSummary, pageBExecutionSummary);
        this._fixPrototypeConflicts(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary);
        this._fixTypeOnlyDomSelectors(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary);
    },

    _fixTypeOnlyDomSelectors: function(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary)
    {
        this._fixTypeOnlyDomSelectorsInApplication(pageAModel, pageAExecutionSummary, "r");
        this._fixTypeOnlyDomSelectorsInApplication(pageBModel, pageBExecutionSummary, null);
    },

    _fixTypeOnlyDomSelectorsInApplication: function(pageModel, pageExecutionSummary, origin)
    {
        if(pageExecutionSummary == null) { return; }
        if(pageExecutionSummary.domQueriesMap == null) { return;}

        var attributeSelector = origin == "r" ? this.generateReuseAttributeSelector()
                                              : this.generateOriginalAttributeSelector();

        for(var domQueryProp in pageExecutionSummary.domQueriesMap)
        {
            var domQuery = pageExecutionSummary.domQueriesMap[domQueryProp];
            var callExpressionFirstArgument = ASTHelper.getFirstArgumentOfCallExpression(domQuery.codeConstruct);

            for(var selector in domQuery.selectorsMap)
            {
                //TODO - selector warning, possible problems with getElementsByTagName
                if(this._containsTypeSelector(selector) && (domQuery.methodName == "querySelector" || domQuery.methodName == "querySelectorAll"))
                {
                    this._replaceLiteralOrDirectIdentifierValue
                    (
                        {
                            oldValue: selector,
                            newValue: selector + attributeSelector
                        },
                        callExpressionFirstArgument
                    );
                }
            }
        }
    },

    _containsTypeSelector: function(selector)
    {
        if(selector == null || selector == "") { return false; }

        var simpleSelectors = selector.split(",");

        for(var i = 0; i < simpleSelectors.length; i++)
        {
            var simpleSelector = simpleSelectors[i].trim();

            if(simpleSelector.indexOf(".") == -1 && simpleSelector.indexOf("#") == -1)
            {
                return true;
            }
        }

        return false;
    },

    _fixGlobalPropertyConflicts: function(pageAExecutionSummary, pageBExecutionSummary)
    {
        var conflictedProperties = this._getConflictingProperties(pageAExecutionSummary, pageBExecutionSummary);

        conflictedProperties.forEach(function(conflictedProperty)
        {
            if(conflictedProperty == null || conflictedProperty.declarationConstruct == null) { return; }

            var newName = this.generateReusePrefix() + conflictedProperty.name;

            var declarationConstruct = conflictedProperty.declarationConstruct;
            var hasDeclarationBeenChanged = false;

            if(ASTHelper.isAssignmentExpression(declarationConstruct))
            {
                if(ASTHelper.isIdentifier(declarationConstruct.left))
                {
                    declarationConstruct.left.name = newName;
                    hasDeclarationBeenChanged = true;
                }
                else if (ASTHelper.isMemberExpression(declarationConstruct.left))
                {
                    if(!declarationConstruct.left.computed || conflictedProperty.name == declarationConstruct.left.property.name)
                    {
                        declarationConstruct.left.property.name = newName;
                        hasDeclarationBeenChanged = true;
                    }
                    else if (ASTHelper.isMemberExpression(declarationConstruct.right)
                        ||  (ASTHelper.isAssignmentExpression(declarationConstruct.right)
                        && (ASTHelper.isMemberExpression(declarationConstruct.right.right)
                        || ASTHelper.isIdentifier(declarationConstruct.right.right)))
                        || (declarationConstruct.left.computed && ASTHelper.isIdentifier(declarationConstruct.right)))
                    {
                        //TODO - consider improving (problem when the conflicting property is assigned over for-in object extension)
                        console.log("Trying to replace computed member expression");

                        var memberPropertyDeclaration = null;

                        if(ASTHelper.isMemberExpression(declarationConstruct.right) || ASTHelper.isIdentifier(declarationConstruct.right))
                        {
                            memberPropertyDeclaration = this._getPropertyDeclaration(declarationConstruct.right, conflictedProperty.name);
                        }
                        else if (ASTHelper.isAssignmentExpression(declarationConstruct.right))
                        {
                            if(ASTHelper.isMemberExpression(declarationConstruct.right.right) || ASTHelper.isIdentifier(declarationConstruct.right.right))
                            {
                                memberPropertyDeclaration = this._getPropertyDeclaration(declarationConstruct.right.right, conflictedProperty.name);
                            }
                        }

                        if(memberPropertyDeclaration != null)
                        {
                            this._addCommentToParentStatement(memberPropertyDeclaration, "Firecrow - Rename global property");
                            memberPropertyDeclaration.name = newName;
                            hasDeclarationBeenChanged = true;
                        }
                        else
                        {
                            //In MooTools multiple objects can be extended with the same property, so it could have been fixed before
                            //console.log("Can not find property declarator when fixing property conflicts");
                            debugger;
                        }
                    }
                    else
                    {
                        debugger;
                        console.log("Unhandled expression when fixing global properties conflicts in assignment expression");
                    }
                }
                else
                {
                    debugger;
                    console.log("Unhandled expression when fixing global properties conflicts in assignment expression");
                }
            }
            else if (ASTHelper.isVariableDeclarator(declarationConstruct) || ASTHelper.isFunctionDeclaration(declarationConstruct))
            {
                declarationConstruct.id.name = newName;
                hasDeclarationBeenChanged = true;
            }
            else
            {
                debugger;
                console.log("Unhandled expression when fixing global properties conflicts");
            }

            if(!hasDeclarationBeenChanged) { return; }
            this._addCommentToParentStatement(declarationConstruct, "Firecrow - Rename global property");

            var dependentEdges = declarationConstruct.reverseDependencies;

            for(var i = 0, length = dependentEdges.length; i < length; i++)
            {
                var edge = dependentEdges[i];

                var sourceConstruct = edge.sourceNode;

                this._addCommentToParentStatement(sourceConstruct, "Firecrow - Rename global property");

                if(ASTHelper.isIdentifier(sourceConstruct) && sourceConstruct.name == conflictedProperty.name)
                {
                    sourceConstruct.name = this.generateReusePrefix() + sourceConstruct.name;
                }
                else if (ASTHelper.isMemberExpression(sourceConstruct) && sourceConstruct.property.name == conflictedProperty.name)
                {
                    sourceConstruct.property.name = this.generateReusePrefix() + sourceConstruct.property.name;
                }
            }

            var undefinedGlobalPropertiesMap = pageAExecutionSummary.undefinedGlobalPropertiesAccessMap;

            for(var propertyName in undefinedGlobalPropertiesMap)
            {
                for(var propertyAccess in undefinedGlobalPropertiesMap[propertyName])
                {
                    var codeConstruct = undefinedGlobalPropertiesMap[propertyName][propertyAccess];

                    var identifiers = ASTHelper.getAllElementsOfType(codeConstruct, [ASTHelper.CONST.Identifier]);

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

    _fixEventHandlerProperties: function(pageAExecutionSummary, pageBExecutionSummary)
    {
        var conflictedHandlers = this._getConflictedHandlers(pageAExecutionSummary, pageBExecutionSummary);

        if(conflictedHandlers.length == 0) { return; }

        conflictedHandlers.forEach(function(conflictedHandler)
        {
            var reuseHandler = conflictedHandler.pageAConflictConstruct;
            var reuseIntoHandler = conflictedHandler.pageBConflictConstruct;

            this._replaceWithFirecrowHandler(reuseHandler);
            this._replaceWithFirecrowHandler(reuseIntoHandler);
        }, this);

        this._insertFirecrowHandleConflictsCode(pageBExecutionSummary.pageModel, pageAExecutionSummary.pageModel);
    },

    _fixPrototypeConflicts: function(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary)
    {
        var reusePrototypeExtensions = this._getPrototypeExtensions(pageAExecutionSummary);
        var reuseIntoPrototypeExtensions = this._getPrototypeExtensions(pageBExecutionSummary);

        this._fixPrototypeSpilling(pageAModel, pageAExecutionSummary, reuseIntoPrototypeExtensions);
        this._fixPrototypeSpilling(pageBModel, pageBExecutionSummary, reusePrototypeExtensions);
    },

    _getPrototypeExtensions: function(executionSummary)
    {
        var extensions = [];

        var prototypes = executionSummary.internalPrototypes || [];

        for(var i = 0; i < prototypes.length; i++)
        {
            var prototype = prototypes[i];

            var userDefinedProperties = prototype.userDefinedProperties;

            if(userDefinedProperties.length > 0)
            {
                extensions.push({ extendedObject: prototype, extendedProperties: userDefinedProperties});
            }
        }

        return extensions;
    },

    _fixPrototypeSpilling: function(pageModel, pageExecutionSummary, prototypeExtensions)
    {
        for(var i = 0; i < prototypeExtensions.length; i++)
        {
            var prototypeExtension = prototypeExtensions[i];

            this._fixIterationConstructs(pageExecutionSummary, prototypeExtension);
        }
    },

    _fixIterationConstructs: function(pageExecutionSummary, prototypeExtension)
    {
        var forInIterations = pageExecutionSummary.forInIterations;

        for(var i = 0; i < forInIterations.length; i++)
        {
            var forInIteration = forInIterations[i];
            console.warn("Check prototype chain");
            a++;//crash
            this._extendForInBody(forInIteration.codeConstruct, prototypeExtension.extendedProperties);
        }
    },

    _extendForInBody: function(forInStatement, extendedProperties)
    {
        var propertyName = ASTHelper.getPropertyNameFromForInStatement(forInStatement);

        for(var i = 0; i < extendedProperties.length; i++)
        {
            var extendedProperty = extendedProperties[i];

            if(forInStatement.handledForInExtensions == null) { forInStatement.handledForInExtensions = []; }

            if(forInStatement.handledForInExtensions.indexOf(extendedProperty.name) == -1)
            {
                this._prependToForInBody(forInStatement, this._getSkipIterationConstruct(propertyName, extendedProperty.name));

                forInStatement.handledForInExtensions.push(extendedProperty.name);
            }
        }
    },

    _getSkipIterationConstruct: function(propertyName, skipPropertyName)
    {
        var skipIterationConstructString = atob(_FOR_IN_SKIPPER_TEMPLATE);

        var conflictCounter = this._CONFLICT_COUNTER;

        var updatedSkipIterationConstructString = skipIterationConstructString.replace("{PROPERTY_NAME}", propertyName)
        updatedSkipIterationConstructString = updatedSkipIterationConstructString.replace("{PROPERTY_VALUE}", skipPropertyName)
        updatedSkipIterationConstructString = updatedSkipIterationConstructString.replace(/{NODE_ID}/g, function()
        {
            return '"' + (propertyName +  (conflictCounter++)) + '"';
        });

        var skipIterationConstruct = JSON.parse(updatedSkipIterationConstructString);

        skipIterationConstruct.shouldBeIncluded = true;
        skipIterationConstruct.test.shouldBeIncluded = true;
        skipIterationConstruct.test.left.shouldBeIncluded = true;
        skipIterationConstruct.test.right.shouldBeIncluded = true;
        skipIterationConstruct.consequent.shouldBeIncluded = true;

        skipIterationConstruct.children = [skipIterationConstruct.test, skipIterationConstruct.consequent];

        skipIterationConstruct.test.parent = skipIterationConstruct;
        skipIterationConstruct.consequent.parent = skipIterationConstruct;

        return skipIterationConstruct;
    },

    _prependToForInBody: function(forInStatement, skipIterationConstruct)
    {
        if(ASTHelper.isBlockStatement(forInStatement.body))
        {
            skipIterationConstruct.parent = forInStatement.body;

            ValueTypeHelper.insertIntoArrayAtIndex(forInStatement.body.body, skipIterationConstruct, 0);
            ValueTypeHelper.insertIntoArrayAtIndex(forInStatement.body.children, skipIterationConstruct, 0);
        }
        else
        {
            debugger;
            //alert("Reuser - Unhandled construct when prepending to ForIn body");
        }
    },

    _CONFLICT_COUNTER: 0,

    _replaceWithFirecrowHandler: function(codeConstruct)
    {
        var conflictCounter = this._CONFLICT_COUNTER;
        var handlerParent = null;
        var propertyNameParent = null;
        var conflictTemplate = ValueTypeHelper.deepClone(HANDLER_CONFLICT_TEMPLATE);

        ASTHelper.traverseWholeAST(conflictTemplate, function(propertyValue, propertyName, parentObject)
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

        ASTHelper.setParentsChildRelationships(conflictTemplate);

        if(handlerParent != null && propertyNameParent != null)
        {
            if(ASTHelper.isAssignmentExpression(codeConstruct))
            {
                var parent = codeConstruct.parent;

                parent.expression = conflictTemplate;
                parent.children = [conflictTemplate];

                conflictTemplate.parent = parent;

                if(ASTHelper.isMemberExpression(codeConstruct.left))
                {
                    propertyNameParent.value = codeConstruct.left.property.name;
                }
                else if (ASTHelper.isIdentifier(codeConstruct.left))
                {
                    propertyNameParent.value = codeConstruct.left.name;
                }
                else { console.log("Unknown left hand side when replacing handlers");}

                handlerParent.value = codeConstruct.right;
                codeConstruct.right.parent = handlerParent;
            }
            else
            {
                console.log("Unhandled expression when replacing handlers");
            }
        }

        this._CONFLICT_COUNTER++;
    },

    _getConflictedHandlers: function(pageAExecutionSummary, pageBExecutionSummary)
    {
        var pageAHandlerPropertiesMap = pageAExecutionSummary.eventHandlerPropertiesMap;
        var pageBHandlerPropertiesMap = pageBExecutionSummary.eventHandlerPropertiesMap;

        var conflictingHandlers = [];

        for(var pageAProperty in pageAHandlerPropertiesMap)
        {
            for(var pageBProperty in pageBHandlerPropertiesMap)
            {
                if(pageAProperty == pageBProperty && pageAHandlerPropertiesMap[pageAProperty].shouldBeIncluded)
                {
                    conflictingHandlers.push({
                        pageAConflictConstruct : pageAHandlerPropertiesMap[pageAProperty],
                        pageBConflictConstruct : pageBHandlerPropertiesMap[pageBProperty]
                    });
                }
            }
        }

        return conflictingHandlers;
    },

    _getConflictingProperties: function(pageAExecutionSummary, pageBExecutionSummary)
    {
        if(pageAExecutionSummary == null || pageBExecutionSummary == null) { return []; }

        var pageAGlobalProperties = pageAExecutionSummary.userSetGlobalProperties;
        var pageBGlobalProperties = pageBExecutionSummary.userSetGlobalProperties;

        var conflictedProperties = [];

        for(var i = 0; i < pageBGlobalProperties.length; i++)
        {
            var pageBProperty = pageBGlobalProperties[i];

            for(var j = 0; j < pageAGlobalProperties.length; j++)
            {
                var pageAGlobalProperty = pageAGlobalProperties[j];

                if(pageAGlobalProperty.name == pageBProperty.name && !pageAGlobalProperty.isEventProperty)
                {
                    conflictedProperties.push(pageAGlobalProperty);
                }
            }
        }

        var pageAUserDocumentProperties = pageAExecutionSummary.userSetDocumentProperties;
        var pageBUserDocumentProperties = pageBExecutionSummary.userSetDocumentProperties;

        for(var i = 0; i < pageBUserDocumentProperties.length; i++)
        {
            var pageBProperty = pageBUserDocumentProperties[i];

            for(var j = 0; j < pageAUserDocumentProperties.length; j++)
            {
                var pageAProperty = pageAUserDocumentProperties[j];

                if(pageAProperty.name == pageBProperty.name)
                {
                    conflictedProperties.push(pageBProperty);
                }
            }
        }

        var pageAPrototypeExtensions = pageAExecutionSummary.prototypeExtensions || [];
        var pageBPrototypeExtensions = pageBExecutionSummary.prototypeExtensions || [];

        for(var i = 0; i < pageAPrototypeExtensions.length; i++)
        {
            var pageAPrototypeExtension = pageAPrototypeExtensions[i];

            for(var j = 0; j < pageBPrototypeExtensions.length; j++)
            {
                var pageBPrototypeExtension = pageBPrototypeExtensions[j];

                if(pageAPrototypeExtension.extendedObject.constructor == pageBPrototypeExtension.extendedObject.constructor)
                {
                    var commonExtendedProperties = this._getCommonExtendedPropertiesFromReuse(pageAPrototypeExtension.extendedProperties, pageBPrototypeExtension.extendedProperties);

                    if(commonExtendedProperties.length > 0)
                    {
                        ValueTypeHelper.pushAll(conflictedProperties, commonExtendedProperties);
                    }
                }
            }
        }

        return conflictedProperties;
    },

    _getCommonExtendedPropertiesFromReuse: function(pageAProperties, pageBProperties)
    {
        var common = [];

        for(var i = 0; i < pageAProperties.length; i++)
        {
            var pageAProperty = pageAProperties[i];
            for(var j = 0; j < pageBProperties.length; j++)
            {
                if(pageAProperty.name == pageBProperties[j].name)
                {
                    common.push(pageAProperty);
                }
            }
        }

        return common;
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

                if(cleansedSelector == "body" || cleansedSelector == "html"
                || CssSelectorParser.isIdSelector(cleansedSelector) || CssSelectorParser.isClassSelector(cleansedSelector))
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

    _addCommentToParentStatement: function(codeConstruct, comment)
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
