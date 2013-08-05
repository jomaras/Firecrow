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

fcModel.EventPrototype = function(globalObject)
{
    try
    {
        this.initObject(globalObject);
        this.constructor = fcModel.EventPrototype;
        fcModel.EventPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            if(Event.prototype[propertyName] == null) { return; }
            this.addProperty
            (
                propertyName,
                new fcModel.fcValue
                (
                    Event.prototype[propertyName],
                    fcModel.Function.createInternalNamedFunction(globalObject, propertyName, this),
                    null
                ),
                null,
                false
            );
        }, this);
    }
    catch(e) { fcModel.Event.notifyError("EventPrototype - error when creating date prototype:" + e); }
};

fcModel.EventPrototype.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS:
        [
            "initEvent", "preventDefault", "stopImmediatePropagation", "stopPropagation"
        ],
        PROPERTIES:
        [
            "bubbles", "cancelable", "currentTarget", "defaultPrevented", "eventPhase", "explicitOriginalTarget",
            "originalTarget", "target", "timeStamp", "type", "isTrusted"
        ]
    },
    FUNCTION_PROPERTIES:
    {
        METHODS:  ["now", "parse", "UTC"]
    }
};

fcModel.EventPrototype.prototype = new fcModel.Object(null);

fcModel.EventFunction = function(globalObject)
{
    try
    {
        this.initObject(globalObject);

        this.addProperty("prototype", globalObject.fcEventPrototype);

        this.isInternalFunction = true;
        this.name = "Event";
    }
    catch(e){ fcModel.Event.notifyError("Event - error when creating Event Function:" + e); }
};

fcModel.EventFunction.prototype = new fcModel.Object(null);

fcModel.EventExecutor =
{
    executeInternalMethod: function(thisObject, functionObject, args, callExpression)
    {
        if(!functionObject.isInternalFunction) { fcModel.Event.notifyError("The function should be internal when executing html method!"); return; }

        var functionObjectValue = functionObject.jsValue;
        var thisObjectValue = thisObject.jsValue;
        var functionName = functionObjectValue.name;
        var fcThisValue =  thisObject.iValue;
        var globalObject = fcThisValue.globalObject;
        var jsArguments =  globalObject.getJsValues(args);

        if(fcModel.Event.CONST.INTERNAL_PROPERTIES.METHODS.indexOf(functionName) == -1) { fcModel.Event.notifyError("Unhandled event method!"); return; }

        if(fcThisValue.eventThisObject != null && fcThisValue.eventThisObject.jsValue instanceof Element)
        {
            fcModel.HtmlElementExecutor.addDependencyIfImportantElement(fcThisValue.eventThisObject.jsValue, globalObject, callExpression);
        }
    }
}
}});