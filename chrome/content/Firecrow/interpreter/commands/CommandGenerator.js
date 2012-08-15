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
                    ValueTypeHelper.pushAll
                    (
                        declarationCommands,
                        fcCommands.CommandGenerator.generateDeclarationCommands(sourceElement)
                    );
                },
                true
            );

            ASTHelper.traverseDirectSourceElements
            (
                program,
                function(sourceElement)
                {
                    ValueTypeHelper.pushAll
                    (
                        executionCommands,
                        fcCommands.CommandGenerator.generateExecutionCommands(sourceElement, null)
                    );
                },
                false
            );

            return declarationCommands.concat(executionCommands);
        }
        catch(e) { this.notifyError("Error while generating commands: " + e);}
    },

    generateDeclarationCommands: function(sourceElement, parentFunctionCommand)
    {
        var declarationCommands = [];

        try
        {
            var Command = fcCommands.Command;
            var commandType = fcCommands.Command.COMMAND_TYPE;

            if(ASTHelper.isVariableDeclaration(sourceElement))
            {
                sourceElement.declarations.forEach(function(variableDeclarator)
                {
                    declarationCommands.push(new Command(variableDeclarator, commandType.DeclareVariable, parentFunctionCommand));
                });
            }
            else if (ASTHelper.isFunctionDeclaration(sourceElement))
            {
                declarationCommands.push(new Command(sourceElement, commandType.DeclareFunction, parentFunctionCommand));
            }
            else if (ASTHelper.isForStatement(sourceElement))
            {
                if(ASTHelper.isVariableDeclaration(sourceElement.init))
                {
                    sourceElement.init.declarations.forEach(function(variableDeclarator)
                    {
                        declarationCommands.push(new Command(variableDeclarator, commandType.DeclareVariable, parentFunctionCommand));
                    });
                }
            }
            else if(ASTHelper.isForInStatement(sourceElement))
            {
                if(ASTHelper.isVariableDeclaration(sourceElement.left))
                {
                    sourceElement.left.declarations.forEach(function(variableDeclarator)
                    {
                        declarationCommands.push(new Command(variableDeclarator, commandType.DeclareVariable, parentFunctionCommand));
                    });
                }
            }
        }
        catch(e)
        {
            this.notifyError("Error while appending declaration commands: " + e);
        }

        return declarationCommands;
    },

    generateExecutionCommands: function(sourceElement, parentFunctionCommand)
    {
        try
        {
            if(ASTHelper.isVariableDeclaration(sourceElement))
            {
                return this.generateVariableDeclarationExecutionCommands(sourceElement, parentFunctionCommand);
            }
            if(ASTHelper.isExpressionStatement(sourceElement))
            {
                return this.generateExpressionStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (ASTHelper.isIfStatement(sourceElement))
            {
                return this.generateIfStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (ASTHelper.isLabeledStatement(sourceElement))
            {
                return this.generateLabeledStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (ASTHelper.isBreakStatement(sourceElement))
            {
                return this.generateBreakStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (ASTHelper.isContinueStatement(sourceElement))
            {
                return this.generateContinueStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (ASTHelper.isWithStatement(sourceElement))
            {
                return this.generateWithStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (ASTHelper.isSwitchStatement(sourceElement))
            {
                return this.generateSwitchStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (ASTHelper.isReturnStatement(sourceElement))
            {
                return this.generateReturnStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (ASTHelper.isThrowStatement(sourceElement))
            {
                return this.generateThrowStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (ASTHelper.isTryStatement(sourceElement))
            {
                return this.generateTryStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (ASTHelper.isWhileStatement(sourceElement))
            {
                return this.generateWhileStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (ASTHelper.isDoWhileStatement(sourceElement))
            {
                return this.generateDoWhileStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (ASTHelper.isForStatement(sourceElement))
            {
                return this.generateForStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (ASTHelper.isForInStatement(sourceElement))
            {
                return this.generateForInStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (ASTHelper.isLetStatement(sourceElement))
            {
                return this.generateLetStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (ASTHelper.isBlockStatement(sourceElement))
            {
                return this.generateBlockStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if(ASTHelper.isFunctionDeclaration(sourceElement)) { return []; }
            else if (ASTHelper.isEmptyStatement(sourceElement)) { return []; }
            else
            {
                this.notifyError("Unhandled source element when generating execution command: " + sourceElement.type);
                return [];
            }
        }
        catch(e) { this.notifyError("Error while generating execution commands:" + e); }
    },

    generateFunctionExecutionCommands: function(callExpressionCommand, functionObject, thisObject)
    {
        try
        {
            var commands = [];

            if(functionObject == null) { this.notifyError("function object can not be null when generating commands for function execution!"); return commands; }

            if(functionObject.fcInternal.isInternalFunction && !callExpressionCommand.isCall && !callExpressionCommand.isApply)
            {
                return this._generateInternalFunctionExecutionCommands(callExpressionCommand, functionObject, thisObject);
            }
            else if(functionObject.fcInternal.isInternalFunction && (callExpressionCommand.isCall || callExpressionCommand.isApply))
            {
                return this._generateInternalFunctionExecutionCallApplyCommands(callExpressionCommand, functionObject, thisObject);
            }

            var enterFunctionContextCommand = fcCommands.Command.createEnterFunctionContextCommand(functionObject, thisObject, callExpressionCommand);
            var exitFunctionContextCommand = fcCommands.Command.createExitFunctionContextCommand(functionObject, callExpressionCommand);

            commands.push(enterFunctionContextCommand);
            callExpressionCommand.exitFunctionContextCommand = exitFunctionContextCommand;
            exitFunctionContextCommand.callExpressionCommand = callExpressionCommand;

            var functionConstruct = functionObject.fcInternal.codeConstruct;

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
        try
        {
            var commands = [];

            if(functionObject == null) { this.notifyError("function object can not be null when generating commands for internal function execution!"); return commands; }
            if(!functionObject.fcInternal.isInternalFunction) { this.notifyError("function must be an internal function"); return commands; }

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
                    callExpressionCommand.parentFunctionCommand
                );
            }

            commands.push(command);

            return commands;
        }
        catch(e) { this.notifyError("CommandGenerator - error when generating internal function execution commands: " + e); }
    },

    _generateInternalFunctionExecutionCallApplyCommands: function(callExpressionCommand, functionObject, thisObject)
    {
       try
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
       }
       catch(e) { this.notifyError("Error when generating internal function execution commands:" + e);; }
    },

    generateCallbackFunctionExecutionCommands: function(callbackCommand)
    {
        try
        {
            var commands = [];

            var argumentGroups = callbackCommand.callbackArgumentGroups;

            if(argumentGroups == null) { return commands; }

            callbackCommand.intermediateResults = [];

            for(var i = 0, length = argumentGroups.length; i < length; i++)
            {
                var executeCallbackCommand = fcCommands.Command.createExecuteCallbackCommand(callbackCommand, argumentGroups[i]);
                executeCallbackCommand.parentInitCallbackCommand = callbackCommand;

                commands.push(executeCallbackCommand);

                ValueTypeHelper.pushAll(commands, this.generateFunctionExecutionCommands(executeCallbackCommand, callbackCommand.callbackFunction, callbackCommand.thisObject));

                var evalCallbackCommand =  new fcCommands.Command
                (
                    callbackCommand.callbackFunction.fcInternal.codeConstruct,
                    fcCommands.Command.COMMAND_TYPE.EvalCallbackFunction,
                    callbackCommand
                );

                evalCallbackCommand.parentInitCallbackCommand = callbackCommand;
                evalCallbackCommand.thisObject = executeCallbackCommand.thisObject;
                evalCallbackCommand.originatingObject = executeCallbackCommand.originatingObject;
                evalCallbackCommand.targetObject = executeCallbackCommand.targetObject;

                if(i == length - 1)
                {
                    evalCallbackCommand.isLastCallbackCommand = true;
                    executeCallbackCommand.isLastCallbackCommand = true;
                }

                commands.push(evalCallbackCommand);
            }

            return commands;
        }
        catch(e) { this.notifyError("CommandGenerator - Error when generating callback function execution commands: " + e); }
    },

    generateVariableDeclarationExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            sourceElement.declarations.forEach(function(variableDeclarator)
            {
                if(!ASTHelper.isIdentifier(variableDeclarator.id))
                {
                    this.notifyError("Variable declarator is not an identifier!");
                    return;
                }

                if(variableDeclarator.init != null)
                {
                    ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(variableDeclarator.init, parentFunctionCommand));
                    commands.push(fcCommands.Command.createAssignmentCommand(variableDeclarator, parentFunctionCommand));
                }
            }, this);
        }
        catch(e) { this.notifyError("Error when generating variable declaration commands:" + e);}

        return commands;
    },

    generateBlockStatementExecutionCommands: function(sourceElement, parentFunctionCommand)
    {
        try
        {
            var commands = [];

            sourceElement.body.forEach(function(statement)
            {
                ValueTypeHelper.pushAll(commands, this.generateExecutionCommands(statement, parentFunctionCommand))
            }, this);


            return commands;
        }
        catch(e) { this.notifyError("Error when generating expression statement commands:" + e);}

        return [];
    },

    generateExpressionStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        try
        {
            return this.generateExpressionCommands(sourceElement.expression, parentFunctionCommand);
        }
        catch(e) { this.notifyError("Error when generating expression statement commands:" + e);}

        return [];
    },

    generateIfStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.test, parentFunctionCommand));
            var ifStatementCommand = new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.IfStatement,
                parentFunctionCommand
            );

            var endIfCommand = new fcCommands.Command(ifStatementCommand.codeConstruct, fcCommands.Command.COMMAND_TYPE.EndIf, parentFunctionCommand);
            endIfCommand.startCommand = ifStatementCommand;

            commands.push(ifStatementCommand);
            commands.push(endIfCommand);
        }
        catch(e) { this.notifyError("Error when generating if statement commands:" + e);}

        return commands;
    },

    generateIfStatementBodyCommands: function(ifStatementCommand, conditionEvaluationResult, parentFunctionCommand)
    {
        var commands = [];

        try
        {
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
        }
        catch(e) { this.notifyError("Error when generating if statement commands:" + e);}

        return commands;
    },

    generateLabeledStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            this.notifyError("Ignoring labeled statements!");
        }
        catch(e) { this.notifyError("Error when generating labeled statement commands:" + e);}

        return commands;
    },

    generateBreakStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(sourceElement.label != null) { this.notifyError("Not handling break with labels!"); return commands; }

            commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalBreak, parentFunctionCommand));
        }
        catch(e) { this.notifyError("Error when generating break statement commands:" + e);}

        return commands;
    },

    generateContinueStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(sourceElement.label != null) { this.notifyError("Not handling continue with labels!"); return commands; }

            commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalContinue, parentFunctionCommand));
        }
        catch(e) { this.notifyError("Error when generating continue statement commands:" + e);}

        return commands;
    },

    generateWithStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
            (
                sourceElement.object,
                parentFunctionCommand
            ));

            commands.push(new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.StartWithStatement,
                parentFunctionCommand
            ));

            ASTHelper.traverseDirectSourceElements
            (
                sourceElement.body,
                function(sourceElement)
                {
                    ValueTypeHelper.pushAll(commands, fcCommands.CommandGenerator.generateExecutionCommands
                    (
                        sourceElement,
                        parentFunctionCommand
                    ));
                },
                false
            );

            commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EndWithStatement, parentFunctionCommand));
        }
        catch(e) { this.notifyError("Error when generating with statement commands:" + e);}

        return commands;
    },

    generateSwitchStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            var startSwitchCommand = new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.StartSwitchStatement,
                parentFunctionCommand
            );

            startSwitchCommand.caseCommands = [];
            startSwitchCommand.hasBeenMatched = false;

            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
            (
                sourceElement.discriminant,
                parentFunctionCommand
            ));

            commands.push(startSwitchCommand);

            sourceElement.cases.forEach(function(caseElement)
            {
                if(caseElement.test != null)
                {
                    ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
                    (
                        caseElement.test,
                        parentFunctionCommand
                    ));
                }

                var caseCommand = new fcCommands.Command
                (
                    caseElement,
                    fcCommands.Command.COMMAND_TYPE.Case,
                    parentFunctionCommand
                );

                caseCommand.parent = startSwitchCommand;
                startSwitchCommand.caseCommands.push(caseCommand);

                commands.push(caseCommand);
            }, this);

            commands.push(new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.EndSwitchStatement,
                parentFunctionCommand
            ));
        }
        catch(e) { this.notifyError("Error when generating switch statement commands:" + e);}

        return commands;
    },

    generateCaseExecutionCommands: function(caseCommand)
    {
        var commands = [];

        try
        {
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
        }
        catch(e) { this.notifyError("Error when generating case commands: " + e); }

        return commands;
    },

    generateReturnStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(sourceElement.argument != null)
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
                (
                    sourceElement.argument,
                    parentFunctionCommand
                ));
            }

            commands.push(new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.EvalReturnExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { this.notifyError("Error when generating return statement commands:" + e);}

        return commands;
    },

    generateThrowStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(sourceElement.argument != null)
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
                (
                    sourceElement.argument,
                    parentFunctionCommand
                ));
            }

            commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalThrowExpression, parentFunctionCommand));
        }
        catch(e) { this.notifyError("Error when generating throw statement commands:" + e);}

        return commands;
    },

    generateTryStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
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
        }
        catch(e) { this.notifyError("Error when generating try statement commands:" + e);}

        return commands;
    },

    generateCatchStatementExecutionCommands: function(tryCommand, exceptionArgument)
    {
        var commands = [];

        try
        {
            var tryStatement = tryCommand.codeConstruct;

            if(tryStatement.handlers.length > 1) { this.notifyError("Not handling more than 1 catch"); return commands; }

            var catchElement = tryStatement.handlers[0];

            commands.push(new fcCommands.Command
            (
                catchElement,
                fcCommands.Command.COMMAND_TYPE.StartCatchStatement,
                tryCommand.parentFunctionCommand
            ));

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

            commands.push(new fcCommands.Command
            (
                catchElement,
                fcCommands.Command.COMMAND_TYPE.EndCatchStatement,
                tryCommand.parentFunctionCommand
            ));
        }
        catch(e) { this.notifyError("Error when generating catch statement commands: " + e); }

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

    generateWhileStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.test, parentFunctionCommand));

            var startLoopCommand = new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.WhileStatement, parentFunctionCommand);
            var endLoopCommand = new fcCommands.Command(sourceElement,fcCommands.Command.COMMAND_TYPE.EndLoopStatement, parentFunctionCommand);

            commands.push(startLoopCommand);
            commands.push(endLoopCommand);
        }
        catch(e) { this.notifyError("Error when generating while statement commands:" + e); }

        return commands;
    },

    generateWhileBodyExecutionCommands: function(whileStatementCommand, evaldCondition)
    {
        var commands = [];

        try
        {
            if(evaldCondition)
            {
                ASTHelper.traverseDirectSourceElements
                (
                    whileStatementCommand.codeConstruct.body,
                    function(sourceElement)
                    {
                        ValueTypeHelper.pushAll(commands, fcCommands.CommandGenerator.generateExecutionCommands
                        (
                            sourceElement,
                            whileStatementCommand.parentFunctionCommand
                        ));
                    },
                    false
                );

                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
                (
                    whileStatementCommand.codeConstruct.test,
                    whileStatementCommand.parentFunctionCommand
                ));

                commands.push(new fcCommands.Command
                (
                    whileStatementCommand.codeConstruct,
                    fcCommands.Command.COMMAND_TYPE.EndLoopStatement,
                    whileStatementCommand.parentFunctionCommand
                ));

                commands.push(new fcCommands.Command
                (
                    whileStatementCommand.codeConstruct,
                    fcCommands.Command.COMMAND_TYPE.WhileStatement,
                    whileStatementCommand.parentFunctionCommand
                ));
            }
        }
        catch(e) { this.notifyError("Error when generating while statement commands:" + e); }

        return commands;
    },

    generateDoWhileStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            ValueTypeHelper.pushAll(commands, fcCommands.CommandGenerator.generateExecutionCommands(sourceElement.body, parentFunctionCommand));
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.test, parentFunctionCommand));

            var startCommand = new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.DoWhileStatement, parentFunctionCommand);
            var endCommand = new fcCommands.Command(sourceElement,fcCommands.Command.COMMAND_TYPE.EndLoopStatement, parentFunctionCommand);
            endCommand.startCommand = startCommand;

            commands.push(startCommand);
            commands.push(endCommand);
        }
        catch(e) { this.notifyError("Error when generating while statement commands:" + e); }

        return commands;
    },

    generateDoWhileBodyExecutionCommands: function(doWhileStatementCommand, evaldCondition)
    {
        var commands = [];

        try
        {
            if(evaldCondition)
            {
                ASTHelper.traverseDirectSourceElements
                (
                    doWhileStatementCommand.codeConstruct.body,
                    function(sourceElement)
                    {
                        ValueTypeHelper.pushAll(commands, fcCommands.CommandGenerator.generateExecutionCommands
                        (
                            sourceElement,
                            doWhileStatementCommand.parentFunctionCommand
                        ));
                    },
                    false
                );

                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
                (
                    doWhileStatementCommand.codeConstruct.test,
                    doWhileStatementCommand.parentFunctionCommand
                ));

                commands.push(new fcCommands.Command
                (
                    doWhileStatementCommand.codeConstruct,
                    fcCommands.Command.COMMAND_TYPE.EndLoopStatement,
                    doWhileStatementCommand.parentFunctionCommand)
                );

                commands.push(new fcCommands.Command
                (
                    doWhileStatementCommand.codeConstruct,
                    fcCommands.Command.COMMAND_TYPE.DoWhileStatement,
                    doWhileStatementCommand.parentFunctionCommand
                ));
            }
        }
        catch(e) { this.notifyError("Error when generating doWhile statement commands:" + e); }

        return commands;
    },

    generateForStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(sourceElement.init != null)
            {
                if(ASTHelper.isVariableDeclaration(sourceElement.init))
                {
                    ValueTypeHelper.pushAll(commands, this.generateVariableDeclarationExecutionCommands
                    (
                        sourceElement.init,
                        parentFunctionCommand
                    ));
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

            var endForStatementCommand = new fcCommands.Command(sourceElement,fcCommands.Command.COMMAND_TYPE.EndLoopStatement,parentFunctionCommand);
            endForStatementCommand.startCommand = forStatementCommand;

            commands.push(forStatementCommand);
            commands.push(endForStatementCommand);
        }
        catch(e) { this.notifyError("Error when generating for statement commands:" + e);}

        return commands;
    },

    generateForBodyExecutionCommands: function(forStatementCommand, evaldCondition)
    {
        var commands = [];

        try
        {
            if(evaldCondition)
            {
                ASTHelper.traverseDirectSourceElements
                (
                    forStatementCommand.codeConstruct.body,
                    function(sourceElement)
                    {
                        ValueTypeHelper.pushAll(commands, fcCommands.CommandGenerator.generateExecutionCommands
                        (
                            sourceElement,
                            forStatementCommand.parentFunctionCommand
                        ));
                    },
                    false
                );

                commands.push(new fcCommands.Command
                (
                    forStatementCommand.codeConstruct,
                    fcCommands.Command.COMMAND_TYPE.ForUpdateStatement,
                    forStatementCommand.parentFunctionCommand
                ));

                if(forStatementCommand.codeConstruct.update != null)
                {
                    ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
                    (
                        forStatementCommand.codeConstruct.update,
                        forStatementCommand.parentFunctionCommand
                    ));
                }

                if(forStatementCommand.codeConstruct.test != null)
                {
                    ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
                    (
                        forStatementCommand.codeConstruct.test,
                        forStatementCommand.parentFunctionCommand
                    ));
                }
                commands.push(new fcCommands.Command
                (
                    forStatementCommand.codeConstruct,
                    fcCommands.Command.COMMAND_TYPE.EndLoopStatement,
                    forStatementCommand.parentFunctionCommand
                ));

                commands.push(new fcCommands.Command
                (
                    forStatementCommand.codeConstruct,
                    fcCommands.Command.COMMAND_TYPE.ForStatement,
                    forStatementCommand.parentFunctionCommand
                ));
            }
        }
        catch(e) { this.notifyError("Error has occurred when generating for body commands:" + e); }

        return commands;
    },

    generateForInStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.right, parentFunctionCommand));

            commands.push(fcCommands.Command.createForInWhereCommand(sourceElement, -1, parentFunctionCommand));
            commands.push(new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EndLoopStatement, parentFunctionCommand));
        }
        catch(e) { this.notifyError("Error when generating for-in statement commands:" + e); }

        return commands;
    },

    generateForInBodyExecutionCommands: function(forInCommand)
    {
        var commands = [];

        try
        {
            if(forInCommand.willBodyBeExecuted)
            {
                ASTHelper.traverseDirectSourceElements
                (
                    forInCommand.codeConstruct.body,
                    function(sourceElement)
                    {
                        ValueTypeHelper.pushAll(commands, fcCommands.CommandGenerator.generateExecutionCommands
                        (
                            sourceElement,
                            forInCommand.parentFunctionCommand
                        ));
                    },
                    false
                );

                commands.push(new fcCommands.Command(forInCommand.codeConstruct, fcCommands.Command.COMMAND_TYPE.EndLoopStatement, forInCommand.parentFunctionCommand));
                commands.push(fcCommands.Command.createForInWhereCommand(forInCommand.codeConstruct, forInCommand.currentPropertyIndex + 1, forInCommand.parentFunctionCommand));
            }
        }
        catch(e) { this.notifyError("Error when generating for in commands: " + e); }

        return commands;
    },

    generateLetStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            alert("Let is not handled!");
        }
        catch(e) { this.notifyError("Error when generating let statement commands:" + e);}

        return commands;
    },

    generateExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        if(ASTHelper.isThisExpression(sourceElement))
        {
            return this.generateThisCommands(sourceElement, parentFunctionCommand);
        }
        else if (ASTHelper.isIdentifier(sourceElement))
        {
            return this.generateIdentifierCommands(sourceElement, parentFunctionCommand);
        }
        else if (ASTHelper.isLiteral(sourceElement))
        {
            return this.generateLiteralCommands(sourceElement, parentFunctionCommand);
        }
        else if (ASTHelper.isArrayExpression(sourceElement))
        {
            return this.generateArrayExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (ASTHelper.isObjectExpression(sourceElement))
        {
            return this.generateObjectExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (ASTHelper.isFunctionExpression(sourceElement))
        {
            return this.generateFunctionExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (ASTHelper.isSequenceExpression(sourceElement))
        {
            return this.generateSequenceExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (ASTHelper.isUnaryExpression(sourceElement))
        {
            return this.generateUnaryExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (ASTHelper.isBinaryExpression(sourceElement))
        {
            return this.generateBinaryExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (ASTHelper.isAssignmentExpression(sourceElement))
        {
            return this.generateAssignmentExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (ASTHelper.isUpdateExpression(sourceElement))
        {
            return this.generateUpdateExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if(ASTHelper.isLogicalExpression(sourceElement))
        {
            return this.generateLogicalExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (ASTHelper.isConditionalExpression(sourceElement))
        {
            return this.generateConditionalExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (ASTHelper.isNewExpression(sourceElement))
        {
            return this.generateNewExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (ASTHelper.isCallExpression(sourceElement))
        {
            return this.generateCallExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (ASTHelper.isMemberExpression(sourceElement))
        {
            return this.generateMemberExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if(ASTHelper.isYieldExpression(sourceElement)
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

        try
        {
            commands.push(new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.ThisExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { this.notifyError("Error while generating this commands:" + e);}

        return commands;
    },

    generateIdentifierCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            commands.push(new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.EvalIdentifier,
                parentFunctionCommand
            ));
        }
        catch(e) { this.notifyError("Error while generating identifier commands:" + e);}

        return commands;
    },

    generateLiteralCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(ValueTypeHelper.isObject(sourceElement.value))
            {
                var regExCommand = new fcCommands.Command(sourceElement, fcCommands.Command.COMMAND_TYPE.EvalRegExLiteral, parentFunctionCommand);

                //If it is directly gotten from mdc parser
                if(sourceElement.value.constructor != null && sourceElement.value.constructor.name === "RegExp")
                {
                    regExCommand.regExLiteral = sourceElement.value.toString();
                }
                else //over JSON conversion
                {
                    regExCommand.regExLiteral = atob(sourceElement.value.RegExpBase64);
                }

                commands.push(regExCommand);

                return commands;
            }

            commands.push(new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.EvalLiteral,
                parentFunctionCommand
            ));
        }
        catch(e) { this.notifyError("Error while generating identifier commands:" + e);}

        return commands;
    },

    generateArrayExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            var arrayExpressionCommand = new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.ArrayExpression,
                parentFunctionCommand
            );

            commands.push(arrayExpressionCommand);

            sourceElement.elements.forEach(function(item)
            {
                if(item != null)
                {
                    ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(item, parentFunctionCommand));
                }

                commands.push(fcCommands.Command.createArrayExpressionItemCommand(item, arrayExpressionCommand, parentFunctionCommand));
            }, this);
        }
        catch(e) { this.notifyError("Error while generating array expression commands:" + e);}

        return commands;
    },

    generateObjectExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            var objectExpressionCommand = new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.ObjectExpression,
                parentFunctionCommand
            );

            commands.push(objectExpressionCommand);

            sourceElement.properties.forEach(function(property)
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(property.value));

                if(property.kind == "get" || property.kind == "set") { this.notifyError("Getters and setters not supported!"); }

                commands.push(fcCommands.Command.createObjectPropertyCommand(property, objectExpressionCommand, parentFunctionCommand));
            }, this);
        }
        catch(e) { this.notifyError("Error while generating object expression commands:" + e);}

        return commands;
    },

    generateFunctionExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            commands.push(new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.FunctionExpressionCreation,
                parentFunctionCommand
            ));
        }
        catch(e) { this.notifyError("Error while generating function expression commands:" + e);}

        return commands;
    },

    generateSequenceExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            sourceElement.expressions.forEach(function(expression)
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(expression, parentFunctionCommand));
            }, this);

            commands.push(new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.EvalSequenceExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { this.notifyError("Error while generating sequence expression commands:" + e);}

        return commands;
    },

    generateUnaryExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.argument, parentFunctionCommand));

            commands.push(new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.EvalUnaryExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { this.notifyError("Error while generating unary expression commands:" + e);}

        return commands;
    },

    generateBinaryExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.left, parentFunctionCommand));
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.right, parentFunctionCommand));

            commands.push(new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.EvalBinaryExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { this.notifyError("Error while generating binary expression commands:" + e);}

        return commands;
    },

    generateAssignmentExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.right, parentFunctionCommand));
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.left, parentFunctionCommand));

            commands.push(fcCommands.Command.createAssignmentCommand
            (
                sourceElement,
                parentFunctionCommand
            ));
        }
        catch(e) { this.notifyError("Error while generating assignment expression commands:" + e);}

        return commands;
    },

    generateUpdateExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.argument, parentFunctionCommand));

            commands.push(new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.EvalUpdateExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { this.notifyError("Error while generating update expression commands:" + e);}

        return commands;
    },

    generateLogicalExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
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
        }
        catch(e) { this.notifyError("Error while generating logical expression commands:" + e);}

        return commands;
    },

    generateConditionalExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.test, parentFunctionCommand));

            commands.push(new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.EvalConditionalExpressionBody,
                parentFunctionCommand
            ));
        }
        catch(e) { this.notifyError("Error while generating conditional expression commands:" + e);}

        return commands;
    },

    generateConditionalExpressionEvalBodyCommands: function(executeConditionalExpressionBodyCommand, willConsequentBeExecuted)
    {
        var commands = [];

        try
        {
            var evalConditionalExpressionCommand = new fcCommands.Command
            (
                executeConditionalExpressionBodyCommand.codeConstruct,
                fcCommands.Command.COMMAND_TYPE.EvalConditionalExpression,
                executeConditionalExpressionBodyCommand.codeConstruct.parentFunctionCommand
            );

            if(willConsequentBeExecuted)
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
                (
                    executeConditionalExpressionBodyCommand.codeConstruct.consequent,
                    executeConditionalExpressionBodyCommand.parentFunctionCommand
                ));
                evalConditionalExpressionCommand.body = executeConditionalExpressionBodyCommand.codeConstruct.consequent;
            }
            else
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
                (
                    executeConditionalExpressionBodyCommand.codeConstruct.alternate,
                    executeConditionalExpressionBodyCommand.parentFunctionCommand
                ));

                evalConditionalExpressionCommand.body = executeConditionalExpressionBodyCommand.codeConstruct.alternate;
            }

            commands.push(evalConditionalExpressionCommand);
        }
        catch(e) { this.notifyError("Error while generating conditional expression commands:" + e);}

        return commands;
    },

    generateNewExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
            (
                sourceElement.callee,
                parentFunctionCommand
            ));

            if(sourceElement.arguments != null)
            {
                sourceElement.arguments.forEach(function(argument)
                {
                    ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
                    (
                        argument,
                        parentFunctionCommand
                    ));
                }, this);
            }

            commands.push(new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.EvalNewExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { this.notifyError("Error while generating new expression commands:" + e);}

        return commands;
    },

    generateCallExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
            (
                sourceElement.callee,
                parentFunctionCommand
            ));

            if(sourceElement.arguments != null)
            {
                sourceElement.arguments.forEach(function(argument)
                {
                    ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
                    (
                        argument,
                        parentFunctionCommand
                    ));
                }, this);
            }

            commands.push(new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.EvalCallExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { this.notifyError("Error while generating call expression commands:" + e);}

        return commands;
    },

    generateMemberExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.object,parentFunctionCommand));

            if(sourceElement.computed)
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
                (
                    sourceElement.property,
                    parentFunctionCommand
                ));
            }

            var evalMemberExpressionCommand = new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.EvalMemberExpression,
                parentFunctionCommand
            );

            var evalMemberPropertyExpressionCommand = new fcCommands.Command
            (
                sourceElement,
                fcCommands.Command.COMMAND_TYPE.EvalMemberExpressionProperty,
                parentFunctionCommand
            );

            evalMemberPropertyExpressionCommand.parentMemberExpressionCommand = evalMemberExpressionCommand;

            commands.push(evalMemberPropertyExpressionCommand);
            commands.push(evalMemberExpressionCommand);
        }
        catch(e) { this.notifyError("Error while generating member expression commands:" + e);}

        return commands;
    },

    toString: function(commands) { return commands.join("\n"); },

    notifyError: function(message) { alert("CommandGenerator - " + message); }
};

