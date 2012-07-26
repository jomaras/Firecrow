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
}});