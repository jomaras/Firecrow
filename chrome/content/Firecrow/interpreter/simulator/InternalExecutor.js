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

Firecrow.Interpreter.Simulator.InternalExecutor.notifyError = function(message) { alert("InternalExecutor - " + message);}

fcSimulator.InternalExecutor.prototype =
{
    createObject: function(constructorFunction, creationCodeConstruct, argumentValues)
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

                if(constructorFunction.fcInternal != null && constructorFunction.fcInternal.object != null
                && constructorFunction.fcInternal.object.prototypeDefinitionConstruct != null)
                {
                    this.globalObject.browser.callDataDependencyEstablishedCallbacks
                    (
                        creationCodeConstruct,
                        constructorFunction.fcInternal.object.prototypeDefinitionConstruct.codeConstruct,
                        this.globalObject.getPreciseEvaluationPositionId(),
                        constructorFunction.fcInternal.object.prototypeDefinitionConstruct.evaluationPositionId
                    );
                }

                return new fcModel.JsValue(newObject, new fcModel.FcInternal(creationCodeConstruct, new fcModel.Object(this.globalObject, creationCodeConstruct, newObject, constructorFunction.value.prototype)));
            }
            else if (constructorFunction != null && constructorFunction.isInternalFunction)
            {
                return this.executeConstructor(creationCodeConstruct, constructorFunction, argumentValues);
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
            var newFunction = ASTHelper.isFunctionDeclaration(functionCodeConstruct) ? eval("(function " + functionCodeConstruct.id.name + "(){})")
                                                                                     : function(){};

            Object.defineProperty
            (
                newFunction.prototype,
                "jsValue",
                {
                    value: new fcModel.JsValue
                    (
                        newFunction.prototype,
                        new fcModel.FcInternal(null,  new fcModel.Object(this.globalObject, functionCodeConstruct))
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
            var jsElement = this.globalObject.origDocument.createElement(tagName);

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

    createLocationObject: function()
    {
        try
        {
            var fcLocation = new fcModel.Object(this.globalObject, null, location);

            fcLocation.addProperty("hash", new fcModel.JsValue(this.globalObject.origWindow.location.hash, new fcModel.FcInternal(null)));
            fcLocation.addProperty("host", new fcModel.JsValue(this.globalObject.origWindow.location.host, new fcModel.FcInternal(null)));
            fcLocation.addProperty("hostname", new fcModel.JsValue(this.globalObject.origWindow.location.hostname, new fcModel.FcInternal(null)));
            fcLocation.addProperty("href", new fcModel.JsValue(this.globalObject.origWindow.location.href, new fcModel.FcInternal(null)));
            fcLocation.addProperty("pathname", new fcModel.JsValue(this.globalObject.origWindow.location.pathname, new fcModel.FcInternal(null)));
            fcLocation.addProperty("port", new fcModel.JsValue(this.globalObject.origWindow.location.port, new fcModel.FcInternal(null)));
            fcLocation.addProperty("protocol", new fcModel.JsValue(this.globalObject.origWindow.location.protocol, new fcModel.FcInternal(null)));
            fcLocation.addProperty("search", new fcModel.JsValue(this.globalObject.origWindow.location.search, new fcModel.FcInternal(null)));

            return new fcModel.JsValue(location, new fcModel.FcInternal(null, fcLocation));
        }
        catch(e){ this.notifyError("Error when creating location object");}
    },

    executeConstructor: function(constructorConstruct, internalConstructor, argumentValues)
    {
        try
        {
            if(internalConstructor == null) { this.notifyError("InternalConstructor can not be null!"); return; }

            if(internalConstructor.name == "Array")
            {
                return this.createArray(constructorConstruct, Array.apply(null, argumentValues.map(function(item){ return item.value; })));
            }
            else if(internalConstructor.name == "RegExp")
            {
                return this.createRegEx(constructorConstruct, RegExp.apply(null, argumentValues.map(function(item){ return item.value; })));
            }
            else
            {
                this.notifyError("Unknown internal constructor"); return;
            }
        }
        catch(e) { this.notifyError("Execute error: " + e); }
    },

    executeFunction: function(thisObject, functionObject, arguments, callExpression, callCommand)
    {
        try
        {
            if(thisObject == null) { this.notifyError("This object can not be null when executing function!"); return; }

            if(ValueTypeHelper.isOfType(thisObject.value, Array)) { return fcModel.ArrayExecutor.executeInternalArrayMethod(thisObject, functionObject, arguments, callExpression, callCommand); }
            else if (ValueTypeHelper.isString(thisObject.value)) { return fcModel.StringExecutor.executeInternalStringMethod(thisObject, functionObject, arguments, callExpression, callCommand); }
            else if (ValueTypeHelper.isOfType(thisObject.value, RegExp)) { return fcModel.RegExExecutor.executeInternalRegExMethod(thisObject, functionObject, arguments, callExpression); }
            else if (ValueTypeHelper.isOfType(thisObject.value, DocumentFragment)){ return fcModel.DocumentExecutor.executeInternalMethod(thisObject, functionObject, arguments, callExpression); }
            else if (ValueTypeHelper.isOfType(thisObject.value, Document)){ return fcModel.DocumentExecutor.executeInternalMethod(thisObject.fcInternal.globalObject.jsFcDocument, functionObject, arguments, callExpression);}
            else if (ValueTypeHelper.isOfType(thisObject.value, HTMLElement)) { return fcModel.HtmlElementExecutor.executeInternalMethod(thisObject, functionObject, arguments, callExpression); }
            else if (ValueTypeHelper.isOfType(thisObject.value, fcModel.Math)) { return fcModel.MathExecutor.executeInternalMethod(thisObject, functionObject, arguments, callExpression); }
            else if (functionObject.fcInternal.isInternalFunction)
            {
                if(ValueTypeHelper.arrayContains(fcModel.GlobalObject.CONST.INTERNAL_PROPERTIES.METHODS, functionObject.value.name))
                {
                    return fcModel.GlobalObjectExecutor.executeInternalFunction(functionObject, arguments, callExpression, this.globalObject);
                }
                else
                {
                    this.notifyError("");
                }
            }
            else
            {
                this.notifyError("Unsupported internal function!");
            }
        }
        catch(e)
        {
            this.notifyError("Error when executing internal function: " + e);
        }
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
            this._expandGlobalObjectMethods();
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
        catch(e) { this.notifyError("Error when expanding function prototype: " + e); }
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
        catch(e) { this.notifyError("Error when expanding array methods: " + e); }
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
        catch(e) { this.notifyError("Error when expanding regEx methods: " + e); }
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
        catch(e) { this.notifyError("Error when expanding string methods: " + e); }
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
        catch(e) { this.notifyError("Error when expanding math methods: " + e); }
    },

    _expandGlobalObjectMethods: function()
    {
        fcModel.GlobalObject.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            this.expandWithInternalFunction(this.globalObject.origWindow, propertyName);
        }, this);
    },

    _expandDocumentMethods: function()
    {
        try
        {
            fcModel.Document.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
            {
                this.expandWithInternalFunction(this.globalObject.origDocument, propertyName);
            }, this);
        }
        catch(e) { this.notifyError("Error when expanding document methods: " + e); }
    },

    _expandDocument: function()
    {
        try
        {
            if(!Object.hasOwnProperty.call(this.globalObject.origDocument, "jsValue"))
            {
                Object.defineProperty
                (
                    this.globalObject.origDocument,
                    "jsValue",
                    {
                        value: new fcModel.JsValue
                        (
                            this.globalObject.origDocument,
                            this.globalObject.document
                        )
                    }
                );
            }
        }
        catch(e) { this.notifyError("Error when expanding document: " + e); }
    },

    notifyError: function(message) { Firecrow.Interpreter.Simulator.InternalExecutor.notifyError(message);}
}
}});