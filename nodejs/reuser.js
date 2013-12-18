var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

var pageAModelPath = process.argv[2] || path.resolve(__dirname, "../../CodeModels/evaluation/reuseTests/0/pageA.html-codeModel.txt");
var pageBModelPath = process.argv[3] || path.resolve(__dirname, "../../CodeModels/evaluation/reuseTests/0/pageB.html-codeModel.txt");
var expectedResultPath = process.argv[4] || path.resolve(__dirname, "../../CodeModels/evaluation/reuseTests/0/expectedResult.html");

var expectedResult = fs.readFileSync(expectedResultPath, {encoding:"utf8"});

var scenarioModelForReuserPath = path.resolve(__dirname, "../phantomJs/dataFiles/scenarioModelForReuser.txt");
var phantomReuseSlicerScript = path.resolve(__dirname, "../phantomJs/evaluationHelpers/reuserScenarioExecutorSlicer.js");
var phantomReuseAnalyzerScript = path.resolve(__dirname, "../phantomJs/evaluationHelpers/reuserScenarioExecutorSlicer.js");
var scenarioExecutionSummaryFile = path.resolve(__dirname, "../phantomJs/dataFiles/scenarioExecutor.txt");

var Reuser = require(path.resolve(__dirname, "reuserModules/Reuser.js")).Reuser;

var os = require('os');
var isWin = os.platform().indexOf("win") != -1 ? true : false;

var phantomJsPath = isWin ? 'C:\\phantomJs\\phantomjs.exe' : "/home/jomaras/phantomJs/phantomjs/bin/phantomjs";
/**************************************************************************************************************/
var HtmlModelMapping = []; //for the files
var pageAModel = (eval(fs.readFileSync(pageAModelPath, {encoding:"utf8"})), HtmlModelMapping[0].model); //HtmlModelMapping contained within the file
var pageBModel = (eval(fs.readFileSync(pageBModelPath, {encoding:"utf8"})), HtmlModelMapping[0].model); //HtmlModelMapping contained within the file
var pageAExecutionSummary = null;
var pageBExecutionSummary = null;

copyFileContent(pageAModelPath, scenarioModelForReuserPath);
console.log("reuser:", "Slicing pageA...");
spawnPhantomJsProcess
(
    phantomReuseSlicerScript, [],
    function onData(data) { console.log("PhantomJs-ReuseSlicer:", data.toString()); },
    function onClose()
    {
        pageAExecutionSummary = JSON.parse(fs.readFileSync(scenarioExecutionSummaryFile, {encoding: "utf8"}));

        copyFileContent(pageBModelPath, scenarioModelForReuserPath);
        console.log("reuser:", "Analyzing pageB...");

        spawnPhantomJsProcess
        (
            phantomReuseAnalyzerScript, [],
            function onData(data) { console.log("PhantomJs-ReuseAnalyzer:" + data.toString()); },
            function onClose()
            {
                pageBExecutionSummary = JSON.parse(fs.readFileSync(scenarioExecutionSummaryFile, {encoding: "utf8"}));
                performReuse(pageAExecutionSummary, pageBExecutionSummary);
            }
        );
    }
);

function performReuse(pageAExecutionSummary, pageBExecutionSummary)
{
    console.log("Performing reuse");
    var mergedModel = Reuser.getMergedModel(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary);
}

/**************************************************************************************************************/
function spawnPhantomJsProcess(pathToFile, args, onDataFunction, onCloseFunction)
{
    var prc = spawn(phantomJsPath, [pathToFile].concat(args));

    prc.stdout.setEncoding('utf8');

    prc.stdout.on('data', onDataFunction);
    prc.on('close', onCloseFunction);
}

function copyFileContent(fromLocation, toLocation)
{
    fs.writeFileSync(toLocation, fs.readFileSync(fromLocation, { encoding: "utf8"}));
}