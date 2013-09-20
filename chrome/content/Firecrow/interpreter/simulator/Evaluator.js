FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;
var fcSimulator = Firecrow.Interpreter.Simulator;
var fcModel = Firecrow.Interpreter.Model;
var fcSymbolic = Firecrow.ScenarioGenerator.Symbolic;

fcSimulator.Evaluator = function(executionContextStack)
{
    try
    {
        this.executionContextStack = executionContextStack;
        this.globalObject = executionContextStack.globalObject;
        this.dependencyCreator = new fcSimulator.DependencyCreator(this.globalObject, this.executionContextStack);

        this.exceptionCallbacks = [];
    }
    catch(e) { fcSimulator.Evaluator.notifyError("Error when constructing evaluator: " + e);}
};

fcSimulator.Evaluator.notifyError = function(message) { alert("Evaluator - " + message); };

fcSimulator.Evaluator.prototype =
{
    registerExceptionCallback: function(callback, thisObject)
    {
        try
        {
            if(!ValueTypeHelper.isFunction(callback)) { this.notifyError(null, "Exception callback has to be a function!"); return; }

            this.exceptionCallbacks.push({callback: callback, thisObject: thisObject || this});
        }
        catch(e) { this.notifyError(null, "Error when registering exception callback:" + e);}
    },

    evaluateCommand: function(command)
    {
        try
        {
                 if (command.isEvalIdentifierCommand()) { this._evalIdentifierCommand(command); }
            else if (command.isEvalAssignmentExpressionCommand()) { this._evalAssignmentCommand(command); }
            else if (command.isEvalMemberExpressionCommand()) { this._evalMemberCommand(command); }
            else if (command.isEvalMemberExpressionPropertyCommand()) { this._evalMemberPropertyCommand(command); }
            else if (command.isThisExpressionCommand()) { this._evalThisCommand(command); }
            else if (command.isDeclareVariableCommand()) { this._evalDeclareVariableCommand(command); }
            else if (command.isDeclareFunctionCommand()) { this._evalDeclareFunctionCommand(command); }
            else if (command.isEvalLiteralCommand()) { this._evalLiteralCommand(command); }
            else if (command.isEvalRegExCommand()) { this._evalRegExLiteralCommand(command);}
            else if (command.isEvalUpdateExpressionCommand()) { this._evalUpdateCommand(command); }
            else if (command.isEvalUnaryExpressionCommand()) { this._evalUnaryExpression(command); }
            else if (command.isEvalBinaryExpressionCommand()) { this._evalBinaryCommand(command); }
            else if (command.isEvalLogicalExpressionItemCommand()) { this._evalLogicalItemCommand(command);}
            else if (command.isEndLogicalExpressionCommand()) { this._evalEndLogicalCommand(command); }
            else if (command.isEvalReturnExpressionCommand()) { this._evalReturnCommand(command); }
            else if (command.isObjectExpressionCommand()) { this._evalObjectCommand(command); }
            else if (command.isObjectPropertyCreationCommand()) { this._evalObjectPropertyCreationCommand(command);}
            else if (command.isArrayExpressionCommand()) { this._evalArrayExpressionCommand(command);}
            else if (command.isArrayExpressionItemCreationCommand()) { this._evalArrayExpressionItemCreationCommand(command);}
            else if (command.isFunctionExpressionCreationCommand()) { this._evalFunctionExpressionCreationCommand(command); }
            else if (command.isEvalForInWhereCommand()) { this._evalForInWhereCommand(command); }
            else if (command.isEndEvalConditionalExpressionCommand()) { this._evalConditionalCommand(command);}
            else if (command.isStartCatchStatementCommand()) { this._evalStartCatchStatementCommand(command);}
            else if (command.isEndCatchStatementCommand()) { this._evalEndCatchCommand(command);}
            else if (command.isCallInternalFunctionCommand()) { this._evalCallInternalFunction(command); }
            else if (command.isEvalCallbackFunctionCommand()) { this._evalCallbackFunctionCommand(command); }
            else if (command.isEvalSequenceExpressionCommand()) { this._evalSequence(command); }
            else
            {
                this.notifyError(command, "Evaluator: Still not handling command of type: " +  command.type); return;
            }
        }
        catch(e)
        {
            this.notifyError(command, "An error occurred when evaluating command: " + e + " " + e.fileName + " " + e.lineNumber);
        }
    },

    evalBreakContinueCommand: function(breakContinueCommand)
    {
        try
        {
            this.dependencyCreator.addDependenciesToTopBlockConstructs(breakContinueCommand.codeConstruct);
            this.globalObject.browser.callBreakContinueReturnEventCallbacks(breakContinueCommand.codeConstruct, this.globalObject.getPreciseEvaluationPositionId());

            this.globalObject.browser.logConstructExecuted(breakContinueCommand.codeConstruct);
        }
        catch(e) { this.notifyError(breakContinueCommand, "Error when evaluating break or continue command: " + e);}
    },

    _evalDeclareVariableCommand: function(declareVariableCommand)
    {
        this.executionContextStack.registerIdentifier(declareVariableCommand.codeConstruct);

        this.globalObject.browser.logConstructExecuted(declareVariableCommand.codeConstruct);
    },

    _evalDeclareFunctionCommand: function(declareFunctionCommand)
    {
        this.executionContextStack.registerFunctionDeclaration(declareFunctionCommand.codeConstruct);

        this.globalObject.browser.logConstructExecuted(declareFunctionCommand.codeConstruct);
    },

    _evalFunctionExpressionCreationCommand: function(functionCommand)
    {
        this.executionContextStack.setExpressionValue(functionCommand.codeConstruct, this.executionContextStack.createFunctionInCurrentContext(functionCommand.codeConstruct));

        this.globalObject.browser.logConstructExecuted(functionCommand.codeConstruct);
    },

    _evalLiteralCommand: function(evalLiteralCommand)
    {
        this.executionContextStack.setExpressionValue
        (
            evalLiteralCommand.codeConstruct,
            this.globalObject.internalExecutor.createInternalPrimitiveObject(evalLiteralCommand.codeConstruct, evalLiteralCommand.codeConstruct.value)
        );

        this.globalObject.browser.logConstructExecuted(evalLiteralCommand.codeConstruct);
    },

    _evalRegExLiteralCommand: function(evalRegExCommand)
    {
        var regEx = evalRegExCommand.regExLiteral instanceof RegExp ? evalRegExCommand.regExLiteral
                                                                    : eval(evalRegExCommand.regExLiteral);

        this.executionContextStack.setExpressionValue
        (
            evalRegExCommand.codeConstruct,
            this.globalObject.internalExecutor.createRegEx(evalRegExCommand.codeConstruct, regEx)
        );

        this.globalObject.browser.logConstructExecuted(evalRegExCommand.codeConstruct);
    },

    _evalAssignmentCommand: function(assignmentCommand)
    {
        var assignmentExpression = assignmentCommand.codeConstruct;

        this.dependencyCreator.createAssignmentDependencies(assignmentCommand);

        var finalValue = this._getAssignmentValue(assignmentCommand);

        if(ASTHelper.isIdentifier(assignmentCommand.leftSide)) { this._assignToIdentifier(assignmentCommand.leftSide, finalValue, assignmentExpression); }
        else if (ASTHelper.isMemberExpression(assignmentCommand.leftSide)) { this._assignToMemberExpression(assignmentCommand.leftSide, finalValue, assignmentExpression); }

        this.executionContextStack.setExpressionValue(assignmentExpression, finalValue);

        this.globalObject.browser.logConstructExecuted(assignmentExpression);
        this.globalObject.browser.logConstructExecuted(assignmentCommand.leftSide);
    },

    _evalUpdateCommand: function(evalUpdateCommand)
    {
        var updateExpression = evalUpdateCommand.codeConstruct;
        var currentValue = this.executionContextStack.getExpressionValue(updateExpression.argument);

        if(currentValue == null || currentValue.jsValue == null) { this._callExceptionCallbacks(); return; }

        this.dependencyCreator.createUpdateExpressionDependencies(updateExpression);

        if(ASTHelper.isIdentifier(updateExpression.argument))
        {
            this._assignToIdentifier(updateExpression.argument, this._getUpdateValue(currentValue, updateExpression), updateExpression);
        }
        else if(ASTHelper.isMemberExpression(updateExpression.argument))
        {
            this._assignToMemberExpression(updateExpression.argument, this._getUpdateValue(currentValue, updateExpression), updateExpression);
        }
        else
        {
            this.notifyError(evalUpdateCommand, "Unknown code construct when updating expression!");
        }

        this.executionContextStack.setExpressionValue(updateExpression, this._getUpdatedCurrentValue(currentValue, updateExpression));

        this.globalObject.browser.logConstructExecuted(updateExpression);
        this.globalObject.browser.logConstructExecuted(updateExpression.argument);
    },

    _evalIdentifierCommand: function(identifierCommand)
    {
        var identifierConstruct = identifierCommand.codeConstruct;

        var identifier = this.executionContextStack.getIdentifier(identifierConstruct.name, identifierConstruct);
        var identifierValue = identifier != null ? identifier.value : null;

        this.executionContextStack.setExpressionValue
        (
            identifierConstruct,
            identifierValue != null && identifierValue.isPrimitive() ? identifierValue.createCopy() : identifierValue
        );

        if(identifier != null)
        {
            this.dependencyCreator.createIdentifierDependencies(identifier, identifierConstruct, this.globalObject.getPreciseEvaluationPositionId());
            this._checkSlicing(identifierConstruct);
        }

        this.globalObject.browser.logConstructExecuted(identifierConstruct);
    },

    _evalMemberCommand: function(memberCommand)
    {
        var memberExpression = memberCommand.codeConstruct;

        var object = this.executionContextStack.getExpressionValue(memberExpression.object);

        if(object == null || (object.jsValue == null && object != this.globalObject)) { this._callExceptionCallbacks(); return; }

        var property = this.executionContextStack.getExpressionValue(memberExpression.property);
        var propertyValue = this._getPropertyValue(object, property, memberExpression);

        this.dependencyCreator.createMemberExpressionDependencies(object, property, propertyValue, memberExpression);

        this.executionContextStack.setExpressionValue(memberExpression, propertyValue);

        var propertyObject = object.iValue.getProperty(property.jsValue);

        if(propertyObject == null || propertyObject.modificationContext != this.executionContextStack.activeContext)
        {
            var creationConstructId = object.iValue.creationCodeConstruct != null ? object.iValue.creationCodeConstruct.nodeId : -1;
            this.globalObject.browser.logReadingObjectPropertyOutsideCurrentScope(creationConstructId, property.jsValue, memberExpression);
        }

        this.globalObject.browser.logConstructExecuted(memberExpression);
    },

    _evalMemberPropertyCommand: function(memberPropertyCommand)
    {
        var memberExpression = memberPropertyCommand.codeConstruct;
        var property = memberExpression.property;

        this.executionContextStack.setExpressionValue
        (
            property,
            memberExpression.computed ? this.executionContextStack.getExpressionValue(property)
                                      : this.globalObject.internalExecutor.createInternalPrimitiveObject(property, property.name)
        );

        this.globalObject.browser.logConstructExecuted(property);
    },

    _evalThisCommand: function(thisCommand)
    {
        this.executionContextStack.setExpressionValue(thisCommand.codeConstruct, this.executionContextStack.activeContext.thisObject);

        this.globalObject.browser.logConstructExecuted(thisCommand.codeConstruct);
    },

    _evalUnaryExpression: function(unaryCommand)
    {
        var unaryExpression = unaryCommand.codeConstruct;
        var argumentValue = this.executionContextStack.getExpressionValue(unaryExpression.argument);

        if(argumentValue == null && unaryExpression.operator != "typeof") { this._callExceptionCallbacks(); return; }

        this.dependencyCreator.createDataDependency(unaryExpression, unaryExpression.argument);

        var expressionValue = null;

        if (unaryExpression.operator == "-") { expressionValue = -argumentValue.jsValue; }
        else if (unaryExpression.operator == "+") { expressionValue = +argumentValue.jsValue; }
        else if (unaryExpression.operator == "!") { expressionValue = !argumentValue.jsValue; }
        else if (unaryExpression.operator == "~") { expressionValue = ~argumentValue.jsValue; }
        else if (unaryExpression.operator == "typeof") { expressionValue = argumentValue == null ? "undefined" : typeof argumentValue.jsValue; }
        else if (unaryExpression.operator == "void") { expressionValue = void argumentValue.jsValue;}
        else if (unaryExpression.operator == "delete") { expressionValue = this._evalDeleteExpression(unaryExpression); }

        this.executionContextStack.setExpressionValue(unaryExpression, this.globalObject.internalExecutor.createInternalPrimitiveObject(unaryExpression, expressionValue));

        this.globalObject.browser.logConstructExecuted(unaryExpression);
    },

    _evalBinaryCommand: function(binaryCommand)
    {
        var binaryExpression = binaryCommand.codeConstruct;

        this.dependencyCreator.createBinaryExpressionDependencies(binaryExpression);

        var leftValue = this.executionContextStack.getExpressionValue(binaryExpression.left);
        var rightValue = this.executionContextStack.getExpressionValue(binaryExpression.right);

        if(leftValue == null) { this._callExceptionCallbacks(); return; }
        if(rightValue == null) { this._callExceptionCallbacks(); return; }

        if(binaryExpression.operator == "in")
        {
            this.dependencyCreator.createBinaryExpressionInDependencies(binaryExpression, rightValue, leftValue);
        }

        var result = this._evalBinaryExpression(leftValue, rightValue, binaryExpression.operator);

        this.executionContextStack.setExpressionValue
        (
            binaryExpression,
            this.globalObject.internalExecutor.createInternalPrimitiveObject
            (
                binaryExpression,
                result,
                fcSymbolic.SymbolicExecutor.evalBinaryExpression(leftValue, rightValue, binaryExpression.operator)
            )
        );

        this.globalObject.browser.logConstructExecuted(binaryExpression);
    },

    _evalReturnCommand: function(returnCommand)
    {
        this.dependencyCreator.createReturnDependencies(returnCommand);

        this.globalObject.browser.logConstructExecuted(returnCommand.codeConstruct);
        this.globalObject.browser.callBreakContinueReturnEventCallbacks
        (
            returnCommand.codeConstruct,
            this.globalObject.getPreciseEvaluationPositionId(),
            returnCommand.parentFunctionCommand && returnCommand.parentFunctionCommand.isExecuteCallbackCommand()
        );

        //If return is in event handler function
        if(returnCommand.parentFunctionCommand == null)
        {
            return;
        }

        returnCommand.parentFunctionCommand.executedReturnCommand = returnCommand;

        var returnValue = this.executionContextStack.getExpressionValue(returnCommand.codeConstruct.argument);

        if(returnCommand.parentFunctionCommand.isExecuteCallbackCommand())
        {
            this._handleReturnFromCallbackFunction(returnCommand);
        }
        else if (returnCommand.parentFunctionCommand.isEvalNewExpressionCommand()
             && (returnValue.isPrimitive() || returnValue.jsValue == null))
        {
            //DO NOTHING, should only write if returnValue is not a primitive
        }
        else
        {
            this.executionContextStack.setExpressionValueInPreviousContext
            (
                returnCommand.parentFunctionCommand.codeConstruct,
                returnCommand.codeConstruct.argument != null ? returnValue
                                                             : null
            );
        }
    },

    _evalArrayExpressionCommand: function(arrayExpressionCommand)
    {
        var newArray = this.globalObject.internalExecutor.createArray(arrayExpressionCommand.codeConstruct);

        this.executionContextStack.setExpressionValue(arrayExpressionCommand.codeConstruct, newArray);

        arrayExpressionCommand.createdArray = newArray;

        this.globalObject.browser.logConstructExecuted(arrayExpressionCommand.codeConstruct);
    },

    _evalArrayExpressionItemCreationCommand: function(arrayItemCreationCommand)
    {
        var array = arrayItemCreationCommand.arrayExpressionCommand.createdArray;

        if(array == null || array.jsValue == null) { this.notifyError(arrayItemCreationCommand, "When evaluating array expression item the array must not be null!");  return; }

        var expressionItemValue = this.executionContextStack.getExpressionValue(arrayItemCreationCommand.codeConstruct);

        array.iValue.push(array.jsValue, expressionItemValue, arrayItemCreationCommand.codeConstruct);

        this.dependencyCreator.createDataDependency(arrayItemCreationCommand.arrayExpressionCommand.codeConstruct, arrayItemCreationCommand.codeConstruct, this.globalObject.getPreciseEvaluationPositionId());

        this.globalObject.browser.logConstructExecuted(arrayItemCreationCommand.codeConstruct);
    },

    _evalObjectCommand: function(objectCommand)
    {
        var newObject = this.globalObject.internalExecutor.createObject(null, objectCommand.codeConstruct);

        this.executionContextStack.setExpressionValue(objectCommand.codeConstruct, newObject);

        objectCommand.createdObject = newObject;

        this.globalObject.browser.logConstructExecuted(objectCommand.codeConstruct);
    },

    _evalObjectPropertyCreationCommand: function(objectPropertyCreationCommand)
    {
        var object = objectPropertyCreationCommand.objectExpressionCommand.createdObject;

        if(object == null || object.jsValue == null) { this.notifyError(objectPropertyCreationCommand, "When evaluating object property the object must not be null!");  return; }

        var propertyCodeConstruct = objectPropertyCreationCommand.codeConstruct;

        var propertyValue = this.executionContextStack.getExpressionValue(propertyCodeConstruct.value);
        propertyValue = propertyValue.isPrimitive() ? propertyValue.createCopy(propertyCodeConstruct) : propertyValue;
        var propertyKey = ASTHelper.isLiteral(propertyCodeConstruct.key) ? propertyCodeConstruct.key.value
                                                                         : propertyCodeConstruct.key.name;

        object.jsValue[propertyKey] = propertyValue;
        object.iValue.addProperty(propertyKey, propertyValue, objectPropertyCreationCommand.codeConstruct);

        this.globalObject.browser.logConstructExecuted(propertyCodeConstruct);
        this.globalObject.browser.logConstructExecuted(propertyCodeConstruct.key);
        this.globalObject.browser.logConstructExecuted(propertyCodeConstruct.key.value);
    },

    _evalConditionalCommand: function(conditionalCommand)
    {
        this.executionContextStack.setExpressionValue(conditionalCommand.codeConstruct, this.executionContextStack.getExpressionValue(conditionalCommand.startCommand.body));

        this.dependencyCreator.createDependenciesForConditionalCommand(conditionalCommand);

        this.globalObject.browser.logConstructExecuted(conditionalCommand.codeConstruct);
    },

    _evalForInWhereCommand: function(forInWhereCommand)
    {
        var forInWhereConstruct = forInWhereCommand.codeConstruct;

        var whereObject = this.executionContextStack.getExpressionValue(forInWhereConstruct.right);

        if(whereObject.iValue == null) { forInWhereCommand.willBodyBeExecuted = false; return; }

        if(!forInWhereCommand.propertyNames)
        {
            var isFirstIteration = true;
            forInWhereCommand.propertyNames = whereObject.iValue.getPropertyNames();
        }

        this._logForInIteration(forInWhereCommand, whereObject.iValue, isFirstIteration);

        while(forInWhereCommand.propertyNames.length > 0 && !propertyValue)
        {
            var nextPropertyNameString = forInWhereCommand.propertyNames[0];
            ValueTypeHelper.removeFromArrayByIndex(forInWhereCommand.propertyNames, 0);

            var propertyValue = whereObject.iValue.getPropertyValue(nextPropertyNameString);
        }

        forInWhereCommand.willBodyBeExecuted = !!propertyValue;

        if(!propertyValue) { return; }

        var nextPropertyName = this.globalObject.internalExecutor.createInternalPrimitiveObject(forInWhereConstruct.left, nextPropertyNameString);

        this.dependencyCreator.createDependenciesInForInWhereCommand(forInWhereConstruct, whereObject, nextPropertyName, isFirstIteration);

        if(ASTHelper.isIdentifier(forInWhereConstruct.left))
        {
            this.executionContextStack.setIdentifierValue(forInWhereConstruct.left.name, nextPropertyName, forInWhereConstruct.left);
        }
        else if (ASTHelper.isVariableDeclaration(forInWhereConstruct.left))
        {
            var declarator = forInWhereConstruct.left.declarations[0];

            this.executionContextStack.setIdentifierValue(declarator.id.name, nextPropertyName, declarator);
        }
        else { this.notifyError(forInWhereCommand, "Unknown forIn left statement"); }

        this.globalObject.browser.logConstructExecuted(forInWhereConstruct);
    },

    _evalStartCatchStatementCommand: function(startCatchCommand)
    {
        this.executionContextStack.setIdentifierValue(startCatchCommand.codeConstruct.param.name, startCatchCommand.exceptionArgument);

        this.globalObject.browser.logConstructExecuted(startCatchCommand.codeConstruct);
    },

    _evalEndCatchCommand: function(endCatchCommand)
    {
        this.executionContextStack.deleteIdentifier(endCatchCommand.codeConstruct.param.name);
    },

    _evalLogicalItemCommand: function(evalLogicalItemCommand)
    {
        var parentExpressionCommand = evalLogicalItemCommand.parentLogicalExpressionCommand;

        var wholeLogicalExpression = parentExpressionCommand.codeConstruct;
        var logicalExpressionItem = evalLogicalItemCommand.codeConstruct;

        evalLogicalItemCommand.parentEndLogicalExpressionCommand.executedLogicalItemExpressionCommands.push(evalLogicalItemCommand);

        if(logicalExpressionItem == wholeLogicalExpression.left)
        {
            var value = this.executionContextStack.getExpressionValue(logicalExpressionItem);

            this.executionContextStack.setExpressionValue(wholeLogicalExpression, value);

            evalLogicalItemCommand.shouldDeleteFollowingLogicalCommands = this._isLogicalExpressionDoneWithEvaluation(value, wholeLogicalExpression.operator);
        }
        else if(logicalExpressionItem == wholeLogicalExpression.right)
        {
            this.executionContextStack.setExpressionValue(wholeLogicalExpression, this._getLogicalExpressionValue(wholeLogicalExpression));

            this.dependencyCreator.createDependenciesForLogicalExpressionItemCommand(wholeLogicalExpression);
        }
        else { this.notifyError(evalLogicalItemCommand, "The expression item is neither left nor right expression"); return; }

        this.globalObject.browser.logConstructExecuted(logicalExpressionItem);
    },

    _evalEndLogicalCommand: function(endLogicalCommand)
    {
        this.dependencyCreator.createDependenciesForLogicalExpression(endLogicalCommand);

        var logicalExpression = endLogicalCommand.codeConstruct;
        var logicalExpressionValue = this.executionContextStack.getExpressionValue(logicalExpression);

        if(logicalExpressionValue != null)
        {
            var executedLogicalItemCommands = endLogicalCommand.executedLogicalItemExpressionCommands;

            if(executedLogicalItemCommands.length == 0) { alert("There are no executed logical commands"); return; }

            logicalExpressionValue.symbolicValue = fcSymbolic.SymbolicExecutor.evalLogicalExpression
            (
                executedLogicalItemCommands[0] != null ?  this.executionContextStack.getExpressionValue(executedLogicalItemCommands[0].codeConstruct) : null,
                executedLogicalItemCommands[1] != null ?  this.executionContextStack.getExpressionValue(executedLogicalItemCommands[1].codeConstruct) : null,
                logicalExpression.operator
            );
        }

        this.globalObject.browser.logConstructExecuted(logicalExpression);
    },

    _evalCallInternalFunction: function(callInternalFunctionCommand)
    {
        this.dependencyCreator.createDependenciesForCallInternalFunction(callInternalFunctionCommand);

        this.executionContextStack.setExpressionValue
        (
            callInternalFunctionCommand.codeConstruct,
            this.globalObject.internalExecutor.executeFunction
            (
                this._getThisObjectFromCallInternalFunctionCommand(callInternalFunctionCommand),
                callInternalFunctionCommand.functionObject,
                this._getArgumentsFromInternalFunctionCall
                (
                    callInternalFunctionCommand,
                    callInternalFunctionCommand.codeConstruct != null ? callInternalFunctionCommand.codeConstruct.arguments
                                                                      : []
                ),
                callInternalFunctionCommand.codeConstruct,
                callInternalFunctionCommand
            )
        );

        this.globalObject.browser.logConstructExecuted(callInternalFunctionCommand.codeConstruct);
    },

    _evalCallbackFunctionCommand: function(callbackFunctionCommand)
    {
        this.dependencyCreator.createCallbackFunctionCommandDependencies(callbackFunctionCommand);

        this.globalObject.logCallbackExecution
        (
            callbackFunctionCommand.codeConstruct,
            callbackFunctionCommand.parentInitCallbackCommand != null ? callbackFunctionCommand.parentInitCallbackCommand.codeConstruct
                                                                      : null
        );

        if(callbackFunctionCommand.isLastCallbackCommand)
        {
            this.globalObject.browser.logEndExecutingCallbacks(callbackFunctionCommand.codeConstruct);
        }
    },

    _evalSequence: function(sequenceCommand)
    {
        var sequenceExpression = sequenceCommand.codeConstruct;
        var lastExpression = sequenceExpression.expressions[sequenceExpression.expressions.length - 1];

        this.executionContextStack.setExpressionValue(sequenceExpression, this.executionContextStack.getExpressionValue(lastExpression));

        this.dependencyCreator.createSequenceExpressionDependencies(sequenceExpression, lastExpression);

        this.globalObject.browser.logConstructExecuted(sequenceExpression);
    },

    _getAssignmentValue: function(assignmentCommand)
    {
        var finalValue = null;
        var operator = assignmentCommand.operator;

        if(operator === "=") { finalValue = this.executionContextStack.getExpressionValue(assignmentCommand.rightSide); }
        else
        {
            var leftValue = this.executionContextStack.getExpressionValue(assignmentCommand.leftSide);
            var rightValue = this.executionContextStack.getExpressionValue(assignmentCommand.rightSide);

            var result = null;

                 if (operator == "+=") { result = leftValue.jsValue + rightValue.jsValue; }
            else if (operator == "-=") { result = leftValue.jsValue - rightValue.jsValue; }
            else if (operator == "*=") { result = leftValue.jsValue * rightValue.jsValue; }
            else if (operator == "/=") { result = leftValue.jsValue / rightValue.jsValue; }
            else if (operator == "%=") { result = leftValue.jsValue % rightValue.jsValue; }
            else if (operator == "<<=") { result = leftValue.jsValue << rightValue.jsValue; }
            else if (operator == ">>=") { result = leftValue.jsValue >> rightValue.jsValue; }
            else if (operator == ">>>=") { result = leftValue.jsValue >>> rightValue.jsValue; }
            else if (operator == "|=") { result = leftValue.jsValue | rightValue.jsValue; }
            else if (operator == "^=") { result = leftValue.jsValue ^ rightValue.jsValue; }
            else if (operator == "&=") { result = leftValue.jsValue & rightValue.jsValue; }
            else { this.notifyError(assignmentCommand, "jsValue assignment operator!"); return; }

            finalValue = this.globalObject.internalExecutor.createInternalPrimitiveObject(assignmentCommand.codeConstruct, result);
        }

        return finalValue.isPrimitive() ? finalValue.createCopy(assignmentCommand.rightSide) : finalValue;
    },

    _assignToIdentifier: function(identifier, finalValue, assignmentExpression)
    {
        if(this.globalObject.satisfiesIdentifierSlicingCriteria(identifier))
        {
            this.globalObject.browser.callImportantConstructReachedCallbacks(identifier);
        }

        this.executionContextStack.setIdentifierValue(identifier.name, finalValue, assignmentExpression);
    },

    _assignToMemberExpression: function(memberExpression, finalValue, assignmentExpression)
    {
        var object = this.executionContextStack.getExpressionValue(memberExpression.object);
        var property = this.executionContextStack.getExpressionValue(memberExpression.property);

        if(object == null || (object.jsValue == null && object != this.globalObject)) { this._callExceptionCallbacks(); return; }

        if (this._hasAddJsPropertyFunction(object))
        {
            object.iValue.addJsProperty(property.jsValue, finalValue, assignmentExpression);
        }
        else
        {
            object.iValue.addProperty(property.jsValue, finalValue, assignmentExpression, true);
            object.jsValue[property.jsValue] = finalValue;
        }

        if(property.jsValue == "__proto__" || property.jsValue == "prototype")
        {
            object.jsValue[property.jsValue] = finalValue.jsValue;
        }

        var newProperty = object.iValue.getProperty(property.jsValue);

        if(newProperty != null)
        {
            newProperty.modificationContext = this.executionContextStack.activeContext;
        }

        if(object.iValue.creationContext != this.executionContextStack.activeContext)
        {
            //TODO HOW DO I UNIQUELY DIFFERENTIATE BETWEEN OBJECTS!?
            var objectCreationConstructId = object.iValue.creationCodeConstruct != null ? object.iValue.creationCodeConstruct.nodeId : -1;
            this.globalObject.browser.logModifyingExternalContextObject(objectCreationConstructId, property.jsValue);
        }
    },

    _hasAddJsPropertyFunction: function(object)
    {
        return object != null && object.iValue != null && object.iValue.addJsProperty != null;
    },

    _getUpdateValue: function(currentValue, updateExpression)
    {
        var result = updateExpression.operator == "++" ? currentValue.jsValue + 1 : currentValue.jsValue - 1;
        return this.globalObject.internalExecutor.createInternalPrimitiveObject(updateExpression, result);
    },

    _getUpdatedCurrentValue:function(currentValue, updateExpression)
    {
        var result = updateExpression.prefix ? updateExpression.operator == "++" ? ++currentValue.jsValue : --currentValue.jsValue
                                             : updateExpression.operator == "++" ? currentValue.jsValue++ : currentValue.jsValue--;

        return this.globalObject.internalExecutor.createInternalPrimitiveObject(updateExpression, result);
    },

    _checkSlicing: function(identifierConstruct)
    {
        if(this.globalObject.satisfiesIdentifierSlicingCriteria(identifierConstruct))
        {
            this.globalObject.browser.callImportantConstructReachedCallbacks(identifierConstruct);
        }
    },

    _evalBinaryExpression: function(leftValue, rightValue, operator)
    {
             if (operator == "==") { return leftValue.jsValue == rightValue.jsValue;}
        else if (operator == "!=") { return leftValue.jsValue != rightValue.jsValue; }
        else if (operator == "===") { return leftValue.jsValue === rightValue.jsValue; }
        else if (operator == "!==") { return leftValue.jsValue !== rightValue.jsValue; }
        else if (operator == "<") { return leftValue.jsValue < rightValue.jsValue; }
        else if (operator == "<=") { return leftValue.jsValue <= rightValue.jsValue; }
        else if (operator == ">") { return leftValue.jsValue > rightValue.jsValue; }
        else if (operator == ">=") { return leftValue.jsValue >= rightValue.jsValue; }
        else if (operator == "<<") { return leftValue.jsValue << rightValue.jsValue; }
        else if (operator == ">>") { return leftValue.jsValue >> rightValue.jsValue; }
        else if (operator == ">>>") { return leftValue.jsValue >>> rightValue.jsValue; }
        else if (operator == "-") { return leftValue.jsValue - rightValue.jsValue; }
        else if (operator == "*") { return leftValue.jsValue * rightValue.jsValue; }
        else if (operator == "/") { return leftValue.jsValue / rightValue.jsValue; }
        else if (operator == "%") { return leftValue.jsValue % rightValue.jsValue; }
        else if (operator == "|") { return leftValue.jsValue | rightValue.jsValue; }
        else if (operator == "^") { return leftValue.jsValue ^ rightValue.jsValue; }
        else if (operator == "&") { return leftValue.jsValue & rightValue.jsValue; }
        else if (operator == "in") { return leftValue.jsValue in rightValue.jsValue; }
        else if (operator == "+") { return this._evalAdd(leftValue.jsValue, rightValue.jsValue); }
        else if (operator == "instanceof") { return this._evalInstanceOf(leftValue, rightValue);}
        else { this.notifyError(null, "Unknown operator when evaluating binary expression"); return; }
    },

    _evalAdd: function(leftValue, rightValue)
    {
        if(ValueTypeHelper.arePrimitive(leftValue, rightValue))
        {
            return leftValue + rightValue;
        }

        //TODO - this needs more tests!
        if(typeof leftValue== "object" && !(leftValue instanceof String) && leftValue != null
       || (typeof rightValue== "object" && !(rightValue instanceof String) && rightValue != null))
        {
            //TODO - temp jQuery hack
            if(ValueTypeHelper.isArray(leftValue) && ValueTypeHelper.isArray(rightValue))
            {
                return this.globalObject.getJsValues(leftValue).join("")
                     + this.globalObject.getJsValues(rightValue).join("")
            }
            else if (ValueTypeHelper.isObject(rightValue) || ValueTypeHelper.isObject(leftValue))
            {
                console.log("Concatenating strings from object!");
                return leftValue + rightValue;
            }
            else
            {
                this.notifyError(null, "Still not handling implicit toString conversion in binary expression!");
                return null;
            }
        }

        return null;
    },

    _evalInstanceOf: function(leftValue, rightValue)
    {
        var compareWith = null;

        if(rightValue == this.globalObject.arrayFunction || rightValue.jsValue == this.globalObject.arrayFunction) { compareWith = Array; }
        else if (rightValue == this.globalObject.stringFunction || rightValue.jsValue == this.globalObject.stringFunction) { compareWith = String; }
        else if (rightValue == this.globalObject.regExFunction || rightValue.jsValue == this.globalObject.regExFunction) { compareWith = RegExp; }
        else if (rightValue.jsValue != undefined) { compareWith = rightValue.jsValue; }
        else { this.notifyError(null, "Unhandled instanceof"); }

        return leftValue.jsValue instanceof compareWith;
    },

    _handleReturnFromCallbackFunction: function(returnCommand)
    {
        var executeCallbackCommand = returnCommand.parentFunctionCommand;
        var returnArgument = returnCommand.codeConstruct.argument;

        if(ValueTypeHelper.isArray(executeCallbackCommand.originatingObject.jsValue)
        || ValueTypeHelper.isArrayLike(executeCallbackCommand.originatingObject.jsValue))
        {
            fcModel.ArrayCallbackEvaluator.evaluateCallbackReturn
            (
                executeCallbackCommand,
                returnArgument != null ? this.executionContextStack.getExpressionValue(returnArgument)
                                       : null,
                returnCommand.codeConstruct
            );
        }
        else if(ValueTypeHelper.isString(executeCallbackCommand.originatingObject.jsValue))
        {
            fcModel.StringExecutor.evaluateCallbackReturn
            (
                executeCallbackCommand,
                returnArgument != null ? this.executionContextStack.getExpressionValue(returnArgument)
                                       : null,
                returnCommand.codeConstruct,
                this.globalObject
            );
        }
        else { this.notifyError(returnCommand, "Unhandled callback function"); }
    },

    _getPropertyValue: function(object, property, memberExpression)
    {
        try
        {
            var propertyValue = object.iValue.getJsPropertyValue(property.jsValue, memberExpression);
        }
        catch(e) { debugger; }


        if(!ValueTypeHelper.isOfType(propertyValue, fcModel.fcValue) && propertyValue != this.globalObject)
        {
            if(propertyValue != null && propertyValue.fcValue != null && !ValueTypeHelper.isPrimitive(propertyValue)) { propertyValue = propertyValue.fcValue; }
            else if (ValueTypeHelper.isPrimitive(propertyValue)) { propertyValue = this.globalObject.internalExecutor.createInternalPrimitiveObject(memberExpression, propertyValue);}
            else { this.notifyError(null, "The property value should be of type JsValue"); return; }
        }

        return propertyValue;
    },

    _isLogicalExpressionDoneWithEvaluation: function(value, operator)
    {
        return  (value.jsValue && operator == "||") || (!value.jsValue && operator == "&&");
    },

    _getLogicalExpressionValue: function(wholeLogicalExpression)
    {
        var leftValue = this.executionContextStack.getExpressionValue(wholeLogicalExpression.left);
        var rightValue = this.executionContextStack.getExpressionValue(wholeLogicalExpression.right);

        if(leftValue == null || rightValue == null) { this._callExceptionCallbacks(); return; }

        var result = wholeLogicalExpression.operator == "&&" ? leftValue.jsValue && rightValue.jsValue
                                                             : leftValue.jsValue || rightValue.jsValue;

        return ValueTypeHelper.isPrimitive(result) ? this.globalObject.internalExecutor.createInternalPrimitiveObject(wholeLogicalExpression, result)
                                                   : result === leftValue.jsValue ? leftValue : rightValue;
    },

    _evalDeleteExpression: function(deleteExpression)
    {
        if(ASTHelper.isIdentifier(deleteExpression.argument))
        {
            this.executionContextStack.deleteIdentifier(deleteExpression.argument.name);
            return true;
        }
        else if(ASTHelper.isMemberExpression(deleteExpression.argument))
        {
            var object = this.executionContextStack.getExpressionValue(deleteExpression.argument.object);

            if(object == null) { this._callExceptionCallbacks(); return; }

            var propertyName = "";

            if(deleteExpression.argument.computed)
            {
                var propertyValue = this.executionContextStack.getExpressionValue(deleteExpression.argument.property);
                propertyName = propertyValue != null ? propertyValue.jsValue : "";
            }
            else
            {
                propertyName = deleteExpression.argument.property.name;
            }

            object.iValue.deleteProperty(propertyName, deleteExpression);
            return delete object.jsValue[propertyName];
        }

        return false;
    },

    _getThisObjectFromCallInternalFunctionCommand: function(callInternalFunctionCommand)
    {
        return callInternalFunctionCommand.isCall || callInternalFunctionCommand.isApply
            ? this.executionContextStack.getExpressionValue(callInternalFunctionCommand.codeConstruct.arguments[0])
            : callInternalFunctionCommand.thisObject;
    },

    _getArgumentsFromInternalFunctionCall: function(callInternalFunctionCommand, callExpressionArgs)
    {
        if(callInternalFunctionCommand.isCall)
        {
            return this.executionContextStack.getExpressionsValues(ValueTypeHelper.getWithoutFirstElement(callExpressionArgs));
        }

        if(callInternalFunctionCommand.isApply)
        {
            var secondArgumentValue = this.executionContextStack.getExpressionValue(callExpressionArgs[1]);

            return secondArgumentValue != null && secondArgumentValue.jsValue != null ? secondArgumentValue.jsValue : [];
        }
        return callExpressionArgs == null ? [] : this.executionContextStack.getExpressionsValues(callExpressionArgs);
    },

    _logForInIteration: function(forInWhereCommand, whereObject, isFirstIteration)
    {
        if(forInWhereCommand == null || !isFirstIteration || whereObject == null) { return; }

        this.globalObject.logForInIteration(forInWhereCommand.codeConstruct, whereObject.proto);
    },

    _callExceptionCallbacks: function(exceptionInfo)
    {
        this.exceptionCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, exceptionInfo);
        });
    },

    notifyError: function(command, message)
    {
        debugger;
        fcSimulator.Evaluator.notifyError(message + "@" + (command != null ? (command.codeConstruct.loc.source + " - Ln:" + command.codeConstruct.loc.start.line) : ""));
    }
};
}});