Firecrow.Interpreter.Commands.Command = function(codeConstruct, type, parentFunctionCommand)
{
    this.id = fcCommands.Command.LAST_COMMAND_ID++;
    this.codeConstruct = codeConstruct;
    this.type = type;
    this.parentFunctionCommand = parentFunctionCommand;

    this.removesCommands = this.isEvalReturnExpressionCommand()
                        || this.isEvalBreakCommand() || this.isEvalContinueCommand()
                        || this.isEvalThrowExpressionCommand() || this.isEvalLogicalExpressionItemCommand();

    this.generatesNewCommands = this.isEvalCallbackFunctionCommand()
                            ||  this.isEvalNewExpressionCommand() || this.isEvalCallExpressionCommand()
                            ||  this.isLoopStatementCommand() || this.isIfStatementCommand()
                            ||  this.isEvalConditionalExpressionBodyCommand() || this.isCaseCommand()
                            ||  this.isCallCallbackMethodCommand();
};

Firecrow.Interpreter.Commands.Command.LAST_COMMAND_ID = 0;

Firecrow.Interpreter.Commands.Command.notifyError = function(message) { alert("Command - " + message); }

Firecrow.Interpreter.Commands.Command.createAssignmentCommand = function(codeConstruct, parentFunctionCommand)
{
    try
    {
        if(!ASTHelper.isVariableDeclarator(codeConstruct)
        && !ASTHelper.isAssignmentExpression(codeConstruct))
        {
            this.notifyError("Assignment command can only be created on variable declarators and assignement expressions!");
            return null;
        }

        var command = new fcCommands.Command(codeConstruct, fcCommands.Command.COMMAND_TYPE.EvalAssignmentExpression, parentFunctionCommand);

        if (ASTHelper.isVariableDeclarator(codeConstruct))
        {
            command.leftSide = codeConstruct.id;
            command.rightSide = codeConstruct.init;
            command.operator = "=";
        }
        else if (ASTHelper.isAssignmentExpression(codeConstruct))
        {
            command.leftSide = codeConstruct.left;
            command.rightSide = codeConstruct.right;
            command.operator = codeConstruct.operator;
        }

        return command;
    }
    catch(e) { this.notifyError("Error while creating assignment command: " + e);}
};

