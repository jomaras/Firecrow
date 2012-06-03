/**
 * Created by Jomaras.
 * Date: 10.03.12.@09:49
 */
FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var fcModel = Firecrow.Interpreter.Model;

Firecrow.Interpreter.Model.Identifier = function(name, value, codeConstruct)
{
    try
    {
        this.id = fcModel.Identifier.LAST_IDENTIFIER_ID++;
        this.name = name;
        this.value = value;
        this.modificationConstructs = [];
        this.lastModificationConstruct = codeConstruct;

        if(codeConstruct != null)
        {
            this.modificationConstructs.push(codeConstruct);
        }
    }
    catch(e) { alert("Identifier - Error when constructing: " + e ); }
};

Firecrow.Interpreter.Model.Identifier.prototype =
{
    setValue: function(newValue, modificationConstruct)
    {
        this.value = newValue;
        this.lastModificationConstruct = modificationConstruct;

        if(modificationConstruct != null)
        {
            this.modificationConstructs.push(modificationConstruct);
        }
    }
};

Firecrow.Interpreter.Model.Identifier.LAST_IDENTIFIER_ID = 0;
Firecrow.Interpreter.Model.Identifier.createObjectPropertyIdentifier = function(hostObject, propertyName, propertyValue, creationConstruct)
{
    var identifier = new fcModel.Identifier(propertyName, propertyValue, creationConstruct);

    identifier.hostObject = hostObject;

    return identifier;
};
/****************************************************************************/
}});