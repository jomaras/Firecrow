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

Firecrow.Interpreter.Simulator.VariableObject.notifyError = function(message) { alert("VariableObject - " + message); };

fcSimulator.VariableObject.prototype =
{
    registerIdentifier: function(identifier)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(identifier, fcModel.Identifier)) { this.notifyError("When registering an identifier has to be passed"); return; }

            var existingIdentifier = this.getIdentifier(identifier.name);

            if(existingIdentifier == null) { this.identifiers.push(identifier); }
            else { existingIdentifier.setValue(identifier.value, identifier.lastModificationPosition.codeConstruct); }
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

    notifyError: function(message) { Firecrow.Interpreter.Simulator.VariableObject.notifyError(message); }
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

        var callConstruct = callExpressionCommand != null ? callExpressionCommand.codeConstruct : null;

        functionVariableObject.registerIdentifier
        (
            new fcModel.Identifier
            (
                "arguments",
                globalObject.internalExecutor.createArray(callConstruct, sentArguments),
                callConstruct != null ? callConstruct.arguments : null,
                globalObject
            )
        );

        var argumentsConstructs = callConstruct != null ? callConstruct.arguments : [];

        if(callExpressionCommand != null)
        {
            if(callExpressionCommand.isCall)
            {
                argumentsConstructs = callConstruct.arguments.slice(1);
            }
            else if (callExpressionCommand.isApply)
            {
                var argumentsArray = callConstruct.arguments[1];
                argumentsConstructs = sentArguments.map(function(arg) { return argumentsArray; })
            }
        }

        argumentsConstructs = argumentsConstructs || [];

        if(functionIdentifier != null) { functionVariableObject.registerIdentifier(functionIdentifier); }
        if(formalParameters != null)
        {
            for(var i = 0; i < formalParameters.length; i++)
            {
                var formalParameter = formalParameters[i];

                functionVariableObject.registerIdentifier(formalParameter);

                formalParameter.setValue
                (
                    sentArguments[i] || new fcModel.JsValue(undefined, new fcModel.FcInternal(formalParameter.declarationConstruct)),
                    argumentsConstructs[i]
                );
            }
        }

        return functionVariableObject;
    }
    catch(e)
    {
        Firecrow.Interpreter.Simulator.VariableObject.notifyError("Error while creating function variable object: " + e);
    }
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
            catch(e) { Firecrow.Interpreter.Simulator.VariableObject.notifyError("Error when getting identifier in lifted variable object: " + e); }
        };

        object.fcInternal.getIdentifierValue = function(identifierName, readConstruct, currentContext)
        {
            try
            {
                return this.object.getPropertyValue(identifierName, readConstruct, currentContext);
            }
            catch(e) { Firecrow.Interpreter.Simulator.VariableObject.notifyError("LifterVariableObject - Error when getting identifier value:" + e);}
        };

        object.fcInternal.registerIdentifier = function(identifier)
        {
            try
            {
                this.object.addProperty
                (
                    identifier.name,
                    identifier.value,
                    identifier.declarationConstruct != null ? identifier.declarationConstruct.codeConstruct : null
                );
            }
            catch(e) { Firecrow.Interpreter.Simulator.VariableObject.notifyError("LifterVariableObject -Error when registering identifier:" + e); }
        };

        object.fcInternal.deleteIdentifier = function(identifierName, deleteConstruct)
        {
            try
            {
                this.object.deleteProperty(identifierName, deleteConstruct);
            }
            catch(e) { Firecrow.Interpreter.Simulator.VariableObject.notifyError("LiftedVariableObject - Error when deleting identifier: " + e);}
        };

        return object;
    }
    catch(e) { Firecrow.Interpreter.Simulator.VariableObject.notifyError("VariableObject - error when lifting to variableObject!"); }
};
/***************************************************************************************/
}});