function dndScreenDropper(dom){
    dndScreenDropper.base.call(this, dom);
    this._id = $.uid("dropper");
    this._handle = this;
}
dndScreenDropper.prototype = {
    id: function(id) { return this.get("id"); },
    value: function(value) { return this.property("value", value); },
    handle: function(handle) {
        var hndl;
        if($.exists(handle)) hndl = $.dom(handle);
        return this.property("handle", hndl);
    },
    mouseEventId: function(mouseEventId) { return this.property("mouseEventId", mouseEventId); },
    touchEventId: function(touchEventId) { return this.property("touchEventId", touchEventId); },
}
$.ext(dndScreenDropper, $.dom.Class);
$.dndScreenDropper = function(dom){ return new dndScreenDropper(dom); }