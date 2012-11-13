$(document).ready(function ()
{
    var activeButtons = $('#featureSelectorContainer .active');
    var clickedButton = 0;

    if (activeButtons.length > 0) { clickedButton = activeButtons[0]; }

    var featuresArray =
    [
        {
            imagePath: 'images/apps/Firecrow.png',
            title: 'Firecrow',
            description: 'Firefox plugin for extracting reuseable client-side web controls',
            link: '?id=app-Firecrow'
        },
        {
            imagePath: 'images/apps/Firedoc.png',
            title: 'Firedoc',
            description: 'Firefox plugin for analyzing the execution of JavaScript code',
            link: '?id=app-Firedoc'
        }
    ];

    //preload images
    for (var i = 0; i < featuresArray.length; i++)
    {
        var image = new Image(720, 320);
        image.src = featuresArray[i].imagePath;
    }

    $('#featureSelectorContainer a').click(function (eventArgs)
    {
        if (clickedButton != null) { var previousButton = clickedButton; }

        clickedButton = eventArgs.currentTarget;

        var buttonIndex = clickedButton.rel;

        if (previousButton != null) { previousButton.className = ""; }

        clickedButton.className = "active";

        changeFeature(buttonIndex);
    });

    function changeFeature(newFeatureIndex)
    {
        var feature = featuresArray[newFeatureIndex];

        var images = $('#featureImageContainer img');
        var titles = $('.featureTitle');
        var descriptions = $('.featureDescription');
        var links = $('#featureImageContainer a');

        var image = null;

        if (images.length > 0) { image = images[0]; }

        images.fadeOut(200, function ()
        {
            images.attr("src", feature.imagePath);
            links.attr("href", feature.link);
            images.fadeIn(100);
        });

        titles.fadeOut(200, function ()
        {
            if (titles.length > 0) { titles[0].innerHTML = feature.title; }
            titles.fadeIn(100);
        });

        descriptions.fadeOut(200, function ()
        {
            if (descriptions.length > 0) { descriptions[0].innerHTML = feature.description; }
            descriptions.fadeIn(100);
        });
    }
});