$(document).ready(function ()
{
    var activeButtons = $('#featureSelectorContainer .active');
    var clickedButton = 0;

    if (activeButtons.length > 0)
    {
        clickedButton = activeButtons[0];
    }

    var featuresArray =
    [{
        imagePath: 'pageAImages/features/PrIDE.png',
        title: 'PRIDE',
        description: 'An environment dedicated to the development of distributed embedded systems'
    },
    {
        imagePath: 'pageAImages/features/PrIDE0.5.png',
        title: 'PRIDE 0.5.0',
        description: 'Download PRIDE 0.5.0'
    }];

    var buttons = $('#featureSelectorContainer a');

    buttons.click(function (eventArgs)
    {
        if (clickedButton != null)
        {
            var previousButton = clickedButton;
        }

        clickedButton = eventArgs.currentTarget;

        var buttonIndex = clickedButton.rel;

        if (previousButton != null)
        {
            previousButton.className = "";
        }

        clickedButton.className = "active";

        changeFeature(buttonIndex);

        return false;
    });

    function changeFeature(newFeatureIndex)
    {
        var feature = featuresArray[newFeatureIndex];

        var titles = $('.featureTitle');

        var descriptions = $('.featureDescription');

        $('#featureContainer').fadeOut(200, function ()
        {
            $('#featureContainer img').attr("src", feature.imagePath);
            $('#featureContainer').fadeIn(100);
        });

        titles.fadeOut(200, function ()
        {
            if (titles.length > 0)
            {
                titles[0].textContent = feature.title;
            }

            titles.fadeIn(100);
        });

        descriptions.fadeOut(200, function ()
        {
            if (descriptions.length > 0)
            {
                descriptions[0].textContent = feature.description;
            }

            descriptions.fadeIn(100);
        });
    }
});