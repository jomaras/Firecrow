var fs = require('fs');
var path = require('path');
var atob = require("atob");

var destinationFolder = path.resolve(__dirname, "../../CodeModels/evaluation/reuseTests") + path.sep;
var pageAModelFileName = "pageA.html-codeModel.txt";
var pageBModelFileName = "pageB.html-codeModel.txt";
var resultFileName = "result.html";

var reuserTestModelsFileContent = fs.readFileSync(path.resolve(__dirname, "../debug/reuseTests/reuseModels.js"), {encoding: "utf8"});

var models = [];
eval(reuserTestModelsFileContent); //will overwrite models with a new array

for(var i = 0; i < models.length; i++)
{
    var model = models[i];
    var testCaseFolder = destinationFolder + i + path.sep;

    if(!fs.existsSync(testCaseFolder)) { fs.mkdir(testCaseFolder); }

    model.reuseAppModel.trackedElementsSelectors = model.reuseSelectors;
    model.reuseIntoAppModel.reuseIntoDestinationSelectors = model.reuseIntoDestinationSelectors;

    var resultContent = model.result;

    fs.writeFileSync(testCaseFolder + pageAModelFileName, "var HtmlModelMapping = []; HtmlModelMapping.push({url:'', results:[], model:" + JSON.stringify(model.reuseAppModel)) + "});";
    fs.writeFileSync(testCaseFolder + pageBModelFileName, "var HtmlModelMapping = []; HtmlModelMapping.push({url:'', results:[], model:" + JSON.stringify(model.reuseIntoAppModel)) + "});";

    if(resultContent != "" && resultContent != null)
    {
        fs.writeFileSync(testCaseFolder + resultFileName, atob(resultContent))
    }
}

/*
* reuseIntoAppModel:  {"docType"
 reuseAppModel: {"docType":"","
 reuseSelectors: ["#toExtractCo
 reuseIntoDestinationSelectors:
*
* */