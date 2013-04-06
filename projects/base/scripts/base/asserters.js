$.isArray = function(x) { return x instanceof Array; }
$.isBool = function(x) { return (/boolean/i.test(typeof (x))); }
$.isDate = function(x) { return x instanceof Date; }
$.isEm = function(x) { return (/\d+em/i.test(x)); }
$.isEvent = function(x) { try { return x instanceof Event; } catch(e){ return x === window.event; }}
$.isNumber = function(x) { return (/number/i.test(typeof (x))) && !isNaN(x); }
$.isObject = function(x) { return $.exists(x) && (/object/i.test(typeof (x))); }
$.isFunction = function(x) { return (x instanceof Function); }
$.isPercent = function(x) { return (/\d+%/.test(x)); }
$.isPixel = function(x) { return (/\d+px/.test(x)); }
$.isString = function(x) { return (/string/i.test(typeof (x))) || x instanceof String; }
$.isZero = function(n) { return n === 0; }
$.isEven = function(n) { return ($.isNullOrEmpty(n) || $.isDate(n)) ? false : (isNaN(n) ? false : ($.isZero(n) ? false : n % 2 === 0)); }
$.isOdd = function(n) { return ($.isNullOrEmpty(n) || $.isDate(n)) ? false : (isNaN(n) ? false : ($.isZero(n) ? false : !$.isEven(n))); }
$.isNull = function(x) { return x === null; }
$.isUndefined = function(x) { return (/undefined/i.test(typeof (x))); }
$.isEmpty = function(s) { return $.isString(s) && $.isZero(s.split(/\B/).length); }
$.isNullOrEmpty = function(s) { return !$.exists(s) || $.isEmpty(s); }
$.exists = function(x) { return (x !== null) && (!$.isUndefined(x)); }
$.xor = function(a, b) { return !a != !b; }
$.isDecendentOf = function(dom, test){
    var d = $.ele(dom),
        a = $.ele(test);
    if((!d || !a) || (d == a)) return false;
    do { if(d == a) return true; }
    while(d = d.parentNode);
    return false;
}