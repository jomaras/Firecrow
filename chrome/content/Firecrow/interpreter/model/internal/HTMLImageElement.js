FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;

fcModel.HTMLImageElement = function(globalObject)
{
    try
    {
        this.initObject(globalObject);

        this.prototype = new fcModel.JsValue(globalObject.htmlImageElementPrototype, new fcModel.FcInternal(null, globalObject.htmlImageElementPrototype)) ;
        this.addProperty("prototype", this.prototype);

        this.name = "HTMLImageElement";
        this.fcInternal = { object: this };
    }
    catch(e){ fcModel.HTMLImageElement.notifyError("Error when creating Array Function:" + e); }
};

fcModel.HTMLImageElement.prototype = new fcModel.Object();
fcModel.HTMLImageElement.notifyError = function(message) { alert("HTMLImageElement - " + message);};

fcModel.HTMLImageElementPrototype = function(globalObject)
{
    try
    {
        this.initObject(globalObject);

        this.fcInternal = { object: this };
    }
    catch(e) { fcModel.HTMLImageElement.notifyError("Error when creating array prototype:" + e); }
};

fcModel.HTMLImageElementPrototype.prototype = new fcModel.Object();
/*************************************************************************************/
}});