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

fcSimulator.DependencyCreator.shouldCreateDependencies = false;
fcSimulator.DependencyCreator.shouldCreateSimpleDependencies = false;

fcSimulator.DependencyCreator.notifyError = function(message) { debugger; alert("DependencyCreator - " + message);};

fcSimulator.DependencyCreator.prototype =
{
    createDependencyToConstructorPrototype: function(creationCodeConstruct, constructorFunction)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }

        if(constructorFunction.iValue != null && constructorFunction.iValue.prototypeDefinitionConstruct != null)
        {
            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                creationCodeConstruct,
                constructorFunction.iValue.prototypeDefinitionConstruct.codeConstruct,
                this.globalObject.getPreciseEvaluationPositionId(),
                constructorFunction.iValue.prototypeDefinitionConstruct.evaluationPositionId
            );
        }
    },

    createExitFunctionDependencies: function(callFunctionCommand)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }

        this.addDependenciesToPreviouslyExecutedBlockConstructs(callFunctionCommand.codeConstruct, this.executionContextStack.getPreviouslyExecutedBlockConstructs());

        if(callFunctionCommand.executedReturnCommand != null && callFunctionCommand.executedReturnCommand.codeConstruct.argument == null)
        {
            this.globalObject.browser.callControlDependencyEstablishedCallbacks
            (
                callFunctionCommand.codeConstruct,
                callFunctionCommand.executedReturnCommand.codeConstruct,
                this.globalObject.getReturnExpressionPreciseEvaluationPositionId()
            );
        }
    },

    createDependenciesForObjectPropertyDefinition: function(propertyConstruct)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        if(!ASTHelper.isObjectExpression(propertyConstruct)) { return; }

        var children = propertyConstruct.children;

        for(var i = 0; i < children.length; i++)
        {
            var child = children[i];
            this.createDataDependency(propertyConstruct, child);
            this.createDataDependency(propertyConstruct, child.value);
        }
    },

    createDataDependency: function(fromConstruct, toConstruct, evaluationPosition, toEvaluationPosition)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }

        this.globalObject.browser.callDataDependencyEstablishedCallbacks
        (
            fromConstruct,
            toConstruct,
            evaluationPosition || this.globalObject.getPreciseEvaluationPositionId(),
            toEvaluationPosition
        );
    },

    markEnterFunctionPoints: function(enterFunctionCommand)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }

        if(enterFunctionCommand == null || enterFunctionCommand.parentFunctionCommand == null) { return; }

        //TODO - this should not be here!
        var graphNode = enterFunctionCommand.parentFunctionCommand.codeConstruct.graphNode;

        if(graphNode != null)
        {
            var dataDependencies = graphNode.dataDependencies;

            if(dataDependencies.length > 0)
            {
                if(graphNode.enterFunctionPoints == null) { graphNode.enterFunctionPoints = []; }

                graphNode.enterFunctionPoints.push({lastDependencyIndex: dataDependencies[dataDependencies.length - 1].index});
            }
        }
    },

    createFunctionParametersDependencies: function(callCommand, formalParams, args)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        if(callCommand == null) { return; }

        this._createArgumentsToCallDependencies(callCommand, args);
        this._createFormalParameterDependencies(callCommand, formalParams, args);
    },

    _createArgumentsToCallDependencies: function(callCommand, args)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        if(args == null) { return; }

        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

        for(var i = 0; i < args.length; i++)
        {
            this.globalObject.browser.callDataDependencyEstablishedCallbacks(args[i], callCommand.codeConstruct, evaluationPosition);
        }
    },

    _createFormalParameterDependencies: function(callCommand, formalParams, args)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        if(args == null) { return; }

        if(callCommand.isApply) { this._createFormalParameterDependenciesInApply(callCommand, formalParams, args); }
        else if (callCommand.isCall) { this._createFormalParameterDependenciesInCall(callCommand, formalParams, args); }
        else if (callCommand.isExecuteCallbackCommand()) {this._createFormalParameterDependenciesInCallback(callCommand, formalParams, args);}
        else { this._createFormalParameterDependenciesInStandard(callCommand, formalParams, args); }
    },

    _createFormalParameterDependenciesInApply: function(callCommand, formalParams, args)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        var argumentValue = this.executionContextStack.getExpressionValue(args[1]);

        if(argumentValue == null) { return; }

        var evalPosition = this.globalObject.getPreciseEvaluationPositionId();
        var fcArray = argumentValue.iValue;

        for(var i = 0, length = formalParams.length; i < length; i++)
        {
            var arrayItem = fcArray.getProperty(i);
            var formalParameter = formalParams[i].value.codeConstruct;

            if(arrayItem != null && arrayItem.lastModificationPosition != null)
            {
                this.globalObject.browser.callDataDependencyEstablishedCallbacks(formalParameter, arrayItem.lastModificationPosition.codeConstruct, evalPosition);
            }

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(formalParameter, callCommand.codeConstruct, evalPosition);
        }
    },

    _createFormalParameterDependenciesInCall: function(callCommand, formalParams, args)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        var evalPosition = this.globalObject.getPreciseEvaluationPositionId();

        for(var i = 0, length = formalParams.length; i < length; i++)
        {
            var formalParameter = formalParams[i].value.codeConstruct;

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(formalParameter, args[i + 1], evalPosition);
            this.globalObject.browser.callDataDependencyEstablishedCallbacks(formalParameter, callCommand.codeConstruct, evalPosition);
        }
    },

    _createFormalParameterDependenciesInStandard: function(callCommand, formalParams, args)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        var evalPosition = this.globalObject.getPreciseEvaluationPositionId();

        for(var i = 0, length = formalParams.length; i < length; i++)
        {
            var formalParam = formalParams[i].value.codeConstruct;

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(formalParam, args[i], evalPosition);
            this.globalObject.browser.callDataDependencyEstablishedCallbacks(formalParam, callCommand.codeConstruct, evalPosition);
        }
    },

    _createFormalParameterDependenciesInCallback: function(callCommand, formalParameters, args)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        var params = callCommand.callbackFunction.codeConstruct.params;
        var evalPosition = this.globalObject.getPreciseEvaluationPositionId();

        for(var i = 0; i < params.length; i++)
        {
            var arg = callCommand.arguments[i];

            if(arg != null)
            {
                this.globalObject.browser.callDataDependencyEstablishedCallbacks(params[i], arg.codeConstruct, evalPosition);
            }

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(params[i], callCommand.codeConstruct, evalPosition);
        }
    },

    addDependenciesToPreviouslyExecutedBlockConstructs: function(codeConstruct, previouslyExecutedBlockConstructs)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();
        evaluationPosition.isReturnDependency = true;

        for(var i = 0, length = previouslyExecutedBlockConstructs.length; i < length; i++)
        {
            var mapping = previouslyExecutedBlockConstructs[i];

            this.globalObject.browser.callControlDependencyEstablishedCallbacks
            (
                codeConstruct,
                mapping.codeConstruct,
                evaluationPosition,
                mapping.evaluationPositionId,
                true
            );
        }
    },

    addDependenciesToTopBlockConstructs: function(currentConstruct)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
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
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        var assignmentExpression = assignmentCommand.codeConstruct;

        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

        this.globalObject.browser.callDataDependencyEstablishedCallbacks(assignmentExpression, assignmentCommand.leftSide, evaluationPosition);
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(assignmentExpression, assignmentCommand.rightSide, evaluationPosition);

        this.addDependenciesToTopBlockConstructs(assignmentExpression);
    },

    createUpdateExpressionDependencies: function(updateExpression)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(updateExpression, updateExpression.argument, this.globalObject.getPreciseEvaluationPositionId());
        this.addDependenciesToTopBlockConstructs(updateExpression);
    },

    createIdentifierDependencies:function(identifier, identifierConstruct, evaluationPosition)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }

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
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }

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
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }

        if(identifier.declarationPosition == null || identifier.declarationPosition == identifier.lastModificationPosition) { return; }

        this.globalObject.browser.callDataDependencyEstablishedCallbacks
        (
            identifierConstruct,
            ASTHelper.isVariableDeclarator(identifier.declarationPosition.codeConstruct) ? identifier.declarationPosition.codeConstruct.id
                                                                                          : identifier.declarationPosition.codeConstruct,
            evaluationPosition
        );
    },

    createBinaryExpressionDependencies: function(binaryExpression)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

        this.globalObject.browser.callDataDependencyEstablishedCallbacks(binaryExpression, binaryExpression.left, evaluationPosition);
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(binaryExpression, binaryExpression.right, evaluationPosition);
    },

    createReturnDependencies: function(returnCommand)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        this.globalObject.browser.callControlDependencyEstablishedCallbacks(returnCommand.codeConstruct, returnCommand.codeConstruct.argument, this.globalObject.getPreciseEvaluationPositionId());

        this.addDependenciesToTopBlockConstructs(returnCommand.codeConstruct);

        if(returnCommand.parentFunctionCommand == null || returnCommand.parentFunctionCommand.isExecuteCallbackCommand()) { return; }

        this.globalObject.browser.callDataDependencyEstablishedCallbacks(returnCommand.parentFunctionCommand.codeConstruct, returnCommand.codeConstruct, this.globalObject.getReturnExpressionPreciseEvaluationPositionId());
    },

    createMemberExpressionDependencies: function(object, property, propertyValue, memberExpression)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        //TODO - possibly can create a problem? - for problems see slicing 54, 55, 56
        var propertyExists = propertyValue !== undefined && propertyValue.jsValue !== undefined;

        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

        if(object.iValue != null)
        {
            var fcProperty = object.iValue.getProperty(property.jsValue, memberExpression);

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
                else  if(fcProperty.declarationPosition != null)
                {
                    this.globalObject.browser.callDataDependencyEstablishedCallbacks
                    (
                        memberExpression.property,
                        fcProperty.declarationPosition.codeConstruct,
                        evaluationPosition,
                        fcProperty.declarationPosition.evaluationPositionId
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
                if(identifier != null && identifier.declarationPosition != null)
                {
                    this.globalObject.browser.callDataDependencyEstablishedCallbacks(memberExpression, identifier.declarationPosition.codeConstruct, evaluationPosition, identifier.declarationPosition.evaluationPositionId, true);
                }
            }
        }
    },

    createDependenciesInForInWhereCommand: function(forInWhereConstruct, whereObject, nextPropertyName)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();
        this.addDependenciesToTopBlockConstructs(forInWhereConstruct.left);
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(forInWhereConstruct, forInWhereConstruct.right, evaluationPosition);
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(forInWhereConstruct.left, forInWhereConstruct.right, evaluationPosition);

        if(!nextPropertyName || !nextPropertyName.jsValue) { return; }

        var property = whereObject.iValue.getProperty(nextPropertyName.jsValue);

        if(property != null)
        {
            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                forInWhereConstruct.left,
                property.lastModificationPosition.codeConstruct,
                evaluationPosition,
                property.lastModificationPosition.evaluationPositionId
            );

            if (ASTHelper.isVariableDeclaration(forInWhereConstruct.left))
            {
                var declarator = forInWhereConstruct.left.declarations[0];

                this.globalObject.browser.callDataDependencyEstablishedCallbacks
                (
                    declarator.id,
                    property.lastModificationPosition.codeConstruct,
                    evaluationPosition,
                    property.lastModificationPosition.evaluationPositionId
                );

                this.globalObject.browser.callDataDependencyEstablishedCallbacks(declarator, forInWhereConstruct.right, evaluationPosition);
                this.globalObject.browser.callDataDependencyEstablishedCallbacks(declarator.id, forInWhereConstruct.right, evaluationPosition);
            }
        }
    },

    createDependenciesForConditionalCommand: function(conditionalCommand)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(conditionalCommand.codeConstruct, conditionalCommand.codeConstruct.test, evaluationPosition);
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(conditionalCommand.codeConstruct, conditionalCommand.startCommand.body, evaluationPosition);
    },

    createDependenciesForLogicalExpressionItemCommand: function(logicalExpression)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
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
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
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
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        var callExpression = callInternalFunctionCommand.codeConstruct;

        //Callback function called with an internal function
        if(callExpression == null) { return; }

        var args = callExpression.arguments;
        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

        this.globalObject.browser.callDataDependencyEstablishedCallbacks(callExpression, callExpression.callee, evaluationPosition);

        if(callInternalFunctionCommand.isCall || callInternalFunctionCommand.isApply)
        {
            this._createDependenciesToCallApplyInternalFunctionCall(callInternalFunctionCommand, args, callExpression);
        }
        else
        {
            if(args == null) { return; }

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
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
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

            if(secondArgumentValue != null && ValueTypeHelper.isArray(secondArgumentValue.jsValue))
            {
                secondArgumentValue.iValue.addDependenciesToAllProperties(callExpression);
            }
        }
    },

    createCallbackFunctionCommandDependencies: function(evalCallbackFunctionCommand)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }

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
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }

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