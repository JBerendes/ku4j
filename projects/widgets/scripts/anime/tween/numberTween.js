var numberTween = function(method, start, end, algorithm){
    numberTween.base.call(this, method, start, end, algorithm);
}
numberTween.prototype = {
    $exec: function(){
        var method = this.$method,
            current = this.$current,
            end = this.$end,
            value = this.$algorithm.calculate(current, end, this.$value);

        if((Math.abs(value) < .1) &&
           (Math.abs(end - current) < 1)) {
            method(end);
            this.stop().$done();
            return;
        }
        this.$current = current + value;
        this.$value = value;
        method(this.$current);
    }
}
$.ext(numberTween, abstractTween);