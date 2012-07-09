/**
 * Created by Jomaras.
 * Date: 07.03.12.@21:41
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/

//TODO - implicit call toString method of an object if participating in a binary expression!
//TODO - define Object.isOwnProperty and other Object.prototype methods
//TODO - implement String.replace commands
//TODO - merge array callbacks and string callbacks
//TODO - remove all alert calls - put everywhere only one notifyError

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

Firecrow.Interpreter.InterpreterSimulator.notifyError = function(message) { alert("InterpreterSimulator - " + message); }

Firecrow.Interpreter.InterpreterSimulator.prototype =
{
    runSync: function()
    {
        try
        {
            for(this.currentCommandIndex = 0; this.currentCommandIndex < this.commands.length; this.currentCommandIndex++)
            {
                var command = this.commands[this.currentCommandIndex];

                this.globalObject.setCurrentCommand(command);

                this.processCommand(command);

                this.callControlFlowConnectionCallbacks(command.codeConstruct);

                this.callMessageGeneratedCallbacks("ExCommand@" + command.getLineNo() + "-" + command.executionId + ":" + command.type);
            }
        }
        catch(e) { this.notifyError("Error while running the InterpreterSimulator: " + e); }
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
        catch(e) { this.notifyError("Error when executing async loop"); }
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
        catch(e) { this.notifyError("Error while processing commands in InterpreterSimulator: " + e);}
    },

    processTryCommand: function(command)
    {
        try
        {
            if(!(command.isStartTryStatementCommand() || command.isEndTryStatementCommand())) { this.notifyError("The command is not a try command in InterpreterSimulator!"); return; }

            if(command.isStartTryStatementCommand())
            {
                this.tryStack.push(command); return;
            }
            else if (command.isEndTryStatementCommand())
            {
                var topCommand = this.tryStack[this.tryStack.length - 1];

                if(topCommand == null || topCommand.codeConstruct != command.codeConstruct) { this.notifyError("Error while popping try command from Stack"); return; }

                this.tryStack.pop();
            }
        }
        catch(e) { this.notifyError("Error while processing try command in InterpreterSimulator: " + e); }
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
            else { this.notifyError("Unknown removing commands command: " + command.type); }
        }
        catch(e) { this.notifyError("Error while removing commands: " + e); }
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
        catch(e) { this.notifyError("Error while removing commands after return statement:" + e);}
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
        catch(e) { this.notifyError("Error when removing commands after a break command:" + e); }
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
        catch(e) { this.notifyError("Error when removing commands after continue: " + e); }
    },

    removeCommandsAfterException: function(exceptionGeneratingArgument)
    {
        try
        {
            if(this.tryStack.length == 0)
            {
                this.notifyError("Removing commands and there is no enclosing try catch block @ " + this.commands[this.currentCommandIndex].codeConstruct.loc.source);
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
        catch(e) { this.notifyError("Error when removing commands after Exception: " + e);}
    },

    removeCommandsAfterLogicalExpressionItem: function(evalLogicalExpressionItemCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(evalLogicalExpressionItemCommand, Command) || !evalLogicalExpressionItemCommand.isEvalLogicalExpressionItemCommand()) { this.notifyError("Argument is not an eval logical expression item command"); return; }

            if(evalLogicalExpressionItemCommand.shouldDeleteFollowingLogicalCommands)
            {
                var parentCommand = evalLogicalExpressionItemCommand.parentLogicalExpressionCommand;

                for(var i = this.currentCommandIndex + 1; i < this.commands.length; )
                {
                    var command = this.commands[i];

                    if(command.isEndLogicalExpressionCommand() && command.startCommand == parentCommand) { break;}

                    ValueTypeHelper.removeFromArrayByIndex(this.commands, i);
                }
            }
        }
        catch(e) { this.notifyError("Error when removing commands after logical expression item!");}
    },

    processGeneratingNewCommandsCommand: function(command)
    {
        try
        {
                 if (command.isEvalCallbackFunctionCommand()) { this.generateCommandsAfterCallbackFunctionCommand(command); }
            else if (command.isEvalNewExpressionCommand()) { this.generateCommandsAfterNewExpressionCommand(command); }
            else if (command.isEvalCallExpressionCommand()) { this.generateCommandsAfterCallFunctionCommand(command); }
            else if (command.isCallInternalFunctionCommand()) { if(command.generatesCallbacks) { this.generateCommandsAfterCallbackFunctionCommand(command); }}
            else if (command.isLoopStatementCommand()) { this.generateCommandsAfterLoopCommand(command); }
            else if (command.isIfStatementCommand()) { this.generateCommandsAfterIfCommand(command); }
            else if (command.isEvalConditionalExpressionBodyCommand()) { this.generateCommandsAfterConditionalCommand(command); }
            else if (command.isCaseCommand()) { this.generateCommandsAfterCaseCommand(command); }
            else { this.notifyError("Unknown generating new commands command!"); }
        }
        catch(e) { this.notifyError("An error occurred while processing generate new commands command:" + e);}
    },

    generateCommandsAfterCallbackFunctionCommand: function(callInternalFunctionCommand)
    {
        try
        {
            ValueTypeHelper.insertElementsIntoArrayAtIndex
            (
                this.commands,
                CommandGenerator.generateCallbackFunctionExecutionCommands(callInternalFunctionCommand),
                this.currentCommandIndex + 1
            );
        }
        catch(e) { this.notifyError("Error while generating commands after callback function command: " + e);}
    },

    generateCommandsAfterNewExpressionCommand: function(newExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(newExpressionCommand, Command) || !newExpressionCommand.isEvalNewExpressionCommand()) { this.notifyError("Argument is not newExpressionCommand"); return; }

            var callConstruct = newExpressionCommand.codeConstruct;
            var callee = this.executionContextStack.getExpressionValue(callConstruct.callee);
            var newObject = this.globalObject.internalExecutor.createObject
            (
                callee,
                newExpressionCommand.codeConstruct,
                callConstruct.arguments != null ? callConstruct.arguments.map(function(argument) { return this.executionContextStack.getExpressionValue(argument)}, this)
                                                : []
            );

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(callConstruct, callConstruct.callee, this.globalObject.getPreciseEvaluationPositionId());

            if(callConstruct.arguments != null)
            {
                for(var i = 0; i < callConstruct.arguments.length; i++)
                {
                    this.globalObject.browser.callDataDependencyEstablishedCallbacks(callConstruct, callConstruct.arguments[i], this.globalObject.getPreciseEvaluationPositionId());
                }
            }

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
        catch(e) { this.notifyError("Error while generating commands after new expression command: " + e);}
    },

    generateCommandsAfterCallFunctionCommand: function(callExpressionCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(callExpressionCommand, Command) || !callExpressionCommand.isEvalCallExpressionCommand()) { this.notifyError("Argument is not callExpressionCommand"); return; }

            var callConstruct = callExpressionCommand.codeConstruct;

            this.globalObject.browser.callDataDependencyEstablishedCallbacks(callConstruct, callConstruct.callee, this.globalObject.getPreciseEvaluationPositionId());

            if(callConstruct.arguments != null)
            {
                for(var i = 0; i < callConstruct.arguments.length; i++)
                {
                    this.globalObject.browser.callDataDependencyEstablishedCallbacks(callConstruct, callConstruct.arguments[i], this.globalObject.getPreciseEvaluationPositionId());
                }
            }

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
            this.notifyError("Error while generating commands after call function command: " + e);
        }
    },

    generateCommandsAfterLoopCommand: function(loopCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(loopCommand, Command) || !loopCommand.isLoopStatementCommand()) { this.notifyError("Argument has to be a loop command!"); return; }

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
        catch(e) { this.notifyError("Error while generating commands after loop command: " + e);}
    },

    generateCommandsAfterIfCommand: function(ifCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(ifCommand, Command) || !ifCommand.isIfStatementCommand()) { this.notifyError("Argument has to be a if command!"); return; }

            var generatedCommands = CommandGenerator.generateIfStatementBodyCommands
            (
                ifCommand,
                this.executionContextStack.getExpressionValue(ifCommand.codeConstruct.test).value,
                ifCommand.parentFunctionCommand
            );

            ValueTypeHelper.insertElementsIntoArrayAtIndex(this.commands, generatedCommands, this.currentCommandIndex + 1);
        }
        catch(e) { this.notifyError("Error while generating commands after if command: " + e);}
    },

    generateCommandsAfterConditionalCommand: function(conditionalCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(conditionalCommand, Command) || !conditionalCommand.isEvalConditionalExpressionBodyCommand()) { this.notifyError("Argument has to be a conditional expression body command!"); return; }

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
        catch(e) { this.notifyError("Error while generating commands after conditional command: " + e);}
    },

    generateCommandsAfterCaseCommand: function(caseCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(caseCommand, Command) || !caseCommand.isCaseCommand()) { this.notifyError("Argument has to be a case command!"); return; }

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
        catch(e) { this.notifyError("Error while generating commands after case command: " + e);}
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
    },

    notifyError: function (message) { Firecrow.Interpreter.InterpreterSimulator.notifyError(message); }
};
/******************************************************************************************/
}});