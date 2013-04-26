  var events = {};
  function addEvent(type, fn)
  {
     if(!events[type])
     {
         events[type] = {'keys': [], 'values': []};
     }

     events[type].keys.push(fn);

     var self = this;

     var defn = function()
     {
         return fn.call(self);
     };

     this.addEventListener(type, defn, false);

     events[type].values.push(defn);

     return this;
  };

  function fireEvent(type, args)
  {
     var keys = events[type].keys;

     keys.forEach(function(fn)
     {
         fn();
     }, this);
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