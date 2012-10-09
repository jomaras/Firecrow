/**
 * User: Jomaras
 * Date: 08.10.12.
 * Time: 10:52
 */
FBL.ns(function() { with (FBL) {
// ************************************************************************************************
Firecrow.Reuser =
{
    getMergedModel: function(reusedAppModel, reuseIntoAppModel, reuseAppGraph, reuseIntoAppGraph)
    {
        try
        {
            //The idea is to first merge them, and then to move the UI control to the designated place
            if(reusedAppModel == null || reuseIntoAppModel == null) { alert("Reuser - inputs can not be null"); return null; }
            if((reusedAppModel.children == null || reusedAppModel.children.length == 0) && (reuseIntoAppModel.children == null || reuseIntoAppModel.children.length == 0)) { return null; }
            if(reusedAppModel.children == null || reusedAppModel.children.length == 0) { return reuseIntoAppModel; }
            if(reuseIntoAppModel.children == null || reuseIntoAppModel.children.length == 0) { return reusedAppModel; }

            //The head and the body nodes will be kept, and that all other nodes will be appended
            //Elements contained in the head or body nodes of the reused app will be added after the elements from the reuseInto application
            var reuseIntoHtmlNode = reuseIntoAppModel.htmlElement;
            var reusedHtmlNode = reusedAppModel.htmlElement;

            var mergedModel = this._createMergedModelWithDocType(reusedAppModel, reuseIntoAppModel);

            var mergedHtmlElement = this._cloneShallowMarkConflicts(reuseIntoAppModel.htmlElement, reusedAppModel.htmlElement);

            mergedModel.htmlElement = mergedHtmlElement
            mergedModel.children = [mergedHtmlElement];

            var reuseIntoHeadNode = this._getHeadElement(reuseIntoAppModel);
            var reusedHeadNode = this._getHeadElement(reusedAppModel);

            var reuseIntoBodyNode = this._getBodyElement(reuseIntoAppModel);
            var reusedBodyNode = this._getBodyElement(reusedAppModel);

            var mergedHeadNode = this._cloneShallowMarkConflicts(reuseIntoHeadNode, reusedHeadNode);
            var mergedBodyNode = this._cloneShallowMarkConflicts(reuseIntoBodyNode, reusedBodyNode);

            mergedHtmlElement.children.push(mergedHeadNode);
            mergedHtmlElement.children.push(mergedBodyNode);

            this._createChildren(mergedHeadNode, reuseIntoHeadNode);
            this._createChildren(mergedHeadNode, reusedHeadNode, "reuse");

            this._createChildren(mergedBodyNode, reuseIntoBodyNode);
            this._createChildren(mergedBodyNode, reusedBodyNode, "reuse");

            return mergedModel;

        }catch(e) { alert("Error when creating merged model:" + e); }
    },

    _createChildren: function(mergedNode, originalNode, origin)
    {
        if(mergedNode == null || originalNode == null || originalNode.children == null || originalNode.children.length == 0) { return; }

        for(var i = 0; i < originalNode.children.length; i++)
        {
            var child = originalNode.children[i];

            var mergedChild = this._cloneShallow(child);
            mergedChild.parent = mergedNode;

            if(origin != null && mergedChild.attributes != null)
            {
                mergedChild.attributes.push({name:"origin", value: origin});
            }

            mergedNode.children.push(mergedChild);

            this._createChildren(mergedChild, child, origin);
        }
    },

    _getHeadElement: function(model)
    {
        if(model == null) { return null; }
        if(model.htmlElement == null) { return null; }

        var children = model.htmlElement.children;

        for(var i = 0; i < children.length; i++)
        {
            if(children[i].type === "head")
            {
                return children[i];
            }
        }

        return null;
    },

    _getBodyElement: function(model)
    {
        if(model == null) { return null; }
        if(model.htmlElement == null) { return null; }

        var children = model.htmlElement.children;

        for(var i = 0; i < children.length; i++)
        {
            if(children[i].type === "body")
            {
                return children[i];
            }
        }

        return null;
    },

    _createMergedModelWithDocType: function(reusedAppModel, reuseIntoAppModel)
    {
        var mergedModel = { docType: reuseIntoAppModel.docType };

        if(reuseIntoAppModel.docType != reusedAppModel.docType)
        {
            mergedModel.conflicts = [{ type: "DocTypeConflict", value: reusedAppModel.docType}];
        }

        return mergedModel;
    },

    _cloneShallowMarkConflicts: function(node, conflictedNode)
    {
        var clonedNode = this._cloneShallow(node);

        if(clonedNode == null) { return null; }

        for(var i = 0; i < clonedNode.attributes.length; i++)
        {
            var attribute = clonedNode.attributes[i];

            var conflictedAttribute = this._findAttribute(conflictedNode, attribute.name);

            if(conflictedAttribute != null)
            {
                if(clonedNode.conflicts == null) { clonedNode.conflicts = []; }

                clonedNode.conflicts.push({type:"AttributeConflict", name: conflictedAttribute.name, value: conflictedAttribute.value });
            }
        }

        return clonedNode;
    },

    _cloneShallow: function(node)
    {
        if(node == null) { return null;}

        var clonedNode = {};

        clonedNode.type = node.type;
        clonedNode.attributes = [];

        for(var i = 0; i < node.attributes.length; i++)
        {
            var attribute = node.attributes[i];

            clonedNode.attributes.push({name: attribute.name, value: attribute.value});
        }

        if(node.textContent != null) { clonedNode.textContent = node.textContent; }

        clonedNode.children = [];
        clonedNode.childNodes = clonedNode.children;

        return clonedNode;
    },

    _findAttribute: function(node, attributeName)
    {
        if(node == null || node.attributes == null || node.attributes.length == 0 || attributeName == null || attributeName == "") { return null; }

        for(var i = 0; i < node.attributes.length; i++)
        {
            var attribute = node.attributes[i];

            if(attribute.name == attributeName) { return attribute; }
        }

        return null;
    }
};
// ************************************************************************************************
}});