var system = require('system');
var webPage = require('webpage');
var page = webPage.create();
var fs = require('fs');

var esprima = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\esprima");
var escodegen = require("C:\\GitWebStorm\\Firecrow\\phantomJs\\evaluationHelpers\\escodegen");

var sourceFolder = "C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\gauss\\adjusted";
var destinationFolder = "C:\\GitWebStorm\\Firecrow\\evaluation\\libraries\\gauss\\adjusted";

/*fs.list(sourceFolder).forEach(function(testFolder)
{
    if(testFolder.length <= 2) { return; }
    var testIndexPath = sourceFolder + "\\" + testFolder + "\\index.html";

    var fileContent = fs.read(testIndexPath);

    fileContent = fileContent.replace("../../gauss.js", "http://localhost/Firecrow/evaluation/libraries/gauss/gauss-src.js");
    fileContent = fileContent.replace();

    fs.write(destinationFolder + "\\" + testFolder + ".html", fileContent);
});*/

fs.list(sourceFolder).forEach(function(testFile)
{
    if(testFile.length <= 2) { return; }
    var testIndexPath = sourceFolder + "\\" + testFile;
    console.log(testIndexPath);
    var fileContent = fs.read(testIndexPath);

    fileContent = fileContent.replace("../../gauss.js", "http://localhost/Firecrow/evaluation/libraries/gauss/gauss-src.js");

    fs.write(testIndexPath, fileContent);
});

phantom.exit();