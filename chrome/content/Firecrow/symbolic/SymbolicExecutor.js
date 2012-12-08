FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcSymbolic = Firecrow.Symbolic;

fcSymbolic.SymbolicExecutor =
{
    evalBinaryExpression: function(left, right, operator)
    {
        if(left == null || right == null) { return null;}
        if(left.isNotSymbolic() && right.isNotSymbolic()) { return null; }

        return this._simplifyExpression(new fcSymbolic.Binary(left.symbolicValue, right.symbolicValue, operator));
    },

    _simplifyExpression: function(symbolicExpression)
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
    }
};
/*****************************************************/
}});