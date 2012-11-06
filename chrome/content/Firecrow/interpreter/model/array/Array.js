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
        this.jsArray = jsArray || [];

        this.__proto__ = new fcModel.Object(globalObject, codeConstruct, this.jsArray);
        for(var prop in fcModel.ArrayProto) { this[prop] = fcModel.ArrayProto[prop]; }

        this.constructor = fcModel.Array;

        this.items = [];

        this._addDefaultProperties();
        this._addPreexistingObjects();

        this._createDummyDependencyNode();
        this._registerCallbacks();
    }
    catch(e) { this.notifyError("Error when creating array object: " + e + codeConstruct.loc.source); }
};

fcModel.Array.notifyError = function(message) { alert("Array - " + message);}

fcModel.ArrayProto =
{
    //<editor-fold desc="Internal array methods">
    push: function(jsArray, arguments, codeConstruct, jsValue, dontFillJsArray)
    {
        try
        {
            fcModel.ArrayProto.addDependenciesToAllProperties.call(this, codeConstruct);
            var isCalledOnArray = this.constructor === fcModel.Array;

            var lengthProperty = this.getProperty("length");
            var length = lengthProperty != null && lengthProperty.value != null ? lengthProperty.value.value : 0;

            if(!isCalledOnArray)
            {
                this.addDependencyToAllModifications(codeConstruct);

                if(lengthProperty != null && lengthProperty.lastModificationConstruct != null)
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

                this.addProperty(length++, argument, codeConstruct, true);
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
            fcModel.Array.notifyError("Error when pushing item: " + e);
        }
    },

    pop: function(jsArray, arguments, codeConstruct)
    {
        try
        {
            fcModel.ArrayProto.addDependenciesToAllProperties.call(this, codeConstruct);
            var isCalledOnArray = this.constructor === fcModel.Array;

            if(!isCalledOnArray) { this.addDependencyToAllModifications(codeConstruct); }

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
        catch(e) { fcModel.Array.notifyError("Error when popping item: " + e); }
    },

    reverse: function(jsArray, arguments, codeConstruct, jsValue)
    {
        try
        {
            fcModel.ArrayProto.addDependenciesToAllProperties.call(this, codeConstruct);
            var isCalledOnArray = this.constructor === fcModel.Array;

            if(!isCalledOnArray) { this.addDependencyToAllModifications(codeConstruct); }

            var lengthProperty = this.getPropertyValue("length");
            var length = lengthProperty != null ? lengthProperty.value : 0;

            if(isCalledOnArray)
            {
                this.items.reverse();
                jsArray.reverse();

                for(var i = 0; i < length; i++)
                {
                    this.addProperty(i, this.items[i], codeConstruct, true);
                }
            }
            else { alert("Not handling reverse on non arrays!"); }

            return jsValue;
        }
        catch(e) { fcModel.Array.notifyError("Error when reversing the array: " + e); }
    },

    shift: function(jsArray, arguments, codeConstruct)
    {
        try
        {
            fcModel.ArrayProto.addDependenciesToAllProperties.call(this, codeConstruct);
            var isCalledOnArray = this.constructor === fcModel.Array;

            if(!isCalledOnArray) { this.addDependencyToAllModifications(codeConstruct); }

            var lengthProperty = this.getPropertyValue("length");
            var length = lengthProperty != null ? lengthProperty.value : 0;

            var shiftedItem = null;

            if(isCalledOnArray)
            {
                shiftedItem = this.items.shift();
                jsArray.shift();

                for(var i = 0; i < this.items.length; i++)
                {
                    this.addProperty(i, this.items[i], codeConstruct, true);
                }
            }
            else
            {
                shiftedItem = this.getPropertyValue("0");

                for(var i = 1; i < length; i++)
                {
                    this.addProperty(i - 1, this.getPropertyValue(i), codeConstruct, true);
                }
            }


            this.deleteProperty(length - 1, codeConstruct);
            this.addProperty("length", new fcModel.JsValue(length - 1, new fcModel.FcInternal(codeConstruct)), codeConstruct, false);

            return shiftedItem;
        }
        catch(e) { fcModel.Array.notifyError("Error when shifting items in array: " + e); }
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
                this.addProperty(i, this.items[i], callExpression, true);
            }

            var lengthValue =  new fcModel.JsValue(this.items.length, new fcModel.FcInternal(callExpression));

            this.addProperty("length", lengthValue, callExpression, false);

            return lengthValue;
        }
        catch(e) { fcModel.Array.notifyError("Error when unshifting items in array: " + e); }
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
            this.addProperty(i, this.items[i], codeConstruct, true);
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

            for(i = 0; i < this.items.length; i++) { this.addProperty(i, this.items[i], codeConstruct, true); }

            this.addProperty("length", new fcModel.JsValue(this.items.length, new fcModel.FcInternal(codeConstruct)),codeConstruct, false);

            return this.globalObject.internalExecutor.createArray(codeConstruct, splicedItems);
        }
        catch(e) { fcModel.Array.notifyError("Error when splicing item: " + e); }
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
        catch(e) { fcModel.Array.notifyError("Error when concat array: " + e);}
    },

    slice: function(jsArray, callArguments, callExpression)
    {
        try
        {
            fcModel.ArrayProto.addDependenciesToAllProperties.call(this, callExpression);
            var isCalledOnArray = this.constructor === fcModel.Array;

            var lengthProperty = this.getProperty("length");
            var length = lengthProperty != null && lengthProperty.value != null ? lengthProperty.value.value : 0;

            if(!isCalledOnArray)
            {
                this.addDependencyToAllModifications(callExpression);

                if(lengthProperty != null && lengthProperty.lastModificationConstruct != null)
                {
                    this.globalObject.browser.callDataDependencyEstablishedCallbacks
                    (
                        callExpression,
                        lengthProperty.lastModificationConstruct.codeConstruct,
                        this.globalObject.getPreciseEvaluationPositionId(),
                        lengthProperty.lastModificationConstruct.evaluationPositionId
                    );
                }

                var indexProperties = this.getPropertiesWithIndexNames();

                var substituteObject = {};

                for(var i = 0; i < indexProperties.length; i++)
                {
                    var property = indexProperties[i];
                    substituteObject[property.name] = property.value;
                }

                substituteObject.length = length;
            }

            return this.globalObject.internalExecutor.createArray
            (
                callExpression,
                [].slice.apply((isCalledOnArray ? jsArray : substituteObject), callArguments.map(function(argument){ return argument.value}))
            );
        }
        catch(e) { fcModel.Array.notifyError("When slicing array: " + e);}
    },

    indexOf: function(jsArray, callArguments, callExpression)
    {
        try
        {
            fcModel.ArrayProto.addDependenciesToAllProperties.call(this, callExpression);
            var isCalledOnArray = this.constructor === fcModel.Array;

            var lengthProperty = this.getProperty("length");
            var lengthPropertyValue = lengthProperty.value;
            var length = lengthPropertyValue != null ? lengthProperty.value.value : 0;

            var searchObject = jsArray;

            if(!isCalledOnArray)
            {
                this.addDependencyToAllModifications(callExpression);

                if(lengthProperty != null && lengthProperty.lastModificationConstruct != null)
                {
                    this.globalObject.browser.callDataDependencyEstablishedCallbacks
                    (
                        callExpression,
                        lengthProperty.lastModificationConstruct.codeConstruct,
                        this.globalObject.getPreciseEvaluationPositionId(),
                        lengthProperty.lastModificationConstruct.evaluationPositionId
                    );
                }

                var indexProperties = this.getPropertiesWithIndexNames();

                var substituteObject = {};

                for(var i = 0; i < indexProperties.length; i++)
                {
                    var property = indexProperties[i];
                    substituteObject[property.name] = property.value;
                }

                substituteObject.length = length;

                searchObject = substituteObject;
            }

            var searchForItem = callArguments[0];
            var fromIndex = callArguments[1] != null ? callArguments[1].value : 0;

            if(fromIndex == null) { fromIndex = 0; }

            for(var i = fromIndex; i < length; i++)
            {
                if(searchObject[i].value === searchForItem.value)
                {
                    return new fcModel.JsValue(i, new fcModel.FcInternal(callExpression));
                }
            }

            return new fcModel.JsValue(-1, new fcModel.FcInternal(callExpression));
        }
        catch(e) { fcModel.Array.notifyError("When indexOf array: " + e); }
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
        catch(e) { fcModel.Array.notifyError("When lastIndexOf array: " + e);}
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
        catch(e) { fcModel.Array.notifyError("When join array: " + e); }
    },
    //</editor-fold>

    //<editor-fold desc="Js Property Access">
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
            this.addProperty(propertyName, propertyValue, codeConstruct, true);

            if(this.items.length != oldLength)
            {
                this.addProperty("length", new fcModel.JsValue(this.items.length, new fcModel.FcInternal(codeConstruct)), codeConstruct, false);
            }
        }
        else
        {
            if(propertyName == "length")
            {
                if(this.jsArray[propertyName] !== propertyValue.value)
                {
                    console.log("Warning: Directly modifying array length property!");
                }
            }

            this.addProperty(propertyName, propertyValue, codeConstruct, propertyName != "length");
        }
    },
    //</editor-fold>

    //<editor-fold desc="Adding Dependencies to properties">
    addDependenciesToAllProperties: function(codeConstruct)
    {
        try
        {
            if(codeConstruct == null) { return; }

            this.globalObject.browser.callDataDependencyEstablishedCallbacks
            (
                codeConstruct,
                this.dummyDependencyNode,
                this.globalObject.getPreciseEvaluationPositionId()
            );
        }
        catch(e) { fcModel.Array.notifyError("Error when adding dependencies to all properties: " + e + " " + codeConstruct.loc.source); }
    },
    //</editor-fold>

    //<editor-fold desc="'Private' methods">
    _createDummyDependencyNode: function()
    {
        this.dummyDependencyNode = { type: "DummyCodeElement" };
        this.globalObject.browser.callNodeCreatedCallbacks(this.dummyDependencyNode, "js", true);
    },

    _registerCallbacks: function()
    {
        this.registerGetPropertyCallback(function(getPropertyConstruct) { this.addDependenciesToAllProperties(getPropertyConstruct); }, this);

        this.registerObjectModifiedCallbackDescriptor
        (
            function(modification)
            {
                this.globalObject.browser.callDataDependencyEstablishedCallbacks
                (
                    this.dummyDependencyNode,
                    modification.codeConstruct,
                    this.globalObject.getPreciseEvaluationPositionId(),
                    modification.evaluationPositionId
                );
            },
            this
        );
    },

    _addDefaultProperties: function()
    {
        this.addProperty("length", new fcModel.JsValue(0, new fcModel.FcInternal(this.creationCodeConstruct)), this.creationCodeConstruct, false);
        this.addProperty("__proto__", this.globalObject.arrayPrototype);

        this._addRegExResultArrayProperties();
    },

    _addRegExResultArrayProperties: function()
    {
        if(this.jsArray.hasOwnProperty("index")) { this.addProperty("index", new fcModel.JsValue(this.jsArray.index, new fcModel.FcInternal(this.creationCodeConstruct)), this.creationCodeConstruct); }
        if(this.jsArray.hasOwnProperty("input")) { this.addProperty("input", new fcModel.JsValue(this.jsArray.input, new fcModel.FcInternal(this.creationCodeConstruct)), this.creationCodeConstruct); }
    },

    _addPreexistingObjects: function()
    {
        for(var i = 0; i < this.jsArray.length; i++)
        {
            this.push(this.jsArray, this.jsArray[i], this.creationCodeConstruct, this, false);
        }
    },
    //</editor-fold>
};
}});