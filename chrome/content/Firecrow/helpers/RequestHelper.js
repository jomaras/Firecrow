FBL.ns(function () { with (FBL) {
/************************************/

Firecrow.RequestHelper =
{
    performSynchronousPost: function(url, dataObject)
    {
        var http = new XMLHttpRequest();

        var dataString = this._convertToDataString(dataObject);

        http.open("POST", url, false);

        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.setRequestHeader("Content-length", dataString.length);
        http.setRequestHeader("Connection", "close");

        http.send(dataString);

        return {
           isSuccessful: http.status == 200,
           response: http.responseText
        };
    },

    _convertToDataString: function(dataObject)
    {
        var dataString = "";

        for(var propName in dataObject)
        {
            if(dataObject[propName] != null)
            {
                if(dataString != "") { dataString += "&"; }

                dataString += propName + "=" + dataObject[propName];
            }
        }

        return dataString;
    }
};

/************************************/
}});