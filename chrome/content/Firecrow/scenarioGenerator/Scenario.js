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
    },

    toString: function()
    {
        var string = "";

        this.events.forEach(function (event)
        {
            if(string != "") { string += " - "; }
            string += event.toString();
        });

        return string;
    }
};

fcScenarioGenerator.ScenarioCollection = function(uiControlSelectors)
{
    this.lengthGroups = [];
    this.scenarios = [];
    this.typeVisitedFunctionsInfo = {};
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
    symbolicAndNewPrioritization: false,
    symbolicNewCoveragePrioritization: true,

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
        else if(this.symbolicNewCoveragePrioritization) { return this._getNextBySymbolicNewCoverage(); }

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

    _getNextBySymbolicNewCoverage: function()
    {
        var nonExecutedScenarios = this.getNonExecutedScenarios();

        var firstSymbolicOrNewScenario = this._findFirstSymbolicOrNewEventScenario(nonExecutedScenarios);

        if(firstSymbolicOrNewScenario != null) { return firstSymbolicOrNewScenario; }

        return this._getNextPrioritizingByLeastEventCoverage(nonExecutedScenarios);
    },

    _findFirstSymbolicOrNewEventScenario: function(scenarios)
    {
        for(var i = 0; i < scenarios.length; i++)
        {
            if(scenarios[i].createdBy == "symbolic" || scenarios[i].createdBy == "extendingWithNewEvent") { return scenarios[i]; }
        }

        return null;
    },

    _getNextPrioritizingByLeastEventCoverage: function(scenarios)
    {
        if(scenarios.length == 0) { return null; }

        return this._findFirstWithLeastEventCoverage(scenarios);
    },

    _findFirstWithLeastEventCoverage: function(scenarios)
    {
        var  weightedIndexes = [];

        for(var i = 0; i < scenarios.length; i++)
        {
            var scenarioCoverage = this._getScenarioPriorityCoefficient(scenarios[i]);

            if(scenarioCoverage < 1)
            {
                weightedIndexes.push([i, Math.round((1 - scenarioCoverage)*100)]);
            }
        }

        if(weightedIndexes.length == 0) { return null; }

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

        processedScenarios = this._removeUnrelatedToUiControls(processedScenarios);

        processedScenarios.sort(function(s1, s2)
        {
            return s2.events.length - s1.events.length;
        });

        var jointCoverage = this._getJointCoverageMap(processedScenarios);
        var keptScenarios = [];

        for(var i = 0; i < processedScenarios.length; i++)
        {
            var scenario = processedScenarios[i];
            if(this._canScenarioBeRemoved(jointCoverage, scenario))
            {
                this._removeScenarioCoverageFromJointCoverage(jointCoverage, scenario);
            }
            else
            {
                keptScenarios.push(scenario);
            }
        }

        return keptScenarios;
    },

    _canScenarioBeRemoved: function(jointCoverage, scenario)
    {
        var executedConstructs = scenario.executionInfo.executedConstructsIdMap;

        for(var constructId in executedConstructs)
        {
            if(jointCoverage[constructId] - 1 <= 0) { return false; }
        }

        return true;
    },

    _removeScenarioCoverageFromJointCoverage: function(jointCoverage, scenario)
    {
        var executedConstructs = scenario.executionInfo.executedConstructsIdMap;

        for(var constructId in executedConstructs)
        {
            jointCoverage[constructId]--;
        }
    },

    _getJointCoverageMap: function(scenarios)
    {
        var jointCoverage = {};

        for(var i = 0; i < scenarios.length; i++)
        {
            var executedConstructs = scenarios[i].executionInfo.executedConstructsIdMap;

            for(var constructId in executedConstructs)
            {
                if(jointCoverage[constructId] == null)
                {
                    jointCoverage[constructId] = 1
                }
                else
                {
                    jointCoverage[constructId]++;
                }
            }
        }

        return jointCoverage;
    },

    _removeUnrelatedToUiControls: function(processedScenarios)
    {
        var keptScenarios = [];

        for(var i = 0; i < processedScenarios.length; i++)
        {
            if(this._isEventChainRelatedToUiControls(processedScenarios[i]))
            {
                keptScenarios.push(processedScenarios[i]);
            }
        }

        return keptScenarios;
    },

    _isEventChainRelatedToUiControls: function(scenario)
    {
        for(var i = scenario.events.length - 1, j = 0; i >= 0; i--, j++)
        {
            var event = scenario.events[i];

            if(this.eventPriorityMap[event.thisObjectDescriptor][event.eventType] > fcScenarioGenerator.ScenarioGenerator.uiControlEventPriority
            && !scenario.executionInfo.executionSummaryFromEndModifiesDom(j + 1))
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        return true;
    },

    typeCoverageInfo: {},

    aggregateEventCoverageInfo: function(scenario, executionInfo)
    {
        for(var typeDescriptor in executionInfo.typeExecutionMap)
        {
            if(this.typeVisitedFunctionsInfo[typeDescriptor] == null)
            {
                this.typeVisitedFunctionsInfo[typeDescriptor] = executionInfo.typeExecutionMap[typeDescriptor];
                this.typeCoverageInfo[typeDescriptor] = { scenarios: { }, coverage: 0};
            }
            else
            {
                ValueTypeHelper.expand(this.typeVisitedFunctionsInfo[typeDescriptor], executionInfo.typeExecutionMap[typeDescriptor]);
            }

            this.typeCoverageInfo[typeDescriptor].scenarios[scenario.id] = scenario;

            var visitedFunctions = this.typeVisitedFunctionsInfo[typeDescriptor];

            var totalNumber = 0, executedNumber = 0;

            for(var visitedFunctionId in visitedFunctions)
            {
                var coverage = ASTHelper.getFunctionCoverageInfo(visitedFunctions[visitedFunctionId]);

                totalNumber += coverage.totalNumberOfBranches;
                executedNumber += coverage.executedNumberOfBranches;
            }

            var branchCoverage = executedNumber/totalNumber;

            if(Number.isNaN(branchCoverage)) { branchCoverage = 1; }

            this.typeCoverageInfo[typeDescriptor].coverage = branchCoverage;
        }
    },

    _getScenarioPriorityCoefficient: function(scenario)
    {
        var coverageCoefficient = 0;

        for(var i = 0; i < scenario.events.length; i++)
        {
            var event = scenario.events[i];

            if(this.typeCoverageInfo[event.typeHandlerFingerPrint] != null)
            {
                coverageCoefficient += this.typeCoverageInfo[event.typeHandlerFingerPrint].coverage;
            }
        }

        var averageCoverage = coverageCoefficient/scenario.events.length;

        if(Number.isNaN(averageCoverage) || averageCoverage > 1) { return 1; }

        return averageCoverage;
    }
};
/*****************************************************/
}});