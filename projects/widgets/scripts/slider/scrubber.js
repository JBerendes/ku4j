function scrubber (dom){
    scrubber.base.call(this, dom);
    //need a dragger constrained to the x or y coord
    //this class should return to someone the degree to which it has moved
    //This class needs an upper and lower bound
    //  How far it is allowed to move
    //  It will be allowed to move from left 0 to left dist-dim(x|y)
}
scrubber.prototype = {
    value: function(){ /*What does this mean?*/},
    ratio: function(){ return this.minValue()/this.maxValue(); },
    minValue: function(minValue){ this.get("minValue", minValue); },
    maxValue: function(maxValue){ this.get("maxValue", maxValue); }
}
$.ext(scrubber, $.dom.Class);