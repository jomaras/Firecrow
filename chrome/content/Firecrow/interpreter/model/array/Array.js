FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var fcSimulator = Firecrow.Interpreter.Simulator;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;

fcModel.Array = function fcModelArray(jsArray, globalObject, codeConstruct)
{
    try
    {
        this.initObject(globalObject, codeConstruct, (this.jsArray = jsArray || []));

        this.constructor = fcModel.Array;
        this.items = [];

        this._addDefaultProperties();
        this._addPreexistingObjects();

        this._registerCallbacks();
    }
    catch(e) { fcModel.Array.notifyError("Error when creating array object: " + e); }
};

//<editor-fold desc="'Static' Methods">
fcModel.Array.notifyError = function(message) { debugger; alert("Array - " + message);}
//</editor-fold>

//<editor-fold desc="Prototype Definition">
fcModel.Array.prototype = new fcModel.Object();

fcModel.Array.prototype.removePrototypeMethods = function()
{
    fcModel.ArrayPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
    {
        this.addProperty(propertyName, this.globalObject.internalExecutor.createInternalPrimitiveObject(null, undefined));
    }, this);
};

fcModel.Array.prototype.markAsNodeList = function()
{
    this.isNodeList = true;
    try
    {
        Object.defineProperty(this.jsArray, "isNodeList", {
            enumerable: false,
            configurable: false,
            writable: false,
            value: true
        });
    }
    catch(e) { fcModel.Array.notifyError("Failed in defining non-enumerable property for isNodeList"); }
    this.removePrototypeMethods();
};

//<editor-fold desc="Internal array methods">
fcModel.Array.prototype.push = function(jsArray, args, codeConstruct, fcValue, dontFillJsArray)
{
    try
    {
        this.addDependenciesToAllProperties(codeConstruct);

        var isCalledOnArray = this.constructor === fcModel.Array;

        if(args != null && args.isNodeList && this.globalObject.throwsExceptionOnPushWithNodeList)
        {
            this.globalObject.executionContextStack.callExceptionCallbacks
            (
                {
                    exceptionGeneratingConstruct: codeConstruct,
                    isPushExpectedException: true
                }
            );

            return;
        }

        if(!isCalledOnArray) { this.addDependencyToAllModifications(codeConstruct); }

        var lengthProperty = this.getPropertyValue("length");
        var length = lengthProperty != null ? lengthProperty.jsValue : 0;

        args = args.length !== null && args.length !== undefined ? args : [args];

        for(var i = 0, argsLength = args.length; i < argsLength; i++, length++)
        {
            var argument = args[i];

            if(isCalledOnArray)
            {
                this.items.push(argument);
                if(!dontFillJsArray) { jsArray.push(argument); }
            }
            else
            {
                jsArray[length] = argument;
            }

            this.addProperty(length, argument, codeConstruct, true);
        }

        var lengthValue = this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, length);
        this.addProperty("length", lengthValue, codeConstruct);

        if(!isCalledOnArray) { jsArray.length = lengthValue; }

        return lengthValue;
    }
    catch(e) { fcModel.Array.notifyError("Error when pushing item: " + e + " " + e.fileName + " " + e.lineNumber); }
};

fcModel.Array.prototype.pop = function(jsArray, args, codeConstruct)
{
    try
    {
        this.addDependenciesToAllProperties(codeConstruct);
        var isCalledOnArray = this.constructor === fcModel.Array;

        if(!isCalledOnArray) { this.addDependencyToAllModifications(codeConstruct); }

        var lengthProperty = this.getPropertyValue("length");
        var length = lengthProperty != null ? lengthProperty.jsValue : 0;

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

        this.addProperty("length", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, length - 1), codeConstruct, false);

        return poppedItem;
    }
    catch(e) { fcModel.Array.notifyError("Error when popping item: " + e); }
};

fcModel.Array.prototype.reverse = function(jsArray, args, codeConstruct, fcValue)
{
    try
    {
        this.addDependenciesToAllProperties(codeConstruct);

        var isCalledOnArray = this.constructor === fcModel.Array;

        if(!isCalledOnArray) { this.addDependencyToAllModifications(codeConstruct); }

        var lengthProperty = this.getPropertyValue("length");
        var length = lengthProperty != null ? lengthProperty.jsValue : 0;

        if(isCalledOnArray)
        {
            ValueTypeHelper.reverseArray(this.items);
            ValueTypeHelper.reverseArray(jsArray);

            for(var i = 0; i < length; i++)
            {
                this.addProperty(i, this.items[i], codeConstruct, true);
            }
        }
        else { fcModel.Array.notifyError("Not handling reverse on non arrays!"); }

        return fcValue;
    }
    catch(e) { fcModel.Array.notifyError("Error when reversing the array: " + e); }
};

