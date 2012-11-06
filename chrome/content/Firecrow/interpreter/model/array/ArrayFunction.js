FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;

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
    catch(e){ fcModel.Array.notifyError("Error when creating Array Function:" + e); }
};

fcModel.ArrayFunction.prototype = new fcModel.Object(null);
/*************************************************************************************/
}});