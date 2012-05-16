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
            this._expandArrayMethods(globalObject);
        },

        _expandArrayMethods: function(globalObject)
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
    }
}});