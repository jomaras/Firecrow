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
                results.push(stringResults[stringExpressions.indexOf(symbolicExpression)]);
            }
        }

        return results;
    },

    _resolveStringConstraint: function(symbolicExpression)
    {
        var identifierNames = symbolicExpression.getIdentifierNames();
        identifierNames = ValueTypeHelper.cleanDuplicatesFromArray(identifierNames);

        var result = {};

        for(var i = 0; i < identifierNames.length; i++)
        {
            var identifierName = identifierNames[i];
            result[identifierName] = "";

            if(identifierName.indexOf("DOM_") == 0)
            {
                var id = fcSymbolic.ConstraintResolver.getHtmlElementIdFromSymbolicParameter(identifierName);
                var cleansedProperty = fcSymbolic.ConstraintResolver.getHtmlElementPropertyFromSymbolicParameter(identifierName);
                if(id != "")
                {
                    var htmlElement = symbolicExpression.getHtmlElements()[0].ownerDocument.getElementById(id);

                    if(htmlElement instanceof HTMLSelectElement)
                    {
                        var updateResult = fcSymbolic.ConstraintResolver.getNextSelectElement(cleansedProperty, htmlElement);
                        result[identifierName] = updateResult.newValue;
                    }
                }
                else
                {
                    alert("When updating DOM can not find ID!");
                }
            }
        }

        return result;
    },

    updateSelectElement: function(propName, selectElement)
    {
        var oldValue = selectElement[propName];

        var newValue = this._getNextValue(selectElement[propName], this._getSelectAvailableValues(selectElement));

        selectElement[propName] = newValue;

        return {htmlElement: selectElement, oldValue: oldValue, newValue: newValue};
    },

    _getSelectAvailableValues: function(selectElement)
    {
        var values = [];

        if(selectElement == null) { return values; }

        for(var i = 0; i < selectElement.children.length; i++)
        {
            values.push(selectElement.children[i].value);
        }

        return values;
    },

    getNextSelectElement: function(propName, selectElement)
    {
        var oldValue = selectElement[propName];

        var newValue = this._getNextValue(selectElement[propName], this._getSelectAvailableValues(selectElement));

        return { htmlElement: selectElement, oldValue: oldValue, newValue: newValue };
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