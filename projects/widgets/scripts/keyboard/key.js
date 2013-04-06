function key(code){
    if(!$.isNumber(code))
        $.exception("arg", $.str.format("Invalid argument code:{0}", code));

    this._value = $.key(code);
    this._onPress = $.observer();
    this._onRelease = $.observer();

    key.base.call(this, $.create({button:{"class":"ku-keyboard-key"}, content: this._value.toString()}));

    this.onmousedown(function() { this._onPress.notify(this._value); }, this)
        .ontouchstart(function() { this._onPress.notify(this._value); }, this)
        .onmouseup(function() { this._onRelease.notify(this._value); }, this)
        .ontouchend(function() { this._onRelease.notify(this._value); }, this)
}
key.prototype = {
    onPress: function(f, s){
        this._onPress.add(f, s);
        return this;
    },
    onRelease: function(f, s){
        this._onRelease.add(f, s);
        return this;
    }
}
$.ext(key, $.dom.Class);
$.onScreenKey = function(code){ return new key(code); }