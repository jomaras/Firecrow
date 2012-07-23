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
            3,
            0.9
        );
    },

    notifyError: function(message) { alert(message); }
};
/*************************************************************************************/
}});