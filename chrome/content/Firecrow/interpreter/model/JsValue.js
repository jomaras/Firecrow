/**
 * User: Jomaras
 * Date: 25.05.12.
 * Time: 08:15
 */
FBL.ns(function() { with (FBL) {
    /*************************************************************************************/
    const fcModel = Firecrow.Interpreter.Model;
    const ValueTypeHelper = Firecrow.ValueTypeHelper;

    fcModel.JsValue = function(value, fcInternal)
    {
        try
        {
            this.value = value;
            this.fcInternal = fcInternal;
        }
        catch(e) { alert("JsValue - error when creating: " + e); }
    };

    fcModel.JsValue.prototype =
    {
         isFunction: function() { return ValueTypeHelper.isFunction(this.value); }
    };
}});