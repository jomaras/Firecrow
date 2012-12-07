FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcValueTypeHelper = Firecrow.ValueTypeHelper;
Firecrow.UsageScenarioGenerator =
{
    generateUsageScenarios: function(pageModel)
    {
        var Firecrow = FBL.Firecrow;

        Firecrow.ASTHelper.setParentsChildRelationships(pageModel);

        var usageScenarios = [new Firecrow.UsageScenario([])];

        var browser = this._executeApplication(pageModel, usageScenarios);

        this._executeEvents(browser, usageScenarios);

        usageScenarios.coverage = this._calculateExpressionCoverage(pageModel);

        return usageScenarios;
    },

    _executeApplication: function(pageModel, usageScenarios)
    {
        var browser = new FBL.Firecrow.DoppelBrowser.Browser(pageModel);
        FBL.Firecrow.UsageScenarioGenerator.browser = browser;

        browser.evaluatePage();

        this._performLoadingEvents(browser, usageScenarios);

        return browser;
    },

    _executeEvents: function(browser, usageScenarios)
    {
        var eventHandlingRegistrations = browser.globalObject.htmlElementEventHandlingRegistrations;

        for(var i = 0; i < eventHandlingRegistrations.length;)
        {
            var eventRegistration = eventHandlingRegistrations[i];
            var args = this._getArguments(eventRegistration, browser);

            if(!this._shouldPerformAnotherExecution(eventRegistration)) { i++; continue; }

            this._logEvent(eventRegistration, args, usageScenarios, browser);
            browser.executeEvent(eventRegistration, args);

            eventRegistration.executionInfos.push(browser.getLastExecutionInfo());
        }
    },

    _shouldPerformAnotherExecution: function(eventRegistration)
    {
        if(eventRegistration.executionInfos.length == 0) { return true; }

        var lastExecutionInfo = eventRegistration.executionInfos[eventRegistration.executionInfos.length - 1];

        if(lastExecutionInfo.coverage == 1) { return false; }

        var nextToLastExecutionInfo = eventRegistration.executionInfos[eventRegistration.executionInfos.length - 2];

        if(nextToLastExecutionInfo == null) { return true; }

        return nextToLastExecutionInfo.coverage < lastExecutionInfo.coverage;
    },

    _getArguments: function(eventRegistration, browser)
    {
        if(eventRegistration.eventType == "onclick")
        {
            return this._generateClickHandlerArguments(eventRegistration, browser);
        }
        else if (eventRegistration.eventType == "onkeydown")
        {
            return this._generateKeyHandlerArguments(eventRegistration, browser, "keydown");
        }

        return [];
    },

    _generateClickHandlerArguments: function(eventRegistration, browser)
    {
        var args = [];
        var fcModel = FBL.Firecrow.Interpreter.Model;
        var fcSymbolic = FBL.Firecrow.Symbolic;

        var eventInfo = {};
        var eventInfoFcObject = new fcModel.Event(eventInfo, browser.globalObject, eventRegistration.thisObject);

        eventInfo.target = null;
        eventInfoFcObject.addProperty("target", new fcModel.fcValue(null));

        eventInfo.currentTarget = null;
        eventInfoFcObject.addProperty("currentTarget", new fcModel.fcValue(null));

        eventInfo.clientX = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, 0, new fcSymbolic.Identifier("clientX"));
        eventInfoFcObject.addProperty("clientX", eventInfo.clientX);

        eventInfo.clientY = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, 0, new fcSymbolic.Identifier("clientY"));
        eventInfoFcObject.addProperty("clientY", eventInfo.clientY);

        eventInfo.screenX = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, 0, new fcSymbolic.Identifier("screenX"));
        eventInfoFcObject.addProperty("screenX", eventInfo.screenX);

        eventInfo.screenY = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, 0, new fcSymbolic.Identifier("screenY"));
        eventInfoFcObject.addProperty("screenY", eventInfo.screenY);

        eventInfo.type = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, "click");
        eventInfoFcObject.addProperty("type", eventInfo.type);

        this._updateWithConstraintInfo(eventInfo, eventInfoFcObject, eventRegistration, browser);

        args.push(new fcModel.fcValue(eventInfo, eventInfoFcObject, null));

        return args;
    },

    _generateKeyHandlerArguments: function(eventRegistration, browser, handlerType)
    {
        var args = [];
        var fcModel = FBL.Firecrow.Interpreter.Model;
        var fcSymbolic = FBL.Firecrow.Symbolic;

        var eventInfo = {};
        var eventInfoFcObject = new fcModel.Event(eventInfo, browser.globalObject, eventRegistration.thisObject);

        eventInfo.altKey = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, false, new fcSymbolic.Identifier("altKey"));
        eventInfoFcObject.addProperty("altKey", eventInfo.altKey);

        eventInfo.bubbles = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, true, new fcSymbolic.Identifier("bubbles"));
        eventInfoFcObject.addProperty("bubbles", eventInfo.bubbles);

        eventInfo.cancelBubble = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, false, new fcSymbolic.Identifier("cancelBubble"));
        eventInfoFcObject.addProperty("cancelBubble", eventInfo.cancelBubble);

        eventInfo.cancelable = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, true, new fcSymbolic.Identifier("cancelable"));
        eventInfoFcObject.addProperty("cancelable", eventInfo.cancelable);

        eventInfo.charCode = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, 0, new fcSymbolic.Identifier("charCode"));
        eventInfoFcObject.addProperty("charCode", eventInfo.charCode);

        eventInfo.ctrlKey = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, false, new fcSymbolic.Identifier("ctrlKey"));
        eventInfoFcObject.addProperty("ctrlKey", eventInfo.ctrlKey);

        eventInfo.currentTarget = null;
        eventInfoFcObject.addProperty("currentTarget", new fcModel.fcValue(null));

        eventInfo.detail = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, 0, new fcSymbolic.Identifier("detail"));
        eventInfoFcObject.addProperty("detail", eventInfo.detail);

        eventInfo.eventPhase = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, 0, new fcSymbolic.Identifier("eventPhase"));
        eventInfoFcObject.addProperty("eventPhase", eventInfo.eventPhase);

        eventInfo.explicitOriginalTarget = null;
        eventInfoFcObject.addProperty("explicitOriginalTarget", new fcModel.fcValue(null));

        eventInfo.isChar = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, false, new fcSymbolic.Identifier("isChar"));
        eventInfoFcObject.addProperty("isChar", eventInfo.isChar);

        eventInfo.isTrused = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, true, new fcSymbolic.Identifier("isTrusted"));
        eventInfoFcObject.addProperty("isTrusted", eventInfo.isTrusted);

        eventInfo.keyCode = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, 0, new fcSymbolic.Identifier("keyCode"));
        eventInfoFcObject.addProperty("keyCode", eventInfo.keyCode);

        eventInfo.layerX = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, 0, new fcSymbolic.Identifier("layerX"));
        eventInfoFcObject.addProperty("layerX", eventInfo.layerX);

        eventInfo.layerY = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, 0, new fcSymbolic.Identifier("layerY"));
        eventInfoFcObject.addProperty("layerY", eventInfo.layerY);

        eventInfo.rangeOffset = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, 0, new fcSymbolic.Identifier("rangeOffset"));
        eventInfoFcObject.addProperty("rangeOffset", eventInfo.rangeOffset);

        eventInfo.rangeParent = null;
        eventInfoFcObject.addProperty("rangeParent", new fcModel.fcValue(null));

        eventInfo.shiftKey = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, false, new fcSymbolic.Identifier("shiftKey"));
        eventInfoFcObject.addProperty("shiftKey", eventInfo.shiftKey);

        eventInfo.target = null;
        eventInfoFcObject.addProperty("target", new fcModel.fcValue(null));

        eventInfo.type = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, handlerType, new fcSymbolic.Identifier("type"));
        eventInfoFcObject.addProperty("type", eventInfo.type);

        eventInfo.which = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, 0, new fcSymbolic.Identifier("which"));
        eventInfoFcObject.addProperty("which", eventInfo.which);

        this._updateWithConstraintInfo(eventInfo, eventInfoFcObject, eventRegistration, browser);

        args.push(new fcModel.fcValue(eventInfo, eventInfoFcObject, null));

        return args;
    },

    _updateWithConstraintInfo: function(eventInfo, eventInfoFcObject, eventRegistration, browser)
    {
        if(eventRegistration == null || eventRegistration.executionInfos == null || eventRegistration.executionInfos.length == 0 || eventInfo == null || eventInfoFcObject == null) { return; }

        var lastExecutionInfo =  eventRegistration.executionInfos[eventRegistration.executionInfos.length - 1];
        var lastPathConstraint = lastExecutionInfo.pathConstraint.constraints[lastExecutionInfo.pathConstraint.constraints.length - 1];

        if(lastPathConstraint == null) { return; }

        var constraintResult = fcSymbolic.ConstraintResolver.resolveInverseConstraint(lastPathConstraint.constraint);

        if(constraintResult != null)
        {
            eventInfo[constraintResult.identifier] = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, constraintResult.value, new fcSymbolic.Identifier(constraintResult.identifier));
            eventInfoFcObject.addProperty(constraintResult.identifier, eventInfo[constraintResult.identifier]);
        }
    },

    _performLoadingEvents: function(browser, usageScenarios)
    {
        var loadingEvents = browser.globalObject.getLoadedHandlers();

        this._logLoadingEvents(loadingEvents, usageScenarios, browser);

        loadingEvents.forEach(function(loadingEvent)
        {
            browser.executeEvent(loadingEvent);
        }, this);
    },

    _logLoadingEvents:function (loadingEvents, usageScenarios, browser)
    {
        loadingEvents.forEach(function (loadingEvent)
        {
            this._logEvent(loadingEvent, [], usageScenarios, browser);
        }, this);
    },

    _logEvent: function(event, args, usageScenarios, browser)
    {
        usageScenarios[usageScenarios.length-1].addEvent(this._generateUsageScenarioEvent(event, args, browser));
    },

    _generateUsageScenarioEvent: function(event, args, browser)
    {
        var baseObject = "";

             if(event.thisObject == browser.globalObject) { baseObject = "window"; }
        else if(event.thisObject == browser.globalObject.document) { baseObject = "document"; }
        else if(event.thisObject.htmlElement != null)
        {
            var htmlElement = event.thisObject.htmlElement;

            baseObject += htmlElement.tagName.toLowerCase();
            if(htmlElement.id) { baseObject += "#" + htmlElement.id; }
            if(htmlElement.className) { baseObject += "." + htmlElement.className; }
        }
        else { baseObject = "unknown"; }

        var additionalInfo = "[";

        for(var i = 0; i < args.length; i++)
        {
            var arg = args[0];

            for(var prop in arg.jsValue)
            {
                if(arg.jsValue[prop] != null)
                {
                    additionalInfo += prop + " = " + arg.jsValue[prop].jsValue + "; ";
                }
            }
        }

        additionalInfo += "]";

        return new FBL.Firecrow.UsageScenarioEvent(event.eventType, baseObject, additionalInfo);
    },

    _calculateExpressionCoverage: function(pageModel)
    {
        var ASTHelper = FBL.Firecrow.ASTHelper;
        var scripts = ASTHelper.getScriptElements(pageModel.htmlElement);

        var totalNumberOfExpressions = 0;
        var executedNumberOfExpressions = 0;

        for(var i = 0; i < scripts.length; i++)
        {
            var script = scripts[i];

            ASTHelper.traverseAst(script.pathAndModel.model, function(astElement)
            {
                if(ASTHelper.isExpression(astElement))
                {
                    totalNumberOfExpressions++;
                    if(astElement.hasBeenExecuted)
                    {
                        executedNumberOfExpressions++;
                    }
                }
            });
        }

        return executedNumberOfExpressions/totalNumberOfExpressions;
    },

    notifyError: function(message) { alert("UsageScenarioGenerator Error: " + message); }
};

