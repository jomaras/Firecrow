/**
 * User: Jomaras
 * Date: 15.05.12.
 * Time: 14:45
 */
FBL.ns(function() { with (FBL) {
    /*************************************************************************************/
    const fcModel = Firecrow.Interpreter.Model;
    const ValueTypeHelper = Firecrow.ValueTypeHelper;

    fcModel.Function = function(globalObject, scopeChain, codeConstruct)
    {
        this.object = this;
        this.globalObject = globalObject;
        this.codeConstruct = codeConstruct;
        this.scopeChain = scopeChain;

        this.addProperty("prototype", globalObject.functionPrototype);
        this.addProperty("__proto__", globalObject.functionPrototype);

        this.__FIRECROW_INTERNAL__ = this;
    };

    fcModel.EmptyFunction = function(globalObject)
    {
        this.globalObject = globalObject;
        this.name = "Empty";
    };

    fcModel.EmptyFunction.prototype = new fcModel.Object(null);
    fcModel.Function.prototype = new fcModel.EmptyFunction(null);

    fcModel.Function.createInternalNamedFunction = function(globalObject, name)
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

    fcModel.FunctionPrototype = function(globalObject)
    {
        try
        {
            //https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function#Methods_2
            fcModel.FunctionPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
            {
                this.addProperty(propertyName, fcModel.Function.createInternalNamedFunction(propertyName), null, false);
            }, this);
        }
        catch(e) { alert("Array - error when creating array prototype:" + e); }
    };

    fcModel.FunctionPrototype.prototype = new fcModel.Object(null);

    fcModel.FunctionPrototype.CONST =
    {
        INTERNAL_PROPERTIES :
        {
            METHODS: ["apply", "call", "toString", "bind"]
        }
    };
}});
