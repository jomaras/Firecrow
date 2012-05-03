FBL.ns(function () { with (FBL) {
/******/

Firecrow.htmlHelper = 
{
	serializeToHtmlJSON: function(htmlDocument)
	{
		var serialized = { };
		
		var docType = this.getDocumentType(htmlDocument);
		var htmlElement = this.getHtmlElement(htmlDocument);
		
		serialized.docType = docType != null ? docType.systemId :"";
		serialized.htmlElement = htmlElement != null ? this.getSimplifiedElement(htmlElement) : "null";
		
		return serialized;
	},
	
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
	
	getSimplifiedElement: function(rootElement)
	{
		var elem =  
		{
			type: !(rootElement instanceof Text) ? rootElement.localName : "textNode",
			attributes: this.getAttributes(rootElement),
			children: this.getChildren(rootElement)
		};
		
		if(rootElement instanceof Text
		|| rootElement instanceof HTMLScriptElement)
		{
			elem.textContent = rootElement.textContent;
		}
		
		return elem;
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
	
	getChildren: function(rootElement)
	{
		var allNodes = [];
		
		if(rootElement.childNodes == null) { return allNodes;}
		
		try
		{
			for(var i = 0; i < rootElement.childNodes.length;i++)
			{
				allNodes.push(this.getSimplifiedElement(rootElement.childNodes[i]));
			}
		}
		catch(e) {alert("Children:" + e);}
		
		return allNodes;
	}
};
}});