Firecrow.UsageScenario = function(events)
{
    this.events = events || [];
};

Firecrow.UsageScenario.prototype =
{
    addEvent: function(usageScenarioEvent)
    {
        this.events.push(usageScenarioEvent);
    }
};

Firecrow.UsageScenarioEvent = function(type, baseObject, argumentsInfo)
{
    this.type = type;
    this.baseObject = baseObject;
    this.argumentsInfo = argumentsInfo;
};

//https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API
/*
- Expression
    - ThisExpression ?
    - Identifier
    - Literal
    - SequenceExpression
        - expressions: [Expression]
    - UnaryExpression
        - operator: UnaryOperator (- + ! ~ typeof void delete)
        - prefix: boolean
        - argument: Expression
    - BinaryExpression
        - operator: BinaryOperator (!= === !== < <= > >= << >> >>> + - * / % | ^ in instanceof ..)
        - left: Expression
        - right: Expression
    - UpdateExpression
        - operator: UpdateOperator ++ --
        - prefix: boolean
        - argument: Expression
    - LogicalExpression
        - operator (&& ||)
        - left: Expression
        - right: Expression
    - ConditionalExpression ?
        - test: Expression
        - alternate: Expression
        - consequent: Expression
    - MemberExpression ?
        - object: Expression
        - property: Identifier | Expression
* */
Firecrow.Symbolic =
{
    CONST:
    {
        IDENTIFIER: "Identifier",
        LITERAL: "Literal",
        SEQUENCE: "Sequence",
        UNARY: "Unary",
        BINARY: "Binary",
        UPDATE: "Update",
        LOGICAL: "Logical"
    }
};
var fcSymbolic = Firecrow.Symbolic;

