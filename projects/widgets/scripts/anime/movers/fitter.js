function fitter(dom) {
    $.dom(dom).addClass("ku-fitter");
    fitter.base.call(this, dom);
}
fitter.prototype = {
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
            }, start, fitter_findFitCoord(this, coord), this.$algorithm)
            .onEnd(this.$done, this)
            .start(d);
    }
}
$.ext(fitter, abstractMover);

function fitter_findFitCoord(fitter, coord){
    var fitRatio = coord.y() / coord.x(),
        dom = $.dom(fitter.dom()),
        dims = dom.outerDims(),
        fitterAspect = dims.y() / dims.x(),
        aspectRatio = isNaN(fitterAspect) ? 1 : fitterAspect,
        x = dims.x(),
        y = dims.y();
    
    //I am wider than the location
    if((aspectRatio < fitRatio) ||
       (aspectRatio == fitRatio)) {
            x = coord.x();
            y = coord.x() * fitterAspect;
    }
    //I am taller than the location       
    if(aspectRatio > fitRatio) {
        x = coord.y() / fitterAspect;
        y = coord.y();
    }
    return $.coord(x, y);
}

$.fitter = function(dom){ return new fitter(dom);}