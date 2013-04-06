function pinner(dom) {
    $.dom(dom).addClass("ku-pinner");
    pinner.base.call(this, dom);
}
pinner.prototype = {
    $to: function(value){
        var d = this.dom(),
            dom = $.dom(d);
        dom.style("left", value.x() + "px");
        dom.style("top", value.y() + "px");
        return this;
    },
    $moveTo: function(coord) {
        var d = this.dom(),
            dom = $.dom(d),
            offset = dom.offset(),
            p = $.findOffset(d.parentNode),
            parentOffset = ($.coord.canParse(p)) ? $.coord.parse(p) : $.coord.zero(),
            start = offset.subtract(parentOffset);
        
        this.$tween = $.tween(function(value){
                dom.style("left", value.x() + "px");
                dom.style("top", value.y() + "px");
            }, start, coord, this.$algorithm)
            .onEnd(this.$done, this)
            .start(d);
    }
}
$.ext(pinner, abstractMover);
$.pinner = function(dom){ return new pinner(dom); }