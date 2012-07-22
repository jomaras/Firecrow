FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;

Firecrow.CloneDetector =
{
    generateCharacteristicVectors: function(pageModel)
    {
        Firecrow.CloneDetector.VectorGenerator.generateFromPageModel(pageModel);
    },
    notifyError: function(message) { alert(message); }
};
/*************************************************************************************/
}});