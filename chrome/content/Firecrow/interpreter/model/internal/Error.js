FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var fcModel = Firecrow.Interpreter.Model;

fcModel.Error = function(implementationObject, globalObject, codeConstruct)
{
    try
    {
        this.initObject(globalObject, codeConstruct, implementationObject, globalObject.fcErrorPrototype);
        this.constructor = fcModel.Error;

        this.addProperty("message", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, implementationObject.message), codeConstruct, false);
        this.addProperty("name", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, implementationObject.name), codeConstruct, false);
        this.addProperty("description", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, implementationObject.description), codeConstruct, false);
        this.addProperty("number", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, implementationObject.number), codeConstruct, false);
        this.addProperty("fileName", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, implementationObject.fileName), codeConstruct, false);
        this.addProperty("lineNumber", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, implementationObject.lineNumber), codeConstruct, false);
        this.addProperty("stack", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, implementationObject.stack), codeConstruct, false);
    }
    catch(e) { fcModel.Error.notifyError("Error when creating an Error object: " + e); }
};

fcModel.Error.notifyError = function(message) { alert("Error - " + message); };
fcModel.Error.prototype = new fcModel.Object();

fcModel.ErrorPrototype = function(globalObject)
{
    try
    {
        this.initObject(globalObject);
        this.name = "ErrorPrototype";
        this.constructor = fcModel.ErrorPrototype;
    }
    catch(e) { fcModel.Error.notifyError("ErrorPrototype - error when creating error prototype:" + e); }
};

fcModel.ErrorPrototype.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS:[]
    },
    FUNCTION_PROPERTIES:
    {
        METHODS:  []
    }
};

fcModel.ErrorPrototype.prototype = new fcModel.Object(null);

fcModel.ErrorFunction = function(globalObject)
{
    try
    {
        this.initObject(globalObject);

        this.addProperty("prototype", globalObject.fcErrorPrototype);

        this.isInternalFunction = true;
        this.name = "Error";
    }
    catch(e){ fcModel.Error.notifyError("Error - error when creating Error Function:" + e); }
};

fcModel.ErrorFunction.prototype = new fcModel.Object(null);
/*************************************************************************************/
}});