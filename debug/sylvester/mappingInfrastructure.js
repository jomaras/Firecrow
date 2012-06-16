/**
 * User: Jomaras
 * Date: 12.06.12.
 * Time: 15:19
 */
var HtmlModelMapping =
{
    models: [],
    push: function(model)
    {
        this.models.push(model)
    },
    getModel: function(url)
    {
        for(var i = 0; i < this.models.length; i++)
        {
            var model = this.models[i];

            if(model.url == url) {return model.model; }
        }

        return null;
    },
    getWholeFileModel: function(url)
    {
        for(var i = 0; i < this.models.length; i++)
        {
            var model = this.models[i];

            if(model.url == url)
            {
                Firecrow.ASTHelper.setParentsChildRelationships(model);
                return model;
            }
        }

        return null;
    }
};