function dndScreenTarget(dom){
    dndScreenTarget.base.call(this, dom);
    this._id = $.uid("target");
}
dndScreenTarget.prototype = {
    id: function(id) { return this.get("id"); },
    value: function(value) { return this.property("value", value); },
    contains: function(coord){
        var topLeft = this.offset(),
            bottomRight = topLeft.add(this.outerDims());

        return $.rectangle(topLeft, bottomRight).contains(coord);
    }
}
$.ext(dndScreenTarget, $.dom.Class);
$.dndScreenTarget = function(dom){ return new dndScreenTarget(dom); }