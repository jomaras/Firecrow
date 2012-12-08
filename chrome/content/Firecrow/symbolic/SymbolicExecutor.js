FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcSymbolic = Firecrow.Symbolic;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcSymbolic.SymbolicExecutor =
{
    evalBinaryExpression: function(left, right, operator)
    {
        if(left == null || right == null) { return null;}
        if(left.isNotSymbolic() && right.isNotSymbolic()) { return null; }

        var leftSymbolic = left.symbolicValue;
        var rightSymbolic = right.symbolicValue;

        if(leftSymbolic == null && ValueTypeHelper.isPrimitive(left.jsValue))
        {
            leftSymbolic = new fcSymbolic.Literal(left.jsValue);
        }

        if(rightSymbolic == null && ValueTypeHelper.isPrimitive(right.jsValue))
        {
            rightSymbolic = new fcSymbolic.Literal(right.jsValue);
        }

        var binaryExpression = new fcSymbolic.Binary(leftSymbolic, rightSymbolic, operator);

        console.log(binaryExpression);

        return this._simplifyExpression(binaryExpression);
    },

    _simplifyExpression: function(symbolicExpression)
    {
        this._simplifyOrder(symbolicExpression);

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