FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcSimulator = Firecrow.Interpreter.Simulator;
var fcModel = Firecrow.Interpreter.Model;
var ASTHelper = Firecrow.ASTHelper;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcSimulator.DependencyCreator = function(globalObject, executionContextStack)
{
    this.globalObject = globalObject;
    this.executionContextStack = executionContextStack;
};

fcSimulator.DependencyCreator.shouldCreateDependencies = false;
fcSimulator.DependencyCreator.shouldCreateSimpleDependencies = true;

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
        if(fcSimulator.DependencyCreator.shouldCreateSimpleDependencies) { this._createSimpleDependency(fromConstruct, toConstruct); }
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
        if(fcSimulator.DependencyCreator.shouldCreateSimpleDependencies) { this._createFunctionParametersSimpleDependencies(callCommand, formalParams, args); }
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        if(callCommand == null) { return; }

        //this._createArgumentsToCallDependencies(callCommand, args);
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

    _createFunctionParametersSimpleDependencies: function(callCommand, formalParams, args)
    {
        if(callCommand == null || args == null) { return; }

        for(var i = 0; i < args.length; i++)
        {
            this._createSimpleDependency(args[i], callCommand.codeConstruct);
        }

        for(var i = 0, length = formalParams.length; i < length; i++)
        {
            var formalParam = formalParams[i].value.codeConstruct;

            this._createSimpleDependency(formalParam, args[i]);
            this._createSimpleDependency(formalParam, callCommand.codeConstruct);
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

    createExecuteCallbackDependencies: function(executeCallbackCommand)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }

        var firstArgument = executeCallbackCommand.arguments != null ? executeCallbackCommand.arguments[0] : null;

        if(firstArgument != null && firstArgument.isFunction && firstArgument.isFunction())
        {
            if(executeCallbackCommand.callCallbackCommand == null) { return; }

            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                firstArgument.codeConstruct,
                executeCallbackCommand.callCallbackCommand.codeConstruct,
                this.globalObject.getPreciseEvaluationPositionId()
            );
        }

        var parentCallExpressionCommand = executeCallbackCommand.callCallbackCommand && executeCallbackCommand.callCallbackCommand.parentCallExpressionCommand;

        if(parentCallExpressionCommand != null && parentCallExpressionCommand.codeConstruct != null)
        {
            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                executeCallbackCommand.codeConstruct,
                parentCallExpressionCommand.codeConstruct,
                this.globalObject.getPreciseEvaluationPositionId()
            );
        }
    },

    createAssignmentDependencies: function(assignmentCommand)
    {
        if(fcSimulator.DependencyCreator.shouldCreateSimpleDependencies) { this._createAssignmentSimpleDependencies(assignmentCommand); }
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        var assignmentExpression = assignmentCommand.codeConstruct;

        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

        this.globalObject.browser.callDataDependencyEstablishedCallbacks(assignmentExpression, assignmentCommand.leftSide, evaluationPosition);
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(assignmentExpression, assignmentCommand.rightSide, evaluationPosition);

        this.addDependenciesToTopBlockConstructs(assignmentExpression);
    },

    _createAssignmentSimpleDependencies: function(assignmentCommand)
    {
        var assignmentExpression = assignmentCommand.codeConstruct;

        this._createSimpleDependency(assignmentExpression, assignmentCommand.leftSide);
        this._createSimpleDependency(assignmentExpression, assignmentCommand.rightSide);
    },

    createUpdateExpressionDependencies: function(updateExpression)
    {
        if(fcSimulator.DependencyCreator.shouldCreateSimpleDependencies) { this._createUpdateSimpleDependencies(updateExpression); }
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }

        this.globalObject.browser.callDataDependencyEstablishedCallbacks(updateExpression, updateExpression.argument, this.globalObject.getPreciseEvaluationPositionId());
        this.addDependenciesToTopBlockConstructs(updateExpression);
    },

    _createUpdateSimpleDependencies: function(updateExpression)
    {
        this._createSimpleDependency(updateExpression, updateExpression.argument);
    },

    createIdentifierDependencies:function(identifier, identifierConstruct, evaluationPosition)
    {
        if(fcSimulator.DependencyCreator.shouldCreateSimpleDependencies) { this._createIdentifierSimpleDependencies(identifier, identifierConstruct); }
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }

        this._addDependencyToIdentifierDeclaration(identifier, identifierConstruct, evaluationPosition);

        if(this._willIdentifierBeReadInAssignmentExpression(identifierConstruct))
        {
            this._addDependencyToLastModificationPoint(identifier, identifierConstruct, evaluationPosition);
        }

        if(identifier != null && identifier.value != null && identifier.value.iValue != null && identifier.value.iValue.dummyDependencyNode != null)
        {
            this.createDataDependency(identifierConstruct, identifier.value.iValue.dummyDependencyNode, evaluationPosition);
        }
    },

    _createIdentifierSimpleDependencies: function(identifier, identifierConstruct)
    {
        if(this._willIdentifierBeReadInAssignmentExpression(identifierConstruct))
        {
            this._addSimpleDependencyToLastModificationPoint(identifier, identifierConstruct);
        }

        this._addSimpleDependencyToIdentifierDeclaration(identifier, identifierConstruct);
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
            identifier.lastModificationPosition.evaluationPositionId,
            null,
            true
        );

        this.globalObject.browser.callDataDependencyEstablishedCallbacks
        (
            identifierConstruct,
            identifier.value.codeConstruct,
            evaluationPosition,
            identifier.lastModificationPosition.evaluationPositionId,
            null,
            true
        );
    },

    _addSimpleDependencyToLastModificationPoint: function(identifier, identifierConstruct)
    {
        if(identifier.lastModificationPosition == null) { return; }

        this._createSimpleDependency(identifierConstruct, identifier.lastModificationPosition.codeConstruct);
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
            evaluationPosition,
            null, null,
            true
        );
    },

    _addSimpleDependencyToIdentifierDeclaration: function(identifier, identifierConstruct)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }

        if(identifier.declarationPosition == null || identifier.declarationPosition == identifier.lastModificationPosition) { return; }

        this._createSimpleDependency
        (
            identifierConstruct,
            ASTHelper.isVariableDeclarator(identifier.declarationPosition.codeConstruct) ? identifier.declarationPosition.codeConstruct.id
                                                                                         : identifier.declarationPosition.codeConstruct
        );
    },

    createBinaryExpressionDependencies: function(binaryExpression)
    {
        if(fcSimulator.DependencyCreator.shouldCreateSimpleDependencies) { this._createBinarySimpleDependencies(binaryExpression); }
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

        this.globalObject.browser.callDataDependencyEstablishedCallbacks(binaryExpression, binaryExpression.left, evaluationPosition);
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(binaryExpression, binaryExpression.right, evaluationPosition);
    },

    _createBinarySimpleDependencies: function(binaryExpression)
    {
        this._createSimpleDependency(binaryExpression, binaryExpression.left);
        this._createSimpleDependency(binaryExpression, binaryExpression.right);
    },

    createReturnDependencies: function(returnCommand)
    {
        if(fcSimulator.DependencyCreator.shouldCreateSimpleDependencies) { this._createReturnSimpleDependencies(returnCommand); }
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        this.globalObject.browser.callControlDependencyEstablishedCallbacks(returnCommand.codeConstruct, returnCommand.codeConstruct.argument, this.globalObject.getPreciseEvaluationPositionId());

        this.addDependenciesToTopBlockConstructs(returnCommand.codeConstruct);

        if(returnCommand.parentFunctionCommand == null || returnCommand.parentFunctionCommand.isExecuteCallbackCommand()) { return; }

        this.globalObject.browser.callDataDependencyEstablishedCallbacks(returnCommand.parentFunctionCommand.codeConstruct, returnCommand.codeConstruct, this.globalObject.getReturnExpressionPreciseEvaluationPositionId());
    },

    _createReturnSimpleDependencies: function(returnCommand)
    {
        this._createSimpleDependency(returnCommand.codeConstruct, returnCommand.codeConstruct.argument);

        if(returnCommand.parentFunctionCommand == null || returnCommand.parentFunctionCommand.isExecuteCallbackCommand()) { return; }

        this._createSimpleDependency(returnCommand.parentFunctionCommand.codeConstruct, returnCommand.codeConstruct);
    },

    createMemberExpressionDependencies: function(object, property, propertyValue, memberExpression)
    {
        if(fcSimulator.DependencyCreator.shouldCreateSimpleDependencies) { this._createMemberSimpleDependencies(object, property, propertyValue, memberExpression); }
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
                        memberExpression,
                        fcProperty.lastModificationPosition.codeConstruct,
                        evaluationPosition,
                        fcProperty.lastModificationPosition.evaluationPositionId,
                        null,
                        true
                    );

                    /*this.globalObject.browser.callDataDependencyEstablishedCallbacks
                    (
                        memberExpression,
                        fcProperty.lastModificationPosition.codeConstruct,
                        evaluationPosition,
                        fcProperty.lastModificationPosition.evaluationPositionId,
                        null,
                        true
                    );*/
                }
                else  if(fcProperty.declarationPosition != null)
                {
                    this.globalObject.browser.callDataDependencyEstablishedCallbacks
                    (
                        memberExpression.property,
                        fcProperty.declarationPosition.codeConstruct,
                        evaluationPosition,
                        fcProperty.declarationPosition.evaluationPositionId,
                        null,
                        true
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

    _createMemberSimpleDependencies: function(object, property, propertyValue, memberExpression)
    {
        if(object.iValue != null)
        {
            var fcProperty = object.iValue.getProperty(property.jsValue, memberExpression);

            if(fcProperty != null && !ASTHelper.isLastPropertyInLeftHandAssignment(memberExpression.property))
            {
                if(fcProperty.lastModificationPosition != null)
                {
                    this._createSimpleDependency(memberExpression.property, fcProperty.lastModificationPosition.codeConstruct);
                }
                else  if(fcProperty.declarationPosition != null)
                {
                    this._createSimpleDependency(memberExpression.property, fcProperty.declarationPosition.codeConstruct);
                }
            }
        }

        this._createSimpleDependency(memberExpression, memberExpression.object);
        this._createSimpleDependency(memberExpression, memberExpression.property);

        if(memberExpression.computed && ASTHelper.isIdentifier(memberExpression.property))
        {
            var identifier = this.executionContextStack.getIdentifier(memberExpression.property.name);
            if(identifier != null && identifier.declarationPosition != null)
            {
                this._createSimpleDependency(memberExpression, identifier.declarationPosition.codeConstruct);
            }
        }
    },

    createDependenciesInForInWhereCommand: function(forInWhereConstruct, whereObject, nextPropertyName, propertyIndex)
    {
        if(fcSimulator.DependencyCreator.shouldCreateSimpleDependencies) { this._createForInWhereSimpleDependencies(forInWhereConstruct, whereObject, nextPropertyName); }
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();
        this.addDependenciesToTopBlockConstructs(forInWhereConstruct.left);
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(forInWhereConstruct, forInWhereConstruct.right, evaluationPosition);
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(forInWhereConstruct.left, forInWhereConstruct.right, evaluationPosition);

        if(!nextPropertyName || !nextPropertyName.jsValue) { return; }

        var property = whereObject.iValue.getProperty(nextPropertyName.jsValue);

        if(property != null && property.lastModificationPosition != null)
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

            if(propertyIndex === 0)
            {
                this.globalObject.browser.callDataDependencyEstablishedCallbacks
                (
                    forInWhereConstruct.right,
                    property.lastModificationPosition.codeConstruct,
                    evaluationPosition,
                    property.lastModificationPosition.evaluationPositionId
                );
            }
        }
    },

    _createForInWhereSimpleDependencies: function(forInWhereConstruct, whereObject, nextPropertyName)
    {
        this._createSimpleDependency(forInWhereConstruct, forInWhereConstruct.right);
        this._createSimpleDependency(forInWhereConstruct.left, forInWhereConstruct.right);

        if(!nextPropertyName || !nextPropertyName.jsValue) { return; }

        var property = whereObject.iValue.getProperty(nextPropertyName.jsValue);

        if(property != null && property.lastModificationPosition != null)
        {
            this._createSimpleDependency(forInWhereConstruct.left, property.lastModificationPosition.codeConstruct);

            if (ASTHelper.isVariableDeclaration(forInWhereConstruct.left))
            {
                var declarator = forInWhereConstruct.left.declarations[0];

                this._createSimpleDependency(declarator.id, property.lastModificationPosition.codeConstruct);
                this._createSimpleDependency(declarator, forInWhereConstruct.right);
                this._createSimpleDependency(declarator.id, forInWhereConstruct.right);
            }
        }
    },

    createDependenciesForConditionalCommand: function(conditionalCommand)
    {
        if(fcSimulator.DependencyCreator.shouldCreateSimpleDependencies) { this._createConditionalSimpleDependencies(conditionalCommand); }
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(conditionalCommand.codeConstruct, conditionalCommand.codeConstruct.test, evaluationPosition);
        this.globalObject.browser.callDataDependencyEstablishedCallbacks(conditionalCommand.codeConstruct, conditionalCommand.startCommand.body, evaluationPosition);
    },

    _createConditionalSimpleDependencies: function(conditionalCommand)
    {
        this._createSimpleDependency(conditionalCommand.codeConstruct, conditionalCommand.codeConstruct.test);
        this._createSimpleDependency(conditionalCommand.codeConstruct, conditionalCommand.startCommand.body);
    },

    createDependenciesForLogicalExpressionItemCommand: function(logicalExpression)
    {
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }
        //TODO: not sure about this -> should it be for both
        //if(logicalExpression.operator == "&&")
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
        if(fcSimulator.DependencyCreator.shouldCreateSimpleDependencies) { this._createLogicalSimpleDependencies(logicalExpressionCommand); }
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
                evaluationPosition,
                null, null, i == length - 1 //the data comes from the last
            );
        }
    },

    _createLogicalSimpleDependencies: function(logicalExpressionCommand)
    {
        var executedItemsCommands = logicalExpressionCommand.executedLogicalItemExpressionCommands;

        for(var i = 0, length = executedItemsCommands.length; i < length; i++)
        {
            var executedLogicalExpressionItemConstruct = executedItemsCommands[i].codeConstruct;
            this._createSimpleDependency(logicalExpressionCommand.codeConstruct, executedLogicalExpressionItemConstruct);
        }
    },

    createDependenciesForCallInternalFunction: function(callInternalFunctionCommand)
    {
        if(fcSimulator.DependencyCreator.shouldCreateSimpleDependencies) { this._createSimpleDependenciesForCallInternalFunction(callInternalFunctionCommand); }
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
                this.globalObject.browser.callDataDependencyEstablishedCallbacks(callExpression, args[i], evaluationPosition);
            }
        }
    },

    _createSimpleDependenciesForCallInternalFunction: function(callInternalFunctionCommand)
    {
        var callExpression = callInternalFunctionCommand.codeConstruct;

        //Callback function called with an internal function
        if(callExpression == null) { return; }

        var args = callExpression.arguments;

        this._createSimpleDependency(callExpression, callExpression.callee);

        if(callInternalFunctionCommand.isCall || callInternalFunctionCommand.isApply)
        {
            this._createSimpleDependenciesToCallApplyInternalFunctionCall(callInternalFunctionCommand, args, callExpression);
        }
        else
        {
            if(args == null) { return; }

            for(var i = 0, length = args.length; i < length; i++)
            {
                var argument = args[i];
                this._createSimpleDependency(callExpression, argument);
                this._createSimpleDependency(argument, callExpression);
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

    _createSimpleDependenciesToCallApplyInternalFunctionCall: function(callInternalFunctionCommand, args, callExpression)
    {
        if(callInternalFunctionCommand.isCall)
        {
            for(var i = 1, length = arguments.length; i < length; i++)
            {
                this._createSimpleDependency(callExpression, args[i]);
            }
        }
        else
        {
            var secondArgumentValue = this.executionContextStack.getExpressionValue(args[1]);

            if(secondArgumentValue != null && ValueTypeHelper.isArray(secondArgumentValue.jsValue))
            {
                for(var i = 0; i < secondArgumentValue.jsValue.length; i++)
                {
                    this._createSimpleDependency(callExpression, secondArgumentValue.jsValue[i].codeConstruct);
                }
            }
        }
    },

    createCallbackFunctionCommandDependencies: function(evalCallbackFunctionCommand)
    {
        if(fcSimulator.DependencyCreator.shouldCreateSimpleDependencies) { this._createSimpleCallbackFunctionCommandDependencies(evalCallbackFunctionCommand); }
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }

        var parentInitCallbackCommand = evalCallbackFunctionCommand.parentInitCallbackCommand;
        var callExpression = parentInitCallbackCommand.codeConstruct;
        var args = callExpression.arguments;

        var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

        for(var i = 0; i < args.length; i++)
        {
            this.globalObject.browser.callDataDependencyEstablishedCallbacks(args[i], callExpression, evaluationPosition);
        }
    },

    _createSimpleCallbackFunctionCommandDependencies: function(evalCallbackFunctionCommand)
    {
        var parentInitCallbackCommand = evalCallbackFunctionCommand.parentInitCallbackCommand;
        var callExpression = parentInitCallbackCommand.codeConstruct;
        var args = callExpression.arguments;

        for(var i = 0; i < args.length; i++)
        {
            this._createSimpleDependency(args[i], callExpression);
        }
    },

    createSequenceExpressionDependencies: function(sequenceExpression, lastExpression)
    {
        if(fcSimulator.DependencyCreator.shouldCreateSimpleDependencies) { this._createSimpleSequenceExpressionDependencies(sequenceExpression, lastExpression); }
        if(!fcSimulator.DependencyCreator.shouldCreateDependencies) { return; }

        this.globalObject.browser.callDataDependencyEstablishedCallbacks
        (
            sequenceExpression,
            lastExpression,
            this.globalObject.getPreciseEvaluationPositionId()
        );
    },

    _createSimpleSequenceExpressionDependencies: function(sequenceExpression, lastExpression)
    {
        this._createSimpleDependency(sequenceExpression, lastExpression);
    },

    _createSimpleDependency: function(fromConstruct, toConstruct)
    {
        if(fromConstruct == null || toConstruct == null) { return; }

        this.globalObject.simpleDependencyEstablished(fromConstruct, toConstruct);
    }
};
/*************************************************************************************/
}});