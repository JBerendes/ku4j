function chart(dom) {
    chart.base.call(this, dom);
    this.dragOff().value(0);
}
chart.prototype = {
    value: function(value) { return this.property("value", value); },
    display: function(perspective){ perspective.display(this); return this; }
}
$.ext(chart, $.sprite.Class);
$.chart = function(dom) { return new chart(dom); }