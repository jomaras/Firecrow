FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcScenarioGenerator = Firecrow.ScenarioGenerator;

fcScenarioGenerator.Scenario = function(events, pathConstraint)
{
    this.id = fcScenarioGenerator.Scenario.LAST_ID++;

    this.events = events || [];
    this.pathConstraint = pathConstraint;
};

fcScenarioGenerator.Scenario.LAST_ID = 0;

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
        var thisResolvedResult = this.pathConstraint != null ? JSON.stringify(this.pathConstraint.resolvedResult) : "";
        var scenarioResolvedResult = scenario.pathConstraint != null ? JSON.stringify(scenario.pathConstraint.resolvedResult) : "";

        return this._haveEqualEvents(scenario) && (thisPathConstraintString == scenarioPathConstraintString
                                               || thisResolvedResult == scenarioResolvedResult);
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

fcScenarioGenerator.Scenario.mergeScenarios = function(firstScenario, secondScenario)
{
    var mergedEvents = firstScenario.events.concat(secondScenario.events);
    var mergedPathConstraints = null;

    if(firstScenario.pathConstraint == null && secondScenario.pathConstraint == null)
    {
        mergedPathConstraints = null;
    }
    else if(firstScenario.pathConstraint != null && secondScenario.pathConstraint == null)
    {
        mergedPathConstraints = firstScenario.pathConstraint;
    }
    else if(firstScenario.pathConstraint == null && secondScenario.pathConstraint != null)
    {
        mergedPathConstraints = secondScenario.pathConstraint.createCopyUpgradedByIndex(firstScenario.events.length);
    }
    else
    {
        mergedPathConstraints = secondScenario.pathConstraint.createCopyUpgradedByIndex(0);
        mergedPathConstraints.append(secondScenario.pathConstraint.createCopyUpgradedByIndex(firstScenario.events.length));
    }

    return new fcScenarioGenerator.Scenario(mergedEvents, mergedPathConstraints);
};
/*****************************************************/
}});