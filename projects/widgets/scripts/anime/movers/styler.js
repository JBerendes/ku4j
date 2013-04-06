function styler(dom, prop) {
    $.dom(dom).addClass("ku-styler");
    styler.base.call(this, dom);
    this._prop = prop;
}
styler.prototype = {
    $moveTo: function(value) {
        var d = this.dom(),
            dom = $.dom(d),
            p = this._prop,
            val = dom.style(p),
            s = $.ku.style,
            unit = s.getUnit(val) || "",
            start = s.toNumber(val);
        
        this.$tween = $.tween(function(value){
                dom.style(p, value + unit);
            }, start, value, this.$algorithm)
            .onEnd(this.$done, this)
            .start(d);
    }
}
$.ext(styler, abstractMover);
$.styler = function(dom, prop){ return new styler(dom, prop); }