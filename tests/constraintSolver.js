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

/*TestCase("Simple Binary Relational Expressions Ids and Literals",
{
    //X == 1 -> X: 1
    "test_L_Id_R_Lit_Op_Eq": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createIdentifier("X"), createLiteral(1), "=="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 1, result.rangeChain.getFromRange());
    },

    //1 == X -> X: 1
    "test_L_Lit_R_Id_Op_Eq": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createLiteral(1), createIdentifier("X"), "=="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 1, result.rangeChain.getFromRange());
    },

    //X != 1 -> X: 2
    "test_L_Id_R_Lit_Op_Neq": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createIdentifier("X"), createLiteral(1), "!="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 2, result.rangeChain.getFromRange());
    },

    //1 != X -> X: 2
    "test_L_Lit_R_Id_Op_Neq": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createLiteral(1), createIdentifier("X"), "!="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 2, result.rangeChain.getFromRange());
    },

    //X === 1 -> X: 1
    "test_L_Id_R_Lit_Op_Teq": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createIdentifier("X"), createLiteral(1), "==="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 1, result.rangeChain.getFromRange());
    },

    //1 === X -> X: 1
    "test_L_Lit_R_Id_Op_Teq": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createLiteral(1), createIdentifier("X"), "==="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 1, result.rangeChain.getFromRange());
    },

    //X !== 1 -> X: 2
    "test_L_Id_R_Lit_Op_Tneq": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createIdentifier("X"), createLiteral(1), "!=="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 2, result.rangeChain.getFromRange());
    },

    //1 !== X -> X: 2
    "test_L_Lit_R_Id_Op_Tneq": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createLiteral(1), createIdentifier("X"), "!=="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 2, result.rangeChain.getFromRange());
    },

    //X < 1 -> X: 0
    "test_L_Id_R_Lit_Op_LT": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createIdentifier("X"), createLiteral(1), "<"));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 0, result.rangeChain.getFromRange());
    },

    // 1 < X -> X: 2
    "test_L_Lit_R_Id_Op_LT": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createLiteral(1), createIdentifier("X"), "<"));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 2, result.rangeChain.getFromRange());
    },

    //X <= 1 -> X: 1
    "test_L_Id_R_Lit_Op_LET": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createIdentifier("X"), createLiteral(1), "<="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 1, result.rangeChain.getFromRange());
    },

    // 1 <= X -> X: 1
    "test_L_Lit_R_Id_Op_LET": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createLiteral(1), createIdentifier("X"), "<="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 1, result.rangeChain.getFromRange());
    },

    //X >= 1 -> X: 1
    "test_L_Id_R_Lit_Op_GET": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createIdentifier("X"), createLiteral(1), ">="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 1, result.rangeChain.getFromRange());
    },

    // 1 >= X -> X: 1
    "test_L_Lit_R_Id_Op_GET": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(createLiteral(1), createIdentifier("X"), ">="));

        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 1, result.rangeChain.getFromRange());
    }
}); */

TestCase("Second Stage Complexity of Binary Expressions - one math expression (e.g a [+-*%/] b) other literal",
{
    //X - 3 == 4 -> X == 7 -> X:7
    "test_L_ME_R_LIT_OP_EQ": function()
    {
        var result = fcSymbolic.ConstraintResolver.resolveConstraint(evalBinary(evalBinary(createIdentifier("X"), createLiteral(3), "-"), createLiteral(4), "=="));
        assertEquals("Identifier: ", result.identifier, "X");
        assertEquals("Value: ", 7, result.rangeChain.getFromRange());
    }
});


