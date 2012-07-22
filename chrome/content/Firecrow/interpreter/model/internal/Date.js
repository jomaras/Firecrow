/**
 * Created by Jomaras.
 * Date: 16.03.12.@15:36
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var fcModel = Firecrow.Interpreter.Model;

fcModel.Date = function(value, globalObject, codeConstruct)
{
    try
    {
        this.value = value;
        this.globalObject = globalObject;
        this.__proto__ = new fcModel.Object(globalObject);
    }
    catch(e) { fcModel.Date.notifyError("Error when creating a Date object: " + e); }
};

Firecrow.Interpreter.Model.Date.notifyError = function(message) { alert("Date - " + message); };

fcModel.DatePrototype = function(globalObject)
{
    try
    {
        this.globalObject = globalObject;
        this.__proto__ = new fcModel.Object(globalObject);
        //https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date#Methods_2
        fcModel.DatePrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            var internalFunction = globalObject.internalExecutor.createInternalFunction(Date.prototype[propertyName], propertyName, this);
            this[propertyName] = internalFunction;
            this.addProperty(propertyName, internalFunction, null, false);
        }, this);

        this.fcInternal = { object: this };
    }
    catch(e) { fcModel.Date.notifyError("DatePrototype - error when creating date prototype:" + e); }
};

fcModel.DatePrototype.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS:
        [
            "getDate", "getDay", "getFullYear", "getHours", "getMilliseconds", "getMinutes",
            "getMonth", "getSeconds", "getTime", "getTimezoneOffset", "getUTCDate", "getUTCDay",
            "getUTCFullYear", "getUTCHours", "getUTCMilliseconds", "getUTCMinutes", "getUTCSeconds",
            "getYear", "setDate", "setFullYear", "setHours", "setMilliseconds", "setMinutes",
            "setMonth", "setSeconds", "setTime", "setUTCDate", "setUTCFullYear", "setUTCHours",
            "setUTCMilliseconds", "setUTCMinutes", "setUTCMonth", "setUTCSeconds", "setYear",
            "toDateString", "toISOString", "toJSON", "toGMTString", "toLocaleDateString",
            "toLocaleFormat", "toLocaleString", "toLocaleTimeString", "toSource", "toString",
            "toTimeString", "toUTCString", "valueOf"
        ]
    },
    FUNCTION_PROPERTIES:
    {
        METHODS:  ["now", "parse", "UTC"]
    }
};

fcModel.DatePrototype.prototype = new fcModel.Object(null);

fcModel.DateFunction = function(globalObject)
{
    try
    {
        this.__proto__ = new fcModel.Object(globalObject);

        this.prototype = new fcModel.JsValue(globalObject.datePrototype, new fcModel.FcInternal(null, globalObject.datePrototype)) ;
        this.addProperty("prototype", globalObject.datePrototype);

        fcModel.DatePrototype.CONST.FUNCTION_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            var internalFunction = globalObject.internalExecutor.createInternalFunction(Date[propertyName], propertyName, this);
            this[propertyName] = internalFunction;
            this.addProperty(propertyName, internalFunction, null, false);
        }, this);

        this.isInternalFunction = true;
        this.name = "Date";
        this.fcInternal = this;
    }
    catch(e){ fcModel.Date.notifyError("Date - error when creating Date Function:" + e); }
};

fcModel.DateFunction.prototype = new fcModel.Object(null);

fcModel.DateExecutor =
{
    executeFunctionMethod: function(thisObject, functionObject, arguments, callExpression, globalObject)
    {
        try
        {
            return new fcModel.JsValue
            (
                Date[functionObject.value.name].apply(null, arguments.map(function(item) { return item.value; })),
                new fcModel.FcInternal(callExpression)
            );
        }
        catch(e) { fcModel.Date.notifyError("Date - error when executing Date functions:" + e); }
    },

    executeConstructor: function(callExpression, arguments)
    {
        try
        {
            var date = arguments.length == 0 ? new Date() : new Date(arguments[0].value);

            return new fcModel.JsValue(date, new fcModel.FcInternal(callExpression, new fcModel.Date(date)));
        }
        catch(e) { fcModel.Date.notifyError("Date - error when creating Date object:" + e); }
    },

    executeInternalDateMethod : function(thisObject, functionObject, arguments, callExpression, callCommand)
    {
        try
        {
            if(!functionObject.fcInternal.isInternalFunction) { this.notifyError("The function should be internal when executing string method!"); return; }

            var functionObjectValue = functionObject.value;
            var thisObjectValue = thisObject.value;
            var functionName = functionObjectValue.name;
            var fcThisValue =  thisObject.fcInternal.object;
            var globalObject = fcThisValue != null ? fcThisValue.globalObject
                                                   : functionObjectValue.jsValue.fcInternal.object.globalObject;

            var argumentValues = arguments.map(function(argument){ return argument.value;});

            if(functionName.indexOf("set") == 0)
            {
                return new fcModel.JsValue(thisObjectValue[functionName].apply(thisObjectValue, argumentValues), new fcModel.FcInternal(callExpression));
            }
            else
            {
                return new fcModel.JsValue(thisObjectValue[functionName](), new fcModel.FcInternal(callExpression));
            }
        }
        catch(e) {this.notifyError("Error when executing internal string method: " + e); }
    },
    notifyError: function(message) { fcModel.String.notifyError(message); }
};
/*************************************************************************************/
}});