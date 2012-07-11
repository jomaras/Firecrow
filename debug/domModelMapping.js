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
        url: "file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html",
        results: [{a1:"Title modified by Js"}],
        model: {"docType":"","htmlElement":{"type":"html","attributes":[],"childNodes":[{"type":"head","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":0,"textContent":"\n    "},{"type":"title","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":1,"textContent":"Title"}],"nodeId":2},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":3,"textContent":"\n    "},{"type":"style","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":4,"textContent":"\n        .testClass { color: green; }\n    "}],"nodeId":5,"pathAndModel":{"path":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html","model":{"rules":[{"selector":".testClass","cssText":".testClass { color: green; }","nodeId":6}]}}},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":7,"textContent":"\n"}],"nodeId":8},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":9,"textContent":"\n"},{"type":"body","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":10,"textContent":"\n    "},{"type":"h2","attributes":[{"name":"class","value":"testClass"}],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":11,"textContent":"Title"}],"nodeId":12},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":13,"textContent":"\n    "},{"type":"script","attributes":[{"name":"type","value":"text/javascript"}],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":14,"textContent":"\n        var title = document.querySelector(\".testClass\");\n        title.textContent = \"Title modified by Js\";\n        var a1 = title.textContent;\n        a1;\n    "}],"nodeId":15,"textContent":"\n        var title = document.querySelector(\".testClass\");\n        title.textContent = \"Title modified by Js\";\n        var a1 = title.textContent;\n        a1;\n    ","pathAndModel":{"path":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html","model":{"loc":{"start":{"line":11,"column":0},"end":{"line":15,"column":11},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"Program","body":[{"loc":{"start":{"line":12,"column":8},"end":{"line":12,"column":56},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":12,"column":12},"end":{"line":12,"column":56},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":12,"column":12},"end":{"line":12,"column":56},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"Identifier","name":"title","nodeId":18},"init":{"loc":{"start":{"line":12,"column":20},"end":{"line":12,"column":56},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":12,"column":20},"end":{"line":12,"column":42},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":12,"column":20},"end":{"line":12,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"Identifier","name":"document","nodeId":21},"property":{"loc":null,"type":"Identifier","name":"querySelector","nodeId":22},"computed":false,"nodeId":20},"arguments":[{"loc":{"start":{"line":12,"column":43},"end":{"line":12,"column":55},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"Literal","value":".testClass","nodeId":23}],"nodeId":19},"nodeId":17}],"nodeId":16},{"loc":{"start":{"line":13,"column":8},"end":{"line":13,"column":50},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":13,"column":8},"end":{"line":13,"column":50},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":13,"column":8},"end":{"line":13,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":13,"column":8},"end":{"line":13,"column":13},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"Identifier","name":"title","nodeId":27},"property":{"loc":null,"type":"Identifier","name":"textContent","nodeId":28},"computed":false,"nodeId":26},"right":{"loc":{"start":{"line":13,"column":28},"end":{"line":13,"column":50},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"Literal","value":"Title modified by Js","nodeId":29},"nodeId":25},"nodeId":24},{"loc":{"start":{"line":14,"column":8},"end":{"line":14,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":14,"column":12},"end":{"line":14,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":14,"column":12},"end":{"line":14,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"Identifier","name":"a1","nodeId":32},"init":{"loc":{"start":{"line":14,"column":17},"end":{"line":14,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":14,"column":17},"end":{"line":14,"column":22},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"Identifier","name":"title","nodeId":34},"property":{"loc":null,"type":"Identifier","name":"textContent","nodeId":35},"computed":false,"nodeId":33},"nodeId":31}],"nodeId":30},{"loc":{"start":{"line":15,"column":8},"end":{"line":15,"column":10},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":15,"column":8},"end":{"line":15,"column":10},"source":"file:///C:/GitWebStorm/Firecrow/debug/domTests/01/index.html"},"type":"Identifier","name":"a1","nodeId":37},"nodeId":36}]}}},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":38,"textContent":"\n\n"}],"nodeId":39}],"nodeId":40}},
        slicingResult: "PCFET0NUWVBFIGh0bWw+DQo8aHRtbD4NCiAgPGJvZHk+DQogICAgPHNjcmlwdD4NCiAgICAgIHZhciBzdW0gPSAwOw0KICAgICAgZm9yKHZhciBpID0gMTtpIDw9IDM7aSsrKQ0KICAgICAgew0KICAgICAgICBzdW0gKz0gaTsNCiAgICAgIH0NCg0KICAgICAgc3VtOw0KICAgIDwvc2NyaXB0Pg0KICA8L2JvZHk+DQo8L2h0bWw+DQo="
    }
);