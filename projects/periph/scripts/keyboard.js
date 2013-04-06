function keyboard(){
    this._hotKeys = $.hash();
    this._map = $.hash(keyboard_Map);
}
keyboard.prototype = {
    map: function(map){ return this.set("map", map);s },
    findCode: function(symbol){
        var key = this._map.findKey(symbol),
            code = parseInt(key);

        return isNaN(code) ? null : code;
    },
    findKey: function(code) { return this._map.findValue(code); }
}
$.ext(keyboard, $.Class);
var keyboard_instance = new keyboard();
$.keyboard = function(){ return keyboard_instance; }