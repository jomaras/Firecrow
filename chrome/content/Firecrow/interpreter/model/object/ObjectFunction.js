/**
 * User: Jomaras
 * Date: 06.11.12.
 * Time: 08:35
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
fcModel.ObjectFunction = function(globalObject)
{
    try
    {
        this.__proto__ = new fcModel.Object(globalObject);

        this.prototype = new fcModel.JsValue(globalObject.objectPrototype, new fcModel.FcInternal(null, globalObject.objectPrototype)) ;
        this.addProperty("prototype", globalObject.objectPrototype);

        this.isInternalFunction = true;
        this.name = "Object";
        this.fcInternal = { object: this };
    }
    catch(e){ Firecrow.Interpreter.Model.Object.notifyError("Error when creating Object Function:" + e); }
};

fcModel.ObjectFunction.prototype = new fcModel.Object(null);
/*************************************************************************************/
}});