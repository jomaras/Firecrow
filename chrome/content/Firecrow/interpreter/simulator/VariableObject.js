/**
 * Created by Jomaras.
 * Date: 10.03.12.@09:04
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
const ValueTypeHelper = Firecrow.ValueTypeHelper;
const fcSimulator = Firecrow.Interpreter.Simulator;

Firecrow.Interpreter.Simulator.VariableObject = function(executionContext)
{
    this.executionContext = executionContext;
    this.identifiers = [];
};

Firecrow.Interpreter.Simulator.VariableObject.prototype =
{
    registerIdentifier: function(identifier)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(identifier, Firecrow.Interpreter.Model.Identifier)) { alert("VariableObject - when registering an identifier has to be passed"); return; }

            var existingIdentifier = this.getIdentifier(identifier.name);

            if(existingIdentifier == null) { this.identifiers.push(identifier); }
            else { existingIdentifier.setValue(identifier.value, identifier.lastModificationConstruct); }
        }
        catch(e) { alert("Error when registering identifier in VariableObject:" + e);}
    },

    getIdentifierValue: function(identifierName)
    {
        try
        {
            var identifier = this.getIdentifier(identifierName);

            return identifier != null ? identifier.value : null;
        }
        catch(e) { alert("Error when getting identifier value in VariableObject: " + e); }
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
        catch(e) { alert("Error when getting identifier - VariableObject:" + e);}
    },

    deleteIdentifier: function(identifierName)
    {
        try
        {
            var identifier = this.getIdentifier(identifierName);

            if(identifier != null)
            {
                alert("Deleting identifier, maybe i didn't think it through: what if i delete an identifier and then test is it null..");
                ValueTypeHelper.removeFromArrayByElement(this.identifiers, identifier);
            }
        }
        catch(e) { alert("Error when deleting identifier - VariableObject:" + e);}
    },

    setOwnerExecutionContext: function(executionContext)
    {
        this.executionContext = executionContext;
    }
};

Firecrow.Interpreter.Simulator.VariableObject.createFunctionVariableObject = function(functionIdentifier, formalParameters, calleeFunction, sentArguments, callExpressionCommand)
{
    try
    {
        var functionVariableObject = new fcSimulator.VariableObject(null);

        functionVariableObject.functionIdentifier = functionIdentifier;
        functionVariableObject.formalParameters = formalParameters;
        functionVariableObject.calleeFunction = calleeFunction;
        functionVariableObject.sentArguments = sentArguments;

        //TODO - there might be a problem, since these should be shared variables
        functionVariableObject.registerIdentifier(new Firecrow.Interpreter.Model.Identifier("arguments", sentArguments, callExpressionCommand.codeConstruct.arguments));

        if(functionIdentifier != null) { functionVariableObject.registerIdentifier(functionIdentifier); }
        if(formalParameters != null)
        {
            formalParameters.forEach(function(formalParameter)
            {
                functionVariableObject.registerIdentifier(formalParameter);
            });
        }

        return functionVariableObject;
    }
    catch(e) { alert("Error while creating function variable object: " + e);}
};

Firecrow.Interpreter.Simulator.VariableObject.liftToVariableObject = function(object)
{
    object.getIdentifier = function(identifierName)
    {
        try
        {
            return object.getProperty(identifierName);
        }
        catch(e) { alert("Error when getting identifier in lifted variable object: " + e); }
    };

    object.getIdentifierValue = function(identifierName, readConstruct, currentContex)
    {
        try
        {
            return object.getPropertyValue(identifierName, readConstruct, currentContext);
        }
        catch(e) { alert("Error when getting identifier value in lifted variable object:" + e);}
    };

    object.registerIdentifier = function(identifier)
    {
        try
        {
            object.addProperty(identifier.name, identifier.value, identifier.lastModificationConstruct);
        }
        catch(e) { alert("Error when registering identifier");}
    };

    object.deleteIdentifier = function(identifierName, deleteConstruct)
    {
        try
        {
            object.deleteProperty(identifierName, deleteConstruct);
        }
        catch(e) { alert("Error when deleting identifier");}
    };

    object.setOwnerExecutionContext = function(executionContext)
    {
        this.executionContext = executionContext;
    }
};
/***************************************************************************************/
}});