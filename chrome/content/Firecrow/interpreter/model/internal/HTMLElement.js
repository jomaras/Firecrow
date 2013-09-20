FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;

fcModel.HTMLElement = function(globalObject)
{
    try
    {
        this.initObject(globalObject);

        this.addProperty("prototype", globalObject.fcHtmlElementPrototype);


        this.name = "HTMLElement";
    }
    catch(e){ fcModel.HTMLImageElement.notifyError("Error when creating Array Function:" + e); }
};

fcModel.HTMLElement.prototype = new fcModel.Object();
fcModel.HTMLElement.notifyError = function(message) { alert("HTMLElement - " + message);};

fcModel.HTMLElementPrototype = function(globalObject)
{
    this.initObject(globalObject);
    this.addProperty("__proto__", globalObject.fcElementPrototype);
    this.constructor = fcModel.HTMLElementPrototype;
};

fcModel.HTMLElementPrototype.prototype = new fcModel.Object();
/*************************************************************************************/
}});