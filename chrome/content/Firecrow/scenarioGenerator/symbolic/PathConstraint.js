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
        var groupedByIndex = this._groupByIndex(results[i]);

        if(ValueTypeHelper.isEmptyObject(groupedByIndex))
        {
            ValueTypeHelper.removeFromArrayByIndex(pathConstraints, i);
            i--;
            continue;
        }

        pathConstraints[i].resolvedResult = groupedByIndex;
    }
};

fcSymbolic.PathConstraint._groupByIndex = function(result)
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