/**
 * User: Jomaras
 * Date: 10.05.12.
 * Time: 09:56
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;

fcModel.Array = function(jsArray, globalObject, codeConstruct)
{
    try
    {
        /**************************************************************************************************************/
        for(var prop in fcModel.ArrayProto)
        {
            this[prop] = fcModel.ArrayProto[prop];
        }
        /*******************************************************************************/
        this.__proto__ = new fcModel.Object(this.globalObject);
        this.jsArray = jsArray || [];
        this.globalObject = globalObject;
        this.items = [];
        this.modifications = [];
        this.constructor = fcModel.Array;

        if(codeConstruct != null) { this.modifications.push({codeConstruct: codeConstruct, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()});}

        for(var i = 0; i < this.jsArray.length; i++)
        {
            this.push(jsArray, this.jsArray[i], codeConstruct, false);
        }

        //For RegEx result arrays
        if(this.jsArray.hasOwnProperty("index")) { this.addProperty("index", new fcModel.JsValue(this.jsArray.index, new fcModel.FcInternal(codeConstruct)), codeConstruct); }
        if(this.jsArray.hasOwnProperty("input")) { this.addProperty("input", new fcModel.JsValue(this.jsArray.input, new fcModel.FcInternal(codeConstruct)), codeConstruct); }

        this.addProperty("__proto__", globalObject.arrayPrototype);

        this.registerGetPropertyCallback(function(getPropertyConstruct)
        {
           this.addDependenciesToAllProperties(getPropertyConstruct);
        }, this);
    }
    catch(e) { this.notifyError("Error when creating array object: " + e + codeConstruct.loc.source); }
};

Firecrow.Interpreter.Model.Array.notifyError = function(message)
{
    alert("Array - " + message);
}

