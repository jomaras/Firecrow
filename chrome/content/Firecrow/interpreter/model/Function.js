FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;

//<editor-fold desc="Function">
fcModel.Function = function(globalObject, scopeChain, codeConstruct, value)
{
    this.initObject(globalObject, codeConstruct, value);

    this.object = this;
    this.codeConstruct = codeConstruct;
    this.scopeChain = scopeChain;

    this.value = value;

    this.addProperty("prototype", this.globalObject.internalExecutor.createNonConstructorObject());
    this.addProperty("__proto__", globalObject.fcFunctionPrototype);
};

fcModel.Function.createInternalNamedFunction = function(globalObject, name, ownerObject)
{
    try
    {
        var functionObject = new fcModel.Function(globalObject, []);

        functionObject.name = name;
        functionObject.isInternalFunction = true;
        functionObject.ownerObject = ownerObject;

        return functionObject;
    }
    catch(e) { fcModel.Function.notifyError("Error when creating Internal Named Function: " + e); }
};

fcModel.Function.notifyError = function(message) { alert("Function - " + message); };
fcModel.Function.prototype = new fcModel.Object();

fcModel.Function.prototype.getJsPropertyValue = function(propertyName, codeConstruct)
{
    return this.getPropertyValue(propertyName, codeConstruct);
};
//</editor-fold>

//<editor-fold desc="Function prototype">
fcModel.FunctionPrototype = function(globalObject)
{
    try
    {
        this.initObject(globalObject);

        //https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function#Methods_2
        fcModel.FunctionPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            this.addProperty
            (
                propertyName,
                new fcModel.fcValue
                (
                    Function.prototype[propertyName],
                    fcModel.Function.createInternalNamedFunction(globalObject, propertyName, this),
                    null
                ),
                null,
                false
            );
        }, this);
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
//</editor-fold>
/*************************************************************************************/
}});
