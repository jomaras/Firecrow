var ASTHelper = require("C:\\GitWebStorm\\Firecrow\\chrome\\content\\Firecrow\\helpers\\ASTHelper.js").ASTHelper;
var ValueTypeHelper = require("C:\\GitWebStorm\\Firecrow\\chrome\\content\\Firecrow\\helpers\\ValueTypeHelper.js").ValueTypeHelper;
var ScenarioGeneratorHelper = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\ScenarioGeneratorHelper.js").ScenarioGeneratorHelper;
var ConstraintResolverModule = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\ConstraintResolver.js");
var ExpressionModule = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\Expression.js");

function PathConstraintItem(codeConstruct, constraint)
{
    this.id = PathConstraintItem.LAST_ID++

    this.codeConstruct = codeConstruct;
    this.constraint = constraint;

    if(constraint == null) { debugger; }
};

PathConstraintItem.areEqual = function(pathConstraintItemA, pathConstraintItemB)
{
    if(pathConstraintItemA == null || pathConstraintItemB == null) { return false; }

    return pathConstraintItemA.codeConstruct == pathConstraintItemB.codeConstruct
        && ScenarioGeneratorHelper.replaceSuffix(pathConstraintItemA.constraint.toString(), "") == ScenarioGeneratorHelper.replaceSuffix(pathConstraintItemB.constraint.toString(), "");
};

PathConstraintItem.LAST_ID = 0;
PathConstraintItem.fromObjectLiteral = function(objectLiteral, pageModelMapping)
{
    return new PathConstraintItem(pageModelMapping[objectLiteral.codeConstructId], ExpressionModule.Expression.fromObjectLiteral(objectLiteral.constraint));
};

PathConstraintItem.prototype =
{
    getSymbolicIdentifierNameMap: function()
    {
        if(this.constraint == null) { return {}; }

        var map = {};
        var identifierNames = this.constraint.getIdentifierNames();

        for(var i = 0; i < identifierNames.length; i++)
        {
            map[identifierNames[i]] = true;
        }

        return map;
    },

    toString: function()
    {
        try
        {
            return this.constraint.toString();
        }
        catch(e) { debugger; }
    },

    createCopyUpgradedByIndex: function(upgradeByIndex)
    {
        return new PathConstraintItem(this.codeConstruct, this.constraint.createCopyUpgradedByIndex(upgradeByIndex))
    },

    createCopyWithIndex: function(index)
    {
        return new PathConstraintItem(this.codeConstruct, this.constraint.createCopyWithIndex(index));
    }
};

function PathConstraint (pathConstraintItems, resolvedResult)
{
    this.id = PathConstraint.LAST_ID++;
    this.pathConstraintItems = pathConstraintItems || [];
    this.resolvedResult = resolvedResult || {};
};

PathConstraint.LAST_ID = 0;
PathConstraint.RESOLVED_MAPPING = { takenPaths: []};

PathConstraint.resolvePathConstraints = function(pathConstraints)
{
    var symbolicExpressionsList = [];

    for(var i = 0; i < pathConstraints.length; i++)
    {
        var pathConstraint = pathConstraints[i];

        var constrainedItems = [];

        for(var j = 0; j < pathConstraint.pathConstraintItems.length; j++)
        {
            var item = pathConstraint.pathConstraintItems[j];

            if(item.constraint != null)
            {
                constrainedItems.push(item.constraint);
            }
        }

        symbolicExpressionsList.push(constrainedItems);
    }

    var results = ConstraintResolverModule.ConstraintResolver.resolveConstraints(symbolicExpressionsList);

    for(var i = 0; i < pathConstraints.length; i++)
    {
        var current = results[i];

        var groupedByIndex = this.groupSolutionsByIndex(current);

        if(ValueTypeHelper.isEmptyObject(groupedByIndex))
        {
            ValueTypeHelper.removeFromArrayByIndex(pathConstraints, i);
            ValueTypeHelper.removeFromArrayByIndex(results, i);
            i--;
            continue;
        }

        pathConstraints[i].resolvedResult = groupedByIndex;
    }
};

PathConstraint.groupSolutionsByIndex = function(result)
{
    var mappedObject = {};

    for(var propName in result)
    {
        var match = propName.match(/_FC_([0-9+])/);
        var index = match[1];

        if(index)
        {
            if(mappedObject[index] == null)
            {
                mappedObject[index] = {};
            }

            mappedObject[index][propName] = result[propName];
        }
    }

    return mappedObject;
};

