FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.fcValue = function(jsValue, iValue, codeConstruct)
{
    try
    {
        this.id = fcModel.fcValue.LAST_ID++;

        this.jsValue = jsValue;
        this.iValue = iValue;
        this.codeConstruct = codeConstruct;

        if(this.iValue != null && this.iValue.isInternalFunction != undefined)
        {
            this.isInternalFunction = this.iValue.isInternalFunction;
        }
    }
    catch(e) { fcModel.fcValue.notifyError("Error when creating: " + e); }
};

fcModel.fcValue.LAST_ID = 0;
fcModel.fcValue.notifyError = function(message) { alert("FcValue - " + message);}

fcModel.fcValue.prototype =
{
    isFunction: function() { return ValueTypeHelper.isFunction(this.jsValue); },
    isPrimitive: function() { return ValueTypeHelper.isPrimitive(this.jsValue); },

    getPropertyValue: function(propertyName)
    {
        if(propertyName == null || propertyName == "") { fcModel.fcValue.notifyError("When getting property value, the property name must not be empty!"); return; }

        if(ValueTypeHelper.isPrimitive(this.jsValue)) { fcModel.fcValue.notifyError("Still not handling getting properties from primitives"); return; }

        return null;
    },

    createCopy: function(codeConstruct)
    {
        return new fcModel.fcValue(this.jsValue, this.iValue, this.codeConstruct);
    }
};
}});