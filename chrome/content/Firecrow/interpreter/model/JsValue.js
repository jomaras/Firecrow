/**
 * User: Jomaras
 * Date: 25.05.12.
 * Time: 08:15
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.JsValue = function(value, fcInternal)
{
    try
    {
        this.value = value;
        this.fcInternal = fcInternal;
        this.id = fcModel.JsValue.LAST_ID++;
    }
    catch(e) { alert("JsValue - error when creating: " + e); }
};

fcModel.JsValue.LAST_ID = 0;
fcModel.JsValue.notifyError = function(message) { alert("JsValue - " + message);}

fcModel.JsValue.prototype =
{
    isFunction: function() { return ValueTypeHelper.isFunction(this.value); },
    isPrimitive: function() { return ValueTypeHelper.isPrimitive(this.value); },
    getPropertyValue: function(propertyName)
    {
        if(propertyName == null || propertyName == "") { this.notifyError("When getting property value, the property name must not be empty!"); return; }

        if(ValueTypeHelper.isPrimitive(this.value)) { this.notifyError("Still not handling getting properties from primitives"); return; }
    },

    createCopy: function(codeConstruct)
    {
        return new fcModel.JsValue(this.value, new fcModel.FcInternal(codeConstruct));
    },

    notifyError: function(message) { Firecrow.Interpreter.Model.JsValue.notifyError(message); }
};

fcModel.FcInternal = function(codeConstruct, object)
{
    this.codeConstruct = codeConstruct;
    if(object != null) { this.object = object; }

    if(this.object != null && this.object.isInternalFunction != undefined)
    {
        this.isInternalFunction = this.object.isInternalFunction;
    }
}
}});