/**
 * Created by Josip on 30.6.2014..
 */
var fs = require('fs');
var path = require('path')

var FileHelper =
{
    getFilesInFolder: function(dir)
    {
        return fs.readdirSync(dir).map(function(name)
        {
            var fullPath = dir + path.sep + name;
            var possibleFile = fs.lstatSync(fullPath);

            if(!possibleFile.isDirectory()) { return fullPath; }

        }).filter(function(item) { return item != null; });
    },

    getAllFilesIncludingFromSubfolders: function(dir)
    {
        var names = fs.readdirSync(dir);
        var allFiles = [];

        for(var i = 0; i < names.length; i++)
        {
            var fullPath = dir + path.sep + names[i];
            var possibleFile = fs.lstatSync(fullPath);

            if(!possibleFile.isDirectory())
            {
               allFiles.push(fullPath);
            }
            else
            {
                var subFolderFiles = this.getAllFilesIncludingFromSubfolders(fullPath);
                allFiles.push.apply(allFiles, subFolderFiles);
            }
        }

        return allFiles;
    },

    getAllJavaScriptFilesFromSubfolders: function(dir)
    {
        return this.getAllFilesIncludingFromSubfolders(dir).filter(function(filePath)
        {
            var suffix = ".js"
            return filePath.indexOf(suffix, this.length - suffix.length) !== -1;
        });
    },

    getFileContent: function(filePath)
    {
        return fs.readFileSync(filePath, {encoding: 'utf8'});
    }
};

for(var prop in FileHelper)
{
    exports[prop] = FileHelper[prop];
}