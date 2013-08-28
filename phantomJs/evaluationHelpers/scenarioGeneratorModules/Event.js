var ScenarioGeneratorHelper = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\ScenarioGeneratorHelper.js").ScenarioGeneratorHelper;

var Event = function(baseObjectDescriptor, baseObjectModel, eventType, registrationConstruct, handlerConstruct)
{
    this.thisObjectDescriptor = baseObjectDescriptor;
    this.thisObjectModel = baseObjectModel;
    this.eventType = eventType;
    this.registrationConstruct = registrationConstruct;
    this.handlerConstruct = handlerConstruct;
    this.fingerprint = this.generateFingerprint();
    this.typeHandlerFingerPrint = this.generateTypeHandlerFingerprint();
};

Event.areEqual = function(eventA, eventB)
{
    if(eventA == null || eventB == null) { return false; }

    return eventA.thisObjectDescriptor == eventB.thisObjectDescriptor
        && eventA.thisObjectModel == eventB.thisObjectModel
        && eventA.eventType == eventB.eventType
        && eventA.registrationConstruct == eventB.registrationConstruct
        && eventA.handlerConstruct == eventB.handlerConstruct;
};

Event.createFromEventRegistration = function(eventRegistration)
{
    var event = new Event
    (
        eventRegistration.thisObjectDescriptor,
        eventRegistration.thisObjectModel,
        eventRegistration.eventType,
        eventRegistration.registrationConstruct,
        eventRegistration.handlerConstruct
    );

    event.handlerConstructNodeId = eventRegistration.handlerConstructNodeId;
    event.registrationConstructNodeId = eventRegistration.registrationConstructNodeId;
    event.thisObjectModelNodeId = eventRegistration.thisObjectModelNodeId;

    event.timePeriod = eventRegistration.timePeriod;

    return event;
};

Event.prototype =
{
    generateFingerprint: function()
    {
        return this.thisObjectDescriptor + this.eventType + this.handlerConstruct.nodeId;
    },

    generateTypeHandlerFingerprint: function()
    {
        return this.eventType + this.handlerConstruct.nodeId;
    },

    isTimingEvent: function()
    {
        return this.eventType == "timeout" || this.eventType == "interval";
    },

    isIntervalEvent: function()
    {
        return this.eventType == "interval";
    },

    isMouseMoveEvent: function()
    {
        return this.eventType.indexOf("mousemove") != -1;
    },

    toString: function()
    {
        var attributes = this.thisObjectModel.attributes;

        var specifier = "";

        if(attributes != null)
        {
            for(var i = 0; i < attributes.length; i++)
            {
                if(attributes[i].name.toLowerCase() == "id")
                {
                    specifier += "#" + attributes[i].value;
                }
                else if(attributes[i].name.toLowerCase() == "class")
                {
                    specifier += "." + attributes[i].value;
                }
            }
        }

        return this.eventType + " on " + this.thisObjectDescriptor + specifier;
    }
}

var ParametrizedEvent = function (baseEvent, parameters)
{
    this.baseEvent = baseEvent;
    this.setParameters(parameters);
    this.fingerprint = this.baseEvent.fingerprint + JSON.stringify(this.parameters);
};

ParametrizedEvent.createFromEvents = function(events, inputConstraint)
{
    var resolvedResults = inputConstraint != null ? inputConstraint.resolvedResult : [];

    var parametrizedEvents = [];

    for(var i = 0; i < events.length; i++)
    {
        parametrizedEvents.push(new ParametrizedEvent(events[i], resolvedResults[i]));
    }

    return parametrizedEvents;
};

ParametrizedEvent.prototype =
{
    generateQueryString: function()
    {
        return JSON.stringify({
            thisObjectDescriptor: this.baseEvent.thisObjectDescriptor,
            thisObjectModelNodeId: this.baseEvent.thisObjectModelNodeId,
            eventType: this.baseEvent.eventType,
            handlerConstructId: this.baseEvent.handlerConstruct.nodeId,
            registrationConstructId: this.baseEvent.registrationConstruct.nodeId,
            parameters: this.parameters
        });
    },

    setParameters: function(parameters)
    {
        this.parameters = this.normalizeParameters(parameters);
    },

    normalizeParameters: function(parameters)
    {
        var newObject = {};
        parameters = parameters || {};

        for(var propNameWithSuffix in parameters)
        {
            var fixedSuffix = !this._isDomProperty(propNameWithSuffix) ? ScenarioGeneratorHelper.removeSuffix(propNameWithSuffix)
                                                                       : propNameWithSuffix;
            newObject[fixedSuffix] = parameters[propNameWithSuffix];
        }

        return newObject;
    },

    _isDomProperty: function(name)
    {
        return name.indexOf("DOM_") == 0;
    },

    containsMousePosition: function()
    {
        for(var name in this.parameters)
        {
            if(this._isMousePositionProperty(name))
            {
                return true;
            }
        }

        return false;
    },

    _isMousePositionProperty: function(propertyName)
    {
        return this._mousePositionProperties.indexOf(propertyName) >= 0;
    },

    createCopy: function()
    {
        return new ParametrizedEvent(this.baseEvent, JSON.parse(JSON.stringify(this.parameters)));
    },

    _mousePositionProperties: ["pageX", "pageY", "clientX", "clientY", "screenX", "screenY"]
};

exports.Event = Event;
exports.ParametrizedEvent = ParametrizedEvent;