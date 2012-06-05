/**
 * User: Jomaras
 * Date: 05.06.12.
 * Time: 08:03
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.Document = function(documentFragment, globalObject)
{
    try
    {
        this.globalObject = globalObject;
        this.documentFragment = documentFragment;

        //this.addProperty("lastIndex", new fcModel.JsValue(0, new fcModel.FcInternal(codeConstruct)), codeConstruct);
    }
    catch(e) { this.notifyError("Error when creating Document object: " + e); }
};

fcModel.Document.prototype = new fcModel.Object(null);

fcModel.Document.prototype.notifyError = function(message) { alert("Document - " + message); }

fcModel.Document.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS: ["exec","test","toSource"],
        PROPERTIES: ["global", "ignoreCase", "lastIndex", "multiline", "source"]
    }
};
}});