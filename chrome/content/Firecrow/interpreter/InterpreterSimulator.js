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
    this.executionContextStack.registerExceptionCallback(this._removeCommandsAfterException, this);

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

                this._processCommand(command);

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
        catch(e)
        {
            fcSimulator.notifyError("Error while running the InterpreterSimulator: " + e);
        }
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

                that._processCommand(command);

                that.callMessageGeneratedCallbacks("ExCommand@" + command.getLineNo() + ":" + command.type);

                that.currentCommandIndex++;

                if(that.currentCommandIndex < that.commands.length) { that.currentCommandIndex % 20 == 0 ? setTimeout(asyncLoop, 10) : asyncLoop(); }
                else { callback(); }
            };

            setTimeout(asyncLoop, 10)
        }
        catch(e) { fcSimulator.notifyError("Error when executing async loop"); }
    },

    _processCommand: function(command)
    {
        if(command.isStartTryStatementCommand() || command.isEndTryStatementCommand()) { this._processTryCommand(command); }
        if(command.isEvalThrowExpressionCommand()) { this._removeCommandsAfterException(command); }

        this.executionContextStack.executeCommand(command);
        command.hasBeenExecuted = true;

        if (command.removesCommands) { this._processRemovingCommandsCommand(command); }
        if (command.generatesNewCommands) { this._processGeneratingNewCommandsCommand(command); }
    },

    _processGeneratingNewCommandsCommand: function(command)
    {
             if (command.isEvalCallbackFunctionCommand()) { this._generateCommandsAfterCallbackFunctionCommand(command); }
        else if (command.isEvalNewExpressionCommand()) { this._generateCommandsAfterNewExpressionCommand(command); }
        else if (command.isEvalCallExpressionCommand()) { this._generateCommandsAfterCallFunctionCommand(command); }
        else if (command.isCallInternalFunctionCommand()) { if(command.generatesCallbacks) { this._generateCommandsAfterCallbackFunctionCommand(command); }}
        else if (command.isLoopStatementCommand()) { this._generateCommandsAfterLoopCommand(command); }
        else if (command.isIfStatementCommand()) { this._generateCommandsAfterIfCommand(command); }
        else if (command.isEvalConditionalExpressionBodyCommand()) { this._generateCommandsAfterConditionalCommand(command); }
        else if (command.isCaseCommand()) { this._generateCommandsAfterCaseCommand(command); }
        else { fcSimulator.notifyError("Unknown generating new commands command!"); }
    },

    _processRemovingCommandsCommand: function(command)
    {
        if (command.isEvalReturnExpressionCommand()) { this._removeCommandsAfterReturnStatement(command); }
        else if (command.isEvalBreakCommand()) { this._removeCommandsAfterBreak(command); }
        else if (command.isEvalContinueCommand()) { this._removeCommandsAfterContinue(command); }
        else if (command.isEvalThrowExpressionCommand()) { this._removeCommandsAfterException(command); }
        else if (command.isEvalLogicalExpressionItemCommand()) { this._removeCommandsAfterLogicalExpressionItem(command); }
        else { fcSimulator.notifyError("Unknown removing commands command: " + command.type); }
    },

    _processTryCommand: function(command)
    {
        if(!(command.isStartTryStatementCommand() || command.isEndTryStatementCommand())) { fcSimulator.notifyError("The command is not a try command in InterpreterSimulator!"); return; }

        if(command.isStartTryStatementCommand())
        {
            this.tryStack.push(command); return;
        }
        else if (command.isEndTryStatementCommand())
        {
            var topCommand = this.tryStack[this.tryStack.length - 1];

            if(topCommand == null || topCommand.codeConstruct != command.codeConstruct) { fcSimulator.notifyError("Error while popping try command from Stack"); return; }

            this.tryStack.pop();
        }
    },

    _removeCommandsAfterReturnStatement: function(returnCommand)
    {
        var callExpressionCommand = returnCommand.parentFunctionCommand;

        for(var i = this.currentCommandIndex + 1; i < this.commands.length;)
        {
            var command = this.commands[i];

            if(!command.isExitFunctionContextCommand() && command.parentFunctionCommand == callExpressionCommand) { ValueTypeHelper.removeFromArrayByIndex(this.commands, i); }
            else { break; }
        }
    },

    _removeCommandsAfterBreak: function(breakCommand)
    {
        for(var i = this.currentCommandIndex + 1; i < this.commands.length; )
        {
            var command = this.commands[i];

            if(!command.isEndSwitchStatementCommand() && !command.isEndLoopStatementCommand()) { ValueTypeHelper.removeFromArrayByIndex(this.commands, i); }
            else{i++;}

            if(command.isLoopStatementCommand() || command.isEndSwitchStatementCommand()) { break;}
        }
    },

    _removeCommandsAfterContinue: function(continueCommand)
    {
        for(var i = this.currentCommandIndex + 1; i < this.commands.length; )
        {
            var command = this.commands[i];

            if(!command.isForUpdateStatementCommand() && !command.isEndLoopStatementCommand()) { ValueTypeHelper.removeFromArrayByIndex(this.commands, i); }
            else{i++;}

            if(command.isLoopStatementCommand() || command.isForUpdateStatementCommand()) { break;}
        }
    },

    _removeCommandsAfterException: function(exceptionGeneratingArgument)
    {
        if(exceptionGeneratingArgument == null || !exceptionGeneratingArgument.isMatchesSelectorException)
        {
            fcSimulator.notifyError("Exception generating error at:" + this.commands[this.currentCommandIndex].codeConstruct.loc.source + " - " + this.commands[this.currentCommandIndex].codeConstruct.loc.start.line + ": " + this.globalObject.browser.url);
        }

        if(this.tryStack.length == 0)
        {
            fcSimulator.notifyError("Removing commands and there is no enclosing try catch block @ " + this.commands[this.currentCommandIndex].codeConstruct.loc.source);
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

    _removeCommandsAfterLogicalExpressionItem: function(evalLogicalExpressionItemCommand)
    {
        if(!evalLogicalExpressionItemCommand.isEvalLogicalExpressionItemCommand()) { fcSimulator.notifyError("Argument is not an eval logical expression item command"); return; }

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

    _generateCommandsAfterCallbackFunctionCommand: function(callInternalFunctionCommand)
    {
        ValueTypeHelper.insertElementsIntoArrayAtIndex
        (
            this.commands,
            CommandGenerator.generateCallbackFunctionExecutionCommands(callInternalFunctionCommand),
            this.currentCommandIndex + 1
        );
    },

    _generateCommandsAfterNewExpressionCommand: function(newCommand)
    {
        if(!newCommand.isEvalNewExpressionCommand()) { fcSimulator.notifyError("Argument is not newExpressionCommand"); return; }

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

    _generateCommandsAfterCallFunctionCommand: function(callExpressionCommand)
    {
        if(!callExpressionCommand.isEvalCallExpressionCommand()) { fcSimulator.notifyError("Argument is not callExpressionCommand"); return; }

        var callConstruct = callExpressionCommand.codeConstruct;

        this.globalObject.browser.callDataDependencyEstablishedCallbacks(callConstruct, callConstruct.callee, this.globalObject.getPreciseEvaluationPositionId());

        for(var i = 0; i < callConstruct.arguments.length; i++)
        {
            this.globalObject.browser.callDataDependencyEstablishedCallbacks(callConstruct, callConstruct.arguments[i], this.globalObject.getPreciseEvaluationPositionId());
        }

        var baseObject = this.executionContextStack.getBaseObject(callConstruct.callee);
        var callFunction = this.executionContextStack.getExpressionValue(callConstruct.callee);

        var baseObjectValue = baseObject.jsValue;
        var callFunctionValue = callFunction.jsValue;

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

    _generateCommandsAfterLoopCommand: function(loopCommand)
    {
        if(!loopCommand.isLoopStatementCommand()) { fcSimulator.notifyError("Argument has to be a loop command!"); return; }

        ValueTypeHelper.insertElementsIntoArrayAtIndex
        (
            this.commands,
            CommandGenerator.generateLoopExecutionCommands
            (
                loopCommand,
                !loopCommand.isEvalForInWhereCommand() ? this.executionContextStack.getExpressionValue(loopCommand.codeConstruct.test).jsValue : null
            ),
            this.currentCommandIndex + 1
        );
    },

    _generateCommandsAfterIfCommand: function(ifCommand)
    {
        if(!ifCommand.isIfStatementCommand()) { fcSimulator.notifyError("Argument has to be a if command!"); return; }

        var generatedCommands = CommandGenerator.generateIfStatementBodyCommands
        (
            ifCommand,
            this.executionContextStack.getExpressionValue(ifCommand.codeConstruct.test).jsValue,
            ifCommand.parentFunctionCommand
        );

        ValueTypeHelper.insertElementsIntoArrayAtIndex(this.commands, generatedCommands, this.currentCommandIndex + 1);
    },

    _generateCommandsAfterConditionalCommand: function(conditionalCommand)
    {
        if(!conditionalCommand.isEvalConditionalExpressionBodyCommand()) { fcSimulator.notifyError("Argument has to be a conditional expression body command!"); return; }

        ValueTypeHelper.insertElementsIntoArrayAtIndex
        (
            this.commands,
            CommandGenerator.generateConditionalExpressionEvalBodyCommands
            (
                conditionalCommand,
                this.executionContextStack.getExpressionValue(conditionalCommand.codeConstruct.test).jsValue
            ),
            this.currentCommandIndex + 1
        );
    },

    _generateCommandsAfterCaseCommand: function(caseCommand)
    {
        if(!caseCommand.isCaseCommand()) { fcSimulator.notifyError("Argument has to be a case command!"); return; }

        if( caseCommand.codeConstruct.test == null
         || this.executionContextStack.getExpressionValue(caseCommand.codeConstruct.test).jsValue == this.executionContextStack.getExpressionValue(caseCommand.parent.codeConstruct.discriminant).jsValue
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
    }
};
/******************************************************************************************/
}});