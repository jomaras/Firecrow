FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ExecutionContextStack = Firecrow.Interpreter.Simulator.ExecutionContextStack;
var Command = Firecrow.Interpreter.Commands.Command;
var CommandGenerator = Firecrow.Interpreter.Commands.CommandGenerator;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;
var fcSymbolic = Firecrow.ScenarioGenerator.Symbolic;

Firecrow.Interpreter.logExecution = false;

Firecrow.Interpreter.InterpreterSimulator = function(programAst, globalObject, handlerInfo)
{
    this.programAst = programAst;
    this.globalObject = globalObject;
    this.handlerInfo = handlerInfo;
    this.tryStack = [];

    this.executionContextStack = new ExecutionContextStack(globalObject, handlerInfo);
    this.executionContextStack.registerExceptionCallback(this._removeCommandsAfterException, this);

    this.globalObject.executionContextStack = this.executionContextStack;

    this.commands = CommandGenerator.generateCommands(programAst);

    this.messageGeneratedCallbacks = [];
    this.controlFlowConnectionCallbacks = [];
};

var fcSimulator = Firecrow.Interpreter.InterpreterSimulator;

fcSimulator.log = [];
fcSimulator.logTrace = false;
fcSimulator.notifyError = function(message) { alert("InterpreterSimulator - " + message); }

