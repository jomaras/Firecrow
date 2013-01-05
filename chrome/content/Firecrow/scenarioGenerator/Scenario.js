FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcScenarioGenerator = Firecrow.ScenarioGenerator;

fcScenarioGenerator.Scenario = function(events, pathConstraint)
{
    this.events = events || [];
    this.pathConstraint = pathConstraint;
};

fcScenarioGenerator.Scenario.prototype =
{
    addEvent: function(usageScenarioEvent)
    {
        this.events.push(usageScenarioEvent);
    },

    createCopy: function()
    {
        return new fcScenarioGenerator.Scenario(this.events.slice(), this.pathConstraint);
    },

    isEqualTo: function(scenario)
    {
        var thisPathConstraintString = this.pathConstraint != null ? this.pathConstraint.toString() : "";
        var scenarioPathConstraintString = scenario.pathConstraint != null ? scenario.pathConstraint.toString() : "";

        return this._haveEqualEvents(scenario) && thisPathConstraintString == scenarioPathConstraintString;
    },

    _haveEqualEvents: function(scenario)
    {
        if(this.events.length != scenario.events.length || this.events.length == 0) { return false; }

        for(var i = 0; i < this.events.length; i++)
        {
            if(this.events[i] != scenario.events[i])
            {
                return false;
            }
        }

        return true;
    }
};
/*****************************************************/
}});