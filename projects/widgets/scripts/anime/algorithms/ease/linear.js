var easeLinear = function(ease){
    this._ease = ease || .1;
}
easeLinear.prototype = {
    calculate: function(current, end){ return (end - current) * this._ease; }
}
$.anime.algorithms.ease.linear = function(ease){ return new easeLinear(ease); }