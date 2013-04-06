function rectangle (topLeft, bottomRight){
    rectangle.base.call(this);
    this._topLeft = topLeft;
    this._bottomRight = bottomRight
}
rectangle.prototype = {
    topLeft: function() { return this.get("topLeft"); },
    bottomRight: function() { return this.get("bottomRight"); },
    contains: function(coord) {
        var t = this._topLeft,
            b = this._bottomRight;

        return t.isAbove(coord) &&
                t.isLeftOf(coord) &&
                b.isRightOf(coord) &&
                b.isBelow(coord);
    }
}
$.ext(rectangle, $.Class);
$.rectangle = function(topLeft, bottomRight){ return new rectangle(topLeft, bottomRight); }