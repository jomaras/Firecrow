/**
 * User: Jomaras
 * Date: 04.07.12.
 * Time: 15:33
 */
var vm = require("vm");
var fs = require("fs");

var include = function(path, context) {
    var data = fs.readFileSync(path);
    console.log(data);
    //vm.runInNewContext(data, context, path);
}

include("./externalVar.js");

var a = 3;
var b = 4;
var c = a + b;

console.log(c);