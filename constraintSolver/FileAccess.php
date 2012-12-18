<?php
class FileAccess
{
    public static function FileExsists($filePath)
    {
        return file_exists($filePath);
    }

    public static function GetFileContent($filePath)
    {
        return  file_get_contents($filePath);
    }

    public static function SetFileContent ($filePath, $fileContent)
    {
        $fileHandler = fopen($filePath, 'w') or die("can't open file");
        fwrite($fileHandler, $fileContent);
        fclose($fileHandler);
    }

    public static function AppendToFile($filePath, $fileContent)
    {
        $fileHandler = fopen($filePath, 'a') or die("can't open file");
        fwrite($fileHandler, $fileContent);
        fclose($fileHandler);
    }

    public static function CopyFile ($sourceFilePath, $destinationFilePath)
    {
        return copy ($sourceFilePath, $destinationFilePath);
    }

    public static function getFilesNamesInFolder($folderPath)
    {
        $files = array();

        if ($handle = opendir($folderPath))
        {
            while (false !== ($entry = readdir($handle)))
            {
                if ($entry != "." && $entry != "..")
                {
                    $files[] = $entry;
                }
            }
        }

        return $files;
    }
}