/**
 * User: Jomaras
 * Date: 10.05.12.
 * Time: 09:56
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

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

        if(codeConstruct != null) { this.modifications.push({codeConstruct: codeConstruct, evaluationPositionId: globalObject.getPreciseEvaluationPositionId()});}

        this.jsArray.forEach(function(item) { this.push(item, codeConstruct);}, this);

        //For RegEx result arrays
        if(this.jsArray.hasOwnProperty("index")) { this.addProperty("index", new fcModel.JsValue(this.jsArray.index, new fcModel.FcInternal(codeConstruct)), codeConstruct); }
        if(this.jsArray.hasOwnProperty("input")) { this.addProperty("input", new fcModel.JsValue(this.jsArray.input, new fcModel.FcInternal(codeConstruct)), codeConstruct); }

        this.addProperty("__proto__", globalObject.arrayPrototype);

        this.registerGetPropertyCallback(function(getPropertyConstruct)
        {
           this.addDependenciesToAllProperties(getPropertyConstruct);
        }, this);
    }
    catch(e) { alert("Array - error when creating array object: " + e + codeConstruct.loc.source); }
};

fcModel.ArrayProto =
{
    addDependenciesToAllProperties: function(codeConstruct)
    {
        try
        {
            var properties = this.properties;

            for(var i = 0, length = properties.length; i < length; i++)
            {
                var property = properties[i];

                this.globalObject.browser.callDataDependencyEstablishedCallbacks
                (
                    codeConstruct,
                    property.lastModificationConstruct.codeConstruct,
                    this.globalObject.getPreciseEvaluationPositionId(),
                    property.lastModificationConstruct.evaluationPositionId
                );
            }
        }
        catch(e) { alert("Array - Error when registering getPropertyCallback: " + e + " " + codeConstruct.loc.source); }
    },

    push: function(item, codeConstruct)
    {
        try
        {
            this.addDependenciesToAllProperties(codeConstruct);
            this.items.push(item);
            this.addProperty(this.items.length - 1, item, codeConstruct);
            this.addProperty("length", new fcModel.JsValue(this.items.length, new fcModel.FcInternal(codeConstruct)),codeConstruct, false);
        }
        catch(e) { this.notifyError("Error when pushing item: " + e); }
    },

    pop: function(codeConstruct)
    {
        try
        {
            this.addDependenciesToAllProperties(codeConstruct);
            this.deleteProperty(this.items.length - 1, codeConstruct);

            var poppedItem = this.items.pop();

            this.addProperty("length", new fcModel.JsValue(this.items.length, new fcModel.FcInternal(codeConstruct)),codeConstruct, false);

            return poppedItem;
        }
        catch(e) { alert("Array - error when popping item: " + e); }
    },

    reverse: function(codeConstruct)
    {
        try
        {
            this.addDependenciesToAllProperties(codeConstruct);
            this.items.reverse();

            for(var i = 0; i < this.items.length; i++)
            {
                this.addProperty(i, this.items[i], codeConstruct);
            }
        }
        catch(e) { alert("Array - error when reversing the array: " + e); }
    },

    shift: function(codeConstruct)
    {
        try
        {
            this.addDependenciesToAllProperties(codeConstruct);
            this.deleteProperty(this.items.length - 1, codeConstruct);

            this.items.shift();

            for(var i = 0; i < this.items.length; i++)
            {
                this.addProperty(i, this.items[i], codeConstruct);
            }

            this.addProperty("length", new fcModel.JsValue(this.items.length, new fcModel.FcInternal(codeConstruct)),codeConstruct, false);
        }
        catch(e) { alert("Array - error when shifting items in array: " + e); }
    },

    unshift: function(jsArray, callArguments, callExpression)
    {
        try
        {
            this.addDependenciesToAllProperties(callExpression);
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

            this.addProperty("length", new fcModel.JsValue(this.items.length, new fcModel.FcInternal(callExpression)),callExpression, false);

            return new fcModel.JsValue(this.items.length, new fcModel.FcInternal(callExpression));
        }
        catch(e) { alert("Array - error when unshifting items in array: " + e); }
    },

    splice: function(jsArray, arguments, codeConstruct)
    {
        try
        {
            this.addDependenciesToAllProperties(codeConstruct);

            for(var i = 0; i < this.items.length; i++) { this.deleteProperty(i, codeConstruct); }

            var argumentValues =  arguments.map(function(item) { return item.value; });

            var splicedItems = this.items.splice.apply(this.items, argumentValues);
            jsArray.splice.apply(jsArray, argumentValues);

            for(var i = 0; i < this.items.length; i++) { this.addProperty(i, this.items[i], codeConstruct); }

            this.addProperty("length", new fcModel.JsValue(this.items.length, new fcModel.FcInternal(codeConstruct)),codeConstruct, false);

            return this.globalObject.internalExecutor.createArray(codeConstruct, splicedItems);
        }
        catch(e) { alert("Array - error when splicing item: " + e); }
    },

    concat: function(jsArray, callArguments, callExpression)
    {
        try
        {
            this.addDependenciesToAllProperties(callExpression);
            var newArray = this.globalObject.internalExecutor.createArray(callExpression);

            jsArray.forEach(function(item)
            {
                newArray.fcInternal.object.push(item, callExpression);
                newArray.value.push(item);
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
                        newArray.fcInternal.object.push(item, callExpression);
                        newArray.value.push(item);
                    }
                }
                else
                {
                    newArray.fcInternal.object.push(argument, callExpression);
                    newArray.value.push(argument);
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
            this.addDependenciesToAllProperties(callExpression);

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
            this.addDependenciesToAllProperties(callExpression);
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
        catch(e) { this.notifyError("When indexOf array: " + e);}
    },

    lastIndexOf: function(jsArray, callArguments, callExpression)
    {
        try
        {
            this.addDependenciesToAllProperties(callExpression);
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
            this.addDependenciesToAllProperties(callExpression);
            var glue = callArguments[0] != null ? callArguments[0].value : ",";
            var result = "";

            var items = this.items;
            for(var i = 0, length = items.length; i < length; i++)
            {
                result += (i!=0 ? glue : "") + items[i].value;
            }

            return new fcModel.JsValue(result, new fcModel.FcInternal(callExpression));
        }
        catch(e) { this.notifyError("When indexOf array: " + e);}
    },

    updateItem: function(propertyName, newItem)
    {
        try
        {
            if(ValueTypeHelper.isInteger(propertyName)) { this.items[propertyName] = newItem; }
        }
        catch(e) { this.notifyError("Error when updating item: " + e); }
    },

    notifyError: function(message) { alert("Array - " + message); }
};

fcModel.ArrayPrototype = function(globalObject)
{
    try
    {
        this.globalObject = globalObject;
        //https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array#Methods_2
        fcModel.ArrayPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            this.addProperty(propertyName, fcModel.Function.createInternalNamedFunction(globalObject, propertyName), null, false);
        }, this);

        this.fcInternal = { object: this };
    }
    catch(e) { alert("Array - error when creating array prototype:" + e + " " + codeConstruct.loc.source); }
};

fcModel.ArrayPrototype.prototype = new fcModel.Object(null);

fcModel.ArrayPrototype.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS: ["pop","push","reverse","shift","sort","splice","unshift","concat","join","slice","indexOf","lastIndexOf","filter","forEach","every","map","some","reduce","reduceRight", "toString"],
        CALLBACK_METHODS: ["sort", "filter", "forEach", "every", "map", "some", "reduce", "reduceRight"]
    }
};

fcModel.ArrayFunction = function(globalObject)
{
    try
    {
        this.addProperty("prototype", globalObject.arrayPrototype);
        this.isInternalFunction = true;
        this.name = "Array";
        this.fcInternal = this;
    }
    catch(e){ alert("Array - error when creating Array Function:" + e); }
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
                    targetObject.fcInternal.object.push(callbackCommand.arguments[0], returnExpression.argument);
                    targetObjectValue.push(callbackCommand.arguments[0]);
                }
            }
            else if(callbackFunctionValue.name == "map")
            {
                if(!ValueTypeHelper.isArray(targetObjectValue)) { this.notifyError("A new array should be created when calling filter: " + e); return; }

                targetObject.fcInternal.object.push(returnValue, returnExpression.argument);
                targetObjectValue.push(returnValue);
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

    notifyError: function(message) { alert("ArrayCallbackEvaluator - " + message); }
};

fcModel.ArrayExecutor =
{
    executeInternalArrayMethod : function(thisObject, functionObject, arguments, callExpression, callCommand)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(thisObject.value, Array)) { this.notifyError("The called on object should be an array!"); return; }
            if(!functionObject.fcInternal.isInternalFunction) { this.notifyError("The function should be internal when executing array method!"); return; }

            var functionObjectValue = functionObject.value;
            var thisObjectValue = thisObject.value;
            var functionName = functionObjectValue.name;
            var fcThisValue =  thisObject.fcInternal.object;
            var globalObject = thisObject.fcInternal.object.globalObject;

            switch(functionName)
            {
                case "toString":
                    return new fcModel.JsValue("[object Array]", new fcModel.FcInternal(callExpression));
                case "pop":
                case "reverse":
                case "shift":
                    fcThisValue[functionName].apply(fcThisValue, [callExpression]);
                    return thisObjectValue[functionObjectValue.name].apply(thisObjectValue, arguments);
                case "push":
                    arguments.forEach(function(argument){fcThisValue.push(argument, callExpression);});
                    return thisObjectValue[functionObjectValue.name].apply(thisObjectValue, arguments);
                case "concat":
                case "slice":
                case "indexOf":
                case "lastIndexOf":
                case "unshift":
                case "splice":
                case "join":
                    thisObjectValue[functionObjectValue.name].apply(thisObjectValue, arguments);
                    return fcThisValue[functionName].apply(fcThisValue, [thisObjectValue, arguments, callExpression]);
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
                        var callbackArguments = [];

                        callbackArguments.push(thisObject.value[i]);
                        callbackArguments.push(new fcModel.JsValue(i, new fcModel.FcInternal(callbackParams[i])));
                        callbackArguments.push(thisObject);

                        allCallbackArguments.push(callbackArguments);
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

    notifyError: function(message)
    {
       alert("Array executor - " + message);
    }
};
}});