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
        numberChain.appendChain(rightEvaluated.rangeChain, "&&");

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

fcSymbolic.NumberRangeChain = function(chain, operators)
{
    this.chain = chain || [];
    this.operators = operators || [];
};
fcSymbolic.NumberRangeChain.prototype =
{
    getFromRange: function()
    {
        if(this.chain.length == 0) { return Number.NaN; }
        if(this.chain.length == 1) { return this.chain[0].getFromRange(); }

        var cumulativeRange = this.chain[0];

        for(var i = 1; i < this.chain.length; i++)
        {
            var currentRange = this.chain[i];
            var operator = this.operators[i-1];

            if(operator == "&&")
            {
                cumulativeRange = fcSymbolic.NumberRange.makeIntersection(cumulativeRange, currentRange);
            }
        }

        if(cumulativeRange == null) { return null; }

        return cumulativeRange.getFromRange();
    },

    appendChain: function(rangeChain, bindingOperator)
    {
        if(rangeChain == null || rangeChain.chain == null || rangeChain.chain.length == 0) { return; }

        this.operators.push(bindingOperator);
        ValueTypeHelper.pushAll(this.chain, rangeChain.chain);
        ValueTypeHelper.pushAll(this.operators, rangeChain.operators);
    },

    createCopy: function()
    {
        return new fcSymbolic.NumberRangeChain(this.chain.slice(), this.operators.slice());
    }
};

fcSymbolic.NumberRangeChain.createSingleItemChain = function(lowerBound, upperBound)
{
    return new fcSymbolic.NumberRangeChain([new fcSymbolic.NumberRange(lowerBound, upperBound)]);
};
fcSymbolic.NumberRangeChain.upgradeToChain = function(numberRange)
{
    return new fcSymbolic.NumberRangeChain(numberRange);
};

fcSymbolic.NumberRangeChain.createTwoItemChain = function(lowerBoundA, upperBoundA, lowerBoundB, upperBoundB, operator)
{
    return new fcSymbolic.NumberRangeChain([new fcSymbolic.NumberRange(lowerBoundA, upperBoundA), new fcSymbolic.NumberRange(lowerBoundB, upperBoundB)], [operator]);
};

fcSymbolic.NumberRangeChain.upgradeToTwoItemChain = function(numberRangeA, numberRangeB, operator)
{
    return new fcSymbolic.NumberRangeChain([numberRangeA, numberRangeB], [operator]);
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

fcSymbolic.NumberRange.makeIntersection = function(rangeA, rangeB)
{
    if(rangeA == null || rangeB == null
    || rangeA.upperBound < rangeB.lowerBound
    || rangeB.upperBound < rangeA.lowerBound)
    {
        return null;
    }

    if(rangeB.lowerBound < rangeA.upperBound) { return fcSymbolic.NumberRangeChain.createSingleItemChain(rangeB.lowerBound, rangeA.upperBound); }
    if(rangeA.lowerBound < rangeB.upperBound) { return fcSymbolic.NumberRangeChain.createSingleItemChain(rangeA.lowerBound, rangeB.upperBound); }

    return null;
};

fcSymbolic.NumberRange.makeUnion = function(rangeA, rangeB)
{
    if(rangeA == null && rangeB == null) { return null;}

    if(rangeA == null) { return fcSymbolic.NumberRangeChain.upgradeToChain(rangeB); }
    if(rangeB == null) { return fcSymbolic.NumberRangeChain.upgradeToChain(rangeA); }


    if(this._areDisjunct(rangeA, rangeB)) { return fcSymbolic.NumberRangeChain.upgradeToTwoItemChain(rangeA, rangeB, "||"); }
    if(this._areDisjunct(rangeB, rangeA)) { return fcSymbolic.NumberRangeChain.upgradeToTwoItemChain(rangeB, rangeA, "||"); }
    if(this._areIntersecting(rangeA, rangeB)) { return fcSymbolic.NumberRangeChain.createSingleItemChain(rangeA.lowerBound, rangeB.upperBound); }
    if(this._areIntersecting(rangeB, rangeA)) { return fcSymbolic.NumberRangeChain.createSingleItemChain(rangeB.lowerBound, rangeA.upperBound); }
    if(this._areWhollyOverlapping(rangeA, rangeB)) { return fcSymbolic.NumberRangeChain.createSingleItemChain(rangeA.lowerBound, rangeA.upperBound); }
    if(this._arePartiallyOverlapping(rangeA, rangeB)) { return fcSymbolic.NumberRangeChain.createSingleItemChain(Math.min(rangeA.lowerBound, rangeB.lowerBound), Math.max(rangeA.upperBound, rangeB.upperBound)); }
    if(this._isContainedWithin(rangeA, rangeB)) { return fcSymbolic.NumberRangeChain.createSingleItemChain(rangeB.lowerBound, rangeB.upperBound); }
    if(this._isContainedWithin(rangeB, rangeA)) { return fcSymbolic.NumberRangeChain.createSingleItemChain(rangeA.lowerBound, rangeA.upperBound); }
};

fcSymbolic.NumberRange._areDisjunct = function(lowerRange, upperRange)
{
    return lowerRange.lowerBound < upperRange.lowerBound && lowerRange.upperBound < upperRange.upperBound
        && lowerRange.upperBound < upperRange.lowerBound;
};

fcSymbolic.NumberRange._areIntersecting = function(lowerRange, upperRange)
{
    return lowerRange.lowerBound < upperRange.lowerBound && lowerRange.upperBound < upperRange.upperBound
        && lowerRange.upperBound > upperRange.lowerBound;
};

fcSymbolic.NumberRange._areWhollyOverlapping = function(rangeA, rangeB)
{
    return rangeA.lowerBound == rangeB.lowerBound
        && rangeA.upperBound == rangeB.upperBound;
};

fcSymbolic.NumberRange._arePartiallyOverlapping = function(rangeA, rangeB)
{
    return rangeA.lowerBound == rangeB.lowerBound
        || rangeA.upperBound == rangeB.upperBound;
};

fcSymbolic.NumberRange._isContainedWithin = function(innerRange, outerRange)
{
    return innerRange.lowerBound > outerRange.lowerBound && innerRange.upperBound < outerRange.upperBound;
}

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
/*****************************************************/
}});