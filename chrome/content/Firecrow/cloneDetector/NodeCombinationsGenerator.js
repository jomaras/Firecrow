/**
 * User: Jomaras
 * Date: 23.07.12.
 * Time: 06:57
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcValueTypeHelper = Firecrow.ValueTypeHelper;
var fcASTHelper = Firecrow.ASTHelper;
var fcCombinationsGenerator = Firecrow.CloneDetector.CombinationsGenerator;
var fcCharacteristicVector = Firecrow.CloneDetector.CharacteristicVector;

Firecrow.CloneDetector.NodeCombinationsGenerator =
{
    defaultMinNumOfTokens: 30,

    getPotentialCandidates: function(combinationsGroups, maxDistance, minSimilarity)
    {
        var potentialCandidates = [];

        for(var i = 0, groupsLength = combinationsGroups.length; i < groupsLength; i++)
        {
            this.processPotentialCandidate(combinationsGroups, i, maxDistance, minSimilarity, potentialCandidates);
        }

        return this._removeSubCombinations(potentialCandidates);
    },

    asyncProcessPotentialCandidates: function(combinationsGroups, maxDistance, minSimilarity, finishedCallbackFunction, messageCallbackFunction)
    {
        var potentialCandidates = [];
        var _this = this;

        this.currentIndex = 0;

        var asyncLoop = function()
        {
            _this.processPotentialCandidate(combinationsGroups, _this.currentIndex, maxDistance, minSimilarity, potentialCandidates);

            _this.currentIndex++;

            if(_this.currentIndex < combinationsGroups.length)
            {
                if(_this.currentIndex % 5 == 0)
                {
                    messageCallbackFunction("asyncProcessPotentialCandidate - " + _this.currentIndex + " / " + combinationsGroups.length);
                    setTimeout(asyncLoop, 20);
                }
                else
                {
                    asyncLoop();
                }
            }
            else
            {
                finishedCallbackFunction(_this._removeSubCombinations(potentialCandidates));
            }
        };

        asyncLoop();
    },

    processPotentialCandidate: function(combinationsGroups, index, maxDistance, minSimilarity, potentialCandidates)
    {
        var groupsLength = combinationsGroups.length;
        var currentGroup = combinationsGroups[index];

        if(currentGroup == null) { return; }

        var compareWithGroups = [];

        var endGroupIndex = index + Math.floor(maxDistance*index);

        endGroupIndex = endGroupIndex < groupsLength ? endGroupIndex : groupsLength - 1;

        for(var j = index + 1; j <= endGroupIndex; j++)
        {
            if(combinationsGroups[j] != null)
            {
                compareWithGroups.push(combinationsGroups[j]);
            }
        }

        for(var j = 0, currentGroupLength = currentGroup.length; j < currentGroupLength; j++)
        {
            var combinationsVector = currentGroup[j];

            //compare with vectors in the current group
            for(var k = j + 1; k < currentGroupLength; k++)
            {
                var compareWithCombinationsVector = currentGroup[k];

                if(fcCharacteristicVector.calculateSimilarity(combinationsVector.characteristicVector, compareWithCombinationsVector.characteristicVector) >= minSimilarity
                    && !this._containsDescendents(combinationsVector.combination, compareWithCombinationsVector.combination))
                {
                    potentialCandidates.push({ first:combinationsVector, second:compareWithCombinationsVector });
                };
            }

            for(k = 0; k < compareWithGroups.length; k++)
            {
                var compareWithGroup = compareWithGroups[k];

                for(var l = 0, compareGroupLength = compareWithGroup.length; l < compareGroupLength; l++)
                {
                    var compareWithCombinationsVector = compareWithGroup[l];

                    if(fcCharacteristicVector.calculateSimilarity(combinationsVector.characteristicVector, compareWithCombinationsVector.characteristicVector) >= minSimilarity
                        && !this._containsDescendents(combinationsVector.combination, compareWithCombinationsVector.combination))
                    {
                        potentialCandidates.push({first:combinationsVector, second:compareWithCombinationsVector});
                    };
                }
            }
        }
    },

    generateCombinations: function(mergeCombinations)
    {
        var combinations = [];

        for(var i = 0, length = mergeCombinations.length; i < length; i++)
        {
            var characteristicVector = new fcCharacteristicVector();
            var mergeCombination = mergeCombinations[i];

            for(var j = 0, combinationsLength = mergeCombination.length; j < combinationsLength; j++)
            {
                fcCharacteristicVector.join(characteristicVector, mergeCombination[j].characteristicVector);
            }

            combinations.push({
                combination: mergeCombination,
                characteristicVector: characteristicVector,
                tokenNum: fcCharacteristicVector.sum(characteristicVector)
            });
        }

        return combinations;
    },

    groupCombinationsByTokenNum: function(combinations)
    {
        var groups = [];

        for(var i = 0, length = combinations.length; i < length; i++)
        {
            var combination = combinations[i];

            if(groups[combination.tokenNum] == null) { groups[combination.tokenNum] = []; }

            groups[combination.tokenNum].push(combination);
        }

        return groups;
    },

    generateAllMergeCombinations: function(pageModel)
    {
        var htmlElement = pageModel.htmlElement;

        return this.generateFromHtmlNode(htmlElement, []);
    },

    asyncGenerateAllMergeCombinations: function(pageModel, finishedCallback, messageCallback)
    {
        this.asyncGenerateFromHtmlNode(pageModel.htmlElement, [], finishedCallback, messageCallback);
    },

    generateFromHtmlNode: function(htmlElement, combinationsArray)
    {
        if(htmlElement == null) { return combinationsArray; }
        if(htmlElement.type == "textNode") { return combinationsArray; }

        if(htmlElement.type == "script")
        {
            this.generateFromJsNode(htmlElement.pathAndModel.model, combinationsArray);
        }
        else if (htmlElement.type == "style" || htmlElement.type == "link")
        {
            this.generateFromCssNodes(htmlElement.pathAndModel.model, combinationsArray);
        }

        var childNodes = htmlElement.childNodes;
        var children = [];
        for(var i = 0, length = childNodes.length; i < length; i++)
        {
            var childNode = childNodes[i];

            if(childNode.type != "textNode")
            {
                this.generateFromHtmlNode(childNode, combinationsArray);
                children.push(childNode);
            }
        }

        fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(children));

        return combinationsArray;
    },

    asyncGenerateFromHtmlNode: function(htmlElement, combinationsArray, finishedCallback, messageCallback)
    {
        if(htmlElement == null) { return ; }
        if(htmlElement.type == "textNode") { return; }

        if(htmlElement.type == "script")
        {
            this.asyncGenerateFromJsNode(htmlElement.pathAndModel.model, combinationsArray, finishedCallback, messageCallback);
        }
        else if (htmlElement.type == "style" || htmlElement.type == "link")
        {
            this.generateFromCssNodes(htmlElement.pathAndModel.model, combinationsArray);
        }

        var childNodes = htmlElement.childNodes;
        var children = [];
        for(var i = 0, length = childNodes.length; i < length; i++)
        {
            var childNode = childNodes[i];

            if(childNode.type != "textNode")
            {
                this.asyncGenerateFromHtmlNode(childNode, combinationsArray, finishedCallback, messageCallback);
                children.push(childNode);
            }
        }

        fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(children));
    },

    generateFromJsNode: function(program, combinationsArray)
    {
        var functions = [];
        var loops = [];
        var conditionals = [];
        var objectExpressions = [];

        fcASTHelper.traverseAst(program, function(element)
        {
            if(element.characteristicVector == null || fcCharacteristicVector.sum(element.characteristicVector) < this.defaultMinNumOfTokens) { return; }

            if(fcASTHelper.isFunction(element)) { functions.push(element);}
            else if (fcASTHelper.isLoopStatement(element)) { loops.push(element);}
            else if (fcASTHelper.isIfStatement(element) || fcASTHelper.isSwitchStatement(element)) { conditionals.push(element); }
            else if (fcASTHelper.isObjectExpression(element)) { objectExpressions.push(element); }
        });

        fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(program.children));

        for(var i = 0, length = functions.length; i < length; i++)
        {
            fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(functions[i].body.children));
        }
        for(var i = 0, length = loops.length; i < length; i++)
        {
            fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(loops[i].body.children));
        }
        for(var i = 0, length = conditionals.length; i < length; i++)
        {
            var conditional = conditionals[i];

            if(fcASTHelper.isIfStatement(conditional))
            {
                fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(conditional.consequent.children));

                if(conditional.alternate != null)
                {
                    fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(conditional.alternate.children));
                }
            }
            else
            {
                fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(conditional.children));
            }
        }
        for(var i = 0, length = objectExpressions.length; i < length; i++)
        {
            fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(objectExpressions[i].children));
        }

        return combinationsArray;
    },

    asyncGenerateFromJsNode: function(program, combinationsArray, finishedCallback, messageCallback)
    {
        var functions = [];
        var loops = [];
        var conditionals = [];
        var objectExpressions = [];
        var _this = this;

        fcASTHelper.traverseAst(program, function(element)
        {
            if(element.characteristicVector == null || fcCharacteristicVector.sum(element.characteristicVector) < this.defaultMinNumOfTokens) { return; }

            if(fcASTHelper.isFunction(element)) { functions.push(element);}
            else if (fcASTHelper.isLoopStatement(element)) { loops.push(element);}
            else if (fcASTHelper.isIfStatement(element) || fcASTHelper.isSwitchStatement(element)) { conditionals.push(element); }
            else if (fcASTHelper.isObjectExpression(element)) { objectExpressions.push(element); }
        });

        messageCallback("Got all copy-paste elements when async generating from js nodes");

        fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(program.children));
        messageCallback("Got direct program children combinations");

        setTimeout(function()
        {
            for(var i = 0, length = functions.length; i < length; i++)
            {
                fcValueTypeHelper.pushAll(combinationsArray, _this.getAllChildCombinations(functions[i].body.children));
            }

            messageCallback("Got functions children combinations");

            setTimeout(function()
            {
                for(var i = 0, length = loops.length; i < length; i++)
                {
                    fcValueTypeHelper.pushAll(combinationsArray, _this.getAllChildCombinations(loops[i].body.children));
                }
                messageCallback("Got loops children combinations");

                setTimeout(function()
                {
                    for(var i = 0, length = conditionals.length; i < length; i++)
                    {
                        var conditional = conditionals[i];

                        if(fcASTHelper.isIfStatement(conditional))
                        {
                            fcValueTypeHelper.pushAll(combinationsArray, _this.getAllChildCombinations(conditional.consequent.children));

                            if(conditional.alternate != null)
                            {
                                fcValueTypeHelper.pushAll(combinationsArray, _this.getAllChildCombinations(conditional.alternate.children));
                            }
                        }
                        else
                        {
                            fcValueTypeHelper.pushAll(combinationsArray, _this.getAllChildCombinations(conditional.children));
                        }
                    }

                    messageCallback("Got conditional children combinations");

                    setTimeout(function()
                    {
                        for(var i = 0, length = objectExpressions.length; i < length; i++)
                        {
                            fcValueTypeHelper.pushAll(combinationsArray, _this.getAllChildCombinations(objectExpressions[i].children));
                        }

                        messageCallback("Got object expression children combinations");

                        finishedCallback(combinationsArray);
                    }, 50);
                }, 50);

            }, 50);
        }, 50);
    },

    generateFromCssNodes: function(model, combinationsArray)
    {

    },

    getAllChildCombinations: function(nodes)
    {
        nodes = nodes || [];
        var combinations = [];

        var expandedNodes = [];

        for(var i = 0, length = nodes.length; i < length; i++)
        {
            var node = nodes[i];

            fcASTHelper.isBlockStatement(node) ? fcValueTypeHelper.pushAll(expandedNodes, node.children)
                                               : expandedNodes.push(node);
        }

        for(var i = 0, length = expandedNodes.length; i < length / 2; i++)
        {
            var allCombinations = fcCombinationsGenerator.generateCombinations(length, i + 1);

            for(var j = 0; j < allCombinations.length; j++)
            {
                var currentCombination = allCombinations[j];
                var currentNodesCombination = [];

                var combinationTokenNum = 0;

                for(var k = 0; k < currentCombination.length; k++)
                {
                    var selectedNode = expandedNodes[currentCombination[k]];

                    currentNodesCombination.push(selectedNode);

                    combinationTokenNum += fcCharacteristicVector.sum(selectedNode.characteristicVector);
                }

                if(combinationTokenNum >= this.defaultMinNumOfTokens)
                {
                    combinations.push(currentNodesCombination);
                }
            }
        }

        return combinations;
    },

    _containsDescendents: function(firstNodeGroup, secondNodeGroup)
    {
        for(var i = 0, firstLength = firstNodeGroup.length; i < firstLength; i++)
        {
            for(var j = 0, secondLength = secondNodeGroup.length; j < secondLength; j++)
            {
                var firstNode = firstNodeGroup[i];
                var secondNode = secondNodeGroup[j];
                if(fcASTHelper.isAncestor(firstNode, secondNode) || fcASTHelper.isAncestor(secondNode, firstNode))
                {
                    return true;
                }
            }
        }

        return false;
    },

    _removeSubCombinations: function(combinations)
    {
        var returnValue = [];

        for(var i = 0; i < combinations.length; i++)
        {
            var firstCombination = combinations[i];
            var encompassingCombination = null;

            for(var j = i + 1; j < combinations.length; j++)
            {
                var secondCombination = combinations[j];

                if(this._isSubCombination(firstCombination, secondCombination))
                {
                    encompassingCombination = secondCombination;
                }
            }

            if(encompassingCombination == null)
            {
                returnValue.push(firstCombination);
            }
        }

        return returnValue;
    },

    _isSubCombination: function(firstCombination, secondCombination)
    {
        var firstFirst = firstCombination.first.combination;
        var secondFirst = secondCombination.first.combination;

        for(var i = 0; i < firstFirst.length; i++)
        {
            var first = firstFirst[i];
            for(var j = 0; j < secondFirst.length; j++)
            {
                var second = secondFirst[j];

                if(!fcASTHelper.isAncestor(second, first)) { return false; }
            }
        }

        return true;
    }
};
/*************************************************************************************/
}});