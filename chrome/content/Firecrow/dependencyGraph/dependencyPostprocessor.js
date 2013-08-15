FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ASTHelper = Firecrow.ASTHelper;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var InclusionFinder = Firecrow.DependencyGraph.InclusionFinder;

Firecrow.DependencyGraph.DependencyPostprocessor = function()
{
    this.inclusionFinder = new InclusionFinder();
};

Firecrow.DependencyGraph.DependencyPostprocessor.notifyError = function(message) { alert("DependencyPostprocessor - " + message); }
Firecrow.DependencyGraph.DependencyPostprocessor.processHtmlElement = function(model)
{
    try { (new Firecrow.DependencyGraph.DependencyPostprocessor()).processHtmlElement(model); }
    catch(e) { Firecrow.DependencyGraph.DependencyPostprocessor.notifyError("Error when processing HTML element " + e); }
};

Firecrow.DependencyGraph.DependencyPostprocessor.prototype =
{
    processHtmlElement: function(htmlElement)
    {
        if(!this.inclusionFinder.isIncludedHtmlElement(htmlElement)) { return; }

        var previousValue = htmlElement.shouldBeIncluded;

        Firecrow.includeNode(htmlElement);

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
    },

    processProgram: function(programElement)
    {
        if(!this.inclusionFinder.isIncludedProgram(programElement)) { return; }

        Firecrow.includeNode(programElement);

        if(programElement.body != null)
        {
            var body = programElement.body;

            for(var i = 0, length = body.length; i < length; i++)
            {
                this.processElement(body[i]);
            }
        }
    },

    processStatement: function(statement)
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
        else { this.notifyError("Error: AST Statement element not defined: " + statement.type); }
    },

    processExpression: function(expression)
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
    },

    processFunction: function(functionDecExp)
    {
        if(!this.inclusionFinder.isIncludedFunction(functionDecExp)) { return; }

        Firecrow.includeNode(functionDecExp);
        Firecrow.includeNode(functionDecExp.body);

        if(functionDecExp.id != null) { Firecrow.includeNode(functionDecExp.id);}

        var params = functionDecExp.params;

        if(params != null)
        {
            for(var i = 0, length = params.length; i < length; i++)
            {
                Firecrow.includeNode(params[i]);
            }
        }


        this.processFunctionBody(functionDecExp);
    },

    processFunctionBody: function(functionDeclExp)
    {
        this.processElement(functionDeclExp.body);
    },

    processBlockStatement: function(blockStatement)
    {
        if(!this.inclusionFinder.isIncludedBlockStatement(blockStatement)) { return; }

        Firecrow.includeNode(blockStatement);

        var body = blockStatement.body;

        for(var i = 0, length = body.length; i < length; i++)
        {
            this.processElement(body[i]);
        }
    },

    processEmptyStatement: function(emptyStatement)
    {
    },

    processExpressionStatement: function(expressionStatement)
    {
        if(!this.inclusionFinder.isIncludedExpressionStatement(expressionStatement)) { return; }

        Firecrow.includeNode(expressionStatement);

        this.processElement(expressionStatement.expression);
    },

    processAssignmentExpression: function(assignmentExpression)
    {
        if(!this.inclusionFinder.isIncludedAssignmentExpression(assignmentExpression)) { return; }

        if(assignmentExpression.shouldBeIncluded)
        {
            Firecrow.includeNode(assignmentExpression.left);
        }

        Firecrow.includeNode(assignmentExpression);

        this.processElement(assignmentExpression.left);
        this.processElement(assignmentExpression.right);
    },

    processUnaryExpression: function(unaryExpression)
    {
        if(!this.inclusionFinder.isIncludedUnaryExpression(unaryExpression)) { return; }

        Firecrow.includeNode(unaryExpression);

        this.processExpression(unaryExpression.argument);
    },

    processBinaryExpression: function(binaryExpression)
    {
        if(!this.inclusionFinder.isIncludedBinaryExpression(binaryExpression)) { return; }

        Firecrow.includeNode(binaryExpression);

        this.processElement(binaryExpression.left);
        this.processElement(binaryExpression.right);
    },

    processLogicalExpression: function(logicalExpression)
    {
        if(!this.inclusionFinder.isIncludedLogicalExpression(logicalExpression)) { return; }

        Firecrow.includeNode(logicalExpression);

        this.processElement(logicalExpression.left);
        this.processElement(logicalExpression.right);
    },

    processUpdateExpression: function(updateExpression)
    {
        if(!this.inclusionFinder.isIncludedUpdateExpression(updateExpression)) { return; }

        Firecrow.includeNode(updateExpression);

        this.processElement(updateExpression.argument);
    },

    processNewExpression: function(newExpression)
    {
        if(!this.inclusionFinder.isIncludedNewExpression(newExpression)) { return; }

        Firecrow.includeNode(newExpression);
        Firecrow.includeNode(newExpression.callee);

        this.processElement(newExpression.callee);
        this.processSequence(newExpression.arguments);
    },

    processConditionalExpression: function(conditionalExpression)
    {
        if(!this.inclusionFinder.isIncludedConditionalExpression(conditionalExpression)) { return; }

        Firecrow.includeNode(conditionalExpression);

        this.processElement(conditionalExpression.test);
        this.processElement(conditionalExpression.consequent);
        this.processElement(conditionalExpression.alternate);
    },

    processThisExpression: function(thisExpression) { },

    processCallExpression: function(callExpression)
    {
        if(!this.inclusionFinder.isIncludedCallExpression(callExpression)) { return; }

        Firecrow.includeNode(callExpression);

        /*if(ASTHelper.isMemberExpression(callExpression.callee))
        {
            if(ASTHelper.isIdentifier(callExpression.callee.property))
            {
                Firecrow.includeNode(callExpression.callee.property);
            }

            if(ASTHelper.isIdentifier(callExpression.callee.object))
            {
                Firecrow.includeNode(callExpression.callee.object);
            }
        }*/

        this.processElement(callExpression.callee);
        this.processSequence(callExpression.arguments);
    },

    processMemberExpression: function(memberExpression)
    {
        if(!this.inclusionFinder.isIncludedMemberExpression(memberExpression)) { return; }

        var isObjectIncluded = this.inclusionFinder.isIncludedElement(memberExpression.object);
        var isPropertyIncluded = this.inclusionFinder.isIncludedElement(memberExpression.property);

        var areChildrenIncluded = isObjectIncluded || isPropertyIncluded;

        if(areChildrenIncluded)
        {
            Firecrow.includeNode(memberExpression);
        }

        if(!ASTHelper.isMemberExpression(memberExpression.parent)
        && !ASTHelper.isCallExpression(memberExpression.parent)
        && !ASTHelper.isCallExpression(memberExpression.object))
        {
            Firecrow.includeNode(memberExpression.object);
            Firecrow.includeNode(memberExpression.property);
        }
        /*else
        {
            if(ASTHelper.isIdentifier(memberExpression.property)
            && !ASTHelper.isCallExpression(memberExpression.parent)
            && areChildrenIncluded)
            {
                Firecrow.includeNode(memberExpression.object);
                Firecrow.includeNode(memberExpression.property);
            }
        } */

        this.processElement(memberExpression.object);
        this.processElement(memberExpression.property);
    },

    processSequenceExpression: function(sequenceExpression)
    {
        if(!this.inclusionFinder.isIncludedSequenceExpression(sequenceExpression)) { return; }

        Firecrow.includeNode(sequenceExpression);

        this.processSequence(sequenceExpression.expressions);
    },

    processArrayExpression: function(arrayExpression)
    {
        if(!this.inclusionFinder.isIncludedArrayExpression(arrayExpression)) { return; }

        Firecrow.includeNode(arrayExpression);

        this.processSequence(arrayExpression.elements);
    },

    processObjectExpression: function(objectExpression)
    {
        if(!this.inclusionFinder.isIncludedObjectExpression(objectExpression)) { return; }

        Firecrow.includeNode(objectExpression);

        var properties = objectExpression.properties;

        for (var i = 0, length = properties.length; i < length; i++)
        {
            this.processObjectExpressionProperty(properties[i]);
        }
    },

    processObjectExpressionProperty: function(objectExpressionProperty)
    {
        if(!this.inclusionFinder.isIncludedObjectExpressionProperty(objectExpressionProperty)) { return; }

        Firecrow.includeNode(objectExpressionProperty);
        Firecrow.includeNode(objectExpressionProperty.key);

        this.processElement(objectExpressionProperty.value);
    },

    processIfStatement: function(ifStatement)
    {
        if(!this.inclusionFinder.isIncludedIfStatement(ifStatement)) { return; }

        Firecrow.includeNode(ifStatement);

        this.processElement(ifStatement.test);

        //TODO - not sure about this: the problem is the if statement gets included, but it does not include the
        //return statement in it's body - and i'm not sure whether it even should
        if(ifStatement.test.shouldBeIncluded)
        {
            var returnStatement = ASTHelper.getDirectlyContainedReturnStatement(ifStatement.consequent);

            if(returnStatement != null && returnStatement.hasBeenExecuted)
            {
                Firecrow.includeNode(returnStatement);
            }
        }

        this.processElement(ifStatement.consequent);

        if(ifStatement.alternate != null)
        {
            this.processElement(ifStatement.alternate);
        }
    },

    processWhileStatement: function(whileStatement)
    {
        if(!this.inclusionFinder.isIncludedWhileStatement(whileStatement)) { return; }

        Firecrow.includeNode(whileStatement);

        this.processElement(whileStatement.test);
        this.processElement(whileStatement.body);
    },

    processDoWhileStatement: function(doWhileStatement)
    {
        if(!this.inclusionFinder.isIncludedDoWhileStatement(doWhileStatement)) { return; }

        Firecrow.includeNode(doWhileStatement);

        this.processElement(doWhileStatement.test);
        this.processElement(doWhileStatement.body);
    },

    processForStatement: function(forStatement)
    {
        if(!this.inclusionFinder.isIncludedForStatement(forStatement)) { return; }

        Firecrow.includeNode(forStatement);

        if(forStatement.init != null) { this.processElement(forStatement.init); }
        if(forStatement.test != null) { this.processElement(forStatement.test); }
        if(forStatement.update != null) {this.processElement(forStatement.update)}

        this.processElement(forStatement.body);
    },

    processForInStatement: function(forInStatement)
    {
        if(!this.inclusionFinder.isIncludedForInStatement(forInStatement)) { return; }

        Firecrow.includeNode(forInStatement);

        this.processElement(forInStatement.left);
        this.processElement(forInStatement.right);
        this.processElement(forInStatement.body);

        if(forInStatement.right.shouldBeIncluded) { forInStatement.left.shouldBeIncluded; }
    },

    processBreakStatement: function(breakStatement)
    {
        if(!this.inclusionFinder.isIncludedBreakStatement(breakStatement)) { return; }

        Firecrow.includeNode(breakStatement);
    },

    processContinueStatement: function(continueStatement)
    {
        if(!this.inclusionFinder.isIncludedContinueStatement(continueStatement)) { return; }

        Firecrow.includeNode(continueStatement);
    },

    processReturnStatement: function(returnStatement)
    {
        if(!this.inclusionFinder.isIncludedReturnStatement(returnStatement)) { return; }

        Firecrow.includeNode(returnStatement);

        if(returnStatement.argument != null) { this.processExpression(returnStatement.argument); }
    },

    processWithStatement: function(withStatement)
    {
        if(!this.inclusionFinder.isIncludedWithStatement(withStatement)) { return; }

        Firecrow.includeNode(withStatement);

        this.processExpression(withStatement.object);
        this.processStatement(withStatement.body);
    },

    processThrowStatement: function(throwStatement)
    {
        if(!this.inclusionFinder.isIncludedThrowStatement(throwStatement)) { return; }

        Firecrow.includeNode(throwStatement);

        this.processExpression(throwStatement.argument);
    },

    processSwitchStatement: function(switchStatement)
    {
        if(!this.inclusionFinder.isIncludedSwitchStatement(switchStatement)) { return; }

        Firecrow.includeNode(switchStatement);

        this.processExpression(switchStatement.discriminant);

        for(var i = 0; i < switchStatement.cases.length; i++)
        {
            this.processSwitchCase(switchStatement.cases[i]);
        }
    },

    processSwitchCase: function(switchCase)
    {
        if(!this.inclusionFinder.isIncludedSwitchCase(switchCase)) { return; }

        Firecrow.includeNode(switchCase);

        if(switchCase.test != null)
        {
            Firecrow.includeNode(switchCase.test);
        }


        for(var i = 0; i < switchCase.consequent.length; i++)
        {
            this.processStatement(switchCase.consequent[i]);
        }
    },

    processTryStatement: function(tryStatement)
    {
        if(!this.inclusionFinder.isIncludedTryStatement(tryStatement)) { return; }

        Firecrow.includeNode(tryStatement);

        this.processElement(tryStatement.block);

        var handlers = tryStatement.handlers || (ValueTypeHelper.isArray(tryStatement.handler) ? tryStatement.handler : [tryStatement.handler]);

        for(var i = 0; i < handlers.length; i++)
        {
            Firecrow.includeNode(handlers[i]);
            this.processCatchClause(handlers[i]);
        }

        if(tryStatement.finalizer != null)
        {
            this.processElement(tryStatement.finalizer);
        }
    },

    processLabeledStatement: function(labeledStatement) { },

    processVariableDeclaration: function(variableDeclaration)
    {
        if(!this.inclusionFinder.isIncludedVariableDeclaration(variableDeclaration)) { return; }

        Firecrow.includeNode(variableDeclaration);

        var declarators = variableDeclaration.declarations;

        for (var i = 0, length = declarators.length; i < length; i++)
        {
            this.processVariableDeclarator(declarators[i]);
        }
    },

    processVariableDeclarator: function(variableDeclarator)
    {
        if(!this.inclusionFinder.isIncludedVariableDeclarator(variableDeclarator)) { return; }

        Firecrow.includeNode(variableDeclarator);
        Firecrow.includeNode(variableDeclarator.id);

        if(variableDeclarator.init != null)
        {
            this.processElement(variableDeclarator.init);
        }
    },

    processPattern: function(pattern)
    {
        if(ASTHelper.isIdentifier(pattern)) { this.processIdentifier(pattern);}
    },

    processCatchClause: function(catchClause)
    {
        if(!this.inclusionFinder.isIncludedCatchClause(catchClause)) { return;}

        Firecrow.includeNode(catchClause);

        this.processElement(catchClause.param);
        this.processStatement(catchClause.body);
    },

    processIdentifier: function(identifier) { },

    processLiteral: function(literal)
    {
        if(literal.shouldBeIncluded == true && Firecrow.ValueTypeHelper.isObject(literal.value))
        {
            Firecrow.includeNode(literal.value);
        }
    },

    processSequence: function(sequence)
    {
        var code = "";

        for(var i = 0, length = sequence.length; i < length; i++)
        {
            this.processElement(sequence[i])
        }
    },

    notifyError:function(message) {  Firecrow.DependencyGraph.DependencyPostprocessor.notifyError(message); }
}
/*************************************************************************************/
}});