fcSymbolic.Expression = function(){};
fcSymbolic.Expression.isIdentifier = function(expression) { return this.isOfType(expression, fcSymbolic.CONST.IDENTIFIER); }
fcSymbolic.Expression.isLiteral = function(expression) { return this.isOfType(expression, fcSymbolic.CONST.LITERAL); }
fcSymbolic.Expression.isSequence = function(expression) { return this.isOfType(expression, fcSymbolic.CONST.SEQUENCE); }
fcSymbolic.Expression.isUnary = function(expression) { return this.isOfType(expression, fcSymbolic.CONST.UNARY); }
fcSymbolic.Expression.isBinary = function(expression) { return this.isOfType(expression, fcSymbolic.CONST.BINARY); }
fcSymbolic.Expression.isUpdate = function(expression) { return this.isOfType(expression, fcSymbolic.CONST.UPDATE); }
fcSymbolic.Expression.isLogical = function(expression) { return this.isOfType(expression, fcSymbolic.CONST.LOGICAL); }
fcSymbolic.Expression.isOfType = function(expression, type) { return expression != null && expression.type == type; }

fcSymbolic.Identifier = function(name)
{
    this.name = name;

    this.type = fcSymbolic.CONST.IDENTIFIER;
};

fcSymbolic.Literal = function(value)
{
    this.value = value;

    this.type = fcSymbolic.CONST.LITERAL;
};

