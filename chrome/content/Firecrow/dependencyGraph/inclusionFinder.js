FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ASTHelper = Firecrow.ASTHelper;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
Firecrow.DependencyGraph.InclusionFinder = function(){};

Firecrow.DependencyGraph.InclusionFinder.notifyError = function(message) { alert("InclusionFinder - " + message);}

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
            else if(htmlElement.type == "style" || htmlElement.type == "link")
            {
                if(htmlElement.cssRules == null) { return false; }

                var rules = htmlElement.cssRules;

                for(var i = 0, length = rules.length; i < length; i++)
                {
                    if(rules[i].shouldBeIncluded) { return true; }
                }
            }
            else if (htmlElement.type == "textNode")
            {
                return htmlElement.shouldBeIncluded || (htmlElement.parent != null && htmlElement.parent.shouldBeIncluded);
            }
            else
            {
                var childNodes = htmlElement.childNodes;
                for(var i = 0, length = childNodes.length; i < length; i++)
                {
                    if(this.isIncludedHtmlElement(childNodes[i]))
                    {
                        return true;
                    }
                }
            }

            return false;
        }
        catch(e)
        {
            debugger;
            this.notifyError("Error when finding inclusions in htmlElement: " + e);
        }
    },

    isIncludedElement: function(element)
    {
        if(element == null) { return false;}

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
        else { this.notifyError("Error while finding inclusions unidentified ast element"); }
    },

    isIncludedProgram: function(programElement)
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
    },

    isIncludedStatement: function(statement)
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
    },

    isIncludedExpression: function(expression)
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
    },

    isIncludedFunction: function(functionDecExp)
    {
        return functionDecExp.shouldBeIncluded
            || this.isIncludedFunctionParameters(functionDecExp)
            || this.isIncludedFunctionBody(functionDecExp);
    },

    isIncludedFunctionParameters: function(functionDecExp)
    {
        var params = functionDecExp.params;

        for(var i = 0, length = params.length; i < length; i++)
        {
            if(params[i].shouldBeIncluded) { return true; }
        }

        return false;
    },

    isIncludedFunctionBody: function(functionDeclExp)
    {
        this.isIncludedElement(functionDeclExp.body);
    },

    isIncludedBlockStatement: function(blockStatement)
    {
        var body = blockStatement.body;

        for(var i = 0, length = body.length; i < length; i++)
        {
            if(this.isIncludedElement(body[i])) { return true; };
        }

        return false;
    },

    isIncludedEmptyStatement: function(emptyStatement)
    {
        return emptyStatement.shouldBeIncluded;
    },

    isIncludedExpressionStatement: function(expressionStatement)
    {
        return this.isIncludedElement(expressionStatement.expression);
    },

    isIncludedAssignmentExpression: function(assignmentExpression)
    {
        return assignmentExpression.shouldBeIncluded
            || this.isIncludedElement(assignmentExpression.left)
            || this.isIncludedElement(assignmentExpression.right)
    },

    isIncludedUnaryExpression: function(unaryExpression)
    {
        return unaryExpression.shouldBeIncluded
            || this.isIncludedExpression(unaryExpression.argument);
    },

    isIncludedBinaryExpression: function(binaryExpression)
    {
        return binaryExpression.shouldBeIncluded
            || this.isIncludedElement(binaryExpression.left)
            || this.isIncludedElement(binaryExpression.right);
    },

    isIncludedLogicalExpression: function(logicalExpression)
    {
        return logicalExpression.shouldBeIncluded
            || this.isIncludedElement(logicalExpression.left)
            || this.isIncludedElement(logicalExpression.right);
    },

    isIncludedUpdateExpression: function(updateExpression)
    {
        return updateExpression.shouldBeIncluded
            || this.isIncludedExpression(updateExpression.argument);
    },

    isIncludedNewExpression: function(newExpression)
    {
        return newExpression.shouldBeIncluded
            || this.isIncludedElement(newExpression.callee)
            || this.isSequenceIncluded(newExpression.arguments);
    },

    isIncludedConditionalExpression: function(conditionalExpression)
    {
        return conditionalExpression.shouldBeIncluded
            || this.isIncludedElement(conditionalExpression.test)
            || this.isIncludedElement(conditionalExpression.consequent)
            || this.isIncludedElement(conditionalExpression.alternate);
    },

    isIncludedThisExpression: function(thisExpression)
    {
        return thisExpression.shouldBeIncluded;
    },

    isIncludedCallExpression: function(callExpression)
    {
        return callExpression.shouldBeIncluded
            || this.isIncludedElement(callExpression.callee)
            || this.isSequenceIncluded(callExpression.arguments);
    },

    isIncludedMemberExpression: function(memberExpression)
    {
        return memberExpression.shouldBeIncluded
            || this.isIncludedElement(memberExpression.object)
            || this.isIncludedElement(memberExpression.property);
    },

    isIncludedSequenceExpression: function(sequenceExpression)
    {
        var isIncluded = this.isSequenceIncluded(sequenceExpression.expressions);

        if(isIncluded)
        {
            Firecrow.includeNode(sequenceExpression);
        }

        return isIncluded;
    },

    isIncludedArrayExpression: function(arrayExpression)
    {
        return arrayExpression.shouldBeIncluded
            || this.isSequenceIncluded(arrayExpression.elements);
    },

    isIncludedObjectExpression: function(objectExpression)
    {
        var properties = objectExpression.properties;

        if(objectExpression.shouldBeIncluded) { return true; }

        for (var i = 0, length = properties.length; i < length; i++)
        {
            if(this.isIncludedObjectExpressionProperty(properties[i])) { return true;}
        }

        return false;
    },

    isIncludedObjectExpressionProperty: function(objectExpressionProperty)
    {
        if(objectExpressionProperty.shouldBeIncluded || objectExpressionProperty.key.shouldBeIncluded) { return true;}

        return objectExpressionProperty.value != null
             ? this.isIncludedElement(objectExpressionProperty.value)
             : false;
    },

    isIncludedIfStatement: function(ifStatement)
    {
        return ifStatement.shouldBeIncluded
            || this.isIncludedElement(ifStatement.test)
            || this.isIncludedElement(ifStatement.consequent)
            || (ifStatement.alternate != null ? this.isIncludedElement(ifStatement.alternate) : false);
    },

    isIncludedWhileStatement: function(whileStatement)
    {
        return whileStatement.shouldBeIncluded
            || this.isIncludedElement(whileStatement.test)
            || this.isIncludedElement(whileStatement.body);
    },

    isIncludedDoWhileStatement: function(doWhileStatement)
    {
        return doWhileStatement.shouldBeIncluded
            || this.isIncludedElement(doWhileStatement.test)
            || this.isIncludedElement(doWhileStatement.body);
    },

    isIncludedForStatement: function(forStatement)
    {                                    arguments
        var testIncluded = (forStatement.test != null ? this.isIncludedElement(forStatement.test) : false);
        var updateIncluded = (forStatement.update != null ? this.isIncludedElement(forStatement.update) : false);

        //TODO: HACK!
        if(testIncluded && !updateIncluded)
        {
            if(forStatement.update != null)
            {
                updateIncluded = true;
                Firecrow.includeNode(forStatement.update);
                if(forStatement.update.children != null)
                {
                    forStatement.update.children.forEach(function(child)
                    {
                        Firecrow.includeNode(child);
                    });
                }
            }
        }
        //END HACK!

        return  forStatement.shouldBeIncluded
            || (forStatement.init != null ? this.isIncludedElement(forStatement.init) : false)
            || testIncluded
            || updateIncluded
            || this.isIncludedElement(forStatement.body);
    },

    isIncludedForInStatement: function(forInStatement)
    {
        return forInStatement.shouldBeIncluded
            || this.isIncludedElement(forInStatement.left)
            || this.isIncludedElement(forInStatement.right)
            || this.isIncludedElement(forInStatement.body);
    },

    isIncludedBreakStatement: function(breakStatement)
    {
        return breakStatement.shouldBeIncluded;
    },

    isIncludedContinueStatement: function(continueStatement)
    {
        return continueStatement.shouldBeIncluded;
    },

    isIncludedReturnStatement: function(returnStatement)
    {
        return returnStatement.shouldBeIncluded
            || (returnStatement.argument != null ? this.isIncludedExpression(returnStatement.argument) : false);
    },

    isIncludedWithStatement: function(withStatement)
    {
        return withStatement.shouldBeIncluded
            || this.isIncludedExpression(withStatement.object)
            || this.isIncludedStatement(withStatement.body);
    },

    isIncludedThrowStatement: function(throwStatement)
    {
        return throwStatement.shouldBeIncluded
            || this.isIncludedExpression(throwStatement.argument);
    },

    isIncludedSwitchStatement: function(switchStatement)
    {
        if(switchStatement.shouldBeIncluded || this.isIncludedExpression(switchStatement.discriminant)) { return true; }

        for(var i = 0; i < switchStatement.cases.length; i++)
        {
            if(this.isIncludedSwitchCase(switchStatement.cases[i])) { return true; }
        }

        return false;
    },

    isIncludedSwitchCase: function(switchCase)
    {
        if(switchCase.shouldBeIncluded) { return true; }

        if(switchCase.test != null) { if(this.isIncludedExpression(switchCase.test)) { return true;}; }

        for(var i = 0; i < switchCase.consequent.length; i++)
        {
            if(this.isIncludedElement(switchCase.consequent[i])) { return true; }
        }

        return false;
    },

    isIncludedTryStatement: function(tryStatement)
    {
        if(tryStatement.shouldBeIncluded) { return true;}
        if(this.isIncludedElement(tryStatement.block)) { return true; }

        var handlers = tryStatement.handlers ||
           (ValueTypeHelper.isArray(tryStatement.handler) ? tryStatement.handler :
                                                            [tryStatement.handler]);

        for(var i = 0; i < handlers.length; i++)
        {
            if(this.isIncludedCatchClause(handlers[i])) { return true};
        }

        if(tryStatement.finalizer != null)
        {
            if(this.isIncludedElement(tryStatement.finalizer)) { return true;}
        }

        return false;
    },

    isIncludedLabeledStatement: function(labeledStatement)
    {
        return label.shouldBeIncluded
            || this.isIncludedIdentifier(labeledStatement.label)
            || this.isIncludedElement(labeledStatement.body);
    },

    isIncludedVariableDeclaration: function(variableDeclaration)
    {
        if(variableDeclaration.shouldBeIncluded) { return true; }

        var declarators = variableDeclaration.declarations;
        for (var i = 0, length = declarators.length; i < length; i++)
        {
            var declarator = declarators[i];

            if(this.isIncludedVariableDeclarator(declarator)) { return true; }
        }

        return false;
    },

    isIncludedVariableDeclarator: function(variableDeclarator)
    {
        return variableDeclarator.shouldBeIncluded
            || this.isIncludedPattern(variableDeclarator.id)
            || (variableDeclarator.init != null ? this.isIncludedElement(variableDeclarator.init) : false);
    },

    isIncludedPattern: function(pattern)
    {
        if(ASTHelper.isIdentifier(pattern)) { return this.isIncludedIdentifier(pattern);}

        return false;
    },

    isIncludedCatchClause: function(catchClause)
    {
        if(catchClause == null) return false;

        return catchClause.shouldBeIncluded
            || this.isIncludedStatement(catchClause.body)
            || this.isIncludedElement(catchClause.param);
    },

    isIncludedIdentifier: function(identifier)
    {
        return identifier.shouldBeIncluded;
    },

    isIncludedLiteral: function(literal)
    {
        return literal.shouldBeIncluded;
    },

    isSequenceIncluded: function(sequence)
    {
        for(var i = 0, length = sequence.length; i < length; i++)
        {
            var item = sequence[i];

            if(item.shouldBeIncluded || this.isIncludedElement(item)) { return true; }
        }

        return false;
    },

    notifyError:function(message) { Firecrow.DependencyGraph.InclusionFinder.notifyError(message); }
}
/*************************************************************************************/
}});