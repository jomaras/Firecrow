var startTime = Date.now();
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
        url: "file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html",
        model: {"docType":"","htmlElement":{"type":"html","attributes":[],"childNodes":[{"type":"head","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":0,"textContent":"\n    "},{"type":"title","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":1,"textContent":"Title"}],"nodeId":2},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":3,"textContent":"\n    "},{"type":"meta","attributes":[{"name":"content","value":"text/html; charset=UTF-8"},{"name":"http-equiv","value":"Content-Type"}],"childNodes":[],"nodeId":4},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":5,"textContent":"\n"}],"nodeId":6},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":7,"textContent":"\n"},{"type":"body","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":8,"textContent":"\n    "},{"type":"ul","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":9,"textContent":"\n       "},{"type":"li","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":10,"textContent":"\n           "},{"type":"div","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":11,"textContent":"\n               Text1\n               "},{"type":"span","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":12,"textContent":"Text2"}],"nodeId":13},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":14,"textContent":"\n               "},{"type":"b","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":15,"textContent":"Test"}],"nodeId":16},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":17,"textContent":"\n               "},{"type":"span","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":18,"textContent":"Text2"}],"nodeId":19},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":20,"textContent":"\n               "},{"type":"b","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":21,"textContent":"Test"}],"nodeId":22},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":23,"textContent":"\n               "},{"type":"span","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":24,"textContent":"Text2"}],"nodeId":25},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":26,"textContent":"\n               "},{"type":"b","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":27,"textContent":"Test"}],"nodeId":28},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":29,"textContent":"\n               "},{"type":"p","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":30,"textContent":"And now for some text"}],"nodeId":31},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":32,"textContent":"\n               "},{"type":"img","attributes":[{"name":"src","value":"test.jpg"}],"childNodes":[],"nodeId":33},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":34,"textContent":"\n           "}],"nodeId":35},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":36,"textContent":"\n       "}],"nodeId":37},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":38,"textContent":"\n    "}],"nodeId":39},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":40,"textContent":"\n\n    "},{"type":"div","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":41,"textContent":"\n        "},{"type":"div","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":42,"textContent":"\n            "},{"type":"ul","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":43,"textContent":"\n                "},{"type":"li","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":44,"textContent":"\n                    "},{"type":"div","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":45,"textContent":" ClonedText2\n                        "},{"type":"span","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":46,"textContent":"ClonedText2"}],"nodeId":47},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":48,"textContent":"\n                        "},{"type":"b","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":49,"textContent":"ClonedTest"}],"nodeId":50},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":51,"textContent":"\n                        "},{"type":"span","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":52,"textContent":"Text2"}],"nodeId":53},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":54,"textContent":"\n                        "},{"type":"b","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":55,"textContent":"Test"}],"nodeId":56},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":57,"textContent":"\n                        "},{"type":"span","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":58,"textContent":"Text2"}],"nodeId":59},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":60,"textContent":"\n                        "},{"type":"b","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":61,"textContent":"Test"}],"nodeId":62},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":63,"textContent":"\n                        "},{"type":"p","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":64,"textContent":"And now for some cloned text"}],"nodeId":65},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":66,"textContent":"\n                        "},{"type":"img","attributes":[{"name":"src","value":"test.jpg"}],"childNodes":[],"nodeId":67},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":68,"textContent":"\n                    "}],"nodeId":69},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":70,"textContent":"\n                "}],"nodeId":71},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":72,"textContent":"\n            "}],"nodeId":73},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":74,"textContent":"\n        "}],"nodeId":75},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":76,"textContent":"\n    "}],"nodeId":77},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":78,"textContent":"\n\n"},{"type":"script","attributes":[],"childNodes":[{"type":"textNode","attributes":[],"childNodes":[],"nodeId":79,"textContent":"\n    function Vector(){};\n    Vector.prototype =\n    {\n        sortAscending: function()\n        {\n            for(var i = 0, length = this.vector.length; i < (length - 1); i++)\n            {\n                for(var j = i + 1; j < length; j++)\n                {\n                    if(this.vector[i] > this.vector[j])\n                    {\n                        var temp = this.vector[i];\n                        this.vector[i] = this.vector[j];\n                        this.vector[j] = temp;\n                    }\n                }\n            }\n        },\n\n\n        sortDescending: function()\n        {\n            for(var i = 0, length = this.vector.length; i < (length - 1); i++)\n            {\n                for(var j = i + 1; j < length; j++)\n                {\n                    if(this.vector[i] < this.vector[j])\n                    {\n                        var temp = this.vector[i];\n                        this.vector[i] = this.vector[j];\n                        this.vector[j] = temp;\n                    }\n                }\n            }\n        },\n        sum:  function(callback)\n        {\n            var sum = 0.0;\n\n            for (var i = 0; i < this.vector.length;)\n            {\n                sum += this.vector[i++];\n            }\n            if (callback)\n                return callback(sum);\n            else\n                return sum;\n        },\n\n        product: function(callback)\n        {\n            var product = 1.0;\n\n            for (var i = 0; i < this.vector.length;)\n            {\n                product *= this.vector[i++];\n            }\n            if (callback)\n                return callback(product);\n            else\n                return product;\n        },\n\n        mean: function(callback)\n        {\n            var mean = this.sum() / this.vector.length;\n            if (callback)\n                return callback(mean);\n            else\n                return mean;\n        },\n        gmean: function(callback)\n        {\n            var gmean = Math.pow(Math.abs(this.product()), 1 / this.vector.length);\n            if (callback)\n                return callback(gmean);\n            else\n                return gmean;\n        },\n        hmean: function(callback)\n        {\n            function reciprocalSum(set)\n            {\n                for (var i = 0, sum = 0.0; i < set.length;) {\n                    sum += 1 / Math.abs(set[i++]);\n                }\n                return sum;\n            }\n            var hmean = this.vector.length / reciprocalSum(this.vector);\n            if (callback)\n                return callback(hmean);\n            else\n                return hmean;\n        },\n\n        qmean: function(callback) {\n            var qmean = Math.sqrt(this.pow(2).sum() / this.vector.length)\n            if (callback)\n                return callback(qmean);\n            else\n                return qmean;\n        },\n\n        median: function(callback)\n        {\n            var buffer = this.copy();\n            buffer.sortAscending();\n            var median = (this.vector.length % 2 === 0) ?\n                    (buffer.vector[this.vector.length / 2 - 1] + buffer.vector[this.vector.length / 2]) / 2 : buffer.vector[parseInt(this.vector.length / 2)];\n            if (callback)\n                return callback(median);\n            else\n                return median;\n        },\n\n        mode: function(callback)\n        {\n            var map = {};\n            var count = 1;\n            var modes = new Vector();\n            for (var i = 0; i < this.vector.length; i++) {\n                var e = this.vector[i];\n                if (map[e] == null)\n                    map[e] = 1;\n                else\n                    map[e]++;\n                if (map[e] > count) {\n                    modes = new Vector([e]);\n                    count = map[e];\n                } else if (map[e] == count) {\n                    modes.push(e);\n                    count = map[e];\n                }\n            }\n            if (modes.length === 1)\n                modes = modes[0];\n            if (callback)\n                return callback(modes);\n            else\n                return modes;\n        },\n\n        range: function(callback) {\n            var range = this.max() - this.min();\n            if (callback)\n                return callback(range);\n            else\n                return range;\n        },\n\n        variance: function(callback) {\n            var mean = 0.0,\n                    variance = 0.0;\n\n            for (var i = 0; i < this.vector.length; i++) {\n                var _mean = mean;\n                mean += (this.vector[i] - _mean) / (i + 1);\n                variance += (this.vector[i] - _mean) * (this.vector[i] - mean);\n            }\n            variance /= this.vector.length;\n\n            if (callback)\n                return callback(variance);\n            else\n                return variance;\n        },\n\n        stdev: function(percentile, callback) {\n            var stdev = 0.0;\n            if (!percentile)\n                stdev = Math.sqrt(this.variance());\n            else\n                return this.density(percentile).stdev();\n            if (callback)\n                return callback(stdev);\n            else\n                return stdev;\n        },\n\n        frequency: function(element, callback) {\n            var freq = 0;\n            if (this.vector.indexOf(element) !== -1) {\n                var buffer = this.copy();\n                buffer.sortAscending();\n                freq = buffer.vector.lastIndexOf(element) - buffer.vector.indexOf(element) + 1;\n            }\n            if (callback)\n                return callback(freq);\n            else\n                return freq;\n        }\n    }\n"}],"nodeId":80,"textContent":"\n    function Vector(){};\n    Vector.prototype =\n    {\n        sortAscending: function()\n        {\n            for(var i = 0, length = this.vector.length; i < (length - 1); i++)\n            {\n                for(var j = i + 1; j < length; j++)\n                {\n                    if(this.vector[i] > this.vector[j])\n                    {\n                        var temp = this.vector[i];\n                        this.vector[i] = this.vector[j];\n                        this.vector[j] = temp;\n                    }\n                }\n            }\n        },\n\n\n        sortDescending: function()\n        {\n            for(var i = 0, length = this.vector.length; i < (length - 1); i++)\n            {\n                for(var j = i + 1; j < length; j++)\n                {\n                    if(this.vector[i] < this.vector[j])\n                    {\n                        var temp = this.vector[i];\n                        this.vector[i] = this.vector[j];\n                        this.vector[j] = temp;\n                    }\n                }\n            }\n        },\n        sum:  function(callback)\n        {\n            var sum = 0.0;\n\n            for (var i = 0; i < this.vector.length;)\n            {\n                sum += this.vector[i++];\n            }\n            if (callback)\n                return callback(sum);\n            else\n                return sum;\n        },\n\n        product: function(callback)\n        {\n            var product = 1.0;\n\n            for (var i = 0; i < this.vector.length;)\n            {\n                product *= this.vector[i++];\n            }\n            if (callback)\n                return callback(product);\n            else\n                return product;\n        },\n\n        mean: function(callback)\n        {\n            var mean = this.sum() / this.vector.length;\n            if (callback)\n                return callback(mean);\n            else\n                return mean;\n        },\n        gmean: function(callback)\n        {\n            var gmean = Math.pow(Math.abs(this.product()), 1 / this.vector.length);\n            if (callback)\n                return callback(gmean);\n            else\n                return gmean;\n        },\n        hmean: function(callback)\n        {\n            function reciprocalSum(set)\n            {\n                for (var i = 0, sum = 0.0; i < set.length;) {\n                    sum += 1 / Math.abs(set[i++]);\n                }\n                return sum;\n            }\n            var hmean = this.vector.length / reciprocalSum(this.vector);\n            if (callback)\n                return callback(hmean);\n            else\n                return hmean;\n        },\n\n        qmean: function(callback) {\n            var qmean = Math.sqrt(this.pow(2).sum() / this.vector.length)\n            if (callback)\n                return callback(qmean);\n            else\n                return qmean;\n        },\n\n        median: function(callback)\n        {\n            var buffer = this.copy();\n            buffer.sortAscending();\n            var median = (this.vector.length % 2 === 0) ?\n                    (buffer.vector[this.vector.length / 2 - 1] + buffer.vector[this.vector.length / 2]) / 2 : buffer.vector[parseInt(this.vector.length / 2)];\n            if (callback)\n                return callback(median);\n            else\n                return median;\n        },\n\n        mode: function(callback)\n        {\n            var map = {};\n            var count = 1;\n            var modes = new Vector();\n            for (var i = 0; i < this.vector.length; i++) {\n                var e = this.vector[i];\n                if (map[e] == null)\n                    map[e] = 1;\n                else\n                    map[e]++;\n                if (map[e] > count) {\n                    modes = new Vector([e]);\n                    count = map[e];\n                } else if (map[e] == count) {\n                    modes.push(e);\n                    count = map[e];\n                }\n            }\n            if (modes.length === 1)\n                modes = modes[0];\n            if (callback)\n                return callback(modes);\n            else\n                return modes;\n        },\n\n        range: function(callback) {\n            var range = this.max() - this.min();\n            if (callback)\n                return callback(range);\n            else\n                return range;\n        },\n\n        variance: function(callback) {\n            var mean = 0.0,\n                    variance = 0.0;\n\n            for (var i = 0; i < this.vector.length; i++) {\n                var _mean = mean;\n                mean += (this.vector[i] - _mean) / (i + 1);\n                variance += (this.vector[i] - _mean) * (this.vector[i] - mean);\n            }\n            variance /= this.vector.length;\n\n            if (callback)\n                return callback(variance);\n            else\n                return variance;\n        },\n\n        stdev: function(percentile, callback) {\n            var stdev = 0.0;\n            if (!percentile)\n                stdev = Math.sqrt(this.variance());\n            else\n                return this.density(percentile).stdev();\n            if (callback)\n                return callback(stdev);\n            else\n                return stdev;\n        },\n\n        frequency: function(element, callback) {\n            var freq = 0;\n            if (this.vector.indexOf(element) !== -1) {\n                var buffer = this.copy();\n                buffer.sortAscending();\n                freq = buffer.vector.lastIndexOf(element) - buffer.vector.indexOf(element) + 1;\n            }\n            if (callback)\n                return callback(freq);\n            else\n                return freq;\n        }\n    }\n","pathAndModel":{"path":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html","model":{"loc":{"start":{"line":43,"column":0},"end":{"line":236,"column":0},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Program","body":[{"loc":{"start":{"line":44,"column":13},"end":{"line":44,"column":23},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"Vector","nodeId":82},"params":[],"body":{"loc":{"start":{"line":44,"column":21},"end":{"line":44,"column":22},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[],"nodeId":83},"generator":false,"expression":false,"nodeId":81},{"loc":{"start":{"line":44,"column":23},"end":{"line":44,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"EmptyStatement","nodeId":84},{"loc":{"start":{"line":45,"column":4},"end":{"line":235,"column":5},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":45,"column":4},"end":{"line":235,"column":5},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":45,"column":4},"end":{"line":45,"column":20},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":45,"column":4},"end":{"line":45,"column":10},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"Vector","nodeId":88},"property":{"loc":null,"type":"Identifier","name":"prototype","nodeId":89},"computed":false,"nodeId":87},"right":{"loc":{"start":{"line":46,"column":4},"end":{"line":235,"column":5},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ObjectExpression","properties":[{"loc":{"start":{"line":47,"column":8},"end":{"line":61,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Property","key":{"loc":{"start":{"line":47,"column":8},"end":{"line":47,"column":21},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"sortAscending","nodeId":92},"value":{"loc":{"start":{"line":47,"column":23},"end":{"line":61,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":48,"column":8},"end":{"line":60,"column":13},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":49,"column":12},"end":{"line":59,"column":17},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ForStatement","init":{"loc":{"start":{"line":49,"column":16},"end":{"line":49,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":49,"column":20},"end":{"line":49,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":49,"column":20},"end":{"line":49,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":98},"init":{"loc":{"start":{"line":49,"column":24},"end":{"line":49,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":0,"nodeId":99},"nodeId":97},{"loc":{"start":{"line":49,"column":27},"end":{"line":49,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":49,"column":27},"end":{"line":49,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"length","nodeId":101},"init":{"loc":{"start":{"line":49,"column":36},"end":{"line":49,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":49,"column":36},"end":{"line":49,"column":47},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":49,"column":36},"end":{"line":49,"column":40},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":104},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":105},"computed":false,"nodeId":103},"property":{"loc":null,"type":"Identifier","name":"length","nodeId":106},"computed":false,"nodeId":102},"nodeId":100}],"nodeId":96},"test":{"loc":{"start":{"line":49,"column":56},"end":{"line":49,"column":71},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":49,"column":56},"end":{"line":49,"column":57},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":108},"right":{"loc":{"start":{"line":49,"column":61},"end":{"line":49,"column":71},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"-","left":{"loc":{"start":{"line":49,"column":61},"end":{"line":49,"column":67},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"length","nodeId":110},"right":{"loc":{"start":{"line":49,"column":70},"end":{"line":49,"column":71},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":1,"nodeId":111},"nodeId":109},"nodeId":107},"update":{"loc":{"start":{"line":49,"column":74},"end":{"line":49,"column":77},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":49,"column":74},"end":{"line":49,"column":75},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":113},"prefix":false,"nodeId":112},"body":{"loc":{"start":{"line":50,"column":12},"end":{"line":59,"column":17},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":51,"column":16},"end":{"line":58,"column":21},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ForStatement","init":{"loc":{"start":{"line":51,"column":20},"end":{"line":51,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":51,"column":24},"end":{"line":51,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":51,"column":24},"end":{"line":51,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"j","nodeId":118},"init":{"loc":{"start":{"line":51,"column":28},"end":{"line":51,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":51,"column":28},"end":{"line":51,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":120},"right":{"loc":{"start":{"line":51,"column":32},"end":{"line":51,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":1,"nodeId":121},"nodeId":119},"nodeId":117}],"nodeId":116},"test":{"loc":{"start":{"line":51,"column":35},"end":{"line":51,"column":45},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":51,"column":35},"end":{"line":51,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"j","nodeId":123},"right":{"loc":{"start":{"line":51,"column":39},"end":{"line":51,"column":45},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"length","nodeId":124},"nodeId":122},"update":{"loc":{"start":{"line":51,"column":47},"end":{"line":51,"column":50},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":51,"column":47},"end":{"line":51,"column":48},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"j","nodeId":126},"prefix":false,"nodeId":125},"body":{"loc":{"start":{"line":52,"column":16},"end":{"line":58,"column":21},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":53,"column":20},"end":{"line":57,"column":46},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":53,"column":23},"end":{"line":53,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":">","left":{"loc":{"start":{"line":53,"column":23},"end":{"line":53,"column":37},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":53,"column":23},"end":{"line":53,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":53,"column":23},"end":{"line":53,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":132},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":133},"computed":false,"nodeId":131},"property":{"loc":{"start":{"line":53,"column":35},"end":{"line":53,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":134},"computed":true,"nodeId":130},"right":{"loc":{"start":{"line":53,"column":40},"end":{"line":53,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":53,"column":40},"end":{"line":53,"column":51},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":53,"column":40},"end":{"line":53,"column":44},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":137},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":138},"computed":false,"nodeId":136},"property":{"loc":{"start":{"line":53,"column":52},"end":{"line":53,"column":53},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"j","nodeId":139},"computed":true,"nodeId":135},"nodeId":129},"consequent":{"loc":{"start":{"line":54,"column":20},"end":{"line":57,"column":46},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":55,"column":24},"end":{"line":55,"column":49},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":55,"column":28},"end":{"line":55,"column":49},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":55,"column":28},"end":{"line":55,"column":49},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"temp","nodeId":143},"init":{"loc":{"start":{"line":55,"column":35},"end":{"line":55,"column":49},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":55,"column":35},"end":{"line":55,"column":46},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":55,"column":35},"end":{"line":55,"column":39},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":146},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":147},"computed":false,"nodeId":145},"property":{"loc":{"start":{"line":55,"column":47},"end":{"line":55,"column":48},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":148},"computed":true,"nodeId":144},"nodeId":142}],"nodeId":141},{"loc":{"start":{"line":56,"column":24},"end":{"line":56,"column":55},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":56,"column":24},"end":{"line":56,"column":55},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":56,"column":24},"end":{"line":56,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":56,"column":24},"end":{"line":56,"column":35},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":56,"column":24},"end":{"line":56,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":153},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":154},"computed":false,"nodeId":152},"property":{"loc":{"start":{"line":56,"column":36},"end":{"line":56,"column":37},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":155},"computed":true,"nodeId":151},"right":{"loc":{"start":{"line":56,"column":41},"end":{"line":56,"column":55},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":56,"column":41},"end":{"line":56,"column":52},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":56,"column":41},"end":{"line":56,"column":45},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":158},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":159},"computed":false,"nodeId":157},"property":{"loc":{"start":{"line":56,"column":53},"end":{"line":56,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"j","nodeId":160},"computed":true,"nodeId":156},"nodeId":150},"nodeId":149},{"loc":{"start":{"line":57,"column":24},"end":{"line":57,"column":45},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":57,"column":24},"end":{"line":57,"column":45},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":57,"column":24},"end":{"line":57,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":57,"column":24},"end":{"line":57,"column":35},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":57,"column":24},"end":{"line":57,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":165},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":166},"computed":false,"nodeId":164},"property":{"loc":{"start":{"line":57,"column":36},"end":{"line":57,"column":37},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"j","nodeId":167},"computed":true,"nodeId":163},"right":{"loc":{"start":{"line":57,"column":41},"end":{"line":57,"column":45},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"temp","nodeId":168},"nodeId":162},"nodeId":161}],"nodeId":140},"alternate":null,"nodeId":128}],"nodeId":127},"nodeId":115}],"nodeId":114},"nodeId":95}],"nodeId":94},"generator":false,"expression":false,"nodeId":93},"kind":"init","nodeId":91},{"loc":{"start":{"line":64,"column":8},"end":{"line":78,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Property","key":{"loc":{"start":{"line":64,"column":8},"end":{"line":64,"column":22},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"sortDescending","nodeId":170},"value":{"loc":{"start":{"line":64,"column":24},"end":{"line":78,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"FunctionExpression","id":null,"params":[],"body":{"loc":{"start":{"line":65,"column":8},"end":{"line":77,"column":13},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":66,"column":12},"end":{"line":76,"column":17},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ForStatement","init":{"loc":{"start":{"line":66,"column":16},"end":{"line":66,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":66,"column":20},"end":{"line":66,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":66,"column":20},"end":{"line":66,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":176},"init":{"loc":{"start":{"line":66,"column":24},"end":{"line":66,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":0,"nodeId":177},"nodeId":175},{"loc":{"start":{"line":66,"column":27},"end":{"line":66,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":66,"column":27},"end":{"line":66,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"length","nodeId":179},"init":{"loc":{"start":{"line":66,"column":36},"end":{"line":66,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":66,"column":36},"end":{"line":66,"column":47},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":66,"column":36},"end":{"line":66,"column":40},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":182},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":183},"computed":false,"nodeId":181},"property":{"loc":null,"type":"Identifier","name":"length","nodeId":184},"computed":false,"nodeId":180},"nodeId":178}],"nodeId":174},"test":{"loc":{"start":{"line":66,"column":56},"end":{"line":66,"column":71},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":66,"column":56},"end":{"line":66,"column":57},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":186},"right":{"loc":{"start":{"line":66,"column":61},"end":{"line":66,"column":71},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"-","left":{"loc":{"start":{"line":66,"column":61},"end":{"line":66,"column":67},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"length","nodeId":188},"right":{"loc":{"start":{"line":66,"column":70},"end":{"line":66,"column":71},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":1,"nodeId":189},"nodeId":187},"nodeId":185},"update":{"loc":{"start":{"line":66,"column":74},"end":{"line":66,"column":77},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":66,"column":74},"end":{"line":66,"column":75},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":191},"prefix":false,"nodeId":190},"body":{"loc":{"start":{"line":67,"column":12},"end":{"line":76,"column":17},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":68,"column":16},"end":{"line":75,"column":21},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ForStatement","init":{"loc":{"start":{"line":68,"column":20},"end":{"line":68,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":68,"column":24},"end":{"line":68,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":68,"column":24},"end":{"line":68,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"j","nodeId":196},"init":{"loc":{"start":{"line":68,"column":28},"end":{"line":68,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":68,"column":28},"end":{"line":68,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":198},"right":{"loc":{"start":{"line":68,"column":32},"end":{"line":68,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":1,"nodeId":199},"nodeId":197},"nodeId":195}],"nodeId":194},"test":{"loc":{"start":{"line":68,"column":35},"end":{"line":68,"column":45},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":68,"column":35},"end":{"line":68,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"j","nodeId":201},"right":{"loc":{"start":{"line":68,"column":39},"end":{"line":68,"column":45},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"length","nodeId":202},"nodeId":200},"update":{"loc":{"start":{"line":68,"column":47},"end":{"line":68,"column":50},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":68,"column":47},"end":{"line":68,"column":48},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"j","nodeId":204},"prefix":false,"nodeId":203},"body":{"loc":{"start":{"line":69,"column":16},"end":{"line":75,"column":21},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":70,"column":20},"end":{"line":74,"column":46},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":70,"column":23},"end":{"line":70,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":70,"column":23},"end":{"line":70,"column":37},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":70,"column":23},"end":{"line":70,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":70,"column":23},"end":{"line":70,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":210},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":211},"computed":false,"nodeId":209},"property":{"loc":{"start":{"line":70,"column":35},"end":{"line":70,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":212},"computed":true,"nodeId":208},"right":{"loc":{"start":{"line":70,"column":40},"end":{"line":70,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":70,"column":40},"end":{"line":70,"column":51},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":70,"column":40},"end":{"line":70,"column":44},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":215},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":216},"computed":false,"nodeId":214},"property":{"loc":{"start":{"line":70,"column":52},"end":{"line":70,"column":53},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"j","nodeId":217},"computed":true,"nodeId":213},"nodeId":207},"consequent":{"loc":{"start":{"line":71,"column":20},"end":{"line":74,"column":46},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":72,"column":24},"end":{"line":72,"column":49},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":72,"column":28},"end":{"line":72,"column":49},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":72,"column":28},"end":{"line":72,"column":49},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"temp","nodeId":221},"init":{"loc":{"start":{"line":72,"column":35},"end":{"line":72,"column":49},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":72,"column":35},"end":{"line":72,"column":46},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":72,"column":35},"end":{"line":72,"column":39},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":224},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":225},"computed":false,"nodeId":223},"property":{"loc":{"start":{"line":72,"column":47},"end":{"line":72,"column":48},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":226},"computed":true,"nodeId":222},"nodeId":220}],"nodeId":219},{"loc":{"start":{"line":73,"column":24},"end":{"line":73,"column":55},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":73,"column":24},"end":{"line":73,"column":55},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":73,"column":24},"end":{"line":73,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":73,"column":24},"end":{"line":73,"column":35},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":73,"column":24},"end":{"line":73,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":231},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":232},"computed":false,"nodeId":230},"property":{"loc":{"start":{"line":73,"column":36},"end":{"line":73,"column":37},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":233},"computed":true,"nodeId":229},"right":{"loc":{"start":{"line":73,"column":41},"end":{"line":73,"column":55},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":73,"column":41},"end":{"line":73,"column":52},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":73,"column":41},"end":{"line":73,"column":45},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":236},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":237},"computed":false,"nodeId":235},"property":{"loc":{"start":{"line":73,"column":53},"end":{"line":73,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"j","nodeId":238},"computed":true,"nodeId":234},"nodeId":228},"nodeId":227},{"loc":{"start":{"line":74,"column":24},"end":{"line":74,"column":45},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":74,"column":24},"end":{"line":74,"column":45},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":74,"column":24},"end":{"line":74,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":74,"column":24},"end":{"line":74,"column":35},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":74,"column":24},"end":{"line":74,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":243},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":244},"computed":false,"nodeId":242},"property":{"loc":{"start":{"line":74,"column":36},"end":{"line":74,"column":37},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"j","nodeId":245},"computed":true,"nodeId":241},"right":{"loc":{"start":{"line":74,"column":41},"end":{"line":74,"column":45},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"temp","nodeId":246},"nodeId":240},"nodeId":239}],"nodeId":218},"alternate":null,"nodeId":206}],"nodeId":205},"nodeId":193}],"nodeId":192},"nodeId":173}],"nodeId":172},"generator":false,"expression":false,"nodeId":171},"kind":"init","nodeId":169},{"loc":{"start":{"line":79,"column":8},"end":{"line":91,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Property","key":{"loc":{"start":{"line":79,"column":8},"end":{"line":79,"column":11},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"sum","nodeId":248},"value":{"loc":{"start":{"line":79,"column":14},"end":{"line":91,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":79,"column":23},"end":{"line":79,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":250}],"body":{"loc":{"start":{"line":80,"column":8},"end":{"line":90,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":81,"column":12},"end":{"line":81,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":81,"column":16},"end":{"line":81,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":81,"column":16},"end":{"line":81,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"sum","nodeId":254},"init":{"loc":{"start":{"line":81,"column":22},"end":{"line":81,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":0,"nodeId":255},"nodeId":253}],"nodeId":252},{"loc":{"start":{"line":83,"column":12},"end":{"line":85,"column":40},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ForStatement","init":{"loc":{"start":{"line":83,"column":17},"end":{"line":83,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":83,"column":21},"end":{"line":83,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":83,"column":21},"end":{"line":83,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":259},"init":{"loc":{"start":{"line":83,"column":25},"end":{"line":83,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":0,"nodeId":260},"nodeId":258}],"nodeId":257},"test":{"loc":{"start":{"line":83,"column":28},"end":{"line":83,"column":50},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":83,"column":28},"end":{"line":83,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":262},"right":{"loc":{"start":{"line":83,"column":32},"end":{"line":83,"column":50},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":83,"column":32},"end":{"line":83,"column":43},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":83,"column":32},"end":{"line":83,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":265},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":266},"computed":false,"nodeId":264},"property":{"loc":null,"type":"Identifier","name":"length","nodeId":267},"computed":false,"nodeId":263},"nodeId":261},"update":null,"body":{"loc":{"start":{"line":84,"column":12},"end":{"line":85,"column":40},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":85,"column":16},"end":{"line":85,"column":39},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":85,"column":16},"end":{"line":85,"column":39},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":85,"column":16},"end":{"line":85,"column":19},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"sum","nodeId":271},"right":{"loc":{"start":{"line":85,"column":23},"end":{"line":85,"column":39},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":85,"column":23},"end":{"line":85,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":85,"column":23},"end":{"line":85,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":274},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":275},"computed":false,"nodeId":273},"property":{"loc":{"start":{"line":85,"column":35},"end":{"line":85,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":85,"column":35},"end":{"line":85,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":277},"prefix":false,"nodeId":276},"computed":true,"nodeId":272},"nodeId":270},"nodeId":269}],"nodeId":268},"nodeId":256},{"loc":{"start":{"line":87,"column":12},"end":{"line":90,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":87,"column":16},"end":{"line":87,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":279},"consequent":{"loc":{"start":{"line":88,"column":16},"end":{"line":88,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":88,"column":23},"end":{"line":88,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":88,"column":23},"end":{"line":88,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":282},"arguments":[{"loc":{"start":{"line":88,"column":32},"end":{"line":88,"column":35},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"sum","nodeId":283}],"nodeId":281},"nodeId":280},"alternate":{"loc":{"start":{"line":90,"column":16},"end":{"line":90,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":90,"column":23},"end":{"line":90,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"sum","nodeId":285},"nodeId":284},"nodeId":278}],"nodeId":251},"generator":false,"expression":false,"nodeId":249},"kind":"init","nodeId":247},{"loc":{"start":{"line":93,"column":8},"end":{"line":105,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Property","key":{"loc":{"start":{"line":93,"column":8},"end":{"line":93,"column":15},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"product","nodeId":287},"value":{"loc":{"start":{"line":93,"column":17},"end":{"line":105,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":93,"column":26},"end":{"line":93,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":289}],"body":{"loc":{"start":{"line":94,"column":8},"end":{"line":104,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":95,"column":12},"end":{"line":95,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":95,"column":16},"end":{"line":95,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":95,"column":16},"end":{"line":95,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"product","nodeId":293},"init":{"loc":{"start":{"line":95,"column":26},"end":{"line":95,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":1,"nodeId":294},"nodeId":292}],"nodeId":291},{"loc":{"start":{"line":97,"column":12},"end":{"line":99,"column":44},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ForStatement","init":{"loc":{"start":{"line":97,"column":17},"end":{"line":97,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":97,"column":21},"end":{"line":97,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":97,"column":21},"end":{"line":97,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":298},"init":{"loc":{"start":{"line":97,"column":25},"end":{"line":97,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":0,"nodeId":299},"nodeId":297}],"nodeId":296},"test":{"loc":{"start":{"line":97,"column":28},"end":{"line":97,"column":50},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":97,"column":28},"end":{"line":97,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":301},"right":{"loc":{"start":{"line":97,"column":32},"end":{"line":97,"column":50},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":97,"column":32},"end":{"line":97,"column":43},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":97,"column":32},"end":{"line":97,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":304},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":305},"computed":false,"nodeId":303},"property":{"loc":null,"type":"Identifier","name":"length","nodeId":306},"computed":false,"nodeId":302},"nodeId":300},"update":null,"body":{"loc":{"start":{"line":98,"column":12},"end":{"line":99,"column":44},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":99,"column":16},"end":{"line":99,"column":43},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":99,"column":16},"end":{"line":99,"column":43},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"AssignmentExpression","operator":"*=","left":{"loc":{"start":{"line":99,"column":16},"end":{"line":99,"column":23},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"product","nodeId":310},"right":{"loc":{"start":{"line":99,"column":27},"end":{"line":99,"column":43},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":99,"column":27},"end":{"line":99,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":99,"column":27},"end":{"line":99,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":313},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":314},"computed":false,"nodeId":312},"property":{"loc":{"start":{"line":99,"column":39},"end":{"line":99,"column":42},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":99,"column":39},"end":{"line":99,"column":40},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":316},"prefix":false,"nodeId":315},"computed":true,"nodeId":311},"nodeId":309},"nodeId":308}],"nodeId":307},"nodeId":295},{"loc":{"start":{"line":101,"column":12},"end":{"line":104,"column":30},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":101,"column":16},"end":{"line":101,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":318},"consequent":{"loc":{"start":{"line":102,"column":16},"end":{"line":102,"column":40},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":102,"column":23},"end":{"line":102,"column":40},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":102,"column":23},"end":{"line":102,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":321},"arguments":[{"loc":{"start":{"line":102,"column":32},"end":{"line":102,"column":39},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"product","nodeId":322}],"nodeId":320},"nodeId":319},"alternate":{"loc":{"start":{"line":104,"column":16},"end":{"line":104,"column":30},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":104,"column":23},"end":{"line":104,"column":30},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"product","nodeId":324},"nodeId":323},"nodeId":317}],"nodeId":290},"generator":false,"expression":false,"nodeId":288},"kind":"init","nodeId":286},{"loc":{"start":{"line":107,"column":8},"end":{"line":114,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Property","key":{"loc":{"start":{"line":107,"column":8},"end":{"line":107,"column":12},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"mean","nodeId":326},"value":{"loc":{"start":{"line":107,"column":14},"end":{"line":114,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":107,"column":23},"end":{"line":107,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":328}],"body":{"loc":{"start":{"line":108,"column":8},"end":{"line":113,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":109,"column":12},"end":{"line":109,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":109,"column":16},"end":{"line":109,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":109,"column":16},"end":{"line":109,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"mean","nodeId":332},"init":{"loc":{"start":{"line":109,"column":23},"end":{"line":109,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"/","left":{"loc":{"start":{"line":109,"column":23},"end":{"line":109,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":109,"column":23},"end":{"line":109,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":109,"column":23},"end":{"line":109,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":336},"property":{"loc":null,"type":"Identifier","name":"sum","nodeId":337},"computed":false,"nodeId":335},"arguments":[],"nodeId":334},"right":{"loc":{"start":{"line":109,"column":36},"end":{"line":109,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":109,"column":36},"end":{"line":109,"column":47},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":109,"column":36},"end":{"line":109,"column":40},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":340},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":341},"computed":false,"nodeId":339},"property":{"loc":null,"type":"Identifier","name":"length","nodeId":342},"computed":false,"nodeId":338},"nodeId":333},"nodeId":331}],"nodeId":330},{"loc":{"start":{"line":110,"column":12},"end":{"line":113,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":110,"column":16},"end":{"line":110,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":344},"consequent":{"loc":{"start":{"line":111,"column":16},"end":{"line":111,"column":37},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":111,"column":23},"end":{"line":111,"column":37},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":111,"column":23},"end":{"line":111,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":347},"arguments":[{"loc":{"start":{"line":111,"column":32},"end":{"line":111,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"mean","nodeId":348}],"nodeId":346},"nodeId":345},"alternate":{"loc":{"start":{"line":113,"column":16},"end":{"line":113,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":113,"column":23},"end":{"line":113,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"mean","nodeId":350},"nodeId":349},"nodeId":343}],"nodeId":329},"generator":false,"expression":false,"nodeId":327},"kind":"init","nodeId":325},{"loc":{"start":{"line":115,"column":8},"end":{"line":122,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Property","key":{"loc":{"start":{"line":115,"column":8},"end":{"line":115,"column":13},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"gmean","nodeId":352},"value":{"loc":{"start":{"line":115,"column":15},"end":{"line":122,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":115,"column":24},"end":{"line":115,"column":32},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":354}],"body":{"loc":{"start":{"line":116,"column":8},"end":{"line":121,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":117,"column":12},"end":{"line":117,"column":82},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":117,"column":16},"end":{"line":117,"column":82},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":117,"column":16},"end":{"line":117,"column":82},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"gmean","nodeId":358},"init":{"loc":{"start":{"line":117,"column":24},"end":{"line":117,"column":82},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":117,"column":24},"end":{"line":117,"column":32},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":117,"column":24},"end":{"line":117,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"Math","nodeId":361},"property":{"loc":null,"type":"Identifier","name":"pow","nodeId":362},"computed":false,"nodeId":360},"arguments":[{"loc":{"start":{"line":117,"column":33},"end":{"line":117,"column":57},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":117,"column":33},"end":{"line":117,"column":41},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":117,"column":33},"end":{"line":117,"column":37},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"Math","nodeId":365},"property":{"loc":null,"type":"Identifier","name":"abs","nodeId":366},"computed":false,"nodeId":364},"arguments":[{"loc":{"start":{"line":117,"column":42},"end":{"line":117,"column":56},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":117,"column":42},"end":{"line":117,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":117,"column":42},"end":{"line":117,"column":46},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":369},"property":{"loc":null,"type":"Identifier","name":"product","nodeId":370},"computed":false,"nodeId":368},"arguments":[],"nodeId":367}],"nodeId":363},{"loc":{"start":{"line":117,"column":59},"end":{"line":117,"column":81},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"/","left":{"loc":{"start":{"line":117,"column":59},"end":{"line":117,"column":60},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":1,"nodeId":372},"right":{"loc":{"start":{"line":117,"column":63},"end":{"line":117,"column":81},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":117,"column":63},"end":{"line":117,"column":74},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":117,"column":63},"end":{"line":117,"column":67},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":375},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":376},"computed":false,"nodeId":374},"property":{"loc":null,"type":"Identifier","name":"length","nodeId":377},"computed":false,"nodeId":373},"nodeId":371}],"nodeId":359},"nodeId":357}],"nodeId":356},{"loc":{"start":{"line":118,"column":12},"end":{"line":121,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":118,"column":16},"end":{"line":118,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":379},"consequent":{"loc":{"start":{"line":119,"column":16},"end":{"line":119,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":119,"column":23},"end":{"line":119,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":119,"column":23},"end":{"line":119,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":382},"arguments":[{"loc":{"start":{"line":119,"column":32},"end":{"line":119,"column":37},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"gmean","nodeId":383}],"nodeId":381},"nodeId":380},"alternate":{"loc":{"start":{"line":121,"column":16},"end":{"line":121,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":121,"column":23},"end":{"line":121,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"gmean","nodeId":385},"nodeId":384},"nodeId":378}],"nodeId":355},"generator":false,"expression":false,"nodeId":353},"kind":"init","nodeId":351},{"loc":{"start":{"line":123,"column":8},"end":{"line":137,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Property","key":{"loc":{"start":{"line":123,"column":8},"end":{"line":123,"column":13},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"hmean","nodeId":387},"value":{"loc":{"start":{"line":123,"column":15},"end":{"line":137,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":123,"column":24},"end":{"line":123,"column":32},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":389}],"body":{"loc":{"start":{"line":124,"column":8},"end":{"line":136,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":125,"column":21},"end":{"line":131,"column":13},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"FunctionDeclaration","id":{"loc":null,"type":"Identifier","name":"reciprocalSum","nodeId":392},"params":[{"loc":{"start":{"line":125,"column":35},"end":{"line":125,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"set","nodeId":393}],"body":{"loc":{"start":{"line":126,"column":12},"end":{"line":130,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":127,"column":16},"end":{"line":128,"column":50},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ForStatement","init":{"loc":{"start":{"line":127,"column":21},"end":{"line":127,"column":41},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":127,"column":25},"end":{"line":127,"column":30},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":127,"column":25},"end":{"line":127,"column":30},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":398},"init":{"loc":{"start":{"line":127,"column":29},"end":{"line":127,"column":30},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":0,"nodeId":399},"nodeId":397},{"loc":{"start":{"line":127,"column":32},"end":{"line":127,"column":41},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":127,"column":32},"end":{"line":127,"column":41},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"sum","nodeId":401},"init":{"loc":{"start":{"line":127,"column":38},"end":{"line":127,"column":41},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":0,"nodeId":402},"nodeId":400}],"nodeId":396},"test":{"loc":{"start":{"line":127,"column":43},"end":{"line":127,"column":57},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":127,"column":43},"end":{"line":127,"column":44},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":404},"right":{"loc":{"start":{"line":127,"column":47},"end":{"line":127,"column":57},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":127,"column":47},"end":{"line":127,"column":50},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"set","nodeId":406},"property":{"loc":null,"type":"Identifier","name":"length","nodeId":407},"computed":false,"nodeId":405},"nodeId":403},"update":null,"body":{"loc":{"start":{"line":127,"column":60},"end":{"line":128,"column":50},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":128,"column":20},"end":{"line":128,"column":49},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":128,"column":20},"end":{"line":128,"column":49},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":128,"column":20},"end":{"line":128,"column":23},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"sum","nodeId":411},"right":{"loc":{"start":{"line":128,"column":27},"end":{"line":128,"column":49},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"/","left":{"loc":{"start":{"line":128,"column":27},"end":{"line":128,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":1,"nodeId":413},"right":{"loc":{"start":{"line":128,"column":31},"end":{"line":128,"column":49},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":128,"column":31},"end":{"line":128,"column":39},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":128,"column":31},"end":{"line":128,"column":35},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"Math","nodeId":416},"property":{"loc":null,"type":"Identifier","name":"abs","nodeId":417},"computed":false,"nodeId":415},"arguments":[{"loc":{"start":{"line":128,"column":40},"end":{"line":128,"column":48},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":128,"column":40},"end":{"line":128,"column":43},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"set","nodeId":419},"property":{"loc":{"start":{"line":128,"column":44},"end":{"line":128,"column":47},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":128,"column":44},"end":{"line":128,"column":45},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":421},"prefix":false,"nodeId":420},"computed":true,"nodeId":418}],"nodeId":414},"nodeId":412},"nodeId":410},"nodeId":409}],"nodeId":408},"nodeId":395},{"loc":{"start":{"line":130,"column":16},"end":{"line":130,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":130,"column":23},"end":{"line":130,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"sum","nodeId":423},"nodeId":422}],"nodeId":394},"generator":false,"expression":false,"nodeId":391},{"loc":{"start":{"line":132,"column":12},"end":{"line":132,"column":71},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":132,"column":16},"end":{"line":132,"column":71},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":132,"column":16},"end":{"line":132,"column":71},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"hmean","nodeId":426},"init":{"loc":{"start":{"line":132,"column":24},"end":{"line":132,"column":71},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"/","left":{"loc":{"start":{"line":132,"column":24},"end":{"line":132,"column":42},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":132,"column":24},"end":{"line":132,"column":35},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":132,"column":24},"end":{"line":132,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":430},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":431},"computed":false,"nodeId":429},"property":{"loc":null,"type":"Identifier","name":"length","nodeId":432},"computed":false,"nodeId":428},"right":{"loc":{"start":{"line":132,"column":45},"end":{"line":132,"column":71},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":132,"column":45},"end":{"line":132,"column":58},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"reciprocalSum","nodeId":434},"arguments":[{"loc":{"start":{"line":132,"column":59},"end":{"line":132,"column":70},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":132,"column":59},"end":{"line":132,"column":63},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":436},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":437},"computed":false,"nodeId":435}],"nodeId":433},"nodeId":427},"nodeId":425}],"nodeId":424},{"loc":{"start":{"line":133,"column":12},"end":{"line":136,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":133,"column":16},"end":{"line":133,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":439},"consequent":{"loc":{"start":{"line":134,"column":16},"end":{"line":134,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":134,"column":23},"end":{"line":134,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":134,"column":23},"end":{"line":134,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":442},"arguments":[{"loc":{"start":{"line":134,"column":32},"end":{"line":134,"column":37},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"hmean","nodeId":443}],"nodeId":441},"nodeId":440},"alternate":{"loc":{"start":{"line":136,"column":16},"end":{"line":136,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":136,"column":23},"end":{"line":136,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"hmean","nodeId":445},"nodeId":444},"nodeId":438}],"nodeId":390},"generator":false,"expression":false,"nodeId":388},"kind":"init","nodeId":386},{"loc":{"start":{"line":139,"column":8},"end":{"line":145,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Property","key":{"loc":{"start":{"line":139,"column":8},"end":{"line":139,"column":13},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"qmean","nodeId":447},"value":{"loc":{"start":{"line":139,"column":15},"end":{"line":145,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":139,"column":24},"end":{"line":139,"column":32},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":449}],"body":{"loc":{"start":{"line":139,"column":34},"end":{"line":144,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":140,"column":12},"end":{"line":140,"column":73},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":140,"column":16},"end":{"line":140,"column":73},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":140,"column":16},"end":{"line":140,"column":73},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"qmean","nodeId":453},"init":{"loc":{"start":{"line":140,"column":24},"end":{"line":140,"column":73},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":140,"column":24},"end":{"line":140,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":140,"column":24},"end":{"line":140,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"Math","nodeId":456},"property":{"loc":null,"type":"Identifier","name":"sqrt","nodeId":457},"computed":false,"nodeId":455},"arguments":[{"loc":{"start":{"line":140,"column":34},"end":{"line":140,"column":72},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"/","left":{"loc":{"start":{"line":140,"column":34},"end":{"line":140,"column":51},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":140,"column":34},"end":{"line":140,"column":49},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":140,"column":34},"end":{"line":140,"column":45},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":140,"column":34},"end":{"line":140,"column":42},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":140,"column":34},"end":{"line":140,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":463},"property":{"loc":null,"type":"Identifier","name":"pow","nodeId":464},"computed":false,"nodeId":462},"arguments":[{"loc":{"start":{"line":140,"column":43},"end":{"line":140,"column":44},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":2,"nodeId":465}],"nodeId":461},"property":{"loc":null,"type":"Identifier","name":"sum","nodeId":466},"computed":false,"nodeId":460},"arguments":[],"nodeId":459},"right":{"loc":{"start":{"line":140,"column":54},"end":{"line":140,"column":72},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":140,"column":54},"end":{"line":140,"column":65},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":140,"column":54},"end":{"line":140,"column":58},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":469},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":470},"computed":false,"nodeId":468},"property":{"loc":null,"type":"Identifier","name":"length","nodeId":471},"computed":false,"nodeId":467},"nodeId":458}],"nodeId":454},"nodeId":452}],"nodeId":451},{"loc":{"start":{"line":141,"column":12},"end":{"line":144,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":141,"column":16},"end":{"line":141,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":473},"consequent":{"loc":{"start":{"line":142,"column":16},"end":{"line":142,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":142,"column":23},"end":{"line":142,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":142,"column":23},"end":{"line":142,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":476},"arguments":[{"loc":{"start":{"line":142,"column":32},"end":{"line":142,"column":37},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"qmean","nodeId":477}],"nodeId":475},"nodeId":474},"alternate":{"loc":{"start":{"line":144,"column":16},"end":{"line":144,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":144,"column":23},"end":{"line":144,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"qmean","nodeId":479},"nodeId":478},"nodeId":472}],"nodeId":450},"generator":false,"expression":false,"nodeId":448},"kind":"init","nodeId":446},{"loc":{"start":{"line":147,"column":8},"end":{"line":157,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Property","key":{"loc":{"start":{"line":147,"column":8},"end":{"line":147,"column":14},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"median","nodeId":481},"value":{"loc":{"start":{"line":147,"column":16},"end":{"line":157,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":147,"column":25},"end":{"line":147,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":483}],"body":{"loc":{"start":{"line":148,"column":8},"end":{"line":156,"column":30},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":149,"column":12},"end":{"line":149,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":149,"column":16},"end":{"line":149,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":149,"column":16},"end":{"line":149,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"buffer","nodeId":487},"init":{"loc":{"start":{"line":149,"column":25},"end":{"line":149,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":149,"column":25},"end":{"line":149,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":149,"column":25},"end":{"line":149,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":490},"property":{"loc":null,"type":"Identifier","name":"copy","nodeId":491},"computed":false,"nodeId":489},"arguments":[],"nodeId":488},"nodeId":486}],"nodeId":485},{"loc":{"start":{"line":150,"column":12},"end":{"line":150,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":150,"column":12},"end":{"line":150,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":150,"column":12},"end":{"line":150,"column":32},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":150,"column":12},"end":{"line":150,"column":18},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"buffer","nodeId":495},"property":{"loc":null,"type":"Identifier","name":"sortAscending","nodeId":496},"computed":false,"nodeId":494},"arguments":[],"nodeId":493},"nodeId":492},{"loc":{"start":{"line":151,"column":12},"end":{"line":152,"column":157},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":151,"column":16},"end":{"line":152,"column":157},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":151,"column":16},"end":{"line":152,"column":157},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"median","nodeId":499},"init":{"loc":{"start":{"line":151,"column":26},"end":{"line":152,"column":157},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ConditionalExpression","test":{"loc":{"start":{"line":151,"column":26},"end":{"line":151,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"===","left":{"loc":{"start":{"line":151,"column":26},"end":{"line":151,"column":48},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"%","left":{"loc":{"start":{"line":151,"column":26},"end":{"line":151,"column":44},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":151,"column":26},"end":{"line":151,"column":37},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":151,"column":26},"end":{"line":151,"column":30},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":505},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":506},"computed":false,"nodeId":504},"property":{"loc":null,"type":"Identifier","name":"length","nodeId":507},"computed":false,"nodeId":503},"right":{"loc":{"start":{"line":151,"column":47},"end":{"line":151,"column":48},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":2,"nodeId":508},"nodeId":502},"right":{"loc":{"start":{"line":151,"column":53},"end":{"line":151,"column":54},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":0,"nodeId":509},"nodeId":501},"consequent":{"loc":{"start":{"line":152,"column":21},"end":{"line":152,"column":107},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"/","left":{"loc":{"start":{"line":152,"column":21},"end":{"line":152,"column":102},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":152,"column":21},"end":{"line":152,"column":62},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":152,"column":21},"end":{"line":152,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":152,"column":21},"end":{"line":152,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"buffer","nodeId":514},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":515},"computed":false,"nodeId":513},"property":{"loc":{"start":{"line":152,"column":35},"end":{"line":152,"column":61},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"-","left":{"loc":{"start":{"line":152,"column":35},"end":{"line":152,"column":57},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"/","left":{"loc":{"start":{"line":152,"column":35},"end":{"line":152,"column":53},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":152,"column":35},"end":{"line":152,"column":46},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":152,"column":35},"end":{"line":152,"column":39},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":520},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":521},"computed":false,"nodeId":519},"property":{"loc":null,"type":"Identifier","name":"length","nodeId":522},"computed":false,"nodeId":518},"right":{"loc":{"start":{"line":152,"column":56},"end":{"line":152,"column":57},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":2,"nodeId":523},"nodeId":517},"right":{"loc":{"start":{"line":152,"column":60},"end":{"line":152,"column":61},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":1,"nodeId":524},"nodeId":516},"computed":true,"nodeId":512},"right":{"loc":{"start":{"line":152,"column":65},"end":{"line":152,"column":102},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":152,"column":65},"end":{"line":152,"column":78},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":152,"column":65},"end":{"line":152,"column":71},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"buffer","nodeId":527},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":528},"computed":false,"nodeId":526},"property":{"loc":{"start":{"line":152,"column":79},"end":{"line":152,"column":101},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"/","left":{"loc":{"start":{"line":152,"column":79},"end":{"line":152,"column":97},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":152,"column":79},"end":{"line":152,"column":90},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":152,"column":79},"end":{"line":152,"column":83},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":532},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":533},"computed":false,"nodeId":531},"property":{"loc":null,"type":"Identifier","name":"length","nodeId":534},"computed":false,"nodeId":530},"right":{"loc":{"start":{"line":152,"column":100},"end":{"line":152,"column":101},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":2,"nodeId":535},"nodeId":529},"computed":true,"nodeId":525},"nodeId":511},"right":{"loc":{"start":{"line":152,"column":106},"end":{"line":152,"column":107},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":2,"nodeId":536},"nodeId":510},"alternate":{"loc":{"start":{"line":152,"column":110},"end":{"line":152,"column":157},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":152,"column":110},"end":{"line":152,"column":123},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":152,"column":110},"end":{"line":152,"column":116},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"buffer","nodeId":539},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":540},"computed":false,"nodeId":538},"property":{"loc":{"start":{"line":152,"column":124},"end":{"line":152,"column":156},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":152,"column":124},"end":{"line":152,"column":132},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"parseInt","nodeId":542},"arguments":[{"loc":{"start":{"line":152,"column":133},"end":{"line":152,"column":155},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"/","left":{"loc":{"start":{"line":152,"column":133},"end":{"line":152,"column":151},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":152,"column":133},"end":{"line":152,"column":144},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":152,"column":133},"end":{"line":152,"column":137},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":546},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":547},"computed":false,"nodeId":545},"property":{"loc":null,"type":"Identifier","name":"length","nodeId":548},"computed":false,"nodeId":544},"right":{"loc":{"start":{"line":152,"column":154},"end":{"line":152,"column":155},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":2,"nodeId":549},"nodeId":543}],"nodeId":541},"computed":true,"nodeId":537},"nodeId":500},"nodeId":498}],"nodeId":497},{"loc":{"start":{"line":153,"column":12},"end":{"line":156,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":153,"column":16},"end":{"line":153,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":551},"consequent":{"loc":{"start":{"line":154,"column":16},"end":{"line":154,"column":39},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":154,"column":23},"end":{"line":154,"column":39},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":154,"column":23},"end":{"line":154,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":554},"arguments":[{"loc":{"start":{"line":154,"column":32},"end":{"line":154,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"median","nodeId":555}],"nodeId":553},"nodeId":552},"alternate":{"loc":{"start":{"line":156,"column":16},"end":{"line":156,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":156,"column":23},"end":{"line":156,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"median","nodeId":557},"nodeId":556},"nodeId":550}],"nodeId":484},"generator":false,"expression":false,"nodeId":482},"kind":"init","nodeId":480},{"loc":{"start":{"line":159,"column":8},"end":{"line":184,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Property","key":{"loc":{"start":{"line":159,"column":8},"end":{"line":159,"column":12},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"mode","nodeId":559},"value":{"loc":{"start":{"line":159,"column":14},"end":{"line":184,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":159,"column":23},"end":{"line":159,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":561}],"body":{"loc":{"start":{"line":160,"column":8},"end":{"line":183,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":161,"column":12},"end":{"line":161,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":161,"column":16},"end":{"line":161,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":161,"column":16},"end":{"line":161,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"map","nodeId":565},"init":{"loc":{"start":{"line":161,"column":22},"end":{"line":161,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ObjectExpression","properties":[],"nodeId":566},"nodeId":564}],"nodeId":563},{"loc":{"start":{"line":162,"column":12},"end":{"line":162,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":162,"column":16},"end":{"line":162,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":162,"column":16},"end":{"line":162,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"count","nodeId":569},"init":{"loc":{"start":{"line":162,"column":24},"end":{"line":162,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":1,"nodeId":570},"nodeId":568}],"nodeId":567},{"loc":{"start":{"line":163,"column":12},"end":{"line":163,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":163,"column":16},"end":{"line":163,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":163,"column":16},"end":{"line":163,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"modes","nodeId":573},"init":{"loc":{"start":{"line":163,"column":28},"end":{"line":163,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"NewExpression","callee":{"loc":{"start":{"line":163,"column":28},"end":{"line":163,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"Vector","nodeId":575},"arguments":[],"nodeId":574},"nodeId":572}],"nodeId":571},{"loc":{"start":{"line":164,"column":12},"end":{"line":176,"column":17},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ForStatement","init":{"loc":{"start":{"line":164,"column":17},"end":{"line":164,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":164,"column":21},"end":{"line":164,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":164,"column":21},"end":{"line":164,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":579},"init":{"loc":{"start":{"line":164,"column":25},"end":{"line":164,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":0,"nodeId":580},"nodeId":578}],"nodeId":577},"test":{"loc":{"start":{"line":164,"column":28},"end":{"line":164,"column":50},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":164,"column":28},"end":{"line":164,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":582},"right":{"loc":{"start":{"line":164,"column":32},"end":{"line":164,"column":50},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":164,"column":32},"end":{"line":164,"column":43},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":164,"column":32},"end":{"line":164,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":585},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":586},"computed":false,"nodeId":584},"property":{"loc":null,"type":"Identifier","name":"length","nodeId":587},"computed":false,"nodeId":583},"nodeId":581},"update":{"loc":{"start":{"line":164,"column":52},"end":{"line":164,"column":55},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":164,"column":52},"end":{"line":164,"column":53},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":589},"prefix":false,"nodeId":588},"body":{"loc":{"start":{"line":164,"column":57},"end":{"line":176,"column":17},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":165,"column":16},"end":{"line":165,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":165,"column":20},"end":{"line":165,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":165,"column":20},"end":{"line":165,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"e","nodeId":593},"init":{"loc":{"start":{"line":165,"column":24},"end":{"line":165,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":165,"column":24},"end":{"line":165,"column":35},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":165,"column":24},"end":{"line":165,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":596},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":597},"computed":false,"nodeId":595},"property":{"loc":{"start":{"line":165,"column":36},"end":{"line":165,"column":37},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":598},"computed":true,"nodeId":594},"nodeId":592}],"nodeId":591},{"loc":{"start":{"line":166,"column":16},"end":{"line":169,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":166,"column":20},"end":{"line":166,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":166,"column":20},"end":{"line":166,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":166,"column":20},"end":{"line":166,"column":23},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"map","nodeId":602},"property":{"loc":{"start":{"line":166,"column":24},"end":{"line":166,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"e","nodeId":603},"computed":true,"nodeId":601},"right":{"loc":{"start":{"line":166,"column":30},"end":{"line":166,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":null,"nodeId":604},"nodeId":600},"consequent":{"loc":{"start":{"line":167,"column":20},"end":{"line":167,"column":30},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":167,"column":20},"end":{"line":167,"column":30},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":167,"column":20},"end":{"line":167,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":167,"column":20},"end":{"line":167,"column":23},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"map","nodeId":608},"property":{"loc":{"start":{"line":167,"column":24},"end":{"line":167,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"e","nodeId":609},"computed":true,"nodeId":607},"right":{"loc":{"start":{"line":167,"column":29},"end":{"line":167,"column":30},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":1,"nodeId":610},"nodeId":606},"nodeId":605},"alternate":{"loc":{"start":{"line":169,"column":20},"end":{"line":169,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":169,"column":20},"end":{"line":169,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":169,"column":20},"end":{"line":169,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":169,"column":20},"end":{"line":169,"column":23},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"map","nodeId":614},"property":{"loc":{"start":{"line":169,"column":24},"end":{"line":169,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"e","nodeId":615},"computed":true,"nodeId":613},"prefix":false,"nodeId":612},"nodeId":611},"nodeId":599},{"loc":{"start":{"line":170,"column":16},"end":{"line":175,"column":35},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":170,"column":20},"end":{"line":170,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":">","left":{"loc":{"start":{"line":170,"column":20},"end":{"line":170,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":170,"column":20},"end":{"line":170,"column":23},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"map","nodeId":619},"property":{"loc":{"start":{"line":170,"column":24},"end":{"line":170,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"e","nodeId":620},"computed":true,"nodeId":618},"right":{"loc":{"start":{"line":170,"column":29},"end":{"line":170,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"count","nodeId":621},"nodeId":617},"consequent":{"loc":{"start":{"line":170,"column":36},"end":{"line":172,"column":35},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":171,"column":20},"end":{"line":171,"column":42},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":171,"column":20},"end":{"line":171,"column":42},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":171,"column":20},"end":{"line":171,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"modes","nodeId":625},"right":{"loc":{"start":{"line":171,"column":32},"end":{"line":171,"column":42},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"NewExpression","callee":{"loc":{"start":{"line":171,"column":32},"end":{"line":171,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"Vector","nodeId":627},"arguments":[{"loc":{"start":{"line":171,"column":39},"end":{"line":171,"column":42},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ArrayExpression","elements":[{"loc":{"start":{"line":171,"column":40},"end":{"line":171,"column":41},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"e","nodeId":629}],"nodeId":628}],"nodeId":626},"nodeId":624},"nodeId":623},{"loc":{"start":{"line":172,"column":20},"end":{"line":172,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":172,"column":20},"end":{"line":172,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":172,"column":20},"end":{"line":172,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"count","nodeId":632},"right":{"loc":{"start":{"line":172,"column":28},"end":{"line":172,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":172,"column":28},"end":{"line":172,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"map","nodeId":634},"property":{"loc":{"start":{"line":172,"column":32},"end":{"line":172,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"e","nodeId":635},"computed":true,"nodeId":633},"nodeId":631},"nodeId":630}],"nodeId":622},"alternate":{"loc":{"start":{"line":173,"column":23},"end":{"line":175,"column":35},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":173,"column":27},"end":{"line":173,"column":42},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"==","left":{"loc":{"start":{"line":173,"column":27},"end":{"line":173,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":173,"column":27},"end":{"line":173,"column":30},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"map","nodeId":639},"property":{"loc":{"start":{"line":173,"column":31},"end":{"line":173,"column":32},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"e","nodeId":640},"computed":true,"nodeId":638},"right":{"loc":{"start":{"line":173,"column":37},"end":{"line":173,"column":42},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"count","nodeId":641},"nodeId":637},"consequent":{"loc":{"start":{"line":173,"column":44},"end":{"line":175,"column":35},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":174,"column":20},"end":{"line":174,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":174,"column":20},"end":{"line":174,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":174,"column":20},"end":{"line":174,"column":30},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":174,"column":20},"end":{"line":174,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"modes","nodeId":646},"property":{"loc":null,"type":"Identifier","name":"push","nodeId":647},"computed":false,"nodeId":645},"arguments":[{"loc":{"start":{"line":174,"column":31},"end":{"line":174,"column":32},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"e","nodeId":648}],"nodeId":644},"nodeId":643},{"loc":{"start":{"line":175,"column":20},"end":{"line":175,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":175,"column":20},"end":{"line":175,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":175,"column":20},"end":{"line":175,"column":25},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"count","nodeId":651},"right":{"loc":{"start":{"line":175,"column":28},"end":{"line":175,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":175,"column":28},"end":{"line":175,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"map","nodeId":653},"property":{"loc":{"start":{"line":175,"column":32},"end":{"line":175,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"e","nodeId":654},"computed":true,"nodeId":652},"nodeId":650},"nodeId":649}],"nodeId":642},"alternate":null,"nodeId":636},"nodeId":616}],"nodeId":590},"nodeId":576},{"loc":{"start":{"line":178,"column":12},"end":{"line":179,"column":32},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":178,"column":16},"end":{"line":178,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"===","left":{"loc":{"start":{"line":178,"column":16},"end":{"line":178,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":178,"column":16},"end":{"line":178,"column":21},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"modes","nodeId":658},"property":{"loc":null,"type":"Identifier","name":"length","nodeId":659},"computed":false,"nodeId":657},"right":{"loc":{"start":{"line":178,"column":33},"end":{"line":178,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":1,"nodeId":660},"nodeId":656},"consequent":{"loc":{"start":{"line":179,"column":16},"end":{"line":179,"column":32},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":179,"column":16},"end":{"line":179,"column":32},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":179,"column":16},"end":{"line":179,"column":21},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"modes","nodeId":663},"right":{"loc":{"start":{"line":179,"column":24},"end":{"line":179,"column":32},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":179,"column":24},"end":{"line":179,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"modes","nodeId":665},"property":{"loc":{"start":{"line":179,"column":30},"end":{"line":179,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":0,"nodeId":666},"computed":true,"nodeId":664},"nodeId":662},"nodeId":661},"alternate":null,"nodeId":655},{"loc":{"start":{"line":180,"column":12},"end":{"line":183,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":180,"column":16},"end":{"line":180,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":668},"consequent":{"loc":{"start":{"line":181,"column":16},"end":{"line":181,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":181,"column":23},"end":{"line":181,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":181,"column":23},"end":{"line":181,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":671},"arguments":[{"loc":{"start":{"line":181,"column":32},"end":{"line":181,"column":37},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"modes","nodeId":672}],"nodeId":670},"nodeId":669},"alternate":{"loc":{"start":{"line":183,"column":16},"end":{"line":183,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":183,"column":23},"end":{"line":183,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"modes","nodeId":674},"nodeId":673},"nodeId":667}],"nodeId":562},"generator":false,"expression":false,"nodeId":560},"kind":"init","nodeId":558},{"loc":{"start":{"line":186,"column":8},"end":{"line":192,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Property","key":{"loc":{"start":{"line":186,"column":8},"end":{"line":186,"column":13},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"range","nodeId":676},"value":{"loc":{"start":{"line":186,"column":15},"end":{"line":192,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":186,"column":24},"end":{"line":186,"column":32},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":678}],"body":{"loc":{"start":{"line":186,"column":34},"end":{"line":191,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":187,"column":12},"end":{"line":187,"column":47},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":187,"column":16},"end":{"line":187,"column":47},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":187,"column":16},"end":{"line":187,"column":47},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"range","nodeId":682},"init":{"loc":{"start":{"line":187,"column":24},"end":{"line":187,"column":47},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"-","left":{"loc":{"start":{"line":187,"column":24},"end":{"line":187,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":187,"column":24},"end":{"line":187,"column":32},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":187,"column":24},"end":{"line":187,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":686},"property":{"loc":null,"type":"Identifier","name":"max","nodeId":687},"computed":false,"nodeId":685},"arguments":[],"nodeId":684},"right":{"loc":{"start":{"line":187,"column":37},"end":{"line":187,"column":47},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":187,"column":37},"end":{"line":187,"column":45},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":187,"column":37},"end":{"line":187,"column":41},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":690},"property":{"loc":null,"type":"Identifier","name":"min","nodeId":691},"computed":false,"nodeId":689},"arguments":[],"nodeId":688},"nodeId":683},"nodeId":681}],"nodeId":680},{"loc":{"start":{"line":188,"column":12},"end":{"line":191,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":188,"column":16},"end":{"line":188,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":693},"consequent":{"loc":{"start":{"line":189,"column":16},"end":{"line":189,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":189,"column":23},"end":{"line":189,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":189,"column":23},"end":{"line":189,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":696},"arguments":[{"loc":{"start":{"line":189,"column":32},"end":{"line":189,"column":37},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"range","nodeId":697}],"nodeId":695},"nodeId":694},"alternate":{"loc":{"start":{"line":191,"column":16},"end":{"line":191,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":191,"column":23},"end":{"line":191,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"range","nodeId":699},"nodeId":698},"nodeId":692}],"nodeId":679},"generator":false,"expression":false,"nodeId":677},"kind":"init","nodeId":675},{"loc":{"start":{"line":194,"column":8},"end":{"line":209,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Property","key":{"loc":{"start":{"line":194,"column":8},"end":{"line":194,"column":16},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"variance","nodeId":701},"value":{"loc":{"start":{"line":194,"column":18},"end":{"line":209,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":194,"column":27},"end":{"line":194,"column":35},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":703}],"body":{"loc":{"start":{"line":194,"column":37},"end":{"line":208,"column":32},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":195,"column":12},"end":{"line":196,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":195,"column":16},"end":{"line":195,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":195,"column":16},"end":{"line":195,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"mean","nodeId":707},"init":{"loc":{"start":{"line":195,"column":23},"end":{"line":195,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":0,"nodeId":708},"nodeId":706},{"loc":{"start":{"line":196,"column":20},"end":{"line":196,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":196,"column":20},"end":{"line":196,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"variance","nodeId":710},"init":{"loc":{"start":{"line":196,"column":31},"end":{"line":196,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":0,"nodeId":711},"nodeId":709}],"nodeId":705},{"loc":{"start":{"line":198,"column":12},"end":{"line":201,"column":79},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ForStatement","init":{"loc":{"start":{"line":198,"column":17},"end":{"line":198,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":198,"column":21},"end":{"line":198,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":198,"column":21},"end":{"line":198,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":715},"init":{"loc":{"start":{"line":198,"column":25},"end":{"line":198,"column":26},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":0,"nodeId":716},"nodeId":714}],"nodeId":713},"test":{"loc":{"start":{"line":198,"column":28},"end":{"line":198,"column":50},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"<","left":{"loc":{"start":{"line":198,"column":28},"end":{"line":198,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":718},"right":{"loc":{"start":{"line":198,"column":32},"end":{"line":198,"column":50},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":198,"column":32},"end":{"line":198,"column":43},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":198,"column":32},"end":{"line":198,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":721},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":722},"computed":false,"nodeId":720},"property":{"loc":null,"type":"Identifier","name":"length","nodeId":723},"computed":false,"nodeId":719},"nodeId":717},"update":{"loc":{"start":{"line":198,"column":52},"end":{"line":198,"column":55},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"UpdateExpression","operator":"++","argument":{"loc":{"start":{"line":198,"column":52},"end":{"line":198,"column":53},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":725},"prefix":false,"nodeId":724},"body":{"loc":{"start":{"line":198,"column":57},"end":{"line":201,"column":79},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":199,"column":16},"end":{"line":199,"column":32},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":199,"column":20},"end":{"line":199,"column":32},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":199,"column":20},"end":{"line":199,"column":32},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"_mean","nodeId":729},"init":{"loc":{"start":{"line":199,"column":28},"end":{"line":199,"column":32},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"mean","nodeId":730},"nodeId":728}],"nodeId":727},{"loc":{"start":{"line":200,"column":16},"end":{"line":200,"column":57},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":200,"column":16},"end":{"line":200,"column":57},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":200,"column":16},"end":{"line":200,"column":20},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"mean","nodeId":733},"right":{"loc":{"start":{"line":200,"column":25},"end":{"line":200,"column":57},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"/","left":{"loc":{"start":{"line":200,"column":25},"end":{"line":200,"column":47},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"-","left":{"loc":{"start":{"line":200,"column":25},"end":{"line":200,"column":39},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":200,"column":25},"end":{"line":200,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":200,"column":25},"end":{"line":200,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":738},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":739},"computed":false,"nodeId":737},"property":{"loc":{"start":{"line":200,"column":37},"end":{"line":200,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":740},"computed":true,"nodeId":736},"right":{"loc":{"start":{"line":200,"column":42},"end":{"line":200,"column":47},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"_mean","nodeId":741},"nodeId":735},"right":{"loc":{"start":{"line":200,"column":52},"end":{"line":200,"column":57},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":200,"column":52},"end":{"line":200,"column":53},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":743},"right":{"loc":{"start":{"line":200,"column":56},"end":{"line":200,"column":57},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":1,"nodeId":744},"nodeId":742},"nodeId":734},"nodeId":732},"nodeId":731},{"loc":{"start":{"line":201,"column":16},"end":{"line":201,"column":77},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":201,"column":16},"end":{"line":201,"column":77},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"AssignmentExpression","operator":"+=","left":{"loc":{"start":{"line":201,"column":16},"end":{"line":201,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"variance","nodeId":747},"right":{"loc":{"start":{"line":201,"column":29},"end":{"line":201,"column":77},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"*","left":{"loc":{"start":{"line":201,"column":29},"end":{"line":201,"column":51},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"-","left":{"loc":{"start":{"line":201,"column":29},"end":{"line":201,"column":43},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":201,"column":29},"end":{"line":201,"column":40},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":201,"column":29},"end":{"line":201,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":752},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":753},"computed":false,"nodeId":751},"property":{"loc":{"start":{"line":201,"column":41},"end":{"line":201,"column":42},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":754},"computed":true,"nodeId":750},"right":{"loc":{"start":{"line":201,"column":46},"end":{"line":201,"column":51},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"_mean","nodeId":755},"nodeId":749},"right":{"loc":{"start":{"line":201,"column":56},"end":{"line":201,"column":77},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"-","left":{"loc":{"start":{"line":201,"column":56},"end":{"line":201,"column":70},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":201,"column":56},"end":{"line":201,"column":67},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":201,"column":56},"end":{"line":201,"column":60},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":759},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":760},"computed":false,"nodeId":758},"property":{"loc":{"start":{"line":201,"column":68},"end":{"line":201,"column":69},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"i","nodeId":761},"computed":true,"nodeId":757},"right":{"loc":{"start":{"line":201,"column":73},"end":{"line":201,"column":77},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"mean","nodeId":762},"nodeId":756},"nodeId":748},"nodeId":746},"nodeId":745}],"nodeId":726},"nodeId":712},{"loc":{"start":{"line":203,"column":12},"end":{"line":203,"column":42},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":203,"column":12},"end":{"line":203,"column":42},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"AssignmentExpression","operator":"/=","left":{"loc":{"start":{"line":203,"column":12},"end":{"line":203,"column":20},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"variance","nodeId":765},"right":{"loc":{"start":{"line":203,"column":24},"end":{"line":203,"column":42},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":203,"column":24},"end":{"line":203,"column":35},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":203,"column":24},"end":{"line":203,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":768},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":769},"computed":false,"nodeId":767},"property":{"loc":null,"type":"Identifier","name":"length","nodeId":770},"computed":false,"nodeId":766},"nodeId":764},"nodeId":763},{"loc":{"start":{"line":205,"column":12},"end":{"line":208,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":205,"column":16},"end":{"line":205,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":772},"consequent":{"loc":{"start":{"line":206,"column":16},"end":{"line":206,"column":41},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":206,"column":23},"end":{"line":206,"column":41},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":206,"column":23},"end":{"line":206,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":775},"arguments":[{"loc":{"start":{"line":206,"column":32},"end":{"line":206,"column":40},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"variance","nodeId":776}],"nodeId":774},"nodeId":773},"alternate":{"loc":{"start":{"line":208,"column":16},"end":{"line":208,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":208,"column":23},"end":{"line":208,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"variance","nodeId":778},"nodeId":777},"nodeId":771}],"nodeId":704},"generator":false,"expression":false,"nodeId":702},"kind":"init","nodeId":700},{"loc":{"start":{"line":211,"column":8},"end":{"line":221,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Property","key":{"loc":{"start":{"line":211,"column":8},"end":{"line":211,"column":13},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"stdev","nodeId":780},"value":{"loc":{"start":{"line":211,"column":15},"end":{"line":221,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":211,"column":24},"end":{"line":211,"column":34},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"percentile","nodeId":782},{"loc":{"start":{"line":211,"column":36},"end":{"line":211,"column":44},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":783}],"body":{"loc":{"start":{"line":211,"column":46},"end":{"line":220,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":212,"column":12},"end":{"line":212,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":212,"column":16},"end":{"line":212,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":212,"column":16},"end":{"line":212,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"stdev","nodeId":787},"init":{"loc":{"start":{"line":212,"column":24},"end":{"line":212,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":0,"nodeId":788},"nodeId":786}],"nodeId":785},{"loc":{"start":{"line":213,"column":12},"end":{"line":216,"column":55},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":213,"column":16},"end":{"line":213,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"UnaryExpression","operator":"!","argument":{"loc":{"start":{"line":213,"column":17},"end":{"line":213,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"percentile","nodeId":791},"prefix":true,"nodeId":790},"consequent":{"loc":{"start":{"line":214,"column":16},"end":{"line":214,"column":50},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":214,"column":16},"end":{"line":214,"column":50},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":214,"column":16},"end":{"line":214,"column":21},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"stdev","nodeId":794},"right":{"loc":{"start":{"line":214,"column":24},"end":{"line":214,"column":50},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":214,"column":24},"end":{"line":214,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":214,"column":24},"end":{"line":214,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"Math","nodeId":797},"property":{"loc":null,"type":"Identifier","name":"sqrt","nodeId":798},"computed":false,"nodeId":796},"arguments":[{"loc":{"start":{"line":214,"column":34},"end":{"line":214,"column":49},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":214,"column":34},"end":{"line":214,"column":47},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":214,"column":34},"end":{"line":214,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":801},"property":{"loc":null,"type":"Identifier","name":"variance","nodeId":802},"computed":false,"nodeId":800},"arguments":[],"nodeId":799}],"nodeId":795},"nodeId":793},"nodeId":792},"alternate":{"loc":{"start":{"line":216,"column":16},"end":{"line":216,"column":55},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":216,"column":23},"end":{"line":216,"column":55},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":216,"column":23},"end":{"line":216,"column":53},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":216,"column":23},"end":{"line":216,"column":47},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":216,"column":23},"end":{"line":216,"column":35},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":216,"column":23},"end":{"line":216,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":808},"property":{"loc":null,"type":"Identifier","name":"density","nodeId":809},"computed":false,"nodeId":807},"arguments":[{"loc":{"start":{"line":216,"column":36},"end":{"line":216,"column":46},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"percentile","nodeId":810}],"nodeId":806},"property":{"loc":null,"type":"Identifier","name":"stdev","nodeId":811},"computed":false,"nodeId":805},"arguments":[],"nodeId":804},"nodeId":803},"nodeId":789},{"loc":{"start":{"line":217,"column":12},"end":{"line":220,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":217,"column":16},"end":{"line":217,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":813},"consequent":{"loc":{"start":{"line":218,"column":16},"end":{"line":218,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":218,"column":23},"end":{"line":218,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":218,"column":23},"end":{"line":218,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":816},"arguments":[{"loc":{"start":{"line":218,"column":32},"end":{"line":218,"column":37},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"stdev","nodeId":817}],"nodeId":815},"nodeId":814},"alternate":{"loc":{"start":{"line":220,"column":16},"end":{"line":220,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":220,"column":23},"end":{"line":220,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"stdev","nodeId":819},"nodeId":818},"nodeId":812}],"nodeId":784},"generator":false,"expression":false,"nodeId":781},"kind":"init","nodeId":779},{"loc":{"start":{"line":223,"column":8},"end":{"line":234,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Property","key":{"loc":{"start":{"line":223,"column":8},"end":{"line":223,"column":17},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"frequency","nodeId":821},"value":{"loc":{"start":{"line":223,"column":19},"end":{"line":234,"column":9},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"FunctionExpression","id":null,"params":[{"loc":{"start":{"line":223,"column":28},"end":{"line":223,"column":35},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"element","nodeId":823},{"loc":{"start":{"line":223,"column":37},"end":{"line":223,"column":45},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":824}],"body":{"loc":{"start":{"line":223,"column":47},"end":{"line":233,"column":28},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":224,"column":12},"end":{"line":224,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":224,"column":16},"end":{"line":224,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":224,"column":16},"end":{"line":224,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"freq","nodeId":828},"init":{"loc":{"start":{"line":224,"column":23},"end":{"line":224,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":0,"nodeId":829},"nodeId":827}],"nodeId":826},{"loc":{"start":{"line":225,"column":12},"end":{"line":228,"column":95},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":225,"column":16},"end":{"line":225,"column":51},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"!==","left":{"loc":{"start":{"line":225,"column":16},"end":{"line":225,"column":44},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":225,"column":16},"end":{"line":225,"column":35},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":225,"column":16},"end":{"line":225,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":225,"column":16},"end":{"line":225,"column":20},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":835},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":836},"computed":false,"nodeId":834},"property":{"loc":null,"type":"Identifier","name":"indexOf","nodeId":837},"computed":false,"nodeId":833},"arguments":[{"loc":{"start":{"line":225,"column":36},"end":{"line":225,"column":43},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"element","nodeId":838}],"nodeId":832},"right":{"loc":{"start":{"line":225,"column":49},"end":{"line":225,"column":51},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"UnaryExpression","operator":"-","argument":{"loc":{"start":{"line":225,"column":50},"end":{"line":225,"column":51},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":1,"nodeId":840},"prefix":true,"nodeId":839},"nodeId":831},"consequent":{"loc":{"start":{"line":225,"column":53},"end":{"line":228,"column":95},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BlockStatement","body":[{"loc":{"start":{"line":226,"column":16},"end":{"line":226,"column":40},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclaration","kind":"var","declarations":[{"loc":{"start":{"line":226,"column":20},"end":{"line":226,"column":40},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"VariableDeclarator","id":{"loc":{"start":{"line":226,"column":20},"end":{"line":226,"column":40},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"buffer","nodeId":844},"init":{"loc":{"start":{"line":226,"column":29},"end":{"line":226,"column":40},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":226,"column":29},"end":{"line":226,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":226,"column":29},"end":{"line":226,"column":33},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ThisExpression","nodeId":847},"property":{"loc":null,"type":"Identifier","name":"copy","nodeId":848},"computed":false,"nodeId":846},"arguments":[],"nodeId":845},"nodeId":843}],"nodeId":842},{"loc":{"start":{"line":227,"column":16},"end":{"line":227,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":227,"column":16},"end":{"line":227,"column":38},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":227,"column":16},"end":{"line":227,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":227,"column":16},"end":{"line":227,"column":22},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"buffer","nodeId":852},"property":{"loc":null,"type":"Identifier","name":"sortAscending","nodeId":853},"computed":false,"nodeId":851},"arguments":[],"nodeId":850},"nodeId":849},{"loc":{"start":{"line":228,"column":16},"end":{"line":228,"column":94},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ExpressionStatement","expression":{"loc":{"start":{"line":228,"column":16},"end":{"line":228,"column":94},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"AssignmentExpression","operator":"=","left":{"loc":{"start":{"line":228,"column":16},"end":{"line":228,"column":20},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"freq","nodeId":856},"right":{"loc":{"start":{"line":228,"column":23},"end":{"line":228,"column":94},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"+","left":{"loc":{"start":{"line":228,"column":23},"end":{"line":228,"column":90},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"BinaryExpression","operator":"-","left":{"loc":{"start":{"line":228,"column":23},"end":{"line":228,"column":57},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":228,"column":23},"end":{"line":228,"column":48},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":228,"column":23},"end":{"line":228,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":228,"column":23},"end":{"line":228,"column":29},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"buffer","nodeId":862},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":863},"computed":false,"nodeId":861},"property":{"loc":null,"type":"Identifier","name":"lastIndexOf","nodeId":864},"computed":false,"nodeId":860},"arguments":[{"loc":{"start":{"line":228,"column":49},"end":{"line":228,"column":56},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"element","nodeId":865}],"nodeId":859},"right":{"loc":{"start":{"line":228,"column":60},"end":{"line":228,"column":90},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":228,"column":60},"end":{"line":228,"column":81},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":228,"column":60},"end":{"line":228,"column":73},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"MemberExpression","object":{"loc":{"start":{"line":228,"column":60},"end":{"line":228,"column":66},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"buffer","nodeId":869},"property":{"loc":null,"type":"Identifier","name":"vector","nodeId":870},"computed":false,"nodeId":868},"property":{"loc":null,"type":"Identifier","name":"indexOf","nodeId":871},"computed":false,"nodeId":867},"arguments":[{"loc":{"start":{"line":228,"column":82},"end":{"line":228,"column":89},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"element","nodeId":872}],"nodeId":866},"nodeId":858},"right":{"loc":{"start":{"line":228,"column":93},"end":{"line":228,"column":94},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Literal","value":1,"nodeId":873},"nodeId":857},"nodeId":855},"nodeId":854}],"nodeId":841},"alternate":null,"nodeId":830},{"loc":{"start":{"line":230,"column":12},"end":{"line":233,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"IfStatement","test":{"loc":{"start":{"line":230,"column":16},"end":{"line":230,"column":24},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":875},"consequent":{"loc":{"start":{"line":231,"column":16},"end":{"line":231,"column":37},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":231,"column":23},"end":{"line":231,"column":37},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"CallExpression","callee":{"loc":{"start":{"line":231,"column":23},"end":{"line":231,"column":31},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"callback","nodeId":878},"arguments":[{"loc":{"start":{"line":231,"column":32},"end":{"line":231,"column":36},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"freq","nodeId":879}],"nodeId":877},"nodeId":876},"alternate":{"loc":{"start":{"line":233,"column":16},"end":{"line":233,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"ReturnStatement","argument":{"loc":{"start":{"line":233,"column":23},"end":{"line":233,"column":27},"source":"file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html"},"type":"Identifier","name":"freq","nodeId":881},"nodeId":880},"nodeId":874}],"nodeId":825},"generator":false,"expression":false,"nodeId":822},"kind":"init","nodeId":820}],"nodeId":90},"nodeId":86},"nodeId":85}]}}},{"type":"textNode","attributes":[],"childNodes":[],"nodeId":882,"textContent":"\n\n"}],"nodeId":883}],"nodeId":884}}
    }
);

var Firecrow = {};

Firecrow.ValueTypeHelper =
{
    isOfType: function (variable, className)
    {
        return variable instanceof className;
    },

    isNull: function (variable)
    {
        return variable === null;
    },

    isString: function (variable)
    {
        if (this.isNull(variable)) { return false; }

        return (typeof variable) == "string" || variable instanceof String;
    },

    isNumber: function(variable)
    {
        if (this.isNull(variable)) { return false; }

        return (typeof variable) == "number";
    },

    isArray: function (arrayOfElements)
    {
        if (this.isNull(arrayOfElements)) { return false; }

        return (typeof arrayOfElements) == "array" || arrayOfElements instanceof Array;
    },

    isObject: function(potentialObject)
    {
        if(potentialObject == null) { return false; }

        return 'object' == typeof potentialObject;
    },

    pushAll: function(baseArray, arrayWithItems)
    {
        try
        {
            baseArray.push.apply(baseArray, arrayWithItems);
        }
        catch(e) { console.log("Error while pushing all in ValueTypeHelper:" + e); }
    }
}

var ValueTypeHelper = Firecrow.ValueTypeHelper;

Firecrow.ASTHelper =
{
    parseSourceCodeToAST: function(sourceCode, sourceCodePath, startLine)
    {
        try
        {
            Components.utils.import("resource://gre/modules/reflect.jsm");

            return Reflect.parse
            (
                sourceCode,
                { loc:true, source: sourceCodePath, line: startLine }
            );
        }
        catch(e) { console.log("Error while getting AST from source code@" + sourceCodePath + "; error: " + sourceCodePath); }
    },

    setParentsChildRelationships: function(rootElement)
    {
        try
        {
            if(rootElement == null || rootElement.parentChildRelationshipsHaveBeenSet) { return; }

            var ASTHelper = Firecrow.ASTHelper;
            this.traverseAst(rootElement, function(currentElement, propertyName, parentElement)
            {
                if(currentElement != null)
                {
                    currentElement.parent = parentElement;
                }

                if(parentElement != null)
                {
                    if(parentElement.children == null) { parentElement.children = []; }

                    if(currentElement != null)
                    {
                        currentElement.indexInParent = parentElement.children.length;

                        if(ASTHelper.getFunctionParent(currentElement) != null)
                        {
                            for(var i = parentElement.children.length - 1; i >= 0; i--)
                            {
                                var child = parentElement.children[i];

                                if((ASTHelper.isLoopStatement(child) || ASTHelper.isIfStatement(child)))
                                {
                                    currentElement.previousCondition = child.test;
                                    break;
                                }
                            }

                            if(ASTHelper.isStatement(parentElement) && currentElement.previousCondition == null)
                            {
                                currentElement.previousCondition = parentElement.previousCondition;
                            }
                        }

                        parentElement.children.push(currentElement);
                    }
                }
            });

            rootElement.parentChildRelationshipsHaveBeenSet = true;
        }
        catch(e) { console.log("Error when setting parent-child relationships:" + e); }
    },

    isAncestor: function(firstNode, secondNode)
    {
        var ancestor = firstNode;

        while(ancestor != null)
        {
            if(secondNode == ancestor) { return true; }
            ancestor = ancestor.parent;
        }

        return false;
    },

    getTypeExpressionsFromProgram: function(program, types)
    {
        try
        {
            var result = {};

            var traverserFunction = function(elementValue, elementName, parentObject)
            {
                types.forEach(function(type)
                {
                    if(elementName === "type" &&  elementValue === type)
                    {
                        if(result[type] == null) { result[type] = []; }

                        result[type].push(parentObject);
                    }
                });
            };

            this.traverseAst(program, traverserFunction);

            return result;
        }
        catch(e) { console.log("Error while getting type expressions from program in ASTHelper: " + e);}
    },

    traverseAst: function(astElement, processElementFunction)
    {
        try
        {
            if(!(ValueTypeHelper.isObject(astElement))) { return; }

            for(var propName in astElement)
            {
                //Do not traverse the source code location properties and parents and graphNodes!
                if(propName == "loc"
                    || propName == "parent"
                    || propName == "graphNode"
                    || propName == "children"
                    || propName == "domElement"
                    || propName == "graphNode"
                    || propName == "htmlNode"
                    || propName == "attributes"
                    || propName == "previousCondition"
                    || propName == "includesNodes"
                    || propName == "includedByNodes"
                    || propName == "type") { continue; }

                var propertyValue = astElement[propName];

                if(propertyValue == null) { continue; }

                if(ValueTypeHelper.isArray(propertyValue))
                {
                    for(var i = 0; i < propertyValue.length; i++)
                    {
                        if(ValueTypeHelper.isObject(propertyValue[i]))
                        {
                            processElementFunction(propertyValue[i], propName, astElement, i);
                            this.traverseAst(propertyValue[i], processElementFunction);
                        }
                    }
                }
                else if (ValueTypeHelper.isObject(propertyValue))
                {
                    processElementFunction(propertyValue, propName, astElement);
                    this.traverseAst(propertyValue, processElementFunction);
                }
            }
        }
        catch(e)
        {
            console.log("Error while traversing AST in ASTHelper: " + e);
        }
    },

    traverseDirectSourceElements: function(astElement, processSourceElementFunction, enterBranchAndLoops)
    {
        try
        {
            if((this.isStatement(astElement)
                || this.isFunctionDeclaration(astElement)
                || this.isVariableDeclaration(astElement))
               && !this.isBlockStatement(astElement))
            {
                processSourceElementFunction(astElement);
            }

            if(this.isProgram(astElement)
                || this.isBlockStatement(astElement))
            {
                this.traverseArrayOfDirectStatements(astElement.body, astElement, processSourceElementFunction, enterBranchAndLoops);
            }
            else if (this.isIfStatement(astElement))
            {
                if(enterBranchAndLoops)
                {
                    this.traverseDirectSourceElements(astElement.consequent, processSourceElementFunction, enterBranchAndLoops);

                    if(astElement.alternate != null)
                    {
                        this.traverseDirectSourceElements(astElement.alternate, processSourceElementFunction, enterBranchAndLoops);
                    }
                }
            }
            else if (this.isLabeledStatement(astElement)
                || this.isLetStatement(astElement))
            {
                this.traverseDirectSourceElements(astElement.body, processSourceElementFunction, enterBranchAndLoops);
            }
            else if (this.isLoopStatement(astElement)
                || this.isWithStatement(astElement))
            {
                if(enterBranchAndLoops)
                {
                    this.traverseDirectSourceElements(astElement.body, processSourceElementFunction, enterBranchAndLoops);
                }
            }
            else if (this.isSwitchStatement(astElement))
            {
                if(enterBranchAndLoops)
                {
                    astElement.cases.forEach(function(switchCase)
                    {
                        this.traverseArrayOfDirectStatements
                            (
                                switchCase.consequent,
                                astElement,
                                processSourceElementFunction,
                                enterBranchAndLoops
                            );
                    }, this);
                }
            }
            else if(this.isTryStatement(astElement))
            {
                if(enterBranchAndLoops)
                {
                    this.traverseDirectSourceElements(astElement.block, processSourceElementFunction, enterBranchAndLoops);

                    astElement.handlers.forEach(function(catchClause)
                    {
                        this.traverseDirectSourceElements(catchClause.body, processSourceElementFunction, enterBranchAndLoops);
                    }, this);
                }

                if(astElement.finalizer != null)
                {
                    this.traverseDirectSourceElements(astElement.finalizer, processSourceElementFunction, enterBranchAndLoops);
                }
            }
            else if (this.isBreakStatement(astElement)
                || this.isContinueStatement(astElement)
                || this.isReturnStatement(astElement)
                || this.isThrowStatement(astElement)
                || this.isDebuggerStatement(astElement)) { }
        }
        catch(e) { console.log("Error while traversing direct source elements in ASTHelper: " + e); }
    },

    traverseArrayOfDirectStatements: function(statements, parentElement, processSourceElementFunction, enterBranchAndLoops)
    {
        try
        {
            statements.forEach(function(statement)
            {
                this.traverseDirectSourceElements(statement, processSourceElementFunction, enterBranchAndLoops);
            }, this);
        }
        catch(e) { console.log("Error while traversing direct statements: " + e + " for " + JSON.stringify(parentElement));}
    },

    getParentOfTypes: function(codeConstruct, types)
    {
        var parent = codeConstruct.parent;

        while(parent != null)
        {
            for(var i = 0; i < types.length; i++)
            {
                if(parent.type === types[i]) { return parent; }
            }

            parent = parent.parent;
        }

        return parent;
    },

    isForStatementInit: function(codeConstruct)
    {
        if(codeConstruct == null) { return false; }

        var loopParent = this.getLoopParent(codeConstruct);

        if(loopParent == null) { return false; }

        if(this.isForStatement(loopParent)) { return loopParent.init == codeConstruct;}
        else if (this.isForInStatement(loopParent)) { return loopParent.left == codeConstruct; }

        return false;
    },

    isForStatementTest: function(codeConstruct)
    {
        if(codeConstruct == null) { return false; }

        var loopParent = this.getLoopParent(codeConstruct);

        if(loopParent == null) { return false; }

        if(this.isForStatement(loopParent)) { return loopParent.test == codeConstruct;}

        return false;
    },

    isElseIfStatement: function(codeConstruct)
    {
        if(!this.isIfStatement(codeConstruct)){ return false; }

        return this.isIfStatement(codeConstruct.parent) && codeConstruct.parent.alternate == codeConstruct;
    },

    isObjectExpressionPropertyValue: function(element)
    {
        if(element == null) { return false; }

        return this.isElementOfType(element, this.CONST.Property);
    },

    isFunctionExpressionBlockAsObjectProperty: function(element)
    {
        if(element == null) { return false; }
        if(element.parent == null) { return false; }

        return this.isFunctionExpression(element.parent) && this.isElementOfType(element.parent.parent, this.CONST.Property);
    },

    isCallExpressionCallee: function(element)
    {
        if(element == null) { return false; }

        return this.isCallExpression(element.parent) && element.parent.callee == element;
    },

    isLastPropertyInLeftHandAssignment: function(element)
    {
        if(element == null) { return false; }

        return this.isMemberExpression(element.parent) && this.isAssignmentExpression(element.parent.parent)
             && element.parent.parent.left == element.parent && element.parent.parent.operator.length == 1;
    },

    getLastLoopOrBranchingConditionInFunctionBody: function(element)
    {
        if(!this.isFunction(element)){ return null; }

        var firstLevelStatements = element.body.body;

        for(var i = firstLevelStatements.length - 1; i >= 0; i--)
        {
            var statement = firstLevelStatements[i];
            if(this.isIfStatement(statement) || this.isLoopStatement(statement)){ return statement.test; }
            else if (this.isWithStatement(statement)) { return statement.object; }
            else if (this.isForInStatement(statement)) { return statement.right; }
        }

        return null;
    },

    containsCallOrUpdateOrAssignmentExpression: function(element)
    {
        if(element == null) { return false; }

        if(this.isCallExpression(element) || this.isUpdateExpression(element) || this.isAssignmentExpression(element)) { return true;}

        if(element.containsCallOrUpdateOrAssignmentExpression === true
        || element.containsCallOrUpdateOrAssignmentExpression === false)
        {
            return element.containsCallOrUpdateOrAssignmentExpression;
        }

        var containsCallOrUpdateOrAssignmentExpression = false;

        var ASTHelper = Firecrow.ASTHelper;

        this.traverseAst(element, function(currentElement)
        {
            if(ASTHelper.isCallExpression(currentElement)
            || ASTHelper.isAssignmentExpression(currentElement)
            || ASTHelper.isUpdateExpression(currentElement))
            {
                containsCallOrUpdateOrAssignmentExpression = true;
            }
        });

        element.containsCallOrUpdateOrAssignmentExpression = containsCallOrUpdateOrAssignmentExpression;

        return containsCallOrUpdateOrAssignmentExpression;
    },

    isFunctionParameter: function(element)
    {
        if(!this.isIdentifier(element)){ return false; }
        if(!this.isFunction(element.parent)) { return false;}

        var functionParent = element.parent;
        var params = functionParent.params;

        for(var i = 0; i < params.length; i++)
        {
            if(params[i] ==  element) { return true;}
        }

        return false;
    },

    getFunctionParent: function(codeConstruct)
    {
        return this.getParentOfTypes
        (
            codeConstruct,
            [
                this.CONST.FunctionDeclaration,
                this.CONST.EXPRESSION.FunctionExpression
            ]
        );
    },

    getLoopOrSwitchParent: function(codeConstruct)
    {
        return this.getParentOfTypes
        (
            codeConstruct,
            [
                this.CONST.STATEMENT.ForStatement,
                this.CONST.STATEMENT.ForInStatement,
                this.CONST.STATEMENT.WhileStatement,
                this.CONST.STATEMENT.DoWhileStatement,
                this.CONST.STATEMENT.SwitchStatement
            ]
        );
    },

    getLoopParent: function(codeConstruct)
    {
        return this.getParentOfTypes
        (
            codeConstruct,
            [
                this.CONST.STATEMENT.ForStatement,
                this.CONST.STATEMENT.ForInStatement,
                this.CONST.STATEMENT.WhileStatement,
                this.CONST.STATEMENT.DoWhileStatement
            ]
        );
    },

    getSwitchParent: function(codeConstruct)
    {
        return this.getParentOfTypes
        (
            codeConstruct,
            [ this.CONST.STATEMENT.SwitchStatement ]
        );
    },

    isElementOfType: function(element, type)
    {
        if(element == null) { return false; }

        return element.type === type;
    },

    isExpression: function(element)
    {
        return element != null ? this.CONST.EXPRESSION[element.type] != null
            : false;
    },

    isProgram: function(element) { return this.isElementOfType(element, this.CONST.Program); },
    isFunction: function(element) { return this.isFunctionDeclaration(element) || this.isFunctionExpression(element); },
    isFunctionDeclaration: function(element) { return this.isElementOfType(element, this.CONST.FunctionDeclaration); },
    isVariableDeclaration: function(element) { return this.isElementOfType(element, this.CONST.VariableDeclaration); },
    isVariableDeclarator: function(element) { return this.isElementOfType(element, this.CONST.VariableDeclarator); },
    isSwitchCase: function(element) { return this.isElementOfType(element, this.CONST.SwitchCase); },
    isCatchClause: function(element) { return this.isElementOfType(element, this.CONST.CatchClause); },
    isIdentifier: function(element) { return this.isElementOfType(element, this.CONST.Identifier); },
    isLiteral: function(element) { return this.isElementOfType(element, this.CONST.Literal); },

    isStatement: function(element)
    {
        return element != null ? this.CONST.STATEMENT[element.type] != null
            : false;
    },
    isEmptyStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.EmptyStatement); },
    isBlockStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.BlockStatement); },
    isExpressionStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.ExpressionStatement); },
    isIfStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.IfStatement); },
    isLabeledStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.LabeledStatement); },
    isBreakStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.BreakStatement); },
    isContinueStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.ContinueStatement); },
    isWithStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.WithStatement); },
    isSwitchStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.SwitchStatement); },
    isReturnStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.ReturnStatement); },
    isThrowStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.ThrowStatement); },
    isTryStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.TryStatement); },

    isLoopStatement: function(element)
    {
        return this.isWhileStatement(element)
            || this.isDoWhileStatement(element)
            || this.isForStatement(element)
            || this.isForInStatement(element);
    },

    isLoopStatementCondition: function(element)
    {
        return this.isLoopStatement(element.parent) && element.parent.test == element;
    },

    isWhileStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.WhileStatement); },
    isDoWhileStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.DoWhileStatement); },
    isForStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.ForStatement); },
    isForInStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.ForInStatement); },
    isLetStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.LetStatement); },
    isDebuggerStatement: function(element) { return this.isElementOfType(element, this.CONST.STATEMENT.DebuggerStatement); },

    isThisExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.ThisExpression); },
    isArrayExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.ArrayExpression); },
    isObjectExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.ObjectExpression); },
    isFunctionExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.FunctionExpression); },
    isSequenceExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.SequenceExpression); },
    isUnaryExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.UnaryExpression); },
    isBinaryExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.BinaryExpression); },
    isAssignmentExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.AssignmentExpression); },
    isUpdateExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.UpdateExpression); },
    isLogicalExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.LogicalExpression); },
    isConditionalExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.ConditionalExpression); },
    isNewExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.NewExpression); },
    isCallExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.CallExpression); },
    isMemberExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.MemberExpression); },
    isYieldExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.YieldExpression); },
    isComprehensionExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.ComprehensionExpression); },
    isGeneratorExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.GeneratorExpression); },
    isLetExpression: function(element) { return this.isElementOfType(element, this.CONST.EXPRESSION.LetExpression); },

    isUnaryOperator: function(element) { return this.isElementOfType(element, this.CONST.OPERATOR.UnaryOperator); },
    isBinaryOperator: function(element) { return this.isElementOfType(element, this.CONST.OPERATOR.BinaryOperator); },
    isAssignmentOperator: function(element) { return this.isElementOfType(element, this.CONST.OPERATOR.AssignmentOperator); },
    isUpdateOperator: function(element) { return this.isElementOfType(element, this.CONST.OPERATOR.UpdateOperator); },
    isLogicalOperator: function(element) { return this.isElementOfType(element, this.CONST.OPERATOR.LogicalOperator); },

    isUnaryMathOperator: function(operator)
    {
        return operator == "-" || operator == "+";
    },

    isUnaryLogicalOperator: function(operator)
    {
        return operator == "!";
    },

    isUnaryBitOperator: function(operator)
    {
        return operator == "~";
    },

    isUnaryObjectOperator: function(operator)
    {
        return operator == "typeof" || operator == "void"
            || operator == "delete";
    },

    isBinaryEqualityOperator:function (element)
    {
        return element == "==" || element == "==="
            || element == "!=" || element == "!==";
    },

    isBinaryMathOperator:function (element)
    {
        return element == "+" || element == "-"
            || element == "*" || element == "/" || element == "%";
    },

    isBinaryRelationalOperator:function (element)
    {
        return element == "<" || element == "<="
            || element == ">" || element == ">=";
    },

    isBinaryBitOperator:function (element)
    {
        return element == "|" || element == "&"
            || element == "^"
            || element == "<<" || element == ">>"
            || element == ">>>";
    },

    isBinaryObjectOperator:function (element)
    {
        return element == "in" || element == "instanceof";
    },

    isBinaryXmlOperator:function (element)
    {
        return element == "..";
    },

    CONST :
    {
        Program: "Program",
        FunctionDeclaration: "FunctionDeclaration",
        VariableDeclaration: "VariableDeclaration",
        VariableDeclarator: "VariableDeclarator",
        SwitchCase: "SwitchCase",
        CatchClause: "CatchClause",
        Identifier: "Identifier",
        Literal: "Literal",
        Property: "Property",
        STATEMENT:
        {
            EmptyStatement: "EmptyStatement",
            BlockStatement: "BlockStatement",
            ExpressionStatement : "ExpressionStatement",
            IfStatement: "IfStatement",
            LabeledStatement: "LabeledStatement",
            BreakStatement: "BreakStatement",
            ContinueStatement: "ContinueStatement",
            WithStatement: "WithStatement",
            SwitchStatement: "SwitchStatement",
            ReturnStatement: "ReturnStatement",
            ThrowStatement: "ThrowStatement",
            TryStatement: "TryStatement",
            WhileStatement: "WhileStatement",
            DoWhileStatement: "DoWhileStatement",
            ForStatement: "ForStatement",
            ForInStatement: "ForInStatement",
            LetStatement: "LetStatement",
            DebuggerStatement: "DebuggerStatement"
        },
        EXPRESSION:
        {
            ThisExpression : "ThisExpression",
            ArrayExpression: "ArrayExpression",
            ObjectExpression: "ObjectExpression",
            FunctionExpression: "FunctionExpression",
            SequenceExpression: "SequenceExpression",
            UnaryExpression: "UnaryExpression",
            BinaryExpression: "BinaryExpression",
            AssignmentExpression: "AssignmentExpression",
            UpdateExpression: "UpdateExpression",
            LogicalExpression: "LogicalExpression",
            ConditionalExpression: "ConditionalExpression",
            NewExpression: "NewExpression",
            CallExpression: "CallExpression",
            MemberExpression: "MemberExpression",
            YieldExpression: "YieldExpression",
            ComprehensionExpression: "ComprehensionExpression",
            GeneratorExpression: "GeneratorExpression",
            LetExpression: "LetExpression"
        },
        OPERATOR:
        {
            UnaryOperator : "UnaryOperator",
            BinaryOperator: "BinaryOperator",
            AssignmentOperator: "AssignmentOperator",
            UpdateOperator: "UpdateOperator",
            LogicalOperator: "LogicalOperator"
        }
    }
};

