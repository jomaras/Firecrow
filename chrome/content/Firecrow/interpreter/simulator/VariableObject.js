/**
 * Created by Jomaras.
 * Date: 10.03.12.@09:04
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var fcSimulator = Firecrow.Interpreter.Simulator;
var fcModel = Firecrow.Interpreter.Model;

fcSimulator.VariableObject = function(executionContext)
{
    this.executionContext = executionContext;
    this.identifiers = [];
    this.fcInternal = this;
    this.fcInternal.object = this;
};

fcSimulator.VariableObject.prototype =
{
    registerIdentifier: function(identifier)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(identifier, fcModel.Identifier)) { this.notifyError("When registering an identifier has to be passed"); return; }

            var existingIdentifier = this.getIdentifier(identifier.name);

            if(existingIdentifier == null) { this.identifiers.push(identifier); }
            else { existingIdentifier.setValue(identifier.value, identifier.lastModificationConstruct); }
        }
        catch(e) { this.notifyError("Error when registering identifier:" + e);}
    },

    getIdentifierValue: function(identifierName)
    {
        try
        {
            var identifier = this.getIdentifier(identifierName);

            return identifier != null ? identifier.value : null;
        }
        catch(e) { this.notifyError("Error when getting identifier value: " + e); }
    },

    getIdentifier: function(identifierName)
    {
        try
        {
            return ValueTypeHelper.findInArray
            (
                this.identifiers,
                identifierName,
                function(currentIdentifier, identifierName)
                {
                    return currentIdentifier.name === identifierName;
                }
            );
        }
        catch(e) { this.notifyError("Error when getting identifier:" + e);}
    },

    deleteIdentifier: function(identifierName, codeConstruct)
    {
        try
        {
            var identifier = this.getIdentifier(identifierName);

            if(identifier != null)
            {
                ValueTypeHelper.removeFromArrayByElement(this.identifiers, identifier);
            }
        }
        catch(e) { this.notifyError("Error when deleting identifier:" + e);}
    },

    notifyError: function(message) { alert("VariableObject - " + message); }
};

Firecrow.Interpreter.Simulator.VariableObject.createFunctionVariableObject = function(functionIdentifier, formalParameters, calleeFunction, sentArguments, callExpressionCommand, globalObject)
{
    try
    {
        var functionVariableObject = new fcSimulator.VariableObject(null);

        functionVariableObject.functionIdentifier = functionIdentifier;
        functionVariableObject.formalParameters = formalParameters;
        functionVariableObject.calleeFunction = calleeFunction;
        functionVariableObject.sentArguments = sentArguments;

        functionVariableObject.registerIdentifier
        (
            new fcModel.Identifier
            (
                "arguments",
                fcSimulator.InternalExecutor.createArray(globalObject, callExpressionCommand.codeConstruct, sentArguments),
                callExpressionCommand.codeConstruct.arguments
            )
        );

        var argumentsConstructs = callExpressionCommand.codeConstruct.arguments || [];

        if(functionIdentifier != null) { functionVariableObject.registerIdentifier(functionIdentifier); }
        if(formalParameters != null)
        {
            formalParameters.forEach(function(formalParameter, index)
            {
                functionVariableObject.registerIdentifier(formalParameter);
                formalParameter.setValue(sentArguments[index], argumentsConstructs[index]);
            });
        }

        return functionVariableObject;
    }
    catch(e) { alert("Error while creating function variable object: " + e);}
};

Firecrow.Interpreter.Simulator.VariableObject.liftToVariableObject = function(object)
{
    try
    {
        if(object.fcInternal == null) { object.fcInternal = {}; }
        if(object.fcInternal.object == null) { object.fcInternal.object = {}; }

        object.fcInternal.getIdentifier = function(identifierName)
        {
            try
            {
                return this.object.getProperty(identifierName);
            }
            catch(e) { alert("Error when getting identifier in lifted variable object: " + e); }
        };

        object.fcInternal.getIdentifierValue = function(identifierName, readConstruct, currentContext)
        {
            try
            {
                return this.object.getPropertyValue(identifierName, readConstruct, currentContext);
            }
            catch(e) { alert("LifterVariableObject - Error when getting identifier value:" + e);}
        };

        object.fcInternal.registerIdentifier = function(identifier)
        {
            try
            {
                this.object.addProperty(identifier.name, identifier.value, identifier.lastModificationConstruct);
            }
            catch(e) { alert("LifterVariableObject -Error when registering identifier:" + e); }
        };

        object.fcInternal.deleteIdentifier = function(identifierName, deleteConstruct)
        {
            try
            {
                this.object.deleteProperty(identifierName, deleteConstruct);
            }
            catch(e) { alert("LiftedVariableObject - Error when deleting identifier: " + e);}
        };

        return object;
    }
    catch(e) { alert("VariableObject - error when lifting to variableObject!"); }
};
/***************************************************************************************/
}});