fcModel.ArrayProto =
{
    addDependenciesToAllProperties: function(codeConstruct)
    {
        try
        {
            if(codeConstruct == null) { return; }

            var properties = this.properties;
            var lengthProperty = this.getProperty("length");
            var length = lengthProperty != null && lengthProperty.value != null ? lengthProperty.value.value : 0;
            var isCalledOnArray = this.constructor === fcModel.Array;

            for(var i = 0; i < length; i++)
            {
                var property = properties[i];

                if(property == undefined || property.lastModificationConstruct == null) { continue; }

                this.globalObject.browser.callDataDependencyEstablishedCallbacks
                (
                    codeConstruct,
                    property.lastModificationConstruct.codeConstruct,
                    this.globalObject.getPreciseEvaluationPositionId(),
                    property.lastModificationConstruct.evaluationPositionId
                );
            }

            if(!isCalledOnArray && lengthProperty != null && lengthProperty.lastModificationConstruct != null)
            {
                this.globalObject.browser.callDataDependencyEstablishedCallbacks
                (
                    codeConstruct,
                    lengthProperty.lastModificationConstruct.codeConstruct,
                    this.globalObject.getPreciseEvaluationPositionId(),
                    lengthProperty.lastModificationConstruct.evaluationPositionId
                );
            }
        }
        catch(e)
        {
            this.notifyError("Error when adding dependencies to all properties: " + e + " " + codeConstruct.loc.source);
        }
    },

    push: function(jsArray, arguments, codeConstruct, dontFillJsArray)
    {
        try
        {
            fcModel.ArrayProto.addDependenciesToAllProperties.call(this, codeConstruct);
            var isCalledOnArray = this.constructor === fcModel.Array;

            var lengthProperty = this.getPropertyValue("length");
            var length = lengthProperty != null ? lengthProperty.value : 0;

            arguments = ValueTypeHelper.isArray(arguments) ? arguments : [arguments];

            for(var i = 0, argsLength = arguments.length; i < argsLength; i++)
            {
                var argument = arguments[i];

                if(isCalledOnArray)
                {
                    this.items.push(argument);
                    if(dontFillJsArray !== false) { jsArray.push(argument); }
                }
                else
                {
                    jsArray[length] = argument;
                }

                this.addProperty(length++, argument, codeConstruct);
            }

            var lengthValue = new fcModel.JsValue(length, new fcModel.FcInternal(codeConstruct));
            this.addProperty("length", lengthValue, codeConstruct, false);

            if(!isCalledOnArray)
            {
                jsArray.length = lengthValue;
            }

            return lengthValue;
        }
        catch(e)
        {
            this.notifyError("Error when pushing item: " + e);
        }
    },

    pop: function(jsArray, arguments, codeConstruct)
    {
        try
        {
            fcModel.ArrayProto.addDependenciesToAllProperties.call(this, codeConstruct);
            var isCalledOnArray = this.constructor === fcModel.Array;

            var lengthProperty = this.getPropertyValue("length");
            var length = lengthProperty != null ? lengthProperty.value : 0;

            var poppedItem = null;

            if(isCalledOnArray)
            {
                poppedItem = this.items.pop();
                jsArray.pop();
            }
            else
            {
                poppedItem = this.getPropertyValue(length - 1);
            }

            this.deleteProperty(length - 1, codeConstruct);

            this.addProperty("length", new fcModel.JsValue(length - 1, new fcModel.FcInternal(codeConstruct)),codeConstruct, false);

            return poppedItem;
        }
        catch(e) { this.notifyError("Error when popping item: " + e); }
    },

    reverse: function(jsArray, arguments, codeConstruct, jsValue)
    {
        try
        {
            fcModel.ArrayProto.addDependenciesToAllProperties.call(this, codeConstruct);
            var isCalledOnArray = this.constructor === fcModel.Array;

            var lengthProperty = this.getPropertyValue("length");
            var length = lengthProperty != null ? lengthProperty.value : 0;

            if(isCalledOnArray)
            {
                this.items.reverse();
                jsArray.reverse();

                for(var i = 0; i < length; i++)
                {
                    this.addProperty(i, this.items[i], codeConstruct);
                }
            }
            else { alert("Not handling reverse on non arrays!"); }

            return jsValue;
        }
        catch(e) { this.notifyError("Error when reversing the array: " + e); }
    },

    shift: function(jsArray, arguments, codeConstruct)
    {
        try
        {
            fcModel.ArrayProto.addDependenciesToAllProperties.call(this, codeConstruct);
            var isCalledOnArray = this.constructor === fcModel.Array;

            var lengthProperty = this.getPropertyValue("length");
            var length = lengthProperty != null ? lengthProperty.value : 0;

            var shiftedItem = null;

            if(isCalledOnArray)
            {
                shiftedItem = this.items.shift();
                jsArray.shift();

                for(var i = 0; i < this.items.length; i++)
                {
                    this.addProperty(i, this.items[i], codeConstruct);
                }
            }
            else
            {
                shiftedItem = this.getPropertyValue("0");

                for(var i = 1; i < length; i++)
                {
                    this.addProperty(i - 1, this.getPropertyValue(i), codeConstruct);
                }
            }


            this.deleteProperty(length - 1, codeConstruct);
            this.addProperty("length", new fcModel.JsValue(length - 1, new fcModel.FcInternal(codeConstruct)), codeConstruct, false);

            return shiftedItem;
        }
        catch(e) { this.notifyError("Error when shifting items in array: " + e); }
    },

    unshift: function(jsArray, callArguments, callExpression)
    {
        try
        {
            fcModel.ArrayProto.addDependenciesToAllProperties.call(this, callExpression);
            var isCalledOnArray = this.constructor === fcModel.Array;

            if(!isCalledOnArray) { alert("Unshift called on non-array!");}

            var lengthProperty = this.getPropertyValue("length");
            var length = lengthProperty != null ? lengthProperty.value : 0;

            for(var i = 0; i < this.items.length; i++) { this.deleteProperty(i, callExpression); }

            for(var i = callArguments.length - 1; i >= 0; i--)
            {
                this.items.unshift(callArguments[i]);
                jsArray.unshift(callArguments[i]);
            }

            for(var i = 0; i < this.items.length; i++)
            {
                this.addProperty(i, this.items[i], callExpression);
            }

            var lengthValue =  new fcModel.JsValue(this.items.length, new fcModel.FcInternal(callExpression));

            this.addProperty("length", lengthValue, callExpression, false);

            return lengthValue;
        }
        catch(e) { this.notifyError("Error when unshifting items in array: " + e); }
    },

    sort: function(jsArray, arguments, codeConstruct, jsValue)
    {
        fcModel.ArrayProto.addDependenciesToAllProperties.call(this, codeConstruct);
        var isCalledOnArray = this.constructor === fcModel.Array;

        if(!isCalledOnArray) { alert("Sort called on non-array!");}

        var lengthProperty = this.getPropertyValue("length");
        var length = lengthProperty != null ? lengthProperty.value : 0;

        this.addDependenciesToAllProperties(codeConstruct);

        for(var i = 0; i < this.items.length; i++) { this.deleteProperty(i, codeConstruct); }

        var sortFunction = null;

        if(arguments.length > 0)
        {
            var arg = arguments[0];
            var functionConstruct = arg.fcInternal.codeConstruct;
            var returnArg = ASTHelper.getSimpleSortingFunctionReturnArg(functionConstruct);

            if(returnArg)
            {
                functionConstruct.isSortingFunction = true;
                var paramsCode = functionConstruct.params.map(function (param) { return param.name; }).join(",");
                sortFunction = eval("(function (" + paramsCode + ") {" + "return " + returnArg.left.name + ".value" + returnArg.operator + returnArg.right.name + ".value;})");
                var evaluationPosition = this.globalObject.getPreciseEvaluationPositionId();

                this.globalObject.browser.callDataDependencyEstablishedCallbacks(codeConstruct, returnArg, evaluationPosition);
                this.globalObject.browser.callDataDependencyEstablishedCallbacks(codeConstruct, returnArg.left, evaluationPosition);
                this.globalObject.browser.callDataDependencyEstablishedCallbacks(codeConstruct, returnArg.right, evaluationPosition);
            }
            else
            {
                console.log("Still not handling parametrized sort - " + codeConstruct.loc.start.line);
            }
        }

        if(sortFunction == null)
        {
            sortFunction = function(a, b)
            {
                //just sort lexicographically
                if(a.value == b.value) { return 0;}

                return a.value < b.value ? -1 : 1;
            };
        }

        this.items.sort(sortFunction);
        jsArray.sort(sortFunction);

        for(var i = 0; i < this.items.length; i++)
        {
            this.addProperty(i, this.items[i], codeConstruct);
        }

        return jsValue;
    },

    splice: function(jsArray, arguments, codeConstruct)
    {
        try
        {
            fcModel.ArrayProto.addDependenciesToAllProperties.call(this, codeConstruct);
            var isCalledOnArray = this.constructor === fcModel.Array;

            if(!isCalledOnArray) { alert("Splice called on non-array!");}

            var lengthProperty = this.getPropertyValue("length");
            var length = lengthProperty != null ? lengthProperty.value : 0;

            for(var i = 0; i < this.items.length; i++) { this.deleteProperty(i, codeConstruct); }

            var argumentValues = [];

            for(i = 0; i < arguments.length; i++)
            {
                if(i <= 1) { argumentValues.push(arguments[i].value);}
                else { argumentValues.push(arguments[i]); }
            }

            var splicedItems = this.items.splice.apply(this.items, argumentValues);
            jsArray.splice.apply(jsArray, argumentValues);

            for(i = 0; i < this.items.length; i++) { this.addProperty(i, this.items[i], codeConstruct); }

            this.addProperty("length", new fcModel.JsValue(this.items.length, new fcModel.FcInternal(codeConstruct)),codeConstruct, false);

            return this.globalObject.internalExecutor.createArray(codeConstruct, splicedItems);
        }
        catch(e) { this.notifyError("Error when splicing item: " + e); }
    },

    concat: function(jsArray, callArguments, callExpression)
    {
        try
        {
            fcModel.ArrayProto.addDependenciesToAllProperties.call(this, callExpression);
            var isCalledOnArray = this.constructor === fcModel.Array;

            if(!isCalledOnArray) { alert("Concat called on non-array!");}

            var lengthProperty = this.getPropertyValue("length");
            var length = lengthProperty != null ? lengthProperty.value : 0;

            var newArray = this.globalObject.internalExecutor.createArray(callExpression);

            jsArray.forEach(function(item)
            {
                newArray.fcInternal.object.push(newArray.value, item, callExpression);
            });

            for(var i = 0; i < callArguments.length; i++)
            {
                var argument = callArguments[i];

                if(ValueTypeHelper.isArray(argument.value))
                {
                    argument.fcInternal.object.addDependenciesToAllProperties(callExpression);
                    for(var j = 0; j < argument.value.length; j++)
                    {
                        var item = argument.value[j];
                        newArray.fcInternal.object.push(newArray.value, item, callExpression);
                    }
                }
                else
                {
                    newArray.fcInternal.object.push(newArray.value, argument, callExpression);
                }
            }
            return newArray;
        }
        catch(e) { this.notifyError("Error when concat array: " + e);}
    },

    slice: function(jsArray, callArguments, callExpression)
    {
        try
        {
            fcModel.ArrayProto.addDependenciesToAllProperties.call(this, callExpression);
            var isCalledOnArray = this.constructor === fcModel.Array;

            if(!isCalledOnArray) { alert("Slice called on non-array!");}

            var lengthProperty = this.getPropertyValue("length");
            var length = lengthProperty != null ? lengthProperty.value : 0;

            return this.globalObject.internalExecutor.createArray
            (
                callExpression,
                jsArray.slice.apply(jsArray, callArguments.map(function(argument){ return argument.value}))
            );
        }
        catch(e) { this.notifyError("When slicing array: " + e);}
    },

    indexOf: function(jsArray, callArguments, callExpression)
    {
        try
        {
            fcModel.ArrayProto.addDependenciesToAllProperties.call(this, callExpression);
            var isCalledOnArray = this.constructor === fcModel.Array;

            if(!isCalledOnArray) { alert("IndexOf called on non-array!");}

            var lengthProperty = this.getPropertyValue("length");
            var length = lengthProperty != null ? lengthProperty.value : 0;

            var searchForItem = callArguments[0];
            var fromIndex = callArguments[1] != null ? callArguments[1].value : 0;

            for(var i = fromIndex; i < jsArray.length; i++)
            {
                if(jsArray[i].value === searchForItem.value)
                {
                    return new fcModel.JsValue(i, new fcModel.FcInternal(callExpression));
                }
            }

            return new fcModel.JsValue(-1, new fcModel.FcInternal(callExpression));
        }
        catch(e) { this.notifyError("When indexOf array: " + e); }
    },

    lastIndexOf: function(jsArray, callArguments, callExpression)
    {
        try
        {
            fcModel.ArrayProto.addDependenciesToAllProperties.call(this, callExpression);
            var isCalledOnArray = this.constructor === fcModel.Array;

            if(!isCalledOnArray) { alert("lastIndexOf called on non-array!");}

            var lengthProperty = this.getPropertyValue("length");
            var length = lengthProperty != null ? lengthProperty.value : 0;

            var searchForItem = callArguments[0];
            var fromIndex = callArguments[1] != null ? callArguments[1].value : jsArray.length - 1;

            for(var i = fromIndex; i >= 0; i--)
            {
                if(jsArray[i].value === searchForItem.value)
                {
                    return new fcModel.JsValue(i, new fcModel.FcInternal(callExpression));
                }
            }

            return new fcModel.JsValue(-1, new fcModel.FcInternal(callExpression));
        }
        catch(e) { this.notifyError("When lastIndexOf array: " + e);}
    },

    join: function(jsArray, callArguments, callExpression)
    {
        try
        {
            fcModel.ArrayProto.addDependenciesToAllProperties.call(this, callExpression);
            var isCalledOnArray = this.constructor === fcModel.Array;

            if(!isCalledOnArray) { alert("join called on non-array!");}

            var lengthProperty = this.getPropertyValue("length");
            var length = lengthProperty != null ? lengthProperty.value : 0;

            var glue = callArguments[0] != null ? callArguments[0].value : ",";
            var result = "";

            var items = this.items;
            for(var i = 0, length = items.length; i < length; i++)
            {
                result += (i!=0 ? glue : "") + items[i].value;
            }

            return new fcModel.JsValue(result, new fcModel.FcInternal(callExpression));
        }
        catch(e) { this.notifyError("When join array: " + e); }
    },

    getJsPropertyValue: function(propertyName, codeConstruct)
    {
        return this.getPropertyValue(propertyName, codeConstruct);
    },

    addJsProperty: function(propertyName, propertyValue, codeConstruct)
    {
        if(ValueTypeHelper.isInteger(propertyName))
        {
            this.addDependenciesToAllProperties(codeConstruct);
            var oldLength = this.items.length;
            this.items[propertyName] = propertyValue;
            this.jsArray[propertyName] = propertyValue;
            this.addProperty(propertyName, propertyValue, codeConstruct);

            if(this.items.length != oldLength)
            {
                this.addProperty("length", new fcModel.JsValue(this.items.length, new fcModel.FcInternal(codeConstruct)), codeConstruct, false);
            }
        }
        else
        {
            if(propertyName == "length")
            {
                if(object.value[propertyName] !== propertyValue.value)
                {
                    console.log("Warning: Directly modifying array length property!");
                }
            }

            this.addProperty(propertyName, propertyValue, codeConstruct);
        }
    },

    notifyError: function(message) { Firecrow.Interpreter.Model.Array.notifyError(message); }
};