Firecrow.Interpreter.Commands.Command.createEnterFunctionContextCommand = function(functionObject, thisObject, parentFunctionCommand)
{
    try
    {
        var command = new fcCommands.Command(functionObject.fcInternal.codeConstruct, fcCommands.Command.COMMAND_TYPE.EnterFunctionContext, parentFunctionCommand);

        command.callee = functionObject;
        command.thisObject = thisObject;

        return command;
    }
    catch(e) { this.notifyError("an error has occurred when generating enter function context commands: " + e); }
};

Firecrow.Interpreter.Commands.Command.createEnterEventHandlerContextCommand = function(handlerInfo)
{
    try
    {
        var command = new fcCommands.Command(handlerInfo.functionHandler.fcInternal.codeConstruct, fcCommands.Command.COMMAND_TYPE.EnterFunctionContext, null);

        command.callee = handlerInfo.functionHandler;
        command.thisObject = handlerInfo.thisObject;
        command.argumentValues = handlerInfo.argumentValues;
        command.codeConstruct = handlerInfo.registrationPoint.codeConstruct;
        command.isEnterEventHandler = true;

        return command;
    }
    catch(e) { this.notifyError("an error has occurred when generating enter function context commands: " + e); }
};

Firecrow.Interpreter.Commands.Command.createExitFunctionContextCommand = function(functionObject, parentFunctionCommand)
{
    try
    {
        return new fcCommands.Command(functionObject.fcInternal.codeConstruct, fcCommands.Command.COMMAND_TYPE.ExitFunctionContext, parentFunctionCommand);
    }
    catch(e) { this.notifyError("an error has occurred when generating exit function context command:" + e); }
};

