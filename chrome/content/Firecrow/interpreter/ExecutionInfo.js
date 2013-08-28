FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcBrowser = Firecrow.DoppelBrowser;
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;

Firecrow.DATA_DEPENDENCIES = {};

fcBrowser.ExecutionInfo = function()
{
    this.pathConstraint = new Firecrow.ScenarioGenerator.Symbolic.PathConstraint();

    this.undefinedGlobalPropertiesAccessMap = {};
    this.resourceSetterPropertiesMap = {};
    this.objectForInIterations = [];

    this.globalModifiedIdentifiers = {};
    this.globalModifiedObjects = {};

    this.afterLoadingModifiedIdentifiers = {};
    this.afterLoadingModifiedObjects = {};

    this.globalAccessedIdentifiers = {};
    this.globalAccessedObjects = {};

    this.afterLoadingAccessedIdentifiers = {};
    this.afterLoadingAccessedObjects = {};

    this.eventRegistrations = [];
    this.eventExecutionsMap = {};
    this.typeExecutionMap = {};
    this.eventExecutions = [];
    this.currentEventExecutionInfo = null;

    this.executedConstructsIdMap = {};
    this.dataDependencies = {};
    this.branchingConstructs = {};
    this.importantModifications = {};
};

fcBrowser.ExecutionInfo.prototype =
{
    toJSON: function()
    {
        return {
            pathConstraint: this.pathConstraint,

            undefinedGlobalPropertiesAccessMap: this.getUndefinedGlobalPropertiesAccessMapJson(),
            /*Resource setter and for in iterations are not required*/

            globalModifiedIdentifiers: ValueTypeHelper.convertObjectPropertyNamesToArray(this.globalModifiedIdentifiers),
            /*SKIPPED global modified objects, for now*/

            afterLoadingModifiedIdentifiers: ValueTypeHelper.convertObjectPropertyNamesToArray(this.afterLoadingModifiedIdentifiers),
            afterLoadingModifiedObjects: this.afterLoadingModifiedObjects,

            globalAccessedIdentifiers: ValueTypeHelper.convertObjectPropertyNamesToArray(this.globalAccessedIdentifiers),
            /*SKIPPED global accessed objects, for now*/

            afterLoadingAccessedIdentifiers: ValueTypeHelper.convertObjectPropertyNamesToArray(this.afterLoadingAccessedIdentifiers),
            afterLoadingAccessedObjects: ValueTypeHelper.convertObjectPropertyNamesToArray(this.afterLoadingAccessedObjects),

            eventRegistrations: this._getEventRegistrationsJson(this.eventRegistrations),
            eventExecutionsMap: this._getEventExecutionsMapJson(),
            typeExecutionMap: this._getTypeExecutionMapJson(),
            eventExecutions: this._getEventExecutionsJson(),
            executedConstructsIdMap: ValueTypeHelper.convertObjectPropertyNamesToArray(this.executedConstructsIdMap),
            /*SKIPPED DATA DEPENDENCIES*/
            branchingConstructs: ValueTypeHelper.convertObjectPropertyNamesToArray(this.branchingConstructs),
            /*SKIPPED IMPORTANT MODIFICATIONS*/

            dataDependencies: this.dataDependencies,
            achievedCoverage: this.achievedCoverage
        };
    },

    _getEventExecutionJson: function(eventExecution)
    {
        return {
            baseObjectDescriptor: eventExecution.baseObjectDescriptor,
            branchingConstructs: ValueTypeHelper.convertObjectPropertyNamesToArray(eventExecution.branchingConstructs),
            eventDescriptor: eventExecution.eventDescriptor,
            eventRegistrations: this._getEventRegistrationsJson(eventExecution.eventRegistrations),
            eventType: eventExecution.eventType,
            globalAccessedIdentifiers: ValueTypeHelper.convertObjectPropertyNamesToArray(eventExecution.globalAccessedIdentifiers),
            /*SKIPPED GLOBAL ACCESSED OBJECTS, for now*/
            globalModifiedIdentifiers: ValueTypeHelper.convertObjectPropertyNamesToArray(eventExecution.globalModifiedIdentifiers),
            globalModifiedObjects: eventExecution.globalModifiedObjects,
            /*SKIPPED important modifications*/
            typeDescriptor: eventExecution.typeDescriptor,
            typeVisitedFunctionsMap: ValueTypeHelper.convertObjectPropertyNamesToArray(eventExecution.typeVisitedFunctionsMap),
            visitedFunctionsMap: ValueTypeHelper.convertObjectPropertyNamesToArray(eventExecution.visitedFunctionsMap),
            dataDependencies: eventExecution.dataDependencies
        };
    },


    getUndefinedGlobalPropertiesAccessMapJson: function()
    {
        var obj = {};

        for(var propertyName in this.undefinedGlobalPropertiesAccessMap)
        {
            if(obj[propertyName] == null) { obj[propertyName] = [] }

            for(var constructId in this.undefinedGlobalPropertiesAccessMap[propertyName])
            {
                obj[propertyName].push(constructId);
            }
        }

        return obj;
    },

    _getEventRegistrationsJson: function(eventRegistrations)
    {
        var eventRegistrationsInfo = [];

        for(var i = 0; i < eventRegistrations.length; i++)
        {
            var eventRegistration = eventRegistrations[i];

            eventRegistrationsInfo.push
            ({
                eventType: eventRegistration.eventType,
                thisObjectDescriptor: eventRegistration.thisObjectDescriptor,
                thisObjectModelNodeId: eventRegistration.thisObjectModel != null ? eventRegistration.thisObjectModel.nodeId || eventRegistration.thisObjectModel : null,
                registrationConstructNodeId: eventRegistration.registrationConstruct != null ? eventRegistration.registrationConstruct.nodeId : null,
                handlerConstructNodeId: eventRegistration.handlerConstruct != null ? eventRegistration.handlerConstruct.nodeId : null,
                timePeriod: eventRegistration.timePeriod,
                timerId: eventRegistration.timerId
            });
        }

        return eventRegistrationsInfo;
    },

    _getEventExecutionsMapJson: function()
    {
        var object = {};

        for(var thisDescriptor in this.eventExecutionsMap)
        {
            object[thisDescriptor] = {};

            for(var eventType in this.eventExecutionsMap[thisDescriptor])
            {
                object[thisDescriptor][eventType] = [];

                for(var functionNodeId in this.eventExecutionsMap[thisDescriptor][eventType])
                {
                    object[thisDescriptor][eventType].push(functionNodeId);
                }
            }
        }

        return object;
    },

    _getTypeExecutionMapJson: function()
    {
        var object = { };

        for(var eventTypeId in this.typeExecutionMap)
        {
            object[eventTypeId] = [];

            for(var functionConstructId in this.typeExecutionMap[eventTypeId])
            {
                object[eventTypeId].push(functionConstructId);
            }
        }

        return object;
    },

    _getEventExecutionsJson: function()
    {
        var eventExecutionsJson = [];

        for(var i = 0; i < this.eventExecutions.length; i++)
        {
            eventExecutionsJson.push(this._getEventExecutionJson(this.eventExecutions[i]));
        }

        return eventExecutionsJson;
    },

    getLastEventInfoString: function()
    {
        var object = this.currentEventExecutionInfo != null ? this.currentEventExecutionInfo : this;
        return "PathConstraint: " + this.pathConstraint.toString() + "\r\n"
            +  "AI: " + ValueTypeHelper.convertObjectPropertyNamesToArray(object.globalAccessedIdentifiers).join(",")  + "\r\n"
            +  "MI: " + ValueTypeHelper.convertObjectPropertyNamesToArray(object.globalModifiedIdentifiers).join(",") + "\r\n"
            +  "MO: " + ValueTypeHelper.convertObjectPropertyNamesToArray(object.globalModifiedObjects).join(",") + "\r\n"
            +  "AO: " + ValueTypeHelper.convertObjectPropertyNamesToArray(object.globalAccessedObjects).join(",");
    },

    lastExecutionSummaryModifiesDom: function()
    {
        if(this.currentEventExecutionInfo == null) { return ValueTypeHelper.objectHasProperties(this.importantModifications); }

        return ValueTypeHelper.objectHasProperties(this.currentEventExecutionInfo.importantModifications);
    },

    executionSummaryFromEndModifiesDom: function(indexFromEnd)
    {
        var eventExecutionInfo = this.eventExecutions[this.eventExecutions.length - indexFromEnd];

        if(eventExecutionInfo == null) { return false; }

        return ValueTypeHelper.objectHasProperties(eventExecutionInfo.importantModifications);
    },

    logImportantModificationReached: function(codeConstruct)
    {
        if(codeConstruct == null) { return; }

        if(this.currentEventExecutionInfo != null)
        {
            this.currentEventExecutionInfo.importantModifications[codeConstruct.nodeId] = codeConstruct;
        }

        this.importantModifications[codeConstruct.nodeId] = codeConstruct;
    },

    logEventExecution: function(baseObjectDescriptor, eventType, handlerConstruct)
    {
        if(this.currentEventExecutionInfo == null && (eventType == "onload" || eventType == "DOMContentLoaded" || eventType == "load"))
        {
            return;
        }

        if(baseObjectDescriptor == null || eventType == null) { debugger; alert("Error when logging event execution"); return; }

        var typeDescriptor = eventType + handlerConstruct.nodeId;

        if(this.eventExecutionsMap[baseObjectDescriptor] == null)
        {
            this.eventExecutionsMap[baseObjectDescriptor] = {};
        }

        if(this.eventExecutionsMap[baseObjectDescriptor][eventType] == null)
        {
            this.eventExecutionsMap[baseObjectDescriptor][eventType] = {};
        }

        if(this.typeExecutionMap[typeDescriptor] == null)
        {
            this.typeExecutionMap[typeDescriptor] = {};
        }

        this.currentEventExecutionInfo =
        {
            baseObjectDescriptor: baseObjectDescriptor,
            eventType: eventType,
            visitedFunctionsMap: this.eventExecutionsMap[baseObjectDescriptor][eventType],
            typeVisitedFunctionsMap: this.typeExecutionMap[typeDescriptor],
            eventDescriptor: baseObjectDescriptor + eventType,
            typeDescriptor: typeDescriptor,
            globalModifiedIdentifiers: {},
            globalAccessedIdentifiers: {},
            eventRegistrations: [],
            globalAccessedObjects: {},
            globalModifiedObjects: {},
            branchingConstructs: {},
            importantModifications: {},
            dataDependencies: {}
        };

        this.eventExecutions.push(this.currentEventExecutionInfo);
    },

    logExecutedConstruct: function(codeConstruct)
    {
        if(codeConstruct == null) { return; }

        this.executedConstructsIdMap[codeConstruct.nodeId] = true;

        if(this.currentEventExecutionInfo != null)
        {
            if(codeConstruct.test != null)
            {
                this.currentEventExecutionInfo.branchingConstructs[codeConstruct.test.nodeId] = codeConstruct.test;
            }

            if(codeConstruct.discriminant != null)
            {
                this.currentEventExecutionInfo.branchingConstructs[codeConstruct.discriminant.nodeId] = codeConstruct.discriminant;
            }
        }

        if(codeConstruct.test != null)
        {
            this.branchingConstructs[codeConstruct.test.nodeId] = codeConstruct.test;
        }

        if(codeConstruct.discriminant != null)
        {
            this.branchingConstructs[codeConstruct.discriminant.nodeId] = codeConstruct.discriminant;
        }

        if(this.currentEventExecutionInfo != null)
        {
            if(codeConstruct.executorEventsMap == null) { codeConstruct.executorEventsMap = {}; }

            codeConstruct.executorEventsMap[this.currentEventExecutionInfo.eventDescriptor] = true;
            codeConstruct.executorEventsMap[this.currentEventExecutionInfo.typeDescriptor] = true;
        }
    },

    logEnteringFunction: function(functionConstruct)
    {
        if(functionConstruct == null) { return; }

        if(this.currentEventExecutionInfo != null)
        {
            this.currentEventExecutionInfo.visitedFunctionsMap[functionConstruct.nodeId] = functionConstruct;
            this.currentEventExecutionInfo.typeVisitedFunctionsMap[functionConstruct.nodeId] = functionConstruct;
        }
    },

    logDependencies: function(fromConstruct, toConstruct)
    {
        if(fromConstruct == null || toConstruct == null || fromConstruct.nodeId == null || toConstruct.nodeId == null) { return; }

        if(this.dataDependencies[fromConstruct.nodeId] == null) { this.dataDependencies[fromConstruct.nodeId] = {}; }
        if(Firecrow.DATA_DEPENDENCIES[fromConstruct.nodeId] == null) { Firecrow.DATA_DEPENDENCIES[fromConstruct.nodeId] = {}; }

        this.dataDependencies[fromConstruct.nodeId][toConstruct.nodeId] = true;
        Firecrow.DATA_DEPENDENCIES[fromConstruct.nodeId][toConstruct.nodeId] = true;

        if(this.currentEventExecutionInfo != null)
        {
            if(this.currentEventExecutionInfo.dataDependencies[fromConstruct.nodeId] == null) { this.currentEventExecutionInfo.dataDependencies[fromConstruct.nodeId] = {}; }
            this.currentEventExecutionInfo.dataDependencies[fromConstruct.nodeId][toConstruct.nodeId] = true;
        }
    },

    addConstraint: function(codeConstruct, constraint, inverse)
    {
        if(constraint == null) { return; }

        this.pathConstraint.addConstraint(codeConstruct, constraint, inverse);
    },

    addPathConstraintItem: function(pathConstraintItem)
    {
        this.pathConstraint.addPathConstraintItem(pathConstraintItem);
    },

    addPathConstraintItemToBeginning: function(pathConstraintItem)
    {
        this.pathConstraint.addPathConstraintItemToBeginning(pathConstraintItem);
    },

    compareExecutedConstructs: function(executionInfoB)
    {
        var executedConstructsA = this.executedConstructsIdMap;
        var executedConstructsB = executionInfoB.executedConstructsIdMap;

        var totalExecutionInfoAProperties = 0;
        var totalExecutionInfoBProperties = 0;
        var commonPropertiesNumber = 0;

        var isFirstIterationOverB = true;

        for(var nodeIdA in executedConstructsA)
        {
            for(var nodeIdB in executedConstructsB)
            {
                if(isFirstIterationOverB)
                {
                    totalExecutionInfoBProperties++;
                }

                if(nodeIdA == nodeIdB)
                {
                    commonPropertiesNumber++;
                }
            }

            totalExecutionInfoAProperties++;
            isFirstIterationOverB = false;
        }

        return {
            areEqual: commonPropertiesNumber == totalExecutionInfoAProperties
                && commonPropertiesNumber == totalExecutionInfoBProperties,

            isFirstSubsetOfSecond: commonPropertiesNumber == totalExecutionInfoAProperties
                &&  totalExecutionInfoAProperties < totalExecutionInfoBProperties,

            isSecondSubsetOfFirst: commonPropertiesNumber == totalExecutionInfoBProperties
                &&  totalExecutionInfoBProperties < totalExecutionInfoAProperties
        };
    },

    logAccessingUndefinedProperty: function(propertyName, codeConstruct)
    {
        if(codeConstruct == null || fcModel.GlobalObject.CONST.isEventProperty(propertyName)) { return; }

        if(this.undefinedGlobalPropertiesAccessMap[propertyName] == null)
        {
            this.undefinedGlobalPropertiesAccessMap[propertyName] = {};
        }

        this.undefinedGlobalPropertiesAccessMap[propertyName][codeConstruct.nodeId] = codeConstruct;
    },

    logResourceSetting: function(codeConstruct, resourcePath)
    {
        if(codeConstruct == null) { return; }

        this.resourceSetterPropertiesMap[codeConstruct.nodeId] =
        {
            codeConstruct: codeConstruct,
            resourceValue: resourcePath
        };
    },

    logForInIteration: function(codeConstruct, objectPrototype)
    {
        //console.log("Not logging for in iterations");
        this.objectForInIterations.push({ proto: objectPrototype, codeConstruct: codeConstruct });
    },

    getLastEventRegistrations: function()
    {
        return this.eventExecutions[this.eventExecutions.length - 1] != null
            ? this.eventExecutions[this.eventExecutions.length - 1].eventRegistrations
            : this.eventRegistrations;
    },

    logEventRegistered: function(thisObjectDescriptor, thisObjectModel, eventType, registrationConstruct, handlerConstruct, loadingEventsExecuted, timerId, timePeriod)
    {
        var eventRegistrationInfo =
        {
            thisObjectDescriptor: thisObjectDescriptor,
            thisObjectModel: thisObjectModel,
            eventType: eventType,
            registrationConstruct: registrationConstruct,
            handlerConstruct: handlerConstruct,
            loadingEventsExecuted: loadingEventsExecuted,
            timerId: timerId,
            timePeriod: timePeriod
        };

        if(this.currentEventExecutionInfo != null)
        {
            this.currentEventExecutionInfo.eventRegistrations.push(eventRegistrationInfo);
        }

        this.eventRegistrations.push(eventRegistrationInfo);
    },

    logEventDeRegistered: function(htmlNode, eventType, deregistrationConstruct, timerId)
    {
        if(eventType == "interval") { this._removeFirstRegisteredEventByTypeAndTimerId(eventType, timerId); return; }
    },

    _removeFirstRegisteredEventByTypeAndTimerId: function(eventType, timerId)
    {
        return;
        for(var i = 0, length = this.eventRegistrations.length; i < length; i++)
        {
            var eventRegistration = this.eventRegistrations[i];

            if(eventRegistration.eventType == eventType && eventRegistration.timerId == timerId)
            {
                ValueTypeHelper.removeFromArrayByIndex(this.eventRegistrations, i);
                break;
            }
        }

        for(var i = 0; i < this.eventExecutions.length; i++)
        {
            var eventExecution = this.eventExecutions[i];

            for(var j = 0; j < eventExecution.eventRegistrations.length; j++)
            {
                var eventRegistration = eventExecution.eventRegistrations[j];

                if(eventRegistration.eventType == eventType && eventRegistration.timerId == timerId)
                {
                    ValueTypeHelper.removeFromArrayByIndex(eventExecution.eventRegistrations, i);
                    return;
                }
            }
        }
    },

    logModifyingExternalContextIdentifier: function(identifier)
    {
        if(identifier.declarationPosition == null) { return; }
        //START TEST
        if(this.currentEventExecutionInfo != null)
        {
            this.currentEventExecutionInfo.globalModifiedIdentifiers[identifier.declarationPosition.codeConstruct.nodeId] = identifier.declarationPosition.codeConstruct;
            this.afterLoadingModifiedIdentifiers[identifier.declarationPosition.codeConstruct.nodeId] = identifier.declarationPosition.codeConstruct;
        }

        this.globalModifiedIdentifiers[identifier.declarationPosition.codeConstruct.nodeId] = identifier.declarationPosition.codeConstruct;
        return;
        //END TEST

        if(identifier.name.indexOf("_FC_") == 0) { return; }

        var modifiedIdentifierInfoID = identifier.name + "_FC_" + identifier.declarationPosition.codeConstruct.nodeId;
        if(this.currentEventExecutionInfo != null)
        {
            this.currentEventExecutionInfo.globalModifiedIdentifiers[modifiedIdentifierInfoID] = true;
        }

        this.globalModifiedIdentifiers[modifiedIdentifierInfoID] = true;
    },

    logReadingIdentifierOutsideCurrentScope: function(identifier, codeConstruct)
    {
        //START TEST
        if(!ASTHelper.isBranchingConditionConstruct(codeConstruct)) { return; }

        if(this.currentEventExecutionInfo != null)
        {
            this.currentEventExecutionInfo.globalAccessedIdentifiers[codeConstruct.nodeId] = codeConstruct;
            this.afterLoadingAccessedIdentifiers[codeConstruct.nodeId] = codeConstruct;
        }

        this.globalAccessedIdentifiers[codeConstruct.nodeId] = codeConstruct;

        return;
        //END TEST

        //OLD CODE BELOW

        //The idea was to log only identifiers that are in the branching statements
        //but that is not correct, because of the following case:
        //one event writes to a "global" variable A, the global variable A is used to create a global variable B
        //global variable B influences the control flow
        if(identifier.declarationPosition == null) { return; }
        if(identifier.name.indexOf("_FC_") == 0) { return; }

        var accessedGlobalIdentifierInfoID = identifier.name + "_FC_" + identifier.declarationPosition.codeConstruct.nodeId;

        if(this.currentEventExecutionInfo != null)
        {
            this.currentEventExecutionInfo.globalAccessedIdentifiers[accessedGlobalIdentifierInfoID] = true;
        }

        this.globalAccessedIdentifiers[accessedGlobalIdentifierInfoID] = true;
    },

    logReadingObjectPropertyOutsideCurrentScope: function(objectCreationConstructId, propertyName, codeConstruct)
    {
        //START TEST
        if(!ASTHelper.isBranchingConditionConstruct(codeConstruct)) { return; }

        if(this.currentEventExecutionInfo != null)
        {
            this.currentEventExecutionInfo.globalAccessedObjects[codeConstruct.nodeId] = codeConstruct;
            this.afterLoadingAccessedObjects[codeConstruct.nodeId] = codeConstruct;
        }

        this.globalAccessedObjects[codeConstruct.nodeId] = codeConstruct;

        return;
        //END TEST
        if(ValueTypeHelper.isNumber(propertyName)) { return; }

        var accessedObjectInfoID = propertyName + "_FC_" + objectCreationConstructId;

        if(this.currentEventExecutionInfo != null)
        {
            this.currentEventExecutionInfo.globalAccessedObjects[accessedObjectInfoID] = true;
        }

        this.globalAccessedObjects[accessedObjectInfoID] = true;
    },

    logModifyingExternalContextObject: function(objectCreationConstructId, propertyName)
    {
        //START TEST
        if(this.currentEventExecutionInfo != null)
        {
            this.currentEventExecutionInfo.globalModifiedObjects[objectCreationConstructId] = propertyName;
            this.afterLoadingModifiedObjects[objectCreationConstructId] = propertyName;
        }

        this.globalModifiedObjects[objectCreationConstructId] = propertyName;
        return;
        //END TEST
        if(ValueTypeHelper.isNumber(propertyName)) { return; }

        var modifiedObjectInfoID = propertyName + "_FC_" + objectCreationConstructId;

        if(this.currentEventExecutionInfo != null)
        {
            this.currentEventExecutionInfo.globalModifiedObjects[modifiedObjectInfoID] = true;
        }

        this.globalModifiedObjects[modifiedObjectInfoID] = true;
    },

    isDependentOn: function(executionInfo, checkWholeExecution)
    {
        return this._isIdentifierDependent(executionInfo, checkWholeExecution) || this._isObjectModificationsDependent(executionInfo, checkWholeExecution);
    },

    _isIdentifierDependent: function(executionInfo, checkWholeExecution)
    {
        //Compare only to last event execution info (since all events are always traversed)
        var thisGlobalAccessedIdentifiers = this.eventExecutions[this.eventExecutions.length - 1] != null && !checkWholeExecution
                                          ? this.eventExecutions[this.eventExecutions.length - 1].globalAccessedIdentifiers
                                          : this.globalAccessedIdentifiers;

        var comparisonGlobalModifiedIdentifiers = executionInfo.eventExecutions[executionInfo.eventExecutions.length - 1] != null && !checkWholeExecution
                                                ? executionInfo.eventExecutions[executionInfo.eventExecutions.length - 1].globalModifiedIdentifiers
                                                : executionInfo.globalModifiedIdentifiers;

        for(var accessedIdentifier in thisGlobalAccessedIdentifiers)
        {
            if(comparisonGlobalModifiedIdentifiers[accessedIdentifier])
            {
                return true;
            }
        }

        return false;
    },

    _isObjectModificationsDependent: function(executionInfo, checkWholeExecution)
    {
        //Compare only to last event execution info (since all events are always traversed)
        var thisGlobalAccessedObjects = this.eventExecutions[this.eventExecutions.length - 1] != null && !checkWholeExecution
                                      ? this.eventExecutions[this.eventExecutions.length - 1].globalAccessedObjects
                                      : this.globalAccessedObjects;

        var comparisonGlobalModifiedObjects = executionInfo.eventExecutions[executionInfo.eventExecutions.length - 1] != null && !checkWholeExecution
                                            ? executionInfo.eventExecutions[executionInfo.eventExecutions.length - 1].globalModifiedObjects
                                            : executionInfo.globalModifiedObjects;

        for(var accessed in thisGlobalAccessedObjects)
        {
            if(comparisonGlobalModifiedObjects[accessed])
            {
                return true;
            }
        }

        return false;
    }
};

/*************************************************************************************/
}});