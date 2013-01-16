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
};

fcBrowser.ExecutionInfo.prototype =
{
    addConstraint: function(codeConstruct, constraint, inverse)
    {
        if(constraint == null) { return; }

        this.pathConstraint.addConstraint(codeConstruct, constraint, inverse);
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
        this.objectForInIterations.push({ proto: objectPrototype, codeConstruct: codeConstruct });
    },

    logSettingOutsideCurrentScopeIdentifierValue: function(identifier)
    {
        this.globalModifiedIdentifiers.push
        (
            {
                name: identifier.name,
                declarationConstructId: identifier.declarationPosition != null ? identifier.declarationPosition.codeConstruct.nodeId
                                                                               : null
            }
        );
    },

    logEventRegistered: function(thisObjectDescriptor, thisObjectModel, eventType, registrationConstruct, handlerConstruct, loadingEventsExecuted, timerId)
    {
        this.eventRegistrations.push({
            thisObjectDescriptor: thisObjectDescriptor,
            thisObjectModel: thisObjectModel,
            eventType: eventType,
            registrationConstruct: registrationConstruct,
            handlerConstruct: handlerConstruct,
            loadingEventsExecuted: loadingEventsExecuted,
            timerId: timerId
        });
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
                return;
            }
        }
    },

    logReadingIdentifierOutsideCurrentScope: function(identifier, codeConstruct)
    {
        if(!FBL.Firecrow.ASTHelper.isBranchingConditionConstruct(codeConstruct)) { return; }

        this.globalAccessedIdentifiers.push
        (
            {
                name: identifier.name,
                declarationConstructId: identifier.declarationPosition != null ? identifier.declarationPosition.codeConstruct.nodeId
                                                                                : null
            }
        );
    },

    logReadingObjectPropertyOutsideCurrentScope: function(baseObjectId, propertyName, codeConstruct)
    {
        if(!FBL.Firecrow.ASTHelper.isBranchingConditionConstruct(codeConstruct)) { return; }

        this.globalAccessedObjects.push({baseObjectId: baseObjectId, propertyName: propertyName, codeConstruct: codeConstruct});
    },

    logModifyingExternalContextObject: function(baseObjectId, propertyName, codeConstruct)
    {
        this.globalModifiedObjects.push({baseObjectId: baseObjectId, propertyName: propertyName, codeConstruct: codeConstruct});
    },

    isDependentOn: function(executionInfo)
    {
        return this._isIdentifierDependent(executionInfo) || this._isObjectModificationsDependent(executionInfo);
    },

    _isIdentifierDependent: function(executionInfo)
    {
        if(executionInfo == null || executionInfo.globalModifiedIdentifiers == null
        || executionInfo.globalModifiedIdentifiers.length == 0
        || this.globalAccessedIdentifiers.length == 0)
        {
            return false;
        }

        for(var i = 0, modifiedIdentifiersLength = executionInfo.globalModifiedIdentifiers.length; i < modifiedIdentifiersLength; i++)
        {
            var modifiedIdentifier = executionInfo.globalModifiedIdentifiers[i];

            for(var j = 0, accessedIdentifiersLength = this.globalAccessedIdentifiers.length; j < accessedIdentifiersLength; j++)
            {
                var globalAccessedIdentifier = this.globalAccessedIdentifiers[j];

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
        }

        return false;
    },

    _isObjectModificationsDependent: function(executionInfo)
    {
        if(executionInfo == null || executionInfo.globalModifiedIdentifiers == null
        || executionInfo.globalModifiedObjects.length == 0
        || this.globalAccessedObjects.length == 0)
        {
            return false;
        }

        for(var i = 0, modifiedObjectsLength = executionInfo.globalModifiedObjects.length; i < modifiedObjectsLength; i++)
        {
            var modifiedObject = executionInfo.globalModifiedObjects[i];

            for(var j = 0, accessedObjectsLength = this.globalAccessedObjects.length; j < accessedObjectsLength; j++)
            {
                var accessedObject = this.globalAccessedObjects[j];

                if(modifiedObject.baseObjectId == accessedObject.baseObjectId && modifiedObject.propertyName == accessedObject.propertyName)
                {
                    return true;
                }
            }
        }

        return false;
    }
};

/*************************************************************************************/
}});