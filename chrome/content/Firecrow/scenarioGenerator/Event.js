FBL.ns(function() { with (FBL) {
/*****************************************************/
var fcScenarioGenerator = Firecrow.ScenarioGenerator;

fcScenarioGenerator.Event = function(baseObject, type, eventRegistration)
{
    this.baseObject = baseObject;
    this.type = type;
    this.eventRegistration = eventRegistration;
};

fcScenarioGenerator.Event.prototype =
{
    toString: function()
    {
        return this.type + " on " + this._getBaseObjectString();
    },

    _getBaseObjectString: function()
    {
        if(this.baseObject.htmlElement != null) { return this._generateHtmlElementString(this.baseObject.htmlElement); }

        return "unknown base object in event";
    },

    _generateHtmlElementString: function(htmlElement)
    {
        if(htmlElement == null) { return ""; }

        var string = htmlElement.tagName.toLowerCase();

        if(htmlElement.id) { string += "#" + htmlElement.id; }
        if(htmlElement.className) { string += "." + htmlElement.className; }

        return string;
    }
}

fcScenarioGenerator.ParametrizedEvent = function (baseEvent, parameters)
{
    this.baseEvent = baseEvent;
    this.parameters = parameters;
};
/*****************************************************/
}});