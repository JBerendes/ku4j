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