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

fcSimulator.Evaluator = function(executionContextStack, globalObject)
{
    this.executionContextStack = executionContextStack;
    this.globalObject = globalObject;

    this.exceptionCallbacks = [];
};

fcSimulator.Evaluator.prototype =
{
    evaluateCommand: function(command)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(command, Firecrow.Interpreter.Commands.Command)) { this.notifyError("When evaluating the argument has to be of type command"); return; }

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
            else if (command.isEvalUnaryExpressionCommand()) { this._evaluateUnaryExpression(command); }
            else if (command.isCallInternalFunctionCommand()) { this._evaluateCallInternalFunction(command); }
            else { this.notifyError("Evaluator: Still not handling command of type: " +  command.type); return; }
        }
        catch(e) { this.notifyError("An error occurred when evaluating command: " + e);}
    },

    _evaluateDeclareVariableCommand: function(declareVariableCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(declareVariableCommand, Firecrow.Interpreter.Commands.Command) || !declareVariableCommand.isDeclareVariableCommand()) { this.notifyError("Argument is not a DeclareVariableCommand"); return; }

            this.executionContextStack.registerIdentifier(declareVariableCommand.codeConstruct);
        }
        catch(e) { this.notifyError("Error when evaluating declare variable: " + e); }
    },

    _evaluateDeclareFunctionCommand: function(declareFunctionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(declareFunctionCommand, Firecrow.Interpreter.Commands.Command) || !declareFunctionCommand.isDeclareFunctionCommand()) { this.notifyError("Argument is not a DeclareFunctionCommand"); return; }

            this.executionContextStack.registerFunctionDeclaration(declareFunctionCommand.codeConstruct);
        }
        catch(e) { this.notifyError("Error when evaluating declare function: " + e); }
    },

    _evaluateFunctionExpressionCreationCommand: function(functionExpressionCreationCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(functionExpressionCreationCommand, Firecrow.Interpreter.Commands.Command) || !functionExpressionCreationCommand.isFunctionExpressionCreationCommand()) { this.notifyError("Argument is not a function expression creation command"); return; }

            this.executionContextStack.setExpressionValue
            (
                functionExpressionCreationCommand.codeConstruct,
                this.executionContextStack.createFunctionInCurrentContext(functionExpressionCreationCommand.codeConstruct)
            );
        }
        catch(e) { this.notifyError("Error when evaluating declare function: " + e); }
    },

    _evaluateLiteralCommand: function(evalLiteralCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalLiteralCommand, Firecrow.Interpreter.Commands.Command) || !evalLiteralCommand.isEvalLiteralCommand()) { this.notifyError("Argument is not an EvalLiteralCommand"); return; }

            this.executionContextStack.setExpressionValue(evalLiteralCommand.codeConstruct, new fcModel.JsValue(evalLiteralCommand.codeConstruct.value, new fcModel.FcInternal(evalLiteralCommand.codeConstruct)));
        }
        catch(e) { this.notifyError("Error when evaluating literal: " + e); }
    },

    _evaluateRegExLiteralCommand: function(evalRegExCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalRegExCommand, Firecrow.Interpreter.Commands.Command) || !evalRegExCommand.isEvalRegExCommand()) { this.notifyError("Argument is not an EvalRegExCommand"); return; }

            var regEx = eval(evalRegExCommand.regExLiteral);

            this.executionContextStack.setExpressionValue
            (
                evalRegExCommand.codeConstruct,
                Firecrow.Interpreter.Simulator.InternalExecutor.createRegEx(this.globalObject, evalRegExCommand.codeConstruct, regEx)
            );
        }
        catch(e) { this.notifyError("Error when evaluating literal: " + e); }
    },

    _evaluateAssignmentExpressionCommand: function(evalAssignmentExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalAssignmentExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evalAssignmentExpressionCommand.isEvalAssignmentExpressionCommand()) { this.notifyError("Argument is not an EvalAssignmentExpressionCommand"); return; }

            var operator = evalAssignmentExpressionCommand.operator;
            var finalValue = null;

            if(operator == "=")
            {
                if(evalAssignmentExpressionCommand.rightSide != null)
                {
                    finalValue = this.executionContextStack.getExpressionValue(evalAssignmentExpressionCommand.rightSide);
                }
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
                else { this.notifyError("Unknown assignment operator!"); return; }

                finalValue = new fcModel.JsValue(result, new fcModel.FcInternal(evalAssignmentExpressionCommand.codeConstruct));
            }

            finalValue = finalValue.isPrimitive() ? finalValue.createCopy(evalAssignmentExpressionCommand.rightSide) : finalValue

            if(ASTHelper.isIdentifier(evalAssignmentExpressionCommand.leftSide))
            {
                this.executionContextStack.setIdentifierValue
                (
                    evalAssignmentExpressionCommand.leftSide.name,
                    finalValue,
                    evalAssignmentExpressionCommand.codeConstruct
                );
            }
            else
            {
                var object = this.executionContextStack.getExpressionValue(evalAssignmentExpressionCommand.leftSide.object);
                var property = this.executionContextStack.getExpressionValue(evalAssignmentExpressionCommand.leftSide.property);

                if(object == null || object.value == null) { this._callExceptionCallbacks(); return; }

                object.value[property.value] = finalValue;

                if(property.value == "__proto__" || property.value == "prototype")
                {
                    object.value[property.value] = finalValue.value;
                }

                object.fcInternal.object.addProperty(property.value, finalValue, evalAssignmentExpressionCommand.codeConstruct, true);
            }

            this.executionContextStack.setExpressionValue
            (
                evalAssignmentExpressionCommand.codeConstruct,
                finalValue
            );
        }
        catch(e)
        {
            this.notifyError("Error when evaluating assignment expression " + e + evalAssignmentExpressionCommand.codeConstruct.loc.source);
        }
    },

    _evaluateUpdateExpressionCommand: function(evalUpdateExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalUpdateExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evalUpdateExpressionCommand.isEvalUpdateExpressionCommand()) { this.notifyError("Argument is not an UpdateExpressionCommand"); return; }

            var codeConstruct = evalUpdateExpressionCommand.codeConstruct;
            var currentValue = this.executionContextStack.getExpressionValue(codeConstruct.argument);

            if(currentValue == null || currentValue.value == null) { this._callExceptionCallbacks(); return; }

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

                if(object == null) { this.notifyError("Can not update a property of null object!"); return; }

                var newValue = new fcModel.JsValue(codeConstruct.operator == "++" ? currentValue.value + 1 : currentValue.value - 1, new fcModel.FcInternal(codeConstruct));

                object.value[property.value] = newValue;
                object.fcInternal.object.addProperty(property.value, newValue, codeConstruct, true);
            }
            else { this.notifyError("Unknown code construct when updating expression!"); }

            this.executionContextStack.setExpressionValue
            (
                codeConstruct,
                codeConstruct.prefix ? (new fcModel.JsValue(codeConstruct.operator == "++" ? ++currentValue.value : --currentValue.value, new fcModel.FcInternal(codeConstruct)))
                                     : (new fcModel.JsValue(codeConstruct.operator == "++" ? currentValue.value++ : currentValue.value--, new fcModel.FcInternal(codeConstruct)))
            )
        }
        catch(e) { this.notifyError("An error has occurred when updating an expression:" + e); }
    },

    _evaluateIdentifierCommand: function(evalIdentifierCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalIdentifierCommand, Firecrow.Interpreter.Commands.Command) || !evalIdentifierCommand.isEvalIdentifierCommand()) { this.notifyError("Argument is not an EvalIdentifierExpressionCommand"); return; }

            this.executionContextStack.setExpressionValue
            (
                evalIdentifierCommand.codeConstruct,
                this.executionContextStack.getIdentifierValue(evalIdentifierCommand.codeConstruct.name)
            );
        }
        catch(e) { this.notifyError("error when evaluating identifier: " + e);}
    },

    _evaluateBinaryExpressionCommand: function(evalBinaryExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalBinaryExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evalBinaryExpressionCommand.isEvalBinaryExpressionCommand()) { this.notifyError("Argument is not an EvalBinaryExpressionCommand"); return;}

            var binaryExpression = evalBinaryExpressionCommand.codeConstruct;

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
            else if (operator == "+") { result = leftExpressionValue.value + rightExpressionValue.value; }
            else if (operator == "-") { result = leftExpressionValue.value - rightExpressionValue.value; }
            else if (operator == "*") { result = leftExpressionValue.value * rightExpressionValue.value; }
            else if (operator == "/") { result = leftExpressionValue.value / rightExpressionValue.value; }
            else if (operator == "%") { result = leftExpressionValue.value % rightExpressionValue.value; }
            else if (operator == "|") { result = leftExpressionValue.value | rightExpressionValue.value; }
            else if (operator == "^") { result = leftExpressionValue.value ^ rightExpressionValue.value; }
            else if (operator == "in") { result = leftExpressionValue.value in rightExpressionValue.value; }
            else if (operator == "instanceof") { result = leftExpressionValue.value instanceof rightExpressionValue.value; }
            else { this.notifyError("Unknown operator when evaluating binary expression"); return; }

            this.executionContextStack.setExpressionValue(binaryExpression, new fcModel.JsValue(result, new fcModel.FcInternal(binaryExpression)));
        }
        catch(e) { this.notifyError("Error when evaluating binary expression: " + e);}
    },

    _evaluateReturnExpressionCommand: function(evalReturnExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalReturnExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evalReturnExpressionCommand.isEvalReturnExpressionCommand()) { this.notifyError("Argument is not an EvalReturnExpressionCommand"); return; }

            if(evalReturnExpressionCommand.parentFunctionCommand.isExecuteCallbackCommand())
            {
                var executeCallbackCommand = evalReturnExpressionCommand.parentFunctionCommand;

                if(executeCallbackCommand.calledOnObject !=null && ValueTypeHelper.isArray(executeCallbackCommand.calledOnObject.value))
                {
                    fcModel.ArrayCallbackEvaluator.evaluateCallbackReturn
                    (
                        executeCallbackCommand,
                        executeCallbackCommand.calledOnObject,
                        executeCallbackCommand.parentCallCallbackCommand.functionObject,
                        executeCallbackCommand.resultingObject,
                        evalReturnExpressionCommand.codeConstruct.argument != null ? this.executionContextStack.getExpressionValue(evalReturnExpressionCommand.codeConstruct.argument)
                                                                                   : null
                    );
                }
            }
            else
            {
                this.executionContextStack.setExpressionValueInPreviousContext
                (
                    evalReturnExpressionCommand.parentFunctionCommand.codeConstruct,
                    evalReturnExpressionCommand.codeConstruct.argument != null ? this.executionContextStack.getExpressionValue(evalReturnExpressionCommand.codeConstruct.argument)
                                                                               : null
                );
            }
        }
        catch(e) { this.notifyError("Error when evaluating return expression: " + e); }
    },

    _evaluateThisExpressionCommand: function(thisExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(thisExpressionCommand, Firecrow.Interpreter.Commands.Command) || !thisExpressionCommand.isThisExpressionCommand()) { this.notifyError("Argument is not a ThisExpressionCommand"); return; }

            this.executionContextStack.setExpressionValue
            (
                thisExpressionCommand.codeConstruct,
                this.executionContextStack.activeContext.thisObject
            );
        }
        catch(e) { this.notifyError("Error when evaluating this expression: " + e); }
    },

    _evaluateMemberExpressionCommand: function(evalMemberExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalMemberExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evalMemberExpressionCommand.isEvalMemberExpressionCommand()) { this.notifyError("Argument is not an EvalMemberExpressionCommand"); return; }

            var object = this.executionContextStack.getExpressionValue(evalMemberExpressionCommand.codeConstruct.object);

            if(object == null || object.value == null) { this._callExceptionCallbacks(); return; }

            var property = this.executionContextStack.getExpressionValue(evalMemberExpressionCommand.codeConstruct.property);

            var propertyValue = object.value[property.value];

            if(!ValueTypeHelper.isOfType(propertyValue, fcModel.JsValue) && propertyValue != undefined )
            {
                if(propertyValue != null && ValueTypeHelper.isPrimitive(propertyValue))
                {
                     propertyValue = new fcModel.JsValue(propertyValue, new fcModel.FcInternal(evalMemberExpressionCommand.codeConstruct));
                }
                else if(propertyValue != null && propertyValue.jsValue != null)
                {
                    propertyValue = propertyValue.jsValue;
                }
                else
                {
                    this.notifyError("The property value should be of type JsValue"); return;
                }
            }

            this.executionContextStack.setExpressionValue(evalMemberExpressionCommand.codeConstruct, propertyValue);
        }
        catch(e) { this.notifyError("Error when evaluating member expression: " + e); }
    },

    _evaluateMemberExpressionPropertyCommand: function(evalMemberExpressionPropertyCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalMemberExpressionPropertyCommand, Firecrow.Interpreter.Commands.Command) || !evalMemberExpressionPropertyCommand.isEvalMemberExpressionPropertyCommand()) { this.notifyError("Argument is not an EvalMemberExpressionPropertyCommand"); return; }

            this.executionContextStack.setExpressionValue
            (
                evalMemberExpressionPropertyCommand.codeConstruct.property,
                evalMemberExpressionPropertyCommand.codeConstruct.computed ? this.executionContextStack.getExpressionValue(evalMemberExpressionPropertyCommand.codeConstruct.property)
                                                                           : new fcModel.JsValue(evalMemberExpressionPropertyCommand.codeConstruct.property.name, new fcModel.FcInternal(evalMemberExpressionPropertyCommand.codeConstruct.property))
            );
        }
        catch(e)
        {
            this.notifyError("Error when evaluating member expression property: " + e);
        }
    },

    _evaluateObjectExpressionCommand: function(objectExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(objectExpressionCommand, Firecrow.Interpreter.Commands.Command) || !objectExpressionCommand.isObjectExpressionCommand()) { this.notifyError("Argument has to be an object expression creation command!"); return; }

            var newObject = this.executionContextStack.createObjectInCurrentContext(null, objectExpressionCommand.codeConstruct);

            this.executionContextStack.setExpressionValue(objectExpressionCommand.codeConstruct, newObject);

            objectExpressionCommand.createdObject = newObject;
        }
        catch(e) { this.notifyError("An error has occurred when evaluating object expression command:" + e); }
    },

    _evaluateObjectPropertyCreationCommand: function(objectPropertyCreationCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(objectPropertyCreationCommand, Firecrow.Interpreter.Commands.Command) || !objectPropertyCreationCommand.isObjectPropertyCreationCommand()) { this.notifyError("Argument has to be an object property creation command!"); return; }

            var object = objectPropertyCreationCommand.objectExpressionCommand.createdObject;

            if(object == null || object.value == null) { this.notifyError("When evaluating object property the object must not be null!");  return; }

            var propertyCodeConstruct = objectPropertyCreationCommand.codeConstruct;

            var propertyValue = this.executionContextStack.getExpressionValue(propertyCodeConstruct.value);

            var propertyKey = ASTHelper.isLiteral(propertyCodeConstruct.key) ? propertyCodeConstruct.key.value
                                                                             : propertyCodeConstruct.key.name;

            object.value[propertyKey] = propertyValue;
            object.fcInternal.object.addProperty(propertyKey, propertyValue, objectPropertyCreationCommand.codeConstruct);
        }
        catch(e) { this.notifyError("Error when evaluating object property creation: " + e); }
    },

    _evaluateArrayExpressionCommand: function(arrayExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(arrayExpressionCommand, Firecrow.Interpreter.Commands.Command) || !arrayExpressionCommand.isArrayExpressionCommand()) { this.notifyError("Argument has to be an array expression creation command!"); return; }

            var newArray = this.executionContextStack.createArrayInCurrentContext(arrayExpressionCommand.codeConstruct);

            this.executionContextStack.setExpressionValue(arrayExpressionCommand.codeConstruct, newArray);

            arrayExpressionCommand.createdArray = newArray;
        }
        catch(e) { this.notifyError("Error when evaluating array expression command:" + e); }
    },

    _evaluateArrayExpressionItemCreationCommand: function(arrayItemCreationCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(arrayItemCreationCommand, Firecrow.Interpreter.Commands.Command) || !arrayItemCreationCommand.isArrayExpressionItemCreationCommand()) { this.notifyError("Argument has to be an array expression item creation command!"); return; }

            var array = arrayItemCreationCommand.arrayExpressionCommand.createdArray;

            if(array == null || array.value == null) { this.notifyError("When evaluating array expression item the array must not be null!");  return; }

            var expressionItemValue = this.executionContextStack.getExpressionValue(arrayItemCreationCommand.codeConstruct);

            array.value.push(expressionItemValue);
            array.fcInternal.object.push(expressionItemValue, arrayItemCreationCommand.codeConstruct);
        }
        catch(e) { this.notifyError("Error when evaluating array expression item creation: " + e); }
    },

    _evaluateForInWhereCommand: function(evalForInWhereCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalForInWhereCommand, Firecrow.Interpreter.Commands.Command) || !evalForInWhereCommand.isEvalForInWhereCommand()) { this.notifyError("Argument has to be an eval for in where command!"); return; }

            var forInWhereConstruct = evalForInWhereCommand.codeConstruct;

            var whereObject = this.executionContextStack.getExpressionValue(forInWhereConstruct.right);

            var currentPropertyIndex = evalForInWhereCommand.currentPropertyIndex;
            var nextPropertyName = whereObject.fcInternal.object.getPropertyNameAtIndex(currentPropertyIndex + 1);

            if(nextPropertyName.value)
            {
                evalForInWhereCommand.willBodyBeExecuted = true;

                if(ASTHelper.isIdentifier(forInWhereConstruct.left))
                {
                    this.executionContextStack.setIdentifierValue
                    (
                        forInWhereConstruct.left.name,
                        nextPropertyName,
                        forInWhereConstruct
                    );
                }
                else if (ASTHelper.isVariableDeclaration(forInWhereConstruct.left))
                {
                    if(forInWhereConstruct.left.declarations.length != 1) { this.notifyError("Invalid number of variable declarations in for in statement!"); return; }

                    this.executionContextStack.setIdentifierValue
                    (
                        forInWhereConstruct.left.declarations[0].id.name,
                        nextPropertyName,
                        forInWhereConstruct
                    );
                }
                else { this.notifyError("Unknown forIn left statement"); }
            }
            else
            {
                evalForInWhereCommand.willBodyBeExecuted = false;
            }
        }
        catch(e) { this.notifyError("Error when evaluating for in where command: " + e); }
    },

    _evaluateConditionalExpressionCommand: function(conditionalExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(conditionalExpressionCommand, Firecrow.Interpreter.Commands.Command) || !conditionalExpressionCommand.isEvalConditionalExpressionCommand()) { this.notifyError("Argument has to be an eval conditional expression command!"); return; }

            this.executionContextStack.setExpressionValue
            (
                conditionalExpressionCommand.codeConstruct,
                this.executionContextStack.getExpressionValue(conditionalExpressionCommand.body)
            );
        }
        catch(e) { this.notifyError("Error when evaluating conditional expression command: " + e); }
    },

    _evaluateStartCatchStatementCommand: function(startCatchStatementCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(startCatchStatementCommand, Firecrow.Interpreter.Commands.Command) || !startCatchStatementCommand.isStartCatchStatementCommand()) { this.notifyError("Argument has to be a start catch command!"); return; }

            if(!ASTHelper.isIdentifier(startCatchStatementCommand.codeConstruct.param)) { this.notifyError("Catch parameter has to be an identifier!"); return; }

            this.executionContextStack.setIdentifierValue
            (
                startCatchStatementCommand.codeConstruct.param.name,
                startCatchStatementCommand.exceptionArgument
            );
        }
        catch(e) { this.notifyError("Error when evaluating conditional expression command: " + e); }
    },

    _evaluateEndCatchStatementCommand: function(endCatchStatementCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(endCatchStatementCommand, Firecrow.Interpreter.Commands.Command) || !endCatchStatementCommand.isEndCatchStatementCommand()) { this.notifyError("Argument has to be an end catch command!"); return; }

            if(!ASTHelper.isIdentifier(endCatchStatementCommand.codeConstruct.param)) { this.notifyError("Catch parameter has to be an identifier!"); return; }

            this.executionContextStack.deleteIdentifier(endCatchStatementCommand.codeConstruct.param.name);
        }
        catch(e) { this.notifyError("Error when evaluating conditional expression command: " + e); }
    },

    _evaluateLogicalExpressionItemCommand: function(evaluateLogicalExpressionItemCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evaluateLogicalExpressionItemCommand, Firecrow.Interpreter.Commands.Command) || !evaluateLogicalExpressionItemCommand.isEvalLogicalExpressionItemCommand()) { this.notifyError("Argument has to be an eval logical expression item command!"); return; }

            var parentExpressionCommand = evaluateLogicalExpressionItemCommand.parentLogicalExpressionCommand;

            var wholeLogicalExpression = parentExpressionCommand.codeConstruct;
            var logicalExpressionItem = evaluateLogicalExpressionItemCommand.codeConstruct;

            var value = this.executionContextStack.getExpressionValue(evaluateLogicalExpressionItemCommand.codeConstruct);

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

                this.executionContextStack.setExpressionValue
                (
                    wholeLogicalExpression,
                    new fcModel.JsValue
                    (
                        wholeLogicalExpression.operator == "&&" ? leftValue.value && rightValue.value
                                                                : leftValue.value || rightValue.value,
                        new fcModel.FcInternal(wholeLogicalExpression)
                    )
                );
            }
            else { this.notifyError("The expression item is neither left nor right expression"); return; }
        }
        catch(e) { this.notifyError("Error when evaluating logical expression item command: " + e); }
    },

    _evaluateUnaryExpression: function(evaluateUnaryExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evaluateUnaryExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evaluateUnaryExpressionCommand.isEvalUnaryExpressionCommand()) { this.notifyError("Argument has to be an eval unary item command!"); return; }

            var unaryExpression = evaluateUnaryExpressionCommand.codeConstruct;
            var argumentValue = this.executionContextStack.getExpressionValue(unaryExpression.argument);
            var expressionValue = null;

            if(argumentValue == null) { this._callExceptionCallbacks(); return; }

                 if (unaryExpression.operator == "-") { expressionValue = -argumentValue.value; }
            else if (unaryExpression.operator == "+") { expressionValue = +argumentValue.value; }
            else if (unaryExpression.operator == "!") { expressionValue = !argumentValue.value; }
            else if (unaryExpression.operator == "~") { expressionValue = ~argumentValue.value; }
            else if (unaryExpression.operator == "typeof") { expressionValue = typeof argumentValue.value; }
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
                else  { this.notifyError("Unhandled expression when evaluating delete"); }

                expressionValue = true;
            }

            this.executionContextStack.setExpressionValue(unaryExpression, new fcModel.JsValue(expressionValue, new fcModel.FcInternal(unaryExpression)));
        }
        catch(e) { this.notifyError("Error when evaluating unary expression item command: " + e);}
    },

    _evaluateCallInternalFunction: function(callInternalFunctionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(callInternalFunctionCommand, Firecrow.Interpreter.Commands.Command) || !callInternalFunctionCommand.isCallInternalFunctionCommand()) { this.notifyError("Argument has to be a call internal function command!"); return; }

            var args = [];
            var callExpression = callInternalFunctionCommand.codeConstruct;

            if(callExpression.arguments != null)
            {
                callExpression.arguments.forEach(function(argument)
                {
                    args.push(this.executionContextStack.getExpressionValue(argument));
                }, this);
            }

            this.executionContextStack.setExpressionValue
            (
                callInternalFunctionCommand.codeConstruct,
                Firecrow.Interpreter.Simulator.InternalExecutor.executeFunction
                (
                    callInternalFunctionCommand.thisObject,
                    callInternalFunctionCommand.functionObject,
                    args,
                    this.globalObject,
                    callInternalFunctionCommand.codeConstruct
                )
            );
        }
        catch(e)
        {
            this.notifyError("Error has occurred when evaluating call internal function command:" + e);
        }
    },

    registerExceptionCallback: function(callback, thisObject)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(callback, Function)) { this.notifyError("Exception callback has to be a function!"); return; }

            this.exceptionCallbacks.push({callback: callback, thisObject: thisObject || this});
        }
        catch(e) { this.notifyError("Error when registering exception callback:" + e);}
    },

    _callExceptionCallbacks: function(exceptionInfo)
    {
        this.exceptionCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, exceptionInfo);
        });
    },

    notifyError: function(message) { alert("Evaluator - " + message); }
};
}});
