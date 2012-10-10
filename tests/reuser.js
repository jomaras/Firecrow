var testObject = {};

var testName = "slicing";
models.forEach(function(htmlModel, index)
{
    testObject["test " + testName + (index + 1)] = function()
    {
        var Firecrow = FBL.Firecrow;

        var slicingCriteria = [];

        if(htmlModel.selectors != null)
        {
            htmlModel.selectors.forEach(function(selector)
            {
                slicingCriteria.push(Firecrow.DependencyGraph.SlicingCriterion.createModifyDomCriterion(selector));
            });
        }

        var extractedAppSlicingResult = Firecrow.Slicer.slice(htmlModel.reuseAppModel, htmlModel.reuseSelectors.map(function(selector)
        {
            return Firecrow.DependencyGraph.SlicingCriterion.createModifyDomCriterion(selector);
        }));

        var fullAppSlicingResult = Firecrow.Slicer.slice(htmlModel.reuseIntoAppModel);

        var generatedCode = FBL.Firecrow.CodeTextGenerator.generateCode(Firecrow.Reuser.getMergedModel
        (
            htmlModel.reuseAppModel,
            htmlModel.reuseIntoAppModel,
            extractedAppSlicingResult.dependencyGraph,
            fullAppSlicingResult.dependencyGraph,
            htmlModel.reuseSelectors,
            htmlModel.reuseIntoDestinationSelectors
        ));

        assertEquals(generatedCode.replace(/(\r|\n| )+/g, ""), atob(htmlModel.result).replace(/(\r|\n| )+/g, ""));
    };
});

TestCase("ReuserTest", testObject);