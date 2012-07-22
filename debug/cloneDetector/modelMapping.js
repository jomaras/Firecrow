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

            if(model.url == url)
            {
                return model.model;
            }
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
                return model;
            }
        }

        return null;
    }
};

HtmlModelMapping.push
(
    {
        url: "file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/01/index.html",
        model: {"docType":"","htmlElement":{"type":"html","attributes":[],"childNodes":[{"type":"head","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":0,"textContent":"\n    "},{"type":"title","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":1,"textContent":"Title"}],"nodeId":2},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":3,"textContent":"\n"}],"nodeId":4},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":5,"textContent":"\n"},{"type":"body","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":6,"textContent":"\n    "},{"type":"ul","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":7,"textContent":"\n       "},{"type":"li","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":8,"textContent":"\n           "},{"type":"div","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":9,"textContent":"\n               Text1\n               "},{"type":"span","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":10,"textContent":"\n                   Text2\n               "}],"nodeId":11},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":12,"textContent":"\n               "},{"type":"b","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":13,"textContent":"Test"}],"nodeId":14},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":15,"textContent":"\n           "}],"nodeId":16},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":17,"textContent":"\n       "}],"nodeId":18},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":19,"textContent":"\n\n        "},{"type":"li","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":20,"textContent":"\n            "},{"type":"div","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":21,"textContent":"\n                Text3\n               "},{"type":"span","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":22,"textContent":"\n                   Text4\n               "}],"nodeId":23},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":24,"textContent":"\n                "},{"type":"b","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":25,"textContent":"\n                    Test - hello\n                "}],"nodeId":26},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":27,"textContent":"\n            "}],"nodeId":28},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":29,"textContent":"\n        "}],"nodeId":30},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":31,"textContent":"\n\n        "},{"type":"li","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":32,"textContent":"\n            "},{"type":"div","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":33,"textContent":"\n                Text5\n               "},{"type":"span","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":34,"textContent":"\n                   Text7\n               "}],"nodeId":35},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":36,"textContent":"\n                "},{"type":"b","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":37,"textContent":"Test-something-new"}],"nodeId":38},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":39,"textContent":"\n            "}],"nodeId":40},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":41,"textContent":"\n        "}],"nodeId":42},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":43,"textContent":"\n    "}],"nodeId":44},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":45,"textContent":"\n\n"}],"nodeId":46}],"nodeId":47}}
    }
);