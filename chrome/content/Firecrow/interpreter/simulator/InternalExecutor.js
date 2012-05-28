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
    //TODO - NOT YET FINISHED!
    fcSimulator.InternalExecutor =
    {
        createObject: function(globalObject, constructorFunction, creationCodeConstruct)
        {
            try
            {
                var newObject = null;

                if(constructorFunction == null && (ASTHelper.isObjectExpression(creationCodeConstruct) || creationCodeConstruct == null))
                {
                    newObject = {};
                }
                else if(ValueTypeHelper.isOfType(constructorFunction.value, Function))
                {
                    newObject = new constructorFunction.value();
                }
                else if (constructorFunction != null && constructorFunction.isInternalFunction)
                {
                    newObject = this.executeConstructor(globalObject, creationCodeConstruct, constructorFunction);
                }
                else
                {
                    this.notifyError("Unknown state when creating object");
                }

                return new fcModel.JsValue(newObject, { codeConstruct: creationCodeConstruct, object: new fcModel.Object(globalObject, creationCodeConstruct, newObject)});
            }
            catch(e) { this.notifyError("Error when creating object:" + e); }
        },

        createFunction: function(globalObject, scopeChain, functionCodeConstruct)
        {
            try
            {
                return new fcModel.JsValue
                (
                    function(){},
                    {
                        codeConstruct:functionCodeConstruct,
                        object: new fcModel.Function(globalObject, scopeChain, functionCodeConstruct)
                    }
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

                return new fcModel.JsValue(array, { codeConstruct:creationCodeConstruct, array: fcArray, object: fcArray});
            }
            catch(e) { this.notifyError("Error when creating array: " + e);}
        },

        expandPrimitive: function(string, creationCodeConstruct)
        {
            try
            {
                if(string.__FIRECROW_INTERNAL__ == null)
                {
                    Object.defineProperty
                    (
                        string,
                        "__FIRECROW_INTERNAL__",
                        {
                            value:
                            {
                                codeConstruct:creationCodeConstruct,
                                isLiteral: creationCodeConstruct != null && ASTHelper.isLiteral(creationCodeConstruct),
                                object: string
                            }
                        }
                    );
                }
            }
            catch(e) { alert("InternalExecutor - error when expanding string: " + e); }
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
                if(ValueTypeHelper.isOfType(thisObject, Array)) { return this._executeInternalArrayMethod(thisObject, functionObject, arguments, globalObject, callExpression); }
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

                if(functionObjectValue.name == "pop")
                {
                    thisObject.fcInternal.array.pop();
                    return thisObjectValue[functionObjectValue.name]();
                }
                else if (functionObjectValue.name == "indexOf" ||  functionObjectValue.name == "lastIndexOf")
                {
                    return thisObjectValue[functionObjectValue.name].apply(thisObjectValue, arguments);
                }
                else if (functionObjectValue.name == "push")
                {
                    if(arguments.length == 0) { thisObject.fcInternal.array.push(); return thisObjectValue[functionObjectValue.name](); }

                    return thisObjectValue[functionObjectValue.name].apply(thisObjectValue, arguments);
                }
                else if(functionObjectValue.name == "reverse")
                {
                    thisObject.fcInternal.array.reverse();
                    return thisObjectValue[functionObjectValue.name]();
                }
                else if(functionObjectValue.name == "unshift")
                {
                    thisObject.fcInternal.array.unshift(arguments);

                    return thisObjectValue[functionObjectValue.name].apply(thisObjectValue, arguments);
                }
                else if(functionObjectValue.name == "splice")
                {
                    thisObject.fcInternal.array.splice(arguments);
                    return thisObjectValue[functionObjectValue.name].apply(thisObjectValue, arguments);
                }
                else if(functionObjectValue.name == "shift")
                {
                    thisObject.fcInternal.array.shift();
                    return thisObjectValue[functionObjectValue.name]();
                }
                else if(functionObjectValue.name == "concat" ||  functionObjectValue.name == "slice")
                {
                    return this.createArray(globalObject, callExpression, thisObjectValue[functionObjectValue.name].apply(thisObjectValue, arguments));
                }
                else
                {
                    this.notifyError("Unknown internal array method: " + functionObjectValue.name);
                }
            }
            catch(e) { this.notifyError("Error when executing internal array method: " + e); }
        },

        expandInternalFunctions: function(globalObject)
        {
            try
            {
                //this._expandArrayMethods(globalObject);
                //this._expandStringMethods(globalObject);
                //this._expandFunctionPrototype(globalObject);
            }
            catch(e) { this.notifyError("Error when expanding internal functions: " + e);}
        },

        _expandArrayMethods: function(globalObject)
        {
            try
            {
                var arrayPrototype = Array.prototype;

                fcModel.ArrayPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
                {
                    if(arrayPrototype[propertyName] != null && arrayPrototype[propertyName].__FIRECROW_INTERNAL__ == null)
                    {
                        Object.defineProperty
                        (
                            arrayPrototype[propertyName],
                            "__FIRECROW_INTERNAL__",
                            {
                                value: fcModel.Function.createInternalNamedFunction(globalObject, propertyName)
                            }
                        );
                    }
                });

                fcModel.ArrayPrototype.CONST.INTERNAL_PROPERTIES.CALLBACK_METHODS.forEach(function(propertyName)
                {
                    arrayPrototype[propertyName].__FIRECROW_INTERNAL__.isCallbackMethod = true;
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

        _expandFunctionPrototype: function(globalObject)
        {
            try
            {
                var functionPrototype = Function.prototype;
                var functionProto = Function.__proto__;

                if(functionPrototype.__FIRECROW_INTERNAL__ == null)
                {
                    Object.defineProperty
                    (
                        functionPrototype,
                        "__FIRECROW_INTERNAL__",
                        {
                            value: globalObject.functionPrototype
                        }
                    );
                }


                if(functionProto.__FIRECROW_INTERNAL__ == null)
                {
                    Object.defineProperty
                    (
                        functionProto,
                        "__FIRECROW_INTERNAL__",
                        {
                            value: globalObject.functionPrototype
                        }
                    );
                }

                fcModel.FunctionPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
                {
                    if(functionPrototype[propertyName] && functionPrototype[propertyName].__FIRECROW_INTERNAL__ == null)
                    {
                        Object.defineProperty
                        (
                            functionPrototype[propertyName],
                            "__FIRECROW_INTERNAL__",
                            {
                                value: fcModel.Function.createInternalNamedFunction(globalObject, propertyName)
                            }
                        );
                    }
                });

            }
            catch(e) { alert("InternalExecutor - error when expanding function prototype: " + e); }
        },

        notifyError: function(message) { alert("InternalExecutor - " + message);}
    }
}});