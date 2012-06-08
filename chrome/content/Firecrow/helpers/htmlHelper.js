FBL.ns(function () { with (FBL) {
/******/

Firecrow.htmlHelper =
{
	serializeToHtmlJSON: function(htmlDocument)
	{
        try
        {
            var serialized = { };

            var docType = this.getDocumentType(htmlDocument);
            var htmlElement = this.getHtmlElement(htmlDocument);

            var scriptPathsAndModels = Firecrow.fbHelper.getScriptsPathsAndModels();
            var stylesPathsAndModels = Firecrow.fbHelper.getStylesPathsAndModels();

            this._lastUsedId = 0;

            serialized.docType = docType != null ? docType.systemId :"";
            serialized.htmlElement = htmlElement != null ? this.getSimplifiedElement(htmlElement, scriptPathsAndModels, stylesPathsAndModels)
                                                         : "null";

            return serialized;
        }
        catch(e) { alert("Error when serializing to HTML JSON:" + e);}
	},

    _lastUsedId: 0,

	getDocumentType: function(htmlDocument)
	{
		return htmlDocument.childNodes[0] instanceof DocumentType
			?  htmlDocument.childNodes[0]
			:  null;
	},

	getHtmlElement: function(htmlDocument)
	{
		for(var i = 0; i < htmlDocument.childNodes.length; i++)
		{
			if(htmlDocument.childNodes[i] instanceof HTMLHtmlElement)
			{
				return htmlDocument.childNodes[i];
			}
		}

		return null;
	},

	getSimplifiedElement: function(rootElement, scriptPathsAndModels, stylesPathsAndModels)
	{
        try
        {
            var elem =
            {
                type: !(rootElement instanceof Text) ? rootElement.localName : "textNode",
                attributes: this.getAttributes(rootElement),
                childNodes: this.getChildren(rootElement, scriptPathsAndModels, stylesPathsAndModels),
                nodeId: this._lastUsedId++
            };
            var that = this;

            if(rootElement instanceof Text
            || rootElement instanceof HTMLScriptElement)
            {
                elem.textContent = rootElement.textContent;
            }

            if(rootElement instanceof HTMLScriptElement)
            {
                elem.pathAndModel = scriptPathsAndModels.splice(0,1)[0];

                Firecrow.ASTHelper.traverseAst(elem.pathAndModel.model, function (currentElement)
                {
                    currentElement.nodeId = that._lastUsedId++;
                });
            }

            else if (rootElement instanceof HTMLStyleElement
                  || rootElement instanceof HTMLLinkElement)
            {
                elem.pathAndModel = stylesPathsAndModels.splice(0,1)[0];

                var model = elem.pathAndModel.model;

                model.rules.forEach(function(rule)
                {
                    rule.nodeId = that._lastUsedId++;
                });
            }

            return elem;
        }
        catch(e)
        {
            alert("helpers.htmlHelper: Error when getting simplified:" + e);
        }
	},

    getTextNodesBeforeScriptElements: function()
    {
        var allNodes = this.getAllNodes(Firecrow.fbHelper.getCurrentPageDocument());

        var scriptPreviousTextNodesMapping =  [];
        var previousTextNodes = [];

        allNodes.forEach(function (currentNode)
        {
            if(currentNode instanceof Text)
            {
                previousTextNodes.push(currentNode);
            }

            if(currentNode instanceof HTMLScriptElement)
            {
                scriptPreviousTextNodesMapping.push
                ({
                    scriptElement: currentNode,
                    previousTextNodes: Firecrow.ValueTypeHelper.createArrayCopy(previousTextNodes)
                })
            }
        });

        return scriptPreviousTextNodesMapping;
    },

    getAllNodes: function(rootElement)
    {
        var allNodes = [];

        if(rootElement == null || rootElement.childNodes == null) { return allNodes;}

        try
        {
            for(var i = 0; i < rootElement.childNodes.length;i++)
            {
                var currentNode = rootElement.childNodes[i];
                allNodes.push(currentNode);
                Firecrow.ValueTypeHelper.pushAll(allNodes, this.getAllNodes(currentNode));
            }
        }
        catch(e) {alert("helpers.htmlHelper error when getting allNodes:" + e);}

        return allNodes;
    },

	getAttributes: function(element)
	{
		var attributes = [];

		try
		{
			if(element.attributes == null) { return attributes; }

			for(var i = 0; i < element.attributes.length; i++)
			{
				var currentAttribute = element.attributes[i];
				attributes.push
				(
					{
						name: currentAttribute.name,
						value: currentAttribute.nodeValue
					}
				);
			}
		}
		catch(e) { alert("Attributes" + e);}

		return attributes;
	},

	getChildren: function(rootElement, scriptPathsAndModels, stylesPathsAndModels)
	{
		var allNodes = [];

		if(rootElement.childNodes == null) { return allNodes;}

		try
		{
			for(var i = 0; i < rootElement.childNodes.length;i++)
			{
				allNodes.push(this.getSimplifiedElement(rootElement.childNodes[i], scriptPathsAndModels, stylesPathsAndModels));
			}
		}
		catch(e) {alert("Children:" + e);}

		return allNodes;
	}
};
}});