Firecrow.CloneDetector =
{
    getClones: function(pageModel)
    {
        Firecrow.ASTHelper.setParentsChildRelationships(pageModel);

        Firecrow.CloneDetector.VectorGenerator.generateFromPageModel(pageModel);

        return Firecrow.CloneDetector.NodeCombinationsGenerator.getPotentialCandidates
        (
            Firecrow.CloneDetector.NodeCombinationsGenerator.groupCombinationsByTokenNum
            (
                Firecrow.CloneDetector.NodeCombinationsGenerator.generateCombinations
                (
                    Firecrow.CloneDetector.NodeCombinationsGenerator.generateAllMergeCombinations(pageModel)
                )
            ),
            0.07,
            0.99
        );
    },

    asyncGetClones: function(pageModel, finishedCallbackFunction, messageCallbackFunction)
    {
        Firecrow.ASTHelper.setParentsChildRelationships(pageModel);

        setTimeout(function()
        {
            messageCallbackFunction("Has set parent child relationships!");
            Firecrow.CloneDetector.VectorGenerator.generateFromPageModel(pageModel);
            messageCallbackFunction("Has generated characteristic vectors!");

            setTimeout(function()
            {
                Firecrow.CloneDetector.NodeCombinationsGenerator.asyncGenerateAllMergeCombinations(pageModel, function(mergeCombinations)
                {
                    setTimeout(function()
                    {
                        var combinations = Firecrow.CloneDetector.NodeCombinationsGenerator.generateCombinations(mergeCombinations);
                        messageCallbackFunction("Has generated combinations!");

                        setTimeout(function()
                        {
                            var groupedCombinations = Firecrow.CloneDetector.NodeCombinationsGenerator.groupCombinationsByTokenNum(combinations);
                            messageCallbackFunction("Has grouped combinations!");

                            setTimeout(function()
                            {
                                Firecrow.CloneDetector.NodeCombinationsGenerator.asyncProcessPotentialCandidates(groupedCombinations, 0.04, 0.99, finishedCallbackFunction, messageCallbackFunction);
                            }, 50);
                        }, 50);
                    }, 50);
                }, messageCallbackFunction);
            }, 50);
        }, 50);
    },

    notifyError: function(message) { console.log(message); }
};

