/**
 * Created by Jomaras.
 * Date: 08.03.12.@19:13
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;
var fcSimulator = Firecrow.Interpreter.Simulator;
var fcCommands = Firecrow.Interpreter.Commands;
var fcModel = Firecrow.Interpreter.Model;

//<editor-fold desc="Execution Context">
fcSimulator.ExecutionContext = function(variableObject, scopeChain, thisObject, globalObject, contextCreationCommand)
{
    try
    {
        this.id = fcSimulator.ExecutionContext.LAST_ID++;

        this.variableObject = variableObject || globalObject.globalVariableObject;
        this.thisObject = thisObject || globalObject;

        if(this.thisObject != globalObject && !(this.thisObject instanceof fcModel.fcValue))
        {
            this.thisObject = new fcModel.fcValue(this.thisObject.implementationObject, thisObject);
        }

        this.globalObject = globalObject;

        this.scopeChain = ValueTypeHelper.createArrayCopy(scopeChain);
        this.scopeChain.push(this.variableObject);

        this.codeConstructValuesMapping = {};
        this.commands = [];

        this.contextCreationCommand = contextCreationCommand;
    }
    catch(e) { fcSimulator.ExecutionContext.notifyError("Error when constructing execution context: " + e); }
};

fcSimulator.ExecutionContext.createGlobalExecutionContext = function(globalObject)
{
    return new fcSimulator.ExecutionContext(globalObject, [], globalObject, globalObject);
};

fcSimulator.ExecutionContext.LAST_ID = 0;
fcSimulator.ExecutionContext.notifyError = function(message) { alert("ExecutionContextStack - " + message);}

fcSimulator.ExecutionContext.prototype =
{
    getCodeConstructValue: function(codeConstruct)
    {
        if(codeConstruct == null) { return null;}

        return this.codeConstructValuesMapping[codeConstruct.nodeId];
    },

    setCodeConstructValue: function(codeConstruct, value)
    {
        if(codeConstruct == null) { return null; }

        this.codeConstructValuesMapping[codeConstruct.nodeId] = value
    },

    registerIdentifier: function(identifier)
    {
       this.variableObject.registerIdentifier(identifier);
    },

    pushToScopeChain: function(variableObject)
    {
        this.scopeChain.push(variableObject);
    },

    popFromScopeChain: function()
    {
        return this.scopeChain.pop();
    },

    destruct: function()
    {
        delete this.variableObject;
        delete this.thisObject;

        delete this.globalObject;

        delete this.scopeChain;

        delete this.codeConstructValuesMapping;
        delete this.commands;
    }
};
//</editor-fold>

fcSimulator.ExecutionContextStack = function(globalObject, handlerInfo)
{
    try
    {
        if(globalObject == null) { this.notifyError("GlobalObject can not be null when constructing execution context stack!"); return; }

        this.globalObject = globalObject;
        this.globalObject.executionContextStack = this;

        this.activeContext = null;
        this.stack = [];

        this.exceptionCallbacks = [];
        this.blockCommandStack = [];
        this.functionContextCommandsStack = [{functionContextBlockCommandsEvalPositions:[]}];

        this.dependencyCreator = new fcSimulator.DependencyCreator(globalObject, this);

        this.evaluator = new fcSimulator.Evaluator(this);
        this.evaluator.registerExceptionCallback(this._exceptionCallback, this);

        this._enterInitialContext(handlerInfo);
    }
    catch(e) { debugger; this.notifyError("Error when constructing executionContextStack: " + e); }
};

fcSimulator.ExecutionContextStack.prototype =
{
    getStackLines: function()
    {
        var lines = "";

        for(var i = 0; i < this.stack.length; i++)
        {
            if(i != 0) { lines += "-"; }
            lines += this.stack[i].lastCommand.codeConstruct.loc.start.line;
        }

        return lines;
    },

    destruct: function()
    {
        delete this.globalObject;

        delete this.activeContext;
        delete this.stack;

        delete this.exceptionCallbacks;
        delete this.blockCommandStack;
        delete this.functionContextCommandsStack;

        delete this.dependencyCreator;

        delete this.evaluator;
    },

    executeCommand: function(command)
    {
        try
        {
            //console.log("Executing command " + command.type + " @" + (command.codeConstruct != null && command.codeConstruct.loc != null ? command.codeConstruct.loc.start.line : -1));

            if(!command.isEnterFunctionContextCommand()) { this.activeContext.lastCommand = command; }
            this.globalObject.browser.logConstructExecuted(command.codeConstruct);

            if (command.isEnterFunctionContextCommand())
            {
                this.functionContextCommandsStack.push(command);
                command.functionContextBlockCommandsEvalPositions = [];
                this._addToBlockCommandStack(command);
                this._enterFunctionContext(command);
            }
            else if (command.isExitFunctionContextCommand())
            {
                this._exitFunctionContext(command);
                this._popTillLastFunctionContextCommand(command);
                this.functionContextCommandsStack.pop();
            }
            else if (command.isStartWithStatementCommand())
            {
                this.dependencyCreator.addDependenciesToTopBlockConstructs(command.codeConstruct.object);
                this._addToBlockCommandStack(command);
                this._evalStartWithCommand(command);
            }
            else if (command.isEndWithStatementCommand()) { this._tryPopCommand(command); this._evalEndWithCommand(command); }
            else if (command.isForStatementCommand() || command.isWhileStatementCommand() ||  command.isDoWhileStatementCommand())
            {
                this.dependencyCreator.addDependenciesToTopBlockConstructs(command.codeConstruct.test);
                this._addToBlockCommandStack(command);
            }
            else if (command.isForUpdateStatementCommand()){}
            else if (command.isIfStatementCommand())
            {
                this.dependencyCreator.addDependenciesToTopBlockConstructs(command.codeConstruct.test);
                this._addToBlockCommandStack(command);
            }
            else if (command.isEndIfCommand()) { this._tryPopCommand(command);}
            else if (command.isEndLoopStatementCommand()) { this._popLoop(command);}
            else if (command.isEvalConditionalExpressionBodyCommand()) { }
            else if (command.isEvalConditionalExpressionCommand()) { this._addToBlockCommandStack(command); }
            else if (command.isEvalBreakCommand() || command.isEvalContinueCommand())
            {
                this.evaluator.evalBreakContinueCommand(command );
                this._popTillBreakContinue(command.codeConstruct);
            }
            else if (command.isStartSwitchStatementCommand()) { this._addToBlockCommandStack(command); }
            else if (command.isEndSwitchStatementCommand()) { this._tryPopCommand(command);}
            else if (command.isCaseCommand()) {}
            else if (command.isStartTryStatementCommand() || command.isEndTryStatementCommand() || command.isEvalThrowExpressionCommand()) { }
            else if (command.isStartCatchStatementCommand()){ this._addToBlockCommandStack(command);}
            else if (command.isEndCatchStatementCommand()) { this._tryPopCommand(command);}
            else if (command.isEvalNewExpressionCommand()){ this.dependencyCreator.addNewExpressionDependencies(command.codeConstruct);}
            else if (command.isStartLogicalExpressionCommand()) { }
            else if (command.isCallInternalConstructorCommand()) { this.dependencyCreator.addDependenciesToTopBlockConstructs(command.codeConstruct); }
            else if (command.isCallCallbackMethodCommand()) {}
            else if (command.isEvalCallExpressionCommand()) { this.dependencyCreator.addCallExpressionDependencies(command.codeConstruct); }
            else if (command.isExecuteCallbackCommand()) { this.dependencyCreator.addCallbackDependencies(command.codeConstruct, command.callCallbackCommand.codeConstruct);}
            else if (command.isConvertToPrimitiveCommand()) {}
            else
            {
                if (command.isEndEvalConditionalExpressionCommand()) { this._tryPopCommand(command); }
                else if(command.isEvalForInWhereCommand())
                {
                    this.dependencyCreator.addDependenciesToTopBlockConstructs(command.codeConstruct.right);
                    this._addToBlockCommandStack(command);
                }
                else if (command.isEndLogicalExpressionCommand())
                {
                    if(ASTHelper.isAssignmentExpression(command.codeConstruct.parent))
                    {
                        this._addToFunctionContextBlockCommands(command);
                    }
                }

                this.evaluator.evaluateCommand(command);
            }
        }
        catch(e)
        {
            debugger;
            this.notifyError("Error when executing command: " + e);
        }
    },

    registerIdentifier: function(variableDeclarator)
    {
        if(!ASTHelper.isVariableDeclarator(variableDeclarator)) { this.notifyError("ExecutionContextStack: When registering an identifier, the argument has to be variable declarator"); }

        this.globalObject.browser.logConstructExecuted(variableDeclarator);
        this.globalObject.browser.logConstructExecuted(variableDeclarator.id)

        this.activeContext.registerIdentifier
        (
            new fcModel.Identifier
            (
                variableDeclarator.id.name,
                new fcModel.fcValue(undefined, undefined, variableDeclarator),
                variableDeclarator,
                this.globalObject
            )
        );
    },

    registerFunctionDeclaration: function(functionDeclaration)
    {
        try
        {
            if(!ASTHelper.isFunctionDeclaration(functionDeclaration)) { this.notifyError("When registering a function, the argument has to be a function declaration"); return; }

            this.globalObject.browser.logConstructExecuted(functionDeclaration);
            this.activeContext.registerIdentifier(new fcModel.Identifier(functionDeclaration.id.name, this.createFunctionInCurrentContext(functionDeclaration), functionDeclaration, this.globalObject));
        }
        catch(e)
        {
            this.notifyError("ExecutionContextStack - error when registering function declaration: " + e);
        }
    },

    getIdentifier: function(identifierName, codeConstruct)
    {
        for(var i = this.stack.length - 1; i >= 0; i--)
        {
            var scopeChain = this.stack[i].scopeChain;

            for(var j = scopeChain.length - 1; j >= 0; j--)
            {
                var variableObject = scopeChain[j];

                var identifier = variableObject.getIdentifier(identifierName);

                if(identifier != null)
                {
                    if(i != this.stack.length - 1 || j != scopeChain.length - 1)
                    {
                        this.globalObject.browser.logReadingIdentifierOutsideCurrentScope(identifier, codeConstruct);
                    }

                    return identifier;
                }
            }
        }
    },

    getIdentifierValue: function(identifierName)
    {
        for(var i = this.stack.length - 1; i >= 0; i--)
        {
            var scopeChain = this.stack[i].scopeChain;

            for(var j = scopeChain.length - 1; j >= 0; j--)
            {
                var variableObject = scopeChain[j];

                var identifier = variableObject.getIdentifier(identifierName);

                if(identifier != null) { return identifier.value; }
            }
        }
    },

    setIdentifierValue: function(identifierName, value, setCodeConstruct)
    {
        for(var i = this.stack.length - 1; i >= 0; i--)
        {
            var scopeChain = this.stack[i].scopeChain;

            for(var j = scopeChain.length - 1; j >= 0; j--)
            {
                var variableObject = scopeChain[j];

                var identifier = variableObject.getIdentifier(identifierName);

                if(identifier != null)
                {
                    identifier.setValue(value, setCodeConstruct);

                    if(variableObject != this.globalObject && !ValueTypeHelper.isOfType(variableObject, fcSimulator.VariableObject))
                    {
                        variableObject[identifierName] = value;
                    }

                    if(i != this.stack.length - 1 || j != scopeChain.length - 1)
                    {
                        this.globalObject.browser.logModifyingExternalContextIdentifier(identifier);
                    }

                    return;
                }
            }
        }

        this.stack[0].registerIdentifier(new fcModel.Identifier(identifierName, value, setCodeConstruct, this.globalObject));
    },

    deleteIdentifier: function(identifierName)
    {
        for(var i = this.stack.length - 1; i >= 0; i--)
        {
            var scopeChain = this.stack[i].scopeChain;

            for(var j = scopeChain.length - 1; j >= 0; j--)
            {
                var variableObject = scopeChain[j];

                var identifier = variableObject.getIdentifier(identifierName);

                if(identifier != null)
                {
                    return variableObject.deleteIdentifier(identifier.name);
                }
            }
        }
    },

    setExpressionValue: function(codeConstruct, value)
    {
        this.activeContext.setCodeConstructValue(codeConstruct, value);
    },

    setExpressionValueInPreviousContext: function(codeConstruct, value)
    {
        var previousExecutionContext = this.stack[this.stack.length - 2];

        if(previousExecutionContext == null) { this.notifyError("There is no previous context!"); return; }

        previousExecutionContext.setCodeConstructValue(codeConstruct, value);
    },

    getExpressionValue: function(codeConstruct)
    {
        var returnValue = this.activeContext.getCodeConstructValue(codeConstruct);

        if(returnValue == null && ASTHelper.isCallExpression(codeConstruct))
        {
            return new fcModel.fcValue(undefined, undefined, codeConstruct);
        }

        return returnValue;
    },

    getExpressionsValues: function(expressions)
    {
        var values = [];

        for(var i = 0; i < expressions.length; i++)
        {
            values.push(this.getExpressionValue(expressions[i]));
        }

        return values;
    },

    getBaseObject: function(codeConstruct)
    {
        if(ASTHelper.isIdentifier(codeConstruct) || ASTHelper.isFunctionExpression(codeConstruct)
        || ASTHelper.isLogicalExpression(codeConstruct) || ASTHelper.isConditionalExpression(codeConstruct)
        || ASTHelper.isThisExpression(codeConstruct))
        {
            return this.globalObject;
        }
        else if (ASTHelper.isMemberExpression(codeConstruct)) { return this.getExpressionValue(codeConstruct.object); }
        else if (ASTHelper.isCallExpression(codeConstruct)) { return this.getExpressionValue(codeConstruct.callee); }
        else
        {
            this.notifyError("Not handling getting base object on other expressions");
            return this.globalObject;
        }
    },

    createFunctionInCurrentContext: function(functionCodeConstruct)
    {
        return this.globalObject.internalExecutor.createFunction(this.activeContext.scopeChain, functionCodeConstruct)
    },

    registerExceptionCallback: function(callback, thisObject)
    {
        if(!ValueTypeHelper.isFunction(callback)) { this.notifyError("Exception callback has to be a function!"); return; }

        this.exceptionCallbacks.push({callback: callback, thisObject: thisObject || this});
    },

    push: function(executionContext)
    {
        if(!ValueTypeHelper.isOfType(executionContext, fcSimulator.ExecutionContext)) { this.notifyError("Argument is not ExecutionContext!"); return; }

        this.stack.push(executionContext);

        this.activeContext = executionContext;
    },

    pop: function()
    {
        if(this.stack.length == 0) { this.notifyError("Can not pop an empty stack"); return; }

        this.stack.pop();

        this.activeContext = this.stack[this.stack.length - 1];
    },

    callExceptionCallbacks: function(exceptionInfo)
    {
        this.exceptionCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, exceptionInfo);
        });
    },

    getTopBlockCommandConstructs: function()
    {
        //Loop, With, and If constructs are repeating and constant - makes more sense to link the blockStackConstructs with them, then on commands (which get created for each execution)
        //on the other hand EnterFunctionContextCommand is linked to the call expression making the call, which differ makes more sense to link to a command
        if(this.blockCommandStack.length == 0) { return []; }

        var topCommand = this.blockCommandStack[this.blockCommandStack.length - 1];
        var topConstruct = topCommand.codeConstruct;

        if((topCommand.isEnterFunctionContextCommand() || topCommand.isStartSwitchStatementCommand() || topCommand.isStartCatchStatementCommand())
         && topCommand.blockStackConstructs != null)
        {
            return topCommand.blockStackConstructs;
        }

        if(topConstruct.blockStackConstructs != null) { return topConstruct.blockStackConstructs; }

        if(ASTHelper.isLoopStatement(topConstruct) || ASTHelper.isIfStatement(topConstruct)  || ASTHelper.isConditionalExpression(topConstruct))
        {
            return topConstruct.blockStackConstructs = ASTHelper.isForInStatement(topConstruct) ? [topConstruct.right]
                                                                                                : [topConstruct.test];
        }
        else if(ASTHelper.isWithStatement(topConstruct))
        {
            return topConstruct.blockStackConstructs = [topConstruct.object];
        }

        if(topCommand.isEnterFunctionContextCommand())
        {
            return topCommand.blockStackConstructs = [topCommand.codeConstruct, topCommand.parentFunctionCommand.codeConstruct];
        }
        else if (topCommand.isStartSwitchStatementCommand())
        {
            topCommand.blockStackConstructs = [topConstruct.discriminant];

            if(topCommand.matchedCaseCommand != null)
            {
                topCommand.blockStackConstructs.push(topCommand.matchedCaseCommand.codeConstruct);

                if(topCommand.matchedCaseCommand.codeConstruct.test != null)
                {
                    topCommand.blockStackConstructs.push(topCommand.matchedCaseCommand.codeConstruct.test);
                }
            }

            return topCommand.blockStackConstructs;
        }
        else if (topCommand.isStartCatchStatementCommand())
        {
            return topCommand.blockStackConstructs = [topCommand.exceptionArgument.exceptionGeneratingConstruct];
        }

        this.notifyError("Should not be here when getting top block command @ " + topCommand.codeConstruct.loc.source);
    },

    getPreviouslyExecutedBlockConstructs: function()
    {
        var constructsEvalPositions = [];
        var topFunctionContextCommand = this.functionContextCommandsStack[this.functionContextCommandsStack.length - 1];

        if(topFunctionContextCommand == null || topFunctionContextCommand.functionContextBlockCommandsEvalPositions == null) { return constructsEvalPositions; }

        var blockCommandsEvalPositionMapping = topFunctionContextCommand.functionContextBlockCommandsEvalPositions;

        for(var i = 0, length = blockCommandsEvalPositionMapping.length; i < length; i++)
        {
            var mapping = blockCommandsEvalPositionMapping[i];

            var codeConstruct = mapping.command.codeConstruct;

            if(ASTHelper.isForStatement(codeConstruct) || ASTHelper.isWhileStatement(codeConstruct) || ASTHelper.isDoWhileStatement(codeConstruct)
            || ASTHelper.isIfStatement(codeConstruct))
            {
                codeConstruct = codeConstruct.test;
            }
            else if(ASTHelper.isWithStatement(codeConstruct))
            {
                codeConstruct = codeConstruct.object;
            }
            else if (ASTHelper.isSwitchStatement(codeConstruct))
            {
                codeConstruct = codeConstruct.discriminant;
            }
            else if (ASTHelper.isLogicalExpression(codeConstruct))
            {

            }
            else
            {
                codeConstruct = null;
            }

            constructsEvalPositions.push({codeConstruct: codeConstruct, evaluationPositionId: mapping.evaluationPositionId});
        }

        return constructsEvalPositions;
    },


    _exceptionCallback: function(exceptionInfo)
    {
        this.callExceptionCallbacks(exceptionInfo);
    },

    _enterInitialContext: function(handlerInfo)
    {
        this.handlerInfo = handlerInfo;

        if(this.handlerInfo == null)
        {
            this._enterGlobalContext();
        }
        else
        {
            this.enterEventHandlerContextCommand = fcCommands.Command.createEnterEventHandlerContextCommand(this.handlerInfo);
            this._enterFunctionContext(this.enterEventHandlerContextCommand);
        }
    },

    _popTillLastFunctionContextCommand: function(exitFunctionContextCommand)
    {
        if(this.blockCommandStack.length == 0) { this.notifyError("Error when popping function context commands from block stack - empty stack!"); return; }

        var blockCommandStack = this.blockCommandStack;

        for(var i = blockCommandStack.length - 1; i >= 0; i = blockCommandStack.length - 1)
        {
            var command = blockCommandStack[i];

            blockCommandStack.pop();

            if(command.codeConstruct == exitFunctionContextCommand.codeConstruct) { break; }
        }

        this._reevaluateEvaluationPositionId();
    },

    _popTillBreakContinue: function(codeConstruct)
    {
        if(this.blockCommandStack.length == 0) { this.notifyError("Error when popping break/continue commands from block stack - empty stack @" + codeConstruct.loc.source); return; }

        if(ASTHelper.isBreakStatement(codeConstruct)) { this._popTillBreak(); }
        else if (ASTHelper.isContinueStatement(codeConstruct)) { this._popTillContinue(); }
        else { this.notifyError("When popping break continue, codeConstruct should be break or continue!"); }

        this._reevaluateEvaluationPositionId();
    },

    _popTillBreak: function()
    {
        var blockCommandStack = this.blockCommandStack;

        for(var i = blockCommandStack.length - 1; i >= 0; i = blockCommandStack.length - 1)
        {
            var command = blockCommandStack[i];

            if(command.isLoopStatementCommand() || command.isStartSwitchStatementCommand()) { break; }

            blockCommandStack.pop();
        }
    },

    _popTillContinue: function()
    {
        var blockCommandStack = this.blockCommandStack;

        for(var i = blockCommandStack.length - 1; i >= 0; i = blockCommandStack.length - 1)
        {
            var command = blockCommandStack[i];

            if(command.isLoopStatementCommand()) { break; }

            blockCommandStack.pop();
        }
    },

    _popLoop: function(loopCommand)
    {
        this._tryPopCommand(loopCommand);
        this._reevaluateEvaluationPositionId();
    },

    _tryPopCommand: function(baseCommand)
    {
        if(this.blockCommandStack.length == 0) { this.notifyError("Error when trying to a command from block stack - empty stack!"); return false; }

        var lastCommand = this.blockCommandStack[this.blockCommandStack.length-1];

        if(lastCommand != baseCommand.startCommand)
        {
            this.notifyError
            (
                "When popping commands the top command has to be the same as the base command - TopCommand@"
                + lastCommand
                + " Base command@" + baseCommand
            );

            return false;
        }

        this.blockCommandStack.pop();
    },

    _addToBlockCommandStack: function(command)
    {
        if(command.isLoopStatementCommand() || command.isIfStatementCommand()) { this._addToFunctionContextBlockCommands(command); }

        this.blockCommandStack.push(command);

        if(command.isLoopStatementCommand() || command.isEnterFunctionContextCommand()) { this._reevaluateEvaluationPositionId(); }
    },

    _addToFunctionContextBlockCommands: function(command)
    {
        var topFunctionContextCommand = this.functionContextCommandsStack[this.functionContextCommandsStack.length - 1];

        if(topFunctionContextCommand == null) { return; }

        topFunctionContextCommand.functionContextBlockCommandsEvalPositions.push(
        {
            command: command,
            evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()
        });
    },

    _reevaluateEvaluationPositionId: function()
    {
        this.globalObject.evaluationPositionId = "root";

        var blockCommandStack = this.blockCommandStack;

        for(var i = 0, length = blockCommandStack.length; i < length; i++)
        {
            var command = blockCommandStack[i];
            if(command.isLoopStatementCommand() || command.isEnterFunctionContextCommand())
            {
                this.globalObject.evaluationPositionId += "-" + command.executionId + (command.isEnterFunctionContextCommand() ? "f" : "");
            }
        }
    },

    _enterGlobalContext: function()
    {
        this.push(fcSimulator.ExecutionContext.createGlobalExecutionContext(this.globalObject));
    },

    _enterFunctionContext: function(enterFunctionCommand)
    {
        if(!ValueTypeHelper.isOfType(enterFunctionCommand, fcCommands.Command) || !enterFunctionCommand.isEnterFunctionContextCommand()) { this.notifyError("Argument must be a enterFunctionContext command"); return; }
        if(enterFunctionCommand.callee == null) { this.notifyError("When processing enter function context the callee can not be null!"); return; }

        var callee = enterFunctionCommand.callee.iValue;
        this.dependencyCreator.markEnterFunctionPoints(enterFunctionCommand);

        var functionConstruct = enterFunctionCommand.callee.codeConstruct;
        var formalParameters = this._getFormalParameters(functionConstruct);

        var sentArgumentsValues = null;
        var arguments = [];

        this.globalObject.browser.logEnteringFunction
        (
            enterFunctionCommand.parentFunctionCommand != null ? enterFunctionCommand.parentFunctionCommand.codeConstruct : null,
            functionConstruct,
            fcSimulator.ExecutionContext.LAST_ID
        );

        if(enterFunctionCommand.isEnterEventHandler) { sentArgumentsValues = enterFunctionCommand.argumentValues; }
        else
        {
            sentArgumentsValues = this._getSentArgumentValues(enterFunctionCommand.parentFunctionCommand);

            if(!enterFunctionCommand.parentFunctionCommand.isExecuteCallbackCommand())
            {
                arguments = enterFunctionCommand.parentFunctionCommand.codeConstruct.arguments;
            }
        }

        if(callee.isBound && callee.argsToPrepend != null)
        {
            for(var i = 0; i < callee.argsToPrepend.length; i++)
            {
                ValueTypeHelper.insertIntoArrayAtIndex(sentArgumentsValues, callee.argsToPrepend[i], 0);
            }
        }

        this.dependencyCreator.createFunctionParametersDependencies(enterFunctionCommand.parentFunctionCommand, formalParameters, arguments);

        this.push
        (
            new fcSimulator.ExecutionContext
            (
                fcSimulator.VariableObject.createFunctionVariableObject
                (
                    functionConstruct.id != null ? new fcModel.Identifier(functionConstruct.id.name, enterFunctionCommand.callee, functionConstruct, this.globalObject)
                                                 : null,
                    formalParameters,
                    enterFunctionCommand.callee,
                    sentArgumentsValues,
                    enterFunctionCommand.parentFunctionCommand,
                    this.globalObject
                ),
                enterFunctionCommand.callee.iValue.scopeChain,
                enterFunctionCommand.thisObject,
                this.globalObject,
                enterFunctionCommand
            )
        );
    },

    _exitFunctionContext: function(exitFunctionContextCommand)
    {
        this.pop();

        this.dependencyCreator.createExitFunctionDependencies(exitFunctionContextCommand.parentFunctionCommand);

        this.globalObject.browser.logExitingFunction();
    },

    _getFormalParameters: function(functionConstruct)
    {
        try
        {
            if(functionConstruct == null)
            {
                debugger;
                this.notifyError("Error when getting formal parameters");
                return;
            }

            var identifiers = [];

            if(functionConstruct.params == null) { return identifiers; }

            for(var i = 0; i < functionConstruct.params.length; i++)
            {
                var param = functionConstruct.params[i];
                var identifier = new fcModel.Identifier(param.name, new fcModel.fcValue(undefined, undefined, param), param, this.globalObject);
                identifier.isFunctionFormalParameter = true;
                identifiers.push(identifier);
            }

            return identifiers;
        }
        catch(e) { debugger; }
    },

    _getSentArgumentValues: function(callCommand)
    {
        if(callCommand.isApply) { return this._getArgumentValuesFromApply(callCommand); }
        else if (callCommand.isCall) { return this._getArgumentValuesFromCall(callCommand); }
        else if (callCommand.isExecuteCallbackCommand()) { return callCommand.arguments;}
        else { return this._getArgumentValuesFromStandard(callCommand); }
    },

    _getArgumentValuesFromApply: function(callCommand)
    {
        var args = callCommand.codeConstruct.arguments;

        if(args == null) { return []; }

        var secondArgument = args[1];

        if(secondArgument == null) { return []; }

        var secondArgValue = this.getExpressionValue(secondArgument);

        return secondArgValue.jsValue || [];
    },

    _getArgumentValuesFromCall: function(callCommand)
    {
        var values = [];
        var args = callCommand.codeConstruct.arguments;

        if(args == null) { return values; }

        for(var i = 1; i < args.length; i++) { values.push(this.getExpressionValue(args[i]));}

        return values;
    },

    _getArgumentValuesFromStandard: function(callCommand)
    {
        var args = callCommand.codeConstruct.arguments;

        if(args == null) { return []; }

        return this.getExpressionsValues(args);
    },

    _evalStartWithCommand: function(startWithCommand)
    {
        this.activeContext.pushToScopeChain(fcSimulator.VariableObject.liftToVariableObject(this.getExpressionValue(startWithCommand.codeConstruct.object)));
    },

    _evalEndWithCommand: function(endWithCommand)
    {
        this.activeContext.popFromScopeChain();
    },


    notifyError: function(message) { debugger; fcSimulator.ExecutionContext.notifyError(message); }
};
/*************************************************************************************/
}});