TestCase("Union",
{
    "testNoOverlap": function()
    {
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(1, 4), new fcSymbolic.NumberRange(5, 8));
        assertEquals("Chain should have two items", 2, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, 1);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 4);

        assertEquals("Second Lower bound:", union.chain[1].lowerBound, 5);
        assertEquals("Second Upper bound:", union.chain[1].upperBound, 8);
        /*****************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(5, 8), new fcSymbolic.NumberRange(1, 4));
        assertEquals("Chain should have two items", 2, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, 1);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 4);

        assertEquals("Second Lower bound:", union.chain[1].lowerBound, 5);
        assertEquals("Second Upper bound:", union.chain[1].upperBound, 8);
        /*****************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(Number.NEGATIVE_INFINITY, 4), new fcSymbolic.NumberRange(5, Number.POSITIVE_INFINITY));
        assertEquals("Chain should have two items", 2, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, Number.NEGATIVE_INFINITY);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 4);

        assertEquals("Second Lower bound:", union.chain[1].lowerBound, 5);
        assertEquals("Second Upper bound:", union.chain[1].upperBound, Number.POSITIVE_INFINITY);
        /*****************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(Number.NEGATIVE_INFINITY, 4), new fcSymbolic.NumberRange(5, Number.POSITIVE_INFINITY));
        assertEquals("Chain should have two items", 2, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, Number.NEGATIVE_INFINITY);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 4);

        assertEquals("Second Lower bound:", union.chain[1].lowerBound, 5);
        assertEquals("Second Upper bound:", union.chain[1].upperBound, Number.POSITIVE_INFINITY);
        /*****************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(5, Number.POSITIVE_INFINITY), new fcSymbolic.NumberRange(Number.NEGATIVE_INFINITY, 4));
        assertEquals("Chain should have two items", 2, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, Number.NEGATIVE_INFINITY);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 4);

        assertEquals("Second Lower bound:", union.chain[1].lowerBound, 5);
        assertEquals("Second Upper bound:", union.chain[1].upperBound, Number.POSITIVE_INFINITY);
    },

    "testCrossing": function()
    {
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(1, 4), new fcSymbolic.NumberRange(2, 8));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, 1);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 8);
        /***************************************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(2, 8), new fcSymbolic.NumberRange(1, 4));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, 1);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 8);
        /***************************************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(Number.NEGATIVE_INFINITY, 4), new fcSymbolic.NumberRange(2, 8));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, Number.NEGATIVE_INFINITY);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 8);
        /***************************************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(2, 8), new fcSymbolic.NumberRange(Number.NEGATIVE_INFINITY, 4));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, Number.NEGATIVE_INFINITY);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 8);
        /***************************************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(Number.NEGATIVE_INFINITY, 4), new fcSymbolic.NumberRange(2, Number.POSITIVE_INFINITY));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, Number.NEGATIVE_INFINITY);
        assertEquals("First Upper bound:", union.chain[0].upperBound, Number.POSITIVE_INFINITY);
        /***************************************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(Number.NEGATIVE_INFINITY, 4), new fcSymbolic.NumberRange(2, Number.POSITIVE_INFINITY));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, Number.NEGATIVE_INFINITY);
        assertEquals("First Upper bound:", union.chain[0].upperBound, Number.POSITIVE_INFINITY);
        /***************************************************************************************/
    },
    "testWhollyOverlapping": function()
    {
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(1, 4), new fcSymbolic.NumberRange(1, 4));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, 1);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 4);
        /***************************************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(Number.NEGATIVE_INFINITY, 4), new fcSymbolic.NumberRange(Number.NEGATIVE_INFINITY, 4));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, Number.NEGATIVE_INFINITY);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 4);
        /***************************************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(1, Number.POSITIVE_INFINITY), new fcSymbolic.NumberRange(1, Number.POSITIVE_INFINITY));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, 1);
        assertEquals("First Upper bound:", union.chain[0].upperBound, Number.POSITIVE_INFINITY);
        /***************************************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY), new fcSymbolic.NumberRange(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, Number.NEGATIVE_INFINITY);
        assertEquals("First Upper bound:", union.chain[0].upperBound, Number.POSITIVE_INFINITY);
    },

    testPartiallyOverlapping: function()
    {
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(1, 4), new fcSymbolic.NumberRange(1, 5));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, 1);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 5);
        /***********************************************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(1, 5), new fcSymbolic.NumberRange(1, 4));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, 1);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 5);
        /***********************************************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(2, 6), new fcSymbolic.NumberRange(4, 6));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, 2);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 6);
        /***********************************************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(4, 6), new fcSymbolic.NumberRange(2, 6));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, 2);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 6);
        /***********************************************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(Number.NEGATIVE_INFINITY, 6), new fcSymbolic.NumberRange(Number.NEGATIVE_INFINITY, 8));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, Number.NEGATIVE_INFINITY);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 8);
        /***********************************************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(6, Number.POSITIVE_INFINITY), new fcSymbolic.NumberRange(8, Number.POSITIVE_INFINITY));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, 6);
        assertEquals("First Upper bound:", union.chain[0].upperBound, Number.POSITIVE_INFINITY);
        /***********************************************************************************************/
    },

    testContainedWithin: function()
    {
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(1, 6), new fcSymbolic.NumberRange(2, 4));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, 1);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 6);
        /***********************************************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(2, 4), new fcSymbolic.NumberRange(1, 6));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, 1);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 6);
        /***********************************************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(Number.NEGATIVE_INFINITY, 6), new fcSymbolic.NumberRange(2, 4));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, Number.NEGATIVE_INFINITY);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 6);
        /***********************************************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(2, 4), new fcSymbolic.NumberRange(Number.NEGATIVE_INFINITY, 6));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, Number.NEGATIVE_INFINITY);
        assertEquals("First Upper bound:", union.chain[0].upperBound, 6);

        assertEquals("Chain should have two items", 1, union.chain.length);
        /***********************************************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(2, Number.POSITIVE_INFINITY), new fcSymbolic.NumberRange(4, 6));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, 2);
        assertEquals("First Upper bound:", union.chain[0].upperBound, Number.POSITIVE_INFINITY);
        /***********************************************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(4, 6), new fcSymbolic.NumberRange(2, Number.POSITIVE_INFINITY));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, 2);
        assertEquals("First Upper bound:", union.chain[0].upperBound, Number.POSITIVE_INFINITY);
        /***********************************************************************************************/
        var union = fcSymbolic.NumberRange.makeUnion(new fcSymbolic.NumberRange(Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY), new fcSymbolic.NumberRange(2, 6));
        assertEquals("Chain should have two items", 1, union.chain.length);

        assertEquals("First Lower bound:", union.chain[0].lowerBound, Number.NEGATIVE_INFINITY);
        assertEquals("First Upper bound:", union.chain[0].upperBound, Number.POSITIVE_INFINITY);
    }
});