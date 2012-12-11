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
        var constraints = this.pathConstraintItems.map(function(pathConstraintItem) { return pathConstraintItem.constraint; });
        if(constraints.length == 0) { return null; }

        var pathConstraintId = this.getPathConstraintId();

        if(fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId] == null)
        {
            fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId] =
            {
                GENERATED_BY_MAPPING: {}
            };
        }

        var constraintFormula = constraints.join(" && ").replace(/_FC_[0-9]+/gi, "");

        if(fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId].GENERATED_BY_MAPPING[constraintFormula] == null)
        {
            if(fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId][constraintFormula] == null)
            {
                fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId][constraintFormula] = {
                    allCombinations: this._generateAllFlipCombinations(),
                    currentCombinationIndex: 1, //Ignore 0 - that is 000 - nothing is being changed
                    constraints: constraints.slice(),
                    constraintFormula: constraintFormula
                };
            }

            var combinationsDescription = fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId][constraintFormula];
        }
        else
        {
            var combinationsDescription = fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId].GENERATED_BY_MAPPING[constraintFormula];
            constraints = combinationsDescription.constraints.slice();
            constraintFormula = combinationsDescription.constraintFormula;
        }

        console.log("From: " + constraintFormula);

        var currentCombination = combinationsDescription.allCombinations[combinationsDescription.currentCombinationIndex];

        if(currentCombination == null) { return; }

        for(var i = 0; i < currentCombination.length; i++)
        {
            if(currentCombination[i] == 1)
            {
                constraints[i] = fcSymbolic.ConstraintResolver.getInverseConstraint(constraints[i]);
            }
        }

        var modifiedConstraintsFormula = constraints.join(" && ").replace(/_FC_[0-9]+/gi, "");

        fcSymbolic.PathConstraint.RESOLVED_MAPPING[pathConstraintId].GENERATED_BY_MAPPING[modifiedConstraintsFormula] = combinationsDescription;

        console.log("To: " + modifiedConstraintsFormula);

        this.resolvedResult = fcSymbolic.ConstraintResolver.resolveConstraints(constraints);

        combinationsDescription.currentCombinationIndex++;

        if(isNaN(this.resolvedResult.getValue()))
        {
            this.resolve();
        }

        console.log("Result: " + this.resolvedResult);
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

    _generateAllFlipCombinations: function()
    {
        var combinationsCount = Math.pow(2, this.pathConstraintItems.length);
        var allCombinations = [];

        for(var i = 0; i < combinationsCount; i++)
        {
            allCombinations.push(this._convertBinaryStringToArray(i.toString("2"), this.pathConstraintItems.length));
        }

        return allCombinations;
    },

    _convertBinaryStringToArray: function(binaryString, arrayLength)
    {
        var binaryArray = [];

        for(var i = 0; i < arrayLength - binaryString.length; i++)
        {
            binaryArray.push(0);
        }

        for(var i = 0; i < binaryString.length; i++)
        {
            binaryArray.push(binaryString[i]);
        }

        return binaryArray;
    }
};
/*****************************************************/
}});