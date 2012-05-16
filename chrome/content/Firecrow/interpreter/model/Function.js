/**
 * User: Jomaras
 * Date: 15.05.12.
 * Time: 14:45
 */
FBL.ns(function() { with (FBL) {
    /*************************************************************************************/
    const fcModel = Firecrow.Interpreter.Model;
    const ValueTypeHelper = Firecrow.ValueTypeHelper;

    Firecrow.Interpreter.Model.Function = function(globalObject, scopeChain, codeConstruct)
    {
        this.globalObject = globalObject;
        this.codeConstruct = codeConstruct;
        this.scopeChain = scopeChain;

        this.addProperty("prototype", globalObject.emptyFunction);
    };

    Firecrow.Interpreter.Model.EmptyFunction = function(globalObject)
    {
        this.globalObject = globalObject;
        this.name = "Empty";
    };

    Firecrow.Interpreter.Model.EmptyFunction.prototype = new fcModel.Object(null);
    Firecrow.Interpreter.Model.Function.prototype = new fcModel.EmptyFunction(null);

    Firecrow.Interpreter.Model.Function.createInternalNamedFunction = function(globalObject, name)
    {
        try
        {
            var functionObject = new Firecrow.Interpreter.Model.Function(globalObject, [], null);

            functionObject.name = name;
            functionObject.isInternalFunction = true;

            return functionObject;
        }
        catch(e) { alert("Function - Error when creating Internal Named Function: " + e); }
    };
}});
