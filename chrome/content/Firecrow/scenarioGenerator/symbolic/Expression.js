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
                default: alert("Opposite Binary - should not be here"); return null;
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
                default: alert("Swap Binary - should not be here"); return null;
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
fcSymbolic.Identifier.prototype.getIdentifierNames = function() { return [this.name];};
fcSymbolic.Identifier.prototype.getHtmlElements = function() { return this.htmlElement != null ? [this.htmlElement] : []; };

fcSymbolic.Literal = function(value)
{
    this.setId();

    this.value = value;

    this.type = fcSymbolic.CONST.LITERAL;
};
fcSymbolic.Literal.prototype = new fcSymbolic.Expression();
fcSymbolic.Literal.prototype.containsNumericExpressions = function() { return ValueTypeHelper.isNumber(this.value); };
fcSymbolic.Literal.prototype.getIdentifierNames = function() { return [];};
fcSymbolic.Literal.prototype.getHtmlElements = function() { return this.htmlElement != null ? [this.htmlElement] : []};
fcSymbolic.Literal.prototype.toString = function()
{
    return ValueTypeHelper.isString(this.value) ? '"' + this.value + '"'
                                                : this.value;
}

fcSymbolic.Unary = function(argument, operator, prefix)
{
    this.setId();

    this.argument = argument;
    this.operator = operator;
    this.prefix = prefix;

    this.type = fcSymbolic.CONST.UNARY;
};
fcSymbolic.Unary.prototype = new fcSymbolic.Expression();
fcSymbolic.Unary.prototype.getIdentifierNames = function() { return this.argument.getIdentifierNames(); }
fcSymbolic.Unary.prototype.getHtmlElements = function()
{
    var htmlElements = [];

    if(this.htmlElement != null)
    {
        htmlElements.push(this.htmlElement);
    }

    ValueTypeHelper.pushAll(htmlElements, this.argument.getHtmlElements());

    return htmlElements;
};
fcSymbolic.Unary.prototype.toString = function()
{
    var string = "";

    if(this.prefix) { string += this.operator; }

    string += this.argument;

    if(!this.prefix) { string += this.operator; }

    return string;
}

fcSymbolic.Binary = function(left, right, operator)
{
    this.setId();

    this.left = left;
    this.right = right;
    this.operator = operator;

    this.type = fcSymbolic.CONST.BINARY;
};
fcSymbolic.Binary.prototype = new fcSymbolic.Expression();
fcSymbolic.Binary.prototype.toString = function() { return this.left + " " + this.operator + " " + this.right; };
fcSymbolic.Binary.prototype.containsNumericExpressions = function() { return this.left.containsNumericExpressions() || this.right.containsNumericExpressions(); };
fcSymbolic.Binary.prototype.getHtmlElements = function()
{
    var htmlElements = [];

    if(this.htmlElement != null)
    {
        htmlElements.push(this.htmlElement);
    }

    ValueTypeHelper.pushAll(htmlElements, this.left.getHtmlElements());
    ValueTypeHelper.pushAll(htmlElements, this.right.getHtmlElements());

    return htmlElements;
};
fcSymbolic.Binary.prototype.getIdentifierNames = function()
{
    var identifierNames = [];

    ValueTypeHelper.pushAll(identifierNames, this.left.getIdentifierNames());
    ValueTypeHelper.pushAll(identifierNames, this.right.getIdentifierNames());

    return  identifierNames;
}

fcSymbolic.Update = function(argument, operator, prefix)
{
    this.setId();

    this.argument = argument;
    this.operator = operator;
    this.prefix = prefix;

    this.type = fcSymbolic.CONST.UPDATE;
};
fcSymbolic.Update.prototype = new fcSymbolic.Expression();
fcSymbolic.Update.prototype.toString = function()
{
    var string = "";

    if(this.prefix) { string += this.operator; }

    string += this.argument;

    if(!this.prefix) { string += this.operator; }

    return string;
}

fcSymbolic.Logical = function(left, right, operator)
{
    this.setId();

    this.left = left;
    this.right = right;
    this.operator = operator;

    if(this.left == null || this.right == null)
    {
        var a = 3;
    }

    this.type = fcSymbolic.CONST.LOGICAL;
};

fcSymbolic.Logical.prototype = new fcSymbolic.Expression();
fcSymbolic.Logical.prototype.containsNumericExpressions = function() { return this.left.containsNumericExpressions() || this.right.containsNumericExpressions(); };
fcSymbolic.Logical.prototype.getIdentifierNames = function()
{
    var identifierNames = [];

    ValueTypeHelper.pushAll(identifierNames, this.left.getIdentifierNames());
    ValueTypeHelper.pushAll(identifierNames, this.right.getIdentifierNames());

    return  identifierNames;
};
fcSymbolic.Logical.prototype.getHtmlElements = function()
{
    var htmlElements = [];

    if(this.htmlElement != null)
    {
        htmlElements.push(this.htmlElement);
    }

    ValueTypeHelper.pushAll(htmlElements, this.left.getHtmlElements());
    ValueTypeHelper.pushAll(htmlElements, this.right.getHtmlElements());

    return htmlElements;
};
fcSymbolic.Logical.prototype.toString = function() { return this.left + " " + this.operator + " " + this.right; };
}});