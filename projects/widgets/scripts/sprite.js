function sprite(dom){
    var d = dom || $.create({div:{"class":"ku-sprite"}});
    sprite.base.call(this, d);
    this.to().dragOn().force(.4).mu(.8);
	this._isTo;
}
sprite.prototype = {
    force: function(force){ return this.property("force", force); },
    mu: function(mu){ return this.property("mu", mu); },
    algorithm: function(algorithm){ return this.set("algorithm", algorithm); },
    
    to: function(){  this._isTo = true; return this.algorithm($.anime.algorithms.jump()); },
    spring: function(){  this._isTo = false; return this.algorithm($.anime.algorithms.spring(this._force, this._mu)); },
    ease: function(){  this._isTo = false; return this.algorithm($.anime.algorithms.ease.linear(this._force, this._mu)); },
    
    fitTo: function(coord, f, s){ return this._act("fitter", coord, f, s); },
    sizeTo: function(coord, f, s) { return this._act("sizer", coord, f, s); },
    pinTo: function(coord, f, s){ return this._act("pinner", coord, f, s); },
    scrollTo: function(coord, f, s){ return this._act("scroller", coord, f, s); },
    fadeTo: function(nbr, f, s){ return this._act("fader", nbr, f, s); },
    growTo: function(coord, f, s){
        return this.sizeTo(coord)
                   .pinTo(this.boundedOffset()
                        .subtract(coord.subtract(this.outerDims())
                        .half()), f, s);
    },
    _act: function(action, value, f, s){
        var act = $[action](this.dom()).algorithm(this._algorithm),
            _action =  "_" + action,
            currentAction = this[_action];

        if($.exists(currentAction)) currentAction.stop();
        if($.exists(f)) act.onEnd(f, s);

        if(this._isTo) this[_action] = act.to(value);
        else this[_action] = act.moveTo(value);
        return this;
    },
    tween: function(property, value){
        this._styler = $.styler(this.dom(), property).algorithm(this._algorithm).moveTo(value);
        return this;
    },
    clear: function(){
        if($.exists(this._fader)) this._fader.stop();
        if($.exists(this._sizer))this._sizer.stop();
        if($.exists(this._fitter))this._fitter.stop();
        if($.exists(this._pinner))this._pinner.stop();
        if($.exists(this._scroller))this._scroller.stop();
        if($.exists(this._styler))this._styler.stop();
        return this;
    },
    dragHandle: function(dragHandle){ return this.property("dragHandle", dragHandle); },
    dragType: function(dragType){ return this.set("dragType", dragType); },
    dragOffset: function(dragOffset){ this._dnd.dragOffset(dragOffset); return this; },
    dragger: function(){ this._dnd.dragger(); return this; },
    sizer: function(){ this._dnd.sizer(); return this; },
    scroller: function(){ this._dnd.scroller(); return this; },
    dragOn: function(){ this._dnd = $.dnd(this.dom()).onGrab(this.clear, this); return this; },
    dragOff: function(){ this._dnd.destroy(); return this; },
    onGrab: function(f, s, id){ this._dnd.onGrab(f, s, id); return this; },
    onDrag: function(f, s, id){ this._dnd.onDrag(f, s, id); return this; },
    onDrop: function(f, s, id){ this._dnd.onDrop(f, s, id); return this; },
    bearingUp: function(){ return this._dnd.bearingUp(); },
    bearingDown: function(){ return this._dnd.bearingDown(); },
    bearingLeft: function(){ return this._dnd.bearingLeft(); },
    bearingRight: function(){ return this._dnd.bearingRight(); },
    grab: function(e){ this._dnd.grab(e); return this; },
    drag: function(e){ this._dnd.drag(e); return this; },
    drop: function(e){ this._dnd.drop(e); return this; },
    constrainX: function(){ this._dnd.constrainX(); return this; },
    unconstrainX: function(){ this._dnd.unconstrainX(); return this; },
    constrainY: function(){ this._dnd.constrainY(); return this; },
    unconstrainY: function(){ this._dnd.unconstrainY(); return this; }
}
$.ext(sprite, $.dom.Class);
$.sprite = function(dom){ return new sprite(dom); }
$.sprite.Class = sprite;