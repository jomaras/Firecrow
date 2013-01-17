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

fcScenarioGenerator.Event.prototype =
{
    toString: function()
    {
        return this.eventType + " on " + this.thisObjectDescriptor;
    }
}

fcScenarioGenerator.ParametrizedEvent = function (baseEvent, parameters)
{
    this.baseEvent = baseEvent;
    this.parameters = parameters;
};
/*****************************************************/
}});