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
                var oldPrototype = constructorFunction.value.prototype;

                if(oldPrototype != null && oldPrototype.value != null)
                {
                    constructorFunction.value.prototype = oldPrototype.value;
                }

                newObject = new constructorFunction.value();

                if(oldPrototype != null && oldPrototype.value != null)
                {
                    constructorFunction.value.prototype = oldPrototype;
                }

                if(constructorFunction.fcInternal != null && constructorFunction.fcInternal.object != null)
                {
                    this.globalObject.browser.callDataDependencyEstablishedCallbacks(creationCodeConstruct, constructorFunction.fcInternal.object.prototypeDefinitionConstruct, this.globalObject.evaluationPositionId);
                }

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

            var jsPropertyObject = new fcModel.Object(this.globalObject, functionCodeConstruct);

            jsPropertyObject.registerModificationAddedCallback(function(lastModification, allModifications)
            {
                var nextToLastModification = allModifications[allModifications.length - 2];

                if(nextToLastModification != null && this.globalObject.currentCommand)
                {
                    this.globalObject.browser.callDataDependencyEstablishedCallbacks(lastModification, nextToLastModification, this.globalObject.evaluationPositionId);
                }
            });

            Object.defineProperty
            (
                newFunction.prototype,
                "jsValue",
                {
                    value: new fcModel.JsValue
                    (
                        newFunction.prototype,
                        new fcModel.FcInternal(null, jsPropertyObject)
                    )
                }
            );

            return new fcModel.JsValue
            (
                newFunction,
                new fcModel.FcInternal
                (
                    functionCodeConstruct,
                    new fcModel.Function(this.globalObject, scopeChain, functionCodeConstruct, newFunction)
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

            return new fcModel.JsValue
            (
                array,
                new fcModel.FcInternal
                (
                    creationCodeConstruct,
                    new fcModel.Array(array, this.globalObject, creationCodeConstruct)
                )
            );
        }
        catch(e) { this.notifyError("Error when creating array: " + e);}
    },

    createRegEx: function(creationCodeConstruct, regEx)
    {
        try
        {
            return new fcModel.JsValue
            (
                regEx,
                new fcModel.FcInternal
                (
                    creationCodeConstruct,
                    new fcModel.RegEx(regEx, this.globalObject, creationCodeConstruct)
                )
            );
        }
        catch(e) { this.notifyError("Error when creating regEx: " + e);}
    },

    createHtmlElement: function(creationCodeConstruct, tagName)
    {
        try
        {
            var jsElement = document.createElement(tagName);

            return new fcModel.JsValue
            (
                jsElement,
                new fcModel.FcInternal
                (
                    creationCodeConstruct,
                    new fcModel.HtmlElement(jsElement, this.globalObject, creationCodeConstruct)
                )
            );
        }
        catch(e) { this.notifyError("Error when creating html element: " + e);}
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
            else if (ValueTypeHelper.isOfType(thisObject.value, DocumentFragment)){ return fcModel.DocumentExecutor.executeInternalMethod(thisObject, functionObject, arguments, callExpression); }
            else if (ValueTypeHelper.isOfType(thisObject.value, Document)){ return fcModel.DocumentExecutor.executeInternalMethod(thisObject.fcInternal.globalObject.jsFcDocument, functionObject, arguments, callExpression);}
            else if (ValueTypeHelper.isOfType(thisObject.value, HTMLElement)) { return fcModel.HtmlElementExecutor.executeInternalMethod(thisObject, functionObject, arguments, callExpression); }
            else if (ValueTypeHelper.isOfType(thisObject.value, fcModel.Math)) { return fcModel.MathExecutor.executeInternalMethod(thisObject, functionObject, arguments, callExpression); }
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
            this._expandDocumentMethods();
            this._expandDocument();
            this._expandMathMethods();
        }
        catch(e) { this.notifyError("Error when expanding internal functions: " + e);}
    },

    expandBasicObject: function(object)
    {
        try
        {
            if(object == null) { this.notifyError("Argument object can not be null when expanding basic object"); }

            if(!object.hasOwnProperty("jsValue"))
            {
                Object.defineProperty
                (
                    object,
                    "jsValue",
                    {
                        value: new fcModel.JsValue
                        (
                            object,
                            new fcModel.Object(this.globalObject)
                        )
                    }
                );
            }
        }
        catch(e) { this.notifyError("Error when expanding basic object:" + e); }
    },

    expandWithInternalFunction: function(object, functionName)
    {
        try
        {
            if(object == null) { this.notifyError("Argument object can not be null when expanding with internal function")}

            if(object[functionName] && !object[functionName].hasOwnProperty("jsValue"))
            {
                Object.defineProperty
                (
                    object[functionName],
                    "jsValue",
                    {
                        value: new fcModel.JsValue
                        (
                            object[functionName],
                            new fcModel.FcInternal(null, fcModel.Function.createInternalNamedFunction(this.globalObject, functionName))
                        )
                    }
                );
            }
        }
        catch(e) { this.notifyError("Error when expanding object with internal function:" + e); }
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
                this.expandWithInternalFunction(functionPrototype, propertyName);
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
                        ),
                        writable: true
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
                this.expandWithInternalFunction(arrayPrototype, propertyName);
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
                this.expandWithInternalFunction(regExPrototype, propertyName);
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
                this.expandWithInternalFunction(stringPrototype, propertyName);
            }, this);
        }
        catch(e) { alert("InternalExecutor - error when expanding string methods: " + e); }
    },

    _expandMathMethods: function()
    {
        try
        {
            fcModel.Math.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
            {
                this.expandWithInternalFunction(Math, propertyName);
            }, this);
        }
        catch(e) { alert("InternalExecutor - error when expanding math methods: " + e); }
    },

    _expandDocumentMethods: function()
    {
        try
        {
            fcModel.Document.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
            {
                this.expandWithInternalFunction(document, propertyName);
            }, this);
        }
        catch(e) { alert("InternalExecutor - error when expanding document methods: " + e); }
    },

    _expandDocument: function()
    {
        try
        {
            if(!document.hasOwnProperty("jsValue"))
            {
                Object.defineProperty
                (
                    document,
                    "jsValue",
                    {
                        value: new fcModel.JsValue
                        (
                            document,
                            this.globalObject.document
                        )
                    }
                );
            }
        }
        catch(e) { alert("InternalExecutor - error when expanding document: " + e); }
    },

    notifyError: function(message) { alert("InternalExecutor - " + message);}
}
}});