Firecrow.CloneDetector.CombinationsGenerator =
{
    cache: {},
    generateCombinations: function(endNumber, classNumber)
    {
        var Combination = function (n, k, set)
        {
            if (typeof Combination._initialized == "undefined")
            {
                Combination.choose = function(n, k)
                {
                    if (n < 0 || k < 0) { return -1; }
                    if (n < k) { return 0; }
                    if (n == k) { return 1; }

                    var delta;
                    var iMax;
                    var ans;

                    if (k < n - k) {   delta = n - k; iMax = k;}
                    else {  delta = k; iMax = n - k; }

                    ans = delta + 1;

                    for (var i = 2; i <= iMax; ++i)
                    {
                        ans *= (delta + i) / i;
                    }

                    return ans;
                }
            }
            //"private" instance variables
            this._n = n;
            this._k = k;
            this._set = set.sort(function(a,b) { return a - b; });
            this._numCombinations = Combination.choose(this._n, this._k);

            if (typeof Combination._initialized == "undefined")
            {
                // return largest value v where v < a and  Choose(v,b) <= x
                Combination._getLargestV = function(a, b, x)
                {
                    var v = a - 1;

                    while (Combination.choose(v, b) > x)   { --v; }

                    return v >= 0 ? v : 0;
                }

                //tgd original
                Combination.prototype.getIndex = function(set)
                {
                    var retVal = 0;
                    var tempIdxArr = [];
                    var tempIdx = 0;

                    set = set.sort(function(a,b) { return a - b; });

                    for (var i = 0; i < this._set.length && tempIdx != this._k; ++i)
                    {
                        if (set[tempIdx] == this._set[i])
                        {
                            tempIdxArr[tempIdx++] = i;
                        }
                    }

                    for (var i = 0; i < this._k; ++i)
                    {
                        tempIdxArr[i] = this._n - 1 - tempIdxArr[i];
                    }

                    for (var i = 0; i < this._k; ++i)
                    {
                        retVal += Combination.choose(tempIdxArr[i], this._k - i);
                    }

                    return this._numCombinations - 1 - retVal;
                }

                //ported from msdn
                Combination.prototype.element = function(m)
                {
                    var retVal = [];  //the mth lexicographic combination
                    var ans = [];  //used to calc the indexes into this._set
                    var a = this._n;
                    var b = this._k;
                    var x = this._numCombinations - 1 - m;  // x is the "dual" of m

                    for (var i = 0; i < this._k; ++i)
                    {
                        ans[i] = Combination._getLargestV(a, b, x);  // largest value v, where v < a and vCb < x
                        x -= Combination.choose(ans[i], b);
                        a = ans[i];
                        b -= 1;
                    }

                    for (var i = 0; i < this._k; ++i)
                    {
                        ans[i] = (n - 1) - ans[i];
                    }

                    for (var i = 0; i < this._k; ++i)
                    {
                        retVal[i] = this._set[ans[i]];
                    }

                    return retVal;
                }

                Combination.prototype.toString = function()
                {
                    return this._set.join();
                }

                Combination._initialized = true;
            }
        }

        var set = [];
        var id = endNumber + "-" + classNumber;

        if(this.cache[id] != null) { return this.cache[id]; }

        for(i = 0; i < endNumber; i++)
        {
            set.push(i);
        }

        var a = new Combination(endNumber, classNumber, set);
        var allCombinations = [];

        for(var i = 0; i < a._numCombinations; i++)
        {
            allCombinations.push(a.element(i));
        }

        this.cache[id] = allCombinations;

        return allCombinations;
    }
};

