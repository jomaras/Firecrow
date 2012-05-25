/**
 * User: Jomaras
 * Date: 10.05.12.
 * Time: 09:56
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
const fcModel = Firecrow.Interpreter.Model;
const ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.Array = function(globalObject, codeConstruct)
{
    try
    {
        this.globalObject = globalObject;
        this.items = [];

        this.addProperty("__proto__", globalObject.arrayPrototype);
    }
    catch(e) { alert("Array - error when creating array object: " + e); }
};

fcModel.Array.prototype = new fcModel.Object(null);

fcModel.Array.prototype.push = function(item, codeConstruct)
{
    try
    {
        this.items.push(item);
        this.addProperty(this.items.length - 1, item, codeConstruct);
    }
    catch(e) { alert("Array - error when pushing item: " + e); }
};

fcModel.Array.prototype.pop = function(codeConstruct)
{
    try
    {
        this.deleteProperty(this.items.length - 1, codeConstruct);

        return this.items.pop();
    }
    catch(e) { alert("Array - error when popping item: " + e); }
};

fcModel.Array.prototype.reverse = function(codeConstruct)
{
    try
    {
        this.items.reverse();

        for(var i = 0; i < this.items.length; i++)
        {
            this.addProperty(i, this.items[i], codeConstruct);
        }
    }
    catch(e) { alert("Array - error when reversing the array: " + e); }
};

fcModel.Array.prototype.shift = function(codeConstruct)
{
    try
    {
        this.deleteProperty(this.items.length - 1, codeConstruct);

        this.items.shift();

        for(var i = 0; i < this.items.length; i++)
        {
            this.addProperty(i, this.items[i], codeConstruct);
        }
    }
    catch(e) { alert("Array - error when shifting items in array: " + e); }
};

fcModel.Array.prototype.unshift = function(elementsToAdd, codeConstruct)
{
    try
    {
        for(var i = 0; i < this.items.length; i++) { this.deleteProperty(i, codeConstruct); }

        for(var i = elementsToAdd.length - 1; i >= 0; i--)
        {
            this.items.unshift(elementsToAdd[i]);
        }

        for(var i = 0; i < this.items.length; i++)
        {
            this.addProperty(i, this.items[i], codeConstruct);
        }
    }
    catch(e) { alert("Array - error when unshifting items in array: " + e); }
};

fcModel.Array.prototype.splice = function(arguments, codeConstruct)
{
    try
    {
        for(var i = 0; i < this.items.length; i++) { this.deleteProperty(i, codeConstruct); }

        this.items.splice.apply(this.items, arguments);

        for(var i = 0; i < this.items.length; i++) { this.addProperty(i, this.items[i], codeConstruct); }
    }
    catch(e) { alert("Array - error when popping item: " + e); }
};

fcModel.Array.prototype.notifyError = function(message) { alert("Array - " + message); }


fcModel.ArrayPrototype = function(globalObject)
{
    try
    {
        this.globalObject = globalObject;
        //https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array#Methods_2
        fcModel.ArrayPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            this.addProperty(propertyName, fcModel.Function.createInternalNamedFunction(propertyName), null, false);
        }, this);
    }
    catch(e) { alert("Array - error when creating array prototype:" + e); }
};

fcModel.ArrayPrototype.prototype = new fcModel.Object(null);

fcModel.ArrayPrototype.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS: ["pop","push","reverse","shift","sort","splice","unshift","concat","join","slice","indexOf","lastIndexOf","filter","forEach","every","map","some","reduce","reduceRight"],
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
    evaluateCallbackReturn: function(callbackCommand, arrayObject, callbackFunction, resultingObject, returnValue)
    {
        try
        {
            if(!ValueTypeHelper.isArray(arrayObject.value)) { this.notifyError("When evaluating callback return the argument has to be an array!"); return; }

            if(callbackFunction == null || callbackFunction.value == null) { this.notifyError("Callback function can not be null"); }

            var callbackFunctionValue = callbackFunction.value;
            var resultingObjectValue = resultingObject.value;

            if(callbackFunctionValue.name == "filter")
            {
                if(!ValueTypeHelper.isArray(resultingObjectValue)) { this.notifyError("A new array should be created when calling filter: " + e); return; }

                if(returnValue)
                {
                    resultingObject.fcInternal.array.push(callbackCommand.argumentValues[0]);
                    resultingObjectValue.push(callbackCommand.argumentValues[0]);
                }
            }
            else if(callbackFunctionValue.name == "map")
            {
                if(!ValueTypeHelper.isArray(resultingObjectValue)) { this.notifyError("A new array should be created when calling filter: " + e); return; }

                resultingObject.fcInternal.array.push(returnValue);
                resultingObjectValue.push(returnValue);
            }
            else if(callbackFunctionValue.name == "forEach") { }
            else if(callbackFunctionValue.name == "sort") { this.notifyError("Still not handling evaluate return from sort!"); return; }
            else if(callbackFunctionValue.name == "every") { this.notifyError("Still not handling evaluate return from every"); return; }
            else if(callbackFunctionValue.name == "some") { this.notifyError("Still not handling evaluate return from some"); return; }
            else if(callbackFunctionValue.name == "reduce") { this.notifyError("Still not handling evaluate return from reduce"); return; }
            else if(callbackFunctionValue.name == "reduceRight") { this.notifyError("Still not handling evaluate return from reduceRight"); return; }
        }
        catch(e){ this.notifyError("Error when evaluating callback return!"); }
    },

    notifyError: function(message) { alert("ArrayCallbackEvaluator - " + message); }
};
}});