fcModel.ArrayPrototype = function(globalObject)
{
    try
    {
        this.globalObject = globalObject;
        this.__proto__ = new fcModel.Object(globalObject);
        //https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array#Methods_2
        fcModel.ArrayPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            var internalFunction = globalObject.internalExecutor.createInternalFunction(Array.prototype[propertyName], propertyName, this);
            this[propertyName] = internalFunction;
            this.addProperty(propertyName, internalFunction, null, false);
        }, this);

        this.fcInternal = { object: this };
    }
    catch(e) { Firecrow.Interpreter.Model.Array.notifyError("Error when creating array prototype:" + e); }
};

fcModel.ArrayPrototype.prototype = new fcModel.Object(null);

fcModel.ArrayPrototype.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS: ["pop","push","reverse","shift","sort","splice","unshift","concat","join","slice","indexOf","lastIndexOf","filter","forEach","every","map","some","reduce","reduceRight", "toString"],
        CALLBACK_METHODS: ["filter", "forEach", "every", "map", "some", "reduce", "reduceRight"]
    }
};

fcModel.ArrayFunction = function(globalObject)
{
    try
    {
        this.__proto__ = new fcModel.Object(globalObject);

        this.prototype = new fcModel.JsValue(globalObject.arrayPrototype, new fcModel.FcInternal(null, globalObject.arrayPrototype)) ;
        this.addProperty("prototype", globalObject.arrayPrototype);

        this.isInternalFunction = true;
        this.name = "Array";
        this.fcInternal = { object: this };
    }
    catch(e){ Firecrow.Interpreter.Model.Array.notifyError("Error when creating Array Function:" + e); }
};

