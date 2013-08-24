FBL.ns(function() { with (FBL) {
/*****************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
//https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API
/*
 - Expression
 - ThisExpression ?
 - Identifier
 - Literal
 - SequenceExpression
 - expressions: [Expression]
 - UnaryExpression
 - operator: UnaryOperator (- + ! ~ typeof void delete)
 - prefix: boolean
 - argument: Expression
 - BinaryExpression
 - operator: BinaryOperator (!= === !== < <= > >= << >> >>> + - * / % | ^ in instanceof ..)
 - left: Expression
 - right: Expression
 - UpdateExpression
 - operator: UpdateOperator ++ --
 - prefix: boolean
 - argument: Expression
 - LogicalExpression
 - operator (&& ||)
 - left: Expression
 - right: Expression
 - ConditionalExpression ?
 - test: Expression
 - alternate: Expression
 - consequent: Expression
 - MemberExpression ?
 - object: Expression
 - property: Identifier | Expression
 * */

var fcSymbolic = Firecrow.ScenarioGenerator.Symbolic;
var fcScenarioGenerator = Firecrow.ScenarioGenerator;
fcSymbolic.CONST =
{
    IDENTIFIER: "Identifier",
    LITERAL: "Literal",
    SEQUENCE: "Sequence",
    UNARY: "Unary",
    BINARY: "Binary",
    UPDATE: "Update",
    LOGICAL: "Logical",
    BINARY_OP:
    {
        LT: "<",
        GT: ">",
        LET: "<=",
        GET: ">=",
        EQ: "==",
        NEQ: "!=",
        TEQ: "===",
        TNEQ: "!==",
        getInverse: function(operator)
        {
            switch(operator)
            {
                case fcSymbolic.CONST.BINARY_OP.LT: return fcSymbolic.CONST.BINARY_OP.GET;
                case fcSymbolic.CONST.BINARY_OP.GT: return fcSymbolic.CONST.BINARY_OP.LET;
                case fcSymbolic.CONST.BINARY_OP.LET: return fcSymbolic.CONST.BINARY_OP.GT;
                case fcSymbolic.CONST.BINARY_OP.GET: return fcSymbolic.CONST.BINARY_OP.LT;
                case fcSymbolic.CONST.BINARY_OP.EQ: return fcSymbolic.CONST.BINARY_OP.NEQ;
                case fcSymbolic.CONST.BINARY_OP.NEQ: return fcSymbolic.CONST.BINARY_OP.EQ;
                case fcSymbolic.CONST.BINARY_OP.TEQ: return fcSymbolic.CONST.BINARY_OP.TNEQ;
                case fcSymbolic.CONST.BINARY_OP.TNEQ: return fcSymbolic.CONST.BINARY_OP.TEQ;
                default: debugger; alert("Opposite Binary - should not be here"); return null;
            }
        },

        getSwapPositionOperator: function(operator)
        {
            switch(operator)
            {
                case fcSymbolic.CONST.BINARY_OP.LT: return fcSymbolic.CONST.BINARY_OP.GT;
                case fcSymbolic.CONST.BINARY_OP.GT: return fcSymbolic.CONST.BINARY_OP.LT;
                case fcSymbolic.CONST.BINARY_OP.LET: return fcSymbolic.CONST.BINARY_OP.GET;
                case fcSymbolic.CONST.BINARY_OP.GET: return fcSymbolic.CONST.BINARY_OP.LET;
                case fcSymbolic.CONST.BINARY_OP.EQ: return fcSymbolic.CONST.BINARY_OP.EQ;
                case fcSymbolic.CONST.BINARY_OP.NEQ: return fcSymbolic.CONST.BINARY_OP.NEQ;
                case fcSymbolic.CONST.BINARY_OP.TEQ: return fcSymbolic.CONST.BINARY_OP.TEQ;
                case fcSymbolic.CONST.BINARY_OP.TNEQ: return fcSymbolic.CONST.BINARY_OP.TNEQ;
                default: debugger; alert("Swap Binary - should not be here"); return null;
            }
        },

        isEqualityOperator: function(operator)
        {
            switch(operator)
            {
                case fcSymbolic.CONST.BINARY_OP.EQ:
                case fcSymbolic.CONST.BINARY_OP.NEQ:
                case fcSymbolic.CONST.BINARY_OP.TEQ:
                case fcSymbolic.CONST.BINARY_OP.TNEQ:
                    return true;
                default:
                    return false;
            }
        }
    }
};

fcSymbolic.Expression = function(){};
fcSymbolic.Expression.LAST_ID = 0;
fcSymbolic.Expression.prototype =
{
    isIdentifier: function() { return this.type == fcSymbolic.CONST.IDENTIFIER; },
    isLiteral: function() { return this.type == fcSymbolic.CONST.LITERAL; },
    isSequence: function() { return this.type == fcSymbolic.CONST.SEQUENCE; },
    isUnary: function() { return this.type == fcSymbolic.CONST.UNARY; },
    isBinary: function() { return this.type == fcSymbolic.CONST.BINARY; },
    isBinaryStringLiteral: function() { return this.isBinary() && this.left.isIdentifier() && this.right.isLiteral() && ValueTypeHelper.isString(this.right.value); },
    isUpdate: function() { return this.type == fcSymbolic.CONST.UPDATE; },
    isLogical: function() { return this.type == fcSymbolic.CONST.LOGICAL; },
    markAsIrreversible: function() { this.isIrreversible = true; },
    setId: function()
    {
        this.id = fcSymbolic.Expression.LAST_ID;
        fcSymbolic.Expression.LAST_ID++;
    }
}

fcSymbolic.Identifier = function(name)
{
    this.setId();

    this.name = name;

    this.type = fcSymbolic.CONST.IDENTIFIER;
};
fcSymbolic.Identifier.prototype = new fcSymbolic.Expression();
fcSymbolic.Identifier.prototype.toString = function() { return this.name; }
fcSymbolic.Identifier.prototype.containsNumericExpressions = function() { return false; };
fcSymbolic.Identifier.prototype.containsStringExpressions = function() { return false; };
fcSymbolic.Identifier.prototype.getIdentifierNames = function() { return [this.name]; };
fcSymbolic.Identifier.prototype.getStringLiterals = function() { return []; };
fcSymbolic.Identifier.prototype.getHtmlElements = function() { return this.htmlElement != null ? [this.htmlElement] : []; };
fcSymbolic.Identifier.prototype.createCopyUpgradedByIndex = function(upgradeByIndex)
{
    return new fcSymbolic.Identifier(fcScenarioGenerator.ScenarioGenerator.addToPropertyName(this.name, upgradeByIndex));
};
fcSymbolic.Identifier.prototype.createCopyWithIndex = function(newIndex)
{
    return new fcSymbolic.Identifier(fcScenarioGenerator.ScenarioGenerator.updatePropertyNameWithNewIndex(this.name, newIndex));
};

fcSymbolic.Identifier.prototype.createCopyWithReplacedLiterals = function(replacement) { return new fcSymbolic.Identifier(this.name); }
fcSymbolic.Identifier.prototype.hasOnlyIdentifiers = function() { return true; }
fcSymbolic.Identifier.prototype.toJSON = function() { return { type: this.type, name: this.name, isIrreversible: this.isIrreversible }; }

fcSymbolic.Literal = function(value)
{
    this.setId();

    this.value = value;

    if(this.value === undefined || this.value === null)
    {
        this.value = 0;
    }

    this.type = fcSymbolic.CONST.LITERAL;
};
fcSymbolic.Literal.prototype = new fcSymbolic.Expression();
fcSymbolic.Literal.prototype.containsNumericExpressions = function() { return ValueTypeHelper.isNumber(this.value); };
fcSymbolic.Literal.prototype.containsStringExpressions = function() { return ValueTypeHelper.isString(this.value); };
fcSymbolic.Literal.prototype.getIdentifierNames = function() { return [];};
fcSymbolic.Literal.prototype.getStringLiterals = function() { return ValueTypeHelper.isString(this.value) ? [this.value] : []; };
fcSymbolic.Literal.prototype.createCopyWithReplacedLiterals = function(replacement)
{
    return replacement[this.value] !== null ? new fcSymbolic.Literal(replacement[this.value])
                                            : new fcSymbolic.Literal(this.value);
};
fcSymbolic.Literal.prototype.toString = function()
{
    return ValueTypeHelper.isString(this.value) ? '"' + this.value + '"'
                                                : this.value;
};
fcSymbolic.Literal.prototype.createCopyUpgradedByIndex = function(upgradeByIndex)
{
    return new fcSymbolic.Literal(this.value);
};
fcSymbolic.Literal.prototype.createCopyWithIndex = function(index)
{
    return new fcSymbolic.Literal(this.value);
};
fcSymbolic.Literal.prototype.hasOnlyIdentifiers = function() { return false; }
fcSymbolic.Literal.prototype.toJSON = function() { return { type: this.type, value: this.value, isIrreversible: this.isIrreversible }; }

fcSymbolic.Unary = function(argument, operator, prefix)
{
    this.setId();

    this.argument = argument;
    this.operator = operator;
    this.prefix = prefix;

    this.type = fcSymbolic.CONST.UNARY;
};
fcSymbolic.Unary.prototype = new fcSymbolic.Expression();
fcSymbolic.Unary.prototype.containsNumericExpressions = function() { return this.argument.containsNumericExpressions(); };
fcSymbolic.Unary.prototype.containsStringExpressions = function() { return this.argument.containsStringExpressions(); };
fcSymbolic.Unary.prototype.getIdentifierNames = function() { return this.argument.getIdentifierNames(); }
fcSymbolic.Unary.prototype.getStringLiterals = function() { return this.argument.getStringLiterals(); };
fcSymbolic.Unary.prototype.createCopyWithReplacedLiterals = function(replacement)
{
    return new fcSymbolic.Logical(this.argument.createCopyWithReplacedLiterals(replacement), this.operator, this.prefix);
};
fcSymbolic.Unary.prototype.toString = function()
{
    var string = "";

    if(this.prefix) { string += this.operator; }

    string += this.argument;

    if(!this.prefix) { string += this.operator; }

    return string;
};
fcSymbolic.Unary.prototype.createCopyUpgradedByIndex = function(upgradeByIndex)
{
    return new fcSymbolic.Unary(this.argument.createCopyUpgradedByIndex(upgradeByIndex), this.operator, this.prefix);
};

fcSymbolic.Unary.prototype.createCopyWithIndex = function(index)
{
    return new fcSymbolic.Unary(this.argument.createCopyWithIndex(index), this.operator, this.prefix);
};

fcSymbolic.Unary.prototype.hasOnlyIdentifiers = function() { return this.argument.hasOnlyIdentifiers(); }
fcSymbolic.Unary.prototype.toJSON = function() { return { type: this.type, operator: this.operator, prefix: this.prefix, argument: this.argument.toJSON(), isIrreversible: this.isIrreversible }; }

fcSymbolic.Binary = function(left, right, operator)
{
    this.setId();

    this.left = left;
    this.right = right;
    this.operator = operator;

    this.type = fcSymbolic.CONST.BINARY;
};
fcSymbolic.Binary.createIrreversibleIdentifierEqualsLiteral = function(identifierName, literalValue)
{
    var binary = new fcSymbolic.Binary(new fcSymbolic.Identifier(identifierName), new fcSymbolic.Literal(literalValue), "==");

    binary.markAsIrreversible();

    return binary;
};

fcSymbolic.Binary.createIrreversibleIdentifierGreaterEqualsThanLiteral = function(identifierName, literalValue)
{
    var binary = new fcSymbolic.Binary(new fcSymbolic.Identifier(identifierName), new fcSymbolic.Literal(literalValue), ">=");

    binary.markAsIrreversible();

    return binary;
};

fcSymbolic.Binary.prototype = new fcSymbolic.Expression();
fcSymbolic.Binary.prototype.toString = function() { return this.left + " " + this.operator + " " + this.right; };
fcSymbolic.Binary.prototype.containsNumericExpressions = function() { return this.left.containsNumericExpressions() || this.right.containsNumericExpressions(); };
fcSymbolic.Binary.prototype.containsStringExpressions = function() { return this.left.containsStringExpressions() || this.right.containsStringExpressions(); };
fcSymbolic.Binary.prototype.getStringLiterals = function() { return this.left.getStringLiterals().concat(this.right.getStringLiterals()); };
fcSymbolic.Binary.prototype.createCopyWithReplacedLiterals = function(replacement)
{
    return new fcSymbolic.Binary(this.left.createCopyWithReplacedLiterals(replacement), this.right.createCopyWithReplacedLiterals(replacement), this.operator);
};
fcSymbolic.Binary.prototype.getIdentifierNames = function()
{
    var identifierNames = [];

    ValueTypeHelper.pushAll(identifierNames, this.left.getIdentifierNames());
    ValueTypeHelper.pushAll(identifierNames, this.right.getIdentifierNames());

    return  identifierNames;
};

fcSymbolic.Binary.prototype.createCopyUpgradedByIndex = function(upgradeByIndex)
{
    return new fcSymbolic.Binary(this.left.createCopyUpgradedByIndex(upgradeByIndex), this.right.createCopyUpgradedByIndex(upgradeByIndex), this.operator);
};
fcSymbolic.Binary.prototype.createCopyWithIndex = function(index)
{
    return new fcSymbolic.Binary(this.left.createCopyWithIndex(index), this.right.createCopyWithIndex(index), this.operator);
};
fcSymbolic.Binary.prototype.hasOnlyIdentifiers = function() { return this.left.hasOnlyIdentifiers() && this.right.hasOnlyIdentifiers(); }
fcSymbolic.Binary.prototype.toJSON = function() { return { type: this.type, operator: this.operator, left: this.left.toJSON(), right: this.right.toJSON(), isIrreversible: this.isIrreversible }; }

fcSymbolic.Update = function(argument, operator, prefix)
{
    this.setId();

    this.argument = argument;
    this.operator = operator;
    this.prefix = prefix;

    this.type = fcSymbolic.CONST.UPDATE;
};
fcSymbolic.Update.prototype = new fcSymbolic.Expression();
fcSymbolic.Update.prototype.containsNumericExpressions = function() { return this.argument.containsNumericExpressions(); };
fcSymbolic.Update.prototype.containsStringExpressions = function() { return this.argument.containsStringExpressions(); };
fcSymbolic.Update.prototype.getStringLiterals = function() { return this.argument.getStringLiterals(); };
fcSymbolic.Update.prototype.toString = function()
{
    var string = "";

    if(this.prefix) { string += this.operator; }

    string += this.argument;

    if(!this.prefix) { string += this.operator; }

    return string;
};
fcSymbolic.Update.prototype.createCopyWithReplacedLiterals = function(replacement)
{
    return new fcSymbolic.Update(this.argument.createCopyWithReplacedLiterals(), this.operator, this.prefix);
};

fcSymbolic.Update.prototype.createCopyUpgradedByIndex = function(upgradeByIndex)
{
    return new fcSymbolic.Update(this.argument.createCopyUpgradedByIndex(upgradeByIndex), this.operator, this.prefix);
};

fcSymbolic.Update.prototype.createCopyWithIndex = function(index)
{
    return new fcSymbolic.Update(this.argument.createCopyWithIndex(index), this.operator, this.prefix);
};
fcSymbolic.Update.prototype.hasOnlyIdentifiers = function() { return this.argument.hasOnlyIdentifiers(); }
fcSymbolic.Update.prototype.toJSON = function() { return { type: this.type, operator: this.operator, prefix: this.prefix, argument: this.argument.toJSON(), isIrreversible: this.isIrreversible }; }

fcSymbolic.Logical = function(left, right, operator)
{
    this.setId();

    this.left = left;
    this.right = right;
    this.operator = operator;

    this.type = fcSymbolic.CONST.LOGICAL;
    this._fix();
};

fcSymbolic.Logical.createIrreversibleOr = function(left, right)
{
    var logical = new fcSymbolic.Logical(left, right, "||");

    logical.markAsIrreversible();

    return logical;
};

fcSymbolic.Logical.prototype = new fcSymbolic.Expression();
fcSymbolic.Logical.prototype.containsNumericExpressions = function() { return this.left.containsNumericExpressions() || this.right.containsNumericExpressions(); };
fcSymbolic.Logical.prototype.containsNumericExpressions = function() { return this.left.containsNumericExpressions() || this.right.containsNumericExpressions(); };
fcSymbolic.Logical.prototype.containsStringExpressions = function() { return this.left.containsStringExpressions() || this.right.containsStringExpressions(); };
fcSymbolic.Logical.prototype.getStringLiterals = function() { return this.left.getStringLiterals().concat(this.right.getStringLiterals()); };
fcSymbolic.Logical.prototype.createCopyWithReplacedLiterals = function(replacement)
{
    return new fcSymbolic.Logical(this.left.createCopyWithReplacedLiterals(replacement), this.right.createCopyWithReplacedLiterals(replacement), this.operator);
};
fcSymbolic.Logical.prototype.getIdentifierNames = function()
{
    var identifierNames = [];

    ValueTypeHelper.pushAll(identifierNames, this.left.getIdentifierNames());
    ValueTypeHelper.pushAll(identifierNames, this.right.getIdentifierNames());

    return  identifierNames;
};
fcSymbolic.Logical.prototype.toString = function() { return this.left + " " + this.operator + " " + this.right; };
fcSymbolic.Logical.prototype.createCopyUpgradedByIndex = function(upgradeByIndex)
{
    return new fcSymbolic.Logical(this.left.createCopyUpgradedByIndex(upgradeByIndex), this.right.createCopyUpgradedByIndex(upgradeByIndex), this.operator);
};
fcSymbolic.Logical.prototype.createCopyWithIndex = function(index)
{
    return new fcSymbolic.Logical(this.left.createCopyWithIndex(index), this.right.createCopyWithIndex(index), this.operator);
};
fcSymbolic.Logical.prototype._fix = function()
{
    if(this.left.type == fcSymbolic.CONST.IDENTIFIER && this.right.type == fcSymbolic.CONST.IDENTIFIER)
    {
        this.left = new fcSymbolic.Binary(this.left, new fcSymbolic.Literal(0), ">=");
        this.right = new fcSymbolic.Binary(this.right, new fcSymbolic.Literal(0), ">=");
    }
};

fcSymbolic.Logical.prototype.hasOnlyIdentifiers = function() { return this.left.hasOnlyIdentifiers() && this.right.hasOnlyIdentifiers(); }
fcSymbolic.Logical.prototype.toJSON = function() { return { type: this.type, operator: this.operator, left: this.left.toJSON(), right: this.right.toJSON(), isIrreversible: this.isIrreversible}; }
}});