FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;

fcModel.Event = function(implementationObject, globalObject, eventThisObject)
{
    try
    {
        this.initObject(globalObject, null, implementationObject);

        this.constructor = fcModel.Event;
        this.eventThisObject = eventThisObject;

        fcModel.Event.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(method)
        {
            this.addProperty(method, this.globalObject.internalExecutor.createInternalFunction
            (
                eval("(function " + method + "(){})"),
                method,
                this
            ));
        }, this);
    }
    catch(e) { fcModel.Event.notifyError("Error when creating Event: " + e); }
};

fcModel.Event.prototype = new fcModel.Object();

fcModel.Event.prototype.getJsPropertyValue = function (propertyName, codeConstruct)
{
    return this.getPropertyValue(propertyName, codeConstruct);
};

fcModel.Event.prototype.addJsProperty = function(propertyName, propertyValue, codeConstruct, isEnumerable)
{
    this.addProperty(propertyName, propertyValue, codeConstruct, isEnumerable);
};

fcModel.Event.notifyError = function(message) { alert("Event - " + message); }

fcModel.Event.CONST =
{
    INTERNAL_PROPERTIES:
    {
        METHODS: ["preventDefault", "stopPropagation", "stopImmediatePropagation"]
    }
};

fcModel.EventExecutor =
{
    executeInternalMethod: function(thisObject, functionObject, arguments, callExpression)
    {
        if(!functionObject.isInternalFunction) { fcModel.Event.notifyError("The function should be internal when executing html method!"); return; }

        var functionObjectValue = functionObject.jsValue;
        var thisObjectValue = thisObject.jsValue;
        var functionName = functionObjectValue.name;
        var fcThisValue =  thisObject.iValue;
        var globalObject = fcThisValue.globalObject;
        var jsArguments =  arguments.map(function(argument){ return argument.jsValue;});

        if(fcModel.Event.CONST.INTERNAL_PROPERTIES.METHODS.indexOf(functionName) == -1) { fcModel.Event.notifyError("Unhandled event method!"); return; }

        if(fcThisValue.eventThisObject != null && fcThisValue.eventThisObject.jsValue instanceof Element)
        {
            fcModel.HtmlElementExecutor.addDependencyIfImportantElement(fcThisValue.eventThisObject.jsValue, globalObject, callExpression);
        }
    }
}
}});