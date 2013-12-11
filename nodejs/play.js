var path = require('path');
var sh = require('execSync');

var os = require('os');

var isWin = os.platform().indexOf("win") != -1 ? true : false;
var chainCommandSeparator = isWin ? "&" : ";";


var constraintSolverRootFolder = path.resolve(__dirname, "../constraintSolver");

console.log("cd " + constraintSolverRootFolder + "; java -jar constraintSolver.jar");
sh.run("cd " + constraintSolverRootFolder + chainCommandSeparator + " java -jar constraintSolver.jar");

console.log("Finished");