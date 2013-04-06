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