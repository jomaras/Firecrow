<?php

function SetFileContent ($filePath, $fileContent)
{
    $fileHandler = fopen($filePath, 'w') or die("can't open file");
    fwrite($fileHandler, $fileContent);
    fclose($fileHandler);
}

function getFilePath()
{
    if(array_key_exists("filePath", $_REQUEST))
    {
        return $_REQUEST["filePath"];
    }

    return "";
}

function getFileContent()
{
    if(array_key_exists("fileContent", $_REQUEST))
    {
        return $_REQUEST["fileContent"];
    }

    return "";
}

$sourceCode = base64_decode(str_replace(" ", "+",getFileContent()));

if($sourceCode)
{
    SetFileContent("../../../" . getFilePath() . "-testSlicing.html", $sourceCode);
}
else
{
    echo("Error on base64_decode");
}
?>