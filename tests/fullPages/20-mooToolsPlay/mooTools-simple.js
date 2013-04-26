var events = {};
function addEvent(type, fn)
{
    events[type] = [];
    events[type].push(fn);

    var self = this;

    var defn = function()
    {
        return fn.call(self);
    };

    this.addEventListener(type, defn, false);
};

function fireEvent(type, args)
{
    events[type].forEach(function(fn)
    {
       fn();
    });
}

addEvent('DOMContentLoaded', function()
{
    fireEvent('domready');
});

addEvent('domready', function()
{
    var contentContainer = document.getElementById('mainContentContainer');
    contentContainer.textContent += 'Hello from MooTools DOM ready';
});