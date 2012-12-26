FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcBrowser = Firecrow.DoppelBrowser;
var fcModel = Firecrow.Interpreter.Model;

fcBrowser.ExecutionInfo = function()
{
    this.pathConstraint = new FBL.Firecrow.Symbolic.PathConstraint();
    this.visitedFunctionsMap = {};

    this.undefinedGlobalPropertiesAccessMap = {};
    this.resourceSetterPropertiesMap = {};
    this.objectForInIterations = [];

    this.globalModifiedIdentifiers = [];
    this.globalAccessedIdentifiers = [];
};

fcBrowser.ExecutionInfo.prototype =
{
    addConstraint: function(codeConstruct, constraint, inverse)
    {
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

    isDependentOn: function(executionInfo)
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
                if(modifiedIdentifier == this.globalAccessedIdentifiers[j]) { return true; }
            }
        }

        return false;
    }
};

/*************************************************************************************/
}});