(function($){
if(!$) $ = {};


function media(dom) {
    media.base.call(this, dom);

    this._onPlayheadChanged = $.observer();

    this._addEvent("timeupdate", function() { this._onPlayheadChanged.notify(this); }, this, $.uid());
}
media.prototype = {
    play: function(value) { this._dom.play(); return this; },
    pause: function() { this._dom.pause(); return this; },
    load: function()  { this._dom.load(); return this; },

    duration: function() { return this._dom.duration; },
    remaining: function() { return this.duration() - this.playhead()},
    playhead: function(seconds) {
        if(!$.exists(seconds)) return this._dom.currentTime;
        this._dom.currentTime = seconds;
        return this;
    },

    onPlayheadChanged: function(m, s){
        this._onPlayheadChanged.add(m, s);
        return this;
    }
}
$.ext(media, $.sprite.Class);
$.media = function(dom) { return new media(dom); }





})($);
