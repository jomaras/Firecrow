FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
fcModel.ImageFunction = function(globalObject, codeConstruct)
{
    try
    {
        this.initObject(globalObject);
        this.addProperty("src", new fcModel.fcValue("", "", codeConstruct));

        this.isInternalFunction = true;
        this.name = "Image";
    }
    catch(e){ fcModel.GlobalObject.notifyError("Error when creating image function: " + e); }
};

fcModel.ImageFunction.prototype = new fcModel.Object();
/*************************************************************************************/
}});