var ValueTypeHelper = Firecrow.ValueTypeHelper;
var fcCloneDetector = Firecrow.CloneDetector;

fcCloneDetector.CharacteristicVector = function() { };

fcCloneDetector.CharacteristicVector.sum = function(characteristicVector)
{
    if(characteristicVector == null ) { this.notifyError("CharacteristicVector can not be null in sum"); return; }
    if(!(characteristicVector instanceof fcCloneDetector.CharacteristicVector)) { this.notifyError("Arguments are not CharacteristicVector in calculate similarity"); return; }

    var sum = 0;

    for(var propertyName in characteristicVector) { sum += characteristicVector[propertyName]; }

    return sum;
}

fcCloneDetector.CharacteristicVector.join = function(firstCharacteristicVector, secondCharacteristicVector)
{
    if(firstCharacteristicVector == null || secondCharacteristicVector == null) { console.log("CharacteristicVector can not be null in join"); return; }
    if(!(firstCharacteristicVector instanceof fcCloneDetector.CharacteristicVector) || !(secondCharacteristicVector instanceof fcCloneDetector.CharacteristicVector)) { console.log("Arguments are not CharacteristicVector in join"); return; }

    var processedProperties = { };

    for(var propName in firstCharacteristicVector)
    {
        processedProperties[propName] = true;

        firstCharacteristicVector[propName] += (secondCharacteristicVector[propName] || 0);
    }

    for(var propName in secondCharacteristicVector)
    {
        if(processedProperties[propName] == true) { continue; }

        firstCharacteristicVector[propName] = secondCharacteristicVector[propName];
    }

    return firstCharacteristicVector;
};

