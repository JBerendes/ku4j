function fader(dom) {
    $.dom(dom).addClass("ku-fader");
    fader.base.call(this, dom);
}
fader.prototype = {
    $to: function(value){
        var d = this.dom(),
            dom = $.dom(d);
        dom.style("opacity", value * .01);
        return this;
    },
    $moveTo: function(value){
        var d = this.dom(),
            dom = $.dom(d),
            start = dom.style("opacity") || 1;
        
        this.$tween = $.tween(function(value){
                dom.style("opacity", value * .01);
            }, start, value, this.$algorithm)
            .onEnd(this.$done, this)
            .start(d);
    }
}
$.ext(fader, abstractMover);
$.fader = function(dom){ return new fader(dom); }