FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.JsValue = function(value, fcInternal)
{
    try
    {
        this.id = fcModel.JsValue.LAST_ID++;

        this.value = value;
        this.fcInternal = fcInternal;
    }
    catch(e) { fcModel.JsValue.notifyError("Error when creating: " + e); }
};

fcModel.JsValue.LAST_ID = 0;
fcModel.JsValue.notifyError = function(message) { alert("JsValue - " + message);}

fcModel.JsValue.prototype =
{
    isFunction: function() { return ValueTypeHelper.isFunction(this.value); },
    isPrimitive: function() { return ValueTypeHelper.isPrimitive(this.value); },
    getPropertyValue: function(propertyName)
    {
        if(propertyName == null || propertyName == "") { fcModel.JsValue.notifyError("When getting property value, the property name must not be empty!"); return; }

        if(ValueTypeHelper.isPrimitive(this.value)) { fcModel.JsValue.notifyError("Still not handling getting properties from primitives"); return; }

        return null;
    },

    createCopy: function(codeConstruct)
    {
        return new fcModel.JsValue(this.value, new fcModel.FcInternal(codeConstruct));
    }
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