/**
 * User: Jomaras
 * Date: 05.11.12.
 * Time: 09:21
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcCommands = Firecrow.Interpreter.Commands;
var ASTHelper = Firecrow.ASTHelper;

Firecrow.Interpreter.Commands.Command = function(codeConstruct, type, parentFunctionCommand)
{
    this.id = fcCommands.Command.LAST_COMMAND_ID++;
    this.codeConstruct = codeConstruct;
    this.type = type;
    this.parentFunctionCommand = parentFunctionCommand;

    this.removesCommands = this.isEvalReturnExpressionCommand() || this.isEvalBreakCommand() || this.isEvalContinueCommand()
                        || this.isEvalThrowExpressionCommand() || this.isEvalLogicalExpressionItemCommand();

    this.generatesNewCommands = this.isEvalCallbackFunctionCommand() ||  this.isEvalNewExpressionCommand() || this.isEvalCallExpressionCommand()
                             || this.isLoopStatementCommand() || this.isIfStatementCommand() ||  this.isEvalConditionalExpressionBodyCommand()
                             || this.isCaseCommand() || this.isCallCallbackMethodCommand() || this.isConvertToPrimitiveCommand();
};

Firecrow.Interpreter.Commands.Command.LAST_COMMAND_ID = 0;

Firecrow.Interpreter.Commands.Command.notifyError = function(message) { debugger; alert("Command - " + message); }

Firecrow.Interpreter.Commands.Command.createAssignmentCommand = function(codeConstruct, parentFunctionCommand)
{
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
    else
    {
        this.notifyError("Assignment command can only be created on variable declarators and assignment expressions!");
    }

    return command;
};

Firecrow.Interpreter.Commands.Command.createEnterFunctionContextCommand = function(functionObject, thisObject, parentFunctionCommand)
{
    var command = new fcCommands.Command(functionObject.codeConstruct, fcCommands.Command.COMMAND_TYPE.EnterFunctionContext, parentFunctionCommand);

    if(functionObject == null || !ASTHelper.isFunction(functionObject.codeConstruct))
    {
        debugger;
        this.notifyError("Callee code construct has to be a function");
    }

    command.callee = functionObject;
    command.thisObject = thisObject;

    if(functionObject.iValue.bounder != null && functionObject.iValue.bounder.jsValue != null)
    {
        command.thisObject = functionObject.iValue.bounder;
    }

    return command;
};

Firecrow.Interpreter.Commands.Command.createEnterEventHandlerContextCommand = function(handlerInfo)
{
    var command = new fcCommands.Command(handlerInfo.functionHandler.codeConstruct, fcCommands.Command.COMMAND_TYPE.EnterFunctionContext, null);

    command.callee = handlerInfo.functionHandler;
    command.thisObject = handlerInfo.thisObject;
    command.argumentValues = handlerInfo.argumentValues;
    command.codeConstruct = handlerInfo.registrationPoint.codeConstruct;
    command.isEnterEventHandler = true;

    return command;
};

Firecrow.Interpreter.Commands.Command.createExitFunctionContextCommand = function(functionObject, parentFunctionCommand)
{
    return new fcCommands.Command(functionObject.codeConstruct, fcCommands.Command.COMMAND_TYPE.ExitFunctionContext, parentFunctionCommand);
};

Firecrow.Interpreter.Commands.Command.createObjectPropertyCommand = function(codeConstruct, objectExpressionCommand, parentFunctionCommand)
{
    var command = new fcCommands.Command(codeConstruct, fcCommands.Command.COMMAND_TYPE.ObjectPropertyCreation, parentFunctionCommand );

    command.objectExpressionCommand = objectExpressionCommand;

    return command;
};

Firecrow.Interpreter.Commands.Command.createArrayExpressionItemCommand = function(codeConstruct, arrayExpressionCommand, parentFunctionCommand)
{
    var command = new fcCommands.Command(codeConstruct, fcCommands.Command.COMMAND_TYPE.ArrayExpressionItemCreation, parentFunctionCommand);

    command.arrayExpressionCommand = arrayExpressionCommand;

    return command;
};

Firecrow.Interpreter.Commands.Command.createForInWhereCommand = function(codeConstruct, currentPropertyIndex, parentFunctionCommand)
{
    var newForInWhereCommand = new fcCommands.Command(codeConstruct, fcCommands.Command.COMMAND_TYPE.EvalForInWhere, parentFunctionCommand);

    newForInWhereCommand.currentPropertyIndex  = currentPropertyIndex;

    return newForInWhereCommand;
};

Firecrow.Interpreter.Commands.Command.createCallInternalConstructorCommand = function(codeConstruct, functionObject, parentFunctionCommand)
{
    var command = new fcCommands.Command(codeConstruct, fcCommands.Command.COMMAND_TYPE.CallInternalConstructor, parentFunctionCommand);

    command.functionObject = functionObject;

    return command;
};

Firecrow.Interpreter.Commands.Command.createCallInternalConstructorCommand = function(codeConstruct, functionObject, parentFunctionCommand)
{
    var command = new fcCommands.Command(codeConstruct, fcCommands.Command.COMMAND_TYPE.CallInternalConstructor, parentFunctionCommand);

    command.functionObject = functionObject;

    return command;
};

Firecrow.Interpreter.Commands.Command.createCallInternalFunctionCommand = function(codeConstruct, functionObject, thisObject, parentFunctionCommand, parentCallExpressionCommand)
{
    var command = new fcCommands.Command(codeConstruct, fcCommands.Command.COMMAND_TYPE.CallInternalFunction, parentFunctionCommand);

    command.functionObject = functionObject;
    command.thisObject = thisObject;

    command.parentCallExpressionCommand = parentCallExpressionCommand;

    return command;
};

Firecrow.Interpreter.Commands.Command.createCallCallbackMethodCommand = function(codeConstruct, callCommand, parentFunctionCommand)
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
};

Firecrow.Interpreter.Commands.Command.createExecuteCallbackCommand = function(callCallbackCommand, arguments, index)
{
    var command = new fcCommands.Command(callCallbackCommand.callbackFunction.codeConstruct, fcCommands.Command.COMMAND_TYPE.ExecuteCallback, callCallbackCommand.parentFunctionCommand);

    command.callbackFunction = callCallbackCommand.callbackFunction;
    command.callbackArgumentGroups = callCallbackCommand.callbackArgumentGroups;
    command.thisObject = callCallbackCommand.thisObject;
    command.originatingObject = callCallbackCommand.originatingObject;
    command.callerFunction = callCallbackCommand.callerFunction;
    command.targetObject = callCallbackCommand.targetObject;
    command.arguments = arguments;
    command.callCallbackCommand = callCallbackCommand;
    command.index = index;

    return command;
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
    isEndEvalConditionalExpressionCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.EndEvalConditionalExpression; },
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

    isLoopStatementCommand: function() { return this.isWhileStatementCommand() || this.isDoWhileStatementCommand() || this.isForStatementCommand() || this.isEvalForInWhereCommand();},

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

    isConvertToPrimitiveCommand: function() { return this.type == fcCommands.Command.COMMAND_TYPE.ConvertToPrimitive; },

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
    EndEvalConditionalExpression: "EndEvalConditionalExpression",
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

    ExecuteCallback: "ExecuteCallback",

    ConvertToPrimitive: "ConvertToPrimitive"
};
/*************************************************************************************/
}});