fcModel.ArrayFunction.prototype = new fcModel.Object(null);

fcModel.ArrayCallbackEvaluator =
{
    evaluateCallbackReturn: function(callbackCommand, returnValue, returnExpression)
    {
        try
        {
            var originatingObject = callbackCommand.originatingObject;

            if(!ValueTypeHelper.isArray(originatingObject.value)) { this.notifyError("When evaluating callback return the argument has to be an array!"); return; }

            var callbackFunctionValue = callbackCommand.callerFunction.value;
            var targetObject = callbackCommand.targetObject;
            var targetObjectValue = targetObject.value;

            if(callbackFunctionValue.name == "filter")
            {
                if(!ValueTypeHelper.isArray(targetObjectValue)) { this.notifyError("A new array should be created when calling filter: " + e); return; }

                if(returnValue != null && returnValue.value)
                {
                    targetObject.fcInternal.object.push(targetObjectValue, [callbackCommand.arguments[0]], returnExpression.argument);
                }
            }
            else if(callbackFunctionValue.name == "map")
            {
                if(!ValueTypeHelper.isArray(targetObjectValue)) { this.notifyError("A new array should be created when calling filter: " + e); return; }

                targetObject.fcInternal.object.push(targetObjectValue, [returnValue], returnExpression.argument);
            }
            else if(callbackFunctionValue.name == "forEach") { }
            else if(callbackFunctionValue.name == "sort") { this.notifyError("Still not handling evaluate return from sort!"); return; }
            else if(callbackFunctionValue.name == "every") { this.notifyError("Still not handling evaluate return from every"); return; }
            else if(callbackFunctionValue.name == "some") { this.notifyError("Still not handling evaluate return from some"); return; }
            else if(callbackFunctionValue.name == "reduce") { this.notifyError("Still not handling evaluate return from reduce"); return; }
            else if(callbackFunctionValue.name == "reduceRight") { this.notifyError("Still not handling evaluate return from reduceRight"); return; }
            else
            {
                this.notifyError("Unknown callbackFunction!");
            }
        }
        catch(e)
        {
            this.notifyError("Error when evaluating callback return!");
        }
    },

    notifyError: function(message) { Firecrow.Interpreter.Model.Array.notifyError(message); }
};

