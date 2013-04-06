function timeline(fps, state){
    timeline.base.call(this, state);
    this._listeners = $.observer();
    this._ticks = 0;
    this.fps(fps || 30);
}
timeline.prototype = {
    fps: function(fps){
        this._interval = 1000/fps;
        return this.property("fps", fps);
    },
    interval: function(){ return this.get("interval"); },
    listeners: function(){ return this.get("listeners"); },
    ticks: function(){ return this.get("ticks"); },
    start: function(){
        this._state.start();
        return this;
    },
    stop: function(){
        this._state.stop();
        return this;
    },
    add: function(func, scope, id, wait){
        var me = this,
            w = wait || 1,
            _id = id || $.uid("timeline"),
            stall = function() {
                if(!me._ticks % w == 0) return;
                func(); f = func;
            },
            f = (!wait) ? func : stall;
        this._listeners.add(f, scope, _id);
        return this;
    },
    remove: function(id){
        this._listeners.remove(id);
        return this;
    },
    clear: function(){ this._listeners.clear(); return this; },
    tick: function(){ this._ticks++; return this; }
}
$.ext(timeline, $.abstractContext);
$.timeline = function(){ return timeline_instance; }