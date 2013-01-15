FBL.ns(function() { with (FBL) {
    /*****************************************************/
    var ValueTypeHelper = Firecrow.ValueTypeHelper;
    var fcSymbolic = Firecrow.ScenarioGenerator.Symbolic;

    fcSymbolic.SymbolicExecutor =
    {
        evalBinaryExpression: function(leftFcValue, rightFcValue, operator)
        {
            if(leftFcValue == null || rightFcValue == null) { return null;}
            if(leftFcValue.isNotSymbolic() && rightFcValue.isNotSymbolic()) { return null; }

            var leftSymbolic = leftFcValue.symbolicValue;
            var rightSymbolic = rightFcValue.symbolicValue;

            if(leftSymbolic == null && ValueTypeHelper.isPrimitive(leftFcValue.jsValue))
            {
                leftSymbolic = new fcSymbolic.Literal(leftFcValue.jsValue);
            }

            if(rightSymbolic == null && ValueTypeHelper.isPrimitive(rightFcValue.jsValue))
            {
                rightSymbolic = new fcSymbolic.Literal(rightFcValue.jsValue);
            }

            return this._simplifyExpression(new fcSymbolic.Binary(leftSymbolic, rightSymbolic, operator));
        },

        evalLogicalExpression: function(leftFcValue, rightFcValue, operator)
        {
            if((leftFcValue == null || leftFcValue.isNotSymbolic()) && (rightFcValue == null || rightFcValue.isNotSymbolic())) { return null; }

            var leftSymbolic = leftFcValue != null ? leftFcValue.symbolicValue : null;

            if(leftSymbolic == null)
            {
                if(ValueTypeHelper.isPrimitive(leftFcValue.jsValue))
                {
                    leftSymbolic = new fcSymbolic.Literal(leftFcValue.jsValue);
                }
                else
                {
                    alert("The value is not literal");
                }
            }

            var rightSymbolic = rightFcValue != null ? rightFcValue.symbolicValue : null;

            if(rightFcValue == null) { return leftSymbolic; }

            if(rightSymbolic == null)
            {
                if(ValueTypeHelper.isPrimitive(rightFcValue.jsValue))
                {
                    rightSymbolic = new fcSymbolic.Literal(rightFcValue.jsValue);
                }
                else
                {
                    alert("The value is not literal");
                }
            }

            return this._simplifyExpression(new fcSymbolic.Logical(leftSymbolic, rightSymbolic, operator));
        },

        evalSwitchCase: function(caseValue, switchDiscriminantValue)
        {
            if(caseValue == null) { return null; }

            var caseSymbolic = caseValue.symbolicValue;

            if(caseSymbolic == null)
            {
                if(caseValue.jsValue != null && ValueTypeHelper.isPrimitive(caseValue.jsValue))
                {
                    caseSymbolic = new fcSymbolic.Literal(caseValue.jsValue);
                }
            }

            return this._simplifyExpression(new fcSymbolic.Binary(switchDiscriminantValue.symbolicValue, caseSymbolic, "=="));
        },

        _simplifyExpression: function(symbolicExpression)
        {
            this._simplifyOrder(symbolicExpression);

                 if (symbolicExpression.isBinary()) { return this.simplifyBinaryExpression(symbolicExpression); }
            else if (symbolicExpression.isLogical()) { return this.simplifyLogicalExpression(symbolicExpression); }

            return symbolicExpression;
        },

        simplifyBinaryExpression: function(symbolicExpression)
        {
            if(symbolicExpression.left.isBinary() && symbolicExpression.right.isLiteral())
            {
                var leftBinary = symbolicExpression.left;

                if(leftBinary.left.isIdentifier() && leftBinary.right.isLiteral())
                {
                    if(leftBinary.operator == "-" || leftBinary.operator == "+")
                    {
                        symbolicExpression.left = leftBinary.left;
                        symbolicExpression.right.value = symbolicExpression.right.value + (leftBinary.operator == "+" ? -1 * leftBinary.right.value : leftBinary.right.value);
                    }
                }
                else if(leftBinary.left.isIdentifier() && leftBinary.right.isIdentifier())
                {
                    symbolicExpression.left = leftBinary.left;
                }
            }

            return symbolicExpression;
        },

        simplifyLogicalExpression: function(symbolicExpression)
        {
            if(symbolicExpression.left.toString() == symbolicExpression.right.toString())
            {
                return symbolicExpression.left;
            }

            return symbolicExpression;
        },

        _simplifyOrder: function(symbolicExpression)
        {
            if(symbolicExpression.isBinary()) { this._simplifyOrderInBinary(symbolicExpression);}
        },

        _simplifyOrderInBinary: function(binary)
        {
            if(binary.left.isLiteral() && binary.right.isIdentifier())
            {
                var temp = binary.right;
                binary.right = binary.left;
                binary.left = temp;
                binary.operator = fcSymbolic.CONST.BINARY_OP.getSwapPositionOperator(binary.operator);
            }
        }
    };
    /*****************************************************/
}});