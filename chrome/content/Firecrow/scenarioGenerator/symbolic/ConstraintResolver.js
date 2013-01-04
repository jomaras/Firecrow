FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcSymbolic = Firecrow.ScenarioGenerator.Symbolic;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var RequestHelper = Firecrow.RequestHelper;
fcSymbolic.ConstraintResolver =
{
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

    resolveConstraints: function(symbolicExpressionsList)
    {
        var compoundExpressions = symbolicExpressionsList.map(function(symbolicExpressions)
        {
            return this._getCompoundConstraint(symbolicExpressions);
        }, this);

        var numericExpressions = compoundExpressions.filter(function(symbolicExpression)
        {
            return symbolicExpression.containsNumericExpressions();
        });

        var stringExpressions = compoundExpressions.filter(function(symbolicExpression)
        {
            return !symbolicExpression.containsNumericExpressions();
        });

        var numericExpressionsAjaxQuery = RequestHelper.performSynchronousPost("http://localhost/Firecrow/constraintSolver/index.php", {
            Constraint: encodeURIComponent(JSON.stringify(numericExpressions))
        });

        var numericResults = numericExpressionsAjaxQuery.isSuccessful ? JSON.parse(numericExpressionsAjaxQuery.response) : Array(numericExpressions.length);

        var stringResults = stringExpressions.map(function(stringExpression)
        {
            return this._resolveStringConstraint(stringExpression);
        }, this);

        var results = [];

        for(var i = 0; i < compoundExpressions.length; i++)
        {
            var symbolicExpression = compoundExpressions[i];

            if(symbolicExpression.containsNumericExpressions())
            {
                results.push(numericResults[numericExpressions.indexOf(symbolicExpression)]);
            }
            else
            {
                results.push(stringResults[numericExpressions.indexOf(stringExpressions.indexOf(symbolicExpression))]);
            }
        }

        return results;
    },

    _getNumericConstraintResults: function(constraintResult)
    {
        var constraintResults = [];

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