Firecrow.Interpreter.Commands.Command.createObjectPropertyCommand = function(codeConstruct, objectExpressionCommand, parentFunctionCommand)
{
    try
    {
        var command = new fcCommands.Command
        (
            codeConstruct,
            fcCommands.Command.COMMAND_TYPE.ObjectPropertyCreation,
            parentFunctionCommand
        );

        command.objectExpressionCommand = objectExpressionCommand;

        return command;
    }
    catch(e) { this.notifyError("an error has occurred when generating create object property commands:" + e); }
};

Firecrow.Interpreter.Commands.Command.createArrayExpressionItemCommand = function(codeConstruct, arrayExpressionCommand, parentFunctionCommand)
{
    try
    {
        var command = new fcCommands.Command
        (
            codeConstruct,
            fcCommands.Command.COMMAND_TYPE.ArrayExpressionItemCreation,
            parentFunctionCommand
        );

        command.arrayExpressionCommand = arrayExpressionCommand;

        return command;
    }
    catch(e) { this.notifyError("an error has occurred when generating array expression item commands"); }
};

Firecrow.Interpreter.Commands.Command.createForInWhereCommand = function(codeConstruct, currentPropertyIndex, parentFunctionCommand)
{
    try
    {
        var newForInWhereCommand = new fcCommands.Command(codeConstruct, fcCommands.Command.COMMAND_TYPE.EvalForInWhere, parentFunctionCommand);

        newForInWhereCommand.currentPropertyIndex  = currentPropertyIndex;

        return newForInWhereCommand;
    }
    catch(e) { this.notifyError("error when creating a new For In Where command: " + e);}
};

