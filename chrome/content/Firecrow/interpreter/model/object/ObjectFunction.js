FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
fcModel.ObjectFunction = function(globalObject)
{
    try
    {
        this.initObject(globalObject);

        this.addProperty("prototype", globalObject.fcObjectPrototype);

        this.isInternalFunction = true;
        this.name = "Object";
    }
    catch(e){ fcModel.Object.notifyError("Error when creating Object Function:" + e); }
};

fcModel.ObjectFunction.prototype = new fcModel.Object();
/*************************************************************************************/
}});