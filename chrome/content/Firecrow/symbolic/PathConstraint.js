FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcSymbolic = Firecrow.Symbolic;

fcSymbolic.PathConstraintItem = function(codeConstruct, constraint)
{
    this.codeConstruct = codeConstruct;
    this.constraint = constraint;
};

fcSymbolic.PathConstraint = function()
{
    this.constraints = [];
};

fcSymbolic.PathConstraint.prototype =
{
    addConstraint: function(codeConstruct, constraint, inverse)
    {
        if(inverse)
        {
            constraint = fcSymbolic.ConstraintResolver.getInverseConstraint(constraint);
        }

        var pathConstraintItem = new fcSymbolic.PathConstraintItem(codeConstruct, constraint);

        this.constraints.push(pathConstraintItem);
    }
};
/*****************************************************/
}});