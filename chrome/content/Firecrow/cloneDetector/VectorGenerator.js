/**
 * User: Jomaras
 * Date: 22.07.12.
 * Time: 19:32
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;
var fcCloneDetector = Firecrow.CloneDetector;
var fcCharacteristicVector = Firecrow.CloneDetector.CharacteristicVector;

fcCloneDetector.VectorGenerator =
{
    generateFromPageModel: function(pageModel)
    {
        var htmlElement = pageModel.htmlElement;

        this.generateForHtmlNode(htmlElement);
    },

    generateForHtmlNode: function(htmlElement)
    {
        htmlElement.characteristicVector = new fcCharacteristicVector();
        if(htmlElement.type == "textNode") { return; }

        htmlElement.characteristicVector[htmlElement.type] = 1;

        if(htmlElement.type == "script")
        {
            this.generateForJsNode(htmlElement.pathAndModel.model);
        }
        else if (htmlElement.type == "style" || htmlElement.type == "link")
        {
            this.generateForCssNodes(htmlElement.pathAndModel.model);
        }

        var childNodes = htmlElement.childNodes;
        for(var i = 0, length = childNodes.length; i < length; i++)
        {
            var childNode = childNodes[i];

            if(childNode.type != "textNode")
            {
                this.generateForHtmlNode(childNode);

                fcCharacteristicVector.join(htmlElement.characteristicVector, childNode.characteristicVector);
            }
        }
    },

    generateForCssNodes: function(model)
    {

    },

    generateForJsNode: function(astElement)
    {
        try
        {
            if(ASTHelper.isProgram(astElement)) { this.generateVectorForProgram(astElement);}
            else if (ASTHelper.isFunction(astElement)) { this.generateVectorForFunction(astElement); }
            else if (ASTHelper.isBlockStatement(astElement)) { this.generateVectorForBlockStatement(astElement); }
            else if (ASTHelper.isVariableDeclaration(astElement)) { this.generateVectorForVariableDeclaration(astElement); }
            else if (ASTHelper.isVariableDeclarator(astElement)) { this.generateVectorForVariableDeclarator(astElement); }

            //********************************************************LOOPS******************************************************
            else if (ASTHelper.isForStatement(astElement)) { this.generateVectorForForStatement(astElement); }
            else if (ASTHelper.isForInStatement(astElement)) { this.generateVectorForForInStatement(astElement); }

            else if (ASTHelper.isWhileStatement(astElement)) { this.generateVectorForWhileStatement(astElement); }
            else if (ASTHelper.isDoWhileStatement(astElement)) { this.generateVectorForDoWhileStatement(astElement); }
            //*********************************************************************************************************************

            else if (ASTHelper.isObjectExpression(astElement)) { this.generateVectorForObjectExpression(astElement); }
            else if (ASTHelper.isMemberExpression(astElement)) { this.generateVectorForMemberExpression(astElement); }
            else if (ASTHelper.isWithStatement(astElement)) { this.generateVectorForWithStatement(astElement); }


            else if (ASTHelper.isThisExpression(astElement)) { this.generateVectorForThisExpression(astElement); }
            else if (ASTHelper.isArrayExpression(astElement)) { this.generateVectorForArrayExpression(astElement); }


            else if (ASTHelper.isDebuggerStatement(astElement)) { }

            else if (ASTHelper.isNewExpression(astElement)) { this.generateVectorForNewExpression(astElement); }

            else if (ASTHelper.isSequenceExpression(astElement)) { this.generateVectorForSequenceExpression(astElement); }

            else if (ASTHelper.isBreakStatement(astElement)) { this.generateVectorForBreakStatement(astElement); }
            else if (ASTHelper.isContinueStatement(astElement)) { this.generateVectorForContinueStatement(astElement); }

            else if (ASTHelper.isIfStatement(astElement)) { this.generateVectorForIfStatement(astElement); }
            else if (ASTHelper.isSwitchStatement(astElement)) { this.generateVectorForSwitchStatement(astElement); }
            else if (ASTHelper.isSwitchCase(astElement)) { this.generateVectorForSwitchCase(astElement); }
            else if (ASTHelper.isConditionalExpression(astElement)) { this.generateVectorForConditionalExpression(astElement); }

            else if(ASTHelper.isReturnStatement(astElement)) { this.generateVectorForReturnStatement(astElement); }

            else if(ASTHelper.isThrowStatement(astElement)) { this.generateVectorForThrowStatement(astElement); }

            else if (ASTHelper.isTryStatement(astElement)) { this.generateVectorForTryStatement(astElement); }
            else if (ASTHelper.isCatchClause(astElement)) { this.generateVectorForCatchClause(astElement); }

            else if (ASTHelper.isExpressionStatement(astElement)) { this.generateVectorForExpressionStatement(astElement); }
            else if (ASTHelper.isLabeledStatement(astElement)) { this.generateVectorForLabeledStatement(astElement); }

            else if (ASTHelper.isAssignmentExpression(astElement)) { this.generateVectorForAssignmentExpression(astElement); }

            else if (ASTHelper.isCallExpression(astElement)) { this.generateVectorForCallExpression(astElement); }


            else if (ASTHelper.isUpdateExpression(astElement)) { this.generateVectorForUpdateExpression(astElement); }
            else if (ASTHelper.isLogicalExpression(astElement)) { this.generateVectorForLogicalExpression(astElement); }
            else if (ASTHelper.isUnaryExpression(astElement)) { this.generateVectorForUnaryExpression(astElement); }
            else if (ASTHelper.isBinaryExpression(astElement)) { this.generateVectorForBinaryExpression(astElement); }
            else if (ASTHelper.isIdentifier(astElement)) { this.generateVectorForIdentifier(astElement); }
            else if (ASTHelper.isLiteral(astElement)) { this.generateVectorForLiteral(astElement); }

            else if (ASTHelper.isYieldExpression(astElement)) { this.generateVectorForYieldExpression(astElement); }
            else if (ASTHelper.isComprehensionExpression(astElement)) { this.generateVectorForComprehensionExpression(astElement); }
            else if (ASTHelper.isGeneratorExpression(astElement)) { this.generateVectorForGeneratorExpression(astElement); }

            else if (ASTHelper.isLetExpression(astElement)) { this.generateVectorForLetExpression(astElement); }

            else { alert("Unhandled element when generating vector: " + astElement.type); }
        }
        catch(e) { alert("Error when generating vector: " + e); }
    },

    generateVectorForLetExpression: function (letExpression)
    {
        letExpression.characteristicVector = new fcCharacteristicVector();

        letExpression.head.forEach(function(head)
        {
            this.generateForJsNode(head.id);

            fcCharacteristicVector.join(letExpression.characteristicVector, head.id.characteristicVector);

            if(head.init != null)
            {
                this.generateForJsNode(head.init);
                fcCharacteristicVector.join(letExpression.characteristicVector, head.init.characteristicVector);
            }

            this.generateForJsNode(head.body);
            fcCharacteristicVector.join(letExpression.characteristicVector, head.body.characteristicVector);
        }, this);
    },


    generateVectorForBlockStatement: function(blockStatement)
    {
        blockStatement.characteristicVector = new fcCharacteristicVector();

        var body = blockStatement.body;

        for(var i = 0, length = body.length; i < length; i++)
        {
            var statement = body[i];

            this.generateForJsNode(statement);

            fcCharacteristicVector.join(blockStatement.characteristicVector, statement.characteristicVector);
        }
    },

    generateVectorForLabeledStatement: function(labeledStatement)
    {
        labeledStatement.characteristicVector = new fcCharacteristicVector();
        labeledStatement.characteristicVector[labeledStatement.type] = 1;

        this.generateForJsNode(labeledStatement.label);
        this.generateForJsNode(labeledStatement.body);

        fcCharacteristicVector.join(labeledStatement.characteristicVector, labeledStatement.label.characteristicVector);
        fcCharacteristicVector.join(labeledStatement.characteristicVector, labeledStatement.body.characteristicVector);
    },

    generateVectorForCallExpression: function(callExpression)
    {
        callExpression.characteristicVector = new fcCharacteristicVector();
        callExpression.characteristicVector[callExpression.type] = 1;

        var arguments = callExpression.arguments || [];

        for(var i = 0, length = arguments.length; i < length; i++)
        {
            var argument = arguments[i];

            this.generateForJsNode(argument);

            fcCharacteristicVector.join(callExpression.characteristicVector, argument.characteristicVector);
        }

        this.generateForJsNode(callExpression.callee);

        fcCharacteristicVector.join(callExpression.characteristicVector, callExpression.callee.characteristicVector);
    },

    generateVectorForObjectExpression: function(objectExpression)
    {
        objectExpression.characteristicVector = new fcCharacteristicVector();
        objectExpression.characteristicVector[objectExpression.type] = 1;

        var properties = objectExpression.properties;

        for(var i = 0, length = properties.length; i < length; i++)
        {
            var property = properties[i];

            property.characteristicVector = new fcCharacteristicVector();

            this.generateForJsNode(property.key);
            fcCharacteristicVector.join(property.characteristicVector, property.key.characteristicVector);
            fcCharacteristicVector.join(objectExpression.characteristicVector, property.key.characteristicVector);

            this.generateForJsNode(property.value);
            fcCharacteristicVector.join(property.characteristicVector, property.value.characteristicVector);
            fcCharacteristicVector.join(objectExpression.characteristicVector, property.value.characteristicVector);
        }
    },

    generateVectorForMemberExpression: function(memberExpression)
    {
        memberExpression.characteristicVector = new fcCharacteristicVector();
        memberExpression.characteristicVector[memberExpression.type] = 1;

        this.generateForJsNode(memberExpression.object);
        fcCharacteristicVector.join(memberExpression.characteristicVector, memberExpression.object.characteristicVector);

        this.generateForJsNode(memberExpression.property);
        fcCharacteristicVector.join(memberExpression.characteristicVector, memberExpression.property.characteristicVector);
    },

    generateVectorForWithStatement: function (withStatement)
    {
        withStatement.characteristicVector = new fcCharacteristicVector();
        withStatement.characteristicVector[withStatement.type] = 1;

        this.generateForJsNode(withStatement.object);
        fcCharacteristicVector.join(withStatement.characteristicVector, withStatement.object.characteristicVector);

        this.generateForJsNode(withStatement.body);
        fcCharacteristicVector.join(withStatement.characteristicVector, withStatement.body.characteristicVector);
    },

    generateVectorForThisExpression: function (thisExpression)
    {
        thisExpression.characteristicVector = new fcCharacteristicVector();
        thisExpression.characteristicVector[thisExpression.type] = 1;
    },

    generateVectorForArrayExpression: function (arrayExpression)
    {
        arrayExpression.characteristicVector = new fcCharacteristicVector();
        arrayExpression.characteristicVector[arrayExpression.type] = 1;

        var items = arrayExpression.elements;

        for(var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i];

            this.generateForJsNode(item);

            fcCharacteristicVector.join(arrayExpression.characteristicVector, item.characteristicVector);
        }
    },

    generateVectorForNewExpression: function (newExpression)
    {
        newExpression.characteristicVector = new fcCharacteristicVector();
        newExpression.characteristicVector[newExpression.type] = 1;

        this.generateForJsNode(newExpression.callee);
        fcCharacteristicVector.join(newExpression.characteristicVector, newExpression.callee.characteristicVector);

        var arguments = newExpression.arguments || [];

        for(var i = 0; i < arguments.length; i++)
        {
            var argument = arguments[i];

            this.generateForJsNode(argument);

            fcCharacteristicVector.join(newExpression.characteristicVector, argument.characteristicVector);
        }
    },

    generateVectorForSwitchStatement: function (switchStatement)
    {
        switchStatement.characteristicVector = new fcCharacteristicVector();
        switchStatement.characteristicVector[switchStatement.type] = 1;

        this.generateForJsNode(switchStatement.discriminant);
        fcCharacteristicVector.join(switchStatement.characteristicVector, switchStatement.discriminant.characteristicVector);

        var cases = switchStatement.cases;

        for(var i = 0; i < cases.length; i++)
        {
            var caseClause = cases[i];

            this.generateForJsNode(caseClause);

            fcCharacteristicVector.join(switchStatement.characteristicVector, caseClause.characteristicVector);
        }
    },

    generateVectorForSwitchCase: function (switchCase)
    {
        switchCase.characteristicVector = new fcCharacteristicVector();
        switchCase.characteristicVector[switchCase.type] = 1;

        if(switchCase.test != null)
        {
            this.generateForJsNode(switchCase.test);
            fcCharacteristicVector.join(switchCase.characteristicVector, switchCase.test.characteristicVector);
        }

        switchCase.consequent.forEach(function(consequent)
        {
            this.generateForJsNode(consequent);
            fcCharacteristicVector.join(switchCase.characteristicVector, consequent.characteristicVector);
        }, this);
    },

    generateVectorForConditionalExpression: function (conditionalExpression)
    {
        conditionalExpression.characteristicVector = new fcCharacteristicVector();
        conditionalExpression.characteristicVector[conditionalExpression.type] = 1;

        this.generateForJsNode(conditionalExpression.test);
        fcCharacteristicVector.join(conditionalExpression.characteristicVector, conditionalExpression.test.characteristicVector);

        this.generateForJsNode(conditionalExpression.alternate);
        fcCharacteristicVector.join(conditionalExpression.characteristicVector, conditionalExpression.alternate.characteristicVector);

        this.generateForJsNode(conditionalExpression.consequent);
        fcCharacteristicVector.join(conditionalExpression.characteristicVector, conditionalExpression.consequent.characteristicVector);
    },

    generateVectorForReturnStatement: function (returnStatement)
    {
        returnStatement.characteristicVector = new fcCharacteristicVector();
        returnStatement.characteristicVector[returnStatement.type] = 1;

        if( returnStatement.argument != null)
        {
            this.generateForJsNode(returnStatement.argument);
            fcCharacteristicVector.join(returnStatement.characteristicVector, returnStatement.argument.characteristicVector);
        }
    },

    generateVectorForThrowStatement: function (throwStatement)
    {
        throwStatement.characteristicVector = new fcCharacteristicVector();
        throwStatement.characteristicVector[throwStatement.type] = 1;

        if( throwStatement.argument != null)
        {
            this.generateForJsNode(throwStatement.argument);
            fcCharacteristicVector.join(throwStatement.characteristicVector, throwStatement.argument.characteristicVector);
        }
    },

    generateVectorForExpressionStatement: function(expressionStatement)
    {
        expressionStatement.characteristicVector = new fcCharacteristicVector();

        this.generateForJsNode(expressionStatement.expression);

        fcCharacteristicVector.join(expressionStatement.characteristicVector, expressionStatement.expression.characteristicVector);
    },

    generateVectorForAssignmentExpression: function(assignmentExpression)
    {
        assignmentExpression.characteristicVector = new fcCharacteristicVector();
        assignmentExpression.characteristicVector[assignmentExpression.type] = 1;

        this.generateForJsNode(assignmentExpression.left);
        this.generateForJsNode(assignmentExpression.right);

        fcCharacteristicVector.join(assignmentExpression.characteristicVector, assignmentExpression.left.characteristicVector);
        fcCharacteristicVector.join(assignmentExpression.characteristicVector, assignmentExpression.right.characteristicVector);
    },

    generateVectorForUnaryExpression: function(unaryExpression)
    {
        unaryExpression.characteristicVector = new fcCharacteristicVector();

        if(ASTHelper.isUnaryMathOperator(unaryExpression.operator))
        {
            unaryExpression.characteristicVector["UnaryMathExpression"] = 1;
        }
        else if (ASTHelper.isUnaryLogicalOperator(unaryExpression.operator))
        {
            unaryExpression.characteristicVector["UnaryLogicalExpression"] = 1;;
        }
        else if (ASTHelper.isUnaryBitOperator(unaryExpression.operator))
        {
            unaryExpression.characteristicVector["UnaryBitExpression"] = 1;
        }
        else if (ASTHelper.isUnaryObjectOperator(unaryExpression.operator))
        {
            unaryExpression.characteristicVector["UnaryObjectExpression"] = 1;
        }

        this.generateForJsNode(unaryExpression.argument);
        fcCharacteristicVector.join(unaryExpression.characteristicVector, unaryExpression.argument.characteristicVector);
    },

    generateVectorForBinaryExpression: function(binaryExpression)
    {
        binaryExpression.characteristicVector = new fcCharacteristicVector();

        if(ASTHelper.isBinaryEqualityOperator(binaryExpression.operator))
        {
            binaryExpression.characteristicVector["BinaryEqualityExpression"] = 1;
        }
        else if (ASTHelper.isBinaryMathOperator(binaryExpression.operator))
        {
            binaryExpression.characteristicVector["BinaryMathExpression"] = 1;
        }
        else if (ASTHelper.isBinaryRelationalOperator(binaryExpression.operator))
        {
            binaryExpression.characteristicVector["BinaryRelationalExpression"] = 1;
        }
        else if (ASTHelper.isBinaryBitOperator(binaryExpression.operator))
        {
            binaryExpression.characteristicVector["BinaryBitExpression"] = 1;
        }
        else if (ASTHelper.isBinaryObjectOperator(binaryExpression.operator))
        {
            binaryExpression.characteristicVector["BinaryObjectExpression"] = 1;
        }
        else if (ASTHelper.isBinaryXmlOperator(binaryExpression.operator))
        {
            binaryExpression.characteristicVector["BinaryXmlExpression"] = 1;
        }

        this.generateForJsNode(binaryExpression.left);
        this.generateForJsNode(binaryExpression.right);

        fcCharacteristicVector.join(binaryExpression.characteristicVector, binaryExpression.left.characteristicVector);
        fcCharacteristicVector.join(binaryExpression.characteristicVector, binaryExpression.right.characteristicVector);
    },

    generateVectorForFunction: function(functionElement)
    {
        functionElement.characteristicVector = new fcCharacteristicVector();

        functionElement.characteristicVector[functionElement.type] = 1;

        if(functionElement.id != null)
        {
            this.generateForJsNode(functionElement.id);
            fcCharacteristicVector.join(functionElement.characteristicVector, functionElement.id.characteristicVector);
        }

        functionElement.params.forEach(function(parameter)
        {
            this.generateForJsNode(parameter);
            fcCharacteristicVector.join(functionElement.characteristicVector, parameter.characteristicVector);
        }, this);

        this.generateForJsNode(functionElement.body);
        fcCharacteristicVector.join(functionElement.characteristicVector, functionElement.body.characteristicVector);
    },

    generateVectorForProgram: function(program)
    {
        program.characteristicVector = new fcCharacteristicVector();

        var programStatements = program.body;

        for(var i = 0, length = programStatements.length; i < length; i++)
        {
            var programStatement = programStatements[i];

            this.generateForJsNode(programStatement);
            fcCharacteristicVector.join(program.characteristicVector, programStatement.characteristicVector);
        }
    },

    generateVectorForSequenceExpression: function(sequenceExpression)
    {
        sequenceExpression.characteristicVector = new fcCharacteristicVector();
        sequenceExpression.characteristicVector[sequenceExpression.type] = 1;

        var expressions = sequenceExpression.expressions;

        for(var i = 0; i < expressions.length; i++)
        {
            var expression = expressions[i];
            this.generateForJsNode(expression);
            fcCharacteristicVector.join(sequenceExpression.characteristicVector, expressions.characteristicVector);
        }
    },

    generateVectorForVariableDeclaration: function(variableDeclaration)
    {
        variableDeclaration.characteristicVector = new fcCharacteristicVector();

        if (variableDeclaration.kind == "let")
        {
            variableDeclaration.characteristicVector[variableDeclaration.kind] = 1;
        }

        var declarators = variableDeclaration.declarations;

        for(var i = 0, length = declarators.length; i < length; i++)
        {
            var declarator = declarators[i];

            this.generateForJsNode(declarator);

            fcCharacteristicVector.join(variableDeclaration.characteristicVector, declarator.characteristicVector);
        }
    },

    generateVectorForVariableDeclarator: function(variableDeclarator)
    {
        variableDeclarator.characteristicVector = new fcCharacteristicVector();
        variableDeclarator.characteristicVector[variableDeclarator.type] = 1;

        this.generateForJsNode(variableDeclarator.id);
        fcCharacteristicVector.join(variableDeclarator.characteristicVector, variableDeclarator.id.characteristicVector);

        if(variableDeclarator.init != null)
        {
            this.generateForJsNode(variableDeclarator.init);
            fcCharacteristicVector.join(variableDeclarator.characteristicVector, variableDeclarator.init.characteristicVector);
        }
    },

    generateVectorForIdentifier: function(identifier)
    {
        identifier.characteristicVector = new fcCharacteristicVector();
        identifier.characteristicVector[identifier.type] = 1;
    },

    generateVectorForLiteral: function(literal)
    {
        literal.characteristicVector = new fcCharacteristicVector();

        if(ValueTypeHelper.isNull(literal.value)) { literal.characteristicVector["NullLiteral"] = 1; }
        else if(ValueTypeHelper.isString(literal.value)) { literal.characteristicVector["StringLiteral"] = 1; }
        else if(ValueTypeHelper.isNumber(literal.value)) { literal.characteristicVector["NumberLiteral"] = 1; }
        else if(ValueTypeHelper.isBoolean(literal.value)){ literal.characteristicVector["BooleanLiteral"] = 1; }
        else if(ValueTypeHelper.isRegExp(literal.value)){ literal.characteristicVector["RegExLiteral"] = 1; }
        else {alert("Unknown literal when generating vector!"); return; }
    },

    generateVectorForTryStatement: function(tryStatement)
    {
        tryStatement.characteristicVector = new fcCharacteristicVector();
        tryStatement.characteristicVector[tryStatement.type] = 1;

        this.generateForJsNode(tryStatement.block);

        fcCharacteristicVector.join(tryStatement.characteristicVector, tryStatement.block.characteristicVector);

        tryStatement.handlers.forEach(function(catchClause)
        {
            this.generateForJsNode(catchClause);
            fcCharacteristicVector.join(tryStatement.characteristicVector, catchClause.characteristicVector);
        }, this);

        if(tryStatement.finalizer != null)
        {
            this.generateForJsNode(tryStatement.finalizer);
            fcCharacteristicVector.join(tryStatement.characteristicVector, tryStatement.finalizer.characteristicVector);
        }
    },

    generateVectorForCatchClause: function(catchClause)
    {
        catchClause.characteristicVector = new fcCharacteristicVector();
        catchClause.characteristicVector[catchClause.type] = 1;

        this.generateForJsNode(catchClause.body);

        fcCharacteristicVector.join(catchClause.characteristicVector, catchClause.body.characteristicVector);

        this.generateForJsNode(catchClause.param);

        fcCharacteristicVector.join(catchClause.characteristicVector, catchClause.param.characteristicVector);

        if(catchClause.guard != null)
        {
            this.generateForJsNode(catchClause.guard);
            fcCharacteristicVector.join(catchClause.characteristicVector, catchClause.guard.characteristicVector);
        }
    },

    generateVectorForIfStatement: function(ifStatement)
    {
        ifStatement.characteristicVector = new fcCharacteristicVector();
        ifStatement.characteristicVector[ifStatement.type] = 1;

        this.generateForJsNode(ifStatement.test);

        fcCharacteristicVector.join(ifStatement.characteristicVector, ifStatement.test.characteristicVector);

        this.generateForJsNode(ifStatement.consequent);

        fcCharacteristicVector.join(ifStatement.characteristicVector, ifStatement.consequent.characteristicVector);

        if (ifStatement.alternate != null)
        {
            this.generateForJsNode(ifStatement.alternate);
            fcCharacteristicVector.join(ifStatement.characteristicVector, ifStatement.alternate.characteristicVector);
        }
    },

    generateVectorForForStatement: function (forStatement)
    {
        forStatement.characteristicVector = new fcCharacteristicVector();
        forStatement.characteristicVector[forStatement.type] = 1;

        if (forStatement.init != null)
        {
            this.generateForJsNode(forStatement.init);
            fcCharacteristicVector.join(forStatement.characteristicVector, forStatement.init.characteristicVector);
        }

        if (forStatement.test != null)
        {
            this.generateForJsNode(forStatement.test);
            fcCharacteristicVector.join(forStatement.characteristicVector, forStatement.test.characteristicVector);
        }

        if (forStatement.update != null)
        {
            this.generateForJsNode(forStatement.update);
            fcCharacteristicVector.join(forStatement.characteristicVector, forStatement.update.characteristicVector);
        }

        this.generateForJsNode(forStatement.body);
        fcCharacteristicVector.join(forStatement.characteristicVector, forStatement.body.characteristicVector);
    },

    generateVectorForForInStatement: function (forInStatement)
    {
        forInStatement.characteristicVector = new fcCharacteristicVector();
        forInStatement.characteristicVector[forInStatement.type] = 1;

        this.generateForJsNode(forInStatement.left);
        fcCharacteristicVector.join(forInStatement.characteristicVector, forInStatement.left.characteristicVector);

        this.generateForJsNode(forInStatement.right);
        fcCharacteristicVector.join(forInStatement.characteristicVector, forInStatement.right.characteristicVector);

        this.generateForJsNode(forInStatement.body);
        fcCharacteristicVector.join(forInStatement.characteristicVector, forInStatement.body.characteristicVector);
    },

    generateVectorForWhileStatement: function (whileStatement)
    {
        whileStatement.characteristicVector = new fcCharacteristicVector();
        whileStatement.characteristicVector[whileStatement.type] = 1;

        this.generateForJsNode(whileStatement.body);
        fcCharacteristicVector.join(whileStatement.characteristicVector, whileStatement.body.characteristicVector);

        this.generateForJsNode(whileStatement.test);
        fcCharacteristicVector.join(whileStatement.characteristicVector, whileStatement.test.characteristicVector);
    },

    generateVectorForDoWhileStatement: function (doWhileStatement)
    {
        doWhileStatement.characteristicVector = new fcCharacteristicVector();
        doWhileStatement.characteristicVector[doWhileStatement.type] = 1;

        this.generateForJsNode(doWhileStatement.body);
        fcCharacteristicVector.join(doWhileStatement.characteristicVector, doWhileStatement.body.characteristicVector);

        this.generateForJsNode(doWhileStatement.test);
        fcCharacteristicVector.join(doWhileStatement.characteristicVector, doWhileStatement.test.characteristicVector);
    },

    generateVectorForBreakStatement: function(breakStatement)
    {
        breakStatement.characteristicVector = new fcCharacteristicVector();
        breakStatement.characteristicVector[breakStatement.type] = 1;

        if(breakStatement.label != null)
        {
            this.generateForJsNode(breakStatement.label);
            fcCharacteristicVector.join(breakStatement.characteristicVector, breakStatement.label.characteristicVector);
        }
    },

    generateVectorForContinueStatement: function(continueStatement)
    {
        continueStatement.characteristicVector = new fcCharacteristicVector();
        continueStatement.characteristicVector[continueStatement.type] = 1;

        if(continueStatement.label != null)
        {
            this.generateForJsNode(continueStatement.label);
            fcCharacteristicVector.join(continueStatement.characteristicVector, continueStatement.label.characteristicVector);
        }
    },

    generateVectorForUpdateExpression: function(updateExpression)
    {
        updateExpression.characteristicVector = new fcCharacteristicVector();
        updateExpression.characteristicVector[updateExpression.type] = 1;

        this.generateForJsNode(updateExpression.argument);

        fcCharacteristicVector.join(updateExpression.characteristicVector, updateExpression.argument.characteristicVector);
    },

    generateVectorForLogicalExpression: function (logicalExpression)
    {
        logicalExpression.characteristicVector = new fcCharacteristicVector();
        logicalExpression.characteristicVector[logicalExpression.type] = 1;

        this.generateForJsNode(logicalExpression.left);
        this.generateForJsNode(logicalExpression.right);

        fcCharacteristicVector.join(logicalExpression.characteristicVector, logicalExpression.left.characteristicVector);
        fcCharacteristicVector.join(logicalExpression.characteristicVector, logicalExpression.right.characteristicVector);
    },

    //NETESTIRANI
    generateVectorForYieldExpression: function (yieldExpression)
    {
        yieldExpression.characteristicVector = new fcCharacteristicVector();
        yieldExpression.characteristicVector[yieldExpression.type] = 1;

        if( yieldExpression.argument != null)
        {
            this.generateForJsNode(yieldExpression.argument);
            fcCharacteristicVector.join(yieldExpression.characteristicVector, yieldExpression.argument.characteristicVector);
        }
    },

    generateVectorForComprehensionExpression: function (comprehensionExpression)
    {
        comprehensionExpression.characteristicVector = new fcCharacteristicVector();
        comprehensionExpression.characteristicVector[comprehensionExpression.type] = 1;

        this.generateForJsNode(comprehensionExpression.body);
        fcCharacteristicVector.join(comprehensionExpression.characteristicVector, comprehensionExpression.body.characteristicVector);

        comprehensionExpression.blocks.forEach(function(blocks)
        {
            this.generateForJsNode(blocks);
            fcCharacteristicVector.join(comprehensionExpression.characteristicVector, blocks.characteristicVector);
        }, this);

        if( comprehensionExpression.filter != null)
        {
            this.generateForJsNode(comprehensionExpression.filter);
            fcCharacteristicVector.join(comprehensionExpression.characteristicVector, comprehensionExpression.filter.characteristicVector);
        }
    },

    generateVectorForGeneratorExpression: function (generatorExpression)
    {
        generatorExpression.characteristicVector = new fcCharacteristicVector();
        generatorExpression.characteristicVector[generatorExpression.type] = 1;

        this.generateForJsNode(generatorExpression.body);
        fcCharacteristicVector.join(generatorExpression.characteristicVector, generatorExpression.body.characteristicVector);

        generatorExpression.blocks.forEach(function(block)
        {
            this.generateForJsNode(block);
            fcCharacteristicVector.join(generatorExpression.characteristicVector, block.characteristicVector);
        }, this);

        if( generatorExpression.filter != null)
        {
            this.generateForJsNode(generatorExpression.filter);
            fcCharacteristicVector.join(generatorExpression.characteristicVector, generatorExpression.filter.characteristicVector);
        }
    }
};
/*************************************************************************************/
}});