fcCloneDetector.CharacteristicVector.calculateSimilarity = function(firstCharacteristicVector, secondCharacteristicVector)
{
    if(firstCharacteristicVector == null || secondCharacteristicVector == null) { console.log("CharacteristicVector can not be null in calculate similarity"); return; }
    if(!(firstCharacteristicVector instanceof fcCloneDetector.CharacteristicVector) || !(secondCharacteristicVector instanceof fcCloneDetector.CharacteristicVector)) { console.log("Arguments are not CharacteristicVector in calculate similarity"); return; }

    var H = 0;
    var R = 0;
    var L = 0;

    var processedProperties = { };

    for(var propertyName in firstCharacteristicVector)
    {
        processedProperties[propertyName] = true;

        var currentVectorValue = firstCharacteristicVector[propertyName];
        var targetVectorValue = secondCharacteristicVector[propertyName] || 0;

        if (currentVectorValue == targetVectorValue && currentVectorValue != 0 && targetVectorValue != 0) { H += currentVectorValue; }
        else if (currentVectorValue > targetVectorValue) { L += currentVectorValue - targetVectorValue; }
        else if(currentVectorValue < targetVectorValue) { R += targetVectorValue - currentVectorValue; }
    }

    for(var propertyName in secondCharacteristicVector)
    {
        if(processedProperties[propertyName]) { continue; }

        var currentVectorValue = 0;
        var targetVectorValue = secondCharacteristicVector[propertyName];

        if (currentVectorValue == targetVectorValue && currentVectorValue != 0 && targetVectorValue != 0) { H += this[propertyName]; }
        else if (currentVectorValue > targetVectorValue) { L += currentVectorValue - targetVectorValue; }
        else if(currentVectorValue < targetVectorValue) { R += targetVectorValue - currentVectorValue; }
    }

    return 2*H/(2*H + L + R);
};

