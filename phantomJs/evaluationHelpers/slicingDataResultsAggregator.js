var system = require('system');
var fs = require('fs');

console.log("Aggregating slicing results");

var libraryNames = ["gauss"]//, "medialize", "jQuery", "mooTools", "prototype", "sylvester", "underscore"];
var slicingTypes = ["profiled", "slicedAll", "slicedWithoutSliceUnions"];

var aggregatedData = {};

for(var i = 0; i < libraryNames.length; i++)
{
    var libraryName = libraryNames[i];
    var libraryFolder = "C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\" + libraryName + "\\";

    for(var j = 0; j < slicingTypes.length; j++)
    {
        var slicingType = slicingTypes[j];
        var destinationFolder = libraryFolder + slicingType;
        var logFile = destinationFolder + "\\logAll.txt";

        var log = fs.read(logFile);
        var logLines = log.split(/(\r)?\n/g);

        for(var k = 0; k < logLines.length; k++)
        {
            if(logLines[k] == null) { continue; }
            var line = logLines[k].trim();
            if(line == "") { continue; }

            //file name --- time required in ms --- number of lines --- number of ast nodes
            var segments = line.split("---");

            var fileName = segments[0].trim();
            var time = segments[1].trim();
            var loc = segments[2].trim();

            if(aggregatedData[fileName] == null) { aggregatedData[fileName] = {}; }

            aggregatedData[fileName][slicingType] = {
                time: parseFloat(time),
                loc: parseInt(loc)
            };
        }
    }

    var htmlCode = "<html><head><title>" + libraryName + "</title></head><body>";

    htmlCode += "<table>"
    htmlCode += "<tr><th>Page</th><th>P-Time</th><th>P-LOC</th><th>SA-Time</th><th>SA-LOC</th><th>SWSU-Time</th><th>SWSU-LOC</th></tr>"

    for(var filePath in aggregatedData)
    {
        htmlCode += "<tr>";
        var fileName = filePath.substring(filePath.lastIndexOf("\\") + 1, filePath.length);
        htmlCode += "<td>" + fileName.replace(".json", "") + "</td>";

        for(var slicingType in aggregatedData[filePath])
        {
            htmlCode += "<td>" + aggregatedData[filePath][slicingType].time  + "</td>" + "<td>" + aggregatedData[filePath][slicingType].loc  + "</td>";
        }

        htmlCode += "</tr>";
    }

    htmlCode += "</table>";

    htmlCode += "</body></html>";

    fs.write(libraryFolder + "summary.html", htmlCode);
}

phantom.exit();