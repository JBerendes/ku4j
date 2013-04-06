function profiler(){ }
profiler.prototype = {
    profile: function(func, args){
        var i = 1000, s = (new Date()).getTime();
        while(i--) func.apply(func, args);
        return ((new Date()).getTime() - s) / 1000;
    }
}
$.profiler = function(){ return new profiler(); }