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

    var htmlCodeEverything = "<html><head><title>" + libraryName + "</title></head><body>";

    htmlCodeEverything += "<table>"
    htmlCodeEverything += "<tr>"
                        +  "<th>Page</th><th>LOC</th><th>EXE</th><th>AST</th><th>SC</th>"
                        +  "<th>P-LOC</th><th>SA-LOC</th><th>SW-LOC</th>"
                        +  "<th>P-AST</th><th>SA-AST</th><th>SW-AST</th>"
                        +  "<th>SA-EXE</th><th>SW-EXE</th>"
                        +  "<th>P-T</th><th>SA-T</th><th>SW-T</th>"
                       +  "</tr>"

    for(var fileName in aggregatedData)
    {
        htmlCodeEverything += "<tr>";

        htmlCodeEverything += "<td class='fileName'>" + fileName + "</td><td>LOC</td>"
                           +  "<td class='originalNumExe'>" + aggregatedData[fileName]["profiled"].numberOfEvaluatedExpressions  + "</td>"
                           +  "<td class='originalASTNodes'>" + aggregatedData[fileName]["profiled"].numberOfAstNodes  + "</td>"
                           +  "<td class='slicingCriteriaCount'>" + aggregatedData[fileName]["slicedAll"].slicingCriteriaCount  + " </td>"
                           +  "<td class='loc'>" + aggregatedData[fileName]["profiled"].loc  + "</td>"
                           +  "<td class='loc'>" + aggregatedData[fileName]["slicedAll"].loc  + "</td>"
                           +  "<td class='loc'>" + aggregatedData[fileName]["slicedWithoutSliceUnions"].loc  + "</td>"
                           +  "<td class='ast'>" + aggregatedData[fileName]["profiled"].afterSliceNumberOfAstNodes  + "</td>"
                           +  "<td class='ast'>" + aggregatedData[fileName]["slicedAll"].afterSliceNumberOfAstNodes  + "</td>"
                           +  "<td class='ast'>" + aggregatedData[fileName]["slicedWithoutSliceUnions"].afterSliceNumberOfAstNodes  + "</td>"
                           +  "<td class='originalNumExe'>" + aggregatedData[fileName]["slicedAll"].afterSliceNumberOfExpressions  + "</td>"
                           +  "<td class='originalNumExe'>" + aggregatedData[fileName]["slicedWithoutSliceUnions"].afterSliceNumberOfExpressions + "</td>"
                           +  "<td class='slicingTime'>" + aggregatedData[fileName]["profiled"].slicingTime  + "</td>"
                           +  "<td class='slicingTime'>" + aggregatedData[fileName]["slicedAll"].slicingTime  + "</td>"
                           +  "<td class='slicingTime'>" + aggregatedData[fileName]["slicedWithoutSliceUnions"].slicingTime  + "</td>";

        htmlCodeEverything += "</tr>";
    }

    htmlCodeEverything += "</table>";

    htmlCodeEverything += "</body></html>";

    fs.write(libraryFolder + "summary.html", htmlCodeEverything);

    console.log("Data written to: " + libraryFolder + "summary.html");
}

phantom.exit();