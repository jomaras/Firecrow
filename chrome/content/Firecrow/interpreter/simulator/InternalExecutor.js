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
        if(this._isNonConstructorObjectCreation(constructorFunction, creationCodeConstruct)) { return this.createNonConstructorObject(creationCodeConstruct); }
        else if(this._isUserConstructorObjectCreation(constructorFunction)) { return this._createObjectFromUserFunction(constructorFunction, creationCodeConstruct, argumentValues); }
        else if (this.isInternalConstructor(constructorFunction)) { return this.executeInternalConstructor(creationCodeConstruct, constructorFunction, argumentValues); }
        else { this.notifyError("Unknown state when creating object"); return null; }
    },

    createInternalPrimitiveObject: function(codeConstruct, value, symbolicValue)
    {
        var result = null;

        if(typeof value == "string") { result = new fcModel.String(value, this.globalObject, codeConstruct, true); }
        else if(typeof value == "number") { result = new fcModel.Number(value, this.globalObject, codeConstruct, true); }
        else if(typeof value == "boolean") { result = new fcModel.Boolean(value, this.globalObject, codeConstruct, true); }
        else if(value == null) { }
        else { this.notifyError("Unknown primitive object: " + value); }

        return new fcModel.fcValue(value, result, codeConstruct, symbolicValue);
    },

    createNonConstructorObject: function(creationCodeConstruct, baseObject)
    {
        baseObject = baseObject || {};

        return new fcModel.fcValue
        (
            baseObject,
            fcModel.Object.createObjectWithInit(this.globalObject, creationCodeConstruct, baseObject, this.globalObject.fcObjectPrototype),
            creationCodeConstruct
        );
    },

    createFunction: function(scopeChain, functionConstruct)
    {
        var newFunction = ASTHelper.isFunctionDeclaration(functionConstruct) ? eval("(function " + functionConstruct.id.name + "(){})")
                                                                             : function(){};

        var fcFunction = new fcModel.Function(this.globalObject, scopeChain, functionConstruct, newFunction);
        var fcValue = new fcModel.fcValue(newFunction, fcFunction,functionConstruct);

        fcFunction.getPropertyValue("prototype").iValue.addProperty("constructor", fcValue, functionConstruct, false);

        return fcValue;
    },

    createInternalFunction: function(functionObject, functionName, parentObject, dontExpandCallApply)
    {
        return new fcModel.fcValue
        (
            functionObject,
            fcModel.Function.createInternalNamedFunction(this.globalObject, functionName, parentObject),
            null
        );
    },

    createArray: function(creationConstruct, existingArray)
    {
        var array = existingArray || [];

        return new fcModel.fcValue(array, new fcModel.Array(array, this.globalObject, creationConstruct), creationConstruct);
    },

    createRegEx: function(creationConstruct, regEx)
    {
        return new fcModel.fcValue(regEx, new fcModel.RegEx(regEx, this.globalObject, creationConstruct), creationConstruct);
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

        return new fcModel.fcValue(jsElement, fcHtmlElement, creationConstruct);
    },

    createTextNode: function(creationConstruct, textContent)
    {
        var jsTextNode = this.globalObject.origDocument.createTextNode(textContent);

        return new fcModel.fcValue(jsTextNode, new fcModel.TextNode(jsTextNode, this.globalObject, creationConstruct), creationConstruct);
    },

    createDocumentFragment: function(creationConstruct, tagName)
    {
        var jsElement = this.globalObject.origDocument.createDocumentFragment();
        jsElement.creationPoint =
        {
            codeConstruct: creationConstruct,
            evaluationPositionId: this.globalObject.getPreciseEvaluationPositionId()
        }

        return new fcModel.fcValue(jsElement, new fcModel.HtmlElement(jsElement, this.globalObject, creationConstruct), creationConstruct);
    },

    createLocationObject: function()
    {
        var fcLocation = fcModel.Object.createObjectWithInit(this.globalObject, null, location);

        this._createProperty(fcLocation, "hash", this.globalObject.origWindow.location.hash);
        this._createProperty(fcLocation, "host", this.globalObject.origWindow.location.host);
        this._createProperty(fcLocation, "hostname", this.globalObject.origWindow.location.hostname);
        this._createProperty(fcLocation, "href", this.globalObject.origWindow.location.href);
        this._createProperty(fcLocation, "pathname", this.globalObject.origWindow.location.pathname);
        this._createProperty(fcLocation, "port", this.globalObject.origWindow.location.port);
        this._createProperty(fcLocation, "protocol", this.globalObject.origWindow.location.protocol);
        this._createProperty(fcLocation, "search", this.globalObject.origWindow.location.search);

        return new fcModel.fcValue(location, fcLocation, null);
    },

    createNavigatorObject: function()
    {
        var fcNavigator = fcModel.Object.createObjectWithInit(this.globalObject, null, navigator);

        this._createProperty(fcNavigator, "appCodeName", this.globalObject.origWindow.navigator.appCodeName);
        this._createProperty(fcNavigator, "appName", this.globalObject.origWindow.navigator.appName);
        this._createProperty(fcNavigator, "appVersion", this.globalObject.origWindow.navigator.appVersion);
        this._createProperty(fcNavigator, "buildID", this.globalObject.origWindow.navigator.buildID);
        this._createProperty(fcNavigator, "cookieEnabled", this.globalObject.origWindow.navigator.cookieEnabled);
        this._createProperty(fcNavigator, "doNotTrack", this.globalObject.origWindow.navigator.doNotTrack);
        this._createProperty(fcNavigator, "language", this.globalObject.origWindow.navigator.language);
        this._createProperty(fcNavigator, "oscpu", this.globalObject.origWindow.navigator.oscpu);
        this._createProperty(fcNavigator, "platform", this.globalObject.origWindow.navigator.platform);
        this._createProperty(fcNavigator, "product", this.globalObject.origWindow.navigator.product);
        this._createProperty(fcNavigator, "productSub", this.globalObject.origWindow.navigator.productSub);
        this._createProperty(fcNavigator, "userAgent", this.globalObject.origWindow.navigator.userAgent);
        this._createProperty(fcNavigator, "taintEnabled", true);//TODO HACK
        this._createProperty(fcNavigator, "plugins", this._createPluginsArray(), this.globalObject.origWindow.navigator.plugins);

        return new fcModel.fcValue(navigator, fcNavigator, navigator);
    },

    _createPluginsArray: function()
    {
        var pluginsArrayObject = fcModel.Object.createObjectWithInit(this.globalObject, null, this.globalObject.origWindow.navigator.plugins);

        for(var propName in navigator.plugins)
        {
            if(navigator.plugins[propName] instanceof Plugin)
            {
                this._createProperty(pluginsArrayObject, propName, this._createPluginInfo(navigator.plugins[propName]));
            }
        }

        this._createProperty(pluginsArrayObject, 'Shockwave Flash', this._createPluginInfo(navigator.plugins['Shockwave Flash']), navigator.plugins['Shockwave Flash']);
        this._createProperty(pluginsArrayObject, "length", navigator.plugins.length);

        return pluginsArrayObject;
    },

    _createPluginInfo: function(plugin)
    {
        var pluginValue = fcModel.Object.createObjectWithInit(this.globalObject, null, plugin);

        this._createProperty(pluginValue, "description", plugin.description);
        this._createProperty(pluginValue, "filename", plugin.filename);
        this._createProperty(pluginValue, "name", plugin.name);
        this._createProperty(pluginValue, "version", plugin.version);

        return pluginValue;
    },

    _createProperty: function(baseObject, propertyName, propertyValue, jsValue)
    {
        if(ValueTypeHelper.isPrimitive(propertyValue))
        {
            baseObject.addProperty(propertyName, this.globalObject.internalExecutor.createInternalPrimitiveObject(null, propertyValue));
        }
        else
        {
            baseObject.addProperty(propertyName, new fcModel.fcValue(jsValue, propertyValue));
        }
    },

    executeFunction: function(thisObject, functionObject, args, callExpression, callCommand)
    {
        try
        {
            if(thisObject == null) { this.notifyError("This object can not be null when executing function!"); return; }

            if (callCommand.isCall || callCommand.isApply) { return this._executeCallApplyFunction(thisObject, functionObject, args, callExpression, callCommand); }
            else if (ValueTypeHelper.isOfType(thisObject.jsValue, Array)) { return fcModel.ArrayExecutor.executeInternalArrayMethod(thisObject, functionObject, args, callExpression, callCommand); }
            else if (thisObject == this.globalObject.fcObjectFunction) { return fcModel.ObjectExecutor.executeInternalObjectFunctionMethod(thisObject, functionObject, args, callExpression, callCommand); }
            else if (ValueTypeHelper.isString(thisObject.jsValue)) { return fcModel.StringExecutor.executeInternalStringMethod(thisObject, functionObject, args, callExpression, callCommand); }
            else if (ValueTypeHelper.isOfType(thisObject.jsValue, RegExp)) { return fcModel.RegExExecutor.executeInternalRegExMethod(thisObject, functionObject, args, callExpression); }
            else if (thisObject == this.globalObject.jsFcDocument){ return fcModel.DocumentExecutor.executeInternalMethod(thisObject, functionObject, args, callExpression);}
            else if (ValueTypeHelper.isOneOfTypes(thisObject.jsValue, [HTMLElement, DocumentFragment])) { return fcModel.HtmlElementExecutor.executeInternalMethod(thisObject, functionObject, args, callExpression); }
            else if (thisObject.iValue.constructor == fcModel.CSSStyleDeclaration) { return fcModel.CSSStyleDeclarationExecutor.executeInternalMethod(thisObject, functionObject, args, callExpression); }
            else if (ValueTypeHelper.isOfType(thisObject.jsValue, Date)) { return fcModel.DateExecutor.executeInternalDateMethod(thisObject, functionObject, args, callExpression); }
            else if (thisObject.jsValue == this.globalObject.dateFunction) { return fcModel.DateExecutor.executeFunctionMethod(thisObject, functionObject, args, callExpression, this.globalObject); }
            else if (thisObject == this.globalObject.fcMath) { return fcModel.MathExecutor.executeInternalMethod(thisObject, functionObject, args, callExpression); }
            else if (thisObject.iValue != null && thisObject.iValue.constructor == fcModel.Event){ return fcModel.EventExecutor.executeInternalMethod(thisObject, functionObject, args, callExpression); }
            else if (thisObject.iValue != null && thisObject.iValue.constructor == fcModel.CanvasContext){ return fcModel.CanvasContextExecutor.executeInternalMethod(thisObject, functionObject, args, callExpression); }
            else if (functionObject.isInternalFunction) { return this._executeInternalFunction(thisObject, functionObject, args, callExpression, callCommand); }
            else
            {
                this.notifyError("Unsupported internal function!");
            }
        }
        catch(e)
        {
            this.notifyError("Error when executing internal function: " + e + " " + e.fileName + " " + e.lineNumber + " " + this.globalObject.browser.url);
        }
    },

    _isNonConstructorObjectCreation: function(constructorFunction, creationCodeConstruct)
    {
        return constructorFunction == null && (ASTHelper.isObjectExpression(creationCodeConstruct) || creationCodeConstruct == null);
    },

    _isUserConstructorObjectCreation: function(constructorFunction)
    {
        return ValueTypeHelper.isOfType(constructorFunction.jsValue, Function) && !constructorFunction.isInternalFunction;
    },

    isInternalConstructor: function(constructorFunction)
    {
        return constructorFunction != null && constructorFunction.isInternalFunction;
    },

    _createObjectFromUserFunction: function(constructorFunction, creationCodeConstruct, argumentValues)
    {
        var newObject = new constructorFunction.jsValue();

        this.dependencyCreator.createDependencyToConstructorPrototype(creationCodeConstruct, constructorFunction);

        return new fcModel.fcValue
        (
            newObject,
            fcModel.Object.createObjectWithInit
            (
                this.globalObject,
                creationCodeConstruct,
                newObject,
                constructorFunction.iValue.getPropertyValue("prototype")
            ),
            creationCodeConstruct
        );
    },

    executeInternalConstructor: function(constructorConstruct, internalConstructor, args)
    {
        if(internalConstructor == null) { this.notifyError("InternalConstructor can not be null!"); return; }

        if(internalConstructor.iValue == this.globalObject.arrayFunction){ return this.createArray(constructorConstruct, Array.apply(null, args)); }

        else if (internalConstructor.iValue == this.globalObject.regExFunction) { return this.createRegEx(constructorConstruct, RegExp.apply(null, args.map(function(item) { return item.jsValue; })));}
        else if (internalConstructor.iValue == this.globalObject.stringFunction) { return new fcModel.fcValue(String.apply(null, args), String.apply(null, args), constructorConstruct); }
        else if (internalConstructor.iValue == this.globalObject.booleanFunction) { return new fcModel.fcValue(Boolean.apply(null, args), Boolean.apply(null, args), constructorConstruct); }
        else if (internalConstructor.iValue == this.globalObject.numberFunction) { return new fcModel.fcValue(Number.apply(null, args), Number.apply(null, args), constructorConstruct); }
        else if (internalConstructor.iValue == this.globalObject.objectFunction) { return fcModel.ObjectExecutor.executeInternalConstructor(constructorConstruct, args, this.globalObject);}
        else if (internalConstructor.iValue == this.globalObject.dateFunction) { return fcModel.DateExecutor.executeInternalConstructor(constructorConstruct, args, this.globalObject); }
        else if (internalConstructor.iValue == this.globalObject.imageFunction
              || internalConstructor.iValue == this.globalObject.xmlHttpRequestFunction) { return this._createEmptyObject(constructorConstruct); }
        else
        {
            this.notifyError("Unhandled internal constructor" + constructorConstruct.loc.start.line);
            return;
        }
    },


    _createEmptyObject: function(constructorConstruct)
    {
        var obj = {};
        return new fcModel.fcValue(obj, fcModel.Object.createObjectWithInit(this.globalObject, constructorConstruct, obj), constructorConstruct);
    },

    _executeCallApplyFunction: function(thisObject, functionObject, args, callExpression, callCommand)
    {
        var ownerObject = functionObject.iValue.ownerObject;

        if(ownerObject == this.globalObject.arrayPrototype) { return fcModel.ArrayExecutor.executeInternalArrayMethod(thisObject, functionObject, args, callExpression, callCommand); }
        else if(ownerObject == this.globalObject.regExPrototype) { return fcModel.RegExExecutor.executeInternalRegExMethod(thisObject, functionObject, args, callExpression); }
        else if (ownerObject == this.globalObject.math) { return fcModel.MathExecutor.executeInternalMethod(thisObject, functionObject, args, callExpression); }
        else if (ownerObject == this.globalObject.objectPrototype) { return fcModel.ObjectExecutor.executeInternalMethod(thisObject, functionObject, args, callExpression, callCommand); }
        else if (ownerObject == this.globalObject.stringPrototype) { return fcModel.StringExecutor.executeInternalStringMethod(thisObject, functionObject, args, callExpression, callCommand); }
        else if (ownerObject.constructor == fcModel.HtmlElement) { return fcModel.HtmlElementExecutor.executeInternalMethod(thisObject, functionObject, args, callExpression); }
        else { this.notifyError("Unhandled call applied internal method: " + codeConstruct.loc.source); }
    },

    _executeInternalFunction: function(thisObject, functionObject, args, callExpression, callCommand)
    {
        if (functionObject.jsValue == this.globalObject.arrayFunction) { return this.createArray(callExpression, Array.apply(null, args)); }
        else if (functionObject.jsValue == this.globalObject.regExFunction) { return this.createRegEx(callExpression, Array.apply(null, args.map(function(item){ return item.jsValue; }))); }
        else if (functionObject.jsValue != null && functionObject.jsValue.name == "hasOwnProperty") { return fcModel.ObjectExecutor.executeInternalMethod(thisObject, functionObject, args, callExpression); }
        else if (fcModel.ArrayExecutor.isInternalArrayMethod(functionObject.jsValue))  { fcModel.ArrayExecutor.executeInternalArrayMethod(thisObject, functionObject, args, callExpression, callCommand); }
        else if (fcModel.GlobalObjectExecutor.executesFunction(this.globalObject, functionObject.jsValue.name)) { return fcModel.GlobalObjectExecutor.executeInternalFunction(functionObject, args, callExpression, this.globalObject); }
        else if (functionObject.jsValue.name == "bind") { return this._executeBindFunction(thisObject, functionObject, args, callExpression); }
        else
        {
            this.notifyError("Unknown internal function!");
        }
    },

    _executeBindFunction: function(thisObject, functionObject, args, callExpression)
    {
        var functionCopy = this.createFunction(thisObject.iValue.scopeChain, thisObject.codeConstruct);

        functionCopy.iValue.bind(args, callExpression);

        return functionCopy;
    },

    notifyError: function(message) { Firecrow.Interpreter.Simulator.InternalExecutor.notifyError(message);}
}
}});