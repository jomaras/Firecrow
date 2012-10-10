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

                var jsValue = new fcModel.JsValue(newObject, new fcModel.FcInternal(creationCodeConstruct, new fcModel.Object(this.globalObject, creationCodeConstruct, newObject)));

                Object.defineProperty(newObject, "jsValue", {value:jsValue});

                return jsValue;
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

                var jsValue = new fcModel.JsValue(newObject, new fcModel.FcInternal(creationCodeConstruct, new fcModel.Object(this.globalObject, creationCodeConstruct, newObject, constructorFunction.value.prototype)));

                Object.defineProperty(newObject, "jsValue", {value:jsValue});

                return jsValue;
            }
            else if (constructorFunction != null && constructorFunction.value.isInternalFunction)
            {
                return this.executeConstructor(creationCodeConstruct, constructorFunction, argumentValues);
            }
            else
            {
                this.notifyError("Unknown state when creating object");
            }
        }
        catch(e)
        {
            this.notifyError("Error when creating object:" + e);
        }
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

    createInternalFunction: function(functionObject, functionName, parentObject, dontExpandCallApply)
    {
        var internalNamedFunction = fcModel.Function.createInternalNamedFunction(this.globalObject, functionName, parentObject);

        if(!dontExpandCallApply && functionObject != null)
        {
            this.expandWithInternalFunction(functionObject, "call");
            this.expandWithInternalFunction(functionObject, "apply");
        }

        return new fcModel.JsValue
        (
            functionObject,
            new fcModel.FcInternal(null, internalNamedFunction)
        );
    },

    expandWithInternalFunction: function(object, functionName, parentObject)
    {
        try
        {
            if(object == null)
            {
                this.notifyError("Argument object can not be null when expanding with internal function: " + this.globalObject.browser.htmlWebFile.url)
            }

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
                            new fcModel.FcInternal(null, fcModel.Function.createInternalNamedFunction(this.globalObject, functionName, parentObject))
                        )
                    }
                );
            }
        }
        catch(e)
        {
            this.notifyError("Error when expanding object with internal function:" + e);
        }
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
            jsElement.modelElement = { type: "DummyCodeElement", domElement: jsElement };
            this.globalObject.browser.callNodeCreatedCallbacks(jsElement.modelElement, "html", true);

            jsElement.creationPoint =
            {
                codeConstruct: creationCodeConstruct,
                evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()
            };

            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                creationCodeConstruct,
                jsElement.modelElement,
                this.globalObject.getPreciseEvaluationPositionId()
            );

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

    createTextNode: function(creationCodeConstruct, textContent)
    {
        try
        {
            var jsTextNode = this.globalObject.origDocument.createTextNode(textContent);

            return new fcModel.JsValue
            (
                jsTextNode,
                new fcModel.FcInternal
                (
                    creationCodeConstruct,
                    new fcModel.TextNode(jsTextNode, this.globalObject, creationCodeConstruct)
                )
            );
        }
        catch(e) { }
    },

    createDocumentFragment: function(creationCodeConstruct, tagName)
    {
        try
        {
            var jsElement = this.globalObject.origDocument.createDocumentFragment();
            jsElement.creationPoint =
            {
                codeConstruct: creationCodeConstruct,
                evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()
            }

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

    createNavigatorObject: function()
    {
        var fcNavigator = new fcModel.Object(this.globalObject, null, navigator);

        fcNavigator.addProperty("appCodeName", new fcModel.JsValue(this.globalObject.origWindow.navigator.appCodeName, new fcModel.FcInternal(null)));
        fcNavigator.addProperty("appName", new fcModel.JsValue(this.globalObject.origWindow.navigator.appName, new fcModel.FcInternal(null)));
        fcNavigator.addProperty("appVersion", new fcModel.JsValue(this.globalObject.origWindow.navigator.appVersion, new fcModel.FcInternal(null)));
        fcNavigator.addProperty("buildID", new fcModel.JsValue(this.globalObject.origWindow.navigator.buildID, new fcModel.FcInternal(null)));
        fcNavigator.addProperty("cookieEnabled", new fcModel.JsValue(this.globalObject.origWindow.navigator.cookieEnabled, new fcModel.FcInternal(null)));
        fcNavigator.addProperty("doNotTrack", new fcModel.JsValue(this.globalObject.origWindow.navigator.doNotTrack, new fcModel.FcInternal(null)));
        fcNavigator.addProperty("language", new fcModel.JsValue(this.globalObject.origWindow.navigator.language, new fcModel.FcInternal(null)));
        fcNavigator.addProperty("oscpu", new fcModel.JsValue(this.globalObject.origWindow.navigator.oscpu, new fcModel.FcInternal(null)));
        fcNavigator.addProperty("platform", new fcModel.JsValue(this.globalObject.origWindow.navigator.platform, new fcModel.FcInternal(null)));
        fcNavigator.addProperty("product", new fcModel.JsValue(this.globalObject.origWindow.navigator.product, new fcModel.FcInternal(null)));
        fcNavigator.addProperty("productSub", new fcModel.JsValue(this.globalObject.origWindow.navigator.productSub, new fcModel.FcInternal(null)));
        fcNavigator.addProperty("userAgent", new fcModel.JsValue(this.globalObject.origWindow.navigator.userAgent, new fcModel.FcInternal(null)));

        return new fcModel.JsValue(navigator, new fcModel.FcInternal(null, fcNavigator));
    },

    executeConstructor: function(constructorConstruct, internalConstructor, arguments)
    {
        try
        {
            var argumentValues = arguments.map(function(item) { return item.value});

            if(internalConstructor == null) { this.notifyError("InternalConstructor can not be null!"); return; }

            if(internalConstructor.value == this.globalObject.arrayFunction)
            {
                return this.createArray(constructorConstruct, Array.apply(null, arguments));
            }
            else if(internalConstructor.value == this.globalObject.imageFunction)
            {
                var obj = {};
                return new fcModel.JsValue(obj, new fcModel.FcInternal(constructorConstruct, new fcModel.Object(this.globalObject, constructorConstruct, obj)));
            }
            else if(internalConstructor.value == this.globalObject.regExFunction)
            {
                return this.createRegEx(constructorConstruct, RegExp.apply(null, arguments.map(function(item) { return item.value; })));
            }
            else if (internalConstructor.value == this.globalObject.stringFunction)
            {
                return new fcModel.JsValue(String.apply(null, arguments), new fcModel.FcInternal(constructorConstruct));
            }
            else if (internalConstructor.value == this.globalObject.booleanFunction)
            {
                return new fcModel.JsValue(Boolean.apply(null, arguments), new fcModel.FcInternal(constructorConstruct));
            }
            else if (internalConstructor.value == this.globalObject.numberFunction)
            {
                return new fcModel.JsValue(Number.apply(null, arguments), new fcModel.FcInternal(constructorConstruct));
            }
            else if (internalConstructor.value == this.globalObject.objectFunction)
            {
                return new fcModel.JsValue(Object.apply(null, arguments), new fcModel.FcInternal(constructorConstruct));
            }
            else if (internalConstructor.value == this.globalObject.dateFunction)
            {
                return fcModel.DateExecutor.executeConstructor(constructorConstruct, arguments, this.globalObject);
            }
            else if (internalConstructor.value == this.globalObject.xmlHttpRequestFunction)
            {
                var obj = {};
                return new fcModel.JsValue(obj, new fcModel.FcInternal(constructorConstruct, new fcModel.Object(this.globalObject, constructorConstruct, obj)));
            }
            else
            {
                this.notifyError("Unknown internal constructor" + constructorConstruct.loc.start.line); return;
            }
        }
        catch(e)
        {
            this.notifyError("Execute error: " + e);
        }
    },

    executeFunction: function(thisObject, functionObject, arguments, callExpression, callCommand)
    {
        try
        {
            if(thisObject == null)
            {
                this.notifyError("This object can not be null when executing function!"); return;
            }

                 if (callCommand.isCall || callCommand.isApply) { return this._executeCallApplyFunction(thisObject, functionObject, arguments, callExpression, callCommand); }
            else if (ValueTypeHelper.isOfType(thisObject.value, Array)) { return fcModel.ArrayExecutor.executeInternalArrayMethod(thisObject, functionObject, arguments, callExpression, callCommand); }
            else if (ValueTypeHelper.isString(thisObject.value)) { return fcModel.StringExecutor.executeInternalStringMethod(thisObject, functionObject, arguments, callExpression, callCommand); }
            else if (ValueTypeHelper.isOfType(thisObject.value, RegExp)) { return fcModel.RegExExecutor.executeInternalRegExMethod(thisObject, functionObject, arguments, callExpression); }
            else if (ValueTypeHelper.isOfType(thisObject.value, Document)){ return fcModel.DocumentExecutor.executeInternalMethod(thisObject, functionObject, arguments, callExpression);}
            else if (ValueTypeHelper.isOneOfTypes(thisObject.value, [HTMLElement, DocumentFragment])) { return fcModel.HtmlElementExecutor.executeInternalMethod(thisObject, functionObject, arguments, callExpression); }
            else if (ValueTypeHelper.isOfType(thisObject.value, CSSStyleDeclaration)) { return fcModel.CSSStyleDeclarationExecutor.executeInternalMethod(thisObject, functionObject, arguments, callExpression); }
            else if (ValueTypeHelper.isOfType(thisObject.value, Date)) { return fcModel.DateExecutor.executeInternalDateMethod(thisObject, functionObject, arguments, callExpression); }
            else if (thisObject.value == this.globalObject.dateFunction) { return fcModel.DateExecutor.executeFunctionMethod(thisObject, functionObject, arguments, callExpression, this.globalObject); }
            else if (thisObject.value == this.globalObject.fcMath) { return fcModel.MathExecutor.executeInternalMethod(thisObject, functionObject, arguments, callExpression); }
            else if (thisObject.fcInternal != null && thisObject.fcInternal.object != null && thisObject.fcInternal.object.constructor == fcModel.Event){ return fcModel.EventExecutor.executeInternalMethod(thisObject, functionObject, arguments, callExpression); }
            else if (functionObject.fcInternal.isInternalFunction) { return this._executeInternalFunction(thisObject, functionObject, arguments, callExpression, callCommand); }
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

    _executeCallApplyFunction: function(thisObject, functionObject, arguments, callExpression, callCommand)
    {
        try
        {
            if(functionObject.fcInternal.object.ownerObject == this.globalObject.arrayPrototype)
            {
                return fcModel.ArrayExecutor.executeInternalArrayMethod(thisObject, functionObject, arguments, callExpression, callCommand);
            }
            else if(functionObject.fcInternal.object.ownerObject == this.globalObject.regExPrototype)
            {
                return fcModel.RegExExecutor.executeInternalRegExMethod(thisObject, functionObject, arguments, callExpression);
            }
            else if (functionObject.fcInternal.object.ownerObject == this.globalObject.fcMath)
            {
                return fcModel.MathExecutor.executeInternalMethod(thisObject, functionObject, arguments, callExpression);
            }
            else if (functionObject.fcInternal.object.ownerObject == this.globalObject.objectPrototype)
            {
                return fcModel.ObjectExecutor.executeInternalMethod(thisObject, functionObject, arguments, callExpression);
            }
            else if (functionObject.fcInternal.object.ownerObject == this.globalObject.stringPrototype)
            {
                return fcModel.StringExecutor.executeInternalStringMethod(thisObject, functionObject, arguments, callExpression, callCommand);
            }
            else if (functionObject.fcInternal.object.ownerObject.constructor == fcModel.HtmlElement)
            {
                return fcModel.HtmlElementExecutor.executeInternalMethod(thisObject, functionObject, arguments, callExpression);
            }
            else
            {
                this.notifyError("Unhandled call applied internal method: " + codeConstruct.loc.source);
            }
        }
        catch(e)
        {
            this.notifyError("Error when executing call apply internal function: " + e);
        }
    },

    _executeInternalFunction: function(thisObject, functionObject, arguments, callExpression, callCommand)
    {
        try
        {
                 if (functionObject.value == this.globalObject.arrayFunction) { return this.createArray(callExpression, Array.apply(null, arguments)); }
            else if (functionObject.value == this.globalObject.regExFunction) { return this.createRegEx(callExpression, Array.apply(null, arguments.map(function(item){ return item.value; }))); }
            else if (functionObject.value != null && functionObject.value.name == "hasOwnProperty") { return fcModel.ObjectExecutor.executeInternalMethod(thisObject, functionObject, arguments, callExpression); }
            else if (fcModel.ArrayExecutor.isInternalArrayMethod(functionObject.value))  { fcModel.ArrayExecutor.executeInternalArrayMethod(thisObject, functionObject, arguments, callExpression, callCommand); }
            else if (fcModel.GlobalObjectExecutor.executesFunction(this.globalObject, functionObject.value.name)) { return fcModel.GlobalObjectExecutor.executeInternalFunction(functionObject, arguments, callExpression, this.globalObject); }
            else
            {
                this.notifyError("Unknown internal function!");
            }
        }
        catch(e) { this.notifyError("Error when executing internal function: " + e); }
    },

    expandInternalFunctions: function()
    {
        try
        {
            this._expandArrayMethods();
            this._expandDateMethods();
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

    removeInternalFunctions: function()
    {
        this._removeArrayMethods();
        this._removeDateMethods();
        this._removeFunctionPrototype();
        this._removeObjectPrototype();
        this._removeRegExMethods();
        this._removeStringMethods();
        this._removeDocumentMethods();
        this._removeDocument();
        this._removeMathMethods();
        this._removeGlobalObjectMethods();
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

    _removeFunctionPrototype: function()
    {
        try
        {
            var functionPrototype = Function.prototype;

            functionPrototype.jsValue = null;

            fcModel.FunctionPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
            {
                functionPrototype[propertyName].jsValue = null;
            }, this);
        }
        catch(e) { this.notifyError("Error when removing function prototype: " + e); }
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

            ["toString", "hasOwnProperty"].forEach(function(propertyName)
            {
                this.expandWithInternalFunction(objectPrototype, propertyName);
            }, this);
        }
        catch(e) { this.notifyError("Error when expanding Object prototype"); }
    },

    _removeObjectPrototype: function()
    {
        try
        {
            var objectPrototype = Object.prototype;

            objectPrototype.jsValue = null;

            ["toString", "hasOwnProperty"].forEach(function(propertyName)
            {
                objectPrototype[propertyName].jsValue = null;
            }, this);
        }
        catch(e) { this.notifyError("Error when removing Object prototype"); }
    },

    _expandArrayMethods: function()
    {
        try
        {
            var arrayPrototype = Array.prototype;

            fcModel.ArrayPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
            {
                this.expandWithInternalFunction(arrayPrototype, propertyName, this.globalObject.arrayPrototype);
            }, this);

            fcModel.ArrayPrototype.CONST.INTERNAL_PROPERTIES.CALLBACK_METHODS.forEach(function(propertyName)
            {
                arrayPrototype[propertyName].jsValue.fcInternal.isCallbackMethod = true;
            });
        }
        catch(e) { this.notifyError("Error when expanding array methods: " + e); }
    },

    _removeArrayMethods: function()
    {
        try
        {
            var arrayPrototype = Array.prototype;

            fcModel.ArrayPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
            {
                arrayPrototype[propertyName].jsValue = null;
            }, this);
        }
        catch(e) { this.notifyError("Error when removing array methods: " + e); }
    },

    _expandDateMethods: function()
    {
        try
        {
            var datePrototype = Date.prototype;

            fcModel.DatePrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
            {
                this.expandWithInternalFunction(datePrototype, propertyName);
            }, this);
        }
        catch(e) { this.notifyError("Error when expanding date methods: " + e); }
    },

    _removeDateMethods: function()
    {
        try
        {
            var datePrototype = Date.prototype;

            fcModel.DatePrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
            {
                if(datePrototype[propertyName] != null)
                {
                    datePrototype[propertyName].jsValue = null;
                }
            }, this);
        }
        catch(e) { this.notifyError("Error when removing date methods: " + e); }
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

    _removeRegExMethods: function()
    {
        try
        {
            var regExPrototype = RegExp.prototype;

            fcModel.RegExPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
            {
                if(regExPrototype[propertyName] != null)
                {
                    regExPrototype[propertyName].jsValue = null;
                }
            }, this);
        }
        catch(e) { this.notifyError("Error when removing regEx methods: " + e); }
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

    _removeStringMethods: function()
    {
        try
        {
            var stringPrototype = String.prototype;

            fcModel.StringPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
            {
                stringPrototype[propertyName].jsValue = null;
            }, this);
        }
        catch(e) { this.notifyError("Error when removing string methods: " + e); }
    },

    _expandMathMethods: function()
    {
        try
        {
            fcModel.Math.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
            {
                this.expandWithInternalFunction(Math, propertyName);
                Math[propertyName].jsValue.fcInternal.ownerObject = Math;
            }, this);
        }
        catch(e) { this.notifyError("Error when expanding math methods: " + e); }
    },

    _removeMathMethods: function()
    {
        try
        {
            fcModel.Math.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
            {
                Math[propertyName].jsValue = null;
            }, this);
        }
        catch(e) { this.notifyError("Error when removing math methods: " + e); }
    },

    _expandGlobalObjectMethods: function()
    {
        fcModel.GlobalObject.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            this.expandWithInternalFunction(this.globalObject.origWindow, propertyName);
        }, this);
    },

    _removeGlobalObjectMethods: function()
    {
        fcModel.GlobalObject.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            this.globalObject.origWindow[propertyName].jsValue = null;
        }, this);
    },

    _expandDocumentMethods: function()
    {
        try
        {
            fcModel.DOM_PROPERTIES.DOCUMENT.METHODS.forEach(function(propertyName)
            {
                this.expandWithInternalFunction(this.globalObject.origDocument, propertyName);
            }, this);
        }
        catch(e) { this.notifyError("Error when expanding document methods: " + e); }
    },

    _removeDocumentMethods: function()
    {
        try
        {
            fcModel.DOM_PROPERTIES.DOCUMENT.METHODS.forEach(function(propertyName)
            {
                if(this.globalObject.origDocument[propertyName] != null)
                {
                    this.globalObject.origDocument[propertyName].jsValue = null;
                }
            }, this);
        }
        catch(e) { this.notifyError("Error when removing document methods: " + e); }
    },

    _expandDocument: function()
    {
        try
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
                    ),
                    writable:true
                }
            );
        }
        catch(e) { this.notifyError("Error when expanding document: " + e); }
    },

    _removeDocument: function()
    {
        try
        {
            this.globalObject.origDocument.jsValue = null;
        }
        catch(e) { this.notifyError("Error when removing document: " + e); }
    },

    notifyError: function(message) { Firecrow.Interpreter.Simulator.InternalExecutor.notifyError(message);}
}
}});