FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcValueTypeHelper = Firecrow.ValueTypeHelper;
var fcASTHelper = Firecrow.ASTHelper;

Firecrow.CloneDetector = {};

Firecrow.CloneDetector.CssCloneDetector =
{
    getPotentialClones: function(codeModel)
    {
        var cssRules = fcASTHelper.getCssRules(codeModel);

        var possibleClones = [];

        for(var i = 0; i < cssRules.length - 1; i++)
        {
            var iThRule = cssRules[i];

            for(var j = i + 1; j < cssRules.length; j++)
            {
                var jThRule = cssRules[j];

                var possibleClone = this.getPotentialClone(iThRule, jThRule);

                if(possibleClone != null)
                {
                    possibleClones.push(possibleClone);
                }
            }
        }

        possibleClones.sort(function(a, b)
        {
            return a.properties.length - b.properties.length;
        });

        return possibleClones;
    },

    getPotentialClone: function(iThRule, jThRule)
    {
        var ithProperties = iThRule.properties;
        var jthProperties = jThRule.properties;

        var sameProperties = {};

        for(var i = 0; i < ithProperties.length; i++)
        {
            var ithProperty = ithProperties[i];

            var foundProperty = this.findProperty(jThRule, ithProperty.key + ithProperty.value);

            if(foundProperty != null)
            {
                var foundPropertyKeyValue = foundProperty.key + foundProperty.value;
                if(sameProperties[foundPropertyKeyValue] == null)
                {
                    sameProperties[foundPropertyKeyValue] = foundProperty;
                }
            }
        }

        for(var j = 0; j < jthProperties.length; j++)
        {
            var jthProperty = jthProperties[j];
            var foundProperty = this.findProperty(iThRule, jthProperty.key + jthProperty.value);

            if(foundProperty != null)
            {
                var foundPropertyKeyValue = foundProperty.key + foundProperty.value;
                if(sameProperties[foundPropertyKeyValue] == null)
                {
                    sameProperties[foundPropertyKeyValue] = foundProperty;
                }
            }
        }

        var sharedProperties = [];

        for(var propName in sameProperties)
        {
            sharedProperties.push(sameProperties[propName]);
        }

        return sharedProperties.length > Firecrow.CloneDetector.CssCloneDetector.MIN_NUMBER_OF_RULES
            ? new Firecrow.CloneDetector.CssCloneDetector.CssCloneItem(iThRule, jThRule, sharedProperties)
            : null;
    },

    findProperty: function(cssRule, propertyNameValue)
    {
        if(cssRule == null || cssRule.properties == null) { return null; }

        var properties = cssRule.properties;

        for(var i = 0; i < properties.length; i++)
        {
            var property = properties[i];

            if(propertyNameValue == property.key + property.value)
            {
                return property;
            }
        }

        return null;
    }
};

Firecrow.CloneDetector.CssCloneDetector.MIN_NUMBER_OF_RULES = 5;

Firecrow.CloneDetector.CssCloneDetector.CssCloneItem = function(ruleA, ruleB, properties)
{
    this.ruleA = ruleA;
    this.ruleB = ruleB;
    this.properties = properties;

    this.ruleAShared = properties.length/ruleA.properties.length;
    this.ruleBShared = properties.length/ruleB.properties.length;
    this.jointShared = this.ruleAShared + this.ruleBShared;
};

