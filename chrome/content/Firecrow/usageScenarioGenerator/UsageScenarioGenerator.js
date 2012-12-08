FBL.ns(function() { with (FBL) {
/*****************************************************/
var fc = FBL.Firecrow;
var fcSymbolic = fc.Symbolic;
var fcValueTypeHelper = fc.ValueTypeHelper;
var ASTHelper = fc.ASTHelper;

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

Firecrow.UsageScenarioGenerator =
{
    generateUsageScenarios: function(pageModel)
    {
        ASTHelper.setParentsChildRelationships(pageModel);

        var usageScenarios = [new fc.UsageScenario([])];

        var browser = this._executeApplication(pageModel, usageScenarios);

        this._executeEvents(browser, usageScenarios);

        usageScenarios.coverage = this._calculateExpressionCoverage(pageModel);

        return usageScenarios;
    },

    _executeApplication: function(pageModel, usageScenarios)
    {
        var browser = new fc.DoppelBrowser.Browser(pageModel);
        fc.UsageScenarioGenerator.browser = browser;

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

            var domChanges = this._modifyDom(eventRegistration);

            this._logEvent(eventRegistration, args, domChanges, usageScenarios, browser);
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
        switch(eventRegistration.eventType)
        {
            case "onclick":
            case "onmousemove":
                return this._generateMouseHandlerArguments(eventRegistration, browser);
            case "onkeydown":
                return this._generateKeyHandlerArguments(eventRegistration, browser);
            default:
                break;
        }

        return [];
    },

    _modifyDom: function(eventRegistration)
    {
        return this._updateDomWithConstraintInfo(eventRegistration);
    },

    _generateMouseHandlerArguments: function(eventRegistration, browser)
    {
        var args = [];
        var fcModel = FBL.Firecrow.Interpreter.Model;
        var fcSymbolic = FBL.Firecrow.Symbolic;

        var eventInfo = {};
        var eventInfoFcObject = new fcModel.Event(eventInfo, browser.globalObject, eventRegistration.thisObject);

        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "target", null, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "currentTarget", null, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "pageX", 0, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "pageY", 0, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "clientX", 0, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "clientY", 0, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "screenX", 0, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "screenY", 0, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "type", eventRegistration.eventType, browser);

        this._updateWithConstraintInfo(eventInfo, eventInfoFcObject, eventRegistration, browser);

        args.push(new fcModel.fcValue(eventInfo, eventInfoFcObject, null));

        return args;
    },

    _generateKeyHandlerArguments: function(eventRegistration, browser)
    {
        var args = [];
        var fcModel = FBL.Firecrow.Interpreter.Model;
        var fcSymbolic = FBL.Firecrow.Symbolic;

        var eventInfo = {};
        var eventInfoFcObject = new fcModel.Event(eventInfo, browser.globalObject, eventRegistration.thisObject);

        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "altKey", false, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "bubbles", true, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "cancelBubble", false, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "cancelable", true, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "charCode", 0, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "ctrlKey", false, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "currentTarget", null, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "detail", 0, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "eventPhase", 0, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "explicitOriginalTarget", null, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "isChar", false, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "isTrusted", true, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "keyCode", 0, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "layerX", 0, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "layerY", 0, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "rangeOffset", 0, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "rangeParent", 0, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "shiftKey", false, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "target", null, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "type", eventRegistration.eventType, browser);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "which", 0, browser);

        this._updateWithConstraintInfo(eventInfo, eventInfoFcObject, eventRegistration, browser);

        args.push(new fcModel.fcValue(eventInfo, eventInfoFcObject, null));

        return args;
    },

    _addEventObjectProperty: function(eventInfo, eventInfoFcObject, propertyName, propertyValue, browser)
    {
        eventInfo[propertyName] = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, propertyValue, new fcSymbolic.Identifier(propertyName));
        eventInfoFcObject.addProperty(propertyName, eventInfo[propertyName]);
    },

    _updateWithConstraintInfo: function(eventInfo, eventInfoFcObject, eventRegistration, browser)
    {
        if(eventRegistration == null || eventRegistration.executionInfos == null || eventRegistration.executionInfos.length == 0 || eventInfo == null || eventInfoFcObject == null) { return; }

        var constraintResult = this._getResolvedLastConstraint(eventRegistration);

        if(constraintResult != null)
        {
            eventInfo[constraintResult.identifier] = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, constraintResult.value, new fcSymbolic.Identifier(constraintResult.identifier));
            eventInfoFcObject.addProperty(constraintResult.identifier, eventInfo[constraintResult.identifier]);
        }
    },

    _updateDomWithConstraintInfo: function(eventRegistration)
    {
        var lastExecutionInfo = this._getLastExecutionInfo(eventRegistration);
        var constraintResult = this._getResolvedLastConstraint(eventRegistration);

        if(constraintResult == null || constraintResult.htmlElement == null) { return []; }

        if(constraintResult.htmlElement instanceof HTMLSelectElement) { return this._updateSelectElement(constraintResult); }
    },

    _updateSelectElement: function(constraintResult)
    {
        var propName = constraintResult.identifier;
        var selectElement = constraintResult.htmlElement;
        var oldValue = selectElement[propName];

        var newValue = this._getFirstNonEqualValue(selectElement[propName], this._getSelectAvailableValues(selectElement));
        selectElement[propName] = newValue;

        return [{htmlElement: selectElement, oldValue: oldValue, newValue: newValue}];
    },

    _getFirstNonEqualValue: function(item, items)
    {
        for(var i = 0; i < items.length; i++)
        {
            if(items[i] != item) { return items[i]; }
        }

        return null;
    },

    _getSelectAvailableValues: function(selectElement)
    {
        var values = [];
        if(selectElement == null) { return values; }

        for(var i = 0; i < selectElement.children.length; i++)
        {
            values.push(selectElement.children[i].value);
        }

        return values;
    },

    _getResolvedLastConstraint: function(eventRegistration)
    {
        var lastPathConstraint = this._getLastConstraint(this._getLastExecutionInfo(eventRegistration));

        if(lastPathConstraint == null) { return null; }

        return fcSymbolic.ConstraintResolver.resolveInverse(lastPathConstraint.constraint);
    },

    _getLastConstraint: function(executionInfo)
    {
        if(executionInfo == null) { return null; }

        return executionInfo.pathConstraint.constraints[executionInfo.pathConstraint.constraints.length - 1];
    },

    _getLastExecutionInfo: function(eventRegistration)
    {
        if(eventRegistration == null || eventRegistration.executionInfos == null || eventRegistration.executionInfos.length == 0) { return null; }

        return eventRegistration.executionInfos[eventRegistration.executionInfos.length - 1];
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
            this._logEvent(loadingEvent, [], [], usageScenarios, browser);
        }, this);
    },

    _logEvent: function(event, args, domChanges, usageScenarios, browser)
    {
        usageScenarios[usageScenarios.length-1].addEvent(this._generateUsageScenarioEvent(event, args, domChanges, browser));
    },

    _generateUsageScenarioEvent: function(event, args, domChanges, browser)
    {
        var baseObject = "";

             if(event.thisObject == browser.globalObject) { baseObject = "window"; }
        else if(event.thisObject == browser.globalObject.document) { baseObject = "document"; }
        else if(event.thisObject.htmlElement != null) { baseObject += this._generateHtmlElementString(event.thisObject.htmlElement); }
        else { baseObject = "unknown"; }

        var additionalInfo = "";

        if(domChanges != null && domChanges.length != 0)
        {
            additionalInfo += "{";
            for(var i = 0; i < domChanges.length; i++)
            {
                var domChange = domChanges[i];
                additionalInfo += this._generateHtmlElementString(domChange.htmlElement) + " " + domChange.oldValue + " -> " + domChange.newValue;
            }
            additionalInfo += "}";
        }

        additionalInfo += "[";

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

    _generateHtmlElementString: function(htmlElement)
    {
        if(htmlElement == null) { return ""; }

        var string = htmlElement.tagName.toLowerCase();

        if(htmlElement.id) { string += "#" + htmlElement.id; }
        if(htmlElement.className) { string += "." + htmlElement.className; }

        return string;
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
/*****************************************************/
}});
