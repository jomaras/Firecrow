/**
 *
 * Version:     1.0.0
 * Author:      Kenny Meyer
 * Contact:     knny.myer@gmail.com
 * Twitter:     @kennymyer
 *
 * Copyright (c) 2011 Kenny Meyer
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 **/
(function($) {
  $.fn.humanTypist = function(options) {
    var settings = $.extend({
      'speed': 'beginner'
    }, options);

    var speed_options = {
      "grandma": 2000,
      "beginner": 1500,
      "upcomer": 1000,
      "scriptkiddie": 500,
      "secretary": 300,
      "hacker": 200,
      "elite": 150,
      "computer": 50
    };

    /* This gives the typist the human touch. */
    var humanize = function(speed) {
      return Math.floor(speed * Math.random());
    }
   
    /* Add some mistakes to the text */
    var make_mistake = function(obj, next) {
      var chars = 'abcdefghiklmnopqrstuvwxyz';
     
      // Pick a random char
      var char = chars[Math.random() * chars.length];
     
      $(obj).text(obj.substring(0, next));
      $(obj).text(obj.substring(0, next-1));
    }

    /* Does the actual typing */
    var type = function(e, text, speed) {
      var jElem = $(e);
      var next = jElem.text().length + 1;

      if (next < text.length) {
        // TODO: Make a mistakes (like all humans do)
        //make_mistake(e, next);

        jElem.text(text.substr(0, next));

        setTimeout(function() {
          type(e, text, speed);
        }, humanize(speed));
      } 
    }

    return this.each(function() {
      var speed = speed_options[settings.speed];
      var jThis = $(this);
      var text = jThis.text();
      jThis.text('');

      type(this, text, speed);
    });
  }
})(jQuery);
