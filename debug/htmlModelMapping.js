/**
 * User: Jomaras
 * Date: 03.05.12.
 * Time: 11:06
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
    }
};

HtmlModelMapping.push
(
   {
       url: "file:///C:/GitWebStorm/Firecrow/debug/testFiles/01/index.html",
       model: {"docType":"","htmlElement":{"type":"html","attributes":[],"children":[{"type":"head","attributes":[],"children":[{"type":"textNode","attributes":[],"children":[],"textContent":"\n    "},{"type":"title","attributes":[],"children":[]},{"type":"textNode","attributes":[],"children":[],"textContent":"\n"}]},{"type":"textNode","attributes":[],"children":[],"textContent":"\n"},{"type":"body","attributes":[],"children":[{"type":"textNode","attributes":[],"children":[],"textContent":"\n    "},{"type":"h1","attributes":[],"children":[{"type":"textNode","attributes":[],"children":[],"textContent":"First Test File - simple html file"}]},{"type":"textNode","attributes":[],"children":[],"textContent":"\n    "},{"type":"p","attributes":[],"children":[{"type":"textNode","attributes":[],"children":[],"textContent":"One paragraph"}]},{"type":"textNode","attributes":[],"children":[],"textContent":"\n    "},{"type":"table","attributes":[],"children":[{"type":"textNode","attributes":[],"children":[],"textContent":"\n        "},{"type":"tbody","attributes":[],"children":[{"type":"tr","attributes":[],"children":[{"type":"textNode","attributes":[],"children":[],"textContent":"\n            "},{"type":"td","attributes":[],"children":[{"type":"textNode","attributes":[],"children":[],"textContent":"First Cell"}]},{"type":"textNode","attributes":[],"children":[],"textContent":"\n            "},{"type":"td","attributes":[],"children":[{"type":"textNode","attributes":[],"children":[],"textContent":"Second Cell"}]},{"type":"textNode","attributes":[],"children":[],"textContent":"\n        "}]},{"type":"textNode","attributes":[],"children":[],"textContent":"\n    "}]}]},{"type":"textNode","attributes":[],"children":[],"textContent":"\n\n"}]}]}}
   }
);

HtmlModelMapping.push
(
    {
        url: "file:///C:/GitWebStorm/Firecrow/debug/testFiles/02/index.html",
        model: {"docType":"","htmlElement":{"type":"html","attributes":[],"children":[{"type":"head","attributes":[],"children":[{"type":"textNode","attributes":[],"children":[],"textContent":"\n    "},{"type":"title","attributes":[],"children":[{"type":"textNode","attributes":[],"children":[],"textContent":"Simple HTML with CSS"}]},{"type":"textNode","attributes":[],"children":[],"textContent":"\n    "},{"type":"style","attributes":[],"children":[{"type":"textNode","attributes":[],"children":[],"textContent":"\n        p { color: red; }\n        h1 { font-weight: bold; }\n        .firstCell { color: green; }\n        #secondCell { color: blue; }\n        td > .thirdCell { color: yellow;}\n    "}]},{"type":"textNode","attributes":[],"children":[],"textContent":"\n"}]},{"type":"textNode","attributes":[],"children":[],"textContent":"\n"},{"type":"body","attributes":[],"children":[{"type":"textNode","attributes":[],"children":[],"textContent":"\n    "},{"type":"h1","attributes":[],"children":[{"type":"textNode","attributes":[],"children":[],"textContent":"First Test File - simple html file"}]},{"type":"textNode","attributes":[],"children":[],"textContent":"\n    "},{"type":"p","attributes":[],"children":[{"type":"textNode","attributes":[],"children":[],"textContent":"One paragraph"}]},{"type":"textNode","attributes":[],"children":[],"textContent":"\n    "},{"type":"table","attributes":[],"children":[{"type":"textNode","attributes":[],"children":[],"textContent":"\n        "},{"type":"tbody","attributes":[],"children":[{"type":"tr","attributes":[],"children":[{"type":"textNode","attributes":[],"children":[],"textContent":"\n            "},{"type":"td","attributes":[],"children":[{"type":"span","attributes":[{"name":"class","value":"firstCell"}],"children":[{"type":"textNode","attributes":[],"children":[],"textContent":"First Cell"}]}]},{"type":"textNode","attributes":[],"children":[],"textContent":"\n            "},{"type":"td","attributes":[],"children":[{"type":"span","attributes":[{"name":"id","value":"secondCell"}],"children":[{"type":"textNode","attributes":[],"children":[],"textContent":"Second Cell"}]}]},{"type":"textNode","attributes":[],"children":[],"textContent":"\n            "},{"type":"td","attributes":[],"children":[{"type":"span","attributes":[{"name":"class","value":"thirdCell"}],"children":[{"type":"textNode","attributes":[],"children":[],"textContent":"Third Cell"}]}]},{"type":"textNode","attributes":[],"children":[],"textContent":"\n        "}]},{"type":"textNode","attributes":[],"children":[],"textContent":"\n    "}]}]},{"type":"textNode","attributes":[],"children":[],"textContent":"\n\n"}]}]}}
    }
);