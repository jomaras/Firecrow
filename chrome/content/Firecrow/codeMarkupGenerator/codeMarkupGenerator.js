/**
 * Created by Jomaras.
 * Date: 27.03.12.@07:54
 */
FBL.ns(function () { with (FBL) {
    /*******/
    const astHelper = Firecrow.ASTHelper;
    const valueTypeHelper = Firecrow.ValueTypeHelper;

    Firecrow.CodeMarkupGenerator =
    {
        generateHtml: function(element)
        {
            try
            {
                if(astHelper.isProgram(element))
                {
                    var html = "<div class=\"jsContainer\">";

                    if(element.body != null)
                    {
                        for(var i = 0; i < element.body.length; i++)
                        {
                            //var previousElement = element.body[i-1];  unused variable
                            var currentElement = element.body[i];

                            html += this.generateHtml(currentElement);
                        }
                    }

                    html += "</div>";
                    return html;
                }

                /**
                 * generalized
                 */
                else if (astHelper.isStatement(element))             { return this.generateStatement(element); }
                else if (astHelper.isExpression(element))            { return this.generateExpression(element); }

                /**
                 * rest
                 */
                else if (astHelper.isSwitchCase(element))            { return this.generateFromSwitchCase(element); }
                else if (astHelper.isCatchClause(element))           { return this.generateFromCatchClause(element); }
                else if (astHelper.isFunction(element))              { return this.generateFromFunction(element, true); }
                else if (astHelper.isVariableDeclaration(element))   { return this.generateFromVariableDeclaration(element); }
                else if (astHelper.isVariableDeclarator(element))    { return this.generateFromVariableDeclarator(element); }
                else if (astHelper.isLiteral(element))               { return this.generateFromLiteral(element); }
                else if (astHelper.isIdentifier(element))            { return this.generateFromIdentifier(element); }
                else
                {
                    console.log(element);
                    alert("Error while generating HTML in codeMarkupGenerator: unidentified ast element."); return "";
                }
            }
            catch(e)
            {
                alert("Error while generating HTML in codeMarkupGenerator: " + e);
            }
        },

        generateStatement: function(statement)
        {
            try
            {
                var html = "";

                //html += this.generateStartLineHtml(statement);

                if (astHelper.isEmptyStatement(statement))  { html += this.generateFromEmptyStatement(statement); }
                else if (astHelper.isBlockStatement(statement)) { html += this.generateFromBlockStatement(statement); }
                else if (astHelper.isExpressionStatement(statement)) { html += this.generateFromExpressionStatement(statement); }
                else if (astHelper.isIfStatement(statement)) { html += this.generateFromIfStatement(statement); }
                else if (astHelper.isWhileStatement(statement)) { html += this.generateFromWhileStatement(statement); }
                else if (astHelper.isDoWhileStatement(statement)) { html += this.generateFromDoWhileStatement(statement); }
                else if (astHelper.isForStatement(statement)) { html += this.generateFromForStatement(statement); }
                else if (astHelper.isForInStatement(statement)) { html += this.generateFromForInStatement(statement); }
                else if (astHelper.isLabeledStatement(statement)) { html += this.generateFromLabeledStatement(statement); }
                else if (astHelper.isBreakStatement(statement)) { html+= this.generateFromBreakStatement(statement); }
                else if (astHelper.isContinueStatement(statement)) { html += this.generateFromContinueStatement(statement); }
                else if (astHelper.isReturnStatement(statement)) { html += this.generateFromReturnStatement(statement); }
                else if (astHelper.isWithStatement(statement)) { html += this.generateFromWithStatement(statement); }
                else if (astHelper.isTryStatement(statement)) { html += this.generateFromTryStatement(statement); }
                else if (astHelper.isThrowStatement(statement)) { html += this.generateFromThrowStatement(statement); }
                else if (astHelper.isSwitchStatement(statement)) { html += this.generateFromSwitchStatement(statement); }
                else { alert("Error: AST Statement element not defined: " + expression.type);  return "";}

                return html;
            }
            catch(e) { alert("Error when generating HTML from a statement: " + e); }
        },

        generateExpression: function(expression)
        {
            try
            {
                var html = "";

                if (astHelper.isAssignmentExpression(expression)) { html += this.generateFromAssignmentExpression(expression); }
                else if (astHelper.isUnaryExpression(expression)) { html += this.generateFromUnaryExpression(expression); }
                else if (astHelper.isBinaryExpression(expression)) { html += this.generateFromBinaryExpression(expression); }
                else if (astHelper.isLogicalExpression(expression)) { html += this.generateFromLogicalExpression(expression); }
                else if (astHelper.isLiteral(expression)) { html += this.generateFromLiteral(expression); }
                else if (astHelper.isIdentifier(expression)) { html += this.generateFromIdentifier(expression); }
                else if (astHelper.isUpdateExpression(expression)) { html += this.generateFromUpdateExpression(expression); }
                else if (astHelper.isNewExpression(expression)) { html += this.generateFromNewExpression(expression); }
                else if (astHelper.isConditionalExpression(expression)) { html += this.generateFromConditionalExpression(expression); }
                else if (astHelper.isThisExpression(expression)) { html += this.generateFromThisExpression(expression); }
                else if (astHelper.isCallExpression(expression)) { html += this.generateFromCallExpression(expression); }
                else if (astHelper.isMemberExpression(expression)) { html += this.generateFromMemberExpression(expression); }
                else if (astHelper.isSequenceExpression(expression)) { html += this.generateFromSequenceExpression(expression); }
                else if (astHelper.isArrayExpression(expression)) { html += this.generateFromArrayExpression(expression); }
                else if (astHelper.isObjectExpression(expression)) { html += this.generateFromObjectExpression(expression); }
                else if (astHelper.isFunctionExpression(expression)) { html += this.generateFromFunction(expression, true); }
                else { alert("Error: AST Expression element not defined: " + expression.type);  return "";}

                return html;
            }
            catch(e) { alert("Error when generating HTML from an expression:" + e); }
        },

        generateFromFunction: function(functionDecExp, hasFunctionKeyword)
        {
            try
            {
                if(!astHelper.isFunction(functionDecExp)) { alert("Invalid Element when generating function html code!"); }

                var _class = functionDecExp.type + " node";
                var _id = "node" + this.formatId(functionDecExp.nodeId);
                var _style = this.getStyle(functionDecExp);

                var html = this.getStartElementHtml(
                    "div",
                    {
                        class: _class,
                        id : _id,
                        style: _style
                    }
                );

                if (functionDecExp.type === "FunctionDeclaration")
                {
                    html += this.getElementHtml("span", {class: "keyword"}, "function") + " "
                        + this.generateFromIdentifier(functionDecExp.id);
                }
                else
                {
                    if(functionDecExp.id != null)
                        html += this.generateFromIdentifier(functionDecExp.id);

                    if(hasFunctionKeyword === true)
                        html += this.getElementHtml("span", {class: "keyword"}, "function");
                }

                html +=  this.generateFunctionParametersHtml(functionDecExp)
                    +  this.generateFromFunctionBody(functionDecExp)
                    + this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from a function:" + e); }
        },

//      Replaced by: generateFromFunction
//
//    generateFromFunctionDeclaration: function(functionDeclaration)
//    {
//        try
//        {
//            if(!astHelper.isFunctionDeclaration(functionDeclaration)) { alert("Invalid element when generating function declaration html code!"); return ""; }
//
//            var html = this.getStartElementHtml("div", {class: 'funcDecl', id : "node" + functionDeclaration.astId });
//
//            html += this.getElementHtml("span", {class:"keyword"}, "function") + " "
//                 +  this.generateFromIdentifier(functionDeclaration.id)
//                 +  this.generateFunctionParametersHtml(functionDeclaration)
//                 +  this.generateFromFunctionBody(functionDeclaration);
//
//            html += this.getEndElementHtml("div");
//
//            return html;
//        }
//        catch(e) { alert("Error when generating HTML form a function declaration:" + e); }
//    },

        generateFunctionParametersHtml: function(functionDecExp)
        {
            try
            {
                if(!astHelper.isFunction(functionDecExp)) { alert("Invalid element when generating function parameters html code!"); return ""; }

                var html = "(";

                for(var i = 0; i < functionDecExp.params.length; i++)
                {
                    if(i != 0) { html += ", "; }

                    html += this.generateFromPattern(functionDecExp.params[i]);
                }
                html += ")";

                return html;
            }
            catch(e) { alert("Error when generating HTML from function parameters:" + e);}
        },

        generateFromFunctionBody: function(functionDeclExp)
        {
            try
            {
                if(!astHelper.isFunction(functionDeclExp)) { alert("Invalid element when generating function body html code!"); return ""; }

                return this.generateHtml(functionDeclExp.body);
            }
            catch(e) { alert("Error when generating HTML from function body:" + e); }
        },

        generateFromBlockStatement: function(blockStatement)
        {
            try
            {
                if(!astHelper.isBlockStatement(blockStatement)) { alert("Invalid element when generating block statement html code!"); return ""; }

                var _class = astHelper.CONST.STATEMENT.BlockStatement + " node";
                var _id = "node" + this.formatId(blockStatement.nodeId);

                var html = this.getStartElementHtml(
                    "div",
                    {
                        class: _class,
                        id: _id
                    }
                );

                html += this.getElementHtml("div", {class: "Bracket"}, "{");

                //this.currentIntendation += "&nbsp;&nbsp;";

                blockStatement.body.forEach(function(statement)
                {
                    html += this.generateHtml(statement);
                }, this);

                //this.currentIntendation = this.currentIntendation.replace(/&nbsp;&nbsp;$/g, "");

                html += this.getElementHtml("div", {class: "Bracket"}, "}");
                html += this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from block statement:" + e);}
        },

        generateFromEmptyStatement: function(emptyStatement)
        {
            try
            {
                if(!astHelper.isEmptyStatement(emptyStatement)) { alert("Invalid element when generating empty statement html code!"); return ""; }

                var _class = astHelper.CONST.STATEMENT.EmptyStatement + " node";
                var _id= "node" + this.formatId(emptyStatement.nodeId);
                var _style = this.getStyle(emptyStatement);

                return this.getElementHtml("div", {class: _class, id: _id, style: _style}, ";");
            }
            catch(e) { alert("Error when generating HTML from empty statement:" + e); }
        },

        generateFromExpressionStatement: function(expressionStatement)
        {
            try
            {
                if(!astHelper.isExpressionStatement(expressionStatement)) { alert("Invalid element when generating expression statement html code!"); return "";}

                var html = "";

                var _class = astHelper.CONST.STATEMENT.ExpressionStatement + " node";
                var _style = this.getStyle(expressionStatement);
                var _id = "node" + this.formatId(expressionStatement.nodeId);

                html += this.getStartElementHtml(
                    "div",
                    { class: _class,
                        id: _id,
                        style: _style}
                );

                html += this.generateHtml(expressionStatement.expression);

                html += ";" + this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from expression statement:" + e); }
        },

        generateFromAssignmentExpression: function(assignmentExpression)
        {
            try
            {
                if(!astHelper.isAssignmentExpression(assignmentExpression)) { alert("Invalid element when generating assignment expression html code!"); return "";}

                var _class = astHelper.CONST.EXPRESSION.AssignmentExpression + " node";
                var _id =  "node" + this.formatId(assignmentExpression.nodeId);

                return this.getStartElementHtml("span", { class: _class, id: _id})
                    + this.generateHtml(assignmentExpression.left)
                    + " " + assignmentExpression.operator + " "
                    + this.generateHtml(assignmentExpression.right)
                    + this.getEndElementHtml("span");
            }
            catch(e) { alert("Error when generating HTML from assignment expression:" + e); }
        },

        generateFromUnaryExpression: function(unaryExpression)
        {
            try
            {
                if(!astHelper.isUnaryExpression(unaryExpression)) { alert("Invalid element when generating unary expression html code!"); return "";}

                var _class = astHelper.CONST.EXPRESSION.UnaryExpression + " node";
                var _id =  "node" + this.formatId(unaryExpression.nodeId);

                var html = this.getStartElementHtml("span", {class: _class, id: _id});

                if(unaryExpression.prefix) html += unaryExpression.operator;

                if(unaryExpression.operator == "typeof"
                    || unaryExpression.operator == "void"
                    || unaryExpression.operator == "delete") html += " (";

                html += this.generateExpression(unaryExpression.argument);

                if(!unaryExpression.prefix) html += unaryExpression.operator;

                if(unaryExpression.operator == "typeof"
                    || unaryExpression.operator == "void"
                    || unaryExpression.operator == "delete") html += ")";

                html += this.getEndElementHtml("span");

                return html;
            }
            catch(e) { alert("Error when generating HTML from unary expression:" + e); }
        },

        generateFromBinaryExpression: function(binaryExpression)
        {
            try
            {
                if(!astHelper.isBinaryExpression(binaryExpression)) { alert("Invalid element when generating binary expression html code!"); return ""; }

                var _class = astHelper.CONST.EXPRESSION.BinaryExpression + " node";
                var _id =  "node" + this.formatId(binaryExpression.nodeId);

                var html = this.getStartElementHtml("span", { class: _class, id: _id });

                html += this.generateHtml(binaryExpression.left);
                html += " " + binaryExpression.operator + " ";
                html += this.generateHtml(binaryExpression.right);

                html += this.getEndElementHtml("span");

                return html;
            }
            catch(e) { alert("Error when generating HTML from binary expression:" + e); }
        },

        generateFromLogicalExpression: function(logicalExpression)
        {
            try
            {
                if(!astHelper.isLogicalExpression(logicalExpression)) { alert("Invalid element when generating logical expression html code!"); return ""; }

                var _class = astHelper.CONST.EXPRESSION.LogicalExpression + " node";
                var _id = "node" + this.formatId(logicalExpression.nodeId);

                var html = this.getStartElementHtml("span", { class: _class, id: _id });

                html += this.generateHtml(logicalExpression.left);
                html += " " + logicalExpression.operator + " ";
                html += this.generateHtml(logicalExpression.right);

                html += this.getEndElementHtml("span");

                return html;
            }
            catch(e) { alert("Error when generating HTML from logical expression:" + e); }
        },

        generateFromUpdateExpression: function(updateExpression)
        {
            try
            {
                if(!astHelper.isUpdateExpression(updateExpression)) { alert("Invalid element when generating update expression html code!"); return ""; }

                var _class = astHelper.CONST.EXPRESSION.UpdateExpression + " node";
                var _id = "node" + this.formatId(updateExpression.nodeId);

                var html = this.getStartElementHtml("span", { class: _class, id: _id});

                // if prefixed e.g.: ++i
                if(updateExpression.prefix) html += updateExpression.operator;

                html += this.generateHtml(updateExpression.argument);

                // if postfixed e.g.: i++
                if(!updateExpression.prefix) html += updateExpression.operator;

                html += this.getEndElementHtml("span");

                return html;
            }
            catch(e) { alert("Error when generating HTML from update expression:" + e); }
        },

        generateFromNewExpression: function(newExpression)
        {
            try
            {
                var argumentNumber = 0;

                if(!astHelper.isNewExpression(newExpression)) { alert("Invalid element when generating new expression html code!"); return ""; }

                var _class = astHelper.CONST.EXPRESSION.NewExpression + " node";
                var _id = "node" + this.formatId(newExpression.nodeId);

                var html = this.getStartElementHtml("span", {class: _class, id: _id})
                    + this.getElementHtml("span", {class: "keyword"}, "new") + " "
                    + this.generateHtml(newExpression.callee) + "("
                    + this.getSequenceHtml(newExpression.arguments)
                    + ")" + this.getEndElementHtml("span");

                return html;
            }
            catch(e) { alert("Error when generating HTML from new expression:" + e); }
        },

        generateFromConditionalExpression: function(conditionalExpression)
        {
            try
            {
                if(!astHelper.isConditionalExpression(conditionalExpression)) { alert("Invalid element when generating conditional expression html code!"); return ""; }

                var html;

                var _class =  astHelper.CONST.EXPRESSION.ConditionalExpression + " node";
                var _id = "node" + this.formatId(conditionalExpression.nodeId);

                html = this.getStartElementHtml("span", {class: _class, id: _id})
                    + this.generateHtml(conditionalExpression.test)
                    + " ? " + this.generateHtml(conditionalExpression.consequent)
                    + " : " + this.generateHtml(conditionalExpression.alternate)
                    + this.getEndElementHtml("span");

                return html;

            }
            catch(e) { alert("Error when generating HTML from conditional expression:" + e); }
        },

        generateFromThisExpression: function(thisExpression)
        {
            try
            {
                if(!astHelper.isThisExpression(thisExpression)) { alert("Invalid element when generating this expression html code!"); return ""; }

                var _class = "keyword node";
                var _id = "node" + this.formatId(thisExpression.nodeId);

                return this.getElementHtml("span", { class: _class, id: _id}, "this");
            }
            catch(e) { alert("Error when generating HTML from this expression:" + e); }
        },

        generateFromCallExpression: function(callExpression)
        {
            try
            {
                if(!astHelper.isCallExpression(callExpression)) { alert("Invalid element when generating call expression html code!"); return ""; }

                var _class = astHelper.CONST.EXPRESSION.CallExpression + " node";
                var _id = "node" + this.formatId(callExpression.nodeId);

                return this.getStartElementHtml("span", { class: _class, id: _id})
                         + this.generateHtml(callExpression.callee) + "("
                         + this.getSequenceHtml(callExpression.arguments)
                         + ")" + this.getEndElementHtml("span");
            }
            catch(e) { alert("Error when generating HTML from call expression:" + e); }
        },

        generateFromMemberExpression: function(memberExpression)
        {
            try
            {
                if(!astHelper.isMemberExpression(memberExpression)) { alert("Invalid element when generating member expression html code!"); return ""; }

                var _class = astHelper.CONST.EXPRESSION.MemberExpression + " node";
                var _id = "node" + this.formatId(memberExpression.nodeId);

                var html = this.getStartElementHtml("span", { class: _class, id: _id})
                    + this.generateHtml(memberExpression.object);

                if(memberExpression.computed === false)
                {
                    html += "." + this.generateHtml(memberExpression.property);
                }
                else if(memberExpression.computed === true)
                {
                    html += "[" + this.generateHtml(memberExpression.property) + "]";
                }

                html += this.getEndElementHtml("span");

                return html;
            }
            catch(e) { alert("Error when generating HTML from member expression:" + e); }
        },

        generateFromSequenceExpression: function(sequenceExpression)
        {
            try
            {
                if(!astHelper.isSequenceExpression(sequenceExpression)) { alert("Invalid element when generating sequence expression html code!"); return ""; }

                var _class = astHelper.CONST.EXPRESSION.SequenceExpression + " node";
                var _id = "node" + this.formatId(sequenceExpression.nodeId);

                var html = this.getStartElementHtml("span", { class: _class, id: _id});

                html += this.getSequenceHtml(sequenceExpression.expressions);

                html += this.getEndElementHtml("span");

                return html;
            }
            catch(e) { alert("Error when generating HTML from member expression:" + e); }
        },

        generateFromArrayExpression: function(arrayExpression)
        {
            try
            {
                if(!astHelper.isArrayExpression(arrayExpression)) { alert("Invalid element when generating array expression html code!"); return ""; }

                var _class = astHelper.CONST.EXPRESSION.ArrayExpression + " node";
                var _id = "node" + this.formatId(arrayExpression.nodeId);

                var html = this.getStartElementHtml("span", {class: _class, id: _id});
                html += "[" + this.getSequenceHtml(arrayExpression.elements) + "]";
                html += this.getEndElementHtml("span");

                return html;
            }
            catch(e) { alert("Error when generating HTML from array expression:" + e); }
        },

        generateFromObjectExpression: function(objectExpression)
        {
            try
            {
                if(!astHelper.isObjectExpression(objectExpression)) { alert("Invalid element when generating object expression html code!"); return ""; }

                var _style = this.getStyle(objectExpression);
                var _id = "node" + this.formatId(objectExpression.nodeId);
                var _class = astHelper.CONST.EXPRESSION.ObjectExpression + " node";

                var _containerStyle = "display: block";
                var _propertyContainerStyle = "";

                var _isEmptyObject = false;

                var _hasGettersOrSetters = false;
                var _hasMoreThanTwoProperties = false;
                var _hasFunctionExpressions = false;

                if (objectExpression.properties.length == 0)
                {
                    _isEmptyObject = true;
                }
                else
                {
                    if (objectExpression.properties.length > 2)
                    {
                        _hasMoreThanTwoProperties = true;
                    }
                    for(var i = 0; i < objectExpression.properties.length; i++)
                    {
                        if (objectExpression.properties[i].kind == "get"
                            || objectExpression.properties[i].kind == "set")
                        {
                            _hasGettersOrSetters = true;
                        }

                        for (var j = 0; j < objectExpression.properties[i].children.length; j++)
                        {
                            if (objectExpression.properties[i].children[j] == "FunctionExpression")
                            {
                                _hasFunctionExpressions = true;
                            }
                        }
                    }
                }


                if (_isEmptyObject == true
                    || (_hasMoreThanTwoProperties == false
                    && _hasFunctionExpressions == false
                    && _hasGettersOrSetters == false)
                    )
                {
                    _containerStyle = "display: inline;";
                    _propertyContainerStyle = "display: inline;";
                }
                else
                {
                    _containerStyle = "display: block;";
                    _propertyContainerStyle = "display: block; padding-left: 20px;";
                }

                var html = this.getStartElementHtml(
                    "div",
                    {
                        class: _class,
                        style: _containerStyle,
                        id: _id
                    }
                );

                if (objectExpression.properties.length == 0)
                {
                    html += "{}";
                }
                else
                {
                    html += '{';

                    for (var i = 0; i < objectExpression.properties.length; i++)
                    {
                        var property = objectExpression.properties[i];

                        if(i != 0) { html += ", "; }

                        html += '<div class="objectProperty" id="node' + this.formatId(property.nodeId) +  '" style ="' + _propertyContainerStyle + '">';

                        if (property.kind == "init")
                        {
                            html += this.generateHtml(property.key) + ': '
                                 + this.generateHtml(property.value);
                        }
                        else
                        {
                            html += this.getElementHtml("span", {class: "keyword"}, property.kind)
                                + " " + this.generateHtml(property.key);

                            if (astHelper.isFunctionExpression(property.value))
                                html += this.generateFromFunction(property.value, false);
                            else
                                html += this.generateExpression(property.value);
                        }




                        html += '</div>';
                    }

                    html += '}'
                }

                html += this.getEndElementHtml("div");
                return html;
            }
            catch(e) { alert("Error when generating HTML from object expression:" + e);
            }
        },

        generateFromIfStatement: function(ifStatement)
        {
            try
            {
                if(!astHelper.isIfStatement(ifStatement)) { alert("Invalid element when generating empty statement html code!"); return ""; }

                var _class = astHelper.CONST.STATEMENT.IfStatement + " node";
                var _id = "node" + this.formatId(ifStatement.nodeId);
                var _style = "display: inline";

                var html = this.getStartElementHtml("div", {class: _class, style: _style, id: _id})
                    + this.getElementHtml("span", {class:"keyword"}, "if")
                    + " (" + this.generateHtml(ifStatement.test) + ") ";

                if(!astHelper.isBlockStatement(ifStatement.consequent))
                    html += "<br>";

                html += this.generateHtml(ifStatement.consequent);

                if(ifStatement.alternate != null)
                {
                    html += this.getElementHtml("span", {class:"keyword"}, "else ")
                        + this.generateHtml(ifStatement.alternate);
                }

                html += this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from if statement:" + e); }
        },

        generateFromWhileStatement: function(whileStatement)
        {
            try
            {
                if(!astHelper.isWhileStatement(whileStatement)) { alert("Invalid element when generating while statement html code!"); return ""; }

                var _class = astHelper.CONST.STATEMENT.WhileStatement + " node";
                var _id = "node" + this.formatId(whileStatement.nodeId);

                var html = this.getStartElementHtml("div", {class: _class, id: _id})
                    + this.getElementHtml("span", {class:"keyword"}, "while")
                    + "(" + this.generateHtml(whileStatement.test) + ")  ";

                html += this.generateHtml(whileStatement.body)
                    + this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from while statement:" + e); }
        },

        generateFromDoWhileStatement: function(doWhileStatement)
        {
            try
            {
                if(!astHelper.isDoWhileStatement(doWhileStatement)) { alert("Invalid element when generating do while statement html code!"); return ""; }

                var _class = astHelper.CONST.STATEMENT.DoWhileStatement + " node";
                var _id = "node" + this.formatId(doWhileStatement.nodeId);

                var html = this.getStartElementHtml("div", {class: _class, id: _id})
                    + this.getElementHtml("span", {class:"keyword"}, "do");

                if(!astHelper.isBlockStatement(doWhileStatement.body))
                    html += "<br>";

                html += this.generateHtml(doWhileStatement.body);

                html += this.getElementHtml("span", {class:"keyword"}, "while")
                    + " (" + this.generateHtml(doWhileStatement.test) + ")"
                    + this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from do while statement:" + e); }
        },

        generateFromForStatement: function(forStatement)
        {
            try
            {
                if(!astHelper.isForStatement(forStatement)) { alert("Invalid element when generating for statement html code!"); return ""; }

                var _class = astHelper.CONST.STATEMENT.ForStatement + " node";
                var _id = "node" + this.formatId(forStatement.nodeId);

                var html = this.getStartElementHtml("div", {class: _class, id: _id});

                html += this.getElementHtml("span", {class:"keyword"}, "for") + " "
                    + "(" + this.generateHtml(forStatement.init) + "; "
                    + this.generateHtml(forStatement.test) + "; "
                    + this.generateHtml(forStatement.update) + ") "
                    + this.generateHtml(forStatement.body);

                html += this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from for statement:" + e); }
        },

        generateFromForInStatement: function(forInStatement)
        {
            try
            {
                if(!astHelper.isForInStatement(forInStatement)) { alert("Invalid element when generating for...in statement html code!"); return ""; }

                var _class = astHelper.CONST.STATEMENT.ForInStatement + " node";
                var _id = "node" + this.formatId(forInStatement.nodeId);

                var html = this.getStartElementHtml("div", {class: _class, id: _id});

                html += this.getElementHtml("span", {class:"keyword"}, "for") + " ";

                if(forInStatement.each === true) html += this.getElementHtml("span", {class:"keyword"}, "each") + " ";

                html += "(" + this.generateHtml(forInStatement.left)
                    + " in " + this.generateExpression(forInStatement.right) + ")";

                if(!astHelper.isBlockStatement(forInStatement.body))
                    html += "<br>";

                html += this.generateStatement(forInStatement.body);

                html += this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from for...in statement:" + e); }
        },

        generateFromBreakStatement: function(breakStatement)
        {
            try
            {
                if(!astHelper.isBreakStatement(breakStatement)) { alert("Invalid element when generating break statement html code!"); return ""; }

                var _class = astHelper.CONST.STATEMENT.BreakStatement + " node";
                var _id = "node" + this.formatId(breakStatement.nodeId);
                var _style = this.getStyle(breakStatement);

                var html = this.getStartElementHtml("div", {class: _class, id: _id, style: _style})
                    + this.getElementHtml("span", {class:"keyword"}, "break");

                if(breakStatement.label != null) html += " " + this.generateFromIdentifier(breakStatement.label);

                html += ";" + this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from break statement:" + e); }
        },

        generateFromContinueStatement: function(continueStatement)
        {
            try
            {
                if(!astHelper.isContinueStatement(continueStatement)) { alert("Invalid element when generating continue statement html code!"); return ""; }

                var _class =  astHelper.CONST.STATEMENT.ContinueStatement + " node";
                var _id = "node" + this.formatId(continueStatement.nodeId);
                var _style = this.getStyle(continueStatement);

                var html = this.getStartElementHtml("div", {class: _class, id: _id, style: _style})
                    + this.getElementHtml("span", {class:"keyword"}, "continue");

                if(continueStatement.label != null) html += " " + this.generateFromIdentifier(continueStatement.label);

                html += ";" + this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from continue statement:" + e); }
        },

        generateFromReturnStatement: function(returnStatement)
        {
            try
            {
                if(!astHelper.isReturnStatement(returnStatement)) { alert("Invalid element when generating return statement html code!"); return ""; }

                var _class = astHelper.CONST.STATEMENT.ReturnStatement + " node";
                var _id = "node" + this.formatId(returnStatement.nodeId);
                var _style = this.getStyle(returnStatement);

                var html = this.getStartElementHtml("div", {class: _class, id: _id, style: _style})
                    + this.getElementHtml("span", {class:"keyword"}, "return");

                if(returnStatement.argument != null) html += " " + this.generateExpression(returnStatement.argument);

                html += ";" + this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from return statement:" + e); }
        },

        generateFromWithStatement: function(withStatement)
        {
            try
            {
                if(!astHelper.isWithStatement(withStatement)) { alert("Invalid element when generating with statement html code!"); return ""; }

                var _class = astHelper.CONST.STATEMENT.WithStatement + " node";
                var _id = "node" + this.formatId(withStatement.nodeId);

                var html = this.getStartElementHtml("div", {class: _class, id: _id})
                    + this.getElementHtml("span", {class:"keyword"}, "with") + " ("
                    + this.generateExpression(withStatement.object) + ")"
                    + this.generateStatement(withStatement.body)
                    + this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from with statement:" + e); }
        },

        generateFromThrowStatement: function(throwStatement)
        {
            try
            {
                if(!astHelper.isThrowStatement(throwStatement)) { alert("Invalid element when generating throw statement html code!"); return ""; }

                var _class = astHelper.CONST.STATEMENT.ThrowStatement + " node";
                var _id =  "node" + this.formatId(throwStatement.nodeId);

                var html = this.getStartElementHtml("div", {class: _class, id: _id})
                    + this.getElementHtml("span", {class: "keyword"}, "throw")
                    + " " + this.generateExpression(throwStatement.argument)
                    + ";" + this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from throw statement:" + e); }
        },

        generateFromSwitchStatement: function(switchStatement)
        {
            try
            {
                if(!astHelper.isSwitchStatement(switchStatement)) { alert("Invalid element when generating switch statement html code!"); return ""; }

                var _class = astHelper.CONST.STATEMENT.SwitchStatement + " node";
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
            }
            catch(e) { alert("Error when generating HTML from switch statement:" + e); }
        },

        generateFromSwitchCase: function(switchCase)
        {
            try
            {
                if(!astHelper.isSwitchCase(switchCase)) { alert("Invalid element when generating switch case html code!"); return ""; }

                var _class = astHelper.CONST.SwitchCase + " node";
                var _id = "node" + this.formatId(switchCase.nodeId);
                var _style =  "padding-left: 20px;";

                var html = this.getStartElementHtml("div", {class: _class, style: _style,id: _id})
                    + " ";

                if(switchCase.test === null) html += "default:<br>";
                else html += "case " + this.generateExpression(switchCase.test) + ":<br>";

                for(var i = 0; i < switchCase.consequent.length; i++)
                {
                    html += this.generateStatement(switchCase.consequent[i]);
                }

                html += this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from switch case:" + e); }
        },

        generateFromTryStatement: function(tryStatement)
        {
            try
            {
                if(!astHelper.isTryStatement(tryStatement)) { alert("Invalid element when generating try statement html code!"); return ""; }

                var _class = astHelper.CONST.STATEMENT.TryStatement  + " node";
                var _id = "node" + this.formatId(tryStatement.nodeId);

                var html = this.getStartElementHtml("div", {class: _class, id: _id})
                    + this.getElementHtml("span", {class:"keyword"}, "try")
                    + this.generateHtml(tryStatement.block);

                // catch clauses
                for(var i = 0; i < tryStatement.handlers.length; i++)
                {
                    html += this.generateFromCatchClause(tryStatement.handlers[i]);
                }

                if(tryStatement.finalizer != null)
                {
                    html += this.getElementHtml("span", {class:"keyword"}, "finally")
                        + this.generateHtml(tryStatement.finalizer);
                }

                html += this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from try statement:" + e); }
        },

        generateFromLabeledStatement: function(labeledStatement)
        {
            try
            {
                if(!astHelper.isLabeledStatement(labeledStatement)) { alert("Invalid element when generating labeled statement html code!"); return ""; }

                var _class = astHelper.CONST.STATEMENT.LabeledStatement + " node";
                var _id = "node" + this.formatId(labeledStatement.nodeId);

                var html = this.getStartElementHtml("div", {class: _class, id: _id})
                    + this.generateFromIdentifier(labeledStatement.label) + ": "
                    + this.generateHtml(labeledStatement.body)
                    + this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from labeled statement:" + e); }
        },

        generateFromVariableDeclaration: function(variableDeclaration)
        {
            try {
                if (!astHelper.isVariableDeclaration(variableDeclaration)) {
                    alert("Invalid element when generating html variable declaration");
                    return "";
                }

                var html = "";

                var _class = astHelper.CONST.VariableDeclaration + " node";
                var _id = "node" + this.formatId(variableDeclaration.nodeId);

                html += this.getStartElementHtml("span", {class: _class, id: _id});
                html += this.getElementHtml("span", {class:"keyword"}, variableDeclaration.kind);
                html += " ";

                for (var i = 0; i < variableDeclaration.declarations.length; i++) {
                    var previousDeclarator = i == 0 ? variableDeclaration : variableDeclaration.declarations[i - 1];
                    var currentDeclarator = variableDeclaration.declarations[i];

//                    if (previousDeclarator.loc.start.line != currentDeclarator.loc.start.line) {
//                        //html += "<br/>";
//                    }
//
                    if (previousDeclarator != variableDeclaration) {
                        html += ", ";
                    }

                    html += this.generateFromVariableDeclarator(currentDeclarator);
                }

                if (variableDeclaration.parent == "ForStatement"
                    || variableDeclaration.parent == "ForInStatement")
                {
                    html += this.getEndElementHtml("span");
                }
                else
                {
                    html += ";" + this.getEndElementHtml("span") + "<br>";
                }

                return html;
            }
            catch(e) { alert("Error when generating HTML from variable declaration:" + e);}
        },

        generateFromVariableDeclarator: function(variableDeclarator)
        {
            try
            {
                if(!astHelper.isVariableDeclarator(variableDeclarator)) { alert("The element is not a variable declarator when generating html code!"); return ""; }

                var html = this.getStartElementHtml("span", {class: astHelper.CONST.VariableDeclarator, id: "node" + this.formatId(variableDeclarator.nodeId)});

                html += this.generateFromPattern(variableDeclarator.id);

                if(variableDeclarator.init != null)
                {
                    html += " = ";
                    html += this.generateHtml(variableDeclarator.init);
                }

                return html + this.getEndElementHtml("span");
            }
            catch(e) { alert("Error when generating HTML code from variableDeclarator - CodeMarkupGenerator:" + e);}
        },

        generateFromPattern: function(pattern)
        {
            try
            {
                //NOT FINISHED: there are other patterns!
                if(!astHelper.isIdentifier(pattern)) { alert("The pattern is not an identifier when generating html."); return "";}

                if(astHelper.isIdentifier(pattern)) { return this.generateFromIdentifier(pattern);}
            }
            catch(e) { alert("Error when generating HTML from pattern:" + e);}
        },

        generateFromCatchClause: function(catchClause)
        {
            try
            {
                if(!astHelper.isCatchClause(catchClause)) { alert("Invalid element when generating catch clause html code!"); return ""; }

                var _class = astHelper.CONST.CatchClause + " node";
                var _id = "node" + this.formatId(catchClause.nodeId);

                var html = this.getStartElementHtml("div", {class: _class, id: _id})
                    + this.getElementHtml("span", {class: "keyword"}, "catch");

                html += " (" + this.generateHtml(catchClause.param);

                if(catchClause.guard != null) html += " if " + this.generateExpression(catchClause.guard);

                html += ")";
                html += this.generateStatement(catchClause.body);

                html += this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from catch clause:" + e);}
        },

        generateFromIdentifier: function(identifier)
        {
            try
            {
                if(!astHelper.isIdentifier(identifier)) { alert("The identifier is not valid when generating html."); return "";}

                var _class = astHelper.CONST.Identifier + " node";
                var _id = "node" + this.formatId(identifier.nodeId);
                var _padding = this.getStyle(identifier);

                return this.getElementHtml("span", {class: _class, id: _id, style: _padding}, identifier.name);
            }
            catch(e) { alert("Error when generating HTML from an identifier:" + e);}
        },

        generateFromExpression: function(expression)
        {
            try
            {
                if(!astHelper.isLiteral(expression)) { alert("Currently when generating html from expressions we only support literals!"); return; }

                if(astHelper.isLiteral(expression))
                {
                    var _class = astHelper.CONST.Literal;
                    var _id = "node" + this.formatId(expression.nodeId);

                    return this.getElementHtml("span", {class: _class, id: _id}, expression.value);
                }
                if(astHelper.isIdentifier(expression))
                {
                    var _class =  astHelper.CONST.Identifier + " node";
                    var _id = "node" + this.formatId(expression.nodeId);

                    return this.getElementHtml("span", {class: _class, id: _id}, expression.name);
                }
                if(astHelper.isUpdateExpression(expression))
                {
                    var html = "";


                    return html;
                }
            }
            catch(e) { alert("Error when generating HTML from expression:" + e);}
        },

        generateFromLiteral: function(literal)
        {
            try
            {
                if (!astHelper.isLiteral(literal)) { alert("The literal is not valid when generating html."); return ""; }

                if (valueTypeHelper.isString(literal.value))
                    return this.getElementHtml("span", {class: "String", id: "node" + this.formatId(literal.nodeId)}, "\"" + this.escapeHtml(literal.value) + "\"");
                else if (valueTypeHelper.isBoolean(literal.value) || valueTypeHelper.isNull(literal.value))
                    return this.getElementHtml("span", {class: "Keyword", id: "node" + this.formatId(literal.nodeId)}, literal.value);
                else if(valueTypeHelper.isInteger(literal.value))
                    return this.getElementHtml("span", {class: "Number", id: "node" + this.formatId(literal.nodeId)}, literal.value);
                else if(valueTypeHelper.isRegExp(literal.value))
                {
                    alert("RegExp!!");
                    return this.getElementHtml("span", {class: "RegExp", id: "node" + this.formatId(literal.nodeId)}, literal.value);
                }
                else
                    return this.getElementHtml("span", {class: astHelper.CONST.Literal, id: "node" + this.formatId(literal.nodeId)}, literal.value);
            }
            catch(e) { alert("Error when generating HTML from literal:" + e);}
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

        getHtmlContent: function(content)
        {
            return this.currentIntendation + content;
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

        generateCodeContainer: function(content)
        {
            try
            {
                var html = "";

                html += this.getElementHtml("div", {class: "lineContainer"}, this.lineNumber++);
                html += this.getElementHtml("div", {class: "codeContainer"}, content);

                return html;
            }
            catch(e) { alert("Error when generating code container: " + e)}
        },

        getStyle: function(currentElement)
        {
            if( currentElement.parent == "ForStatement"
                || currentElement.parent == "ForInStatement"
                || currentElement.parent == "WhileStatement"
                || currentElement.parent == "DoWhileStatement"
                || currentElement.parent == "IfStatement"
                || currentElement.parent == "SwitchCase")
            {
                return "padding-left: 20px";
            }
            if (currentElement.type == "ObjectExpression")
            {
//                console.log(currentElement.parent);

//                if(currentElement.parent == "VariableDeclarator" && currentElement.properties.length > 1)
//                {
//                    return "display: block"
//                }
//                else
//                {
//                    return "display: inline";
//                }
            }
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
        }
    }
}});