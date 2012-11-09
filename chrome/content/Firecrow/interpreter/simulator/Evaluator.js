FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;
var fcSimulator = Firecrow.Interpreter.Simulator;
var fcModel = Firecrow.Interpreter.Model;

fcSimulator.Evaluator = function(executionContextStack)
{
    try
    {
        this.executionContextStack = executionContextStack;
        this.globalObject = executionContextStack.globalObject;
        this.dependencyCreator = new fcSimulator.DependencyCreator(this.globalObject, executionContextStack);

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
            if(!ValueTypeHelper.isOfType(callback, Function)) { this.notifyError(null, "Exception callback has to be a function!"); return; }

            this.exceptionCallbacks.push({callback: callback, thisObject: thisObject || this});
        }
        catch(e) { this.notifyError(null, "Error when registering exception callback:" + e);}
    },

    evaluateCommand: function(command)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(command, Firecrow.Interpreter.Commands.Command)) { this.notifyError(command, "When evaluating the argument has to be of type command"); return; }

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
        catch(e) { this.notifyError(command, "An error occurred when evaluating command: " + e);}
    },

    evalBreakContinueCommand: function(breakContinueCommand)
    {
        try
        {
            if(breakContinueCommand == null || (!breakContinueCommand.isEvalBreakCommand() && !breakContinueCommand.isEvalContinueCommand())) { this.notifyError(breakContinueCommand, "Should be break or continue command"); }

            this.dependencyCreator.addDependenciesToTopBlockConstructs(breakContinueCommand.codeConstruct);
            this.globalObject.browser.callImportantConstructReachedCallbacks(breakContinueCommand.codeConstruct);
        }
        catch(e) { this.notifyError(breakContinueCommand, "Error when evaluating break or continue command: " + e);}
    },

    _evalDeclareVariableCommand: function(declareVariableCommand)
    {
        if(!declareVariableCommand.isDeclareVariableCommand()) { this.notifyError(declareVariableCommand, "Argument is not a DeclareVariableCommand"); return; }

        this.executionContextStack.registerIdentifier(declareVariableCommand.codeConstruct);
    },

    _evalDeclareFunctionCommand: function(declareFunctionCommand)
    {
        if(!declareFunctionCommand.isDeclareFunctionCommand()) { this.notifyError(declareFunctionCommand, "Argument is not a DeclareFunctionCommand"); return; }

        this.executionContextStack.registerFunctionDeclaration(declareFunctionCommand.codeConstruct);
    },

    _evalFunctionExpressionCreationCommand: function(functionCommand)
    {
        if(!functionCommand.isFunctionExpressionCreationCommand()) { this.notifyError(functionCommand, "Argument is not a function expression creation command"); return; }

        this.executionContextStack.setExpressionValue(functionCommand.codeConstruct, this.executionContextStack.createFunctionInCurrentContext(functionCommand.codeConstruct));
    },

    _evalLiteralCommand: function(evalLiteralCommand)
    {
        if(!evalLiteralCommand.isEvalLiteralCommand()) { this.notifyError(evalLiteralCommand, "Argument is not an EvalLiteralCommand"); return; }

        this.executionContextStack.setExpressionValue(evalLiteralCommand.codeConstruct, new fcModel.JsValue(evalLiteralCommand.codeConstruct.value, new fcModel.FcInternal(evalLiteralCommand.codeConstruct)));
    },

    _evalRegExLiteralCommand: function(evalRegExCommand)
    {
        if(!evalRegExCommand.isEvalRegExCommand()) { this.notifyError(evalRegExCommand, "Argument is not an EvalRegExCommand"); return; }

        var regEx = evalRegExCommand.regExLiteral instanceof RegExp ? evalRegExCommand.regExLiteral
                                                                    : eval(evalRegExCommand.regExLiteral);

        this.executionContextStack.setExpressionValue
        (
            evalRegExCommand.codeConstruct,
            this.globalObject.internalExecutor.createRegEx(evalRegExCommand.codeConstruct, regEx)
        );
    },

    _evalAssignmentCommand: function(assignmentCommand)
    {
        if(!assignmentCommand.isEvalAssignmentExpressionCommand()) { this.notifyError(assignmentCommand, "Argument is not an EvalAssignmentExpressionCommand"); return; }

        var assignmentExpression = assignmentCommand.codeConstruct;

        this.dependencyCreator.createAssignmentDependencies(assignmentCommand);

        var finalValue = this._getAssignmentValue(assignmentCommand);

        if(ASTHelper.isIdentifier(assignmentCommand.leftSide)) { this._assignToIdentifier(assignmentCommand.leftSide, finalValue, assignmentExpression); }
        else if (ASTHelper.isMemberExpression(assignmentCommand.leftSide)) { this._assignToMemberExpression(assignmentCommand.leftSide, finalValue, assignmentExpression); }

        this.executionContextStack.setExpressionValue(assignmentExpression, finalValue);
    },

    _evalUpdateCommand: function(evalUpdateCommand)
    {
        if(!evalUpdateCommand.isEvalUpdateExpressionCommand()) { this.notifyError(evalUpdateCommand, "Argument is not an UpdateExpressionCommand"); return; }

        var updateExpression = evalUpdateCommand.codeConstruct;
        var currentValue = this.executionContextStack.getExpressionValue(updateExpression.argument);

        if(currentValue == null || currentValue.value == null) { this._callExceptionCallbacks(); return; }

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
    },

    _evalIdentifierCommand: function(identifierCommand)
    {
        if(!identifierCommand.isEvalIdentifierCommand()) { this.notifyError(identifierCommand, "Argument is not an EvalIdentifierExpressionCommand"); return; }

        var identifierConstruct = identifierCommand.codeConstruct;

        var identifier = this.executionContextStack.getIdentifier(identifierConstruct.name);
        var identifierValue = identifier != null ? identifier.value : null;

        this.executionContextStack.setExpressionValue(identifierConstruct, identifierValue);

        if(identifier != null)
        {
            this.dependencyCreator.createIdentifierDependencies(identifier, identifierConstruct, this.globalObject.getPreciseEvaluationPositionId());
            this._checkSlicing(identifierConstruct);
        }
    },

    _evalMemberCommand: function(memberCommand)
    {
        if(!memberCommand.isEvalMemberExpressionCommand()) { this.notifyError(memberCommand, "Argument is not an EvalMemberExpressionCommand"); return; }

        var memberExpression = memberCommand.codeConstruct;

        var object = this.executionContextStack.getExpressionValue(memberExpression.object);

        if(object == null || (object.value == null && object != this.globalObject)) { this._callExceptionCallbacks(); return; }

        //TODO: check dom test 13 Object.constructor.prototype not working as it should!
        var property = this.executionContextStack.getExpressionValue(memberExpression.property);
        var propertyValue = this._getPropertyValue(object, property, memberExpression);

        this.dependencyCreator.createMemberExpressionDependencies(object, property, propertyValue, memberExpression);

        this.executionContextStack.setExpressionValue(memberExpression, propertyValue);
    },

    _evalMemberPropertyCommand: function(memberPropertyCommand)
    {
        if(!memberPropertyCommand.isEvalMemberExpressionPropertyCommand()) { this.notifyError(memberPropertyCommand, "Argument is not an EvalMemberExpressionPropertyCommand"); return; }

        var memberExpression = memberPropertyCommand.codeConstruct;

        this.executionContextStack.setExpressionValue
        (
            memberExpression.property,
            memberPropertyCommand.codeConstruct.computed ? this.executionContextStack.getExpressionValue(memberExpression.property)
                                                         : new fcModel.JsValue(memberExpression.property.name, new fcModel.FcInternal(memberExpression.property))
        );
    },

    _evalThisCommand: function(thisCommand)
    {
        if(!thisCommand.isThisExpressionCommand()) { this.notifyError(thisCommand, "Argument is not a ThisExpressionCommand"); return; }

        this.executionContextStack.setExpressionValue(thisCommand.codeConstruct, this.executionContextStack.activeContext.thisObject);
    },

    _evalUnaryExpression: function(unaryCommand)
    {
        if(!unaryCommand.isEvalUnaryExpressionCommand()) { this.notifyError(unaryCommand, "Argument has to be an eval unary item command!"); return; }

        var unaryExpression = unaryCommand.codeConstruct;
        var argumentValue = this.executionContextStack.getExpressionValue(unaryExpression.argument);

        if(argumentValue == null && unaryExpression.operator != "typeof") { this._callExceptionCallbacks(); return; }

        this.dependencyCreator.createDataDependency(unaryExpression, unaryExpression.argument);

        var expressionValue = null;

        if (unaryExpression.operator == "-") { expressionValue = -argumentValue.value; }
        else if (unaryExpression.operator == "+") { expressionValue = +argumentValue.value; }
        else if (unaryExpression.operator == "!") { expressionValue = !argumentValue.value; }
        else if (unaryExpression.operator == "~") { expressionValue = ~argumentValue.value; }
        else if (unaryExpression.operator == "typeof") { expressionValue = argumentValue == null ? "undefined" : typeof argumentValue.value; }
        else if (unaryExpression.operator == "void") { expressionValue = void argumentValue.value;}
        else if (unaryExpression.operator == "delete") { expressionValue = this._evalDeleteExpression(unaryExpression); }

        this.executionContextStack.setExpressionValue(unaryExpression, new fcModel.JsValue(expressionValue, new fcModel.FcInternal(unaryExpression)));
    },

    _evalBinaryCommand: function(binaryCommand)
    {
        if(!binaryCommand.isEvalBinaryExpressionCommand()) { this.notifyError(binaryCommand, "Argument is not an EvalBinaryExpressionCommand"); return;}

        var binaryExpression = binaryCommand.codeConstruct;

        this.dependencyCreator.createBinaryExpressionDependencies(binaryExpression);

        var leftValue = this.executionContextStack.getExpressionValue(binaryExpression.left);
        var rightValue = this.executionContextStack.getExpressionValue(binaryExpression.right);

        if(leftValue == null) { this._callExceptionCallbacks(); return; }
        if(rightValue == null) { this._callExceptionCallbacks(); return; }

        this.executionContextStack.setExpressionValue(binaryExpression, new fcModel.JsValue(this._evalBinaryExpression(leftValue, rightValue, binaryExpression.operator), new fcModel.FcInternal(binaryExpression)));
    },

    _evalReturnCommand: function(returnCommand)
    {
        if(!returnCommand.isEvalReturnExpressionCommand()) { this.notifyError(returnCommand, "Argument is not an EvalReturnExpressionCommand"); return; };

        this.dependencyCreator.createReturnDependencies(returnCommand);

        //If return is in event handler function
        if(returnCommand.parentFunctionCommand == null)
        {
            this.globalObject.browser.callBreakContinueReturnEventCallbacks(returnCommand.codeConstruct, this.globalObject.getPreciseEvaluationPositionId());
            return;
        }

        returnCommand.parentFunctionCommand.executedReturnCommand = returnCommand;

        if(returnCommand.parentFunctionCommand.isExecuteCallbackCommand())
        {
            this._handleReturnFromCallbackFunction(returnCommand);
        }
        else
        {
            this.executionContextStack.setExpressionValueInPreviousContext
            (
                returnCommand.parentFunctionCommand.codeConstruct,
                returnCommand.codeConstruct.argument != null ? this.executionContextStack.getExpressionValue(returnCommand.codeConstruct.argument)
                                                             : null
            );
        }
    },

    _evalArrayExpressionCommand: function(arrayExpressionCommand)
    {
        if(!arrayExpressionCommand.isArrayExpressionCommand()) { this.notifyError(arrayExpressionCommand, "Argument has to be an array expression creation command!"); return; }

        var newArray = this.globalObject.internalExecutor.createArray(arrayExpressionCommand.codeConstruct);

        this.executionContextStack.setExpressionValue(arrayExpressionCommand.codeConstruct, newArray);

        arrayExpressionCommand.createdArray = newArray;
    },

    _evalArrayExpressionItemCreationCommand: function(arrayItemCreationCommand)
    {
        if(!arrayItemCreationCommand.isArrayExpressionItemCreationCommand()) { this.notifyError(arrayItemCreationCommand, "Argument has to be an array expression item creation command!"); return; }

        var array = arrayItemCreationCommand.arrayExpressionCommand.createdArray;

        if(array == null || array.value == null) { this.notifyError(arrayItemCreationCommand, "When evaluating array expression item the array must not be null!");  return; }

        var expressionItemValue = this.executionContextStack.getExpressionValue(arrayItemCreationCommand.codeConstruct);

        array.fcInternal.object.push(array.value, expressionItemValue, arrayItemCreationCommand.codeConstruct);
    },

    _evalObjectCommand: function(objectCommand)
    {
        if(!objectCommand.isObjectExpressionCommand()) { this.notifyError(objectCommand, "Argument has to be an object expression creation command!"); return; }

        var newObject = this.globalObject.internalExecutor.createObject(null, objectCommand.codeConstruct);

        this.executionContextStack.setExpressionValue(objectCommand.codeConstruct, newObject);

        objectCommand.createdObject = newObject;
    },

    _evalObjectPropertyCreationCommand: function(objectPropertyCreationCommand)
    {
        if(!objectPropertyCreationCommand.isObjectPropertyCreationCommand()) { this.notifyError(objectPropertyCreationCommand, "Argument has to be an object property creation command!"); return; }

        var object = objectPropertyCreationCommand.objectExpressionCommand.createdObject;

        if(object == null || object.value == null) { this.notifyError(objectPropertyCreationCommand, "When evaluating object property the object must not be null!");  return; }

        var propertyCodeConstruct = objectPropertyCreationCommand.codeConstruct;

        var propertyValue = this.executionContextStack.getExpressionValue(propertyCodeConstruct.value);

        var propertyKey = ASTHelper.isLiteral(propertyCodeConstruct.key) ? propertyCodeConstruct.key.value
                                                                         : propertyCodeConstruct.key.name;

        object.value[propertyKey] = propertyValue;
        object.fcInternal.object.addProperty(propertyKey, propertyValue, objectPropertyCreationCommand.codeConstruct);
    },

    _evalConditionalCommand: function(conditionalCommand)
    {
        if(!conditionalCommand.isEndEvalConditionalExpressionCommand()) { this.notifyError(conditionalCommand, "Argument has to be an eval conditional expression command!"); return; }

        this.executionContextStack.setExpressionValue(conditionalCommand.codeConstruct, this.executionContextStack.getExpressionValue(conditionalCommand.startCommand.body));

        this.dependencyCreator.createDependenciesForConditionalCommand(conditionalCommand);
    },

    _evalForInWhereCommand: function(forInWhereCommand)
    {
        if(!forInWhereCommand.isEvalForInWhereCommand()) { this.notifyError(forInWhereCommand, "Argument has to be an eval for in where command!"); return; }

        var forInWhereConstruct = forInWhereCommand.codeConstruct;
        var whereObject = this.executionContextStack.getExpressionValue(forInWhereConstruct.right);

        if(whereObject.fcInternal.object == null) { forInWhereCommand.willBodyBeExecuted = false; return; }

        var nextPropertyName = whereObject.fcInternal.object.getPropertyNameAtIndex(forInWhereCommand.currentPropertyIndex + 1);

        this.dependencyCreator.createDependenciesInForInWhereCommand(forInWhereConstruct, whereObject, nextPropertyName);

        forInWhereCommand.willBodyBeExecuted = !!nextPropertyName.value;

        if(!nextPropertyName.value){ return; }

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
    },

    _evalStartCatchStatementCommand: function(startCatchCommand)
    {
        if(!startCatchCommand.isStartCatchStatementCommand()) { this.notifyError(startCatchCommand, "Argument has to be a start catch command!"); return; }

        this.executionContextStack.setIdentifierValue(startCatchCommand.codeConstruct.param.name, startCatchCommand.exceptionArgument);
    },

    _evalEndCatchCommand: function(endCatchCommand)
    {
        if(!endCatchCommand.isEndCatchStatementCommand()) { this.notifyError(endCatchCommand, "Argument has to be an end catch command!"); return; }

        this.executionContextStack.deleteIdentifier(endCatchCommand.codeConstruct.param.name);
    },

    _evalLogicalItemCommand: function(evalLogicalItemCommand)
    {
        if(!evalLogicalItemCommand.isEvalLogicalExpressionItemCommand()) { this.notifyError(evalLogicalItemCommand, "Argument has to be an eval logical expression item command!"); return; }

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
    },

    _evalEndLogicalCommand: function(endLogicalCommand)
    {
        this.dependencyCreator.createDependenciesForLogicalExpression(endLogicalCommand);
    },

    _evalCallInternalFunction: function(callInternalFunctionCommand)
    {
        if(!callInternalFunctionCommand.isCallInternalFunctionCommand()) { this.notifyError(callInternalFunctionCommand, "Argument has to be a call internal function command!"); return; }

        this.dependencyCreator.createDependenciesForCallInternalFunction(callInternalFunctionCommand);

        this.executionContextStack.setExpressionValue
        (
            callInternalFunctionCommand.codeConstruct,
            this.globalObject.internalExecutor.executeFunction
            (
                this._getThisObjectFromCallInternalFunctionCommand(callInternalFunctionCommand),
                callInternalFunctionCommand.functionObject,
                this._getArgumentsFromInternalFunctionCall(callInternalFunctionCommand, callInternalFunctionCommand.codeConstruct.arguments),
                callInternalFunctionCommand.codeConstruct,
                callInternalFunctionCommand
            )
        );
    },

    _evalCallbackFunctionCommand: function(callbackFunctionCommand)
    {
        this.dependencyCreator.createCallbackFunctionCommandDependencies(callbackFunctionCommand);
    },

    _evalSequence: function(sequenceCommand)
    {
        var sequenceExpression = sequenceCommand.codeConstruct;
        var lastExpression = sequenceExpression.expressions[sequenceExpression.expressions.length - 1];

        this.executionContextStack.setExpressionValue(sequenceExpression, this.executionContextStack.getExpressionValue(lastExpression));

        this.dependencyCreator.createSequenceExpressionDependencies(sequenceExpression, lastExpression);
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

                 if (operator == "+=") { result = leftValue.value + rightValue.value; }
            else if (operator == "-=") { result = leftValue.value - rightValue.value; }
            else if (operator == "*=") { result = leftValue.value * rightValue.value; }
            else if (operator == "/=") { result = leftValue.value / rightValue.value; }
            else if (operator == "%=") { result = leftValue.value % rightValue.value; }
            else if (operator == "<<=") { result = leftValue.value << rightValue.value; }
            else if (operator == ">>=") { result = leftValue.value >> rightValue.value; }
            else if (operator == ">>>=") { result = leftValue.value >>> rightValue.value; }
            else if (operator == "|=") { result = leftValue.value | rightValue.value; }
            else if (operator == "^=") { result = leftValue.value ^ rightValue.value; }
            else if (operator == "&=") { result = leftValue.value & rightValue.value; }
            else { this.notifyError(assignmentCommand, "Unknown assignment operator!"); return; }

            finalValue = new fcModel.JsValue(result, new fcModel.FcInternal(assignmentCommand.codeConstruct, null));
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

        if(object == null || (object.value == null && object != this.globalObject)) { this._callExceptionCallbacks(); return; }

        //TODO - fishy condition
        if (object.value == this.globalObject ||  ValueTypeHelper.isOneOfTypes(object.value, [Document, DocumentFragment, HTMLElement, Text, Attr, CSSStyleDeclaration, Array])
        ||  (object.fcInternal != null && object.fcInternal.object != null && object.fcInternal.object.constructor == fcModel.Event))
        {
            object.fcInternal.object.addJsProperty(property.value, finalValue, assignmentExpression);
        }
        else
        {
            object.fcInternal.object.addProperty(property.value, finalValue, assignmentExpression, true);
            object.value[property.value] = finalValue;
        }

        if(property.value == "__proto__" || property.value == "prototype") { object.value[property.value] = finalValue.value; }
    },

    _getUpdateValue: function(currentValue, updateExpression)
    {
        return new fcModel.JsValue(updateExpression.operator == "++" ? currentValue.value + 1 : currentValue.value - 1, new fcModel.FcInternal(updateExpression));
    },

    _getUpdatedCurrentValue:function(currentValue, updateExpression)
    {
        if(updateExpression.prefix)
        {
            return new fcModel.JsValue(updateExpression.operator == "++" ? ++currentValue.value : --currentValue.value, new fcModel.FcInternal(updateExpression));
        }
        else
        {
            return new fcModel.JsValue(updateExpression.operator == "++" ? currentValue.value++ : currentValue.value--, new fcModel.FcInternal(updateExpression));
        }
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
             if (operator == "==") { return leftValue.value == rightValue.value;}
        else if (operator == "!=") { return leftValue.value != rightValue.value; }
        else if (operator == "===") { return leftValue.value === rightValue.value; }
        else if (operator == "!==") { return leftValue.value !== rightValue.value; }
        else if (operator == "<") { return leftValue.value < rightValue.value; }
        else if (operator == "<=") { return leftValue.value <= rightValue.value; }
        else if (operator == ">") { return leftValue.value > rightValue.value; }
        else if (operator == ">=") { return leftValue.value >= rightValue.value; }
        else if (operator == "<<") { return leftValue.value << rightValue.value; }
        else if (operator == ">>") { return leftValue.value >> rightValue.value; }
        else if (operator == ">>>") { return leftValue.value >>> rightValue.value; }
        else if (operator == "-") { return leftValue.value - rightValue.value; }
        else if (operator == "*") { return leftValue.value * rightValue.value; }
        else if (operator == "/") { return leftValue.value / rightValue.value; }
        else if (operator == "%") { return leftValue.value % rightValue.value; }
        else if (operator == "|") { return leftValue.value | rightValue.value; }
        else if (operator == "^") { return leftValue.value ^ rightValue.value; }
        else if (operator == "&") { return leftValue.value & rightValue.value; }
        else if (operator == "in") { return leftValue.value in rightValue.value; }
        else if (operator == "+") { return this._evalAdd(leftValue.value, rightValue.value); }
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
                return (leftValue.map(function(item) { return item.value})).join("")
                     + (rightValue.map(function(item) { return item.value})).join("")
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

        if(rightValue == this.globalObject.arrayFunction || rightValue.value == this.globalObject.arrayFunction) { compareWith = Array; }
        else if (rightValue == this.globalObject.stringFunction || rightValue.value == this.globalObject.stringFunction) { compareWith = String; }
        else if (rightValue == this.globalObject.regExFunction || rightValue.value == this.globalObject.regExFunction) { compareWith = RegExp; }
        else if (rightValue.value != undefined) { compareWith = rightValue.value; }
        else { this.notifyError(null, "Unhandled instanceof"); }

        return leftValue.value instanceof compareWith;
    },

    _handleReturnFromCallbackFunction: function(returnCommand)
    {
        var executeCallbackCommand = returnCommand.parentFunctionCommand;
        var returnArgument = returnCommand.codeConstruct.argument;

        if(ValueTypeHelper.isArray(executeCallbackCommand.originatingObject.value))
        {
            fcModel.ArrayCallbackEvaluator.evaluateCallbackReturn
            (
                executeCallbackCommand,
                returnArgument != null ? this.executionContextStack.getExpressionValue(returnArgument)
                                       : null,
                returnCommand.codeConstruct
            );
        }
        else if(ValueTypeHelper.isString(executeCallbackCommand.originatingObject.value))
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
        var propertyValue = null;

        //TODO: Fishy condition
        if(object.value == this.globalObject || ValueTypeHelper.isOneOfTypes(object.value, [HTMLElement, Text, Document, DocumentFragment, CSSStyleDeclaration, Attr, Array, RegExp])
        ||(object.fcInternal != null && object.fcInternal.object != null && object.fcInternal.object.constructor == fcModel.Event))
        {
            propertyValue = object.fcInternal.object.getJsPropertyValue(property.value, memberExpression);
        }
        else
        {
            propertyValue = object.value[property.value];
        }

        if(!ValueTypeHelper.isOfType(propertyValue, fcModel.JsValue))
        {
            if(propertyValue != null && propertyValue.jsValue != null && !ValueTypeHelper.isPrimitive(propertyValue)) { propertyValue = propertyValue.jsValue; }
            else if (ValueTypeHelper.isPrimitive(propertyValue)) { propertyValue = new fcModel.JsValue(propertyValue, new fcModel.FcInternal(memberExpression)); }
            else { this.notifyError(null, "The property value should be of type JsValue"); return; }
        }

        return propertyValue;
    },

    _isLogicalExpressionDoneWithEvaluation: function(value, operator)
    {
        return  (value.value && operator == "||")
             || (!value.value && operator == "&&");
    },

    _getLogicalExpressionValue: function(wholeLogicalExpression)
    {
        var leftValue = this.executionContextStack.getExpressionValue(wholeLogicalExpression.left);
        var rightValue = this.executionContextStack.getExpressionValue(wholeLogicalExpression.right);

        if(leftValue == null || rightValue == null) { this._callExceptionCallbacks(); return; }

        var result = wholeLogicalExpression.operator == "&&" ? leftValue.value && rightValue.value
                                                             : leftValue.value || rightValue.value;

        return ValueTypeHelper.isPrimitive(result) ? new fcModel.JsValue(result, new fcModel.FcInternal(wholeLogicalExpression))
                                                   : result === leftValue.value ? leftValue : rightValue;
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
                propertyName = propertyValue != null ? propertyValue.value : "";
            }
            else
            {
                propertyName = deleteExpression.argument.property.name;
            }

            object.fcInternal.object.deleteProperty(propertyName, deleteExpression);
            return delete object.value[propertyName];
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
            return callExpressionArgs.slice(1).map(function(arg)
            {
                return this.executionContextStack.getExpressionValue(arg);
            }, this);
        }

        if(callInternalFunctionCommand.isApply)
        {
            var secondArgumentValue = this.executionContextStack.getExpressionValue(callExpressionArgs[1]);

            return secondArgumentValue != null && secondArgumentValue.value != null ? secondArgumentValue.value : [];
        }

        return callExpressionArgs.map(function(arg)
        {
            return this.executionContextStack.getExpressionValue(arg);
        }, this);
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
        fcSimulator.Evaluator.notifyError(message + "@" + (command != null ? (command.codeConstruct.loc.source + " - Ln:" + command.codeConstruct.loc.start.line) : ""));
    }
};
}});