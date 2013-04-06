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