/**
 * User: Jomaras
 * Date: 16.06.12.
 * Time: 07:39
 */
/**
 * User: Jomaras
 * Date: 15.06.12.
 * Time: 09:27
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ASTHelper = Firecrow.ASTHelper;
Firecrow.DependencyGraph.InclusionFinder = function(){};

Firecrow.DependencyGraph.InclusionFinder.prototype =
{
    isIncludedHtmlElement: function(htmlElement)
    {
        try
        {
            if(htmlElement.shouldBeIncluded) { return true; }

            if(htmlElement.type == "script")
            {
                return this.isIncludedElement(htmlElement.pathAndModel.model);
            }
            else if(htmlElement.type == "style")
            {
                var rules = htmlElement.cssRules;

                for(var i = 0, length = rules.length; i < length; i++)
                {
                    if(rules[i].shouldBeIncluded) { return true; }
                }
            }
            else if (htmlElement.type == "textNode")
            {
                return htmlElement.shouldBeIncluded;
            }
            else
            {
                var childNodes = htmlElement.childNodes;
                for(var i = 0, length = childNodes.length; i < length; i++)
                {
                    if(this.isIncludedHtmlElement(childNodes[i])) { return true; }
                }
            }

            return false;
        }
        catch(e)
        {
            this.notifyError("Error when finding inclusions in htmlElement: " + e);
        }
    },

    isIncludedElement: function(element)
    {
        try
        {
                 if (ASTHelper.isProgram(element)) { return this.isIncludedProgram(element); }
            else if (ASTHelper.isStatement(element)) { return this.isIncludedStatement(element); }
            else if (ASTHelper.isFunction(element)) { return this.isIncludedFunction(element); }
            else if (ASTHelper.isExpression(element)) { return this.isIncludedExpression(element); }
            else if (ASTHelper.isSwitchCase(element)) { return this.isIncludedSwitchCase(element); }
            else if (ASTHelper.isCatchClause(element)) { return this.isIncludedCatchClause(element); }
            else if (ASTHelper.isVariableDeclaration(element)) { return this.isIncludedVariableDeclaration(element); }
            else if (ASTHelper.isVariableDeclarator(element)) { return this.isIncludedVariableDeclarator(element); }
            else if (ASTHelper.isLiteral(element)) { return this.isIncludedLiteral(element); }
            else if (ASTHelper.isIdentifier(element)) { return this.isIncludedIdentifier(element); }
            else { this.notifyError("Error while finding inclusions unidentified ast element: "); }
        }
        catch(e) { alert("Error while finding inclusions: " + e); }
    },

    isIncludedProgram: function(programElement)
    {
        try
        {
            if(programElement.body != null)
            {
                var body = programElement.body;

                for(var i = 0, length = body.length; i < length; i++)
                {
                    if(this.isIncludedElement(body[i])) { return true; }
                }
            }

            return false;
        }
        catch(e) { this.notifyError("Error when isIncludedProgram: " + e); }
    },

    isIncludedStatement: function(statement)
    {
        try
        {
                 if (ASTHelper.isEmptyStatement(statement))  { return this.isIncludedEmptyStatement(statement); }
            else if (ASTHelper.isBlockStatement(statement)) { return this.isIncludedBlockStatement(statement); }
            else if (ASTHelper.isExpressionStatement(statement)) { return this.isIncludedExpressionStatement(statement); }
            else if (ASTHelper.isIfStatement(statement)) { return this.isIncludedIfStatement(statement); }
            else if (ASTHelper.isWhileStatement(statement)) { return this.isIncludedWhileStatement(statement); }
            else if (ASTHelper.isDoWhileStatement(statement)) { return this.isIncludedDoWhileStatement(statement); }
            else if (ASTHelper.isForStatement(statement)) { return this.isIncludedForStatement(statement); }
            else if (ASTHelper.isForInStatement(statement)) { return this.isIncludedForInStatement(statement); }
            else if (ASTHelper.isLabeledStatement(statement)) { return this.isIncludedLabeledStatement(statement); }
            else if (ASTHelper.isBreakStatement(statement)) { return this.isIncludedBreakStatement(statement); }
            else if (ASTHelper.isContinueStatement(statement)) { return this.isIncludedContinueStatement(statement); }
            else if (ASTHelper.isReturnStatement(statement)) { return this.isIncludedReturnStatement(statement); }
            else if (ASTHelper.isWithStatement(statement)) { return this.isIncludedWithStatement(statement); }
            else if (ASTHelper.isTryStatement(statement)) { return this.isIncludedTryStatement(statement); }
            else if (ASTHelper.isThrowStatement(statement)) { return this.isIncludedThrowStatement(statement); }
            else if (ASTHelper.isSwitchStatement(statement)) { return this.isIncludedSwitchStatement(statement); }
            else { this.notifyError("Error: AST Statement element not defined: " + statement.type);}
        }
        catch(e)
        {
            this.notifyError("Error when finding inclusions from a statement: " + e);
        }
    },

    isIncludedExpression: function(expression)
    {
        try
        {
                 if (ASTHelper.isAssignmentExpression(expression)) { return this.isIncludedAssignmentExpression(expression); }
            else if (ASTHelper.isUnaryExpression(expression)) { return this.isIncludedUnaryExpression(expression); }
            else if (ASTHelper.isBinaryExpression(expression)) { return this.isIncludedBinaryExpression(expression); }
            else if (ASTHelper.isLogicalExpression(expression)) { return this.isIncludedLogicalExpression(expression); }
            else if (ASTHelper.isLiteral(expression)) { return this.isIncludedLiteral(expression); }
            else if (ASTHelper.isIdentifier(expression)) { return this.isIncludedIdentifier(expression); }
            else if (ASTHelper.isUpdateExpression(expression)) { return this.isIncludedUpdateExpression(expression); }
            else if (ASTHelper.isNewExpression(expression)) { return this.isIncludedNewExpression(expression); }
            else if (ASTHelper.isConditionalExpression(expression)) { return this.isIncludedConditionalExpression(expression); }
            else if (ASTHelper.isThisExpression(expression)) { return this.isIncludedThisExpression(expression); }
            else if (ASTHelper.isCallExpression(expression)) { return this.isIncludedCallExpression(expression); }
            else if (ASTHelper.isMemberExpression(expression)) { return this.isIncludedMemberExpression(expression); }
            else if (ASTHelper.isSequenceExpression(expression)) { return this.isIncludedSequenceExpression(expression); }
            else if (ASTHelper.isArrayExpression(expression)) { return this.isIncludedArrayExpression(expression); }
            else if (ASTHelper.isObjectExpression(expression)) { return this.isIncludedObjectExpression(expression); }
            else if (ASTHelper.isFunctionExpression(expression)) { return this.isIncludedFunction(expression); }
            else { this.notifyError("Error: AST Expression element not defined: " + expression.type);  return false;}
        }
        catch(e) { this.notifyError("Error when finding inclusions from an expression:" + e); }
    },

    isIncludedFunction: function(functionDecExp)
    {
        try
        {
            return functionDecExp.shouldBeIncluded
                || this.isIncludedFunctionParameters(functionDecExp)
                || this.isIncludedFunctionBody(functionDecExp);
        }
        catch(e) { alert("Error when finding inclusions from a function:" + e); }
    },

    isIncludedFunctionParameters: function(functionDecExp)
    {
        try
        {
            var params = functionDecExp.params;

            for(var i = 0, length = params.length; i < length; i++)
            {
                if(params[i].shouldBeIncluded) { return true; }
            }

            return false;
        }
        catch(e) { this.notifyError("Error when finding inclusions from function parameters:" + e);}
    },

    isIncludedFunctionBody: function(functionDeclExp)
    {
        try
        {
            this.isIncludedElement(functionDeclExp.body);
        }
        catch(e) { this.notifyError("Error when finding inclusions from function body:" + e); }
    },

    isIncludedBlockStatement: function(blockStatement)
    {
        try
        {
            var body = blockStatement.body;

            for(var i = 0, length = body.length; i < length; i++)
            {
                if(this.isIncludedElement(body[i])) { return true; };
            }

            return false;
        }
        catch(e) { this.notifyError("Error when isIncludedBlockStatement:" + e);}
    },

    isIncludedEmptyStatement: function(emptyStatement)
    {
        try
        {
            return emptyStatement.shouldBeIncluded;
        }
        catch(e) { this.notifyError("Error when isIncludedEmptyStatement: " + e); }
    },

    isIncludedExpressionStatement: function(expressionStatement)
    {
        try
        {
            return this.isIncludedElement(expressionStatement.expression);
        }
        catch(e) { this.notifyError("Error when isIncluded HTML from expression statement:" + e); }
    },

    isIncludedAssignmentExpression: function(assignmentExpression)
    {
        try
        {
            return assignmentExpression.shouldBeIncluded
                || this.isIncludedElement(assignmentExpression.left)
                || this.isIncludedElement(assignmentExpression.right)
        }
        catch(e) { this.notifyError("Error when finding inclusions from assignment expression:" + e); }
    },

    isIncludedUnaryExpression: function(unaryExpression)
    {
        try
        {
            return unaryExpression.shouldBeIncluded
                || this.isIncludedExpression(unaryExpression.argument);
        }
        catch(e) { this.notifyError("Error when finding inclusions from unary expression:" + e); }
    },

    isIncludedBinaryExpression: function(binaryExpression)
    {
        try
        {
            return binaryExpression.shouldBeIncluded
                || this.isIncludedElement(binaryExpression.left)
                || this.isIncludedElement(binaryExpression.right);
        }
        catch(e) { this.notifyError("Error when finding inclusions from binary expression:" + e); }
    },

    isIncludedLogicalExpression: function(logicalExpression)
    {
        try
        {
            return logicalExpression.shouldBeIncluded
                || this.isIncludedElement(logicalExpression.left)
                || this.isIncludedElement(logicalExpression.right);
        }
        catch(e) { this.notifyError("Error when finding inclusions from logical expression:" + e); }
    },

    isIncludedUpdateExpression: function(updateExpression)
    {
        try
        {
            return updateExpression.shouldBeIncluded
                || this.isIncludedExpression(updateExpression.argument);
        }
        catch(e) { this.notifyError("Error when isIncluding from update expression:" + e); }
    },

    isIncludedNewExpression: function(newExpression)
    {
        try
        {
            return newExpression.shouldBeIncluded
                || this.isIncludedElement(newExpression.callee)
                || this.isSequenceIncluded(newExpression.arguments);
        }
        catch(e) { this.notifyError("Error when finding inclusions from new expression:" + e); }
    },

    isIncludedConditionalExpression: function(conditionalExpression)
    {
        try
        {
            return conditionalExpression.shouldBeIncluded
                || this.isIncludedElement(conditionalExpression.test)
                || this.isIncludedElement(conditionalExpression.consequent)
                || this.isIncludedElement(conditionalExpression.alternate);
        }
        catch(e) { this.notifyError("Error when finding inclusions from conditional expression:" + e); }
    },

    isIncludedThisExpression: function(thisExpression)
    {
        try
        {
            return thisExpression.shouldBeIncluded;
        }
        catch(e) { this.notifyError("Error when finding inclusions from this expression:" + e); }
    },

    isIncludedCallExpression: function(callExpression)
    {
        try
        {
            return callExpression.shouldBeIncluded
                || this.isIncludedElement(callExpression.callee)
                || this.isSequenceIncluded(callExpression.arguments);
        }
        catch(e) { this.notifyError("Error when finding inclusions from call expression:" + e); }
    },

    isIncludedMemberExpression: function(memberExpression)
    {
        try
        {
            return memberExpression.shouldBeIncluded
                || this.isIncludedElement(memberExpression.object)
                || this.isIncludedElement(memberExpression.property);
        }
        catch(e) { this.notifyError("Error when finding inclusions from member expression:" + e); }
    },

    isIncludedSequenceExpression: function(sequenceExpression)
    {
        try
        {
            this.isSequenceIncluded(sequenceExpression.expressions);
        }
        catch(e) { this.notifyError("Error when finding inclusions from sequence expression:" + e); }
    },

    isIncludedArrayExpression: function(arrayExpression)
    {
        try
        {
            return arrayExpression.shouldBeIncluded
                || this.isSequenceIncluded(arrayExpression.elements);
        }
        catch(e) { this.notifyError("Error when finding inclusions from array expression:" + e); }
    },

    isIncludedObjectExpression: function(objectExpression)
    {
        try
        {
            var properties = objectExpression.properties;

            if(objectExpression.shouldBeIncluded) { return true; }

            for (var i = 0, length = properties.length; i < length; i++)
            {
                if(this.isIncludedObjectExpressionProperty(properties[i])) { return true;}
            }

            return false;
        }
        catch(e) { this.notifyError("Error when isIncluded object expression:" + e); }
    },

    isIncludedObjectExpressionProperty: function(objectExpressionProperty)
    {
        try
        {
            if(objectExpressionProperty.shouldBeIncluded || objectExpressionProperty.key.shouldBeIncluded) { return true;}

            return objectExpressionProperty.value != null
                 ? this.isIncludedElement(objectExpressionProperty.value)
                 : false;
        }
        catch(e) { this.notifyError("Error when isIncluded object expression property:" + e); }
    },

    isIncludedIfStatement: function(ifStatement)
    {
        try
        {
            return ifStatement.shouldBeIncluded
                || this.isIncludedElement(ifStatement.test)
                || this.isIncludedElement(ifStatement.consequent)
                || (ifStatement.alternate != null ? this.isIncludedElement(ifStatement.alternate) : false)
        }
        catch(e) { this.notifyError("Error when finding inclusions from if statement:" + e); }
    },

    isIncludedWhileStatement: function(whileStatement)
    {
        try
        {
            return whileStatement.shouldBeIncluded
                || this.isIncludedElement(whileStatement.test)
                || this.isIncludedElement(whileStatement.body);
        }
        catch(e) { this.notifyError("Error when finding inclusions from while statement:" + e); }
    },

    isIncludedDoWhileStatement: function(doWhileStatement)
    {
        try
        {
            return doWhileStatement.shouldBeIncluded
                || this.isIncludedElement(doWhileStatement.test)
                || this.isIncludedElement(doWhileStatement.body);
        }
        catch(e) { this.notifyError("Error when finding inclusions from do while statement:" + e); }
    },

    isIncludedForStatement: function(forStatement)
    {
        try
        {
            return forStatement.shouldBeIncluded
                || this.isIncludedElement(forStatement.init)
                || this.isIncludedElement(forStatement.test)
                || this.isIncludedElement(forStatement.update)
                || this.isIncludedElement(forStatement.body);
        }
        catch(e) { this.notifyError("Error when finding inclusions from for statement:" + e); }
    },

    isIncludedForInStatement: function(forInStatement)
    {
        try
        {
            return forInStatement.shouldBeIncluded
                || this.isIncludedElement(forInStatement.left)
                || this.isIncludedElement(forInStatement.right)
                || this.isIncludedElement(forInStatement.body);
        }
        catch(e) { this.notifyError("Error when finding inclusions from for...in statement:" + e); }
    },

    isIncludedBreakStatement: function(breakStatement)
    {
        try
        {
            return breakStatement.shouldBeIncluded;
        }
        catch(e) { this.notifyError("Error when finding inclusions from break statement:" + e); }
    },

    isIncludedContinueStatement: function(continueStatement)
    {
        try
        {
            return continueStatement.shouldBeIncluded;
        }
        catch(e) { this.notifyError("Error when finding inclusions from continue statement:" + e); }
    },

    isIncludedReturnStatement: function(returnStatement)
    {
        try
        {
            return returnStatement.shouldBeIncluded
                || (returnStatement.argument != null ? this.isIncludedExpression(returnStatement.argument) : false);
        }
        catch(e) { this.notifyError("Error when finding inclusions from statement:" + e); }
    },

    isIncludedWithStatement: function(withStatement)
    {
        try
        {
            return withStatement.shouldBeIncluded
                || this.isIncludedExpression(withStatement.object)
                || this.isIncludedStatement(withStatement.body);
        }
        catch(e) { this.notifyError("Error when finding inclusions from with statement:" + e); }
    },

    isIncludedThrowStatement: function(throwStatement)
    {
        try
        {
            return throwStatement.shouldBeIncluded
                || this.isIncludedExpression(throwStatement.argument);
        }
        catch(e) { this.notifyError("Error when finding inclusions from throw statement:" + e); }
    },

    isIncludedSwitchStatement: function(switchStatement)
    {
        try
        {
            if(switchStatement.shouldBeIncluded || this.isIncludedExpression(switchStatement.discriminant)) { return true; }

            for(var i = 0; i < switchStatement.cases.length; i++)
            {
                if(this.isIncludedSwitchCase(switchStatement.cases[i])) { return true; }
            }

            return false;
        }
        catch(e) { this.notifyError("Error when finding inclusions from switch statement:" + e); }
    },

    isIncludedSwitchCase: function(switchCase)
    {
        try
        {
            if(switchCase.shouldBeIncluded) { return true; }

            if(switchCase.test != null) { if(this.isIncludedExpression(switchCase.test)) { return true;}; }

            for(var i = 0; i < switchCase.consequent.length; i++)
            {
                if(this.isIncludedElement(switchCase.consequent[i])) { return true; }
            }

            return false;
        }
        catch(e) { this.notifyError("Error when finding inclusions from switch case:" + e); }
    },

    isIncludedTryStatement: function(tryStatement)
    {
        try
        {
            if(tryStatement.shouldBeIncluded) { return true;}
            if(this.isIncludedElement(tryStatement.block)) { return true; }


            for(var i = 0; i < tryStatement.handlers.length; i++)
            {
                if(this.isIncludedCatchClause(tryStatement.handlers[i])) { return true};
            }

            if(tryStatement.finalizer != null)
            {
                if(this.isIncludedElement(tryStatement.finalizer)) { return true;}
            }

            return false;
        }
        catch(e) { this.notifyError("Error when finding inclusions from try statement:" + e); }
    },

    isIncludedLabeledStatement: function(labeledStatement)
    {
        try
        {
            return label.shouldBeIncluded
                || this.isIncludedIdentifier(labeledStatement.label)
                || this.isIncludedElement(labeledStatement.body);
        }
        catch(e) { this.notifyError("Error when finding inclusions from labeled statement:" + e); }
    },

    isIncludedVariableDeclaration: function(variableDeclaration)
    {
        try
        {
            if(variableDeclaration.shouldBeIncluded) { return true; }

            var declarators = variableDeclaration.declarations;
            for (var i = 0, length = declarators.length; i < length; i++)
            {
                var declarator = declarators[i];

                if(this.isIncludedVariableDeclarator(declarator)) { return true; }
            }

            return false;
        }
        catch(e) { this.notifyError("Error when finding inclusions from variable declaration:" + e);}
    },

    isIncludedVariableDeclarator: function(variableDeclarator)
    {
        try
        {
            return variableDeclarator.shouldBeIncluded
                || this.isIncludedPattern(variableDeclarator.id)
                || (variableDeclarator.init != null ? this.isIncludedElement(variableDeclarator.init) : false);
        }
        catch(e) { alert("Error when finding inclusions from variableDeclarator - CodeMarkupGenerator:" + e);}
    },

    isIncludedPattern: function(pattern)
    {
        try
        {
            if(ASTHelper.isIdentifier(pattern)) { return this.isIncludedIdentifier(pattern);}

            return false;
        }
        catch(e) { this.notifyError("Error when finding inclusions from pattern:" + e);}
    },

    isIncludedCatchClause: function(catchClause)
    {
        try
        {
            return catchClause.shouldBeIncluded
                || this.isIncludedStatement(catchClause.body)
                || this.isIncludedElement(catchClause.param);
        }
        catch(e) { this.notifyError("Error when finding inclusions from catch clause:" + e);}
    },

    isIncludedIdentifier: function(identifier)
    {
        try
        {
            return identifier.shouldBeIncluded;
        }
        catch(e) { this.notifyError("Error when finding inclusions from an identifier:" + e);}
    },

    isIncludedLiteral: function(literal)
    {
        try
        {
            return literal.shouldBeIncluded;
        }
        catch(e) { this.notifyError("Error when isIncluded in literal:" + e);}
    },

    isSequenceIncluded: function(sequence)
    {
        try
        {
            for(var i = 0, length = sequence.length; i < length; i++)
            {
                var item = sequence[i];

                if(item.shouldBeIncluded
                || this.isIncludedElement(item)) { return; }
            }

            return false;
        }
        catch(e) { this.notifyError("Error when isIncluded sequence:" + e); }
    },

    notifyError:function(message) { alert("InclusionFinder - " + message); }
}
/*************************************************************************************/
}});