Firecrow.CloneDetector.JsCloneDetector =
{
    _GROUP_TOLERANCE: 4,
    _SIMILARITY_THRESHOLD: 0.95,
    _MIN_NUMBER_OF_ITEMS: 10,

    getPotentialClones: function(codeModel)
    {
        fcASTHelper.setParentsChildRelationships(codeModel);
        Firecrow.CloneDetector.VectorGenerator.generateFromPageModel(codeModel);

        var cloneItems = [];

        var candidateGroups = this.groupCandidates(this.getCandidates(fcASTHelper.getAllElementsOfType
        (
            codeModel,
            [
                fcASTHelper.CONST.FunctionDeclaration, fcASTHelper.CONST.EXPRESSION.FunctionExpression,
                fcASTHelper.CONST.STATEMENT.ForStatement, fcASTHelper.CONST.STATEMENT.ForInStatement,
                fcASTHelper.CONST.STATEMENT.WhileStatement, fcASTHelper.CONST.STATEMENT.DoWhileStatement,
                fcASTHelper.CONST.STATEMENT.SwitchStatement, fcASTHelper.CONST.Program,
                fcASTHelper.CONST.STATEMENT.IfStatement
            ]
        )));

        for(var i = 0, noOfGroups = candidateGroups.length; i < noOfGroups; i++)
        {
            var group = candidateGroups[i];

            if(group == null) { continue; }

            var endSubListIndex = i + this._GROUP_TOLERANCE;
            if(endSubListIndex >= noOfGroups) { endSubListIndex = noOfGroups - 1;}

            var comparableItems = fcValueTypeHelper.flattenArray(fcValueTypeHelper.getSubList(candidateGroups, i, endSubListIndex));

            for(var j = 0, comparableItemsLength = comparableItems.length; j < comparableItemsLength - 1; j++)
            {
                var groupItem = comparableItems[j];

                if(groupItem == null) { continue; }

                for(var k = j + 1; k < comparableItemsLength; k++)
                {
                    var compareGroupItem = comparableItems[k];

                    if(compareGroupItem == null) { continue; }

                    if(groupItem.id == compareGroupItem.id
                    || Firecrow.CloneDetector.JsCloneDetector.JsCloneCandidate.areOverlapping(groupItem, compareGroupItem)
                    || fcASTHelper.areRelated(groupItem.statements, compareGroupItem.statements))
                    {
                        continue;
                    }

                    var similarity = Firecrow.CloneDetector.CharacteristicVector.calculateSimilarity(groupItem.characteristicVector, compareGroupItem.characteristicVector);

                    if(similarity >= this._SIMILARITY_THRESHOLD)
                    {
                        cloneItems.push(new Firecrow.CloneDetector.JsCloneDetector.JsCloneItem(groupItem, compareGroupItem, similarity));
                    }
                }
            }
        }

        return this.removeSmallerFragments(cloneItems).sort(function(cloneItemA, cloneItemB)
        {
            return cloneItemA.getTotalNumberOfStatements() - cloneItemB.getTotalNumberOfStatements();
        });
    },

    removeSmallerFragments: function(cloneItems)
    {
        var trimmedList = [];

        for(var i = 0, length = cloneItems.length; i < length; i++)
        {
            var currentItem = cloneItems[i];
            var itemToAdd = currentItem;

            for(var j = i + 1; j < length; j++)
            {
                var compareItem = cloneItems[j];

                if(Firecrow.CloneDetector.JsCloneDetector.JsCloneItem.areSubsets(currentItem, compareItem))
                {
                    if(compareItem.getTotalNumberOfStatements() >= currentItem.getTotalNumberOfStatements())
                    {
                        itemToAdd = null;
                    }
                }
            }

            if(itemToAdd != null)
            {
                trimmedList.push(itemToAdd);
            }
        }

        return trimmedList;
    },

    groupCandidates: function(candidates)
    {
        var groups = [];

        var maxVectorSum = -1;

        for(var i = 0; i < candidates.length; i++)
        {
            var cloneCandidate = candidates[i];

            var characteristicVectorSum = cloneCandidate.characteristicVectorSum;
            if(characteristicVectorSum > maxVectorSum) { maxVectorSum = characteristicVectorSum; }

            var group = null;

            if(groups[characteristicVectorSum] == null)
            {
                group = [];
                groups[characteristicVectorSum] = group;
            }
            else
            {
                group = groups[characteristicVectorSum];
            }

            group.push(cloneCandidate);
        }

        return groups;
    },

    getCandidates: function(blockStatements)
    {
        var cloneCandidates = [];

        for(var h = 0; h < blockStatements.length; h++)
        {
            var blockStatement = blockStatements[h];

            var childStatements = fcASTHelper.getChildStatements(blockStatement);
            var combinations = Firecrow.CloneDetector.CombinationsGenerator.generateCombinations(childStatements.length);

            for (var i = 0; i < combinations.length; i++)
            {
                var combination = combinations[i];
                var candidateStatements = [];

                for (var j = 0; j < combination.length; j++ )
                {
                    candidateStatements.push(childStatements[combination[j]]);
                }

                var potentialCloneCandidate = new Firecrow.CloneDetector.JsCloneDetector.JsCloneCandidate(candidateStatements, blockStatement);

                if(potentialCloneCandidate.characteristicVectorSum >= this._MIN_NUMBER_OF_ITEMS)
                {
                    cloneCandidates.push(potentialCloneCandidate);
                }
            }
        }

        return cloneCandidates;
    }
};