fcSimulator.prototype =
{
    runSync: function()
    {
        try
        {
            if(fcSimulator.logTrace) { console.log("Logging trace!"); }
            var timer = Firecrow.TimerHelper.createTimer();

            for(this.currentCommandIndex = 0; this.currentCommandIndex < this.commands.length; this.currentCommandIndex++)
            {
                var command = this.commands[this.currentCommandIndex];

                this.globalObject.setCurrentCommand(command);

                this._processCommand(command);

                this.callControlFlowConnectionCallbacks(command.codeConstruct);

                /*if(timer.hasMoreThanSecondsElapsed(120))
                {
                    if(!confirm("Interpreter Simulator - runSync has been running for more than 2 minutes, Continue?"))
                    {
                        return;
                    }

                    timer = Firecrow.TimerHelper.createTimer();
                }*/

                //Uncomment to enable application tracing
                /*if(!fcSimulator.logTrace || command.codeConstruct == null) { continue; }

                if(command.codeConstruct.loc == null) { continue; }

                if(fcSimulator.log.length == 0 || fcSimulator.log[fcSimulator.log.length-1] != command.codeConstruct.loc.start.line)
                {
                    if(command.isDeclareVariableCommand() && command.parentFunctionCommand != null) { continue; }
                    if(command.type.indexOf("End") == 0) { continue; }

                    fcSimulator.log.push(command.codeConstruct.loc.start.line);
                }*/
            }
        }
        catch(e)
        {
            debugger;
            fcSimulator.notifyError("Error while running the InterpreterSimulator: " + e);
        }
    },

    runAsync: function(callback)
    {
        try
        {
            this.currentCommandIndex = 0;
            var that = this;
            var timer = Firecrow.TimerHelper.createTimer();

            var asyncLoop = function()
            {
                var command = that.commands[that.currentCommandIndex];

                that._processCommand(command);

                that.callMessageGeneratedCallbacks("ExCommand@" + command.getLineNo() + ":" + command.type);

                that.currentCommandIndex++;

                if(timer.hasMoreThanSecondsElapsed(120))
                {
                    if(!confirm("Interpreter Simulator - runAsync has been running for more than 2 minutes, Continue?"))
                    {
                        return;
                    }
                }

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
        else if (command.isConvertToPrimitiveCommand()) { this._generateCommandsAfterConvertToPrimitiveCommand(command); }
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
        else { fcSimulator.notifyError("Unknown command type when processing try command"); }
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

            if(!command.isForUpdateStatementCommand() && !command.isEndLoopStatementCommand() && !command.isEvalForInWhereCommand()) { ValueTypeHelper.removeFromArrayByIndex(this.commands, i); }
            else{i++;}

            if(command.isLoopStatementCommand() || command.isForUpdateStatementCommand()) { break;}
        }
    },

    _removeCommandsAfterException: function(exceptionGeneratingArgument)
    {
        if(exceptionGeneratingArgument == null || !exceptionGeneratingArgument.isMatchesSelectorException)
        {
            debugger;
            fcSimulator.notifyError("Exception generating error at:" + this.commands[this.currentCommandIndex].codeConstruct.loc.source + " - " + this.commands[this.currentCommandIndex].codeConstruct.loc.start.line + ": " + this.globalObject.browser.url);
        }

        if(this.tryStack.length == 0)
        {
            debugger;
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
        var callConstruct = newCommand.codeConstruct;
        var callee = this.executionContextStack.getExpressionValue(callConstruct.callee);
        var newObject = this.globalObject.internalExecutor.createObject
        (
            callee,
            newCommand.codeConstruct,
            callConstruct.arguments.map(function(argument) { return this.executionContextStack.getExpressionValue(argument)}, this)
        );

        this.globalObject.dependencyCreator.createDataDependency(callConstruct, callConstruct.callee, this.globalObject.getPreciseEvaluationPositionId());

        for(var i = 0; i < callConstruct.arguments.length; i++)
        {
            this.globalObject.dependencyCreator.createDataDependency(callConstruct, callConstruct.arguments[i], this.globalObject.getPreciseEvaluationPositionId());
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
        var callConstruct = callExpressionCommand.codeConstruct;

        //TODO - hack to cover problems of object[callExpression()] where only callExpression is important
        /*if(ASTHelper.isMemberExpressionProperty(callConstruct))
        {
            this.globalObject.dependencyCreator.createDataDependency(callConstruct, callConstruct.parent, this.globalObject.getPreciseEvaluationPositionId());
        }*/

        this.globalObject.dependencyCreator.createDataDependency(callConstruct, callConstruct.callee, this.globalObject.getPreciseEvaluationPositionId());

        for(var i = 0; i < callConstruct.arguments.length; i++)
        {
            this.globalObject.dependencyCreator.createDataDependency(callConstruct, callConstruct.arguments[i], this.globalObject.getPreciseEvaluationPositionId());
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
        var ifConditionValue = this.executionContextStack.getExpressionValue(ifCommand.codeConstruct.test);

        var generatedCommands = CommandGenerator.generateIfStatementBodyCommands(ifCommand, ifConditionValue.jsValue, ifCommand.parentFunctionCommand);

        this.globalObject.browser.addPathConstraint(ifCommand.codeConstruct, ifConditionValue.symbolicValue, !ifConditionValue.jsValue);

        ValueTypeHelper.insertElementsIntoArrayAtIndex(this.commands, generatedCommands, this.currentCommandIndex + 1);
    },

    _generateCommandsAfterConditionalCommand: function(conditionalCommand)
    {
        var conditionValue = this.executionContextStack.getExpressionValue(conditionalCommand.codeConstruct.test);

        this.globalObject.browser.addPathConstraint(conditionalCommand.codeConstruct, conditionValue.symbolicValue, !conditionValue.jsValue);

        ValueTypeHelper.insertElementsIntoArrayAtIndex
        (
            this.commands,
            CommandGenerator.generateConditionalExpressionEvalBodyCommands
            (
                conditionalCommand,
                conditionValue.jsValue
            ),
            this.currentCommandIndex + 1
        );
    },

    _generateCommandsAfterCaseCommand: function(caseCommand)
    {
        var switchDiscriminantValue = this.executionContextStack.getExpressionValue(caseCommand.parent.codeConstruct.discriminant);
        var caseValue = caseCommand.codeConstruct.test != null ? this.executionContextStack.getExpressionValue(caseCommand.codeConstruct.test)
                                                               : null;

        var pathConstraint = fcSymbolic.SymbolicExecutor.evalSwitchCase(caseValue, switchDiscriminantValue);

        if(caseCommand.codeConstruct.test == null //is default
        || caseCommand.parent.hasBeenMatched //falls through
        || caseValue.jsValue == switchDiscriminantValue.jsValue)
        {
            if(!caseCommand.parent.hasBeenMatched) //On first matching case - add path
            {
                this.globalObject.browser.addPathConstraint(caseCommand.parent, pathConstraint);
            }

            caseCommand.parent.hasBeenMatched = true;
            caseCommand.parent.matchedCaseCommand = caseCommand;

            ValueTypeHelper.insertElementsIntoArrayAtIndex(this.commands, CommandGenerator.generateCaseExecutionCommands(caseCommand), this.currentCommandIndex + 1);
        }
        else //will not generate case commands - add inverted path constraint
        {
            this.globalObject.browser.addPathConstraint(caseCommand.parent, pathConstraint, true);
        }
    },

    _generateCommandsAfterConvertToPrimitiveCommand: function(convertToPrimitiveCommand)
    {
        var expression = convertToPrimitiveCommand.codeConstruct;
        var expressionValue = this.executionContextStack.getExpressionValue(expression);

        //Is null, don't do anything - will throw exception later when processing binary expression
        //If primitive, there is nothing to do
        if(expressionValue == null || expressionValue.isPrimitive()) { return; }

        var valueOfFunction = expressionValue.iValue.getPropertyValue("valueOf");

        //If there is no user-defined valueOf function just return
        if(valueOfFunction == null || valueOfFunction.iValue == null || valueOfFunction.isInternalFunction ) { return; }

        ValueTypeHelper.insertElementsIntoArrayAtIndex
        (
            this.commands,
            CommandGenerator.generateFunctionExecutionCommands(convertToPrimitiveCommand, valueOfFunction, expressionValue),
            this.currentCommandIndex + 1
        );
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