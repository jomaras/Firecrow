Components.utils.import("resource://gre/modules/NetUtil.jsm");
Components.utils.import("resource://gre/modules/FileUtils.jsm");

const CC = Components.classes;
const CI = Components.interfaces;
const CU = Components.utils;

var FileHelper;
if(typeof FBL == "undefined")
{
    FBL =  { Firecrow: {}, ns:  function(namespaceFunction){ namespaceFunction(); }};
}

FBL.ns(function () { with (FBL) {
/******/

var firecrowFolderPath = ["Firecrow"];
var recordingsFolderPath = firecrowFolderPath.concat(["profiles"]);
var phantomJsModelFolder = firecrowFolderPath.concat(["phantomJs"]);

Firecrow.FileHelper = FileHelper =
{
    userPickFile: function(window, title, filter)
    {
        const nsIFilePicker = Components.interfaces.nsIFilePicker;

        var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
        fp.init(window, title, nsIFilePicker.modeOpen);
        fp.appendFilter(filter, filter);

        var rv = fp.show();

        if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace)
        {
            return fp.file.path;
        }

        return null;
    },

    createFirecrowDirs: function()
    {
        FileUtils.getDir("ProfD", recordingsFolderPath, true);
    },

    createFirecrowPhantomJsDirs: function()
    {
        FileUtils.getDir("ProfD", phantomJsModelFolder, true);
    },

    createEventProfilingFile: function(siteName, recordingId, eventProfilingInfo)
    {
        this._createProfilingFile(siteName, "events", recordingId, eventProfilingInfo);
    },

    createAllExecutionsProfilingFile: function(siteName, recordingId, executionProfilingInfo)
    {
        this._createProfilingFile(siteName, "executions", recordingId, executionProfilingInfo);
    },

    saveModelForPhantomJs: function(model, callbackFunction)
    {
        this.createFirecrowPhantomJsDirs();
        this.deleteFilesInFolder(FileUtils.getFile("ProfD", phantomJsModelFolder).path);

        var file = FileUtils.getFile("ProfD", phantomJsModelFolder.concat(["model.js"]));
        if(!file.exists())
        {
            file.createUnique(CI.nsIFile.NORMAL_FILE_TYPE, FileUtils.PERMS_FILE);
        }

        var ostream = FileUtils.openSafeFileOutputStream(file);

        var converter = CC["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(CI.nsIScriptableUnicodeConverter);
        converter.charset = "UTF-8";
        var istream = converter.convertToInputStream("var htmlModel = " + JSON.stringify(model, function(key, value)
        {
            if(key=="value" && value != null && value.constructor != null && value.constructor.name === "RegExp")
            {
                return { type: 'RegExpLiteral',  RegExpBase64: btoa(value.toString())};
            }

            return value;
        }));

        NetUtil.asyncCopy(istream, ostream, function()
        {
            FileUtils.closeSafeFileOutputStream(ostream);
            callbackFunction && callbackFunction(file.path);
        });
    },

    savePhantomJsScripts: function(callbackFunction)
    {
        this.copyFiles
        (
            [
                { fromLocation: "chrome://Firecrow/content/externalSlicerScript.js", toLocation: phantomJsModelFolder.concat(["externalSlicerScript.js"])},
                { fromLocation: "chrome://Firecrow/content/externalSlicedMarker.html", toLocation: phantomJsModelFolder.concat(["externalSlicedMarker.html"])},
                { fromLocation: "chrome://Firecrow/content/externalSlicer.html", toLocation: phantomJsModelFolder.concat(["externalSlicer.html"])},
                { fromLocation: "chrome://Firecrow/content/beautifier/beautify-All.js", toLocation: phantomJsModelFolder.concat(["beautify-All.js"])},
                { fromLocation: "chrome://Firecrow/content/Firecrow-all.js", toLocation: phantomJsModelFolder.concat(["Firecrow-all.js"])}
            ],
            function(copiedFilesInformation)
            {
                for(var i = 0; i < copiedFilesInformation.length; i++)
                {
                    if(copiedFilesInformation[i].path.indexOf("externalSlicerScript.js") != -1)
                    {
                        callbackFunction && callbackFunction(copiedFilesInformation[i].path);
                        return;
                    }
                }
            }
        );
    },

    copyFiles: function(copyFilesInformation, callbackFunction)
    {
        var copiedFilesInformation = [];

        copyFilesInformation.forEach(function(copyFileInformation)
        {
            FileHelper.copyFile(copyFileInformation.fromLocation, copyFileInformation.toLocation, function(copiedFileInformation)
            {
                copiedFilesInformation.push(copiedFileInformation);

                if(copiedFilesInformation.length >= copyFilesInformation.length)
                {
                    callbackFunction && callbackFunction(copiedFilesInformation);
                }
            });
        });
    },

    copyFile: function(fromLocation, toLocation, callbackFunction)
    {
        NetUtil.asyncFetch(fromLocation, function(aInputStream, aResult)
        {
            if (!Components.isSuccessCode(aResult))
            {
                callbackFunction && callbackFunction({success: false, path: fromLocation});
                return;
            }

            var file = FileUtils.getFile("ProfD", toLocation);

            if(!file.exists())
            {
                file.createUnique(CI.nsIFile.NORMAL_FILE_TYPE, FileUtils.PERMS_FILE);
            }

            var ostream = FileUtils.openSafeFileOutputStream(file);

            NetUtil.asyncCopy(aInputStream, ostream, function()
            {
                FileUtils.closeSafeFileOutputStream(ostream);
                callbackFunction && callbackFunction({success: false, path: file.path});
            });
        });
    },

    _createProfilingFile: function(siteName, profilingType, recordingId, info)
    {
        //Create directory if not exists
        FileUtils.getDir("ProfD", recordingsFolderPath.concat(siteName), true);

        recordingId += "-" + profilingType + ".json";

        var file = FileUtils.getFile("ProfD", recordingsFolderPath.concat([siteName, recordingId]));
        file.createUnique(CI.nsIFile.NORMAL_FILE_TYPE, FileUtils.PERMS_FILE);

        var ostream = FileUtils.openSafeFileOutputStream(file)

        var converter = CC["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(CI.nsIScriptableUnicodeConverter);
        converter.charset = "UTF-8";
        var istream = converter.convertToInputStream(info);

        NetUtil.asyncCopy(istream, ostream, function()
        {
            FileUtils.closeSafeFileOutputStream(ostream);
        });

        CU.reportError("Profiling file written to:" + file.path);
    },

    getEventRecordingsFiles: function(siteName, callbackFunction)
    {
        var dir = FileUtils.getDir("ProfD", recordingsFolderPath.concat(siteName), true);

        var entries = dir.directoryEntries;
        var files = [];

        while(entries.hasMoreElements())
        {
            var entry = entries.getNext();

            entry.QueryInterface(Components.interfaces.nsIFile);

            if(!entry.isDirectory() && entry.path.indexOf("allExecutions.json") == -1)
            {
                files.push({path: entry.path, name: entry.leafName, content: this.readFromFile(entry.path)});
            }
        }

        return files;
    },

    readFromFile: function (absoluteFilePath)
    {
        try
        {
            var file = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);

            file.initWithPath(absoluteFilePath);

            if (!file.exists()) { CU.reportError("File not found:" + absoluteFilePath); return ""; }

            var data = "";
            var fstream = CC["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
            var cstream = CC["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);

            fstream.init(file, -1, 0, 0);
            cstream.init(fstream, "UTF-8", 0, 0); // you can use another encoding here if you wish

            var str = {};
            var read = 0;
            do
            {
                read = cstream.readString(0xffffffff, str); // read as much as we can and put it in str.value
                data += str.value;
            } while (read != 0);

            cstream.close(); // this closes fstream

            return data;
        } 
        catch (e) { alert("Error while reading from file:" + e); }
    },

    getNativePath: function(path)
    {
        var file = FileUtils.getFile("ProfD", path);

        return file.nativePath;
    },
    
    getFileContentFromUrl: function (fileUrl)
    {
        try
        {
        	return this.getFileLinesFromUrl(fileUrl).join("");
        }
        catch (e) { alert("Error while getting file content: " + fileUrl + " " + e); }
    },
    
    getFileLinesFromUrl: function (fileUrl)
    {
        try
        {
            var selectedBrowser = Firecrow.fbHelper.getCurrentBrowser();
            
            return new Firebug.SourceCache
            ({
                browser: selectedBrowser,
                window: selectedBrowser.contentWindow
            }).load(fileUrl);
        }
        catch (e) { alert("Error while getting file lines: " + fileUrl + " " + e); }
    },

    writeToFile: function (absoluteFilePath, content, charSet)
    {
        try
        {
            charSet = charSet || "UTF-8";
            
            absoluteFilePath = absoluteFilePath.replace(new RegExp("/", "g"), "\\");

            var stream = CC["@mozilla.org/network/file-output-stream;1"].createInstance(CI.nsIFileOutputStream);

            stream.init(this.getFile(absoluteFilePath), 0x02 | 0x08 | 0x20, 0666, 0);

            var converter = CC["@mozilla.org/intl/converter-output-stream;1"].createInstance(CI.nsIConverterOutputStream);

            converter.init(stream, charSet, 0, 0);
            converter.writeString(content);

            converter.close();
            stream.close();
        }
        catch (e) { CU.reportError("Error while writing to file:" + e); }
    },

    appendToFile: function (absoluteFilePath, content)
    {
        try
        {
            var totalContent = this.readFromFile(absoluteFilePath) + "\r\n" + content;

            this.writeToFile(absoluteFilePath, totalContent);

        } catch (e) { alert("Error while appending to file:" + e); }
    },
    
    cleanPath: function (relativeFilePath)
    {
        var indexOfQuestionmark = relativeFilePath.indexOf("?");
        
        if (indexOfQuestionmark >= 0)
        {
            relativeFilePath = relativeFilePath.substr(0, indexOfQuestionmark);
        }

        return relativeFilePath;
    },

    downloadFile: function (downloadFromLocation, downloadToLocation)
    {
        try
        {
            downloadToLocation = downloadToLocation.replace(new RegExp("/", "g"), "\\");

            var wbp = CC['@mozilla.org/embedding/browser/nsWebBrowserPersist;1'].createInstance(CI.nsIWebBrowserPersist);
            var ios = CC['@mozilla.org/network/io-service;1'].getService(CI.nsIIOService);

            var uri = ios.newURI(downloadFromLocation, null, null);

            wbp.persistFlags &= ~CI.nsIWebBrowserPersist.PERSIST_FLAGS_NO_CONVERSION; // don't save gzipped  

            wbp.saveURI(uri, null, null, null, null, this.getFile(downloadToLocation));
        }
        catch (e) { alert("Error while downloading file" + e); }
    },

    downloadImage: function (url)
    {
        try
        {
            var ioserv = CC["@mozilla.org/network/io-service;1"].getService(CI.nsIIOService);
            var channel = ioserv.newChannel(url, 0, null);
            var stream = channel.open();

            if (channel instanceof CI.nsIHttpChannel && channel.responseStatus != 200)
            {
                return "";
            }

            var bstream = CC["@mozilla.org/binaryinputstream;1"].createInstance(CI.nsIBinaryInputStream);
            bstream.setInputStream(stream);

            var size = 0;
            var file_data = "";
            
            while (size = bstream.available())
            {
                file_data += bstream.readBytes(size);
            }

            return file_data;
        }
        catch (e) { alert("Error while downloading image" + e); }
    },

    openFile: function (path)
    {
        try
        {
            var file = this.getFile(path.replace(new RegExp("/", "g"), "\\"));
            file.launch();
        }
        catch (e) { alert("Error while opening file: " + e); }
    },

    getFile: function (absoluteFilePath)
    {
        try
        {
            var file = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);

            file.initWithPath(absoluteFilePath);

            if (file.exists() == false)
            {
                file.create(CI.nsIFile.NORMAL_FILE_TYPE, 420);
            }

            return file;
        }
        catch (e) { CU.reportError("Trying to get file:" + absoluteFilePath + " " + e); }
    },

    getDirectoriesFromFolder: function(folderPath)
    {
        try
        {
            var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
            file.initWithPath(folderPath);

            var entries = file.directoryEntries;
            var directories = [];

            while(entries.hasMoreElements())
            {
                var entry = entries.getNext();
                entry.QueryInterface(Components.interfaces.nsIFile);
                if(entry.isDirectory())
                {
                    directories.push(entry.path + "\\");
                }
            }

            return directories;
        }
        catch(e) { alert("Error when getting directories from folder: " + e); }
    },
    
    deleteFilesInFolder: function(path)
    {
        try
        {
            var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
              
            file.initWithPath(path);
          
            var entries = file.directoryEntries;  
          
            while(entries.hasMoreElements())  
            {  
                var entry = entries.getNext();
                
                if(entry != null)
                {
                    entry.QueryInterface(Components.interfaces.nsIFile);  
                    entry.remove(true);
                }
            }
        }
        catch (e) { CU.reportError("Error while deleting files in a folder " + e); }
    },

    deleteFile: function(path)
    {
        var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);

        file.initWithPath(path);

        if(file.exists())
        {
            file.remove(true);
        }
    }
}
/******/
}});

var EXPORTED_SYMBOLS = ["FileHelper"];