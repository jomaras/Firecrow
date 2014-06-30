/**
 * Created by Josip on 30.6.2014..
 */
var fs = require('fs');
var fileHelper = require("./utils/FileHelper.js");

var allTestFiles = fileHelper.getAllJavaScriptFilesFromSubfolders("C:\\GitWebStorm\\Firecrow\\test262\\test\\suite\\ch06");

for(var i = 0; i < allTestFiles.length; i++)
{
    var fileContent = fileHelper.getFileContent(allTestFiles[i]);
    console.log("Executing test: " + allTestFiles[i]);
    //Execute test

    //Notify on results of a failing test
    console.log("Executing test: " + allTestFiles[i]);
}