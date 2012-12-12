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
        return [new fcSymbolic.ConstraintResult
        (
            symbolicExpression.left.name,
            this._getBinaryIdentifierLiteralRangeChain(symbolicExpression.right.value, symbolicExpression.operator),
            symbolicExpression.left.htmlElement || symbolicExpression.right.htmlElement
        )];
    },

    _getBinaryIdentifierLiteralRangeChain: function(value, operator)
    {
             if (ValueTypeHelper.isNumber(value)) { return this._getBinaryIdentifierLiteralRangeChainFromNumber(value, operator); }
        else if (ValueTypeHelper.isString(value)) { return this._getBinaryIdentifierLiteralRangeChainFromString(value, operator); }

        alert("Unknown value type when getting binary identifier literal range chain");
        return null;
    },

    _getBinaryIdentifierLiteralRangeChainFromNumber: function(value, operator)
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

    _getBinaryIdentifierLiteralRangeChainFromString: function(value, operator)
    {
        switch(operator)
        {
            case fcSymbolic.CONST.BINARY_OP.EQ:
            case fcSymbolic.CONST.BINARY_OP.TEQ:
            case fcSymbolic.CONST.BINARY_OP.NEQ:
            case fcSymbolic.CONST.BINARY_OP.TNEQ:
                return new fcSymbolic.StringConstraintChain([new fcSymbolic.StringConstraint(value, operator)]);
            default:
                alert("Unhandled String chain operator in ConstraintResolver");
                return null;
        }
    },

    _resolveLogical: function(symbolicExpression)
    {
        return this._mergeMatchingConstraints
        (
            this._groupConstraintsByIdentifier(this.resolveConstraint(symbolicExpression.left)),
            this._groupConstraintsByIdentifier(this.resolveConstraint(symbolicExpression.right)),
            symbolicExpression.operator
        );

        /*var valueChain = leftEvaluated.rangeChain.createCopy();

        valueChain.appendChain(rightEvaluated.rangeChain, symbolicExpression.operator);

        return new fcSymbolic.ConstraintResult(identifier, valueChain, leftEvaluated.htmlElement || rightEvaluated.htmlElement);*/
    },

    _mergeMatchingConstraints: function(constraintsMappingA, constraintsMappingB, operator)
    {
        var constraintResults = [];

        for(var identifierName in constraintsMappingA)
        {
            var constraintsA = constraintsMappingA[identifierName];
            var constraintsB = constraintsMappingB[identifierName];

            var htmlElement = null;
            var valueChain = null;

            for(var i = 0; i < constraintsA.length; i++)
            {
                if(valueChain == null) { valueChain = constraintsA[i].rangeChain.createCopy(); }
                else { valueChain.appendChain(constraintsA[i].rangeChain, operator); }

                if(htmlElement == null) { htmlElement = constraintsA[i].htmlElement; }
            }

            if(constraintsB != null)
            {
                for(var i = 0; i < constraintsB.length; i++)
                {
                    if(valueChain == null) { valueChain = constraintsB[i].rangeChain.createCopy(); }
                    else { valueChain.appendChain(constraintsB[i].rangeChain, operator); }

                    if(htmlElement == null) { htmlElement = constraintsB[i].htmlElement; }
                }

                constraintsB.hasBeenProcessed = true;
            }

            constraintResults.push(new fcSymbolic.ConstraintResult(identifierName, valueChain, htmlElement));
        }

        for(var identifierName in constraintsMappingB)
        {
            var constraintsB = constraintsMappingB[identifierName];

            if(constraintsB.hasBeenProcessed) { continue; }

            var htmlElement = null;
            var valueChain = null;

            for(var i = 0; constraintsB != null && i < constraintsB.length; i++)
            {
                if(valueChain == null) { valueChain = constraintsB[i].rangeChain.createCopy(); }
                else { valueChain.appendChain(constraintsB[i].rangeChain, operator); }

                if(htmlElement == null) { htmlElement = constraintsB[i].htmlElement; }
            }

            constraintResults.push(new fcSymbolic.ConstraintResult(identifierName, valueChain, htmlElement));
        }

        return constraintResults;
    },

    _groupConstraintsByIdentifier: function(constraints)
    {
        var nameMapping = {};

        for(var i = 0; i < constraints.length; i++)
        {
            var constraint = constraints[i];

            if(nameMapping[constraint.identifier] == null) { nameMapping[constraint.identifier] = []; }

            nameMapping[constraint.identifier].push(constraint);
        }

        return nameMapping;
    },

    getInverseConstraint: function(symbolicExpression)
    {
        if(symbolicExpression == null) { return null; }

        if(symbolicExpression.isBinary()) { return this._getBinaryInverse(symbolicExpression); }
        else if(symbolicExpression.isLogical()) { return this._getLogicalInverse(symbolicExpression); }
        else
        {
            alert("Unhandled constraint");
        }

        return null;
    },

    _getLogicalInverse: function(symbolicExpression)
    {
        //DEMORGAN'S LAW: !(A && B) = !A || !B; !(A || B) = !A && !B
        return new fcSymbolic.Logical
        (
            this.getInverseConstraint(symbolicExpression.left),
            this.getInverseConstraint(symbolicExpression.right),
            symbolicExpression.operator == "&&" ? "||" : "&&"
        );
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