var path = require('path');
var atob = require("atob");

var ValueTypeHelper = require(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/valueTypeHelper.js")).ValueTypeHelper;
var ASTHelper = require(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/ASTHelper.js")).ASTHelper;
var CssSelectorParser = require(path.resolve(__dirname, "../../chrome/content/Firecrow/parsers/CssSelectorParser.js")).CssSelectorParser;
var ReuserTemplates = require(path.resolve(__dirname, "../../chrome/content/Firecrow/templates/reuserTemplates.js")).ReuserTemplates;
var CodeTextGenerator = require(path.resolve(__dirname, "../../chrome/content/Firecrow/codeMarkupGenerator/codeTextGenerator.js")).CodeTextGenerator;

var ConflictFixerCommon = require(path.resolve(__dirname, "ConflictFixerCommon.js")).ConflictFixerCommon;

var JsConflictFixer =
{
    _CONFLICT_COUNTER: 0,

    fixJsConflicts: function(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary)
    {
        this._fixGlobalPropertyConflicts(pageAExecutionSummary, pageBExecutionSummary);
        this._fixPrototypeConflicts(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary);
        this._fixTypeOnlyDomSelectors(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary);
        this._fixEventHandlerProperties(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary);
    },

    _fixGlobalPropertyConflicts: function(pageAExecutionSummary, pageBExecutionSummary)
    {
        var conflictedProperties = this._getConflictingProperties(pageAExecutionSummary, pageBExecutionSummary);

        conflictedProperties.forEach(function(conflictedProperty)
        {
            if(conflictedProperty == null) { return; }
            if(conflictedProperty.declarationConstruct == null) { return; }

            var newName = ConflictFixerCommon.generateReusePrefix() + conflictedProperty.name;

            var declarationConstruct = conflictedProperty.declarationConstruct;
            var changedConstructs = [];

            if(ASTHelper.isAssignmentExpression(declarationConstruct))
            {
                if(ASTHelper.isIdentifier(declarationConstruct.left))
                {
                    declarationConstruct.left.name = newName;
                    changedConstructs.push(declarationConstruct.left);
                }
                else if (ASTHelper.isMemberExpression(declarationConstruct.left))
                {
                    var memberExpression = declarationConstruct.left;

                    if(!memberExpression.computed || conflictedProperty.name == memberExpression.property.name)
                    {
                        memberExpression.property.name = newName;
                        changedConstructs.push(memberExpression.property);
                    }
                    else if(memberExpression.computed)
                    {
                        var property = memberExpression.property;

                        var propertyDeclarations = this._getPropertyDeclarations(property, conflictedProperty.name);

                        propertyDeclarations.forEach(function(propertyDeclaration)
                        {
                            if(ASTHelper.isIdentifier(propertyDeclaration))
                            {
                                changedConstructs.push(propertyDeclaration);
                                propertyDeclaration.name = newName;
                            }
                        });
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
                changedConstructs.push(declarationConstruct);
            }
            else
            {
                debugger;
                console.log("Unhandled expression when fixing global properties conflicts");
            }

            if(changedConstructs.length == 0) { return; }

            ConflictFixerCommon.addCommentToParentStatement(declarationConstruct, "Firecrow - Rename global property");

            this._changePropertyAccessPositions(declarationConstruct, conflictedProperty.name, newName);

            var dependentEdges = declarationConstruct.reverseDependencies.concat(declarationConstruct.dependencies);

            for(var i = 0, length = dependentEdges.length; i < length; i++)
            {
                this._changePropertyAccessPositions(dependentEdges[i].sourceNode, conflictedProperty.name, newName);
            }

            changedConstructs.forEach(function(changedConstruct)
            {
                ConflictFixerCommon.addCommentToParentStatement(changedConstruct, "Firecrow - Rename global property");

                this._changePropertyAccessPositions(changedConstruct, conflictedProperty.name, newName);

                if(ASTHelper.isProperty(changedConstruct.parent))
                {
                    this._changePropertyAccessPositions(changedConstruct.parent, conflictedProperty.name, newName);
                }

                var dependentEdges = changedConstruct.reverseDependencies.concat(changedConstruct.dependencies);

                for(var i = 0, length = dependentEdges.length; i < length; i++)
                {
                    this._changePropertyAccessPositions(dependentEdges[i].sourceNode, conflictedProperty.name, newName);
                }
            }, this);

            if(!conflictedProperty.isGlobalVariable) { return; }

            var undefinedGlobalPropertiesMap = pageAExecutionSummary.undefinedGlobalProperties;

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

                            ConflictFixerCommon.addCommentToParentStatement(identifier, "Firecrow - Rename global property");
                        }
                    }, this);
                }
            }
        }, this);
    },

    _traversedDependencies: {},

    _changePropertyAccessPositions: function(codeConstruct, oldName, newName)
    {
        if(codeConstruct == null) { return; }

        if(this._traversedDependencies[oldName] == null) { this._traversedDependencies[oldName] = {}; }
        if(this._traversedDependencies[oldName][codeConstruct.nodeId]) { return; }

        if(ASTHelper.isIdentifier(codeConstruct) && codeConstruct.name == oldName)
        {
            ConflictFixerCommon.addCommentToParentStatement(codeConstruct, "Firecrow - Rename global property");
            codeConstruct.name = newName;
        }
        else if (ASTHelper.isMemberExpression(codeConstruct) && codeConstruct.property.name == oldName)
        {
            ConflictFixerCommon.addCommentToParentStatement(codeConstruct, "Firecrow - Rename global property");
            codeConstruct.property.name = newName;
        }

        this._traversedDependencies[oldName][codeConstruct.nodeId] = true;

        var dependencies = codeConstruct.reverseDependencies;

        for(var i = 0; i < dependencies.length; i++)
        {
            var sourceNode = dependencies[i].sourceNode;

            this._changePropertyAccessPositions(sourceNode, oldName, newName);
        }

        this._changePropertyAccessPositions(ASTHelper.getParentAssignmentExpression(codeConstruct), oldName, newName);
    },

    _fixPrototypeConflicts: function(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary)
    {
        this._fixPrototypeSpilling(pageAModel, pageAExecutionSummary, pageBExecutionSummary.prototypeExtensions);
        this._fixPrototypeSpilling(pageBModel, pageBExecutionSummary, pageAExecutionSummary.prototypeExtensions);
    },

    _fixTypeOnlyDomSelectors: function(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary)
    {
        this._fixTypeOnlyDomSelectorsInApplication(pageAModel, pageAExecutionSummary, "r");
        this._fixTypeOnlyDomSelectorsInApplication(pageBModel, pageBExecutionSummary, null);
    },

    _fixEventHandlerProperties: function(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary)
    {
        var conflictedHandlers = this._getConflictedHandlers(pageAExecutionSummary, pageBExecutionSummary);

        if(conflictedHandlers.length == 0) { return; }

        conflictedHandlers.forEach(function(conflictedHandler)
        {
            this._replaceWithFirecrowHandler(conflictedHandler.pageAConflictConstruct);
            this._replaceWithFirecrowHandler(conflictedHandler.pageBConflictConstruct);
        }, this);

        this._insertFirecrowHandleConflictsCode(pageAModel, pageBModel);
    },

    _fixTypeOnlyDomSelectorsInApplication: function(pageModel, pageExecutionSummary, origin)
    {
        if(pageExecutionSummary == null) { return; }
        if(pageExecutionSummary.domQueriesMap == null) { return;}

        var attributeSelector = origin == "r" ? ConflictFixerCommon.generateReuseAttributeSelector()
                                              : ConflictFixerCommon.generateOriginalAttributeSelector();

        for(var domQueryProp in pageExecutionSummary.domQueriesMap)
        {
            var domQuery = pageExecutionSummary.domQueriesMap[domQueryProp];
            var callExpressionFirstArgument = ASTHelper.getFirstArgumentOfCallExpression(domQuery.codeConstruct);

            for(var selector in domQuery.selectorsMap)
            {
                //TODO - selector warning, possible problems with getElementsByTagName
                if(CssSelectorParser.containsTypeSelector(selector) && (domQuery.methodName == "querySelector" || domQuery.methodName == "querySelectorAll"))
                {
                    ConflictFixerCommon.replaceLiteralOrDirectIdentifierValue
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

    _getPropertyDeclarations: function(codeConstruct, propertyName)
    {
        var dependencies = codeConstruct.dependencies;
        var propertyDeclarations = [];

        for(var i = 0; i < dependencies.length; i++)
        {
            var destinationConstruct = dependencies[i].destinationNode;

            if(ASTHelper.isProperty(destinationConstruct.parent) && (destinationConstruct.name == propertyName))
            {
                propertyDeclarations.push(destinationConstruct.parent.key);
            }
        }

        return propertyDeclarations;
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
        for(var prototype in prototypeExtensions)
        {
            var prototypeExtension = prototypeExtensions[prototype];
            var forInIterations = this._getIterationsOverPrototype(pageExecutionSummary.forInIterations, prototype);
            this._fixIterationConstructs(forInIterations, prototypeExtension);
        }
    },

    _getIterationsOverPrototype: function(forInIterations, prototype)
    {
        var iterations = [];

        for(var nodeId in forInIterations)
        {
            var forInIteration = forInIterations[nodeId];

            if(forInIteration.prototypes[prototype])
            {
                iterations.push(forInIteration.codeConstruct);
            }
        }

        return iterations;
    },

    _fixIterationConstructs: function(forInIterations, prototypeExtension)
    {
        for(var i = 0; i < forInIterations.length; i++)
        {
            this._extendForInBody(forInIterations[i], prototypeExtension);
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
        var skipIterationConstructString = atob(ReuserTemplates._FOR_IN_SKIPPER);

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

    _replaceWithFirecrowHandler: function(codeConstruct)
    {
        var conflictCounter = this._CONFLICT_COUNTER;
        var handlerParent = null;
        var propertyNameParent = null;
        var conflictTemplate = ValueTypeHelper.deepClone(ReuserTemplates._HANDLER_CONFLICT_TEMPLATE);

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
                var message = "Null";
                if(codeConstruct != null)
                {
                    message = codeConstruct.type + " " + codeConstruct.loc.start.line
                            + " " + CodeTextGenerator.generateJsCode(codeConstruct)
                            + " " + CodeTextGenerator.generateJsCode(codeConstruct.parent);
                }

                console.log("Unhandled expression when replacing handlers:", message);
            }
        }

        this._CONFLICT_COUNTER++;
    },

    _insertFirecrowHandleConflictsCode: function(pageAModel, pageBModel)
    {
        var headElement = ASTHelper.getHeadElement(pageBModel);

        if(headElement == null) { console.log("There is no head element"); return; }

        var handlerMapperScript = ValueTypeHelper.deepClone(ReuserTemplates._HANDLER_MAPPER_SCRIPT_CREATION_TEMPLATE);

        ValueTypeHelper.insertIntoArrayAtIndex(headElement.childNodes, handlerMapperScript, 0);

        var bodyElement = ASTHelper.getBodyElement(pageAModel);

        if(bodyElement == null) { console.log("There is no body element"); return; }

        var scriptInvokerScriptElement =
        {
            type: "script", childNodes:[], attributes:[{name:"o", value: "Firecrow"}],
            sourceCode: atob(ReuserTemplates._HANDLER_MAPPER_SCRIPT_INVOKER),
            shouldBeIncluded: true
        };

        bodyElement.childNodes.push(scriptInvokerScriptElement);
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
                    conflictingHandlers.push
                    ({
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

        var conflictedProperties = [];

        var pageAGlobalProperties = pageAExecutionSummary.userSetGlobalProperties;
        var pageBGlobalProperties = pageBExecutionSummary.userSetGlobalProperties;

        for(var i = 0; i < pageBGlobalProperties.length; i++)
        {
            var pageBProperty = pageBGlobalProperties[i];

            for(var j = 0; j < pageAGlobalProperties.length; j++)
            {
                var pageAGlobalProperty = pageAGlobalProperties[j];

                if(pageAGlobalProperty.name == pageBProperty.name && !pageAGlobalProperty.isEventProperty)
                {
                    pageAGlobalProperty.isGlobalVariable = true;
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
                    pageAProperty.isInternalObjectVariable = true;
                    conflictedProperties.push(pageAProperty);
                }
            }
        }

        var pageAPrototypeExtensions = pageAExecutionSummary.prototypeExtensions || {};
        var pageBPrototypeExtensions = pageBExecutionSummary.prototypeExtensions || {};

        for(var prototypeAExtension in pageAExecutionSummary.prototypeExtensions)
        {
            var pageAPrototypeExtension = pageAPrototypeExtensions[prototypeAExtension];
            var pageBPrototypeExtension = pageBPrototypeExtensions[prototypeAExtension];

            if(pageBPrototypeExtension != null)
            {
                for(var i = 0; i < pageAPrototypeExtension.length; i++)
                {
                    var pageAExtension = pageAPrototypeExtension[i];
                    for(var j = 0; j < pageBPrototypeExtension.length; j++)
                    {
                        if(pageAExtension.name == pageBPrototypeExtension[j].name)
                        {
                            pageAPrototypeExtension.isInternalObjectVariable = true;
                            pageAPrototypeExtension.isInternalPrototypeVariable = true;

                            conflictedProperties.push(pageAExtension);
                        }
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
    }
};

exports.JsConflictFixer = JsConflictFixer;