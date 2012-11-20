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
        this.jsRegExp = jsRegExp;

        this.initObject(globalObject, codeConstruct);

        this.addProperty("lastIndex", new fcModel.fcValue(0, 0, codeConstruct), codeConstruct);
        this.addProperty("ignoreCase", new fcModel.fcValue(jsRegExp.ignoreCase, jsRegExp.ignoreCase, codeConstruct), codeConstruct);
        this.addProperty("global", new fcModel.fcValue(jsRegExp.global, jsRegExp.global, codeConstruct), codeConstruct);
        this.addProperty("multiline", new fcModel.fcValue(jsRegExp.multiline, jsRegExp.multiline, codeConstruct), codeConstruct);
        this.addProperty("source", new fcModel.fcValue(jsRegExp.source, jsRegExp.source, codeConstruct), codeConstruct);

        fcModel.RegExPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            var internalFunction = globalObject.internalExecutor.createInternalFunction(this.jsRegExp[propertyName], propertyName, this, true);
            this.addProperty(propertyName, internalFunction, null, false);
        }, this);

        this.modifications = [];

        this.registerGetPropertyCallback(function(getPropertyConstruct)
        {
            this.addDependenciesToAllModifications(getPropertyConstruct);
        }, this);

        this.getJsPropertyValue = function(propertyName, codeConstruct)
        {
            return this.getPropertyValue(propertyName, codeConstruct);
        };

        this.addDependenciesToAllModifications = function(codeConstruct)
        {
            try
            {
                if(codeConstruct == null) { return; }

                for(var i = 0, length = this.modifications.length; i < length; i++)
                {
                    var modification = this.modifications[i];

                    this.globalObject.browser.callDataDependencyEstablishedCallbacks
                    (
                        codeConstruct,
                        modification.codeConstruct,
                        this.globalObject.getPreciseEvaluationPositionId(),
                        modification.evaluationPositionId
                    );
                }
            }
            catch(e)
            {
                Firecrow.Interpreter.Model.RegEx.notifyError("Error when registering getPropertyCallback: " + e + " " + codeConstruct.loc.source);
            }
        }
    }
    catch(e) { Firecrow.Interpreter.Model.RegEx.notifyError("Error when creating RegExp object: " + e); }
};

Firecrow.Interpreter.Model.RegEx.notifyError = function(message) { alert("RegEx - " + message); }
Firecrow.Interpreter.Model.RegEx.prototype = new fcModel.Object();

fcModel.RegExPrototype = function(globalObject)
{
    try
    {
        this.initObject(globalObject);

        fcModel.RegExPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            var internalFunction = globalObject.internalExecutor.createInternalFunction(RegExp.prototype[propertyName], propertyName, this, true);
            this[propertyName] = internalFunction;
            this.addProperty(propertyName, internalFunction, null, false);
        }, this);
    }
    catch(e) { Firecrow.Interpreter.Model.RegEx.notifyError("Error when creating regEx prototype:" + e); }
};

fcModel.RegExPrototype.prototype = new fcModel.Object();

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
        this.initObject(globalObject);

        this.addProperty("prototype", globalObject.fcRegExPrototype);

        this.isInternalFunction = true;
        this.name = "RegExp";
    }
    catch(e){ Firecrow.Interpreter.Model.RegEx.notifyError("Error when creating RegEx Function:" + e); }
};

fcModel.RegExFunction.prototype = new fcModel.Object();

fcModel.RegExExecutor =
{
    executeInternalRegExMethod: function(thisObject, functionObject, arguments, callExpression)
    {
        try
        {
            if(!ValueTypeHelper.isOfType(thisObject.jsValue, RegExp)) { this.notifyError("The called on object should be a regexp!"); return; }
            if(!functionObject.isInternalFunction) { this.notifyError("The function should be internal when executing regexp method!"); return; }

            var functionObjectValue = functionObject.jsValue;
            var thisObjectValue = thisObject.jsValue;
            var functionName = functionObjectValue.name;
            var fcThisValue =  thisObject.iValue;

            switch(functionName)
            {
                case "exec":
                    var result = thisObjectValue[functionName].apply(thisObjectValue, arguments.map(function(argument){ return argument.jsValue;}));
                    fcThisValue.addProperty("lastIndex", new fcModel.fcValue(thisObjectValue.lastIndex, thisObjectValue.lastIndex, callExpression),callExpression);

                    fcThisValue.addDependenciesToAllModifications(callExpression);
                    fcThisValue.modifications.push({codeConstruct: callExpression, evaluationPositionId: fcThisValue.globalObject.getPreciseEvaluationPositionId()});

                    if(result == null) { return new fcModel.fcValue(null, null, callExpression); }
                    else if (ValueTypeHelper.isArray(result))
                    {
                        return fcThisValue.globalObject.internalExecutor.createArray(callExpression, result.map(function(arg)
                        {
                            return new fcModel.fcValue(arg, arg, callExpression);
                        }));
                    }
                    else { this.notifyError("Unknown result when exec regexp"); return null; }
                case "test":
                    var result = thisObjectValue[functionName].apply(thisObjectValue, arguments.map(function(argument){ return argument.jsValue;}));
                    return new fcModel.fcValue(result, result, callExpression);
                case "toSource":
                    this.notifyError("ToSource not supported on regExp!");
                    return null;
                default:
                    this.notifyError("Unknown method on string");
            }
        }
        catch(e) {this.notifyError("Error when executing internal RegEx method: " + e); }
    },

    notifyError: function(message) { Firecrow.Interpreter.Model.RegEx.notifyError(message);}
};
}});