FBL.ns(function () { with (FBL) {
/******/
Firecrow.htmlHelper =
{
    serializeToHtmlJSON: function(htmlDocument, scriptPathsAndModels, stylesPathsAndModels)
    {
        try
        {
            var serialized = { };

            var docType = this.getDocumentType(htmlDocument);
            var htmlElement = this.getHtmlElement(htmlDocument);

            this._lastUsedId = 0;

            serialized.docType = docType != null ? docType.systemId :"";
            serialized.htmlElement = htmlElement != null ? this.getSimplifiedElement(htmlElement, scriptPathsAndModels, stylesPathsAndModels)
                                                         : "null";

            serialized.pageUrl = htmlDocument.baseURI;

            return serialized;
        }
        catch(e) { Components.utils.reportError("Error when serializing to HTML JSON:" + e + " " + e.lineNumber);}
    },

    _lastUsedId: 0,

    getDocumentType: function(htmlDocument)
    {
        return htmlDocument.childNodes[0] != null && htmlDocument.childNodes[0].nodeType == 10
            ?  htmlDocument.childNodes[0]
            :  null;
    },

    getHtmlElement: function(htmlDocument)
    {
        for(var i = 0; i < htmlDocument.childNodes.length; i++)
        {
            if(htmlDocument.childNodes[i].tagName == "HTML")
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
                type: rootElement.nodeType != 3 ? rootElement.localName : "textNode",
                attributes: this.getAttributes(rootElement),
                childNodes: this.getChildren(rootElement, scriptPathsAndModels, stylesPathsAndModels),
                nodeId: this._lastUsedId++
            };

            if(elem.type == null) { return null;}

            var that = this;

            if(rootElement.nodeType == 3 //is text node
            || rootElement.tagName == "SCRIPT")
            {
                elem.textContent = rootElement.textContent;
            }

            if(rootElement.tagName == "SCRIPT")
            {
                elem.pathAndModel = scriptPathsAndModels.splice(0,1)[0];

                Firecrow.ASTHelper.traverseAst(elem.pathAndModel.model, function (currentElement)
                {
                    currentElement.nodeId = that._lastUsedId++;
                });
            }
            else if (rootElement.tagName == "STYLE"
                  || (rootElement.tagName == "LINK" && rootElement.rel != "" && rootElement.rel.toLowerCase() == "stylesheet"))
            {
                elem.pathAndModel = stylesPathsAndModels.splice(0,1)[0];

                var model = elem.pathAndModel.model;

                var textContent = "";

                model.rules.forEach(function(rule)
                {
                    rule.nodeId = that._lastUsedId++;
                    textContent += rule.cssText + "\n";
                });

                Cu.reportError("Current textContent: " + elem.textContent);
                Cu.reportError("Rules textContent: " + textContent);

                elem.textContent = textContent;
            }

            return elem;
        }
        catch(e)
        {
            Cu.reportError("helpers.htmlHelper: Error when getting simplified:" + e);
        }
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
        catch(e) { Cu.reportError("helpers.htmlHelper error when getting allNodes:" + e);}

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
                var value = currentAttribute.value;

                if(element.tagName == "IMG" && currentAttribute.name.toLowerCase() == "src")
                {
                    value = element.src;
                }

                attributes.push
                (
                    {
                        name: currentAttribute.name,
                        value: value
                    }
                );
            }
        }
        catch(e) { Cu.reportError("Attributes" + e);}

        return attributes;
    },

    getElementXPath: function(element)
    {
        var paths = [];

        for (; element && element.nodeType == 1; element = element.parentNode)
        {
            var index = 0;
            for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling)
            {
                if (sibling.localName == element.localName)
                    ++index;
            }

            var tagName = element.localName.toLowerCase();
            var pathIndex = (index ? "[" + (index+1) + "]" : "");
            paths.splice(0, 0, tagName + pathIndex);
        }

        return paths.length ? "/" + paths.join("/") : "";
    },

    getChildren: function(rootElement, scriptPathsAndModels, stylesPathsAndModels)
    {
        var allNodes = [];

        if(rootElement.childNodes == null ||rootElement.tagName == "STYLE" || rootElement.tagName == "LINK") { return allNodes; }

        for(var i = 0; i < rootElement.childNodes.length;i++)
        {
            var simplifiedNode = this.getSimplifiedElement(rootElement.childNodes[i], scriptPathsAndModels, stylesPathsAndModels);

            if(simplifiedNode != null)
            {
                allNodes.push(simplifiedNode);
            }
        }

        return allNodes;
    }
};
}});