Firecrow.Interpreter.Commands.Command.createCallInternalConstructorCommand = function(codeConstruct, functionObject, parentFunctionCommand)
{
    try
    {
        var command = new fcCommands.Command(codeConstruct, fcCommands.Command.COMMAND_TYPE.CallInternalConstructor, parentFunctionCommand);

        command.functionObject = functionObject;

        return command;
    }
    catch(e) { this.notifyError("error when creating internal constructor command"); }
};

Firecrow.Interpreter.Commands.Command.createCallInternalConstructorCommand = function(codeConstruct, functionObject, parentFunctionCommand)
{
    try
    {
        var command = new fcCommands.Command(codeConstruct, fcCommands.Command.COMMAND_TYPE.CallInternalConstructor, parentFunctionCommand);

        command.functionObject = functionObject;

        return command;
    }
    catch(e) { this.notifyError("error when creating internal constructor command"); }
};

Firecrow.Interpreter.Commands.Command.createCallInternalFunctionCommand = function(codeConstruct, functionObject, thisObject, parentFunctionCommand)
{
    try
    {
        var command = new fcCommands.Command(codeConstruct, fcCommands.Command.COMMAND_TYPE.CallInternalFunction, parentFunctionCommand);

        command.functionObject = functionObject;
        command.thisObject = thisObject;

        return command;
    }
    catch(e) { this.notifyError("error when creating call internal function command: " + e); }
};

