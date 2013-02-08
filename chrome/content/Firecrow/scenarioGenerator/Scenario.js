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
};

fcScenarioGenerator.Scenario.LAST_ID = 0;

fcScenarioGenerator.Scenario.prototype =
{
    addEvent: function(usageScenarioEvent)
    {
        this.events.push(usageScenarioEvent);
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

        this.ownerCollection.aggregateEventCoverageInfo(executionInfo);
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

    isEqualTo: function(scenario)
    {
        var thisInputConstraintString = this.inputConstraint != null ? this.inputConstraint.toString() : "";
        var scenarioInputConstraintString = scenario.inputConstraint != null ? scenario.inputConstraint.toString() : "";
        var thisResolvedResult = this.inputConstraint != null ? JSON.stringify(this.inputConstraint.resolvedResult) : "";
        var scenarioResolvedResult = scenario.inputConstraint != null ? JSON.stringify(scenario.inputConstraint.resolvedResult) : "";

        return this._haveEqualEvents(scenario) && (thisInputConstraintString == scenarioInputConstraintString
                                               || thisResolvedResult == scenarioResolvedResult);
    },

    isEqualToByComponents: function(events, inputConstraint, parentScenarios)
    {
        var thisInputConstraintString = this.inputConstraint != null ? this.inputConstraint.toString() : "";
        var scenarioInputConstraintString = inputConstraint != null ? inputConstraint.toString() : "";
        var thisResolvedResult = this.inputConstraint != null ? JSON.stringify(this.inputConstraint.resolvedResult) : "";
        var scenarioResolvedResult = inputConstraint != null ? JSON.stringify(inputConstraint.resolvedResult) : "";

        return this._haveEqualEventsByComponents(events) && (thisInputConstraintString == scenarioInputConstraintString
                                                          || thisResolvedResult == scenarioResolvedResult);
    },

    _haveEqualEvents: function(scenario)
    {
        if(this.events.length != scenario.events.length || this.events.length == 0) { return false; }

        for(var i = 0; i < this.events.length; i++)
        {
            if(!fcScenarioGenerator.Event.areEqual(this.events[i], scenario.events[i]))
            {
                return false;
            }
        }

        return true;
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

fcScenarioGenerator.Scenario.mergeScenarios = function(firstScenario, secondScenario)
{
    var mergedEvents = firstScenario.events.concat(secondScenario.events);
    var mergedInputConstraint = null;

    if(firstScenario.inputConstraint.pathConstraintItems.length == 0 && secondScenario.inputConstraint.pathConstraintItems.length == 0)
    {
        mergedInputConstraint = new fcSymbolic.PathConstraint();
    }
    else if(firstScenario.inputConstraint.pathConstraintItems.length != 0 && secondScenario.inputConstraint.pathConstraintItems.length == 0)
    {
        mergedInputConstraint = firstScenario.inputConstraint;
    }
    else if(firstScenario.inputConstraint.pathConstraintItems.length == 0 && secondScenario.inputConstraint.pathConstraintItems.length != 0)
    {
        mergedInputConstraint = secondScenario.inputConstraint.createCopyUpgradedByIndex(firstScenario.events.length);
    }
    else
    {
        mergedInputConstraint = firstScenario.inputConstraint.createCopyUpgradedByIndex(0);
        mergedInputConstraint.append(secondScenario.inputConstraint.createCopyUpgradedByIndex(firstScenario.events.length));
    }

    var scenario = new fcScenarioGenerator.Scenario(mergedEvents, mergedInputConstraint, [firstScenario, secondScenario]);

    return scenario;
};

fcScenarioGenerator.ScenarioCollection = function()
{
    this.lengthGroups = [];
    this.scenarios = [];
    this.eventCoverageInfo = {};
    this.currentIndex = 0;
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
        return this._findWithLeastEventCoverage(this.getNonExecutedScenarios());
    },

    _findWithLeastEventCoverage: function(scenarios)
    {
        if(scenarios.length == 0) { return null; }

        //Top priorities are scenarios without parents (the initially created ones)
        var firstParentLessScenario = this._findFirstParentlessScenario(scenarios);

        if(firstParentLessScenario != null) { return firstParentLessScenario; }

        return this._findFirstWithLeastEventCoverage(scenarios);
    },

    _findFirstParentlessScenario: function(scenarios)
    {
        for(var i = 0; i < scenarios.length; i++)
        {
            if(scenarios[i].parentScenarios.length == 0)
            {
                return scenarios[i];
            }
        }

        return null;
    },

    _findFirstWithLeastEventCoverage: function(scenarios)
    {
        var minimumCoverage = Number.MAX_VALUE, minIndex = 0;

        for(var i = 0; i < scenarios.length; i++)
        {
            var scenarioEventCoverage = this._getScenarioEventCoverage(scenarios[i]);

            if(scenarioEventCoverage.expressionCoverage < minimumCoverage)
            {
                minimumCoverage = scenarioEventCoverage.expressionCoverage;
                minIndex = i;
            }
        }

        return scenarios[minIndex];
    },

    _getScenarioEventCoverage: function(scenario)
    {
        var events = scenario.events;
        var jointCoverage = { totalNumberOfExpressions: 0, executedNumberOfExpressions: 0, expressionCoverage:0};

        for(var i = 0; i < events.length; i++)
        {
            var event = events[i];
            var eventCoverage = this.getSingleEventCoverage(event.thisObjectDescriptor, event.eventType);

            if(eventCoverage != null)
            {
                jointCoverage.totalNumberOfExpressions += eventCoverage.totalNumberOfExpressions;
                jointCoverage.executedNumberOfExpressions += eventCoverage.executedNumberOfExpressions;
                //jointCoverage.expressionCoverage += eventCoverage.executedNumberOfExpressions;
            }
        }

        jointCoverage.expressionCoverage = jointCoverage.executedNumberOfExpressions/jointCoverage.totalNumberOfExpressions;
        if(Number.isNaN(jointCoverage.expressionCoverage))
        {
            jointCoverage.expressionCoverage = 0;
        }

        return jointCoverage;
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
             if(this.maximizingPathCoveragePrioritization || this.randomPrioritization) { return this._haveMoreNonExecutedScenarios(); }
        else if(this.eventLengthPrioritization) { this._isLastScenarioByLength(scenario); }
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
        if(scenario == null || this._containsScenario(scenario, this.scenarios)) { return false; }

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

        scenario.ownerCollection = this;
    },

    addScenarioByComponents: function(events, inputConstraint, parentScenarios)
    {
        if(this._containsScenarioByComponents(this.scenarios, events, inputConstraint, parentScenarios)) { return; }

        this._addScenario(new fcScenarioGenerator.Scenario(events, inputConstraint, parentScenarios));
    },

    _containsScenario: function(scenario, scenarios)
    {
        for(var i = 0; i < scenarios.length; i++)
        {
            if(scenario.isEqualTo(scenarios[i])) { return true; }
        }

        return false;
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
        return this.scenarios.filter(function(scenario)
        {
            return scenario.executionInfo != null;
        })
    },

    getNonExecutedScenarios: function()
    {
        return this.scenarios.filter(function(scenario)
        {
            return scenario.executionInfo == null;
        });
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

    calculateEventCoverage: function()
    {
        var eventCoverage = this.getEventCoverage();

        var totalNumberOfExpressions = 0;
        var executedNumberOfExpressions = 0;

        for(var i = 0; i < eventCoverage.length; i++)
        {
            totalNumberOfExpressions += eventCoverage[i].totalNumberOfExpressions;
            executedNumberOfExpressions += eventCoverage[i].executedNumberOfExpressions;
        }

        if(executedNumberOfExpressions == 0) { return 0; }

        return executedNumberOfExpressions/totalNumberOfExpressions
    },

    getEventCoverage: function()
    {
        var eventCoverage = [];

        for(var baseObjectDescriptor in this.eventCoverageInfo)
        {
            var eventDescriptors = this.eventCoverageInfo[baseObjectDescriptor];

            for(var eventType in eventDescriptors)
            {
                var eventDescriptor = baseObjectDescriptor + eventType;
                var visitedFunctions = eventDescriptors[eventType];

                var totalCoverageInfo = {
                    totalNumberOfExpressions: 0,
                    executedNumberOfExpressions: 0
                };

                for(var visitedFunctionId in visitedFunctions)
                {
                    var coverage = ASTHelper.getFunctionCoverageInfo(visitedFunctions[visitedFunctionId], eventDescriptor);

                    totalCoverageInfo.totalNumberOfExpressions += coverage.totalNumberOfExpressions;
                    totalCoverageInfo.executedNumberOfExpressions += coverage.executedNumberOfExpressions;
                }

                eventCoverage.push({
                    baseObjectDescriptor: baseObjectDescriptor,
                    eventType: eventType,
                    executedNumberOfExpressions: totalCoverageInfo.executedNumberOfExpressions,
                    totalNumberOfExpressions: totalCoverageInfo.totalNumberOfExpressions,
                    coverage: totalCoverageInfo.executedNumberOfExpressions/totalCoverageInfo.totalNumberOfExpressions
                });
            }
        }

        return eventCoverage;
    },

    getSingleEventCoverage: function(baseObjectDescriptor, eventType)
    {
        var eventDescriptors = this.eventCoverageInfo[baseObjectDescriptor];
        var eventDescriptor = baseObjectDescriptor + eventType;

        if(eventDescriptors == null) { return null;}

        var visitedFunctions = eventDescriptors[eventType];

        if(visitedFunctions == null) { return null;}


        var totalCoverageInfo = {
            totalNumberOfExpressions: 0,
            executedNumberOfExpressions: 0
        };

        for(var visitedFunctionId in visitedFunctions)
        {
            var coverage = ASTHelper.getFunctionCoverageInfo(visitedFunctions[visitedFunctionId], eventDescriptor);

            totalCoverageInfo.totalNumberOfExpressions += coverage.totalNumberOfExpressions;
            totalCoverageInfo.executedNumberOfExpressions += coverage.executedNumberOfExpressions;
        }

        totalCoverageInfo.expressionCoverage = totalCoverageInfo.executedNumberOfExpressions/totalCoverageInfo.totalNumberOfExpressions;

        return totalCoverageInfo;
    },

    aggregateEventCoverageInfo: function(executionInfo)
    {
        for(var baseObjectDescriptor in executionInfo.eventExecutionsMap)
        {
            var descriptorInfo = executionInfo.eventExecutionsMap[baseObjectDescriptor];

            if(this.eventCoverageInfo[baseObjectDescriptor] == null) { this.eventCoverageInfo[baseObjectDescriptor] = descriptorInfo; }
            else
            {
                for(var eventType in descriptorInfo)
                {
                    if(this.eventCoverageInfo[baseObjectDescriptor][eventType] == null)
                    {
                        this.eventCoverageInfo[baseObjectDescriptor][eventType] = descriptorInfo[eventType];
                    }
                    else
                    {
                        ValueTypeHelper.expand(this.eventCoverageInfo[baseObjectDescriptor][eventType], descriptorInfo[eventType]);
                    }
                }
            }
        }
    }
};
/*****************************************************/
}});