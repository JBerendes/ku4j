function sizer(dom) {
    $.dom(dom).addClass("ku-sizer");
    sizer.base.call(this, dom);
}
sizer.prototype = {
    $to: function(value){
        var d = this.dom(),
            dom = $.dom(d);
        dom.style("width", value.x() + "px");
        dom.style("height", value.y() + "px");
        return this;
    },
    $moveTo: function(coord) {
        var d = this.dom(),
            dom = $.dom(d),
            start = dom.outerDims();
        
        this.$tween = $.tween(function(value){
                dom.style("width", value.x() + "px");
                dom.style("height", value.y() + "px");
            }, start, coord, this.$algorithm)
            .onEnd(this.$done, this)
            .start(d);
    }
}
$.ext(sizer, abstractMover);
$.sizer = function(dom, ease, mu){ return new sizer(dom, ease, mu);}