fcModel.Array.prototype.shift = function(jsArray, args, codeConstruct)
{
    try
    {
        this.addDependenciesToAllProperties(codeConstruct);

        var isCalledOnArray = this.constructor === fcModel.Array;

        if(!isCalledOnArray) { this.addDependencyToAllModifications(codeConstruct); }

        var lengthProperty = this.getPropertyValue("length");
        var length = lengthProperty != null ? lengthProperty.jsValue : 0;

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
        this.addProperty("length", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, length - 1), codeConstruct, false);

        return shiftedItem;
    }
    catch(e) { fcModel.Array.notifyError("Error when shifting items in array: " + e); }
};

fcModel.Array.prototype.unshift = function(jsArray, callArguments, callExpression)
{
    try
    {
        this.addDependenciesToAllProperties(callExpression);

        var isCalledOnArray = this.constructor === fcModel.Array;

        if(!isCalledOnArray) { alert("Unshift called on non-array!"); return;}

        var lengthProperty = this.getPropertyValue("length");
        var length = lengthProperty != null ? lengthProperty.jsValue : 0;

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

        var lengthValue = this.globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, this.items.length);

        this.addProperty("length", lengthValue, callExpression, false);

        return lengthValue;
    }
    catch(e) { fcModel.Array.notifyError("Error when unshifting items in array: " + e); }
};

fcModel.Array.prototype.sort = function(jsArray, args, codeConstruct, fcValue)
{
    this.addDependenciesToAllProperties(codeConstruct);

    var isCalledOnArray = this.constructor === fcModel.Array;

    if(!isCalledOnArray) { alert("Sort called on non-array!"); }

    var lengthProperty = this.getPropertyValue("length");
    var length = lengthProperty != null ? lengthProperty.jsValue : 0;

    for(var i = 0; i < this.items.length; i++) { this.deleteProperty(i, codeConstruct); }

    var sortFunction = null;

    if(args.length > 0) { return fcValue; }

    var sortFunction = function(a, b)
    {
        //just sort lexicographically
        if(a.jsValue == b.jsValue) { return 0;}

        return a.jsValue < b.jsValue ? -1 : 1;
    };

    this.items.sort(sortFunction);
    jsArray.sort(sortFunction);

    for(var i = 0; i < this.items.length; i++)
    {
        this.addProperty(i, this.items[i], codeConstruct, true);
    }

    return fcValue;
};

fcModel.Array.prototype.splice = function(jsArray, args, codeConstruct)
{
    try
    {
        this.addDependenciesToAllProperties(codeConstruct);

        var isCalledOnArray = this.constructor === fcModel.Array;

        if(!isCalledOnArray) { return fcModel.Array.prototype._spliceOnNonArray.call(this, jsArray, args, codeConstruct); }

        var lengthProperty = this.getPropertyValue("length");
        var length = lengthProperty != null ? lengthProperty.jsValue : 0;

        for(var i = 0; i < this.items.length; i++) { this.deleteProperty(i, codeConstruct); }

        var argumentValues = [];

        for(i = 0; i < args.length; i++)
        {
            if(i <= 1) { argumentValues.push(args[i].jsValue);}
            else { argumentValues.push(args[i]); }
        }

        var splicedItems = this.items.splice.apply(this.items, argumentValues);
        jsArray.splice.apply(jsArray, argumentValues);

        for(i = 0; i < this.items.length; i++) { this.addProperty(i, this.items[i], codeConstruct, true); }

        this.addProperty("length", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, this.items.length),codeConstruct, false);

        return this.globalObject.internalExecutor.createArray(codeConstruct, splicedItems);
    }
    catch(e) { fcModel.Array.notifyError("Error when splicing item: " + e); }
};

fcModel.Array.prototype._spliceOnNonArray = function(jsArray, args, codeConstruct)
{
    this.addDependencyToAllModifications(codeConstruct);
    if(jsArray.length != null)
    {
        this.globalObject.dependencyCreator.createDataDependency(codeConstruct, jsArray.length.codeConstruct)
    }

    var adjustedArguments = [];

    jsArray.length = jsArray.length != null ? jsArray.length.jsValue : null;

    for(var i = 0; i < args.length; i++)
    {
        if(i <= 1) { adjustedArguments.push(args[i].jsValue); }
        else  { adjustedArguments.push(args[i]); }
    }

    var oldLength = jsArray.length;

    var resultArray = Array.prototype.splice.apply(jsArray, adjustedArguments);

    var newLength = jsArray.length;

    for(var i = 0; i < newLength; i++) { this.addProperty(i + "", jsArray[i], codeConstruct, true); }
    for(i = newLength; i < oldLength; i++) { this.deleteProperty(i + "", codeConstruct);}

    jsArray.length = this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, jsArray.length);
    this.addProperty("length", jsArray.length, codeConstruct, false);

    return this.globalObject.internalExecutor.createArray(codeConstruct, resultArray);
};

