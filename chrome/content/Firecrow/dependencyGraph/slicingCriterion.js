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
    DOM_MODIFICATION: "DOM_MODIFICATION",
    LINE_EXECUTED: "LINE_EXECUTED"
};

Firecrow.DependencyGraph.SlicingCriterion.createReadIdentifierCriterion = function(fileName, lineNumber, identifierName)
{
    var criterion = new Firecrow.DependencyGraph.SlicingCriterion(Firecrow.DependencyGraph.SlicingCriterion.TYPES.READ_IDENTIFIER);

    criterion.fileName = fileName;
    criterion.lineNumber = lineNumber;
    criterion.identifierName = identifierName;

    return criterion;
};

Firecrow.DependencyGraph.SlicingCriterion.createModifyDomCriterion = function(cssSelector)
{
    var criterion = new Firecrow.DependencyGraph.SlicingCriterion(Firecrow.DependencyGraph.SlicingCriterion.TYPES.DOM_MODIFICATION);

    criterion.cssSelector = cssSelector;

    return criterion;
};

Firecrow.DependencyGraph.SlicingCriterion.createLineExecutedCriterion = function(fileName, lineNumber)
{
    var criterion = new Firecrow.DependencyGraph.SlicingCriterion(Firecrow.DependencyGraph.SlicingCriterion.TYPES.LINE_EXECUTED);

    criterion.fileName = fileName;
    criterion.lineNumber = lineNumber;
};
/*************************************************************************************/
}});