/**
 * Created by Josip on 30.6.2014..
 */
var fs = require('fs');
var fileHelper = require("./utils/FileHelper.js");

var allTestFiles = fileHelper.getAllJavaScriptFilesFromSubfolders("C:\\GitWebStorm\\Firecrow\\test262\\test\\suite\\ch07");

//console.log();
console.log(allTestFiles);