FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcScenarioGenerator = Firecrow.ScenarioGenerator;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcScenarioGenerator.Scenario = function(events, pathConstraint, parentScenarios)
{
    this.id = fcScenarioGenerator.Scenario.LAST_ID++;

    this.events = events || [];
    this.pathConstraint = pathConstraint;
    this.parentScenarios = parentScenarios || [];
    this.executionInfo = null;
    this.parametrizedEvents = [];
};

fcScenarioGenerator.Scenario.LAST_ID = 0;

fcScenarioGenerator.Scenario.prototype =
{
    setPathConstraint: function(pathConstraint)
    {
        this.pathConstraint = pathConstraint;
    },

    addEvent: function(usageScenarioEvent)
    {
        this.events.push(usageScenarioEvent);
    },

    setExecutionInfo: function(executionInfo)
    {
        this.executionInfo = executionInfo;
    },

    setParametrizedEvents: function(parametrizedEvents)
    {
        this.parametrizedEvents = parametrizedEvents;
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
    },

    filterOwnEventsFrom: function(eventRegistrations)
    {
        var notOwnEvents = [];

        for(var i = 0; i < eventRegistrations.length; i++)
        {
            var currentEvent = eventRegistrations[i];

            if(!this._containsEvent(currentEvent))
            {
                notOwnEvents.push(currentEvent);
            }
        }

        return notOwnEvents;
    },

    _containsEvent: function(event)
    {
        for(var i = 0; i < this.events.length; i++)
        {
            if(fcScenarioGenerator.Event.areEqual(this.events[i], event))
            {
                return true;
            }
        }

        return false;
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

    return new fcScenarioGenerator.Scenario(mergedEvents, mergedPathConstraints, [firstScenario, secondScenario]);
};

fcScenarioGenerator.ScenarioCollection = function(scenarioAddedCallback)
{
    this.lengthGroups = [];
    this.scenarios = [];
    this.scenarioAddedCallback = scenarioAddedCallback;
};

fcScenarioGenerator.ScenarioCollection.prototype =
{
    getNext: function()
    {
        var lengthGroups = this.lengthGroups;
        for(var i = 0, length = lengthGroups.length; i < length; i++)
        {
            var lengthGroup = this.lengthGroups[i];

            if(lengthGroup == null) { continue; }

            if(lengthGroup.currentIndex < lengthGroup.length)
            {
                var scenario = lengthGroup[lengthGroup.currentIndex + 1];

                if(scenario != null)
                {
                    lengthGroup.currentIndex++;

                    return scenario;
                }
            }
        }

        return null;
    },

    isLastScenario: function(scenario)
    {
        if(scenario == null) { return false; }

        var lengthGroup = this.lengthGroups[scenario.events.length];

        if(lengthGroup == null) { return false; }

        return lengthGroup.currentIndex + 1 >= lengthGroup.length
            && scenario.events.length + 1 >= this.lengthGroups.length;
    },

    addScenario: function(scenario)
    {
        if(scenario == null || this._containsScenario(scenario, this.scenarios)) { return; }

        if(this.lengthGroups[scenario.events.length] == null)
        {
            this.lengthGroups[scenario.events.length] = [];
            this.lengthGroups[scenario.events.length].currentIndex = -1;
        }

        this.lengthGroups[scenario.events.length].push(scenario);
        this.scenarios.push(scenario);

        if(this.scenarioAddedCallback != null)
        {
            this.scenarioAddedCallback(scenario);
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

    getAllScenarios: function()
    {
        return this.scenarios;
    },

    getProcessedScenarios: function()
    {
        var allScenarios = [];

        for(var i = 0; i < this.lengthGroups.length; i++)
        {
            var lengthScenarios = this.lengthGroups[i];

            if(lengthScenarios == null) { continue; }

            for(var j = 0; j <= lengthScenarios.currentIndex; j++)
            {
                if(lengthScenarios[j].executionInfo != null)
                {
                    allScenarios.push(lengthScenarios[j]);
                }
            }
        }

        return allScenarios;
    },

    getSubsumedProcessedScenarios: function()
    {
        var processedScenarios = this.getProcessedScenarios();

        var subsumedScenariosMap = [];

        for(var i = 0; i < processedScenarios.length; i++)
        {
            var iThScenario = processedScenarios[i];

            var hasFoundMatch = false;

            for(var j = i + 1; j < processedScenarios.length; j++)
            {
                var jThScenario = processedScenarios[j];

                var result = iThScenario.executionInfo.compareExecutedConstructs(jThScenario.executionInfo)

                if(result.areEqual)
                {
                    hasFoundMatch = true;
                    var chosenScenario = iThScenario.events.length < jThScenario.events.length ? iThScenario : jThScenario;

                    delete subsumedScenariosMap[jThScenario.id];
                    delete subsumedScenariosMap[iThScenario.id];

                    subsumedScenariosMap[chosenScenario.id] = chosenScenario;
                }
                else if(result.isFirstSubsetOfSecond)
                {
                    hasFoundMatch = true;

                    delete subsumedScenariosMap[iThScenario.id];

                    subsumedScenariosMap[jThScenario.id] = jThScenario;
                }
                else if (result.isSecondSubsetOfFirst)
                {
                    hasFoundMatch = true;

                    delete subsumedScenariosMap[jThScenario.id];
                    subsumedScenariosMap[iThScenario.id] = iThScenario;
                }
            }

            if(!hasFoundMatch)
            {
                subsumedScenariosMap[iThScenario.id] = iThScenario;
            }
        }

        var subsumedScenarios = ValueTypeHelper.convertObjectMapToArray(subsumedScenariosMap);

        console.log("Processed scenarios: " + processedScenarios.length + " Subsumed Scenarios: " + subsumedScenarios.length);

        return subsumedScenarios;
    }
};
/*****************************************************/
}});