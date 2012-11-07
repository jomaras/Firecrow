FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;

fcModel.Function = function(globalObject, scopeChain, codeConstruct, value)
{
    this.initObject(globalObject, codeConstruct, value);

    this.object = this;
    this.codeConstruct = codeConstruct;
    this.scopeChain = scopeChain;
    this.value = value;

    this.addProperty("prototype", globalObject.functionPrototype);
    this.addProperty("__proto__", globalObject.functionPrototype);

    this.fcInternal = this;
};

fcModel.Function.notifyError = function(message) { alert("Function - " + message); };

fcModel.EmptyFunction = function(globalObject)
{
    this.initObject(globalObject);
    this.name = "Empty";
};

fcModel.EmptyFunction.prototype = new fcModel.Object();
fcModel.Function.prototype = new fcModel.EmptyFunction();

fcModel.Function.createInternalNamedFunction = function(globalObject, name, ownerObject)
{
    try
    {
        var functionObject = new Firecrow.Interpreter.Model.Function(globalObject, [], null);

        functionObject.name = name;
        functionObject.isInternalFunction = true;
        functionObject.ownerObject = ownerObject;

        return functionObject;
    }
    catch(e) { fcModel.Function.notifyError("Error when creating Internal Named Function: " + e); }
};

fcModel.FunctionPrototype = function(globalObject)
{
    try
    {
        this.initObject(globalObject);

        //https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function#Methods_2
        fcModel.FunctionPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            this.addProperty(propertyName, fcModel.Function.createInternalNamedFunction(globalObject, propertyName), null, false);
        }, this);

        this.fcInternal = { object: this};
    }
    catch(e) { fcModel.Function.notifyError ("Error when creating function prototype:" + e); }
};

fcModel.FunctionPrototype.prototype = new fcModel.Object();

fcModel.FunctionPrototype.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS: ["apply", "call", "toString", "bind"]
    }
};
/*************************************************************************************/
}});
