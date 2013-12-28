/*
Html2Xhtml : Javascript Mini HTML to XHTML Parser 
-------------------------------------------------

Current version: 0.3

Copyright  2006 All rights reserved. Jacob Lee <letsgolee@lycos.co.kr>

Free for non-commercial && commercial use.
*/
function getXHTML(data) {
    return new Html2Xhtml(data).parse()
};

function Html2Xhtml(data) {
    this.data = data || ''
};
Html2Xhtml.prototype.setHTML = function (data) {
    this.data = data || this.data
};
Html2Xhtml.prototype.parse = function () {
    var state = 0;
    var xhtml = '';
    var p = 0;
    var unget = false;
    var tagname = '';
    var attrname = '';
    var attrval = '';
    var quot = '';
    var data = this.data;
    var len = data.length;
    var phpval = '';
    var tagtype = 0;
    var insidepre = false;
    var codetype = '';
    while (1) {
        if (p >= len && !unget) {
            return xhtml
        }
        if (unget) {
            unget = false
        } else {
            var c = data.substr(p++, 1)
        }
        switch (state) {
        case 0:
            if (c == '<') {
                state = 1;
                break
            }
            xhtml += c;
            break;
        case 1:
            if (/[a-zA-Z]/.test(c)) {
                state = 2;
                tagtype = 1;
                tagname = c.toLowerCase();
                break
            }
            if (c == '/') {
                state = 2;
                tagtype = -1;
                break
            }
            if (c == '!') {
                if (data.substr(p, 2) == '--') {
                    xhtml += '<!--';
                    p += 2;
                    state = 9;
                    break
                }
                xhtml += '<!';
                state = 10;
                break
            }
            if (c == '?' || c == '%') {
                codetype = c;
                state = 11;
                xhtml += '<' + c;
                break
            }
            xhtml += '&lt;';
            unget = true;
            state = 0;
            break;
        case 2:
            if (Html2Xhtml.isSpaceChar[c]) {
                xhtml += (!insidepre && tagtype > 0 && Html2Xhtml.hasNLBefore[tagname] && xhtml.length && xhtml.substr(xhtml.length - 1, 1) != '\n' ? '\n' : '') + (tagtype > 0 ? '<' : '</') + tagname;
                state = 3;
                break
            }
            if (c == '/') {
                xhtml += (!insidepre && tagtype > 0 && Html2Xhtml.hasNLBefore[tagname] && xhtml.length && xhtml.substr(xhtml.length - 1, 1) != '\n' ? '\n' : '') + (tagtype > 0 ? '<' : '</') + tagname;
                if (data.substr(p, 1) != '>') {
                    state = 3;
                    break
                }
                state = 4;
                break
            }
            if (c == '>') {
                xhtml += (!insidepre && tagtype > 0 && Html2Xhtml.hasNLBefore[tagname] && xhtml.length && xhtml.substr(xhtml.length - 1, 1) != '\n' ? '\n' : '') + (tagtype > 0 ? '<' : '</') + tagname;
                unget = true;
                state = 4;
                break
            }
            tagname += c.toLowerCase();
            break;
        case 3:
            if (Html2Xhtml.isSpaceChar[c]) {
                break
            }
            if (c == '/') {
                if (data.substr(p, 1) != '>') {
                    break
                }
                state = 4;
                break
            }
            if (c == '>') {
                unget = true;
                state = 4;
                break
            }
            attrname = c.toLowerCase();
            attrval = '';
            state = 5;
            break;
        case 4:
            xhtml += (Html2Xhtml.isEmptyTag[tagname] ? ' />' : '>') + (!insidepre && tagtype < 0 && Html2Xhtml.hasNLAfter[tagname] && p < len && data.substr(p, 1) != '\n' ? '\n' : '');
            if (tagtype > 0 && Html2Xhtml.dontAnalyzeContent[tagname]) {
                state = 13;
                attrname = attrval = quot = '';
                tagtype = 0;
                break
            }
            if (tagname == 'pre') {
                insidepre = !insidepre
            }
            state = 0;
            tagname = attrname = attrval = quot = '';
            tagtype = 0;
            break;
        case 5:
            if (Html2Xhtml.isSpaceChar[c]) {
                xhtml += ' ' + attrname;
                if (Html2Xhtml.isEmptyAttr[attrname]) {
                    xhtml += '="' + attrname + '"'
                }
                state = 3;
                break
            }
            if (c == '/') {
                xhtml += ' ' + attrname;
                if (Html2Xhtml.isEmptyAttr[attrname]) {
                    xhtml += '="' + attrname + '"'
                }
                if (data.substr(p, 1) != '>') {
                    state = 3;
                    break
                }
                state = 4;
                break
            }
            if (c == '>') {
                xhtml += ' ' + attrname;
                if (Html2Xhtml.isEmptyAttr[attrname]) {
                    xhtml += '="' + attrname + '"'
                }
                unget = true;
                state = 4;
                break
            }
            if (c == '=') {
                xhtml += ' ' + attrname + '=';
                state = 6;
                break
            }
            if (c == '"' || c == "'") {
                attrname += '?'
            } else {
                attrname += c.toLowerCase()
            }
            break;
        case 6:
            if (Html2Xhtml.isSpaceChar[c]) {
                xhtml += (Html2Xhtml.isEmptyAttr[attrname] ? '"' + attrname + '"' : '""');
                state = 3;
                break
            }
            if (c == '>') {
                xhtml += (Html2Xhtml.isEmptyAttr[attrname] ? '"' + attrname + '"' : '""');
                unget = true;
                state = 4;
                break
            }
            if (c == '/' && data.substr(p, 1) == '>') {
                xhtml += (Html2Xhtml.isEmptyAttr[attrname] ? '"' + attrname + '"' : '""');
                state = 4;
                break
            }
            if (c == '"' || c == "'") {
                quot = c;
                state = 8;
                break
            }
            attrval = c;
            state = 7;
            break;
        case 7:
            if (Html2Xhtml.isSpaceChar[c]) {
                xhtml += '"' + Html2Xhtml.escapeQuot(attrval, '"') + '"';
                state = 3;
                break
            }
            if (c == '/' && data.substr(p, 1) == '>') {
                xhtml += '"' + Html2Xhtml.escapeQuot(attrval, '"') + '"';
                state = 4;
                break
            }
            if (c == '>') {
                unget = true;
                xhtml += '"' + Html2Xhtml.escapeQuot(attrval, '"') + '"';
                state = 4;
                break
            }
            attrval += c;
            break;
        case 8:
            if (c == quot) {
                xhtml += '"' + Html2Xhtml.escapeQuot(attrval, '"') + '"';
                state = 3;
                break
            }
            attrval += c;
            break;
        case 9:
            if (c == '-' && data.substr(p, 2) == '->') {
                p += 2;
                xhtml += '-->';
                state = 0;
                break
            }
            xhtml += c;
            break;
        case 10:
            if (c == '>') {
                state = 0
            }
            xhtml += c;
            break;
        case 11:
            if (c == "'" || c == '"') {
                quot = c;
                state = 12;
                break
            }
            if (c == codetype && data.substr(p, 1) == '>') {
                state = 0;
                xhtml += c + '>';
                codetype = '';
                p++;
                break
            }
            xhtml += c;
            break;
        case 12:
            if (c == quot) {
                state = 11;
                xhtml += quot + Html2Xhtml.escapeQuot(phpval, quot) + quot;
                phpval = quot = '';
                break
            }
            phpval += c;
            break;
        case 13:
            if (c == '<' && data.substr(p, tagname.length + 1).toLowerCase() == '/' + tagname) {
                unget = true;
                state = 0;
                tagname = '';
                break
            }
            if (tagname == 'textarea') {
                xhtml += Html2Xhtml.escapeHTMLChar(c)
            } else {
                xhtml += c
            }
            break
        }
    }
    return xhtml
};
Html2Xhtml.escapeQuot = function (str, quot) {
    if (!quot) {
        quot = '"'
    }
    if (quot == '"') {
        return str.replace(/"/ig, '\\"')
    }
    return str.replace(/'/ig, "\\'")
};
Html2Xhtml.escapeHTMLChar = function (c) {
    if (c == '&') {
        return '&amp;'
    }
    if (c == '<') {
        return '&lt;'
    }
    if (c == '>') {
        return '&gt;'
    }
    return c
};
Html2Xhtml.isSpaceChar = {
    ' ': 1,
    '\r': 1,
    '\n': 1,
    '\t': 1
};
Html2Xhtml.isEmptyTag = {
    'area': 1,
    'base': 1,
    'basefont': 1,
    'br': 1,
    'hr': 1,
    'img': 1,
    'input': 1,
    'link': 1,
    'meta': 1,
    'param': 1
};
Html2Xhtml.isEmptyAttr = {
    'checked': 1,
    'compact': 1,
    'declare': 1,
    'defer': 1,
    'disabled': 1,
    'ismap': 1,
    'multiple': 1,
    'noresize': 1,
    'nosave': 1,
    'noshade': 1,
    'nowrap': 1,
    'readonly': 1,
    'selected': 1
};
Html2Xhtml.hasNLBefore = {
    'div': 1,
    'p': 1,
    'table': 1,
    'tbody': 1,
    'tr': 1,
    'td': 1,
    'th': 1,
    'title': 1,
    'head': 1,
    'body': 1,
    'script': 1,
    'comment': 1,
    'li': 1,
    'meta': 1,
    'h1': 1,
    'h2': 1,
    'h3': 1,
    'h4': 1,
    'h5': 1,
    'h6': 1,
    'hr': 1,
    'ul': 1,
    'ol': 1,
    'option': 1,
    'link': 1
};
Html2Xhtml.hasNLAfter = {
    'html': 1,
    'head': 1,
    'body': 1,
    'p': 1,
    'th': 1,
    'style': 1
};
Html2Xhtml.dontAnalyzeContent = {
    'textarea': 1,
    'script': 1,
    'style': 1
};