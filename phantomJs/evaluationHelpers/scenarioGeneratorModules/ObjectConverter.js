var PathConstraintModule = require('C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorModules\\PathConstraint.js')

var ObjectConverter =
{
    convertToFullObjects: function (executionInfo, pageModelMapping)
    {
        this._pageModelMapping = pageModelMapping;

        executionInfo.pathConstraint = PathConstraintModule.PathConstraint.fromObjectLiteral(executionInfo.pathConstraint, pageModelMapping);
        executionInfo.undefinedGlobalPropertiesAccessMap = this.convertUndefinedGlobalPropertiesAccessMap(executionInfo.undefinedGlobalPropertiesAccessMap);
        executionInfo.globalModifiedIdentifiers = this.convertToObjectWithCodeConstructs(executionInfo.globalModifiedIdentifiers);
        executionInfo.afterLoadingModifiedIdentifiers = this.convertToObjectWithCodeConstructs(executionInfo.afterLoadingModifiedIdentifiers);
        executionInfo.globalAccessedIdentifiers = this.convertToObjectWithCodeConstructs(executionInfo.globalAccessedIdentifiers);
        executionInfo.afterLoadingAccessedIdentifiers = this.convertToObjectWithCodeConstructs(executionInfo.afterLoadingAccessedIdentifiers);
        executionInfo.afterLoadingAccessedObjects = this.convertToObjectWithCodeConstructs(executionInfo.afterLoadingAccessedObjects);
        executionInfo.eventRegistrations = this.convertEventRegistrations(executionInfo.eventRegistrations);
        executionInfo.eventExecutionsMap = this.convertEventExecutionMap(executionInfo.eventExecutionsMap);
        executionInfo.typeExecutionMap = this.convertTypeExecutionMap(executionInfo.typeExecutionMap);
        executionInfo.eventExecutions = this.convertEventExecutions(executionInfo.eventExecutions);

        return executionInfo;
    },

    convertEventExecutions: function (eventExecutionsJson)
    {
        var eventExecutions = [];

        for(var i = 0; i < eventExecutionsJson.length; i++)
        {
            eventExecutions.push(this.convertEventExecution(eventExecutionsJson[i]));
        }

        return eventExecutions;
    },

    convertEventExecution: function(eventExecution)
    {
        return {
            baseObjectDescriptor: eventExecution.baseObjectDescriptor,
            branchingConstructs: this.convertToObjectWithCodeConstructs(eventExecution.branchingConstructs),
            eventDescriptor: eventExecution.eventDescriptor,
            eventRegistrations: this.convertEventRegistrations(eventExecution.eventRegistrations),
            eventType: eventExecution.eventType,
            globalAccessedIdentifiers: this.convertToObjectWithCodeConstructs(eventExecution.globalAccessedIdentifiers),
            /*SKIPPED GLOBAL ACCESSED OBJECTS, for now*/
            globalModifiedIdentifiers: this.convertToObjectWithCodeConstructs(eventExecution.globalModifiedIdentifiers),
            /*SKIPPED global modified objects, for now*/
            /*SKIPPED important modifications*/
            typeDescriptor: eventExecution.typeDescriptor,
            typeVisitedFunctionsMap: this.convertToObjectWithCodeConstructs(eventExecution.typeVisitedFunctionsMap),
            visitedFunctionsMap: this.convertToObjectWithCodeConstructs(eventExecution.visitedFunctionsMap),
            dataDependencies: eventExecution.dataDependencies
        };
    },

    convertTypeExecutionMap: function(typeExecutionMap)
    {
        var object = { };

        for(var eventTypeId in typeExecutionMap)
        {
            object[eventTypeId] = {};
            var functionMap =  typeExecutionMap[eventTypeId]

            for(var i = 0; i < functionMap.length; i++)
            {
                var functionConstructId = functionMap[i];
                object[eventTypeId][functionConstructId] = this._pageModelMapping[functionConstructId];
            }
        }

        return object;
    },

    convertEventExecutionMap: function(eventExecutionsMap)
    {
        var object = {};

        for(var thisDescriptor in eventExecutionsMap)
        {
            object[thisDescriptor] = {};

            for(var eventType in eventExecutionsMap[thisDescriptor])
            {
                object[thisDescriptor][eventType] = {};

                for(var functionNodeId in eventExecutionsMap[thisDescriptor][eventType])
                {
                    object[thisDescriptor][eventType][functionNodeId] = this._pageModelMapping[functionNodeId];
                }
            }
        }

        return object;
    },

    convertEventRegistrations: function(eventRegistrations)
    {
        for(var i = 0; i < eventRegistrations.length; i++)
        {
            var eventRegistration = eventRegistrations[i];

            eventRegistration.handlerConstruct = this._pageModelMapping[eventRegistration.handlerConstructNodeId];
            eventRegistration.registrationConstruct = this._pageModelMapping[eventRegistration.registrationConstructNodeId];
            eventRegistration.thisObjectModel = this._pageModelMapping[eventRegistration.thisObjectModelNodeId] || eventRegistration.thisObjectModelNodeId;
        }

        return eventRegistrations;
    },

    convertToObjectWithCodeConstructs: function (arr)
    {
        var obj = {};

        for(var i = 0; i < arr.length; i++)
        {
            obj[arr[i]] = this._pageModelMapping[arr[i]];
        }

        return obj;
    },

    convertUndefinedGlobalPropertiesAccessMap: function (undefinedGlobalPropertiesAccessMap)
    {
        var obj = {};

        for(var propertyName in undefinedGlobalPropertiesAccessMap)
        {
            if(obj[propertyName] == null) { obj[propertyName] = {} }

            var propertyModifications = undefinedGlobalPropertiesAccessMap[propertyName];

            for(var i = 0; i < propertyModifications.length; i++)
            {
                var constructId = propertyModifications[i];
                obj[propertyName][constructId] = this._pageModelMapping[constructId];
            }
        }

        return obj;
    }
}

exports.ObjectConverter = ObjectConverter;