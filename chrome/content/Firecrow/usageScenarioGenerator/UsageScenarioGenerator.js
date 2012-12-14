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
        var intervalEvents = browser.globalObject.intervalHandlers;

        for(var i = 0; i < intervalEvents.length; i++)
        {
            var eventRegistration = intervalEvents[i];
            var domChanges = [];
            this._logEvent(eventRegistration, eventRegistration.callArguments, domChanges, usageScenarios, browser);
            browser.executeEvent(eventRegistration, eventRegistration.callArguments);
        }

        for(var i = 0; i < eventHandlingRegistrations.length;)
        {
            var eventRegistration = eventHandlingRegistrations[i];

            if(!this._shouldPerformAnotherExecution(eventRegistration)) { i++; continue; }

            var executionInfo = this._getLastExecutionInfo(eventRegistration);

            if(executionInfo != null)
            {
                executionInfo.pathConstraint.resolve();
            }

            var args = this._getArguments(eventRegistration, browser);
            var domChanges = this._modifyDom(eventRegistration);

            this._logEvent(eventRegistration, args, domChanges, usageScenarios, browser);
            browser.executeEvent(eventRegistration, args);

            eventRegistration.executionInfos.push(browser.getLastExecutionInfo());
        }

        for(var i = 0; i < intervalEvents.length; i++)
        {
            var eventRegistration = intervalEvents[i];
            var domChanges = [];
            this._logEvent(eventRegistration, eventRegistration.callArguments, domChanges, usageScenarios, browser);

            if(this._shouldPerformAnotherExecution(eventRegistration))
            {
                browser.executeEvent(eventRegistration, eventRegistration.callArguments);
            }
        }
    },

    _shouldPerformAnotherExecution: function(eventRegistration)
    {
        if(eventRegistration.executionInfos.length == 0) { return true; }

        var lastExecutionInfo = eventRegistration.executionInfos[eventRegistration.executionInfos.length - 1];

        if(lastExecutionInfo.coverage == 1) { return false; }

        var nextToLastExecutionInfo = eventRegistration.executionInfos[eventRegistration.executionInfos.length - 2];

        if(nextToLastExecutionInfo == null) { return true; }

        var result = nextToLastExecutionInfo.coverage < lastExecutionInfo.coverage;

        return result;
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

        var eventInfo = {};
        var eventInfoFcObject = new fcModel.Event(eventInfo, browser.globalObject, eventRegistration.thisObject);

        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "target", null, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "currentTarget", null, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "pageX", 0, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "pageY", 0, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "clientX", 0, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "clientY", 0, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "screenX", 0, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "screenY", 0, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "type", eventRegistration.eventType, browser, eventRegistration.executionInfos.length);

        this._updateWithConstraintInfo(eventInfo, eventInfoFcObject, eventRegistration, browser);

        args.push(new fcModel.fcValue(eventInfo, eventInfoFcObject, null));

        return args;
    },

    _generateKeyHandlerArguments: function(eventRegistration, browser)
    {
        var args = [];
        var fcModel = FBL.Firecrow.Interpreter.Model;

        var eventInfo = {};
        var eventInfoFcObject = new fcModel.Event(eventInfo, browser.globalObject, eventRegistration.thisObject);

        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "altKey", false, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "bubbles", true, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "cancelBubble", false, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "cancelable", true, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "charCode", 0, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "ctrlKey", false, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "currentTarget", null, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "detail", 0, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "eventPhase", 0, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "explicitOriginalTarget", null, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "isChar", false, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "isTrusted", true, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "keyCode", 0, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "layerX", 0, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "layerY", 0, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "rangeOffset", 0, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "rangeParent", 0, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "shiftKey", false, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "target", null, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "type", eventRegistration.eventType, browser, eventRegistration.executionInfos.length);
        this._addEventObjectProperty(eventInfo, eventInfoFcObject, "which", 0, browser, eventRegistration.executionInfos.length);

        this._updateWithConstraintInfo(eventInfo, eventInfoFcObject, eventRegistration, browser);

        args.push(new fcModel.fcValue(eventInfo, eventInfoFcObject, null));

        return args;
    },

    _addSuffix: function(name, suffixID)
    {
        return name + "_FC_" + suffixID;
    },

    _removeSuffix: function(name)
    {
        return name.substr(0, name.indexOf("_FC_"));
    },

    _addEventObjectProperty: function(eventInfo, eventInfoFcObject, propertyName, propertyValue, browser, executionOrderId)
    {
        eventInfo[propertyName] = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, propertyValue, new fcSymbolic.Identifier(this._addSuffix(propertyName, executionOrderId)));
        eventInfoFcObject.addProperty(propertyName, eventInfo[propertyName]);
    },

    _updateWithConstraintInfo: function(eventInfo, eventInfoFcObject, eventRegistration, browser)
    {
        if(eventRegistration == null || eventRegistration.executionInfos == null || eventRegistration.executionInfos.length == 0
        || eventInfo == null || eventInfoFcObject == null) { return; }

        var executionInfo = this._getLastExecutionInfo(eventRegistration)
        if(executionInfo == null) { return; }

        var constraintResult = executionInfo.pathConstraint.resolvedResult;

        if(constraintResult == null || constraintResult.length == 0) { return; }

        for(var i = 0; i < constraintResult.length; i++)
        {
            var result = constraintResult[i];

            var identifier = this._removeSuffix(result.identifier);
            eventInfo[identifier] = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, result.getValue(), new fcSymbolic.Identifier(this._addSuffix(identifier, eventRegistration.executionInfos.length)));
            eventInfoFcObject.addProperty(identifier, eventInfo[identifier]);
        }
    },

    _updateDomWithConstraintInfo: function(eventRegistration)
    {
        var executionInfo = this._getLastExecutionInfo(eventRegistration)

        if(executionInfo == null) { return; }

        var constraintResult = executionInfo.pathConstraint.resolvedResult;

        if(constraintResult == null || constraintResult.length == null) { return []; }

        for(var i = 0; i < constraintResult.length; i++)
        {
            var result = constraintResult[i];

            if(result.htmlElement instanceof HTMLSelectElement)
            {
                return this._updateSelectElement(result);
            }
        }
    },

    _updateSelectElement: function(constraintResult)
    {
        var propName = constraintResult.identifier;
        var selectElement = constraintResult.htmlElement;
        var oldValue = selectElement[propName];

        var newValue = this._getNextValue(selectElement[propName], this._getSelectAvailableValues(selectElement));
        selectElement[propName] = newValue;

        return [{htmlElement: selectElement, oldValue: oldValue, newValue: newValue}];
    },

    _getNextValue: function(item, items)
    {
        return items[items.indexOf(item) + 1];
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
