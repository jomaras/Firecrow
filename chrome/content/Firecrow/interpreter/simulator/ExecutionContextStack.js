/**
 * Created by Jomaras.
 * Date: 08.03.12.@19:13
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
const ValueTypeHelper = Firecrow.ValueTypeHelper;
const ASTHelper = Firecrow.ASTHelper;
const fcSimulator = Firecrow.Interpreter.Simulator;
const fcModel = Firecrow.Interpreter.Model;

Firecrow.Interpreter.Simulator.ExecutionContext = function(variableObject, scopeChain, thisValue, globalObject, contextCreationCommand)
{
    this.variableObject = variableObject || globalObject.globalVariableObject;
    this.thisValue = thisValue || globalObject;

    this.globalObject = globalObject;

    variableObject.setOwnerExecutionContext(this);

    this.scopeChain = ValueTypeHelper.createArrayCopy(scopeChain);
    this.scopeChain.push(this.variableObject);

    this.id = fcSimulator.ExecutionContext.LAST_INSTANCE_ID++;
    this.contextCreationCommand = contextCreationCommand;

    this.codeConstructValuesMapping = [];
};

Firecrow.Interpreter.Simulator.ExecutionContext.prototype =
{
    getCodeConstructValue: function(codeConstruct)
    {
        try
        {
            var codeConstructValueMapping = ValueTypeHelper.findInArray
            (
                this.codeConstructValuesMapping,
                codeConstruct,
                function(mapping, codeConstruct)
                {
                    return mapping.codeConstruct == codeConstruct;
                }
            );

            return codeConstructValueMapping != null ? codeConstructValueMapping.value
                                                     : null;
        }
        catch(e) { alert("Error when getting codeConstruct value - ExecutionContextStack.js:" + e);}
    },

    setCodeConstructValue: function(codeConstruct, value)
    {
        try
        {
            var codeConstructValueMapping = ValueTypeHelper.findInArray
            (
                this.codeConstructValuesMapping,
                codeConstruct,
                function(mapping, codeConstruct)
                {
                    return mapping.codeConstruct == codeConstruct;
                }
            );

            if(codeConstructValueMapping == null)
            {
                this.codeConstructValuesMapping.push
                ({
                    codeConstruct: codeConstruct,
                    value : value
                });
            }
            else
            {
                codeConstructValueMapping.value = value;
            }
        }
        catch(e) { alert("Error when setting codeConstruct value - ExecutionContextStack.js:" + e);}
    },

    registerIdentifier: function(identifier)
    {
       try
       {
           if(!ValueTypeHelper.isOfType(identifier, fcModel.Identifier)) { alert("ExecutionContextStack - when registering identifier the argument has to be an identifier"); }

           this.variableObject.registerIdentifier(identifier);
       }
       catch(e) { alert("ExecutionContextStack - ExecutionContext error when registering identifier:" + e);}
    }
};

Firecrow.Interpreter.Simulator.ExecutionContext.createGlobalExecutionContext = function(globalObject)
{
    return new Firecrow.Interpreter.Simulator.ExecutionContext
    (
        globalObject,
        [],
        globalObject,
        globalObject
    );
};

Firecrow.Interpreter.Simulator.ExecutionContext.LAST_INSTANCE_ID = 0;

Firecrow.Interpreter.Simulator.ExecutionContextStack = function(globalObject)
{
    this.globalObject = globalObject;
    this.stack = [];
    this.push(Firecrow.Interpreter.Simulator.ExecutionContext.createGlobalExecutionContext(globalObject));
    this.evaluator = new Firecrow.Interpreter.Simulator.Evaluator(this, globalObject);
};

Firecrow.Interpreter.Simulator.ExecutionContextStack.prototype =
{
    activeContext: null,

    executeCommand: function(command)
    {
         this.evaluator.evaluateCommand(command);
    },

    push: function(executionContext)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(executionContext, Firecrow.Interpreter.Simulator.ExecutionContext)) { alert("ExecutionContextStack: argument is not ExecutionContext!"); return; }

            this.stack.push(executionContext);

            this.activeContext = executionContext;
        }
        catch(e) { alert("ExecutionContextStack: Error when pushing: " + e); }
    },

    pop: function()
    {
        try
        {
            if(this.stack.length == 0) { alert("ExecutionContextStack: Can not pop an empty stack"); return; }

            this.stack.pop();

            this.activeContext = this.stack[this.stack.length - 1];
        }
        catch(e) { alert("ExecutionContextStack: Error when popping:" + e);}
    },

    registerIdentifier: function(variableDeclarator)
    {
        try
        {
            if(!ASTHelper.isVariableDeclarator(variableDeclarator)) { alert("ExecutionContextStack: When registering an identifier, the argument has to be variable declarator"); }
            if(this.activeContext == null) { alert("ExecutionContextStack: ActiveContext must not be null when registering identifier"); return; }

            this.activeContext.registerIdentifier(new fcModel.Identifier(variableDeclarator.id.name, undefined, variableDeclarator));
        }
        catch(e) { alert("ExecutionContextStack - error when registering identifier: " + e); }
    },

    registerFunctionDeclaration: function(functionDeclaration)
    {
        try
        {
            if(!ASTHelper.isFunctionDeclaration(functionDeclaration)) { alert("ExecutionContextStack: When registering a function, the argument has to be a function declaration"); }
            if(this.activeContext == null) { alert("ExecutionContextStack: ActiveContext must not be null when registering function declaration"); return; }

            var value = function(){ };
            value.codeConstruct = functionDeclaration;

            this.activeContext.registerIdentifier(new fcModel.Identifier(functionDeclaration.id.name, value, functionDeclaration));
        }
        catch(e) { alert("ExecutionContextStack - error when registering identifier: " + e); }
    },

    getIdentifierValue: function(identifierName)
    {
        try
        {
            for(var i = this.stack.length - 1; i >= 0; i--)
            {
                var scopeChain = this.stack[i].scopeChain;

                for(var j = scopeChain.length - 1; j >= 0; j--)
                {
                    var variableObject = scopeChain[j];

                    var identifier = variableObject.getIdentifier(identifierName);

                    if(identifier != null)
                    {
                        return identifier.value;
                    }
                }
            }
        }
        catch(e) { alert("ExecutionContextStack: Error when getting Identifier value: " + e); }
    },

    setIdentifierValue: function(identifierName, value, setCodeConstruct)
    {
        try
        {
            for(var i = this.stack.length - 1; i >= 0; i--)
            {
                var scopeChain = this.stack[i].scopeChain;

                for(var j = scopeChain.length - 1; j >= 0; j--)
                {
                    var variableObject = scopeChain[j];

                    var identifier = variableObject.getIdentifier(identifierName);

                    if(identifier != null)
                    {
                        identifier.setValue(value, setCodeConstruct);
                        return;
                    }
                }
            }

            var globalExecutionContext = this.stack[0];

            if(globalExecutionContext == null) { alert("ExecutionContextStack: global execution context can not be null!"); return; }

            globalExecutionContext.registerIdentifier(new fcModel.Identifier(identifierName, value, setCodeConstruct));

            return;
        }
        catch(e) { alert("ExecutionContextStack: Error when setting Identifier value: " + e); }
    },

    deleteIdentifier: function(identifierName)
    {
        try
        {
            for(var i = this.stack.length - 1; i >= 0; i--)
            {
                var scopeChain = this.stack[i].scopeChain;

                for(var j = scopeChain.length - 1; j >= 0; j--)
                {
                    var variableObject = scopeChain[j];

                    var identifier = variableObject.getIdentifier(identifierName);

                    if(identifier != null) { variableObject.deleteIdentifier(identifier); }
                }
            }
        }
        catch(e) { alert("ExecutionContextStack: Error when deleting Identifier: " + e); }
    },

    setExpressionValue: function(codeConstruct, value)
    {
        try
        {
            if(this.activeContext == null) { alert("ExecutionContextStack: ActiveContext must not be null when setting expression value"); return; }

            this.activeContext.setCodeConstructValue(codeConstruct, value);
        }
        catch(e) { alert("ExecutionContextStack - error when setting expression value: " + e); }
    },

    getExpressionValue: function(codeConstruct)
    {
        try
        {
            if(this.activeContext == null) { alert("ExecutionContextStack: ActiveContext must not be null when setting expression value"); return; }

            return this.activeContext.getCodeConstructValue(codeConstruct);
        }
        catch(e) { alert("ExecutionContextStack - error when setting expression value: " + e); }
    }
};
}});