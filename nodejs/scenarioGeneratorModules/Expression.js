var ValueTypeHelper = require("C:\\GitWebStorm\\Firecrow\\chrome\\content\\Firecrow\\helpers\\ValueTypeHelper.js").ValueTypeHelper;
var ScenarioGeneratorHelper = require("C:\\GitWebStorm\\Firecrow\\nodejs\\scenarioGeneratorModules\\ScenarioGeneratorHelper.js").ScenarioGeneratorHelper;
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

var CONST =
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
                case CONST.BINARY_OP.LT: return CONST.BINARY_OP.GET;
                case CONST.BINARY_OP.GT: return CONST.BINARY_OP.LET;
                case CONST.BINARY_OP.LET: return CONST.BINARY_OP.GT;
                case CONST.BINARY_OP.GET: return CONST.BINARY_OP.LT;
                case CONST.BINARY_OP.EQ: return CONST.BINARY_OP.NEQ;
                case CONST.BINARY_OP.NEQ: return CONST.BINARY_OP.EQ;
                case CONST.BINARY_OP.TEQ: return CONST.BINARY_OP.TNEQ;
                case CONST.BINARY_OP.TNEQ: return CONST.BINARY_OP.TEQ;
                default: debugger; alert("Opposite Binary - should not be here"); return null;
            }
        },

        getSwapPositionOperator: function(operator)
        {
            switch(operator)
            {
                case CONST.BINARY_OP.LT: return CONST.BINARY_OP.GT;
                case CONST.BINARY_OP.GT: return CONST.BINARY_OP.LT;
                case CONST.BINARY_OP.LET: return CONST.BINARY_OP.GET;
                case CONST.BINARY_OP.GET: return CONST.BINARY_OP.LET;
                case CONST.BINARY_OP.EQ: return CONST.BINARY_OP.EQ;
                case CONST.BINARY_OP.NEQ: return CONST.BINARY_OP.NEQ;
                case CONST.BINARY_OP.TEQ: return CONST.BINARY_OP.TEQ;
                case CONST.BINARY_OP.TNEQ: return CONST.BINARY_OP.TNEQ;
                default: debugger; alert("Swap Binary - should not be here"); return null;
            }
        },

        isEqualityOperator: function(operator)
        {
            switch(operator)
            {
                case CONST.BINARY_OP.EQ:
                case CONST.BINARY_OP.NEQ:
                case CONST.BINARY_OP.TEQ:
                case CONST.BINARY_OP.TNEQ:
                    return true;
                default:
                    return false;
            }
        }
    }
};

function Expression(){};
Expression.LAST_ID = 0;
Expression.fromObjectLiteral = function(objectLiteral)
{
    if(objectLiteral == null) { return null; }

    var type = objectLiteral.type;

    var expression = null;

         if(type == CONST.IDENTIFIER) { expression = new Identifier(objectLiteral.name); }
    else if(type == CONST.LITERAL) { expression = new Literal(objectLiteral.value); }
    else if(type == CONST.UNARY) { expression = new Unary(Expression.fromObjectLiteral(objectLiteral.argument), objectLiteral.operator, objectLiteral.prefix);}
    else if(type == CONST.BINARY) { expression = new Binary(Expression.fromObjectLiteral(objectLiteral.left), Expression.fromObjectLiteral(objectLiteral.right), objectLiteral.operator); }
    else if(type == CONST.UPDATE) { expression = new Update(Expression.fromObjectLiteral(objectLiteral.argument), objectLiteral.operator, objectLiteral.prefix);}
    else if(type == CONST.LOGICAL) { expression = new Logical(Expression.fromObjectLiteral(objectLiteral.left), Expression.fromObjectLiteral(objectLiteral.right), objectLiteral.operator); }
    else { alert("UNKNOWN EXPRESSION!") ;}

    expression.isIrreversible = objectLiteral.isIrreversible;

    return expression;
};

Expression.prototype =
{
    isIdentifier: function() { return this.type == CONST.IDENTIFIER; },
    isLiteral: function() { return this.type == CONST.LITERAL; },
    isSequence: function() { return this.type == CONST.SEQUENCE; },
    isUnary: function() { return this.type == CONST.UNARY; },
    isBinary: function() { return this.type == CONST.BINARY; },
    isBinaryStringLiteral: function() { return this.isBinary() && this.left.isIdentifier() && this.right.isLiteral() && ValueTypeHelper.isString(this.right.value); },
    isUpdate: function() { return this.type == CONST.UPDATE; },
    isLogical: function() { return this.type == CONST.LOGICAL; },
    markAsIrreversible: function() { this.isIrreversible = true; },
    setId: function()
    {
        this.id = Expression.LAST_ID;
        Expression.LAST_ID++;
    }
}

