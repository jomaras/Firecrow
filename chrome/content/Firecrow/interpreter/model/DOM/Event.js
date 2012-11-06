FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;

fcModel.Event = function(implementationObject, globalObject, eventThisObject)
{
    try
    {
        this.__proto__ = new fcModel.Object(globalObject, null, implementationObject);

        this.constructor = fcModel.Event;
        this.eventThisObject = eventThisObject;

        this.getJsPropertyValue = function (propertyName, codeConstruct)
        {
            return this.getPropertyValue(propertyName, codeConstruct);
        };

        this.addJsProperty = function(propertyName, propertyValue, codeConstruct, isEnumerable)
        {
            this.addProperty(propertyName, propertyValue, codeConstruct, isEnumerable);
        };

        var methods = fcModel.Event.CONST.INTERNAL_PROPERTIES.METHODS;

        for(var i = 0, length = methods.length; i < length; i++)
        {
            var method = methods[i];

            this.addProperty(method, this.globalObject.internalExecutor.createInternalFunction
            (
                eval("(function " + method + "(){})"),
                method,
                this
            ));
        }
    }
    catch(e) { fcModel.Event.notifyError("Error when creating Event: " + e); }
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
        if(!functionObject.fcInternal.isInternalFunction) { fcModel.Event.notifyError("The function should be internal when executing html method!"); return; }

        var functionObjectValue = functionObject.value;
        var thisObjectValue = thisObject.value;
        var functionName = functionObjectValue.name;
        var fcThisValue =  thisObject.fcInternal.object;
        var globalObject = fcThisValue.globalObject;
        var jsArguments =  arguments.map(function(argument){ return argument.value;});

        if(fcModel.Event.CONST.INTERNAL_PROPERTIES.METHODS.indexOf(functionName) == -1) { fcModel.Event.notifyError("Unhandled event method!"); return; }

        if(fcThisValue.eventThisObject != null && fcThisValue.eventThisObject.value instanceof Element)
        {
            fcModel.HtmlElementExecutor.addDependencyIfImportantElement(fcThisValue.eventThisObject.value, globalObject, callExpression);
        }
    }
}
}});