fcModel.Array.prototype.concat = function(jsArray, callArguments, callExpression)
{
    try
    {
        this.addDependenciesToAllProperties(callExpression);

        var isCalledOnArray = this.constructor === fcModel.Array || this == this.globalObject.arrayPrototype;

        var lengthProperty = this.getPropertyValue("length");
        var length = lengthProperty != null ? lengthProperty.jsValue : 0;

        var newArray = this.globalObject.internalExecutor.createArray(callExpression);

        for(var i = 0; i < jsArray.length; i++)
        {
            newArray.iValue.push(newArray.jsValue, jsArray[i], callExpression);
        }

        for(var i = 0; i < callArguments.length; i++)
        {
            var argument = callArguments[i];

            if(ValueTypeHelper.isArray(argument.jsValue))
            {
                argument.iValue.addDependenciesToAllProperties(callExpression);
                for(var j = 0; j < argument.jsValue.length; j++)
                {
                    var item = argument.jsValue[j];
                    if(item == null)
                    {
                        item = this.globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, undefined);
                    }

                    newArray.iValue.push(newArray.jsValue, item, callExpression);
                }
            }
            else
            {
                newArray.iValue.push(newArray.jsValue, argument, callExpression);
            }
        }

        return newArray;
    }
    catch(e) { fcModel.Array.notifyError("Error when concat array: " + e);}
};

fcModel.Array.prototype.slice = function(jsArray, callArguments, callExpression)
{
    try
    {
        this.addDependenciesToAllProperties(callExpression);
        var isCalledOnArray = this.constructor === fcModel.Array;

        var lengthProperty = this.getProperty("length");
        var length = lengthProperty != null ? lengthProperty.value.jsValue : 0;

        if(!isCalledOnArray)
        {
            this.addDependencyToAllModifications(callExpression);

            if(lengthProperty != null && lengthProperty.lastModificationPosition != null)
            {
                this.globalObject.dependencyCreator.createDataDependency
                (
                    callExpression,
                    lengthProperty.lastModificationPosition.codeConstruct,
                    this.globalObject.getPreciseEvaluationPositionId(),
                    lengthProperty.lastModificationPosition.evaluationPositionId
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
            [].slice.apply((isCalledOnArray ? jsArray : substituteObject), this.globalObject.getJsValues(callArguments))
        );
    }
    catch(e) { fcModel.Array.notifyError("When slicing array: " + e);}
};

fcModel.Array.prototype.indexOf = function(jsArray, callArguments, callExpression)
{
    try
    {
        this.addDependenciesToAllProperties(callExpression);
        var isCalledOnArray = this.constructor === fcModel.Array;

        var lengthProperty = this.getProperty("length");
        var lengthPropertyValue = lengthProperty.value;
        var length = lengthPropertyValue != null ? lengthPropertyValue.jsValue : 0;

        var searchObject = jsArray;

        if(!isCalledOnArray)
        {
            this.addDependencyToAllModifications(callExpression);

            if(lengthProperty != null && lengthProperty.lastModificationPosition != null)
            {
                this.globalObject.dependencyCreator.createDataDependency
                (
                    callExpression,
                    lengthProperty.lastModificationPosition.codeConstruct,
                    this.globalObject.getPreciseEvaluationPositionId(),
                    lengthProperty.lastModificationPosition.evaluationPositionId
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
        var fromIndex = callArguments[1] != null ? callArguments[1].jsValue : 0;

        if(fromIndex == null) { fromIndex = 0; }

        if(fromIndex < 0)
        {
            fromIndex = length + fromIndex;
        }

        for(var i = fromIndex; i < length; i++)
        {
            if(searchObject[i] === undefined) { return; }

            if(searchObject[i].jsValue === searchForItem.jsValue)
            {
                return this.globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, i);
            }
        }

        return this.globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, -1)
    }
    catch(e) { fcModel.Array.notifyError("When indexOf array: " + e); }
};

fcModel.Array.prototype.lastIndexOf = function(jsArray, callArguments, callExpression)
{
    try
    {
        this.addDependenciesToAllProperties(callExpression);
        var isCalledOnArray = this.constructor === fcModel.Array;

        if(!isCalledOnArray) { alert("lastIndexOf called on non-array!");}

        var lengthProperty = this.getPropertyValue("length");
        var length = lengthProperty != null ? lengthProperty.jsValue : 0;

        var searchForItem = callArguments[0];
        var fromIndex = callArguments[1] != null ? callArguments[1].jsValue : jsArray.length - 1;

        for(var i = fromIndex; i >= 0; i--)
        {
            if(jsArray[i].jsValue === searchForItem.jsValue)
            {
                return this.globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, i);
            }
        }

        return this.globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, -1);
    }
    catch(e) { fcModel.Array.notifyError("When lastIndexOf array: " + e);}
};

fcModel.Array.prototype.join = function(jsArray, callArguments, callExpression)
{
    try
    {
        this.addDependenciesToAllProperties(callExpression);
        var isCalledOnArray = this.constructor === fcModel.Array;

        if(!isCalledOnArray) { alert("join called on non-array!");}

        var lengthProperty = this.getPropertyValue("length");
        var length = lengthProperty != null ? lengthProperty.jsValue : 0;

        var glue = callArguments[0] != null ? callArguments[0].jsValue : ",";
        var result = "";

        var items = this.items;
        for(var i = 0, length = items.length; i < length; i++)
        {
            result += (i != 0 ? glue : "") + items[i].jsValue;
        }

        return this.globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, result);
    }
    catch(e) { fcModel.Array.notifyError("When join array: " + e); }
};
//</editor-fold>

