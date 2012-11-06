FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;

fcModel.SimpleXPath = function(xPathExpression)
{
    this.xPathExpression = xPathExpression;
};

fcModel.SimpleXPath.prototype =
{
    getCurrentTag: function()
    {
        var elementRegEx = new RegExp("^/([^/[])*");

        var match = this.xPathExpression.match(elementRegEx);

        if(match != null)
        {
            var matchedString = match[0];

            if(matchedString == null) { return ""; }

            if(matchedString.indexOf("/") == 0) { return matchedString.substring(1);}
        }

        return "";
    },

    getIndex: function()
    {
        var indexRegEx = new RegExp("\\[[^\\]]\\]");

        var currentTag = this.xPathExpression.substring((this.xPathExpression[0] === "/" ? 1 : 0));
        currentTag = currentTag.substring(0, currentTag.indexOf("/"));

        var match = currentTag.match(indexRegEx);

        if(match != null)
        {
            var matchedString = match[0];

            if(matchedString != null)
            {
                var result =  matchedString.replace(/\]$/, "").replace(/^\[/,"");

                if(result != "") { return result - 1; }
            }
        }

        return 0;
    },

    removeLevel: function()
    {
        var startsWithSlash = this.xPathExpression[0] === "/";
        var currentTag = this.xPathExpression.substring(startsWithSlash ? 1 : 0);
        var indexOfSlash = currentTag.indexOf("/");
        currentTag = currentTag.substring(0, indexOfSlash != -1 ? indexOfSlash : currentTag.length);

        this.xPathExpression = this.xPathExpression.substring(currentTag.length + (startsWithSlash ? 1 : 0));

        return this;
    },

    isEmpty: function() { return this.xPathExpression == ""; }
};
/*************************************************************************************/
}});