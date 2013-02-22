FBL.ns(function() { with (FBL) {
    /*************************************************************************************/
    var fcBrowser = Firecrow.DoppelBrowser;
    var fcModel = Firecrow.Interpreter.Model;
    var ValueTypeHelper = Firecrow.ValueTypeHelper;

    fcBrowser.ExecutionInfo = function()
    {
        this.pathConstraint = new Firecrow.ScenarioGenerator.Symbolic.PathConstraint();

        this.undefinedGlobalPropertiesAccessMap = {};
        this.resourceSetterPropertiesMap = {};
        this.objectForInIterations = [];

        this.globalModifiedIdentifiers = {};
        this.globalModifiedObjects = {};

        this.globalAccessedIdentifiers = {};
        this.globalAccessedObjects = {};

        this.eventRegistrations = [];
        this.eventExecutionsMap = {};
        this.eventExecutions = [];
        this.currentEventExecutionInfo = null;

        this.executedConstructsIdMap = {};
    };

    fcBrowser.ExecutionInfo.prototype =
    {
        getLastEventInfoString: function()
        {
            var object = this.currentEventExecutionInfo != null ? this.currentEventExecutionInfo : this;
            return "PathConstraint: " + this.pathConstraint.toString() + "\r\n"
                +  "AI: " + ValueTypeHelper.convertObjectPropertyNamesToArray(object.globalAccessedIdentifiers).join(",")  + "\r\n"
                +  "MI: " + ValueTypeHelper.convertObjectPropertyNamesToArray(object.globalModifiedIdentifiers).join(",") + "\r\n"
                +  "MO: " + ValueTypeHelper.convertObjectPropertyNamesToArray(object.globalModifiedObjects).join(",") + "\r\n"
                +  "AO: " + ValueTypeHelper.convertObjectPropertyNamesToArray(object.globalAccessedObjects).join(",");
        },

        logEventExecution: function(baseObjectDescriptor, eventType)
        {
            if(this.currentEventExecutionInfo == null && (eventType == "onload" || eventType == "DOMContentLoaded" || eventType == "load"))
            {
                return;
            }

            if(baseObjectDescriptor == null || eventType == null) { debugger; alert("Error when logging event execution"); return; }

            if(this.eventExecutionsMap[baseObjectDescriptor] == null)
            {
                this.eventExecutionsMap[baseObjectDescriptor] = {};
            }

            if(this.eventExecutionsMap[baseObjectDescriptor][eventType] == null)
            {
                this.eventExecutionsMap[baseObjectDescriptor][eventType] = {};
            }

            this.currentEventExecutionInfo =
            {
                baseObjectDescriptor: baseObjectDescriptor,
                eventType: eventType,
                visitedFunctionsMap: this.eventExecutionsMap[baseObjectDescriptor][eventType],
                eventDescriptor: baseObjectDescriptor + eventType,
                globalModifiedIdentifiers: {},
                globalAccessedIdentifiers: {},
                eventRegistrations: [],
                globalAccessedObjects: {},
                globalModifiedObjects: {}
            };

            this.eventExecutions.push(this.currentEventExecutionInfo);
        },

        logExecutedConstruct: function(codeConstruct)
        {
            this.executedConstructsIdMap[codeConstruct.nodeId] = true;

            if(this.currentEventExecutionInfo != null)
            {
                if(codeConstruct.executorEventsMap == null) { codeConstruct.executorEventsMap = {}; }

                codeConstruct.executorEventsMap[this.currentEventExecutionInfo.eventDescriptor] = true;
            }
        },

        logEnteringFunction: function(functionConstruct)
        {
            if(functionConstruct == null) { return; }

            if(this.currentEventExecutionInfo != null)
            {
                this.currentEventExecutionInfo.visitedFunctionsMap[functionConstruct.nodeId] = functionConstruct;
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
            console.log("Not logging for in iterations");
            //this.objectForInIterations.push({ proto: objectPrototype, codeConstruct: codeConstruct });
        },

        getLastEventRegistrations: function()
        {
            return this.eventExecutions[this.eventExecutions.length - 1] != null
                ? this.eventExecutions[this.eventExecutions.length - 1].eventRegistrations
                : this.eventRegistrations;
        },

        logEventRegistered: function(thisObjectDescriptor, thisObjectModel, eventType, registrationConstruct, handlerConstruct, loadingEventsExecuted, timerId)
        {
            var eventRegistrationInfo =
            {
                thisObjectDescriptor: thisObjectDescriptor,
                thisObjectModel: thisObjectModel,
                eventType: eventType,
                registrationConstruct: registrationConstruct,
                handlerConstruct: handlerConstruct,
                loadingEventsExecuted: loadingEventsExecuted,
                timerId: timerId
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

        logSettingOutsideCurrentScopeIdentifierValue: function(identifier)
        {
            if(identifier.declarationPosition == null) { return; }
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