Firecrow.CloneDetector.JsCloneDetector.JsCloneCandidate = function(statements, parentBlockStatement)
{
    this.statements = statements;
    this.parentBlockStatement = parentBlockStatement;
    this.characteristicVector = new Firecrow.CloneDetector.CharacteristicVector();

    this.id = Firecrow.CloneDetector.JsCloneDetector.JsCloneCandidate._LAST_ID++;

    for (var i = 0; i < statements.length; i++)
    {
        Firecrow.CloneDetector.CharacteristicVector.join(this.characteristicVector, statements[i].characteristicVector);
    }

    this.characteristicVectorSum = Firecrow.CloneDetector.CharacteristicVector.sum(this.characteristicVector);
}

Firecrow.CloneDetector.JsCloneDetector.JsCloneCandidate._LAST_ID = 0;

Firecrow.CloneDetector.JsCloneDetector.JsCloneCandidate.areOverlapping = function(cloneCandidate1, cloneCandidate2)
{
    if(cloneCandidate1.parentBlockStatement != cloneCandidate2.parentBlockStatement)  {  return false;  }
    if(cloneCandidate1.statements.length == 0 || cloneCandidate2.statements.length == 0) { return false; }

    var firstStatement1 = cloneCandidate1.statements[0].nodeId;
    var lastStatement1 = cloneCandidate1.statements[cloneCandidate1.statements.length - 1].nodeId;

    var firstStatement2 = cloneCandidate2.statements[0].nodeId;
    var lastStatement2 = cloneCandidate2.statements[cloneCandidate2.statements.length - 1].nodeId;

    return firstStatement1 <= firstStatement2 ? firstStatement2 <= lastStatement1
                                              : firstStatement1 <= lastStatement2;
}

Firecrow.CloneDetector.JsCloneDetector.JsCloneItem = function(candidateA, candidateB, similarity)
{
    this.candidateA = candidateA;
    this.candidateB = candidateB;

    this.id = Firecrow.CloneDetector.JsCloneDetector.JsCloneItem._LAST_ID++;

    this.similarity = similarity;

    this.getTotalNumberOfStatements = function()
    {
        return this.candidateA.statements.length + this.candidateB.statements.length;
    }
};

Firecrow.CloneDetector.JsCloneDetector.JsCloneItem._LAST_ID = 0;

Firecrow.CloneDetector.JsCloneDetector.JsCloneItem.areSubsets = function(itemA, itemB)
{
    var statementsA_A = itemA.candidateA.statements;
    var statementsA_B = itemA.candidateB.statements;

    var statementsB_A = itemB.candidateA.statements;
    var statementsB_B = itemB.candidateB.statements;

    return (this.areStatementsSubsets(statementsA_A, statementsB_A) && this.areStatementsSubsets(statementsA_B, statementsB_B))
        || (this.areStatementsSubsets(statementsA_A, statementsB_B) && this.areStatementsSubsets(statementsA_B, statementsB_A));
}

