FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcScenarioGenerator = Firecrow.ScenarioGenerator;
var fcSymbolic = fcScenarioGenerator.Symbolic;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;

fcScenarioGenerator.Scenario = function(events, inputConstraint, parentScenarios)
{
    this.id = fcScenarioGenerator.Scenario.LAST_ID++;

    this.events = events || [];
    this.inputConstraint = inputConstraint || new fcSymbolic.PathConstraint();
    this.parentScenarios = parentScenarios || [];
    this.executionInfo = null;
    this.parametrizedEvents = [];
    this.fingerprint = this._generateFingerprint();
    this.coverage = 0;
};

fcScenarioGenerator.Scenario.LAST_ID = 0;

fcScenarioGenerator.Scenario.prototype =
{
    addEvent: function(usageScenarioEvent)
    {
        this.events.push(usageScenarioEvent);
    },

    setCoverage: function(coverage)
    {
        this.coverage = coverage;
    },

    isAncestor: function(scenario)
    {
        if(scenario == null) { return false; }
        if(this.parentScenarios.length == 0) { return false;}

        if(this.isParent(scenario)) { return true; }

        if(this.parentScenarios[0] && this.parentScenarios[0].isAncestor(scenario)) { return true; }
        if(this.parentScenarios[1] && this.parentScenarios[1].isAncestor(scenario)) { return true; }

        return false;
    },

    isParent: function(scenario)
    {
        if(scenario == null) { return false; }
        if(this.parentScenarios.length == 0) { return false;}

        if(this.parentScenarios[0] == scenario) { return true; }
        if(this.parentScenarios[1] == scenario) { return true; }

        return false;
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

    setParametrizedEvents: function(parametrizedEvents)
    {
        this.parametrizedEvents = parametrizedEvents;
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
        return new fcScenarioGenerator.Scenario(this.events.slice(), this.inputConstraint.createCopy());
    },

    _generateFingerprint: function()
    {
        var inputConstraintString = this.inputConstraint != null ? this.inputConstraint.toString() : "";
        var resolvedResult = this.inputConstraint != null ? JSON.stringify(this.inputConstraint.resolvedResult) : "";

        var eventsString = "";
        for(var i = 0 ; i < this.events.length; i++) { eventsString += this.events[i].generateFingerprint(); }

        return inputConstraintString + resolvedResult + eventsString;
    },

    isEqualTo: function(scenario)
    {
        return this.fingerprint == scenario.fingerprint;
    },

    isEqualToByComponents: function(events, inputConstraint, parentScenarios)
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
            if(!fcScenarioGenerator.Event.areEqual(this.events[i], events[i]))
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

    compareEvents: function(scenario)
    {
        var matchingEventsCount = 0;

        for(var i = 0; i < this.events.length; i++)
        {
            var iThEvent = this.events[i];

            for(var j = 0; j <  scenario.events.length; j++)
            {
                var jThEvent = scenario.events[j];

                if(fcScenarioGenerator.Event.areEqual(iThEvent, jThEvent))
                {
                    matchingEventsCount++;
                    break;
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
        for(var i = 0; i < events.length; i++)
        {
            if(fcScenarioGenerator.Event.areEqual(events[i], event))
            {
                return true;
            }
        }

        return false;
    }
};

fcScenarioGenerator.ScenarioCollection = function()
{
    this.lengthGroups = [];
    this.scenarios = [];
    this.eventVisitedFunctionsInfo = {};
    this.currentIndex = 0;
    this.scenarioMap = {};
};

fcScenarioGenerator.ScenarioCollection.prototype =
{
    randomPrioritization: false,
    fifoPrioritization: false,
    eventLengthPrioritization: false,
    maximizingPathCoveragePrioritization: true,

    getNext: function()
    {
             if(this.maximizingPathCoveragePrioritization) { return this._getNextByMaximizingPathCoverage(); }
        else if(this.eventLengthPrioritization) { return this._getNextByLength(); }
        else if(this.randomPrioritization) { return this._getNextRandomly(); }
        else if(this.fifoPrioritization) { return this._getNextSequentially(); }

        return this._getNextSequentially();
    },

    _getNextSequentially: function()
    {
        if(this.scenarios[this.currentIndex + 1] != null)
        {
            return this.scenarios[++this.currentIndex];
        }

        return null;
    },

    _getNextRandomly: function()
    {
        var nonExecutedScenarios = this.getNonExecutedScenarios();

        if(nonExecutedScenarios.length == 0) { return null;}

        return ValueTypeHelper.getRandomElementFromArray(nonExecutedScenarios);
    },

    _getNextByMaximizingPathCoverage: function()
    {
        return this._getNextPrioritizingByLeastEventCoverage(this.getNonExecutedScenarios());
    },

    _getNextPrioritizingByLeastEventCoverage: function(scenarios)
    {
        if(scenarios.length == 0) { return null; }

        //Top priorities are scenarios with one event, scenarios created by adding completely new events
        var priorityScenario = this._findFirstSingleEventOrSymbolicalOrExtendingEvent(scenarios);

        if(priorityScenario != null) { this.returnedPrioritized++; return priorityScenario;}

        return this._findFirstWithLeastEventCoverage(scenarios);
    },

    returnedPrioritized: 0,

    _findFirstSingleEventOrSymbolicalOrExtendingEvent: function(scenarios)
    {
        for(var i = 0; i < scenarios.length; i++)
        {
            var scenario = scenarios[i];

            if(scenario.events.length == 1){ return scenario; }
            if(scenario.createdBy === "symbolic" || scenario.createdBy === "extendingWithNewEvent")
            {
                return scenario;
            }
        }

        return null;
    },

    _findFirstParentlessScenario: function(scenarios)
    {
        if(this._hasGoneThroughParentless) { return null;}

        for(var i = 0; i < scenarios.length; i++)
        {
            if(scenarios[i].parentScenarios.length == 0)
            {
                return scenarios[i];
            }
        }

        this._hasGoneThroughParentless = true;

        return null;
    },

    _hasGoneThroughParentless: false,

    _findFirstWithLeastEventCoverage: function(scenarios)
    {
        var  weightedIndexes = [];

        for(var i = 0; i < scenarios.length; i++)
        {
            var weightedIndex = [];

            var scenarioCoverage = this._getScenarioEventsCoverageCoefficient(scenarios[i]);

            //leave them a chance, but a very small one
            if(scenarioCoverage == 1) { scenarioCoverage = 0.999; }

            weightedIndex.push(i);
            weightedIndex.push(Math.round((1 - scenarioCoverage)*1000));

            weightedIndexes.push(weightedIndex);
        }

        var weightedList = new ValueTypeHelper.WeightedList(weightedIndexes);

        var result = weightedList.peek();

        if(result != null && result[0] !== null)
        {
            return scenarios[result[0]];
        }

        return scenarios[0];
    },

    _getNextByLength: function()
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
             if(this.maximizingPathCoveragePrioritization || this.randomPrioritization) { return !this._haveMoreNonExecutedScenarios(); }
        else if(this.eventLengthPrioritization) { return this._isLastScenarioByLength(scenario); }
        else if(this.fifoPrioritization) { return this._isLastScenarioByIndex(scenario); }

        return this._isLastScenarioByIndex(scenario);;
    },

    _haveMoreNonExecutedScenarios: function()
    {
        return this.getNonExecutedScenarios().length != 0;
    },

    _isLastScenarioByIndex: function(scenario)
    {
        return this.scenarios[this.scenarios.length - 1] == scenario;
    },

    _isLastScenarioByLength: function(scenario)
    {
        if(scenario == null) { return false; }

        var lengthGroup = this.lengthGroups[scenario.events.length];

        if(lengthGroup == null) { return false; }

        return lengthGroup.currentIndex + 1 >= lengthGroup.length
            && scenario.events.length + 1 >= this.lengthGroups.length;
    },

    addScenario: function(scenario)
    {
        if(scenario == null || this.scenarioMap[scenario.fingerprint]) { return false; }

        this._addScenario(scenario);

        return true;
    },

    _addScenario: function(scenario)
    {
        if(this.lengthGroups[scenario.events.length] == null)
        {
            this.lengthGroups[scenario.events.length] = [];
            this.lengthGroups[scenario.events.length].currentIndex = -1;
        }

        this.lengthGroups[scenario.events.length].push(scenario);
        this.scenarios.push(scenario);
        this.scenarioMap[scenario.fingerprint] = scenario;

        scenario.ownerCollection = this;
    },

    addScenarioByComponents: function(events, inputConstraint, parentScenarios)
    {
        if(this._containsScenarioByComponents(this.scenarios, events, inputConstraint, parentScenarios)) { return; }

        var scenario = new fcScenarioGenerator.Scenario(events, inputConstraint, parentScenarios);

        this._addScenario(scenario);

        return scenario;
    },

    _containsScenarioByComponents: function(scenarios, events, inputConstraint, parentScenarios)
    {
        for(var i = 0; i < scenarios.length; i++)
        {
            if(scenarios[i].isEqualToByComponents(events, inputConstraint, parentScenarios)) { return true; }
        }

        return false;
    },

    getAllScenarios: function()
    {
        return this.scenarios;
    },

    getExecutedScenarios: function()
    {
        var executedScenarios = [];

        for(var i = 0; i < this.scenarios.length; i++)
        {
            if(this.scenarios[i].executionInfo != null)
            {
                executedScenarios.push(this.scenarios[i]);
            }
        }

        return executedScenarios;
    },

    getNonExecutedScenarios: function()
    {
        var nonExecutedScenarios = [];

        for(var i = 0; i < this.scenarios.length; i++)
        {
            if(this.scenarios[i].executionInfo == null)
            {
                nonExecutedScenarios.push(this.scenarios[i]);
            }
        }

        return nonExecutedScenarios;
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

    compareEvents: false,
    waitInterval: -1,

    getSubsumedProcessedScenarios: function()
    {
        var processedScenarios = this.getProcessedScenarios();

        return processedScenarios;

        var subsumedScenariosMap = [];

        var timer = this.waitInterval > 0 ? Firecrow.TimerHelper.createTimer() : null;

        for(var i = 0; i < processedScenarios.length; i++)
        {
            var iThScenario = processedScenarios[i];

            var hasFoundMatch = false;

            if(timer && timer.hasMoreThanSecondsElapsed(this.waitInterval))
            {
                if(!confirm("Scenario - getSubsumedProcessedScenarios has been running for more than " + this.waitInterval
                          + " seconds, Continue?" + i + ", " + j + " of " + processedScenarios.length))
                {
                    return ValueTypeHelper.convertObjectMapToArray(subsumedScenariosMap);
                }

                this.waitInterval *= 2;

                timer = Firecrow.TimerHelper.createTimer();
            }

            for(var j = i + 1; j < processedScenarios.length; j++)
            {
                var jThScenario = processedScenarios[j];

                var executionInfoComparison = iThScenario.executionInfo.compareExecutedConstructs(jThScenario.executionInfo)

                if(this.compareEvents)
                {
                    var eventComparison = iThScenario.compareEvents(jThScenario);

                    if(!eventComparison.areEqual && !eventComparison.isFirstSubsetOfSecond && !eventComparison.isSecondSubsetOfFirst)
                    {
                        continue;
                    }
                }

                if(executionInfoComparison.areEqual)
                {
                    hasFoundMatch = true;
                    var chosenScenario = iThScenario.events.length < jThScenario.events.length ? iThScenario : jThScenario;

                    delete subsumedScenariosMap[jThScenario.id];
                    delete subsumedScenariosMap[iThScenario.id];

                    subsumedScenariosMap[chosenScenario.id] = chosenScenario;
                }
                else if(executionInfoComparison.isFirstSubsetOfSecond)
                {
                    hasFoundMatch = true;

                    delete subsumedScenariosMap[iThScenario.id];

                    subsumedScenariosMap[jThScenario.id] = jThScenario;
                }
                else if (executionInfoComparison.isSecondSubsetOfFirst)
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

        return subsumedScenarios;
    },

    eventCoverageInfo: {},

    aggregateEventCoverageInfo: function(scenario, executionInfo)
    {
        for(var baseObjectDescriptor in executionInfo.eventExecutionsMap)
        {
            var descriptorInfo = executionInfo.eventExecutionsMap[baseObjectDescriptor];

            if(this.eventVisitedFunctionsInfo[baseObjectDescriptor] == null)
            {
                this.eventVisitedFunctionsInfo[baseObjectDescriptor] = {};
                this.eventCoverageInfo[baseObjectDescriptor] = {};
            }

            for(var eventType in descriptorInfo)
            {
                if(this.eventVisitedFunctionsInfo[baseObjectDescriptor][eventType] == null)
                {
                    this.eventVisitedFunctionsInfo[baseObjectDescriptor][eventType] = descriptorInfo[eventType];
                    this.eventCoverageInfo[baseObjectDescriptor][eventType] = { scenarios: { }, coverage: 0};
                }
                else
                {
                    ValueTypeHelper.expand(this.eventVisitedFunctionsInfo[baseObjectDescriptor][eventType], descriptorInfo[eventType]);
                }

                //A link between an event and all scenarios where it participates
                this.eventCoverageInfo[baseObjectDescriptor][eventType].scenarios[scenario.id] = scenario;

                var visitedFunctions = this.eventVisitedFunctionsInfo[baseObjectDescriptor][eventType];
                var eventDescriptor = baseObjectDescriptor + eventType;

                var totalNumber = 0, executedNumber = 0;

                for(var visitedFunctionId in visitedFunctions)
                {
                    var coverage = ASTHelper.getFunctionCoverageInfo(visitedFunctions[visitedFunctionId], eventDescriptor);

                    totalNumber += coverage.totalNumberOfBranches;
                    executedNumber += coverage.executedNumberOfBranches;
                }

                this.eventCoverageInfo[baseObjectDescriptor][eventType].coverage = executedNumber/totalNumber;
            }
        }

        this._updateScenarioCoverages(executionInfo);
    },

    _updateScenarioCoverages: function(executionInfo)
    {
        var updatedScenariosMap = { };
        for(var baseObjectDescriptor in executionInfo.eventExecutionsMap)
        {
            var descriptorInfo = executionInfo.eventExecutionsMap[baseObjectDescriptor];

            for(var eventType in descriptorInfo)
            {
                var scenariosToUpdate = this.eventCoverageInfo[baseObjectDescriptor][eventType].scenarios;

                for(var scenarioId in scenariosToUpdate)
                {
                    if(updatedScenariosMap[scenarioId]) { continue; }

                    var scenario = scenariosToUpdate[scenarioId];

                    if(scenario.coverage == 1) { continue; }

                    scenario.setCoverage(this._getScenarioEventsCoverageCoefficient(scenario));

                    updatedScenariosMap[scenarioId] = true;
                }
            }
        }
    },

    _getScenarioEventsCoverageCoefficient: function(scenario)
    {
        var coverageCoefficient = 1;

        for(var i = 0; i < scenario.events.length; i++)
        {
            var event = scenario.events[i];

            if(this.eventCoverageInfo[event.thisObjectDescriptor] != null
            && this.eventCoverageInfo[event.thisObjectDescriptor][event.eventType] != null
            && this.eventCoverageInfo[event.thisObjectDescriptor][event.eventType].coverage)
            {
                coverageCoefficient *= this.eventCoverageInfo[event.thisObjectDescriptor][event.eventType].coverage;
            }
        }

        return coverageCoefficient;
    }
};
/*****************************************************/
}});