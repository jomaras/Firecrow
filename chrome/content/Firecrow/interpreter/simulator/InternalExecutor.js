FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var fcModel = Firecrow.Interpreter.Model;
var fcSimulator = Firecrow.Interpreter.Simulator;
var ASTHelper = Firecrow.ASTHelper;

fcSimulator.InternalExecutor = function(globalObject)
{
    this.globalObject = globalObject;
    this.dependencyCreator = new fcSimulator.DependencyCreator(this.globalObject);
};

fcSimulator.InternalExecutor.notifyError = function(message) { alert("InternalExecutor - " + message);}

fcSimulator.InternalExecutor.prototype =
{
    createObject: function(constructorFunction, creationCodeConstruct, argumentValues)
    {
        if(this._isNonConstructorObjectCreation(constructorFunction, creationCodeConstruct)) { return this._createNonConstructorObject(creationCodeConstruct); }
        else if(this._isUserConstructorObjectCreation(constructorFunction)) { return this._createObjectFromUserFunction(constructorFunction, creationCodeConstruct, argumentValues); }
        else if (this._isInternalConstructorCreation(constructorFunction)) { return this._executeInternalConstructor(creationCodeConstruct, constructorFunction, argumentValues); }
        else { this.notifyError("Unknown state when creating object"); return null; }
    },

    createFunction: function(scopeChain, functionConstruct)
    {
        var newFunction = ASTHelper.isFunctionDeclaration(functionConstruct) ? eval("(function " + functionConstruct.id.name + "(){})")
                                                                             : function(){};

        Object.defineProperty
        (
            newFunction.prototype,
            "jsValue",
            {
                value: new fcModel.JsValue
                (
                    newFunction.prototype,
                    new fcModel.FcInternal(null,  fcModel.Object.createObjectWithInit(this.globalObject, functionConstruct))
                )
            }
        );

        return new fcModel.JsValue
        (
            newFunction,
            new fcModel.FcInternal
            (
                functionConstruct,
                new fcModel.Function(this.globalObject, scopeChain, functionConstruct, newFunction)
            )
        );
    },

    createInternalFunction: function(functionObject, functionName, parentObject, dontExpandCallApply)
    {
        var internalNamedFunction = fcModel.Function.createInternalNamedFunction(this.globalObject, functionName, parentObject);

        if(!dontExpandCallApply && functionObject != null)
        {
            this.expandWithInternalFunction(functionObject, "call");
            this.expandWithInternalFunction(functionObject, "apply");
        }

        return new fcModel.JsValue(functionObject, new fcModel.FcInternal(null, internalNamedFunction));
    },

    createArray: function(creationConstruct, existingArray)
    {
        var array = existingArray || [];

        return new fcModel.JsValue(array, new fcModel.FcInternal(creationConstruct, new fcModel.Array(array, this.globalObject, creationConstruct)));
    },

    createRegEx: function(creationConstruct, regEx)
    {
        return new fcModel.JsValue(regEx, new fcModel.FcInternal(creationConstruct, new fcModel.RegEx(regEx, this.globalObject, creationConstruct)));
    },

    createHtmlElement: function(creationConstruct, tagName)
    {
        var jsElement = this.globalObject.origDocument.createElement(tagName);
        jsElement.modelElement = { type: "DummyCodeElement", domElement: jsElement };
        this.globalObject.browser.callNodeCreatedCallbacks(jsElement.modelElement, "html", true);

        jsElement.creationPoint =
        {
            codeConstruct: creationConstruct,
            evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()
        };

        var fcHtmlElement = new fcModel.HtmlElement(jsElement, this.globalObject, creationConstruct);

        if(jsElement instanceof HTMLImageElement)
        {
            fcHtmlElement.addProperty("__proto__", this.globalObject.htmlImageElementPrototype);
            fcHtmlElement.proto = this.globalObject.htmlImageElementPrototype;
        }

        this.globalObject.browser.callDataDependencyEstablishedCallbacks(creationConstruct, jsElement.modelElement, this.globalObject.getPreciseEvaluationPositionId());

        return new fcModel.JsValue(jsElement, new fcModel.FcInternal(creationConstruct, fcHtmlElement));
    },

    createTextNode: function(creationConstruct, textContent)
    {
        var jsTextNode = this.globalObject.origDocument.createTextNode(textContent);

        return new fcModel.JsValue(jsTextNode, new fcModel.FcInternal(creationConstruct, new fcModel.TextNode(jsTextNode, this.globalObject, creationConstruct)));
    },

    createDocumentFragment: function(creationConstruct, tagName)
    {
        var jsElement = this.globalObject.origDocument.createDocumentFragment();
        jsElement.creationPoint =
        {
            codeConstruct: creationConstruct,
            evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()
        }

        return new fcModel.JsValue(jsElement, new fcModel.FcInternal(creationConstruct, new fcModel.HtmlElement(jsElement, this.globalObject, creationConstruct)));
    },

    createLocationObject: function()
    {
        var fcLocation = fcModel.Object.createObjectWithInit(this.globalObject, null, location);

        fcLocation.addProperty("hash", new fcModel.JsValue(this.globalObject.origWindow.location.hash, new fcModel.FcInternal(null)));
        fcLocation.addProperty("host", new fcModel.JsValue(this.globalObject.origWindow.location.host, new fcModel.FcInternal(null)));
        fcLocation.addProperty("hostname", new fcModel.JsValue(this.globalObject.origWindow.location.hostname, new fcModel.FcInternal(null)));
        fcLocation.addProperty("href", new fcModel.JsValue(this.globalObject.origWindow.location.href, new fcModel.FcInternal(null)));
        fcLocation.addProperty("pathname", new fcModel.JsValue(this.globalObject.origWindow.location.pathname, new fcModel.FcInternal(null)));
        fcLocation.addProperty("port", new fcModel.JsValue(this.globalObject.origWindow.location.port, new fcModel.FcInternal(null)));
        fcLocation.addProperty("protocol", new fcModel.JsValue(this.globalObject.origWindow.location.protocol, new fcModel.FcInternal(null)));
        fcLocation.addProperty("search", new fcModel.JsValue(this.globalObject.origWindow.location.search, new fcModel.FcInternal(null)));

        return new fcModel.JsValue(location, new fcModel.FcInternal(null, fcLocation));
    },

    createNavigatorObject: function()
    {
        var fcNavigator = fcModel.Object.createObjectWithInit(this.globalObject, null, navigator);

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

    executeFunction: function(thisObject, functionObject, args, callExpression, callCommand)
    {
        try
        {
            if(thisObject == null) { this.notifyError("This object can not be null when executing function!"); return; }

            if (callCommand.isCall || callCommand.isApply) { return this._executeCallApplyFunction(thisObject, functionObject, args, callExpression, callCommand); }
            else if (ValueTypeHelper.isOfType(thisObject.value, Array)) { return fcModel.ArrayExecutor.executeInternalArrayMethod(thisObject, functionObject, args, callExpression, callCommand); }
            else if (ValueTypeHelper.isString(thisObject.value)) { return fcModel.StringExecutor.executeInternalStringMethod(thisObject, functionObject, args, callExpression, callCommand); }
            else if (ValueTypeHelper.isOfType(thisObject.value, RegExp)) { return fcModel.RegExExecutor.executeInternalRegExMethod(thisObject, functionObject, args, callExpression); }
            else if (ValueTypeHelper.isOfType(thisObject.value, Document)){ return fcModel.DocumentExecutor.executeInternalMethod(thisObject, functionObject, args, callExpression);}
            else if (ValueTypeHelper.isOneOfTypes(thisObject.value, [HTMLElement, DocumentFragment])) { return fcModel.HtmlElementExecutor.executeInternalMethod(thisObject, functionObject, args, callExpression); }
            else if (ValueTypeHelper.isOfType(thisObject.value, CSSStyleDeclaration)) { return fcModel.CSSStyleDeclarationExecutor.executeInternalMethod(thisObject, functionObject, args, callExpression); }
            else if (ValueTypeHelper.isOfType(thisObject.value, Date)) { return fcModel.DateExecutor.executeInternalDateMethod(thisObject, functionObject, args, callExpression); }
            else if (thisObject.value == this.globalObject.dateFunction) { return fcModel.DateExecutor.executeFunctionMethod(thisObject, functionObject, args, callExpression, this.globalObject); }
            else if (thisObject.value == this.globalObject.fcMath) { return fcModel.MathExecutor.executeInternalMethod(thisObject, functionObject, args, callExpression); }
            else if (thisObject.fcInternal != null && thisObject.fcInternal.object != null && thisObject.fcInternal.object.constructor == fcModel.Event){ return fcModel.EventExecutor.executeInternalMethod(thisObject, functionObject, args, callExpression); }
            else if (functionObject.fcInternal.isInternalFunction) { return this._executeInternalFunction(thisObject, functionObject, args, callExpression, callCommand); }
            else
            {
                this.notifyError("Unsupported internal function!");
            }
        }
        catch(e)
        {
            this.notifyError("Error when executing internal function: " + e + this.globalObject.browser.url);
        }
    },

    expandWithInternalFunction: function(object, functionName, parentObject)
    {
        try
        {
            if(object == null) { this.notifyError("Argument object can not be null when expanding with internal function: " + this.globalObject.browser.htmlWebFile.url); }

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
        catch(e) { this.notifyError("Error when expanding object with internal function:" + e); }
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
                            fcModel.Object.createObjectWithInit(this.globalObject)
                        )
                    }
                );
            }
        }
        catch(e) { this.notifyError("Error when expanding basic object:" + e); }
    },

    _isNonConstructorObjectCreation: function(constructorFunction, creationCodeConstruct)
    {
        return constructorFunction == null && (ASTHelper.isObjectExpression(creationCodeConstruct) || creationCodeConstruct == null);
    },

    _isUserConstructorObjectCreation: function(constructorFunction)
    {
        return ValueTypeHelper.isOfType(constructorFunction.value, Function);
    },

    _isInternalConstructorCreation: function(constructorFunction)
    {
        return constructorFunction != null && constructorFunction.value.isInternalFunction
    },

    _createNonConstructorObject: function(creationCodeConstruct)
    {
        var newObject = {};

        var jsValue = new fcModel.JsValue
        (
            newObject,
            new fcModel.FcInternal
            (
                creationCodeConstruct,
                fcModel.Object.createObjectWithInit(this.globalObject, creationCodeConstruct, newObject)
            )
        );

        Object.defineProperty(newObject, "jsValue", {value:jsValue});

        return jsValue;
    },

    _createObjectFromUserFunction: function(constructorFunction, creationCodeConstruct, argumentValues)
    {
        var oldPrototype = constructorFunction.value.prototype;

        if(oldPrototype != null && oldPrototype.value != null)
        {
            constructorFunction.value.prototype = oldPrototype.value;
        }

        var newObject = new constructorFunction.value();

        if(oldPrototype != null && oldPrototype.value != null)
        {
            constructorFunction.value.prototype = oldPrototype;
        }

        this.dependencyCreator.createDependencyToConstructorPrototype(creationCodeConstruct, constructorFunction);

        var jsValue = new fcModel.JsValue
        (
            newObject,
            new fcModel.FcInternal
            (
                creationCodeConstruct,
                fcModel.Object.createObjectWithInit(this.globalObject, creationCodeConstruct, newObject, constructorFunction.value.prototype)
            )
        );

        Object.defineProperty(newObject, "jsValue", {value:jsValue});

        return jsValue;
    },

    _executeInternalConstructor: function(constructorConstruct, internalConstructor, arguments)
    {
        if(internalConstructor == null) { this.notifyError("InternalConstructor can not be null!"); return; }

        if(internalConstructor.value == this.globalObject.arrayFunction){ return this.createArray(constructorConstruct, Array.apply(null, arguments)); }

        else if (internalConstructor.value == this.globalObject.regExFunction) { return this.createRegEx(constructorConstruct, RegExp.apply(null, arguments.map(function(item) { return item.value; })));}
        else if (internalConstructor.value == this.globalObject.stringFunction) { return new fcModel.JsValue(String.apply(null, arguments), new fcModel.FcInternal(constructorConstruct)); }
        else if (internalConstructor.value == this.globalObject.booleanFunction) { return new fcModel.JsValue(Boolean.apply(null, arguments), new fcModel.FcInternal(constructorConstruct)); }
        else if (internalConstructor.value == this.globalObject.numberFunction) { return new fcModel.JsValue(Number.apply(null, arguments), new fcModel.FcInternal(constructorConstruct)); }
        else if (internalConstructor.value == this.globalObject.objectFunction) { return new fcModel.JsValue(Object.apply(null, arguments), new fcModel.FcInternal(constructorConstruct)); }
        else if (internalConstructor.value == this.globalObject.dateFunction) { return fcModel.DateExecutor._executeInternalConstructor(constructorConstruct, arguments, this.globalObject); }
        else if (internalConstructor.value == this.globalObject.imageFunction
              || internalConstructor.value == this.globalObject.xmlHttpRequestFunction) { return this._createEmptyObject(constructorConstruct); }
        else { this.notifyError("Unhandled internal constructor" + constructorConstruct.loc.start.line); return; }
    },


    _createEmptyObject: function(constructorConstruct)
    {
        var obj = {};
        return new fcModel.JsValue(obj, new fcModel.FcInternal(constructorConstruct, fcModel.Object.createObjectWithInit(this.globalObject, constructorConstruct, obj)));
    },

    _executeCallApplyFunction: function(thisObject, functionObject, arguments, callExpression, callCommand)
    {
        var ownerObject = functionObject.fcInternal.object.ownerObject;

        if(ownerObject == this.globalObject.arrayPrototype) { return fcModel.ArrayExecutor.executeInternalArrayMethod(thisObject, functionObject, arguments, callExpression, callCommand); }
        else if(ownerObject == this.globalObject.regExPrototype) { return fcModel.RegExExecutor.executeInternalRegExMethod(thisObject, functionObject, arguments, callExpression); }
        else if (ownerObject == this.globalObject.fcMath) { return fcModel.MathExecutor.executeInternalMethod(thisObject, functionObject, arguments, callExpression); }
        else if (ownerObject == this.globalObject.objectPrototype) { return fcModel.ObjectExecutor.executeInternalMethod(thisObject, functionObject, arguments, callExpression); }
        else if (ownerObject == this.globalObject.stringPrototype) { return fcModel.StringExecutor.executeInternalStringMethod(thisObject, functionObject, arguments, callExpression, callCommand); }
        else if (ownerObject.constructor == fcModel.HtmlElement) { return fcModel.HtmlElementExecutor.executeInternalMethod(thisObject, functionObject, arguments, callExpression); }
        else { this.notifyError("Unhandled call applied internal method: " + codeConstruct.loc.source); }
    },

    _executeInternalFunction: function(thisObject, functionObject, arguments, callExpression, callCommand)
    {
        if (functionObject.value == this.globalObject.arrayFunction) { return this.createArray(callExpression, Array.apply(null, arguments)); }
        else if (functionObject.value == this.globalObject.regExFunction) { return this.createRegEx(callExpression, Array.apply(null, arguments.map(function(item){ return item.value; }))); }
        else if (functionObject.value != null && functionObject.value.name == "hasOwnProperty") { return fcModel.ObjectExecutor.executeInternalMethod(thisObject, functionObject, arguments, callExpression); }
        else if (fcModel.ArrayExecutor.isInternalArrayMethod(functionObject.value))  { fcModel.ArrayExecutor.executeInternalArrayMethod(thisObject, functionObject, arguments, callExpression, callCommand); }
        else if (fcModel.GlobalObjectExecutor.executesFunction(this.globalObject, functionObject.value.name)) { return fcModel.GlobalObjectExecutor.executeInternalFunction(functionObject, arguments, callExpression, this.globalObject); }
        else { this.notifyError("Unknown internal function!"); }
    },

    _expandFunctionPrototype: function()
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
    },

    _removeFunctionPrototype: function()
    {
        var functionPrototype = Function.prototype;

        functionPrototype.jsValue = null;

        fcModel.FunctionPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            functionPrototype[propertyName].jsValue = null;
        }, this);
    },

    _expandObjectPrototype: function()
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
    },

    _removeObjectPrototype: function()
    {
        var objectPrototype = Object.prototype;

        objectPrototype.jsValue = null;

        ["toString", "hasOwnProperty"].forEach(function(propertyName)
        {
            objectPrototype[propertyName].jsValue = null;
        }, this);
    },

    _expandArrayMethods: function()
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
    },

    _removeArrayMethods: function()
    {
        var arrayPrototype = Array.prototype;

        fcModel.ArrayPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            arrayPrototype[propertyName].jsValue = null;
        }, this);
    },

    _expandDateMethods: function()
    {
        var datePrototype = Date.prototype;

        fcModel.DatePrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            this.expandWithInternalFunction(datePrototype, propertyName);
        }, this);
    },

    _removeDateMethods: function()
    {
        var datePrototype = Date.prototype;

        fcModel.DatePrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            if(datePrototype[propertyName] != null)
            {
                datePrototype[propertyName].jsValue = null;
            }
        }, this);
    },

    _expandRegExMethods: function()
    {
        var regExPrototype = RegExp.prototype;

        fcModel.RegExPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            this.expandWithInternalFunction(regExPrototype, propertyName);
        }, this);
    },

    _removeRegExMethods: function()
    {
        var regExPrototype = RegExp.prototype;

        fcModel.RegExPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            if(regExPrototype[propertyName] != null)
            {
                regExPrototype[propertyName].jsValue = null;
            }
        }, this);
    },

    _expandStringMethods: function()
    {
        var stringPrototype = String.prototype;

        fcModel.StringPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            this.expandWithInternalFunction(stringPrototype, propertyName);
        }, this);
    },

    _removeStringMethods: function()
    {
        var stringPrototype = String.prototype;

        fcModel.StringPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            stringPrototype[propertyName].jsValue = null;
        }, this);
    },

    _expandMathMethods: function()
    {
        fcModel.Math.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            this.expandWithInternalFunction(Math, propertyName);
            Math[propertyName].jsValue.fcInternal.ownerObject = Math;
        }, this);
    },

    _removeMathMethods: function()
    {
        fcModel.Math.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            Math[propertyName].jsValue = null;
        }, this);
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
        fcModel.DOM_PROPERTIES.DOCUMENT.METHODS.forEach(function(propertyName)
        {
            this.expandWithInternalFunction(this.globalObject.origDocument, propertyName);
        }, this);
    },

    _removeDocumentMethods: function()
    {
        fcModel.DOM_PROPERTIES.DOCUMENT.METHODS.forEach(function(propertyName)
        {
            if(this.globalObject.origDocument[propertyName] != null)
            {
                this.globalObject.origDocument[propertyName].jsValue = null;
            }
        }, this);
    },

    _expandDocument: function()
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
    },

    _removeDocument: function()
    {
        this.globalObject.origDocument.jsValue = null;
    },

    notifyError: function(message) { Firecrow.Interpreter.Simulator.InternalExecutor.notifyError(message);}
}
}});