function Identifier(name)
{
    this.setId();

    this.name = name;

    this.type = CONST.IDENTIFIER;
};
Identifier.prototype = new Expression();
Identifier.prototype.toString = function() { return this.name; }
Identifier.prototype.containsNumericExpressions = function() { return false; };
Identifier.prototype.containsStringExpressions = function() { return false; };
Identifier.prototype.getIdentifierNames = function() { return [this.name]; };
Identifier.prototype.getStringLiterals = function() { return []; };
Identifier.prototype.getHtmlElements = function() { return this.htmlElement != null ? [this.htmlElement] : []; };
Identifier.prototype.createCopyUpgradedByIndex = function(upgradeByIndex)
{
    return new Identifier(ScenarioGeneratorHelper.addToPropertyName(this.name, upgradeByIndex));
};
Identifier.prototype.createCopyWithIndex = function(newIndex)
{
    return new Identifier(ScenarioGeneratorHelper.updatePropertyNameWithNewIndex(this.name, newIndex));
};

Identifier.prototype.createCopyWithReplacedLiterals = function(replacement) { return new Identifier(this.name); }
Identifier.prototype.hasOnlyIdentifiers = function() { return true; }

var Literal = function(value)
{
    this.setId();

    this.value = value;

    if(this.value === undefined || this.value === null)
    {
        this.value = 0;
    }

    this.type = CONST.LITERAL;
};
Literal.prototype = new Expression();
Literal.prototype.containsNumericExpressions = function() { return ValueTypeHelper.isNumber(this.value); };
Literal.prototype.containsStringExpressions = function() { return ValueTypeHelper.isString(this.value); };
Literal.prototype.getIdentifierNames = function() { return [];};
Literal.prototype.getStringLiterals = function() { return ValueTypeHelper.isString(this.value) ? [this.value] : []; };
Literal.prototype.createCopyWithReplacedLiterals = function(replacement)
{
    return replacement[this.value] !== null ? new Literal(replacement[this.value])
                                            : new Literal(this.value);
};
Literal.prototype.toString = function()
{
    return ValueTypeHelper.isString(this.value) ? '"' + this.value + '"'
                                                : this.value;
};
Literal.prototype.createCopyUpgradedByIndex = function(upgradeByIndex)
{
    return new Literal(this.value);
};
Literal.prototype.createCopyWithIndex = function(index)
{
    return new Literal(this.value);
};
Literal.prototype.hasOnlyIdentifiers = function() { return false; }

function Unary(argument, operator, prefix)
{
    this.setId();

    this.argument = argument;
    this.operator = operator;
    this.prefix = prefix;

    this.type = CONST.UNARY;
};
Unary.prototype = new Expression();
Unary.prototype.containsNumericExpressions = function() { return this.argument.containsNumericExpressions(); };
Unary.prototype.containsStringExpressions = function() { return this.argument.containsStringExpressions(); };
Unary.prototype.getIdentifierNames = function() { return this.argument.getIdentifierNames(); }
Unary.prototype.getStringLiterals = function() { return this.argument.getStringLiterals(); };
Unary.prototype.createCopyWithReplacedLiterals = function(replacement)
{
    return new Logical(this.argument.createCopyWithReplacedLiterals(replacement), this.operator, this.prefix);
};
Unary.prototype.toString = function()
{
    var string = "";

    if(this.prefix) { string += this.operator; }

    string += this.argument;

    if(!this.prefix) { string += this.operator; }

    return string;
};
Unary.prototype.createCopyUpgradedByIndex = function(upgradeByIndex)
{
    return new Unary(this.argument.createCopyUpgradedByIndex(upgradeByIndex), this.operator, this.prefix);
};

Unary.prototype.createCopyWithIndex = function(index)
{
    return new Unary(this.argument.createCopyWithIndex(index), this.operator, this.prefix);
};

Unary.prototype.hasOnlyIdentifiers = function() { return this.argument.hasOnlyIdentifiers(); }

function Binary(left, right, operator)
{
    this.setId();

    this.left = left;
    this.right = right;
    this.operator = operator;

    this.type = CONST.BINARY;
};
Binary.createIrreversibleIdentifierEqualsLiteral = function(identifierName, literalValue)
{
    var binary = new Binary(new Identifier(identifierName), new Literal(literalValue), "==");

    binary.markAsIrreversible();

    return binary;
};

Binary.createIrreversibleIdentifierGreaterEqualsThanLiteral = function(identifierName, literalValue)
{
    var binary = new Binary(new Identifier(identifierName), new Literal(literalValue), ">=");

    binary.markAsIrreversible();

    return binary;
};

Binary.prototype = new Expression();
Binary.prototype.toString = function() { return this.left + " " + this.operator + " " + this.right; };
Binary.prototype.containsNumericExpressions = function() { return this.left.containsNumericExpressions() || this.right.containsNumericExpressions(); };
Binary.prototype.containsStringExpressions = function() { return this.left.containsStringExpressions() || this.right.containsStringExpressions(); };
Binary.prototype.getStringLiterals = function() { return this.left.getStringLiterals().concat(this.right.getStringLiterals()); };
Binary.prototype.createCopyWithReplacedLiterals = function(replacement)
{
    return new Binary(this.left.createCopyWithReplacedLiterals(replacement), this.right.createCopyWithReplacedLiterals(replacement), this.operator);
};
Binary.prototype.getIdentifierNames = function()
{
    var identifierNames = [];

    ValueTypeHelper.pushAll(identifierNames, this.left.getIdentifierNames());
    ValueTypeHelper.pushAll(identifierNames, this.right.getIdentifierNames());

    return  identifierNames;
};

