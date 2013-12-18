var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var reuseTestsRootFolder = path.resolve(__dirname, "../../CodeModels/evaluation/reuseTests") + path.sep;
var reuserNodeScriptPath = path.resolve(__dirname, "reuser.js");

var pageAModelFileName = "pageA.html-codeModel.txt";
var pageBModelFileName = "pageB.html-codeModel.txt";
var resultFileName = "result.html";

var testFolderPaths = getSubFolders(reuseTestsRootFolder);

(function processNextTestFolderPath()
{
    if(testFolderPaths.length == 0) { return; }

    var testFolderPath = testFolderPaths.shift();

    console.log("Processing test:", testFolderPath);

    spawnNodeJsProcess
    (
        reuserNodeScriptPath,
        [testFolderPath + pageAModelFileName, testFolderPath + pageBModelFileName, testFolderPath + resultFileName],
        function onData(data)
        {
            console.log(data.toString());
        },
        function onClose()
        {
            console.log("Finished processing test:", testFolderPath);
            processNextTestFolderPath();
        },
        function onError(error)
        {
            error && console.log("Error:", error);
        }
    );
})();


/*****************************************/
function getSubFolders(folder)
{
    return fs.readdirSync(folder).map(function(folderName)
    {
        var fullPath = reuseTestsRootFolder + folderName + path.sep;
        var folder = fs.lstatSync(fullPath);

        if(folder.isDirectory()) { return fullPath; }
    }).filter(function(item) { return item != null; });
}

function spawnNodeJsProcess(pathToFile, args, onDataFunction, onCloseFunction, onError)
{
    var prc = exec( 'node ' + pathToFile + " " + args.join(" "), onError);
    prc.stdout.setEncoding('utf8');

    prc.stdout.on('data', onDataFunction);
    prc.on('close', onCloseFunction);
}