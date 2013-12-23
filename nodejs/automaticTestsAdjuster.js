var fs = require('fs');
var path = require('path');
var atob = require("atob");
var exec = require('child_process').exec;

var modelJavaScriptFileContent = fs.readFileSync(path.resolve(__dirname, "../debug/interpreterTestsModelMapping.js"), {encoding: "utf8"});
var sourceFolderPath = path.resolve(__dirname, "../debug/usageScenarioGenerator") + path.sep;
var destinationFolder = path.resolve(__dirname, "../../CodeModels/evaluation/scenarioGeneratorTests") + path.sep;

var folders = getSubFolders(sourceFolderPath);

folders.forEach(function(folder, index)
{
    if(folder.indexOf("fullPages") != -1) { return; }
    if(index < 10) { index = "0" + index; }

    var modelContent = fs.readFileSync(folder + path.sep + "index.json");

    fs.writeFileSync(destinationFolder + index + ".json", modelContent);
    console.log(folder);
});

function getSubFolders(folder)
{
    var currentFolder = folder;
    return fs.readdirSync(currentFolder).map(function(folderName)
    {
        var fullPath = currentFolder + folderName + path.sep;
        var folder = fs.lstatSync(fullPath);

        if(folder.isDirectory()) { return fullPath; }
    }).filter(function(item) { return item != null; });
}
