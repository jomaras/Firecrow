/**
 * Created by Josip Maras.
 * User: jomaras
 * Date: 06.03.12.
 * Time: 13:56
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
const astHelper = Firecrow.ASTHelper;
const ValueTypeHelper = Firecrow.ValueTypeHelper;

Firecrow.CommandGenerator =
{
    generateCommands: function(program)
    {
        try
        {
            var executionCommands = [];
            var declarationCommands = [];
            var Command = Firecrow.Command;
            var commandType = Firecrow.Command.COMMAND_TYPE;

            astHelper.traverseDirectSourceElements
            (
                program,
                function(sourceElement)
                {
                    ValueTypeHelper.pushAll
                    (
                        declarationCommands,
                        Firecrow.CommandGenerator.generateDeclarationCommands(sourceElement)
                    );
                },
                true
            );

            astHelper.traverseDirectSourceElements
            (
                program,
                function(sourceElement)
                {
                    ValueTypeHelper.pushAll
                    (
                        executionCommands,
                        Firecrow.CommandGenerator.generateExecutionCommands(sourceElement, null)
                    );
                },
                false
            );

            return declarationCommands.concat(executionCommands);
        }
        catch(e) { alert("Error while generating commmands in CommandGenerator: " + e);}
    },

    generateDeclarationCommands: function(sourceElement)
    {
        var declarationCommands = [];

        try
        {
            var Command = Firecrow.Command;
            var commandType = Firecrow.Command.COMMAND_TYPE;

            if(astHelper.isVariableDeclaration(sourceElement))
            {
                sourceElement.declarations.forEach(function(variableDeclarator)
                {
                    declarationCommands.push(new Command(variableDeclarator, commandType.DeclareVariable));
                });
            }
            else if (astHelper.isFunctionDeclaration(sourceElement))
            {
                declarationCommands.push(new Command(sourceElement, commandType.DeclareFunction));
            }
            else if (astHelper.isForStatement(sourceElement))
            {
                if(astHelper.isVariableDeclaration(sourceElement.init))
                {
                    sourceElement.init.declarations.forEach(function(variableDeclarator)
                    {
                        declarationCommands.push(new Command(variableDeclarator, commandType.DeclareVariable));
                    });
                }
            }
            else if(astHelper.isForInStatement(sourceElement))
            {
                if(astHelper.isVariableDeclaration(sourceElement.left))
                {
                    sourceElement.left.declarations.forEach(function(variableDeclarator)
                    {
                        declarationCommands.push(new Command(variableDeclarator, commandType.DeclareVariable));
                    });
                }
            }
        }
        catch(e) { alert("Error while appending declaration commands at CommandGenerator: " + e);}

        return declarationCommands;
    },

    generateExecutionCommands: function(sourceElement, parentFunctionCommand)
    {
        try
        {
            if(astHelper.isVariableDeclaration(sourceElement))
            {
                return this.generateVariableDeclarationExecutionCommands(sourceElement, parentFunctionCommand);
            }
            if(astHelper.isExpressionStatement(sourceElement))
            {
                return this.generateExpressionStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (astHelper.isIfStatement(sourceElement))
            {
                return this.generateIfStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (astHelper.isLabeledStatement(sourceElement))
            {
                return this.generateLabeledStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (astHelper.isBreakStatement(sourceElement))
            {
                return this.generateBreakStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (astHelper.isContinueStatement(sourceElement))
            {
                return this.generateContinueStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (astHelper.isWithStatement(sourceElement))
            {
                return this.generateWithStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (astHelper.isSwitchStatement(sourceElement))
            {
                return this.generateSwitchStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (astHelper.isReturnStatement(sourceElement))
            {
                return this.generateReturnStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (astHelper.isThrowStatement(sourceElement))
            {
                return this.generateThrowStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (astHelper.isTryStatement(sourceElement))
            {
                return this.generateTryStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (astHelper.isWhileStatement(sourceElement))
            {
                return this.generateWhileStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (astHelper.isDoWhileStatement(sourceElement))
            {
                return this.generateDoWhileStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (astHelper.isForStatement(sourceElement))
            {
                return this.generateForStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (astHelper.isForInStatement(sourceElement))
            {
                return this.generateForInStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if (astHelper.isLetStatement(sourceElement))
            {
                return this.generateLetStatementExecutionCommands(sourceElement, parentFunctionCommand);
            }
            else if(astHelper.isFunctionDeclaration(sourceElement))
            {
                return [];
            }
            else
            {
                alert("Unhandled source element when generating execution command: " + sourceElement.type);
                return [];
            }
        }
        catch(e) { alert("Error while generating execution commands in CommandGenerator:" + e); }
    },

    generateVariableDeclarationExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isVariableDeclaration(sourceElement))
            {
                alert("Source element is not a variable declaration when generating commands");
                return;
            }

            sourceElement.declarations.forEach(function(variableDeclarator)
            {
                if(!astHelper.isIdentifier(variableDeclarator.id))
                {
                    alert("Variable declarator is not an identifier!");
                    return;
                }

                if(variableDeclarator.init != null)
                {
                    ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(variableDeclarator.init, parentFunctionCommand));
                    commands.push(Firecrow.Command.CreateAssignmentCommand(variableDeclarator, parentFunctionCommand));
                }
            }, this);
        }
        catch(e) { alert("Error when generating variable declaration commands:" + e);}

        return commands;
    },

    generateExpressionStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        try
        {
            if(!astHelper.isExpressionStatement(sourceElement))
            {
                alert("Source element is not an expression statement when generating commands");
                return;
            }

            return this.generateExpressionCommands(sourceElement.expression, parentFunctionCommand);
        }
        catch(e) { alert("Error when generating expression statement commands:" + e);}

        return [];
    },

    generateIfStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isIfStatement(sourceElement))
            {
                alert("Source element is not if statement when generating commands");
                return;
            }

            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.test, parentFunctionCommand));
            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.IfStatement,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error when generating if statement commands:" + e);}

        return commands;
    },

    generateIfStatementBodyCommands: function(ifStatementCommand, conditionEvaluationResult, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!ifStatementCommand.isIfStatementCommand())
            {
                alert("Source element is not if statement when generating commands");
                return [];
            }

            if(conditionEvaluationResult)
            {
                astHelper.traverseDirectSourceElements
                (
                    ifStatementCommand.codeConstruct.consequent,
                    function(sourceElement)
                    {
                        ValueTypeHelper.pushAll(commands, Firecrow.CommandGenerator.generateExecutionCommands(sourceElement, parentFunctionCommand));
                    },
                    false
                );
            }
            else
            {
                if(sourceElement.alternate != null)
                {
                    astHelper.traverseDirectSourceElements
                    (
                        ifStatementCommand.codeConstruct.alternate,
                        function(sourceElement)
                        {
                            ValueTypeHelper.pushAll(commands, Firecrow.CommandGenerator.generateExecutionCommands(sourceElement, parentFunctionCommand));
                        },
                        false
                    );
                }
            }
        }
        catch(e) { alert("Error when generating if statement commands:" + e);}

        return commands;
    },

    generateLabeledStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isLabeledStatement(sourceElement))
            {
                alert("Source element is not a labeled statement when generating commands");
                return;
            }

            alert("Ignoring labeled statements!");
        }
        catch(e) { alert("Error when generating labeled statement commands:" + e);}

        return commands;
    },

    generateBreakStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isBreakStatement(sourceElement))
            {
                alert("Source element is not a break statement when generating commands");
                return commands;
            }

            if(sourceElement.label != null) { alert("Not handling break with labels!"); return commands; }

            commands.push(new Firecrow.Command(sourceElement, Firecrow.Command.COMMAND_TYPE.EvalBreak, parentFunctionCommand));
        }
        catch(e) { alert("Error when generating break statement commands:" + e);}

        return commands;
    },

    generateContinueStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isContinueStatement(sourceElement))
            {
                alert("Source element is not a continue statement when generating commands");
                return commands;
            }

            if(sourceElement.label != null) { alert("Not handling continue with labels!"); return commands; }

            commands.push(new Firecrow.Command(sourceElement, Firecrow.Command.COMMAND_TYPE.EvalContinue, parentFunctionCommand));
        }
        catch(e) { alert("Error when generating continue statement commands:" + e);}

        return commands;
    },

    generateWithStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isWithStatement(sourceElement))
            {
                alert("Source element is not a with statement when generating commands");
                return;
            }

            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
            (
                sourceElement.object,
                parentFunctionCommand
            ));

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.StartWithStatement,
                parentFunctionCommand
            ));

            astHelper.traverseDirectSourceElements
            (
                sourceElement.body,
                function(sourceElement)
                {
                    ValueTypeHelper.pushAll(commands, Firecrow.CommandGenerator.generateExecutionCommands
                    (
                        sourceElement,
                        parentFunctionCommand
                    ));
                },
                false
            );

            commands.push(new Firecrow.Command(sourceElement, Firecrow.Command.COMMAND_TYPE.EndWithStatement, parentFunctionCommand));
        }
        catch(e) { alert("Error when generating with statement commands:" + e);}

        return commands;
    },

    generateSwitchStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isSwitchStatement(sourceElement))
            {
                alert("Source element is not a switch statement when generating commands");
                return;
            }

            var startSwitchCommand = new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.StartSwitchStatement,
                parentFunctionCommand
            );

            startSwitchCommand.caseCommands = [];

            commands.push(startSwitchCommand);

            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
            (
                sourceElement.discriminant,
                parentFunctionCommand
            ));

            sourceElement.cases.forEach(function(caseElement)
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
                (
                    caseElement.test,
                    parentFunctionCommand
                ));

                var caseCommand = new Firecrow.Command
                (
                    sourceElement,
                    Firecrow.Command.COMMAND_TYPE.Case,
                    parentFunctionCommand
                );

                caseCommand.parent = startSwitchCommand;
                startSwitchCommand.caseCommands.push(caseCommand);

                commands.push(caseCommand);
            }, this);

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.EndSwitchStatement,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error when generating switch statement commands:" + e);}

        return commands;
    },

    generateCaseExecutionCommands: function(caseCommand, expressionMatches)
    {
        var commands = [];

        try
        {
            if(!caseCommand.isCaseCommand()){ alert("Should be case command!"); return commands; }

            if(!expressionMatches) { return commands; }

            astHelper.traverseArrayOfDirectStatements
            (
                caseCommand.codeConstruct.consequent,
                caseCommand.codeConstruct,
                function(sourceElement)
                {
                    ValueTypeHelper.pushAll(commands, Firecrow.CommandGenerator.generateExecutionCommands(sourceElement, caseCommand.parentFunctionCommand));
                },
                false
            );
        }
        catch(e) { alert("Errow when generating case commands: " + e); }

        return commands;
    },

    generateReturnStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isReturnStatement(sourceElement))
            {
                alert("Source element is not a return statement when generating commands");
                return;
            }

            if(sourceElement.argument != null)
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
                (
                    sourceElement.argument,
                    parentFunctionCommand
                ));
            }

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.EvalReturnExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error when generating return statement commands:" + e);}

        return commands;
    },

    generateThrowStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isThrowStatement(sourceElement))
            {
                alert("Source element is not a throw statement when generating commands");
                return;
            }

            if(sourceElement.argument != null)
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
                (
                    sourceElement.argument,
                    parentFunctionCommand
                ));
            }

            commands.push(new Firecrow.Command(sourceElement, Firecrow.Command.COMMAND_TYPE.EvalThrowExpression, parentFunctionCommand));
        }
        catch(e) { alert("Error when generating throw statement commands:" + e);}

        return commands;
    },

    generateTryStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isTryStatement(sourceElement)) { alert("Source element is not a try statement when generating commands"); return commands; }

            var startTryCommand = new Firecrow.Command(sourceElement, Firecrow.Command.COMMAND_TYPE.StartTryStatement, parentFunctionCommand);
            commands.push(startTryCommand);

            astHelper.traverseDirectSourceElements
            (
                sourceElement.block,
                function(sourceElement)
                {
                    ValueTypeHelper.pushAll(commands, Firecrow.CommandGenerator.generateExecutionCommands(sourceElement, parentFunctionCommand));
                },
                false
            );

            var endTryCommand = new Firecrow.Command(sourceElement, Firecrow.Command.COMMAND_TYPE.EndTryStatement, parentFunctionCommand);
            endTryCommand.startCommand = startTryCommand;

            commands.push(endTryCommand);
        }
        catch(e) { alert("Error when generating try statement commands:" + e);}

        return commands;
    },

    generateCatchStatementExecutionCommands: function(tryCommand)
    {
        var commands = [];

        try
        {
            if(tryCommand.isTryStatementCommand()) { alert("Command is not a try command"); return commands; }

            var tryStatement = tryCommand.codeConstruct;

            if(tryStatement.handlers.length > 1) { alert("Not handling more than "); return commands; }

            var catchElement = tryStatement.handlers[0];

            commands.push(new Firecrow.Command
            (
                catchElement,
                Firecrow.Command.COMMAND_TYPE.StartCatchStatement,
                tryCommand.parentFunctionCommand
            ));

            astHelper.traverseDirectSourceElements
            (
                catchElement,
                function(sourceElement)
                {
                    ValueTypeHelper.pushAll(commands, Firecrow.CommandGenerator.generateExecutionCommands
                    (
                        sourceElement,
                        tryCommand.parentFunctionCommand
                    ));
                },
                false
            );

            commands.push(new Firecrow.Command
            (
                catchElement,
                Firecrow.Command.COMMAND_TYPE.EndCatchStatement,
                tryCommand.parentFunctionCommand
            ));

            if(tryStatement.finalizer != null)
            {
                astHelper.traverseDirectSourceElements
                (
                    tryStatement.finalizer,
                    function(sourceElement)
                    {
                        ValueTypeHelper.pushAll(commands, Firecrow.CommandGenerator.generateExecutionCommands
                        (
                            sourceElement,
                            tryCommand.parentFunctionCommand
                        ));
                    },
                    false
                );
            }
        }
        catch(e) { alert("Error when generating catch statement commands: " + e); }

        return commands;
    },

    generateWhileStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isWhileStatement(sourceElement))
            {
                alert("Source element is not a while statement when generating commands");
                return;
            }

            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.test, parentFunctionCommand));

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.WhileStatement,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error when generating while statement commands:" + e); }

        return commands;
    },

    generateWhileBodyExecutionCommands: function(whileStatementCommand, evaldCondition)
    {
        var commands = [];

        try
        {
            if(!whileStatementCommand.isWhileStatementCommand()) { alert("Command is not a while statement command"); return; }

            if(evaldCondition)
            {
                astHelper.traverseDirectSourceElements
                (
                    whileStatementCommand.codeConstruct.body,
                    function(sourceElement)
                    {
                        ValueTypeHelper.pushAll(commands, Firecrow.CommandGenerator.generateExecutionCommands
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
                commands.push(new Firecrow.Command
                (
                    whileStatementCommand.codeConstruct,
                    Firecrow.Command.COMMAND_TYPE.WhileStatement,
                    whileStatementCommand.parentFunctionCommand
                ));
            }
        }
        catch(e) { alert("Error when generating while statement commands:" + e); }

        return commands;
    },

    generateDoWhileStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isDoWhileStatement(sourceElement))
            {
                alert("Source element is not a dowhile statement when generating commands");
                return;
            }

            astHelper.traverseDirectSourceElements
            (
                sourceElement.body,
                function(sourceElement)
                {
                    ValueTypeHelper.pushAll(commands, Firecrow.CommandGenerator.generateExecutionCommands(sourceElement, parentFunctionCommand));
                },
                false
            );

            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.test, parentFunctionCommand));

            commands.push(new Firecrow.Command(sourceElement, Firecrow.Command.COMMAND_TYPE.DoWhileStatement, parentFunctionCommand));
        }
        catch(e) { alert("Error when generating while statement commands:" + e); }

        return commands;
    },

    generateDoWhileBodyExecutionCommands: function(doWhileStatementCommand, evaldCondition)
    {
        var commands = [];

        try
        {
            if(!doWhileStatementCommand.isDoWhileStatementCommand()) { alert("Command is not a doWhile statement command"); return; }

            if(evaldCondition)
            {
                astHelper.traverseDirectSourceElements
                (
                    doWhileStatementCommand.codeConstruct.body,
                    function(sourceElement)
                    {
                        ValueTypeHelper.pushAll(commands, Firecrow.CommandGenerator.generateExecutionCommands
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

                commands.push(new Firecrow.Command
                (
                    doWhileStatementCommand.codeConstruct,
                    Firecrow.Command.COMMAND_TYPE.DoWhileStatement,
                    doWhileStatementCommand.parentFunctionCommand
                ));
            }
        }
        catch(e) { alert("Error when generating doWhile statement commands:" + e); }

        return commands;
    },

    generateForStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isForStatement(sourceElement))
            {
                alert("Source element is not a for statement when generating commands");
                return;
            }

            if(sourceElement.init != null)
            {
                if(astHelper.isVariableDeclaration(sourceElement.init))
                {
                    ValueTypeHelper.pushAll(commands, this.generateVariableDeclarationExecutionCommands
                    (
                        sourceElement.init,
                        parentFunctionCommand
                    ));
                }
                else if (astHelper.isExpression(sourceElement.init))
                {
                    ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.init, parentFunctionCommand));
                }
            }

            if(sourceElement.test != null)
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.test, parentFunctionCommand));
            }

            commands.push(new Firecrow.Command(sourceElement, Firecrow.Command.COMMAND_TYPE.ForStatement, parentFunctionCommand));
        }
        catch(e) { alert("Error when generating for statement commands:" + e);}

        return commands;
    },

    generateForBodyExecutionCommands: function(forStatementCommand, evaldCondition)
    {
        var commands = [];

        try
        {
            if(!forStatementCommand.isForStatementCommand()) { alert("Should be a for statment command!"); return commands; }

            if(evaldCondition)
            {
                astHelper.traverseDirectSourceElements
                (
                    forStatementCommand.codeConstruct.body,
                    function(sourceElement)
                    {
                        ValueTypeHelper.pushAll(commands, Firecrow.CommandGenerator.generateExecutionCommands
                        (
                            sourceElement,
                            forStatementCommand.parentFunctionCommand
                        ));
                    },
                    false
                );

                if(forStatementCommand.codeConstruct.update != null)
                {
                    commands.push(new Firecrow.Command
                    (
                        forStatementCommand.codeConstruct.update,
                        Firecrow.Command.COMMAND_TYPE.StartForStatementUpdate,
                        forStatementCommand.parentFunctionCommand
                    ));

                    ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
                    (
                        forStatementCommand.codeConstruct.update,
                        forStatementCommand.parentFunctionCommand
                    ));

                    commands.push(new Firecrow.Command
                    (
                        forStatementCommand.codeConstruct.update,
                        Firecrow.Command.COMMAND_TYPE.EndForStatementUpdate,
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

                commands.push(new Firecrow.Command
                (
                    forStatementCommand.codeConstruct,
                    Firecrow.Command.COMMAND_TYPE.ForStatement,
                    forStatementCommand.parentFunctionCommand
                ));
            }
        }
        catch(e) { alert("Error has occured when genereting for body commands:" + e); }

        return commands;
    },

    generateForInStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isForInStatement(sourceElement))
            {
                alert("Source element is not a for in statement when generating commands");
                return;
            }

            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.right, parentFunctionCommand));
            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.StartForInStatement,
                parentFunctionCommand
            ));
            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.EvalForInWhere,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error when generating forin statement commands:" + e); }

        return commands;
    },

    generateForInBodyExecutionCommands: function(forInCommand, hasNextProperty)
    {
        var commands = [];

        try
        {
            if(!forInCommand.isForInWhereCommand()) { alert("Should be a forin statement command!"); return commands; }

            if(hasNextProperty)
            {
                astHelper.traverseDirectSourceElements
                (
                    forInCommand.codeConstruct.body,
                    function(sourceElement)
                    {
                        ValueTypeHelper.pushAll(commands, Firecrow.CommandGenerator.generateExecutionCommands
                        (
                            sourceElement,
                            forInCommand.parentFunctionCommand
                        ));
                    },
                    false
                );

                commands.push(new Firecrow.Command
                (
                    forInCommand.codeConstruct,
                    Firecrow.Command.COMMAND_TYPE.EvalForInWhere,
                    forInCommand.parentFunctionCommand
                ));
            }
            else
            {
                commands.push(new Firecrow.Command
                (
                    forInCommand.codeConstruct,
                    Firecrow.Command.COMMAND_TYPE.EndForInStatement,
                    forInCommand.parentFunctionCommand
                ));
            }
        }
        catch(e) { alert("Error when genereting for in commands: " + e); }
    },

    generateLetStatementExecutionCommands: function (sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isLetStatement(sourceElement))
            {
                alert("Source element is not a let statement when generating commands");
                return;
            }
        }
        catch(e) { alert("Error when generating let statement commands:" + e);}

        return commands;
    },

    generateExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        if(astHelper.isThisExpression(sourceElement))
        {
            return this.generateThisCommands(sourceElement, parentFunctionCommand);
        }
        else if (astHelper.isIdentifier(sourceElement))
        {
            return this.generateIdentifierCommands(sourceElement, parentFunctionCommand);
        }
        else if (astHelper.isLiteral(sourceElement))
        {
            return this.generateLiteralCommands(sourceElement, parentFunctionCommand);
        }
        else if (astHelper.isArrayExpression(sourceElement))
        {
            return this.generateArrayExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (astHelper.isObjectExpression(sourceElement))
        {
            return this.generateObjectExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (astHelper.isFunctionExpression(sourceElement))
        {
            return this.generateFunctionExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (astHelper.isSequenceExpression(sourceElement))
        {
            return this.generateSequenceExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (astHelper.isUnaryExpression(sourceElement))
        {
            return this.generateUnaryExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (astHelper.isBinaryExpression(sourceElement))
        {
            return this.generateBinaryExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (astHelper.isAssignmentExpression(sourceElement))
        {
            return this.generateAssignmentExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (astHelper.isUpdateExpression(sourceElement))
        {
            return this.generateUpdateExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if(astHelper.isLogicalExpression(sourceElement))
        {
            return this.generateLogicalExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (astHelper.isConditionalExpression(sourceElement))
        {
            return this.generateConditionalExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (astHelper.isNewExpression(sourceElement))
        {
            return this.generateNewExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (astHelper.isCallExpression(sourceElement))
        {
            return this.generateCallExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if (astHelper.isMemberExpression(sourceElement))
        {
            return this.generateMemberExpressionCommands(sourceElement, parentFunctionCommand);
        }
        else if(astHelper.isYieldExpression(sourceElement)
            ||  astHelper.isComprehensionExpression(sourceElement)
            ||  astHelper.isGeneratorExpression(sourceElement)
            ||  astHelper.isLetExpression(sourceElement))
        {
            alert("Yield, Comprehnsion, Generator and Let not yet implemented!");
        }
    },

    generateThisCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isThisExpression(sourceElement))
            {
                alert("Source element is not a this expression!");
                return commands;
            }

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.ThisExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error while generating this commands:" + e);}

        return commands;
    },

    generateIdentifierCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isIdentifier(sourceElement))
            {
                alert("Source element is not an identifier!");
                return commands;
            }

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.EvalIdentifier,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error while generating identifier commands:" + e);}

        return commands;
    },

    generateLiteralCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isLiteral(sourceElement))
            {
                alert("Source element is not a literal!");
                return commands;
            }

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.EvalLiteral,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error while generating identifier commands:" + e);}

        return commands;
    },

    generateArrayExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isArrayExpression(sourceElement))
            {
                alert("Source element is not an array expression!");
                return commands;
            }

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.StartArrayExpression,
                parentFunctionCommand
            ));

            sourceElement.elements.forEach(function(item)
            {
                if(item != null)
                {
                    ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(item, parentFunctionCommand));
                }

                commands.push(new Firecrow.Command
                (
                    item,
                    Firecrow.Command.COMMAND_TYPE.ArrayExpressionItemCreation,
                    parentFunctionCommand
                ));
            }, this);

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.EndArrayExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error while generating array expression commands:" + e);}

        return commands;
    },

    generateObjectExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isObjectExpression(sourceElement))
            {
                alert("Source element is not an object expression!");
                return commands;
            }

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.StartObjectExpression,
                parentFunctionCommand
            ));

            sourceElement.properties.forEach(function(property)
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(property.value));

                if(property.kind == "get" || property.kind == "set") { alert("Getters and setters not supported!"); }

                commands.push(new Firecrow.Command
                (
                    property,
                    Firecrow.Command.COMMAND_TYPE.ObjectPropertyCreation,
                    parentFunctionCommand
                ));
            }, this);

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.EndObjectExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error while generating object expression commands:" + e);}

        return commands;
    },

    generateFunctionExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isFunctionExpression(sourceElement))
            {
                alert("Source element is not a function expression!");
                return commands;
            }

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.FunctionExpressionCreation,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error while generating function expression commands:" + e);}

        return commands;
    },

    generateSequenceExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isSequenceExpression(sourceElement))
            {
                alert("Source element is not a sequence expression!");
                return commands;
            }

            sourceElement.expressions.forEach(function(expression)
            {
                ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(expression, parentFunctionCommand));
            }, this);

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.SequenceExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error while generating sequence expression commands:" + e);}

        return commands;
    },

    generateUnaryExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isUnaryExpression(sourceElement))
            {
                alert("Source element is not a unary expression!");
                return commands;
            }

            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.argument, parentFunctionCommand));

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.EvalUnaryExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error while generating unary expression commands:" + e);}

        return commands;
    },

    generateBinaryExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isBinaryExpression(sourceElement))
            {
                alert("Source element is not a binary expression!");
                return commands;
            }

            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.left, parentFunctionCommand));
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.right, parentFunctionCommand));

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.EvalBinaryExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error while generating binary expression commands:" + e);}

        return commands;
    },

    generateAssignmentExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isAssignmentExpression(sourceElement))
            {
                alert("Source element is not an assignment expression!");
                return commands;
            }

            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.right, parentFunctionCommand));
            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.left, parentFunctionCommand));

            commands.push(Firecrow.Command.CreateAssignmentCommand
            (
                sourceElement,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error while generating assignment expression commands:" + e);}

        return commands;
    },

    generateUpdateExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isUpdateExpression(sourceElement))
            {
                alert("Source element is not an update expression!");
                return commands;
            }

            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.argument, parentFunctionCommand));

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.EvalUpdateExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error while generating update expression commands:" + e);}

        return commands;
    },

    generateLogicalExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isLogicalExpression(sourceElement))
            {
                alert("Source element is not a logical expression!");
                return commands;
            }

            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.left, parentFunctionCommand));
            commands.push(new Firecrow.Command(sourceElement.left, Firecrow.Command.COMMAND_TYPE.EvalLogicalExpressionItem, parentFunctionCommand));

            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.right, parentFunctionCommand));
            commands.push(new Firecrow.Command(sourceElement.right, Firecrow.Command.COMMAND_TYPE.EvalLogicalExpressionItem, parentFunctionCommand));

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.EvalLogicalExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error while generating logical expression commands:" + e);}

        return commands;
    },

    generateConditionalExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isConditionalExpression(sourceElement))
            {
                alert("Source element is not a conditional expression!");
                return commands;
            }

            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands(sourceElement.test, parentFunctionCommand));

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.ExecuteConditionalExpressionBody,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error while generating conditional expression commands:" + e);}

        return commands;
    },

    generateConditionalExpressionExecuteBodyCommands: function(executeConditionalExpressionBodyCommand, willConsequentBeExecuted)
    {
        var commands = [];

        try
        {
            if(!executeConditionalExpressionBodyCommand.isConditionalExpressionBodyCommand(executeConditionalExpressionBodyCommand))
            {
                alert("Source element is not an execute conditional expression body command!");
                return commands;
            }

            var evalConditionalExpressionCommand = new Firecrow.Command
            (
                executeConditionalExpressionBodyCommand.codeConstruct,
                Firecrow.Command.COMMAND_TYPE.EvalConditionalExpression,
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
        catch(e) { alert("Error while generating conditional expression commands:" + e);}

        return commands;
    },

    generateNewExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isNewExpression(sourceElement))
            {
                alert("Source element is not a new expression!");
                return commands;
            }

            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
            (
                sourceElement.constructor,
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

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.EvalNewExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error while generating new expression commands:" + e);}

        return commands;
    },

    generateCallExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isCallExpression(sourceElement))
            {
                alert("Source element is not a call expression!");
                return commands;
            }

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

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.EvalCallExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error while generating call expression commands:" + e);}

        return commands;
    },

    generateMemberExpressionCommands: function(sourceElement, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isMemberExpression(sourceElement))
            {
                alert("Source element is not a member expression!");
                return commands;
            }

            ValueTypeHelper.pushAll(commands, this.generateExpressionCommands
            (
                sourceElement.object,
                parentFunctionCommand
            ));

            commands.push(new Firecrow.Command
            (
                sourceElement,
                Firecrow.Command.COMMAND_TYPE.EvalMemberExpression,
                parentFunctionCommand
            ));
        }
        catch(e) { alert("Error while generating member expression commands:" + e);}

        return commands;
    },

    toString: function(commands)
    {
        return commands.join("\n");
    }
};

Firecrow.Command = function(codeConstruct, type, parentFunctionCommand)
{
    this.id = Firecrow.Command.LAST_COMMAND_ID++;
    this.codeConstruct = codeConstruct;
    this.type = type;
    this.parentFunctionCommand = parentFunctionCommand;

    this.removesCommands = this.isEvalReturnExpressionCommand()
                        || this.isBreakCommand() || this.isContinueCommand()
                        || this.isEvalThrowCommand() || this.isEvalLogicalExpressionItemCommand()
                        || this.isCaseCommand();

    this.generatesNewCommands = this.isEvalThrowCommand() || this.isEvalCallbackFunctionCommand()
                            ||  this.isEvalNewExpression() || this.isEvalCallExpression()
                            ||  this.isLoopStatementCommand() || this.isIfStatementCommand()
                            ||  this.isConditionalExpressionBodyCommand() || this.isCaseCommand();
};

Firecrow.Command.CreateAssignmentCommand = function(codeConstruct, parentFunctionCommand)
{
    try
    {
        if(!astHelper.isVariableDeclarator(codeConstruct)
        && !astHelper.isAssignmentExpression(codeConstruct))
        {
            alert("Assignment command can only be created on variable declarators and assignement expressions!");
            return null;
        }

        var command = new Firecrow.Command(codeConstruct, Firecrow.Command.COMMAND_TYPE.EvalAssignmentExpression, parentFunctionCommand);

        if (astHelper.isVariableDeclarator(codeConstruct))
        {
            command.leftSide = codeConstruct.id;
            command.rightSide = codeConstruct.init;
            command.operator = "=";
        }
        else if (astHelper.isAssignmentExpression(codeConstruct))
        {
            command.leftSide = codeConstruct.left;
            command.rightSide = codeConstruct.right;
            command.operator = codeConstruct.operator.token;
        }

        return command;
    }
    catch(e) { alert("Error while creating assignment command: " + e);}
};

Firecrow.Command.LAST_COMMAND_ID = 0;

Firecrow.Command.prototype =
{
    isCaseCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.Case; },

    isIfStatementCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.IfStatement; },

    isLoopStatementCommand: function()
    {
        return this.isWhileStatement() || this.isDoWhileStatement()
            || this.isForStatementCommand() || this.isForInWhereCommand();
    },

    isWhileStatementCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.WhileStatement; },
    isDoWhileStatementCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.DoWhileStatement; },

    isForStatementCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.ForStatement; },
    isForStatementStartUpdateCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.StartForStatementUpdate; },
    isForInWhereCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.EvalForInWhere; },

    isStartTryStatementCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.StartTryStatement; },
    isEndTryStatementCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.EndTryStatement; },
    isTryStatementCommand: function() { return this.isStartTryStatementCommand() || this.isEndTryStatementCommand();},

    isConditionalExpressionBodyCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.ExecuteConditionalExpressionBody; },

    isEvalReturnExpressionCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.EvalReturnExpression; },
    isReturnFromFunctionCallCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.ReturnFromFunctionCall; },
    isEvalLogicalExpressionItemCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.EvalLogicalExpressionItem; },

    isEvalCallbackFunctionCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.EvalCallbackFunctionCommand; },

    isEvalNewExpression: function() { return this.type == Firecrow.Command.COMMAND_TYPE.EvalNewExpression; },
    isEvalCallExpression: function() { return this.type == Firecrow.Command.COMMAND_TYPE.EvalCallExpression; },

    isBreakCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.EvalBreak; },
    isContinueCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.EvalContinue; },
    isEvalThrowCommand: function() { return this.type = Firecrow.Command.COMMAND_TYPE.EvalThrowExpression; },

    getLineNo: function()
    {
        return this.codeConstruct != null && this.codeConstruct.loc != null ? this.codeConstruct.loc.start.line : -1;
    },
    toString: function() { return this.id + ":" + this.type + "@" + this.codeConstruct.loc.start.line; }
};

Firecrow.Command.COMMAND_TYPE =
{
    DeclareVariable: "DeclareVariable",
    DeclareFunction: "DeclareFunction",

    ThisExpression: "ThisExpression",

    StartArrayExpression: "StartArrayExpression",
    ArrayExpressionItemCreation: "ArrayExpressionItemCreation",
    EndArrayExpression: "EndArrayExpression",

    StartObjectExpression: "StartObjectExpression",
    ObjectPropertyCreation: "ObjectPropertyCreation",
    EndObjectExpression: "EndObjectExpression",

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

    EvalCallbackFunctionCommand: "EvalCallbackFunctionCommand",

    EvalLogicalExpression: "EvalLogicalExpression",
    EvalLogicalExpressionItem: "EvalLogicalExpressionItem",

    EvalConditionalExpression: "EvalConditionalExpression",
    EvalNewExpression: "EvalNewExpression",
    EvalCallExpression: "EvalCallExpression",
    EvalMemberExpression: "EvalMemberExpression",

    EvalReturnExpression: "EvalReturnExpression",
    ReturnFromFunctionCall: "ReturnFromFunctionCall",
    EvalThrowExpression: "EvalThrowExpression",

    EvalIdentifier: "EvalIdentifier",
    EvalLiteral: "EvalLiteral",

    IfStatement: "IfStatement",
    WhileStatement: "WhileStatement",
    DoWhileStatement: "DoWhileStatement",

    ForStatement: "ForStatement",

    StartForStatementUpdate: "StartForStatementUpdate",
    EndForStatementUpdate: "EndForStatementUpdate",

    StartForInStatement: "StartForInStatement",
    EndForInStatement: "EndForInStatement",
    EvalForInWhere: "EvalForInWhere",

    ExecuteConditionalExpressionBody: "ExecuteConditionalExpressionBody"
};

/*************************************************************************************/
}});