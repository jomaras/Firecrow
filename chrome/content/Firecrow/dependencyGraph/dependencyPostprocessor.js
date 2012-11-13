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

        programElement.shouldBeIncluded = true;

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

        functionDecExp.shouldBeIncluded = true;
        functionDecExp.body.shouldBeIncluded = true;

        if(functionDecExp.id != null) { functionDecExp.id.shouldBeIncluded = true; }

        var params = functionDecExp.params;

        if(params != null)
        {
            for(var i = 0, length = params.length; i < length; i++)
            {
                params[i].shouldBeIncluded = true;
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

        blockStatement.shouldBeIncluded = true;

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

        expressionStatement.shouldBeIncluded = true;

        this.processElement(expressionStatement.expression);
    },

    processAssignmentExpression: function(assignmentExpression)
    {
        if(!this.inclusionFinder.isIncludedAssignmentExpression(assignmentExpression)) { return; }

        if(assignmentExpression.shouldBeIncluded)
        {
            assignmentExpression.left.shouldBeIncluded = true;
        }

        assignmentExpression.shouldBeIncluded = true;

        this.processElement(assignmentExpression.left);
        this.processElement(assignmentExpression.right);
    },

    processUnaryExpression: function(unaryExpression)
    {
        if(!this.inclusionFinder.isIncludedUnaryExpression(unaryExpression)) { return; }

        unaryExpression.shouldBeIncluded = true;

        this.processExpression(unaryExpression.argument);
    },

    processBinaryExpression: function(binaryExpression)
    {
        if(!this.inclusionFinder.isIncludedBinaryExpression(binaryExpression)) { return; }

        binaryExpression.shouldBeIncluded = true;

        this.processElement(binaryExpression.left);
        this.processElement(binaryExpression.right);
    },

    processLogicalExpression: function(logicalExpression)
    {
        if(!this.inclusionFinder.isIncludedLogicalExpression(logicalExpression)) { return; }

        logicalExpression.shouldBeIncluded = true;

        this.processElement(logicalExpression.left);
        this.processElement(logicalExpression.right);
    },

    processUpdateExpression: function(updateExpression)
    {
        if(!this.inclusionFinder.isIncludedUpdateExpression(updateExpression)) { return; }

        updateExpression.shouldBeIncluded = true;

        this.processElement(updateExpression.argument);
    },

    processNewExpression: function(newExpression)
    {
        if(!this.inclusionFinder.isIncludedNewExpression(newExpression)) { return; }

        newExpression.shouldBeIncluded = true;
        newExpression.callee.shouldBeIncluded = true;

        this.processElement(newExpression.callee);
        this.processSequence(newExpression.arguments);
    },

    processConditionalExpression: function(conditionalExpression)
    {
        if(!this.inclusionFinder.isIncludedConditionalExpression(conditionalExpression)) { return; }

        conditionalExpression.shouldBeIncluded = true;

        this.processElement(conditionalExpression.test);
        this.processElement(conditionalExpression.consequent);
        this.processElement(conditionalExpression.alternate);
    },

    processThisExpression: function(thisExpression) { },

    processCallExpression: function(callExpression)
    {
        if(!this.inclusionFinder.isIncludedCallExpression(callExpression)) { return; }

        callExpression.shouldBeIncluded = true;

        this.processElement(callExpression.callee);
        this.processSequence(callExpression.arguments);
    },

    processMemberExpression: function(memberExpression)
    {
        if(!this.inclusionFinder.isIncludedMemberExpression(memberExpression)) { return; }

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
    },

    processSequenceExpression: function(sequenceExpression)
    {
        if(!this.inclusionFinder.isIncludedSequenceExpression(sequenceExpression)) { return; }

        sequenceExpression.shouldBeIncluded = true;

        this.processSequence(sequenceExpression.expressions);
    },

    processArrayExpression: function(arrayExpression)
    {
        if(!this.inclusionFinder.isIncludedArrayExpression(arrayExpression)) { return; }

        arrayExpression.shouldBeIncluded = true;

        this.processSequence(arrayExpression.elements);
    },

    processObjectExpression: function(objectExpression)
    {
        if(!this.inclusionFinder.isIncludedObjectExpression(objectExpression)) { return; }

        objectExpression.shouldBeIncluded = true;

        var properties = objectExpression.properties;

        for (var i = 0, length = properties.length; i < length; i++)
        {
            this.processObjectExpressionProperty(properties[i]);
        }
    },

    processObjectExpressionProperty: function(objectExpressionProperty)
    {
        if(!this.inclusionFinder.isIncludedObjectExpressionProperty(objectExpressionProperty)) { return; }

        objectExpressionProperty.shouldBeIncluded = true;
        objectExpressionProperty.key.shouldBeIncluded = true;

        this.processElement(objectExpressionProperty.value);
    },

    processIfStatement: function(ifStatement)
    {
        if(!this.inclusionFinder.isIncludedIfStatement(ifStatement)) { return; }

        ifStatement.shouldBeIncluded = true;

        this.processElement(ifStatement.test);
        this.processElement(ifStatement.consequent);

        if(ifStatement.alternate != null)
        {
            this.processElement(ifStatement.alternate);
        }
    },

    processWhileStatement: function(whileStatement)
    {
        if(!this.inclusionFinder.isIncludedWhileStatement(whileStatement)) { return; }

        whileStatement.shouldBeIncluded = true;

        this.processElement(whileStatement.test);
        this.processElement(whileStatement.body);
    },

    processDoWhileStatement: function(doWhileStatement)
    {
        if(!this.inclusionFinder.isIncludedDoWhileStatement(doWhileStatement)) { return; }

        doWhileStatement.shouldBeIncluded = true;

        this.processElement(doWhileStatement.test);
        this.processElement(doWhileStatement.body);
    },

    processForStatement: function(forStatement)
    {
        if(!this.inclusionFinder.isIncludedForStatement(forStatement)) { return; }

        forStatement.shouldBeIncluded = true;

        if(forStatement.init != null) { this.processElement(forStatement.init); }
        if(forStatement.test != null) { this.processElement(forStatement.test); }
        if(forStatement.update != null) {this.processElement(forStatement.update)}

        this.processElement(forStatement.body);
    },

    processForInStatement: function(forInStatement)
    {
        if(!this.inclusionFinder.isIncludedForInStatement(forInStatement)) { return; }

        forInStatement.shouldBeIncluded = true;

        this.processElement(forInStatement.left);
        this.processElement(forInStatement.right);
        this.processElement(forInStatement.body);

        if(forInStatement.right.shouldBeIncluded) { forInStatement.left.shouldBeIncluded; }
    },

    processBreakStatement: function(breakStatement)
    {
        if(!this.inclusionFinder.isIncludedBreakStatement(breakStatement)) { return; }

        breakStatement.shouldBeIncluded = true;
    },

    processContinueStatement: function(continueStatement)
    {
        if(!this.inclusionFinder.isIncludedContinueStatement(continueStatement)) { return; }

        continueStatement.shouldBeIncluded = true;
    },

    processReturnStatement: function(returnStatement)
    {
        if(!this.inclusionFinder.isIncludedReturnStatement(returnStatement)) { return; }

        returnStatement.shouldBeIncluded = true;

        if(returnStatement.argument != null) { this.processExpression(returnStatement.argument); }
    },

    processWithStatement: function(withStatement)
    {
        if(!this.inclusionFinder.isIncludedWithStatement(withStatement)) { return; }

        withStatement.shouldBeIncluded = true;

        this.processExpression(withStatement.object);
        this.processStatement(withStatement.body);
    },

    processThrowStatement: function(throwStatement)
    {
        if(!this.inclusionFinder.isIncludedThrowStatement(throwStatement)) { return; }

        throwStatement.shouldBeIncluded = true;

        this.processExpression(throwStatement.argument);
    },

    processSwitchStatement: function(switchStatement)
    {
        if(!this.inclusionFinder.isIncludedSwitchStatement(switchStatement)) { return; }

        switchStatement.shouldBeIncluded = true;

        this.processExpression(switchStatement.discriminant);

        for(var i = 0; i < switchStatement.cases.length; i++)
        {
            this.processSwitchCase(switchStatement.cases[i]);
        }
    },

    processSwitchCase: function(switchCase)
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
    },

    processTryStatement: function(tryStatement)
    {
        if(!this.inclusionFinder.isIncludedTryStatement(tryStatement)) { return; }

        tryStatement.shouldBeIncluded = true;

        this.processElement(tryStatement.block);

        for(var i = 0; i < tryStatement.handlers.length; i++)
        {
            tryStatement.handlers[i].shouldBeIncluded = true;
            this.processCatchClause(tryStatement.handlers[i]);
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

        variableDeclaration.shouldBeIncluded = true;

        var declarators = variableDeclaration.declarations;

        for (var i = 0, length = declarators.length; i < length; i++)
        {
            this.processVariableDeclarator(declarators[i]);
        }
    },

    processVariableDeclarator: function(variableDeclarator)
    {
        if(!this.inclusionFinder.isIncludedVariableDeclarator(variableDeclarator)) { return; }

        variableDeclarator.shouldBeIncluded = true;
        variableDeclarator.id.shouldBeIncluded = true;

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

        catchClause.shouldBeIncluded = true;

        this.processElement(catchClause.param);
        this.processStatement(catchClause.body);
    },

    processIdentifier: function(identifier) { },

    processLiteral: function(literal)
    {
        if(literal.shouldBeIncluded == true && Firecrow.ValueTypeHelper.isObject(literal.value))
        {
            literal.value.shouldBeIncluded = true;
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