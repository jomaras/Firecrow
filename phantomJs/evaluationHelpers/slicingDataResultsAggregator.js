var system = require('system');
var fs = require('fs');

console.log("Aggregating slicing results");

var libraryNames = ["jQuery", "gauss", "sylvester", "prototype", "mooTools", "underscore"];
var slicingTypes = ["profiled", "slicedAll", "slicedWithoutSliceUnions"];

for(var i = 0; i < libraryNames.length; i++)
{
    var aggregatedData = {};

    var libraryName = libraryNames[i];
    var libraryFolder = "C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\" + libraryName + "\\";

    for(var j = 0; j < slicingTypes.length; j++)
    {
        var slicingType = slicingTypes[j];
        var destinationFolder = libraryFolder + slicingType;
        var logFile = destinationFolder + "\\logAll.txt";
        var timingLogFile = destinationFolder + "\\timingLog.txt";
        var profilingLogFile = destinationFolder + "\\profiling.txt";

        var log = fs.read(logFile);
        var logLines = log.split(/(\r)?\n/g);

        for(var k = 0; k < logLines.length; k++)
        {
            if(logLines[k] == null) { continue; }
            var line = logLines[k].trim();
            if(line == "") { continue; }

            //file name --- time required in ms --- number of lines --- number of ast nodes --- slicingCriteriaCount -- numberOfEvaluatedExpressions
            var segments = line.split("---");

            var filePath = segments[0].trim();

            var fileName = filePath.substring(filePath.lastIndexOf("\\") + 1, filePath.length).replace(".json", "");
            var time = segments[1].trim();
            var loc = segments[2].trim();
            var numberOfAstNodes = segments[3].trim();
            var slicingCriteriaCount = (segments[4] || "0").trim();
            var numberOfEvaluatedExpressions = segments[5].trim();

            if(aggregatedData[fileName] == null) { aggregatedData[fileName] = {}; }

            aggregatedData[fileName][slicingType] = {
                loc: parseInt(loc),
                slicingTime: parseInt(time),
                slicingCriteriaCount: slicingCriteriaCount,
                numberOfAstNodes: numberOfAstNodes,
                numberOfEvaluatedExpressions: numberOfEvaluatedExpressions
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

        try
        {
            var profilingLog = fs.read(profilingLogFile);
        }
        catch(e) {profilingLog = ""; }

        var profilingLogLines = profilingLog.split(/(\r)?\n/g);

        for(var k = 0; k < profilingLogLines.length; k++)
        {
            if(profilingLogLines[k] == null) { continue; }
            var line = profilingLogLines[k].trim();
            if(line == "") { continue; }

            //file name --- time required in ms --- number of lines --- number of ast nodes --- slicingCriteriaCount -- numberOfExecutions
            var segments = line.split("---");

            var filePath = segments[0].trim();
            var fileName = filePath.substring(filePath.lastIndexOf("\\") + 1, filePath.length).replace(".json", "");
            var time = segments[1].trim();
            var loc = segments[2].trim();
            var numberOfAstNodes = segments[3].trim();
            var slicingCriteriaCount = (segments[4] || "0").trim();
            var numberOfEvaluatedExpressions = segments[5].trim();

            if(aggregatedData[fileName] == null)
            {
                console.log(fileName + " could not be found");
            }
            else
            {
                aggregatedData[fileName][slicingType].afterSliceNumberOfAstNodes = parseInt(numberOfAstNodes);
                aggregatedData[fileName][slicingType].afterSliceNumberOfExpressions = parseInt(numberOfEvaluatedExpressions);
            }
        }
    }

    var htmlCode = "<html><head><title>" + libraryName + "</title></head><body>";

    htmlCode += "<table>"
    htmlCode += "<tr>"
             +  "<th>Page</th>"
             +  "<th>P LT</th><th>P ST</th><th>P LOC</th><th>P SC</th><th>P OAST</th><th>P SAST</th><th>P OEXE</th><th>P SEXE</th>"
             +  "<th>SA LT</th><th>SA ST</th><th>SA LOC</th><th>SA SC</th><th>SA OAST</th><th>SA SAST</th><th>SA OEXE</th><th>SA SEXE</th>"
             +  "<th>SW LT</th><th>SW ST</th><th>SW LOC</th><th>SW SC</th><th>SW OAST</th><th>SW SAST</th><th>SW OEXE</th><th>SW SEXE</th>"
             +  "</tr>"

    for(var fileName in aggregatedData)
    {
        htmlCode += "<tr>";

        htmlCode += "<td class='fileName'>" + fileName + "</td>";

        for(var slicingType in aggregatedData[fileName])
        {
            htmlCode += "<td class='loadingTime'>" + aggregatedData[fileName][slicingType].loadingTime  + "</td>"
                      + "<td class='slicingTime'>" + aggregatedData[fileName][slicingType].slicingTime  + "</td>"
                      + "<td class='loc'>" + aggregatedData[fileName][slicingType].loc  + "</td>"
                      + "<td class='slicingCriteriaCount'>" + aggregatedData[fileName][slicingType].slicingCriteriaCount  + " </td>"
                      + "<td class='originalASTNodes'>" + aggregatedData[fileName][slicingType].numberOfAstNodes  + "</td>"
                      + "<td class='afterSliceASTNodes'>" + (aggregatedData[fileName][slicingType].afterSliceNumberOfAstNodes || "")  + "</td>"
                      + "<td class='originalNumExe'>" + aggregatedData[fileName][slicingType].numberOfEvaluatedExpressions  + "</td>"
                      + "<td class='afterSliceNumberOfExpressions'>" + (aggregatedData[fileName][slicingType].afterSliceNumberOfExpressions || "")  + "</td>";
        }

        htmlCode += "</tr>";
    }

    htmlCode += "</table>";

    htmlCode += "</body></html>";

    fs.write(libraryFolder + "summary.html", htmlCode);
    console.log("Data written to: " + libraryFolder + "summary.html");
}

phantom.exit();