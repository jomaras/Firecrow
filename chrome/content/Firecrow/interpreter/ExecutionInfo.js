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
    }
};

    /*************************************************************************************/
}});