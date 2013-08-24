var ValueTypeHelper = require("C:\\GitWebStorm\\Firecrow\\chrome\\content\\Firecrow\\helpers\\ValueTypeHelper.js").ValueTypeHelper;
var ASTHelper = require("C:\\GitWebStorm\\Firecrow\\chrome\\content\\Firecrow\\helpers\\ASTHelper.js").ASTHelper;
var ScenarioModule = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\Scenario.js");
var ScenarioGeneratorHelper = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\ScenarioGeneratorHelper.js").ScenarioGeneratorHelper;

var ScenarioCollection = function ScenarioCollection()
{
    this.lengthGroups = [];
    this.scenarios = [];
    this.typeVisitedFunctionsInfo = {};
    this.currentIndex = -1;
    this.scenarioMap = {};
    this.eventPriorityMap = {};
};

ScenarioCollection.prototype =
{
    randomPrioritization: false,
    fifoPrioritization: true,
    eventLengthPrioritization: false,
    maximizingPathCoveragePrioritization: false,
    symbolicAndNewPrioritization: false,
    symbolicNewCoveragePrioritization: false,

    typeCoverageInfo: {},
    compareEvents: false,
    waitInterval: -1,

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
        if (this.maximizingPathCoveragePrioritization) { return this._getNextByMaximizingPathCoverage(); }
        else if (this.eventLengthPrioritization) { return this._getNextByLength(); }
        else if (this.randomPrioritization) { return this._getNextRandomly(); }
        else if (this.fifoPrioritization) { return this._getNextSequentially(); }
        else if (this.symbolicAndNewPrioritization) { return this._getNextByPrioritizingAgainstSymbolicAndNew(); }
        else if (this.symbolicNewCoveragePrioritization) { return this._getNextBySymbolicNewCoverage(); }

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
            if(scenarios[i].isCreatedBySymbolic() || scenarios[i].isCreatedByNewEvent()) { return scenarios[i]; }
        }

        return null;
    },

    _findFirstNewEventScenario: function(scenarios)
    {
        for(var i = 0; i < scenarios.length; i++)
        {
            if(scenarios[i].isCreatedByNewEvent()) { return scenarios[i]; }
        }

        return null;
    },

    _findFirstSymbolicScenario: function(scenarios)
    {
        for(var i = 0; i < scenarios.length; i++)
        {
            if(scenarios[i].isCreatedBySymbolic()) { return scenarios[i]; }
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

        var scenario = new ScenarioModule.Scenario(events, inputConstraint, parentScenarios);

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

            if(this.eventPriorityMap[event.thisObjectDescriptor][event.eventType] > ScenarioGeneratorHelper.uiControlEventPriority
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

            var branchCoverage = totalNumber != 0 ? executedNumber/totalNumber
                                                  : 1;

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

exports.ScenarioCollection = ScenarioCollection;