Binary.prototype.createCopyUpgradedByIndex = function(upgradeByIndex)
{
    return new Binary(this.left.createCopyUpgradedByIndex(upgradeByIndex), this.right.createCopyUpgradedByIndex(upgradeByIndex), this.operator);
};
Binary.prototype.createCopyWithIndex = function(index)
{
    return new Binary(this.left.createCopyWithIndex(index), this.right.createCopyWithIndex(index), this.operator);
};
Binary.prototype.hasOnlyIdentifiers = function() { return this.left.hasOnlyIdentifiers() && this.right.hasOnlyIdentifiers(); }

function Update(argument, operator, prefix)
{
    this.setId();

    this.argument = argument;
    this.operator = operator;
    this.prefix = prefix;

    this.type = CONST.UPDATE;
};
Update.prototype = new Expression();
Update.prototype.containsNumericExpressions = function() { return this.argument.containsNumericExpressions(); };
Update.prototype.containsStringExpressions = function() { return this.argument.containsStringExpressions(); };
Update.prototype.getStringLiterals = function() { return this.argument.getStringLiterals(); };
Update.prototype.toString = function()
{
    var string = "";

    if(this.prefix) { string += this.operator; }

    string += this.argument;

    if(!this.prefix) { string += this.operator; }

    return string;
};
Update.prototype.createCopyWithReplacedLiterals = function(replacement)
{
    return new Update(this.argument.createCopyWithReplacedLiterals(), this.operator, this.prefix);
};

Update.prototype.createCopyUpgradedByIndex = function(upgradeByIndex)
{
    return new Update(this.argument.createCopyUpgradedByIndex(upgradeByIndex), this.operator, this.prefix);
};

Update.prototype.createCopyWithIndex = function(index)
{
    return new Update(this.argument.createCopyWithIndex(index), this.operator, this.prefix);
};
Update.prototype.hasOnlyIdentifiers = function() { return this.argument.hasOnlyIdentifiers(); }

function Logical (left, right, operator)
{
    this.setId();

    this.left = left;
    this.right = right;
    this.operator = operator;

    this.type = CONST.LOGICAL;
    this._fix();
};

Logical.createIrreversibleOr = function(left, right)
{
    var logical = new Logical(left, right, "||");

    logical.markAsIrreversible();

    return logical;
};

Logical.prototype = new Expression();
Logical.prototype.containsNumericExpressions = function() { return this.left.containsNumericExpressions() || this.right.containsNumericExpressions(); };
Logical.prototype.containsNumericExpressions = function() { return this.left.containsNumericExpressions() || this.right.containsNumericExpressions(); };
Logical.prototype.containsStringExpressions = function() { return this.left.containsStringExpressions() || this.right.containsStringExpressions(); };
Logical.prototype.getStringLiterals = function() { return this.left.getStringLiterals().concat(this.right.getStringLiterals()); };
Logical.prototype.createCopyWithReplacedLiterals = function(replacement)
{
    return new Logical(this.left.createCopyWithReplacedLiterals(replacement), this.right.createCopyWithReplacedLiterals(replacement), this.operator);
};
Logical.prototype.getIdentifierNames = function()
{
    var identifierNames = [];

    ValueTypeHelper.pushAll(identifierNames, this.left.getIdentifierNames());
    ValueTypeHelper.pushAll(identifierNames, this.right.getIdentifierNames());

    return  identifierNames;
};
Logical.prototype.toString = function() { return this.left + " " + this.operator + " " + this.right; };
Logical.prototype.createCopyUpgradedByIndex = function(upgradeByIndex)
{
    return new Logical(this.left.createCopyUpgradedByIndex(upgradeByIndex), this.right.createCopyUpgradedByIndex(upgradeByIndex), this.operator);
};
Logical.prototype.createCopyWithIndex = function(index)
{
    return new Logical(this.left.createCopyWithIndex(index), this.right.createCopyWithIndex(index), this.operator);
};
Logical.prototype._fix = function()
{
    if(this.left.type == CONST.IDENTIFIER && this.right.type == CONST.IDENTIFIER)
    {
        this.left = new Binary(this.left, new Literal(0), ">=");
        this.right = new Binary(this.right, new Literal(0), ">=");
    }
};

Logical.prototype.hasOnlyIdentifiers = function() { return this.left.hasOnlyIdentifiers() && this.right.hasOnlyIdentifiers(); }

exports.Expression = Expression;
exports.Identifier = Identifier;
exports.Literal = Literal;
exports.Unary = Unary;
exports.Binary = Binary;
exports.Update = Update;
exports.Logical = Logical;
exports.CONST = CONST;