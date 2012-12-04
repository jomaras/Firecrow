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

            this._logEvent(eventRegistration, usageScenarios, browser);
            browser.executeEvent(eventRegistration);
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
            this._logEvent(loadingEvent, usageScenarios, browser);
        }, this);
    },

    _logEvent: function(event, usageScenarios, browser)
    {
        usageScenarios[usageScenarios.length-1].addEvent(this._generateUsageScenarioEvent(event, browser));
    },

    _generateUsageScenarioEvent: function(event, browser)
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

        return new FBL.Firecrow.UsageScenarioEvent(event.eventType, baseObject);
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

Firecrow.UsageScenarioEvent = function(type, baseObject)
{
    this.type = type;
    this.baseObject = baseObject;
};
/*****************************************************/
}});
