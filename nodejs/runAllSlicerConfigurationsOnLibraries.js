var spawn = require('child_process').spawn;

var fs = require('fs');

var libraryNames = ["sylvester", "prototype", "underscore", "mooTools", "jQuery", "gauss"];
var slicingTypes = ["profiled", "slicedAll", "slicedWithoutSliceUnions"];

var allCombinations = getAllCombinations(libraryNames, slicingTypes);

var processOutput = "";

function processNextCombination()
{
    processOutput = "";
    if(allCombinations == null || allCombinations.length == 0)
    {
        console.log("Process finished - comparing coverages");
        spawnPhantomJsProcess
        (
            'C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\slicingDataResultsAggregator.js',
            [],
            function (data)
            {
                var str = data.toString()
                var lines = str.split(/(\r?\n)/g);
                console.log("Aggregating:" + lines.join(""));
            },
            function (code)
            {
                process.exit();
            }
        );
        return;
    }

    var libraryName = allCombinations[allCombinations.length-1].libraryName;
    var slicingType = allCombinations[allCombinations.length-1].slicingType;

    console.log(libraryName + " - " + slicingType);
    var startTime = Date.now();
    spawnPhantomJsProcess
    (
        'C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\slicer.js',
        [libraryName, slicingType, "adjusted_models"],
        function (data)
        {
            var str = data.toString()
            var lines = str.split(/(\r?\n)/g);
            processOutput += lines.join("");
            console.log("Slicer: " + str);
        },
        function (code)
        {
            console.log(libraryName + " - " + slicingType + '; exit:' + code + "in time: " + (Date.now() - startTime) + " ms");
            generateModels(libraryName, slicingType);
            allCombinations.pop();
        }
    );
};

processNextCombination();

function generateModels(libraryName, slicingType)
{
    console.log("Generating page models: " + libraryName + " - " + slicingType);
    spawnPhantomJsProcess
    (
        'C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\pageModeler.js',
        [libraryName, slicingType],
        function (data) {},
        function (code)
        {
            console.log("Finished generating page models!");
            checkCorrectness(libraryName, slicingType);
        }
    );
}

function profileGeneratedCode(libraryName, slicingType)
{
    if(slicingType == "slicedWithoutSliceUnions") { setTimeout(processNextCombination, 1000); return; }

    console.log("Profiling: " + libraryName + " - " + slicingType);

    spawnPhantomJsProcess
    (
        'C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\profiler.js',
        [libraryName, slicingType, slicingType + "_models"],
        function (data)
        {
            console.log("Profiler: " + data.toString());
        },
        function (code)
        {
            setTimeout(processNextCombination, 1000);
        }
    );
}

function checkCorrectness(libraryName, slicingType)
{
    console.log("Checking correctness: " + libraryName + " - " + slicingType);

    spawnPhantomJsProcess
    (
        'C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\checkAllTests.js',
        [libraryName, slicingType],
        function (data)
        {
            console.log("CheckAllTests: " + data.toString());
        },
        function (code)
        {
            profileGeneratedCode(libraryName, slicingType);
        }
    );
}

function spawnPhantomJsProcess(pathToFile, args, onDataFunction, onCloseFunction)
{
    var prc = spawn( 'C:\\phantomJs\\phantomjs.exe', [pathToFile].concat(args));

    prc.stdout.setEncoding('utf8');

    prc.stdout.on('data', onDataFunction);
    prc.on('close', onCloseFunction);
}

function getAllCombinations(libraryNames, slicingTypes)
{
    var allCombinations = [];
    for(var i = 0; i < libraryNames.length; i++)
    {
        for(var j = 0; j < slicingTypes.length; j++)
        {
            allCombinations.push
            ({
                libraryName: libraryNames[i],
                slicingType: slicingTypes[j]
            });
        }
    }

    return allCombinations;
}
