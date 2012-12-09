FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcSymbolic = Firecrow.Symbolic;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
fcSymbolic.ConstraintResolver =
{
    resultStorageMap: {},
    resolveConstraints: function(symbolicExpressions)
    {
        return this.resolveConstraint(this._getCompoundConstraint(symbolicExpressions));
    },

    _getCompoundConstraint: function(symbolicExpressions)
    {
        if(symbolicExpressions == null || symbolicExpressions.length == 0) { return null; }
        if(symbolicExpressions.length == 1) { return symbolicExpressions[0]; }

        var compoundLogicalExpression = new fcSymbolic.Logical(symbolicExpressions[0], symbolicExpressions[1], "&&");

        for(var i = 2; i < symbolicExpressions.length; i++)
        {
            compoundLogicalExpression = new fcSymbolic.Logical(compoundLogicalExpression, symbolicExpressions[i], "&&");
        }

        return compoundLogicalExpression;
    },

    resolveConstraint: function(symbolicExpression)
    {
        if(symbolicExpression == null) { return null; }

             if(symbolicExpression.isBinary()) { return this._resolveBinary(symbolicExpression); }
        else if(symbolicExpression.isLogical()) { return this._resolveLogical(symbolicExpression); }
        else
        {
            alert("Unhandled constraint");
        }

        return null;
    },

    resolveInverse: function(pathConstraintItem)
    {
        return this.resolveConstraint(this.getInverseConstraint(pathConstraintItem));
    },

    _resolveBinary: function(symbolicExpression)
    {
        if(!symbolicExpression.left.isIdentifier() || !symbolicExpression.right.isLiteral())
        {
            alert("Don't know how to handle the expression in binary expression");
            return null;
        }

        var result =
        {
            htmlElement: symbolicExpression.left.htmlElement || symbolicExpression.right.htmlElement,
            identifier: symbolicExpression.left.name
        };

        switch(symbolicExpression.operator)
        {
            case fcSymbolic.CONST.BINARY_OP.LT:
                result.rangeChain = new fcSymbolic.NumberRangeChain
                (
                    [new fcSymbolic.NumberRange(Number.NEGATIVE_INFINITY, symbolicExpression.right.value - 1)]
                );
                break;
            case fcSymbolic.CONST.BINARY_OP.GT:
                result.rangeChain = new fcSymbolic.NumberRangeChain
                (
                    [new fcSymbolic.NumberRange(symbolicExpression.right.value + 1, Number.POSITIVE_INFINITY)]
                );
                break;
            case fcSymbolic.CONST.BINARY_OP.LET:
                result.rangeChain = new fcSymbolic.NumberRangeChain
                (
                    [new fcSymbolic.NumberRange(Number.NEGATIVE_INFINITY, symbolicExpression.right.value)]
                );
                break;
            case fcSymbolic.CONST.BINARY_OP.GET:
                result.rangeChain = new fcSymbolic.NumberRangeChain
                (
                    [new fcSymbolic.NumberRange(symbolicExpression.right.value, Number.POSITIVE_INFINITY)]
                );
                break;
            case fcSymbolic.CONST.BINARY_OP.EQ:
            case fcSymbolic.CONST.BINARY_OP.TEQ:
                result.rangeChain = new fcSymbolic.NumberRangeChain
                (
                    [new fcSymbolic.NumberRange(symbolicExpression.right.value, symbolicExpression.right.value)]
                );
                break;
            case fcSymbolic.CONST.BINARY_OP.NEQ:
            case fcSymbolic.CONST.BINARY_OP.TNEQ:
                result.rangeChain = new fcSymbolic.NumberRangeChain
                (
                    [
                        new fcSymbolic.NumberRange(Number.NEGATIVE_INFINITY, symbolicExpression.right.value - 1),
                        new fcSymbolic.NumberRange(symbolicExpression.right.value + 1, Number.POSITIVE_INFINITY)
                    ],
                    ["||"]
                );
                break;
            default:
                alert("Unhandled Binary constraint");
                return null;
        }

        result.value = result.rangeChain.getFromRange();

        this.resultStorageMap[result.identifier] = result.value;

        return result;
    },

    _resolveLogical: function(symbolicExpression)
    {
        var leftEvaluated = this.resolveConstraint(symbolicExpression.left);
        if(symbolicExpression == "||")
        {
            return leftEvaluated.value;
        }

        var rightEvaluated = this.resolveConstraint(symbolicExpression.right);
        var numberChain = leftEvaluated.rangeChain.createCopy();
        ValueTypeHelper.pushAll(numberChain.chain, rightEvaluated.rangeChain.chain);
        numberChain.operators.push("&&");
        ValueTypeHelper.pushAll(numberChain.operators, rightEvaluated.rangeChain.operators);

        return {
            htmlElement: symbolicExpression.left.htmlElement || symbolicExpression.right.htmlElement,
            identifier: symbolicExpression.getIdentifierName(),
            rangeChain: numberChain,
            value: numberChain.getFromRange()
        };
    },

    getInverseConstraint: function(symbolicExpression)
    {
        if(symbolicExpression == null) { return null; }

        if(symbolicExpression.isBinary()) { return this._getBinaryInverse(symbolicExpression); }
        else
        {
            alert("Unhandled constraint");
        }

        return null;
    },

    _getBinaryInverse: function(symbolicExpression)
    {
        return new fcSymbolic.Binary
        (
            symbolicExpression.left,
            symbolicExpression.right,
            fcSymbolic.CONST.BINARY_OP.getInverse(symbolicExpression.operator)
        );
    }
};

