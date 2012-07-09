FBL.ns(function () { with (FBL) {
    /*******/

    var ValueTypeHelper = Firecrow.ValueTypeHelper;

    Firecrow.ASTHelper =
    {
        parseSourceCodeToAST: function(sourceCode, sourceCodePath, startLine)
        {
            try
            {
                Components.utils.import("resource://gre/modules/reflect.jsm");

                return Reflect.parse
                (
                    sourceCode,
                    { loc:true, source: sourceCodePath, line: startLine }
                );
            }
            catch(e) { alert("Error while getting AST from source code@" + sourceCodePath + "; error: " + sourceCodePath); }
        },

        setParentsChildRelationships: function(rootElement)
        {
            try
            {
                var ASTHelper = Firecrow.ASTHelper;
                this.traverseAst(rootElement, function(currentElement, propertyName, parentElement)
                {
                    if(currentElement != null)
                    {
                        currentElement.parent = parentElement;
                    }

                    if(parentElement != null)
                    {
                        if(parentElement.children == null) { parentElement.children = []; }

                        if(currentElement != null)
                        {
                            currentElement.indexInParent = parentElement.children.length;

                            if(ASTHelper.getFunctionParent(currentElement) != null)
                            {
                                for(var i = parentElement.children.length - 1; i >= 0; i--)
                                {
                                    var child = parentElement.children[i];

                                    if((ASTHelper.isLoopStatement(child) || ASTHelper.isIfStatement(child)))
                                    {
                                        currentElement.previousCondition = child.test;
                                        break;
                                    }
                                }

                                if(ASTHelper.isStatement(parentElement) && currentElement.previousCondition == null)
                                {
                                    currentElement.previousCondition = parentElement.previousCondition;
                                }
                            }

                            parentElement.children.push(currentElement);
                        }
                    }
                });
            }
            catch(e) { alert("Error when setting parent-child relationships:" + e); }
        },

        getTypeExpressionsFromProgram: function(program, types)
        {
            try
            {
                var result = {};

                var traverserFunction = function(elementValue, elementName, parentObject)
                {
                    types.forEach(function(type)
                    {
                        if(elementName === "type" &&  elementValue === type)
                        {
                            if(result[type] == null) { result[type] = []; }

                            result[type].push(parentObject);
                        }
                    });
                };

                this.traverseAst(program, traverserFunction);

                return result;
            }
            catch(e) { alert("Error while getting type expressions from program in ASTHelper: " + e);}
        },

        traverseAst: function(astElement, processElementFunction)
        {
            try
            {
                if(!(ValueTypeHelper.isObject(astElement))) { return; }

                for(var propName in astElement)
                {
                    //Do not traverse the source code location properties and parents and graphNodes!
                    if(propName == "loc"
                        || propName == "parent"
                        || propName == "graphNode"
                        || propName == "children"
                        || propName == "domElement"
                        || propName == "graphNode"
                        || propName == "htmlNode"
                        || propName == "attributes"
                        || propName == "previousCondition"
                        || propName == "includesNodes"
                        || propName == "includedByNodes") { continue; }

                    var propertyValue = astElement[propName];

                    if(propertyValue == null) { continue; }

                    if(ValueTypeHelper.isArray(propertyValue))
                    {
                        for(var i = 0; i < propertyValue.length; i++)
                        {
                            if(ValueTypeHelper.isObject(propertyValue[i]))
                            {
                                processElementFunction(propertyValue[i], propName, astElement, i);
                                this.traverseAst(propertyValue[i], processElementFunction);
                            }
                        }
                    }
                    else if (ValueTypeHelper.isObject(propertyValue))
                    {
                        processElementFunction(propertyValue, propName, astElement);
                        this.traverseAst(propertyValue, processElementFunction);
                    }
                }
            }
            catch(e)
            {
                alert("Error while traversing AST in ASTHelper: " + e);
            }
        },

        traverseDirectSourceElements: function(astElement, processSourceElementFunction, enterBranchAndLoops)
        {
            try
            {
                if((this.isStatement(astElement)
                    || this.isFunctionDeclaration(astElement)
                    || this.isVariableDeclaration(astElement))
                   && !this.isBlockStatement(astElement))
                {
                    processSourceElementFunction(astElement);
                }

                if(this.isProgram(astElement)
                    || this.isBlockStatement(astElement))
                {
                    this.traverseArrayOfDirectStatements(astElement.body, astElement, processSourceElementFunction, enterBranchAndLoops);
                }
                else if (this.isIfStatement(astElement))
                {
                    if(enterBranchAndLoops)
                    {
                        this.traverseDirectSourceElements(astElement.consequent, processSourceElementFunction, enterBranchAndLoops);

                        if(astElement.alternate != null)
                        {
                            this.traverseDirectSourceElements(astElement.alternate, processSourceElementFunction, enterBranchAndLoops);
                        }
                    }
                }
                else if (this.isLabeledStatement(astElement)
                    || this.isLetStatement(astElement))
                {
                    this.traverseDirectSourceElements(astElement.body, processSourceElementFunction, enterBranchAndLoops);
                }
                else if (this.isLoopStatement(astElement)
                    || this.isWithStatement(astElement))
                {
                    if(enterBranchAndLoops)
                    {
                        this.traverseDirectSourceElements(astElement.body, processSourceElementFunction, enterBranchAndLoops);
                    }
                }
                else if (this.isSwitchStatement(astElement))
                {
                    if(enterBranchAndLoops)
                    {
                        astElement.cases.forEach(function(switchCase)
                        {
                            this.traverseArrayOfDirectStatements
                                (
                                    switchCase.consequent,
                                    astElement,
                                    processSourceElementFunction,
                                    enterBranchAndLoops
                                );
                        }, this);
                    }
                }
                else if(this.isTryStatement(astElement))
                {
                    if(enterBranchAndLoops)
                    {
                        this.traverseDirectSourceElements(astElement.block, processSourceElementFunction, enterBranchAndLoops);

                        astElement.handlers.forEach(function(catchClause)
                        {
                            this.traverseDirectSourceElements(catchClause.body, processSourceElementFunction, enterBranchAndLoops);
                        }, this);
                    }

                    if(astElement.finalizer != null)
                    {
                        this.traverseDirectSourceElements(astElement.finalizer, processSourceElementFunction, enterBranchAndLoops);
                    }
                }
                else if (this.isBreakStatement(astElement)
                    || this.isContinueStatement(astElement)
                    || this.isReturnStatement(astElement)
                    || this.isThrowStatement(astElement)
                    || this.isDebuggerStatement(astElement)) { }
            }
            catch(e) { alert("Error while traversing direct source elements in ASTHelper: " + e); }
        },

        traverseArrayOfDirectStatements: function(statements, parentElement, processSourceElementFunction, enterBranchAndLoops)
        {
            try
            {
                statements.forEach(function(statement)
                {
                    this.traverseDirectSourceElements(statement, processSourceElementFunction, enterBranchAndLoops);
                }, this);
            }
            catch(e) { alert("Error while traversing direct statements: " + e + " for " + JSON.stringify(parentElement));}
        },

        getParentOfTypes: function(codeConstruct, types)
        {
            var parent = codeConstruct.parent;

            while(parent != null)
            {
                for(var i = 0; i < types.length; i++)
                {
                    if(parent.type === types[i]) { return parent; }
                }

                parent = parent.parent;
            }

            return parent;
        },

        isForStatementInit: function(codeConstruct)
        {
            if(codeConstruct == null) { return false; }

            var loopParent = this.getLoopParent(codeConstruct);

            if(loopParent == null) { return false; }

            if(this.isForStatement(loopParent)) { return loopParent.init == codeConstruct;}
            else if (this.isForInStatement(loopParent)) { return loopParent.left == codeConstruct; }

            return false;
        },

        isElseIfStatement: function(codeConstruct)
        {
            if(!this.isIfStatement(codeConstruct)){ return false; }

            return this.isIfStatement(codeConstruct.parent) && codeConstruct.parent.alternate == codeConstruct;
        },

        isObjectExpressionPropertyValue: function(element)
        {
            if(element == null) { return false; }

            return this.isElementOfType(element, this.CONST.Property);
        },

        isFunctionExpressionBlockAsObjectProperty: function(element)
        {
            if(element == null) { return false; }
            if(element.parent == null) { return false; }

            return this.isFunctionExpression(element.parent) && this.isElementOfType(element.parent.parent, this.CONST.Property);
        },

        isCallExpressionCallee: function(element)
        {
            if(element == null) { return false; }

            return this.isCallExpression(element.parent) && element.parent.callee == element;
        },

        isLastPropertyInLeftHandAssignment: function(element)
        {
            if(element == null) { return false; }

            return this.isMemberExpression(element.parent) && this.isAssignmentExpression(element.parent.parent)
                 && element.parent.parent.left == element.parent && element.parent.parent.operator.length == 1;
        },

        getLastLoopOrBranchingConditionInFunctionBody: function(element)
        {
            if(!this.isFunction(element)){ return null; }

            var firstLevelStatements = element.body.body;

            for(var i = firstLevelStatements.length - 1; i >= 0; i--)
            {
                var statement = firstLevelStatements[i];
                if(this.isIfStatement(statement) || this.isLoopStatement(statement)){ return statement.test; }
                else if (this.isWithStatement(statement)) { return statement.object; }
                else if (this.isForInStatement(statement)) { return statement.right; }
            }

            return null;
        },

        containsCallOrUpdateOrAssignmentExpression: function(element)
        {
            if(element == null) { return false; }

            if(this.isCallExpression(element) || this.isUpdateExpression(element) || this.isAssignmentExpression(element)) { return true;}

            if(element.containsCallOrUpdateOrAssignmentExpression === true
            || element.containsCallOrUpdateOrAssignmentExpression === false)
            {
                return element.containsCallOrUpdateOrAssignmentExpression;
            }

            var containsCallOrUpdateOrAssignmentExpression = false;

            var ASTHelper = Firecrow.ASTHelper;

            this.traverseAst(element, function(currentElement)
            {
                if(ASTHelper.isCallExpression(currentElement)
                || ASTHelper.isAssignmentExpression(currentElement)
                || ASTHelper.isUpdateExpression(currentElement))
                {
                    containsCallOrUpdateOrAssignmentExpression = true;
                }
            });

            element.containsCallOrUpdateOrAssignmentExpression = containsCallOrUpdateOrAssignmentExpression;

            return containsCallOrUpdateOrAssignmentExpression;
        },

        isFunctionParameter: function(element)
        {
            if(!this.isIdentifier(element)){ return false; }
            if(!this.isFunction(element.parent)) { return false;}

            var functionParent = element.parent;
            var params = functionParent.params;

            for(var i = 0; i < params.length; i++)
            {
                if(params[i] ==  element) { return true;}
            }

            return false;
        },

        getFunctionParent: function(codeConstruct)
        {
            return this.getParentOfTypes
            (
                codeConstruct,
                [
                    this.CONST.FunctionDeclaration,
                    this.CONST.EXPRESSION.FunctionExpression
                ]
            );
        },

        getLoopOrSwitchParent: function(codeConstruct)
        {
            return this.getParentOfTypes
            (
                codeConstruct,
                [
                    this.CONST.STATEMENT.ForStatement,
                    this.CONST.STATEMENT.ForInStatement,
                    this.CONST.STATEMENT.WhileStatement,
                    this.CONST.STATEMENT.DoWhileStatement,
                    this.CONST.STATEMENT.SwitchStatement
                ]
            );
        },

        getLoopParent: function(codeConstruct)
        {
            return this.getParentOfTypes
            (
                codeConstruct,
                [
                    this.CONST.STATEMENT.ForStatement,
                    this.CONST.STATEMENT.ForInStatement,
                    this.CONST.STATEMENT.WhileStatement,
                    this.CONST.STATEMENT.DoWhileStatement
                ]
            );
        },

        getSwitchParent: function(codeConstruct)
        {
            return this.getParentOfTypes
            (
                codeConstruct,
                [ this.CONST.STATEMENT.SwitchStatement ]
            );
        },

        isElementOfType: function(element, type)
        {
            if(element == null) { return false; }

            return element.type === type;
        },

        isExpression: function(element)
        {
            return element != null ? this.CONST.EXPRESSION[element.type] != null
                : false;
        },

        isProgram: function(element) { return this.isElementOfType(element, this.CONST.Program); },
        isFunction: function(element) { return this.isFunctionDeclaration(element) || this.isFunctionExpression(element); },
        isFunctionDeclaration: function(element) { return this.isElementOfType(element, this.CONST.FunctionDeclaration); },
        isVariableDeclaration: function(element) { return this.isElementOfType(element, this.CONST.VariableDeclaration); },
        isVariableDeclarator: function(element) { return this.isElementOfType(element, this.CONST.VariableDeclarator); },
        isSwitchCase: function(element) { return this.isElementOfType(element, this.CONST.SwitchCase); },
        isCatchClause: function(element) { return this.isElementOfType(element, this.CONST.CatchClause); },
        isIdentifier: function(element) { return this.isElementOfType(element, this.CONST.Identifier); },
        isLiteral: function(element) { return this.isElementOfType(element, this.CONST.Literal); },

        isStatement: function(element)
        {
            return element != null ? this.CONST.STATEMENT[element.type] != null
                : false;
        },
        isEmptyStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.EmptyStatement); },
        isBlockStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.BlockStatement); },
        isExpressionStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.ExpressionStatement); },
        isIfStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.IfStatement); },
        isLabeledStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.LabeledStatement); },
        isBreakStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.BreakStatement); },
        isContinueStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.ContinueStatement); },
        isWithStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.WithStatement); },
        isSwitchStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.SwitchStatement); },
        isReturnStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.ReturnStatement); },
        isThrowStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.ThrowStatement); },
        isTryStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.TryStatement); },

        isLoopStatement: function(element)
        {
            return this.isWhileStatement(element)
                || this.isDoWhileStatement(element)
                || this.isForStatement(element)
                || this.isForInStatement(element);
        },

        isLoopStatementCondition: function(element)
        {
            return this.isLoopStatement(element.parent) && element.parent.test == element;
        },

        isWhileStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.WhileStatement); },
        isDoWhileStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.DoWhileStatement); },
        isForStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.ForStatement); },
        isForInStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.ForInStatement); },
        isLetStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.LetStatement); },
        isDebuggerStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.DebuggerStatement); },

        isThisExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.ThisExpression); },
        isArrayExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.ArrayExpression); },
        isObjectExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.ObjectExpression); },
        isFunctionExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.FunctionExpression); },
        isSequenceExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.SequenceExpression); },
        isUnaryExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.UnaryExpression); },
        isBinaryExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.BinaryExpression); },
        isAssignmentExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.AssignmentExpression); },
        isUpdateExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.UpdateExpression); },
        isLogicalExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.LogicalExpression); },
        isConditionalExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.ConditionalExpression); },
        isNewExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.NewExpression); },
        isCallExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.CallExpression); },
        isMemberExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.MemberExpression); },
        isYieldExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.YieldExpression); },
        isComprehensionExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.ComprehensionExpression); },
        isGeneratorExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.GeneratorExpression); },
        isLetExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.LetExpression); },

        isUnaryOperator: function(element) { return this.isElementOfType(element, this.CONST.OPERATOR.UnaryOperator); },
        isBinaryOperator: function(element) { return this.isElementOfType(element, this.CONST.OPERATOR.BinaryOperator); },
        isAssignmentOperator: function(element) { return this.isElementOfType(element, this.CONST.OPERATOR.AssignmentOperator); },
        isUpdateOperator: function(element) { return this.isElementOfType(element, this.CONST.OPERATOR.UpdateOperator); },
        isLogicalOperator: function(element) { return this.isElementOfType(element, this.CONST.OPERATOR.LogicalOperator); },

        isBinaryEqualityOperator:function (element)
        {
            return element == "==" || element == "==="
                || element == "!=" || element == "!==";
        },

        isBinaryMathOperator:function (element)
        {
            return element == "+" || element == "-"
                || element == "*" || element == "/" || element == "%";
        },

        isBinaryRelationalOperator:function (element)
        {
            return element == "<" || element == "<="
                || element == ">" || element == ">=";
        },

        isBinaryBitOperator:function (element)
        {
            return element == "|" || element == "&"
                || element == "^"
                || element == "<<" || element == ">>"
                || element == ">>>";
        },

        isBinaryObjectOperator:function (element)
        {
            return element == "in" || element == "instanceof";
        },

        isBinaryXmlOperator:function (element)
        {
            return element == "..";
        },

        CONST :
        {
            Program: "Program",
            FunctionDeclaration: "FunctionDeclaration",
            VariableDeclaration: "VariableDeclaration",
            VariableDeclarator: "VariableDeclarator",
            SwitchCase: "SwitchCase",
            CatchClause: "CatchClause",
            Identifier: "Identifier",
            Literal: "Literal",
            Property: "Property",
            STATEMENT:
            {
                EmptyStatement: "EmptyStatement",
                BlockStatement: "BlockStatement",
                ExpressionStatement : "ExpressionStatement",
                IfStatement: "IfStatement",
                LabeledStatement: "LabeledStatement",
                BreakStatement: "BreakStatement",
                ContinueStatement: "ContinueStatement",
                WithStatement: "WithStatement",
                SwitchStatement: "SwitchStatement",
                ReturnStatement: "ReturnStatement",
                ThrowStatement: "ThrowStatement",
                TryStatement: "TryStatement",
                WhileStatement: "WhileStatement",
                DoWhileStatement: "DoWhileStatement",
                ForStatement: "ForStatement",
                ForInStatement: "ForInStatement",
                LetStatement: "LetStatement",
                DebuggerStatement: "DebuggerStatement"
            },
            EXPRESSION:
            {
                ThisExpression : "ThisExpression",
                ArrayExpression: "ArrayExpression",
                ObjectExpression: "ObjectExpression",
                FunctionExpression: "FunctionExpression",
                SequenceExpression: "SequenceExpression",
                UnaryExpression: "UnaryExpression",
                BinaryExpression: "BinaryExpression",
                AssignmentExpression: "AssignmentExpression",
                UpdateExpression: "UpdateExpression",
                LogicalExpression: "LogicalExpression",
                ConditionalExpression: "ConditionalExpression",
                NewExpression: "NewExpression",
                CallExpression: "CallExpression",
                MemberExpression: "MemberExpression",
                YieldExpression: "YieldExpression",
                ComprehensionExpression: "ComprehensionExpression",
                GeneratorExpression: "GeneratorExpression",
                LetExpression: "LetExpression"
            },
            OPERATOR:
            {
                UnaryOperator : "UnaryOperator",
                BinaryOperator: "BinaryOperator",
                AssignmentOperator: "AssignmentOperator",
                UpdateOperator: "UpdateOperator",
                LogicalOperator: "LogicalOperator"
            }
        }
    };
    /******/
}});