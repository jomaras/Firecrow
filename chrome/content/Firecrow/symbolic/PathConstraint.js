FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcSymbolic = Firecrow.Symbolic;

fcSymbolic.PathConstraintItem = function(codeConstruct, constraint)
{
    this.codeConstruct = codeConstruct;
    this.constraint = constraint;
};

fcSymbolic.PathConstraintItem.areEqual = function(pathConstraintItemA, pathConstraintItemB)
{
    if(pathConstraintItemA == null || pathConstraintItemB == null) { return false; }

    return pathConstraintItemA.codeConstruct == pathConstraintItemB.codeConstruct
        && pathConstraintItemA.constraint.toString().replace(/_FC_[0-9+]/gi, "") == pathConstraintItemB.constraint.toString().replace(/_FC_[0-9+]/gi, "");
};

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

        this.pathConstraintItems.push(pathConstraintItem);
    },

    resolve: function()
    {
        //The main idea of the algorithm
        /**
         * A Path Constraint is a chain of code construct, symbolic expression that was taken in order to go through the path
         * Normally, the symbolic execution literature proposes the following procedure
         * E.G. keyCode != 82 && keyCode != 71 && keyCode != 66 - if this is a path constraint through the application
         * then in order to resolve that constraint and obtain a new value, we take the last expression (keyCode != 66)
         * and negate it - thereby obtaining keyCode == 66. That is ok
         * But if we go to next iteration: the pathConstraint is keyCode != 82 && keyCode != 71 && keyCode == 66 (previously generated)
         * and to obtain the new path we should invert the last one (keyCode == 66), thereby obtaining keyCode != 66, which takes us back to beginning
         *
         * In order to tackle that i decided to cache the results, so each formula for a given path through the application is cached
         * fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId] (pathConstraintId - defines how it goes through the application)
         * And the idea is to generate all modifications for a given path constraint
         * E.g. for keyCode != 82 && keyCode != 71 && keyCode != 66 (invert != 65; invert !=71; invert !=65 && !=71; etc...)
         * For each new formula we also cache from which formula it was generated from .GENERATED_BY_MAPPING property
         * And then when a derived formula is encountered, e.g. keyCode != 82 && keyCode != 71 && keyCode == 66
         * The next formula is not generated based on it, but based on the originating formula: keyCode != 82 && keyCode != 71 && keyCode != 66
         * So when keyCode != 82 && keyCode != 71 && keyCode == 66 appears, check the cache for the originating formula; find: keyCode != 82 && keyCode != 71 && keyCode != 66
         * See that from all possible formulas from that formula we have gone only though the first one; and then generate the second one: keyCode != 82 && keyCode == 71 && keyCode != 66
         * And so on..
         * if the final result is a rangeChain with no results, then automatically attempt for the next iteration (recursively call the function)
         *
         * Now i have the problem of too many combinations - I'll have to adjust
         * E.g from one test:
         * if (evt.keyCode == 77)
            motion = (motion + 1) % 2;
           if (evt.keyCode == 82)
            colore = 'rgb(255,0,0)';
           if (evt.keyCode == 71)
            colore = 'rgb(0,255,0)';
           .... (x16 conditions)
         * The test has 16 conditions that could have been written as a series of else if - they depend on the same variable - But they are not
         * And this generates a 16 bit mask for flipping expressions - waaay too much
         * So.. maybe i should group the ones that have the same identifier in the formula, and then not generate all possible combinations
         * But just flip one - maintain others - so for these 16 there would be only 16 masks instead of 2^16
         */
        var constraints = this.pathConstraintItems.map(function(pathConstraintItem) { return pathConstraintItem.constraint; });

        if(constraints.length == 0) { return null; }

        var pathConstraintId = this.getPathConstraintId();

        this._createPathConstraintResolvedMapping(pathConstraintId);

        var constraintFormula = this._getConstraintsFormula(constraints);

        var combinationsDescription = this._getCombinationsDescription(pathConstraintId, constraints, constraintFormula);

        var constraints = combinationsDescription.constraints.slice();
        var constraintFormula = combinationsDescription.constraintFormula;

        console.log("From: " + constraintFormula);

        var currentCombination = combinationsDescription.allCombinations[combinationsDescription.currentCombinationIndex++];

        if(currentCombination == null)
        {
            this.resolvedResult = null;
            return;
        }

        this._updateConstraints(constraints, currentCombination);

        var modifiedConstraintsFormula = this._getConstraintsFormula(constraints);

        this._cacheGeneratedBy(pathConstraintId, modifiedConstraintsFormula, combinationsDescription);

        console.log("To: " + modifiedConstraintsFormula);

        this.resolvedResult = fcSymbolic.ConstraintResolver.resolveConstraints(constraints);

        console.log("Result: " + this.resolvedResult);

        if(this.resolvedResult.getValue() == null)
        {
            this.resolve();
        }
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

    _updateConstraints: function(constraints, currentCombination)
    {
        for(var i = 0; i < currentCombination.length; i++)
        {
            if(currentCombination[i] == 1)
            {
                constraints[i] = fcSymbolic.ConstraintResolver.getInverseConstraint(constraints[i]);
            }
        }
    },

    _getConstraintsFormula: function(constraints)
    {
        return constraints.join(" && ").replace(/_FC_[0-9]+/gi, "");
    },

    _cacheGeneratedBy: function(pathConstraintId, modifiedConstraintsFormula, combinationsDescription)
    {
        fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId].GENERATED_BY_MAPPING[modifiedConstraintsFormula] = combinationsDescription;
    },

    _getCombinationsDescription: function(pathConstraintId, constraints, constraintFormula)
    {
        if(fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId].GENERATED_BY_MAPPING[constraintFormula] == null)
        {
            if(fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId][constraintFormula] == null)
            {
                fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId][constraintFormula] = {
                    allCombinations: this._generateAllFlipCombinations(),
                    currentCombinationIndex: 0,
                    constraints: constraints.slice(),
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

    _generateAllFlipCombinations: function()
    {
        var maskLength = this.pathConstraintItems.length;

        var mask = "";
        for(var i = 0; i < maskLength; i++) { mask += "0"; }

        var allCombinations = [];

        for(var i = maskLength - 1; i >= 0; i--)
        {
            var maskAsArray = this._convertBinaryStringToArray(mask);

            maskAsArray[i] = maskAsArray[i] == "0" ? "1" : "0";

            allCombinations.push(maskAsArray);
        }

        return allCombinations;
    },

    _convertBinaryStringToArray: function(binaryString)
    {
        var binaryArray = [];

        for(var i = 0; i < binaryString.length; i++)
        {
            binaryArray.push(binaryString[i]);
        }

        return binaryArray;
    }
};
/*****************************************************/
}});