Firecrow.Interpreter.Commands.Command.createCallCallbackMethodCommand = function(codeConstruct, callCommand, parentFunctionCommand)
{
    try
    {
        var command = new fcCommands.Command(codeConstruct, fcCommands.Command.COMMAND_TYPE.CallCallbackMethod, parentFunctionCommand);

        command.generatesNewCommands = true;
        command.generatesCallbacks = true;
        command.callbackFunction = callCommand.callbackFunction;
        command.callbackArgumentGroups = callCommand.callbackArgumentGroups;
        command.thisObject = callCommand.thisObject;
        command.originatingObject = callCommand.originatingObject;
        command.callerFunction = callCommand.callerFunction;
        command.targetObject = callCommand.targetObject;

        return command;
    }
    catch(e) { this.notifyError("error when creating call callback method command: " + e); }
};

Firecrow.Interpreter.Commands.Command.createExecuteCallbackCommand = function(callCallbackCommand, arguments)
{
    try
    {
        var command = new fcCommands.Command(callCallbackCommand.callbackFunction.fcInternal.codeConstruct, fcCommands.Command.COMMAND_TYPE.ExecuteCallback, callCallbackCommand.parentFunctionCommand);

        command.callbackFunction = callCallbackCommand.callbackFunction;
        command.callbackArgumentGroups = callCallbackCommand.callbackArgumentGroups;
        command.thisObject = callCallbackCommand.thisObject;
        command.originatingObject = callCallbackCommand.originatingObject;
        command.callerFunction = callCallbackCommand.callerFunction;
        command.targetObject = callCallbackCommand.targetObject;
        command.arguments = arguments;
        command.callCallbackCommand = callCallbackCommand;

        return command;
    }
    catch(e) { this.notifyError("error when creating execute callback command: " + e); }
};

