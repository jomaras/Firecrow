/**
 * Created by Josip Maras.
 * User: jomaras
 * Date: 06.03.12.
 * Time: 13:56
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ASTHelper = Firecrow.ASTHelper;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

var fcCommands = Firecrow.Interpreter.Commands;

Firecrow.Interpreter.Commands.CommandGenerator =
{
    generateCommands: function(program)
    {
        try
        {
            var executionCommands = [];
            var declarationCommands = [];
            var commandType = fcCommands.Command.COMMAND_TYPE;

            ASTHelper.traverseDirectSourceElements
            (
                program,
                function(sourceElement)
                {
                    ValueTypeHelper.pushAll(declarationCommands, fcCommands.CommandGenerator.generateDeclarationCommands(sourceElement));
                },
                true
            );

            ASTHelper.traverseDirectSourceElements
            (
                program,
                function(sourceElement)
                {
                    ValueTypeHelper.pushAll(executionCommands, fcCommands.CommandGenerator.generateExecutionCommands(sourceElement, null));
                },
                false
            );

            return ValueTypeHelper.concatArray(declarationCommands, executionCommands);
        }
        catch(e) { this.notifyError("Error while generating commands: " + e);}
    },

    generateDeclarationCommands: function(sourceElement, parentFunctionCommand)
    {
        var declarationCommands = [];

        var Command = fcCommands.Command;
        var CommandType = fcCommands.Command.COMMAND_TYPE;

        if(ASTHelper.isVariableDeclaration(sourceElement))
        {
            sourceElement.declarations.forEach(function(variableDeclarator)
            {
                declarationCommands.push(new Command(variableDeclarator, CommandType.DeclareVariable, parentFunctionCommand));
            });
        }
        else if (ASTHelper.isFunctionDeclaration(sourceElement))
        {
            declarationCommands.push(new Command(sourceElement, CommandType.DeclareFunction, parentFunctionCommand));
        }
        else if (ASTHelper.isForStatement(sourceElement))
        {
            if(ASTHelper.isVariableDeclaration(sourceElement.init))
            {
                sourceElement.init.declarations.forEach(function(variableDeclarator)
                {
                    declarationCommands.push(new Command(variableDeclarator, CommandType.DeclareVariable, parentFunctionCommand));
                });
            }
        }
        else if(ASTHelper.isForInStatement(sourceElement))
        {
            if(ASTHelper.isVariableDeclaration(sourceElement.left))
            {
                sourceElement.left.declarations.forEach(function(variableDeclarator)
                {
                    declarationCommands.push(new Command(variableDeclarator, CommandType.DeclareVariable, parentFunctionCommand));
                });
            }
        }

        return declarationCommands;
    },

    generateExecutionCommands: function(sourceElement, parentFunctionCommand)
    {
             if (ASTHelper.isExpressionStatement(sourceElement)) { return this.generateExpressionStatementExecutionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isBlockStatement(sourceElement)) { return this.generateBlockStatementExecutionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isVariableDeclaration(sourceElement)) { return this.generateVariableDeclarationExecutionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isWhileStatement(sourceElement)) { return this.generateWhileStatementExecutionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isDoWhileStatement(sourceElement)) { return this.generateDoWhileStatementExecutionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isForStatement(sourceElement)) { return this.generateForStatementExecutionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isForInStatement(sourceElement)) { return this.generateForInStatementExecutionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isIfStatement(sourceElement)) { return this.generateIfStatementExecutionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isReturnStatement(sourceElement)) { return this.generateReturnStatementExecutionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isWithStatement(sourceElement)) { return this.generateWithStatementExecutionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isSwitchStatement(sourceElement)) { return this.generateSwitchStatementExecutionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isBreakStatement(sourceElement)) { return this.generateBreakStatementExecutionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isContinueStatement(sourceElement)) { return this.generateContinueStatementExecutionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isTryStatement(sourceElement)) { return this.generateTryStatementExecutionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isThrowStatement(sourceElement)) { return this.generateThrowStatementExecutionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isLetStatement(sourceElement)) { return this.generateLetStatementExecutionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isLabeledStatement(sourceElement)) { return this.generateLabeledStatementExecutionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isFunctionDeclaration(sourceElement)) { return []; }
        else if (ASTHelper.isEmptyStatement(sourceElement)) { return []; }

        else { this.notifyError("Unhandled source element when generating execution command: " + sourceElement.type); return []; }
    },

    generateExpressionStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        return this.generateExpressionCommands(sourceElement.expression, parentFunctionCommand);
    },

    generateBlockStatementExecutionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];
        var body = sourceElement.body;

        for(var i = 0, length = body.length; i < length; i++)
        {
            ValueTypeHelper.pushAll(commands, this.generateExecutionCommands(body[i], parentFunctionCommand))
        }

        return commands;
    },

    generateVariableDeclarationExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        sourceElement.declarations.forEach(function(variableDeclarator)
        {
            if(variableDeclarator.init != null)
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(variableDeclarator.init, parentFunctionCommand));
                commands.push(fcCommands.Command.createAssignmentCommand(variableDeclarator, parentFunctionCommand));
            }
        }, this);

        return commands;
    },

    generateWhileStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.test, parentFunctionCommand));
        commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.WhileStatement, parentFunctionCommand));

        return commands;
    },

    generateDoWhileStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        ValueTypeHelper.pushAll(commands, fcCommands.CommandGenerator.generateExecutionCommands(sourceElement.body, parentFunctionCommand));
        ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.test, parentFunctionCommand));

        commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.DoWhileStatement, parentFunctionCommand));

        return commands;
    },

    generateForStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        if(sourceElement.init != null)
        {
            if(ASTHelper.isVariableDeclaration(sourceElement.init))
            {
                ValueTypeHelper.pushAll(commands, this.generateVariableDeclarationExecutionCommands(sourceElement.init, parentFunctionCommand));
            }
            else if (ASTHelper.isExpression(sourceElement.init))
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.init, parentFunctionCommand));
            }
        }

        if(sourceElement.test != null)
        {
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.test, parentFunctionCommand));
        }

        var forStatementCommand = new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.ForStatement, parentFunctionCommand);
        forStatementCommand.isFirstLoopExecution = true;

        commands.push(forStatementCommand);

        return commands;
    },

    generateForInStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.right, parentFunctionCommand));

        commands.push(fcCommands.Command.createForInWhereCommand(sourceElement, undefined, parentFunctionCommand));

        return commands;
    },

    generateIfStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.test, parentFunctionCommand));

        var ifStatementCommand = new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.IfStatement, parentFunctionCommand);

        var endIfCommand = new fcCommands.Command(ifStatementCommand.codeConstruct, fcCommands.Command.COMMAND_TYPE.EndIf, parentFunctionCommand);
        endIfCommand.startCommand = ifStatementCommand;

        commands.push(ifStatementCommand);
        commands.push(endIfCommand);

        return commands;
    },

    generateReturnStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        if(sourceElement.argument != null)
        {
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.argument, parentFunctionCommand));
        }

        commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalReturnExpression, parentFunctionCommand));

        return commands;
    },

    generateBreakStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalBreak, parentFunctionCommand));

        return commands;
    },

    generateContinueStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalContinue, parentFunctionCommand));

        return commands;
    },

    generateTryStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        var startTryCommand = new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.StartTryStatement, parentFunctionCommand);
        commands.push(startTryCommand);

        ASTHelper.traverseDirectSourceElements
        (
            sourceElement.block,
            function(sourceElement)
            {
                ValueTypeHelper.pushAll(commands, fcCommands.CommandGenerator.generateExecutionCommands(sourceElement, parentFunctionCommand));
            },
            false
        );

        var endTryCommand = new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EndTryStatement, parentFunctionCommand);
        endTryCommand.startCommand = startTryCommand;

        commands.push(endTryCommand);

        return commands;
    },

    generateThrowStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        if(sourceElement.argument != null)
        {
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.argument, parentFunctionCommand));
        }

        commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalThrowExpression, parentFunctionCommand));

        return commands;
    },

    generateWithStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.object, parentFunctionCommand));

        var startWithCommand = new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.StartWithStatement, parentFunctionCommand);

        commands.push(startWithCommand);

        ASTHelper.traverseDirectSourceElements
        (
            sourceElement.body,
            function(sourceElement)
            {
                ValueTypeHelper.pushAll(commands, fcCommands.CommandGenerator.generateExecutionCommands(sourceElement, parentFunctionCommand));
            },
            false
        );

        var endWithCommand = new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EndWithStatement, parentFunctionCommand);
        commands.push(endWithCommand);

        endWithCommand.startCommand = startWithCommand;

        return commands;
    },

    generateSwitchStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        var startSwitchCommand = new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.StartSwitchStatement, parentFunctionCommand);

        startSwitchCommand.caseCommands = [];
        startSwitchCommand.hasBeenMatched = false;

        ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.discriminant, parentFunctionCommand));

        commands.push(startSwitchCommand);

        sourceElement.cases.forEach(function(caseElement)
        {
            if(caseElement.test != null)
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(caseElement.test, parentFunctionCommand));
            }

            var caseCommand = new fcCommands.Command(caseElement, fcCommands.Command.COMMAND_TYPE.Case, parentFunctionCommand);

            caseCommand.parent = startSwitchCommand;
            startSwitchCommand.caseCommands.push(caseCommand);

            commands.push(caseCommand);
        }, this);

        var endSwitchCommand = new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EndSwitchStatement, parentFunctionCommand);
        endSwitchCommand.startCommand = startSwitchCommand;

        commands.push(endSwitchCommand);

        return commands;
    },

    generateLetStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        this.notifyError("Let statement not yet handled");
        return [];
    },

    generateLabeledStatementExecutionCommands: function (labelElement, parentFunctionCommand)
    {
        return [new fcCommands.Command(labelElement, fcCommands.Command.COMMAND_TYPE.Label, parentFunctionCommand)];
    },

    generateFunctionExecutionCommands: function(callExpressionCommand, functionObject, thisObject)
    {
        try
        {
            var commands = [];

            if(functionObject == null) { this.notifyError("function object can not be null when generating commands for function execution!"); return commands; }

            if(functionObject.isInternalFunction && !callExpressionCommand.isCall && !callExpressionCommand.isApply)
            {
                return this._generateInternalFunctionExecutionCommands(callExpressionCommand, functionObject, thisObject);
            }
            else if(functionObject.isInternalFunction && (callExpressionCommand.isCall || callExpressionCommand.isApply))
            {
                return this._generateInternalFunctionExecutionCallApplyCommands(callExpressionCommand, functionObject, thisObject);
            }

            var enterFunctionContextCommand = fcCommands.Command.createEnterFunctionContextCommand(functionObject, thisObject, callExpressionCommand);
            var exitFunctionContextCommand = fcCommands.Command.createExitFunctionContextCommand(functionObject, callExpressionCommand);

            commands.push(enterFunctionContextCommand);
            callExpressionCommand.exitFunctionContextCommand = exitFunctionContextCommand;
            exitFunctionContextCommand.callExpressionCommand = callExpressionCommand;

            var functionConstruct = functionObject.codeConstruct;

            ASTHelper.traverseDirectSourceElements
            (
                functionConstruct.body,
                function(sourceElement)
                {
                    ValueTypeHelper.pushAll
                    (
                        commands,
                        fcCommands.CommandGenerator.generateDeclarationCommands(sourceElement, callExpressionCommand)
                    );
                },
                true
            );

            ASTHelper.traverseDirectSourceElements
            (
                functionConstruct.body,
                function(sourceElement)
                {
                    ValueTypeHelper.pushAll
                    (
                        commands,
                        fcCommands.CommandGenerator.generateExecutionCommands(sourceElement, callExpressionCommand)
                    );
                },
                false
            );

            commands.push(exitFunctionContextCommand);

            return commands;
        }
        catch (e)
        {
            this.notifyError("An error occurred when generating function execution commands: " + e + " " + callExpressionCommand.codeConstruct.loc.source);
        }
    },

    _generateInternalFunctionExecutionCommands: function(callExpressionCommand, functionObject, thisObject)
    {
        var commands = [];

        if(functionObject == null) { this.notifyError("function object can not be null when generating commands for internal function execution!"); return commands; }
        if(!functionObject.isInternalFunction) { this.notifyError("function must be an internal function"); return commands; }

        var command = null;

        if (callExpressionCommand.isEvalNewExpressionCommand())
        {
            command = fcCommands.Command.createCallInternalConstructorCommand
            (
                callExpressionCommand.codeConstruct,
                functionObject,
                callExpressionCommand.parentFunctionCommand
            );
        }
        else
        {
            command = fcCommands.Command.createCallInternalFunctionCommand
            (
                callExpressionCommand.codeConstruct,
                functionObject,
                thisObject,
                callExpressionCommand.parentFunctionCommand,
                callExpressionCommand
            );
        }

        commands.push(command);

        return commands;
    },

    _generateInternalFunctionExecutionCallApplyCommands: function(callExpressionCommand, functionObject, thisObject)
    {
       var command = fcCommands.Command.createCallInternalFunctionCommand
       (
           callExpressionCommand.codeConstruct,
           functionObject,
           thisObject,
           callExpressionCommand.parentFunctionCommand
       );

       command.isCall = callExpressionCommand.isCall;
       command.isApply = callExpressionCommand.isApply;

       return [command];
    },

    generateCallbackFunctionExecutionCommands: function(callbackCommand)
    {
        var commands = [];

        var argumentGroups = callbackCommand.callbackArgumentGroups;

        if(argumentGroups == null) { return commands; }

        callbackCommand.intermediateResults = [];
        callbackCommand.childCommands = [];

        for(var i = 0, length = argumentGroups.length; i < length; i++)
        {
            var executeCallbackCommand = fcCommands.Command.createExecuteCallbackCommand(callbackCommand, argumentGroups[i], i);
            executeCallbackCommand.parentInitCallbackCommand = callbackCommand;
            callbackCommand.childCommands.push(executeCallbackCommand);

            commands.push(executeCallbackCommand);

            ValueTypeHelper.pushAll(commands, this.generateFunctionExecutionCommands(executeCallbackCommand, callbackCommand.callbackFunction, callbackCommand.thisObject));

            var evalCallbackCommand =  new fcCommands.Command
            (
                callbackCommand.callbackFunction.codeConstruct,
                fcCommands.Command.COMMAND_TYPE.EvalCallbackFunction,
                callbackCommand
            );

            evalCallbackCommand.parentInitCallbackCommand = callbackCommand;
            evalCallbackCommand.thisObject = executeCallbackCommand.thisObject;
            evalCallbackCommand.originatingObject = executeCallbackCommand.originatingObject;
            evalCallbackCommand.targetObject = executeCallbackCommand.targetObject;
            evalCallbackCommand.executeCallbackCommand = executeCallbackCommand;

            if(i == length - 1)
            {
                evalCallbackCommand.isLastCallbackCommand = true;
                executeCallbackCommand.isLastCallbackCommand = true;
                callbackCommand.lastCallbackCommand = evalCallbackCommand;
            }

            commands.push(evalCallbackCommand);
        }

        return commands;
    },

    generateIfStatementBodyCommands: function(ifStatementCommand, conditionEvaluationResult, parentFunctionCommand)
    {
        var commands = [];

        if(conditionEvaluationResult)
        {
            ASTHelper.traverseDirectSourceElements
            (
                ifStatementCommand.codeConstruct.consequent,
                function(sourceElement)
                {
                    ValueTypeHelper.pushAll(commands, fcCommands.CommandGenerator.generateExecutionCommands(sourceElement, parentFunctionCommand));
                },
                false
            );
        }
        else
        {
            if(ifStatementCommand.codeConstruct.alternate != null)
            {
                ASTHelper.traverseDirectSourceElements
                (
                    ifStatementCommand.codeConstruct.alternate,
                    function(sourceElement)
                    {
                        ValueTypeHelper.pushAll(commands, fcCommands.CommandGenerator.generateExecutionCommands(sourceElement, parentFunctionCommand));
                    },
                    false
                );
            }
        }

        return commands;
    },

    generateCaseExecutionCommands: function(caseCommand)
    {
        var commands = [];

        ASTHelper.traverseArrayOfDirectStatements
        (
            caseCommand.codeConstruct.consequent,
            caseCommand.codeConstruct,
            function(sourceElement)
            {
                ValueTypeHelper.pushAll(commands, fcCommands.CommandGenerator.generateExecutionCommands(sourceElement, caseCommand.parentFunctionCommand));
            },
            false
        );

        return commands;
    },

    generateCatchStatementExecutionCommands: function(tryCommand, exceptionArgument, throwingCommand)
    {
        var commands = [];

        var tryStatement = tryCommand.codeConstruct;

        var handlers = tryStatement.handlers || (ValueTypeHelper.isArray(tryStatement.handler) ? tryStatement.handler : [tryStatement.handler]);

        if(handlers.length > 1) { this.notifyError("Not handling more than 1 catch"); return commands; }

        var catchElement = handlers[0];

        var startCatchCommand = new fcCommands.Command(catchElement, fcCommands.Command.COMMAND_TYPE.StartCatchStatement, tryCommand.parentFunctionCommand);
        startCatchCommand.throwingCommand = throwingCommand;

        commands.push(startCatchCommand);

        commands[0].exceptionArgument = exceptionArgument;

        ASTHelper.traverseDirectSourceElements
        (
            catchElement.body,
            function(sourceElement)
            {
                ValueTypeHelper.pushAll(commands, fcCommands.CommandGenerator.generateExecutionCommands
                (
                    sourceElement,
                    tryCommand.parentFunctionCommand
                ));
            },
            false
        );

        var endCatchCommand = new fcCommands.Command(catchElement, fcCommands.Command.COMMAND_TYPE.EndCatchStatement, tryCommand.parentFunctionCommand);
        endCatchCommand.startCommand = startCatchCommand;

        commands.push(endCatchCommand);

        return commands;
    },

    generateLoopExecutionCommands: function(loopStatementCommand, evaldCondition)
    {
        try
        {
            if(loopStatementCommand.isForStatementCommand()) { return this.generateForBodyExecutionCommands(loopStatementCommand, evaldCondition); }
            else if (loopStatementCommand.isDoWhileStatementCommand()) { return this.generateDoWhileBodyExecutionCommands(loopStatementCommand, evaldCondition); }
            else if (loopStatementCommand.isWhileStatementCommand()) { return this.generateWhileBodyExecutionCommands(loopStatementCommand, evaldCondition); }
            else if (loopStatementCommand.isEvalForInWhereCommand()) { return this.generateForInBodyExecutionCommands(loopStatementCommand, evaldCondition); }
            else { this.notifyError("Unknown loop statement!"); }
        }
        catch(e) { this.notifyError("Error when generating loop execution commands: " + e); }
    },

    generateWhileBodyExecutionCommands: function(whileStatementCommand, evaldCondition)
    {
        var commands = [];

        var endWhileCommand = new fcCommands.Command(whileStatementCommand.codeConstruct, fcCommands.Command.COMMAND_TYPE.EndLoopStatement, whileStatementCommand.parentFunctionCommand);
        endWhileCommand.startCommand = whileStatementCommand;

        if(evaldCondition)
        {
            ASTHelper.traverseDirectSourceElements
            (
                whileStatementCommand.codeConstruct.body,
                function(sourceElement)
                {
                    ValueTypeHelper.pushAll(commands, fcCommands.CommandGenerator.generateExecutionCommands(sourceElement, whileStatementCommand.parentFunctionCommand));
                },
                false
            );

            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(whileStatementCommand.codeConstruct.test, whileStatementCommand.parentFunctionCommand));

            commands.push(endWhileCommand);

            commands.push(new fcCommands.Command(whileStatementCommand.codeConstruct, fcCommands.Command.COMMAND_TYPE.WhileStatement, whileStatementCommand.parentFunctionCommand));
        }
        else
        {
            commands.push(endWhileCommand);
        }

        return commands;
    },

    generateDoWhileBodyExecutionCommands: function(doWhileStatementCommand, evaldCondition)
    {
        var commands = [];

        var endDoWhileCommand = new fcCommands.Command(doWhileStatementCommand.codeConstruct, fcCommands.Command.COMMAND_TYPE.EndLoopStatement, doWhileStatementCommand.parentFunctionCommand);
        endDoWhileCommand.startCommand = doWhileStatementCommand;

        if(evaldCondition)
        {
            ASTHelper.traverseDirectSourceElements
            (
                doWhileStatementCommand.codeConstruct.body,
                function(sourceElement)
                {
                    ValueTypeHelper.pushAll(commands, fcCommands.CommandGenerator.generateExecutionCommands(sourceElement, doWhileStatementCommand.parentFunctionCommand));
                },
                false
            );

            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(doWhileStatementCommand.codeConstruct.test, doWhileStatementCommand.parentFunctionCommand));

            commands.push(endDoWhileCommand);

            commands.push(new fcCommands.Command(doWhileStatementCommand.codeConstruct, fcCommands.Command.COMMAND_TYPE.DoWhileStatement, doWhileStatementCommand.parentFunctionCommand));
        }
        else
        {
            commands.push(endDoWhileCommand);
        }

        return commands;
    },

    generateForBodyExecutionCommands: function(forStatementCommand, evaldCondition)
    {
        var commands = [];
        var forConstruct = forStatementCommand.codeConstruct;

        var endLoopCommand = new fcCommands.Command(forConstruct, fcCommands.Command.COMMAND_TYPE.EndLoopStatement, forStatementCommand.parentFunctionCommand);
        endLoopCommand.startCommand = forStatementCommand;

        if(evaldCondition)
        {
            ASTHelper.traverseDirectSourceElements
            (
                forConstruct.body,
                function(sourceElement)
                {
                    ValueTypeHelper.pushAll(commands, fcCommands.CommandGenerator.generateExecutionCommands(sourceElement, forStatementCommand.parentFunctionCommand));
                },
                false
            );

            commands.push(new fcCommands.Command(forConstruct, fcCommands.Command.COMMAND_TYPE.ForUpdateStatement, forStatementCommand.parentFunctionCommand));

            if(forConstruct.update != null)
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(forConstruct.update, forStatementCommand.parentFunctionCommand));
            }

            if(forConstruct.test != null)
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(forConstruct.test, forStatementCommand.parentFunctionCommand));
            }

            commands.push(endLoopCommand);

            commands.push(new fcCommands.Command(forConstruct, fcCommands.Command.COMMAND_TYPE.ForStatement, forStatementCommand.parentFunctionCommand));
        }
        else
        {
            commands.push(endLoopCommand);
        }

        return commands;
    },

    generateForInBodyExecutionCommands: function(forInCommand)
    {
        var commands = [];

        var endLoopCommand = new fcCommands.Command(forInCommand.codeConstruct, fcCommands.Command.COMMAND_TYPE.EndLoopStatement, forInCommand.parentFunctionCommand);
        endLoopCommand.startCommand = forInCommand;

        if(forInCommand.willBodyBeExecuted)
        {
            ASTHelper.traverseDirectSourceElements
            (
                forInCommand.codeConstruct.body,
                function(sourceElement)
                {
                    ValueTypeHelper.pushAll(commands, fcCommands.CommandGenerator.generateExecutionCommands(sourceElement, forInCommand.parentFunctionCommand));
                },
                false
            );

            commands.push(endLoopCommand);
            commands.push(fcCommands.Command.createForInWhereCommand(forInCommand.codeConstruct, forInCommand.propertyNames, forInCommand.parentFunctionCommand));
        }
        else
        {
            commands.push(endLoopCommand);
        }

        return commands;
    },

    generateExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
             if (ASTHelper.isThisExpression(sourceElement)) { return this.generateThisCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isIdentifier(sourceElement)) { return this.generateIdentifierCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isLiteral(sourceElement)) { return this.generateLiteralCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isArrayExpression(sourceElement)) { return this.generateArrayExpressionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isObjectExpression(sourceElement)) { return this.generateObjectExpressionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isFunctionExpression(sourceElement)) { return this.generateFunctionExpressionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isSequenceExpression(sourceElement)) { return this.generateSequenceExpressionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isUnaryExpression(sourceElement)) { return this.generateUnaryExpressionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isBinaryExpression(sourceElement)) { return this.generateBinaryExpressionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isAssignmentExpression(sourceElement)) { return this.generateAssignmentExpressionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isUpdateExpression(sourceElement)) { return this.generateUpdateExpressionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isLogicalExpression(sourceElement)) { return this.generateLogicalExpressionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isConditionalExpression(sourceElement)) { return this.generateConditionalExpressionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isNewExpression(sourceElement)) { return this.generateNewExpressionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isCallExpression(sourceElement)) { return this.generateCallExpressionCommands(sourceElement, parentFunctionCommand);}
        else if (ASTHelper.isMemberExpression(sourceElement)) { return this.generateMemberExpressionCommands(sourceElement, parentFunctionCommand); }
        else if (ASTHelper.isYieldExpression(sourceElement)
            ||  ASTHelper.isComprehensionExpression(sourceElement)
            ||  ASTHelper.isGeneratorExpression(sourceElement)
            ||  ASTHelper.isLetExpression(sourceElement))
        {
            this.notifyError("Yield, Comprehension, Generator and Let not yet implemented!");
        }
    },

    generateThisCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.ThisExpression, parentFunctionCommand));

        return commands;
    },

    generateIdentifierCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalIdentifier, parentFunctionCommand));

        return commands;
    },

    generateLiteralCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        if(ValueTypeHelper.isObject(sourceElement.value))
        {
            var regExCommand = new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalRegExLiteral, parentFunctionCommand);

            //If it is directly gotten from mdc parser
            if(sourceElement.value.constructor != null && sourceElement.value.constructor.name === "RegExp")
            {
                regExCommand.regExLiteral = sourceElement.value;
            }
            else //over JSON conversion
            {
                regExCommand.regExLiteral = ValueTypeHelper.adjustForRegExBug(sourceElement.value, atob(sourceElement.value.RegExpBase64));
            }

            commands.push(regExCommand);

            return commands;
        }

        commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalLiteral, parentFunctionCommand));

        return commands;
    },

    generateArrayExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        var arrayExpressionCommand = new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.ArrayExpression, parentFunctionCommand);

        commands.push(arrayExpressionCommand);

        var elements = sourceElement.elements;

        if(elements == null || elements.length == 0) { return commands; }

        for(var i = 0, length = elements.length; i < length; i++)
        {
            var item = elements[i];

            if(item != null)
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(item, parentFunctionCommand));
            }

            commands.push(fcCommands.Command.createArrayExpressionItemCommand(item, arrayExpressionCommand, parentFunctionCommand));
        }

        return commands;
    },

    generateObjectExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        var objectExpressionCommand = new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.ObjectExpression, parentFunctionCommand);

        commands.push(objectExpressionCommand);

        var properties = sourceElement.properties;

        if(properties == null || properties.length == 0) { return commands; }

        for(var i = 0, length = properties.length; i < length; i++)
        {
            var property = properties[i];

            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(property.value, parentFunctionCommand));

            if(property.kind == "get" || property.kind == "set") { this.notifyError("Getters and setters not supported!"); }

            commands.push(fcCommands.Command.createObjectPropertyCommand(property, objectExpressionCommand, parentFunctionCommand));
        }

        return commands;
    },

    generateFunctionExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.FunctionExpressionCreation, parentFunctionCommand));

        return commands;
    },

    generateSequenceExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        sourceElement.expressions.forEach(function(expression)
        {
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(expression, parentFunctionCommand));
        }, this);

        commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalSequenceExpression, parentFunctionCommand));

        return commands;
    },

    generateUnaryExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.argument, parentFunctionCommand));

        commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalUnaryExpression, parentFunctionCommand));

        return commands;
    },

    generateBinaryExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.left, parentFunctionCommand));
        commands.push(new fcCommands.Command(sourceElement.left, fcCommands.Command.COMMAND_TYPE.ConvertToPrimitive, parentFunctionCommand));

        ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.right, parentFunctionCommand));
        commands.push(new fcCommands.Command(sourceElement.right, fcCommands.Command.COMMAND_TYPE.ConvertToPrimitive, parentFunctionCommand));

        commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalBinaryExpression, parentFunctionCommand));

        return commands;
    },

    generateAssignmentExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.right, parentFunctionCommand));
        ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.left, parentFunctionCommand));

        commands.push(fcCommands.Command.createAssignmentCommand(sourceElement, parentFunctionCommand));

        return commands;
    },

    generateUpdateExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.argument, parentFunctionCommand));

        commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalUpdateExpression, parentFunctionCommand));

        return commands;
    },

    generateLogicalExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        var startLogicalExpressionCommand = new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.StartEvalLogicalExpression, parentFunctionCommand);

        ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.left, parentFunctionCommand));

        var evalLeft = new fcCommands.Command(sourceElement.left, fcCommands.Command.COMMAND_TYPE.EvalLogicalExpressionItem, parentFunctionCommand);
        evalLeft.parentLogicalExpressionCommand = startLogicalExpressionCommand;
        commands.push(evalLeft);
        startLogicalExpressionCommand.evalLeftCommand = evalLeft;

        ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.right, parentFunctionCommand));

        var evalRight = new fcCommands.Command(sourceElement.right, fcCommands.Command.COMMAND_TYPE.EvalLogicalExpressionItem, parentFunctionCommand);
        evalRight.parentLogicalExpressionCommand = startLogicalExpressionCommand;
        commands.push(evalRight);
        startLogicalExpressionCommand.evalRightCommand = evalRight;

        var endLogicalExpressionCommand = new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EndEvalLogicalExpression, parentFunctionCommand);

        evalLeft.parentEndLogicalExpressionCommand = endLogicalExpressionCommand;
        evalRight.parentEndLogicalExpressionCommand = endLogicalExpressionCommand;

        endLogicalExpressionCommand.startCommand = startLogicalExpressionCommand;
        endLogicalExpressionCommand.executedLogicalItemExpressionCommands = [];

        commands.push(endLogicalExpressionCommand);

        return commands;
    },

    generateConditionalExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.test, parentFunctionCommand));

        commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalConditionalExpressionBody, parentFunctionCommand));

        return commands;
    },

    generateConditionalExpressionEvalBodyCommands: function(executeConditionalExpressionBodyCommand, willConsequentBeExecuted)
    {
        var commands = [];

        var evalConditionalExpressionCommand = new fcCommands.Command(executeConditionalExpressionBodyCommand.codeConstruct, fcCommands.Command.COMMAND_TYPE.EvalConditionalExpression, executeConditionalExpressionBodyCommand.codeConstruct.parentFunctionCommand);

        commands.push(evalConditionalExpressionCommand);

        if(willConsequentBeExecuted)
        {
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(executeConditionalExpressionBodyCommand.codeConstruct.consequent, executeConditionalExpressionBodyCommand.parentFunctionCommand));
            evalConditionalExpressionCommand.body = executeConditionalExpressionBodyCommand.codeConstruct.consequent;
        }
        else
        {
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(executeConditionalExpressionBodyCommand.codeConstruct.alternate, executeConditionalExpressionBodyCommand.parentFunctionCommand));
            evalConditionalExpressionCommand.body = executeConditionalExpressionBodyCommand.codeConstruct.alternate;
        }

        var endConditionalExpressionCommand = new fcCommands.Command(executeConditionalExpressionBodyCommand.codeConstruct, fcCommands.Command.COMMAND_TYPE.EndEvalConditionalExpression, executeConditionalExpressionBodyCommand.codeConstruct.parentFunctionCommand);
        endConditionalExpressionCommand.startCommand = evalConditionalExpressionCommand;

        commands.push(endConditionalExpressionCommand);

        return commands;
    },

    generateNewExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.callee, parentFunctionCommand));

        if(sourceElement.arguments != null)
        {
            sourceElement.arguments.forEach(function(argument)
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(argument, parentFunctionCommand));
            }, this);
        }

        commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalNewExpression, parentFunctionCommand));

        return commands;
    },

    generateCallExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.callee, parentFunctionCommand));

        if(sourceElement.arguments != null)
        {
            sourceElement.arguments.forEach(function(argument)
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(argument, parentFunctionCommand));
            }, this);
        }

        commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalCallExpression, parentFunctionCommand));

        return commands;
    },

    generateMemberExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.object,parentFunctionCommand));

        if(sourceElement.computed)
        {
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.property, parentFunctionCommand));
        }

        var evalMemberExpressionCommand = new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalMemberExpression, parentFunctionCommand);
        var evalMemberPropertyExpressionCommand = new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalMemberExpressionProperty, parentFunctionCommand);

        evalMemberPropertyExpressionCommand.parentMemberExpressionCommand = evalMemberExpressionCommand;

        commands.push(evalMemberPropertyExpressionCommand);
        commands.push(evalMemberExpressionCommand);

        return commands;
    },

    toString: function(commands) { return commands.join("\n"); },

    notifyError: function(message) { debugger; alert("CommandGenerator - " + message); }
};
/*************************************************************************************/
}});