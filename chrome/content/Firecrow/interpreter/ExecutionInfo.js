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

        this.globalModifiedIdentifiers = [];
        this.globalModifiedObjects = [];

        this.globalAccessedIdentifiers = [];
        this.globalAccessedObjects = [];

        this.eventRegistrations = [];
        this.eventExecutionsMap = {};
        this.eventExecutions = [];
        this.currentEventExecutionInfo = null;

        this.executedConstructsIdMap = {};
    };

    fcBrowser.ExecutionInfo.prototype =
    {
        logEventExecution: function(baseObjectDescriptor, eventType)
        {
            if(this.currentEventExecutionInfo == null && (eventType == "onload" || eventType == "DOMContentLoaded"))
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
                globalModifiedIdentifiers: [],
                globalAccessedIdentifiers: [],
                eventRegistrations: [],
                globalAccessedObjects: [],
                globalModifiedObjects: []
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

        logSettingOutsideCurrentScopeIdentifierValue: function(identifier)
        {
            var modifiedIdentifierInfo =
            {
                name: identifier.name,
                declarationConstructId: identifier.declarationPosition != null ? identifier.declarationPosition.codeConstruct.nodeId
                                                                               : null
            };

            if(this.currentEventExecutionInfo != null)
            {
                this.currentEventExecutionInfo.globalModifiedIdentifiers.push(modifiedIdentifierInfo);
            }
            else
            {
                this.globalModifiedIdentifiers.push(modifiedIdentifierInfo);
            }
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
            else
            {
                this.eventRegistrations.push(eventRegistrationInfo);
            }
        },

        logEventDeRegistered: function(htmlNode, eventType, deregistrationConstruct, timerId)
        {
            if(eventType == "interval") { this._removeFirstRegisteredEventByTypeAndTimerId(eventType, timerId); return; }
        },

        _removeFirstRegisteredEventByTypeAndTimerId: function(eventType, timerId)
        {
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

        logReadingIdentifierOutsideCurrentScope: function(identifier, codeConstruct)
        {
            if(!FBL.Firecrow.ASTHelper.isBranchingConditionConstruct(codeConstruct)) { return; }

            var accessedGlobalIdentifierInfo =
            {
                name: identifier.name,
                declarationConstructId: identifier.declarationPosition != null ? identifier.declarationPosition.codeConstruct.nodeId
                                                                               : null
            };

            if(this.currentEventExecutionInfo != null)
            {
                this.currentEventExecutionInfo.globalAccessedIdentifiers.push(accessedGlobalIdentifierInfo)
            }
            else
            {
                this.globalAccessedIdentifiers.push(accessedGlobalIdentifierInfo);
            }
        },

        logReadingObjectPropertyOutsideCurrentScope: function(baseObjectId, propertyName, codeConstruct)
        {
            if(!FBL.Firecrow.ASTHelper.isBranchingConditionConstruct(codeConstruct)) { return; }

            var accessedObjectInfo = { baseObjectId: baseObjectId, propertyName: propertyName, codeConstruct: codeConstruct };

            if(this.currentEventExecutionInfo != null)
            {
                this.currentEventExecutionInfo.globalAccessedObjects.push(accessedObjectInfo);
            }
            else
            {
                this.globalAccessedObjects.push(accessedObjectInfo);
            }
        },

        logModifyingExternalContextObject: function(baseObjectId, propertyName, codeConstruct)
        {
            var modifiedObjectInfo = {baseObjectId: baseObjectId, propertyName: propertyName, codeConstruct: codeConstruct};

            if(this.currentEventExecutionInfo != null)
            {
                this.currentEventExecutionInfo.globalModifiedObjects.push(modifiedObjectInfo);
            }
            else
            {
                this.globalModifiedObjects.push(modifiedObjectInfo);
            }
        },

        isDependentOn: function(executionInfo)
        {
            return this._isIdentifierDependent(executionInfo) || this._isObjectModificationsDependent(executionInfo);
        },

        _isIdentifierDependent: function(executionInfo)
        {
            //Compare only to last event execution info (since all events are always traversed)
            var thisGlobalAccessedIdentifiers = this.eventExecutions[this.eventExecutions.length - 1] != null
                                              ? this.eventExecutions[this.eventExecutions.length - 1].globalAccessedIdentifiers
                                              : this.globalAccessedIdentifiers;

            var comparisonGlobalModifiedIdentifiers = executionInfo.eventExecutions[executionInfo.eventExecutions.length - 1] != null
                                                    ? executionInfo.eventExecutions[executionInfo.eventExecutions.length - 1].globalModifiedIdentifiers
                                                    : executionInfo.globalModifiedIdentifiers;

            for(var i = 0, modifiedIdentifiersLength = comparisonGlobalModifiedIdentifiers.length; i < modifiedIdentifiersLength; i++)
            {
                if(this._isDependentOnAccessedIdentifiers(comparisonGlobalModifiedIdentifiers[i], thisGlobalAccessedIdentifiers))
                {
                    return true;
                }
            }

            return false;
        },

        _isDependentOnAccessedIdentifiers: function(modifiedIdentifier, accessedIdentifiers)
        {
            for(var i = 0, accessedIdentifiersLength = accessedIdentifiers.length; i < accessedIdentifiersLength; i++)
            {
                var globalAccessedIdentifier = accessedIdentifiers[i];

                if(modifiedIdentifier.declarationConstructId == null && globalAccessedIdentifier.declarationConstructId == null)
                {
                    if(modifiedIdentifier.name == globalAccessedIdentifier.name) { return true; }
                }
                else if(modifiedIdentifier.declarationConstructId == null || globalAccessedIdentifier.declarationConstructId == null)
                {
                    continue;
                }
                else
                {
                    if(modifiedIdentifier.name == globalAccessedIdentifier.name
                    && modifiedIdentifier.declarationConstructId == globalAccessedIdentifier.declarationConstructId)
                    {
                        return true;
                    }
                }
            }

            return false;
        },

        _isObjectModificationsDependent: function(executionInfo)
        {
            //Compare only to last event execution info (since all events are always traversed)
            var thisGlobalAccessedObjects = this.eventExecutions[this.eventExecutions.length - 1] != null
                                          ? this.eventExecutions[this.eventExecutions.length - 1].globalAccessedObjects
                                          : this.globalAccessedObjects;

            var comparisonGlobalModifiedObjects = executionInfo.eventExecutions[executionInfo.eventExecutions.length - 1] != null
                                                ? executionInfo.eventExecutions[executionInfo.eventExecutions.length - 1].globalModifiedObjects
                                                : executionInfo.globalModifiedObjects;

            for(var i = 0, modifiedObjectsLength = comparisonGlobalModifiedObjects.length; i < modifiedObjectsLength; i++)
            {
                var modifiedObject = comparisonGlobalModifiedObjects[i];

                if(this._isDependentOnObjectModifications(modifiedObject, thisGlobalAccessedObjects))
                {
                    return true;
                }
            }

            return false;
        },

        _isDependentOnObjectModifications: function(modifiedObject, accessedObjects)
        {
            for(var i = 0, accessedObjectsLength = accessedObjects.length; i < accessedObjectsLength; i++)
            {
                var accessedObject = accessedObjects[i];

                if(modifiedObject.baseObjectId == accessedObject.baseObjectId
                && modifiedObject.propertyName == accessedObject.propertyName)
                {
                    return true;
                }
            }

            return false;
        }
    };

    /*************************************************************************************/
}});