fcSymbolic.Sequence = function(expressions)
{
    this.expressions = expressions;

    this.type = fcSymbolic.CONST.SEQUENCE;
};

fcSymbolic.Unary = function(argument, operator, prefix)
{
    this.argument = argument;
    this.operator = operator;
    this.prefix = prefix;

    this.type = fcSymbolic.CONST.UNARY;
};

fcSymbolic.Binary = function(left, right, operator)
{
    this.left = left;
    this.right = right;
    this.operator = operator;

    this.type = fcSymbolic.CONST.BINARY;
};

fcSymbolic.Update = function(argument, operator, prefix)
{
    this.argument = argument;
    this.operator = operator;
    this.prefix = prefix;

    this.type = fcSymbolic.CONST.UPDATE;
};

fcSymbolic.Logical = function(left, right, operator)
{
    this.left = left;
    this.right = right;
    this.operator = operator;

    this.type = fcSymbolic.CONST.LOGICAL;
};

fcSymbolic.SymbolicExecutor =
{
    evalBinaryExpression: function(left, right, operator)
    {
        if(left == null || right == null) { return null;}
        if(left.isNotSymbolic() && right.isNotSymbolic()) { return null; }

        return new fcSymbolic.Binary(left.symbolicValue, right.symbolicValue, operator);
    }
};

