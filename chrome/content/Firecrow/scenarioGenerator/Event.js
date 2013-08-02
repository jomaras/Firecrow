FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcScenarioGenerator = Firecrow.ScenarioGenerator;

fcScenarioGenerator.Event = function(baseObjectDescriptor, baseObjectModel, eventType, registrationConstruct, handlerConstruct)
{
    this.thisObjectDescriptor = baseObjectDescriptor;
    this.thisObjectModel = baseObjectModel;
    this.eventType = eventType;
    this.registrationConstruct = registrationConstruct;
    this.handlerConstruct = handlerConstruct;
    this.fingerprint = this.generateFingerprint();
    this.typeHandlerFingerPrint = this.generateTypeHandlerFingerprint();
};

fcScenarioGenerator.Event.areEqual = function(eventA, eventB)
{
    if(eventA == null || eventB == null) { return false; }

    return eventA.thisObjectDescriptor == eventB.thisObjectDescriptor
        && eventA.thisObjectModel == eventB.thisObjectModel
        && eventA.eventType == eventB.eventType
        && eventA.registrationConstruct == eventB.registrationConstruct
        && eventA.handlerConstruct == eventB.handlerConstruct;
};

fcScenarioGenerator.Event.createFromEventRegistration = function(eventRegistration)
{
    var event = new fcScenarioGenerator.Event
    (
        eventRegistration.thisObjectDescriptor,
        eventRegistration.thisObjectModel,
        eventRegistration.eventType,
        eventRegistration.registrationConstruct,
        eventRegistration.handlerConstruct
    );

    event.timePeriod = eventRegistration.timePeriod;

    return event;
};

fcScenarioGenerator.Event.prototype =
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
        return this.eventType == "timeout" || this.eventType == "interval"
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

fcScenarioGenerator.ParametrizedEvent = function (baseEvent, parameters)
{
    this.baseEvent = baseEvent;
    this.setParameters(parameters);
    this.fingerprint = this.baseEvent.fingerprint + JSON.stringify(this.parameters);
};

fcScenarioGenerator.ParametrizedEvent.createFromEvents = function(events, inputConstraint)
{
    var resolvedResults = inputConstraint != null ? inputConstraint.resolvedResult : [];

    var parametrizedEvents = [];

    for(var i = 0; i < events.length; i++)
    {
        parametrizedEvents.push(new fcScenarioGenerator.ParametrizedEvent(event[i], resolvedResults[i]));
    }

    return parametrizedEvents;
};

fcScenarioGenerator.ParametrizedEvent.prototype =
{
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
            var fixedSuffix = !this._isDomProperty(propNameWithSuffix) ? fcScenarioGenerator.ScenarioGenerator.removeSuffix(propNameWithSuffix)
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

    _mousePositionProperties: ["pageX", "pageY", "clientX", "clientY", "screenX", "screenY"]
};
/*****************************************************/
}});