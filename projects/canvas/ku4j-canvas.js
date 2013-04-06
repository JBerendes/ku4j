(function($){
if(!$) $ = {};
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

function abstractPerspective(dom){
    abstractPerspective.base.call(this, dom);
}
abstractPerspective.prototype = {
    $draw: function(chart) { return },
    $clear: function(){ return; },
    display: function(chart) {
        chart.to().fadeTo(0, function(){
            $.clearNode(chart.dom());
            this.appendTo(chart.dom());
            chart.fadeTo(100, function(){ this.$draw(chart); }, this);
        }, this);
    }
}
$.ext(abstractPerspective, $.dom.Class);
$.abstractPerspective = function(){ return new abstractPerspective(); }

function circlePerspective(){
    circlePerspective.base.call(this, $.create({"canvas":{}}));
    this._context = this.dom().getContext("2d");
}
circlePerspective.prototype = {
    $draw: function(chart) {
        var me = this,
            context = this._context,
            value = chart.value(),
            dom = this.dom(),
            start = -.5 * Math.PI,
            end = this._skillValues[chart.value()],
            dims = chart.outerDims(),
            x = dims.x(),
            y = dims.y(),
            radius = x / 2,
            gradient = context.createRadialGradient(radius/2, radius/2, 2, radius, radius, radius);

        dom.width = x;
        dom.height = y;

        gradient.addColorStop(0, "#afa");
        gradient.addColorStop(.7, "#3a3");
        gradient.addColorStop(1.0, "#0a0");

        function display(value) {

            context.clearRect(0, 0, x, y);

            context.beginPath();
            context.strokeStyle = "#ccc";
            context.arc(radius, radius, radius, 0, 2 * Math.PI);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.fillStyle = gradient;
            context.arc(radius, radius, radius, start, value);
            context.lineTo(radius, radius);
            context.fill();
            context.closePath();
        }
        $.tween(display, start, end, $.anime.algorithms.ease.linear(.3))
            .onEnd(function(){ display(end); })
            .start();

        return this;
    },
    _skillValues: [ -.5 * Math.PI, 0, .5 * Math.PI, Math.PI, 1.5 * Math.PI ]
}
$.ext(circlePerspective, abstractPerspective);
$.circlePerspective = function(){ return new circlePerspective(); }

function inputPerspective(){
    inputPerspective.base.call(this, $.create({"input":{}}));
}
inputPerspective.prototype = {
    $draw: function(chart) {
        this.onblur(function(){
                var v = parseInt(this.dom().value),
                    value = (isNaN(v) || v < 0 || v > 4) ? 0 : v;
                chart.value(value).display($.circlePerspective());
            }, this)
            .appendTo(chart)
            .dom().select();
    }
}
$.ext(inputPerspective, abstractPerspective);
$.inputPerspective = function(radius){ return new inputPerspective(radius); }

function rectanglePerspective(){
    rectanglePerspective.base.call(this, $.create({"canvas":{}}));
    this._context = this.dom().getContext("2d");
}
rectanglePerspective.prototype = {
    $draw: function(chart){
        var context = this._context,
            value = chart.value(),
            dims = chart.outerDims(),
            dom = this.dom(),
            x = dims.x(),
            y = dims.y(),
            color;

        switch (value) {
            case 1: color = "#cfc"; break;
            case 2: color = "#8c8"; break;
            case 3: color = "#6b6"; break;
            case 4: color = "#080"; break;
            default: color = "#fff"; break;
        }

        dom.width = x;
        dom.height = y;

        context.clearRect(0, 0, x, y);

        context.beginPath();
        context.strokeStyle = "#ccc";
        context.rect(0, 0, x, y);
        context.closePath();
        context.stroke();

        context.beginPath();
        context.fillStyle = color
        context.rect(0, 0, x, y);
        context.closePath();
        context.fill();
    }
}
$.ext(rectanglePerspective, abstractPerspective);
$.rectanglePerspective = function(){ return new rectanglePerspective(); }

})($);
