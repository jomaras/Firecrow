/**
 * User: Jomaras
 * Date: 08.05.12.
 * Time: 13:19
 */
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

        this.exceptionCallbacks = [];
    }
    catch(e) { Firecrow.Interpreter.Simulator.Evaluator.notifyError("Error when constructing evaluator: " + e);}
};

Firecrow.Interpreter.Simulator.Evaluator.notifyError = function(message) { alert("Evaluator - " + message); };

fcSimulator.Evaluator.prototype =
{
    evaluateCommand: function(command)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(command, Firecrow.Interpreter.Commands.Command)) { this.notifyError(command, "When evaluating the argument has to be of type command"); return; }

                 if (command.isDeclareVariableCommand()) { this._evaluateDeclareVariableCommand(command); }
            else if (command.isDeclareFunctionCommand()) { this._evaluateDeclareFunctionCommand(command); }
            else if (command.isEvalIdentifierCommand()) { this._evaluateIdentifierCommand(command); }
            else if (command.isEvalLiteralCommand()) { this._evaluateLiteralCommand(command); }
            else if (command.isEvalRegExCommand()) { this._evaluateRegExLiteralCommand(command);}
            else if (command.isEvalAssignmentExpressionCommand()) { this._evaluateAssignmentExpressionCommand(command); }
            else if (command.isEvalUpdateExpressionCommand()) { this._evaluateUpdateExpressionCommand(command); }
            else if (command.isEvalBinaryExpressionCommand()) { this._evaluateBinaryExpressionCommand(command); }
            else if (command.isEvalReturnExpressionCommand()) { this._evaluateReturnExpressionCommand(command); }
            else if (command.isThisExpressionCommand()) { this._evaluateThisExpressionCommand(command); }
            else if (command.isEvalMemberExpressionCommand()) { this._evaluateMemberExpressionCommand(command); }
            else if (command.isEvalMemberExpressionPropertyCommand()) { this._evaluateMemberExpressionPropertyCommand(command); }
            else if (command.isObjectExpressionCommand()) { this._evaluateObjectExpressionCommand(command); }
            else if (command.isObjectPropertyCreationCommand()) { this._evaluateObjectPropertyCreationCommand(command);}
            else if (command.isArrayExpressionCommand()) { this._evaluateArrayExpressionCommand(command);}
            else if (command.isArrayExpressionItemCreationCommand()) { this._evaluateArrayExpressionItemCreationCommand(command);}
            else if (command.isFunctionExpressionCreationCommand()) { this._evaluateFunctionExpressionCreationCommand(command); }
            else if (command.isEvalForInWhereCommand()) { this._evaluateForInWhereCommand(command); }
            else if (command.isEvalConditionalExpressionCommand()) { this._evaluateConditionalExpressionCommand(command);}
            else if (command.isStartCatchStatementCommand()) { this._evaluateStartCatchStatementCommand(command);}
            else if (command.isEndCatchStatementCommand()) { this._evaluateEndCatchStatementCommand(command);}
            else if (command.isEvalLogicalExpressionItemCommand()) { this._evaluateLogicalExpressionItemCommand(command);}
            else if (command.isEndLogicalExpressionCommand()) { this._evaluateEndLogicalExpressionCommand(command); }
            else if (command.isEvalUnaryExpressionCommand()) { this._evaluateUnaryExpression(command); }
            else if (command.isCallInternalFunctionCommand()) { this._evaluateCallInternalFunction(command); }
            else if (command.isEvalCallbackFunctionCommand()) { this._evaluateCallbackFunctionCommand(command); }
            else if (command.isEvalSequenceExpressionCommand()) { this._evaluateSequenceExpression(command); }
            else
            {
                this.notifyError(command, "Evaluator: Still not handling command of type: " +  command.type); return;
            }
        }
        catch(e) { this.notifyError(command, "An error occurred when evaluating command: " + e);}
    },

    evaluateBreakContinueCommand: function(breakContinueCommand)
    {
        try
        {
            if(breakContinueCommand == null || (!breakContinueCommand.isEvalBreakCommand() && !breakContinueCommand.isEvalContinueCommand())) { this.notifyError("Should be break or continue command"); }

            this.addDependenciesToTopBlockConstructs(breakContinueCommand.codeConstruct);
            this.globalObject.browser.callImportantConstructReachedCallbacks(breakContinueCommand.codeConstruct);
        }
        catch(e) { this.notifyError(breakContinueCommand, "Error when evaluating break or continue command: " + e);}
    },

    _evaluateDeclareVariableCommand: function(declareVariableCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(declareVariableCommand, Firecrow.Interpreter.Commands.Command) || !declareVariableCommand.isDeclareVariableCommand()) { this.notifyError(declareVariableCommand, "Argument is not a DeclareVariableCommand"); return; }

            this.executionContextStack.registerIdentifier(declareVariableCommand.codeConstruct);
        }
        catch(e) { this.notifyError(declareVariableCommand, "Error when evaluating declare variable: " + e); }
    },

    _evaluateDeclareFunctionCommand: function(declareFunctionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(declareFunctionCommand, Firecrow.Interpreter.Commands.Command) || !declareFunctionCommand.isDeclareFunctionCommand()) { this.notifyError(declareFunctionCommand, "Argument is not a DeclareFunctionCommand"); return; }

            this.executionContextStack.registerFunctionDeclaration(declareFunctionCommand.codeConstruct);
        }
        catch(e) { this.notifyError(declareFunctionCommand, "Error when evaluating declare function: " + e); }
    },

    _evaluateFunctionExpressionCreationCommand: function(functionExpressionCreationCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(functionExpressionCreationCommand, Firecrow.Interpreter.Commands.Command) || !functionExpressionCreationCommand.isFunctionExpressionCreationCommand()) { this.notifyError(functionExpressionCreationCommand, "Argument is not a function expression creation command"); return; }

            this.executionContextStack.setExpressionValue
            (
                functionExpressionCreationCommand.codeConstruct,
                this.executionContextStack.createFunctionInCurrentContext(functionExpressionCreationCommand.codeConstruct)
            );
        }
        catch(e) { this.notifyError(functionExpressionCreationCommand, "Error when evaluating declare function: " + e); }
    },

    _evaluateLiteralCommand: function(evalLiteralCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalLiteralCommand, Firecrow.Interpreter.Commands.Command) || !evalLiteralCommand.isEvalLiteralCommand()) { this.notifyError(evalLiteralCommand, "Argument is not an EvalLiteralCommand"); return; }

            this.executionContextStack.setExpressionValue(evalLiteralCommand.codeConstruct, new fcModel.JsValue(evalLiteralCommand.codeConstruct.value, new fcModel.FcInternal(evalLiteralCommand.codeConstruct)));
        }
        catch(e) { this.notifyError(evalLiteralCommand, "Error when evaluating literal: " + e); }
    },

    _evaluateRegExLiteralCommand: function(evalRegExCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalRegExCommand, Firecrow.Interpreter.Commands.Command) || !evalRegExCommand.isEvalRegExCommand()) { this.notifyError(evalRegExCommand, "Argument is not an EvalRegExCommand"); return; }

            var regEx = eval(evalRegExCommand.regExLiteral);

            this.executionContextStack.setExpressionValue
            (
                evalRegExCommand.codeConstruct,
                this.globalObject.internalExecutor.createRegEx(evalRegExCommand.codeConstruct, regEx)
            );
        }
        catch(e) { this.notifyError(evalRegExCommand, "Error when evaluating literal: " + e); }
    },

    _evaluateAssignmentExpressionCommand: function(evalAssignmentExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalAssignmentExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evalAssignmentExpressionCommand.isEvalAssignmentExpressionCommand()) { this.notifyError(evalAssignmentExpressionCommand, "Argument is not an EvalAssignmentExpressionCommand"); return; }

            var assignmentExpression = evalAssignmentExpressionCommand.codeConstruct;
            var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

            var operator = evalAssignmentExpressionCommand.operator;
            var finalValue = null;

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(assignmentExpression, evalAssignmentExpressionCommand.leftSide, evaluationPosition);
            this.globalObject.browser.callDataDependencyEstablishedCallbacks(assignmentExpression, evalAssignmentExpressionCommand.rightSide, evaluationPosition);

            this.addDependenciesToTopBlockConstructs(assignmentExpression);

            if(operator == "=")
            {
                finalValue = this.executionContextStack.getExpressionValue(evalAssignmentExpressionCommand.rightSide);
            }
            else
            {
                var leftValue = this.executionContextStack.getExpressionValue(evalAssignmentExpressionCommand.leftSide);
                var rightValue = this.executionContextStack.getExpressionValue(evalAssignmentExpressionCommand.rightSide);

                var result = null;

                if(operator == "+=") { result = leftValue.value + rightValue.value; }
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
                else { this.notifyError(evalAssignmentExpressionCommand, "Unknown assignment operator!"); return; }

                finalValue = new fcModel.JsValue(result, new fcModel.FcInternal(assignmentExpression, null));
            }

            finalValue = finalValue.isPrimitive() ? finalValue.createCopy(evalAssignmentExpressionCommand.rightSide) : finalValue;

            if(ASTHelper.isIdentifier(evalAssignmentExpressionCommand.leftSide))
            {
                if(this.globalObject.checkIfSatisfiesIdentifierSlicingCriteria(evalAssignmentExpressionCommand.leftSide))
                {
                    this.globalObject.browser.callImportantConstructReachedCallbacks(evalAssignmentExpressionCommand.leftSide);
                }

                this.executionContextStack.setIdentifierValue
                (
                    evalAssignmentExpressionCommand.leftSide.name,
                    finalValue,
                    assignmentExpression
                );
            }
            else
            {
                var object = this.executionContextStack.getExpressionValue(evalAssignmentExpressionCommand.leftSide.object);
                var property = this.executionContextStack.getExpressionValue(evalAssignmentExpressionCommand.leftSide.property);

                if(object == null || (object.value == null && object != this.globalObject)) { this._callExceptionCallbacks(); return; }

                if(ValueTypeHelper.isOfType(object.value, HTMLElement))
                {
                    object.value[property.value] = finalValue.value;
                }
                else if (object == this.globalObject)
                {
                    this.globalObject.addProperty(property.value, finalValue.value,  assignmentExpression);
                }
                else
                {
                    object.value[property.value] = finalValue;
                }

                if(property.value == "__proto__") { object.value[property.value] = finalValue.value;}

                object.fcInternal.object.addProperty(property.value, finalValue, assignmentExpression, true);

                if(ValueTypeHelper.isArray(object.value)) { object.fcInternal.object.updateItem(property.value, finalValue, assignmentExpression); }
                else if (ValueTypeHelper.isOfType(object.value, HTMLElement))
                {
                   this.globalObject.browser.callDataDependencyEstablishedCallbacks
                   (
                       object.fcInternal.object.htmlElement.modelElement,
                       assignmentExpression,
                       this.globalObject.getPreciseEvaluationPositionId()
                   );
                }
            }

            this.executionContextStack.setExpressionValue(assignmentExpression, finalValue);
        }
        catch(e)
        {
            this.notifyError(evalAssignmentExpressionCommand, "Error when evaluating assignment expression " + e);
        }
    },

    _evaluateUpdateExpressionCommand: function(evalUpdateExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalUpdateExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evalUpdateExpressionCommand.isEvalUpdateExpressionCommand()) { this.notifyError(evalUpdateExpressionCommand, "Argument is not an UpdateExpressionCommand"); return; }

            var codeConstruct = evalUpdateExpressionCommand.codeConstruct;
            var currentValue = this.executionContextStack.getExpressionValue(codeConstruct.argument);

            if(currentValue == null || currentValue.value == null) { this._callExceptionCallbacks(); return; }

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(codeConstruct, codeConstruct.argument, this.globalObject.getPreciseEvaluationPositionId());
            this.addDependenciesToTopBlockConstructs(codeConstruct);

            if(ASTHelper.isIdentifier(codeConstruct.argument))
            {
                this.executionContextStack.setIdentifierValue
                (
                    codeConstruct.argument.name,
                    new fcModel.JsValue(codeConstruct.operator == "++" ? currentValue.value + 1 : currentValue.value - 1, new fcModel.FcInternal(codeConstruct)),
                    codeConstruct
                );
            }
            else if(ASTHelper.isMemberExpression(codeConstruct.argument))
            {
                var memberExpression = codeConstruct.argument;
                var object = this.executionContextStack.getExpressionValue(memberExpression.object);
                var property = this.executionContextStack.getExpressionValue(memberExpression.property);

                if(object == null) { this.notifyError(evalUpdateExpressionCommand, "Can not update a property of null object!"); return; }

                var newValue = new fcModel.JsValue(codeConstruct.operator == "++" ? currentValue.value + 1 : currentValue.value - 1, new fcModel.FcInternal(codeConstruct));

                object.value[property.value] = newValue;
                object.fcInternal.object.addProperty(property.value, newValue, codeConstruct, true);
            }
            else { this.notifyError(evalUpdateExpressionCommand, "Unknown code construct when updating expression!"); }

            this.executionContextStack.setExpressionValue
            (
                codeConstruct,
                codeConstruct.prefix ? (new fcModel.JsValue(codeConstruct.operator == "++" ? ++currentValue.value : --currentValue.value, new fcModel.FcInternal(codeConstruct)))
                                     : (new fcModel.JsValue(codeConstruct.operator == "++" ? currentValue.value++ : currentValue.value--, new fcModel.FcInternal(codeConstruct)))
            )
        }
        catch(e) { this.notifyError(evalUpdateExpressionCommand, "An error has occurred when updating an expression:" + e); }
    },

    _evaluateIdentifierCommand: function(evalIdentifierCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalIdentifierCommand, Firecrow.Interpreter.Commands.Command) || !evalIdentifierCommand.isEvalIdentifierCommand()) { this.notifyError(evalIdentifierCommand, "Argument is not an EvalIdentifierExpressionCommand"); return; }

            var identifierConstruct = evalIdentifierCommand.codeConstruct;
            var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

            if(identifierConstruct.loc != null && (identifierConstruct.loc.start.line == 71))
            {
                var a = 3;
            }

            var identifier = this.executionContextStack.getIdentifier(identifierConstruct.name);
            var identifierValue = identifier != null ? identifier.value : null;

            this.executionContextStack.setExpressionValue(identifierConstruct, identifierValue);

            if(identifier != null)
            {
                if(!ASTHelper.isAssignmentExpression(identifierConstruct.parent) || identifierConstruct.parent.left != identifierConstruct || identifierConstruct.parent.operator.length == 2)
                {
                    if(identifier.lastModificationConstruct != null)
                    {
                        this.globalObject.browser.callDataDependencyEstablishedCallbacks
                        (
                            identifierConstruct,
                            identifier.lastModificationConstruct.codeConstruct,
                            evaluationPosition,
                            identifier.lastModificationConstruct.evaluationPositionId
                        );
                    }
                }

                if(identifier.declarationConstruct != null && identifier.declarationConstruct != identifier.lastModificationConstruct)
                {
                   this.globalObject.browser.callDataDependencyEstablishedCallbacks
                   (
                       identifierConstruct,
                       ASTHelper.isVariableDeclarator(identifier.declarationConstruct.codeConstruct) ? identifier.declarationConstruct.codeConstruct.id
                                                                                                     : identifier.declarationConstruct.codeConstruct,
                       evaluationPosition
                   );
                }

                if(this.globalObject.checkIfSatisfiesIdentifierSlicingCriteria(identifierConstruct))
                {
                    this.globalObject.browser.callImportantConstructReachedCallbacks(identifierConstruct);
                }
            }
        }
        catch(e)
        {
            this.notifyError(evalIdentifierCommand, "Error when evaluating identifier: " + e);
        }
    },

    _evaluateBinaryExpressionCommand: function(evalBinaryExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalBinaryExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evalBinaryExpressionCommand.isEvalBinaryExpressionCommand()) { this.notifyError(evalBinaryExpressionCommand, "Argument is not an EvalBinaryExpressionCommand"); return;}

            var binaryExpression = evalBinaryExpressionCommand.codeConstruct;
            var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(binaryExpression, binaryExpression.left, evaluationPosition);
            this.globalObject.browser.callDataDependencyEstablishedCallbacks(binaryExpression, binaryExpression.right, evaluationPosition);

            var leftExpressionValue = this.executionContextStack.getExpressionValue(binaryExpression.left);
            var rightExpressionValue = this.executionContextStack.getExpressionValue(binaryExpression.right);

            if(leftExpressionValue == null) { this._callExceptionCallbacks(); return; }
            if(rightExpressionValue == null) { this._callExceptionCallbacks(); return; }

            var operator = binaryExpression.operator;

            var result = null;

                 if (operator == "==") { result = leftExpressionValue.value == rightExpressionValue.value;}
            else if (operator == "!=") { result = leftExpressionValue.value != rightExpressionValue.value; }
            else if (operator == "===") { result = leftExpressionValue.value === rightExpressionValue.value; }
            else if (operator == "!==") { result = leftExpressionValue.value !== rightExpressionValue.value; }
            else if (operator == "<") { result = leftExpressionValue.value < rightExpressionValue.value; }
            else if (operator == "<=") { result = leftExpressionValue.value <= rightExpressionValue.value; }
            else if (operator == ">") { result = leftExpressionValue.value > rightExpressionValue.value; }
            else if (operator == ">=") { result = leftExpressionValue.value >= rightExpressionValue.value; }
            else if (operator == "<<") { result = leftExpressionValue.value << rightExpressionValue.value; }
            else if (operator == ">>") { result = leftExpressionValue.value >> rightExpressionValue.value; }
            else if (operator == ">>>") { result = leftExpressionValue.value >>> rightExpressionValue.value; }
            else if (operator == "+")
            {
                if(typeof leftExpressionValue.value == "object" && !(leftExpressionValue.value instanceof String)
                || (typeof rightExpressionValue.value == "object" && !(rightExpressionValue.value instanceof String)))
                {
                    this.notifyError(evalBinaryExpressionCommand, "Still not handling implicit toString conversion in binary expression!");
                    return;
                }
                result = leftExpressionValue.value + rightExpressionValue.value;
            }
            else if (operator == "-") { result = leftExpressionValue.value - rightExpressionValue.value; }
            else if (operator == "*") { result = leftExpressionValue.value * rightExpressionValue.value; }
            else if (operator == "/") { result = leftExpressionValue.value / rightExpressionValue.value; }
            else if (operator == "%") { result = leftExpressionValue.value % rightExpressionValue.value; }
            else if (operator == "|") { result = leftExpressionValue.value | rightExpressionValue.value; }
            else if (operator == "^") { result = leftExpressionValue.value ^ rightExpressionValue.value; }
            else if (operator == "in") { result = leftExpressionValue.value in rightExpressionValue.value; }
            else if (operator == "instanceof")
            {
                var compareWith = null;

                if(rightExpressionValue == this.globalObject.arrayFunction) { compareWith = Array; }
                else if (rightExpressionValue == this.globalObject.stringFunction) { compareWith = String; }
                else if (rightExpressionValue == this.globalObject.regExFunction) { compareWith = RegExp; }
                else if (rightExpressionValue.value != undefined) { compareWith = rightExpressionValue.value; }
                else
                {
                    this.notifyError(evalBinaryExpressionCommand, "Unhandled instanceof");
                }

                result = leftExpressionValue.value instanceof compareWith;
            }
            else { this.notifyError(evalBinaryExpressionCommand, "Unknown operator when evaluating binary expression"); return; }

            this.executionContextStack.setExpressionValue(binaryExpression, new fcModel.JsValue(result, new fcModel.FcInternal(binaryExpression)));
        }
        catch(e) { this.notifyError(evalBinaryExpressionCommand, "Error when evaluating binary expression: " + e);}
    },

    _evaluateReturnExpressionCommand: function(evalReturnExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalReturnExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evalReturnExpressionCommand.isEvalReturnExpressionCommand()) { this.notifyError(evalReturnExpressionCommand, "Argument is not an EvalReturnExpressionCommand"); return; }

            this.globalObject.browser.callControlDependencyEstablishedCallbacks(evalReturnExpressionCommand.codeConstruct, evalReturnExpressionCommand.codeConstruct.argument, this.globalObject.getPreciseEvaluationPositionId());

            this.addDependenciesToTopBlockConstructs(evalReturnExpressionCommand.codeConstruct);
            evalReturnExpressionCommand.parentFunctionCommand.executedReturnCommand = evalReturnExpressionCommand;

            if(evalReturnExpressionCommand.parentFunctionCommand.isExecuteCallbackCommand())
            {
                var executeCallbackCommand = evalReturnExpressionCommand.parentFunctionCommand;

                if(ValueTypeHelper.isArray(executeCallbackCommand.originatingObject.value))
                {
                    fcModel.ArrayCallbackEvaluator.evaluateCallbackReturn
                    (
                        executeCallbackCommand,
                        evalReturnExpressionCommand.codeConstruct.argument != null ? this.executionContextStack.getExpressionValue(evalReturnExpressionCommand.codeConstruct.argument)
                                                                                   : null,
                        evalReturnExpressionCommand.codeConstruct
                    );
                }
                else if(ValueTypeHelper.isString(executeCallbackCommand.originatingObject.value))
                {
                    fcModel.StringExecutor.evaluateCallbackReturn
                    (
                        executeCallbackCommand,
                        evalReturnExpressionCommand.codeConstruct.argument != null ? this.executionContextStack.getExpressionValue(evalReturnExpressionCommand.codeConstruct.argument)
                                                                                   : null,
                        evalReturnExpressionCommand.codeConstruct,
                        this.globalObject
                    );
                }
            }
            else
            {
                this.executionContextStack.addDependenciesToPreviouslyExecutedBlockConstructs(evalReturnExpressionCommand.codeConstruct);
                this.globalObject.browser.callDataDependencyEstablishedCallbacks(evalReturnExpressionCommand.parentFunctionCommand.codeConstruct, evalReturnExpressionCommand.codeConstruct.argument, this.globalObject.getPreciseEvaluationPositionId());
                this.globalObject.browser.callControlDependencyEstablishedCallbacks(evalReturnExpressionCommand.parentFunctionCommand.codeConstruct, evalReturnExpressionCommand.codeConstruct, this.globalObject.getReturnExpressionPreciseEvaluationPositionId());

                this.executionContextStack.setExpressionValueInPreviousContext
                (
                    evalReturnExpressionCommand.parentFunctionCommand.codeConstruct,
                    evalReturnExpressionCommand.codeConstruct.argument != null ? this.executionContextStack.getExpressionValue(evalReturnExpressionCommand.codeConstruct.argument)
                                                                               : null
                );
            }
        }
        catch(e)
        {
            this.notifyError(evalReturnExpressionCommand, "Error when evaluating return expression: " + e);
        }
    },

    _evaluateThisExpressionCommand: function(thisExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(thisExpressionCommand, Firecrow.Interpreter.Commands.Command) || !thisExpressionCommand.isThisExpressionCommand()) { this.notifyError(thisExpressionCommand, "Argument is not a ThisExpressionCommand"); return; }

            this.executionContextStack.setExpressionValue
            (
                thisExpressionCommand.codeConstruct,
                this.executionContextStack.activeContext.thisObject
            );
        }
        catch(e) { this.notifyError(thisExpressionCommand, "Error when evaluating this expression: " + e); }
    },

    _evaluateMemberExpressionCommand: function(evalMemberExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalMemberExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evalMemberExpressionCommand.isEvalMemberExpressionCommand()) { this.notifyError(evalMemberExpressionCommand, "Argument is not an EvalMemberExpressionCommand"); return; }

            var memberExpression = evalMemberExpressionCommand.codeConstruct;

            if(memberExpression.loc.start.line == 4869)
            {
                var a = 3;
                a++;
            }

            var object = this.executionContextStack.getExpressionValue(memberExpression.object);

            if(object == null || (object.value == null && object != this.globalObject)) { this._callExceptionCallbacks(); return; }

            var property = this.executionContextStack.getExpressionValue(memberExpression.property);

            var propertyValue;

            if(object == this.globalObject) { propertyValue = this.globalObject.getPropertyValue(property.value); }
            else if (ValueTypeHelper.isOfType(object.value, HTMLElement)) { propertyValue = object.fcInternal.object.getPropertyValue(property.value); }
            else if (ValueTypeHelper.isOfType(object.value, DocumentFragment))
            {
                if(object.fcInternal.object == this.globalObject.document)
                {
                    propertyValue = object.value[property.value];
                }
                else
                {
                    propertyValue = object.fcInternal.object.getPropertyValue(property.value);
                }
            }
            else { propertyValue = object.value[property.value]; }

            var propertyExists = propertyValue !== undefined;

            if(!ValueTypeHelper.isOfType(propertyValue, fcModel.JsValue))
            {
                if(ValueTypeHelper.isPrimitive(propertyValue))
                {
                     propertyValue = new fcModel.JsValue(propertyValue, new fcModel.FcInternal(memberExpression));
                }
                else if(propertyValue != null && propertyValue.jsValue != null)
                {
                    propertyValue = propertyValue.jsValue;
                }
                else
                {
                    this.notifyError(evalMemberExpressionCommand, "The property value should be of type JsValue"); return;
                }
            }

            if(property != null && object != null)
            {
                if(object.fcInternal != null && object.fcInternal.object != null)
                {
                    var fcProperty = object.fcInternal.object.getProperty(property.value, memberExpression);

                    if(fcProperty != null && !ASTHelper.isLastPropertyInLeftHandAssignment(memberExpression.property))
                    {
                        if(fcProperty.lastModificationConstruct != null)
                        {
                            this.globalObject.browser.callDataDependencyEstablishedCallbacks
                            (
                                memberExpression.property,
                                fcProperty.lastModificationConstruct.codeConstruct,
                                this.globalObject.getPreciseEvaluationPositionId(),
                                fcProperty.lastModificationConstruct.evaluationPositionId
                            );
                        }
                        else  if(fcProperty.declarationConstruct != null)
                        {
                            this.globalObject.browser.callDataDependencyEstablishedCallbacks
                            (
                                memberExpression.property,
                                fcProperty.declarationConstruct.codeConstruct,
                                this.globalObject.getPreciseEvaluationPositionId(),
                                fcProperty.declarationConstruct.evaluationPositionId
                            );
                        }
                    }
                }
            }

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(memberExpression, memberExpression.object, this.globalObject.getPreciseEvaluationPositionId());

            //Create a dependency only if the property exists, the problem is that if we don't ignore it here, that will lead to links
            //to constructs where the property was not null
            if(propertyExists || !ASTHelper.isIdentifier(memberExpression.property) || ASTHelper.isLastPropertyInLeftHandAssignment(memberExpression.property))
            {
                this.globalObject.browser.callDataDependencyEstablishedCallbacks(memberExpression, memberExpression.property, this.globalObject.getPreciseEvaluationPositionId());
            }

            this.executionContextStack.setExpressionValue(memberExpression, propertyValue);
        }
        catch(e) { this.notifyError(evalMemberExpressionCommand, "Error when evaluating member expression: " + e); }
    },

    _evaluateMemberExpressionPropertyCommand: function(evalMemberExpressionPropertyCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalMemberExpressionPropertyCommand, Firecrow.Interpreter.Commands.Command) || !evalMemberExpressionPropertyCommand.isEvalMemberExpressionPropertyCommand()) { this.notifyError(evalMemberExpressionPropertyCommand, "Argument is not an EvalMemberExpressionPropertyCommand"); return; }

            var value = null;
            var memberExpression = evalMemberExpressionPropertyCommand.codeConstruct;

            if(evalMemberExpressionPropertyCommand.codeConstruct.computed)
            {
                value = this.executionContextStack.getExpressionValue(memberExpression.property);
            }
            else
            {
                value = new fcModel.JsValue(memberExpression.property.name, new fcModel.FcInternal(memberExpression.property))
            }

            this.executionContextStack.setExpressionValue(memberExpression.property, value);
        }
        catch(e)
        {
            this.notifyError(evalMemberExpressionPropertyCommand, "Error when evaluating member expression property: " + e);
        }
    },

    _evaluateObjectExpressionCommand: function(objectExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(objectExpressionCommand, Firecrow.Interpreter.Commands.Command) || !objectExpressionCommand.isObjectExpressionCommand()) { this.notifyError(objectExpressionCommand, "Argument has to be an object expression creation command!"); return; }

            var newObject = this.globalObject.internalExecutor.createObject(null, objectExpressionCommand.codeConstruct);

            this.executionContextStack.setExpressionValue(objectExpressionCommand.codeConstruct, newObject);

            objectExpressionCommand.createdObject = newObject;
        }
        catch(e) { this.notifyError(objectExpressionCommand, "An error has occurred when evaluating object expression command:" + e); }
    },

    _evaluateObjectPropertyCreationCommand: function(objectPropertyCreationCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(objectPropertyCreationCommand, Firecrow.Interpreter.Commands.Command) || !objectPropertyCreationCommand.isObjectPropertyCreationCommand()) { this.notifyError(objectPropertyCreationCommand, "Argument has to be an object property creation command!"); return; }

            var object = objectPropertyCreationCommand.objectExpressionCommand.createdObject;

            if(object == null || object.value == null) { this.notifyError(objectPropertyCreationCommand, "When evaluating object property the object must not be null!");  return; }

            var propertyCodeConstruct = objectPropertyCreationCommand.codeConstruct;

            var propertyValue = this.executionContextStack.getExpressionValue(propertyCodeConstruct.value);

            var propertyKey = ASTHelper.isLiteral(propertyCodeConstruct.key) ? propertyCodeConstruct.key.value
                                                                             : propertyCodeConstruct.key.name;

            object.value[propertyKey] = propertyValue;
            object.fcInternal.object.addProperty(propertyKey, propertyValue, objectPropertyCreationCommand.codeConstruct);
        }
        catch(e) { this.notifyError(objectPropertyCreationCommand, "Error when evaluating object property creation: " + e); }
    },

    _evaluateArrayExpressionCommand: function(arrayExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(arrayExpressionCommand, Firecrow.Interpreter.Commands.Command) || !arrayExpressionCommand.isArrayExpressionCommand()) { this.notifyError(arrayExpressionCommand, "Argument has to be an array expression creation command!"); return; }

            var newArray = this.globalObject.internalExecutor.createArray(arrayExpressionCommand.codeConstruct);

            this.executionContextStack.setExpressionValue(arrayExpressionCommand.codeConstruct, newArray);

            arrayExpressionCommand.createdArray = newArray;
        }
        catch(e) { this.notifyError(arrayExpressionCommand, "Error when evaluating array expression command:" + e); }
    },

    _evaluateArrayExpressionItemCreationCommand: function(arrayItemCreationCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(arrayItemCreationCommand, Firecrow.Interpreter.Commands.Command) || !arrayItemCreationCommand.isArrayExpressionItemCreationCommand()) { this.notifyError(arrayItemCreationCommand, "Argument has to be an array expression item creation command!"); return; }

            var array = arrayItemCreationCommand.arrayExpressionCommand.createdArray;

            if(array == null || array.value == null) { this.notifyError(arrayItemCreationCommand, "When evaluating array expression item the array must not be null!");  return; }

            var expressionItemValue = this.executionContextStack.getExpressionValue(arrayItemCreationCommand.codeConstruct);

            array.fcInternal.object.push(array.value, expressionItemValue, arrayItemCreationCommand.codeConstruct);
        }
        catch(e) { this.notifyError(arrayItemCreationCommand, "Error when evaluating array expression item creation: " + e); }
    },

    _evaluateForInWhereCommand: function(evalForInWhereCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalForInWhereCommand, Firecrow.Interpreter.Commands.Command) || !evalForInWhereCommand.isEvalForInWhereCommand()) { this.notifyError(evalForInWhereCommand, "Argument has to be an eval for in where command!"); return; }

            var forInWhereConstruct = evalForInWhereCommand.codeConstruct;
            if(forInWhereConstruct.loc.start.line == 5178)
            {
                var a = 3;
            }
            var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

            var whereObject = this.executionContextStack.getExpressionValue(forInWhereConstruct.right);

            if(whereObject != null && whereObject.fcInternal.object != null)
            {
                var modifications = whereObject.fcInternal.object.getLastPropertyModifications(forInWhereConstruct.right);

                for(var i = 0, length = modifications.length; i < length; i++)
                {
                    this.globalObject.browser.callDataDependencyEstablishedCallbacks
                    (
                        forInWhereConstruct.right,
                        modifications[i].codeConstruct,
                        evaluationPosition,
                        modifications[i].evaluationPositionId
                    );
                }
            }

            var currentPropertyIndex = evalForInWhereCommand.currentPropertyIndex;

            var nextPropertyName = whereObject.fcInternal.object.getPropertyNameAtIndex(currentPropertyIndex + 1);

            this.addDependenciesToTopBlockConstructs(forInWhereConstruct.left);
            this.globalObject.browser.callDataDependencyEstablishedCallbacks(forInWhereConstruct, forInWhereConstruct.right, evaluationPosition);
            this.globalObject.browser.callDataDependencyEstablishedCallbacks(forInWhereConstruct.left, forInWhereConstruct.right, evaluationPosition);

            if(nextPropertyName.value)
            {
                evalForInWhereCommand.willBodyBeExecuted = true;

                var property = whereObject.fcInternal.object.getProperty(nextPropertyName.value);
                if(property != null)
                {
                    this.globalObject.browser.callDataDependencyEstablishedCallbacks
                    (
                        forInWhereConstruct.left,
                        property.declarationConstruct.codeConstruct,
                        evaluationPosition
                    );

                    this.globalObject.browser.callDataDependencyEstablishedCallbacks
                    (
                        forInWhereConstruct.left,
                        property.lastModificationConstruct.codeConstruct,
                        evaluationPosition,
                        property.lastModificationConstruct.evaluationPositionId
                    );
                }

                if(ASTHelper.isIdentifier(forInWhereConstruct.left))
                {
                    this.executionContextStack.setIdentifierValue(forInWhereConstruct.left.name, nextPropertyName, forInWhereConstruct.left);
                }
                else if (ASTHelper.isVariableDeclaration(forInWhereConstruct.left))
                {
                    if(forInWhereConstruct.left.declarations.length != 1) { this.notifyError(evalForInWhereCommand, "Invalid number of variable declarations in for in statement!"); return; }

                    var declarator = forInWhereConstruct.left.declarations[0];

                    this.executionContextStack.setIdentifierValue(declarator.id.name, nextPropertyName, declarator);

                    this.globalObject.browser.callDataDependencyEstablishedCallbacks(declarator, forInWhereConstruct.right, evaluationPosition);
                    this.globalObject.browser.callDataDependencyEstablishedCallbacks(declarator.id, forInWhereConstruct.right, evaluationPosition);
                }
                else { this.notifyError(evalForInWhereCommand, "Unknown forIn left statement"); }
            }
            else
            {
                evalForInWhereCommand.willBodyBeExecuted = false;
            }
        }
        catch(e) { this.notifyError(evalForInWhereCommand, "Error when evaluating for in where command: " + e); }
    },

    _evaluateConditionalExpressionCommand: function(conditionalExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(conditionalExpressionCommand, Firecrow.Interpreter.Commands.Command) || !conditionalExpressionCommand.isEvalConditionalExpressionCommand()) { this.notifyError(conditionalExpressionCommand, "Argument has to be an eval conditional expression command!"); return; }

            var bodyExpressionValue = this.executionContextStack.getExpressionValue(conditionalExpressionCommand.body);
            var conditionalConstruct = conditionalExpressionCommand.codeConstruct;

            this.executionContextStack.setExpressionValue(conditionalConstruct, bodyExpressionValue);

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(conditionalConstruct, conditionalExpressionCommand.codeConstruct.test, this.globalObject.getPreciseEvaluationPositionId());
            this.globalObject.browser.callDataDependencyEstablishedCallbacks(conditionalConstruct, conditionalExpressionCommand.body, this.globalObject.getPreciseEvaluationPositionId());
        }
        catch(e) { this.notifyError(conditionalExpressionCommand, "Error when evaluating conditional expression command: " + e); }
    },

    _evaluateStartCatchStatementCommand: function(startCatchStatementCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(startCatchStatementCommand, Firecrow.Interpreter.Commands.Command) || !startCatchStatementCommand.isStartCatchStatementCommand()) { this.notifyError(startCatchStatementCommand, "Argument has to be a start catch command!"); return; }

            if(!ASTHelper.isIdentifier(startCatchStatementCommand.codeConstruct.param)) { this.notifyError(startCatchStatementCommand, "Catch parameter has to be an identifier!"); return; }

            this.executionContextStack.setIdentifierValue
            (
                startCatchStatementCommand.codeConstruct.param.name,
                startCatchStatementCommand.exceptionArgument
            );
        }
        catch(e) { this.notifyError(startCatchStatementCommand, "Error when evaluating conditional expression command: " + e); }
    },

    _evaluateEndCatchStatementCommand: function(endCatchStatementCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(endCatchStatementCommand, Firecrow.Interpreter.Commands.Command) || !endCatchStatementCommand.isEndCatchStatementCommand()) { this.notifyError(endCatchStatementCommand, "Argument has to be an end catch command!"); return; }

            if(!ASTHelper.isIdentifier(endCatchStatementCommand.codeConstruct.param)) { this.notifyError(endCatchStatementCommand, "Catch parameter has to be an identifier!"); return; }

            this.executionContextStack.deleteIdentifier(endCatchStatementCommand.codeConstruct.param.name);
        }
        catch(e) { this.notifyError(endCatchStatementCommand, "Error when evaluating conditional expression command: " + e); }
    },

    _evaluateLogicalExpressionItemCommand: function(evaluateLogicalExpressionItemCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evaluateLogicalExpressionItemCommand, Firecrow.Interpreter.Commands.Command) || !evaluateLogicalExpressionItemCommand.isEvalLogicalExpressionItemCommand()) { this.notifyError(evaluateLogicalExpressionItemCommand, "Argument has to be an eval logical expression item command!"); return; }

            var parentExpressionCommand = evaluateLogicalExpressionItemCommand.parentLogicalExpressionCommand;

            var wholeLogicalExpression = parentExpressionCommand.codeConstruct;
            var logicalExpressionItem = evaluateLogicalExpressionItemCommand.codeConstruct;

            evaluateLogicalExpressionItemCommand.parentEndLogicalExpressionCommand.executedLogicalItemExpressionCommands.push(evaluateLogicalExpressionItemCommand);

            var value = this.executionContextStack.getExpressionValue(logicalExpressionItem);

            if(value == null) { this._callExceptionCallbacks(); return; }

            if(logicalExpressionItem == wholeLogicalExpression.left)
            {
                this.executionContextStack.setExpressionValue(wholeLogicalExpression, value);

                if((value.value && wholeLogicalExpression.operator == "||")
                 ||(!value.value && wholeLogicalExpression.operator == "&&"))
                {
                    evaluateLogicalExpressionItemCommand.shouldDeleteFollowingLogicalCommands = true;
                }
            }
            else if(logicalExpressionItem == wholeLogicalExpression.right)
            {
                var leftValue = this.executionContextStack.getExpressionValue(wholeLogicalExpression.left);
                var rightValue = this.executionContextStack.getExpressionValue(wholeLogicalExpression.right);

                if(leftValue == null || rightValue == null) { this._callExceptionCallbacks(); return; }

                var result = wholeLogicalExpression.operator == "&&" ? leftValue.value && rightValue.value
                                                                     : leftValue.value || rightValue.value;

                var finalExpressionValue = null;

                if(ValueTypeHelper.isPrimitive(result))
                {
                    finalExpressionValue = new fcModel.JsValue(result, new fcModel.FcInternal(wholeLogicalExpression))
                }
                else
                {
                    finalExpressionValue = result === leftValue.value ? leftValue : rightValue;
                }

                if(wholeLogicalExpression.operator == "&&")
                {
                    this.globalObject.browser.callDataDependencyEstablishedCallbacks
                    (
                        wholeLogicalExpression.right,
                        wholeLogicalExpression.left,
                        this.globalObject.getPreciseEvaluationPositionId()
                    );
                }

                this.executionContextStack.setExpressionValue(wholeLogicalExpression, finalExpressionValue);
            }
            else { this.notifyError(evaluateLogicalExpressionItemCommand, "The expression item is neither left nor right expression"); return; }
        }
        catch(e) { this.notifyError(evaluateLogicalExpressionItemCommand, "Error when evaluating logical expression item command: " + e); }
    },

    _evaluateEndLogicalExpressionCommand: function(evaluateEndLogicalExpressionCommand)
    {
        try
        {
            var logicalExpression = evaluateEndLogicalExpressionCommand.codeConstruct;
            var executedItemsCommands = evaluateEndLogicalExpressionCommand.executedLogicalItemExpressionCommands;

            for(var i = 0, length = executedItemsCommands.length; i < length; i++)
            {
                this.globalObject.browser.callDataDependencyEstablishedCallbacks
                (
                    logicalExpression,
                    executedItemsCommands[i].codeConstruct,
                    this.globalObject.getPreciseEvaluationPositionId()
                );
            }
        }
        catch(e) { this.notifyError(evaluateEndLogicalExpressionCommand, "Error when evaluating end logical expression item command: " + e); }
    },

    _evaluateUnaryExpression: function(evaluateUnaryExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evaluateUnaryExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evaluateUnaryExpressionCommand.isEvalUnaryExpressionCommand()) { this.notifyError(evaluateUnaryExpressionCommand, "Argument has to be an eval unary item command!"); return; }

            var unaryExpression = evaluateUnaryExpressionCommand.codeConstruct;
            var argumentValue = this.executionContextStack.getExpressionValue(unaryExpression.argument);
            var expressionValue = null;

            if(argumentValue == null && unaryExpression.operator != "typeof") { this._callExceptionCallbacks(); return; }

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(unaryExpression, unaryExpression.argument, this.globalObject.getPreciseEvaluationPositionId());

                 if (unaryExpression.operator == "-") { expressionValue = -argumentValue.value; }
            else if (unaryExpression.operator == "+") { expressionValue = +argumentValue.value; }
            else if (unaryExpression.operator == "!") { expressionValue = !argumentValue.value; }
            else if (unaryExpression.operator == "~") { expressionValue = ~argumentValue.value; }
            else if (unaryExpression.operator == "typeof") { expressionValue = argumentValue == null ? "undefined" : typeof argumentValue.value; }
            else if (unaryExpression.operator == "void") { expressionValue = void argumentValue.value;}
            else if (unaryExpression.operator == "delete")
            {
                if(ASTHelper.isIdentifier(unaryExpression.argument))
                {
                    this.executionContextStack.deleteIdentifier(unaryExpression.argument.name);
                }
                else if(ASTHelper.isMemberExpression(unaryExpression.argument))
                {
                    var object = this.executionContextStack.getExpressionValue(unaryExpression.argument.object);

                    if(object == null) { this._callExceptionCallbacks(); return; }

                    var propertyName = "";

                    if(unaryExpression.argument.computed)
                    {
                        var propertyValue = this.executionContextStack.getExpressionValue(unaryExpression.argument.property);
                        propertyName = propertyValue != null ? propertyValue.value : "";
                    }
                    else
                    {
                        propertyName = unaryExpression.argument.property.name;
                    }

                    delete object.value[propertyName];
                    object.fcInternal.object.deleteProperty(propertyName, unaryExpression);
                }
                else  { this.notifyError(evaluateUnaryExpressionCommand, "Unhandled expression when evaluating delete"); }

                expressionValue = true;
            }

            this.executionContextStack.setExpressionValue(unaryExpression, new fcModel.JsValue(expressionValue, new fcModel.FcInternal(unaryExpression)));
        }
        catch(e) { this.notifyError(evaluateUnaryExpressionCommand, "Error when evaluating unary expression item command: " + e);}
    },

    _evaluateCallInternalFunction: function(callInternalFunctionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(callInternalFunctionCommand, Firecrow.Interpreter.Commands.Command) || !callInternalFunctionCommand.isCallInternalFunctionCommand()) { this.notifyError(callInternalFunctionCommand, "Argument has to be a call internal function command!"); return; }

            var callExpression = callInternalFunctionCommand.codeConstruct;

            var thisObject = callInternalFunctionCommand.thisObject;
            var args = [];
            var arguments = callExpression.arguments || [];

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(callExpression, callExpression.callee, this.globalObject.getPreciseEvaluationPositionId());

            if(callInternalFunctionCommand.isCall || callInternalFunctionCommand.isApply)
            {
                thisObject = this.executionContextStack.getExpressionValue(arguments[0]);

                if(callInternalFunctionCommand.isCall)
                {
                    for(var i = 1, length = arguments.length; i < length; i++)
                    {
                        var argument = arguments[i];
                        this.globalObject.browser.callDataDependencyEstablishedCallbacks(callExpression, argument, this.globalObject.getPreciseEvaluationPositionId());
                        args.push(this.executionContextStack.getExpressionValue(argument));
                    }
                }
                else
                {
                    var secondArgumentValue = this.executionContextStack.getExpressionValue(arguments[1]);

                    if(secondArgumentValue != null && secondArgumentValue.value != null)
                    {
                        args = secondArgumentValue.value;
                    }

                    if(ValueTypeHelper.isArray(secondArgumentValue.value))
                    {
                        secondArgumentValue.fcInternal.object.addDependenciesToAllProperties(callExpression);
                    }
                }
            }
            else
            {
                for(var i = 0, length = arguments.length; i < length; i++)
                {
                    var argument = arguments[i];
                    this.globalObject.browser.callDataDependencyEstablishedCallbacks(callExpression, argument, this.globalObject.getPreciseEvaluationPositionId());
                    args.push(this.executionContextStack.getExpressionValue(argument));
                }
            }

            this.executionContextStack.setExpressionValue
            (
                callInternalFunctionCommand.codeConstruct,
                this.globalObject.internalExecutor.executeFunction
                (
                    thisObject,
                    callInternalFunctionCommand.functionObject,
                    args,
                    callInternalFunctionCommand.codeConstruct,
                    callInternalFunctionCommand
                )
            );
        }
        catch(e)
        {
            this.notifyError(callInternalFunctionCommand, "Error has occurred when evaluating call internal function command:" + e);
        }
    },

    _evaluateCallbackFunctionCommand: function(evalCallbackFunctionCommand)
    {
        try
        {

        }
        catch(e) { this.notifyError(evalCallbackFunctionCommand, "Error has occurred when evaluating callback function command"); }
    },

    _evaluateSequenceExpression: function(evalSequenceCommand)
    {
        try
        {
            var sequenceExpression = evalSequenceCommand.codeConstruct;
            var lastExpression = sequenceExpression.expressions[sequenceExpression.expressions.length - 1];

            this.executionContextStack.setExpressionValue
            (
                sequenceExpression,
                this.executionContextStack.getExpressionValue(lastExpression)
            );

            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                sequenceExpression,
                lastExpression,
                this.globalObject.getPreciseEvaluationPositionId()
            );
        }
        catch(e) { this.notifyError(evalSequenceCommand, "Error has occurred when evaluating sequence"); }
    },

    registerExceptionCallback: function(callback, thisObject)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(callback, Function)) { this.notifyError(null, "Exception callback has to be a function!"); return; }

            this.exceptionCallbacks.push({callback: callback, thisObject: thisObject || this});
        }
        catch(e) { this.notifyError(null, "Error when registering exception callback:" + e);}
    },

    _callExceptionCallbacks: function(exceptionInfo)
    {
        this.exceptionCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, exceptionInfo);
        });
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

       // this.executionContextStack.addDependencyToLastExecutedBlockStatement(currentConstruct);

        /*if(currentConstruct.previousCondition != null)
        {
            this.globalObject.browser.callControlDependencyEstablishedCallbacks(currentConstruct, currentConstruct.previousCondition, evaluationPosition);
        }*/
    },

    notifyError: function(command, message)
    {
        Firecrow.Interpreter.Simulator.Evaluator.notifyError(message + "@" + (command != null ? (command.codeConstruct.loc.source + " - Ln:" + command.codeConstruct.loc.start.line) : ""));
    }
};
}});
