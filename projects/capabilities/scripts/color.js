function color(r, g, b) {
    function value(value){
        var val = parseInt(value);
        if(!($.isNumber(val) && val >= 0 && val <= 255))
            throw $.exception("arg", $.str.format("at $.color({0},{1},{2})", r, g, b));
        return val;
    }
    this._red = value(r);
    this._green = value(g);
    this._blue = value(b);
}

color.prototype = {
    red: function(){ return this._red; },
    green: function(){ return this._green; },
    blue: function(){ return this._blue; },
    add: function(other) {
        function v(n){ return (n > 255) ? 255 : n; }
        var r = v(this.red() + other.red()),
            g = v(this.green() + other.green()),
            b = v(this.blue() + other.blue());
        return $.color(r, g, b);
    },
    subtract: function(other) {
        function v(n){ return Math.abs(n); }
        var r = v(this.red() - other.red()),
            g = v(this.green() - other.green()),
            b = v(this.blue() - other.blue());
        return $.color(r, g, b);
    },
    multiply: function(other) {
        function v(n){ return (n > 255) ? 255 : n; }
        var r = v(this.red() * other.red()),
            g = v(this.green() * other.green()),
            b = v(this.blue() * other.blue());
        return $.color(r, g, b);
    },
    divide: function(other) {
        function v(n){ return isNaN(n) ? 0 : n; }
        var r = v(this.red() / other.red()),
            g = v(this.green() / other.green()),
            b = v(this.blue() / other.blue());
        return $.color(r, g, b);
    },
    and: function(other) {
        function v(n){ return isNaN(n) ? 0 : n; }
        var r = v(this.red() && other.red()),
            g = v(this.green() && other.green()),
            b = v(this.blue() && other.blue());
        return $.color(r, g, b);
    },
    or: function(other) {
        function v(n){ return isNaN(n) ? 0 : n; }
        var r = v(this.red() || other.red()),
            g = v(this.green()|| other.green()),
            b = v(this.blue() || other.blue());
        return $.color(r, g, b);
    },
    mix: function(other){
        function v(c1, c2){
            var c3 =  parseInt(c1 + (Math.abs(c1 - c2) / 2));
            return c3 > 255 ? 255 : c3 < 0 ? 0 : c3;
        }
        return $.color(v(this.red(), other.red()),
                       v(this.green(), other.green()),
                       v(this.blue(), other.blue()));
    },
    equals: function(other) {
        return (this.red() == other.red()) &&
                (this.green() == other.green()) &&
                (this.blue() == other.blue());
    },
    toHex: function(unit){
        function v(v){
            var h = (new Number(v)).toString(16),
                value = /[\dA-F]{2}/i.test(h) ? h : "0" + h;
            return value;
        }
        var u = unit || "0x";
        return $.str.format("{0}{1}{2}{3}", u, v(this.red()), v(this.green()), v(this.blue()));
    },
    toCSS: function() { return this.toHex("#"); },
    toRGB: function() { return $.str.format("rgb({0},{1},{2})", this.red(), this.green(), this.blue()); },
    toNumber: function() { return parseInt(this.toHex()); }
}
$.ext(color, $.Class);
$.color = function(r, g, b) { return new color(r, g, b); }

$.color.canParse = function(value){
    if($.isString(value) && /\D/.test(value))
        return /^[#(0x)][\dA-F]{6}$/i.test(value) ||
                /^rgb\(\d{1,3}\,\s?\d{1,3}\,\s?\d{1,3}\)$/i.test(value);
    var val = parseInt(value);
    return $.isNumber(val) && val >= 0 && val <= 16777215;
},
$.color.parse = function(v) {
    if(v instanceof color) return v;
    var val = parseInt(v);
    if ($.isNumber(val) && val >= 0 && val <= 16777215) return color_parseNumber(val); 
    if (/^#[\dA-F]{6}$/i.test(v)) return color_parseCss(v);
    if (/^0x[\dA-F]{6}$/i.test(v)) return color_parseEcma(v);
    if (/^rgb/.test(v)) return color_parseRgb(v);
    return null;
}
function color_parseNumber(value) { return color_parseEcma((new Number(value)).toString(16)); }
function color_parseRgb(value) { 
    var v = value.replace(/[rgb\(\)\s]/g, "").split(",");
    return $.color(v[0], v[1], v[2]);
}
function color_parseCss(value) { return color_parseHex(/^#/, value) }
function color_parseEcma(value) { return color_parseHex(/^0x/, value) }
function color_parseHex(regex, value) {
    var val = value.replace(regex, "");
    return color_createFromHex(val.substr(0,2),val.substr(2,2),val.substr(4,2));
}
function color_createFromHex(r, g, b) {
    function v(value){ return $.isNullOrEmpty(value) ? 0 : $.str.format("0x{0}", value); }
    return $.color(parseInt(v(r)),parseInt(v(g)),parseInt(v(b))); 
}
