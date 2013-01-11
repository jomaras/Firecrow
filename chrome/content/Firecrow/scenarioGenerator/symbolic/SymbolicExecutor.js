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

        return new fcSymbolic.Binary(leftSymbolic, rightSymbolic, operator);
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

        return new fcSymbolic.Logical(leftSymbolic, rightSymbolic, operator);
    }
};
/*****************************************************/
}});