/**
 * Created by Jomaras.
 * Date: 07.03.12.@21:41
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/

var ExecutionContextStack = Firecrow.Interpreter.Simulator.ExecutionContextStack;
var Command = Firecrow.Interpreter.Commands.Command;
var CommandGenerator = Firecrow.Interpreter.Commands.CommandGenerator;

var ValueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;

Firecrow.Interpreter.InterpreterSimulator = function(programAst, globalObject)
{
    this.programAst = programAst;
    this.globalObject = globalObject;

    this.executionContextStack = new ExecutionContextStack(globalObject);
    this.executionContextStack.registerExceptionCallback(this.removeCommandsAfterException, this);

    this.commands = CommandGenerator.generateCommands(programAst);
    this.tryStack = [];

    this.messageGeneratedCallbacks = [];
    this.controlFlowConnectionCallbacks = [];
};

Firecrow.Interpreter.InterpreterSimulator.prototype =
{
    runSync: function()
    {
        try
        {
            for(this.currentCommandIndex = 0; this.currentCommandIndex < this.commands.length; this.currentCommandIndex++)
            {
                var command = this.commands[this.currentCommandIndex];

                this.globalObject.currentCommand = command;

                this.processCommand(command);

                this.callControlFlowConnectionCallbacks(command.codeConstruct);

                this.callMessageGeneratedCallbacks("ExCommand@" + command.getLineNo() + ":" + command.type);
            }
        }
        catch(e) { alert("Error while running the InterpreterSimulator: " + e); }
    },

    runAsync: function(callback)
    {
        try
        {
            this.currentCommandIndex = 0;
            var that = this;

            var asyncLoop = function()
            {
                var command = that.commands[that.currentCommandIndex];

                that.processCommand(command);

                that.callMessageGeneratedCallbacks("ExCommand@" + command.getLineNo() + ":" + command.type);

                that.currentCommandIndex++;

                if(that.currentCommandIndex < that.commands.length)
                {
                    that.currentCommandIndex % 20 == 0 ? setTimeout(asyncLoop, 10) : asyncLoop();
                }
                else
                {
                    callback();
                }
            };

            setTimeout(asyncLoop, 10)
        }
        catch(e) { alert("InterpreterSimulator - error when executing async loop"); }
    },

    processCommand: function(command)
    {
        try
        {
            if(command.isStartTryStatementCommand() || command.isEndTryStatementCommand()) { this.processTryCommand(command); }
            if(command.isEvalThrowExpressionCommand()) { this.removeCommandsAfterException(command); }

            this.executionContextStack.executeCommand(command);

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

                if(!command.isEndSwitchStatementCommand())
                {
                    ValueTypeHelper.removeFromArrayByIndex(this.commands, i);
                }

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
            if(this.tryStack.length == 0)
            {
                alert("Removing commands and there is no enclosing try catch block @ " + this.commands[this.currentCommandIndex].codeConstruct.loc.source);
                return;
            }

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
                        ValueTypeHelper.isOfType(exceptionGeneratingArgument, Firecrow.Interpreter.Commands.Command) ? this.executionContextStack.getExpressionValue(exceptionGeneratingArgument.codeConstruct.argument)
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
            var callee = this.executionContextStack.getExpressionValue(callConstruct.callee);
            var newObject = this.executionContextStack.createObjectInCurrentContext(callee, newExpressionCommand.codeConstruct);

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(callConstruct, callConstruct.callee, newExpressionCommand.id);

            this.executionContextStack.setExpressionValue(newExpressionCommand.codeConstruct, newObject);

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

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(callConstruct, callConstruct.callee, callExpressionCommand.id);

            var baseObject = this.executionContextStack.getBaseObject(callConstruct.callee);
            var callFunction = this.executionContextStack.getExpressionValue(callConstruct.callee);

            var baseObjectValue = baseObject.value;
            var callFunctionValue = callFunction.value;

            if(ValueTypeHelper.isFunction(baseObjectValue)
            && ValueTypeHelper.isFunction(callFunctionValue))
            {
                if(callFunctionValue.name == "call" || callFunctionValue.name == "apply")
                {
                         if(callFunctionValue.name == "call") { callExpressionCommand.isCall = true; }
                    else if(callFunctionValue.name == "apply") { callExpressionCommand.isApply = true; }

                    callFunction = baseObject;
                    baseObject = this.executionContextStack.getExpressionValue(callConstruct.arguments != null ? callConstruct.arguments[0] : null);
                }
            }

            ValueTypeHelper.insertElementsIntoArrayAtIndex
            (
                this.commands,
                CommandGenerator.generateFunctionExecutionCommands(callExpressionCommand, callFunction, baseObject),
                this.currentCommandIndex + 1
            );
        }
        catch(e)
        {
            alert("InterpreterSimulator - Error while generating commands after call function command: " + e);
        }
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
                    argumentValues.push(this.executionContextStack.getExpressionValue(argument));
                }, this);
            }

            var functionName = callCallbackMethodCommand.functionObject.value.name;
            var resultingObject = functionName == "filter" || functionName == "map" ? this.globalObject.internalExecutor.createArray(callCallbackMethodCommand.codeConstruct)
                                                                                    : null;
            this.executionContextStack.setExpressionValue(callCallbackMethodCommand.codeConstruct, resultingObject);

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
                    !loopCommand.isEvalForInWhereCommand() ? this.executionContextStack.getExpressionValue(loopCommand.codeConstruct.test).value : null
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

            var generatedCommands = CommandGenerator.generateIfStatementBodyCommands
            (
                ifCommand,
                this.executionContextStack.getExpressionValue(ifCommand.codeConstruct.test).value,
                ifCommand.parentFunctionCommand
            );

            ValueTypeHelper.insertElementsIntoArrayAtIndex(this.commands, generatedCommands, this.currentCommandIndex + 1);
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
                    this.executionContextStack.getExpressionValue(conditionalCommand.codeConstruct.test).value
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

            if( caseCommand.codeConstruct.test == null
             || this.executionContextStack.getExpressionValue(caseCommand.codeConstruct.test).value == this.executionContextStack.getExpressionValue(caseCommand.parent.codeConstruct.discriminant).value
             || caseCommand.parent.hasBeenMatched)
            {
                caseCommand.parent.hasBeenMatched = true;
                caseCommand.parent.matchedCaseCommand = caseCommand;

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

    registerControlFlowConnectionCallback: function(calleeFunction, thisValue)
    {
        this.controlFlowConnectionCallbacks.push
        (
            {
                callback: calleeFunction,
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
    },

    callControlFlowConnectionCallbacks: function(codeConstruct)
    {
        this.controlFlowConnectionCallbacks.forEach(function(callbackDescription)
        {
            callbackDescription.callback.call(callbackDescription.thisValue, codeConstruct);
        });
    }
};
/******************************************************************************************/
}});