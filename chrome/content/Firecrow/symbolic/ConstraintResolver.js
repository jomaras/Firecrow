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
            return;
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
        ValueTypeHelper.pushAll(numberChain.operators, rightEvaluated.operators);

        return {
            htmlElement: symbolicExpression.left.htmlElement || symbolicExpression.right.htmlElement,
            identifier: symbolicExpression.left.name
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
        else if (this.chain.length == 1) { return this.chain[0].getFromRange(); }
        else if (this.chain.length == 2 && this.operators[0] == "||") { return this.chain[0].getFromRange(); }
        else { alert("Not implemented getting from complex range"); }
        return 0;
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
    }
};
/*****************************************************/
}});