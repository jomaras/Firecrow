FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcSymbolic = Firecrow.Symbolic;
var ASTHelper = Firecrow.ASTHelper;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcSymbolic.PathConstraintItem = function(codeConstruct, constraint)
{
    this.id = fcSymbolic.PathConstraintItem.LAST_ID++

    this.codeConstruct = codeConstruct;
    this.constraint = constraint;
    this.pathConstraintChildren = [];
};

fcSymbolic.PathConstraintItem.areEqual = function(pathConstraintItemA, pathConstraintItemB)
{
    if(pathConstraintItemA == null || pathConstraintItemB == null) { return false; }

    return pathConstraintItemA.codeConstruct == pathConstraintItemB.codeConstruct
        && pathConstraintItemA.constraint.toString().replace(/_FC_[0-9+]/gi, "") == pathConstraintItemB.constraint.toString().replace(/_FC_[0-9+]/gi, "");
};

fcSymbolic.PathConstraintItem.LAST_ID = 0;

fcSymbolic.PathConstraint = function()
{
    this.pathConstraintItems = [];
    this.resolvedResult = null;
};

fcSymbolic.PathConstraint.RESOLVED_MAPPING = {};

fcSymbolic.PathConstraint.prototype =
{
    addConstraint: function(codeConstruct, constraint, inverse)
    {
        if(inverse)
        {
            constraint = fcSymbolic.ConstraintResolver.getInverseConstraint(constraint);
        }

        var pathConstraintItem = new fcSymbolic.PathConstraintItem(codeConstruct, constraint);

        var lastAncestorConstraint = this._getLastAncestorConstraint(codeConstruct);

        if(lastAncestorConstraint != null)
        {
            lastAncestorConstraint.pathConstraintChildren.push(pathConstraintItem);
        }

        this.pathConstraintItems.push(pathConstraintItem);
    },

    _getLastAncestorConstraint: function(codeConstruct)
    {
        for(var i = this.pathConstraintItems.length - 1; i >= 0; i--)
        {
            var pathConstraintItem = this.pathConstraintItems[i];

            if(ASTHelper.isAncestor(codeConstruct, pathConstraintItem.codeConstruct))
            {
                return pathConstraintItem;
            }
        }

        return null;
    },

    resolve: function()
    {
        var pathConstraintItems = this.pathConstraintItems;

        if(pathConstraintItems.length == 0) { return null; }

        var pathConstraintId = this.getPathConstraintId();

        this._createPathConstraintResolvedMapping(pathConstraintId);

        var constraintFormula = this._getConstraintsFormula(pathConstraintItems);

        var combinationsDescription = this._getCombinationsDescription(pathConstraintId, pathConstraintItems, constraintFormula);

        var pathConstraintItems = this._createPathConstraintItemsCopy(combinationsDescription.pathConstraintItems);
        var constraintFormula = combinationsDescription.constraintFormula;

        console.log("From: " + constraintFormula);

        var currentCombination = combinationsDescription.allCombinations[combinationsDescription.currentCombinationIndex++];

        if(currentCombination == null)
        {
            this.resolvedResult = null;
            return;
        }

        this._updateConstraints(pathConstraintItems, currentCombination);

        var modifiedConstraintsFormula = this._getConstraintsFormula(pathConstraintItems);

        this._cacheGeneratedBy(pathConstraintId, modifiedConstraintsFormula, combinationsDescription);

        console.log("To: " + modifiedConstraintsFormula);

        this.resolvedResult = fcSymbolic.ConstraintResolver.resolveConstraints(pathConstraintItems.map(function(item){ return item.constraint; }));

        console.log("Result: " + this.resolvedResult);

        if(!this._canGetResultsForAllVariables())
        {
            this.resolve();
        }
    },

    _createPathConstraintItemsCopy: function(pathConstraintItems)
    {
        var array = [];

        var mapping = { };

        for(var i = 0; i < pathConstraintItems.length; i++)
        {
            var currentItem = pathConstraintItems[i];
            var copiedItem = new fcSymbolic.PathConstraintItem(currentItem.codeConstruct, currentItem.constraint);

            mapping[currentItem.id] = copiedItem;
            mapping[copiedItem.id] = currentItem;

            array.push(copiedItem);
        }

        for(var i = 0; i < array.length; i++)
        {
            var copiedItem = array[i];

            var originalItem = mapping[copiedItem.id];

            for(var j = 0; j < originalItem.pathConstraintChildren.length; j++)
            {
                var originalItemChild = originalItem.pathConstraintChildren[j];

                copiedItem.pathConstraintChildren.push(mapping[originalItemChild.id]);
            }
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
                this._invalidateAllChildren(pathConstraintItem, pathConstraintItems);
            }
        }

        ValueTypeHelper.clearArray(pathConstraintItems);
    },

    _invalidateAllChildren: function(pathConstraintItem, pathConstraintItems)
    {
        pathConstraintItem.pathConstraintChildren.forEach(function(child)
        {
            pathConstraintItems[pathConstraintItems.indexOf(child)] = null;

            this._invalidateAllChildren(child, pathConstraintItems);
        }, this);
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
    }
};
/*****************************************************/
}});