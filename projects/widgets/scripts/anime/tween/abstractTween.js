var abstractTween = function(method, start, end, algorithm){
    this.$method = method;
    this.$current = start;
    this.$end = end;
    this.$algorithm = algorithm;
    this.$value = 0;
    this._onEnd = $.observer();
    this._id = $.uid("tween");
}
abstractTween.prototype = {
    $exec: function(){ return; },
    $done: function(){ this._onEnd.notify(); },
    start: function(){
        $.timeline().add(this.$exec, this, this._id);
        return this;
    },
    stop: function(){
        $.timeline().remove(this._id);
        return this;
    },
    onEnd: function(f, s){ this._onEnd.add(f, s); return this; },
    clear: function(){
        this._onEnd.clear();
        return this;
    }
}
$.ext(abstractTween, $.Class);