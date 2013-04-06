var coordTween = function(method, start, end, algorithm){
    coordTween.base.call(this, method, start, end, algorithm);
    this.$value = $.coord.zero();
}
coordTween.prototype = {
    $exec: function(){
        var method = this.$method,
            current = this.$current,
            end = this.$end;
        var valueX = this.$algorithm.calculate(current.x(), end.x(), this.$value.x());
        var valueY = this.$algorithm.calculate(current.y(), end.y(), this.$value.y()),
            value = $.coord(valueX, valueY),
            diff = end.abs().subtract(current.abs());
        
        if((Math.abs(valueX) < .1) && (diff.x() < 1) &&
           (Math.abs(valueY) < .1) && (diff.y() < 1)) {
            method(end);
            this.stop()._onEnd.notify();
            return;
        }
        this.$current = current.add(value);
        this.$value = value;
        method(this.$current);
    }
}
$.ext(coordTween, abstractTween);