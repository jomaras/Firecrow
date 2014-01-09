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
var generatedScenariosFolder = path.resolve(__dirname, "../evaluation/results/generatedScenarios") + path.sep;
var timeFolder = path.resolve(__dirname, "../evaluation/results/time") + path.sep;

var coverageTypeFolderNames = getSubFolderNames(scenarioCoverageDataFolder);

var ignoredCoverageTypes = ["empirical"];
var ignoredApplications = ["30-test.txt", "testApplication.txt"];

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
    var generatedScenariosMap = {};

    coverageSummary[applicationName] = {};

    for(var coverageType in applicationInfo)
    {
        if(ignoredCoverageTypes.indexOf(coverageType) != -1) { continue; }

        var coverages = applicationInfo[coverageType];

        var lastCoverageDataPoint = coverages[coverages.length - 1];

        var lastCoverage = lastCoverageDataPoint[1];

        coverageSummary[applicationName][coverageType] = lastCoverage;

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

            areaMap[coverageType] += (nextCoverage - currentCoverage)/2 + currentCoverage;
        }

        var applicationFile = generatedScenariosFolder + coverageType + path.sep + applicationName;

        if(fs.existsSync(applicationFile))
        {
            generatedScenariosMap[coverageType] = fs.readFileSync(applicationFile, {encoding:"utf-8"});
        }
    }

    var maxAchievedCoverage = 0;

    for(var coverage in maxAchievedCoverageTypeMap)
    {
        if(ignoredCoverageTypes.indexOf(coverage) != -1) { continue; }

        var parsed = parseFloat(coverage);
        if(parsed > maxAchievedCoverage)
        {
            maxAchievedCoverage = parsed;
        }
    }

    coverageSummary[applicationName].maxCoverage = {value: maxAchievedCoverage, type: (maxAchievedCoverageTypeMap[maxAchievedCoverage] || []).sort()};
    coverageSummary[applicationName].area = areaMap;
    coverageSummary[applicationName].generatedScenariosMap = generatedScenariosMap;
}

var summaryHtml = "<html><head><style>"
                + ".applicationHeader{background-color: black; color: white}"
                + ".coverageHeader{background-color: blue; color: white}"
                + ".areaHeader{background-color: red; color: white}"
                + ".scenariosHeader{background-color: darkgreen; color: white}"
                + ".applicationCell{color: black}"
                + ".coverageCell{color: blue}"
                + ".areaCell{color: red}"
                + ".scenariosCell{color: darkgreen}"
                + "</style></head><body><table cellspacing='5px' cellpadding='5px'>"
                + "<tr>"
                    + "<td class='applicationHeader'>Application name</td>"

                    + "<td class='coverageHeader'>Max Coverage</td>"
                    + "<td class='coverageHeader'>Max Coverage Type</td>"

                    + "<td class='typeCoverageHeader'>Event Length</td>"
                    + "<td class='typeCoverageHeader'>Fifo</td>"
                    + "<td class='typeCoverageHeader'>SymbolicNewCoverage</td>"
                    + "<td class='typeCoverageHeader'>SymbolicNewCoverageSequential</td>"
                    + "<td class='typeCoverageHeader'>PathCoverageSequential</td>"
                    + "<td class='typeCoverageHeader'>PathCoverage</td>"
                    + "<td class='typeCoverageHeader'>Random</td>"

                    + "<td class='areaHeader'>Event Length area</td>"
                    + "<td class='areaHeader'>Fifo area</td>"
                    + "<td class='areaHeader'>SymbolicNewCoverage area</td>"
                    + "<td class='areaHeader'>SymbolicNewCoverageSequential area</td>"
                    + "<td class='areaHeader'>PathCoverageSequential area</td>"
                    + "<td class='areaHeader'>Path coverage area</td>"
                    + "<td class='areaHeader'>Random area</td>"

                    + "<td class='scenariosHeader'>Event Length scenarios</td>"
                    + "<td class='scenariosHeader'>Fifo scenarios</td>"
                    + "<td class='scenariosHeader'>SymbolicNewCoverage scenarios</td>"
                    + "<td class='scenariosHeader'>SymbolicNewCoverageSequential scenarios</td>"
                    + "<td class='scenariosHeader'>PathCoverageSequential scenarios</td>"
                    + "<td class='scenariosHeader'>Path coverage scenarios</td>"
                    + "<td class='scenariosHeader'>Random scenarios</td>"
                + "</tr>"

