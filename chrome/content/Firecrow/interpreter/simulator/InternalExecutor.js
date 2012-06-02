/**
 * User: Jomaras
 * Date: 16.05.12.
 * Time: 09:45
 */
FBL.ns(function() { with (FBL) {
    /*************************************************************************************/
    const ValueTypeHelper = Firecrow.ValueTypeHelper;
    const fcModel = Firecrow.Interpreter.Model;
    const fcModelInternals = Firecrow.Interpreter.Model.Internals;
    const fcSimulator = Firecrow.Interpreter.Simulator;
    const ASTHelper = Firecrow.ASTHelper;

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

                var fcArray = new fcModel.Array(globalObject, creationCodeConstruct);
                array.forEach(function(item) { fcArray.push(item);})

                return new fcModel.JsValue(array, new fcModel.FcInternal(creationCodeConstruct, fcArray));
            }
            catch(e) { this.notifyError("Error when creating array: " + e);}
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
                else { this.notifyError("Unsupported internal function!"); }
            }
            catch(e) { this.notifyError("Error when executing internal function: " + e); }
        },

        _executeInternalArrayMethod: function(thisObject, functionObject, arguments, globalObject, callExpression)
        {
            try
            {
                if(!ValueTypeHelper.isOfType(thisObject.value, Array)) { this.notifyError("The called on object should be an array!"); return; }
                if(!functionObject.fcInternal.isInternalFunction) { this.notifyError("The function should be internal!"); return; }

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
                    case "unshift":
                    case "splice":
                        fcThisValue[functionName].apply(fcThisValue, [arguments, callExpression]);
                        return thisObjectValue[functionObjectValue.name].apply(thisObjectValue, arguments);
                    case "push":
                        arguments.forEach(function(argument){fcThisValue.push(argument, callExpression);});
                        return thisObjectValue[functionObjectValue.name].apply(thisObjectValue, arguments);
                    case "concat":
                    case "slice":
                    case "indexOf":
                    case "lastIndexOf":
                        return fcThisValue[functionName].apply(fcThisValue, [thisObjectValue, arguments, callExpression]);
                    default:
                        this.notifyError("Unknown internal array method: " + functionObjectValue.name);
                }
            }
            catch(e) { this.notifyError("Error when executing internal array method: " + e); }
        },

        expandInternalFunctions: function(globalObject)
        {
            try
            {
                this._expandArrayMethods(globalObject);
                this._expandFunctionPrototype(globalObject);
                this._expandObjectPrototype(globalObject);
                //this._expandStringMethods(globalObject);

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
                    if(functionPrototype[propertyName] && functionPrototype[propertyName].jsValue == null)
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
                    if(arrayPrototype[propertyName] != null && arrayPrototype[propertyName].jsValue == null)
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

        _expandStringMethods: function(globalObject)
        {
            try
            {
                var stringPrototype = String.prototype;

                fcModelInternals.StringObjectPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
                {
                    if(stringPrototype[propertyName] != null && stringPrototype[propertyName].__FIRECROW_INTERNAL__ == null)
                    {
                        Object.defineProperty
                        (
                            stringPrototype[propertyName],
                            "__FIRECROW_INTERNAL__",
                            {
                                value: fcModel.Function.createInternalNamedFunction(globalObject, propertyName)
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