PathConstraint.fromObjectLiteral = function(objectLiteral, pageModelMapping)
{
    var pathConstraintItems = [];

    for(var i = 0; i < objectLiteral.pathConstraintItems.length; i++)
    {
        pathConstraintItems.push(PathConstraintItem.fromObjectLiteral(objectLiteral.pathConstraintItems[i], pageModelMapping));
    }

    return new PathConstraint(pathConstraintItems);
};

PathConstraint.prototype =
{
    getLastPathConstraintItemCodeConstruct: function()
    {
        var lastItem = this.pathConstraintItems[this.pathConstraintItems.length - 1];

        if(lastItem == null) { return null; }

        return lastItem.codeConstruct;
    },

    addConstraint: function(codeConstruct, constraint, inverse)
    {
        this.addPathConstraintItem(this._createConstraint(codeConstruct, constraint, inverse));
    },

    addSolutionIfNotExistent: function(identifier, value)
    {
        var match = identifier.match(/_FC_([0-9+])/);

        if(match == null) { debugger; }

        var index = match[1];

        if(index)
        {
            if(this.resolvedResult[index] == null)
            {
                this.resolvedResult[index] = {};
            }

            if(this.resolvedResult[index][identifier] == null)
            {
                this.resolvedResult[index][identifier] = value;
            }

        }
    },

    addPathConstraintItem: function(pathConstraintItem)
    {
        var sameConstraint = this._getSameConstraint(pathConstraintItem);

        if(sameConstraint != null)
        {
            sameConstraint.constraint.isIrreversible = sameConstraint.constraint.isIrreversible || pathConstraintItem.constraint.isIrreversible;
        }
        else
        {
            this.pathConstraintItems.push(pathConstraintItem);
        }
    },

    addPathConstraintItemToBeginning: function(pathConstraintItem)
    {
        var sameConstraint = this._getSameConstraint(pathConstraintItem);

        if(sameConstraint != null)
        {
            sameConstraint.constraint.isIrreversible = sameConstraint.constraint.isIrreversible || pathConstraintItem.constraint.isIrreversible;
        }
        else
        {
            ValueTypeHelper.insertIntoArrayAtIndex(this.pathConstraintItems, pathConstraintItem, 0);
        }
    },

    _getSameConstraint: function(pathConstraintItem)
    {
        var pathConstraintItemString = pathConstraintItem.toString();

        for(var i = 0; i < this.pathConstraintItems.length; i++)
        {
            if(this.pathConstraintItems[i].toString() == pathConstraintItemString)
            {
                return this.pathConstraintItems[i];
            }
        }

        return null;
    },

    getImmutableConstraints: function()
    {
        var notInvertedConstraints = [];

        for(var i = 0; i < this.pathConstraintItems.length; i++)
        {
            if(this.pathConstraintItems[i].constraint.isIrreversible)
            {
                notInvertedConstraints.push(this.pathConstraintItems[i]);
            }
        }

        return notInvertedConstraints;
    },

    _createConstraint: function(codeConstruct, constraint, inverse)
    {
        if(inverse)
        {
            constraint = ConstraintResolverModule.ConstraintResolver.getInverseConstraint(constraint);
        }

        return new PathConstraintItem(codeConstruct, constraint);
    },

    getSymbolicIdentifierNameMap: function()
    {
        var identifierNamesMap = {};

        for(var i = 0; i < this.pathConstraintItems.length; i++)
        {
            ValueTypeHelper.expand(identifierNamesMap, this.pathConstraintItems[i].getSymbolicIdentifierNameMap());
        }

        return identifierNamesMap;
    },

    createCopy: function()
    {
        return this.createCopyUpgradedByIndex(0);
    },

    createSingleItemBasedOnIndex: function(pathItemIndex, newIndex)
    {
        var pathConstraintItems = [];
        var resolvedResult = null;

        var pathConstraintItem = this.pathConstraintItems[pathItemIndex];

        if(pathConstraintItem == null) { return new PathConstraint(pathConstraintItems, resolvedResult); }

        pathConstraintItems.push(pathConstraintItem.createCopyWithIndex(newIndex));

        if(this.resolvedResult[pathItemIndex] == null) { return new PathConstraint(pathConstraintItems, resolvedResult); }

        var upgradedResult = {};
        resolvedResult = {};

        for(var propName in this.resolvedResult[pathItemIndex])
        {
            upgradedResult[ScenarioGeneratorHelper.updatePropertyNameWithNewIndex(propName, newIndex)] = this.resolvedResult[pathItemIndex][propName];
        }

        resolvedResult[newIndex] = upgradedResult;

        return new PathConstraint(pathConstraintItems, resolvedResult);
    },

    createCopyUpgradedByIndex: function(upgradeByIndex)
    {
        var pathConstraintItems = [];
        var resolvedResult = null;

        for(var i = 0, length = this.pathConstraintItems.length; i < length; i++)
        {
            pathConstraintItems.push(this.pathConstraintItems[i].createCopyUpgradedByIndex(upgradeByIndex));
        }

        if(!ValueTypeHelper.isEmptyObject(this.resolvedResult))
        {
            resolvedResult = {};

            for(var index in this.resolvedResult)
            {
                var result = this.resolvedResult[index];
                var upgradedResult = {};

                for(var propName in result)
                {
                    upgradedResult[ScenarioGeneratorHelper.addToPropertyName(propName, upgradeByIndex)] = result[propName];
                }

                resolvedResult[parseInt(index) + upgradeByIndex] = upgradedResult;
            }
        }

        return new PathConstraint(pathConstraintItems, resolvedResult);
    },

    append: function(pathConstraint)
    {
        var itemsToAdd = pathConstraint.pathConstraintItems;

        for(var i = 0, length = itemsToAdd.length; i < length; i++)
        {
            this.pathConstraintItems.push(itemsToAdd[i]);
        }

        for(var resultIndex in pathConstraint.resolvedResult)
        {
            this.resolvedResult[resultIndex] = pathConstraint.resolvedResult[resultIndex];
        }
    },

    getAllResolvedInversions: function()
    {
        var pathConstraintItems = this.pathConstraintItems;
        var allInversions = [];

        //var flipCombinations = this._generateAllFlipCombinations(pathConstraintItems);

        for(var i = pathConstraintItems.length - 1; i >= 0; i--)
        {
            var currentPathConstraintItem = pathConstraintItems[i];

            if(currentPathConstraintItem.constraint == null) { continue; }
            if(currentPathConstraintItem.constraint.isIrreversible) { continue; } //TODO NOT SURE ABOUT IT

            var modifiedConstraint = !currentPathConstraintItem.constraint.isIrreversible ? ConstraintResolverModule.ConstraintResolver.getInverseConstraint(currentPathConstraintItem.constraint)
                                                                                          : ConstraintResolverModule.ConstraintResolver.getStricterConstraint(currentPathConstraintItem.constraint);

            if(modifiedConstraint == null) { continue; }

            var previousItems = pathConstraintItems.slice(0, i);

            previousItems.push(new PathConstraintItem(currentPathConstraintItem.codeConstruct, modifiedConstraint));
            allInversions.push(new PathConstraint(previousItems));
        }

        PathConstraint.resolvePathConstraints(allInversions);

        return allInversions;
    },


    _generateAllFlipCombinations: function(pathConstraintItems)
    {
        var maskLength = pathConstraintItems.length;

        var mask = "";

        for(var i = 0; i < maskLength; i++) { mask += "0"; }

        var allCombinations = [];

        for(var i = maskLength - 1; i >= 0; i--)
        {
            var maskAsArray = this._convertStringToArray(mask);

            maskAsArray[i] = maskAsArray[i] == 0 ? 1 : 0;

            allCombinations.push(maskAsArray);
        }

        return allCombinations;
    },

    _convertStringToArray: function(binaryString)
    {
        var binaryArray = [];

        for(var i = 0; i < binaryString.length; i++)
        {
            binaryArray.push(parseInt(binaryString[i]));
        }

        return binaryArray;
    },

    toString: function()
    {
        var string = "";

        for(var i = 0; i < this.pathConstraintItems.length; i++)
        {
            if(i != 0) { string += ", "; }

            string += this.pathConstraintItems[i].toString();
        }

        return string;
    }
};

exports.PathConstraintItem = PathConstraintItem;
exports.PathConstraint = PathConstraint;