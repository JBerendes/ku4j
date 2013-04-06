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