TestCase("UriHelperTest",
{
    testUri: function()
    {
        var uH = FBL.Firecrow.UriHelper;
        assertEquals("", uH.getRelativeFrom("file:///C:/GitWebStorm/img/Desert.jpg", "file:///C:/GitWebStorm/index.html"), "img/Desert.jpg");
        assertEquals("", uH.getRelativeFrom("file:///C:/GitWebStorm/img/test/Desert.jpg", "file:///C:/GitWebStorm/index.html"), "img/test/Desert.jpg");
        assertEquals("", uH.getRelativeFrom("file:///C:/GitWebStorm/Desert.jpg", "file:///C:/GitWebStorm/index.html"), "Desert.jpg");
        assertEquals("", uH.getRelativeFrom("file:///C:/GitWebStorm/img/Desert.jpg", "file:///C:/GitWebStorm/index.html"), "img/Desert.jpg");
        assertEquals("", uH.getRelativeFrom("file:///C:/GitWebStorm/images/Desert.jpg", "file:///C:/GitWebStorm/sites/index.html"), "../sites/Desert.jpg");
        assertEquals("", uH.getRelativeFrom("file:///C:/GitWebStorm/images/Desert.jpg", "file:///C:/GitWebStorm/sites/main/index.html"), "../sites/main/Desert.jpg");
        assertEquals("", uH.getRelativeFrom("file:///C:/GitWebStorm/images/hello/Desert.jpg", "file:///C:/GitWebStorm/sites/main/index.html"), "../../sites/main/Desert.jpg");
    }
});