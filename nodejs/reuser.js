var fs = require('fs');
var path = require('path');

var pageAModelPath = process.argv[2] || path.resolve(__dirname, "../../CodeModels/evaluation/reuse/01-01_02/pageA.html-codeModel.txt");
var pageBModelPath = process.argv[3] || path.resolve(__dirname, "../../CodeModels/evaluation/reuse/01-01_02/pageB.html-codeModel.txt");
var scenarioModelForReuserPath = path.resolve(__dirname, "../phantomJs/dataFiles/scenarioModelForReuser.txt");

var os = require('os');
var isWin = os.platform().indexOf("win") != -1 ? true : false;

var phantomJsPath = isWin ? 'C:\\phantomJs\\phantomjs.exe' : "/home/jomaras/phantomJs/phantomjs/bin/phantomjs";
/**************************************************************************************************************/

copyFileContent(pageAModelPath, scenarioModelForReuserPath);



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
    console.log("Copying file content from", fromLocation, "to", toLocation);
    fs.writeFileSync(toLocation, fs.readFileSync(fromLocation, { encoding: "utf8"}));
}