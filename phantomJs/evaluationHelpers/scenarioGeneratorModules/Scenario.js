var Event = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\Event.js").Event;
var PathConstraint = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\PathConstraint.js").PathConstraint;

var Scenario = function Scenario(events, inputConstraint, parentScenarios, creationType)
{
    this.id = Scenario.LAST_ID++;

    this.events = events || [];
    this.inputConstraint = inputConstraint || new PathConstraint();
    this.parentScenarios = parentScenarios || [];
    this.executionInfo = null;
    this.parametrizedEvents = [];
    this.creationType = creationType || Scenario.CREATION_TYPE.default;
    this.setCoverage(0);
    this.generateFingerprint();
};

Scenario.LAST_ID = 0;

Scenario.CREATION_TYPE =
{
    default: "default",
    symbolic: "symbolic",
    newEvent: "newEvent",
    existingEvent: "existingEvent",
    timingEvents: "timingEvents"
};

Scenario.prototype =
{
    getEventsQuery: function()
    {
        var queryComponent = "[";

        for(var i = 0; i < this.parametrizedEvents.length; i++)
        {
            if(i != 0) { queryComponent += ","; }
            queryComponent += this.parametrizedEvents[i].generateQueryString()
        }

        queryComponent += "]";

        return queryComponent;
    },

    addEvent: function(usageScenarioEvent)
    {
        this.events.push(usageScenarioEvent);
    },

    setParametrizedEvents: function(parametrizedEvents)
    {
        this.parametrizedEvents = parametrizedEvents;
    },

    setCoverage: function(coverage)
    {
        this.coverage = coverage;
    },

    isParent: function(scenario)
    {
        if(scenario == null || this.parentScenarios.length == 0) { return false; }

        return this.parentScenarios[0] == scenario
            || this.parentScenarios[1] == scenario;
    },

    isAncestor: function(scenario)
    {
        if(scenario == null || this.parentScenarios.length == 0) { return false; }

        return   this.isParent(scenario)
            || (this.parentScenarios[0] && this.parentScenarios[0].isAncestor(scenario))
            || (this.parentScenarios[1] && this.parentScenarios[1].isAncestor(scenario));
    },

    setExecutionInfo: function(executionInfo)
    {
        this.executionInfo = executionInfo;

        this.ownerCollection.aggregateEventCoverageInfo(this, executionInfo);
    },

    getEventExecutionsInfo: function(eventObjectDescriptor, eventType)
    {
        var executionInfos = [];

        if(this.executionInfo == null) { return executionInfos; }

        for(var i = 0; i < this.executionInfo.eventExecutions.length; i++)
        {
            var eventExecution = this.executionInfo.eventExecutions[i];
            if(eventExecution.baseObjectDescriptor == eventObjectDescriptor && eventExecution.eventType == eventType)
            {
                executionInfos.push(eventExecution);
            }
        }

        return executionInfos;
    },

    addInputConstraintItem: function(pathConstraintItem)
    {
        if(pathConstraintItem == null) { return; }

        this.inputConstraint.addPathConstraintItem(pathConstraintItem);
    },

    addSolutionIfNotExistent: function(identifier, solution)
    {
        this.inputConstraint.addSolutionIfNotExistent(identifier, solution);
    },

    createCopy: function()
    {
        return new Scenario(this.events.slice(), this.inputConstraint.createCopy());
    },

    generateFingerprint: function()
    {
        var inputConstraintString = this.inputConstraint != null ? this.inputConstraint.toString() : "";
        var resolvedResult = this.inputConstraint != null ? JSON.stringify(this.inputConstraint.resolvedResult) : "";

        var eventsString = "";
        for(var i = 0 ; i < this.events.length; i++) { eventsString += this.events[i].generateFingerprint(); }

        return this.fingerprint = inputConstraintString + resolvedResult + eventsString;
    },

    isSymbolicCreationType: function() { return this.creationType == Scenario.CREATION_TYPE.symbolic; },

    isEqualTo: function(scenario)
    {
        return scenario != null
            && this.fingerprint == scenario.fingerprint;
    },

    isEqualToByComponents: function(events, inputConstraint)
    {
        var thisInputConstraintString = this.inputConstraint != null ? this.inputConstraint.toString() : "";
        var scenarioInputConstraintString = inputConstraint != null ? inputConstraint.toString() : "";
        var thisResolvedResult = this.inputConstraint != null ? JSON.stringify(this.inputConstraint.resolvedResult) : "";
        var scenarioResolvedResult = inputConstraint != null ? JSON.stringify(inputConstraint.resolvedResult) : "";

        return (thisInputConstraintString == scenarioInputConstraintString || thisResolvedResult == scenarioResolvedResult)
            && this._haveEqualEventsByComponents(events);
    },

    _haveEqualEventsByComponents: function(events)
    {
        if(this.events.length != events.length || this.events.length == 0) { return false; }

        for(var i = 0; i < this.events.length; i++)
        {
            if(!Event.areEqual(this.events[i], events[i]))
            {
                return false;
            }
        }

        return true;
    },

    filterEvents: function(eventRegistrations)
    {
        var ownEvents = [];
        var thisEventRegistrations = this.executionInfo.eventRegistrations;

        for(var i = 0; i < thisEventRegistrations.length; i++)
        {
            if(!this._containsEvent(eventRegistrations, thisEventRegistrations[i]))
            {
                ownEvents.push(thisEventRegistrations[i]);
            }
        }

        return ownEvents;
    },

    /**
     * @param scenario
     * @returns {{areEqual: boolean, isFirstSubsetOfSecond: boolean, isSecondSubsetOfFirst: boolean}}
     */
    compareEvents: function(scenario)
    {
        var matchingEventsCount = 0;

        for(var i = 0; i < this.events.length; i++)
        {
            var iThEvent = this.events[i];

            for(var j = 0; j < scenario.events.length; j++)
            {
                var jThEvent = scenario.events[j];

                if(Event.areEqual(iThEvent, jThEvent))
                {
                    matchingEventsCount++;
                }
            }
        }

        return {
            areEqual: matchingEventsCount == this.events.length && matchingEventsCount == scenario.events.length,
            isFirstSubsetOfSecond: matchingEventsCount == this.events.length && this.events.length < scenario.events.length,
            isSecondSubsetOfFirst: matchingEventsCount == scenario.events.length && scenario.events.length < this.events.length
        };
    },

    _containsEvent: function(events, event)
    {
        if(event == null || events == null || events.length == 0) { return false; }

        for(var i = 0; i < events.length; i++)
        {
            if(Event.areEqual(events[i], event))
            {
                return true;
            }
        }

        return false;
    },

    toString: function()
    {
        var string = "";

        for(var i = 0; i < this.events.length; i++)
        {
            if(string != "") { string += " - "; }

            string += this.events[i].toString();
        }

        return string;
    },

    getEventsInfo: function()
    {
        var resolvedResult = (this.inputConstraint != null && this.inputConstraint.resolvedResult) || {};

        var string = "";

        for(var i = 0; i < this.events.length; i++)
        {
            string += "\t" + this.events[i].toString() + " -> " + JSON.stringify(resolvedResult[i] || {}) + "\n";
        }

        return string;

    },

    setCreationTypeSymbolic: function()
    {
        this.creationType = Scenario.CREATION_TYPE.symbolic;
    },

    setCreationTypeNewEvent: function()
    {
        this.creationType = Scenario.CREATION_TYPE.newEvent;
    },

    isCreatedByWithTimingEvents: function()
    {
        return this.creationType == Scenario.CREATION_TYPE.timingEvents;
    },

    isCreatedBySymbolic: function()
    {
        return this.creationType == Scenario.CREATION_TYPE.symbolic;
    },

    isCreatedByNewEvent: function()
    {
        return this.creationType == Scenario.CREATION_TYPE.newEvent;
    }
};

exports.Scenario = Scenario;