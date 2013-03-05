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
    this.generateFingerprint();
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

    generateFingerprint: function()
    {
        var inputConstraintString = this.inputConstraint != null ? this.inputConstraint.toString() : "";
        var resolvedResult = this.inputConstraint != null ? JSON.stringify(this.inputConstraint.resolvedResult) : "";

        var eventsString = "";
        for(var i = 0 ; i < this.events.length; i++) { eventsString += this.events[i].generateFingerprint(); }

        this.fingerprint = inputConstraintString + resolvedResult + eventsString;
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

            for(var j = 0; j < scenario.events.length; j++)
            {
                var jThEvent = scenario.events[j];

                if(fcScenarioGenerator.Event.areEqual(iThEvent, jThEvent))
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

fcScenarioGenerator.ScenarioCollection = function(uiControlSelectors)
{
    this.lengthGroups = [];
    this.scenarios = [];
    this.eventVisitedFunctionsInfo = {};
    this.currentIndex = -1;
    this.scenarioMap = {};
    this.eventPriorityMap = {};
};

fcScenarioGenerator.ScenarioCollection.prototype =
{
    randomPrioritization: false,
    fifoPrioritization: false,
    eventLengthPrioritization: false,
    maximizingPathCoveragePrioritization: false,
    symbolicAndNewPrioritization: true,

    assignEventPriority: function(eventRegistration, eventPriority)
    {
        if(eventRegistration == null) { return;}

        if(this.eventPriorityMap[eventRegistration.thisObjectDescriptor] == null)
        {
            this.eventPriorityMap[eventRegistration.thisObjectDescriptor] = {};
        }

        this.eventPriorityMap[eventRegistration.thisObjectDescriptor][eventRegistration.eventType] = eventPriority;
    },

    getNext: function()
    {
             if(this.maximizingPathCoveragePrioritization) { return this._getNextByMaximizingPathCoverage(); }
        else if(this.eventLengthPrioritization) { return this._getNextByLength(); }
        else if(this.randomPrioritization) { return this._getNextRandomly(); }
        else if(this.fifoPrioritization) { return this._getNextSequentially(); }
        else if(this.symbolicAndNewPrioritization) { return this._getNextByPrioritizingAgainstSymbolicAndNew(); }

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

    _getNextByPrioritizingAgainstSymbolicAndNew: function()
    {
        var nonExecutedScenarios = this.getNonExecutedScenarios();

        var firstSymbolicScenario = this._findFirstSymbolicScenario(nonExecutedScenarios);

        if(firstSymbolicScenario != null) { return firstSymbolicScenario; }

        var firstNewEventScenario = this._findFirstNewEventScenario(nonExecutedScenarios);

        if(firstNewEventScenario != null) { return firstNewEventScenario; }

        return nonExecutedScenarios[0];
    },

    _findFirstSymbolicScenario: function(scenarios)
    {
        for(var i = 0; i < scenarios.length; i++)
        {
            if(scenarios[i].createdBy == "symbolic") { return scenarios[i]; }
        }

        return null;
    },

    _findFirstNewEventScenario: function(scenarios)
    {
        for(var i = 0; i < scenarios.length; i++)
        {
            if(scenarios[i].createdBy == "extendingWithNewEvent") { return scenarios[i]; }
        }

        return null;
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
            if(scenario.createdBy === "extendingWithNewEvent") { return scenario; }
            /*if(scenario.createdBy === "symbolic" || scenario.createdBy === "extendingWithNewEvent")
            {
                return scenario;
            }*/
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

            var scenarioCoverage = this._getScenarioPriorityCoefficient(scenarios[i]);

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

    compareEvents: false,
    waitInterval: -1,

    getSubsumedProcessedScenarios: function()
    {
        var processedScenarios = this.getExecutedScenarios();

        var subsumedScenariosMap = [];

        for(var i = 0; i < processedScenarios.length; i++)
        {
            var iThScenario = processedScenarios[i];

            document.title = "Subsuming " + i + "/" + processedScenarios.length;

            var hasFoundMatch = false;

            if(!this._isEventChainRelatedToUiControls(iThScenario))
            {
                continue;
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

                    if(chosenScenario == jThScenario) { break; }
                }
                else if(executionInfoComparison.isFirstSubsetOfSecond)
                {
                    hasFoundMatch = true;

                    delete subsumedScenariosMap[iThScenario.id];

                    subsumedScenariosMap[jThScenario.id] = jThScenario;
                    break;
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

    _isEventChainRelatedToUiControls: function(scenario)
    {
        for(var i = scenario.events.length - 1, j = 0; i >= 0; i--, j++)
        {
            var event = scenario.events[i];

            if(this.eventPriorityMap[event.thisObjectDescriptor][event.eventType] < fcScenarioGenerator.ScenarioGenerator.uiControlEventPriority
            && !scenario.executionInfo.executionSummaryFromEndModifiesDom(j + 1))
            {
                return false;
            }
        }

        return true;
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

                    scenario.setCoverage(this._getScenarioPriorityCoefficient(scenario));

                    updatedScenariosMap[scenarioId] = true;
                }
            }
        }
    },

    _getScenarioPriorityCoefficient: function(scenario)
    {
        var coverageCoefficient = 1;

        //By grouping timing events we assign more probability
        //that consecutive timing events will be executed
        /*var eventGroups = this._groupTimingEvents(scenario.events);

        for(var i = 0; i < eventGroups.length; i++)
        {
            coverageCoefficient *= this._getGroupAverage(eventGroups[i]);
        }*/

        for(var i = 0; i < scenario.events.length; i++)
        {
            var event = scenario.events[i];

            if(this.eventCoverageInfo[event.thisObjectDescriptor] != null
            && this.eventCoverageInfo[event.thisObjectDescriptor][event.eventType] != null
            && this.eventCoverageInfo[event.thisObjectDescriptor][event.eventType].coverage)
            {
                coverageCoefficient *= this.eventCoverageInfo[event.thisObjectDescriptor][event.eventType].coverage;

                if(this.eventPriorityMap[event.thisObjectDescriptor] != null && this.eventPriorityMap[event.thisObjectDescriptor][event.eventType] !== null)
                {
                    coverageCoefficient *= this.eventPriorityMap[event.thisObjectDescriptor][event.eventType];
                }
            }
        }

        return coverageCoefficient;
    },

    _getGroupAverage: function(eventGroup)
    {
        var sum = 0;

        if(eventGroup.length == 1)
        {
            var event = eventGroup[0];
            if(this.eventCoverageInfo[event.thisObjectDescriptor] != null
            && this.eventCoverageInfo[event.thisObjectDescriptor][event.eventType] != null
            && this.eventCoverageInfo[event.thisObjectDescriptor][event.eventType].coverage)
            {
                return this.eventCoverageInfo[event.thisObjectDescriptor][event.eventType].coverage;
            }

            return 0;
        }

        for(var i = 0; i < eventGroup.length; i++)
        {
            var event = eventGroup[i];
            if(this.eventCoverageInfo[event.thisObjectDescriptor] != null
            && this.eventCoverageInfo[event.thisObjectDescriptor][event.eventType] != null
            && this.eventCoverageInfo[event.thisObjectDescriptor][event.eventType].coverage)
            {
                sum += this.eventCoverageInfo[event.thisObjectDescriptor][event.eventType].coverage;
            }
        }

        return sum/eventGroup.length;
    },

    _groupTimingEvents: function(events)
    {
        var groups = [];
        var lastGroup = null;

        for(var i = 0; i < events.length; i++)
        {
            var event = events[i];

            if(event.eventType == "timeout"
            || event.eventType == "interval")
            {
                if(lastGroup == null)
                {
                    lastGroup = [];
                    groups.push(lastGroup);
                }

                lastGroup.push(event);
            }
            else
            {
                lastGroup = null;
                groups.push([event]);
            }
        }

        return groups;
    }
};
/*****************************************************/
}});