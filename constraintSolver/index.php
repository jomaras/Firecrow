<?php
require_once("FileAccess.php");

function getConstraint()
{
    if(array_key_exists("Constraint", $_REQUEST))
    {
        return $_REQUEST["Constraint"];
    }

    return "";
}

$constraint = getConstraint();

if($constraint == "")
{
    die("A constraint is not sent");
}

FileAccess::SetFileContent("jsonFiles/inputBase64.txt", $constraint);
$constraint = urldecode($constraint);

FileAccess::SetFileContent("jsonFiles/input.txt", $constraint);

$res = shell_exec("java -jar constraintSolver.jar");

echo(FileAccess::GetFileContent("jsonFiles/output.txt"));