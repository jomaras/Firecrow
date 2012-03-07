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
                    ValueTypeHelper.pushAll(declarationCommands, Firecrow.CommandGenerator.generateDeclarationCommands(sourceElement));
                },
                true
            );

            astHelper.traverseDirectSourceElements
            (
                program,
                function(sourceElement)
                {
                    ValueTypeHelper.pushAll(executionCommands, Firecrow.CommandGenerator.generateExecutionCommands(sourceElement, null));
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

    generateIfStatementBodyCommands: function(sourceElement, conditionEvaluationResult, parentFunctionCommand)
    {
        var commands = [];

        try
        {
            if(!astHelper.isIfStatement(sourceElement))
            {
                alert("Source element is not if statement when generating commands");
                return [];
            }

            if(conditionEvaluationResult)
            {
                astHelper.traverseDirectSourceElements
                (
                    sourceElement.consequent,
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
                        sourceElement.alternate,
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

            commands.push(new Firecrow.Command(sourceElement, Firecrow.Command.COMMAND_TYPE.BreakStatement, parentFunctionCommand));
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

            commands.push(new Firecrow.Command(sourceElement, Firecrow.Command.COMMAND_TYPE.ContinueStatement, parentFunctionCommand));
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
            if(!astHelper.isTryStatement(sourceElement))
            {
                alert("Source element is not a try statement when generating commands");
                return;
            }

            var startTryCommand = new Firecrow.Command(sourceElement, Firecrow.Command.COMMAND_TYPE.StartTryStatement, parentFunctionCommand);
            commands.push(startTryCommand);

            astHelper.traverseDirectSourceElements
            (
                sourceElement.block,
                function(sourceElement)
                {
                    var blockCommands = Firecrow.CommandGenerator.generateExecutionCommands(sourceElement, parentFunctionCommand);
                    blockCommands.forEach(function(command) { command.tryBlock = startTryCommand; })
                    ValueTypeHelper.pushAll(commands, blockCommands);
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
        var commands = [];

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
    isWhileStatementCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.WhileStatement; },
    isDoWhileStatementCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.DoWhileStatement; },
    isForStatementCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.ForStatement; },
    isForInWhereCommand: function() { return this.type == Firecrow.Command.COMMAND_TYPE.EvalForInWhere; },
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
    EvalLogicalExpression: "EvalLogicalExpression",
    EvalConditionalExpression: "EvalConditionalExpression",
    EvalNewExpression: "EvalNewExpression",
    EvalCallExpression: "EvalCallExpression",
    EvalMemberExpression: "EvalMemberExpression",

    EvalReturnExpression: "EvalReturnExpression",
    EvalThrowExpression: "EvalThrowExpression",

    EvalIdentifier: "EvalIdentifier",
    EvalLiteral: "EvalLiteral",

    IfStatement: "IfStatement",
    WhileStatement: "WhileStatement",
    DoWhileStatement: "DoWhileStatement",
    ForStatement: "ForStatement",

    StartForInStatement: "StartForInStatement",
    EndForInStatement: "EndForInStatement",
    EvalForInWhere: "EvalForInWhere"
};

/*************************************************************************************/
}});