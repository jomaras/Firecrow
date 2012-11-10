FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ExecutionContextStack = Firecrow.Interpreter.Simulator.ExecutionContextStack;
var Command = Firecrow.Interpreter.Commands.Command;
var CommandGenerator = Firecrow.Interpreter.Commands.CommandGenerator;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;

Firecrow.Interpreter.logExecution = false;

Firecrow.Interpreter.InterpreterSimulator = function(programAst, globalObject, handlerInfo)
{
    this.programAst = programAst;
    this.globalObject = globalObject;
    this.handlerInfo = handlerInfo;
    this.tryStack = [];

    this.executionContextStack = new ExecutionContextStack(globalObject, handlerInfo);
    this.executionContextStack.registerExceptionCallback(this.removeCommandsAfterException, this);

    this.commands = CommandGenerator.generateCommands(programAst);

    this.messageGeneratedCallbacks = [];
    this.controlFlowConnectionCallbacks = [];
};

var fcSimulator = Firecrow.Interpreter.InterpreterSimulator;

fcSimulator.log = [];
fcSimulator.markExecutedConstructs = false;
fcSimulator.logTrace = false;
fcSimulator.notifyError = function(message) { alert("InterpreterSimulator - " + message); }

fcSimulator.prototype =
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

                if((!fcSimulator.logTrace && !fcSimulator.markExecutedConstructs) || command.codeConstruct == null) { continue; }

                command.codeConstruct.hasBeenExecuted = true;

                if(command.codeConstruct.loc == null) { continue; }

                fcSimulator.log.push(command.codeConstruct.loc.start.line);

                if(command.codeConstruct.loc.start.line == 13)
                {
                    Firecrow.Interpreter.logExecution = true;
                }

                if(Firecrow.Interpreter.logExecution && lastLoggedCommandLine != command.getLineNo() && !command.isDeclareVariableCommand()
                && !command.isEnterFunctionContextCommand() && !command.isExitFunctionContextCommand() && !command.isEndIfCommand()
                && !command.isEndLoopStatementCommand())
                {
                    Firecrow.Interpreter.InterpreterSimulator.log += command.getLineNo() + ";\n";// + command.type + "\n";
                    lastLoggedCommandLine = command.getLineNo();
                }
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

                if(that.currentCommandIndex < that.commands.length) { that.currentCommandIndex % 20 == 0 ? setTimeout(asyncLoop, 10) : asyncLoop(); }
                else { callback(); }
            };

            setTimeout(asyncLoop, 10)
        }
        catch(e) { this.notifyError("Error when executing async loop"); }
    },

    processCommand: function(command)
    {
        if(command.isStartTryStatementCommand() || command.isEndTryStatementCommand()) { this.processTryCommand(command); }
        if(command.isEvalThrowExpressionCommand()) { this.removeCommandsAfterException(command); }

        this.executionContextStack.executeCommand(command);
        command.hasBeenExecuted = true;

        if (command.removesCommands) { this.processRemovingCommandsCommand(command); }
        if (command.generatesNewCommands) { this.processGeneratingNewCommandsCommand(command); }
    },

    processTryCommand: function(command)
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
    },

    processRemovingCommandsCommand: function(command)
    {
             if (command.isEvalReturnExpressionCommand()) { this.removeCommandsAfterReturnStatement(command); }
        else if (command.isEvalBreakCommand()) { this.removeCommandsAfterBreak(command); }
        else if (command.isEvalContinueCommand()) { this.removeCommandsAfterContinue(command); }
        else if (command.isEvalThrowExpressionCommand()) { this.removeCommandsAfterException(command); }
        else if (command.isEvalLogicalExpressionItemCommand()) { this.removeCommandsAfterLogicalExpressionItem(command); }
        else { this.notifyError("Unknown removing commands command: " + command.type); }
    },

    removeCommandsAfterReturnStatement: function(returnCommand)
    {
        var callExpressionCommand = returnCommand.parentFunctionCommand;

        for(var i = this.currentCommandIndex + 1; i < this.commands.length;)
        {
            var command = this.commands[i];

            if(!command.isExitFunctionContextCommand() && command.parentFunctionCommand == callExpressionCommand) { ValueTypeHelper.removeFromArrayByIndex(this.commands, i); }
            else { break; }
        }
    },

    removeCommandsAfterBreak: function(breakCommand)
    {
        for(var i = this.currentCommandIndex + 1; i < this.commands.length; )
        {
            var command = this.commands[i];

            if(!command.isEndSwitchStatementCommand()) { ValueTypeHelper.removeFromArrayByIndex(this.commands, i); }

            if(command.isLoopStatementCommand() || command.isEndSwitchStatementCommand()) { break;}
        }
    },

    removeCommandsAfterContinue: function(continueCommand)
    {
        for(var i = this.currentCommandIndex + 1; i < this.commands.length; )
        {
            var command = this.commands[i];

            if(command.isLoopStatementCommand() || command.isForUpdateStatementCommand()) { break; }

            ValueTypeHelper.removeFromArrayByIndex(this.commands, i);
        }
    },

    removeCommandsAfterException: function(exceptionGeneratingArgument)
    {
        if(exceptionGeneratingArgument == null || !exceptionGeneratingArgument.isMatchesSelectorException)
        {
            this.notifyError("Exception generating error at:" + this.commands[this.currentCommandIndex].codeConstruct.loc.source + " - " + this.commands[this.currentCommandIndex].codeConstruct.loc.start.line + ": " + this.globalObject.browser.url);
        }

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

            if(command.isEndIfCommand() || command.isEndLoopStatementCommand())
            {
                if(command.startCommand != null && command.startCommand.hasBeenExecuted) { i++; continue; }
            }

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
    },

    removeCommandsAfterLogicalExpressionItem: function(evalLogicalExpressionItemCommand)
    {
        if(!evalLogicalExpressionItemCommand.isEvalLogicalExpressionItemCommand()) { this.notifyError("Argument is not an eval logical expression item command"); return; }

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
    },

    processGeneratingNewCommandsCommand: function(command)
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
    },

    generateCommandsAfterCallbackFunctionCommand: function(callInternalFunctionCommand)
    {
        ValueTypeHelper.insertElementsIntoArrayAtIndex
        (
            this.commands,
            CommandGenerator.generateCallbackFunctionExecutionCommands(callInternalFunctionCommand),
            this.currentCommandIndex + 1
        );
    },

    generateCommandsAfterNewExpressionCommand: function(newCommand)
    {
        if(!newCommand.isEvalNewExpressionCommand()) { this.notifyError("Argument is not newExpressionCommand"); return; }

        var callConstruct = newCommand.codeConstruct;
        var callee = this.executionContextStack.getExpressionValue(callConstruct.callee);
        var newObject = this.globalObject.internalExecutor.createObject
        (
            callee,
            newCommand.codeConstruct,
            callConstruct.arguments.map(function(argument) { return this.executionContextStack.getExpressionValue(argument)}, this)
        );

        this.globalObject.browser.callDataDependencyEstablishedCallbacks(callConstruct, callConstruct.callee, this.globalObject.getPreciseEvaluationPositionId());

        for(var i = 0; i < callConstruct.arguments.length; i++)
        {
            this.globalObject.browser.callDataDependencyEstablishedCallbacks(callConstruct, callConstruct.arguments[i], this.globalObject.getPreciseEvaluationPositionId());
        }

        this.executionContextStack.setExpressionValue(newCommand.codeConstruct, newObject);

        ValueTypeHelper.insertElementsIntoArrayAtIndex
        (
            this.commands,
            CommandGenerator.generateFunctionExecutionCommands(newCommand, callee, newObject),
            this.currentCommandIndex + 1
        );
    },

    generateCommandsAfterCallFunctionCommand: function(callExpressionCommand)
    {
        if(!callExpressionCommand.isEvalCallExpressionCommand()) { this.notifyError("Argument is not callExpressionCommand"); return; }

        var callConstruct = callExpressionCommand.codeConstruct;

        this.globalObject.browser.callDataDependencyEstablishedCallbacks(callConstruct, callConstruct.callee, this.globalObject.getPreciseEvaluationPositionId());

        for(var i = 0; i < callConstruct.arguments.length; i++)
        {
            this.globalObject.browser.callDataDependencyEstablishedCallbacks(callConstruct, callConstruct.arguments[i], this.globalObject.getPreciseEvaluationPositionId());
        }

        var baseObject = this.executionContextStack.getBaseObject(callConstruct.callee);
        var callFunction = this.executionContextStack.getExpressionValue(callConstruct.callee);

        var baseObjectValue = baseObject.value;
        var callFunctionValue = callFunction.value;

        if(ValueTypeHelper.isFunction(baseObjectValue) && ValueTypeHelper.isFunction(callFunctionValue))
        {
            if(callFunctionValue.name == "call" || callFunctionValue.name == "apply")
            {
                     if(callFunctionValue.name == "call") { callExpressionCommand.isCall = true; }
                else if(callFunctionValue.name == "apply") { callExpressionCommand.isApply = true; }

                callFunction = baseObject;
                baseObject = this.executionContextStack.getExpressionValue(callConstruct.arguments[0]);
            }
        }

        ValueTypeHelper.insertElementsIntoArrayAtIndex
        (
            this.commands,
            CommandGenerator.generateFunctionExecutionCommands(callExpressionCommand, callFunction, baseObject),
            this.currentCommandIndex + 1
        );
    },

    generateCommandsAfterLoopCommand: function(loopCommand)
    {
        if(!loopCommand.isLoopStatementCommand()) { this.notifyError("Argument has to be a loop command!"); return; }

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
    },

    generateCommandsAfterIfCommand: function(ifCommand)
    {
        if(!ifCommand.isIfStatementCommand()) { this.notifyError("Argument has to be a if command!"); return; }

        var generatedCommands = CommandGenerator.generateIfStatementBodyCommands
        (
            ifCommand,
            this.executionContextStack.getExpressionValue(ifCommand.codeConstruct.test).value,
            ifCommand.parentFunctionCommand
        );

        ValueTypeHelper.insertElementsIntoArrayAtIndex(this.commands, generatedCommands, this.currentCommandIndex + 1);
    },

    generateCommandsAfterConditionalCommand: function(conditionalCommand)
    {
        if(!conditionalCommand.isEvalConditionalExpressionBodyCommand()) { this.notifyError("Argument has to be a conditional expression body command!"); return; }

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
    },

    generateCommandsAfterCaseCommand: function(caseCommand)
    {
        if(!caseCommand.isCaseCommand()) { this.notifyError("Argument has to be a case command!"); return; }

        if( caseCommand.codeConstruct.test == null
         || this.executionContextStack.getExpressionValue(caseCommand.codeConstruct.test).value == this.executionContextStack.getExpressionValue(caseCommand.parent.codeConstruct.discriminant).value
         || caseCommand.parent.hasBeenMatched)
        {
            caseCommand.parent.hasBeenMatched = true;
            caseCommand.parent.matchedCaseCommand = caseCommand;

            ValueTypeHelper.insertElementsIntoArrayAtIndex(this.commands, CommandGenerator.generateCaseExecutionCommands(caseCommand), this.currentCommandIndex + 1);
        }
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