/**
 * Created by Jomaras.
 * Date: 07.03.12.@21:41
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/

const ExecutionContextStack = Firecrow.Interpreter.Simulator.ExecutionContextStack;
const Command = Firecrow.Interpreter.Commands.Command;
const CommandGenerator = Firecrow.Interpreter.Commands.CommandGenerator;

const ValueTypeHelper = Firecrow.ValueTypeHelper;
const ASTHelper = Firecrow.ASTHelper;

Firecrow.Interpreter.InterpreterSimulator = function(programAst, globalObject)
{
    this.programAst = programAst;
    this.globalObject = globalObject;

    this.contextStack = new ExecutionContextStack(globalObject);
    this.contextStack.registerExceptionCallback(this.removeCommandsAfterException, this);

    this.commands = CommandGenerator.generateCommands(programAst);
    this.tryStack = [];

    this.messageGeneratedCallbacks = [];
};

Firecrow.Interpreter.InterpreterSimulator.prototype =
{
    run: function()
    {
        try
        {
            var that = this;
            that.currentCommandIndex = 0

            var loopThroughCommands = function()
            {
                var command = that.commands[that.currentCommandIndex];

                that.processCommand(command);

                that.callMessageGeneratedCallbacks("ExCommand@" + command.getLineNo() + ":" + command.type);

                that.currentCommandIndex++;

                if(that.currentCommandIndex < that.commands.length)
                {
                    that.currentCommandIndex % 50 == 0 ? setTimeout(loopThroughCommands, 10) : loopThroughCommands();
                }
            }

            setTimeout(loopThroughCommands, 10);
        }
        catch(e) { alert("Error while running the InterpreterSimulator: " + e); }
    },

    processCommand: function(command)
    {
        try
        {
            if(command.isStartTryStatementCommand() || command.isEndTryStatementCommand()) { this.processTryCommand(command); }
            if(command.isEvalThrowExpressionCommand()) { this.removeCommandsAfterException(command); }

            this.contextStack.executeCommand(command);

            if (command.removesCommands) { this.processRemovingCommandsCommand(command); }
            if (command.generatesNewCommands) { this.processGeneratingNewCommandsCommand(command); }
        }
        catch(e) { alert("Error while processing commands in InterpreterSimulator: " + e);}
    },

    processTryCommand: function(command)
    {
        try
        {
            if(!(command.isStartTryStatementCommand() || command.isEndTryStatementCommand())) { alert("The command is not a try command in InterpreterSimulator!"); return; }

            if(command.isStartTryStatementCommand())
            {
                this.tryStack.push(command); return;
            }
            else if (command.isEndTryStatementCommand())
            {
                var topCommand = this.tryStack[this.tryStack.length - 1];

                if(topCommand == null || topCommand.codeConstruct != command.codeConstruct) { alert("Error while popping try command from Stack"); return; }

                this.tryStack.pop();
            }
        }
        catch(e) { alert("Error while processing try command in InterpreterSimulator: " + e); }
    },

    processRemovingCommandsCommand: function(command)
    {
        try
        {
                 if (command.isEvalReturnExpressionCommand()) { this.removeCommandsAfterReturnStatement(command); }
            else if (command.isEvalBreakCommand()) { this.removeCommandsAfterBreak(command); }
            else if (command.isEvalContinueCommand()) { this.removeCommandsAfterContinue(command); }
            else if (command.isEvalThrowExpressionCommand()) { this.removeCommandsAfterException(command); }
            else if (command.isEvalLogicalExpressionItemCommand()) { this.removeCommandsAfterLogicalExpressionItem(command); }
            else { alert("Unknown removing commands command: " + command.type); }
        }
        catch(e) { alert("Error while removing commands: " + e); }
    },

    removeCommandsAfterReturnStatement: function(returnCommand)
    {
        try
        {
            var callExpressionCommand = returnCommand.parentFunctionCommand;

            for(var i = this.currentCommandIndex + 1; i < this.commands.length;)
            {
                var command = this.commands[i];

                if(!command.isExitFunctionContextCommand() && command.parentFunctionCommand == callExpressionCommand) { ValueTypeHelper.removeFromArrayByIndex(this.commands, i); }
                else { break; }
            }
        }
        catch(e) { alert("Error while removing commands after return statement:" + e);}
    },

    removeCommandsAfterBreak: function(breakCommand)
    {
        try
        {
            for(var i = this.currentCommandIndex + 1; i < this.commands.length; )
            {
                var command = this.commands[i];

                ValueTypeHelper.removeFromArrayByIndex(this.commands, i);

                if(command.isLoopStatementCommand() || command.isEndSwitchStatementCommand()) { break;}
            }
        }
        catch(e) { alert("Error when removing commands after a break command:" + e); }
    },

    removeCommandsAfterContinue: function(continueCommand)
    {
        try
        {
            for(var i = this.currentCommandIndex + 1; i < this.commands.length; )
            {
                var command = this.commands[i];

                if(!(command.isLoopStatementCommand() || command.isForUpdateStatementCommand()))
                {
                    ValueTypeHelper.removeFromArrayByIndex(this.commands, i);
                }
                else { break; }
            }
        }
        catch(e) { alert("Error when removing commands after continue: " + e); }
    },

    removeCommandsAfterException: function(exceptionGeneratingArgument)
    {
        try
        {
            for(var i = this.currentCommandIndex + 1; i < this.commands.length; )
            {
                var command = this.commands[i];

                if(command.isEndTryStatementCommand()) { break; }
                if(command.isExitFunctionContextCommand()) { i++; continue;}

                ValueTypeHelper.removeFromArrayByIndex(this.commands, i);
            }

            if(this.tryStack.length > 0)
            {
                ValueTypeHelper.insertElementsIntoArrayAtIndex
                (
                    this.commands,
                    CommandGenerator.generateCatchStatementExecutionCommands
                    (
                        this.tryStack[this.tryStack.length - 1],
                        ValueTypeHelper.isOfType(exceptionGeneratingArgument, Firecrow.Interpreter.Commands.Command) ? this.contextStack.getExpressionValue(exceptionGeneratingArgument.codeConstruct.argument)
                                                                                                                     : exceptionGeneratingArgument
                    ),
                    i
                );
            }
        }
        catch(e) { alert("Error when removing commands after Exception: " + e);}
    },

    removeCommandsAfterLogicalExpressionItem: function(evalLogicalExpressionItemCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalLogicalExpressionItemCommand, Command) || !evalLogicalExpressionItemCommand.isEvalLogicalExpressionItemCommand()) { alert("InterpreterSimulator: argument is not an eval logical expression item command"); return; }

            if(evalLogicalExpressionItemCommand.shouldDeleteFollowingLogicalCommands)
            {
                var parentCommand = evalLogicalExpressionItemCommand.parentLogicalExpressionCommand;

                for(var i = this.currentCommandIndex + 1; i < this.commands.length; )
                {
                    var command = this.commands[i];

                    ValueTypeHelper.removeFromArrayByIndex(this.commands, i);

                    if(command.isEndLogicalExpressionCommand() && command.startCommand == parentCommand) { break;}
                }
            }
        }
        catch(e) { alert("InterpreterSimulator - error when removing commands after logical expression item!");}
    },

    processGeneratingNewCommandsCommand: function(command)
    {
        try
        {
                 if (command.isEvalCallbackFunctionCommand()) { this.generateCommandsAfterCallbackFunctionCommand(command); }
            else if (command.isEvalNewExpressionCommand()) { this.generateCommandsAfterNewExpressionCommand(command); }
            else if (command.isEvalCallExpressionCommand()) { this.generateCommandsAfterCallFunctionCommand(command); }
            else if (command.isLoopStatementCommand()) { this.generateCommandsAfterLoopCommand(command); }
            else if (command.isIfStatementCommand()) { this.generateCommandsAfterIfCommand(command); }
            else if (command.isEvalConditionalExpressionBodyCommand()) { this.generateCommandsAfterConditionalCommand(command); }
            else if (command.isCaseCommand()) { this.generateCommandsAfterCaseCommand(command); }
            else if (command.isCallCallbackMethodCommand()) { this.generateCommandsAfterCallCallback(command); }
            else if (command.isExecuteCallbackCommand()) { this.generateCommandsAfterExecuteCallbackCommand(command); }
            else { alert("Unknown generating new commands command!"); }
        }
        catch(e) { alert("An error occurred while processing generate new commands command:" + e);}
    },

    generateCommandsAfterCallbackFunctionCommand: function(callbackCommand)
    {
        try
        {
            alert("Still not handling callback commands!");
        }
        catch(e) { alert("Error while generating commands after callback function command: " + e);}
    },

    generateCommandsAfterNewExpressionCommand: function(newExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(newExpressionCommand, Command) || !newExpressionCommand.isEvalNewExpressionCommand()) { alert("InterpreterSimulator: argument is not newExpressionCommand"); return; }

            var callConstruct = newExpressionCommand.codeConstruct;
            var callee = this.contextStack.getExpressionValue(callConstruct.callee);
            var newObject = this.contextStack.createObjectInCurrentContext(callee, newExpressionCommand.codeConstruct);

            this.contextStack.setExpressionValue(newExpressionCommand.codeConstruct, newObject);

            ValueTypeHelper.insertElementsIntoArrayAtIndex
            (
                this.commands,
                CommandGenerator.generateFunctionExecutionCommands
                (
                    newExpressionCommand,
                    callee,
                    newObject
                ),
                this.currentCommandIndex + 1
            );
        }
        catch(e) { alert("InterpreterSimulator - Error while generating commands after new expression command: " + e);}
    },

    generateCommandsAfterCallFunctionCommand: function(callExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(callExpressionCommand, Command) || !callExpressionCommand.isEvalCallExpressionCommand()) { alert("InterpreterSimulator: argument is not callExpressionCommand"); return; }

            var callConstruct = callExpressionCommand.codeConstruct;


            ValueTypeHelper.insertElementsIntoArrayAtIndex
            (
                this.commands,
                CommandGenerator.generateFunctionExecutionCommands
                (
                    callExpressionCommand,
                    this.contextStack.getExpressionValue(callConstruct.callee),
                    this.contextStack.getBaseObject(callConstruct.callee)
                ),
                this.currentCommandIndex + 1
            );
        }
        catch(e) { alert("InterpreterSimulator - Error while generating commands after call function command: " + e);}
    },

    generateCommandsAfterCallCallback: function(callCallbackMethodCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(callCallbackMethodCommand, Command) || !callCallbackMethodCommand.isCallCallbackMethodCommand()) { alert("InterpreterSimulator: argument is not callCallbackCommand"); return; }

            var argumentValues = [];

            if(callCallbackMethodCommand.codeConstruct.arguments != null)
            {
                callCallbackMethodCommand.codeConstruct.arguments.forEach(function(argument)
                {
                    argumentValues.push(this.contextStack.getExpressionValue(argument));
                }, this);
            }

            var functionName = callCallbackMethodCommand.functionObject.name;
            var resultingObject = functionName == "filter" || functionName == "map" ? Firecrow.Interpreter.Simulator.InternalExecutor.createArray(this.globalObject, callCallbackMethodCommand.codeConstruct)
                                                                                    : null;
            this.contextStack.setExpressionValue(callCallbackMethodCommand.codeConstruct, resultingObject);

            ValueTypeHelper.insertElementsIntoArrayAtIndex
            (
                this.commands,
                CommandGenerator.generateCallbackExecutionCommands
                (
                    callCallbackMethodCommand,
                    resultingObject,
                    argumentValues,
                    this.globalObject
                ),
                this.currentCommandIndex + 1
            );
        }
        catch(e) { alert("InterpreterSimulator - Error when generating commands after callback");}
    },

    generateCommandsAfterExecuteCallbackCommand: function(executeCallbackCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(executeCallbackCommand, Command) || !executeCallbackCommand.isExecuteCallbackCommand()) { alert("InterpreterSimulator: argument is not execute callback command"); return; }

            var callConstruct = executeCallbackCommand.codeConstruct;

            ValueTypeHelper.insertElementsIntoArrayAtIndex
            (
                this.commands,
                CommandGenerator.generateFunctionExecutionCommands
                (
                    executeCallbackCommand,
                    executeCallbackCommand.callback,
                    executeCallbackCommand.thisObject
                ),
                this.currentCommandIndex + 1
            );
        }
        catch(e) { alert("InterpreterSimulator - error when generating commands after execute callback command: " + e);}
    },

    generateCommandsAfterLoopCommand: function(loopCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(loopCommand, Command) || !loopCommand.isLoopStatementCommand()) { alert("InterpreterSimulator - argument has to be a loop command!"); return; }

            ValueTypeHelper.insertElementsIntoArrayAtIndex
            (
                this.commands,
                CommandGenerator.generateLoopExecutionCommands
                (
                    loopCommand,
                    !loopCommand.isEvalForInWhereCommand() ? this.contextStack.getExpressionValue(loopCommand.codeConstruct.test) : null
                ),
                this.currentCommandIndex + 1
            );
        }
        catch(e) { alert("InterpreterSimulator - Error while generating commands after loop command: " + e);}
    },

    generateCommandsAfterIfCommand: function(ifCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(ifCommand, Command) || !ifCommand.isIfStatementCommand()) { alert("InterpreterSimulator - argument has to be a if command!"); return; }

            ValueTypeHelper.insertElementsIntoArrayAtIndex
            (
                this.commands,
                CommandGenerator.generateIfStatementBodyCommands
                (
                    ifCommand,
                    this.contextStack.getExpressionValue(ifCommand.codeConstruct.test)
                ),
                this.currentCommandIndex + 1
            );
        }
        catch(e) { alert("Error while generating commands after if command: " + e);}
    },

    generateCommandsAfterConditionalCommand: function(conditionalCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(conditionalCommand, Command) || !conditionalCommand.isEvalConditionalExpressionBodyCommand()) { alert("InterpreterSimulator - argument has to be a conditional expression body command!"); return; }

            ValueTypeHelper.insertElementsIntoArrayAtIndex
            (
                this.commands,
                CommandGenerator.generateConditionalExpressionEvalBodyCommands
                (
                    conditionalCommand,
                    this.contextStack.getExpressionValue(conditionalCommand.codeConstruct.test)
                ),
                this.currentCommandIndex + 1
            );
        }
        catch(e) { alert("Error while generating commands after conditional command: " + e);}
    },

    generateCommandsAfterCaseCommand: function(caseCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(caseCommand, Command) || !caseCommand.isCaseCommand()) { alert("InterpreterSimulator - argument has to be a case command!"); return; }

            if(this.contextStack.getExpressionValue(caseCommand.codeConstruct.test) == this.contextStack.getExpressionValue(caseCommand.parent.codeConstruct.discriminant)
            || caseCommand.parent.hasBeenMatched
            || caseCommand.codeConstruct.test == null)
            {
                caseCommand.parent.hasBeenMatched = true;

                ValueTypeHelper.insertElementsIntoArrayAtIndex
                (
                    this.commands,
                    CommandGenerator.generateCaseExecutionCommands(caseCommand),
                    this.currentCommandIndex + 1
                );
            }
        }
        catch(e) { alert("Error while generating commands after case command: " + e);}
    },

    registerMessageGeneratedCallback: function(callbackFunction, thisValue)
    {
        this.messageGeneratedCallbacks.push
        (
            {
                callback: callbackFunction,
                thisValue: thisValue || this
            }
        );
    },

    callMessageGeneratedCallbacks: function(message)
    {
        this.messageGeneratedCallbacks.forEach(function(callbackDescription)
        {
            callbackDescription.callback.call(callbackDescription.thisValue, message);
        });
    }
};
/******************************************************************************************/
}});