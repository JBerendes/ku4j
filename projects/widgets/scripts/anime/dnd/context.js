var dndState = {};

function dndContext(dom){
    dndContext.base.call(this, dom);
    
    this._mouseEvt = $.uid("dragger");
    this._touchEvt = $.uid("toucher");
    this._documentBody = $.dom(document.body);
    this._onGrab = $.observer();
    this._onDrag = $.observer();
    this._onDrop = $.observer();
    this._constrainX = false;
    this._constrainY = false;
    this._boundX = 0;
    this._boundY = 0;
    this._lastPoint = $.coord.zero();
    this._bearing = $.vector.zero();
    this._document = $.dom(document);

    this.state(new dndState.dropped())
        .dragger()
        .dragOffset($.coord.zero())
        .ontouchstart(this.grab, this, this._touchEvt)
        .onmousedown(this.grab, this, this._mouseEvt);
}
dndContext.prototype = {
    document: function(){ return this._document; },
    hitSize: function(hitSize){ return this.property("hitSize", hitSize); },
    hitCoord: function(hitCoord){ return this.property("hitCoord", hitCoord); },
    hitOffset: function(hitOffset){ return this.property("hitOffset", hitOffset); },
    dragOffset: function(dragOffset){ return this.property("dragOffset", dragOffset); },
    hitScrollOffset: function(hitScrollOffset){ return this.property("hitScrollOffset", hitScrollOffset); },
    hitBoundedOffet: function(hitBoundedOffet){ return this.property("hitBoundedOffet", hitBoundedOffet); },
    actor: function(){ return this.get("actor"); },
    strategy: function(){ return this.get("strategy"); },
    bearing: function(){ return this.get("bearing"); },
    
    bearingUp: function(){ return this.bearing().y() < 0; },
    bearingDown: function(){ return this.bearing().y() > 0; },
    bearingLeft: function(){ return this.bearing().x() < 0; },
    bearingRight: function(){ return this.bearing().x() > 0; },
    
    constrainX: function(){
        if(this._constrainX) return this;
        this._constrainX = true;
        this._boundX = this.boundedOffset().x();
        return this;
    },
    unconstrainX: function(){
        this._constrainX = false;
    },
    constrainY: function(){
        if(this._constrainY) return this;
        this._constrainY = true;
        this._boundY = this.boundedOffset().y();
        return this;
    },
    unconstrainY: function(){
        this._constrainY = false;
    },
    state: function(state) { return this.set("state", state.context(this)); },
    dragCoord: function(e){
        var c = this.strategy().findCoord(e),
            os = this.dragOffset(),
            x = (this._constrainX) ? this._boundX : c.x() + os.x(),
            y = (this._constrainY) ? this._boundY : c.y() + os.y(),
            coord = $.coord(x, y);
        this._bearing = coord.distanceFrom(this._lastPoint);
        this._lastPoint = coord;
        return coord;
    },
    dragger: function(){
        return this.set("actor", $.pinner(this.dom()))
                   .set("strategy", new dndDragCoordStrategy(this))
                   ._setType("dragger");
    },
    sizer: function(){
        return this.set("actor", $.sizer(this.dom()))
                   .set("strategy", new dndSizeCoordStrategy(this))
                   ._setType("sizer");
    },
    scroller: function(){
        return this.set("actor", $.scroller(this.dom()))
                   .set("strategy", new dndScrollCoordStrategy(this))
                   ._setType("scroller");
    },
    grab: function(e){
        this._onGrab.notify(e);
        this._state.grab(e);
        return this;
    },
    drag: function(e){ 
        this._onDrag.notify(e);
        this._state.drag(e);
        return this;
    },
    drop: function(e){ 
        this._onDrop.notify(e);
        this._state.drop(e);
        this._bearing = $.vector.zero();
        return this;
    },
    onGrab: function(f, s, id){ this._onGrab.add(f, s, id); return this; },
    onDrag: function(f, s, id){ this._onDrag.add(f, s, id); return this; },
    onDrop: function(f, s, id){ this._onDrop.add(f, s, id); return this; },
    destroy: function(){
        this._onGrab.clear();
        this._onDrag.clear();
        this._onDrop.clear();
        this.removeEvent(this._mouseEvt).removeEvent(this._touchEvt);
    },
    disableSelect: function(target){
		document.onselectstart = function() { return false; }
        if(!$.exists(window.getSelection)) return this;
		this._mouseDisableId = $.uid("disable");
		this._touchDisableId = $.uid("disable");

		function disable() { window.getSelection().removeAllRanges(); }
        this._documentBody
            .onmousemove(disable, null, this._mouseDisableId)
            .ontouchmove(disable, null, this._touchDisableId);
        return this;
    },
    enableSelect: function(){
        document.onselectstart = null;
		var m = this._mouseDisableId,
		    t = this._touchDisableId,
            d = this._documentBody;
		if($.exists(m)) d.removeEvent(m)
		if($.exists(t)) d.removeEvent(t);
		this._mouseDisableId = null;
		this._touchDisableId = null;

        return this;
    },
    _setType: function(type){
        this._clearType().addClass($.str.format("ku-dragger-{0}", type));
        return this;
    },
    _clearType: function(){
        this.removeClass("ku-dragger-dragger")
            .removeClass("ku-dragger-sizer")
            .removeClass("ku-dragger-scoller");
        return this;
    }
}
$.ext(dndContext, $.dom.Class);

$.dnd = function(dom){ return new dndContext(dom); }