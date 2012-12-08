FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcSymbolic = Firecrow.Symbolic;
fcSymbolic.ConstraintResolver =
{
    resolveConstraint: function(symbolicExpression)
    {
        if(symbolicExpression == null) { return null; }

        if(symbolicExpression.isBinary()) { return this._resolveBinary(symbolicExpression); }
        else
        {
            alert("Unhandled constraint");
        }
    },

    resolveInverse: function(pathConstraintItem)
    {
        return this.resolveConstraint(this.getInverseConstraint(pathConstraintItem));
    },

    _resolveBinary: function(symbolicExpression)
    {
        if(!symbolicExpression.left.isIdentifier() || !symbolicExpression.right.isLiteral())
        {
            alert("Don't know how to handle the expression in binary expression");
            return;
        }

        var result = { htmlElement: symbolicExpression.left.htmlElement || symbolicExpression.right.htmlElement };

        switch(symbolicExpression.operator)
        {
            case "<"   : result.identifier = symbolicExpression.left.name, result.value = symbolicExpression.right.value - 1; break;
            case ">"   : result.identifier = symbolicExpression.left.name, result.value = symbolicExpression.right.value + 1; break;
            case "<="  : result.identifier = symbolicExpression.left.name, result.value = symbolicExpression.right.value; break;
            case ">="  : result.identifier = symbolicExpression.left.name, result.value = symbolicExpression.right.value; break;
            case "=="  : result.identifier = symbolicExpression.left.name, result.value = symbolicExpression.right.value; break;
            case "!="  : result.identifier = symbolicExpression.left.name, result.value = symbolicExpression.right.value + 1; break;
            case "===" : result.identifier = symbolicExpression.left.name, result.value = symbolicExpression.right.value; break;
            case "!==" : result.identifier = symbolicExpression.left.name, result.value = symbolicExpression.right.value + 1; break;
            default:
                alert("Unhandled Binary constraint");
                return null;
        }

        return result;
    },

    getInverseConstraint: function(symbolicExpression)
    {
        if(symbolicExpression == null) { return null; }

        if(symbolicExpression.isBinary()) { return this._getBinaryInverse(symbolicExpression); }
        else
        {
            alert("Unhandled constraint");
        }
    },

    _getBinaryInverse: function(symbolicExpression)
    {
        switch(symbolicExpression.operator)
        {
            case "<"   : return new fcSymbolic.Binary(symbolicExpression.left, symbolicExpression.right, ">=");
            case ">"   : return new fcSymbolic.Binary(symbolicExpression.left, symbolicExpression.right, "<=");
            case "<="  : return new fcSymbolic.Binary(symbolicExpression.left, symbolicExpression.right, ">");
            case ">="  : return new fcSymbolic.Binary(symbolicExpression.left, symbolicExpression.right, "<");
            case "=="  : return new fcSymbolic.Binary(symbolicExpression.left, symbolicExpression.right, "!=");
            case "!="  : return new fcSymbolic.Binary(symbolicExpression.left, symbolicExpression.right, "==");
            case "===" : return new fcSymbolic.Binary(symbolicExpression.left, symbolicExpression.right, "!==");
            case "!==" : return new fcSymbolic.Binary(symbolicExpression.left, symbolicExpression.right, "===");
            default:
                alert("Unhandled Binary inverse symbolic expression");
        }
    }
};
/*****************************************************/
}});