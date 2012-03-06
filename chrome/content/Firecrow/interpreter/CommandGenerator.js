/**
 * Created by Josip Maras.
 * User: jomaras
 * Date: 06.03.12.
 * Time: 13:56
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
const astHelper = Firecrow.ASTHelper;

Firecrow.CommandGenerator =
{
    generateCommands: function(program)
    {
        try
        {
            var commands = [];
            var declarationCommands = [];
            var Command = Firecrow.Command;
            var commandType = Firecrow.Command.COMMAND_TYPE;

            astHelper.traverseDirectSourceElements
            (
                program,
                function(sourceElement)
                {
                    Firecrow.CommandGenerator.appendDeclarationCommands(sourceElement, declarationCommands);
                }
            );

            return declarationCommands.concat(commands);
        }
        catch(e) { alert("Error while generating commmands in CommandGenerator: " + e);}
    },

    appendDeclarationCommands: function(sourceElement, declarationCommands)
    {
        try
        {
            var Command = Firecrow.Command;
            var commandType = Firecrow.Command.COMMAND_TYPE;

            if(astHelper.isVariableDeclaration(sourceElement))
            {
                sourceElement.declarations.forEach(function(variableDeclarator)
                {
                    declarationCommands.push(new Command(variableDeclarator, commandType.DeclareVariable));
                });
            }
            else if (astHelper.isFunctionDeclaration(sourceElement))
            {
                declarationCommands.push(new Command(sourceElement, commandType.DeclareFunction));
            }
            else if (astHelper.isForStatement(sourceElement))
            {
                if(astHelper.isVariableDeclaration(sourceElement.init))
                {
                    sourceElement.init.declarations.forEach(function(variableDeclarator)
                    {
                        declarationCommands.push(new Command(variableDeclarator, commandType.DeclareVariable));
                    });
                }
            }
            else if(astHelper.isForInStatement(sourceElement))
            {
                if(astHelper.isVariableDeclaration(sourceElement.left))
                {
                    sourceElement.left.declarations.forEach(function(variableDeclarator)
                    {
                        declarationCommands.push(new Command(variableDeclarator, commandType.DeclareVariable));
                    });
                }
            }
        }
        catch(e) { alert("Error while appending declaration commands at CommandGenerator: " + e);}
    }
};

Firecrow.Command = function(codeConstruct, type)
{
    this.id = Firecrow.Command.LAST_COMMAND_ID++;
    //this.codeConstruct = codeConstruct;
    this.type = type;
    this.position = codeConstruct.loc.start.line;
};

Firecrow.Command.LAST_COMMAND_ID = 0;

Firecrow.Command.COMMAND_TYPE =
{
    DeclareVariable: "DeclareVariable",
    DeclareFunction: "DeclareFunction"
};

/*************************************************************************************/
}});