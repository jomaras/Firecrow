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

    this._setDefaultProperties();
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

fcModel.Function.prototype.bind = function(args, callExpression)
{
    this.isBound = true;
    this.bounder = args[0];
    this.argsToPrepend = args.slice(1);
    this.bindingExpression = callExpression;
};

fcModel.Function.prototype.getJsPropertyValue = function(propertyName, codeConstruct)
{
    return this.getPropertyValue(propertyName, codeConstruct);
};
fcModel.Function.prototype._setDefaultProperties = function()
{
    this.addProperty("prototype", this.globalObject.internalExecutor.createNonConstructorObject(this.codeConstruct, this.value != null ? this.value.prototype : null));
    this.addProperty("__proto__", this.globalObject.fcFunctionPrototype);

    this._setLengthProperty();
};

fcModel.Function.prototype._setLengthProperty = function()
{
    var length = 0;

    if(this.codeConstruct != null && this.codeConstruct.params != null)
    {
        length = this.codeConstruct.params.length;
    }

    this.addProperty("length", this.globalObject.internalExecutor.createInternalPrimitiveObject(this.codeConstruct, length), this.codeConstruct, false);

};
//</editor-fold>

//<editor-fold desc="Function prototype">
fcModel.FunctionPrototype = function(globalObject)
{
    try
    {
        this.initObject(globalObject, null, Function.prototype, globalObject.fcObjectPrototype);

        this.constructor = fcModel.FunctionPrototype;
        this.proto = this.globalObject.fcObjectPrototype;

        //https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function#Methods_2
    }
    catch(e) { fcModel.Function.notifyError ("Error when creating function prototype:" + e); }
};

fcModel.FunctionPrototype.prototype = new fcModel.Object();
fcModel.FunctionPrototype.prototype.initFunctionPrototype = function()
{
    fcModel.FunctionPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
    {
        if(Function.prototype[propertyName])
        {
            this.addProperty
            (
                propertyName,
                new fcModel.fcValue
                (
                    Function.prototype[propertyName],
                    fcModel.Function.createInternalNamedFunction(this.globalObject, propertyName, this),
                    null
                ),
                null,
                false
            );
        }
    }, this);
}

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
