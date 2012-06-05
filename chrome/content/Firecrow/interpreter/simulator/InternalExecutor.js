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

fcSimulator.InternalExecutor = function(globalObject)
{
    this.globalObject = globalObject;
};

fcSimulator.InternalExecutor.prototype =
{
    createObject: function(constructorFunction, creationCodeConstruct)
    {
        try
        {
            var newObject;

            if(constructorFunction == null && (ASTHelper.isObjectExpression(creationCodeConstruct) || creationCodeConstruct == null))
            {
                newObject = {};

                return new fcModel.JsValue(newObject, new fcModel.FcInternal(creationCodeConstruct, new fcModel.Object(this.globalObject, creationCodeConstruct, newObject)));
            }
            else if(ValueTypeHelper.isOfType(constructorFunction.value, Function))
            {
                newObject = new constructorFunction.value();

                return new fcModel.JsValue(newObject, new fcModel.FcInternal(creationCodeConstruct, new fcModel.Object(this.globalObject, creationCodeConstruct, newObject)));
            }
            else if (constructorFunction != null && constructorFunction.isInternalFunction)
            {
                return this.executeConstructor(creationCodeConstruct, constructorFunction);
            }
            else
            {
                this.notifyError("Unknown state when creating object");
            }
        }
        catch(e) { this.notifyError("Error when creating object:" + e); }
    },

    createFunction: function(scopeChain, functionCodeConstruct)
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
                        new fcModel.FcInternal(null, this.globalObject.objectPrototype)
                    )
                }
            );

            return new fcModel.JsValue
            (
                newFunction,
                new fcModel.FcInternal
                (
                    functionCodeConstruct,
                    new fcModel.Function(this.globalObject, scopeChain, functionCodeConstruct)
                )
            );
        }
        catch(e) { this.notifyError("Error when creating function: " + e); }
    },

    createArray: function(creationCodeConstruct, existingArray)
    {
        try
        {
            var array = existingArray || [];

            var fcArray = new fcModel.Array(array, this.globalObject, creationCodeConstruct);

            return new fcModel.JsValue(array, new fcModel.FcInternal(creationCodeConstruct, fcArray));
        }
        catch(e) { this.notifyError("Error when creating array: " + e);}
    },

    createRegEx: function(creationCodeConstruct, regEx)
    {
        try
        {
            var fcRegEx = new fcModel.RegEx(regEx, this.globalObject, creationCodeConstruct);

            return new fcModel.JsValue(regEx, new fcModel.FcInternal(creationCodeConstruct, fcRegEx));
        }
        catch(e) { this.notifyError("Error when creating regEx: " + e);}
    },

    executeConstructor: function(constructorConstruct, internalConstructor)
    {
        try
        {
            if(internalConstructor == null) { this.notifyError("InternalConstructor can not be null!"); return; }

            if(internalConstructor.name == "Array") { return this.createArray(constructorConstruct); }
            else { this.notifyError("Unknown internal constructor"); return; }
        }
        catch(e) { this.notifyError("Execute error: " + e); }
    },

    executeFunction: function(thisObject, functionObject, arguments, callExpression)
    {
        try
        {
            if(thisObject == null) { this.notifyError("This object can not be null when executing function!"); return; }

            if(ValueTypeHelper.isOfType(thisObject.value, Array)) { return fcModel.ArrayExecutor.executeInternalArrayMethod(thisObject, functionObject, arguments, callExpression); }
            else if (ValueTypeHelper.isString(thisObject.value)) { return fcModel.StringExecutor.executeInternalStringMethod(thisObject, functionObject, arguments, callExpression); }
            else if (ValueTypeHelper.isOfType(thisObject.value, RegExp)) { return fcModel.RegExExecutor.executeInternalRegExMethod(thisObject, functionObject, arguments, callExpression); }
            else
            {
                this.notifyError("Unsupported internal function!");
            }
        }
        catch(e) { this.notifyError("Error when executing internal function: " + e); }
    },

    expandInternalFunctions: function()
    {
        try
        {
            this._expandArrayMethods();
            this._expandFunctionPrototype();
            this._expandObjectPrototype();
            this._expandRegExMethods();
            this._expandStringMethods();
        }
        catch(e) { this.notifyError("Error when expanding internal functions: " + e);}
    },

    _expandFunctionPrototype: function()
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
                            new fcModel.FcInternal(null, this.globalObject.functionPrototype)
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
                                new fcModel.FcInternal(null, fcModel.Function.createInternalNamedFunction(this.globalObject, propertyName))
                            )
                        }
                    );
                }
            }, this);

        }
        catch(e) { alert("InternalExecutor - error when expanding function prototype: " + e); }
    },

    _expandObjectPrototype: function()
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
                            new fcModel.FcInternal(null, this.globalObject.objectPrototype)
                        )
                    }
                );
            }
        }
        catch(e) { this.notifyError("Error when expanding Object prototype"); }
    },

    _expandArrayMethods: function()
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
                                new fcModel.FcInternal(null, fcModel.Function.createInternalNamedFunction(this.globalObject, propertyName))
                            )
                        }
                    );
                }
            }, this);

            fcModel.ArrayPrototype.CONST.INTERNAL_PROPERTIES.CALLBACK_METHODS.forEach(function(propertyName)
            {
                arrayPrototype[propertyName].jsValue.fcInternal.isCallbackMethod = true;
            });
        }
        catch(e) { alert("InternalExecutor - error when expanding array methods: " + e); }
    },

    _expandRegExMethods: function()
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
                                new fcModel.FcInternal(null, fcModel.Function.createInternalNamedFunction(this.globalObject, propertyName))
                            )
                        }
                    );
                }
            }, this);
        }
        catch(e) { alert("InternalExecutor - error when expanding regEx methods: " + e); }
    },

    _expandStringMethods: function()
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
                                new fcModel.FcInternal(null, fcModel.Function.createInternalNamedFunction(this.globalObject, propertyName))
                            )
                        }
                    );
                }
            }, this);
        }
        catch(e) { alert("InternalExecutor - error when expanding string methods: " + e); }
    },

    notifyError: function(message) { alert("InternalExecutor - " + message);}
}
}});