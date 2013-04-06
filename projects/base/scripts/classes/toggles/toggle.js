function toggle() {
    toggle.base.call(this);
    this._onActive = $.observer();
    this._onInactive = $.observer();
    this._isActive = false;
}
toggle.prototype = {
    value: function(value){ return this.property("value", value); },
    toggleset: function(toggleset){ return this.property("toggleset", toggleset); },
    isActive: function(isActive) {
        if($.exists(isActive)) {
            if(isActive) this._onActive.notify();
            else this._onInactive.notify();
        }
        return this.property("isActive", isActive);
    },
    toggle: function(){ return this.isActive(!this.isActive());},
    invoke: function() {
        var ts = this._toggleset;
        if ($.exists(ts)) ts.invoke(this);
        else this.toggle();
        return this;
    },
    onActive: function(f, s) { this._onActive.add(f, s); return this;},
    onInactive: function(f, s) { this._onInactive.add(f, s); return this;}
}
$.ext(toggle, $.Class);
$.toggle = function(){ return new toggle(); }
$.toggle.Class = toggle;