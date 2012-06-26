/**
 * Created by Jomaras.
 * Date: 16.03.12.@15:36
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var fcModel = Firecrow.Interpreter.Model;

fcModel.String = function(value, globalObject, codeConstruct)
{
    try
    {
        this.notifyError = function(message) { alert("String - " + message); }
        this.value = value;
        this.globalObject = globalObject;
        this.__proto__ = new fcModel.Object(globalObject);
    }
    catch(e) { this.notifyError("Error when creating a String object: " + e); }
};

fcModel.StringPrototype = function(globalObject)
{
    try
    {
        this.globalObject = globalObject;

        fcModel.StringPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            this.addProperty(propertyName, fcModel.Function.createInternalNamedFunction(globalObject, propertyName), null, false);
        }, this);

        this.fcInternal = { object: this};
    }
    catch(e) { alert("StringPrototype - error when creating array prototype:" + e); }
};

fcModel.StringPrototype.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS:
        [
            "charAt","charCodeAt","concat","indexOf","lastIndexOf","localeCompare",
            "match","replace","search","slice","split","substr","substring","toLocaleLowerCase",
            "toLocaleUpperCase","toLowerCase","toString","toUpperCase","trim","trimLeft","trimRight","valueOf"
        ]
    }
};

fcModel.StringPrototype.prototype = new fcModel.Object(null);

fcModel.StringFunction = function(globalObject)
{
    try
    {
        this.addProperty("prototype", globalObject.stringPrototype);
        this.isInternalFunction = true;
        this.name = "String";
        this.fcInternal = this;
    }
    catch(e){ alert("String - error when creating String Function:" + e); }
};

fcModel.StringFunction.prototype = new fcModel.Object(null);

fcModel.StringExecutor =
{
    executeInternalStringMethod : function(thisObject, functionObject, arguments, callExpression, callCommand)
    {
        try
        {
            if(!ValueTypeHelper.isString(thisObject.value)) { this.notifyError("The called on object should be a string!"); return; }
            if(!functionObject.fcInternal.isInternalFunction) { this.notifyError("The function should be internal when executing string method!"); return; }

            var functionObjectValue = functionObject.value;
            var thisObjectValue = thisObject.value;
            var functionName = functionObjectValue.name;
            var fcThisValue =  thisObject.fcInternal.object;
            var globalObject = fcThisValue != null ? fcThisValue.globalObject
                                                   : functionObjectValue.jsValue.fcInternal.object.globalObject;

            var argumentValues = arguments.map(function(argument){ return argument.value;});

            switch(functionName)
            {
                case "charAt":
                case "charCodeAt":
                case "concat":
                case "indexOf":
                case "lastIndexOf":
                case "localeCompare":
                case "substr":
                case "substring":
                case "toLocaleLowerCase":
                case "toLocaleUpperCase":
                case "toLowerCase":
                case "toString":
                case "toUpperCase":
                case "trim":
                case "trimLeft":
                case "trimRight":
                case "valueOf":
                case "search":
                case "slice":
                    return new fcModel.JsValue
                    (
                        thisObjectValue[functionName].apply(thisObjectValue, argumentValues),
                        new fcModel.FcInternal(callExpression)
                    );
                case "match":
                case "split":
                    var result = thisObjectValue[functionName].apply(thisObjectValue, argumentValues);
                    if(result == null) { return new fcModel.JsValue(null, new fcModel.FcInternal(callExpression)); }
                    else if (ValueTypeHelper.isArray(result)){ return globalObject.internalExecutor.createArray(callExpression, result);}
                    else { this.notifyError("Unknown result type when executing string match or split!"); return null;}
                case "replace":
                    if(ValueTypeHelper.isString(argumentValues[1]))
                    {
                        return new fcModel.JsValue
                        (
                            thisObjectValue[functionName].apply(thisObjectValue, argumentValues),
                            new fcModel.FcInternal(callExpression)
                        );
                    }
                    else if(ValueTypeHelper.isFunction(argumentValues[1]))
                    {
                        var allCallbackArguments = [];

                        thisObjectValue.replace(argumentValues[0], function()
                        {
                            var currentArgs = [];

                            for(var i = 0; i < arguments.length; i++) { currentArgs.push(arguments[i]); }

                            allCallbackArguments.push(currentArgs);
                        });

                        callCommand.generatesNewCommands = true;
                        callCommand.generatesCallbacks = true;
                        callCommand.callbackFunction = functionObject
                        callCommand.callbackArgumentGroups = allCallbackArguments;
                        callCommand.thisObject = thisObject;
                    }
                    else
                    {
                        this.notifyError("Unknown replacement type in string, can be either a function or a string");
                    }
                    return null;
                default:
                    this.notifyError("Unknown method on string");
            }
        }
        catch(e) {this.notifyError("Error when executing internal string method: " + e); }
    },
    notifyError: function(message) { alert("StringExecutor - " + message); }
};
/*************************************************************************************/
}});