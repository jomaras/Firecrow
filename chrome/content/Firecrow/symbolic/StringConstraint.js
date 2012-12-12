FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcSymbolic = Firecrow.Symbolic;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcSymbolic.StringConstraint = function(value, operator)
{
    this.value = value;
    this.operator = operator;
};

fcSymbolic.StringConstraint.prototype.toString = function()
{
    return this.operator + " " + this.value;
};

fcSymbolic.StringConstraintChain = function(chain)
{
    this.chain = chain || [];
};

fcSymbolic.StringConstraintChain.prototype =
{
    getFromRange: function()
    {
        var equalsValues = this._filterConstraintsValues(["==", "==="]);
        var notEqualsValues = this._filterConstraintsValues(["!=", "!=="]);

        if(equalsValues.length > 1) { return null; } //Can not resolve that a variable should be equal to multiple values
        if(this._containAtLeastOneCommonValue(equalsValues, notEqualsValues)) { return null; } //Can not have the same value in equals and not equals values

        if(equalsValues.length == 1) { return equalsValues[0]; }

        return "Should generate a string based on non-equals";
    },

    appendChain: function(rangeChain)
    {
        if(rangeChain == null || rangeChain.chain == null || rangeChain.chain.length == 0) { return; }

        ValueTypeHelper.pushAll(this.chain, rangeChain.chain);
    },

    createCopy: function()
    {
        return new fcSymbolic.StringConstraintChain(this.chain.slice());
    },

    _filterConstraintsValues: function(operators)
    {
        var constraints = this.chain.filter(function(chainItem)
        {
            return operators.indexOf(chainItem.operator) != -1;
        });

        var values = constraints.map(function(constraint) { return constraint.value; });

        return values.filter(function(value, position)
        {
            return values.indexOf(value) == position;
        });
    },

    _containAtLeastOneCommonValue: function(arrayA, arrayB)
    {
        for(var i = 0; i < arrayA.length; i++)
        {
            if(arrayB.indexOf(arrayA[i]) != -1) { return true; }
        }

        return false;
    },

    toString: function()
    {
        var string = "";

        for(var i = 0; i < this.chain.length; i++)
        {
            if(i != 0) { string += " && "; }
            string += this.chain[i];
        }

        return string;
    }
};
/*****************************************************/
}});