var ValueTypeHelper = Firecrow.ValueTypeHelper;
var ASTHelper = Firecrow.ASTHelper;
var fcCloneDetector = Firecrow.CloneDetector;
var fcCharacteristicVector = Firecrow.CloneDetector.CharacteristicVector;

fcCloneDetector.VectorGenerator =
{
    generateFromPageModel: function(pageModel)
    {
        var htmlElement = pageModel.htmlElement;

        this.generateForHtmlNode(htmlElement);
    },

    generateForHtmlNode: function(htmlElement)
    {
        htmlElement.characteristicVector = new fcCharacteristicVector();
        if(htmlElement.type == "textNode") { return; }

        htmlElement.characteristicVector[htmlElement.type] = 1;

        if(htmlElement.type == "script")
        {
            this.generateForJsNode(htmlElement.pathAndModel.model);
        }
        else if (htmlElement.type == "style" || htmlElement.type == "link")
        {
            this.generateForCssNodes(htmlElement.pathAndModel.model);
        }

        var childNodes = htmlElement.childNodes;
        for(var i = 0, length = childNodes.length; i < length; i++)
        {
            var childNode = childNodes[i];

            if(childNode.type != "textNode")
            {
                this.generateForHtmlNode(childNode);

                fcCharacteristicVector.join(htmlElement.characteristicVector, childNode.characteristicVector);
            }
        }
    },

    generateForCssNodes: function(model)
    {

    },

    generateForJsNode: function(astElement)
    {
        try
        {
            if(ASTHelper.isProgram(astElement)) { this.generateVectorForProgram(astElement);}
            else if (ASTHelper.isFunction(astElement)) { this.generateVectorForFunction(astElement); }
            else if (ASTHelper.isBlockStatement(astElement)) { this.generateVectorForBlockStatement(astElement); }
            else if (ASTHelper.isVariableDeclaration(astElement)) { this.generateVectorForVariableDeclaration(astElement); }
            else if (ASTHelper.isVariableDeclarator(astElement)) { this.generateVectorForVariableDeclarator(astElement); }

            //********************************************************LOOPS******************************************************
            else if (ASTHelper.isForStatement(astElement)) { this.generateVectorForForStatement(astElement); }
            else if (ASTHelper.isForInStatement(astElement)) { this.generateVectorForForInStatement(astElement); }

            else if (ASTHelper.isWhileStatement(astElement)) { this.generateVectorForWhileStatement(astElement); }
            else if (ASTHelper.isDoWhileStatement(astElement)) { this.generateVectorForDoWhileStatement(astElement); }
            //*********************************************************************************************************************

            else if (ASTHelper.isObjectExpression(astElement)) { this.generateVectorForObjectExpression(astElement); }
            else if (ASTHelper.isMemberExpression(astElement)) { this.generateVectorForMemberExpression(astElement); }
            else if (ASTHelper.isWithStatement(astElement)) { this.generateVectorForWithStatement(astElement); }


            else if (ASTHelper.isThisExpression(astElement)) { this.generateVectorForThisExpression(astElement); }
            else if (ASTHelper.isArrayExpression(astElement)) { this.generateVectorForArrayExpression(astElement); }


            else if (ASTHelper.isDebuggerStatement(astElement)) { astElement.characteristicVector = new fcCharacteristicVector(); }

            else if (ASTHelper.isNewExpression(astElement)) { this.generateVectorForNewExpression(astElement); }

            else if (ASTHelper.isSequenceExpression(astElement)) { this.generateVectorForSequenceExpression(astElement); }

            else if (ASTHelper.isBreakStatement(astElement)) { this.generateVectorForBreakStatement(astElement); }
            else if (ASTHelper.isContinueStatement(astElement)) { this.generateVectorForContinueStatement(astElement); }

            else if (ASTHelper.isIfStatement(astElement)) { this.generateVectorForIfStatement(astElement); }
            else if (ASTHelper.isSwitchStatement(astElement)) { this.generateVectorForSwitchStatement(astElement); }
            else if (ASTHelper.isSwitchCase(astElement)) { this.generateVectorForSwitchCase(astElement); }
            else if (ASTHelper.isConditionalExpression(astElement)) { this.generateVectorForConditionalExpression(astElement); }

            else if(ASTHelper.isReturnStatement(astElement)) { this.generateVectorForReturnStatement(astElement); }

            else if(ASTHelper.isThrowStatement(astElement)) { this.generateVectorForThrowStatement(astElement); }

            else if (ASTHelper.isTryStatement(astElement)) { this.generateVectorForTryStatement(astElement); }
            else if (ASTHelper.isCatchClause(astElement)) { this.generateVectorForCatchClause(astElement); }

            else if (ASTHelper.isExpressionStatement(astElement)) { this.generateVectorForExpressionStatement(astElement); }
            else if (ASTHelper.isLabeledStatement(astElement)) { this.generateVectorForLabeledStatement(astElement); }

            else if (ASTHelper.isAssignmentExpression(astElement)) { this.generateVectorForAssignmentExpression(astElement); }

            else if (ASTHelper.isCallExpression(astElement)) { this.generateVectorForCallExpression(astElement); }


            else if (ASTHelper.isUpdateExpression(astElement)) { this.generateVectorForUpdateExpression(astElement); }
            else if (ASTHelper.isLogicalExpression(astElement)) { this.generateVectorForLogicalExpression(astElement); }
            else if (ASTHelper.isUnaryExpression(astElement)) { this.generateVectorForUnaryExpression(astElement); }
            else if (ASTHelper.isBinaryExpression(astElement)) { this.generateVectorForBinaryExpression(astElement); }
            else if (ASTHelper.isIdentifier(astElement)) { this.generateVectorForIdentifier(astElement); }
            else if (ASTHelper.isLiteral(astElement)) { this.generateVectorForLiteral(astElement); }

            else if (ASTHelper.isYieldExpression(astElement)) { this.generateVectorForYieldExpression(astElement); }
            else if (ASTHelper.isComprehensionExpression(astElement)) { this.generateVectorForComprehensionExpression(astElement); }
            else if (ASTHelper.isGeneratorExpression(astElement)) { this.generateVectorForGeneratorExpression(astElement); }

            else if (ASTHelper.isLetExpression(astElement)) { this.generateVectorForLetExpression(astElement); }
            else if (ASTHelper.isEmptyStatement(astElement)) { astElement.characteristicVector = new fcCharacteristicVector(); }

            else { console.log("Unhandled element when generating vector: " + astElement.type); }
        }
        catch(e)
        {
            console.log("Error when generating vector: " + e);
        }
    },

    generateVectorForLetExpression: function (letExpression)
    {
        letExpression.characteristicVector = new fcCharacteristicVector();

        letExpression.head.forEach(function(head)
        {
            this.generateForJsNode(head.id);

            fcCharacteristicVector.join(letExpression.characteristicVector, head.id.characteristicVector);

            if(head.init != null)
            {
                this.generateForJsNode(head.init);
                fcCharacteristicVector.join(letExpression.characteristicVector, head.init.characteristicVector);
            }

            this.generateForJsNode(head.body);
            fcCharacteristicVector.join(letExpression.characteristicVector, head.body.characteristicVector);
        }, this);
    },


    generateVectorForBlockStatement: function(blockStatement)
    {
        blockStatement.characteristicVector = new fcCharacteristicVector();

        var body = blockStatement.body;

        for(var i = 0, length = body.length; i < length; i++)
        {
            var statement = body[i];

            this.generateForJsNode(statement);

            fcCharacteristicVector.join(blockStatement.characteristicVector, statement.characteristicVector);
        }
    },

    generateVectorForLabeledStatement: function(labeledStatement)
    {
        labeledStatement.characteristicVector = new fcCharacteristicVector();
        labeledStatement.characteristicVector[labeledStatement.type] = 1;

        this.generateForJsNode(labeledStatement.label);
        this.generateForJsNode(labeledStatement.body);

        fcCharacteristicVector.join(labeledStatement.characteristicVector, labeledStatement.label.characteristicVector);
        fcCharacteristicVector.join(labeledStatement.characteristicVector, labeledStatement.body.characteristicVector);
    },

    generateVectorForCallExpression: function(callExpression)
    {
        callExpression.characteristicVector = new fcCharacteristicVector();
        callExpression.characteristicVector[callExpression.type] = 1;

        var arguments = callExpression.arguments || [];

        for(var i = 0, length = arguments.length; i < length; i++)
        {
            var argument = arguments[i];

            this.generateForJsNode(argument);

            fcCharacteristicVector.join(callExpression.characteristicVector, argument.characteristicVector);
        }

        this.generateForJsNode(callExpression.callee);

        fcCharacteristicVector.join(callExpression.characteristicVector, callExpression.callee.characteristicVector);
    },

    generateVectorForObjectExpression: function(objectExpression)
    {
        objectExpression.characteristicVector = new fcCharacteristicVector();
        objectExpression.characteristicVector[objectExpression.type] = 1;

        var properties = objectExpression.properties;

        for(var i = 0, length = properties.length; i < length; i++)
        {
            var property = properties[i];

            property.characteristicVector = new fcCharacteristicVector();

            this.generateForJsNode(property.key);
            fcCharacteristicVector.join(property.characteristicVector, property.key.characteristicVector);
            fcCharacteristicVector.join(objectExpression.characteristicVector, property.key.characteristicVector);

            this.generateForJsNode(property.value);
            fcCharacteristicVector.join(property.characteristicVector, property.value.characteristicVector);
            fcCharacteristicVector.join(objectExpression.characteristicVector, property.value.characteristicVector);
        }
    },

    generateVectorForMemberExpression: function(memberExpression)
    {
        memberExpression.characteristicVector = new fcCharacteristicVector();
        memberExpression.characteristicVector[memberExpression.type] = 1;

        this.generateForJsNode(memberExpression.object);
        fcCharacteristicVector.join(memberExpression.characteristicVector, memberExpression.object.characteristicVector);

        this.generateForJsNode(memberExpression.property);
        fcCharacteristicVector.join(memberExpression.characteristicVector, memberExpression.property.characteristicVector);
    },

    generateVectorForWithStatement: function (withStatement)
    {
        withStatement.characteristicVector = new fcCharacteristicVector();
        withStatement.characteristicVector[withStatement.type] = 1;

        this.generateForJsNode(withStatement.object);
        fcCharacteristicVector.join(withStatement.characteristicVector, withStatement.object.characteristicVector);

        this.generateForJsNode(withStatement.body);
        fcCharacteristicVector.join(withStatement.characteristicVector, withStatement.body.characteristicVector);
    },

    generateVectorForThisExpression: function (thisExpression)
    {
        thisExpression.characteristicVector = new fcCharacteristicVector();
        thisExpression.characteristicVector[thisExpression.type] = 1;
    },

    generateVectorForArrayExpression: function (arrayExpression)
    {
        arrayExpression.characteristicVector = new fcCharacteristicVector();
        arrayExpression.characteristicVector[arrayExpression.type] = 1;

        var items = arrayExpression.elements;

        for(var i = 0, length = items.length; i < length; i++)
        {
            var item = items[i];

            this.generateForJsNode(item);

            fcCharacteristicVector.join(arrayExpression.characteristicVector, item.characteristicVector);
        }
    },

    generateVectorForNewExpression: function (newExpression)
    {
        newExpression.characteristicVector = new fcCharacteristicVector();
        newExpression.characteristicVector[newExpression.type] = 1;

        this.generateForJsNode(newExpression.callee);
        fcCharacteristicVector.join(newExpression.characteristicVector, newExpression.callee.characteristicVector);

        var arguments = newExpression.arguments || [];

        for(var i = 0; i < arguments.length; i++)
        {
            var argument = arguments[i];

            this.generateForJsNode(argument);

            fcCharacteristicVector.join(newExpression.characteristicVector, argument.characteristicVector);
        }
    },

    generateVectorForSwitchStatement: function (switchStatement)
    {
        switchStatement.characteristicVector = new fcCharacteristicVector();
        switchStatement.characteristicVector[switchStatement.type] = 1;

        this.generateForJsNode(switchStatement.discriminant);
        fcCharacteristicVector.join(switchStatement.characteristicVector, switchStatement.discriminant.characteristicVector);

        var cases = switchStatement.cases;

        for(var i = 0; i < cases.length; i++)
        {
            var caseClause = cases[i];

            this.generateForJsNode(caseClause);

            fcCharacteristicVector.join(switchStatement.characteristicVector, caseClause.characteristicVector);
        }
    },

    generateVectorForSwitchCase: function (switchCase)
    {
        switchCase.characteristicVector = new fcCharacteristicVector();
        switchCase.characteristicVector[switchCase.type] = 1;

        if(switchCase.test != null)
        {
            this.generateForJsNode(switchCase.test);
            fcCharacteristicVector.join(switchCase.characteristicVector, switchCase.test.characteristicVector);
        }

        switchCase.consequent.forEach(function(consequent)
        {
            this.generateForJsNode(consequent);
            fcCharacteristicVector.join(switchCase.characteristicVector, consequent.characteristicVector);
        }, this);
    },

    generateVectorForConditionalExpression: function (conditionalExpression)
    {
        conditionalExpression.characteristicVector = new fcCharacteristicVector();
        conditionalExpression.characteristicVector[conditionalExpression.type] = 1;

        this.generateForJsNode(conditionalExpression.test);
        fcCharacteristicVector.join(conditionalExpression.characteristicVector, conditionalExpression.test.characteristicVector);

        this.generateForJsNode(conditionalExpression.alternate);
        fcCharacteristicVector.join(conditionalExpression.characteristicVector, conditionalExpression.alternate.characteristicVector);

        this.generateForJsNode(conditionalExpression.consequent);
        fcCharacteristicVector.join(conditionalExpression.characteristicVector, conditionalExpression.consequent.characteristicVector);
    },

    generateVectorForReturnStatement: function (returnStatement)
    {
        returnStatement.characteristicVector = new fcCharacteristicVector();
        returnStatement.characteristicVector[returnStatement.type] = 1;

        if( returnStatement.argument != null)
        {
            this.generateForJsNode(returnStatement.argument);
            fcCharacteristicVector.join(returnStatement.characteristicVector, returnStatement.argument.characteristicVector);
        }
    },

    generateVectorForThrowStatement: function (throwStatement)
    {
        throwStatement.characteristicVector = new fcCharacteristicVector();
        throwStatement.characteristicVector[throwStatement.type] = 1;

        if( throwStatement.argument != null)
        {
            this.generateForJsNode(throwStatement.argument);
            fcCharacteristicVector.join(throwStatement.characteristicVector, throwStatement.argument.characteristicVector);
        }
    },

    generateVectorForExpressionStatement: function(expressionStatement)
    {
        expressionStatement.characteristicVector = new fcCharacteristicVector();

        this.generateForJsNode(expressionStatement.expression);

        fcCharacteristicVector.join(expressionStatement.characteristicVector, expressionStatement.expression.characteristicVector);
    },

    generateVectorForAssignmentExpression: function(assignmentExpression)
    {
        assignmentExpression.characteristicVector = new fcCharacteristicVector();
        assignmentExpression.characteristicVector[assignmentExpression.type] = 1;

        this.generateForJsNode(assignmentExpression.left);
        this.generateForJsNode(assignmentExpression.right);

        fcCharacteristicVector.join(assignmentExpression.characteristicVector, assignmentExpression.left.characteristicVector);
        fcCharacteristicVector.join(assignmentExpression.characteristicVector, assignmentExpression.right.characteristicVector);
    },

    generateVectorForUnaryExpression: function(unaryExpression)
    {
        unaryExpression.characteristicVector = new fcCharacteristicVector();

        if(ASTHelper.isUnaryMathOperator(unaryExpression.operator))
        {
            unaryExpression.characteristicVector["UnaryMathExpression"] = 1;
        }
        else if (ASTHelper.isUnaryLogicalOperator(unaryExpression.operator))
        {
            unaryExpression.characteristicVector["UnaryLogicalExpression"] = 1;;
        }
        else if (ASTHelper.isUnaryBitOperator(unaryExpression.operator))
        {
            unaryExpression.characteristicVector["UnaryBitExpression"] = 1;
        }
        else if (ASTHelper.isUnaryObjectOperator(unaryExpression.operator))
        {
            unaryExpression.characteristicVector["UnaryObjectExpression"] = 1;
        }

        this.generateForJsNode(unaryExpression.argument);
        fcCharacteristicVector.join(unaryExpression.characteristicVector, unaryExpression.argument.characteristicVector);
    },

    generateVectorForBinaryExpression: function(binaryExpression)
    {
        binaryExpression.characteristicVector = new fcCharacteristicVector();

        if(ASTHelper.isBinaryEqualityOperator(binaryExpression.operator))
        {
            binaryExpression.characteristicVector["BinaryEqualityExpression"] = 1;
        }
        else if (ASTHelper.isBinaryMathOperator(binaryExpression.operator))
        {
            binaryExpression.characteristicVector["BinaryMathExpression"] = 1;
        }
        else if (ASTHelper.isBinaryRelationalOperator(binaryExpression.operator))
        {
            binaryExpression.characteristicVector["BinaryRelationalExpression"] = 1;
        }
        else if (ASTHelper.isBinaryBitOperator(binaryExpression.operator))
        {
            binaryExpression.characteristicVector["BinaryBitExpression"] = 1;
        }
        else if (ASTHelper.isBinaryObjectOperator(binaryExpression.operator))
        {
            binaryExpression.characteristicVector["BinaryObjectExpression"] = 1;
        }
        else if (ASTHelper.isBinaryXmlOperator(binaryExpression.operator))
        {
            binaryExpression.characteristicVector["BinaryXmlExpression"] = 1;
        }

        this.generateForJsNode(binaryExpression.left);
        this.generateForJsNode(binaryExpression.right);

        fcCharacteristicVector.join(binaryExpression.characteristicVector, binaryExpression.left.characteristicVector);
        fcCharacteristicVector.join(binaryExpression.characteristicVector, binaryExpression.right.characteristicVector);
    },

    generateVectorForFunction: function(functionElement)
    {
        functionElement.characteristicVector = new fcCharacteristicVector();

        functionElement.characteristicVector[functionElement.type] = 1;

        if(functionElement.id != null)
        {
            this.generateForJsNode(functionElement.id);
            fcCharacteristicVector.join(functionElement.characteristicVector, functionElement.id.characteristicVector);
        }

        functionElement.params.forEach(function(parameter)
        {
            this.generateForJsNode(parameter);
            fcCharacteristicVector.join(functionElement.characteristicVector, parameter.characteristicVector);
        }, this);

        this.generateForJsNode(functionElement.body);
        fcCharacteristicVector.join(functionElement.characteristicVector, functionElement.body.characteristicVector);
    },

    generateVectorForProgram: function(program)
    {
        program.characteristicVector = new fcCharacteristicVector();

        var programStatements = program.body;

        for(var i = 0, length = programStatements.length; i < length; i++)
        {
            var programStatement = programStatements[i];

            this.generateForJsNode(programStatement);
            fcCharacteristicVector.join(program.characteristicVector, programStatement.characteristicVector);
        }
    },

    generateVectorForSequenceExpression: function(sequenceExpression)
    {
        sequenceExpression.characteristicVector = new fcCharacteristicVector();
        sequenceExpression.characteristicVector[sequenceExpression.type] = 1;

        var expressions = sequenceExpression.expressions;

        for(var i = 0; i < expressions.length; i++)
        {
            var expression = expressions[i];
            this.generateForJsNode(expression);
            fcCharacteristicVector.join(sequenceExpression.characteristicVector, expressions.characteristicVector);
        }
    },

    generateVectorForVariableDeclaration: function(variableDeclaration)
    {
        variableDeclaration.characteristicVector = new fcCharacteristicVector();

        if (variableDeclaration.kind == "let")
        {
            variableDeclaration.characteristicVector[variableDeclaration.kind] = 1;
        }

        var declarators = variableDeclaration.declarations;

        for(var i = 0, length = declarators.length; i < length; i++)
        {
            var declarator = declarators[i];

            this.generateForJsNode(declarator);

            fcCharacteristicVector.join(variableDeclaration.characteristicVector, declarator.characteristicVector);
        }
    },

    generateVectorForVariableDeclarator: function(variableDeclarator)
    {
        variableDeclarator.characteristicVector = new fcCharacteristicVector();
        variableDeclarator.characteristicVector[variableDeclarator.type] = 1;

        this.generateForJsNode(variableDeclarator.id);
        fcCharacteristicVector.join(variableDeclarator.characteristicVector, variableDeclarator.id.characteristicVector);

        if(variableDeclarator.init != null)
        {
            this.generateForJsNode(variableDeclarator.init);
            fcCharacteristicVector.join(variableDeclarator.characteristicVector, variableDeclarator.init.characteristicVector);
        }
    },

    generateVectorForIdentifier: function(identifier)
    {
        identifier.characteristicVector = new fcCharacteristicVector();
        identifier.characteristicVector[identifier.type] = 1;
    },

    generateVectorForLiteral: function(literal)
    {
        literal.characteristicVector = new fcCharacteristicVector();

        if(ValueTypeHelper.isNull(literal.value)) { literal.characteristicVector["NullLiteral"] = 1; }
        else if(ValueTypeHelper.isString(literal.value)) { literal.characteristicVector["StringLiteral"] = 1; }
        else if(ValueTypeHelper.isNumber(literal.value)) { literal.characteristicVector["NumberLiteral"] = 1; }
        else if(ValueTypeHelper.isBoolean(literal.value)){ literal.characteristicVector["BooleanLiteral"] = 1; }
        else if(ValueTypeHelper.isRegExp(literal.value)){ literal.characteristicVector["RegExLiteral"] = 1; }
        else {console.log("Unknown literal when generating vector!"); return; }
    },

    generateVectorForTryStatement: function(tryStatement)
    {
        tryStatement.characteristicVector = new fcCharacteristicVector();
        tryStatement.characteristicVector[tryStatement.type] = 1;

        this.generateForJsNode(tryStatement.block);

        fcCharacteristicVector.join(tryStatement.characteristicVector, tryStatement.block.characteristicVector);

        tryStatement.handlers.forEach(function(catchClause)
        {
            this.generateForJsNode(catchClause);
            fcCharacteristicVector.join(tryStatement.characteristicVector, catchClause.characteristicVector);
        }, this);

        if(tryStatement.finalizer != null)
        {
            this.generateForJsNode(tryStatement.finalizer);
            fcCharacteristicVector.join(tryStatement.characteristicVector, tryStatement.finalizer.characteristicVector);
        }
    },

    generateVectorForCatchClause: function(catchClause)
    {
        catchClause.characteristicVector = new fcCharacteristicVector();
        catchClause.characteristicVector[catchClause.type] = 1;

        this.generateForJsNode(catchClause.body);

        fcCharacteristicVector.join(catchClause.characteristicVector, catchClause.body.characteristicVector);

        this.generateForJsNode(catchClause.param);

        fcCharacteristicVector.join(catchClause.characteristicVector, catchClause.param.characteristicVector);

        if(catchClause.guard != null)
        {
            this.generateForJsNode(catchClause.guard);
            fcCharacteristicVector.join(catchClause.characteristicVector, catchClause.guard.characteristicVector);
        }
    },

    generateVectorForIfStatement: function(ifStatement)
    {
        ifStatement.characteristicVector = new fcCharacteristicVector();
        ifStatement.characteristicVector[ifStatement.type] = 1;

        this.generateForJsNode(ifStatement.test);

        fcCharacteristicVector.join(ifStatement.characteristicVector, ifStatement.test.characteristicVector);

        this.generateForJsNode(ifStatement.consequent);

        fcCharacteristicVector.join(ifStatement.characteristicVector, ifStatement.consequent.characteristicVector);

        if (ifStatement.alternate != null)
        {
            this.generateForJsNode(ifStatement.alternate);
            fcCharacteristicVector.join(ifStatement.characteristicVector, ifStatement.alternate.characteristicVector);
        }
    },

    generateVectorForForStatement: function (forStatement)
    {
        forStatement.characteristicVector = new fcCharacteristicVector();
        forStatement.characteristicVector[forStatement.type] = 1;

        if (forStatement.init != null)
        {
            this.generateForJsNode(forStatement.init);
            fcCharacteristicVector.join(forStatement.characteristicVector, forStatement.init.characteristicVector);
        }

        if (forStatement.test != null)
        {
            this.generateForJsNode(forStatement.test);
            fcCharacteristicVector.join(forStatement.characteristicVector, forStatement.test.characteristicVector);
        }

        if (forStatement.update != null)
        {
            this.generateForJsNode(forStatement.update);
            fcCharacteristicVector.join(forStatement.characteristicVector, forStatement.update.characteristicVector);
        }

        this.generateForJsNode(forStatement.body);
        fcCharacteristicVector.join(forStatement.characteristicVector, forStatement.body.characteristicVector);
    },

    generateVectorForForInStatement: function (forInStatement)
    {
        forInStatement.characteristicVector = new fcCharacteristicVector();
        forInStatement.characteristicVector[forInStatement.type] = 1;

        this.generateForJsNode(forInStatement.left);
        fcCharacteristicVector.join(forInStatement.characteristicVector, forInStatement.left.characteristicVector);

        this.generateForJsNode(forInStatement.right);
        fcCharacteristicVector.join(forInStatement.characteristicVector, forInStatement.right.characteristicVector);

        this.generateForJsNode(forInStatement.body);
        fcCharacteristicVector.join(forInStatement.characteristicVector, forInStatement.body.characteristicVector);
    },

    generateVectorForWhileStatement: function (whileStatement)
    {
        whileStatement.characteristicVector = new fcCharacteristicVector();
        whileStatement.characteristicVector[whileStatement.type] = 1;

        this.generateForJsNode(whileStatement.body);
        fcCharacteristicVector.join(whileStatement.characteristicVector, whileStatement.body.characteristicVector);

        this.generateForJsNode(whileStatement.test);
        fcCharacteristicVector.join(whileStatement.characteristicVector, whileStatement.test.characteristicVector);
    },

    generateVectorForDoWhileStatement: function (doWhileStatement)
    {
        doWhileStatement.characteristicVector = new fcCharacteristicVector();
        doWhileStatement.characteristicVector[doWhileStatement.type] = 1;

        this.generateForJsNode(doWhileStatement.body);
        fcCharacteristicVector.join(doWhileStatement.characteristicVector, doWhileStatement.body.characteristicVector);

        this.generateForJsNode(doWhileStatement.test);
        fcCharacteristicVector.join(doWhileStatement.characteristicVector, doWhileStatement.test.characteristicVector);
    },

    generateVectorForBreakStatement: function(breakStatement)
    {
        breakStatement.characteristicVector = new fcCharacteristicVector();
        breakStatement.characteristicVector[breakStatement.type] = 1;

        if(breakStatement.label != null)
        {
            this.generateForJsNode(breakStatement.label);
            fcCharacteristicVector.join(breakStatement.characteristicVector, breakStatement.label.characteristicVector);
        }
    },

    generateVectorForContinueStatement: function(continueStatement)
    {
        continueStatement.characteristicVector = new fcCharacteristicVector();
        continueStatement.characteristicVector[continueStatement.type] = 1;

        if(continueStatement.label != null)
        {
            this.generateForJsNode(continueStatement.label);
            fcCharacteristicVector.join(continueStatement.characteristicVector, continueStatement.label.characteristicVector);
        }
    },

    generateVectorForUpdateExpression: function(updateExpression)
    {
        updateExpression.characteristicVector = new fcCharacteristicVector();
        updateExpression.characteristicVector[updateExpression.type] = 1;

        this.generateForJsNode(updateExpression.argument);

        fcCharacteristicVector.join(updateExpression.characteristicVector, updateExpression.argument.characteristicVector);
    },

    generateVectorForLogicalExpression: function (logicalExpression)
    {
        logicalExpression.characteristicVector = new fcCharacteristicVector();
        logicalExpression.characteristicVector[logicalExpression.type] = 1;

        this.generateForJsNode(logicalExpression.left);
        this.generateForJsNode(logicalExpression.right);

        fcCharacteristicVector.join(logicalExpression.characteristicVector, logicalExpression.left.characteristicVector);
        fcCharacteristicVector.join(logicalExpression.characteristicVector, logicalExpression.right.characteristicVector);
    },

    //NETESTIRANI
    generateVectorForYieldExpression: function (yieldExpression)
    {
        yieldExpression.characteristicVector = new fcCharacteristicVector();
        yieldExpression.characteristicVector[yieldExpression.type] = 1;

        if( yieldExpression.argument != null)
        {
            this.generateForJsNode(yieldExpression.argument);
            fcCharacteristicVector.join(yieldExpression.characteristicVector, yieldExpression.argument.characteristicVector);
        }
    },

    generateVectorForComprehensionExpression: function (comprehensionExpression)
    {
        comprehensionExpression.characteristicVector = new fcCharacteristicVector();
        comprehensionExpression.characteristicVector[comprehensionExpression.type] = 1;

        this.generateForJsNode(comprehensionExpression.body);
        fcCharacteristicVector.join(comprehensionExpression.characteristicVector, comprehensionExpression.body.characteristicVector);

        comprehensionExpression.blocks.forEach(function(blocks)
        {
            this.generateForJsNode(blocks);
            fcCharacteristicVector.join(comprehensionExpression.characteristicVector, blocks.characteristicVector);
        }, this);

        if( comprehensionExpression.filter != null)
        {
            this.generateForJsNode(comprehensionExpression.filter);
            fcCharacteristicVector.join(comprehensionExpression.characteristicVector, comprehensionExpression.filter.characteristicVector);
        }
    },

    generateVectorForGeneratorExpression: function (generatorExpression)
    {
        generatorExpression.characteristicVector = new fcCharacteristicVector();
        generatorExpression.characteristicVector[generatorExpression.type] = 1;

        this.generateForJsNode(generatorExpression.body);
        fcCharacteristicVector.join(generatorExpression.characteristicVector, generatorExpression.body.characteristicVector);

        generatorExpression.blocks.forEach(function(block)
        {
            this.generateForJsNode(block);
            fcCharacteristicVector.join(generatorExpression.characteristicVector, block.characteristicVector);
        }, this);

        if( generatorExpression.filter != null)
        {
            this.generateForJsNode(generatorExpression.filter);
            fcCharacteristicVector.join(generatorExpression.characteristicVector, generatorExpression.filter.characteristicVector);
        }
    }
};

