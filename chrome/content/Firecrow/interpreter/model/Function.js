/**
 * User: Jomaras
 * Date: 15.05.12.
 * Time: 14:45
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.Function = function(globalObject, scopeChain, codeConstruct, value)
{
    this.__proto__ = new fcModel.Object(globalObject, codeConstruct);
    this.object = this;
    this.globalObject = globalObject;
    this.codeConstruct = codeConstruct;
    this.scopeChain = scopeChain;
    this.value = value;

    this.addProperty("prototype", globalObject.functionPrototype);
    this.addProperty("__proto__", globalObject.functionPrototype);

    this.fcInternal = this;

    this.registerModificationAddedCallback(function(lastModification, allModifications)
    {
        try
        {
            var nextToLastModification = allModifications[allModifications.length - 2];

            if(nextToLastModification != null && this.globalObject.currentCommand)
            {
                this.globalObject.browser.callDataDependencyEstablishedCallbacks(lastModification, nextToLastModification, this.globalObject.currentCommand.id);
            }
        }
        catch(e) { alert("Function - Error when registering modification added callback:" + e); }
    }, this);
};

fcModel.Function._LAST_USED_ID = 0;

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
    catch(e)
    {
        alert("Function - Error when creating Internal Named Function: " + e);
    }
};

fcModel.FunctionPrototype = function(globalObject)
{
    try
    {
        //https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function#Methods_2
        fcModel.FunctionPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            this.addProperty(propertyName, fcModel.Function.createInternalNamedFunction(globalObject, propertyName), null, false);
        }, this);

        this.fcInternal = { object: this};
    }
    catch(e) { alert("Function - error when creating function prototype:" + e); }
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
