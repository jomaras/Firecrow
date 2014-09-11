;
(function (d) {
    var k = d.scrollTo = function (a, i, e) {
        d(window).scrollTo(a, i, e)
    };
    k.defaults = {
        axis: 'xy',
        duration: parseFloat(d.fn.jquery) >= 1.3 ? 0 : 1
    };
    k.window = function (a) {
        return d(window)._scrollable()
    };
    d.fn._scrollable = function () {
        return this.map(function () {
            var a = this,
                i = !a.nodeName || d.inArray(a.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) != -1;
            if (!i) return a;
            var e = (a.contentWindow || a).document || a.ownerDocument || a;
            return d.browser.safari || e.compatMode == 'BackCompat' ? e.body : e.documentElement
        })
    };
    d.fn.scrollTo = function (n, j, b) {
        if (typeof j == 'object') {
            b = j;
            j = 0
        }
        if (typeof b == 'function') b = {
            onAfter: b
        };
        if (n == 'max') n = 9e9;
        b = d.extend({}, k.defaults, b);
        j = j || b.speed || b.duration;
        b.queue = b.queue && b.axis.length > 1;
        if (b.queue) j /= 2;
        b.offset = p(b.offset);
        b.over = p(b.over);
        return this._scrollable().each(function () {
            var q = this,
                r = d(q),
                f = n,
                s, g = {}, u = r.is('html,body');
            switch (typeof f) {
            case 'number':
            case 'string':
                if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)) {
                    f = p(f);
                    break
                }
                f = d(f, this);
            case 'object':
                if (f.is || f.style) s = (f = d(f)).offset()
            }
            d.each(b.axis.split(''), function (a, i) {
                var e = i == 'x' ? 'Left' : 'Top',
                    h = e.toLowerCase(),
                    c = 'scroll' + e,
                    l = q[c],
                    m = k.max(q, i);
                if (s) {
                    g[c] = s[h] + (u ? 0 : l - r.offset()[h]);
                    if (b.margin) {
                        g[c] -= parseInt(f.css('margin' + e)) || 0;
                        g[c] -= parseInt(f.css('border' + e + 'Width')) || 0
                    }
                    g[c] += b.offset[h] || 0;
                    if (b.over[h]) g[c] += f[i == 'x' ? 'width' : 'height']() * b.over[h]
                } else {
                    var o = f[h];
                    g[c] = o.slice && o.slice(-1) == '%' ? parseFloat(o) / 100 * m : o
                } if (/^\d+$/.test(g[c])) g[c] = g[c] <= 0 ? 0 : Math.min(g[c], m);
                if (!a && b.queue) {
                    if (l != g[c]) t(b.onAfterFirst);
                    delete g[c]
                }
            });
            t(b.onAfter);

            function t(a) {
                r.animate(g, j, b.easing, a && function () {
                    a.call(this, n, b)
                })
            }
        }).end()
    };
    k.max = function (a, i) {
        var e = i == 'x' ? 'Width' : 'Height',
            h = 'scroll' + e;
        if (!d(a).is('html,body')) return a[h] - d(a)[e.toLowerCase()]();
        var c = 'client' + e,
            l = a.ownerDocument.documentElement,
            m = a.ownerDocument.body;
        return Math.max(l[h], m[h]) - Math.min(l[c], m[c])
    };

    function p(a) {
        return typeof a == 'object' ? a : {
            top: a,
            left: a
        }
    }
})(jQuery);
(function ($) {
    $.fn.hoverIntent = function (f, g) {
        var cfg = {
            sensitivity: 7,
            interval: 100,
            timeout: 0
        };
        cfg = $.extend(cfg, g ? {
            over: f,
            out: g
        } : f);
        var cX, cY, pX, pY;
        var track = function (ev) {
            cX = ev.pageX;
            cY = ev.pageY
        };
        var compare = function (ev, ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            if ((Math.abs(pX - cX) + Math.abs(pY - cY)) < cfg.sensitivity) {
                $(ob).unbind("mousemove", track);
                ob.hoverIntent_s = 1;
                return cfg.over.apply(ob, [ev])
            } else {
                pX = cX;
                pY = cY;
                ob.hoverIntent_t = setTimeout(function () {
                    compare(ev, ob)
                }, cfg.interval)
            }
        };
        var delay = function (ev, ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            ob.hoverIntent_s = 0;
            return cfg.out.apply(ob, [ev])
        };
        var handleHover = function (e) {
            var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;
            while (p && p != this) {
                try {
                    p = p.parentNode
                } catch (e) {
                    p = this
                }
            }
            if (p == this) {
                return false
            }
            var ev = jQuery.extend({}, e);
            var ob = this;
            if (ob.hoverIntent_t) {
                ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t)
            }
            if (e.type == "mouseover") {
                pX = ev.pageX;
                pY = ev.pageY;
                $(ob).bind("mousemove", track);
                if (ob.hoverIntent_s != 1) {
                    ob.hoverIntent_t = setTimeout(function () {
                        compare(ev, ob)
                    }, cfg.interval)
                }
            } else {
                $(ob).unbind("mousemove", track);
                if (ob.hoverIntent_s == 1) {
                    ob.hoverIntent_t = setTimeout(function () {
                        delay(ev, ob)
                    }, cfg.timeout)
                }
            }
        };
        return this.mouseover(handleHover).mouseout(handleHover)
    }
})(jQuery);
(function ($) {
    $.InFieldLabels = function (b, c, d) {
        var f = this;
        f.$label = $(b);
        f.label = b;
        f.$field = $(c);
        f.field = c;
        f.$label.data("InFieldLabels", f);
        f.showing = true;
        f.init = function () {
            f.options = $.extend({}, $.InFieldLabels.defaultOptions, d);
            if (f.$field.val() != "") {
                f.$label.hide();
                f.showing = false
            };
            f.$field.focus(function () {
                f.fadeOnFocus()
            }).blur(function () {
                f.checkForEmpty(true)
            }).bind('keydown.infieldlabel', function (e) {
                f.hideOnChange(e)
            }).change(function (e) {
                f.checkForEmpty()
            }).bind('onPropertyChange', function () {
                f.checkForEmpty()
            })
        };
        f.fadeOnFocus = function () {
            if (f.showing) {
                f.setOpacity(f.options.fadeOpacity)
            }
        };
        f.setOpacity = function (a) {
            f.$label.stop().animate({
                opacity: a
            }, f.options.fadeDuration);
            f.showing = (a > 0.0)
        };
        f.checkForEmpty = function (a) {
            if (f.$field.val() == "") {
                f.prepForShow();
                f.setOpacity(a ? 1.0 : f.options.fadeOpacity)
            } else {
                f.setOpacity(0.0)
            }
        };
        f.prepForShow = function (e) {
            if (!f.showing) {
                f.$label.css({
                    opacity: 0.0
                }).show();
                f.$field.bind('keydown.infieldlabel', function (e) {
                    f.hideOnChange(e)
                })
            }
        };
        f.hideOnChange = function (e) {
            if ((e.keyCode == 16) || (e.keyCode == 9)) return;
            if (f.showing) {
                f.$label.hide();
                f.showing = false
            };
            f.$field.unbind('keydown.infieldlabel')
        };
        f.init()
    };
    $.InFieldLabels.defaultOptions = {
        fadeOpacity: 0.5,
        fadeDuration: 300
    };
    $.fn.inFieldLabels = function (c) {
        return this.each(function () {
            var a = $(this).attr('for');
            if (!a) return;
            var b = $("input#" + a + "[type='text']," + "input#" + a + "[type='password']," + "textarea#" + a);
            if (b.length == 0) return;
            (new $.InFieldLabels(this, b[0], c))
        })
    }
})(jQuery);