for(var applicationName in coverageSummary)
{
    if(ignoredApplications.indexOf(applicationName) != -1) { continue; }

    summaryHtml += "<tr>"
                    + "<td class='applicationCell'>" + applicationName + "</td>"
                    + "<td class='coverageCell'>" + coverageSummary[applicationName].maxCoverage.value + "</td>"
                    + "<td class='coverageCell'>" + coverageSummary[applicationName].maxCoverage.type.join(", ") + "</td>"

                    + "<td class='typeCoverageCell'>" + coverageSummary[applicationName].eventLength + "</td>"
                    + "<td class='typeCoverageCell'>" + coverageSummary[applicationName].fifo + "</td>"
                    + "<td class='typeCoverageCell'>" + coverageSummary[applicationName].symbolicNewCoverage + "</td>"
                    + "<td class='typeCoverageCell'>" + coverageSummary[applicationName].symbolicNewCoverageSequential + "</td>"
                    + "<td class='typeCoverageCell'>" + coverageSummary[applicationName].pathCoverageSequential + "</td>"
                    + "<td class='typeCoverageCell'>" + coverageSummary[applicationName].pathCoverage + "</td>"
                    + "<td class='typeCoverageCell'>" + coverageSummary[applicationName].random + "</td>"

                    + "<td class='areaCell'>" + (coverageSummary[applicationName].area["eventLength"] + "").substring(0, 4) + "</td>"
                    + "<td class='areaCell'>" + (coverageSummary[applicationName].area["fifo"] + "").substring(0, 4) + "</td>"
                    + "<td class='areaCell'>" + (coverageSummary[applicationName].area["symbolicNewCoverage"] + "").substring(0, 4) + "</td>"
                    + "<td class='areaCell'>" + (coverageSummary[applicationName].area["symbolicNewCoverageSequential"] + "").substring(0, 4) + "</td>"
                    + "<td class='areaCell'>" + (coverageSummary[applicationName].area["pathCoverageSequential"] + "").substring(0, 4) + "</td>"
                    + "<td class='areaCell'>" + (coverageSummary[applicationName].area["pathCoverage"] + "").substring(0, 4)+ "</td>"
                    + "<td class='areaCell'>" + (coverageSummary[applicationName].area["random"] + "").substring(0, 4) + "</td>"

                    + "<td class='scenariosCell'>" + coverageSummary[applicationName].generatedScenariosMap["eventLength"] + "</td>"
                    + "<td class='scenariosCell'>" + coverageSummary[applicationName].generatedScenariosMap["fifo"] + "</td>"
                    + "<td class='scenariosCell'>" + coverageSummary[applicationName].generatedScenariosMap["symbolicNewCoverage"] + "</td>"
                    + "<td class='scenariosCell'>" + coverageSummary[applicationName].generatedScenariosMap["symbolicNewCoverageSequential"] + "</td>"
                    + "<td class='scenariosCell'>" + coverageSummary[applicationName].generatedScenariosMap["pathCoverageSequential"] + "</td>"
                    + "<td class='scenariosCell'>" + coverageSummary[applicationName].generatedScenariosMap["pathCoverage"] + "</td>"
                    + "<td class='scenariosCell'>" + coverageSummary[applicationName].generatedScenariosMap["random"] + "</td>"
                + "</tr>";
}

summaryHtml += "</table>";

