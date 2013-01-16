FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcScenarioGenerator = Firecrow.ScenarioGenerator;

fcScenarioGenerator.Event = function(baseObjectDescriptor, baseObjectModel, type, eventRegistrationConstruct)
{
    this.baseObjectDescriptor = baseObjectDescriptor;
    this.baseObjectModel = baseObjectModel;
    this.type = type;
    this.eventRegistrationConstruct = eventRegistrationConstruct;
};

fcScenarioGenerator.Event.prototype =
{
    toString: function()
    {
        return this.type + " on " + this.baseObjectDescriptor;
    }
}

fcScenarioGenerator.ParametrizedEvent = function (baseEvent, parameters)
{
    this.baseEvent = baseEvent;
    this.parameters = parameters;
};
/*****************************************************/
}});