//<editor-fold desc="Js Property Access">
fcModel.Array.prototype.getJsPropertyValue = function(propertyName, codeConstruct)
{
    return this.getPropertyValue(propertyName, codeConstruct);
};

fcModel.Array.prototype.addJsProperty = function(propertyName, propertyValue, codeConstruct)
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
            this.addProperty("length", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, this.items.length), codeConstruct, false);
        }
    }
    else
    {
        if(propertyName == "length")
        {
            if(this.jsArray[propertyName] !== propertyValue.jsValue)
            {
                var oldLength = this.jsArray.length;
                var newLength = propertyValue.jsValue

                if(newLength < oldLength)
                {
                    this.jsArray.length = newLength;
                    this.items.length = newLength;
                }

                for(var i = newLength; i < oldLength; i++)
                {
                    this.deleteProperty(i, codeConstruct);
                }
            }
        }

        this.addProperty(propertyName, propertyValue, codeConstruct, propertyName != "length");
    }
};
//</editor-fold>

//<editor-fold desc="'Private' methods">
fcModel.Array.prototype._registerCallbacks = function()
{
    this.registerGetPropertyCallback(function(getPropertyConstruct) { this.addDependenciesToAllProperties(getPropertyConstruct); }, this);

    this.registerObjectModifiedCallbackDescriptor
    (
        function(modification)
        {
            this.globalObject.dependencyCreator.createDataDependency
            (
                this.dummyDependencyNode,
                modification.codeConstruct,
                this.globalObject.getPreciseEvaluationPositionId(),
                modification.evaluationPositionId
            );
        },
        this
    );
};

fcModel.Array.prototype._addDefaultProperties = function()
{
    this.addProperty("length", this.globalObject.internalExecutor.createInternalPrimitiveObject(this.creationCodeConstruct, 0), this.creationCodeConstruct, false);
    this.addProperty("__proto__", this.globalObject.fcArrayPrototype, null, false);

    this._addRegExResultArrayProperties();
};

fcModel.Array.prototype._addRegExResultArrayProperties = function()
{
    if(this.jsArray.hasOwnProperty("index")) { this.addProperty("index", this.globalObject.internalExecutor.createInternalPrimitiveObject(this.creationCodeConstruct, this.jsArray.index), this.creationCodeConstruct); }
    if(this.jsArray.hasOwnProperty("input")) { this.addProperty("input", this.globalObject.internalExecutor.createInternalPrimitiveObject(this.creationCodeConstruct, this.jsArray.input), this.creationCodeConstruct); }
};

fcModel.Array.prototype._addPreexistingObjects = function()
{
    var dependencyCreator = this.globalObject.dependencyCreator;

    for(var i = 0; i < this.jsArray.length; i++)
    {
        var item = this.jsArray[i];

        if(item === undefined)
        {
            item = this.globalObject.internalExecutor.createInternalPrimitiveObject(this.creationCodeConstruct, undefined);
        }

        this.push(this.jsArray, item, this.creationCodeConstruct, this, true);

        if(this.jsArray[i] != null && this.jsArray[i].codeConstruct != null)
        {
            dependencyCreator.createDataDependency(this.creationCodeConstruct, this.jsArray[i].codeConstruct);
        }
    }
};
//</editor-fold>
//</editor-fold>
}});