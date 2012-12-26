FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcSymbolic = Firecrow.Symbolic;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var RequestHelper = Firecrow.RequestHelper;
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
        if(symbolicExpression == null) { return []; }
        if(!symbolicExpression.containsNumericExpressions()) { return this._resolveStringConstraint(symbolicExpression); }

        var result = RequestHelper.performSynchronousPost("http://localhost/Firecrow/constraintSolver/index.php", {
            Constraint: encodeURIComponent(JSON.stringify(symbolicExpression))
        });

        if(!result.isSuccessful) { return []; }

        var constraintResult = JSON.parse(result.response);
        var constraintResults = [];

        console.log("Expression: " + symbolicExpression);
        console.log("Result: " + result.response);
        console.log("*******************************");

        for(var variableName in constraintResult)
        {
            constraintResults.push(new fcSymbolic.ConstraintResult(variableName, constraintResult[variableName]));
        }

        return constraintResults;
    },

    _resolveStringConstraint: function(symbolicExpression)
    {
        return [new fcSymbolic.ConstraintResult
        (
            symbolicExpression.getIdentifierNames()[0],
            {},
            symbolicExpression.getHtmlElements()[0]
        )];
    },

    _isStringLiteralBinaryExpression: function(symbolicExpression)
    {
        return symbolicExpression.isBinary() && symbolicExpression.left.isIdentifier() && symbolicExpression.right.isLiteral()
            && ValueTypeHelper.isString(symbolicExpression.right.value);
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

fcSymbolic.ConstraintResult = function(identifier, value, htmlElement)
{
    this.identifier = identifier;
    this.value = value;
    this.htmlElement = htmlElement;

    this.getValue = function() { return this.value;};
};
/*****************************************************/
}});