Firecrow.CloneDetector.JsCloneDetector.JsCloneItem.areStatementsSubsets = function(statementsA, statementsB)
{
    var smaller = null;
    var larger = null;

    statementsA.length >= statementsB.length ? (smaller = statementsB, larger = statementsA)
                                             : (smaller = statementsA, larger = statementsB);

    for(var i = 0; i < smaller.length; i++)
    {
        var statementSmaller = smaller[i];
        var isContained = false;

        for(var j = 0; j < larger.length; j++)
        {
            var statementLarger = larger[j];

            if(statementSmaller == statementLarger)
            {
                isContained = true;
                break;
            }

            if(!isContained) { return false; }
        }
    }

    return true;
};


Firecrow.CloneDetector.HtmlCloneDetector =
{
    _MIN_NUMBER_OF_NODES : 6,
    _SIMILARITY_THRESHOLD: 0.9,

    getPotentialClones: function(codeModel)
    {
        var potentialClones = [];

        fcASTHelper.setParentsChildRelationships(codeModel);
        Firecrow.CloneDetector.VectorGenerator.generateFromPageModel(codeModel);

        var htmlNodes = fcASTHelper.getAllHtmlNodes(codeModel.htmlElement);

        for(var i = 0, length = htmlNodes.length; i < length; i++)
        {
            var htmlNode = htmlNodes[i];
            var firstCharacteristicVector = htmlNode.characteristicVector;

            if(Firecrow.CloneDetector.CharacteristicVector.sum(firstCharacteristicVector) < this._MIN_NUMBER_OF_NODES) { continue; }

            for(var j = i + 1; j < length; j++)
            {
                var compareWithNode = htmlNodes[j];

                var secondCharacteristicVector = compareWithNode.characteristicVector;

                if(Firecrow.CloneDetector.CharacteristicVector.sum(secondCharacteristicVector) < this._MIN_NUMBER_OF_NODES) { continue; }

                if(!fcASTHelper.areRelated(htmlNode, compareWithNode))
                {
                    var similarity = Firecrow.CloneDetector.CharacteristicVector.calculateSimilarity(firstCharacteristicVector, secondCharacteristicVector);

                    if(similarity >= this._SIMILARITY_THRESHOLD)
                    {
                        potentialClones.push(new Firecrow.CloneDetector.HtmlCloneDetector.HtmlCloneItem(htmlNode, compareWithNode, similarity));
                    }
                }
            }
        }

        return potentialClones.sort(function(cloneA, cloneB)
        {
            return cloneA.similarity - cloneB.similarity;
        });
    }
};

Firecrow.CloneDetector.HtmlCloneDetector.HtmlCloneItem = function(nodeA, nodeB, similarity)
{
    this.nodeA = nodeA;
    this.nodeB = nodeB;
    this.similarity = similarity;
};

Firecrow.CloneDetector.HtmlCloneDetector.HtmlCloneItem.prototype =
{
    generateNodeACode: function() { return this.generateCode(this.nodeA); },
    generateNodeBCode: function() { return this.generateCode(this.nodeB); },

    generateCode: function(node)
    {
        var code = "";

        if(node.type == "textNode") { return node.textContent; }

        code += "<div class='htmlElement'>"
             + "&lt; <span class='elementType'>" + node.type + "</span>" + this.generateAttributes(node) + "&gt;"
             + this.generateChildNodesCode(node)
             + "&lt;/ <span class='elementType'>" + node.type + "</span>&gt;"
             + "</div>";

        return code;
    },

    generateAttributes: function(node)
    {
        var code = "";

        var attributes = node.attributes;

        for(var i = 0; i < attributes.length; i++)
        {
            var attribute = attributes[i];

            code += "<span class='attributeName'> " + attribute.name + " </span>"
                 + " = "
                 + "<span class='attributeValue'>'" + attribute.value + "'</span> ";
        }

        return code;
    },

    generateChildNodesCode: function(node)
    {
        var code = "";

        var childNodes = node.childNodes;

        for(var i = 0; i < childNodes.length; i++)
        {
            code += this.generateCode(childNodes[i]);
        }

        return code;
    }
};
/*************************************************************************************/
}});