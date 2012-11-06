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
        if(!ValueTypeHelper.isOfType(htmlElement, HTMLElement) && !ValueTypeHelper.isOfType(htmlElement, DocumentFragment)) { fcModel.ClassList.notifyError("Constructor argument has to be a HTMLElement");}

        this.__proto__ = new fcModel.Object(this.globalObject);

        this.htmlElement = htmlElement;

        var classList = htmlElement.classList;

        if(classList != null)
        {
            for(var i = 0, length = classList.length; i < length; i++)
            {
                this.addProperty(i, new fcModel.JsValue(i, new fcModel.FcInternal(codeConstruct)), codeConstruct);
            }

            this.globalObject.internalExecutor.expandWithInternalFunction(classList.add, "add");
            this.globalObject.internalExecutor.expandWithInternalFunction(classList.remove, "remove");
            this.globalObject.internalExecutor.expandWithInternalFunction(classList.toggle, "toggle");
        }

        this.getJsPropertyValue = function(propertyName, codeConstruct) { fcModel.ClassList.notifyError("get property Class not yet implemented"); };
        this.addJsProperty = function(propertyName, value, codeConstruct) { fcModel.ClassList.notifyError("add property Class not yet implemented"); };
    }
    catch(e) { fcModel.ClassList.notifyError("Error when creating ClassList: " + e); }
};

fcModel.ClassList.notifyError = function(message) { alert("ClassList - " + message); };

fcModel.ClassList.createClassList = function(htmlElement, globalObject, codeConstruct)
{
    var jClassList = new fcModel.ClassList(htmlElement, globalObject, codeConstruct);
    return new fcModel.JsValue(jClassList, new fcModel.FcInternal(codeConstruct, jClassList));
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