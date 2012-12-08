var fcSymbolic = FBL.Firecrow.Symbolic;
function createIdentifier(name) { return new fcSymbolic.Identifier(name); }
function createLiteral(value) { return new fcSymbolic.Literal(value); }
function createBinary(left, right, operator) { return new fcSymbolic.Binary(left, right, operator); }
function createLogical(left, right, operator) { return new fcSymbolic.Logical(left, right, operator); }
function wrap(value) { return {symbolicValue: value, isNotSymbolic: function(){return false; }}; }
function evalBinary(left, right, operator)
{
    return fcSymbolic.SymbolicExecutor.evalBinaryExpression(wrap(left), wrap(right), operator);
}

TestCase("ConstraintResolver - Simple Binary Relational Expressions Ids and Literals",
{
    //X == 1 -> X: 1
    "test_L_Id_R_Lit_Op_Eq": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createIdentifier("X"), createLiteral(1), "=="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 1, result.value);
    },

    //1 == X -> X: 1
    "test_L_Lit_R_Id_Op_Eq": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createLiteral(1), createIdentifier("X"), "=="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 1, result.value);
    },

    //X != 1 -> X: 2
    "test_L_Id_R_Lit_Op_Neq": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createIdentifier("X"), createLiteral(1), "!="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 2, result.value);
    },

    //1 != X -> X: 2
    "test_L_Lit_R_Id_Op_Neq": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createLiteral(1), createIdentifier("X"), "!="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 2, result.value);
    },

    //X === 1 -> X: 1
    "test_L_Id_R_Lit_Op_Teq": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createIdentifier("X"), createLiteral(1), "==="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 1, result.value);
    },

    //1 === X -> X: 1
    "test_L_Lit_R_Id_Op_Teq": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createLiteral(1), createIdentifier("X"), "==="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 1, result.value);
    },

    //X !== 1 -> X: 2
    "test_L_Id_R_Lit_Op_Tneq": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createIdentifier("X"), createLiteral(1), "!=="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 2, result.value);
    },

    //1 !== X -> X: 2
    "test_L_Lit_R_Id_Op_Tneq": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createLiteral(1), createIdentifier("X"), "!=="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 2, result.value);
    },

    //X < 1 -> X: 0
    "test_L_Id_R_Lit_Op_LT": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createIdentifier("X"), createLiteral(1), "<"));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 0, result.value);
    },

    // 1 < X -> X: 2
    "test_L_Lit_R_Id_Op_LT": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createLiteral(1), createIdentifier("X"), "<"));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 2, result.value);
    },

    //X <= 1 -> X: 1
    "test_L_Id_R_Lit_Op_LET": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createIdentifier("X"), createLiteral(1), "<="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 1, result.value);
    },

    // 1 <= X -> X: 1
    "test_L_Lit_R_Id_Op_LET": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createLiteral(1), createIdentifier("X"), "<="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 1, result.value);
    },

    //X >= 1 -> X: 1
    "test_L_Id_R_Lit_Op_GET": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createIdentifier("X"), createLiteral(1), ">="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 1, result.value);
    },

    // 1 >= X -> X: 1
    "test_L_Lit_R_Id_Op_GET": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createLiteral(1), createIdentifier("X"), ">="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 1, result.value);
    }
});