var fcValueTypeHelper = Firecrow.ValueTypeHelper;
var fcASTHelper = Firecrow.ASTHelper;
var fcCombinationsGenerator = Firecrow.CloneDetector.CombinationsGenerator;
var fcCharacteristicVector = Firecrow.CloneDetector.CharacteristicVector;

Firecrow.CloneDetector.NodeCombinationsGenerator =
{
    defaultMinNumOfTokens: 30,

    getPotentialCandidates: function(combinationsGroups, maxDistance, minSimilarity)
    {
        var potentialCandidates = [];

        for(var i = 0, groupsLength = combinationsGroups.length; i < groupsLength; i++)
        {
            this.processPotentialCandidate(combinationsGroups, i, maxDistance, minSimilarity, potentialCandidates);
        }

        return this._removeSubCombinations(potentialCandidates);
    },

    asyncProcessPotentialCandidates: function(combinationsGroups, maxDistance, minSimilarity, finishedCallbackFunction, messageCallbackFunction)
    {
        var potentialCandidates = [];
        var _this = this;

        this.currentIndex = 0;

        var asyncLoop = function()
        {
            _this.processPotentialCandidate(combinationsGroups, _this.currentIndex, maxDistance, minSimilarity, potentialCandidates);

            _this.currentIndex++;

            if(_this.currentIndex < combinationsGroups.length)
            {
                if(_this.currentIndex % 5 == 0)
                {
                    messageCallbackFunction("asyncProcessPotentialCandidate - " + _this.currentIndex + " / " + combinationsGroups.length);
                    setTimeout(asyncLoop, 20);
                }
                else
                {
                    asyncLoop();
                }
            }
            else
            {
                finishedCallbackFunction(_this._removeSubCombinations(potentialCandidates));
            }
        };

        asyncLoop();
    },

    processPotentialCandidate: function(combinationsGroups, index, maxDistance, minSimilarity, potentialCandidates)
    {
        var groupsLength = combinationsGroups.length;
        var currentGroup = combinationsGroups[index];

        if(currentGroup == null) { return; }

        var compareWithGroups = [];

        var endGroupIndex = index + Math.floor(maxDistance*index);

        endGroupIndex = endGroupIndex < groupsLength ? endGroupIndex : groupsLength - 1;

        for(var j = index + 1; j <= endGroupIndex; j++)
        {
            if(combinationsGroups[j] != null)
            {
                compareWithGroups.push(combinationsGroups[j]);
            }
        }

        for(var j = 0, currentGroupLength = currentGroup.length; j < currentGroupLength; j++)
        {
            var combinationsVector = currentGroup[j];

            //compare with vectors in the current group
            for(var k = j + 1; k < currentGroupLength; k++)
            {
                var compareWithCombinationsVector = currentGroup[k];

                if(fcCharacteristicVector.calculateSimilarity(combinationsVector.characteristicVector, compareWithCombinationsVector.characteristicVector) >= minSimilarity
                    && !this._containsDescendents(combinationsVector.combination, compareWithCombinationsVector.combination))
                {
                    potentialCandidates.push({ first:combinationsVector, second:compareWithCombinationsVector });
                };
            }

            for(k = 0; k < compareWithGroups.length; k++)
            {
                var compareWithGroup = compareWithGroups[k];

                for(var l = 0, compareGroupLength = compareWithGroup.length; l < compareGroupLength; l++)
                {
                    var compareWithCombinationsVector = compareWithGroup[l];

                    if(fcCharacteristicVector.calculateSimilarity(combinationsVector.characteristicVector, compareWithCombinationsVector.characteristicVector) >= minSimilarity
                        && !this._containsDescendents(combinationsVector.combination, compareWithCombinationsVector.combination))
                    {
                        potentialCandidates.push({first:combinationsVector, second:compareWithCombinationsVector});
                    };
                }
            }
        }
    },

    generateCombinations: function(mergeCombinations)
    {
        var combinations = [];

        for(var i = 0, length = mergeCombinations.length; i < length; i++)
        {
            var characteristicVector = new fcCharacteristicVector();
            var mergeCombination = mergeCombinations[i];

            for(var j = 0, combinationsLength = mergeCombination.length; j < combinationsLength; j++)
            {
                fcCharacteristicVector.join(characteristicVector, mergeCombination[j].characteristicVector);
            }

            combinations.push({
                combination: mergeCombination,
                characteristicVector: characteristicVector,
                tokenNum: fcCharacteristicVector.sum(characteristicVector)
            });
        }

        return combinations;
    },

    groupCombinationsByTokenNum: function(combinations)
    {
        var groups = [];

        for(var i = 0, length = combinations.length; i < length; i++)
        {
            var combination = combinations[i];

            if(groups[combination.tokenNum] == null) { groups[combination.tokenNum] = []; }

            groups[combination.tokenNum].push(combination);
        }

        return groups;
    },

    generateAllMergeCombinations: function(pageModel)
    {
        var htmlElement = pageModel.htmlElement;

        return this.generateFromHtmlNode(htmlElement, []);
    },

    asyncGenerateAllMergeCombinations: function(pageModel, finishedCallback, messageCallback)
    {
        this.asyncGenerateFromHtmlNode(pageModel.htmlElement, [], finishedCallback, messageCallback);
    },

    generateFromHtmlNode: function(htmlElement, combinationsArray)
    {
        if(htmlElement == null) { return combinationsArray; }
        if(htmlElement.type == "textNode") { return combinationsArray; }

        if(htmlElement.type == "script")
        {
            this.generateFromJsNode(htmlElement.pathAndModel.model, combinationsArray);
        }
        else if (htmlElement.type == "style" || htmlElement.type == "link")
        {
            this.generateFromCssNodes(htmlElement.pathAndModel.model, combinationsArray);
        }

        var childNodes = htmlElement.childNodes;
        var children = [];
        for(var i = 0, length = childNodes.length; i < length; i++)
        {
            var childNode = childNodes[i];

            if(childNode.type != "textNode")
            {
                this.generateFromHtmlNode(childNode, combinationsArray);
                children.push(childNode);
            }
        }

        fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(children));

        return combinationsArray;
    },

    asyncGenerateFromHtmlNode: function(htmlElement, combinationsArray, finishedCallback, messageCallback)
    {
        if(htmlElement == null) { return ; }
        if(htmlElement.type == "textNode") { return; }

        if(htmlElement.type == "script")
        {
            this.asyncGenerateFromJsNode(htmlElement.pathAndModel.model, combinationsArray, finishedCallback, messageCallback);
        }
        else if (htmlElement.type == "style" || htmlElement.type == "link")
        {
            this.generateFromCssNodes(htmlElement.pathAndModel.model, combinationsArray);
        }

        var childNodes = htmlElement.childNodes;
        var children = [];
        for(var i = 0, length = childNodes.length; i < length; i++)
        {
            var childNode = childNodes[i];

            if(childNode.type != "textNode")
            {
                this.asyncGenerateFromHtmlNode(childNode, combinationsArray, finishedCallback, messageCallback);
                children.push(childNode);
            }
        }

        fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(children));
    },

    generateFromJsNode: function(program, combinationsArray)
    {
        var functions = [];
        var loops = [];
        var conditionals = [];
        var objectExpressions = [];

        fcASTHelper.traverseAst(program, function(element)
        {
            if(element.characteristicVector == null || fcCharacteristicVector.sum(element.characteristicVector) < this.defaultMinNumOfTokens) { return; }

            if(fcASTHelper.isFunction(element)) { functions.push(element);}
            else if (fcASTHelper.isLoopStatement(element)) { loops.push(element);}
            else if (fcASTHelper.isIfStatement(element) || fcASTHelper.isSwitchStatement(element)) { conditionals.push(element); }
            else if (fcASTHelper.isObjectExpression(element)) { objectExpressions.push(element); }
        });

        fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(program.children));

        for(var i = 0, length = functions.length; i < length; i++)
        {
            fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(functions[i].body.children));
        }
        for(var i = 0, length = loops.length; i < length; i++)
        {
            fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(loops[i].body.children));
        }
        for(var i = 0, length = conditionals.length; i < length; i++)
        {
            var conditional = conditionals[i];

            if(fcASTHelper.isIfStatement(conditional))
            {
                fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(conditional.consequent.children));

                if(conditional.alternate != null)
                {
                    fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(conditional.alternate.children));
                }
            }
            else
            {
                fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(conditional.children));
            }
        }
        for(var i = 0, length = objectExpressions.length; i < length; i++)
        {
            fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(objectExpressions[i].children));
        }

        return combinationsArray;
    },

    asyncGenerateFromJsNode: function(program, combinationsArray, finishedCallback, messageCallback)
    {
        var functions = [];
        var loops = [];
        var conditionals = [];
        var objectExpressions = [];
        var _this = this;

        fcASTHelper.traverseAst(program, function(element)
        {
            if(element.characteristicVector == null || fcCharacteristicVector.sum(element.characteristicVector) < this.defaultMinNumOfTokens) { return; }

            if(fcASTHelper.isFunction(element)) { functions.push(element);}
            else if (fcASTHelper.isLoopStatement(element)) { loops.push(element);}
            else if (fcASTHelper.isIfStatement(element) || fcASTHelper.isSwitchStatement(element)) { conditionals.push(element); }
            else if (fcASTHelper.isObjectExpression(element)) { objectExpressions.push(element); }
        });

        messageCallback("Got all copy-paste elements when async generating from js nodes");

        fcValueTypeHelper.pushAll(combinationsArray, this.getAllChildCombinations(program.children));
        messageCallback("Got direct program children combinations");

        setTimeout(function()
        {
            for(var i = 0, length = functions.length; i < length; i++)
            {
                fcValueTypeHelper.pushAll(combinationsArray, _this.getAllChildCombinations(functions[i].body.children));
            }

            messageCallback("Got functions children combinations");

            setTimeout(function()
            {
                for(var i = 0, length = loops.length; i < length; i++)
                {
                    fcValueTypeHelper.pushAll(combinationsArray, _this.getAllChildCombinations(loops[i].body.children));
                }
                messageCallback("Got loops children combinations");

                setTimeout(function()
                {
                    for(var i = 0, length = conditionals.length; i < length; i++)
                    {
                        var conditional = conditionals[i];

                        if(fcASTHelper.isIfStatement(conditional))
                        {
                            fcValueTypeHelper.pushAll(combinationsArray, _this.getAllChildCombinations(conditional.consequent.children));

                            if(conditional.alternate != null)
                            {
                                fcValueTypeHelper.pushAll(combinationsArray, _this.getAllChildCombinations(conditional.alternate.children));
                            }
                        }
                        else
                        {
                            fcValueTypeHelper.pushAll(combinationsArray, _this.getAllChildCombinations(conditional.children));
                        }
                    }

                    messageCallback("Got conditional children combinations");

                    setTimeout(function()
                    {
                        for(var i = 0, length = objectExpressions.length; i < length; i++)
                        {
                            fcValueTypeHelper.pushAll(combinationsArray, _this.getAllChildCombinations(objectExpressions[i].children));
                        }

                        messageCallback("Got object expression children combinations");

                        finishedCallback(combinationsArray);
                    }, 50);
                }, 50);

            }, 50);
        }, 50);
    },

    generateFromCssNodes: function(model, combinationsArray)
    {

    },

    getAllChildCombinations: function(nodes)
    {
        nodes = nodes || [];
        var combinations = [];

        var expandedNodes = [];

        for(var i = 0, length = nodes.length; i < length; i++)
        {
            var node = nodes[i];

            fcASTHelper.isBlockStatement(node) ? fcValueTypeHelper.pushAll(expandedNodes, node.children)
                                               : expandedNodes.push(node);
        }

        for(var i = 0, length = expandedNodes.length; i < length / 2; i++)
        {
            var allCombinations = fcCombinationsGenerator.generateCombinations(length, i + 1);

            for(var j = 0; j < allCombinations.length; j++)
            {
                var currentCombination = allCombinations[j];
                var currentNodesCombination = [];

                var combinationTokenNum = 0;

                for(var k = 0; k < currentCombination.length; k++)
                {
                    var selectedNode = expandedNodes[currentCombination[k]];

                    currentNodesCombination.push(selectedNode);

                    combinationTokenNum += fcCharacteristicVector.sum(selectedNode.characteristicVector);
                }

                if(combinationTokenNum >= this.defaultMinNumOfTokens)
                {
                    combinations.push(currentNodesCombination);
                }
            }
        }

        return combinations;
    },

    _containsDescendents: function(firstNodeGroup, secondNodeGroup)
    {
        for(var i = 0, firstLength = firstNodeGroup.length; i < firstLength; i++)
        {
            for(var j = 0, secondLength = secondNodeGroup.length; j < secondLength; j++)
            {
                var firstNode = firstNodeGroup[i];
                var secondNode = secondNodeGroup[j];
                if(fcASTHelper.isAncestor(firstNode, secondNode) || fcASTHelper.isAncestor(secondNode, firstNode))
                {
                    return true;
                }
            }
        }

        return false;
    },

    _removeSubCombinations: function(combinations)
    {
        var returnValue = [];

        for(var i = 0; i < combinations.length; i++)
        {
            var firstCombination = combinations[i];
            var encompassingCombination = null;

            for(var j = i + 1; j < combinations.length; j++)
            {
                var secondCombination = combinations[j];

                if(this._isSubCombination(firstCombination, secondCombination))
                {
                    encompassingCombination = secondCombination;
                }
            }

            if(encompassingCombination == null)
            {
                returnValue.push(firstCombination);
            }
        }

        return returnValue;
    },

    _isSubCombination: function(firstCombination, secondCombination)
    {
        var firstFirst = firstCombination.first.combination;
        var secondFirst = secondCombination.first.combination;

        for(var i = 0; i < firstFirst.length; i++)
        {
            var first = firstFirst[i];
            for(var j = 0; j < secondFirst.length; j++)
            {
                var second = secondFirst[j];

                if(!fcASTHelper.isAncestor(second, first)) { return false; }
            }
        }

        return true;
    }
};

var model = HtmlModelMapping.getModel("file:///C:/GitWebStorm/Firecrow/debug/cloneDetector/02/index.html");

var clones = Firecrow.CloneDetector.getClones(model);

console.log(clones.length);

var endTime = Date.now();

console.log("It took: " +  (endTime - startTime));