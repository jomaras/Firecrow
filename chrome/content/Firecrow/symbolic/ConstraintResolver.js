FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcSymbolic = Firecrow.Symbolic;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
fcSymbolic.ConstraintResolver =
{
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

    _resolveBinary: function(symbolicExpression)
    {
        if(symbolicExpression.left.isIdentifier() && symbolicExpression.right.isLiteral())
        {
            return this._resolveBinaryIdentifierLiteral(symbolicExpression);
        }

        alert("Don't know how to handle the expression in binary expression");
        return null;
    },

    _resolveBinaryIdentifierLiteral: function(symbolicExpression)
    {
        return new fcSymbolic.ConstraintResult
        (
            symbolicExpression.left.name,
            this._getBinaryIdentifierLiteralRangeChain(symbolicExpression.right.value, symbolicExpression.operator),
            symbolicExpression.left.htmlElement || symbolicExpression.right.htmlElement
        );
    },

    _getBinaryIdentifierLiteralRangeChain: function(value, operator)
    {
        switch(operator)
        {
            case fcSymbolic.CONST.BINARY_OP.LT:
                return fcSymbolic.NumberRangeChain.createSingleItemChain(Number.NEGATIVE_INFINITY, value - 1);
            case fcSymbolic.CONST.BINARY_OP.GT:
                return fcSymbolic.NumberRangeChain.createSingleItemChain(value + 1, Number.POSITIVE_INFINITY);
            case fcSymbolic.CONST.BINARY_OP.LET:
                return fcSymbolic.NumberRangeChain.createSingleItemChain(Number.NEGATIVE_INFINITY, value);
            case fcSymbolic.CONST.BINARY_OP.GET:
                return fcSymbolic.NumberRangeChain.createSingleItemChain(value, Number.POSITIVE_INFINITY);
            case fcSymbolic.CONST.BINARY_OP.EQ:
            case fcSymbolic.CONST.BINARY_OP.TEQ:
                return fcSymbolic.NumberRangeChain.createSingleItemChain(value, value);
            case fcSymbolic.CONST.BINARY_OP.NEQ:
            case fcSymbolic.CONST.BINARY_OP.TNEQ:
                return fcSymbolic.NumberRangeChain.createTwoItemChain(Number.NEGATIVE_INFINITY, value - 1, value + 1, Number.POSITIVE_INFINITY, "||");
            default:
                alert("Unhandled Binary operator when getting range chain");
                return null;
        }
    },

    _resolveLogical: function(symbolicExpression)
    {
        var leftEvaluated = this.resolveConstraint(symbolicExpression.left);
        var rightEvaluated = this.resolveConstraint(symbolicExpression.right);

        var numberChain = leftEvaluated.rangeChain.createCopy();

        numberChain.appendChain(rightEvaluated.rangeChain, symbolicExpression.operator);

        return new fcSymbolic.ConstraintResult(symbolicExpression.getIdentifierName(), numberChain, symbolicExpression.left.htmlElement || symbolicExpression.right.htmlElement);
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

fcSymbolic.ConstraintResult = function(identifier, rangeChain, htmlElement)
{
    this.identifier = identifier;
    this.rangeChain = rangeChain;
    this.htmlElement = htmlElement;
};

fcSymbolic.ConstraintResult.prototype.getValue = function()
{
    if(this.rangeChain == null) { return null; }

    return this.rangeChain.getFromRange();
};

fcSymbolic.ConstraintResult.prototype.toString = function()
{
    return this.identifier + ":" + this.rangeChain + "; " + this.htmlElement;
}
/*****************************************************/
}});