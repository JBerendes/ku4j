$(function(){
    module("abstractState Test");
    
    var state = {};
    state.playing = function(context){ state.playing.base.call(this, state); }
    state.playing.prototype = {
        play: function(){ return "Already playing"; },
        stop: function(){ this.state("stopped"); return "Stopping"; }
    }  
    $.ext(state.playing, $.abstractState);
    
    state.stopped = function(context){ state.stopped.base.call(this, state); }
    state.stopped.prototype = {
        play: function(){ this.state("playing"); return "Playing"; },
        stop: function(){ return "Already stopped"; }
    }
    $.ext(state.stopped, $.abstractState);
    
    mediaPlayer = function(state){
        mediaPlayer.base.call(this, state);
    }
    mediaPlayer.prototype = {
        play: function(){ return this._state.play(); },
        stop: function(){ return this._state.stop(); }
    }
    $.ext(mediaPlayer, $.abstractContext);
    
    test("create", function(){ ok(new mediaPlayer()); });
    test("methods", function(){
        var m = new mediaPlayer(new state.stopped());
        MEDIAPLAYER = m;
        ok(/Already\sstopped/i.test(m.stop()));
        ok(/Playing/i.test(m.play()));
        ok(/Already\sPlaying/i.test(m.play()));
        ok(/Stopping/i.test(m.stop()));
        ok(/Already\sstopped/i.test(m.stop()));
    });
});