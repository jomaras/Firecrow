/**
 * User: Jomaras
 * Date: 15.06.12.
 * Time: 09:27
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ASTHelper = Firecrow.ASTHelper;
var InclusionFinder = Firecrow.DependencyGraph.InclusionFinder;

Firecrow.DependencyGraph.DependencyPostprocessor = function()
{
    this.inclusionFinder = new InclusionFinder();
};

Firecrow.DependencyGraph.DependencyPostprocessor.notifyError = function(message) { alert("DependencyPostprocessor - " + message); }
Firecrow.DependencyGraph.DependencyPostprocessor.processHtmlElement = function()
{
    (new Firecrow.DependencyGraph.DependencyPostprocessor()).processHtmlElement(model);
};

Firecrow.DependencyGraph.DependencyPostprocessor.prototype =
{
    processHtmlElement: function(htmlElement)
    {
        if(!this.inclusionFinder.isIncludedHtmlElement(htmlElement)) { return; }

        htmlElement.shouldBeIncluded = true;

        if(htmlElement.type == "script")
        {
            this.processElement(htmlElement.pathAndModel.model);
        }
        else if(htmlElement.type == "style" || htmlElement.type == "textNode") {}
        else
        {
            var childNodes = htmlElement.childNodes;
            for(var i = 0, length = childNodes.length; i < length; i++)
            {
                this.processHtmlElement(childNodes[i]);
            }
        }
    },

    processElement: function(element)
    {
        try
        {
                 if (ASTHelper.isProgram(element)) { this.processProgram(element); }
            else if (ASTHelper.isStatement(element)) { this.processStatement(element); }
            else if (ASTHelper.isFunction(element)) { this.processFunction(element); }
            else if (ASTHelper.isExpression(element)) { this.processExpression(element); }
            else if (ASTHelper.isSwitchCase(element)) { this.processSwitchCase(element); }
            else if (ASTHelper.isCatchClause(element)) { this.processCatchClause(element); }
            else if (ASTHelper.isVariableDeclaration(element)) { this.processVariableDeclaration(element); }
            else if (ASTHelper.isVariableDeclarator(element)) { this.processVariableDeclarator(element); }
            else if (ASTHelper.isLiteral(element)) { this.processLiteral(element); }
            else if (ASTHelper.isIdentifier(element)) { this.processIdentifier(element); }
            else { this.notifyError("Error while processing code unidentified ast element"); }
        }
        catch(e) { alert("Error while processing code: " + e); }
    },

    processProgram: function(programElement)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedProgram(programElement)) { return; }

            programElement.shouldBeIncluded = true;

            if(programElement.body != null)
            {
                var body = programElement.body;

                for(var i = 0, length = body.length; i < length; i++)
                {
                    this.processElement(body[i]);
                }
            }
        }
        catch(e) { this.notifyError("Error when processing program: " + e); }
    },

    processStatement: function(statement)
    {
        try
        {
                 if (ASTHelper.isEmptyStatement(statement))  { this.processEmptyStatement(statement); }
            else if (ASTHelper.isBlockStatement(statement)) { this.processBlockStatement(statement); }
            else if (ASTHelper.isExpressionStatement(statement)) { this.processExpressionStatement(statement); }
            else if (ASTHelper.isIfStatement(statement)) { this.processIfStatement(statement); }
            else if (ASTHelper.isWhileStatement(statement)) { this.processWhileStatement(statement); }
            else if (ASTHelper.isDoWhileStatement(statement)) { this.processDoWhileStatement(statement); }
            else if (ASTHelper.isForStatement(statement)) { this.processForStatement(statement); }
            else if (ASTHelper.isForInStatement(statement)) { this.processForInStatement(statement); }
            else if (ASTHelper.isLabeledStatement(statement)) { this.processLabeledStatement(statement); }
            else if (ASTHelper.isBreakStatement(statement)) { this.processBreakStatement(statement); }
            else if (ASTHelper.isContinueStatement(statement)) { this.processContinueStatement(statement); }
            else if (ASTHelper.isReturnStatement(statement)) { this.processReturnStatement(statement); }
            else if (ASTHelper.isWithStatement(statement)) { this.processWithStatement(statement); }
            else if (ASTHelper.isTryStatement(statement)) { this.processTryStatement(statement); }
            else if (ASTHelper.isThrowStatement(statement)) { this.processThrowStatement(statement); }
            else if (ASTHelper.isSwitchStatement(statement)) { this.processSwitchStatement(statement); }
            else if (ASTHelper.isVariableDeclaration(statement)) { this.processVariableDeclaration(statement);}
            else
            {
                this.notifyError("Error: AST Statement element not defined: " + statement.type);
            }
        }
        catch(e)
        {
            this.notifyError("Error when processing code from a statement: " + e);
        }
    },

    processExpression: function(expression)
    {
        try
        {
                 if (ASTHelper.isAssignmentExpression(expression)) { this.processAssignmentExpression(expression); }
            else if (ASTHelper.isUnaryExpression(expression)) { this.processUnaryExpression(expression); }
            else if (ASTHelper.isBinaryExpression(expression)) { this.processBinaryExpression(expression); }
            else if (ASTHelper.isLogicalExpression(expression)) { this.processLogicalExpression(expression); }
            else if (ASTHelper.isLiteral(expression)) { this.processLiteral(expression); }
            else if (ASTHelper.isIdentifier(expression)) { this.processIdentifier(expression); }
            else if (ASTHelper.isUpdateExpression(expression)) { this.processUpdateExpression(expression); }
            else if (ASTHelper.isNewExpression(expression)) { this.processNewExpression(expression); }
            else if (ASTHelper.isConditionalExpression(expression)) { this.processConditionalExpression(expression); }
            else if (ASTHelper.isThisExpression(expression)) { this.processThisExpression(expression); }
            else if (ASTHelper.isCallExpression(expression)) { this.processCallExpression(expression); }
            else if (ASTHelper.isMemberExpression(expression)) { this.processMemberExpression(expression); }
            else if (ASTHelper.isSequenceExpression(expression)) { this.processSequenceExpression(expression); }
            else if (ASTHelper.isArrayExpression(expression)) { this.processArrayExpression(expression); }
            else if (ASTHelper.isObjectExpression(expression)) { this.processObjectExpression(expression); }
            else if (ASTHelper.isFunctionExpression(expression)) { this.processFunction(expression); }
            else { this.notifyError("Error: AST Expression element not defined: " + expression.type);  "";}
        }
        catch(e) { this.notifyError("Error when processing code from an expression:" + e); }
    },

    processFunction: function(functionDecExp)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedFunction(functionDecExp)) { return; }

            functionDecExp.shouldBeIncluded = true;
            functionDecExp.body.shouldBeIncluded = true;

            if(functionDecExp.id != null) { functionDecExp.shouldBeIncluded = true; }

            this.processFunctionBody(functionDecExp);
        }
        catch(e) { this.notifyError("Error when processing code from a function:" + e); }
    },

    processFunctionBody: function(functionDeclExp)
    {
        try
        {
            this.processElement(functionDeclExp.body);
        }
        catch(e) { this.notifyError("Error when processing code from function body:" + e); }
    },

    processBlockStatement: function(blockStatement)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedBlockStatement(blockStatement)) { return; }

            blockStatement.shouldBeIncluded = true;

            var body = blockStatement.body;

            for(var i = 0, length = body.length; i < length; i++)
            {
                this.processElement(body[i]);
            }
        }
        catch(e) { this.notifyError("Error when processing from block statement:" + e);}
    },

    processEmptyStatement: function(emptyStatement)
    {
        try
        {

        }
        catch(e) { this.notifyError("Error when processing from empty statement:" + e); }
    },

    processExpressionStatement: function(expressionStatement)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedExpressionStatement(expressionStatement)) { return; }

            expressionStatement.shouldBeIncluded = true;

            this.processElement(expressionStatement.expression);
        }
        catch(e) { this.notifyError("Error when processing from expression statement:" + e); }
    },

    processAssignmentExpression: function(assignmentExpression)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedAssignmentExpression(assignmentExpression)) { return; }

            if(assignmentExpression.shouldBeIncluded)
            {
                assignmentExpression.left.shouldBeIncluded = true;
            }

            assignmentExpression.shouldBeIncluded = true;

            this.processElement(assignmentExpression.left);
            this.processElement(assignmentExpression.right);
        }
        catch(e) { this.notifyError("Error when processing code from assignment expression:" + e); }
    },

    processUnaryExpression: function(unaryExpression)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedUnaryExpression(unaryExpression)) { return; }

            unaryExpression.shouldBeIncluded = true;

            this.processExpression(unaryExpression.argument);
        }
        catch(e) { this.notifyError("Error when processing code from unary expression:" + e); }
    },

    processBinaryExpression: function(binaryExpression)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedBinaryExpression(binaryExpression)) { return; }

            binaryExpression.shouldBeIncluded = true;

            this.processElement(binaryExpression.left);
            this.processElement(binaryExpression.right);
        }
        catch(e) { this.notifyError("Error when processing code from binary expression:" + e); }
    },

    processLogicalExpression: function(logicalExpression)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedLogicalExpression(logicalExpression)) { return; }

            logicalExpression.shouldBeIncluded = true;

            this.processElement(logicalExpression.left);
            this.processElement(logicalExpression.right);
        }
        catch(e) { this.notifyError("Error when processing code from logical expression:" + e); }
    },

    processUpdateExpression: function(updateExpression)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedUpdateExpression(updateExpression)) { return; }

            updateExpression.shouldBeIncluded = true;

            this.processElement(updateExpression.argument);
        }
        catch(e) { this.notifyError("Error when processing from update expression:" + e); }
    },

    processNewExpression: function(newExpression)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedNewExpression(newExpression)) { return; }

            newExpression.shouldBeIncluded = true;
            newExpression.callee.shouldBeIncluded = true;

            this.processElement(newExpression.callee);
            this.processSequence(newExpression.arguments);
        }
        catch(e) { this.notifyError("Error when processing code from new expression:" + e); }
    },

    processConditionalExpression: function(conditionalExpression)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedConditionalExpression(conditionalExpression)) { return; }

            conditionalExpression.shouldBeIncluded = true;

            this.processElement(conditionalExpression.test);
            this.processElement(conditionalExpression.consequent);
            this.processElement(conditionalExpression.alternate);
        }
        catch(e) { this.notifyError("Error when processing code from conditional expression:" + e); }
    },

    processThisExpression: function(thisExpression)
    {
        try
        {

        }
        catch(e) { this.notifyError("Error when processing code from this expression:" + e); }
    },

    processCallExpression: function(callExpression)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedCallExpression(callExpression)) { return; }

            callExpression.shouldBeIncluded = true;

            this.processElement(callExpression.callee);
            this.processSequence(callExpression.arguments);
        }
        catch(e) { this.notifyError("Error when processing code from call expression:" + e); }
    },

    processMemberExpression: function(memberExpression)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedMemberExpression(memberExpression)) { return; }

            if(memberExpression.loc.start.line == 3208)
            {
                var a = 3;
            }

            var areChildrenIncluded = this.inclusionFinder.isIncludedElement(memberExpression.object)
                                   || this.inclusionFinder.isIncludedElement(memberExpression.property)

            if(areChildrenIncluded)
            {
                memberExpression.shouldBeIncluded = true;
            }

            if(!ASTHelper.isMemberExpression(memberExpression.parent)
            && !ASTHelper.isCallExpression(memberExpression.parent)
            && !ASTHelper.isCallExpression(memberExpression.object))
            {
                memberExpression.object.shouldBeIncluded = true;
                memberExpression.property.shouldBeIncluded = true;
            }
            else
            {
                if(ASTHelper.isIdentifier(memberExpression.property)
                && !ASTHelper.isCallExpression(memberExpression.parent)
                && areChildrenIncluded)
                {
                    memberExpression.object.shouldBeIncluded = true;
                    memberExpression.property.shouldBeIncluded = true;
                }
            }

            this.processElement(memberExpression.object);
            this.processElement(memberExpression.property);
        }
        catch(e) { this.notifyError("Error when processing code from member expression:" + e); }
    },

    processSequenceExpression: function(sequenceExpression)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedSequenceExpression(sequenceExpression)) { return; }

            sequenceExpression.shouldBeIncluded = true;

            this.processSequence(sequenceExpression.expressions);
        }
        catch(e) { this.notifyError("Error when processing code from member expression:" + e); }
    },

    processArrayExpression: function(arrayExpression)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedArrayExpression(arrayExpression)) { return; }

            arrayExpression.shouldBeIncluded = true;

            this.processSequence(arrayExpression.elements);
        }
        catch(e) { this.notifyError("Error when processing code from array expression:" + e); }
    },

    processObjectExpression: function(objectExpression)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedObjectExpression(objectExpression)) { return; }

            objectExpression.shouldBeIncluded = true;

            var properties = objectExpression.properties;

            for (var i = 0, length = properties.length; i < length; i++)
            {
                this.processObjectExpressionProperty(properties[i]);
            }
        }
        catch(e) { this.notifyError("Error when processing from object expression:" + e); }
    },

    processObjectExpressionProperty: function(objectExpressionProperty)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedObjectExpressionProperty(objectExpressionProperty)) { return; }

            objectExpressionProperty.shouldBeIncluded = true;
            objectExpressionProperty.key.shouldBeIncluded = true;

            this.processElement(objectExpressionProperty.value);
        }
        catch(e) { this.notifyError("Error when processing in object expression property: " + e);}
    },

    processIfStatement: function(ifStatement)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedIfStatement(ifStatement)) { return; }

            ifStatement.shouldBeIncluded = true;

            this.processElement(ifStatement.test);
            this.processElement(ifStatement.consequent);

            if(ifStatement.alternate != null)
            {
                this.processElement(ifStatement.alternate);
            }
        }
        catch(e) { this.notifyError("Error when processing code from if statement:" + e); }
    },

    processWhileStatement: function(whileStatement)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedWhileStatement(whileStatement)) { return; }

            whileStatement.shouldBeIncluded = true;

            this.processElement(whileStatement.test);
            this.processElement(whileStatement.body);
        }
        catch(e) { this.notifyError("Error when processing code from while statement:" + e); }
    },

    processDoWhileStatement: function(doWhileStatement)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedDoWhileStatement(doWhileStatement)) { return; }

            doWhileStatement.shouldBeIncluded = true;

            this.processElement(doWhileStatement.test);
            this.processElement(doWhileStatement.body);
        }
        catch(e) { this.notifyError("Error when processing code from do while statement:" + e); }
    },

    processForStatement: function(forStatement)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedForStatement(forStatement)) { return; }

            forStatement.shouldBeIncluded = true;

            if(forStatement.init != null) { this.processElement(forStatement.init); }
            if(forStatement.test != null) { this.processElement(forStatement.test); }
            if(forStatement.update != null) {this.processElement(forStatement.update)}

            this.processElement(forStatement.body);
        }
        catch(e) { this.notifyError("Error when processing code from for statement:" + e); }
    },

    processForInStatement: function(forInStatement)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedForInStatement(forInStatement)) { return; }

            forInStatement.shouldBeIncluded = true;

            this.processElement(forInStatement.left);
            this.processElement(forInStatement.right);
            this.processElement(forInStatement.body);

            if(forInStatement.right.shouldBeIncluded) { forInStatement.left.shouldBeIncluded; }
        }
        catch(e) { this.notifyError("Error when processing code from for...in statement:" + e); }
    },

    processBreakStatement: function(breakStatement)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedBreakStatement(breakStatement)) { return; }

            breakStatement.shouldBeIncluded = true;
        }
        catch(e) { this.notifyError("Error when processing code from break statement:" + e); }
    },

    processContinueStatement: function(continueStatement)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedContinueStatement(continueStatement)) { return; }

            continueStatement.shouldBeIncluded = true;
        }
        catch(e) { this.notifyError("Error when processing code from continue statement:" + e); }
    },

    processReturnStatement: function(returnStatement)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedReturnStatement(returnStatement)) { return; }

            returnStatement.shouldBeIncluded = true;

            if(returnStatement.argument != null) { this.processExpression(returnStatement.argument); }
        }
        catch(e) { this.notifyError("Error when processing code from statement:" + e); }
    },

    processWithStatement: function(withStatement)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedWithStatement(withStatement)) { return; }

            withStatement.shouldBeIncluded = true;

            this.processExpression(withStatement.object);
            this.processStatement(withStatement.body);
        }
        catch(e) { this.notifyError("Error when processing code from with statement:" + e); }
    },

    processThrowStatement: function(throwStatement)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedThrowStatement(throwStatement)) { return; }

            throwStatement.shouldBeIncluded = true;

            this.processExpression(throwStatement.argument);
        }
        catch(e) { this.notifyError("Error when processing code from throw statement:" + e); }
    },

    processSwitchStatement: function(switchStatement)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedSwitchStatement(switchStatement)) { return; }

            switchStatement.shouldBeIncluded = true;

            this.processExpression(switchStatement.discriminant);

            for(var i = 0; i < switchStatement.cases.length; i++)
            {
                this.processSwitchCase(switchStatement.cases[i]);
            }
        }
        catch(e) { this.notifyError("Error when processing code from switch statement:" + e); }
    },

    processSwitchCase: function(switchCase)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedSwitchCase(switchCase)) { return; }

            switchCase.shouldBeIncluded = true;

            if(switchCase.test != null)
            {
                switchCase.test.shouldBeIncluded = true;
            }


            for(var i = 0; i < switchCase.consequent.length; i++)
            {
                this.processStatement(switchCase.consequent[i]);
            }
        }
        catch(e) { this.notifyError("Error when processing code from switch case:" + e); }
    },

    processTryStatement: function(tryStatement)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedTryStatement(tryStatement)) { return; }

            tryStatement.shouldBeIncluded = true;

            this.processElement(tryStatement.block);

            // catch clauses
            for(var i = 0; i < tryStatement.handlers.length; i++)
            {
                this.processCatchClause(tryStatement.handlers[i]);
            }

            if(tryStatement.finalizer != null)
            {
                this.processElement(tryStatement.finalizer);
            }
        }
        catch(e) { this.notifyError("Error when processing code from try statement:" + e); }
    },

    processLabeledStatement: function(labeledStatement)
    {
        try
        {
            this.notifyError("Labelled statement!");
        }
        catch(e) { this.notifyError("Error when processing code from labeled statement:" + e); }
    },

    processVariableDeclaration: function(variableDeclaration)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedVariableDeclaration(variableDeclaration)) { return; }

            variableDeclaration.shouldBeIncluded = true;

            var declarators = variableDeclaration.declarations;

            for (var i = 0, length = declarators.length; i < length; i++)
            {
                this.processVariableDeclarator(declarators[i]);
            }
        }
        catch(e) { this.notifyError("Error when processing code from variable declaration:" + e);}
    },

    processVariableDeclarator: function(variableDeclarator)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedVariableDeclarator(variableDeclarator)) { return; }

            variableDeclarator.shouldBeIncluded = true;
            variableDeclarator.id.shouldBeIncluded = true;

            if(variableDeclarator.init != null)
            {
                this.processElement(variableDeclarator.init);
            }
        }
        catch(e) { this.notifyError("Error when processing code from variableDeclarator - CodeMarkupGenerator:" + e);}
    },

    processPattern: function(pattern)
    {
        try
        {
            if(ASTHelper.isIdentifier(pattern)) { this.processIdentifier(pattern);}
        }
        catch(e) { this.notifyError("Error when processing code from pattern:" + e);}
    },

    processCatchClause: function(catchClause)
    {
        try
        {
            if(!this.inclusionFinder.isIncludedCatchClause(catchClause)) { return;}

            catchClause.shouldBeIncluded = true;

            this.processElement(catchClause.param);
            this.processStatement(catchClause.body);
        }
        catch(e) { this.notifyError("Error when processing code from catch clause:" + e);}
    },

    processIdentifier: function(identifier)
    {
        try
        {

        }
        catch(e) { this.notifyError("Error when processing code from an identifier:" + e);}
    },

    processLiteral: function(literal)
    {
        try
        {
            if(literal.shouldBeIncluded == true && Firecrow.ValueTypeHelper.isObject(literal.value))
            {
                literal.value.shouldBeIncluded = true;
            }
        }
        catch(e) { this.notifyError("Error when processing from literal:" + e);}
    },

    processSequence: function(sequence)
    {
        try
        {
            var code = "";

            for(var i = 0, length = sequence.length; i < length; i++)
            {
                this.processElement(sequence[i])
            }
        }
        catch(e) { this.notifyError("Error when processing sequence code:" + e); }
    },

    notifyError:function(message) {  Firecrow.DependencyGraph.DependencyPostprocessor.notifyError(message); }
}
/*************************************************************************************/
}});