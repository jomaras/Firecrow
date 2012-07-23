FBL.ns(function() { with (FBL) {
/*************************************************************************************/
var ValueTypeHelper = Firecrow.ValueTypeHelper;
var fcCloneDetector = Firecrow.CloneDetector;

fcCloneDetector.CharacteristicVector = function() { };

fcCloneDetector.CharacteristicVector.sum = function(characteristicVector)
{
    if(characteristicVector == null ) { this.notifyError("CharacteristicVector can not be null in sum"); return; }
    if(!(characteristicVector instanceof fcCloneDetector.CharacteristicVector)) { this.notifyError("Arguments are not CharacteristicVector in calculate similarity"); return; }

    var sum = 0;

    for(var propertyName in characteristicVector) { sum += characteristicVector[propertyName]; }

    return sum;
}

fcCloneDetector.CharacteristicVector.join = function(firstCharacteristicVector, secondCharacteristicVector)
{
    if(firstCharacteristicVector == null || secondCharacteristicVector == null) { alert("CharacteristicVector can not be null in join"); return; }
    if(!(firstCharacteristicVector instanceof fcCloneDetector.CharacteristicVector) || !(secondCharacteristicVector instanceof fcCloneDetector.CharacteristicVector)) { alert("Arguments are not CharacteristicVector in join"); return; }

    var processedProperties = { };

    for(var propName in firstCharacteristicVector)
    {
        processedProperties[propName] = true;

        firstCharacteristicVector[propName] += (secondCharacteristicVector[propName] || 0);
    }

    for(var propName in secondCharacteristicVector)
    {
        if(processedProperties[propName] == true) { continue; }

        firstCharacteristicVector[propName] = secondCharacteristicVector[propName];
    }

    return firstCharacteristicVector;
};

fcCloneDetector.CharacteristicVector.calculateSimilarity = function(firstCharacteristicVector, secondCharacteristicVector)
{
    if(firstCharacteristicVector == null || secondCharacteristicVector == null) { alert("CharacteristicVector can not be null in calculate similarity"); return; }
    if(!(firstCharacteristicVector instanceof fcCloneDetector.CharacteristicVector) || !(secondCharacteristicVector instanceof fcCloneDetector.CharacteristicVector)) { alert("Arguments are not CharacteristicVector in calculate similarity"); return; }

    var H = 0;
    var R = 0;
    var L = 0;

    var processedProperties = { };

    for(var propertyName in firstCharacteristicVector)
    {
        processedProperties[propertyName] = true;

        var currentVectorValue = firstCharacteristicVector[propertyName];
        var targetVectorValue = secondCharacteristicVector[propertyName] || 0;

        if (currentVectorValue == targetVectorValue && currentVectorValue != 0 && targetVectorValue != 0) { H += currentVectorValue; }
        else if (currentVectorValue > targetVectorValue) { L += currentVectorValue - targetVectorValue; }
        else if(currentVectorValue < targetVectorValue) { R += targetVectorValue - currentVectorValue; }
    }

    for(var propertyName in secondCharacteristicVector)
    {
        if(processedProperties[propertyName]) { continue; }

        var currentVectorValue = 0;
        var targetVectorValue = secondCharacteristicVector[propertyName];

        if (currentVectorValue == targetVectorValue && currentVectorValue != 0 && targetVectorValue != 0) { H += this[propertyName]; }
        else if (currentVectorValue > targetVectorValue) { L += currentVectorValue - targetVectorValue; }
        else if(currentVectorValue < targetVectorValue) { R += targetVectorValue - currentVectorValue; }
    }

    return 2*H/(2*H + L + R);
};
/*************************************************************************************/
}});