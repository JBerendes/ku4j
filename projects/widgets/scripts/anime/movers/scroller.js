function scroller(dom) {
    $.dom(dom).addClass("ku-scoller");
    scroller.base.call(this, dom);
}
scroller.prototype = {
    $to: function(value){
        var d = this.dom(),
            dom = $.dom(d);
        dom.style("scrollLeft", value.x());
        dom.style("scrollTop", value.y());
        return this;
    },
    $moveTo: function(coord) {
        var d = this.dom(),
            dom = $.dom(d),
            offset = dom.scrollOffset(),
            p = $.findOffset(d.parentNode),
            parentOffset = ($.coord.canParse(p)) ? $.coord.parse(p) : $.coord.zero(),
            start = offset.subtract(parentOffset);
        
        this.$tween = $.tween(function(value){
                dom.style("scrollLeft", value.x());
                dom.style("scrollTop", value.y());
            }, start, coord, this.$algorithm)
            .onEnd(this.$done, this)
            .start(d);
    }
}
$.ext(scroller, abstractMover);
$.scroller = function(dom){ return new scroller(dom); }