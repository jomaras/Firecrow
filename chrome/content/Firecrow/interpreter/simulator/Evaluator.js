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

                if(command.isDeclareVariableCommand()) { this._evaluateDeclareVariableCommand(command); }
                else if (command.isDeclareFunctionCommand()) { this._evaluateDeclareFunctionCommand(command); }
                else if (command.isEvalIdentifierCommand()) { this._evaluateIdentifierCommand(command); }
                else if (command.isEvalLiteralCommand()) { this._evaluateLiteralCommand(command); }
                else if (command.isEvalAssignmentExpressionCommand()) { this._evaluateAssignmentExpressionCommand(command); }
                else if (command.isEvalBinaryExpressionCommand()) { this._evaluateBinaryExpressionCommand(command); }
                else if (command.isEvalCallExpressionCommand()) { this._evaluateCallExpressionCommand(command); }
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
                if(declareVariableCommand == null) { alert("Evaluator: DeclareVariableCommand is null!"); return;}
                if(!ValueTypeHelper.isOfType(declareVariableCommand, Firecrow.Interpreter.Commands.Command) || !declareVariableCommand.isDeclareVariableCommand()) { alert("Evaluator: is not an DeclareVariableCommand"); return; }

                this.executionContextStack.registerIdentifier(declareVariableCommand.codeConstruct);
            }
            catch(e) { alert("Evaluator: Error when evaluating declare variable: " + e); }
        },

        _evaluateDeclareFunctionCommand: function(declareFunctionCommand)
        {
            try
            {
                if(declareFunctionCommand == null) { alert("Evaluator: DeclareFunctionCommand is null!"); return;}
                if(!ValueTypeHelper.isOfType(declareFunctionCommand, Firecrow.Interpreter.Commands.Command) || !declareFunctionCommand.isDeclareFunctionCommand()) { alert("Evaluator: is not an DeclareFunctionCommand"); return; }

                this.executionContextStack.registerFunctionDeclaration(declareFunctionCommand.codeConstruct);
            }
            catch(e) { alert("Evaluator: Error when evaluating declare function: " + e); }
        },

        _evaluateLiteralCommand: function(evalLiteralCommand)
        {
            try
            {
                if(evalLiteralCommand == null) { alert("Evaluator - evalLiteralCommand is null!"); return; }
                if(!ValueTypeHelper.isOfType(evalLiteralCommand, Firecrow.Interpreter.Commands.Command) || !evalLiteralCommand.isEvalLiteralCommand()) { alert("Evaluator: is not an EvalLiteralCommand"); return; }

                this.executionContextStack.setExpressionValue(evalLiteralCommand.codeConstruct, evalLiteralCommand.codeConstruct.value);
            }
            catch(e) { alert("Evaluator - error when evaluating literal: " + e);}
        },

        _evaluateAssignmentExpressionCommand: function(evalAssignmentExpressionCommand)
        {
            try
            {
                if(evalAssignmentExpressionCommand == null) { alert("Evaluator - evalAssignmentExpressionCommand is null!"); return; }
                if(!ValueTypeHelper.isOfType(evalAssignmentExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evalAssignmentExpressionCommand.isEvalAssignmentExpressionCommand()) { alert("Evaluator: is not an EvalAssignmentExpressionCommand"); return; }

                var assignmentConstruct = evalAssignmentExpressionCommand.codeConstruct;

                if(ASTHelper.isVariableDeclarator(assignmentConstruct))
                {
                    this.executionContextStack.setIdentifierValue
                    (
                        assignmentConstruct.id.name,
                        assignmentConstruct.init != null ? this.executionContextStack.getExpressionValue(assignmentConstruct.init)
                                                         : undefined,
                        assignmentConstruct.init
                    );
                }
                else
                {
                    alert("Evaluator: Not handling assignment expressions");
                }
            }
            catch(e) { alert("Evaluator - error when evaluating assignment expression " + e);}
        },

        _evaluateIdentifierCommand: function(evalIdentifierCommand)
        {
            try
            {
                if(evalIdentifierCommand == null) { alert("Evaluator - evalIdentifierCommand is null!"); return; }
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
                if(evalBinaryExpressionCommand == null) { alert("Evaluator - evalBinaryExpressionCommand is null!"); return; }
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

                this.executionContextStack.setExpressionValue
                (
                    binaryExpression,
                    result
                );
            }
            catch(e) { alert("Evaluator - error when evaluating binary expression: " + e);}
        },

        _evaluateCallExpressionCommand: function(evalCallExpressionCommand)
        {
            try
            {
                if(evalCallExpressionCommand == null) { alert("Evaluator - evalCallExpressionCommand is null!"); return; }
                if(!ValueTypeHelper.isOfType(evalCallExpressionCommand, Firecrow.Interpreter.Commands.Command) || !evalCallExpressionCommand.isEvalCallExpressionCommand()) { alert("Evaluator: is not an EvalCallExpressionCommand"); return; }

                var argumentsValues = [];
                var arguments = evalCallExpressionCommand.codeConstruct.arguments || [];

                arguments.forEach(function(argument)
                {
                   argumentsValues.push(this.executionContextStack.getExpressionValue(argument));
                }, this);

                var caleeValue = this.executionContextStack.getExpressionValue(evalCallExpressionCommand.codeConstruct.callee);
            }
            catch(e) { alert("Evaluator - error when evaluating callExpression: " + e);}
        }
    };
}});
