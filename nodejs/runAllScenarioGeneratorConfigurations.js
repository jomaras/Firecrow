var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

var fs = require('fs');

var path = require('path');

var os = require('os');
var isWin = os.platform().indexOf("win") != -1 ? true : false;

var phantomJsPath = isWin ? 'C:\\phantomJs\\phantomjs.exe' : "/home/jomaras/phantomJs/phantomjs/bin/phantomjs";

var scenarioGenerationLogRootFolder = path.resolve(__dirname, "../evaluation/results/coverageComparator/generatorLogs/") + path.sep;
var applicationModelsRootFolder = path.resolve(__dirname, "../../CodeModels/evaluation/scenarioGenerator") + path.sep;
var scenarioGeneratorCoverageComparatorPath = path.resolve(__dirname, "../phantomJs/evaluationHelpers/scenarioGeneratorCoverageComparator.js");
var scenarioGeneratorPath = path.resolve(__dirname, "scenarioGenerator.js");

var applicationNames = ["10-htmlEdit", "02-ajaxtabscontent", "03-ball_pool", "04-dragable-boxes", "05-dynamicArticles",
                        "06-fractal_viewer", "07-homeostasis", "08-pacman", "20-3dMaker", "21-angelJump", "22-minesweeper",
                        "23-prism3D", "24-rentingAgency", "25-snake", "26-snowpar", "27-tinySlider", "28-floatwar"]; //01-3dModeller

//01-3dModeller; 08-pacman; 20-3dMaker; - OK
//03-ball_pool - NOK (no model)
//04-dragable-boxes - NOK (no model)
//07-homeostasis - NOK (too much data)

//applicationNames = ["02-ajaxtabscontent", "21-angelJump", "22-minesweeper", "23-prism3D", "25-snake", "05-dynamicArticles", "06-fractal_viewer", "24-rentingAgency", "27-tinySlider", "26-snowpar", "28-floatwar"];
applicationNames = ["10-htmlEdit"];

var eventTypes = ["eventLength", "fifo", "pathCoverageSequential", "random", "symbolicNewCoverageSequential", "symbolicNewCoverage"];

var allCombinations = getAllCombinations(applicationNames, eventTypes);

var processOutput = "";

(function processNextCombination()
{
    if(allCombinations == null || allCombinations.length == 0)
    {
        console.log("Process finished - comparing coverages");
        spawnPhantomJsProcess
        (
            scenarioGeneratorCoverageComparatorPath,
            [],
            function (data)
            {
                var str = data.toString()
                var lines = str.split(/(\r?\n)/g);
                console.log(lines.join(""));
            },
            function (code)
            {
                process.exit();
            }
        );
        return;
    }

    var applicationName = allCombinations[allCombinations.length-1].applicationName;
    var eventType = allCombinations[allCombinations.length-1].eventType;

    console.log("NodeJs:", applicationName + " - " + eventType);
    var startTime = Date.now();

    spawnNodeJsProcess
    (
        scenarioGeneratorPath,
        [applicationName, eventType, "100"],
        function (data)
        {
            var str = data.toString()
            var lines = str.split(/(\r?\n)/g);
            processOutput += lines.join("");
            console.log(str);
        },
        function (code)
        {
            console.log(applicationName + " - " + eventType + '; exit:' + code + " in time: " + (Date.now() - startTime) + " ms");
            var processOutputFile = scenarioGenerationLogRootFolder + applicationName + "-" + eventType + ".txt";

            fs.writeFileSync(processOutputFile, processOutput);
            allCombinations.pop();
            setTimeout(processNextCombination, 1000);
        },
        function (error, stdout, stderr)
        {
            if(error != null)
            {
                console.log("Error:", error);
            }
        }
    );
})();

function spawnNodeJsProcess(pathToFile, args, onDataFunction, onCloseFunction, onError)
{
    var prc = exec( 'node ' + pathToFile + " " + args.join(" "), onError);
    prc.stdout.setEncoding('utf8');

    prc.stdout.on('data', onDataFunction);
    prc.on('close', onCloseFunction);
}

function spawnPhantomJsProcess(pathToFile, args, onDataFunction, onCloseFunction)
{
    var prc = spawn(phantomJsPath, [pathToFile].concat(args));

    prc.stdout.setEncoding('utf8');

    prc.stdout.on('data', onDataFunction);
    prc.on('close', onCloseFunction);
}

function getAllCombinations(applicationNames, eventTypes)
{
    var allCombinations = [];
    for(var i = 0; i < applicationNames.length; i++)
    {
        for(var j = 0; j < eventTypes.length; j++)
        {
            allCombinations.push
            ({
                applicationName: applicationNames[i],
                eventType: eventTypes[j]
            });
        }
    }

    return allCombinations;
}