Firecrow.Interpreter.Commands.Command.prototype =
{
    isDeclareVariableCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.DeclareVariable; },
    isDeclareFunctionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.DeclareFunction; },
    isThisExpressionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.ThisExpression; },

    isArrayExpressionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.ArrayExpression; },
    isArrayExpressionItemCreationCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.ArrayExpressionItemCreation; },

    isObjectExpressionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.ObjectExpression; },
    isObjectPropertyCreationCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.ObjectPropertyCreation; },

    isStartWithStatementCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.StartWithStatement; },
    isEndWithStatementCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EndWithStatement; },

    isStartTryStatementCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.StartTryStatement; },
    isEndTryStatementCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EndTryStatement; },

    isStartCatchStatementCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.StartCatchStatement; },
    isEndCatchStatementCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EndCatchStatement; },

    isStartSwitchStatementCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.StartSwitchStatement; },
    isCaseCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.Case; },
    isEndSwitchStatementCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EndSwitchStatement; },

    isFunctionExpressionCreationCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.FunctionExpressionCreation; },

    isEvalSequenceExpressionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalSequenceExpression; },

    isEvalUnaryExpressionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalUnaryExpression; },
    isEvalBinaryExpressionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalBinaryExpression; },

    isStartLogicalExpressionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.StartEvalLogicalExpression; },
    isEvalLogicalExpressionItemCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalLogicalExpressionItem; },
    isEndLogicalExpressionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EndEvalLogicalExpression; },

    isEvalAssignmentExpressionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalAssignmentExpression; },
    isEvalUpdateExpressionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalUpdateExpression; },

    isEvalBreakCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalBreak; },
    isEvalContinueCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalContinue; },

    isEvalConditionalExpressionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalConditionalExpression; },
    isEvalConditionalExpressionBodyCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalConditionalExpressionBody; },

    isEvalNewExpressionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalNewExpression; },

    isEvalCallExpressionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalCallExpression; },

    isEnterFunctionContextCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EnterFunctionContext; },
    isExitFunctionContextCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.ExitFunctionContext; },

    isEvalCallbackFunctionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalCallbackFunction; },

    isEvalMemberExpressionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalMemberExpression; },
    isEvalMemberExpressionPropertyCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalMemberExpressionProperty; },

    isEvalReturnExpressionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalReturnExpression; },

    isEvalThrowExpressionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalThrowExpression; },

    isEvalIdentifierCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalIdentifier; },
    isEvalLiteralCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalLiteral; },
    isEvalRegExCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalRegExLiteral; },

    isIfStatementCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.IfStatement; },
    isEndIfCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EndIf; },

    isLoopStatementCommand: function()
    {
        return this.isWhileStatementCommand() || this.isDoWhileStatementCommand()
            || this.isForStatementCommand() || this.isEvalForInWhereCommand();
    },

    isWhileStatementCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.WhileStatement; },
    isDoWhileStatementCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.DoWhileStatement; },
    isForStatementCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.ForStatement; },
    isForUpdateStatementCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.ForUpdateStatement; },
    isEvalForInWhereCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EvalForInWhere; },
    isEndLoopStatementCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EndLoopStatement ;},

    isCallInternalConstructorCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.CallInternalConstructor; },
    isCallInternalFunctionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.CallInternalFunction; },
    isCallCallbackMethodCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.CallCallbackMethod; },

    isExecuteCallbackCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.ExecuteCallback; },

    getLineNo: function()
    {
        return this.codeConstruct != null && this.codeConstruct.loc != null ? this.codeConstruct.loc.start.line : -1;
    },
    toString: function() { return this.id + ":" + this.type + "@" + this.codeConstruct.loc.start.line; }
};

