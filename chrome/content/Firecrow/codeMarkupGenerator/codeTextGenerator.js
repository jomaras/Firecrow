/**
 * User: Jomaras
 * Date: 11.06.12.
 * Time: 17:58
 */
FBL.ns(function () { with (FBL) {
/*******/
var ASTHelper = Firecrow.ASTHelper;
var valueTypeHelper = Firecrow.ValueTypeHelper;

Firecrow.CodeTextGenerator = function(isSlicing)
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
                    element.shouldBeIncluded = true;
                }
            }

            element.shouldBeIncluded = element.hasBeenExecuted;
        }
    });

    var postProcessor = new Firecrow.DependencyGraph.DependencyPostprocessor();
    postProcessor.processHtmlElement(model.htmlElement);

    var codeGenerator = new Firecrow.CodeTextGenerator(true);

    return codeGenerator.generateCode(model);
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

Firecrow.CodeTextGenerator.prototype =
{
    generateCode: function(model)
    {
        try
        {
            return this.generateDocumentType(model.docType) + this.newLine
                 + this.generateCodeFromHtmlElement(model.htmlElement);
        }
        catch(e) { this.notifyError("Error when generating code: " + e); }
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
        else { docTypeHtml + ">"; }

        return docTypeHtml + ">";
    },

    generateCodeFromHtmlElement: function(htmlElement)
    {
        try
        {
            var htmlElementContent = "";

            if(this.isSlicing && !htmlElement.shouldBeIncluded){ return htmlElementContent; }

            var code = this.whitespace + this.generateStartHtmlTagString(htmlElement.type)
                     + this.generateHtmlElementAttributes(htmlElement) + ">";

            var hasOnlyTextContent = false;

            if(htmlElement.type == "script")
            {
                this.indent();
                htmlElementContent = this.generateCodeFromScriptElement(htmlElement);
                this.deIndent();
            }
            else if(htmlElement.type == "style")
            {
                this.indent();
                htmlElementContent = this.generateCodeFromStyleElement(htmlElement);
                this.deIndent();
            }
            else if (htmlElement.type == "textNode")
            {
                return valueTypeHelper.trim(htmlElement.textContent);
            }
            else
            {
                var children = htmlElement.childNodes;

                if(children.length == 1 && children[0].type == "textNode")
                {
                    htmlElementContent = valueTypeHelper.trim(children[0].textContent);
                    hasOnlyTextContent = true;
                }
                else
                {
                    htmlElementContent += this.newLine;
                    this.indent();
                    for(var i = 0, length = children.length; i < length; i++)
                    {
                        htmlElementContent += this.generateCodeFromHtmlElement(children[i]);
                    }
                    this.deIndent();
                }
            }

            code += htmlElementContent;
            code += (hasOnlyTextContent ? "" : this.whitespace) + this.generateEndHtmlTagString(htmlElement.type) + this.newLine;

            return code;
        }
        catch(e) { this.notifyError("Error when generating htmlElement: " + e); }
    },

    generateCodeFromScriptElement: function(scriptElement)
    {
        try
        {
            return this.newLine + this.generateJsCode(scriptElement.pathAndModel.model);
        }
        catch(e) { this.notifyError("Error when generating code from script element: " + e); }
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

                var statementCode = this.generateStatement(element);
                if(statementCode == "") { return ""; }

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

                return this.whitespace + variableDeclarationCode + this._SEMI_COLON + this.newLine;
            }
            else if (ASTHelper.isVariableDeclarator(element)) { return this.generateFromVariableDeclarator(element); }
            else if (ASTHelper.isLiteral(element)) { return this.generateFromLiteral(element); }
            else if (ASTHelper.isIdentifier(element)) { return this.generateFromIdentifier(element); }
            else if (ASTHelper.isObjectExpressionPropertyValue(element)) { return this.generateFromObjectExpressionProperty(element); }
            else
            {
                this.notifyError("Error while generating code unidentified ast element: "); return "";
            }
        }
        catch(e) { alert("Error while generating code: " + e); }
    },

    generateProgram: function(programElement)
    {
        try
        {
            var code = "";

            if(programElement.body != null)
            {
                var body = programElement.body;

                for(var i = 0, length = body.length; i < length; i++)
                {
                    code += this.generateJsCode(body[i]);
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
            else if (ASTHelper.isExpressionStatement(statement)) { return this.generateFromExpressionStatement(statement) + this._SEMI_COLON ; }
            else if (ASTHelper.isIfStatement(statement)) { return this.generateFromIfStatement(statement); }
            else if (ASTHelper.isWhileStatement(statement)) { return this.generateFromWhileStatement(statement); }
            else if (ASTHelper.isDoWhileStatement(statement)) { return this.generateFromDoWhileStatement(statement); }
            else if (ASTHelper.isForStatement(statement)) { return this.generateFromForStatement(statement); }
            else if (ASTHelper.isForInStatement(statement)) { return this.generateFromForInStatement(statement); }
            else if (ASTHelper.isLabeledStatement(statement)) { return this.generateFromLabeledStatement(statement)  + this._SEMI_COLON ; }
            else if (ASTHelper.isBreakStatement(statement)) { return this.generateFromBreakStatement(statement)  + this._SEMI_COLON ; }
            else if (ASTHelper.isContinueStatement(statement)) { return this.generateFromContinueStatement(statement)  + this._SEMI_COLON ; }
            else if (ASTHelper.isReturnStatement(statement)) { return this.generateFromReturnStatement(statement)  + this._SEMI_COLON ; }
            else if (ASTHelper.isWithStatement(statement)) { return this.generateFromWithStatement(statement); }
            else if (ASTHelper.isTryStatement(statement)) { return this.generateFromTryStatement(statement); }
            else if (ASTHelper.isThrowStatement(statement)) { return this.generateFromThrowStatement(statement); }
            else if (ASTHelper.isSwitchStatement(statement)) { return this.generateFromSwitchStatement(statement); }
            else if (ASTHelper.isVariableDeclaration(statement)) { return this.generateFromVariableDeclaration(statement); }
            else { this.notifyError("Error: AST Statement element not defined: " + statement.type);  return "";}
        }
        catch(e) { this.notifyError("Error when generating code from a statement: " + e); }
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
        catch(e) { this.notifyError("Error when generating code from an expression:" + e); }
    },

    generateFromFunction: function(functionDecExp)
    {
        try
        {
            if(functionDecExp == null || (this.isSlicing && !functionDecExp.shouldBeIncluded)) { return "";}

            var functionBodyCode = this.generateFromFunctionBody(functionDecExp);

            var shouldBeInParentheses = ASTHelper.isFunctionExpression(functionDecExp)
                                     && ASTHelper.isCallExpressionCallee(functionDecExp);

            return (shouldBeInParentheses ? this._LEFT_PARENTHESIS : "")
                 +  this._FUNCTION_KEYWORD + " " + (functionDecExp.id != null ? this.generateFromIdentifier(functionDecExp.id) + " " : "")
                 +  this.generateFunctionParameters(functionDecExp)
                 +  this.newLine + functionBodyCode
                 +  (shouldBeInParentheses ? this._RIGHT_PARENTHESIS : "");
        }
        catch(e) { alert("Error when generating code from a function:" + e); }
    },

    generateFunctionParameters: function(functionDecExp)
    {
        try
        {
            var code = this._LEFT_PARENTHESIS;

            var params = functionDecExp.params;
            for(var i = 0, length = params.length; i < length; i++)
            {
                var param = params[i];

                if(i != 0) { code += ", "; }

                code += this.generateFromPattern(param);
            }

            return code + this._RIGHT_PARENTHESIS;
        }
        catch(e) { this.notifyError("Error when generating code from function parameters:" + e);}
    },

    generateFromFunctionBody: function(functionDeclExp)
    {
        try
        {
            return this.generateJsCode(functionDeclExp.body);
        }
        catch(e) { this.notifyError("Error when generating code from function body:" + e); }
    },

    generateFromBlockStatement: function(blockStatement)
    {
        try
        {
            var code = "";

            this.indent();

            var body = blockStatement.body;
            for(var i = 0, length = body.length; i < length; i++)
            {
                code += this.generateJsCode(body[i]);
            }

            this.deIndent();

            if(code == "") { return this._LEFT_GULL_WING + this._RIGHT_GULL_WING; }

            return this._LEFT_GULL_WING + this.newLine + code + this.whitespace + this._RIGHT_GULL_WING;
        }
        catch(e) { this.notifyError("Error when generating from block statement:" + e);}
    },

    generateFromEmptyStatement: function(emptyStatement)
    {
        try
        {
            return this._SEMI_COLON;
        }
        catch(e) { this.notifyError("Error when generating from empty statement:" + e); }
    },

    generateFromExpressionStatement: function(expressionStatement)
    {
        try
        {
            return this.generateJsCode(expressionStatement.expression);
        }
        catch(e) { this.notifyError("Error when generating from expression statement:" + e); }
    },

    generateFromAssignmentExpression: function(assignmentExpression)
    {
        try
        {
            var leftSide = this.generateJsCode(assignmentExpression.left);
            var rightSide = this.generateJsCode(assignmentExpression.right);

            if(leftSide.length == 0) { return rightSide;}
            if(rightSide.length == 0) { return leftSide; }

            return leftSide + " " + assignmentExpression.operator + " " + rightSide;
        }
        catch(e) { this.notifyError("Error when generating code from assignment expression:" + e); }
    },

    generateFromUnaryExpression: function(unaryExpression)
    {
        try
        {
            var code = "";

            if(unaryExpression.prefix) { code += unaryExpression.operator;}

            if(unaryExpression.operator == "typeof"
                || unaryExpression.operator == "void"
                || unaryExpression.operator == "delete") { code += " "; }

            var isComplexArgument = !(ASTHelper.isLiteral(unaryExpression.argument) || ASTHelper.isIdentifier(unaryExpression.argument));

            code += (isComplexArgument ? this._LEFT_PARENTHESIS : "")
                        + this.generateExpression(unaryExpression.argument)
                  + (isComplexArgument ? this._RIGHT_PARENTHESIS : "");

            if(!unaryExpression.prefix) { code += unaryExpression.operator; }

            return code;
        }
        catch(e) { this.notifyError("Error when generating code from unary expression:" + e); }
    },

    generateFromBinaryExpression: function(binaryExpression)
    {
        try
        {
            var leftCode = this.generateJsCode(binaryExpression.left);
            var rightCode = this.generateJsCode(binaryExpression.right);

            var isWithinBinaryExpression = ASTHelper.isBinaryExpression(binaryExpression.parent);

            if(leftCode.length != 0 && rightCode.length != 0)
            {
                return (isWithinBinaryExpression ? this._LEFT_PARENTHESIS : "") + leftCode + " " + binaryExpression.operator + " " + rightCode + (isWithinBinaryExpression ? this._RIGHT_PARENTHESIS : "");
            }

            if(leftCode.length != 0) { return leftCode; }
            if(rightCode.length != 0) { return rightCode; }

            return "";
        }
        catch(e) { this.notifyError("Error when generating code from binary expression:" + e); }
    },

    generateFromLogicalExpression: function(logicalExpression)
    {
        try
        {
            var leftCode = this.generateJsCode(logicalExpression.left);
            var rightCode = this.generateJsCode(logicalExpression.right);

            var isWithinBinaryExpression = ASTHelper.isBinaryExpression(logicalExpression.parent);

            if(leftCode.length != 0 && rightCode.length != 0)
            {
                return (isWithinBinaryExpression ? this._LEFT_PARENTHESIS : "") + leftCode + " " + logicalExpression.operator + " " + rightCode + (isWithinBinaryExpression ? this._RIGHT_PARENTHESIS : "");
            }

            if(leftCode.length != 0) { return leftCode; }
            if(rightCode.length != 0) { return rightCode; }

            return "";
        }
        catch(e) { this.notifyError("Error when generating code from logical expression:" + e); }
    },

    generateFromUpdateExpression: function(updateExpression)
    {
        try
        {
            var code = "";
            // if prefixed e.g.: ++i
            if(updateExpression.prefix) { code += updateExpression.operator;}

            code += this.generateJsCode(updateExpression.argument);

            // if postfixed e.g.: i++
            if(!updateExpression.prefix) code += updateExpression.operator;

            return code;
        }
        catch(e) { this.notifyError("Error when generating from update expression:" + e); }
    },

    generateFromNewExpression: function(newExpression)
    {
        try
        {
            return "new " + this.generateJsCode(newExpression.callee) + this._LEFT_PARENTHESIS
                + this.getSequenceCode(newExpression.arguments)
                + this._RIGHT_PARENTHESIS;
        }
        catch(e) { this.notifyError("Error when generating code from new expression:" + e); }
    },

    generateFromConditionalExpression: function(conditionalExpression)
    {
        try
        {
            var testCode = this.generateJsCode(conditionalExpression.test);
            var consequentCode = this.generateJsCode(conditionalExpression.consequent);
            var alternateCode = this.generateJsCode(conditionalExpression.alternate);

            if(testCode == "" && consequentCode == "" && alternateCode == "") { return ""; }

            if(testCode == "" && consequentCode != "" && alternateCode == "") { testCode = "true"; alternateCode = "0";}
            if(testCode == "" && consequentCode == "" && alternateCode != "") { testCode = "false"; consequentCode = "0"; }

            if(consequentCode == "") { consequentCode = "0"; }
            if(alternateCode == "") { alternateCode = "0";}

            var shouldBeSurroundedWithParenthesis = ASTHelper.isBinaryExpression(conditionalExpression.parent) || ASTHelper.isLogicalExpression(conditionalExpression.parent);

            var code =  testCode + " " + this._QUESTION_MARK + " " + consequentCode
                                 + " " + this._COLON + " " + alternateCode;

            return shouldBeSurroundedWithParenthesis ? (this._LEFT_PARENTHESIS + code + this._RIGHT_PARENTHESIS) : code;
        }
        catch(e) { this.notifyError("Error when generating code from conditional expression:" + e); }
    },

    generateFromThisExpression: function(thisExpression)
    {
        try
        {
            return "this";
        }
        catch(e) { this.notifyError("Error when generating code from this expression:" + e); }
    },

    generateFromCallExpression: function(callExpression)
    {
        try
        {
            return this.generateJsCode(callExpression.callee)
                + this._LEFT_PARENTHESIS
                    +  this.getSequenceCode(callExpression.arguments)
                +  this._RIGHT_PARENTHESIS;
        }
        catch(e) { this.notifyError("Error when generating code from call expression:" + e); }
    },

    generateFromMemberExpression: function(memberExpression)
    {
        try
        {
            var isNotSimpleMemberExpression = !ASTHelper.isIdentifier(memberExpression.object)
                                            &&!ASTHelper.isCallExpression(memberExpression.object)
                                            &&!ASTHelper.isLiteral(memberExpression.object)
                                            &&!ASTHelper.isThisExpression(memberExpression.object)
                                            &&!ASTHelper.isMemberExpression(memberExpression.object);

            var propertyCode = this.generateJsCode(memberExpression.property);

            var isInBrackets = memberExpression.computed;

            if(!isInBrackets)
            {
                if(propertyCode.indexOf(' ') != -1)
                {
                    propertyCode = "'" + propertyCode + "'";
                    isInBrackets = true;
                }
            }

            return (isNotSimpleMemberExpression ? this._LEFT_PARENTHESIS : "") + this.generateJsCode(memberExpression.object) + (isNotSimpleMemberExpression ? this._RIGHT_PARENTHESIS : "")
                + (isInBrackets ? (this._LEFT_BRACKET + propertyCode + this._RIGHT_BRACKET) : (this._DOT + propertyCode));
        }
        catch(e) { this.notifyError("Error when generating code from member expression:" + e); }
    },

    generateFromSequenceExpression: function(sequenceExpression)
    {
        try
        {
            return this.getSequenceCode(sequenceExpression.expressions);
        }
        catch(e) { this.notifyError("Error when generating code from member expression:" + e); }
    },

    generateFromArrayExpression: function(arrayExpression)
    {
        try
        {
            return this._LEFT_BRACKET
                    + this.getSequenceCode(arrayExpression.elements)
                   + this._RIGHT_BRACKET;
        }
        catch(e) { this.notifyError("Error when generating code from array expression:" + e); }
    },

    generateFromObjectExpression: function(objectExpression)
    {
        try
        {
            if (objectExpression.properties.length == 0) { return this._LEFT_GULL_WING + this._RIGHT_GULL_WING; }

            var code = this._LEFT_GULL_WING;
            var containsOnlySimpleProperties = this._objectExpressionContainsOnlySimpleProperties(objectExpression);

            if(!containsOnlySimpleProperties)
            {
                this.indent();
                code += this.newLine + this.whitespace;
            }

            var properties = objectExpression.properties;
            var generatedProperties = 0;
            for (var i = 0, length = properties.length; i < length; i++)
            {
                var property = properties[i];

                if(this.isSlicing && !property.shouldBeIncluded) { continue; }

                if(generatedProperties != 0) { code += ", " + (containsOnlySimpleProperties ? "" : this.newLine + this.whitespace); }

                code += this.generateFromObjectExpressionProperty(property);

                var lastGeneratedProperty = property;
                generatedProperties++;
            }

            if(lastGeneratedProperty != null && ASTHelper.isFunctionExpression(lastGeneratedProperty.value))
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
        }
        catch(e) { this.notifyError("Error when generating from object expression:" + e); }
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
                if(this.isSlicing && !property.shouldBeIncluded) {}
                else
                {
                    code += this._COLON + " " + (this.generateJsCode(property.value) || "null");
                }

                if(ASTHelper.isObjectExpression(property.value)){ code += this.newLine; }
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
            for (var i = 0, length = properties.length; i < length; i++)
            {
                var property = properties[i];

                if(this.isSlicing && !property.shouldBeIncluded) { continue; }

                if(property.value != null && !ASTHelper.isLiteral(property.value))
                {
                    return false
                }
            }

            return true;
        }
        catch(e) { this.notifyError("Error when checking if object expression contains simple properties:" + e); }
    },

    generateFromIfStatement: function(ifStatement)
    {
        try
        {
            var ifBodyCode = this.generateJsCode(ifStatement.consequent);
            var testCode = this.generateJsCode(ifStatement.test);
            var elseBodyCode = "";
            var code = this._IF_KEYWORD + this._LEFT_PARENTHESIS + (testCode || "false" )  + this._RIGHT_PARENTHESIS;

            code += ifBodyCode.length != 0 ? this.newLine + ifBodyCode : this._SEMI_COLON + this.newLine;

            if(ifStatement.alternate != null)
            {
                if(this.isSlicing && !ifStatement.alternate.shouldBeIncluded)
                {
                    if(ifBodyCode == "" && !ASTHelper.containsCallOrUpdateOrAssignmentExpression(ifStatement.test))
                    {
                        return "";
                    }

                    return code;
                }

                elseBodyCode = this.generateJsCode(ifStatement.alternate);

                if(elseBodyCode != "")
                {
                    code += this.whitespace + this._ELSE_KEYWORD + " " + (! ASTHelper.isIfStatement(ifStatement.alternate) ? this.newLine : "") + elseBodyCode;
                }
            }

            if(ifBodyCode == "" && elseBodyCode == "" && !ASTHelper.containsCallOrUpdateOrAssignmentExpression(ifStatement.test))
            {
                return "";
            }

            return code;
        }
        catch(e) { this.notifyError("Error when generating code from if statement:" + e); }
    },

    generateFromWhileStatement: function(whileStatement)
    {
        try
        {
            var whileBody = this.generateJsCode(whileStatement.body);
            var whileTest = this.generateJsCode(whileStatement.test);

            if(whileBody == "" && !ASTHelper.containsCallOrUpdateOrAssignmentExpression(whileStatement.test)) { return ""; }

            return this._WHILE_KEYWORD + this._LEFT_PARENTHESIS + whileTest  + this._RIGHT_PARENTHESIS
                + (whileBody.length != 0 ? this.newLine + whileBody : this._SEMI_COLON);
        }
        catch(e) { this.notifyError("Error when generating code from while statement:" + e); }
    },

    generateFromDoWhileStatement: function(doWhileStatement)
    {
        try
        {
            var doWhileBody = this.generateJsCode(doWhileStatement.body);
            var doWhileTest = this.generateJsCode(doWhileStatement.test);

            if(doWhileBody == "" && !ASTHelper.containsCallOrUpdateOrAssignmentExpression(doWhileStatement.test)) { return ""; }

            doWhileBody = doWhileBody.length != 0 ? doWhileBody : this._SEMI_COLON;

            return this._DO_KEYWORD + this.newLine + doWhileBody
                +  this.whitespace + this._WHILE_KEYWORD + this._LEFT_PARENTHESIS + doWhileTest + this._RIGHT_PARENTHESIS;
        }
        catch(e) { this.notifyError("Error when generating code from do while statement:" + e); }
    },

    generateFromForStatement: function(forStatement)
    {
        try
        {
            var forBody = this.generateJsCode(forStatement.body);
            var forInit = this.generateJsCode(forStatement.init);
            var forTest = this.generateJsCode(forStatement.test);
            var forUpdate = this.generateJsCode(forStatement.update);

            if(forBody == "" && forUpdate == "" && !ASTHelper.containsCallOrUpdateOrAssignmentExpression(forTest))
            {
                return forInit +  this._SEMI_COLON;
            }

            return this._FOR_KEYWORD + this._LEFT_PARENTHESIS
                +  forInit + this._SEMI_COLON
                +  forTest + this._SEMI_COLON
                +  forUpdate + this._RIGHT_PARENTHESIS
                +  (forBody.length != 0 ? (this.newLine + forBody) : this._SEMI_COLON);
        }
        catch(e) { this.notifyError("Error when generating code from for statement:" + e); }
    },

    generateFromForInStatement: function(forInStatement)
    {
        try
        {
            var forInBody = this.generateJsCode(forInStatement.body);
            var leftPart = this.generateJsCode(forInStatement.left);
            var rightPart = this.generateJsCode(forInStatement.right);

            if(leftPart == "" && forInBody == "") { return ""; }

            forInBody = forInBody.length != 0 ? forInBody : this._SEMI_COLON;

            return this._FOR_KEYWORD + this._LEFT_PARENTHESIS
                +  leftPart + " " +  this._IN_KEYWORD + " "
                +  rightPart + this._RIGHT_PARENTHESIS
                +  this.newLine + forInBody;
        }
        catch(e) { this.notifyError("Error when generating code from for...in statement:" + e); }
    },

    generateFromBreakStatement: function(breakStatement)
    {
        try
        {
            return this._BREAK_KEYWORD + (breakStatement.label != null ? this.generateFromIdentifier(breakStatement.label) : "");
        }
        catch(e) { this.notifyError("Error when generating code from break statement:" + e); }
    },

    generateFromContinueStatement: function(continueStatement)
    {
        try
        {
            return this._CONTINUE_KEYWORD + (continueStatement.label != null ? this.generateFromIdentifier(continueStatement.label) : "");
        }
        catch(e) { this.notifyError("Error when generating code from continue statement:" + e); }
    },

    generateFromReturnStatement: function(returnStatement)
    {
        try
        {
            return this._RETURN_KEYWORD + " " + (returnStatement.argument != null ? this.generateExpression(returnStatement.argument) : "");
        }
        catch(e) { this.notifyError("Error when generating code from return statement:" + e); }
    },

    generateFromWithStatement: function(withStatement)
    {
        try
        {
            var withBody = this.generateStatement(withStatement.body);

            withBody = withBody.length != 0 ? withBody : this._SEMI_COLON;

            return this._WITH_KEYWORD + this._LEFT_PARENTHESIS
                 + this.generateExpression(withStatement.object) + this._RIGHT_PARENTHESIS
                 + withBody;
        }
        catch(e) { this.notifyError("Error when generating code from with statement:" + e); }
    },

    generateFromThrowStatement: function(throwStatement)
    {
        try
        {
            return this._THROW_KEYWORD + " " + this.generateExpression(throwStatement.argument);
        }
        catch(e) { this.notifyError("Error when generating code from throw statement:" + e); }
    },

    generateFromSwitchStatement: function(switchStatement)
    {
        try
        {
            var code = this._SWITCH_KEYWORD + this._LEFT_PARENTHESIS + this.generateExpression(switchStatement.discriminant) + this._RIGHT_PARENTHESIS;

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
        }
        catch(e) { this.notifyError("Error when generating code from switch statement:" + e); }
    },

    generateFromSwitchCase: function(switchCase)
    {
        try
        {
            var code = "";
            if(switchCase.test === null)
            {
                code += this.whitespace + this._DEFAULT_KEYWORD + this._COLON + this.newLine;
            }
            else
            {
                code += this.whitespace + this._CASE_KEYWORD + " " + this.generateExpression(switchCase.test) + this._COLON + this.newLine;
            }

            this.indent();
            for(var i = 0; i < switchCase.consequent.length; i++)
            {
                var statementCode = this.generateStatement(switchCase.consequent[i]);

                if(statementCode != "")
                {
                    code += this.whitespace + statementCode + this.newLine;
                }
            }
            this.deIndent();

            return code;
        }
        catch(e) { this.notifyError("Error when generating code from switch case:" + e); }
    },

    generateFromTryStatement: function(tryStatement)
    {
        try
        {
            var code = this._TRY_KEYWORD + this.generateJsCode(tryStatement.block);

            // catch clauses
            for(var i = 0; i < tryStatement.handlers.length; i++)
            {
                code += this.generateFromCatchClause(tryStatement.handlers[i]);
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
        }
        catch(e) { this.notifyError("Error when generating code from try statement:" + e); }
    },

    generateFromLabeledStatement: function(labeledStatement)
    {
        try
        {
            return this.generateFromIdentifier(labeledStatement.label) + this._SEMI_COLON
                + this.generateJsCode(labeledStatement.body);
        }
        catch(e) { this.notifyError("Error when generating code from labeled statement:" + e); }
    },

    generateFromVariableDeclaration: function(variableDeclaration)
    {
        try
        {
            var code = this._VAR_KEYWORD + " ";

            var declarators = variableDeclaration.declarations;
            var generatedDeclarators = 0;
            for (var i = 0, length = declarators.length; i < length; i++)
            {
                var declarator = declarators[i];

                if(this.isSlicing && !declarator.shouldBeIncluded) { continue; }

                if(generatedDeclarators != 0) { code += this._COMMA + " "; }

                generatedDeclarators++;

                code += this.generateFromVariableDeclarator(declarator);
            }

            return code;
        }
        catch(e) { this.notifyError("Error when generating code from variable declaration:" + e);}
    },

    generateFromVariableDeclarator: function(variableDeclarator)
    {
        try
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
        }
        catch(e) { alert("Error when generating code from variableDeclarator - CodeMarkupGenerator:" + e);}
    },

    generateFromPattern: function(pattern)
    {
        try
        {
            if(ASTHelper.isIdentifier(pattern)) { return this.generateFromIdentifier(pattern);}
        }
        catch(e) { this.notifyError("Error when generating code from pattern:" + e);}
    },

    generateFromCatchClause: function(catchClause)
    {
        try
        {
            var body = this.generateStatement(catchClause.body);

            body = body.length != 0 ? body : this._LEFT_GULL_WING + this._RIGHT_GULL_WING;

            return this._CATCH_KEYWORD + this._LEFT_PARENTHESIS + this.generateJsCode(catchClause.param) + this._RIGHT_PARENTHESIS
                 + body;
        }
        catch(e) { this.notifyError("Error when generating code from catch clause:" + e);}
    },

    generateFromIdentifier: function(identifier)
    {
        try
        {
            return identifier.name;
        }
        catch(e) { this.notifyError("Error when generating code from an identifier:" + e);}
    },

    generateFromLiteral: function(literal)
    {
        try
        {
            if(valueTypeHelper.isNull(literal.value)) { return "null"; }
            if (valueTypeHelper.isString(literal.value)) { return "\"" + literal.value + "\""; }
            else if (valueTypeHelper.isBoolean(literal.value) || valueTypeHelper.isNumber(literal.value)) { return literal.value; }
            else if(valueTypeHelper.isObject(literal.value))
            {
                if(literal.value.constructor != null && literal.value.constructor.name === "RegExp")
                {
                    return literal.value.toString();
                }
                else //over JSON conversion
                {
                    return atob(literal.value.RegExpBase64);
                }
            }
        }
        catch(e) { this.notifyError("Error when generating from literal:" + e);}
    },

    getSequenceCode: function(sequence)
    {
        try
        {
            var code = "";

            for(var i = 0, length = sequence.length; i < length; i++)
            {
                var item = sequence[i];

                if(i != 0) { code += this._COMMA +  " "; }

                if(this.isSlicing && !item.shouldBeIncluded)
                {
                    code += "null";
                    continue;
                }

                code += this.generateJsCode(item);
            }

            return code;
        }
        catch(e) { this.notifyError("Error when generating sequence code:" + e); }
    },

    generateCodeFromStyleElement: function(styleElement)
    {
        try
        {
            var cssText = "";

            var rules = styleElement.cssRules;

            for(var i = 0, length = rules.length; i < length; i++)
            {
                var rule = rules[i];

                if(this.isSlicing && !rule.shouldBeIncluded) { continue; }

                cssText += rule.cssText;
            }

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

    generateEndHtmlTagString: function(tagName)
    {
        return "</" + tagName + ">";
    },

    whitespace: "",
    newLine: "\r\n",
    indent: function() { this.whitespace += "  "; },
    deIndent: function()  { this.whitespace = this.whitespace.replace(/\s\s$/, "");},

    notifyError: function(message) { alert("Error when generating code text: " + message); },

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