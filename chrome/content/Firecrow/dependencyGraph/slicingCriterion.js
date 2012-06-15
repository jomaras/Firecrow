/**
 * User: Jomaras
 * Date: 15.06.12.
 * Time: 13:01
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
Firecrow.DependencyGraph.SlicingCriterion = function(type)
{
    this.type = type;
};

Firecrow.DependencyGraph.SlicingCriterion.TYPES =
{
    READ_IDENTIFIER: "READ_IDENTIFIER",
    DOM_MODIFICATION: "DOM_MODIFICATION"
};

Firecrow.DependencyGraph.SlicingCriterion.createReadIdentifierCriterion = function(fileName, lineNumber, identifierName)
{
    var criterion = new Firecrow.DependencyGraph.SlicingCriterion(Firecrow.DependencyGraph.SlicingCriterion.TYPES.READ_IDENTIFIER);

    criterion.fileName = fileName;
    criterion.lineNumber = lineNumber;
    criterion.identifierName = identifierName;

    return criterion;
}

/*************************************************************************************/
}});