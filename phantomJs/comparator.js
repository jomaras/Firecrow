var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var logFiles =
[
    "C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\sylvester\\slicedAll\\logAll.txt",
    "C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\sylvester\\slicedWithoutSliceUnions\\logAll.txt",
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

        if(pathPart == "" || timePart == "" || locPart == "") { return; }

        if(comparatorObject[pathPart] == null) { comparatorObject[pathPart] = { times: [], locs: [] }; }

        comparatorObject[pathPart].times.push(timePart);
        comparatorObject[pathPart].locs.push(locPart);
    });
});

for(var path in comparatorObject)
{
    console.log(path + "  ---  " + comparatorObject[path].times + " msec --- " + comparatorObject[path].locs + " LOC");
}