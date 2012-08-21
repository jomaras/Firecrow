FBL.ns(function () { with (FBL) {
/******/
var CC = Components.classes;
var CI = Components.interfaces;

Firecrow.FileHelper = 
{
    readFromFile: function (absoluteFilePath)
    {
        try
        {
            var output = "";
            var file = CC["@mozilla.org/file/local;1"].createInstance(CI.nsILocalFile);

            file.initWithPath(absoluteFilePath);

            if (!file.exists()) { alert("File not found:" + absoluteFilePath); return ""; }

            var stream = CC["@mozilla.org/network/file-input-stream;1"].createInstance(CI.nsIFileInputStream);

            stream.init(file, 0x01, 00004, null);

            var inputStream = CC["@mozilla.org/scriptableinputstream;1"].createInstance(CI.nsIScriptableInputStream);

            inputStream.init(stream);

            var cstream = CC["@mozilla.org/intl/converter-input-stream;1"].createInstance(CI.nsIConverterInputStream);

            cstream.init(stream, "UTF-8", 0, 0);

            var str = {}

            cstream.readString(-1, str); // read the whole file and put it in str.value
            output = str.value;

            cstream.close(); // this closes fstream  

            return output;
        } 
        catch (e) { alert("Error while reading from file:" + e); }
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
            (
                { 
                	browser: selectedBrowser, 
                	window: selectedBrowser.contentWindow 
                }
            ).load(fileUrl);
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
        catch (e) { alert("Error while writing to file:" + e); }
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
        catch (e) { alert("Trying to write to:" + absoluteFilePath + " " + e); }
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
        catch (e) { alert("Error while deleting files in a folder " + e); }
    }
}
/******/
}});