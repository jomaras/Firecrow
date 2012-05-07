/**
 * Created by Jomaras.
 * Date: 08.03.12.@19:13
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
const ValueTypeHelper = Firecrow.ValueTypeHelper;
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

    registerFunctionDeclaration: function(functionDeclaration)
    {

    }
    /*

     public void registerVariableDeclaration(VariableDeclaration codeConstruct)
     {
     if(this.variableObject != null)
     {
     String variableName = codeConstruct.getName();
     this.variableObject.registerIdentifier
     (
     new CodeIdentifier
     (
     variableName,
     new PrimitiveNull(codeConstruct, this),
     codeConstruct
     ),
     codeConstruct
     );
     }
     }

     public void addExecutedCommand(Command command)
     {
     _executedCommands.add(command);
     }

     public Item getThisValue()
     {
     return this.thisValue;
     }

     public void pushToScopeChain(Object object)
     {
     if(object == null) { return; }

     _scopeChain.add(new HoistedToVariableObject(object, _globalObject));
     }

     public void popFromScopeChain()
     {
     if(_scopeChain.size() <= 0) { return; }

     _scopeChain.remove(_scopeChain.size() - 1);
     }

     @Override
     public String toString() { return super.toString() + "; ID = " + this.getId(); }
     */
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
    this.stack.push(Firecrow.Interpreter.Simulator.ExecutionContext.createGlobalExecutionContext(globalObject));
};

Firecrow.Interpreter.Simulator.ExecutionContextStack.prototype =
{
    executeCommand: function(command)
    {

    }
};

}});