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

fcModel.ArrayPrototype = function(globalObject)
{
    try
    {
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
        METHODS: ["pop","push","reverse","shift","sort","splice","unshift","concat","join","slice","indexOf","lastIndexOf","filter","forEach","every","map","some","reduce","reduceRight"]
    }
};

fcModel.ArrayFunction = function(globalObject)
{
    try
    {
        this.addProperty("prototype", globalObject.arrayPrototype);
        this.isInternalFunction = true;
        this.name = "Array";
        this.__FIRECROW_INTERNAL__ = this;
    }
    catch(e){ alert("Array - error when creating Array Function:" + e); }
};

fcModel.ArrayFunction.prototype = new fcModel.Object(null);
}});
