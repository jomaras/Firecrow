/**
 * User: Jomaras
 * Date: 08.05.12.
 * Time: 13:19
 */
FBL.ns(function() { with (FBL) {
    /*************************************************************************************/
    const ValueTypeHelper = Firecrow.ValueTypeHelper;
    const ASTHelper = Firecrow.ASTHelper;
    const fcSimulator = Firecrow.Interpreter.InterpreterSimulator;

    Firecrow.Interpreter.Simulator.Evaluator = function(executionContextStack, globalObject)
    {
        this.executionContextStack = executionContextStack;
        this.globalObject = globalObject;
    };

    Firecrow.Interpreter.Simulator.Evaluator.prototype =
    {
        evaluateCommand: function(command)
        {
            try
            {
                if(!ValueTypeHelper.isOfType(command, Firecrow.Interpreter.Commands.Command)) { alert("Evaluator: When evaluating the argument has to be of type command"); return; }

                     if (command.isDeclareVariableCommand()) { this._evaluateDeclareVariableCommand(command); }
                else if (command.isDeclareFunctionCommand()) { this._evaluateDeclareFunctionCommand(command); }
                else if (command.isEvalIdentifierCommand()) { this._evaluateIdentifierCommand(command); }
                else if (command.isEvalLiteralCommand()) { this._evaluateLiteralCommand(command); }
                else if (command.isEvalAssignmentExpressionCommand()) { this._evaluateAssignmentExpressionCommand(command); }
                else if (command.isEvalUpdateExpressionCommand()) { this._evaluateUpdateExpressionCommand(command); }
                else if (command.isEvalBinaryExpressionCommand()) { this._evaluateBinaryExpressionCommand(command); }
                else if (command.isEvalCallExpressionCommand()) { this._evaluateCallExpressionCommand(command); }
                else if (command.isEvalReturnExpressionCommand()) { this._evaluateReturnExpressionCommand(command); }
                else if (command.isThisExpressionCommand()) { this._evaluateThisExpressionCommand(command); }
                else if (command.isEvalMemberExpressionCommand()) { this._evaluateMemberExpressionCommand(command); }
                else if (command.isEvalMemberExpressionPropertyCommand()) { this._evaluateMemberExpressionPropertyCommand(command); }
                else if (command.isObjectExpressionCommand()) { this._evaluateObjectExpressionCommand(command); }
                else if (command.isObjectPropertyCreationCommand()) { this._evaluateObjectPropertyCreationCommand(command);}
                else if (command.isArrayExpressionCommand()) { this._evaluateArrayExpressionCommand(command);}
                else if (command.isArrayExpressionItemCreationCommand()) { this._evaluateArrayExpressionItemCreationCommand(command);}
                else if (command.isFunctionExpressionCreationCommand()) { this._evaluateFunctionExpressionCreationCommand(command); }
                else
                {
                    alert("Evaluator: Still not handling command of type: " +  command.type);
                    return;
                }
            }
            catch(e) { alert("Evaluator: An error occurred when evaluating command: " + e);}
        },

        _evaluateDeclareVariableCommand: function(declareVariableCommand)
        {
            try
            {
                if(!ValueTypeHelper.isOfType(declareVariableCommand, Firecrow.Interpreter.Commands.Command) || !declareVariableCommand.isDeclareVariableCommand()) { alert("Evaluator: is not a DeclareVariableCommand"); return; }

                this.executionContextStack.registerIdentifier(declareVariableCommand.codeConstruct);
            }
            catch(e) { alert("Evaluator: Error when evaluating declare variable: " + e); }
        },

        _evaluateDeclareFunctionCommand: function(declareFunctionCommand)
        {
            try
            {
                if(!ValueTypeHelper.isOfType(declareFunctionCommand, Firecrow.Interpreter.Commands.Command) || !declareFunctionCommand.isDeclareFunctionCommand()) { alert("Evaluator: is not a DeclareFunctionCommand"); return; }

                this.executionContextStack.registerFunctionDeclaration(declareFunctionCommand.codeConstruct);
            }
            catch(e) { alert("Evaluator: Error when evaluating declare function: " + e); }
        },

        _evaluateFunctionExpressionCreationCommand: function(functionExpressionCreationCommand)
        {
            try
            {
                if(!ValueTypeHelper.isOfType(functionExpressionCreationCommand, Firecrow.Interpreter.Commands.Command) || !functionExpressionCreationCommand.isFunctionExpressionCreationCommand()) { alert("Evaluator: is not a function expression creation command"); return; }

                this.executionContextStack.setExpressionValue
                (
                    functionExpressionCreationCommand.codeConstruct,
                    this.executionContextStack.createFunctionInCurrentContext(functionExpressionCreationCommand.codeConstruct)
                );
            }
            catch(e) { alert("Evaluator: Error when evaluating declare function: " + e); }
        },

        _evaluateLiteralCommand: function(evalLiteralCommand)
        {
            try
            {
                if(!ValueTypeHelper.isOfType(evalLiteralCommand, Firecrow.Interpreter.Commands.Command) || !evalLiteralCommand.isEvalLiteralCommand()) { alert("Evaluator: is not an EvalLiteralCommand"); return; }

                this.executionContextStack.setExpressionValue(evalLiteralCommand.codeConstruct, evalLiteralCommand.codeConstruct.value);
            }
            catch(e) { alert("Evaluator - error when evaluating literal: " + e);}
        },

        _evaluateAssignmentExpressionCommand: function(evalAssignmentExpressionCommand)
        {
            try
            {
                if(!ValueTypeHelper.isOfType(evalAssignmentExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evalAssignmentExpressionCommand.isEvalAssignmentExpressionCommand()) { alert("Evaluator: is not an EvalAssignmentExpressionCommand"); return; }

                var operator = evalAssignmentExpressionCommand.operator;
                var finalValue = undefined;

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

                    if(operator == "+=") { finalValue = leftValue + rightValue; }
                    else if (operator == "-=") { finalValue = leftValue - rightValue; }
                    else if (operator == "*=") { finalValue = leftValue * rightValue; }
                    else if (operator == "/=") { finalValue = leftValue / rightValue; }
                    else if (operator == "%=") { finalValue = leftValue % rightValue; }
                    else if (operator == "<<=") { finalValue = leftValue << rightValue; }
                    else if (operator == ">>=") { finalValue = leftValue >> rightValue; }
                    else if (operator == ">>>=") { finalValue = leftValue >>> rightValue; }
                    else if (operator == "|=") { finalValue = leftValue | rightValue; }
                    else if (operator == "^=") { finalValue = leftValue ^ rightValue; }
                    else if (operator == "&=") { finalValue = leftValue & rightValue; }
                    else { alert("Evaluator: Unknown assignment operator!"); return; }
                }

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

                    if(object == null) { alert("Can not write to a property of null object!"); return; }

                    object[property] = finalValue;
                    object.__FIRECROW_INTERNAL__.object.addProperty(property, finalValue, evalAssignmentExpressionCommand.codeConstruct, true);
                }

                this.executionContextStack.setExpressionValue
                (
                    evalAssignmentExpressionCommand.codeConstruct,
                    finalValue
                );
            }
            catch(e) { alert("Evaluator - error when evaluating assignment expression " + e);}
        },

        _evaluateUpdateExpressionCommand: function(evalUpdateExpressionCommand)
        {
            try
            {
                if(!ValueTypeHelper.isOfType(evalUpdateExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evalUpdateExpressionCommand.isEvalUpdateExpressionCommand()) { alert("Evaluator: is not an UpdateExpressionCommand"); return; }

                var codeConstruct = evalUpdateExpressionCommand.codeConstruct;
                var currentValue = this.executionContextStack.getExpressionValue(codeConstruct.argument);

                if(ASTHelper.isIdentifier(codeConstruct.argument))
                {
                    this.executionContextStack.setIdentifierValue
                    (
                        codeConstruct.argument.name,
                        codeConstruct.operator == "++" ? currentValue + 1 : currentValue - 1
                    );
                }
                else
                {
                    alert("Still not handling updates non-identifier expressions!");
                }

                this.executionContextStack.setExpressionValue
                (
                    codeConstruct.argument,
                    codeConstruct.prefix ? (codeConstruct.operator == "++" ? ++currentValue : --currentValue) : (codeConstruct.operator == "++" ? currentValue++ : currentValue--)
                )
            }
            catch(e) { alert("Evaluator: An error has occurred when updating an expression:" + e); }
        },

        _evaluateIdentifierCommand: function(evalIdentifierCommand)
        {
            try
            {
                if(!ValueTypeHelper.isOfType(evalIdentifierCommand, Firecrow.Interpreter.Commands.Command) || !evalIdentifierCommand.isEvalIdentifierCommand()) { alert("Evaluator: is not an EvalIdentifierExpressionCommand"); return; }

                this.executionContextStack.setExpressionValue
                (
                    evalIdentifierCommand.codeConstruct,
                    this.executionContextStack.getIdentifierValue(evalIdentifierCommand.codeConstruct.name)
                );
            }
            catch(e) { alert("Evaluator - error when evaluating identifier: " + e);}
        },

        _evaluateBinaryExpressionCommand: function(evalBinaryExpressionCommand)
        {
            try
            {
                if(!ValueTypeHelper.isOfType(evalBinaryExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evalBinaryExpressionCommand.isEvalBinaryExpressionCommand()) { alert("Evaluator: is not an EvalBinaryExpressionCommand"); return;}

                var binaryExpression = evalBinaryExpressionCommand.codeConstruct;

                var leftExpressionValue = this.executionContextStack.getExpressionValue(binaryExpression.left);
                var rightExpressionValue = this.executionContextStack.getExpressionValue(binaryExpression.right);
                var operator = binaryExpression.operator;

                token: "==" | "!=" | "===" | "!=="
                    | "<" | "<=" | ">" | ">=" | "<<" | ">>" | ">>>" | "+" | "-" | "*" | "/" | "%"
                    | "|" | "^" | "^" | "in" | "instanceof" | "..";
                var result = null;

                if(operator == "==") { result = leftExpressionValue == rightExpressionValue;}
                else if (operator == "!=") { result = leftExpressionValue != rightExpressionValue; }
                else if (operator == "===") { result = leftExpressionValue === rightExpressionValue; }
                else if (operator == "!==") { result = leftExpressionValue !== rightExpressionValue; }
                else if (operator == "<") { result = leftExpressionValue < rightExpressionValue; }
                else if (operator == "<=") { result = leftExpressionValue <= rightExpressionValue; }
                else if (operator == ">") { result = leftExpressionValue > rightExpressionValue; }
                else if (operator == ">=") { result = leftExpressionValue >= rightExpressionValue; }
                else if (operator == "<<") { result = leftExpressionValue << rightExpressionValue; }
                else if (operator == ">>") { result = leftExpressionValue >> rightExpressionValue; }
                else if (operator == ">>>") { result = leftExpressionValue >>> rightExpressionValue; }
                else if (operator == "+") { result = leftExpressionValue + rightExpressionValue; }
                else if (operator == "-") { result = leftExpressionValue - rightExpressionValue; }
                else if (operator == "*") { result = leftExpressionValue * rightExpressionValue; }
                else if (operator == "/") { result = leftExpressionValue / rightExpressionValue; }
                else if (operator == "%") { result = leftExpressionValue % rightExpressionValue; }
                else if (operator == "|") { result = leftExpressionValue | rightExpressionValue; }
                else if (operator == "^") { result = leftExpressionValue ^ rightExpressionValue; }
                else if (operator == "in") { result = leftExpressionValue in rightExpressionValue; }
                else if (operator == "instanceof") { result = leftExpressionValue instanceof rightExpressionValue; }
                else { alert("Evaluator - unknown operator"); return; }

                this.executionContextStack.setExpressionValue(binaryExpression, result);
            }
            catch(e) { alert("Evaluator - error when evaluating binary expression: " + e);}
        },

        _evaluateCallExpressionCommand: function(evalCallExpressionCommand)
        {
            try
            {
                if(!ValueTypeHelper.isOfType(evalCallExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evalCallExpressionCommand.isEvalCallExpressionCommand()) { alert("Evaluator: is not an EvalCallExpressionCommand"); return; }
            }
            catch(e) { alert("Evaluator - error when evaluating callExpression: " + e);}
        },

        _evaluateReturnExpressionCommand: function(evalReturnExpressionCommand)
        {
            try
            {
                if(!ValueTypeHelper.isOfType(evalReturnExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evalReturnExpressionCommand.isEvalReturnExpressionCommand()) { alert("Evaluator: is not an EvalReturnExpressionCommand"); return; }

                this.executionContextStack.setExpressionValueInPreviousContext
                (
                    evalReturnExpressionCommand.parentFunctionCommand.codeConstruct,
                    evalReturnExpressionCommand.codeConstruct.argument != null ? this.executionContextStack.getExpressionValue(evalReturnExpressionCommand.codeConstruct.argument)
                                                                               : undefined
                );
            }
            catch(e) { alert("Evaluator - error when evaluating return expression: " + e); }
        },

        _evaluateThisExpressionCommand: function(thisExpressionCommand)
        {
            try
            {
                if(!ValueTypeHelper.isOfType(thisExpressionCommand, Firecrow.Interpreter.Commands.Command) || !thisExpressionCommand.isThisExpressionCommand()) { alert("Evaluator: is not a ThisExpressionCommand"); return; }

                this.executionContextStack.setExpressionValue
                (
                    thisExpressionCommand.codeConstruct,
                    this.executionContextStack.activeContext.thisObject
                );
            }
            catch(e) { alert("Evaluator - error when evaluating return expression: " + e); }
        },

        _evaluateMemberExpressionCommand: function(evalMemberExpressionCommand)
        {
            try
            {
                if(!ValueTypeHelper.isOfType(evalMemberExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evalMemberExpressionCommand.isEvalMemberExpressionCommand()) { alert("Evaluator: is not an EvalMemberExpressionCommand"); return; }

                var object = this.executionContextStack.getExpressionValue(evalMemberExpressionCommand.codeConstruct.object);

                if(object == null) { alert("Object can not be null when evaluating member expression!"); return; }

                var property = this.executionContextStack.getExpressionValue(evalMemberExpressionCommand.codeConstruct.property);

                this.executionContextStack.setExpressionValue
                (
                    evalMemberExpressionCommand.codeConstruct,
                    object[property]
                );
            }
            catch(e) { alert("Evaluator - error when evaluating return expression: " + e); }
        },

        _evaluateMemberExpressionPropertyCommand: function(evalMemberExpressionPropertyCommand)
        {
            try
            {
                if(!ValueTypeHelper.isOfType(evalMemberExpressionPropertyCommand, Firecrow.Interpreter.Commands.Command) || !evalMemberExpressionPropertyCommand.isEvalMemberExpressionPropertyCommand()) { alert("Evaluator: is not an EvalMemberExpressionPropertyCommand"); return; }

                this.executionContextStack.setExpressionValue
                (
                    evalMemberExpressionPropertyCommand.codeConstruct.property,
                    evalMemberExpressionPropertyCommand.codeConstruct.computed ? this.executionContextStack.getExpressionValue(evalMemberExpressionPropertyCommand.codeConstruct.property)
                                                                               : evalMemberExpressionPropertyCommand.codeConstruct.property.name
                );
            }
            catch(e) { alert("Evaluator - error when evaluating return expression: " + e); }
        },

        _evaluateObjectExpressionCommand: function(objectExpressionCommand)
        {
            try
            {
                if(!ValueTypeHelper.isOfType(objectExpressionCommand, Firecrow.Interpreter.Commands.Command) || !objectExpressionCommand.isObjectExpressionCommand()) { alert("Evaluator - argument has to be an object expression creation command!"); return; }

                var newObject = this.executionContextStack.createObjectInCurrentContext(null, objectExpressionCommand.codeConstruct);

                this.executionContextStack.setExpressionValue(objectExpressionCommand.codeConstruct, newObject);

                objectExpressionCommand.createdObject = newObject;
            }
            catch(e) { alert("Evaluator - An error has occurred when evaluating object expression command:" + e); }
        },

        _evaluateObjectPropertyCreationCommand: function(objectPropertyCreationCommand)
        {
            try
            {
                if(!ValueTypeHelper.isOfType(objectPropertyCreationCommand, Firecrow.Interpreter.Commands.Command) || !objectPropertyCreationCommand.isObjectPropertyCreationCommand()) { alert("Evaluator - argument has to be an object property creation command!"); return; }

                var object = objectPropertyCreationCommand.objectExpressionCommand.createdObject;

                if(object == null) { alert("When evaluating object property the object must not be null!");  return; }

                var propertyCodeConstruct = objectPropertyCreationCommand.codeConstruct;

                var propertyValue = this.executionContextStack.getExpressionValue(propertyCodeConstruct.value);

                var propertyKey = "";

                if(ASTHelper.isLiteral(propertyCodeConstruct.key))
                {
                    propertyKey = propertyCodeConstruct.key.value;
                }
                else if (ASTHelper.isIdentifier(propertyCodeConstruct.key))
                {
                    propertyKey = propertyCodeConstruct.key.name;
                }
                else { alert("Evaluator - Unknown property key type"); return; }

                object[propertyKey] = propertyValue;
                object.__FIRECROW_INTERNAL__.object.addProperty(propertyKey, propertyValue, objectPropertyCreationCommand.codeConstruct);
            }
            catch(e) { alert("Evaluator - error when evaluating object property creation: " + e); }
        },

        _evaluateArrayExpressionCommand: function(arrayExpressionCommand)
        {
            try
            {
                if(!ValueTypeHelper.isOfType(arrayExpressionCommand, Firecrow.Interpreter.Commands.Command) || !arrayExpressionCommand.isArrayExpressionCommand()) { alert("Evaluator - argument has to be an array expression creation command!"); return; }

                var newArray = this.executionContextStack.createArrayInCurrentContext(arrayExpressionCommand.codeConstruct);

                this.executionContextStack.setExpressionValue(arrayExpressionCommand.codeConstruct, newArray);

                arrayExpressionCommand.createdArray = newArray;
            }
            catch(e) { alert("Evaluator - An error has occurred when evaluating array expression command:" + e); }
        },

        _evaluateArrayExpressionItemCreationCommand: function(arrayItemCreationCommand)
        {
            try
            {
                if(!ValueTypeHelper.isOfType(arrayItemCreationCommand, Firecrow.Interpreter.Commands.Command) || !arrayItemCreationCommand.isArrayExpressionItemCreationCommand()) { alert("Evaluator - argument has to be an array expression item creation command!"); return; }

                var array = arrayItemCreationCommand.arrayExpressionCommand.createdArray;

                if(array == null) { alert("When evaluating array expression item the array must not be null!");  return; }

                var expressionItemValue = this.executionContextStack.getExpressionValue(arrayItemCreationCommand.codeConstruct);

                array.push(expressionItemValue);
                array.__FIRECROW_INTERNAL__.array.push(expressionItemValue, arrayItemCreationCommand.codeConstruct);
            }
            catch(e) { alert("Evaluator - error when evaluating array expression item creation: " + e); }
        }
    };
}});
