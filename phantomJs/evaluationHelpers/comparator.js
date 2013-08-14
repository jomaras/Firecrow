var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var logFiles =
[
    "C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\sylvester\\slicedAll\\logAll.txt",
    "C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\sylvester\\slicedWithoutSliceUnions\\logAll.txt",
    "C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\sylvester\\slicedWithoutSliceUnionsAndArrays\\logAll.txt"
];

var comparatorObject = {};
logFiles.forEach(function(logFile)
{
    var fileContent = fs.read(logFile);
    var fileLines = fileContent.split("\n");

    fileLines.forEach(function(fileLine)
    {
        var lineParts = fileLine.split("---");
        var pathPart = (lineParts[0] || "").trim();
        var timePart = (lineParts[1] || "").trim();
        var locPart = (lineParts[2] || "").trim();
        var numberOfNodes = (lineParts[3] || "").trim();

        if(pathPart == "") { return; }

        if(comparatorObject[pathPart] == null) { comparatorObject[pathPart] = { times: [], locs: [], numberOfNodes: [] }; }

        comparatorObject[pathPart].times.push(timePart);
        comparatorObject[pathPart].locs.push(locPart);
        comparatorObject[pathPart].numberOfNodes.push(numberOfNodes);
    });
});

var differences = [];
for(var path in comparatorObject)
{
    var message = path + "  ---  " + comparatorObject[path].times + " msec --- " + comparatorObject[path].locs + " LOC --- " + comparatorObject[path].numberOfNodes + " AST nodes;";
    console.log(message);

    if(hasNonEqualItems(comparatorObject[path].locs) || hasNonEqualItems(comparatorObject[path].numberOfNodes))
    {
        differences.push(message);
    }
}

console.log("*************** HAVE DIFFERENCES *******************");
differences.forEach(function (diff){ console.log(diff); })

function hasNonEqualItems(array)
{
    for(var i = 0; i < array.length; i++)
    {
        if(array[0] != array[i]) { return true; }
    }

    return false;
}