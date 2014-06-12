var usesModule = typeof module !== 'undefined' && module.exports;
if(usesModule)
{
    FBL =  { Firecrow: { includeNode: function(node) { if(node) { node.shouldBeIncluded = true; } }}, ns:  function(namespaceFunction){ namespaceFunction(); }};
    atob = require("atob");
}
var CodeTextGenerator;
FBL.ns(function () { with (FBL) {
/*******/
var ASTHelper = Firecrow.ASTHelper;
var ValueTypeHelper =
{
    isArray: function (arrayOfElements)
    {
        if (this.isNull(arrayOfElements)) { return false; }

        var result = (typeof arrayOfElements) == "array" || arrayOfElements instanceof Array;

        if(result) { return true; }

        if(Array != null && Array.isArray != null) { return Array.isArray(arrayOfElements); }

        return result;
    },

    isBoolean: function(variable)
    {
        if (this.isNull(variable)) { return false; }

        return typeof(variable) == "boolean";
    },

    isString: function (variable)
    {
        if (this.isNull(variable)) { return false; }

        return (typeof variable) == "string" || variable instanceof String;
    },

    isNumber: function(variable)
    {
        if (this.isNull(variable)) { return false; }

        return (typeof variable) == "number";
    },

    isInteger: function (variable)
    {
        if (this.isNull(variable)) { return false; }

        return (typeof variable) == "number" && variable == parseInt(variable,10);
    },

    isStringInteger: function(variable)
    {
        if (this.isNull(variable)) { return false; }

        return variable == parseInt(variable,10);
    },

    isNull: function (variable)
    {
        return variable === null;
    },

    isObject: function(potentialObject)
    {
        if(potentialObject == null) { return false; }

        return 'object' == typeof potentialObject;
    },

    adjustForRegExBug: function(regExElement, regExString)
    {
        if(regExElement == null || regExElement.parent == null
        || regExElement.parent.loc == null || regExElement.parent.loc.source == null || regExElement.parent.loc.source.indexOf("medialize") == -1)
        {
            return regExString;
        }

        //IT seems that Firefox regEx functionality differs if it /someRegEx/gi or /someRegEx/ig -> bug, iritating bug
        //but in the parse tree it does not show //ig but //gi regardless of what is put
        //So if it is part of the medialize library that i'm testing do that replacement
        return regExString.replace(/\/gi$/, "/ig");
    }
};

if(ASTHelper == null && usesModule)
{
    var path = require('path');
    var fs = require("fs");

    if(ASTHelper == null && usesModule)
    {
        if(fs.existsSync(path.resolve(__dirname, "../helpers/ASTHelper.js")))
        {
            ASTHelper = require(path.resolve(__dirname, "../helpers/ASTHelper.js")).ASTHelper;
        }
        else
        {
            ASTHelper = require(path.resolve(__dirname, "ASTHelper.js")).ASTHelper;
        }
    }
}

Firecrow.CodeTextGenerator = CodeTextGenerator = function(isSlicing)
{
    this.isSlicing = !!isSlicing;
};

Firecrow.CodeTextGenerator.generateSlicedCode = function(model)
{
    var codeGenerator = new Firecrow.CodeTextGenerator(true);

    return codeGenerator.generateCode(model);
}

Firecrow.CodeTextGenerator.generateProfiledCode = function(model)
{
    ASTHelper.traverseAst(model.htmlElement, function(element)
    {
        if(element.hasBeenExecuted)
        {
            if(ASTHelper.isFunctionParameter(element))
            {
                if(element.parent.shouldBeIncluded || element.parent.hasBeenExecuted)
                {
                    Firecrow.includeNode(element);
                }
            }

            if(ASTHelper.isForInStatement(element.parent))
            {
                Firecrow.includeNode(element.parent);
                Firecrow.includeNode(element.parent.right);
            }

            if(element.hasBeenExecuted)
            {
                Firecrow.includeNode(element);
            }
        }
    });

    var postProcessor = new Firecrow.DependencyGraph.DependencyPostprocessor();
    postProcessor.processHtmlElement(model.htmlElement);

    var codeGenerator = new Firecrow.CodeTextGenerator(true);

    return codeGenerator.generateCode(model);
};

Firecrow.CodeTextGenerator.generateStandAloneCode = function(model)
{
    var codeGenerator = new Firecrow.CodeTextGenerator();

    return codeGenerator.generateStandAloneCode(model);
};

Firecrow.CodeTextGenerator.generateCode = function(model)
{
    var codeGenerator = new Firecrow.CodeTextGenerator();

    return codeGenerator.generateCode(model);
};

Firecrow.CodeTextGenerator.generateJsCode = function(model)
{
    var codeGenerator = new Firecrow.CodeTextGenerator();

    return codeGenerator.generateJsCode(model);
};

Firecrow.gen = Firecrow.CodeTextGenerator.generateJsCode;

Firecrow.CodeTextGenerator.notifyError = function(message)
{
    console.warn("CodeTextGenerator - " + message);
};

Firecrow.CodeTextGenerator.prototype =
{
    generateCode: function(model)
    {
        try
        {
            return this.generateDocumentType(model.docType) + this.newLine
                 + this.generateCodeFromHtmlElement(model.htmlElement, "root");
        }
        catch(e)
        {
            this.notifyError("Error when generating code: " + e);
        }
    },

    generateDocumentType: function(documentType)
    {
        var docTypeHtml = "<!DOCTYPE html";

             if (documentType === "http://www.w3.org/TR/html4/strict.dtd") { docTypeHtml += ' PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"';}
        else if (documentType === "http://www.w3.org/TR/html4/loose.dtd") { docTypeHtml += ' PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"'; }
        else if (documentType === "http://www.w3.org/TR/html4/frameset.dtd") { docTypeHtml += ' PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd"'; }
        else if (documentType === "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd") { docTypeHtml += ' PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"'; }
        else if (documentType === "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd") { docTypeHtml += ' PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"'; }
        else if (documentType === "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd") { docTypeHtml += ' PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd"'; }
        else if (documentType === "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd") { docTypeHtml += ' PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"'; }

        return docTypeHtml + ">";
    },

    emptyElementTypes: ["img", "br", "input", "meta", "link"],

    isEmptyElementType: function(type)
    {
       if(type == null) { return false; }

        return this.emptyElementTypes.indexOf(type) != -1;
    },

    generateCodeFromHtmlElement: function(htmlElement, origin)
    {
        try
        {
            var htmlElementContent = "";

            if(this.isSlicing && !htmlElement.shouldBeIncluded && htmlElement.type != "textNode"){ return htmlElementContent; }

            var htmlElementType = htmlElement.type != "link" ? htmlElement.type : "style";

            var code = this.generateStartHtmlTagString(htmlElementType)
                     + this.generateHtmlElementAttributes(htmlElement)
                     + (this.isEmptyElementType(htmlElementType) ? "/>" : ">");

            if(htmlElement.type == "html")
            {
                code += this.newLine;
            }

            if(htmlElement.type == "script")
            {
                this.indent();
                htmlElementContent = this.generateCodeFromScriptElement(htmlElement);
                this.deIndent();
            }
            else if(htmlElement.type == "style" || htmlElement.type == "link")
            {
                this.indent();
                htmlElementContent = this.generateCodeFromStyleElement(htmlElement);
                this.deIndent();
            }
            else if (htmlElement.type == "textNode")
            {
                return htmlElement.textContent;
            }
            else
            {
                var children = htmlElement.childNodes;

                if(children != null)
                {
                    for(var i = 0, length = children.length; i < length; i++)
                    {
                        htmlElementContent += this.generateCodeFromHtmlElement(children[i], "parent");
                    }
                }
            }

            if(htmlElement.type == "h3")
            {

            }

            return code + htmlElementContent + (htmlElementType == "html" ? this.newLine : "") + this.generateEndHtmlTagString(htmlElementType);
        }
        catch(e)
        {
            console.log("HTMLElement", htmlElement, "origin", origin, "Stack", e.stack);
            this.notifyError("Error when generating htmlElement: " + e);
        }
    },

    generateCodeFromScriptElement: function(scriptElement)
    {
        try
        {
            if(scriptElement != null && scriptElement.pathAndModel != null && scriptElement.pathAndModel.model != null)
            {
                return this.newLine + this.generateJsCode(scriptElement.pathAndModel.model);
            }

            if(scriptElement.sourceCode != null)
            {
                return this.newLine + scriptElement.sourceCode;
            }

            return "";
        }
        catch(e) { this.notifyError("Error when generating code from script element: " + e); }
    },

    generateStandAloneCode: function(element)
    {
        if (ASTHelper.isProgram(element)) { return this.generateProgram(element); }
        else if (ASTHelper.isStatement(element))
        {
            var isElseIfStatement = ASTHelper.isElseIfStatement(element);

            var statementCode = this.generateStatement(element);
            if(statementCode === "") { return ""; }

            return (!isElseIfStatement ? this.whitespace : "")
                + statementCode
                + (ASTHelper.isFunctionExpression(element.parent) ? "": this.newLine);
        }
        else if (ASTHelper.isFunction(element))
        {
            return (ASTHelper.isFunctionDeclaration(element) ? this.whitespace : "")
                + this.generateFromFunction(element);
        }
        else if (ASTHelper.isExpression(element)) { return this.generateExpression(element); }
        else if (ASTHelper.isSwitchCase(element)) { return this.generateFromSwitchCase(element); }
        else if (ASTHelper.isCatchClause(element)) { return this.generateFromCatchClause(element); }
        else if (ASTHelper.isVariableDeclaration(element))
        {
            var isForStatementInit = ASTHelper.isForStatementInit(element);

            var variableDeclarationCode = this.generateFromVariableDeclaration(element);

            if(isForStatementInit) { return variableDeclarationCode; }

            if(variableDeclarationCode == "") { return ""; }

            return this.whitespace + variableDeclarationCode + this._SEMI_COLON + this.newLine;
        }
        else if (ASTHelper.isVariableDeclarator(element)) { return this.generateFromVariableDeclarator(element); }
        else if (ASTHelper.isLiteral(element)) { return this.generateFromLiteral(element); }
        else if (ASTHelper.isIdentifier(element)) { return this.generateFromIdentifier(element); }
        else if (ASTHelper.isObjectExpressionPropertyValue(element)) { return this.generateFromObjectExpressionProperty(element); }
        else if (element != null) { return this.generateCodeFromHtmlElement(element, "standalone"); }

        return "";
    },

    generateJsCode: function(element)
    {
        try
        {
            if(element == null || (this.isSlicing && !element.shouldBeIncluded)) { return "";}

                 if (ASTHelper.isProgram(element)) { return this.generateProgram(element); }
            else if (ASTHelper.isStatement(element))
            {
                var isElseIfStatement = ASTHelper.isElseIfStatement(element);

                var statementCode = this.generateStandAloneCode(element);

                if(element.comments != null)
                {
                    var commentText = "/*";
                    element.comments.forEach(function(comment)
                    {
                        if(commentText.indexOf(comment) == -1)
                        {
                            commentText += comment + "; ";
                        }
                    }, this);
                    commentText += "*/"

                    if(ASTHelper.isLoopStatement(element) || ASTHelper.isIfStatement(element))
                    {
                        statementCode = commentText + this.newLine + this.whitespace + statementCode;
                    }
                    else
                    {
                        statementCode += commentText;
                    }
                }

                return statementCode;
            }
            else if (ASTHelper.isFunction(element))
            {
                return (ASTHelper.isFunctionDeclaration(element) ? this.whitespace : "")
                     + this.generateFromFunction(element);
            }
            else if (ASTHelper.isExpression(element)) { return this.generateExpression(element); }
            else if (ASTHelper.isSwitchCase(element)) { return this.generateFromSwitchCase(element); }
            else if (ASTHelper.isCatchClause(element)) { return this.generateFromCatchClause(element); }
            else if (ASTHelper.isVariableDeclaration(element))
            {
                var isForStatementInit = ASTHelper.isForStatementInit(element);

                var variableDeclarationCode = this.generateFromVariableDeclaration(element);

                if(element.comments != null)
                {
                    variableDeclarationCode += "/*";
                    element.comments.forEach(function(comment)
                    {
                        variableDeclarationCode += comment + "; ";
                    }, this);
                    variableDeclarationCode += "*/"
                }

                if(isForStatementInit) { return variableDeclarationCode; }
                if(variableDeclarationCode == "") { return ""; }

                return this.whitespace + variableDeclarationCode + this._SEMI_COLON + this.newLine;
            }
            else if (ASTHelper.isVariableDeclarator(element)) { return this.generateFromVariableDeclarator(element); }
            else if (ASTHelper.isLiteral(element)) { return this.generateFromLiteral(element); }
            else if (ASTHelper.isIdentifier(element)) { return this.generateFromIdentifier(element); }
            else if (ASTHelper.isObjectExpressionPropertyValue(element)) { return this.generateFromObjectExpressionProperty(element); }
            else
            {
                this.notifyError("Error while generating code unidentified ast element: ");
            }
        }
        catch(e)
        {
            this.notifyError("Error while generating code: " + e + "@ code line: " + (element != null && element.loc != null) ? element.loc.start.line : "");
        }

        return "";
    },

    generateProgram: function(programElement)
    {
        try
        {
            var code = "";

            if(programElement.body != null)
            {
                var body = programElement.body;

                if(body != null)
                {
                    for(var i = 0, length = body.length; i < length; i++)
                    {
                        code += this.generateJsCode(body[i]);
                    }
                }
            }

            return code;
        }
        catch(e) { this.notifyError("Error when generating program: " + e); }
    },

    generateStatement: function(statement)
    {
        try
        {
            if(statement == null || (this.isSlicing && !statement.shouldBeIncluded)) { return "";}

                 if (ASTHelper.isEmptyStatement(statement))  { return this.generateFromEmptyStatement(statement); }
            else if (ASTHelper.isBlockStatement(statement)) { return this.generateFromBlockStatement(statement); }
            else if (ASTHelper.isExpressionStatement(statement))
            {
                var expressionStatementCode = this.generateFromExpressionStatement(statement);

                return expressionStatementCode != "" ? expressionStatementCode + this._SEMI_COLON
                                                     : "";
            }
            else if (ASTHelper.isIfStatement(statement)) { return this.generateFromIfStatement(statement); }
            else if (ASTHelper.isWhileStatement(statement)) { return this.generateFromWhileStatement(statement); }
            else if (ASTHelper.isDoWhileStatement(statement)) { return this.generateFromDoWhileStatement(statement); }
            else if (ASTHelper.isForStatement(statement)) { return this.generateFromForStatement(statement); }
            else if (ASTHelper.isForInStatement(statement)) { return this.generateFromForInStatement(statement); }
            else if (ASTHelper.isLabeledStatement(statement)) { return this.generateFromLabeledStatement(statement); }
            else if (ASTHelper.isBreakStatement(statement)) { return this.generateFromBreakStatement(statement) + this._SEMI_COLON ; }
            else if (ASTHelper.isContinueStatement(statement)) { return this.generateFromContinueStatement(statement) + this._SEMI_COLON ; }
            else if (ASTHelper.isReturnStatement(statement)) { return this.generateFromReturnStatement(statement)  + this._SEMI_COLON ; }
            else if (ASTHelper.isWithStatement(statement)) { return this.generateFromWithStatement(statement); }
            else if (ASTHelper.isTryStatement(statement)) { return this.generateFromTryStatement(statement); }
            else if (ASTHelper.isThrowStatement(statement)) { return this.generateFromThrowStatement(statement); }
            else if (ASTHelper.isSwitchStatement(statement)) { return this.generateFromSwitchStatement(statement); }
            else if (ASTHelper.isVariableDeclaration(statement)) { return this.generateFromVariableDeclaration(statement); }
            else { this.notifyError("Error: AST Statement element not defined: " + statement.type);  return "";}
        }
        catch(e)
        {
            this.notifyError("Error when generating code from a statement: " + e);
        }
    },

    generateExpression: function(expression)
    {
        try
        {
            if(expression == null || (this.isSlicing && !expression.shouldBeIncluded)) { return "";}

                 if (ASTHelper.isAssignmentExpression(expression)) { return this.generateFromAssignmentExpression(expression); }
            else if (ASTHelper.isUnaryExpression(expression)) { return this.generateFromUnaryExpression(expression); }
            else if (ASTHelper.isBinaryExpression(expression)) { return this.generateFromBinaryExpression(expression); }
            else if (ASTHelper.isLogicalExpression(expression)) { return this.generateFromLogicalExpression(expression); }
            else if (ASTHelper.isLiteral(expression)) { return this.generateFromLiteral(expression); }
            else if (ASTHelper.isIdentifier(expression)) { return this.generateFromIdentifier(expression); }
            else if (ASTHelper.isUpdateExpression(expression)) { return this.generateFromUpdateExpression(expression); }
            else if (ASTHelper.isNewExpression(expression)) { return this.generateFromNewExpression(expression); }
            else if (ASTHelper.isConditionalExpression(expression)) { return this.generateFromConditionalExpression(expression); }
            else if (ASTHelper.isThisExpression(expression)) { return this.generateFromThisExpression(expression); }
            else if (ASTHelper.isCallExpression(expression)) { return this.generateFromCallExpression(expression); }
            else if (ASTHelper.isMemberExpression(expression)) { return this.generateFromMemberExpression(expression); }
            else if (ASTHelper.isSequenceExpression(expression)) { return this.generateFromSequenceExpression(expression); }
            else if (ASTHelper.isArrayExpression(expression)) { return this.generateFromArrayExpression(expression); }
            else if (ASTHelper.isObjectExpression(expression)) { return this.generateFromObjectExpression(expression); }
            else if (ASTHelper.isFunctionExpression(expression)) { return this.generateFromFunction(expression, true); }
            else { this.notifyError("Error: AST Expression element not defined: " + expression.type);  return "";}
        }
        catch(e) { this.notifyError("Error when generating code from an expression:" + e + e.stack); }
    },

    generateFromFunction: function(functionDecExp)
    {
        if(functionDecExp == null || (this.isSlicing && !functionDecExp.shouldBeIncluded)) { return "";}

        var functionBodyCode = this.generateFromFunctionBody(functionDecExp);
        if(functionBodyCode.trim() == "") { return ""; }
        var isFunctionBodyNotEmpty = functionBodyCode.trim() != "{}";


        var shouldBeInParentheses = ASTHelper.isFunctionExpression(functionDecExp)
                                 && ASTHelper.isCallExpressionCallee(functionDecExp);

        return (shouldBeInParentheses ? this._LEFT_PARENTHESIS : "")
             +  this._FUNCTION_KEYWORD + (functionDecExp.id != null ? " " + this.generateFromIdentifier(functionDecExp.id) : "")
             +  this.generateFunctionParameters(functionDecExp)
             +  (isFunctionBodyNotEmpty ? this.newLine + functionBodyCode : functionBodyCode.trim())
             +  (shouldBeInParentheses ? this._RIGHT_PARENTHESIS : "");
    },

    generateFunctionParameters: function(functionDecExp)
    {
        var code = this._LEFT_PARENTHESIS;

        var params = functionDecExp.params;

        if(params != null)
        {
            for(var i = 0, length = params.length; i < length; i++)
            {
                var param = params[i];

                if(i != 0) { code += ", "; }

                code += this.generateFromPattern(param);
            }
        }

        return code + this._RIGHT_PARENTHESIS;
    },

    generateFromFunctionBody: function(functionDeclExp)
    {
        return this.generateJsCode(functionDeclExp.body);
    },

    generateFromBlockStatement: function(blockStatement)
    {
        var code = "";

        this.indent();
        var body = blockStatement.body;

        if(body != null)
        {
            for(var i = 0, length = body.length; i < length; i++)
            {
                code += this.generateJsCode(body[i]);
            }
        }

        this.deIndent();

        if(code === "") { return this._LEFT_GULL_WING + this._RIGHT_GULL_WING; }

        code = code.replace(/((\r)?\n)+$/g, this.newLine);

        return this._LEFT_GULL_WING + this.newLine + code + this.whitespace + this._RIGHT_GULL_WING;
    },

    generateFromEmptyStatement: function(emptyStatement)
    {
        return this._SEMI_COLON;
    },

    generateFromExpressionStatement: function(expressionStatement)
    {
        return this.generateJsCode(expressionStatement.expression);
    },

    generateFromAssignmentExpression: function(assignmentExpression)
    {
        var leftSide = this.generateJsCode(assignmentExpression.left);
        var rightSide = this.generateJsCode(assignmentExpression.right);

        if(leftSide == null || leftSide.length == 0) { return rightSide;}
        if(rightSide == null || rightSide.length == 0) { return leftSide; }

        var shouldBeSurrounded = ASTHelper.isBinaryExpression(assignmentExpression.parent)
                              || ASTHelper.isLogicalExpression(assignmentExpression.parent);

        return (shouldBeSurrounded ? this._LEFT_PARENTHESIS : "") + leftSide + " " + assignmentExpression.operator + " " + rightSide + (shouldBeSurrounded ? this._RIGHT_PARENTHESIS : "");
    },

    generateFromUnaryExpression: function(unaryExpression)
    {
        var code = "";

        var expressionCode = this.generateExpression(unaryExpression.argument);

        if(unaryExpression.prefix) { code += unaryExpression.operator;}

        if(unaryExpression.operator == "typeof"
            || unaryExpression.operator == "void"
            || unaryExpression.operator == "delete") { code += " "; }

        var isComplexArgument = !(ASTHelper.isLiteral(unaryExpression.argument) || ASTHelper.isIdentifier(unaryExpression.argument));

        code += (isComplexArgument ? this._LEFT_PARENTHESIS : "")
                    + expressionCode
              + (isComplexArgument ? this._RIGHT_PARENTHESIS : "");

        if(!unaryExpression.prefix) { code += unaryExpression.operator; }

        return code;
    },

    generateFromBinaryExpression: function(binaryExpression)
    {
        var leftCode = this.generateJsCode(binaryExpression.left);
        var rightCode = this.generateJsCode(binaryExpression.right);

        var shouldBeSurrounded = ASTHelper.isBinaryExpression(binaryExpression.parent);

        if(leftCode != null && rightCode != null && leftCode.length != 0 && rightCode.length != 0)
        {
            return (shouldBeSurrounded ? this._LEFT_PARENTHESIS : "") + leftCode + " " + binaryExpression.operator + " " + rightCode + (shouldBeSurrounded ? this._RIGHT_PARENTHESIS : "");
        }

        if(leftCode != null && leftCode.length != 0) { return leftCode; }
        if(rightCode != null && rightCode.length != 0) { return rightCode; }

        return "";
    },

    generateFromLogicalExpression: function(logicalExpression)
    {
        var leftCode = this.generateJsCode(logicalExpression.left);
        var rightCode = this.generateJsCode(logicalExpression.right);

        var shouldBeSurrounded = ASTHelper.isBinaryExpression(logicalExpression.parent)
                              || (ASTHelper.isLogicalExpression(logicalExpression.parent) && logicalExpression.parent.operator != logicalExpression.operator)
                              || (ASTHelper.isCallExpression(logicalExpression.parent) && logicalExpression.parent.callee == logicalExpression);

        if(leftCode != null && rightCode != null && leftCode.length != 0 && rightCode.length != 0)
        {
            return (shouldBeSurrounded ? this._LEFT_PARENTHESIS : "") + leftCode + " " + logicalExpression.operator + " " + rightCode + (shouldBeSurrounded ? this._RIGHT_PARENTHESIS : "");
        }

        if(leftCode != null && leftCode.length != 0) { return leftCode; }
        if(rightCode != null && rightCode.length != 0) { return rightCode; }

        return "";
    },

    generateFromUpdateExpression: function(updateExpression)
    {
        var code = this.generateJsCode(updateExpression.argument);
        if(code.trim && code.trim() == "") { return ""; }

        if(updateExpression.prefix) { return updateExpression.operator + code;}
        else                        { return code + updateExpression.operator;}
    },

    generateFromNewExpression: function(newExpression)
    {
        return "new " + this.generateJsCode(newExpression.callee) + this._LEFT_PARENTHESIS
            + this.getSequenceCode(newExpression.arguments)
            + this._RIGHT_PARENTHESIS;
    },

    generateFromConditionalExpression: function(conditionalExpression)
    {
        var testCode = this.generateJsCode(conditionalExpression.test);
        var consequentCode = this.generateJsCode(conditionalExpression.consequent);
        var alternateCode = this.generateJsCode(conditionalExpression.alternate);

        if(testCode === "" && consequentCode === "" && alternateCode === "") { return ""; }

        if(testCode === "" && consequentCode !== "" && alternateCode === "") { testCode = "true"; alternateCode = "0";}
        if(testCode === "" && consequentCode === "" && alternateCode !== "") { testCode = "false"; consequentCode = "0"; }

        if(consequentCode === "") { consequentCode = "0"; }
        if(alternateCode === "") { alternateCode = "0";}

        var shouldBeSurroundedWithParenthesis = ASTHelper.isBinaryExpression(conditionalExpression.parent)
                                             || ASTHelper.isLogicalExpression(conditionalExpression.parent)
                                             || ASTHelper.isCallExpressionCallee(conditionalExpression);

        var code =  testCode + " " + this._QUESTION_MARK + " " + consequentCode
                             + " " + this._COLON + " " + alternateCode;

        return shouldBeSurroundedWithParenthesis ? (this._LEFT_PARENTHESIS + code + this._RIGHT_PARENTHESIS) : code;
    },

    generateFromThisExpression: function(thisExpression)
    {
        return "this";
    },

    generateFromCallExpression: function(callExpression)
    {
        var calleeCode = this.generateJsCode(callExpression.callee);
        var argumentsCode = this.getSequenceCode(callExpression.arguments);
        //TODO HACKY WAY
        if(calleeCode[calleeCode.length-1] == ".") { return calleeCode.substring(0, calleeCode.length-1); }
        if((ASTHelper.isMemberExpression(callExpression.callee) || ASTHelper.isCallExpression(callExpression.callee))
         && calleeCode[calleeCode.length-1] == ")" && this._areArgumentsNotIncluded(callExpression.arguments) && callExpression.isIncludedByPostprocessor)
        {
            return calleeCode;
        }
        //END HACKY
        return calleeCode
            +  this._LEFT_PARENTHESIS
                +  argumentsCode
            +  this._RIGHT_PARENTHESIS;
    },

    //Do NOT USE ELSEWHERE; except for a hack in generateFromCallExpression!
    _areArgumentsNotIncluded: function(arguments)
    {
        if(arguments == null || arguments.length == 0) { return true; }

        for(var i = 0; i < arguments.length; i++)
        {
            if(arguments[i].shouldBeIncluded) { return false; }
        }

        return true;
    },

    generateFromMemberExpression: function(memberExpression)
    {
        var isNotSimpleMemberExpression = !ASTHelper.isIdentifier(memberExpression.object)
                                        &&!ASTHelper.isCallExpression(memberExpression.object)
                                        &&!ASTHelper.isThisExpression(memberExpression.object)
                                        &&!ASTHelper.isMemberExpression(memberExpression.object);

        var propertyCode = this.generateJsCode(memberExpression.property);

        var isInBrackets = memberExpression.computed;

        if(!isInBrackets)
        {
            if(propertyCode.indexOf(' ') != -1 || propertyCode.indexOf("-") != -1
            || propertyCode.indexOf("*") != -1 || propertyCode.indexOf(":") != -1)
            {
                propertyCode = "'" + propertyCode + "'";
                isInBrackets = true;
            }
        }

        var objectCode = this.generateJsCode(memberExpression.object);

        if(objectCode === "") { return propertyCode;}
        if(propertyCode === "") { return objectCode; }

        return (isNotSimpleMemberExpression ? this._LEFT_PARENTHESIS : "") + objectCode + (isNotSimpleMemberExpression ? this._RIGHT_PARENTHESIS : "")
            + (isInBrackets ? ( propertyCode !== "" ? (this._LEFT_BRACKET + propertyCode + this._RIGHT_BRACKET) : "") : (this._DOT + propertyCode));
    },

    generateFromSequenceExpression: function(sequenceExpression)
    {
        var sequenceCode = this.getSequenceCode(sequenceExpression.expressions);

        if(!ASTHelper.isLoopStatement(sequenceExpression.parent))
        {
            sequenceCode = this._LEFT_PARENTHESIS + sequenceCode + this._RIGHT_PARENTHESIS;
        }

        return sequenceCode;
    },

    generateFromArrayExpression: function(arrayExpression)
    {
        return this._LEFT_BRACKET
                + this.getSequenceCode(arrayExpression.elements)
               + this._RIGHT_BRACKET;
    },

    generateFromObjectExpression: function(objectExpression)
    {
        if (objectExpression.properties == null || objectExpression.properties.length == 0) { return this._LEFT_GULL_WING + this._RIGHT_GULL_WING; }

        var code = this._LEFT_GULL_WING;
        var containsOnlySimpleProperties = this._objectExpressionContainsOnlySimpleProperties(objectExpression);

        if(!containsOnlySimpleProperties)
        {
            this.indent();
            code += this.newLine + this.whitespace;
        }

        var properties = objectExpression.properties;
        var generatedProperties = 0;
        if(properties != null)
        {
            for (var i = 0, length = properties.length; i < length; i++)
            {
                var property = properties[i];

                if(this.isSlicing && !property.shouldBeIncluded) { continue; }

                if(generatedProperties != 0)
                {
                    code += ", " + (containsOnlySimpleProperties ? "" : this.newLine + this.whitespace);
                }

                code += this.generateFromObjectExpressionProperty(property);

                var lastGeneratedProperty = property;
                generatedProperties++;
            }
        }

        if(lastGeneratedProperty != null && !containsOnlySimpleProperties) //&& ASTHelper.isFunctionExpression(lastGeneratedProperty.value))
        {
            code += this.newLine;
        }

        if(!containsOnlySimpleProperties)
        {
            this.deIndent();
            code += this.whitespace;
        }

        code += this._RIGHT_GULL_WING;

        return code;
    },

    generateFromObjectExpressionProperty: function(property)
    {
        try
        {
            if(this.isSlicing && !property.shouldBeIncluded) { return ""; }

            var code = "";

            if (property.kind == "init")
            {
                code += this.generateJsCode(property.key);
                var valueCode = this.generateJsCode(property.value);

                if(valueCode === "") { valueCode = "null"; }
                if(this.isSlicing && !property.shouldBeIncluded) {}
                else
                {
                    code += this._COLON + " " + valueCode;
                }
            }
            else
            {
                code += this.generateJsCode(property.key);

                if (ASTHelper.isFunctionExpression(property.value))
                    code += this.generateFromFunction(property.value);
                else
                    code += this.generateExpression(property.value);
            }

            return code;
        }
        catch(e) { this.notifyError("Error when generating from object expression property:" + e); }
    },

    _objectExpressionContainsOnlySimpleProperties: function(objectExpression)
    {
        try
        {
            var properties = objectExpression.properties;
            var generatedProperties = 0;

            if(properties != null)
            {
                for (var i = 0, length = properties.length; i < length; i++)
                {
                    var property = properties[i];

                    if(this.isSlicing && !property.shouldBeIncluded) { continue; }

                    if(property.value != null && !ASTHelper.isLiteral(property.value))
                    {
                        return false
                    }
                }
            }

            return true;
        }
        catch(e) { this.notifyError("Error when checking if object expression contains simple properties:" + e); }
    },

    generateFromIfStatement: function(ifStatement)
    {
        var ifBodyCode = this.generateJsCode(ifStatement.consequent) || "";
        var testCode = this.generateJsCode(ifStatement.test) || "";
        var elseBodyCode = "";
        var code = this._IF_KEYWORD + this._LEFT_PARENTHESIS + (testCode === "" ? "false" : testCode )  + this._RIGHT_PARENTHESIS;

        code += ifBodyCode.length != 0 ? this.newLine + ifBodyCode : this._SEMI_COLON + this.newLine;

        if(ifStatement.alternate != null)
        {
            if(this.isSlicing && !ifStatement.alternate.shouldBeIncluded)
            {
                if(ifBodyCode === "" && !ASTHelper.containsCallOrUpdateOrAssignmentExpression(ifStatement.test))
                {
                    return "";
                }

                return code;
            }

            elseBodyCode = this.generateJsCode(ifStatement.alternate);

            if(elseBodyCode !== "")
            {
                code += this.whitespace + this._ELSE_KEYWORD + " " + (! ASTHelper.isIfStatement(ifStatement.alternate) ? this.newLine : "") + elseBodyCode;
            }
        }

        return code;
    },

    generateFromWhileStatement: function(whileStatement)
    {
        var whileBody = this.generateJsCode(whileStatement.body) || "";
        var whileTest = this.generateJsCode(whileStatement.test) || "";

        if(whileBody === "" && !ASTHelper.containsCallOrUpdateOrAssignmentExpression(whileStatement.test)) { return ""; }

        if(whileTest === "") { whileTest = "false"; }

        return this._WHILE_KEYWORD + this._LEFT_PARENTHESIS + whileTest  + this._RIGHT_PARENTHESIS
            + (whileBody.length != 0 ? this.newLine + whileBody : this._SEMI_COLON);
    },

    generateFromDoWhileStatement: function(doWhileStatement)
    {
        var doWhileBody = this.generateJsCode(doWhileStatement.body) || "";
        var doWhileTest = this.generateJsCode(doWhileStatement.test) || "";

        if(doWhileBody === "" && !ASTHelper.containsCallOrUpdateOrAssignmentExpression(doWhileStatement.test)) { return ""; }
        if(doWhileTest === "") { doWhileTest = "false"; }

        doWhileBody = doWhileBody.length != 0 ? doWhileBody : this._SEMI_COLON;

        return this._DO_KEYWORD + this.newLine + doWhileBody
            +  this.whitespace + this._WHILE_KEYWORD + this._LEFT_PARENTHESIS + doWhileTest + this._RIGHT_PARENTHESIS;
    },

    generateFromForStatement: function(forStatement)
    {
        var forBody = this.generateJsCode(forStatement.body);
        var forInit = this.generateJsCode(forStatement.init);
        var forTest = this.generateJsCode(forStatement.test);
        var forUpdate = this.generateJsCode(forStatement.update);

        if(forBody === "" && forUpdate === "" && !ASTHelper.containsCallOrUpdateOrAssignmentExpression(forTest))
        {
            return forInit +  this._SEMI_COLON;
        }

        return this._FOR_KEYWORD + this._LEFT_PARENTHESIS
            +  forInit + this._SEMI_COLON
            +  forTest + this._SEMI_COLON
            +  forUpdate + this._RIGHT_PARENTHESIS
            +  (forBody.length != 0 ? (this.newLine + forBody) : this._SEMI_COLON);
    },

    generateFromForInStatement: function(forInStatement)
    {
        var forInBody = this.generateJsCode(forInStatement.body);
        var leftPart = this.generateJsCode(forInStatement.left);
        var rightPart = this.generateJsCode(forInStatement.right);

        if(leftPart === "" && forInBody === "") { return ""; }

        forInStatement.left.shouldBeIncluded = true;
        if(leftPart === "") { leftPart = Firecrow.CodeTextGenerator.generateJsCode(forInStatement.left); }

        forInBody = forInBody.length != 0 ? forInBody : this._SEMI_COLON;

        return this._FOR_KEYWORD + this._LEFT_PARENTHESIS
            +  leftPart + " " +  this._IN_KEYWORD + " "
            +  rightPart + this._RIGHT_PARENTHESIS
            +  this.newLine + forInBody;
    },

    generateFromBreakStatement: function(breakStatement)
    {
        return this._BREAK_KEYWORD + (breakStatement.label != null ? " " + this.generateFromIdentifier(breakStatement.label) : "");
    },

    generateFromContinueStatement: function(continueStatement)
    {
        return this._CONTINUE_KEYWORD + (continueStatement.label != null ? this.generateFromIdentifier(continueStatement.label) : "");
    },

    generateFromReturnStatement: function(returnStatement)
    {
        return this._RETURN_KEYWORD + " " + (returnStatement.argument != null ? this.generateExpression(returnStatement.argument) : "");
    },

    generateFromWithStatement: function(withStatement)
    {
        var withBody = this.generateStandAloneCode(withStatement.body);

        withBody = withBody.length != 0 ? withBody : this._SEMI_COLON;

        return this._WITH_KEYWORD + this._LEFT_PARENTHESIS
             + this.generateExpression(withStatement.object) + this._RIGHT_PARENTHESIS
             + withBody;
    },

    generateFromThrowStatement: function(throwStatement)
    {
        return this._THROW_KEYWORD + " " + this.generateExpression(throwStatement.argument);
    },

    generateFromSwitchStatement: function(switchStatement)
    {
        var discriminant = this.generateExpression(switchStatement.discriminant);

        var code = this._SWITCH_KEYWORD + this._LEFT_PARENTHESIS + (discriminant != "" ? discriminant : "null") + this._RIGHT_PARENTHESIS;

        code += this.newLine + this.whitespace + this._LEFT_GULL_WING + this.newLine;

        this.indent();

        for(var i = 0; i < switchStatement.cases.length; i++)
        {
            var caseClause = switchStatement.cases[i];

            if(this.isSlicing && !caseClause.shouldBeIncluded) { continue; }

            code += this.generateFromSwitchCase(caseClause);
        }

        this.deIndent();

        code += this.whitespace + this._RIGHT_GULL_WING;

        return code;
    },

    generateFromSwitchCase: function(switchCase)
    {
        var code = "";
        var caseTest = this.generateExpression(switchCase.test);
        if(switchCase.test === null || caseTest === "")
        {
            code += this.whitespace + this._DEFAULT_KEYWORD + this._COLON + this.newLine;
        }
        else
        {
            code += this.whitespace + this._CASE_KEYWORD + " " + caseTest  + this._COLON + this.newLine;
        }

        if(switchCase.consequent)
        {
            this.indent();

            for(var i = 0; i < switchCase.consequent.length; i++)
            {
                var statementCode = this.generateStandAloneCode(switchCase.consequent[i]);

                if(statementCode !== "")
                {
                    code += this.whitespace + statementCode + this.newLine;
                }
            }
            this.deIndent();
        }

        return code;
    },

    generateFromTryStatement: function(tryStatement)
    {
        var code = this._TRY_KEYWORD + this.newLine + (this.generateJsCode(tryStatement.block) || (this._LEFT_GULL_WING + this._RIGHT_GULL_WING));

        var handlers = tryStatement.handlers || (ValueTypeHelper.isArray(tryStatement.handler) ? tryStatement.handler : [tryStatement.handler]);

        if( handlers != null)
        {
            for(var i = 0; i < handlers.length; i++)
            {
                code += this.generateFromCatchClause(handlers[i]);
            }
        }

        if(tryStatement.finalizer != null)
        {
            var finalizerBody = this.generateJsCode(tryStatement.finalizer);

            if(finalizerBody.length != 0)
            {
                code += this._FINALLY_KEYWORD + finalizerBody;
            }
        }

        return code;
    },

    generateFromLabeledStatement: function(labeledStatement)
    {
        return this.generateFromIdentifier(labeledStatement.label) + this._COLON
             + this.generateJsCode(labeledStatement.body).replace(/^(\s)+/, " ");
    },

    generateFromVariableDeclaration: function(variableDeclaration)
    {
        var code = this._VAR_KEYWORD + " ";

        var declarators = variableDeclaration.declarations;
        var generatedDeclarators = 0;

        if(declarators == null || declarators.length == 0) { return ""; }

        for (var i = 0, length = declarators.length; i < length; i++)
        {
            var declarator = declarators[i];

            if(this.isSlicing && !declarator.shouldBeIncluded) { continue; }

            if(generatedDeclarators != 0) { code += this._COMMA + " "; }

            generatedDeclarators++;

            code += this.generateFromVariableDeclarator(declarator);
        }

        return code;
    },

    generateFromVariableDeclarator: function(variableDeclarator)
    {
        var initCode = "";

        if(variableDeclarator.init)
        {
            if(this.isSlicing && !variableDeclarator.init.shouldBeIncluded) {}
            else
            {
                initCode = " = " + this.generateJsCode(variableDeclarator.init);
            }
        }

        return this.generateFromPattern(variableDeclarator.id) + initCode;
    },

    generateFromPattern: function(pattern)
    {
        if(ASTHelper.isIdentifier(pattern)) { return this.generateFromIdentifier(pattern);}
    },

    generateFromCatchClause: function(catchClause)
    {
        if(catchClause == null) { return ""; }

        var body = this.generateStandAloneCode(catchClause.body);

        body = body.length != 0 ? body : this._LEFT_GULL_WING + this._RIGHT_GULL_WING;

        Firecrow.includeNode(catchClause.param);

        return this.whitespace + this._CATCH_KEYWORD + this._LEFT_PARENTHESIS + this.generateJsCode(catchClause.param) + this._RIGHT_PARENTHESIS
             + (body != (this._LEFT_GULL_WING + this._RIGHT_GULL_WING) ? this.newLine + this.whitespace : "" ) + body;
    },

    generateFromIdentifier: function(identifier)
    {
        return identifier.name;
    },

    generateFromLiteral: function(literal)
    {
        if(ValueTypeHelper.isNull(literal.value)) { return "null"; }
        if (ValueTypeHelper.isString(literal.value))
        {
            if(literal.raw != null) { return literal.raw; }

            return "'" + literal.value.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/\r/g, "\\r") + "'";
        }
        else if (ValueTypeHelper.isBoolean(literal.value) || ValueTypeHelper.isNumber(literal.value)) { return literal.value; }
        else if(ValueTypeHelper.isObject(literal.value))
        {
            var regExString = "";
            if(literal.value.constructor != null && literal.value.constructor.name === "RegExp")
            {
                regExString = literal.value.toString();
            }
            else //over JSON conversion
            {
                regExString = atob(literal.value.RegExpBase64);
            }

            return ValueTypeHelper.adjustForRegExBug(literal.value, regExString);
        }

        return "null";
    },

    getSequenceCode: function(sequence)
    {
        try
        {
            var code = "";

            if(sequence == null) { return code; }

            for(var i = 0, length = sequence.length; i < length; i++)
            {
                var item = sequence[i];

                if(i != 0 && code.trim() != "") { code += this._COMMA +  " "; }

                if(this.isSlicing && !item.shouldBeIncluded)
                {
                    code += "null";
                    continue;
                }

                code += this.generateJsCode(item);
            }

            return code;
        }
        catch(e)
        {
            this.notifyError("Error when generating sequence code:" + e);
        }
    },

    generateCodeFromStyleElement: function(styleElement)
    {
        try
        {
            var cssText = "";

            var rules = styleElement.cssRules || [];

            this.indent();

            for(var i = 0, length = rules.length; i < length; i++)
            {
                var rule = rules[i];

                if(this.isSlicing && !rule.shouldBeIncluded) { continue; }

                cssText += this.newLine + this.whitespace + rule.cssText;
            }

            if(cssText !== "") { cssText += this.newLine;}

            this.deIndent();

            return cssText;
        }
        catch(e) { this.notifyError("Error when generating code from style element: " + e); }
    },

    generateStartHtmlTagString: function(tagName)
    {
        return "<" + tagName;
    },

    generateHtmlElementAttributes: function(htmlElement)
    {
        try
        {
            var attributes = htmlElement.attributes;
            var attributesText = "";

            if(attributes == null) { return attributesText; }

            for(var i = 0, length = attributes.length; i < length; i++)
            {
                var attribute = attributes[i];

                if(htmlElement.type == "script" && attribute.name == "src")
                {
                    continue;
                }

                attributesText += " " + attribute.name + '="' + attribute.value + '"';
            }

            return attributesText;
        }
        catch(e) { this.notifyError("Error when generating html element attributes: " + e); }
    },

    generateEndHtmlTagString: function(tag)
    {
        return this.isEmptyElementType(tag) ? "" : "</" + tag + ">";
    },

    whitespace: "",
    newLine: "\r\n",
    indent: function()
    {
        this.whitespace += "  ";
    },
    deIndent: function()
    {
        this.whitespace = this.whitespace.replace(/\s\s$/, "");
    },

    notifyError: function(message) { debugger; Firecrow.CodeTextGenerator.notifyError(message); },

    _isExternalScriptElement: function(htmlElement)
    {
        if(htmlElement == null || htmlElement.type == null) { return false; }

        return htmlElement.type.toLowerCase() == "script" && this._hasAttribute(htmlElement, "src");
    },

    _isExternalStyleElement: function(htmlElement)
    {
        if(htmlElement == null || htmlElement.type == null) { return false; }

        return htmlElement.type.toLowerCase() == "link" && this._hasAttribute(htmlElement, "href") && this._hasAttribute(htmlElement, "rel");
    },

    _hasAttribute: function(htmlElement, attributeName)
    {
        if(htmlElement == null || htmlElement.attributes == null || htmlElement.attributes.length == 0) { return false; }

        var attributes = htmlElement.attributes;

        for(var i = 0, length = attributes.length; i < length; i++)
        {
            if(attributes[i].name == attributeName) { return true; }
        }

        return false;
    },

    _LEFT_GULL_WING:  "{",
    _RIGHT_GULL_WING: "}",
    _LEFT_PARENTHESIS: "(",
    _RIGHT_PARENTHESIS: ")",
    _LEFT_BRACKET : "[",
    _RIGHT_BRACKET: "]",
    _SEMI_COLON: ";",
    _QUESTION_MARK: "?",
    _COLON: ":",
    _DOT: ".",
    _COMMA: ",",
    _IF_KEYWORD: "if",
    _ELSE_KEYWORD: "else",
    _FOR_KEYWORD: "for",
    _WHILE_KEYWORD: "while",
    _DO_KEYWORD: "do",
    _WITH_KEYWORD: "with",
    _IN_KEYWORD: "in",
    _FUNCTION_KEYWORD: "function",
    _BREAK_KEYWORD: "break",
    _CONTINUE_KEYWORD: "continue",
    _TRY_KEYWORD: "try",
    _CATCH_KEYWORD: "catch",
    _FINALLY_KEYWORD: "finally",
    _THROW_KEYWORD: "throw",
    _RETURN_KEYWORD: "return",
    _VAR_KEYWORD: "var",
    _SWITCH_KEYWORD: "switch",
    _CASE_KEYWORD: "case",
    _DEFAULT_KEYWORD: "default"
};
}});

if(usesModule)
{
    exports.CodeTextGenerator = CodeTextGenerator;
}