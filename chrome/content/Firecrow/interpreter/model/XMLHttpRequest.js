/**
 * User: Jomaras
 * Date: 26.07.12.
 * Time: 16:21
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var FIRECROW_AJAX_PROXY_URL = "http://localhost/Firecrow/proxy/proxy.php";

fcModel.XMLHttpRequest = function(xmlHttpRequestObject, globalObject, codeConstruct)
{
    this.initObject(globalObject, codeConstruct, xmlHttpRequestObject);
    this.constructor = fcModel.XMLHttpRequest;

    this.addProperty("status", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, this.implementationObject.status));
    this.addProperty("readyState", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, 0), codeConstruct);
    this.addProperty("responseType", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, ""), codeConstruct);
    this.addProperty("responseText", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, ""), codeConstruct);

    fcModel.XMLHttpRequestPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
    {
        var internalFunction = globalObject.internalExecutor.createInternalFunction(XMLHttpRequest.prototype[propertyName], propertyName, this, true);
        this[propertyName] = internalFunction;
        this.addProperty(propertyName, internalFunction, null, false);
    }, this);

    this.name = "XMLHttpRequest";

    this.updateToOpened = function(codeConstruct)
    {
        this.addProperty("readyState", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, 1));
    };

    this.updateToSent = function(codeConstruct)
    {
        this.addProperty("readyState", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, 2));
        this.addProperty("status", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, this.status));
        this.addProperty("statusText", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, this.statusText));
    };

    this.updateToLoading = function(codeConstruct)
    {
        this.addProperty("readyState", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, 3));
        this.addProperty("responseText", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, this.responseText));
        this.addProperty("responseType", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, this.responseType));
        this.addProperty("status", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, this.status));
        this.addProperty("statusText", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, this.statusText));
    };

    this.updateToDone = function(codeConstruct)
    {
        this.addProperty("readyState", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, 4));
        this.addProperty("responseText", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, this.responseText));
        this.addProperty("responseType", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, this.responseType));
        this.addProperty("status", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, this.status));
        this.addProperty("statusText", this.globalObject.internalExecutor.createInternalPrimitiveObject(codeConstruct, this.statusText))
    };

    this.updateToNext = function()
    {
        switch(this.getPropertyValue("readyState").jsValue)
        {
            case 1: this.updateToSent(this.sendConstruct); break;
            case 2: this.updateToLoading(this.sendConstruct); break;
            case 3: this.updateToDone(this.sendConstruct); break;
            default: break;
        }
    };
};

fcModel.XMLHttpRequest.prototype = new fcModel.Object();

fcModel.XMLHttpRequestPrototype = function(globalObject)
{
    try
    {
        this.initObject(globalObject);
        this.constructor = fcModel.XMLHttpRequestPrototype;

        fcModel.XMLHttpRequestPrototype.CONST.INTERNAL_PROPERTIES.METHODS.forEach(function(propertyName)
        {
            var internalFunction = globalObject.internalExecutor.createInternalFunction(XMLHttpRequest.prototype[propertyName], propertyName, this, true);
            this[propertyName] = internalFunction;
            this.addProperty(propertyName, internalFunction, null, false);
        }, this);
    }
    catch(e) { Firecrow.Interpreter.Model.RegEx.notifyError("Error when creating regEx prototype:" + e); }
};

fcModel.XMLHttpRequest.notifyError = function(message) { alert("XMLHttpRequest - " + message); }

fcModel.XMLHttpRequestPrototype.prototype = new fcModel.Object();

fcModel.XMLHttpRequestPrototype.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS: ["open","setRequestHeader","send", "abort", "getAllResponseHeaders", "getResponseHeader"],
        PROPERTIES: ["onreadystatechange", "readyState", "response", "responseText", "responseType", "responseXML", "status", "statusText", "timeout", "upload", "withCredentials"]
    }
};

fcModel.XMLHttpRequestFunction = function(globalObject)
{
    try
    {
        this.initObject(globalObject);

        this.addProperty("prototype", globalObject.fcXMLHttpRequestPrototype);

        this.isInternalFunction = true;
        this.name = "XMLHttpRequest";
    }
    catch(e){ Firecrow.Interpreter.Model.XMLHttpRequest.notifyError("Error when creating XMLHttpRequest Function:" + e); }
};

fcModel.XMLHttpRequestFunction.prototype = new fcModel.Object();

fcModel.XMLHttpRequestExecutor =
{
    executeInternalXmlHttpRequestMethod: function(thisObject, functionObject, args, callExpression)
    {
        try
        {
            if(!ValueTypeHelper.isXMLHttpRequest(thisObject.jsValue)) { this.notifyError("The called on object should be a XMLHttpRequest!"); return; }
            if(!functionObject.isInternalFunction) { this.notifyError("The function should be internal when executing XMLHttpRequest method!"); return; }

            var functionObjectValue = functionObject.jsValue;
            var thisObjectValue = thisObject.jsValue;
            var functionName = functionObjectValue.name;
            var fcThisValue =  thisObject.iValue;
            var globalObject = fcThisValue.globalObject;
            var nativeArgs = args.map(function(arg){ return arg.jsValue;});

            //this.addModification(callExpression);
            //this.addDependencyToAllModifications(callExpression);

            switch(functionName)
            {
                case "open":
                    this._updateOpenParameters(fcThisValue, nativeArgs, globalObject, callExpression);
                    this._updateNativeOpenArguments(nativeArgs, globalObject);
                    thisObjectValue[functionName].apply(thisObjectValue, nativeArgs);
                    break;
                case "send":

                    this._updateNativeSendArguments(fcThisValue, nativeArgs);
                    thisObjectValue[functionName].apply(thisObjectValue, nativeArgs);
                    this._updateSendParameters(fcThisValue, callExpression);

                    fcThisValue.async ? this._aggregateEvents(fcThisValue, globalObject, callExpression)
                                      : fcThisValue.updateToDone(callExpression);
                    break;
                case "setRequestHeader":
                    thisObjectValue[functionName].apply(thisObjectValue, nativeArgs);
                    break;
                case "getAllResponseHeaders":
                case "getResponseHeader":
                    return globalObject.internalExecutor.createInternalPrimitiveObject(callExpression, thisObjectValue[functionName].apply(thisObjectValue, nativeArgs));
                default:
                    this.notifyError("Unknown method on XMLHttpRequest object: " + functionName);
            }
        }
        catch(e) { debugger; this.notifyError("Error when executing internal XMLHttpRequest method: " + e); }
    },

    _updateNativeOpenArguments: function(nativeArgs, globalObject)
    {
        nativeArgs[0] = nativeArgs[0] || "GET";
        var url = Firecrow.UriHelper.getAbsoluteUrl(nativeArgs[1], globalObject.browser.url);

        if(Firecrow.UriHelper.areOnSameDomain(url, Firecrow.getDocument().location.href))
        {
            nativeArgs[1] = url;
        }
        else
        {
            var requestUrl = Firecrow.UriHelper.getRequestAddress(url);
            if(nativeArgs[0] == "GET")
            {
                var extendedRequest = Firecrow.UriHelper.appendQuery(url, "csurl", requestUrl);
                nativeArgs[1] = FIRECROW_AJAX_PROXY_URL + "?" + Firecrow.UriHelper.getQuery(extendedRequest);
            }
            else
            {
                nativeArgs[1] = FIRECROW_AJAX_PROXY_URL;
            }
        }

        nativeArgs[2] = false;
        //Apply to native object, but change to sync
    },

    _updateNativeSendArguments: function(fcThisValue, nativeArgs)
    {
        if(fcThisValue.method != "POST") { return; }
        if(nativeArgs[0] == null) { nativeArgs[0] = ""; }

        if(nativeArgs[0] != "") { nativeArgs[0] += "&"; }

        nativeArgs[0] += "csurl=" + encodeURIComponent(fcThisValue.absoluteUrl);
    },

    _updateOpenParameters: function(fcThisValue, nativeArgs, globalObject, callExpression)
    {
        fcThisValue.method = nativeArgs[0] || "GET";
        fcThisValue.url = nativeArgs[1] || "";
        fcThisValue.absoluteUrl = Firecrow.UriHelper.getAbsoluteUrl(nativeArgs[1], globalObject.browser.url);
        fcThisValue.async = nativeArgs[2];
        fcThisValue.user = nativeArgs[3] || "";
        fcThisValue.password = nativeArgs[4] || "";

        fcThisValue.updateToOpened(callExpression);
        fcThisValue.openConstruct = callExpression;
    },

    _updateSendParameters: function(fcThisValue, callExpression)
    {
        fcThisValue.readyState = fcThisValue.implementationObject.readyState;
        fcThisValue.timeout = fcThisValue.implementationObject.timeout;

        fcThisValue.status = fcThisValue.implementationObject.status;
        fcThisValue.responseText = fcThisValue.implementationObject.responseText;
        fcThisValue.response = fcThisValue.implementationObject.response;
        fcThisValue.responseType = fcThisValue.implementationObject.responseType;
        fcThisValue.responseXML = fcThisValue.implementationObject.responseXML;
        fcThisValue.statusText = fcThisValue.implementationObject.statusText;

        fcThisValue.sendConstruct = callExpression;
    },

    _aggregateEvents: function(fcThisValue, globalObject, callExpression)
    {
        for(var i = 0; i < 4; i++)
        {
            globalObject.preRegisterAjaxEvent
            (
                fcThisValue,
                {
                    codeConstruct: callExpression,
                    evaluationPositionId: globalObject.getPreciseEvaluationPositionId()
                }
            );
        }
    },

    notifyError: function(message) { debugger; Firecrow.Interpreter.Model.XMLHttpRequest.notifyError(message);}
};
/*************************************************************************************/
}});