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
        var compoundExpressions = this._groupStringAndNumericExpressionsSeparately(symbolicExpressionsList);

        var numericExpressions = compoundExpressions.filter(function(symbolicExpression)
        {
            return symbolicExpression.containsNumericExpressions();
        });

        var stringExpressions = compoundExpressions.filter(function(symbolicExpression)
        {
            return symbolicExpression.containsStringExpressions();
        });

        var numericResults = this._resolveNumericExpressions(numericExpressions);
        var stringResults = this._resolveStringExpressions(stringExpressions);

        var results = [];

        for(var i = 0; i < compoundExpressions.length; i++)
        {
            var symbolicExpression = compoundExpressions[i];

            if(symbolicExpression.containsNumericExpressions())
            {
                results.push(numericResults[numericExpressions.indexOf(symbolicExpression)]);
            }
            else if(symbolicExpression.containsStringExpressions())
            {
                results.push(stringResults[stringExpressions.indexOf(symbolicExpression)]);
            }
            else
            {
                debugger;
                alert("Unhandled situation in ConstraintResolver");
            }
        }

        return results;
    },

    _resolveNumericExpressions: function(numericExpressions)
    {
        var numericResults = Array(numericExpressions.length);

        if(numericExpressions.length != 0)
        {
            try { var json = JSON.stringify(numericExpressions); }
            catch(e) { debugger; alert(e); }

            var numericExpressionsAjaxQuery = RequestHelper.performSynchronousPost("http://localhost/Firecrow/constraintSolver/index.php", {
                Constraint: encodeURIComponent(json)
            });

            if(numericExpressionsAjaxQuery.isSuccessful)
            {
                try
                {
                    numericResults = JSON.parse(numericExpressionsAjaxQuery.response);
                }
                catch (e)
                {
                    alert("Error when parsing constraint solver response: " + e + " -> " + numericExpressionsAjaxQuery.response);
                }
            }
            else
            {
                var expressions = "";
                numericExpressions.forEach(function(numericExpression)
                {
                    expressions += numericExpression.toString() + ";";
                });
                console.log("Expressions: " + expressions + " could not be solved");
            }
        }

        return numericResults;
    },

    _groupStringAndNumericExpressionsSeparately: function(symbolicExpressionsList)
    {
        var compoundExpressions = [];

        for(var i = 0; i < symbolicExpressionsList.length; i++)
        {
            var symbolicExpressions = symbolicExpressionsList[i];

            var numericExpressions = [], stringExpressions = [];

            for(var j = 0; j < symbolicExpressions.length; j++)
            {
                var symbolicExpression = symbolicExpressions[j];

                var containsNumericExpressions = symbolicExpression.containsNumericExpressions();
                var containsStringExpressions = symbolicExpression.containsStringExpressions();

                if(symbolicExpression.isIdentifier())
                {
                    numericExpressions.push(new fcSymbolic.Binary(symbolicExpression, new fcSymbolic.Literal(0), ">="));
                }
                else if((containsNumericExpressions && !containsStringExpressions)
                 || symbolicExpression.hasOnlyIdentifiers())
                {
                    numericExpressions.push(symbolicExpression);
                }
                else if(containsStringExpressions && !containsNumericExpressions)
                {
                    stringExpressions.push(symbolicExpression);
                }
                else if(!containsStringExpressions && !containsNumericExpressions)
                {
                    console.log("Can not resolve: " + symbolicExpression);
                }
                else
                {
                    debugger;
                    alert("Mixing String and Numeric expressions not yet handled in ConstraintResolver");
                    return;
                }
            }

            if(numericExpressions.length != 0) { compoundExpressions.push(this._getCompoundConstraint(numericExpressions)); }
            if(stringExpressions.length != 0) { compoundExpressions.push(this._getCompoundConstraint(stringExpressions)); }
        }

        return compoundExpressions;
    },

    _resolveStringExpressions: function(stringExpressions)
    {
        if(stringExpressions.length == 0) { return []; }

        var replacements = [];
        var reverseReplacements = [];
        var numberExpressions = [];

        for(var i = 0; i < stringExpressions.length; i++)
        {
            var stringExpression = stringExpressions[i];

            var stringLiterals = ValueTypeHelper.cleanDuplicatesFromArray(stringExpression.getStringLiterals());
            var replacement = {};
            var reverseReplacement = {};
            for(var j = 0; j < stringLiterals.length; j++)
            {
                replacement[stringLiterals[j]] = j;
                reverseReplacement[j] = stringLiterals[j];
            }

            replacements.push(replacement);
            reverseReplacements.push(reverseReplacement);

            numberExpressions.push(stringExpression.createCopyWithReplacedLiterals(replacement));
        }

        var results = this._resolveNumericExpressions(numberExpressions);

        for(var i = 0; i < results.length; i++)
        {
            var reverseReplacement = reverseReplacements[i];
            var result = results[i];
            for(var propName in result)
            {
                var numberResult = result[propName];
                result[propName] = reverseReplacement[numberResult];
            }
        }

        return results;
    },

    updateSelectElement: function(propName, selectElement, newValue)
    {
        var oldValue = selectElement[propName];

        selectElement[propName] = newValue;

        return {htmlElement: selectElement, oldValue: oldValue, newValue: newValue};
    },

    getHtmlElementIdFromSymbolicParameter: function(parameter)
    {
        //format: DOM_PROPERTY_NAME_FC_EVENT_INDEX_ID_XX_CLASS_ -> from HtmlElement class
        var startIdIndex = parameter.indexOf("_ID_");
        if(startIdIndex == -1) { return ""; }

        var startClassIndex = parameter.indexOf("_CLASS_");
        if(startClassIndex == -1) { startClassIndex = parameter.length; }

        return parameter.substring(startIdIndex + "_ID_".length, startClassIndex);
    },

    getHtmlElementPropertyFromSymbolicParameter: function(parameter)
    {
        var startDomIndex = parameter.indexOf("DOM_");

        var startPropertyNameIndex = 0;

        if(startDomIndex == 0)
        {
            startPropertyNameIndex = "DOM_".length;
        }

        var startFcIndex = parameter.indexOf("_FC_");
        var endPropertyIndex = parameter.length;

        if(startFcIndex != -1)
        {
            endPropertyIndex = startFcIndex;
        }

        return parameter.substring(startPropertyNameIndex, endPropertyIndex);
    },

    _getNextValue: function(item, items)
    {
        return items[items.indexOf(item) + 1];
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
        else if (symbolicExpression.isLiteral() || symbolicExpression.isIdentifier()) { return null; }
        else
        {
            debugger;
            alert("Unhandled constraint");
        }

        return null;
    },

    getStricterConstraint: function(symbolicExpression)
    {
        if(symbolicExpression == null) { return null; }

        if(symbolicExpression.isBinary()) { return this._getBinaryStricter(symbolicExpression); }

        return symbolicExpression;
    },

    _getBinaryStricter: function(symbolicExpression)
    {
        if(symbolicExpression.operator == ">=" || symbolicExpression.operator == "<=")
        {
            return new fcSymbolic.Binary
            (
                symbolicExpression.left,
                symbolicExpression.right,
                symbolicExpression.operator == ">=" ? ">" : "<"
            );
        }
        else if (symbolicExpression.operator == ">" && symbolicExpression.right.isLiteral())
        {
            return new fcSymbolic.Binary
            (
                symbolicExpression.left,
                new fcSymbolic.Literal(symbolicExpression.right.value + 1),
                ">="
            );
        }
        else if (symbolicExpression.operator == "<" && symbolicExpression.right.isLiteral())
        {
            return new fcSymbolic.Binary
            (
                symbolicExpression.left,
                new fcSymbolic.Literal(symbolicExpression.right.value - 1),
                "<="
            );
        }

        return symbolicExpression;
    },


    _getLogicalInverse: function(symbolicExpression)
    {
        //DEMORGAN'S LAW: !(A && B) = !A || !B; !(A || B) = !A && !B

        var leftInverse = this.getInverseConstraint(symbolicExpression.left);
        var rightInverse = this.getInverseConstraint(symbolicExpression.right);

        if(leftInverse != null && rightInverse != null) { return new fcSymbolic.Logical(leftInverse, rightInverse, symbolicExpression.operator == "&&" ? "||" : "&&"); }

        return leftInverse || rightInverse;
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