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