function limitcharacters() {
    $('textarea').each(function () {
        var maxlimit = 200;
        var length = $(this).val().length;
        if (length >= maxlimit) {
            $(this).val($(this).val().substring(0, maxlimit));
            length = maxlimit
        }
        var characters = maxlimit - length;
        $(this).parent().find('span').html(characters);
        $(this).keyup(function () {
            var new_length = $(this).val().length;
            var charactersupdate = maxlimit - new_length;
            if (new_length >= maxlimit) {
                $(this).val($(this).val().substring(0, maxlimit));
                new_length = maxlimit
            }
            $(this).parent().find('span').html(charactersupdate)
        })
    })
};
(function ($, iphoneStyle) {
    $[iphoneStyle] = function (elem, options) {
        this.$elem = $(elem);
        var obj = this;
        $.each(options, function (key, value) {
            obj[key] = value
        });
        this.wrapCheckboxWithDivs();
        this.attachEvents();
        this.disableTextSelection();
        if (this.resizeHandle) {
            this.optionallyResize('handle')
        }
        if (this.resizeContainer) {
            this.optionallyResize('container')
        }
        this.initialPosition()
    };
    $.extend($[iphoneStyle].prototype, {
        wrapCheckboxWithDivs: function () {
            this.$elem.wrap('<div class="' + this.containerClass + '" />');
            this.container = this.$elem.parent();
            this.offLabel = $('<label class="' + this.labelOffClass + '">' + '<span>' + this.uncheckedLabel + '</span>' + '</label>').appendTo(this.container);
            this.offSpan = this.offLabel.children('span');
            this.onLabel = $('<label class="' + this.labelOnClass + '">' + '<span>' + this.checkedLabel + '</span>' + '</label>').appendTo(this.container);
            this.onSpan = this.onLabel.children('span');
            this.handle = $('<div class="' + this.handleClass + '">' + '<div class="' + this.handleRightClass + '">' + '<div class="' + this.handleCenterClass + '" />' + '</div>' + '</div>').appendTo(this.container)
        },
        disableTextSelection: function () {
            if (!$.browser.msie) {
                return
            }
            $.each([this.handle, this.offLabel, this.onLabel, this.container], function (el) {
                $(el).attr("unselectable", "on")
            })
        },
        optionallyResize: function (mode) {
            var onLabelWidth = this.onLabel.width(),
                offLabelWidth = this.offLabel.width(),
                newWidth = (onLabelWidth < offLabelWidth) ? onLabelWidth : offLabelWidth;
            if (mode == 'container') {
                newWidth += this.handle.width() + 15
            }
            this[mode].css({
                width: newWidth
            })
        },
        attachEvents: function () {
            var obj = this;
            this.container.bind('mousedown touchstart', function (event) {
                event.preventDefault();
                if (obj.$elem.is(':disabled')) {
                    return
                }
                var x = event.pageX || event.originalEvent.changedTouches[0].pageX;
                $[iphoneStyle].currentlyClicking = obj.handle;
                $[iphoneStyle].dragStartPosition = x;
                $[iphoneStyle].handleLeftOffset = parseInt(obj.handle.css('left'), 10) || 0
            }).bind('iPhoneDrag', function (event, x) {
                event.preventDefault();
                if (obj.$elem.is(':disabled')) {
                    return
                }
                var p = (x + $[iphoneStyle].handleLeftOffset - $[iphoneStyle].dragStartPosition) / obj.rightSide;
                if (p < 0) {
                    p = 0
                }
                if (p > 1) {
                    p = 1
                }
                obj.handle.css({
                    left: p * obj.rightSide
                });
                obj.onLabel.css({
                    width: p * obj.rightSide + 4
                });
                obj.offSpan.css({
                    marginRight: -p * obj.rightSide
                });
                obj.onSpan.css({
                    marginLeft: -(1 - p) * obj.rightSide
                })
            }).bind('iPhoneDragEnd', function (event, x) {
                if (obj.$elem.is(':disabled')) {
                    return
                }
                if ($[iphoneStyle].dragging) {
                    var p = (x - $[iphoneStyle].dragStartPosition) / obj.rightSide;
                    obj.$elem.attr('checked', (p >= 0.5));
                    if (obj.$elem.attr('checked')) {
                        $(this).parent().parent().find('.tick').fadeIn();
                        $(this).parent().parent().find('.toggle').addClass('checked')
                    } else {
                        $(this).parent().parent().find('.tick').fadeOut();
                        $(this).parent().parent().find('.toggle').removeClass('checked')
                    }
                } else {
                    obj.$elem.attr('checked', !obj.$elem.attr('checked'));
                    if (obj.$elem.attr('checked')) {
                        $(this).parent().parent().find('.tick').fadeIn();
                        $(this).parent().parent().find('.toggle').addClass('checked')
                    } else {
                        $(this).parent().parent().find('.tick').fadeOut();
                        $(this).parent().parent().find('.toggle').removeClass('checked')
                    }
                }
                $[iphoneStyle].currentlyClicking = null;
                $[iphoneStyle].dragging = null;
                obj.$elem.change()
            });
            this.$elem.change(function () {
                if (obj.$elem.is(':disabled')) {
                    obj.container.addClass(obj.disabledClass);
                    return false
                } else {
                    obj.container.removeClass(obj.disabledClass)
                }
                var new_left = obj.$elem.attr('checked') ? obj.rightSide : 0;
                obj.handle.animate({
                    left: new_left
                }, obj.duration);
                obj.onLabel.animate({
                    width: new_left + 4
                }, obj.duration);
                obj.offSpan.animate({
                    marginRight: -new_left
                }, obj.duration);
                obj.onSpan.animate({
                    marginLeft: new_left - obj.rightSide
                }, obj.duration)
            })
        },
        initialPosition: function () {
            this.offLabel.css({
                width: this.container.width()
            });
            var offset = ($.browser.msie && $.browser.version < 7) ? 3 : 6;
            this.rightSide = this.container.width() - this.handle.width();
            if (this.$elem.is(':checked')) {
                this.handle.css({
                    left: this.rightSide
                });
                this.onLabel.css({
                    width: this.rightSide
                });
                this.offSpan.css({
                    marginRight: -this.rightSide
                })
            } else {
                this.onLabel.css({
                    width: 0
                });
                this.onSpan.css({
                    marginLeft: -this.rightSide
                })
            } if (this.$elem.is(':disabled')) {
                this.container.addClass(this.disabledClass)
            }
        }
    });
    $.fn[iphoneStyle] = function (options) {
        var checkboxes = this.filter(':checkbox');
        if (!checkboxes.length) {
            return this
        }
        var opt = $.extend({}, $[iphoneStyle].defaults, options);
        checkboxes.each(function () {
            $(this).data(iphoneStyle, new $[iphoneStyle](this, opt))
        });
        if (!$[iphoneStyle].initComplete) {
            $("#checklist").bind('mousemove touchmove', function (event) {
                if (!$[iphoneStyle].currentlyClicking) {
                    return
                }
                event.preventDefault();
                var x = event.pageX || event.originalEvent.changedTouches[0].pageX;
                if (!$[iphoneStyle].dragging && (Math.abs($[iphoneStyle].dragStartPosition - x) > opt.dragThreshold)) {
                    $[iphoneStyle].dragging = true
                }
                $(event.target).trigger('iPhoneDrag', [x])
            }).bind('mouseup touchend', function (event) {
                if (!$[iphoneStyle].currentlyClicking) {
                    return
                }
                event.preventDefault();
                var x = event.pageX || event.originalEvent.changedTouches[0].pageX;
                $($[iphoneStyle].currentlyClicking).trigger('iPhoneDragEnd', [x])
            });
            $[iphoneStyle].initComplete = true
        }
        return this
    };
    $[iphoneStyle].defaults = {
        duration: 200,
        checkedLabel: 'YES',
        uncheckedLabel: 'NO',
        resizeHandle: false,
        resizeContainer: false,
        disabledClass: 'iPhoneCheckDisabled',
        containerClass: 'iPhoneCheckContainer',
        labelOnClass: 'iPhoneCheckLabelOn',
        labelOffClass: 'iPhoneCheckLabelOff',
        handleClass: 'iPhoneCheckHandle',
        handleCenterClass: 'iPhoneCheckHandleCenter',
        handleRightClass: 'iPhoneCheckHandleRight',
        dragThreshold: 5
    }
})(jQuery, 'iphoneStyle');

