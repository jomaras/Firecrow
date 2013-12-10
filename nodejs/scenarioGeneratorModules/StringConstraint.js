var path = require('path');

var ValueTypeHelper = require(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/valueTypeHelper.js")).ValueTypeHelper;

var StringConstraint = function(value, operator)
{
    this.value = value;
    this.operator = operator;
};

StringConstraint.prototype.toString = function()
{
    return this.operator + " " + this.value;
};

var StringConstraintChain = function(chain)
{
    this.chain = chain || [];
};

StringConstraintChain.prototype =
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
        return new StringConstraintChain(this.chain.slice());
    },

    _filterConstraintsValues: function(operators)
    {
        var constraints = [];

        for(var i = 0; i < this.chain.length; i++)
        {
            var chainItem = this.chain[i];

            if(operators.indexOf(chainItem.operator) != -1)
            {
                constraints.push(chainItem);
            }
        }

        var values = [];

        for(var i = 0; i < constraints.length; i++)
        {
            if(values.indexOf(constraint.value) == -1)
            {
                values.push(constraint.value);
            }
        }

        return values;
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

exports.StringConstraint = StringConstraint;
exports.StringConstraintChain = StringConstraintChain;