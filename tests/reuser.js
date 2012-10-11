var testObject = {};

var testName = "slicing";
models.forEach(function(htmlModel, index)
{
    testObject["test " + testName + (index)] = function()
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
            htmlModel.reuseIntoDestinationSelectors,
            extractedAppSlicingResult.browser,
            fullAppSlicingResult.browser
        ));

        var expectedResult = atob(htmlModel.result);

        assertTrue("Generated code,\n expects:" + expectedResult + "\r\n******** and got **********\r\n " + generatedCode + "\r\n",  generatedCode.replace(/(\r|\n|\s)+/g, "") == expectedResult.replace(/(\r|\n|\s)+/g, ""));
    };
});

TestCase("ReuserTest", testObject);