$(document).ready(function () {
    textboxes = $("input[type=text]");
    if ($.browser.mozilla) {
        $(textboxes).keypress(checkForEnter)
    } else {
        $(textboxes).keydown(checkForEnter)
    }

    function checkForEnter(event) {
        if (event.keyCode == 13) {
            currentTextboxNumber = textboxes.index(this);
            if (textboxes[currentTextboxNumber + 1] != null) {
                nextTextbox = textboxes[currentTextboxNumber + 1];
                nextTextbox.select()
            }
            event.preventDefault();
            return false
        }
    }

    function evaluate_form() {
        var query_string = new String();
        yes_questions = 0;
        all_questions = 0;
        $("#checklist").find('input:checkbox').each(function (i) {
            if (!$(this).parent().parent().parent().hasClass('disabled')) {
                all_questions += 1;
                if ($(this).attr('checked')) {
                    yes_questions += 1
                }
            }
        });
        if (yes_questions == all_questions) {
            data = "<h3><span>Status:</span> Go for Launch</h3><h4>All items checked</h4>"
        } else {
            data = "<h3><span>Status:</span> Launch not advisable</h3><h4>" + (all_questions - yes_questions) + " of " + all_questions + " items remain unchecked</h4>"
        }
        $('#status').html(data)
    }
    $('input:checkbox').change(function () {
        evaluate_form()
    });
    evaluate_form();

    function sendSuccessNotification(data) {
        $('#message, #screen').delay(1200).fadeOut().removeClass('active');
        container_height = $('#container').height();
        $('#container').css('padding-bottom', '5px');
        $('html').css('height', '100%');
        $('#project-details').slideUp(1000);
        $('#checklist').slideUp(1000);
        $('#checklist-end').slideUp(1000);
        $('#container').append(data);
        $('#success').delay(800).fadeIn(1000)
    }

    function sendErrorNotification(data) {
        $('#message').css({
            'width': '360px',
            'height': '260px'
        }).fadeIn().append(data);
        $('#loading').hide();
        $('#error, #message .close').fadeIn()
    }

    function submitReportHover() {
        $('#submit-report button').append('<span class="hover"></span>').each(function () {
            var $span = $('> span.hover', this).css('opacity', 0);
            $(this).hover(function () {
                $span.stop().fadeTo(300, 1)
            }, function () {
                $span.stop().fadeTo(300, 0)
            })
        })
    }
    submitReportHover();

    function submitReportOnClick() {
        $('#submit-report button').click(function () {
            if (!$('#screen').hasClass('active')) {
                $('#screen').fadeTo('slow', 0.8).addClass('active')
            } else {
                $('#modal').slideUp(800)
            }
            $('#status-message').fadeTo('slow', 1).addClass('active');
            $('#message').css({
                'width': '160px',
                'height': '160px'
            });
            $('#loading').fadeIn();
            var query_string = new String();
            $("#project-details").find(':input:not(:checkbox)').each(function (i) {
                if ($(this).hasClass('email-address')) {
                    var email = $(this).val();
                    if (isValidEmailAddress(email)) {
                        query_string += "&" + this.name + "=" + $(this).val()
                    }
                } else {
                    if ($(this).val() != "") {
                        query_string += "&" + this.name + "=" + $(this).val()
                    }
                }
            });
            if ($('#updates').is(':checked')) {
                query_string += "&updates=True"
            } else {
                query_string += "&updates=False"
            }
            $("#checklist").find(':input:not(:checkbox)').each(function (i) {
                question_name = $(this).val().replace(/&/g, "%26");
                query_string += "&" + this.name + "=" + question_name
            });
            var completed_items = 0;
            $("#checklist").find('input:checkbox').each(function (i) {
                query_string += "&" + this.name + "=";
                if ($(this).parent().parent().parent().hasClass('disabled')) {
                    query_string += "N/A"
                } else if ($(this).attr('checked')) {
                    completed_items += 1;
                    query_string += "Yes"
                } else {
                    query_string += "No"
                }
            });
            if (completed_items < 5 || $('#your-name').val() == '' || $('#your-email').val() == '' || $('#project-name').val() == '' || $('#website-url').val() == '' || $('#website-url').val() == 'http://') {
                notification = "<div id=\"error\" style=\"display:none;\"><h2>Error</h2><div><p>Sorry, there was an error with your submission.</p><p>";
                if ($('#your-name').val() == '') {
                    notification += "Please provide your name.<br />"
                }
                if ($('#your-email').val() == '') {
                    notification += "Please provide your email address.<br />"
                }
                if ($('#project-name').val() == '') {
                    notification += "Please provide a project name.<br />"
                }
                if ($('#website-url').val() == ('http://' || '')) {
                    notification += "Please provide a valid website URL.<br />"
                }
                if ($("#checklist input:checked").length < 5) {
                    notification += "At least 5 items must be checked<br /> in order to send the report.<br />"
                }
                notification += "</p></div></div>";
                sendErrorNotification(notification)
            } else {
                $.ajax({
                    type: "POST",
                    url: "php/send.php",
                    data: query_string,
                    success: function (data) {
                        sendSuccessNotification(data)
                    }
                })
            }
            $(this).replaceWith('<div id="static-btn"></div>')
        })
    }
    submitReportOnClick();
    $("#subscribe span").click(function () {
        $(this).toggleClass('checked');
        $(this).parent().find('#updates').trigger("click")
    });
    $("#subscribe label").click(function () {
        $('#subscribe span').toggleClass('checked')
    });
    $(function () {
        $("#details label").inFieldLabels()
    });
    $('span.add-recipient').click(function () {
        $(this).addClass('inactive');
        $(this).parent().parent().next().fadeIn();
        $(this).parent().parent().next().css('display', 'block')
    });
    $('span.remove-recipient').click(function () {
        $(this).parent().parent().prev().find('.add-recipient').removeClass('inactive');
        $(this).parent().parent().fadeOut().find('input').val('').focus().blur()
    });
    $('#checklist :checkbox').iphoneStyle();

    function hoveroptions() {
        limitcharacters();
        $("#checklist .field").hoverIntent(function () {
            $(this).find('.options').fadeIn(300)
        }, function () {
            $(this).find('.options').fadeOut(300)
        });
        $('.comments').toggle(function () {
            if (!$(this).parent().parent().hasClass('disabled')) {
                $(this).parent().parent().find('.comment-area').addClass('exposed').fadeIn()
            }
            return false
        }, function () {
            if (!$(this).parent().parent().hasClass('disabled')) {
                $(this).parent().parent().find('.comment-area').removeClass('exposed').fadeOut()
            }
            return false
        });
        $('.na').toggle(function () {
            $(this).parent().parent().addClass('disabled');
            $(this).parent().parent().find('p.league').after('<span class="na-text league">N/A</span>');
            $(this).parent().parent().find('.toggle').fadeOut();
            if ($(this).parent().parent().find('.comment-area').hasClass('exposed')) {
                $(this).parent().parent().find('.comment-area').fadeOut()
            }
            if ($(this).parent().parent().find('.toggle').hasClass('checked')) {
                $(this).parent().parent().find('.tick').fadeOut()
            }
            evaluate_form();
            return false
        }, function () {
            $(this).parent().parent().removeClass('disabled');
            $(this).parent().parent().find('.na-text').remove();
            $(this).parent().parent().find('.toggle').fadeIn();
            $(this).parent().parent().find('.toggle').css('display', 'block');
            if ($(this).parent().parent().find('.comment-area').hasClass('exposed')) {
                $(this).parent().parent().find('.comment-area').fadeIn()
            }
            if ($(this).parent().parent().find('.toggle').hasClass('checked')) {
                $(this).parent().parent().find('.tick').fadeIn()
            }
            evaluate_form();
            return false
        })
    }
    hoveroptions();
    $('#website-url').focusout(function () {
        var url = $('#website-url').val();
        if (url != 'http://') {
            $('.magic-btn').fadeIn();
            $('.html-check').attr('href', 'http://validator.w3.org/check?uri=' + url + '&charset=(detect+automatically)&doctype=Inline&group=0url');
            $('.css-check').attr('href', 'http://jigsaw.w3.org/css-validator/validator?uri=' + url + '&profile=css3&usermedium=all&warning=1&lang=en');
            $('.link-check').attr('href', 'http://validator.w3.org/checklink?uri=' + url + '&hide_type=all&depth=&check=Check')
        }
    });
    $('.backup-check').show().attr('href', 'http://www.backupmachine.com/a/launchlist/');
    $('.monitor-check').show().attr('href', 'https://www.pingdom.com/free');
    $('#add-field-btn').click(function () {
        if ($('.field.custom').length < 10) {
            $('#checklist').append('<div class="field custom" id="' + question_number + '_field"><p class="league edit">Field title - click to edit</p><div class="toggle"><input type="checkbox" name="' + question_number + '_answer" /></div><input type="hidden" name="' + question_number + '_question" value="" /><div class="comment-area" style="display:none"><p>Comments:</p><p class="chars"><span></span> characters remaining</p><textarea name="' + question_number + '_comments"></textarea></div><span class="tick" style="display: none"></span><div class="options" style="display: none"><a href="#" class="na" title="N/A">N/A</a><a href="#" class="comments" title="Add a comment">Add a comment</a></div></div>');
            $("body").attr({
                scrollTop: $("body").attr("scrollHeight")
            });
            $('#' + question_number + '_field :checkbox').iphoneStyle();
            question_number += 1;
            evaluate_form();
            hoveroptions();
            $('input:checkbox').change(function () {
                evaluate_form()
            });
            $('#max-fields').fadeIn();
            var fieldsremain = 10 - ($('.field.custom').length);
            $('#max-fields span').html(fieldsremain);
            $(".edit").click(function () {
                if ($(this).children('input').length == 0) {
                    var inputbox = "<input type='text' class='editinplace' value=\"" + $(this).text() + "\">";
                    $(this).html(inputbox);
                    $(this).find('input').focus();
                    $(this).find('input').blur(function () {
                        var value = $(this).val();
                        if (value == '') {
                            $(this).parent().parent().find('input:hidden').val('');
                            $(this).parent().text('Field title - click to edit')
                        } else {
                            $(this).parent().parent().find('input:hidden').val(value);
                            $(this).parent().text(value)
                        }
                    });
                    $(this).keypress(function (event) {
                        if (event.keyCode == '13') {
                            $(this).find('input').blur()
                        }
                    })
                }
            })
        } else {
            $('#max-fields').html('Maximum fields reached.')
        }
        return false
    });
    $('.modal').click(function () {
        modalcontent = $(this).attr('href');
        pos = $(modalcontent).index() * -740;
        if (!$('#screen').hasClass('active')) {
            $('#screen').fadeTo('slow', 0.8).addClass('active');
            $('#modal').slideDown(800);
            $('#modal .close').delay(800).fadeIn();
            $('#modal ul').css('margin-left', pos + 'px');
            $('#screen, #modal').addClass('active')
        } else {
            $('#modal ul').animate({
                'margin-left': pos
            }, {
                'duration': 1000
            })
        }
        return false
    });
    $('.close').click(function () {
        $('#screen').fadeOut().removeClass('active');
        $(this).hide();
        if ($('#modal').hasClass('active')) {
            $('#modal').slideUp(800).removeClass('active')
        }
        if ($('#status-message').hasClass('active')) {
            $('#status-message').fadeOut().removeClass('active');
            if ($('#success').length == 0) {
                $('#static-btn').replaceWith('<button type="submit">Submit Report</button>')
            }
            submitReportOnClick();
            submitReportHover();
            $('#error').delay(1200).remove()
        }
        return false
    });
});
$('#modal, #screen').click(function () {
    if ($('#modal').hasClass('active')) {
        $('#screen').fadeOut().removeClass('active');
        $('#modal').slideUp(800).removeClass('active');
    }
});
$('#content').click(function (event) {
    event.stopPropagation();
});