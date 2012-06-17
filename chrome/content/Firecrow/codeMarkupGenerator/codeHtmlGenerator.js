/**
 * User: Jomaras
 * Date: 07.06.12.
 * Time: 11:32
 */
FBL.ns(function () { with (FBL) {
/*******/

var astHelper = Firecrow.ASTHelper;
var valueTypeHelper = Firecrow.ValueTypeHelper;

Firecrow.CodeHtmlGenerator =
{
    generateHtmlRepresentation: function(root)
    {
        try
        {
            //generate the main container
            var html = "<div class='htmlRepresentation'>";

            // generate the HTML Document Type Definition
            html += this.generateHtmlDocumentTypeTags(root.docType);

            // generate the <html> oppening tags
            html += '<div class="node html" id="node' + FBL.Firecrow.CodeMarkupGenerator.formatId(root.htmlElement.nodeId) + '">'
                 + this.generateOpeningTags(root.htmlElement.type, root.htmlElement.attributes);

            // generate <head>
            var htmlHeadNode = root.htmlElement.childNodes[0];

            html += '<div class="node head indented" id="node' + FBL.Firecrow.CodeMarkupGenerator.formatId(htmlHeadNode.nodeId) + '">'
                 + this.generateOpeningTags(htmlHeadNode.type, htmlHeadNode.attributes);

            // generate <head> childNodes
            for (var i = 0; i < htmlHeadNode.childNodes.length; i++)
            {
                html += this.generateHtmlElement(htmlHeadNode.childNodes[i]);
            }

            // generate </head>
            html += this.generateClosingTags(htmlHeadNode.type) + '</div>';

            // generate <body>
            var htmlBodyNode = root.htmlElement.childNodes[2];
            html += '<div class="node body indented" id="node'
                + FBL.Firecrow.CodeMarkupGenerator.formatId(htmlBodyNode.nodeId) + '">'
                + this.generateOpeningTags(htmlBodyNode.type, htmlBodyNode.attributes);

            // generate <body> childNodes
            for (var i = 0; i < htmlBodyNode.childNodes.length; i++)
            {
                html += this.generateHtmlElement(htmlBodyNode.childNodes[i]);
            }
            // generate </body>
            html += this.generateClosingTags(htmlBodyNode.type) + '</div>';

            // generate </html>
            html += this.generateClosingTags(root.htmlElement.type) + '</div>';

            // close the main container
            html += '</div>';

            return html;
        }
        catch(e)
        {
            alert("Error while creating a HTML representation of the site: " + e);
        }
    },

    generateHtmlDocumentTypeTags: function(documentType)
    {
        var docTypeHtml = '<div class="node documentType">';

        if (documentType == "") { docTypeHtml += '&#60;&#33;DOCTYPE html&#62;'; }
        else if (documentType === "http://www.w3.org/TR/html4/strict.dtd") { docTypeHtml += '&#60;&#33;DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"&#62;';}
        else if (documentType === "http://www.w3.org/TR/html4/loose.dtd") { docTypeHtml += '&#60;&#33;DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"&#62;'; }
        else if (documentType === "http://www.w3.org/TR/html4/frameset.dtd") { docTypeHtml += '&#60;&#33;DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd"&#62;'; }
        else if (documentType === "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd") { docTypeHtml += '&#60;&#33;DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"&#62;'; }
        else if (documentType === "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd") { docTypeHtml += '&#60;&#33;DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&#62;'; }
        else if (documentType === "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd") { docTypeHtml += '&#60;&#33;DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd"&#62;'; }
        else if (documentType === "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd") { docTypeHtml += '&#60;&#33;DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"&#62;'; }
        else { return "";}

        docTypeHtml += '</div>';

        return docTypeHtml;
    },

    generateOpeningTags: function (elementType, elementAttributes)
    {
        if(elementType === 'textNode') { return ''};

        var html = '';

        // generate <elementType attribute[0].name="attribute[0].value" ... attribute[N].name="attribute[N].value">
        // <elementType
        html += '&#60;' + '<span class="node htmlTag">' + elementType + '</span>';
        for (var i = 0; i < elementAttributes.length; i++)
        {
            html += " " + '<span class="node htmlAttributeName">' + elementAttributes[i].name + '</span>=';
            html += '"' + '<span class="node htmlAttributeValue">' + elementAttributes[i].value + '"</span>';
        }
        // generate >
        html += '&#62;';

        return html;
    },

    generateClosingTags: function (elementType)
    {
        if(elementType === "textNode") { return "" };

        var html = "";
        html += '&#60;<span class="node htmlTag">&#47;' + elementType + "</span>&#62;";
        return html;
    },

    generateHtmlElement: function(element)
    {
        try
        {
            var html = "";

            html += '<div class="node ' + element.type + " indented" + '" id="node' + FBL.Firecrow.CodeMarkupGenerator.formatId(element.nodeId) + '">'
                 + this.generateOpeningTags(element.type, element.attributes);

            if (element.type === "script")
            {
                var isExternScript = false;
                var _path = "";

                for (var i = 0; i < element.attributes.length; i++)
                {
                    if (element.attributes[i].name === "src")
                    {
                        isExternScript = true;
                        _path = element.attributes[i].value;
                    }
                }

                if (isExternScript)
                {
                    this.javascript.push(
                        {
                            path: _path,
                            name: "test",
                            representation: FBL.Firecrow.CodeMarkupGenerator.generateHtml(element.pathAndModel.model)
                        }
                    );
                }
                else
                {
                    html += FBL.Firecrow.CodeMarkupGenerator.generateHtml(element.pathAndModel.model);
                }

            }
            else if (element.type === "link")
            {
                // Check if the link is a stylesheet
                var isLinkStyleSheet = false;
                var _path = "";

                for (var i = 0; i < element.attributes.length; i++)
                {
                    if (element.attributes[i] != undefined)
                    {
                        if (element.attributes[i].name === "rel"
                            && element.attributes[i].value.toLowerCase() == "stylesheet")
                        {
                            isLinkStyleSheet = true;
                        }
                        if (element.attributes[i].name === "type"
                            && element.attributes[i].value.toLowerCase() === "text/css")
                        {
                            isLinkStyleSheet = true;
                        }

                        if(element.attributes[i].name === "href")
                        {
                            _path = element.attributes[i].value;
                        }
                    }
                }

                if (isLinkStyleSheet)
                {
                    this.cssStyle.push(
                        {
                            path: _path,
                            name: "test",
                            representation: this.generateCSSRepresentation(element.pathAndModel.model)
                        }
                    );
                }
            }
            else if (element.type === "style")
            {
                html += this.generateCSSRepresentation(element.pathAndModel.model);
            }
            else
            {
                if(element.textContent != undefined)
                    html += element.textContent;

                for(var i=0; i < element.childNodes.length; i++)
                    html += '<span class="node htmlContent">' + this.generateHtmlElement(element.childNodes[i]) + '</span>';

            }

            if (this.doesElementHaveClosingTags(element.type))
                html += this.generateClosingTags(element.type);
            html += "</div>";

            return html;
        }
        catch(e) { alert("Error while generating a html element: " + e);}
    },

    generateCSSRepresentation: function(cssModel)
    {
        try
        {
            var html = "<div class=\"cssContainer\">";
            var cssRules = "";
            var rulesArray = [];
            for(var i = 0; i < cssModel.rules.length; i++)
            {
                // if rule is @charset
                if (cssModel.rules[i].cssText[0] == "@")
                {
                    html += '<div class="node cssCharset" id="node' + cssModel.rules[i].nodeId + '">' + cssModel.rules[i].cssText + '</div>';
                }
                else
                {
                    cssRules = cssModel.rules[i].cssText.replace(cssModel.rules[i].selector, "");

                    cssRules = cssRules.replace("{", "");
                    cssRules = cssRules.replace("}", "");
                    while(cssRules[0] === " ")
                        cssRules = cssRules.replace(" ", "");

                    html += '<div class="node cssRule" id="node' + FBL.Firecrow.CodeMarkupGenerator.formatId(cssModel.rules[i].nodeId) +'">';
                    //html += '<span class="node cssSelector">' + cssModel.rules[i].selector + "</span><br>";
                    html += '<span class="node cssSelector">' + cssModel.rules[i].selector + '</span><br>';
                    html += "{ <br>";

                    rulesArray = cssRules.split("; ");

                    for(var j = 0; j < rulesArray.length; j++)
                    {
                        if(rulesArray[j] != "")
                            html += "<span class=\"cssRule\">" + rulesArray[j] + ";</span><br>";
                    }
                    html += '} </div>';
                }
            }

            html += "</div>";
            return html;
        }
        catch(e) { alert("Error while generating HTML representation of CSS: " + e); }
    },

    doesElementHaveClosingTags: function(elementType)
    {
        return !(elementType === "area"
            || elementType === "base"
            || elementType === "br"
            || elementType === "basefont"
            || elementType === "col"
            || elementType === "frame"
            || elementType ===  "hr"
            || elementType === "img"
            || elementType === "input"
            || elementType === "meta"
            //|| elementType === "link"
            //|| elementType === "script"
            || elementType === "param");
    }
}
}});