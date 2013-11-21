var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

var fs = require('fs');

var scenarioGenerationLogRootFolder = "C:\\GitWebStorm\\Firecrow\\evaluation\\results\\coverageComparator\\generatorLogs\\";

var applicationNames = fs.readdirSync('C:\\GitWebStorm\\CodeModels\\evaluation\\scenarioGenerator\\');
applicationNames = ["21-angelJump"];

var eventTypes =["pathCoverageSequential"]; ["eventLength", "fifo", "random", "pathCoverageSequential", "pathCoverage", "symbolicNewCoverage", "empirical"];

var allCombinations = getAllCombinations(applicationNames, eventTypes);

var processOutput = "";

(function processNextCombination()
{
    if(allCombinations == null || allCombinations.length == 0)
    {
        console.log("Process finished - comparing coverages");
        spawnPhantomJsProcess
        (
            'C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\scenarioGeneratorCoverageComparator.js',
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
        "C:\\GitWebStorm\\Firecrow\\nodejs\\scenarioGenerator.js",
        [applicationName, eventType, "70"],
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
            fs.writeFileSync(scenarioGenerationLogRootFolder + applicationName + "-" + eventType + ".txt", processOutput)
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
    var prc = spawn( 'C:\\phantomJs\\phantomjs.exe', [pathToFile].concat(args));

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
