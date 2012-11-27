FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;

fcModel.HTMLImageElement = function(globalObject)
{
    try
    {
        this.initObject(globalObject);

        this.addProperty("prototype", globalObject.fcHtmlImagePrototype);

        this.name = "HTMLImageElement";
    }
    catch(e){ fcModel.HTMLImageElement.notifyError("Error when creating Array Function:" + e); }
};

fcModel.HTMLImageElement.prototype = new fcModel.Object();
fcModel.HTMLImageElement.notifyError = function(message) { alert("HTMLImageElement - " + message);};

fcModel.HTMLImageElementPrototype = function(globalObject)
{
    this.initObject(globalObject);
    this.constructor = fcModel.HTMLImageElementPrototype;
};

fcModel.HTMLImageElementPrototype.prototype = new fcModel.Object();
/*************************************************************************************/
}});