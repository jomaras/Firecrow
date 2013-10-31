var system = require('system');
var fs = require('fs');

console.log("Aggregating slicing results");

var libraryNames = ["prototype"]//,"gauss", "sylvester", "prototype", "jQuery", "mooTools", "underscore"];
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
        var timingLogFile = destinationFolder + "\\timingLog.txt";

        var log = fs.read(logFile);
        var logLines = log.split(/(\r)?\n/g);

        for(var k = 0; k < logLines.length; k++)
        {
            if(logLines[k] == null) { continue; }
            var line = logLines[k].trim();
            if(line == "") { continue; }

            //file name --- time required in ms --- number of lines --- number of ast nodes --- slicingCriteriaCount
            var segments = line.split("---");

            var filePath = segments[0].trim();

            var fileName = filePath.substring(filePath.lastIndexOf("\\") + 1, filePath.length).replace(".json", "");
            var time = segments[1].trim();
            var loc = segments[2].trim();
            var slicingCriteriaCount = (segments[4] || "0").trim();

            if(aggregatedData[fileName] == null) { aggregatedData[fileName] = {}; }

            aggregatedData[fileName][slicingType] = {
                loc: parseInt(loc),
                slicingTime: parseInt(time),
                slicingCriteriaCount: slicingCriteriaCount
            };
        }

        var timingLog = fs.read(timingLogFile);
        var timingLogLines = timingLog.split(/(\r)?\n/g);

        for(var k = 0; k < timingLogLines.length; k++)
        {
            if(timingLogLines[k] == null) { continue; }
            var line = timingLogLines[k].trim();
            if(line == "") { continue; }

            //file name --- time required in ms
            var segments = line.split("---");

            var filePath = segments[0].trim();
            var loadingTime = segments[1].trim();

            var fileName = filePath.substring(filePath.lastIndexOf("\\") + 1, filePath.length).replace(".html", "");

            if(aggregatedData[fileName] == null)
            {
                console.log(fileName);
            }
            else
            {
                aggregatedData[fileName][slicingType].loadingTime = parseInt(loadingTime);
            }

        }
    }

    var htmlCode = "<html><head><title>" + libraryName + "</title></head><body>";

    htmlCode += "<table>"
    htmlCode += "<tr><th>Page</th><th>P-LTime</th><th>P-STime</th><th>P-LOC</th><th>P-SC</th>"
             +  "<th>SA-LTime</th><th>SA-STime</th><th>SA-LOC</th><th>SA-SC</th>"
             +  "<th>SWSU-LTime</th><th>SWSU-STime</th><th>SWSU-LOC</th><th>SWSU-SC</th>"
             +  "</tr>"

    for(var fileName in aggregatedData)
    {
        htmlCode += "<tr>";

        htmlCode += "<td>" + fileName + "</td>";

        for(var slicingType in aggregatedData[fileName])
        {
            htmlCode += "<td>" + aggregatedData[fileName][slicingType].loadingTime  + "</td>"
                      + "<td>" + aggregatedData[fileName][slicingType].slicingTime  + "</td>"
                      + "<td>" + aggregatedData[fileName][slicingType].loc  + "</td>"
                      + "<td>" + aggregatedData[fileName][slicingType].slicingCriteriaCount  + "</td>";
        }

        htmlCode += "</tr>";
    }

    htmlCode += "</table>";

    htmlCode += "</body></html>";

    fs.write(libraryFolder + "summary.html", htmlCode);
    console.log("Data written to: " + libraryFolder + "summary.html");
}

phantom.exit();