summaryHtml += "<textarea>";
for(var applicationName in coverageSummary)
{
    if(ignoredApplications.indexOf(applicationName) != -1) { continue; }

    var name = applicationName.replace(".txt", "").replace("_", "\\_").replace(/[0-9]+-/, "");
    var maxCoverage = coverageSummary[applicationName].maxCoverage.type.join(", ");
    maxCoverage = maxCoverage.replace("eventLength", "EL").replace("fifo", "F").replace("symbolicNewCoverageSequential", "CU").replace("pathCoverageSequential", "COV").replace("random", "R");

    summaryHtml += name + "\t\t&" + Math.round(coverageSummary[applicationName].maxCoverage.value * 100) + "\\%"
                + "\t\t&" + maxCoverage
                + "\\\\\r\n";
}
summaryHtml += "</textarea>";

summaryHtml += "<textarea>";

for(var applicationName in coverageSummary)
{
    if(ignoredApplications.indexOf(applicationName) != -1) { continue; }

    var name = applicationName.replace(".txt", "").replace("_", "\\_").replace(/[0-9]+-/, "");

    var isEventLengthMax = coverageSummary[applicationName].maxCoverage.type.indexOf("eventLength") != -1;
    var isFifoMax = coverageSummary[applicationName].maxCoverage.type.indexOf("fifo") != -1;
    var isRandomMax = coverageSummary[applicationName].maxCoverage.type.indexOf("random") != -1;
    var isPathCoverageSequentialMax = coverageSummary[applicationName].maxCoverage.type.indexOf("pathCoverageSequential") != -1;
    var isSymbolicNewCoverageSequentialMax = coverageSummary[applicationName].maxCoverage.type.indexOf("symbolicNewCoverageSequential") != -1;

    var bold = "\\textbf{";

    summaryHtml += name + "\t\t\t&" + (isEventLengthMax ? bold : "") + (coverageSummary[applicationName].eventLength * 100 + "").substring(0, 4) + (isEventLengthMax ? "}" : "")
                        + "\t\t\t&" + (isFifoMax ? bold : "") + (coverageSummary[applicationName].fifo * 100 + "").substring(0, 4) + (isFifoMax ? "}" : "")
                        + "\t\t\t&" + (isRandomMax ? bold : "") + (coverageSummary[applicationName].random * 100 + "").substring(0, 4) + (isRandomMax ? "}" : "")
                        + "\t\t\t&" + (isPathCoverageSequentialMax ? bold : "") + (coverageSummary[applicationName].pathCoverageSequential * 100 + "").substring(0, 4) + (isPathCoverageSequentialMax ? "}" : "")
                        + "\t\t\t&" + (isSymbolicNewCoverageSequentialMax ? bold : "") + (coverageSummary[applicationName].symbolicNewCoverageSequential * 100 + "").substring(0, 4) + (isSymbolicNewCoverageSequentialMax ? "}" : "")
                        + "\\\\\r\n";
}

summaryHtml += "</textarea>";

summaryHtml += "<textarea>";

for(var applicationName in coverageSummary)
{
    if(ignoredApplications.indexOf(applicationName) != -1) { continue; }

    var name = applicationName.replace(".txt", "").replace("_", "\\_").replace(/[0-9]+-/, "");

    summaryHtml += name + "\t\t\t&" + (coverageSummary[applicationName].eventLength + "").substring(0, 4)
        + "\t\t\t&" + (coverageSummary[applicationName].area.fifo + "").substring(0, 4)
        + "\t\t\t&" + (coverageSummary[applicationName].area.random + "").substring(0, 4)
        + "\t\t\t&" + (coverageSummary[applicationName].area.pathCoverageSequential + "").substring(0, 4)
        + "\t\t\t&" + (coverageSummary[applicationName].area.symbolicNewCoverageSequential + "").substring(0, 4)
        + "\\\\\r\n";
}

summaryHtml += "</textarea>";

summaryHtml += "</body></html>";

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