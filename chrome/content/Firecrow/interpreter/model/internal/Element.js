FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;

fcModel.Element = function(globalObject)
{
    try
    {
        this.initObject(globalObject);

        this.addProperty("prototype", globalObject.fcElementPrototype);

        this.name = "Element";
    }
    catch(e){ fcModel.HTMLImageElement.notifyError("Error when creating Array Function:" + e); }
};

fcModel.Element.prototype = new fcModel.Object();
fcModel.Element.notifyError = function(message) { alert("Element - " + message);};

fcModel.ElementPrototype = function(globalObject)
{
    this.initObject(globalObject);
    this.constructor = fcModel.ElementPrototype;
};

fcModel.ElementPrototype.prototype = new fcModel.Object();
/*************************************************************************************/
}});