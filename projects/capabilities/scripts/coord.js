function coord(x, y) {
    if (!$.isNumber(x) || !$.isNumber(y))
        throw $.exception("arg", $.str.format("at $.coord({0},{1})", x, y));
        
    coord.base.call(this);
    this.x(x).y(y);
}

coord.prototype = {
    x: function(x){ return this.property("x", x); },
    y: function(y){ return this.property("y", y); },
    abs: function(){
        return $.coord(Math.abs(this._x), Math.abs(this._y));
    },
    add: function(other) {
        var x = this._x + other.x(),
            y = this._y + other.y();
        return $.coord(x,y);
    },
    divide: function(other) {
        var x = this._x / other.x(),
            y = this._y / other.y();
        return $.coord(x, y);
    },
    equals: function(other) {
        return (other instanceof coord) &&
            ((this._x === other.x()) && (this._y === other.y()));
    },
    multiply: function(other) {
        var x = this._x * other.x(),
            y = this._y * other.y();
        return $.coord(x, y);
    },
    subtract: function(other) {
        var x = this._x - other.x(),
            y = this._y - other.y();
        return $.coord(x, y);
    },
    round: function(decimal){
        var d = decimal || 0;
        return $.coord($.math.round(this.x(), d), $.math.round(this.y(), d));
    },
    isAbove: function(other) { return this.y() < other.y(); },
    isBelow: function(other) { return this.y() > other.y(); },
    isLeftOf: function(other) { return this.x() < other.x(); },
    isRightOf: function(other) { return this.x() > other.x(); },
    distanceFrom: function(other) { return new $.vector(this.x() - other.x(), this.y() - other.y()); },
    distanceTo: function(other) { return this.distanceFrom(other).invert(); },
    half: function(){ return this.divide($.coord(2, 2)); },
    value: function() { return { x: this._x, y: this._y }; },
    toEm: function() { return coord_toUnit(this, "em"); },
    toPixel: function() { return coord_toUnit(this, "px"); },
    toString: function() { return $.str.format("({0},{1})", this._x, this._y); }    
}
$.ext(coord, $.Class);

function coord_toUnit(coord, unit) {
    return {
        x: function() { return coord.x() + unit; },
        y: function() { return coord.y() + unit; }
    }
}

$.coord = function(x, y) { return new coord(x, y); }
$.coord.Class = coord;
$.coord.zero = function(){ return $.coord(0,0); }
$.coord.canParse = function(o){
    try{
        if (("left" in o) && ("top" in o))
            return !isNaN(o.left) && !isNaN(o.top);
        if (("width" in o) && ("height" in o))
            return !isNaN(o.width) && !isNaN(o.height);
        return false;
    }
    catch(e) { return false; }
}
$.coord.random = function(seedx, seedy){
    var x = seedx * Math.random(), y = seedy * Math.random(seedy);
    return $.coord(x, y);
}
$.coord.parse = function(o) {
    if (("left" in o) && ("top" in o)) return $.coord(o.left, o.top);
    if (("width" in o) && ("height" in o)) return $.coord(o.width, o.height);
    return null;
}
$.coord.tryParse = function(o){
    return $.coord.canParse(o)
        ? $.coord.parse(o)
        : null;
}