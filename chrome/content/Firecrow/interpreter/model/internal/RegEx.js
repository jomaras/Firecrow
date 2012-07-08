/**
 * User: Jomaras
 * Date: 03.06.12.
 * Time: 07:39
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.RegEx = function(jsRegExp, globalObject, codeConstruct)
{
    try
    {
        this.globalObject = globalObject;
        this.jsRegExp = jsRegExp;

        this.__proto__ = new fcModel.Object(globalObject);

        this.addProperty("lastIndex", new fcModel.JsValue(0, new fcModel.FcInternal(codeConstruct)), codeConstruct);
        this.addProperty("ignoreCase", new fcModel.JsValue(jsRegExp.ignoreCase, new fcModel.FcInternal(codeConstruct)), codeConstruct);
        this.addProperty("global", new fcModel.JsValue(jsRegExp.global, new fcModel.FcInternal(codeConstruct)), codeConstruct);
        this.addProperty("multiline", new fcModel.JsValue(jsRegExp.multiline, new fcModel.FcInternal(codeConstruct)), codeConstruct);
        this.addProperty("source", new fcModel.JsValue(jsRegExp.source, new fcModel.FcInternal(codeConstruct)), codeConstruct);
    }
    catch(e) { Firecrow.Interpreter.Model.RegEx.notifyError("Error when creating RegExp object: " + e); }
};

Firecrow.Interpreter.Model.RegEx.notifyError = function(message) { alert("RegEx - " + message); }

fcModel.RegExPrototype = function(globalObject)
{
    try
    {
        this.globalObject = globalObject;

        fcModel.RegExPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            this.addProperty(propertyName, fcModel.Function.createInternalNamedFunction(globalObject, propertyName), null, false);
        }, this);

        this.fcInternal = { object: this };
    }
    catch(e) { Firecrow.Interpreter.Model.RegEx.notifyError("Error when creating regEx prototype:" + e); }
};

fcModel.RegExPrototype.prototype = new fcModel.Object(null);

fcModel.RegExPrototype.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS: ["exec","test","toSource"],
        PROPERTIES: ["global", "ignoreCase", "lastIndex", "multiline", "source"]
    }
};

fcModel.RegExFunction = function(globalObject)
{
    try
    {
        this.addProperty("prototype", globalObject.regExPrototype);
        this.isInternalFunction = true;
        this.name = "RegExp";
        this.fcInternal = this;
    }
    catch(e){ Firecrow.Interpreter.Model.RegEx.notifyError("Error when creating RegEx Function:" + e); }
};

fcModel.RegExFunction.prototype = new fcModel.Object(null);

fcModel.RegExExecutor =
{
    executeInternalRegExMethod: function(thisObject, functionObject, arguments, callExpression)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(thisObject.value, RegExp)) { this.notifyError("The called on object should be a regexp!"); return; }
            if(!functionObject.fcInternal.isInternalFunction) { this.notifyError("The function should be internal when executing regexp method!"); return; }

            var functionObjectValue = functionObject.value;
            var thisObjectValue = thisObject.value;
            var functionName = functionObjectValue.name;
            var fcThisValue =  thisObject.fcInternal.object;

            switch(functionName)
            {
                case "exec":
                    var result = thisObjectValue[functionName].apply(thisObjectValue, arguments.map(function(argument){ return argument.value;}));
                    fcThisValue.addProperty("lastIndex", new fcModel.JsValue(thisObjectValue.lastIndex, new fcModel.FcInternal(callExpression)),callExpression);

                    if(result == null) { return new fcModel.JsValue(null, new fcModel.FcInternal(callExpression)); }
                    else if (ValueTypeHelper.isArray(result)){ return fcThisValue.globalObject.internalExecutor.createArray(callExpression, result);}
                    else { this.notifyError("Unknown result when exec regexp"); return null; }

                case "test":
                    return new fcModel.JsValue
                    (
                        thisObjectValue[functionName].apply(thisObjectValue, arguments.map(function(argument){ return argument.value;})),
                        new fcModel.FcInternal(callExpression)
                    );
                case "toSource":
                    this.notifyError("ToSource not supported on regExp!");
                    return null;
                default:
                    this.notifyError("Unknown method on string");
            }
        }
        catch(e) {this.notifyError("Error when executing internal RegEx method: " + e); }
    },

    notifyError: function(message) { Firecrow.Interpreter.Model.RegEx.notifyError(message);}
};
}});