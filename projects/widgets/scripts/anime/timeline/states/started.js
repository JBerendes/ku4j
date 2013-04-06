timeline.started = function(){ timeline.started.base.call(this, timeline); }
timeline.started.prototype = {
    start: function(){ return; },
    stop: function(){
        clearTimeout(ku_timeline);
        ku_timeline = null;
        this.state("stopped");
    }
}
$.ext(timeline.started, $.abstractState)