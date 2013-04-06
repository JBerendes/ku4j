function toggleset() {
    toggleset.base.call(this);
    this._toggles = $.list();
    this._onInvoke = $.observer();
    this.multipleSelect();
}
toggleset.prototype = {
    isEmpty: function(){ return this._toggles.isEmpty(); },
    strategy: function(strategy){
        if($.exists(strategy)) strategy.context(this);
        return this.property("strategy", strategy);
    },
    multipleSelect: function(){ return this.strategy(new toggleset_multipleSelect()); },
    mutuallyExclusive: function(){ return this.strategy(new toggleset_mutuallyExclusive()); },
    invoke: function(toggle) {
        this.strategy().invoke(toggle);
        return this;
    },
    add: function(toggle) {
        this._toggles.add(toggle.toggleset(this));
        return this;
    },
    remove: function(toggle) {
        this._toggles.remove(toggle);;
        return this;
    },
    onInvoke: function(f, s, id) { this._onInvoke.add(f, s, id); return this;},
    each: function(f, s){ this._toggles.each(f, s); return this; }
}
$.ext(toggleset, $.Class);
$.toggleset = function(){ return new toggleset(); }
$.toggleset.Class = toggleset;