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
        this.initObject(globalObject);

        this.value = value;

        this.addProperty("__proto__", this.globalObject.fcDatePrototype);
    }
    catch(e) { fcModel.Date.notifyError("Error when creating a Date object: " + e); }
};

fcModel.Date.notifyError = function(message) { alert("Date - " + message); };
fcModel.Date.prototype = new fcModel.Object();

fcModel.DatePrototype = function(globalObject)
{
    try
    {
        this.initObject(globalObject);
        this.constructor = fcModel.DatePrototype;
        //https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date#Methods_2
        fcModel.DatePrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            if(Date.prototype[propertyName] == null) { return; }
            this.addProperty
            (
                propertyName,
                new fcModel.fcValue
                (
                    Date.prototype[propertyName],
                    fcModel.Function.createInternalNamedFunction(globalObject, propertyName, this),
                    null
                ),
                null,
                false
            );
        }, this);
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
        this.initObject(globalObject);

        this.addProperty("prototype", globalObject.fcDatePrototype);

        this.isInternalFunction = true;
        this.name = "Date";
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
            return new fcModel.fcValue
            (
                Date[functionObject.value.name].apply(null, arguments.map(function(item) { return item.value; })),
                null,
                callExpression
            );
        }
        catch(e) { fcModel.Date.notifyError("Date - error when executing Date functions:" + e); }
    },

    executeInternalConstructor: function(callExpression, arguments, globalObject)
    {
        try
        {
            var date;

            if(arguments.length == 0)
            {
                if(globalObject.currentEventTime != null)
                {
                    date = new Date();
                }
                else
                {
                    date = new Date();
                }
            }
            else
            {
                date = new Date(arguments[0].jsValue)
            }

            return new fcModel.fcValue(date, new fcModel.Date(date, globalObject), callExpression);
        }
        catch(e) { fcModel.Date.notifyError("Date - error when creating Date object:" + e); }
    },

    executeInternalDateMethod : function(thisObject, functionObject, arguments, callExpression, callCommand)
    {
        try
        {
            if(!functionObject.isInternalFunction) { this.notifyError("The function should be internal when executing string method!"); return; }

            var functionObjectValue = functionObject.jsValue;
            var thisObjectValue = thisObject.jsValue;
            var functionName = functionObjectValue.name;
            var fcThisValue =  thisObject.iValue;
            var globalObject = fcThisValue != null ? fcThisValue.globalObject
                                                   : functionObjectValue.fcValue.iValue.globalObject;

            var argumentValues = arguments.map(function(argument){ return argument.jsValue;});

            if(functionName.indexOf("set") == 0)
            {
                var result = thisObjectValue[functionName].apply(thisObjectValue, argumentValues);
            }
            else
            {
                var result = thisObjectValue[functionName]();
            }

            return globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, result);
        }
        catch(e) {this.notifyError("Error when executing internal string method: " + e); }
    },
    notifyError: function(message) { fcModel.String.notifyError(message); }
};
/*************************************************************************************/
}});