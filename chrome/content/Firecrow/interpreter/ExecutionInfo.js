FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcBrowser = Firecrow.DoppelBrowser;
var fcModel = Firecrow.Interpreter.Model;

fcBrowser.ExecutionInfo = function()
{
    this.pathConstraint = new Firecrow.ScenarioGenerator.Symbolic.PathConstraint();
    this.visitedFunctionsMap = {};

    this.undefinedGlobalPropertiesAccessMap = {};
    this.resourceSetterPropertiesMap = {};
    this.objectForInIterations = [];

    this.globalModifiedIdentifiers = [];
    this.globalModifiedObjects = [];

    this.globalAccessedIdentifiers = [];
    this.globalAccessedObjects = [];
};

fcBrowser.ExecutionInfo.prototype =
{
    addConstraint: function(codeConstruct, constraint, inverse)
    {
        if(constraint == null) { return; }

        this.pathConstraint.addConstraint(codeConstruct, constraint, inverse);
    },

    addFunctionAsVisited: function(functionConstruct)
    {
        if(!FBL.Firecrow.ASTHelper.isFunction(functionConstruct)) { return; }

        this.visitedFunctionsMap[functionConstruct.nodeId] = functionConstruct;
    },

    getVisitedFunctions: function()
    {
        var visitedFunctions = [];

        for(var prop in this.visitedFunctionsMap)
        {
            visitedFunctions.push(this.visitedFunctionsMap[prop]);
        }

        return visitedFunctions;
    },

    getVisitedFunctionsExpressionCoverage: function()
    {
        return FBL.Firecrow.ASTHelper.calculateExpressionCoverage(this.getVisitedFunctions());
    },

    calculateCoverage: function()
    {
        this.coverage = this.getVisitedFunctionsExpressionCoverage();
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
        this.globalModifiedIdentifiers.push(identifier);
    },

    logReadingIdentifierOutsideCurrentScope: function(identifier, codeConstruct)
    {
        if(!FBL.Firecrow.ASTHelper.isBranchingConditionConstruct(codeConstruct)) { return; }

        this.globalAccessedIdentifiers.push(identifier);
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

                if(modifiedIdentifier.declarationConstruct == null && globalAccessedIdentifier.declarationConstruct == null)
                {
                    if(modifiedIdentifier.name == globalAccessedIdentifier.name) { return true; }
                }
                else if(modifiedIdentifier.declarationConstruct == null || globalAccessedIdentifier.declarationConstruct == null)
                {
                    continue;
                }
                else
                {
                    if(modifiedIdentifier.name == globalAccessedIdentifier.name
                    && modifiedIdentifier.declarationConstruct.codeConstruct == globalAccessedIdentifier.declarationConstruct.codeConstruct)
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