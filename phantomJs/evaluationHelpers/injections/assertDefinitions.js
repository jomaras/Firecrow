/**
 * User: Jomaras
 * Date: 13.08.13.
 * Time: 12:17
 */
function assert(value, message)
{
    if(!value)
    {
        console.log("Assert fail: " + message);
    }
}

var ALL_EQUAL = {};


function assertEqual(expected, actual, message)
{
    if(!areEqual(expected, actual))
    {
        console.log("AssertEqual failed: " + expected + "; " + actual + ":" + message);
    }
}

function assertNotEquals(expected, actual, message)
{
    if(areEqual(expected, actual))
    {
        console.log("AssertNotEquals failed: " + expected + "; " + actual + ":" + message);
    }
}

var assertEquals = assertEqual;

function areEqual(expected, actual)
{
    var result;

    if (expected == actual)
        return true;

    if (expected && typeof expected.equals === 'function')
        return expected.equals(actual);

    if (expected instanceof Function)
        return expected === actual;

    if (expected instanceof Array) {
        if (!(actual instanceof Array)) return false;
        for (var i = 0, n = expected.length; i < n; i++) {
            result = areEqual(expected[i], actual[i]);
            if (result === ALL_EQUAL) return true;
            if (!result) return false;
        }
        if (expected.length !== actual.length) return false;
        return true;
    }

    if (expected instanceof Date) {
        if (!(actual instanceof Date)) return false;
        if (expected.getTime() !== actual.getTime()) return false;
        return true;
    }

    if (expected instanceof Object) {
        if (!(actual instanceof Object)) return false;
        if (objectSize(expected) !== objectSize(actual)) return false;
        for (var key in expected) {
            if (!areEqual(expected[key], actual[key]))
                return false;
        }
        return true;
    }

    return false;
}

function objectSize(object) {
    return objectKeys(object).length;
}

function objectKeys(object, includeProto)
{
    var keys = [];
    for (var key in object) {
        if (object.hasOwnProperty(key) || includeProto !== false)
            keys.push(key);
    }
    return keys;
};

function assertNull(object, message)
{
    if(object != null)
    {
        console.log("assertNull fail: " + message);
    }
}

function assertNotNull(value, message)
{
    if(value === null)
    {
        console.log("AssertNotNull fail: " + message);
    }
}

function assertMatch(category, object)
{
    if(!match(category, object))
    {
        console.log("assertMatch fail:" + category + " ; " + object);
    }
}

function match(category, object)
{
    if (object === undefined) return false;

    return typeof category.test === 'function'
        ? category.test(object)
        : category.match(object)
}