$.Class = function(){ }
$.Class.prototype = {
    get: function(p){ return this["_"+p]; },
    set: function(p, v){ this["_"+p] = v; return this; },
    property: function(p, v){
        return ($.isUndefined(v))
            ? this.get(p)
            : this.set(p, v);
    }
}