var path = require('path');

var ASTHelper = require(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/ASTHelper.js")).ASTHelper;
var ValueTypeHelper = require(path.resolve(__dirname, "../../chrome/content/Firecrow/helpers/valueTypeHelper.js")).ValueTypeHelper;
var ScenarioModule = require(path.resolve(__dirname, "Scenario.js"));

var ScenarioCollection = function ScenarioCollection(prioritization)
{
    this.lengthGroups = [];
    this.scenarios = [];
    this.typeVisitedFunctionsInfo = {};
    this.currentIndex = -1;
    this.scenarioMap = {};
    this.eventPriorityMap = {};
    this.prioritization = prioritization;
};

ScenarioCollection.prototype =
{
    typeCoverageInfo: {},
    compareEvents: false,
    waitInterval: -1,

    setEmpiricalData: function(empiricalData)
    {
        this.empiricalData = empiricalData;
    },

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
        switch(this.prioritization)
        {
            case "random":
                return this._getNextRandomly();
            case "fifo":
                return this._getNextSequentially();
            case "eventLength":
                return this._getNextByLength();
            case "pathCoverage":
                return this._getNextByMaximizingPathCoverage();
            case "pathCoverageSequential":
                return this._getNextByMaximizingPathCoverageSequential();
            case "symbolicNew":
                return this._getNextByPrioritizingAgainstSymbolicAndNew();
            case "symbolicNewCoverage":
                return this._getNextBySymbolicNewCoverage();
            case "symbolicNewCoverageSequential":
                return this._getNextBySymbolicNewCoverageSequential();
            case "empirical":
                return this._getNextByEmpirical();
            default:
                return this._getNextSequentially();
        }
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

    _getNextByMaximizingPathCoverageSequential: function()
    {
        return this._getNextPrioritizingByLeastEventCoverageSequentially(this.getNonExecutedScenarios());
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

    _getNextBySymbolicNewCoverageSequential: function()
    {
        var nonExecutedScenarios = this.getNonExecutedScenarios();

        var firstSymbolicOrNewScenario = this._findFirstSymbolicOrNewEventScenario(nonExecutedScenarios);

        if(firstSymbolicOrNewScenario != null) { return firstSymbolicOrNewScenario; }

        return this._getNextPrioritizingByLeastEventCoverageSequentially(nonExecutedScenarios);
    },

    _getNextByEmpirical: function()
    {
        return this._getNextPrioritizingByEmpiricalData(this.getNonExecutedScenarios());
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

    _getNextPrioritizingByLeastEventCoverageSequentially: function(scenarios)
    {
        if(scenarios == null || scenarios.length == 0) { return null; }

        var maxCoefficient = 0; //can not be less than 0;
        var minCoveredScenario = null;
        for(var i = 0; i < scenarios.length; i++)
        {
            var coefficient = this._getScenarioCoverageCoefficient(scenarios[i]); // 1 - avgCov

            if(coefficient > maxCoefficient)
            {
                maxCoefficient = coefficient;
                minCoveredScenario = scenarios[i];
            }
        }

        return minCoveredScenario;
    },

    _getNextPrioritizingByLeastEventCoverage: function(scenarios)
    {
        return this._getRandomByCriteria(scenarios, this._getScenarioCoverageCoefficient);
    },

    _getNextPrioritizingByEmpiricalData: function(scenarios)
    {
        return this._getRandomByCriteria(scenarios, this._getEmpiricalCoefficient);
    },

    _getRandomByCriteria: function(scenarios, scenarioCriteriaCalculatorFunction)
    {
        if(scenarios == null || scenarios.length == 0) { return null; }

        var weightedIndexes = [];

        for(var i = 0; i < scenarios.length; i++)
        {
            var coefficient = scenarioCriteriaCalculatorFunction.call(this, scenarios[i]);
            var roundedCoefficient = Math.round(coefficient*100);
            if(roundedCoefficient > 0)
            {
                weightedIndexes.push([i, roundedCoefficient]);
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

    _getNextByEventLength: function()
    {

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
        var executedScenarios = this.getExecutedScenarios();

        //console.log("Executed scenarios: " + executedScenarios.length);

        executedScenarios = this._removeUnrelatedToUiControls(executedScenarios);

        //console.log("Scenarios related to UI control: " + executedScenarios.length);

        executedScenarios.sort(function(s1, s2)
        {
            return s2.events.length - s1.events.length;
        });

        var jointCoverage = this._getJointCoverageMap(executedScenarios);
        var keptScenarios = [];

        for(var i = 0; i < executedScenarios.length; i++)
        {
            var scenario = executedScenarios[i];

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
        var executedConstructIds = scenario.executionInfo.executedConstructsIdMap;

        for(var i = 0; i < executedConstructIds.length; i++)
        {
            if(jointCoverage[executedConstructIds[i]] - 1 <= 0) { return false; }
        }

        return true;
    },

    _removeScenarioCoverageFromJointCoverage: function(jointCoverage, scenario)
    {
        var executedConstructIds = scenario.executionInfo.executedConstructsIdMap;

        for(var i = 0; i < executedConstructIds.length; i++)
        {
            jointCoverage[executedConstructIds[i]]--;
        }
    },

    _getJointCoverageMap: function(scenarios)
    {
        var jointCoverage = {};

        for(var i = 0; i < scenarios.length; i++)
        {
            var executedConstructs = scenarios[i].executionInfo.executedConstructsIdMap;

            for(var j = 0; j < executedConstructs.length; j++)
            {
                var constructId = executedConstructs[j];
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
        return scenario.executionInfo.hasImportantModifications != null;
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

    _getScenarioCoverageCoefficient: function(scenario)
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

        //Greater the coverage lover the chance that the scenario will be selected
        if(scenario.events.length == 0 || averageCoverage > 1) { return 0; }

        return 1 - averageCoverage;
    },

    _getEmpiricalCoefficient: function(scenario)
    {
        var scenarioEvents = scenario.events;

        var coefficient = 1;

        if(scenarioEvents.length == 1) { return coefficient; }

        for(var i = 0; i < scenarioEvents.length - 1; i++)
        {
            var currentEvent = scenarioEvents[i];
            var nextEvent = scenarioEvents[i+1];

            coefficient *= this._getEventFollowProbability(currentEvent.getEmpiricalDescriptors(), nextEvent.getEmpiricalDescriptors());
        }

        return coefficient;
    },

    _getEventFollowProbability: function(currentDescriptors, nextDescriptors)
    {
        var existingCurrentDescriptor = this._getExistingDescriptor(currentDescriptors);
        var existingNextDescriptor = this._getExistingDescriptor(nextDescriptors);

        if(this.empiricalData[existingCurrentDescriptor] == null
        || this.empiricalData[existingCurrentDescriptor] == null) { return 1; }

        return this.empiricalData[existingCurrentDescriptor][existingNextDescriptor];
    },

    _getExistingDescriptor: function(descriptors)
    {
        for(var i = 0; i < descriptors.length; i++)
        {
            if(this.empiricalData[descriptors[i]])
            {
                return descriptors[i];
            }
        }

        return null;
    }
};

exports.ScenarioCollection = ScenarioCollection;