FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcSimulator = Firecrow.Interpreter.Simulator;
var ASTHelper = Firecrow.ASTHelper;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcSimulator.DependencyCreator = function(globalObject, executionContextStack)
{
    this.globalObject = globalObject;
    this.executionContextStack = executionContextStack;
};

fcSimulator.DependencyCreator.prototype =
{
    createDataDependency: function(fromConstruct, toConstruct)
    {
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(fromConstruct, toConstruct, this.globalObject.getPreciseEvaluationPositionId());
    },

    addDependenciesToTopBlockConstructs: function(currentConstruct)
    {
        var topBlockConstructs = this.executionContextStack.getTopBlockCommandConstructs();
        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

        for(var i = 0, length = topBlockConstructs.length; i < length; i++)
        {
            var topBlockConstruct = topBlockConstructs[i];
            this.globalObject.browser.callControlDependencyEstablishedCallbacks(currentConstruct, topBlockConstruct, evaluationPosition);
        }

        if(this.executionContextStack.handlerInfo != null)
        {
            this.globalObject.browser.callControlDependencyEstablishedCallbacks
            (
                currentConstruct,
                this.executionContextStack.handlerInfo.registrationPoint.codeConstruct,
                evaluationPosition,
                this.executionContextStack.handlerInfo.registrationPoint.evaluationPositionId
            );
        }

        /*this.executionContextStack.addDependencyToLastExecutedBlockStatement(currentConstruct);

         if(currentConstruct.previousCondition != null)
         {
         this.globalObject.browser.callControlDependencyEstablishedCallbacks(currentConstruct, currentConstruct.previousCondition, evaluationPosition);
         }*/
    },

    createAssignmentDependencies: function(assignmentCommand)
    {
        var assignmentExpression = assignmentCommand.codeConstruct;

        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

        this.globalObject.browser.callDataDependencyEstablishedCallbacks(assignmentExpression, assignmentCommand.leftSide, evaluationPosition);
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(assignmentExpression, assignmentCommand.rightSide, evaluationPosition);

        this.addDependenciesToTopBlockConstructs(assignmentExpression);
    },

    createUpdateExpressionDependencies: function(updateExpression)
    {
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(updateExpression, updateExpression.argument, this.globalObject.getPreciseEvaluationPositionId());
        this.addDependenciesToTopBlockConstructs(updateExpression);
    },

    createIdentifierDependencies:function(identifier, identifierConstruct, evaluationPosition)
    {
        if(this._willIdentifierBeReadInAssignmentExpression(identifierConstruct))
        {
            this._addDependencyToLastModificationPoint(identifier, identifierConstruct, evaluationPosition);
        }

        this._addDependencyToIdentifierDeclaration(identifier, identifierConstruct, evaluationPosition);
    },

    _willIdentifierBeReadInAssignmentExpression: function(identifierConstruct)
    {
        return !ASTHelper.isAssignmentExpression(identifierConstruct.parent) || identifierConstruct.parent.left != identifierConstruct || identifierConstruct.parent.operator.length == 2;
    },

    _addDependencyToLastModificationPoint: function(identifier, identifierConstruct, evaluationPosition)
    {
        if(identifier.lastModificationPosition == null) { return; }

        this.globalObject.browser.callDataDependencyEstablishedCallbacks
        (
            identifierConstruct,
            identifier.lastModificationPosition.codeConstruct,
            evaluationPosition,
            identifier.lastModificationPosition.evaluationPositionId
        );
    },

    _addDependencyToIdentifierDeclaration: function(identifier, identifierConstruct, evaluationPosition)
    {
        if(identifier.declarationConstruct == null || identifier.declarationConstruct == identifier.lastModificationPosition) { return; }

        this.globalObject.browser.callDataDependencyEstablishedCallbacks
        (
            identifierConstruct,
            ASTHelper.isVariableDeclarator(identifier.declarationConstruct.codeConstruct) ? identifier.declarationConstruct.codeConstruct.id
                                                                                          : identifier.declarationConstruct.codeConstruct,
            evaluationPosition
        );
    },

    createBinaryExpressionDependencies: function(binaryExpression)
    {
        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

        this.globalObject.browser.callDataDependencyEstablishedCallbacks(binaryExpression, binaryExpression.left, evaluationPosition);
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(binaryExpression, binaryExpression.right, evaluationPosition);
    },

    createReturnDependencies: function(returnCommand)
    {
        this.globalObject.browser.callControlDependencyEstablishedCallbacks(returnCommand.codeConstruct, returnCommand.codeConstruct.argument, this.globalObject.getPreciseEvaluationPositionId());

        this.addDependenciesToTopBlockConstructs(returnCommand.codeConstruct);

        if(returnCommand.parentFunctionCommand == null || returnCommand.parentFunctionCommand.isExecuteCallbackCommand()) { return; }

        this.globalObject.browser.callDataDependencyEstablishedCallbacks(returnCommand.parentFunctionCommand.codeConstruct, returnCommand.codeConstruct, this.globalObject.getReturnExpressionPreciseEvaluationPositionId());
    },

    createMemberExpressionDependencies: function(object, property, propertyValue, memberExpression)
    {
        //TODO - possibly can create a problem? - for problems see slicing 54, 55, 56
        var propertyExists = propertyValue !== undefined && propertyValue.value !== undefined;

        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

        if(object.fcInternal != null && object.fcInternal.object != null)
        {
            var fcProperty = object.fcInternal.object.getProperty(property.value, memberExpression);

            if(fcProperty != null && !ASTHelper.isLastPropertyInLeftHandAssignment(memberExpression.property))
            {
                if(fcProperty.lastModificationPosition != null)
                {
                    this.globalObject.browser.callDataDependencyEstablishedCallbacks
                    (
                        memberExpression.property,
                        fcProperty.lastModificationPosition.codeConstruct,
                        evaluationPosition,
                        fcProperty.lastModificationPosition.evaluationPositionId
                    );
                }
                else  if(fcProperty.declarationConstruct != null)
                {
                    this.globalObject.browser.callDataDependencyEstablishedCallbacks
                    (
                        memberExpression.property,
                        fcProperty.declarationConstruct.codeConstruct,
                        evaluationPosition,
                        fcProperty.declarationConstruct.evaluationPositionId
                    );
                }
            }
        }

        this.globalObject.browser.callDataDependencyEstablishedCallbacks(memberExpression, memberExpression.object, this.globalObject.getPreciseEvaluationPositionId());

        //Create a dependency only if the property exists, the problem is that if we don't ignore it here, that will lead to links to constructs where the property was not null
        if(propertyExists || !ASTHelper.isIdentifier(memberExpression.property) || ASTHelper.isLastPropertyInLeftHandAssignment(memberExpression.property))
        {
            this.globalObject.browser.callDataDependencyEstablishedCallbacks(memberExpression, memberExpression.property, evaluationPosition);
        }
        else
        {
            this.globalObject.browser.callDataDependencyEstablishedCallbacks(memberExpression, memberExpression.property, evaluationPosition, evaluationPosition, true);

            if(memberExpression.computed && ASTHelper.isIdentifier(memberExpression.property))
            {
                var identifier = this.executionContextStack.getIdentifier(memberExpression.property.name);
                if(identifier != null && identifier.declarationConstruct != null)
                {
                    this.globalObject.browser.callDataDependencyEstablishedCallbacks(memberExpression, identifier.declarationConstruct.codeConstruct, evaluationPosition, identifier.declarationConstruct.evaluationPositionId, true);
                }
            }
        }
    },

    createDependenciesInForInWhereCommand: function(forInWhereConstruct, whereObject, nextPropertyName)
    {
        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();
        this.addDependenciesToTopBlockConstructs(forInWhereConstruct.left);
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(forInWhereConstruct, forInWhereConstruct.right, evaluationPosition);
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(forInWhereConstruct.left, forInWhereConstruct.right, evaluationPosition);

        if(!nextPropertyName || !nextPropertyName.value) { return; }

        var property = whereObject.fcInternal.object.getProperty(nextPropertyName.value);

        if(property != null)
        {
            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                forInWhereConstruct.left,
                property.lastModificationPosition.codeConstruct,
                evaluationPosition,
                property.lastModificationPosition.evaluationPositionId
            );
        }

        if (ASTHelper.isVariableDeclaration(forInWhereConstruct.left))
        {
            var declarator = forInWhereConstruct.left.declarations[0];

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(declarator, forInWhereConstruct.right, evaluationPosition);
            this.globalObject.browser.callDataDependencyEstablishedCallbacks(declarator.id, forInWhereConstruct.right, evaluationPosition);
        }
    },

    createDependenciesForConditionalCommand: function(conditionalCommand)
    {
        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(conditionalCommand.codeConstruct, conditionalCommand.codeConstruct.test, evaluationPosition);
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(conditionalCommand.codeConstruct, conditionalCommand.startCommand.body, evaluationPosition);
    },

    createDependenciesForLogicalExpressionItemCommand: function(logicalExpression)
    {
        if(logicalExpression.operator == "&&")
        {
            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                logicalExpression.right,
                logicalExpression.left,
                this.globalObject.getPreciseEvaluationPositionId()
            );
        }
    },

    createDependenciesForLogicalExpression: function(logicalExpressionCommand)
    {
        var executedItemsCommands = logicalExpressionCommand.executedLogicalItemExpressionCommands;
        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

        for(var i = 0, length = executedItemsCommands.length; i < length; i++)
        {
            var executedLogicalExpressionItemConstruct = executedItemsCommands[i].codeConstruct;

            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                logicalExpressionCommand.codeConstruct,
                executedLogicalExpressionItemConstruct,
                evaluationPosition
            );
        }
    },

    createDependenciesForCallInternalFunction: function(callInternalFunctionCommand)
    {
        var callExpression = callInternalFunctionCommand.codeConstruct;

        var args = callExpression.arguments;
        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

        this.globalObject.browser.callDataDependencyEstablishedCallbacks(callExpression, callExpression.callee, evaluationPosition);

        if(callInternalFunctionCommand.isCall || callInternalFunctionCommand.isApply)
        {
            this._createDependenciesToCallApplyInternalFunctionCall(callInternalFunctionCommand, args, callExpression);
        }
        else
        {
            for(var i = 0, length = args.length; i < length; i++)
            {
                var argument = args[i];
                this.globalObject.browser.callDataDependencyEstablishedCallbacks(callExpression, argument, evaluationPosition);
                this.globalObject.browser.callDataDependencyEstablishedCallbacks(argument, callExpression, evaluationPosition);
            }
        }
    },

    _createDependenciesToCallApplyInternalFunctionCall: function(callInternalFunctionCommand, args, callExpression)
    {
        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

        if(callInternalFunctionCommand.isCall)
        {
            for(var i = 1, length = arguments.length; i < length; i++)
            {
                this.globalObject.browser.callDataDependencyEstablishedCallbacks(callExpression, args[i], evaluationPosition);
            }
        }
        else
        {
            var secondArgumentValue = this.executionContextStack.getExpressionValue(args[1]);

            if(secondArgumentValue != null && ValueTypeHelper.isArray(secondArgumentValue.value))
            {
                secondArgumentValue.fcInternal.object.addDependenciesToAllProperties(callExpression);
            }
        }
    },

    createCallbackFunctionCommandDependencies: function(evalCallbackFunctionCommand)
    {
        var parentInitCallbackCommand = evalCallbackFunctionCommand.parentInitCallbackCommand;
        var callExpression = parentInitCallbackCommand.codeConstruct;
        var arguments = callExpression.arguments;

        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

        for(var i = 0; i < arguments.length; i++)
        {
            this.globalObject.browser.callDataDependencyEstablishedCallbacks(arguments[i], callExpression, evaluationPosition);
        }
    },

    createSequenceExpressionDependencies: function(sequenceExpression, lastExpression)
    {
        this.globalObject.browser.callDataDependencyEstablishedCallbacks
        (
            sequenceExpression,
            lastExpression,
            this.globalObject.getPreciseEvaluationPositionId()
        );
    }
};
/*************************************************************************************/
}});