fcSymbolic.NumberRangeChain = function(chain, operators)
{
    this.chain = chain || [];
    this.operators = operators || [];
};
fcSymbolic.NumberRangeChain.prototype =
{
    addToChain: function(numberRange, operator)
    {
        if(this.chain.length != 0)
        {
            this.operators.push(operator || "&&");
        }

        this.chain.push(numberRange);
    },

    getFromRange: function()
    {
        if(this.chain.length == 0) { return Number.NaN; }
        else if(this.chain.length == 1) { return this.chain[0].getFromRange(); }
        else if(this.chain.length == 2)
        {
            if(this.operators[0] == "||") { return this.chain[0].getFromRange(); }
            if(this.operators[0] == "&&")
            {
                var union = fcSymbolic.NumberRange.makeUnion(this.chain[0], this.chain[1]);
                if(union != null)
                {
                    return union.getFromRange();
                }

                return null;
            }
        }
        else
        {
            var cummulativeRange = this.chain[0];
            for(var i = 1; i < this.chain.length; i++)
            {
                var currentRange = this.chain[i];
                var operator = this.operators[i-1];

                if(operator == "&&")
                {
                    cummulativeRange = fcSymbolic.NumberRange.makeUnion(cummulativeRange, currentRange);
                }
            }

            if(cummulativeRange != null) { return cummulativeRange.getFromRange(); }

            return -1;
        }

        return -1;
    },

    createCopy: function()
    {
        return new fcSymbolic.NumberRangeChain(this.chain.slice(), this.operators.slice());
    }
};

fcSymbolic.NumberRange = function(lowerBound, upperBound)
{
    this.lowerBound = Math.min(lowerBound, upperBound);
    this.upperBound = Math.max(lowerBound, upperBound);
};
fcSymbolic.NumberRange.prototype =
{
    getFromRange: function()
    {
        if(isFinite(this.lowerBound)) { return this.lowerBound; }
        if(isFinite(this.upperBound)) { return this.upperBound; }

        return 0;
    },

    toString: function()
    {
        return "[" + this.lowerBound + ", " + this.upperBound + "]";
    }
};
fcSymbolic.NumberRange.makeUnion = function(rangeA, rangeB)
{
    if(rangeA == null || rangeB == null
    || rangeA.upperBound < rangeB.lowerBound
    || rangeB.upperBound < rangeA.lowerBound)
    {
        return null;
    }

    if(rangeB.lowerBound < rangeA.upperBound) { return new fcSymbolic.NumberRange(rangeB.lowerBound, rangeA.upperBound); }
    if(rangeA.lowerBound < rangeB.upperBound) { return new fcSymbolic.NumberRange(rangeA.lowerBound, rangeB.upperBound); }

    return null;
};
/*****************************************************/
}});