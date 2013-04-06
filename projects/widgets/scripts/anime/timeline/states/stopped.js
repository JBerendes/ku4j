timeline.stopped = function(){ timeline.stopped.base.call(this, timeline); }
timeline.stopped.prototype = {
    start: function(){
        var c = this.context(),
            i = c.interval(),
            t = function(){
                c.tick().listeners().notify();
                ku_timeline = setTimeout(t, i);
            }; 
        t();
        this.state("started");    
    },
    stop: function(){ return; }
}
$.ext(timeline.stopped, $.abstractState)