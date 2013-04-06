var jump = function(){ }
jump.prototype = { calculate: function(current, end){ return end-current; } }
$.anime.algorithms.jump = function(){ return new jump(); }