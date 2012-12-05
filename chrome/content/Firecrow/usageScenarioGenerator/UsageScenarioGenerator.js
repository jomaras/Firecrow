FBL.ns(function() { with (FBL) {
/*****************************************************/
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

        for(var i = 0; i < eventHandlingRegistrations.length; i++)
        {
            var eventRegistration = eventHandlingRegistrations[i];

            var args = this._getArguments(eventRegistration, browser);

            this._logEvent(eventRegistration, args, usageScenarios, browser);
            browser.executeEvent(eventRegistration, args);
        }
    },

    _getArguments: function(eventRegistration, browser)
    {
        if(eventRegistration.eventType == "onclick")
        {
            return this._generateClickHandlerArguments(eventRegistration, browser);
        }

        return [];
    },

    _generateClickHandlerArguments: function(eventRegistration, browser)
    {
        var args = [];
        var fcModel = FBL.Firecrow.Interpreter.Model;

        var eventInfo = {};
        var eventInfoJsObject = new fcModel.Event(eventInfo, browser.globalObject, eventRegistration.thisObject);

        eventInfo.target = null;
        eventInfoJsObject.addProperty("target", new fcModel.fcValue(null));

        eventInfo.currentTarget = null;
        eventInfoJsObject.addProperty("currentTarget", new fcModel.fcValue(null));

        eventInfo.clientX = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, 0);
        eventInfoJsObject.addProperty("clientX", eventInfo.clientX);

        eventInfo.clientY = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, 0);
        eventInfoJsObject.addProperty("clientY", eventInfo.clientY);

        eventInfo.screenX = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, 0);
        eventInfoJsObject.addProperty("screenX", eventInfo.screenX);

        eventInfo.screenY = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, 0);
        eventInfoJsObject.addProperty("screenY", eventInfo.screenY);

        eventInfo.type = browser.globalObject.internalExecutor.createInternalPrimitiveObject(null, "click");
        eventInfoJsObject.addProperty("type", eventInfo.type);

        args.push(new fcModel.fcValue(eventInfo, eventInfoJsObject, null));

        return args;
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
/*****************************************************/
}});
