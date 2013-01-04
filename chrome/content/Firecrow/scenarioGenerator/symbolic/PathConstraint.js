FBL.ns(function() { with (FBL) {
/*****************************************************/
var ASTHelper = Firecrow.ASTHelper;
var fcSymbolic = Firecrow.ScenarioGenerator.Symbolic;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcSymbolic.PathConstraintItem = function(codeConstruct, constraint)
{
    this.id = fcSymbolic.PathConstraintItem.LAST_ID++

    this.codeConstruct = codeConstruct;
    this.constraint = constraint;
};

fcSymbolic.PathConstraintItem.areEqual = function(pathConstraintItemA, pathConstraintItemB)
{
    if(pathConstraintItemA == null || pathConstraintItemB == null) { return false; }

    return pathConstraintItemA.codeConstruct == pathConstraintItemB.codeConstruct
        && pathConstraintItemA.constraint.toString().replace(/_FC_[0-9+]/gi, "") == pathConstraintItemB.constraint.toString().replace(/_FC_[0-9+]/gi, "");
};

fcSymbolic.PathConstraintItem.LAST_ID = 0;

fcSymbolic.PathConstraintItem.prototype =
{
    toString: function()
    {
        return this.constraint.toString();
    }
};

fcSymbolic.PathConstraint = function(pathConstraintItems)
{
    this.pathConstraintItems = pathConstraintItems || [];
    this.resolvedResult = null;
};

fcSymbolic.PathConstraint.RESOLVED_MAPPING = { takenPaths: []};

fcSymbolic.PathConstraint.resolvePathConstraints = function(pathConstraints)
{
    var symbolicExpressionsList = [];

    for(var i = 0; i < pathConstraints.length; i++)
    {
        var pathConstraint = pathConstraints[i];

        symbolicExpressionsList.push(pathConstraint.pathConstraintItems.filter(function(item)
        {
            return item.constraint != null;
        }).map(function(item)
        {
            return item.constraint;
        }));
    }

    var results = fcSymbolic.ConstraintResolver.resolveConstraints(symbolicExpressionsList);

    for(var i = 0; i < pathConstraints.length; i++)
    {
        pathConstraints[i].resolvedResult = this._groupByIndex(results[i]);
    }
};

fcSymbolic.PathConstraint._groupByIndex = function(result)
{
    var mappedObject = {};

    for(var propName in result)
    {
        var match = propName.match(/_FC_([0-9+])$/);
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

fcSymbolic.PathConstraint.prototype =
{
    addConstraint: function(codeConstruct, constraint, inverse)
    {
        if(inverse)
        {
            constraint = fcSymbolic.ConstraintResolver.getInverseConstraint(constraint);
        }

        this.pathConstraintItems.push(new fcSymbolic.PathConstraintItem(codeConstruct, constraint));
    },

    getAllResolvedInversions: function()
    {
        var pathConstraintItems = this.pathConstraintItems;
        var allInversions = [];

        for(var i = pathConstraintItems.length - 1; i >= 0; i--)
        {
            var currentPathConstraintItem = pathConstraintItems[i];

            var previousItems = pathConstraintItems.slice(0, i);

            previousItems.push(new fcSymbolic.PathConstraintItem(currentPathConstraintItem.codeConstruct, fcSymbolic.ConstraintResolver.getInverseConstraint(currentPathConstraintItem.constraint)));
            allInversions.push(new fcSymbolic.PathConstraint(previousItems));
        }

        fcSymbolic.PathConstraint.resolvePathConstraints(allInversions);

        return allInversions;
    },

    resolve: function()
    {
        var pathConstraintItems = this.pathConstraintItems;

        if(pathConstraintItems.length == 0) { return null; }

        var pathConstraintId = this.getPathConstraintId();

        this._createPathConstraintResolvedMapping(pathConstraintId);

        var constraintFormula = this._getConstraintsFormula(pathConstraintItems);

        if(fcSymbolic.PathConstraint.RESOLVED_MAPPING.takenPaths.indexOf(constraintFormula) == -1)
        {
            fcSymbolic.PathConstraint.RESOLVED_MAPPING.takenPaths.push(constraintFormula);
        }

        var combinationsDescription = this._getCombinationsDescription(pathConstraintId, pathConstraintItems, constraintFormula);

        var pathConstraintItems = this._createPathConstraintItemsCopy(combinationsDescription.pathConstraintItems);
        var constraintFormula = combinationsDescription.constraintFormula;

        var currentCombination = combinationsDescription.allCombinations[combinationsDescription.currentCombinationIndex++];

        if(currentCombination == null)
        {
            this.resolvedResult = null;
            return;
        }

        this._updateConstraints(pathConstraintItems, currentCombination);

        var modifiedConstraintsFormula = this._getConstraintsFormula(pathConstraintItems);

        if(fcSymbolic.PathConstraint.RESOLVED_MAPPING.takenPaths.indexOf(modifiedConstraintsFormula) != -1)
        {
            this.resolve();
        }

        this._cacheGeneratedBy(pathConstraintId, modifiedConstraintsFormula, combinationsDescription);

        this.resolvedResult = fcSymbolic.ConstraintResolver.resolveConstraints
        (
            pathConstraintItems.filter(function(item)
            {
                return item.constraint != null;
            }).map(function(item)
            {
                return item.constraint;
            })
        );

        if(!this._canGetResultsForAllVariables())
        {
            this.resolve();
        }
    },

    _createPathConstraintItemsCopy: function(pathConstraintItems)
    {
        var array = [];

        for(var i = 0; i < pathConstraintItems.length; i++)
        {
            var currentItem = pathConstraintItems[i];
            array.push(new fcSymbolic.PathConstraintItem(currentItem.codeConstruct, currentItem.constraint));
        }

        return array;
    },

    _canGetResultsForAllVariables: function()
    {
        if(this.resolvedResult == null || this.resolvedResult.length == 0) { return false; }

        for(var i = 0; i < this.resolvedResult.length; i++)
        {
            if(this.resolvedResult[i].getValue() == null) { return false; }
        }

        return true;
    },

    _createPathConstraintResolvedMapping: function(pathConstraintId)
    {
        if(fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId] == null)
        {
            fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId] =
            {
                GENERATED_BY_MAPPING: {}
            };
        }
    },

    getPathConstraintId: function()
    {
        var id = "";

        for(var i = 0; i < this.pathConstraintItems.length; i++)
        {
            if(i != 0) { id +="_";}

            id += this.pathConstraintItems[i].codeConstruct.nodeId;
        }

        return id;
    },

    _updateConstraints: function(pathConstraintItems, currentCombination)
    {
        for(var i = 0; i < currentCombination.length; i++)
        {
            var pathConstraintItem = pathConstraintItems[i];

            if(pathConstraintItem == null) { continue; }

            if(currentCombination[i] == 1)
            {
                //Now that this constraint is changed the child pathConstraints have to be invalidated
                pathConstraintItem.constraint = fcSymbolic.ConstraintResolver.getInverseConstraint(pathConstraintItem.constraint);
                this._invalidateFollowingItems(i + 1, pathConstraintItems)
            }
        }

        ValueTypeHelper.clearArray(pathConstraintItems);
    },

    _invalidateFollowingItems: function(startIndex, pathConstraintItems)
    {
        for(var i = startIndex; i < pathConstraintItems.length; i++)
        {
            pathConstraintItems[i] = null;
        }
    },

    _getConstraintsFormula: function(pathConstraintItems)
    {
        return pathConstraintItems.map(function(pathConstraintItem){ return pathConstraintItem.constraint; }).join(" && ").replace(/_FC_[0-9]+/gi, "");
    },

    _cacheGeneratedBy: function(pathConstraintId, modifiedConstraintsFormula, combinationsDescription)
    {
        fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId].GENERATED_BY_MAPPING[modifiedConstraintsFormula] = combinationsDescription;
    },

    _getCombinationsDescription: function(pathConstraintId, pathConstraintItems, constraintFormula)
    {
        if(fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId].GENERATED_BY_MAPPING[constraintFormula] == null)
        {
            if(fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId][constraintFormula] == null)
            {
                fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId][constraintFormula] = {
                    allCombinations: this._generateAllFlipCombinations(this.pathConstraintItems),
                    currentCombinationIndex: 0,
                    pathConstraintItems: pathConstraintItems,
                    constraintFormula: constraintFormula
                };
            }

            return fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId][constraintFormula];
        }
        else
        {
            return fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId].GENERATED_BY_MAPPING[constraintFormula];
        }
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
/*****************************************************/
}});