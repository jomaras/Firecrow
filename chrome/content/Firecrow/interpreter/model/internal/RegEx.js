/**
 * User: Jomaras
 * Date: 03.06.12.
 * Time: 07:39
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.RegEx = function(jsRegExp, globalObject, codeConstruct)
{
    try
    {
        this.globalObject = globalObject;
        this.jsRegExp = jsRegExp;

        this.addProperty("lastIndex", new fcModel.JsValue(0, new fcModel.FcInternal(codeConstruct)), codeConstruct);
        this.addProperty("ignoreCase", new fcModel.JsValue(jsRegExp.ignoreCase, new fcModel.FcInternal(codeConstruct)), codeConstruct);
        this.addProperty("global", new fcModel.JsValue(jsRegExp.global, new fcModel.FcInternal(codeConstruct)), codeConstruct);
        this.addProperty("multiline", new fcModel.JsValue(jsRegExp.multiline, new fcModel.FcInternal(codeConstruct)), codeConstruct);
        this.addProperty("source", new fcModel.JsValue(jsRegExp.source, new fcModel.FcInternal(codeConstruct)), codeConstruct);
    }
    catch(e) { this.notifyError("Error when creating RegExp object: " + e); }
};

fcModel.RegEx.prototype = new fcModel.Object(null);

fcModel.RegEx.prototype.notifyError = function(message) { alert("RegEx - " + message); }

fcModel.RegExPrototype = function(globalObject)
{
    try
    {
        this.globalObject = globalObject;

        fcModel.RegExPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            this.addProperty(propertyName, fcModel.Function.createInternalNamedFunction(propertyName), null, false);
        }, this);
    }
    catch(e) { alert("RegExPrototype - error when creating array prototype:" + e); }
};

fcModel.RegExPrototype.prototype = new fcModel.Object(null);

fcModel.RegExPrototype.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS: ["exec","test","toSource"],
        PROPERTIES: ["global", "ignoreCase", "lastIndex", "multiline", "source"]
    }
};

fcModel.RegExFunction = function(globalObject)
{
    try
    {
        this.addProperty("prototype", globalObject.regExPrototype);
        this.isInternalFunction = true;
        this.name = "RegExp";
        this.fcInternal = this;
    }
    catch(e){ alert("RegExp - error when creating RegEx Function:" + e); }
};

fcModel.RegExFunction.prototype = new fcModel.Object(null);
}});