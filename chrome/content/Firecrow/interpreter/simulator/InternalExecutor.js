/**
 * User: Jomaras
 * Date: 16.05.12.
 * Time: 09:45
 */
FBL.ns(function() { with (FBL) {
    /*************************************************************************************/
    const ValueTypeHelper = Firecrow.ValueTypeHelper;
    const fcModel = Firecrow.Interpreter.Model;
    const ASTHelper = Firecrow.ASTHelper;

    Firecrow.Interpreter.Simulator.InternalExecutor =
    {
        createArray: function(globalObject, creationCodeConstruct)
        {
            var newArray = [];

            Object.defineProperty
            (
                newArray,
                "__FIRECROW_INTERNAL__",
                {
                    value:
                    {
                        codeConstruct: creationCodeConstruct,
                        array: new Firecrow.Interpreter.Model.Array(globalObject, creationCodeConstruct)
                    }
                }
            );

            return newArray;
        },

        createObject: function(globalObject, constructorFunction, creationCodeConstruct)
        {
            try
            {
                var newObject = null;

                if(constructorFunction == null && (ASTHelper.isObjectExpression(creationCodeConstruct) || creationCodeConstruct == null))
                {
                    newObject = {};
                }
                else if(ValueTypeHelper.isOfType(constructorFunction, Function))
                {
                    newObject = new constructorFunction();
                }
                else if (constructorFunction != null && constructorFunction.isInternalFunction)
                {
                    newObject = this.executeConstructor(globalObject, creationCodeConstruct, constructorFunction);
                }
                else { alert("InternalExecutor - unknown state!"); }

                if(newObject.__FIRECROW_INTERNAL__ == null)
                {
                    Object.defineProperty
                    (
                        newObject,
                        "__FIRECROW_INTERNAL__",
                        {
                            value:
                            {
                                codeConstruct: creationCodeConstruct,
                                object: new fcModel.Object(globalObject, creationCodeConstruct, newObject)
                            }
                        }
                    );
                }

                return newObject;
            }
            catch(e) { alert("InternalExecutor - error when creating object:" + e); }
        },

        createFunction: function(globalObject, scopeChain, functionCodeConstruct)
        {
            try
            {
                var value = function(){ };

                if(value.prototype.__FIRECROW_INTERNAL__ == null)
                {
                    Object.defineProperty
                    (
                        value.prototype,
                        "__FIRECROW_INTERNAL__",
                        {
                            value:
                            {
                                object: new fcModel.Object(globalObject)
                            }
                        }
                    );
                }

                Object.defineProperty
                (
                    value,
                    "__FIRECROW_INTERNAL__",
                    {
                        value: new fcModel.Function(globalObject, scopeChain, functionCodeConstruct)
                    }
                );

                return value;
            }
            catch(e) { alert("InternalExecutor - error when creating function: " + e); }
        },

        executeConstructor: function(globalObject, constructorConstruct, internalConstructor)
        {
            try
            {
                if(internalConstructor == null) { alert("InternalConstructorExecutor - execute: internalConstructor can not be null!"); return; }

                if(internalConstructor.name == "Array") { return this.createArray(globalObject, constructorConstruct); }
                else { alert("InternalConstructorExecutor: Unknown internal constructor"); return; }
            }
            catch(e) { alert("InternalConstructorExecutor - execute error: " + e); }
        },

        executeFunction: function(thisObject, functionObject, arguments)
        {
            try
            {
                if(ValueTypeHelper.isOfType(thisObject, Array)) { return this._executeInternalArrayMethod(thisObject, functionObject, arguments); }
            }
            catch(e) { alert("InternalExecutor - error when executing internal function: " + e); }
        },

        _executeInternalArrayMethod: function(thisObject, functionObject, arguments)
        {
            try
            {
                //"pop","push","reverse","shift","sort","splice","unshift","concat","join","slice","indexOf","lastIndexOf"
                if(!ValueTypeHelper.isOfType(thisObject, Array)) { alert("InternalExecutor - the called on object should be an array!"); return; }
                if(!functionObject.__FIRECROW_INTERNAL__.isInternalFunction) { alert("InternalExecutor - the function should be internal!"); return; }

                if(functionObject.__FIRECROW_INTERNAL__.name == "pop")
                {
                    thisObject.__FIRECROW_INTERNAL__.array.pop();
                    return thisObject[functionObject.name]();
                }
                else if (functionObject.__FIRECROW_INTERNAL__.name == "push")
                {
                    if(arguments.length == 0) { thisObject.__FIRECROW_INTERNAL__.array.push(); return thisObject[functionObject.name](); }

                    return thisObject[functionObject.name].apply(thisObject, arguments);
                }
                else if(functionObject.__FIRECROW_INTERNAL__.name == "reverse")
                {
                    thisObject.__FIRECROW_INTERNAL__.array.reverse();
                    return thisObject[functionObject.name]();
                }
                else if(functionObject.__FIRECROW_INTERNAL__.name == "unshift")
                {
                    thisObject.__FIRECROW_INTERNAL__.array.unshift(arguments);

                    return thisObject[functionObject.name].apply(thisObject, arguments);
                }
                else if(functionObject.__FIRECROW_INTERNAL__.name == "splice")
                {
                    thisObject.__FIRECROW_INTERNAL__.array.splice(arguments);
                    return thisObject[functionObject.name].apply(thisObject, arguments);
                }
                else if(functionObject.__FIRECROW_INTERNAL__.name == "shift")
                {
                    thisObject.__FIRECROW_INTERNAL__.array.shift();
                    return thisObject[functionObject.name]();
                }
                else { alert("InternalExecutor - unknown internal array method: " + functionObject.__FIRECROW_INTERNAL__.name); }

            }
            catch(e) { alert("InternalExecutor - error when executing internal array method: " + e); }
        },

        expandInternalFunctions: function(globalObject)
        {
            try
            {
                this._expandArrayMethods(globalObject);
                this._expandFunctionPrototype(globalObject);
            }
            catch(e) { alert("Internal Executor - error when expanding internal functions: " + e);}
        },

        _expandArrayMethods: function(globalObject)
        {
            try
            {
                var arrayPrototype = Array.prototype;

                fcModel.ArrayPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
                {
                    Object.defineProperty
                    (
                        arrayPrototype[propertyName],
                        "__FIRECROW_INTERNAL__",
                        {
                            value: fcModel.Function.createInternalNamedFunction(globalObject, propertyName)
                        }
                    );
                });
            }
            catch(e) { alert("InternalExecutor - error when expanding array methods: " + e); }
        },

        _expandFunctionPrototype: function(globalObject)
        {
            try
            {
                var functionPrototype = Function.prototype;
                var functionProto = Function.__proto__;

                Object.defineProperty
                (
                    functionPrototype,
                    "__FIRECROW_INTERNAL__",
                    {
                        value: globalObject.functionPrototype
                    }
                );

                Object.defineProperty
                (
                    functionProto,
                    "__FIRECROW_INTERNAL__",
                    {
                        value: globalObject.functionPrototype
                    }
                );

                fcModel.FunctionPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
                {
                    Object.defineProperty
                    (
                        functionPrototype[propertyName],
                        "__FIRECROW_INTERNAL__",
                        {
                            value: fcModel.Function.createInternalNamedFunction(globalObject, propertyName)
                        }
                    );
                });

            }
            catch(e) { alert("InternalExecutor - error when expanding function prototype: " + e); }
        }
    }
}});