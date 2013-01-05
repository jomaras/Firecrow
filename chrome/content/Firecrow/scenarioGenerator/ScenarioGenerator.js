FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcScenarioGenerator = Firecrow.ScenarioGenerator;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;
var fcSymbolic = fcScenarioGenerator.Symbolic;

fcScenarioGenerator.ScenarioGenerator =
{
    generateScenarios: function(pageModel, scenarioCreatedCallback)
    {
        ASTHelper.setParentsChildRelationships(pageModel);

        var scenarios = [];

        var browser = this._executeApplication(pageModel);

        this._createRegisteredEventsScenarios(browser, scenarios, scenarioCreatedCallback);

        for(var i = 0; i < scenarios.length; i++)
        {
            this._createDerivedScenarios(pageModel, scenarios[i], scenarios, scenarioCreatedCallback);
        }

        return scenarios;
    },

    _executeApplication: function(pageModel)
    {
        var browser = new FBL.Firecrow.DoppelBrowser.Browser(pageModel);

        browser.evaluatePage();

        this._executeLoadingEvents(browser);

        return browser;
    },

    _executeLoadingEvents: function(browser)
    {
        var loadingEvents = browser.globalObject.getLoadedHandlers();

        loadingEvents.forEach(function(loadingEvent)
        {
            browser.executeEvent(loadingEvent);
        }, this);
    },

    _createRegisteredEventsScenarios: function(browser, scenarios, scenarioCreatedCallback)
    {
        this._createEventsScenarios(browser.globalObject.intervalHandlers, scenarios, scenarioCreatedCallback)
        this._createEventsScenarios(browser.globalObject.htmlElementEventHandlingRegistrations, scenarios, scenarioCreatedCallback)
    },

    _createEventsScenarios: function(eventRegistrations, scenarios, scenarioCreatedCallback)
    {
        for(var i = 0; i < eventRegistrations.length; i++)
        {
            var eventRegistration = eventRegistrations[i];

            this._addScenario(new fcScenarioGenerator.Scenario([new fcScenarioGenerator.Event(eventRegistration.thisObject, eventRegistration.eventType, eventRegistration)]), scenarios, scenarioCreatedCallback);
        }
    },

    _createDerivedScenarios: function(pageModel, scenario, scenarios, scenarioCreatedCallback)
    {
        var executionSummary = this._executeScenario(pageModel, scenario);

        var invertedPaths = executionSummary.pathConstraint.getAllResolvedInversions();

        for(var i = 0; i < invertedPaths.length; i++)
        {
            this._addScenario(new fcScenarioGenerator.Scenario(scenario.events, invertedPaths[i]), scenarios, scenarioCreatedCallback);
        }
    },

    _addScenario: function(scenario, scenarios, scenarioCreatedCallback)
    {
        if(this._containsScenario(scenario, scenarios)) { return; }

        scenarios.push(scenario);

        if(scenarioCreatedCallback != null)
        {
            scenarioCreatedCallback(scenario);
        }
    },

    _containsScenario: function(scenario, scenarios)
    {
        for(var i = 0; i < scenarios.length; i++)
        {
            if(scenario.isEqualTo(scenarios[i])) { return true; }
        }

        return false;
    },

    _executeScenario: function(pageModel, scenario)
    {
        var browser = this._executeApplication(pageModel);
        var parametrizedEvents = this._createParametrizedEvents(scenario);

        for(var i = 0; i < parametrizedEvents.length; i++)
        {
            this._executeEvent(browser, parametrizedEvents[i], scenario, i);
        }

        scenario.executionInfo = browser.getLastExecutionInfo();

        return scenario.executionInfo;
    },

    _createParametrizedEvents: function(scenario)
    {
        if(scenario.pathConstraint == null)
        {
            return scenario.events.map(function(event)
            {
                return new fcScenarioGenerator.ParametrizedEvent(event, null);
            });
        }

        var parametrizedEvents = [];

        var resolvedResults = scenario.pathConstraint.resolvedResult;
        var events = scenario.events;

        for(var i = 0; i < events.length; i++)
        {
            parametrizedEvents.push(new fcScenarioGenerator.ParametrizedEvent(events[i], resolvedResults[i]))
        }

        return parametrizedEvents;
    },

    _executeEvent: function(browser, parametrizedEvent, scenario, eventIndex)
    {
        browser.eventIndex = eventIndex;
        var eventRegistration = this._getMatchingEventRegistration(browser, parametrizedEvent.baseEvent.eventRegistration);

        var handlerArguments = this._getArguments(eventRegistration, browser, parametrizedEvent.parameters, eventIndex);
        this._modifyDom(eventRegistration, scenario, parametrizedEvent.parameters);

        browser.executeEvent(eventRegistration, handlerArguments);
    },

    _getMatchingEventRegistration: function(browser, eventRegistration)
    {
        var intervalHandlers = browser.globalObject.intervalHandlers;
        for(var i = 0; i < intervalHandlers.length; i++)
        {
            var intervalHandler = intervalHandlers[i];

            if(intervalHandler.handler.codeConstruct == eventRegistration.handler.codeConstruct)
            {
                return intervalHandler;
            }
        }

        var domHandlers = browser.globalObject.htmlElementEventHandlingRegistrations;

        for(var i = 0; i < domHandlers.length; i++)
        {
            var domHandler = domHandlers[i];

            if(domHandler.handler.codeConstruct != eventRegistration.handler.codeConstruct) { continue; }

            if(domHandler.fcHtmlElement != null && eventRegistration.fcHtmlElement != null)
            {
                if(domHandler.fcHtmlElement.htmlElement == null && eventRegistration.fcHtmlElement.htmlElement == null)
                {
                    return domHandler;
                }
                else if(domHandler.fcHtmlElement.htmlElement.modelElement == eventRegistration.fcHtmlElement.htmlElement.modelElement)
                {
                    return domHandler;
                }
            }
            else
            {
                return domHandler;
            }
        }

        return null;
    },

    _getArguments: function(eventRegistration, browser, parameters, eventIndex)
    {
        switch(eventRegistration.eventType)
        {
            case "onclick":
            case "onmousemove":
                return this._generateMouseHandlerArguments(eventRegistration, browser, parameters, eventIndex);
            case "onkeydown":
                return this._generateKeyHandlerArguments(eventRegistration, browser, parameters, eventIndex);
            default:
                break;
        }

        return [];
    },

    _modifyDom: function(eventRegistration, scenario, parameters)
    {
        return this._updateDomWithConstraintInfo(eventRegistration, scenario, parameters);
    },

    _generateMouseHandlerArguments: function(eventRegistration, browser, parameters, eventIndex)
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

        this._updateWithConstraintInfo(eventInfo, eventInfoFcObject, eventRegistration, browser, parameters, eventIndex);

        args.push(new fcModel.fcValue(eventInfo, eventInfoFcObject, null));

        return args;
    },

    _generateKeyHandlerArguments: function(eventRegistration, browser, parameters, eventIndex)
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

        this._updateWithConstraintInfo(eventInfo, eventInfoFcObject, eventRegistration, browser, parameters, eventIndex);

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

    _updateWithConstraintInfo: function(eventInfo, eventInfoFcObject, eventRegistration, browser, parameters, eventIndex)
    {
        if(parameters == null) { return; }

        for(var propName in parameters)
        {
            var propValue = parameters[propName];
            var identifier = this._removeSuffix(propName);

            eventInfo[identifier] = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, propValue, new fcSymbolic.Identifier(this._addSuffix(identifier, eventIndex)));
            eventInfoFcObject.addProperty(identifier, eventInfo[identifier]);
        }
    },

    _updateDomWithConstraintInfo: function(eventRegistration, scenario, parameters)
    {
        if(parameters == null) { return; }

        for(var parameterName in parameters)
        {
            if(parameterName.indexOf("DOM_") == 0)
            {
                var id = fcSymbolic.ConstraintResolver.getHtmlElementIdFromSymbolicParameter(parameterName);
                var cleansedProperty = fcSymbolic.ConstraintResolver.getHtmlElementPropertyFromSymbolicParameter(parameterName);
                if(id != "")
                {
                    var htmlElement = eventRegistration.thisObject.globalObject.document.document.getElementById(id);

                    if(htmlElement instanceof HTMLSelectElement)
                    {
                        var updateResult = fcSymbolic.ConstraintResolver.updateSelectElement(cleansedProperty, htmlElement);

                        scenario.pathConstraint.resolvedResult[eventRegistration.thisObject.globalObject.browser.eventIndex][parameterName] = updateResult.oldValue + " -&gt; " + updateResult.newValue;
                    }
                }
                else
                {
                    alert("When updating DOM can not find ID!");
                }
            }
        }
    },

    _getLastExecutionInfo: function(eventRegistration)
    {
        if(eventRegistration == null || eventRegistration.executionInfos == null || eventRegistration.executionInfos.length == 0) { return null; }

        return eventRegistration.executionInfos[eventRegistration.executionInfos.length - 1];
    },

    notifyError: function(message) { alert("UsageScenarioGenerator Error: " + message); }
};
/*****************************************************/
}});
