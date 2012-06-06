/**
 * User: Jomaras
 * Date: 06.06.12.
 * Time: 08:15
 */
/**
 * User: Jomaras
 * Date: 05.06.12.
 * Time: 16:03
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.ClassList = function(htmlElement, globalObject, codeConstruct)
{
    try
    {
        if(!ValueTypeHelper.isOfType(htmlElement, HTMLElement)) { this.notifyError("Constructor argument has to be a HTMLElement");}
        this.globalObject = globalObject;
        this.htmlElement = htmlElement;

        for(var i = 0, classList = htmlElement.classList, length = classList.length; i < length; i++)
        {
            var className = classList[i];
            this.addProperty(i, new fcModel.JsValue(i, new fcModel.FcInternal(codeConstruct)), codeConstruct);
        }

        this.expandMethods();
    }
    catch(e) { this.notifyError("Error when creating HtmlElement object: " + e); }
};

fcModel.ClassList.prototype = new fcModel.Object(null);

fcModel.ClassList.prototype.notifyError = function(message) { alert("ClassList - " + message); }

fcModel.ClassList.prototype.expandMethods = function()
{
    try
    {
        var internalMethods = fcModel.ClassList.CONST.INTERNAL_PROPERTIES.METHODS;

        var classList = this.htmlElement.classList;

        this.globalObject.internalExecutor.expandWithInternalFunction(classList.add, "add");
        this.globalObject.internalExecutor.expandWithInternalFunction(classList.remove, "remove");
        this.globalObject.internalExecutor.expandWithInternalFunction(classList.toggle, "toggle");
    }
    catch(e) { this.notifyError("Error when expanding methods in ClassList:" + e); }
};

//https://developer.mozilla.org/en/DOM/element
fcModel.ClassList.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS: [ "add", "remove", "toggle"]
    }
};
}});