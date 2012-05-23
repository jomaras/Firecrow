/**
 * Created by Jomaras.
 * Date: 08.03.12.@19:13
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
const ValueTypeHelper = Firecrow.ValueTypeHelper;
const ASTHelper = Firecrow.ASTHelper;
const fcSimulator = Firecrow.Interpreter.Simulator;
const fcCommands = Firecrow.Interpreter.Commands;
const fcModel = Firecrow.Interpreter.Model;

Firecrow.Interpreter.Simulator.ExecutionContext = function(variableObject, scopeChain, thisObject, globalObject, contextCreationCommand)
{
    this.variableObject = variableObject || globalObject.globalVariableObject;
    this.thisObject = thisObject || globalObject;

    this.globalObject = globalObject;

    this.scopeChain = ValueTypeHelper.createArrayCopy(scopeChain);
    this.scopeChain.push(this.variableObject);

    this.id = fcSimulator.ExecutionContext.LAST_INSTANCE_ID++;
    this.contextCreationCommand = contextCreationCommand;

    this.codeConstructValuesMapping = [];
};

Firecrow.Interpreter.Simulator.ExecutionContext.prototype =
{
    getCodeConstructValue: function(codeConstruct)
    {
        try
        {
            var codeConstructValueMapping = ValueTypeHelper.findInArray
            (
                this.codeConstructValuesMapping,
                codeConstruct,
                function(mapping, codeConstruct)
                {
                    return mapping.codeConstruct == codeConstruct;
                }
            );

            return codeConstructValueMapping != null ? codeConstructValueMapping.value
                                                     : null;
        }
        catch(e) { alert("Error when getting codeConstruct value - ExecutionContextStack.js:" + e);}
    },

    setCodeConstructValue: function(codeConstruct, value)
    {
        try
        {
            var codeConstructValueMapping = ValueTypeHelper.findInArray
            (
                this.codeConstructValuesMapping,
                codeConstruct,
                function(mapping, codeConstruct)
                {
                    return mapping.codeConstruct == codeConstruct;
                }
            );

            if(codeConstructValueMapping == null)
            {
                this.codeConstructValuesMapping.push
                ({
                    codeConstruct: codeConstruct,
                    value : value
                });
            }
            else
            {
                codeConstructValueMapping.value = value;
            }
        }
        catch(e) { alert("Error when setting codeConstruct value - ExecutionContextStack.js:" + e);}
    },

    registerIdentifier: function(identifier)
    {
       try
       {
           if(!ValueTypeHelper.isOfType(identifier, fcModel.Identifier)) { alert("ExecutionContextStack - when registering identifier the argument has to be an identifier"); }

           this.variableObject.__FIRECROW_INTERNAL__.registerIdentifier(identifier);
       }
       catch(e) { alert("ExecutionContextStack - ExecutionContext error when registering identifier:" + e); }
    },

    pushToScopeChain: function(variableObject)
    {
        try
        {
            this.scopeChain.push(variableObject);
        }
        catch(e) { alert("ExecutionContext - error when pushing to scope chain: " + e); }
    },

    popFromScopeChain: function()
    {
        try
        {
            return this.scopeChain.pop();
        }
        catch(e) { alert("ExecutionContext - error when popping from scope chain: " + e); }
    }
};

Firecrow.Interpreter.Simulator.ExecutionContext.createGlobalExecutionContext = function(globalObject)
{
    return new Firecrow.Interpreter.Simulator.ExecutionContext
    (
        globalObject,
        [],
        globalObject,
        globalObject
    );
};

Firecrow.Interpreter.Simulator.ExecutionContext.LAST_INSTANCE_ID = 0;

Firecrow.Interpreter.Simulator.ExecutionContextStack = function(globalObject)
{
    this.globalObject = globalObject;
    this.stack = [];
    this.push(Firecrow.Interpreter.Simulator.ExecutionContext.createGlobalExecutionContext(globalObject));
    this.evaluator = new Firecrow.Interpreter.Simulator.Evaluator(this, globalObject);
    this.evaluator.registerExceptionCallback(function(exceptionInfo)
    {
        this._callExceptionCallbacks(exceptionInfo);
    }, this);

    this.exceptionCallbacks = [];
};

Firecrow.Interpreter.Simulator.ExecutionContextStack.prototype =
{
    activeContext: null,

    executeCommand: function(command)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(command, fcCommands.Command)) { alert("ExecutionContextStack - argument must be a command"); return; }

                 if (command.isEnterFunctionContextCommand()) { this._enterFunctionContext(command); }
            else if (command.isExitFunctionContextCommand()) { this._exitFunctionContext(command); }
            else if (command.isStartWithStatementCommand()) { this._evaluateStartWithCommand(command); }
            else if (command.isEndWithStatementCommand()) { this._evaluateEndWithCommand(command); }
            else if (command.isForStatementCommand() || command.isWhileStatementCommand()
                 ||  command.isDoWhileStatementCommand() || command.isForUpdateStatementCommand()) {}
            else if (command.isIfStatementCommand()) {}
            else if (command.isEvalConditionalExpressionBodyCommand()) {}
            else if (command.isEvalBreakCommand() || command.isEvalContinueCommand()){}
            else if (command.isStartSwitchStatementCommand() || command.isEndSwitchStatementCommand() || command.isCaseCommand()) {}
            else if (command.isStartTryStatementCommand() || command.isEndTryStatementCommand() || command.isEvalThrowExpressionCommand()) {}
            else if (command.isEvalNewExpressionCommand()) {}
            else if (command.isStartLogicalExpressionCommand() || command.isEndLogicalExpressionCommand()) {}
            else if (command.isCallInternalConstructorCommand()) { }
            else if (command.isCallCallbackMethodCommand()) {}
            else if (command.isExecuteCallbackCommand()) {}
            else
            {
                this.evaluator.evaluateCommand(command);
            }
        }
        catch(e) { alert("ExecutionContextStack - error when executing command: " + e); }
    },

    _enterFunctionContext: function(enterFunctionContextCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(enterFunctionContextCommand, fcCommands.Command) || !enterFunctionContextCommand.isEnterFunctionContextCommand()) { alert("ExecutionContextStack - argument must be a enterFunctionContext command"); return; }

            var functionConstruct = enterFunctionContextCommand.callee.__FIRECROW_INTERNAL__.codeConstruct;

            this.push
            (
                new fcSimulator.ExecutionContext
                (
                    fcSimulator.VariableObject.createFunctionVariableObject
                    (
                        functionConstruct.id != null ? new fcModel.Identifier(functionConstruct.id.name, enterFunctionContextCommand.callee, functionConstruct)
                                                     : null,
                        this._getFormalParameters(functionConstruct),
                        enterFunctionContextCommand.callee,
                        this._getSentArgumentValues(enterFunctionContextCommand.parentFunctionCommand),
                        enterFunctionContextCommand.parentFunctionCommand
                    ),
                    enterFunctionContextCommand.callee.__FIRECROW_INTERNAL__.scopeChain,
                    enterFunctionContextCommand.thisObject,
                    this.globalObject,
                    enterFunctionContextCommand
                )
            );
        }
        catch(e) { alert("ExecutionContextStack - Error when entering function context: " + e); }
    },

    _getFormalParameters: function(functionConstruct)
    {
        try
        {
            return functionConstruct.params.map(function(param)
            {
                return new fcModel.Identifier(param.name, undefined, param);
            });
        }
        catch(e) { alert("ExecutionContextStack - error when getting formal function parameters: " + e); }
    },

    _getSentArgumentValues: function(callExpressionCommand)
    {
        var values = [];

        try
        {
            if(!ValueTypeHelper.isOfType(callExpressionCommand, fcCommands.Command) || (!callExpressionCommand.isEvalCallExpressionCommand() && !callExpressionCommand.isEvalNewExpressionCommand() && !callExpressionCommand.isExecuteCallbackCommand())) { alert("ExecutionContextStack - argument must be a call or new Expression command"); return; }

            if(callExpressionCommand.isEvalCallExpressionCommand() || callExpressionCommand.isEvalNewExpressionCommand())
            {
                var arguments = callExpressionCommand.codeConstruct.arguments;

                if(arguments != null)
                {
                    if(callExpressionCommand.isApply)
                    {
                        var secondArgument = callExpressionCommand.codeConstruct.arguments[1];

                        if(secondArgument != null)
                        {
                            var secondArgValue = this.getExpressionValue(secondArgument);

                            if(ValueTypeHelper.isArray(secondArgValue))
                            {
                                secondArgValue.forEach(function(item)
                                {
                                    values.push(item);
                                }, this);
                            }
                        }
                    }
                    else if (callExpressionCommand.isCall)
                    {
                        for(var i = 1; i < arguments.length; i++)
                        {
                            values.push(this.getExpressionValue(arguments[i]));
                        }
                    }
                    else
                    {
                        arguments.forEach(function(argument)
                        {
                            values.push(this.getExpressionValue(argument));
                        }, this);
                    }
                }
            }
            else if (callExpressionCommand.isExecuteCallbackCommand()) { values = callExpressionCommand.argumentValues; }
        }
        catch(e) { alert("ExecutionContextStack - Error when getting sent arguments"); }

        return values;
    },

    _exitFunctionContext: function(exitFunctionContextCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(exitFunctionContextCommand, fcCommands.Command) || !exitFunctionContextCommand.isExitFunctionContextCommand()) { alert("ExecutionContextStack - argument must be a exitFunctionContext command"); return; }

            this.pop();
        }
        catch(e) { alert("ExecutionContextStack - Error when exiting function context: " + e); }
    },

    _evaluateStartWithCommand: function(startWithCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(startWithCommand, fcCommands.Command) || !startWithCommand.isStartWithStatementCommand()) { alert("ExecutionContextStack - argument must be a start with command"); return; }

            var withObject = this.getExpressionValue(startWithCommand.codeConstruct.object);

            if(withObject == null) { alert("ExecutionContextStack - with hast to be an object!"); return; }

            this.activeContext.pushToScopeChain(fcSimulator.VariableObject.liftToVariableObject(withObject));
        }
        catch(e) { alert("ExecutionContextStack - error when evaluating start with command: " + e); }
    },

    _evaluateEndWithCommand: function(endWithCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(endWithCommand, fcCommands.Command) || !endWithCommand.isEndWithStatementCommand()) { alert("ExecutionContextStack - argument must be an end with command"); return; }

            this.activeContext.popFromScopeChain();
        }
        catch(e) { alert("ExecutionContextStack - error when evaluating start with command: " + e); }
    },

    push: function(executionContext)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(executionContext, Firecrow.Interpreter.Simulator.ExecutionContext)) { alert("ExecutionContextStack: argument is not ExecutionContext!"); return; }

            this.stack.push(executionContext);

            this.activeContext = executionContext;
        }
        catch(e) { alert("ExecutionContextStack: Error when pushing: " + e); }
    },

    pop: function()
    {
        try
        {
            if(this.stack.length == 0) { alert("ExecutionContextStack: Can not pop an empty stack"); return; }

            this.stack.pop();

            this.activeContext = this.stack[this.stack.length - 1];
        }
        catch(e) { alert("ExecutionContextStack: Error when popping:" + e);}
    },

    registerIdentifier: function(variableDeclarator)
    {
        try
        {
            if(!ASTHelper.isVariableDeclarator(variableDeclarator)) { alert("ExecutionContextStack: When registering an identifier, the argument has to be variable declarator"); }
            if(this.activeContext == null) { alert("ExecutionContextStack: ActiveContext must not be null when registering identifier"); return; }

            this.activeContext.registerIdentifier(new fcModel.Identifier(variableDeclarator.id.name, undefined, variableDeclarator));
        }
        catch(e) { alert("ExecutionContextStack - error when registering identifier: " + e); }
    },

    registerFunctionDeclaration: function(functionDeclaration)
    {
        try
        {
            if(!ASTHelper.isFunctionDeclaration(functionDeclaration)) { alert("ExecutionContextStack: When registering a function, the argument has to be a function declaration"); }
            if(this.activeContext == null) { alert("ExecutionContextStack: ActiveContext must not be null when registering function declaration"); return; }

            this.activeContext.registerIdentifier(new fcModel.Identifier(functionDeclaration.id.name, this.createFunctionInCurrentContext(functionDeclaration), functionDeclaration));
        }
        catch(e)
        {
            alert("ExecutionContextStack - error when registering function declaration: " + e);
        }
    },

    getIdentifierValue: function(identifierName)
    {
        try
        {
            for(var i = this.stack.length - 1; i >= 0; i--)
            {
                var scopeChain = this.stack[i].scopeChain;

                for(var j = scopeChain.length - 1; j >= 0; j--)
                {
                    var variableObject = scopeChain[j];

                    var identifier = variableObject.__FIRECROW_INTERNAL__.getIdentifier(identifierName);

                    if(identifier != null)
                    {
                        return identifier.value;
                    }
                }
            }
        }
        catch(e)
        {
            alert("ExecutionContextStack: Error when getting Identifier value: " + e);
        }
    },

    setIdentifierValue: function(identifierName, value, setCodeConstruct)
    {
        try
        {
            for(var i = this.stack.length - 1; i >= 0; i--)
            {
                var scopeChain = this.stack[i].scopeChain;

                for(var j = scopeChain.length - 1; j >= 0; j--)
                {
                    var variableObject = scopeChain[j];

                    var identifier = variableObject.__FIRECROW_INTERNAL__.getIdentifier(identifierName);

                    if(identifier != null)
                    {
                        identifier.setValue(value, setCodeConstruct);

                        if(variableObject != this.globalObject && !ValueTypeHelper.isOfType(variableObject, fcSimulator.VariableObject))
                        {
                            variableObject[identifierName] = value;
                        }

                        return;
                    }
                }
            }

            var globalExecutionContext = this.stack[0];

            if(globalExecutionContext == null) { alert("ExecutionContextStack: global execution context can not be null!"); return; }

            globalExecutionContext.registerIdentifier(new fcModel.Identifier(identifierName, value, setCodeConstruct));
        }
        catch(e) { alert("ExecutionContextStack: Error when setting Identifier value: " + e); }
    },

    deleteIdentifier: function(identifierName)
    {
        try
        {
            for(var i = this.stack.length - 1; i >= 0; i--)
            {
                var scopeChain = this.stack[i].scopeChain;

                for(var j = scopeChain.length - 1; j >= 0; j--)
                {
                    var variableObject = scopeChain[j];

                    var identifier = variableObject.__FIRECROW_INTERNAL__.getIdentifier(identifierName);

                    if(identifier != null) { variableObject.deleteIdentifier(identifier.name); }
                }
            }
        }
        catch(e)
        {
            alert("ExecutionContextStack: Error when deleting Identifier: " + e);
        }
    },

    setExpressionValue: function(codeConstruct, value)
    {
        try
        {
            if(this.activeContext == null) { alert("ExecutionContextStack: ActiveContext must not be null when setting expression value"); return; }

            this.activeContext.setCodeConstructValue(codeConstruct, value);
        }
        catch(e) { alert("ExecutionContextStack - error when setting expression value: " + e); }
    },

    setExpressionValueInPreviousContext: function(codeConstruct, value)
    {
        try
        {
            var previousExecutionContext = this.stack[this.stack.length - 2];

            if(previousExecutionContext == null) { alert("ExecutionContextStack - There is no previous context!"); return; }

            previousExecutionContext.setCodeConstructValue(codeConstruct, value);
        }
        catch(e) { alert("ExecutionContextStack - error when setting expression value in previous context: " + e); }
    },

    getExpressionValue: function(codeConstruct)
    {
        try
        {
            if(this.activeContext == null) { alert("ExecutionContextStack: ActiveContext must not be null when setting expression value"); return; }

            return this.activeContext.getCodeConstructValue(codeConstruct);
        }
        catch(e) { alert("ExecutionContextStack - error when setting expression value: " + e); }
    },

    getBaseObject: function(codeConstruct)
    {
        if(ASTHelper.isIdentifier(codeConstruct) || ASTHelper.isFunctionExpression(codeConstruct)) { return this.globalObject; }
        else if (ASTHelper.isMemberExpression(codeConstruct)) { return this.getExpressionValue(codeConstruct.object); }
        else if (ASTHelper.isCallExpression(codeConstruct)) { return this.getExpressionValue(codeConstruct.callee); }
        else { alert("ExecutionContextStack - not handling getting base object on other expressions"); return this.globalObject; }
    },

    createFunctionInCurrentContext: function(functionCodeConstruct)
    {
        try
        {
            return fcSimulator.InternalExecutor.createFunction(this.globalObject, this.activeContext.scopeChain, functionCodeConstruct)
        }
        catch(e) { alert("ExecutionContextStack - error when creating function: " + e);}
    },

    createObjectInCurrentContext: function(constructorFunction, creationCodeConstruct)
    {
        try
        {
            return fcSimulator.InternalExecutor.createObject(this.globalObject, constructorFunction, creationCodeConstruct);
        }
        catch(e) { alert("ExecutionContextStack - error when creating object:" + e); }
    },

    createArrayInCurrentContext: function(creationCodeConstruct)
    {
        try
        {
            return fcSimulator.InternalExecutor.createArray(this.globalObject, creationCodeConstruct);
        }
        catch(e) { alert("ExecutionContextStack - error when creating array in current context: " + e); }
    },

    registerExceptionCallback: function(callback, thisObject)
    {
        if(!ValueTypeHelper.isOfType(callback, Function)) { alert("ExecutionContextStack - exception callback has to be a function!"); return; }

        this.exceptionCallbacks.push({callback: callback, thisObject: thisObject || this});
    },

    _callExceptionCallbacks: function(exceptionInfo)
    {
        this.exceptionCallbacks.forEach(function(callbackObject)
        {
            callbackObject.callback.call(callbackObject.thisObject, exceptionInfo);
        });
    }
};
}});