fcSymbolic.PathConstraintItem = function(codeConstruct, constraint)
{
    this.codeConstruct = codeConstruct;
    this.constraint = constraint;
};

fcSymbolic.PathConstraint = function()
{
    this.constraints = [];
    this.visitedFunctions = {};
};

fcSymbolic.PathConstraint.prototype =
{
    addConstraint: function(codeConstruct, constraint)
    {
        this.constraints.push(new fcSymbolic.PathConstraintItem(codeConstruct, constraint));
    }
};

fcSymbolic.ConstraintResolver =
{
    resolveConstraint: function(pathConstraintItem)
    {
        if(fcSymbolic.Expression.isBinary(pathConstraintItem)) { return this._resolveBinaryConstraint(pathConstraintItem); }
        else
        {
            alert("Unhandled constraint");
        }
    },

    resolveInverseConstraint: function(pathConstraintItem)
    {
        return this.resolveConstraint(this.getInverseConstraint(pathConstraintItem));
    },

    _resolveBinaryConstraint: function(constraint)
    {
        if(!fcSymbolic.Expression.isIdentifier(constraint.left) || !fcSymbolic.Expression.isLiteral(constraint.right)
        || !fcValueTypeHelper.isNumber(constraint.right.value))
        {
            alert("Don't know how to handle the expression in binary expression");
            return;
        }

        if(constraint.operator == "<")
        {
            return { identifier: constraint.left.name, value: fcValueTypeHelper.getRandomInt(-100000, constraint.right.value - 1)}; //TODO - Lowest number HACK
        }
        else if(constraint.operator == ">")
        {
            return { identifier: constraint.left.name, value: fcValueTypeHelper.getRandomInt(constraint.right.value + 1, 100000)}; //TODO - Highest number HACK
        }
        else if(constraint.operator == "<=")
        {
            return { identifier: constraint.left.name, value: fcValueTypeHelper.getRandomInt(-100000, constraint.right.value)}; //TODO - Lowest number HACK
        }
        else if(constraint.operator == ">=")
        {
            return { identifier: constraint.left.name, value: fcValueTypeHelper.getRandomInt(constraint.right.value, 100000)}; //TODO - Highest number HACK
        }

        alert("Don't know how to handle binary constraint");
    },

    getInverseConstraint: function(pathConstraintItem)
    {
        if(pathConstraintItem == null) { return null; }

        if(fcSymbolic.Expression.isBinary(pathConstraintItem)) { return this._getBinaryInverseConstraint(pathConstraintItem); }
        else
        {
            alert("Unhandled constraint");
        }
    },

    _getBinaryInverseConstraint: function(pathConstraintItem)
    {
             if(pathConstraintItem.operator == "<") { return new fcSymbolic.Binary(pathConstraintItem.left, pathConstraintItem.right, ">="); }
        else if(pathConstraintItem.operator == ">") { return new fcSymbolic.Binary(pathConstraintItem.left, pathConstraintItem.right, "<="); }
        else if(pathConstraintItem.operator == "<=") { return new fcSymbolic.Binary(pathConstraintItem.left, pathConstraintItem.right, ">"); }
        else if(pathConstraintItem.operator == ">=") { return new fcSymbolic.Binary(pathConstraintItem.left, pathConstraintItem.right, "<"); }
        else
        {
            alert("Unhandled Binary inverse constraint");
        }
    }
};
/*****************************************************/
}});
