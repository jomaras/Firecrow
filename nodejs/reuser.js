var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

console.log("reuser started");

var pageAModelPath = process.argv[2] || path.resolve(__dirname, "../../CodeModels/evaluation/reuseTests/1/pageA.html-codeModel.txt");
var pageBModelPath = process.argv[3] || path.resolve(__dirname, "../../CodeModels/evaluation/reuseTests/1/pageB.html-codeModel.txt");

var expectedResultPath = process.argv[4] || path.resolve(__dirname, "../../CodeModels/evaluation/reuseTests/1/expectedResult.html");
var resultPath = expectedResultPath.replace(/\w+\.\w+$/, "result.html");

var expectedResult = fs.readFileSync(expectedResultPath, {encoding:"utf8"});

var scenarioModelForReuserPath = path.resolve(__dirname, "../phantomJs/dataFiles/scenarioModelForReuser.txt");
var phantomReuseSlicerScript = path.resolve(__dirname, "../phantomJs/evaluationHelpers/reuserScenarioExecutorSlicer.js");
var phantomReuseAnalyzerScript = path.resolve(__dirname, "../phantomJs/evaluationHelpers/reuserScenarioExecutorSlicer.js");

var scenarioExecutionSummaryFile = path.resolve(__dirname, "../phantomJs/dataFiles/scenarioExecutor.txt");

var Reuser = require(path.resolve(__dirname, "reuserModules/Reuser.js")).Reuser;
var ASTHelper = require(path.resolve(__dirname, "../chrome/content/Firecrow/helpers/ASTHelper.js")).ASTHelper;
var CodeTextGenerator = require(path.resolve(__dirname, "../chrome/content/Firecrow/codeMarkupGenerator/codeTextGenerator.js")).CodeTextGenerator;

var os = require('os');
var isWin = os.platform().indexOf("win") != -1 ? true : false;

var phantomJsPath = isWin ? 'C:\\phantomJs\\phantomjs.exe' : "/home/jomaras/phantomJs/phantomjs/bin/phantomjs";
/**************************************************************************************************************/
var HtmlModelMapping = []; //for the files

var pageAModel = (eval(fs.readFileSync(pageAModelPath, {encoding:"utf8"})), HtmlModelMapping[0].model); //HtmlModelMapping contained within the file
var pageBModel = (eval(fs.readFileSync(pageBModelPath, {encoding:"utf8"})), HtmlModelMapping[0].model); //HtmlModelMapping contained within the file

var pageAModelMapping = createModelMapping(pageAModel);
var pageBModelMapping = createModelMapping(pageBModel);

pageAModel.parentChildRelationshipsHaveBeenSet = false;
pageBModel.parentChildRelationshipsHaveBeenSet = false;

var pageAExecutionSummary = null;
var pageBExecutionSummary = null;

ASTHelper.setParentsChildRelationships(pageAModel);
ASTHelper.setParentsChildRelationships(pageBModel);

copyFileContent(pageAModelPath, scenarioModelForReuserPath);
console.log("reuser:", "Slicing", pageAModelPath);
spawnPhantomJsProcess
(
    phantomReuseSlicerScript, [],
    function onData(data) { console.log("PhantomJs-ReuseSlicer:", data.toString()); },
    function onClose()
    {
        pageAExecutionSummary = JSON.parse(fs.readFileSync(scenarioExecutionSummaryFile, {encoding: "utf8"}));

        updatePageModel(pageAExecutionSummary, pageAModelMapping);

        copyFileContent(pageBModelPath, scenarioModelForReuserPath);
        console.log("reuser:", "Analyzing", pageBModelPath);

        spawnPhantomJsProcess
        (
            phantomReuseAnalyzerScript, [],
            function onData(data) { console.log("PhantomJs-ReuseAnalyzer:" + data.toString()); },
            function onClose()
            {
                pageBExecutionSummary = JSON.parse(fs.readFileSync(scenarioExecutionSummaryFile, {encoding: "utf8"}));
                updatePageModel(pageBExecutionSummary, pageBModelMapping);
                performReuse(pageAExecutionSummary, pageBExecutionSummary);
            }
        );
    }
);

function performReuse(pageAExecutionSummary, pageBExecutionSummary)
{
    console.log("Performing reuse");

    var mergedModel = Reuser.getMergedModel(pageAModel, pageBModel, pageAExecutionSummary, pageBExecutionSummary);
    var result = CodeTextGenerator.generateCode(mergedModel);

    console.log("Result written to:", resultPath);
    fs.writeFileSync(resultPath, result);

    if(expectedResult != null && expectedResult != "")
    {
        if(expectedResult.replace(/\s/g, "") != result.replace(/\s/g, ""))
        {
            console.log("Result and expected result differ!");
            console.log(result);
            console.log("/*********************/");
            console.log(expectedResult);
        }
        else
        {
            console.log("Result and expected result match!");
        }
    }
    else
    {
        console.log("There is no expected result!");
    }
}

function updatePageModel(executionSummary, pageModelMapping)
{
    updateIncludedNodes(executionSummary.includedNodeIds, pageModelMapping);
    updatePageModelNodesWithDependencies(executionSummary.dependencyGraph.htmlNodes, pageModelMapping);
    updatePageModelNodesWithDependencies(executionSummary.dependencyGraph.cssNodes, pageModelMapping);
    updatePageModelNodesWithDependencies(executionSummary.dependencyGraph.jsNodes, pageModelMapping);
}

function updateIncludedNodes(includedNodeIds, pageModelMapping)
{
    if(includedNodeIds == null || includedNodeIds.length == 0) { return; }

    for(var i = 0; i < includedNodeIds.length; i++)
    {
        var node = pageModelMapping[includedNodeIds[i]];

        node && (node.shouldBeIncluded = true);
    }
}

function updatePageModelNodesWithDependencies(nodes, pageModelMapping)
{
    for(var i = 0; i < nodes.length; i++)
    {
        var node = nodes[i];

        if(node.modelId != -1)
        {
            var nodeModel = pageModelMapping[node.modelId];

            nodeModel.dependencies = getUpdatedDependencies(node.dataDependencies, pageModelMapping);
        }
    }
}

function getUpdatedDependencies(dependencies, pageModelMapping)
{
    var updatedDependencies = [];

    for(var i = 0; i < dependencies.length; i++)
    {
        var dependency = dependencies[i];

        updatedDependencies.push
        ({
            sourceNode: pageModelMapping[dependency.sourceNodeId],
            destinationNode: pageModelMapping[dependency.destinationNodeId]
        });
    }

    return updatedDependencies;
}

function createModelMapping(pageModel)
{
    var pageModelMapping = {};

    ASTHelper.traverseAst(pageModel, function(element)
    {
        if(element.nodeId !== null && element.nodeId !== undefined)
        {
            pageModelMapping[element.nodeId] = element;
        }
    });

    return pageModelMapping;
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