fcModel.ArrayExecutor =
{
    executeInternalArrayMethod : function(thisObject, functionObject, arguments, callExpression, callCommand)
    {
        try
        {
            if(!functionObject.fcInternal.isInternalFunction) { this.notifyError("The function should be internal when executing array method!"); return; }

            var functionObjectValue = functionObject.value;
            var thisObjectValue = thisObject.value;
            var functionName = functionObjectValue.name;
            var fcThisValue =  thisObject.fcInternal.object;
            var globalObject = thisObject.fcInternal.object.globalObject;

            var isCalledOnArray = fcThisValue.constructor === fcModel.Array;

            if(!isCalledOnArray)
            {
                console.log(functionName + " called on a non-array object!");
            }

            switch(functionName)
            {
                case "toString":
                    return new fcModel.JsValue(isCalledOnArray ? "[object Array]" : "[object Object]", new fcModel.FcInternal(callExpression));
                case "pop":
                case "reverse":
                case "shift":
                case "push":
                case "concat":
                case "slice":
                case "indexOf":
                case "lastIndexOf":
                case "unshift":
                case "splice":
                case "join":
                case "sort":
                    return fcModel.ArrayProto[functionName].apply(fcThisValue, [thisObjectValue, arguments, callExpression, thisObject]);
                case "forEach":
                case "filter":
                case "every":
                case "some":
                case "map":
                    var allCallbackArguments = [];
                    var callbackParams = callExpression.arguments != null ? callExpression.arguments[0].params : [];
                    callbackParams = callbackParams || [];

                    for(var i = 0, length = thisObjectValue.length; i < length; i++)
                    {
                        allCallbackArguments.push([thisObject.value[i], new fcModel.JsValue(i, new fcModel.FcInternal(callbackParams[i])), thisObject]);
                    }

                    callCommand.generatesNewCommands = true;
                    callCommand.generatesCallbacks = true;
                    callCommand.callbackFunction = arguments[0];
                    callCommand.callbackArgumentGroups = allCallbackArguments;
                    callCommand.thisObject = arguments[2] || globalObject;
                    callCommand.originatingObject = thisObject;
                    callCommand.callerFunction = functionObject;

                    if(functionName == "filter" || functionName == "map")
                    {
                        callCommand.targetObject = globalObject.internalExecutor.createArray(callExpression);
                        return callCommand.targetObject;
                    }
                    else
                    {
                        return new fcModel.JsValue(undefined, new fcModel.FcInternal(callExpression));
                    }

                default:
                    this.notifyError("Unknown internal array method: " + functionObjectValue.name);
            }
        }
        catch(e) { this.notifyError("Error when executing internal array method: " + e); }
    },

    notifyError: function(message) { Firecrow.Interpreter.Model.Array.notifyError(message); }
};
}});