Firecrow.Interpreter.Commands.Command.COMMAND_TYPE =
{
    DeclareVariable: "DeclareVariable",
    DeclareFunction: "DeclareFunction",

    ThisExpression: "ThisExpression",

    ArrayExpression: "ArrayExpression",
    ArrayExpressionItemCreation: "ArrayExpressionItemCreation",

    ObjectExpression: "ObjectExpression",
    ObjectPropertyCreation: "ObjectPropertyCreation",

    StartWithStatement: "StartWithStatement",
    EndWithStatement: "EndWithStatement",

    StartTryStatement: "StartTryStatement",
    EndTryStatement: "EndTryStatement",

    StartCatchStatement: "StartCatchStatement",
    EndCatchStatement: "EndCatchStatement",

    StartSwitchStatement: "StartSwitchStatement",
    EndSwitchStatement: "EndSwitchStatement",

    Case: "Case",

    FunctionExpressionCreation: "FunctionExpressionCreation",

    EvalSequenceExpression: "EvalSequenceExpression",
    EvalUnaryExpression: "EvalUnaryExpression",
    EvalBinaryExpression: "EvalBinaryExpression",
    EvalAssignmentExpression: "EvalAssignmentExpression",
    EvalUpdateExpression: "EvalUpdateExpression",

    EvalBreak: "EvalBreak",
    EvalContinue: "EvalContinue",

    EvalCallbackFunction: "EvalCallbackFunction",

    StartEvalLogicalExpression: "StartEvalLogicalExpression",
    EvalLogicalExpressionItem: "EvalLogicalExpressionItem",
    EndEvalLogicalExpression: "EndEvalLogicalExpression",

    EvalConditionalExpression: "EvalConditionalExpression",
    EvalNewExpression: "EvalNewExpression",
    EvalCallExpression: "EvalCallExpression",

    EnterFunctionContext: "EnterFunctionContext",
    ExitFunctionContext: "ExitFunctionContext",

    EvalMemberExpression: "EvalMemberExpression",
    EvalMemberExpressionProperty: "EvalMemberExpressionProperty",

    EvalReturnExpression: "EvalReturnExpression",
    EvalThrowExpression: "EvalThrowExpression",

    EvalIdentifier: "EvalIdentifier",
    EvalLiteral: "EvalLiteral",
    EvalRegExLiteral: "EvalRegExLiteral",

    IfStatement: "IfStatement",
    EndIf: "EndIf",
    WhileStatement: "WhileStatement",
    DoWhileStatement: "DoWhileStatement",

    ForStatement: "ForStatement",
    ForUpdateStatement: "ForUpdateStatement",

    EndLoopStatement: "EndLoopStatement",

    EvalForInWhere: "EvalForInWhere",

    EvalConditionalExpressionBody: "EvalConditionalExpressionBody",

    CallInternalConstructor: "CallInternalConstructor",
    CallInternalFunction: "CallInternalFunction",
    CallCallbackMethod: "CallCallbackMethod",

    ExecuteCallback: "ExecuteCallback"
};
/*************************************************************************************/
}});