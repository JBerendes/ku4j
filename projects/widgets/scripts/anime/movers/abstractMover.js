function abstractMover(dom) {
    abstractMover.base.call(this, dom);
    this._onEnd = $.observer();
    this.linear();
}

abstractMover.prototype = {
    $to: function(value){ return; }, 
    $moveTo: function(value) { return; },
    $done: function(){ this._onEnd.notify(); return this; },
    algorithm: function(algorithm){ this.$algorithm = algorithm; return this; },
    
    linear: function(f){ return this.algorithm($.anime.algorithms.ease.linear(f)); },
    spring: function(f, m){ this.algorithm($.anime.algorithms.spring(f, m)); },
    
    stop: function(){
        if(!$.exists(this.$tween)) return this;
        this.$tween.stop();
        return this;
    },
    to: function(value) { this.stop().$to(value).$done(); return this; },
    moveTo: function(value) { this.stop().$moveTo(value); return this; },
    onEnd: function(f, s){
        if(!$.exists(f)) return this;
        this._onEnd.add(f, s);
        return this;
    }
}
$.ext(abstractMover, $.dom.Class);