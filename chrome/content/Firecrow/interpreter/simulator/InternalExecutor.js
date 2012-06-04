/**
 * User: Jomaras
 * Date: 16.05.12.
 * Time: 09:45
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var fcModel = Firecrow.Interpreter.Model;
var fcModelInternals = Firecrow.Interpreter.Model.Internals;
var fcSimulator = Firecrow.Interpreter.Simulator;
var ASTHelper = Firecrow.ASTHelper;

fcSimulator.InternalExecutor =
{
    createObject: function(globalObject, constructorFunction, creationCodeConstruct)
    {
        try
        {
            var newObject;

            if(constructorFunction == null && (ASTHelper.isObjectExpression(creationCodeConstruct) || creationCodeConstruct == null))
            {
                newObject = {};

                return new fcModel.JsValue(newObject, new fcModel.FcInternal(creationCodeConstruct, new fcModel.Object(globalObject, creationCodeConstruct, newObject)));
            }
            else if(ValueTypeHelper.isOfType(constructorFunction.value, Function))
            {
                newObject = new constructorFunction.value();

                return new fcModel.JsValue(newObject, new fcModel.FcInternal(creationCodeConstruct, new fcModel.Object(globalObject, creationCodeConstruct, newObject)));
            }
            else if (constructorFunction != null && constructorFunction.isInternalFunction)
            {
                return this.executeConstructor(globalObject, creationCodeConstruct, constructorFunction);
            }
            else
            {
                this.notifyError("Unknown state when creating object");
            }
        }
        catch(e) { this.notifyError("Error when creating object:" + e); }
    },

    createFunction: function(globalObject, scopeChain, functionCodeConstruct)
    {
        try
        {
            var newFunction = function(){};

            Object.defineProperty
            (
                newFunction.prototype,
                "jsValue",
                {
                    value: new fcModel.JsValue
                    (
                        newFunction.prototype,
                        new fcModel.FcInternal(null, globalObject.objectPrototype)
                    )
                }
            );

            return new fcModel.JsValue
            (
                newFunction,
                new fcModel.FcInternal
                (
                    functionCodeConstruct,
                    new fcModel.Function(globalObject, scopeChain, functionCodeConstruct)
                )
            );
        }
        catch(e) { this.notifyError("Error when creating function: " + e); }
    },

    createArray: function(globalObject, creationCodeConstruct, existingArray)
    {
        try
        {
            var array = existingArray || [];

            var fcArray = new fcModel.Array(array, globalObject, creationCodeConstruct);

            return new fcModel.JsValue(array, new fcModel.FcInternal(creationCodeConstruct, fcArray));
        }
        catch(e) { this.notifyError("Error when creating array: " + e);}
    },

    createRegEx: function(globalObject, creationCodeConstruct, regEx)
    {
        try
        {
            var fcRegEx = new fcModel.RegEx(regEx, globalObject, creationCodeConstruct);

            return new fcModel.JsValue(regEx, new fcModel.FcInternal(creationCodeConstruct, fcRegEx));
        }
        catch(e) { this.notifyError("Error when creating regEx: " + e);}
    },

    executeConstructor: function(globalObject, constructorConstruct, internalConstructor)
    {
        try
        {
            if(internalConstructor == null) { this.notifyError("InternalConstructor can not be null!"); return; }

            if(internalConstructor.name == "Array") { return this.createArray(globalObject, constructorConstruct); }
            else { this.notifyError("Unknown internal constructor"); return; }
        }
        catch(e) { this.notifyError("Execute error: " + e); }
    },

    executeFunction: function(thisObject, functionObject, arguments, globalObject, callExpression)
    {
        try
        {
            if(thisObject == null) { this.notifyError("This object can not be null when executing function!"); return; }

            if(ValueTypeHelper.isOfType(thisObject.value, Array)) { return this._executeInternalArrayMethod(thisObject, functionObject, arguments, globalObject, callExpression); }
            else if (ValueTypeHelper.isString(thisObject.value)) { return this._executeInternalStringMethod(thisObject, functionObject, arguments, globalObject, callExpression); }
            else if (ValueTypeHelper.isOfType(thisObject.value, RegExp)) { return this._executeInternalRegExMethod(thisObject, functionObject, arguments, globalObject, callExpression); }
            else
            {
                this.notifyError("Unsupported internal function!");
            }
        }
        catch(e) { this.notifyError("Error when executing internal function: " + e); }
    },

    _executeInternalArrayMethod: function(thisObject, functionObject, arguments, globalObject, callExpression)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(thisObject.value, Array)) { this.notifyError("The called on object should be an array!"); return; }
            if(!functionObject.fcInternal.isInternalFunction) { this.notifyError("The function should be internal when executing array method!"); return; }

            var functionObjectValue = functionObject.value;
            var thisObjectValue = thisObject.value;
            var functionName = functionObjectValue.name;
            var fcThisValue =  thisObject.fcInternal.object;

            switch(functionName)
            {
                case "pop":
                case "reverse":
                case "shift":
                    fcThisValue[functionName].apply(fcThisValue, [callExpression])
                case "push":
                    arguments.forEach(function(argument){fcThisValue.push(argument, callExpression);});
                    return thisObjectValue[functionObjectValue.name].apply(thisObjectValue, arguments);
                case "concat":
                case "slice":
                case "indexOf":
                case "lastIndexOf":
                case "unshift":
                case "splice":
                    thisObjectValue[functionObjectValue.name].apply(thisObjectValue, arguments);
                    return fcThisValue[functionName].apply(fcThisValue, [thisObjectValue, arguments, callExpression]);
                default:
                    this.notifyError("Unknown internal array method: " + functionObjectValue.name);
            }
        }
        catch(e) { this.notifyError("Error when executing internal array method: " + e); }
    },

    _executeInternalStringMethod: function(thisObject, functionObject, arguments, globalObject, callExpression)
    {
        try
        {
            if(!ValueTypeHelper.isString(thisObject.value)) { this.notifyError("The called on object should be a string!"); return; }
            if(!functionObject.fcInternal.isInternalFunction) { this.notifyError("The function should be internal when executing string method!"); return; }

            var functionObjectValue = functionObject.value;
            var thisObjectValue = thisObject.value;
            var functionName = functionObjectValue.name;
            var fcThisValue =  thisObject.fcInternal.object;

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
                        thisObjectValue[functionName].apply(thisObjectValue, arguments.map(function(argument){ return argument.value;})),
                        new fcModel.FcInternal(callExpression)
                    );
                case "match":
                case "split":
                    var result = thisObjectValue[functionName].apply(thisObjectValue, arguments.map(function(argument){ return argument.value;}));
                    if(result == null) { return new fcModel.JsValue(null, new fcModel.FcInternal(callExpression)); }
                    else if (ValueTypeHelper.isArray(result)){ return fcSimulator.InternalExecutor.createArray(globalObject, callExpression, result);}
                    else { this.notifyError("Unknown result type when executing string match or split!"); return null;}
                case "replace":
                    this.notifyError("Still not handling string replace!");
                    return null;
                default:
                    this.notifyError("Unknown method on string");
            }
        }
        catch(e) {this.notifyError("Error when executing internal string method: " + e); }
    },

    _executeInternalRegExMethod: function(thisObject, functionObject, arguments, globalObject, callExpression)
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
                    else if (ValueTypeHelper.isArray(result)){ return fcSimulator.InternalExecutor.createArray(globalObject, callExpression, result);}
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
        catch(e) {this.notifyError("Error when executing internal string method: " + e); }
    },

    expandInternalFunctions: function(globalObject)
    {
        try
        {
            this._expandArrayMethods(globalObject);
            this._expandFunctionPrototype(globalObject);
            this._expandObjectPrototype(globalObject);
            this._expandRegExMethods(globalObject);
            this._expandStringMethods(globalObject);
        }
        catch(e) { this.notifyError("Error when expanding internal functions: " + e);}
    },

    _expandFunctionPrototype: function(globalObject)
    {
        try
        {
            var functionPrototype = Function.prototype;
            var functionProto = Object.getPrototypeOf(Function);

            if(functionPrototype.jsValue == null)
            {
                Object.defineProperty
                (
                    functionPrototype,
                    "jsValue",
                    {
                        value:new fcModel.JsValue
                        (
                            functionPrototype,
                            new fcModel.FcInternal(null, globalObject.functionPrototype)
                        )
                    }
                );
            }

            fcModel.FunctionPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
            {
                if(functionPrototype[propertyName] && !functionPrototype[propertyName].hasOwnProperty("jsValue"))
                {
                    Object.defineProperty
                    (
                        functionPrototype[propertyName],
                        "jsValue",
                        {
                            value: new fcModel.JsValue
                            (
                                functionPrototype[propertyName],
                                new fcModel.FcInternal(null, fcModel.Function.createInternalNamedFunction(globalObject, propertyName))
                            )
                        }
                    );
                }
            });

        }
        catch(e) { alert("InternalExecutor - error when expanding function prototype: " + e); }
    },

    _expandObjectPrototype: function(globalObject)
    {
        try
        {
            var objectPrototype = Object.prototype;

            if(objectPrototype.jsValue == null)
            {
                Object.defineProperty
                (
                    objectPrototype,
                    "jsValue",
                    {
                        value: new fcModel.JsValue
                        (
                            objectPrototype,
                            new fcModel.FcInternal(null, globalObject.objectPrototype)
                        )
                    }
                );
            }
        }
        catch(e) { this.notifyError("Error when expanding Object prototype"); }
    },

    _expandArrayMethods: function(globalObject)
    {
        try
        {
            var arrayPrototype = Array.prototype;

            fcModel.ArrayPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
            {
                if(arrayPrototype[propertyName] != null && !arrayPrototype[propertyName].hasOwnProperty("jsValue"))
                {
                    Object.defineProperty
                    (
                        arrayPrototype[propertyName],
                        "jsValue",
                        {
                            value: new fcModel.JsValue
                            (
                                arrayPrototype[propertyName],
                                new fcModel.FcInternal(null, fcModel.Function.createInternalNamedFunction(globalObject, propertyName))
                            )
                        }
                    );
                }
            });

            fcModel.ArrayPrototype.CONST.INTERNAL_PROPERTIES.CALLBACK_METHODS.forEach(function(propertyName)
            {
                arrayPrototype[propertyName].jsValue.fcInternal.isCallbackMethod = true;
            });
        }
        catch(e) { alert("InternalExecutor - error when expanding array methods: " + e); }
    },

    _expandRegExMethods: function(globalObject)
    {
        try
        {
            var regExPrototype = RegExp.prototype;

            fcModel.RegExPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
            {
                if(regExPrototype[propertyName] != null && !regExPrototype[propertyName].hasOwnProperty("jsValue"))
                {
                    Object.defineProperty
                    (
                        regExPrototype[propertyName],
                        "jsValue",
                        {
                            value: new fcModel.JsValue
                            (
                                regExPrototype[propertyName],
                                new fcModel.FcInternal(null, fcModel.Function.createInternalNamedFunction(globalObject, propertyName))
                            )
                        }
                    );
                }
            });
        }
        catch(e) { alert("InternalExecutor - error when expanding regEx methods: " + e); }
    },

    _expandStringMethods: function(globalObject)
    {
        try
        {
            var stringPrototype = String.prototype;

            fcModel.StringPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
            {
                if(stringPrototype[propertyName] != null && !stringPrototype[propertyName].hasOwnProperty("jsValue"))
                {
                    Object.defineProperty
                    (
                        stringPrototype[propertyName],
                        "jsValue",
                        {
                            value: new fcModel.JsValue
                            (
                                stringPrototype[propertyName],
                                new fcModel.FcInternal(null, fcModel.Function.createInternalNamedFunction(globalObject, propertyName))
                            )
                        }
                    );
                }
            });
        }
        catch(e) { alert("InternalExecutor - error when expanding string methods: " + e); }
    },

    notifyError: function(message) { alert("InternalExecutor - " + message);}
}
}});