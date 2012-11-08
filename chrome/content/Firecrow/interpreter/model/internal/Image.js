FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
fcModel.ImageFunction = function(globalObject)
{
    try
    {
        this.initObject(globalObject);
        this.addProperty("src", new fcModel.JsValue("", new fcModel.FcInternal()));

        this.isInternalFunction = true;
        this.name = "Image";
        this.fcInternal = { object: this };
    }
    catch(e){ fcModel.GlobalObject.notifyError("Error when creating image function: " + e); }
};

fcModel.ImageFunction.prototype = new fcModel.Object();
/*************************************************************************************/
}});