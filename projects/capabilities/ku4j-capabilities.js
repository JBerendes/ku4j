(function($){
if(!$) $ = {};
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


function coord(x, y) {
    if (!$.isNumber(x) || !$.isNumber(y))
        throw $.exception("arg", $.str.format("at $.coord({0},{1})", x, y));
        
    coord.base.call(this);
    this.x(x).y(y);
}

coord.prototype = {
    x: function(x){ return this.property("x", x); },
    y: function(y){ return this.property("y", y); },
    abs: function(){
        return $.coord(Math.abs(this._x), Math.abs(this._y));
    },
    add: function(other) {
        var x = this._x + other.x(),
            y = this._y + other.y();
        return $.coord(x,y);
    },
    divide: function(other) {
        var x = this._x / other.x(),
            y = this._y / other.y();
        return $.coord(x, y);
    },
    equals: function(other) {
        return (other instanceof coord) &&
            ((this._x === other.x()) && (this._y === other.y()));
    },
    multiply: function(other) {
        var x = this._x * other.x(),
            y = this._y * other.y();
        return $.coord(x, y);
    },
    subtract: function(other) {
        var x = this._x - other.x(),
            y = this._y - other.y();
        return $.coord(x, y);
    },
    round: function(decimal){
        var d = decimal || 0;
        return $.coord($.math.round(this.x(), d), $.math.round(this.y(), d));
    },
    isAbove: function(other) { return this.y() < other.y(); },
    isBelow: function(other) { return this.y() > other.y(); },
    isLeftOf: function(other) { return this.x() < other.x(); },
    isRightOf: function(other) { return this.x() > other.x(); },
    distanceFrom: function(other) { return new $.vector(this.x() - other.x(), this.y() - other.y()); },
    distanceTo: function(other) { return this.distanceFrom(other).invert(); },
    half: function(){ return this.divide($.coord(2, 2)); },
    value: function() { return { x: this._x, y: this._y }; },
    toEm: function() { return coord_toUnit(this, "em"); },
    toPixel: function() { return coord_toUnit(this, "px"); },
    toString: function() { return $.str.format("({0},{1})", this._x, this._y); }    
}
$.ext(coord, $.Class);

function coord_toUnit(coord, unit) {
    return {
        x: function() { return coord.x() + unit; },
        y: function() { return coord.y() + unit; }
    }
}

$.coord = function(x, y) { return new coord(x, y); }
$.coord.Class = coord;
$.coord.zero = function(){ return $.coord(0,0); }
$.coord.canParse = function(o){
    try{
        if (("left" in o) && ("top" in o))
            return !isNaN(o.left) && !isNaN(o.top);
        if (("width" in o) && ("height" in o))
            return !isNaN(o.width) && !isNaN(o.height);
        return false;
    }
    catch(e) { return false; }
}
$.coord.random = function(seedx, seedy){
    var x = seedx * Math.random(), y = seedy * Math.random(seedy);
    return $.coord(x, y);
}
$.coord.parse = function(o) {
    if (("left" in o) && ("top" in o)) return $.coord(o.left, o.top);
    if (("width" in o) && ("height" in o)) return $.coord(o.width, o.height);
    return null;
}
$.coord.tryParse = function(o){
    return $.coord.canParse(o)
        ? $.coord.parse(o)
        : null;
}

function dayPoint(year, month, date, hours, minutes, seconds, milliseconds) {
    if ((month < 1) || (month > 12)) throw new $.exception("arg", "Invalid month at $.dayPoint");
    if ((date < 1) || (date > dayPoint_findDaysInMonth(month, year))) throw new $.exception("arg", "Invalid date at $.dayPoint");
    
    this._value = (arguments.length >= 3)
        ? new Date(year, month - 1, date, hours || 0, minutes || 0, seconds || 0, milliseconds || 0)
        : new Date();
        
    var v = this._value;
    function formatTime(t){ return t < 10 ? "0" + t : "" + t; }
    
    this._day = v.getDay();
    this._date = date;
    this._month = month;
    this._year = year;
    this._hour = formatTime(v.getHours());
    this._minute = formatTime(v.getMinutes());
    this._second = formatTime(v.getSeconds());
    this._millisecond = formatTime(v.getMilliseconds());
    
    var d = this._day;
    this._isWeekday = d > 0 && d < 6;
    this._isWeekend = !this._isWeekday;
}

dayPoint.prototype = {
    value: function(){ return this._value; },

    day: function(){ return this._day; },
    date: function(){ return this._date; },
    month: function(){ return this._month; },
    year: function(){ return this._year; },
    hour: function(){ return this._hour; },
    minute: function(){ return this._minute; },
    second: function(){ return this._second; },
    millisecond: function(){ return this._millisecond; },
    isWeekday: function(){ return this._isWeekday; },
    isWeekend: function(){ return this._isWeekend; },
    
    equals: function(other) { return this._value == other.value(); },
    nextDay: function() { return dayPoint_createDay(this, 1, 0, 0); },
    prevDay: function() { return dayPoint_createDay(this, -1, 0, 0); },
    nextMonth: function() { return dayPoint_createDay(this, 0, 1, 0); },
    prevMonth: function() { return dayPoint_createDay(this, 0, -1, 0); },
    nextYear: function() { return dayPoint_createDay(this, 0, 0, 1); },
    prevYear: function() { return dayPoint_createDay(this, 0, 0, -1); },
    add: function(years, months, days) {
        function a(x, n, method) {
            var d = x, c = n;
            while(c--) d = d[method]();
            return d;
        }
        var b = years < 0,
            abs = Math.abs,
            y = abs(years),
            d = abs(days),
            m = abs(months),
            ym = b ? "prevYear" : "nextYear",
            dm = b ? "prevDay" : "nextDay",
            mm = b ? "prevMonth" : "nextMonth";
        return a(a(a(this, y, ym), m, mm), d, dm);
    },
    firstDayOfMonth: function() { return new dayPoint(this._year, this._month, 1); },
    lastDayOfMonth: function() { return new dayPoint(this._year, this._month, dayPoint_findDaysInMonth(this._month, this._year)); },
    isBefore: function(other) { return !(this.isAfter(other) || this.equals(other)); },
    isAfter: function(other) {
        var ty = this._year,
            oy = other.year(),
            tm = this._month,
            om = other.month();
        if (ty > oy) return true;
        if ((ty == oy) && (tm > om)) return true;
        if ((ty == oy) && (tm == om) && (this._date > other.date())) return true;
        return false;
    },
    equals: function(other) {
        return (this._year == other.year()) && (this._month == other.month()) && (this._date == other.date());
    },
    toString: function() {
        var y = this._year, m = this._month, d = this._date,
            f = (m < 10 && d < 10) ? "0{1}/0{2}/{0}" : 
                (m < 10) ? "0{1}/{2}/{0}" :
                (d < 10) ? "{1}/0{2}/{0}" : "{1}/{2}/{0}";
        return $.str.format(f, y, m, d);
    },
    toDate: function() { return this.value(); }
}

$.dayPoint = function(year, month, date, hours, minutes, seconds, milliseconds){
    if(!($.isDate(year) ||
         ($.isNumber(year) &&
          $.isNumber(month) &&
          $.isNumber(date)))) return null;
    return new dayPoint(year, month, date, hours, minutes, seconds, milliseconds);
}
$.dayPoint.canParse = function(v) {
    return ($.isString(v) ||
            $.isNumber(v) ||
            $.isDate(v))
        ? !isNaN(new Date(v).valueOf())
        : false;
}
$.dayPoint.parse = function(v) {
        if (v instanceof dayPoint) return v;
        if (!($.isDate(v) || this.canParse(v))) return null;

        var D = new Date(v),
            y = D.getFullYear(),
            m = D.getMonth() + 1,
            d = D.getDate(),
            h = D.getHours(),
            M = D.getMinutes(),
            s = D.getSeconds(),
            ms = D.getMilliseconds();

        return $.dayPoint(y, m, d, h, M, s, ms);
}
$.dayPoint.tryParse = function(v){
    return $.dayPoint.canParse(v)
        ? $.dayPoint.parse(v)
        : null;
}

var dayPoint_assumeNow;

$.dayPoint.assumeNow = function(dayPoint) { dayPoint_assumeNow = $.dayPoint.parse(dayPoint); }
$.dayPoint.today = function() { return dayPoint_assumeNow || $.dayPoint.parse(new Date()); }

function dayPoint_findDaysInMonth(month, year) {
    var m = month, y = year;
    if (m == 2) return (dayPoint_isLeapYear(y)) ? 29 : 28;
    return (((m < 8) && ($.isEven(m))) || ((m > 7) && ($.isOdd(m)))) ? 30 : 31;
}
function dayPoint_isLeapYear(year) {
    var y = year.toString().split(/\B/),
        d = parseFloat($.str.build(y[y.length - 2], y[y.length - 1]));
    return (d % 4 == 0);
}
function dayPoint_createDay(dp, d, m, y) {
    var tm = dp.month(), ty = dp.year(), td = dp.date(), ld = dayPoint_findDaysInMonth(tm, ty),
        dd = d, mm = m, yy = y, date = td + dd, month = tm + mm, year = ty + yy;

    if ((td + dd) > ld) { date = 1; month = (tm + (mm + 1)); }
    if ((td + dd) < 1) { var pm = dp.prevMonth(), date = dayPoint_findDaysInMonth(pm.month(), pm.year()); (month = tm + (mm-1)); }

    if ((month) > 12) { month = 1; year = (ty + (yy + 1)); }
    if ((month) < 1) { month = 12; year = (ty + (yy - 1)); }

    var dim = dayPoint_findDaysInMonth(month, year);
    date = (date > dim) ? dim : date;
    
    return new dayPoint(year, month, date);
}

function key(code, alt, ctrl, shift) {
    if(!$.isNumber(code)) throw $.exception("arg", $.str.format("Invalid parameter: code {0}", code));
    this._code = code;
    this.alt(alt || false)
        .ctrl(ctrl || false)
        .shift(shift || false);
}
key.prototype = {
    code: function(code){ return this.property("code", code); },
    alt: function(alt){ return this.property("alt", alt); },
    ctrl: function(ctrl){ return this.property("ctrl", ctrl); },
    shift: function(shift){ return this.property("shift", shift); },
    equals: function(other) {
        return this._code == other.code() &&
               this._alt == other.alt() &&
               this._ctrl == other.ctrl() &&
               this._shift == other.shift();
    },
    toString: function(){ return $.str.parse(this._code); }
}
$.ext(key, $.Class);
$.key = function(code, alt, ctrl, shift) { return new key(code, alt, ctrl, shift); }
$.key.canParse = function(e) { return $.isNumber(key_getCode(e)); }
$.key.parse = function(e) {
    try { return new key(key_getCode(e), e.altKey, e.ctrlKey, e.shiftKey); }
    catch(e){ throw $.exception("arg"); }
}
$.key.tryParse = function(o){ return $.key.canParse(o) ? $.key.parse(o) : null; }
function key_getCode(e) {
    try { return ($.exists(e.which)) ? e.which : event.keyCode; }
    catch(e) { return null; }
}

function money(amt, type) {
    if (isNaN(amt)) throw new $.exception("arg", $.str.format("$.money requires a number. Passed {0}", amt));
    var x = amt.toString().split(/\./), d = x[0], c = x[1];
    function cents(c) { return (amt < 0) ? -c : c; }
    
    this._cents = ($.exists(c)) ? cents(parseFloat("." + c)) : 0;
    this._dollars = parseInt(d);
    this._type = type || "$";
    this._value = amt;
}
money.prototype = {
    cents: function(){ return this._cents; },
    dollars: function(){ return this._dollars; },
    type: function(){ return this._type; },
    value: function(){ return this._value; },
    
    add: function(other) {
        money_checkType(this, other);
        return new money(this._value + other.value());
    },
    divide: function(value) {
        if(!$.isNumber(value))
            throw new Error();
        return new money(this._value / value);
    },
    equals: function(other) {
        return (this.isOfType(other)) && (this._value == other.value());
    },
    isOfType: function(other) {
        return this._type == other.type();
    },
    isGreaterThan: function(other) {
        money_checkType(this, other);
        return this._value > other.value();
    },
    isLessThan: function(other) {
        money_checkType(this, other);
        return this._value < other.value();
    },
    multiply: function(value) {
        if(!$.isNumber(value))
            throw new Error();
        return new money(this._value * value);
    },
    round: function() {
        return new money($.math.round(this.value, -2));
    },
    roundDown: function() {
        return new money($.math.roundDown(this.value, -2));
    },
    roundUp: function() {
        return new money($.math.roundUp(this.value, -2));
    },
    subtract: function(other) {
        money_checkType(this, other);
        return new money(this._value - other.value());
    },
    toString: function() {
        var format = (this.value < 0) ? "({0}{1}.{2})" : "{0}{1}.{2}";
        return $.str.format(format, this._type, money_formatDollars(this), money_formatCents(this));
    }
}
$.money = function(number, type){ return new money(number, type); }
$.money.zero = function() { return $.money(0); }
$.money.isMoney = function(o) { return o instanceof money; }
$.money.canParse = function(v){
    try {
        $.money.parse(v);
        return true;
    }
    catch(e){ return false; }
}
$.money.parse = function(str) {
    if($.isNumber(str)) return $.money(str);
    var b = /(\(.*\))|(\-)/.test(str),
        i = (b) ? 1 : 0,
        u = str.match(/[^\d\.\,\-]/g) || [],
        U = $.exists(u[i]) ? u[i] : "$",
        n = parseFloat(str.replace(/[^\d\.]/g, "")),
        v = (b) ? -n : n;
    return $.money(v, U);
}
$.money.tryParse = function(o){
    return $.money.canParse(o)
        ? $.money.parse(o)
        : null;
}

money_checkType = function(money, other) {
    if (!money.isOfType(other)) throw new $.exception("operation","Invalid operation on non-conforming currencies.");
}
money_formatDollars = function(money) {
    var dollars = money.dollars(),
        anount = (money.cents() >= .995) ? (dollars + 1) : dollars,
        s = anount.toString(),
        d = s.replace(/\-/, "").split(/\B/).reverse(),
        l = d.length,
        b = l > 3,
        i = 0,
        a = [];
    while (i < l) {
        a[a.length] = d[i]; i++;
        if (!$.exists(d[i])) break; 
        if ((i % 3 == 0) && b) a[a.length] = ",";
    }
    return $.str.build.apply(this, a.reverse());
}
money_formatCents = function(money) {
    var C = $.math.round(money.cents(), -3),
        s = C.toString(),
        c = s.replace(/\-|(0\.)/g, "").concat("0").split(/\B/), l = c.length;
    if ($.isZero(l) || C >= .995) return "00";
    if (l < 2) return "0" + c[0];
    return (parseInt(c[2]) > 4) ? c[0] + (parseInt(c[1]) + 1) : c[0] + c[1];
}

function rectangle (topLeft, bottomRight){
    rectangle.base.call(this);
    this._topLeft = topLeft;
    this._bottomRight = bottomRight
}
rectangle.prototype = {
    topLeft: function() { return this.get("topLeft"); },
    bottomRight: function() { return this.get("bottomRight"); },
    contains: function(coord) {
        var t = this._topLeft,
            b = this._bottomRight;

        return t.isAbove(coord) &&
                t.isLeftOf(coord) &&
                b.isRightOf(coord) &&
                b.isBelow(coord);
    }
}
$.ext(rectangle, $.Class);
$.rectangle = function(topLeft, bottomRight){ return new rectangle(topLeft, bottomRight); }

function vector(x, y) {
    if (!$.isNumber(x) || !$.isNumber(y))
        throw $.exception("args", $.str.format("at $.vector({0},{1})", x, y));
    
    vector.base.call(this, x, y);
    
    this._lengthSquared = vector_calculateLengthSquared(this, x, y);
    this._length = vector_calculateLength(this, this._lengthSquared);
    this._unitNormalX = vector_calculateUnitNormal(this, x);
    this._unitNormalY = vector_calculateUnitNormal(this, y);
}

vector.prototype = {
    magnatude: function(){ return this.get("length"); },
    equals: function(other) {
        return (other instanceof vector) &&
            ((this._x === other.x()) && (this._y === other.y()));
    },
    normal: function() { return $.vector(this._unitNormalX, this._unitNormalY); },
    invert: function() { return $.vector(this.x() * -1, this.y() * -1); },
    norm: function() { return $.vector(Math.abs(this.x()), Math.abs(this.y())); },
    perpendicular: function(){ return $.vector(this.y() * -1, this.x()); },
    isZero: function() { return this.x() == 0 && this.y() == 0; },
    add: function(vector) { return $.vector(this.x() + vector.x(), this.y() + vector.y()); },
    dot: function(vector) { return (this.x() * vector.x()) + (this.y() * vector.y()); },
    perpendicularAtTo: function(vector) {
        var p = vector.add(this.projectionOfOnto(vector).invert());
        return $.vector(p.x(), p.y());
    },
    projectionOfOnto: function(vector) {
        var p = vector.normal().scale(this.dot(vector.normal()));
        return $.vector(p.x(), p.y());
    },
    scale: function(scalar) {
        return $.vector((this.x() * scalar), (this.y() * scalar));
    },
    unitNormalDot: function(vector) {
        return (this.normal().x() * vector.normal().x()) +
                (this.normal().y() * vector.normal().y());
    },
    reflect: function(incident){
        if(incident.isZero()) return this;
        var inorm = incident.normal()
        return this.add(inorm.scale(2*(inorm.dot(this))).invert());
    },
    round: function(decimal){
        var d = decimal || 0;
        return $.vector($.math.round(this.x(), d), $.math.round(this.y(), d));
    }
}
$.ext(vector, $.coord.Class);

function vector_calculateLength (v, lengthSquared) {
    if (v.isZero()) return 0;
    return Math.sqrt(lengthSquared);
}
function vector_calculateLengthSquared(v, x, y) {
    if (v.isZero()) return 0;
    return Math.pow(x, 2) + Math.pow(y, 2)
}
function vector_calculateUnitNormal (v, scalar) {
   if (v.isZero()) return 0;
   return scalar / v.magnatude();
}

$.vector = function(x, y) { return new vector(x, y); }
$.vector.Class = vector;
$.vector.zero = function() { return $.vector(0,0); }
$.vector.random = function(seedx, seedy){
    var x = seedx * Math.random(), y = seedy * Math.random();
    return $.vector(x, y);
}

})($);
