//has to have access to esprima.parse
var PageModelParser =
{
    _encounteredNewLines: 0,
    _pageSource: "",

    parsePageUrl: function()
    {

    },

    parsePageSource: function(pageSource)
    {
        var iFrame = document.createElement("iframe");
        document.documentElement.appendChild(iFrame);
        iFrame.contentDocument.documentElement.innerHTML = pageSource;

        this._pageSource = pageSource;
        this._encounteredNewLines = 0;

        return this._getSimplifiedElement(iFrame.contentDocument.documentElement);
    },

    _getSimplifiedElement: function (rootElement)
    {
        var elem = { type: rootElement.nodeType != 3 ? rootElement.localName : "textNode" };

        var attributes = this._getAttributes(rootElement);
        if(attributes.length != 0) { elem.attributes = attributes; }

        var encounteredNewLines = this._encounteredNewLines;

        var childNodes = this._getChildren(rootElement)
        if(childNodes.length != 0) { elem.childNodes = childNodes; }

        if(rootElement.tagName == "SCRIPT" || rootElement.tagName == "STYLE" || rootElement.nodeType == 3)
        {
            elem.textContent = rootElement.textContent;

            if(rootElement.tagName == "SCRIPT" && elem.textContent != "")
            {
                var model = esprima.parse(elem.textContent, {loc:true, raw:true });


                /*if(model.loc != null)
                {
                    model.loc.start.line += encounteredNewLines;
                    model.loc.end.line += encounteredNewLines;
                }

                Firecrow.ASTHelper.traverseAst(model, function(node)
                {
                    if(node.loc != null)
                    {
                        node.loc.start.line += encounteredNewLines;
                        node.loc.end.line += encounteredNewLines;
                    }
                });*/

                elem.pathAndModel = { model: model };
            }

            if(rootElement.nodeType == 3)
            {
                var newLinesMatch = elem.textContent.match(/(\r)?\n/g);

                if(newLinesMatch)
                {
                    this._encounteredNewLines += newLinesMatch.length;
                }
            }
        }

        return elem;
    },

    _getAttributes: function (element)
    {
        var attributes = [];

        if(element.attributes == null) { return attributes; }

        for(var i = 0; i < element.attributes.length; i++)
        {
            var currentAttribute = element.attributes[i];
            attributes.push
            ({
                name: currentAttribute.name,
                value: currentAttribute.value
            });
        }

        return attributes;
    },

    _getChildren: function (rootElement)
    {
        var allNodes = [];
        if(rootElement.childNodes == null) { return allNodes;}

        for(var i = 0; i < rootElement.childNodes.length;i++)
        {
            var simplifiedNode = this._getSimplifiedElement(rootElement.childNodes[i]);
            if(simplifiedNode != null)
            {
                allNodes.push(simplifiedNode);
            }
        }

        return allNodes;
    }
}