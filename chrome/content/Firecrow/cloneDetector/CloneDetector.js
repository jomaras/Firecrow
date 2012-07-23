FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcValueTypeHelper = Firecrow.ValueTypeHelper;

Firecrow.CloneDetector =
{
    getClones: function(pageModel)
    {
        Firecrow.ASTHelper.setParentsChildRelationships(pageModel);

        Firecrow.CloneDetector.VectorGenerator.generateFromPageModel(pageModel);

        return Firecrow.CloneDetector.NodeCombinationsGenerator.getPotentialCandidates
        (
            Firecrow.CloneDetector.NodeCombinationsGenerator.groupCombinationsByTokenNum
            (
                Firecrow.CloneDetector.NodeCombinationsGenerator.generateCombinations
                (
                    Firecrow.CloneDetector.NodeCombinationsGenerator.generateAllMergeCombinations(pageModel)
                )
            ),
            0.07,
            0.99
        );
    },

    asyncGetClones: function(pageModel, finishedCallbackFunction, messageCallbackFunction)
    {
        Firecrow.ASTHelper.setParentsChildRelationships(pageModel);

        setTimeout(function()
        {
            messageCallbackFunction("Has set parent child relationships!");
            Firecrow.CloneDetector.VectorGenerator.generateFromPageModel(pageModel);
            messageCallbackFunction("Has generated characteristic vectors!");

            setTimeout(function()
            {
                Firecrow.CloneDetector.NodeCombinationsGenerator.asyncGenerateAllMergeCombinations(pageModel, function(mergeCombinations)
                {
                    setTimeout(function()
                    {
                        var combinations = Firecrow.CloneDetector.NodeCombinationsGenerator.generateCombinations(mergeCombinations);
                        messageCallbackFunction("Has generated combinations!");

                        setTimeout(function()
                        {
                            var groupedCombinations = Firecrow.CloneDetector.NodeCombinationsGenerator.groupCombinationsByTokenNum(combinations);
                            messageCallbackFunction("Has grouped combinations!");

                            setTimeout(function()
                            {
                                Firecrow.CloneDetector.NodeCombinationsGenerator.asyncProcessPotentialCandidates(groupedCombinations, 0.04, 0.99, finishedCallbackFunction, messageCallbackFunction);
                            }, 50);
                        }, 50);
                    }, 50);
                }, messageCallbackFunction);
            }, 50);
        }, 50);
    },

    notifyError: function(message) { alert(message); }
};
/*************************************************************************************/
}});