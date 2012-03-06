/**
 * Created by Josip Maras.
 * User: jomaras
 * Date: 06.03.12.
 * Time: 13:56
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var astHelper = Firecrow.ASTHelper;

Firecrow.CommandGenerator =
{
    generateCommands: function(program)
    {
        try
        {
            var commands = [];

            astHelper.traverseAst
            (
                program,
                function(elementValue, elementName, parentObject)
                {

                }
            );

            return commands;
        }
        catch(e) { alert("Error while generating commmands in CommandGenerator: " + e);}
    }
}
/*************************************************************************************/
}});