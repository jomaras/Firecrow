var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var currentFilePath = system.args[0];
var currentDirectoryPath = currentFilePath.replace(/[a-zA-Z]+\.[a-zA-Z]+/,"");

fs.changeWorkingDirectory(currentDirectoryPath);

var scenarioCoverageDataFolder = fs.absolute("../../evaluation/results/coverage/") + fs.separator;
var scenarioComparatorDataFolder = fs.absolute("../../evaluation/results/coverageComparator") + fs.separator;

var scenarioGraphTemplatePath = fs.absolute("../../evaluation/results/coverageComparator/viewCoverageComparationGraphsTemplate.html");
var scenarioGraphFilePath = fs.absolute("../../evaluation/results/coverageComparator/viewCoverageComparationGraphs.html");

var coverageTypeFolderNames = fs.list(scenarioCoverageDataFolder).map(function(itemName)
{
    if(itemName == "." || itemName == "..") { return null; }

    var fullPath = scenarioCoverageDataFolder + itemName;

    if(fs.isDirectory(fullPath))
    {
        return itemName;
    }
}).filter(function(item){ return item != null; });

var coverageData = {};
coverageTypeFolderNames.forEach(function(coverageType)
{
    coverageData[coverageType] = {};

    var fullFolderPath = scenarioCoverageDataFolder + coverageType + fs.separator;

    fs.list(fullFolderPath).forEach(function(itemName)
    {
        if(itemName == "." || itemName == "..") { return; }
        if(fs.isFile(fullFolderPath + itemName))
        {
            var fileContent = fs.read(fullFolderPath + itemName);
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
            coverageData[coverageType][itemName] = dataItems;
        }
    });
});

/*
 var eventLengthData = [];
 for (var i = 0; i < Math.PI * 2; i += 0.25) {
 eventLengthData.push([i, Math.sin(i)]);
 }
 [
 { data:eventLengthData, lines: {show:true}, label: "eventLength"}
 ]*/

var applicationCoverage = {};

for(var coverageType in coverageData)
{
    for(var applicationName in coverageData[coverageType])
    {
        var coverage = coverageData[coverageType][applicationName];
        applicationCoverage[applicationName] = applicationCoverage[applicationName] || { };
        applicationCoverage[applicationName][coverageType] = coverage.map(function(dataItem, index)
        {
            return [index, dataItem.statementCoverage]
        });

        //var lastValue = applicationCoverage[applicationName][coverageType][applicationCoverage[applicationName][coverageType].length-1];

        for(var i = applicationCoverage[applicationName][coverageType].length; i <= 100; i++)
        {
            applicationCoverage[applicationName][coverageType].push([i, 0]);
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

    fs.write(scenarioComparatorDataFolder + applicationName + ".txt", content);
}
var templateContent = fs.read(scenarioGraphTemplatePath);

templateContent = templateContent.replace("PLACE_HOLDERS_ELEMENTS", placeHolderElementsHtml);

try
{
    fs.write(scenarioGraphFilePath, templateContent.replace("GRAPH_DATA_TEMPLATE_VARIABLE", JSON.stringify(graphData)));
}
catch(e)
{
    console.log("Error when stringifying graph data!");
}

console.log("!!!!!!!!!!! View graphs at: " + scenarioGraphFilePath);

phantom.exit();
