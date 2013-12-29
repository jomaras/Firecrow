var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

var fs = require('fs');

var path = require('path');

var os = require('os');

var scenarioCoverageDataFolder = path.resolve(__dirname, "../evaluation/results/coverage/") + path.sep;
var scenarioComparatorDataFolder = path.resolve(__dirname, "../evaluation/results/coverageComparator") + path.sep;

var scenarioGraphTemplatePath = path.resolve(__dirname, "../evaluation/results/coverageComparator/viewCoverageComparationGraphsTemplate.html");
var scenarioGraphFilePath = path.resolve(__dirname, "../evaluation/results/coverageComparator/viewCoverageComparationGraphs.html");
var scenarioCoverageSummaryFilePath = path.resolve(__dirname, "../evaluation/results/coverageComparator/coverageSummary.html");

var coverageTypeFolderNames = getSubFolderNames(scenarioCoverageDataFolder);

var ignoredCoverageTypes = ["empirical"];

var coverageData = {};
coverageTypeFolderNames.forEach(function(coverageType)
{
    coverageData[coverageType] = {};

    var fullFolderPath = scenarioCoverageDataFolder + coverageType + path.sep;

    var fileNames = getFileNames(fullFolderPath)

    fileNames.forEach(function(fileName)
    {
        var fileContent = fs.readFileSync(fullFolderPath + fileName, { encoding: "utf8"});
        var fileLines = fileContent.split(/\n/g);
        var dataItems = [];
        fileLines.forEach(function(fileLine)
        {
            if(fileLine.trim() == "") { return; }

            var parts = fileLine.split(/@/gi);

            if(parts.length < 3) { return; }

            dataItems.push({
                expressionCoverage: parseFloat(parts[0].slice(0,5)),
                branchCoverage: parseFloat(parts[1].slice(0,5)),
                statementCoverage: parseFloat(parts[2].slice(0,5))
            });
        });
        coverageData[coverageType][fileName] = dataItems;
    });
});

var applicationCoverage = {};

for(var coverageType in coverageData)
{
    for(var applicationName in coverageData[coverageType])
    {
        var coverage = coverageData[coverageType][applicationName];
        applicationCoverage[applicationName] = applicationCoverage[applicationName] || { };
        var lastValue = null;
        applicationCoverage[applicationName][coverageType] = coverage.map(function(dataItem, index)
        {
            lastValue = dataItem.statementCoverage;
            return [index, dataItem.statementCoverage];
        });

        for(var i = applicationCoverage[applicationName][coverageType].length; i <= 100; i++)
        {
            applicationCoverage[applicationName][coverageType].push([i, lastValue]);
        }
    }
};

var graphData = [];
var placeHolderElementsHtml = "";
var index = 0;
for(var applicationName in applicationCoverage)
{
    placeHolderElementsHtml += "<h2>" + applicationName + "</h2>"
                            + "<div id='placeholder" + (index++) + "' class='placeholder'></div>";

    var applicationInfo = [];
    graphData.push(applicationInfo);
    var content = "";
    for(var coverageType in applicationCoverage[applicationName])
    {
        if(ignoredCoverageTypes.indexOf(coverageType) != -1) { continue; }

        var data = applicationCoverage[applicationName][coverageType];

        content += coverageType + "@";

        applicationInfo.push({ data: data, lines: {show: true}, label: coverageType});

        var lastData = 0;
        for(var i = 0; i < data.length; i++)
        {
            content += ((data[i][1] || lastData) + "").replace(".", ",") + " @ ";
            lastData = data[i][1];
        }

        content += "\n";
    }

    fs.writeFileSync(scenarioComparatorDataFolder + applicationName + ".txt", content);
}
var templateContent = fs.readFileSync(scenarioGraphTemplatePath, { encoding:"utf8" });

templateContent = templateContent.replace("PLACE_HOLDERS_ELEMENTS", placeHolderElementsHtml);

try
{
    fs.writeFileSync(scenarioGraphFilePath, templateContent.replace("GRAPH_DATA_TEMPLATE_VARIABLE", JSON.stringify(graphData)));
}
catch(e)
{
    console.log("Error when stringifying graph data!");
}

console.log("!!!!!!!!!!! View graphs at: " + scenarioGraphFilePath);

var coverageSummary = {};

for(var applicationName in applicationCoverage)
{
    var applicationInfo = applicationCoverage[applicationName];
    var maxAchievedCoverageTypeMap = {};
    var areaMap = {};

    for(var coverageType in applicationInfo)
    {
        if(ignoredCoverageTypes.indexOf(coverageType) != -1) { continue; }

        var coverages = applicationInfo[coverageType];

        var lastCoverageDataPoint = coverages[coverages.length - 1];

        var lastCoverage = lastCoverageDataPoint[1];

        if(maxAchievedCoverageTypeMap[lastCoverage] == null)
        {
            maxAchievedCoverageTypeMap[lastCoverage] = [];
        }

        maxAchievedCoverageTypeMap[lastCoverage].push(coverageType);
        areaMap[coverageType] = 0;

        for(var i = 0; i < coverages.length - 1; i++)
        {
            var currentCoverage = coverages[i][1];
            var nextCoverage = coverages[i+1][1];

            areaMap[coverageType] += (nextCoverage - currentCoverage)/2;
        }
    }

    var maxAchievedCoverage = 0;

    for(var coverage in maxAchievedCoverageTypeMap)
    {
        var parsed = parseFloat(coverage);
        if(parsed > maxAchievedCoverage)
        {
            maxAchievedCoverage = parsed;
        }
    }

    coverageSummary[applicationName] =
    {
        maxCoverage: {value: maxAchievedCoverage, type:maxAchievedCoverageTypeMap[maxAchievedCoverage].sort()},
        area: areaMap
    };
}

var summaryHtml = "<html><head></head><body><table>"
                + "<tr>"
                    + "<td>Application name</td>"
                    + "<td>Max Coverage</td>"
                    + "<td>Max Coverage Type</td>"
                + "</tr>"

for(var applicationName in coverageSummary)
{
    summaryHtml += "<tr>"
                    + "<td>" + applicationName + "</td>"
                    + "<td>" + coverageSummary[applicationName].maxCoverage.value + "</td>"
                    + "<td>" + coverageSummary[applicationName].maxCoverage.type.join(", ") + "</td>"
                + "</tr>";
}

summaryHtml += "</table></body></html>";

fs.writeFileSync(scenarioCoverageSummaryFilePath, summaryHtml);
console.log("Summary written to", scenarioCoverageSummaryFilePath);

function getFileNames(folder)
{
    return fs.readdirSync(folder).map(function(fileName)
    {
        var fullPath = folder + fileName + path.sep;
        var file = fs.lstatSync(fullPath);

        if(file.isFile()) { return fileName; }
    }).filter(function(item){ return item != null; });
}

function getSubFolderNames(folder)
{
    var currentFolder = folder;
    return fs.readdirSync(currentFolder).map(function(folderName)
    {
        var fullPath = currentFolder + folderName + path.sep;
        var folder = fs.lstatSync(fullPath);

        if(folder.isDirectory()) { return folderName; }
    }).filter(function(item) { return item != null; });
}
