var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var recordingsRoot = "C:\\GitWebStorm\\EventRecorder\\recordings\\";
var recordingsFiles = fs.list(recordingsRoot).map(function(file)
{
    var fullPath = recordingsRoot + file;
    if(fs.isFile(fullPath) && fullPath.indexOf("json") != -1)
    {
        return fullPath;
    }
}).filter(function(item){ return item != null; });

console.log("\t\t\t*************** Program Start ***************");
var simpleTrace = [];
recordingsFiles.forEach(function(item)
{
    //console.log("++++++    Processing file: " + item);
    var jsonModel = JSON.parse(fs.read(item));
    jsonModel.eventTrace.forEach(function(event)
    {
        //console.log(event.time + ":" + event.thisValue + " --> " + (event.type || "unknown"));
        simpleTrace.push({
            thisValue: event.thisValue == "document" || event.thisValue == "window" ? event.thisValue
                                                                                    : "HTMLElement",
            type: event.type || "time"
        })
    });
});

var aggregator = {};
for(var i = 0; i < simpleTrace.length - 1; i++)
{
    var current = simpleTrace[i];
    var next = simpleTrace[i+1];

    var currentId = current.thisValue + "-" + current.type;
    var nextId = next.thisValue + "-" + next.type;

    aggregator[currentId] = aggregator[currentId] || {};
    aggregator[currentId][nextId] = aggregator[currentId][nextId] || 0;

    aggregator[currentId][nextId]++;
}

var percentageAggregator = {};
for(var currentProp in aggregator)
{
    var totalSum = 0;
    percentageAggregator[currentProp] = {};

    for(var nextProp in aggregator[currentProp])
    {
        totalSum += aggregator[currentProp][nextProp];
    }

    var properties = [];
    for(var nextProp in aggregator[currentProp])
    {
        properties.push({
            name: nextProp,
            value: aggregator[currentProp][nextProp]/totalSum
        });
    }

    properties.sort(function(a,b)
    {
        return b.value - a.value;
    });

    properties.forEach(function(nextProp)
    {
        percentageAggregator[currentProp][nextProp.name] = (nextProp.value + "").slice(0,5);
    });
}

var htmlTable = "<style>table{margin:10px; border:solid; border-collapse: collapse} table td{border:solid}</style>";

for(var currentProp in percentageAggregator)
{
    htmlTable += "<table>";
    htmlTable += "<tr>";
    htmlTable += "<td/>";
    for(var nextProp in percentageAggregator[currentProp])
    {
        htmlTable += "<td>" + nextProp + "</td>";
    }
    htmlTable += "</tr>";

    htmlTable += "<tr>";
    htmlTable += "<td>" + currentProp  + "</td>";
    for(var nextProp in percentageAggregator[currentProp])
    {
        htmlTable += "<td>" + percentageAggregator[currentProp][nextProp] + "</td>";
    }
    htmlTable += "</tr>";
    htmlTable += "</table>";
}

fs.write(recordingsRoot + "aggregate.html", htmlTable);
fs.write(recordingsRoot + "aggregateJsonData.txt", JSON.stringify(percentageAggregator));
phantom.exit();