var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var testsRootFolder = path.resolve(__dirname, "../../CodeModels/evaluation/scenarioGeneratorTests") + path.sep;
var scenarioGeneratorScriptPath = path.resolve(__dirname, "scenarioGenerator.js");
var dummyCoverageFolder = path.resolve(__dirname, "../evaluation/results/dummyFolder") + path.sep;
var achievedCoverageFile = path.resolve(__dirname, "../evaluation/results/achievedCoverage.txt");

var testModelFilePaths = getFiles(testsRootFolder);
//testModelFilePaths = ["C:\\GitWebStorm\\CodeModels\\evaluation\\scenarioGeneratorTests\\42.json"]; //31, 38, 40, 42

(function processNextTestFolderPath()
{
    if(testModelFilePaths.length == 0) { return; }

    var testModelFilePath = testModelFilePaths.shift();

    console.log("---Processing", testModelFilePath);

    spawnNodeJsProcess
    (
        scenarioGeneratorScriptPath,
        ["testApplication", "symbolicNewCoverageSequential", 40, dummyCoverageFolder, testModelFilePath],
        function onData(data)
        {
            //console.log(data.toString());
            /*var string = data.toString();
            var searchString = "The process has achieved statement coverage:";
            var indexOfSearchString = string.indexOf(searchString);
            if(indexOfSearchString == 0)
            {
                var endLineIndex = string.indexOf("\n");
                if(endLineIndex == -1) { endLineIndex = string.length; }

                //achievedCoverage = string.substring(searchString.length, endLineIndex).trim();
            }*/
        },
        function onClose()
        {
            var achievedCoverage = fs.readFileSync(achievedCoverageFile, {encoding: "utf8"});

            achievedCoverage == "1" ? console.log("Finished processing test:", testModelFilePath, "with coverage:", achievedCoverage)
                                    : console.warn("Finished processing test:", testModelFilePath, "with coverage:", achievedCoverage);

            setTimeout(processNextTestFolderPath, 1000);
            //processNextTestFolderPath();
        },
        function onError(error)
        {
            error && console.log("Error:", error);

        }
    );

})();


/*****************************************/
function getFiles(folder)
{
    return fs.readdirSync(folder).map(function(name)
    {
        var fullPath = testsRootFolder + name;
        var possibleFile = fs.lstatSync(fullPath);

        if(!possibleFile.isDirectory()) { return fullPath; }
    }).filter(function(item) { return item != null; });
}

function spawnNodeJsProcess(pathToFile, args, onDataFunction, onCloseFunction, onError)
{
    var prc = exec( 'node ' + pathToFile + " " + args.join(" "), onError);
    prc.stdout.setEncoding('utf8');

    prc.stdout.on('data', onDataFunction);
    prc.on('close', onCloseFunction);
}