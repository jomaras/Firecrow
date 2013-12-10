var usesModule = typeof module !== 'undefined' && module.exports;
if(usesModule)
{
    FBL =  { Firecrow: {}, ns:  function(namespaceFunction){ namespaceFunction(); }};

    var path = require('path');
    var CodeTextGenerator = require(path.resolve(__dirname, "codeTextGenerator.js")).CodeTextGenerator;
}

var CodeMarkupGenerator;
FBL.ns(function () { with (FBL) {
    /*******/
    var ASTHelper = Firecrow.ASTHelper;
    var ValueTypeHelper = Firecrow.ValueTypeHelper;

    if(ValueTypeHelper == null && usesModule)
    {
        ValueTypeHelper = require(path.resolve(__dirname, "../helpers/valueTypeHelper.js")).ValueTypeHelper;
    }

    if(ASTHelper == null && usesModule)
    {
        ASTHelper = require(path.resolve(__dirname, "../helpers/ASTHelper.js")).ASTHelper;
    }

    Firecrow.CodeMarkupGenerator = CodeMarkupGenerator =
    {
        generateHtmlRepresentation: function(root)
        {
            try
            {
                return "<div class='htmlRepresentation'>" //generate the main container
                        + this.generateHtmlDocumentTypeTags(root.docType) // generate the HTML Document Type Definition
                        + this.generateHtmlElement(root.htmlElement)
                     + '</div>';
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
            if(elementType === 'textNode' || elementAttributes == null) { return ''};

            var html = '';

            // generate <elementType attribute[0].name="attribute[0].value" ... attribute[N].name="attribute[N].value">
            // <elementType
            html += '&#60;<span class="node htmlTag">' + elementType + '</span>';

            for (var i = 0; i < elementAttributes.length; i++)
            {
                html += '<span class="node htmlAttributeName"> ' + elementAttributes[i].name + '</span>=';
                html += '<span class="node htmlAttributeValue">"' + elementAttributes[i].value + '"</span>';
            }
            // generate >
            html += '&#62;';

            return html;
        },

        generateClosingTags: function (elementType)
        {
            if(elementType === "textNode") { return "" };

            return '&#60;&#47;<span class="node htmlTag">' + elementType + "</span>&#62;";
        },

        generateHtmlElement: function(element)
        {
            try
            {
                if(element.type == "textNode") { return element.textContent.trim() != "" ? "<span class='label'>" + element.textContent + "</span>" : ""; }

                var html = '<div class="node ' + element.type + (element.type != "html" ? " indented" : "") + '" id="node' + this.formatId(element.nodeId) + '">'
                          + this.generateOpeningTags(element.type, element.attributes);

                if (element.type === "script")
                {
                    html += this.generateHtml(element.pathAndModel.model);
                }
                else if (element.type === "link")
                {
                    // Check if the link is a stylesheet
                    var isLinkStyleSheet = false;

                    for (var i = 0; i < element.attributes.length; i++)
                    {
                        var attribute = element.attributes[i];
                        if (attribute != undefined)
                        {
                            if (attribute.name === "rel" && attribute.value.toLowerCase() == "stylesheet"
                            ||  attribute.name === "type" && attribute.value.toLowerCase() === "text/css")
                            {
                                html += this.generateCSSRepresentation(element.pathAndModel.model);
                            }
                        }
                    }
                }
                else if (element.type === "style")
                {
                    html += this.generateCSSRepresentation(element.pathAndModel.model);
                }
                else
                {
                    if(element.textContent != undefined) { html += element.textContent; }

                    if(element.childNodes != null)
                    {
                        for(var i=0; i < element.childNodes.length; i++)
                        {
                            html += this.generateHtmlElement(element.childNodes[i]);
                        }
                    }
                }

                if(this.doesElementHaveClosingTags(element.type))
                {
                    html += this.generateClosingTags(element.type);
                }

                html += '</div>';

                return html;
            }
            catch(e) { debugger; alert("Error while generating a html element: " + e);}
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
                || elementType === "param");
        },

        generateHtml: function(element)
        {
            try
            {
                if(element == null) { return ""; }

                     if (ASTHelper.isProgram(element)) { return this.generateProgram(element); }
                else if (ASTHelper.isStatement(element)) { return this.generateStatement(element); }
                else if (ASTHelper.isExpression(element)) { return this.generateExpression(element); }
                else if (ASTHelper.isSwitchCase(element)) { return this.generateFromSwitchCase(element); }
                else if (ASTHelper.isCatchClause(element)) { return this.generateFromCatchClause(element); }
                else if (ASTHelper.isFunction(element)) { return this.generateFromFunction(element); }
                else if (ASTHelper.isVariableDeclaration(element)) { return this.generateFromVariableDeclaration(element); }
                else if (ASTHelper.isVariableDeclarator(element)) { return this.generateFromVariableDeclarator(element); }
                else if (ASTHelper.isLiteral(element)) { return this.generateFromLiteral(element); }
                else if (ASTHelper.isIdentifier(element)) { return this.generateFromIdentifier(element); }
                else
                {
                    alert("Error while generating HTML in codeMarkupGenerator: unidentified ast element."); return "";
                }
            }
            catch(e)
            {   debugger;
                alert("Error while generating HTML in codeMarkupGenerator: " + e);
            }
        },

        generateProgram: function(program)
        {
            try
            {
                var html = "<div class=\"jsContainer\">";
                var body = program.body;

                for(var i = 0; i < body.length; i++)
                {
                    html += this.generateHtml(body[i]);
                }

                return html + "</div>";
            }
            catch(e) { alert("Error when generating program HTML"); }
        },

        generateStatement: function(statement)
        {
            try
            {
                     if (ASTHelper.isEmptyStatement(statement))  { return this.generateFromEmptyStatement(statement); }
                else if (ASTHelper.isBlockStatement(statement)) { return this.generateFromBlockStatement(statement); }
                else if (ASTHelper.isExpressionStatement(statement)) { return this.generateFromExpressionStatement(statement); }
                else if (ASTHelper.isIfStatement(statement)) { return this.generateFromIfStatement(statement); }
                else if (ASTHelper.isWhileStatement(statement)) { return this.generateFromWhileStatement(statement); }
                else if (ASTHelper.isDoWhileStatement(statement)) { return this.generateFromDoWhileStatement(statement); }
                else if (ASTHelper.isForStatement(statement)) { return this.generateFromForStatement(statement); }
                else if (ASTHelper.isForInStatement(statement)) { return this.generateFromForInStatement(statement); }
                else if (ASTHelper.isLabeledStatement(statement)) { return this.generateFromLabeledStatement(statement); }
                else if (ASTHelper.isBreakStatement(statement)) { return this.generateFromBreakStatement(statement); }
                else if (ASTHelper.isContinueStatement(statement)) { return this.generateFromContinueStatement(statement); }
                else if (ASTHelper.isReturnStatement(statement)) { return this.generateFromReturnStatement(statement); }
                else if (ASTHelper.isWithStatement(statement)) { return this.generateFromWithStatement(statement); }
                else if (ASTHelper.isTryStatement(statement)) { return this.generateFromTryStatement(statement); }
                else if (ASTHelper.isThrowStatement(statement)) { return this.generateFromThrowStatement(statement); }
                else if (ASTHelper.isSwitchStatement(statement)) { return this.generateFromSwitchStatement(statement); }
                else { alert("Error: AST Statement element not defined: " + statement.type);  return "";}
            }
            catch(e) { debugger; alert("Error when generating HTML from a statement: " + e); }
        },

        generateExpression: function(expression)
        {
            try
            {
                if (ASTHelper.isAssignmentExpression(expression)) { return this.generateFromAssignmentExpression(expression); }
                else if (ASTHelper.isUnaryExpression(expression)) { return this.generateFromUnaryExpression(expression); }
                else if (ASTHelper.isBinaryExpression(expression)) { return this.generateFromBinaryExpression(expression); }
                else if (ASTHelper.isLogicalExpression(expression)) { return this.generateFromLogicalExpression(expression); }
                else if (ASTHelper.isLiteral(expression)) { return this.generateFromLiteral(expression); }
                else if (ASTHelper.isIdentifier(expression)) { return this.generateFromIdentifier(expression); }
                else if (ASTHelper.isUpdateExpression(expression)) { return this.generateFromUpdateExpression(expression); }
                else if (ASTHelper.isNewExpression(expression)) { return this.generateFromNewExpression(expression); }
                else if (ASTHelper.isConditionalExpression(expression)) { return this.generateFromConditionalExpression(expression); }
                else if (ASTHelper.isThisExpression(expression)) { return this.generateFromThisExpression(expression); }
                else if (ASTHelper.isCallExpression(expression)) { return this.generateFromCallExpression(expression); }
                else if (ASTHelper.isMemberExpression(expression)) { return this.generateFromMemberExpression(expression); }
                else if (ASTHelper.isSequenceExpression(expression)) { return this.generateFromSequenceExpression(expression); }
                else if (ASTHelper.isArrayExpression(expression)) { return this.generateFromArrayExpression(expression); }
                else if (ASTHelper.isObjectExpression(expression)) { return this.generateFromObjectExpression(expression); }
                else if (ASTHelper.isFunctionExpression(expression)) { return this.generateFromFunction(expression, true); }
                else { alert("Error: AST Expression element not defined: " + expression.type);  return "";}
            }
            catch(e) { alert("Error when generating HTML from an expression:" + e); }
        },

        generateFromFunction: function(functionDecExp)
        {
            try
            {
                var _class = functionDecExp.type + " node" + this._generateHasBeenExecutedClass(functionDecExp);
                var _id = "node" + this.formatId(functionDecExp.nodeId);
                var _style = this.getStyle(functionDecExp);

                var nodeType = ASTHelper.isFunctionExpression(functionDecExp) ? "span" : "div";

                var shouldBeInParentheses = ASTHelper.isFunctionExpression(functionDecExp)
                                         && ASTHelper.isCallExpressionCallee(functionDecExp);

                return this.getStartElementHtml(nodeType, { class: _class, id : _id, style: _style })
                     + (shouldBeInParentheses ? this._LEFT_PARENTHESIS : "")
                     + this.getElementHtml("span", {class: "keyword"}, this._FUNCTION_KEYWORD) + " " + (functionDecExp.id != null ? this.generateFromIdentifier(functionDecExp.id) + " " : "")
                     + this.generateFunctionParametersHtml(functionDecExp)
                     + this.generateFromFunctionBody(functionDecExp)
                     + (shouldBeInParentheses ? this._RIGHT_PARENTHESIS : "")
                     + this.getEndElementHtml(nodeType);
            }
            catch(e) { alert("Error when generating HTML from a function:" + e); }
        },

        generateFunctionParametersHtml: function(functionDecExp)
        {
            var html = this._LEFT_PARENTHESIS;

            for(var i = 0; i < functionDecExp.params.length; i++)
            {
                if(i != 0) { html += ", "; }

                html += this.generateFromPattern(functionDecExp.params[i]);
            }

            return html + this._RIGHT_PARENTHESIS;
        },

        generateFromFunctionBody: function(functionDeclExp)
        {
            return this.generateHtml(functionDeclExp.body);
        },

        generateFromBlockStatement: function(blockStatement)
        {
            var html = this.getStartElementHtml( "div",
                       {
                           class: ASTHelper.CONST.STATEMENT.BlockStatement + " node",
                           id: "node" + this.formatId(blockStatement.nodeId)
                       })
                     + this.getElementHtml("div", {class: "Bracket"}, "{");


            var body = blockStatement.body;
            for(var i = 0, length = body.length; i < length; i++)
            {
                html += this.generateHtml(body[i]);
            }

            return html + this.getElementHtml("div", {class: "Bracket"}, "}")
                        + this.getEndElementHtml("div");
        },

        generateFromEmptyStatement: function(emptyStatement)
        {
            return this.getElementHtml("div",
            {
                class: ASTHelper.CONST.STATEMENT.EmptyStatement + " node",
                id: "node" + this.formatId(emptyStatement.nodeId),
                style: this.getStyle(emptyStatement)
            }, ";");
        },

        generateFromExpressionStatement: function(expressionStatement)
        {
            return this.getStartElementHtml("div",
                    {
                        class: ASTHelper.CONST.STATEMENT.ExpressionStatement + " node" + this._generateHasBeenExecutedClass(expressionStatement),
                        id: "node" + this.formatId(expressionStatement.nodeId),
                        style: this.getStyle(expressionStatement)
                    })
                   + this.generateHtml(expressionStatement.expression)
                   + this.getEndElementHtml("div");
        },

        generateFromAssignmentExpression: function(assignmentExpression)
        {
            var shouldBeSurrounded = ASTHelper.isBinaryExpression(assignmentExpression.parent)
                                  || ASTHelper.isLogicalExpression(assignmentExpression.parent);

            return (shouldBeSurrounded ? this._LEFT_PARENTHESIS : "")
                  + this.getStartElementHtml("span",
                   {
                       class: ASTHelper.CONST.EXPRESSION.AssignmentExpression + " node"+ this._generateHasBeenExecutedClass(assignmentExpression),
                       id: "node" + this.formatId(assignmentExpression.nodeId)
                   })
                + this.generateHtml(assignmentExpression.left)
                + " " + assignmentExpression.operator + " "
                + this.generateHtml(assignmentExpression.right)
                + this.getEndElementHtml("span")
                + (shouldBeSurrounded ? this._RIGHT_PARENTHESIS : "");
        },

        generateFromUnaryExpression: function(unaryExpression)
        {
            var html = this.getStartElementHtml("span",
            {
                class: ASTHelper.CONST.EXPRESSION.UnaryExpression + " node",
                id: "node" + this.formatId(unaryExpression.nodeId)
            });

            if(unaryExpression.prefix) html += unaryExpression.operator;

            if(unaryExpression.operator == "typeof"
                || unaryExpression.operator == "void"
                || unaryExpression.operator == "delete") html += " ";

            var isComplexArgument = !(ASTHelper.isLiteral(unaryExpression.argument) || ASTHelper.isIdentifier(unaryExpression.argument));

            html += (isComplexArgument ? this._LEFT_PARENTHESIS : "")
                        + this.generateExpression(unaryExpression.argument)
                   + (isComplexArgument ? this._RIGHT_PARENTHESIS : "");

            if(!unaryExpression.prefix) { html += unaryExpression.operator; }

            html += this.getEndElementHtml("span");

            return html;
        },

        generateFromBinaryExpression: function(binaryExpression)
        {
            return this.getStartElementHtml("span",
                   {
                       class: ASTHelper.CONST.EXPRESSION.BinaryExpression + " node",
                       id: "node" + this.formatId(binaryExpression.nodeId)
                   })
                   + this.generateHtml(binaryExpression.left)
                   + " " + binaryExpression.operator + " "
                   + this.generateHtml(binaryExpression.right)
                   + this.getEndElementHtml("span");
        },

        generateFromLogicalExpression: function(logicalExpression)
        {
            var _class = ASTHelper.CONST.EXPRESSION.LogicalExpression + " node" + this._generateHasBeenExecutedClass(logicalExpression);
            var _id = "node" + this.formatId(logicalExpression.nodeId);

            var shouldBeSurrounded = ASTHelper.isBinaryExpression(logicalExpression.parent)
                                 || (ASTHelper.isLogicalExpression(logicalExpression.parent) && logicalExpression.parent.operator != logicalExpression.operator)
                                 || (ASTHelper.isCallExpression(logicalExpression.parent) && logicalExpression.parent.callee == logicalExpression);

            return (shouldBeSurrounded ? this._LEFT_PARENTHESIS : "")
                  + this.getStartElementHtml("span",
                   {
                       class: _class,
                       id: _id
                   })
                 + this.generateHtml(logicalExpression.left)
                 + " " + logicalExpression.operator + " "
                 + this.generateHtml(logicalExpression.right)
                 + this.getEndElementHtml("span")
                 + (shouldBeSurrounded ? this._RIGHT_PARENTHESIS : "")
        },

        generateFromUpdateExpression: function(updateExpression)
        {
            var html = this.getStartElementHtml("span",
            {
                class: ASTHelper.CONST.EXPRESSION.UpdateExpression + " node",
                id: "node" + this.formatId(updateExpression.nodeId)
            });

            // if prefixed e.g.: ++i
            if(updateExpression.prefix) html += updateExpression.operator;

            html += this.generateHtml(updateExpression.argument);

            // if postfixed e.g.: i++
            if(!updateExpression.prefix) html += updateExpression.operator;

            return html + this.getEndElementHtml("span");
        },

        generateFromNewExpression: function(newExpression)
        {
            return this.getStartElementHtml("span",
                       {
                           class: ASTHelper.CONST.EXPRESSION.NewExpression + " node",
                           id: "node" + this.formatId(newExpression.nodeId)
                       })
                     + this.getElementHtml("span", {class: "keyword"}, "new ")
                     + this.generateHtml(newExpression.callee)
                     + this._LEFT_PARENTHESIS
                        + this.getSequenceHtml(newExpression.arguments)
                     + this._RIGHT_PARENTHESIS
                     + this.getEndElementHtml("span");
        },

        generateFromConditionalExpression: function(conditionalExpression)
        {
            var shouldBeSurrounded = ASTHelper.isBinaryExpression(conditionalExpression.parent)
                                  || ASTHelper.isLogicalExpression(conditionalExpression.parent)
                                  || ASTHelper.isCallExpressionCallee(conditionalExpression);

            return (shouldBeSurrounded ? this._LEFT_PARENTHESIS : "")
                   + this.getStartElementHtml("span",
                     {
                         class: ASTHelper.CONST.EXPRESSION.ConditionalExpression + " node",
                         id: "node" + this.formatId(conditionalExpression.nodeId)
                     })
                   + this.generateHtml(conditionalExpression.test)
                   + " ? " + this.generateHtml(conditionalExpression.consequent)
                   + " : " + this.generateHtml(conditionalExpression.alternate)
                   + this.getEndElementHtml("span")
                   + (shouldBeSurrounded ? this._RIGHT_PARENTHESIS : "");
        },

        generateFromThisExpression: function(thisExpression)
        {
            return this.getElementHtml("span",
            {
                class: "keyword node",
                id: "node" + this.formatId(thisExpression.nodeId)
            }, "this");
        },

        generateFromCallExpression: function(callExpression)
        {
            return this.getStartElementHtml("span",
                   {
                       class: ASTHelper.CONST.EXPRESSION.CallExpression + " node",
                       id: "node" + this.formatId(callExpression.nodeId)
                   })
                 + this.generateHtml(callExpression.callee) + this._LEFT_PARENTHESIS
                 + this.getSequenceHtml(callExpression.arguments)
                 + this._RIGHT_PARENTHESIS + this.getEndElementHtml("span");
        },

        generateFromMemberExpression: function(memberExpression)
        {
            var isNotSimpleMemberExpression = !ASTHelper.isIdentifier(memberExpression.object)
                                            &&!ASTHelper.isCallExpression(memberExpression.object)
                                            &&!ASTHelper.isThisExpression(memberExpression.object)
                                            &&!ASTHelper.isMemberExpression(memberExpression.object);

            var html = this.getStartElementHtml("span",
                       {
                          class: ASTHelper.CONST.EXPRESSION.MemberExpression + " node",
                          id: "node" + this.formatId(memberExpression.nodeId)
                       })
                     + this.generateHtml(memberExpression.object);

            var isPropertyStringLiteral = ASTHelper.isStringLiteral(memberExpression.property);

            if(memberExpression.computed || isPropertyStringLiteral)
            {
                html += this._LEFT_BRACKET
                        + (isPropertyStringLiteral ? "'" : "")
                        +  this.generateHtml(memberExpression.property)
                        + (isPropertyStringLiteral ? "'" : "")
                      + this._RIGHT_BRACKET;
            }
            else
            {
                html += "." + this.generateHtml(memberExpression.property);
            }

            return (isNotSimpleMemberExpression ? this._LEFT_PARENTHESIS : "")
                   + html + this.getEndElementHtml("span")
                   + (isNotSimpleMemberExpression ? this._RIGHT_PARENTHESIS : "")
        },

        generateFromSequenceExpression: function(sequenceExpression)
        {
            return this.getStartElementHtml("span",
                   {
                       class: ASTHelper.CONST.EXPRESSION.SequenceExpression + " node",
                       id: "node" + this.formatId(sequenceExpression.nodeId)
                   })
                   + this.getSequenceHtml(sequenceExpression.expressions)
                   + this.getEndElementHtml("span");
        },

        generateFromArrayExpression: function(arrayExpression)
        {
            return this.getStartElementHtml("span",
                   {
                       class: ASTHelper.CONST.EXPRESSION.ArrayExpression + " node",
                       id: "node" + this.formatId(arrayExpression.nodeId)
                   })
                   + this._LEFT_BRACKET
                        + this.getSequenceHtml(arrayExpression.elements)
                   + this._RIGHT_BRACKET
                   + this.getEndElementHtml("span");
        },

        generateFromObjectExpression: function(objectExpression)
        {
            var _style = this.getStyle(objectExpression);
            var _id = "node" + this.formatId(objectExpression.nodeId);
            var _class = ASTHelper.CONST.EXPRESSION.ObjectExpression + " node" + this._generateHasBeenExecutedClass(objectExpression);

            var _containerStyle = "display: block";
            var _propertyContainerStyle = "";

            var _isEmptyObject = objectExpression.properties.length == 0;

            var _hasGettersOrSetters = false;
            var _hasMoreThanTwoProperties = objectExpression.properties.length > 2;
            var _hasFunctionExpressions = false;

            var properties = objectExpression.properties;

            for(var i = 0; i < properties.length; i++)
            {
                var property = properties[i];

                if (property.kind == "get" || property.kind == "set")
                {
                    _hasGettersOrSetters = true;
                }

                if (ASTHelper.isFunctionExpression(property.value))
                {
                    _hasFunctionExpressions = true;
                }
            }


            if (_isEmptyObject == true || (_hasMoreThanTwoProperties == false && _hasFunctionExpressions == false && _hasGettersOrSetters == false))
            {
                _containerStyle = "display: inline;";
                _propertyContainerStyle = "display: inline;";
            }
            else
            {
                _containerStyle = "display: block;";
                _propertyContainerStyle = "display: block; padding-left: 20px;";
            }

            var html = this.getStartElementHtml("div", { class: _class, style: _containerStyle, id: _id });

            if (_isEmptyObject) { html += "{}"; }
            else
            {
                html += '{';

                for (var i = 0; i < properties.length; i++)
                {
                    var property = properties[i];

                    html += '<div class="objectProperty" id="node' + this.formatId(property.nodeId) +  '" style ="' + _propertyContainerStyle + '">';

                    if (property.kind == "init")
                    {
                        html += this.generateHtml(property.key) + ': '
                              + this.generateHtml(property.value);
                    }
                    else
                    {
                        html += this.getElementHtml("span", {class: "keyword"}, property.kind) + " " + this.generateHtml(property.key)
                              + this.generateExpression(property.value);
                    }


                    if(i != properties.length - 1) { html += ", "; }

                    html += '</div>';
                }

                html += '}'
            }

            return html + this.getEndElementHtml("div");
        },

        generateFromIfStatement: function(ifStatement)
        {
            var _class = ASTHelper.CONST.STATEMENT.IfStatement + " node" + this._generateHasBeenExecutedClass(ifStatement);
            var _id = "node" + this.formatId(ifStatement.nodeId);
            var _style = "display: inline";

            var html = this.getStartElementHtml("div", {class: _class, style: _style, id: _id})
                + this.getElementHtml("span", {class:"keyword"}, "if")
                + " (" + this.generateHtml(ifStatement.test) + ") ";

            if(!ASTHelper.isBlockStatement(ifStatement.consequent))
                html += "<br>";

            html += this.generateHtml(ifStatement.consequent);

            if(ifStatement.alternate != null)
            {
                html += this.getElementHtml("span", {class:"keyword", style:"margin-left:20px"}, "else ")
                    + this.generateHtml(ifStatement.alternate);
            }

            html += this.getEndElementHtml("div");

            return html;
        },

        generateFromWhileStatement: function(whileStatement)
        {
            var _class = ASTHelper.CONST.STATEMENT.WhileStatement + " node" + this._generateHasBeenExecutedClass(whileStatement);
            var _id = "node" + this.formatId(whileStatement.nodeId);

            var html = this.getStartElementHtml("div", {class: _class, id: _id})
                + this.getElementHtml("span", {class:"keyword"}, "while")
                + "(" + this.generateHtml(whileStatement.test) + ")  ";

            html += this.generateHtml(whileStatement.body)
                + this.getEndElementHtml("div");

            return html;
        },

        generateFromDoWhileStatement: function(doWhileStatement)
        {
            var _class = ASTHelper.CONST.STATEMENT.DoWhileStatement + " node" + this._generateHasBeenExecutedClass(doWhileStatement);
            var _id = "node" + this.formatId(doWhileStatement.nodeId);

            var html = this.getStartElementHtml("div", {class: _class, id: _id})
                + this.getElementHtml("span", {class:"keyword"}, "do");

            if(!ASTHelper.isBlockStatement(doWhileStatement.body))
                html += "<br>";

            html += this.generateHtml(doWhileStatement.body);

            html += this.getElementHtml("span", {class:"keyword"}, "while")
                + " (" + this.generateHtml(doWhileStatement.test) + ")"
                + this.getEndElementHtml("div");

            return html;
        },

        generateFromForStatement: function(forStatement)
        {
            var _class = ASTHelper.CONST.STATEMENT.ForStatement + " node" + this._generateHasBeenExecutedClass(forStatement);
            var _id = "node" + this.formatId(forStatement.nodeId);

            var html = this.getStartElementHtml("div", {class: _class, id: _id});

            html += this.getElementHtml("span", {class:"keyword"}, "for") + " "
                + "(" + this.generateHtml(forStatement.init) + "; "
                + this.generateHtml(forStatement.test) + "; "
                + this.generateHtml(forStatement.update) + ") "
                + this.generateHtml(forStatement.body);

            html += this.getEndElementHtml("div");

            return html;
        },

        generateFromForInStatement: function(forInStatement)
        {
            if(!ASTHelper.isForInStatement(forInStatement)) { alert("Invalid element when generating for...in statement html code!"); return ""; }

            var _class = ASTHelper.CONST.STATEMENT.ForInStatement + " node" + this._generateHasBeenExecutedClass(forInStatement);
            var _id = "node" + this.formatId(forInStatement.nodeId);

            var html = this.getStartElementHtml("div", {class: _class, id: _id});

            html += this.getElementHtml("span", {class:"keyword"}, "for") + " ";

            if(forInStatement.each === true) html += this.getElementHtml("span", {class:"keyword"}, "each") + " ";

            html += "(" + this.generateHtml(forInStatement.left)
                + " in " + this.generateExpression(forInStatement.right) + ")";

            if(!ASTHelper.isBlockStatement(forInStatement.body))
                html += "<br>";

            html += this.generateStatement(forInStatement.body);

            html += this.getEndElementHtml("div");

            return html;
        },

        generateFromBreakStatement: function(breakStatement)
        {
            if(!ASTHelper.isBreakStatement(breakStatement)) { alert("Invalid element when generating break statement html code!"); return ""; }

            var _class = ASTHelper.CONST.STATEMENT.BreakStatement + " node" + this._generateHasBeenExecutedClass(breakStatement);
            var _id = "node" + this.formatId(breakStatement.nodeId);
            var _style = this.getStyle(breakStatement);

            var html = this.getStartElementHtml("div", {class: _class, id: _id, style: _style})
                + this.getElementHtml("span", {class:"keyword"}, "break");

            if(breakStatement.label != null) html += " " + this.generateFromIdentifier(breakStatement.label);

            html += ";" + this.getEndElementHtml("div");

            return html;
        },

        generateFromContinueStatement: function(continueStatement)
        {
            var _class =  ASTHelper.CONST.STATEMENT.ContinueStatement + " node";
            var _id = "node" + this.formatId(continueStatement.nodeId);
            var _style = this.getStyle(continueStatement);

            var html = this.getStartElementHtml("div", {class: _class, id: _id, style: _style})
                + this.getElementHtml("span", {class:"keyword"}, "continue");

            if(continueStatement.label != null) html += " " + this.generateFromIdentifier(continueStatement.label);

            html += ";" + this.getEndElementHtml("div");

            return html;
        },

        generateFromReturnStatement: function(returnStatement)
        {
            var _class = ASTHelper.CONST.STATEMENT.ReturnStatement + " node" + this._generateHasBeenExecutedClass(returnStatement);
            var _id = "node" + this.formatId(returnStatement.nodeId);
            var _style = this.getStyle(returnStatement);

            var html = this.getStartElementHtml("div", {class: _class, id: _id, style: _style})
                + this.getElementHtml("span", {class:"keyword"}, "return");

            if(returnStatement.argument != null) html += " " + this.generateExpression(returnStatement.argument);

            html += ";" + this.getEndElementHtml("div");

            return html;
        },

        generateFromWithStatement: function(withStatement)
        {
            var _class = ASTHelper.CONST.STATEMENT.WithStatement + " node" + this._generateHasBeenExecutedClass(withStatement);
            var _id = "node" + this.formatId(withStatement.nodeId);

            return this.getStartElementHtml("div", {class: _class, id: _id})
                + this.getElementHtml("span", {class:"keyword"}, "with") + " ("
                + this.generateExpression(withStatement.object) + ")"
                + this.generateStatement(withStatement.body)
                + this.getEndElementHtml("div");
        },

        generateFromThrowStatement: function(throwStatement)
        {
            var _class = ASTHelper.CONST.STATEMENT.ThrowStatement + " node";
            var _id =  "node" + this.formatId(throwStatement.nodeId);

            var html = this.getStartElementHtml("div", {class: _class, id: _id})
                + this.getElementHtml("span", {class: "keyword"}, "throw")
                + " " + this.generateExpression(throwStatement.argument)
                + ";" + this.getEndElementHtml("div");

            return html;
        },

        generateFromSwitchStatement: function(switchStatement)
        {
            var _class = ASTHelper.CONST.STATEMENT.SwitchStatement + " node" + this._generateHasBeenExecutedClass(switchStatement);
            var _id = "node" + this.formatId(switchStatement.nodeId);

            var html = this.getStartElementHtml("div", {class: _class, id: _id})
                + this.getElementHtml("span", {class: "keyword"}, "switch")
                + " (" + this.generateExpression(switchStatement.discriminant) + ")"
                + "<br>";

            html += this.getElementHtml("div", {class: "Bracket"}, "{");

            for(var i = 0; i < switchStatement.cases.length; i++)
            {
                html += this.generateFromSwitchCase(switchStatement.cases[i]);
            }

            html += this.getElementHtml("div", {class: "Bracket"}, "}");

            html += this.getEndElementHtml("div");

            return html;
        },

        generateFromSwitchCase: function(switchCase)
        {
            var _class = ASTHelper.CONST.SwitchCase + " node" + this._generateHasBeenExecutedClass(switchCase);
            var _id = "node" + this.formatId(switchCase.nodeId);
            var _style =  "padding-left: 20px;";

            var html = this.getStartElementHtml("div", {class: _class, style: _style,id: _id})
                + " ";

            if(switchCase.test === null) html += "default:<br>";
            else html += "case " + this.generateExpression(switchCase.test) + ":<br>";

            for(var i = 0; i < switchCase.consequent.length; i++)
            {
                html += this.generateHtml(switchCase.consequent[i]);
            }

            html += this.getEndElementHtml("div");

            return html;
        },

        generateFromTryStatement: function(tryStatement)
        {
            if(!ASTHelper.isTryStatement(tryStatement)) { alert("Invalid element when generating try statement html code!"); return ""; }

            var _class = ASTHelper.CONST.STATEMENT.TryStatement  + " node" + this._generateHasBeenExecutedClass(tryStatement);
            var _id = "node" + this.formatId(tryStatement.nodeId);

            var html = this.getStartElementHtml("div", {class: _class, id: _id})
                + this.getElementHtml("span", {class:"keyword"}, "try")
                + this.generateHtml(tryStatement.block);

            var handlers = tryStatement.handlers || (ValueTypeHelper.isArray(tryStatement.handler) ? tryStatement.handler : [tryStatement.handler]);
            // catch clauses
            for(var i = 0; i < handlers.length; i++)
            {
                html += this.generateFromCatchClause(handlers[i]);
            }

            if(tryStatement.finalizer != null)
            {
                html += this.getElementHtml("span", {class:"keyword"}, "finally")
                    + this.generateHtml(tryStatement.finalizer);
            }

            return html + this.getEndElementHtml("div");
        },

        generateFromLabeledStatement: function(labeledStatement)
        {
            var _class = ASTHelper.CONST.STATEMENT.LabeledStatement + " node" + this._generateHasBeenExecutedClass(labeledStatement);
            var _id = "node" + this.formatId(labeledStatement.nodeId);

            var html = this.getStartElementHtml("div", {class: _class, id: _id})
                + this.generateFromIdentifier(labeledStatement.label) + ": "
                + this.generateHtml(labeledStatement.body)
                + this.getEndElementHtml("div");

            return html;
        },

        generateFromVariableDeclaration: function(variableDeclaration)
        {
            var html = "";

            var _class = ASTHelper.CONST.VariableDeclaration + " node" + this._generateHasBeenExecutedClass(variableDeclaration);
            var _id = "node" + this.formatId(variableDeclaration.nodeId);

            html += this.getStartElementHtml("span", {class: _class, id: _id});
            html += this.getElementHtml("span", {class:"keyword"}, variableDeclaration.kind);
            html += " ";

            for (var i = 0; i < variableDeclaration.declarations.length; i++)
            {
                var previousDeclarator = i == 0 ? variableDeclaration : variableDeclaration.declarations[i - 1];
                var currentDeclarator = variableDeclaration.declarations[i];

                if (previousDeclarator != variableDeclaration)
                {
                    html += ", ";
                }

                html += this.generateFromVariableDeclarator(currentDeclarator);
            }

            if (ASTHelper.isForStatement(variableDeclaration.parent) || ASTHelper.isForInStatement(variableDeclaration.parent))
            {
                html += this.getEndElementHtml("span");
            }
            else
            {
                html += ";" + this.getEndElementHtml("span") + "<br>";
            }

            return html;
        },

        generateFromVariableDeclarator: function(variableDeclarator)
        {
            var html = this.getStartElementHtml
            (
                "span",
                {
                    class: ASTHelper.CONST.VariableDeclarator + this._generateHasBeenExecutedClass(variableDeclarator),
                    id: "node" + this.formatId(variableDeclarator.nodeId)
                }
            );

            html += this.generateFromPattern(variableDeclarator.id);

            if(variableDeclarator.init != null)
            {
                html += " = ";
                html += this.generateHtml(variableDeclarator.init);
            }

            return html + this.getEndElementHtml("span");
        },

        generateFromPattern: function(pattern)
        {
            if(ASTHelper.isIdentifier(pattern)) { return this.generateFromIdentifier(pattern);}
        },

        generateFromCatchClause: function(catchClause)
        {
            var _class = ASTHelper.CONST.CatchClause + " node" + this._generateHasBeenExecutedClass(catchClause);
            var _id = "node" + this.formatId(catchClause.nodeId);

            var html = this.getStartElementHtml("div", {class: _class, id: _id})
                + this.getElementHtml("span", {class: "keyword"}, "catch");

            html += " (" + this.generateHtml(catchClause.param);

            if(catchClause.guard != null) html += " if " + this.generateExpression(catchClause.guard);

            html += ")";
            html += this.generateStatement(catchClause.body);

            html += this.getEndElementHtml("div");

            return html;
        },

        generateFromIdentifier: function(identifier)
        {
            var _class = ASTHelper.CONST.Identifier + " node" + this._generateHasBeenExecutedClass(identifier);
            var _id = "node" + this.formatId(identifier.nodeId);
            //var _padding = this.getStyle(identifier);

            //, style: _padding
            return this.getElementHtml("span", {class: _class, id: _id}, identifier.name);
        },

        generateFromLiteral: function(literal)
        {
            if (ValueTypeHelper.isString(literal.value))
            {
                return this.getElementHtml("span", {class: "String", id: "node" + this.formatId(literal.nodeId)}, "\"" + this.escapeHtml(literal.value) + "\"");
            }
            else if (ValueTypeHelper.isBoolean(literal.value) || ValueTypeHelper.isNull(literal.value))
            {
                return this.getElementHtml("span", {class: "Keyword", id: "node" + this.formatId(literal.nodeId)}, literal.value);
            }
            else if(ValueTypeHelper.isInteger(literal.value))
            {
                return this.getElementHtml("span", {class: "Number", id: "node" + this.formatId(literal.nodeId)}, literal.value);
            }
            else if(ValueTypeHelper.isObject(literal.value))
            {
                var regExString = "";

                if(literal.value.constructor != null && literal.value.constructor.name === "RegExp")
                {
                    regExString = literal.value.toString();
                }
                else //over JSON conversion
                {
                    regExString = atob(literal.value.RegExpBase64);
                }

                regExString = ValueTypeHelper.adjustForRegExBug(literal.value, regExString);

                return this.getElementHtml("span", {class: "RegExp", id: "node" + this.formatId(literal.nodeId)}, regExString );
            }
            else
            {
                return this.getElementHtml("span", {class: ASTHelper.CONST.Literal, id: "node" + this.formatId(literal.nodeId)}, literal.value);
            }
        },

        getSequenceHtml: function(sequence)
        {
            var html = "";

            for(var i = 0; i < sequence.length; i++)
            {
                if(i != 0) { html += ", "; }
                html += this.generateHtml(sequence[i]);
            }

            return html;
        },

        getElementHtml: function(elementType, attributes, content)
        {
            return this.getStartElementHtml(elementType, attributes) + content + this.getEndElementHtml(elementType);
        },

        getStartElementHtml: function(elementType, attributes)
        {
            try
            {
                var html = "<" + elementType + " ";

                for(var propertyName in attributes)
                {
                    html += propertyName + " = '" + attributes[propertyName] + "' ";
                }

                html += ">";

                return html;
            }
            catch(e) { alert("Error when generating start element html: " + e);}
        },

        getEndElementHtml: function(elementType)
        {
            try
            {
                return "</" + elementType  + ">";
            }
            catch(e) { alert("Error when generating end element html: " + e); }
        },

        getStyle: function(currentElement)
        {
            if( ASTHelper.isLoopStatement(currentElement.parent)
             || ASTHelper.isIfStatement(currentElement.parent)
             || ASTHelper.isSwitchCase(currentElement.parent))
            {
                return "padding-left: 20px";
            }

            if (currentElement.type == "ObjectExpression")
            {

            }

            return "";
        },

        _generateHasBeenExecutedClass: function(expression)
        {
            if(expression == null) { return ""; }

            return expression.hasBeenExecuted ? " hasBeenExecuted "
                                              : " hasNotBeenExecuted ";
        },

        formatId: function(currentId)
        {
            if(currentId < 0) alert("Invalid Node Identification: ID cannot be negative.)");
            if(currentId > 999999) alert("Invalid Node Identification: ID exceeds, but is limited to,  6 characters");
            return ("00000" + currentId).slice(-6);
        },

        escapeHtml: function(string)
        {
            return string.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\//, "&#47;");
        },

        _LEFT_GULL_WING:  "{",
        _RIGHT_GULL_WING: "}",
        _LEFT_PARENTHESIS: "(",
        _RIGHT_PARENTHESIS: ")",
        _LEFT_BRACKET : "[",
        _RIGHT_BRACKET: "]",
        _SEMI_COLON: ";",
        _QUESTION_MARK: "?",
        _COLON: ":",
        _DOT: ".",
        _COMMA: ",",
        _IF_KEYWORD: "if",
        _ELSE_KEYWORD: "else",
        _FOR_KEYWORD: "for",
        _WHILE_KEYWORD: "while",
        _DO_KEYWORD: "do",
        _WITH_KEYWORD: "with",
        _IN_KEYWORD: "in",
        _FUNCTION_KEYWORD: "function",
        _BREAK_KEYWORD: "break",
        _CONTINUE_KEYWORD: "continue",
        _TRY_KEYWORD: "try",
        _CATCH_KEYWORD: "catch",
        _FINALLY_KEYWORD: "finally",
        _THROW_KEYWORD: "throw",
        _RETURN_KEYWORD: "return",
        _VAR_KEYWORD: "var",
        _SWITCH_KEYWORD: "switch",
        _CASE_KEYWORD: "case",
        _DEFAULT_KEYWORD: "default"
    }
}});

if(usesModule)
{
    exports.CodeMarkupGenerator = CodeMarkupGenerator;
}