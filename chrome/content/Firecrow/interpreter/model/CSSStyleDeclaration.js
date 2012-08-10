/**
 * User: Jomaras
 * Date: 05.06.12.
 * Time: 15:48
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;
var ValueTypeHelper = Firecrow.ValueTypeHelper;

fcModel.CSSStyleDeclaration = function(htmlElement, cssStyleDeclaration, globalObject, codeConstruct)
{
    try
    {
        this.notifyError = function(message) { alert("CSSStyleDeclaration - " + message)};

        this.globalObject = globalObject;
        this.cssStyleDeclaration = cssStyleDeclaration;
        this.htmlElement = htmlElement;
        this.__proto__ = new fcModel.Object(globalObject);

        if(cssStyleDeclaration == null) { return; }

        var properties = fcModel.CSSStyleDeclaration.CONST.INTERNAL_PROPERTIES.PROPERTIES;

        for(var i = 0, length = properties.length; i < length; i++)
        {
            var propertyName = properties[propertyName];

            this.addProperty(propertyName, cssStyleDeclaration[propertyName], codeConstruct, true);
        }

        var methods = fcModel.CSSStyleDeclaration.CONST.INTERNAL_PROPERTIES.METHODS;

        for(var i = 0, length = methods.length; i < length; i++)
        {
            var method = methods[i];

            this.globalObject.internalExecutor.expandWithInternalFunction(this.cssStyleDeclaration, method);

            this.addProperty(method, this.globalObject.internalExecutor.createInternalFunction(this.cssStyleDeclaration[method], method, this, true), codeConstruct);
        }

        this.registerAddPropertyCallback(function(propertyName, propertyValue, codeConstruct)
        {
            fcModel.HtmlElementExecutor.addDependencyIfImportantElement(this.htmlElement, this.globalObject, codeConstruct);
        }, this);
    }
    catch(e) { this.notifyError("Error when creating Document object: " + e); }
};

fcModel.CSSStyleDeclaration.prototype = new fcModel.Object(null);
fcModel.CSSStyleDeclaration.CONST =
{
    INTERNAL_PROPERTIES :
    {
        METHODS:
        [
            "getPropertyPriority", "getPropertyValue", "item", "removeProperty",
            "setProperty"
        ],
        PROPERTIES:
        [
            "cssText", "length", "parentRule",
            "background", "backgroundAttachment", "backgroundColor", "backgroundImage", "backgroundPosition","backgroundRepeat",
            "border","borderCollapse","borderColor","borderSpacing","borderStyle","borderTop","borderRight","borderBottom",
            "borderLeft","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor","borderTopStyle","borderRightStyle",
            "borderBottomStyle","borderLeftStyle","borderTopWidth","borderRightWidth","borderBottomWidth","borderLeftWidth","borderWidth",
            "borderRadius","borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius","bottom",
            "boxShadow","captionSide","clear","clip","color","content","counterIncrement","counterReset","cursor",
            "direction","display","emptyCells","cssFloat","font","fontFamily","fontSize","fontSizeAdjust","fontStretch",
            "fontStyle","fontVariant","fontWeight","height","left","letterSpacing","lineHeight","listStyle","listStyleImage",
            "listStylePosition","listStyleType","margin","marginTop","marginRight","marginBottom","marginLeft","markerOffset",
            "marks","maxHeight","maxWidth","minHeight","minWidth","orphans","outline","outlineColor","outlineStyle","outlineWidth",
            "overflow","padding","paddingTop","paddingRight","paddingBottom","paddingLeft","page","pageBreakAfter","pageBreakBefore",
            "pageBreakInside","position","quotes","right","size","tableLayout","textAlign","textDecoration","textIndent","textOverflow",
            "textShadow","textTransform","top","unicodeBidi","verticalAlign","visibility","whiteSpace","widows","width","wordSpacing",
            "zIndex","clipPath","clipRule","colorInterpolation","colorInterpolationFilters","dominantBaseline","fill","fillOpacity",
            "fillRule","filter","floodColor","floodOpacity","imageRendering","lightingColor","marker","markerEnd","markerMid",
            "markerStart","mask","shapeRendering","stopColor","stopOpacity","stroke","strokeDasharray",
            "strokeDashoffset","strokeLinecap","strokeLinejoin","strokeMiterlimit","strokeOpacity","strokeWidth",
            "textAnchor","textRendering", "backgroundOrigin"
        ]
    }
};

fcModel.CSSStyleDeclarationExecutor =
{
    executeInternalMethod: function(thisObject, functionObject, arguments, callExpression)
    {
        if(!functionObject.fcInternal.isInternalFunction) { fcModel.HtmlElement.notifyError("The function should be internal when css declaration method!"); return; }

        var functionObjectValue = functionObject.value;
        var thisObjectValue = thisObject.value;
        var functionName = functionObjectValue.name;
        var fcThisValue =  thisObject.fcInternal.object;
        var globalObject = fcThisValue.globalObject;
        var jsArguments =  arguments.map(function(argument){ return argument.value;});

        switch(functionName)
        {
            case "getPropertyPriority":
            case "getPropertyValue":
            case "item":
                return new fcModel.JsValue(thisObjectValue[functionName].apply(thisObjectValue, jsArguments), new fcModel.FcInternal(callExpression));
            case "removeProperty":
            case "setProperty":
            default:
                alert("Unhandled internal method in cssStyleDeclaration:" + functionName); return;
        }
    }
}
}});