(function($){
if(!$) $ = {};
$.ku.equations = {
    cycle: function(p, xa, xm, ya, ym){
        return new $.coord(
            this.sin(p.x, xa, xm),
            this.cos(p.y, ya, ym));
    },
    cos: function(n, a, m){
        return n + Math.cos(a) * m;  
    },
    cosH: function(p, a, m){
        return new $.coord(this.cos(p.x, a, m), p.y);
    },
    cosV: function(p, a, m){
        return new $.coord(p.x, this.cos(p.y, a, m));
    },
    sin: function(n, a, m){
        return n + Math.sin(a) * m;  
    },
    sinH: function(p, a, m){
        return new $.coord(this.sin(p.x, a, m), p.y);
    },
    sinV: function(p, a, m){
        return new $.coord(p.x, this.sin(p.y, a, m));
    }
}   

$.anime = {
    algorithms: {
        ease: { }
    }
}

var easeLinear = function(ease){
    this._ease = ease || .1;
}
easeLinear.prototype = {
    calculate: function(current, end){ return (end - current) * this._ease; }
}
$.anime.algorithms.ease.linear = function(ease){ return new easeLinear(ease); }

var jump = function(){ }
jump.prototype = { calculate: function(current, end){ return end-current; } }
$.anime.algorithms.jump = function(){ return new jump(); }

var spring = function(spring, mu){
    this._spring = spring || .4;
    this._mu = mu || .6;
}
spring.prototype = {
    calculate: function(current, end, velocity){
        var spring = this._spring,
            v = velocity,
            mu = this._mu,
            distance = end - current,
            acceleration = distance * spring;
            
        v += acceleration;
        v *= mu;
        return v;
    }
}
$.anime.algorithms.spring = function(force, mu){
    return new spring(force, mu);
}

function dndDragCoordStrategy(context){
    this._context = context;
}
dndDragCoordStrategy.prototype = {
    findCoord: function(e){
        var context = this._context,
            periph = $.touch().canRead(e) ? $.touch() : $.mouse();

        return periph.documentCoord(e)
            .subtract(context.hitCoord())
            .subtract(context.hitOffset())
            .add(context.hitBoundedOffet());
    }
}

function dndSizeCoordStrategy(context){
    this._context = context;
}
dndSizeCoordStrategy.prototype = {
    findCoord: function(e){
        var context = this._context,
            periph = $.touch().canRead(e) ? $.touch() : $.mouse();
        return context.hitSize()
            .add(periph.documentCoord(e)
                    .subtract(context.hitCoord())
                    .subtract(context.hitOffset()));
    }
}

function dndScrollCoordStrategy(context){
    this._context = context;
}
dndScrollCoordStrategy.prototype = {
    findCoord: function(e){
        var context = this._context,
            periph = $.touch().canRead(e) ? $.touch() : $.mouse();

        return context.hitCoord()
            .add(context.hitOffset())
            .subtract(periph.documentCoord(e))
            .add(context.hitScrollOffset());
    }
}

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

dndState.dropped = function(){
    dndState.dropped.base.call(this, dndState);
}

dndState.dropped.prototype = {
    grab: function(e){
        $.evt.mute(e);
        var context = this.context(),
            periph = $.touch().canRead(e) ? $.touch() : $.mouse(),
            hitCoord = periph.documentCoord(e)
                        .subtract(context.offset());

        context.document()
            .ontouchmove(context.drag, context, $.uid())
            .ontouchend(context.drop, context, $.uid())
            .onmousemove(context.drag, context, $.uid())
            .onmouseup(context.drop, context, $.uid());

        context
            .disableSelect()
            .addClass("ku-dragger-grabbed")
            .hitSize(context.outerDims())
            .hitCoord(hitCoord)
            .hitOffset(context.offset())
            .hitScrollOffset(context.scrollOffset())
            .hitBoundedOffet(context.boundedOffset())
            .actor().to(context.dragCoord(e));

        this.state("grabbed");
    },
    drag: function(){ return; },
    drop: function(){ return; }
}
$.ext(dndState.dropped, $.abstractState);

dndState.grabbed = function(){
    dndState.grabbed.base.call(this, dndState);
}

dndState.grabbed.prototype = {
    grab: function(){ return; },
    drag: function(e){
        $.evt.mute(e);
        var context = this.context();
        context.actor().to(context.dragCoord(e));
        this.context().redraw();
    },
    drop: function(e){
        this.context()
            .enableSelect()
            .removeClass("ku-dragger-grabbed")
            .document().clearEvents();

        this.state("dropped");
    }
}
$.ext(dndState.grabbed, $.abstractState);

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

function fader(dom) {
    $.dom(dom).addClass("ku-fader");
    fader.base.call(this, dom);
}
fader.prototype = {
    $to: function(value){
        var d = this.dom(),
            dom = $.dom(d);
        dom.style("opacity", value * .01);
        return this;
    },
    $moveTo: function(value){
        var d = this.dom(),
            dom = $.dom(d),
            start = dom.style("opacity") || 1;
        
        this.$tween = $.tween(function(value){
                dom.style("opacity", value * .01);
            }, start, value, this.$algorithm)
            .onEnd(this.$done, this)
            .start(d);
    }
}
$.ext(fader, abstractMover);
$.fader = function(dom){ return new fader(dom); }

function fitter(dom) {
    $.dom(dom).addClass("ku-fitter");
    fitter.base.call(this, dom);
}
fitter.prototype = {
    $to: function(value){
        var d = this.dom(),
            dom = $.dom(d);
        dom.style("width", value.x() + "px");
        dom.style("height", value.y() + "px");
        return this;
    },
    $moveTo: function(coord) {
        var d = this.dom(),
            dom = $.dom(d),
            start = dom.outerDims();
        
        this.$tween = $.tween(function(value){
                dom.style("width", value.x() + "px");
                dom.style("height", value.y() + "px");
            }, start, fitter_findFitCoord(this, coord), this.$algorithm)
            .onEnd(this.$done, this)
            .start(d);
    }
}
$.ext(fitter, abstractMover);

function fitter_findFitCoord(fitter, coord){
    var fitRatio = coord.y() / coord.x(),
        dom = $.dom(fitter.dom()),
        dims = dom.outerDims(),
        fitterAspect = dims.y() / dims.x(),
        aspectRatio = isNaN(fitterAspect) ? 1 : fitterAspect,
        x = dims.x(),
        y = dims.y();
    
    //I am wider than the location
    if((aspectRatio < fitRatio) ||
       (aspectRatio == fitRatio)) {
            x = coord.x();
            y = coord.x() * fitterAspect;
    }
    //I am taller than the location       
    if(aspectRatio > fitRatio) {
        x = coord.y() / fitterAspect;
        y = coord.y();
    }
    return $.coord(x, y);
}

$.fitter = function(dom){ return new fitter(dom);}

function pinner(dom) {
    $.dom(dom).addClass("ku-pinner");
    pinner.base.call(this, dom);
}
pinner.prototype = {
    $to: function(value){
        var d = this.dom(),
            dom = $.dom(d);
        dom.style("left", value.x() + "px");
        dom.style("top", value.y() + "px");
        return this;
    },
    $moveTo: function(coord) {
        var d = this.dom(),
            dom = $.dom(d),
            offset = dom.offset(),
            p = $.findOffset(d.parentNode),
            parentOffset = ($.coord.canParse(p)) ? $.coord.parse(p) : $.coord.zero(),
            start = offset.subtract(parentOffset);
        
        this.$tween = $.tween(function(value){
                dom.style("left", value.x() + "px");
                dom.style("top", value.y() + "px");
            }, start, coord, this.$algorithm)
            .onEnd(this.$done, this)
            .start(d);
    }
}
$.ext(pinner, abstractMover);
$.pinner = function(dom){ return new pinner(dom); }

function scroller(dom) {
    $.dom(dom).addClass("ku-scoller");
    scroller.base.call(this, dom);
}
scroller.prototype = {
    $to: function(value){
        var d = this.dom(),
            dom = $.dom(d);
        dom.style("scrollLeft", value.x());
        dom.style("scrollTop", value.y());
        return this;
    },
    $moveTo: function(coord) {
        var d = this.dom(),
            dom = $.dom(d),
            offset = dom.scrollOffset(),
            p = $.findOffset(d.parentNode),
            parentOffset = ($.coord.canParse(p)) ? $.coord.parse(p) : $.coord.zero(),
            start = offset.subtract(parentOffset);
        
        this.$tween = $.tween(function(value){
                dom.style("scrollLeft", value.x());
                dom.style("scrollTop", value.y());
            }, start, coord, this.$algorithm)
            .onEnd(this.$done, this)
            .start(d);
    }
}
$.ext(scroller, abstractMover);
$.scroller = function(dom){ return new scroller(dom); }

function sizer(dom) {
    $.dom(dom).addClass("ku-sizer");
    sizer.base.call(this, dom);
}
sizer.prototype = {
    $to: function(value){
        var d = this.dom(),
            dom = $.dom(d);
        dom.style("width", value.x() + "px");
        dom.style("height", value.y() + "px");
        return this;
    },
    $moveTo: function(coord) {
        var d = this.dom(),
            dom = $.dom(d),
            start = dom.outerDims();
        
        this.$tween = $.tween(function(value){
                dom.style("width", value.x() + "px");
                dom.style("height", value.y() + "px");
            }, start, coord, this.$algorithm)
            .onEnd(this.$done, this)
            .start(d);
    }
}
$.ext(sizer, abstractMover);
$.sizer = function(dom, ease, mu){ return new sizer(dom, ease, mu);}

function styler(dom, prop) {
    $.dom(dom).addClass("ku-styler");
    styler.base.call(this, dom);
    this._prop = prop;
}
styler.prototype = {
    $moveTo: function(value) {
        var d = this.dom(),
            dom = $.dom(d),
            p = this._prop,
            val = dom.style(p),
            s = $.ku.style,
            unit = s.getUnit(val) || "",
            start = s.toNumber(val);
        
        this.$tween = $.tween(function(value){
                dom.style(p, value + unit);
            }, start, value, this.$algorithm)
            .onEnd(this.$done, this)
            .start(d);
    }
}
$.ext(styler, abstractMover);
$.styler = function(dom, prop){ return new styler(dom, prop); }

function timeline(fps, state){
    timeline.base.call(this, state);
    this._listeners = $.observer();
    this._ticks = 0;
    this.fps(fps || 30);
}
timeline.prototype = {
    fps: function(fps){
        this._interval = 1000/fps;
        return this.property("fps", fps);
    },
    interval: function(){ return this.get("interval"); },
    listeners: function(){ return this.get("listeners"); },
    ticks: function(){ return this.get("ticks"); },
    start: function(){
        this._state.start();
        return this;
    },
    stop: function(){
        this._state.stop();
        return this;
    },
    add: function(func, scope, id, wait){
        var me = this,
            w = wait || 1,
            _id = id || $.uid("timeline"),
            stall = function() {
                if(!me._ticks % w == 0) return;
                func(); f = func;
            },
            f = (!wait) ? func : stall;
        this._listeners.add(f, scope, _id);
        return this;
    },
    remove: function(id){
        this._listeners.remove(id);
        return this;
    },
    clear: function(){ this._listeners.clear(); return this; },
    tick: function(){ this._ticks++; return this; }
}
$.ext(timeline, $.abstractContext);
$.timeline = function(){ return timeline_instance; }

timeline.started = function(){ timeline.started.base.call(this, timeline); }
timeline.started.prototype = {
    start: function(){ return; },
    stop: function(){
        clearTimeout(ku_timeline);
        ku_timeline = null;
        this.state("stopped");
    }
}
$.ext(timeline.started, $.abstractState)

timeline.stopped = function(){ timeline.stopped.base.call(this, timeline); }
timeline.stopped.prototype = {
    start: function(){
        var c = this.context(),
            i = c.interval(),
            t = function(){
                c.tick().listeners().notify();
                ku_timeline = setTimeout(t, i);
            }; 
        t();
        this.state("started");    
    },
    stop: function(){ return; }
}
$.ext(timeline.stopped, $.abstractState)

var timeline_instance = new timeline(30, new timeline.stopped()).start();

var abstractTween = function(method, start, end, algorithm){
    this.$method = method;
    this.$current = start;
    this.$end = end;
    this.$algorithm = algorithm;
    this.$value = 0;
    this._onEnd = $.observer();
    this._id = $.uid("tween");
}
abstractTween.prototype = {
    $exec: function(){ return; },
    $done: function(){ this._onEnd.notify(); },
    start: function(){
        $.timeline().add(this.$exec, this, this._id);
        return this;
    },
    stop: function(){
        $.timeline().remove(this._id);
        return this;
    },
    onEnd: function(f, s){ this._onEnd.add(f, s); return this; },
    clear: function(){
        this._onEnd.clear();
        return this;
    }
}
$.ext(abstractTween, $.Class);

var coordTween = function(method, start, end, algorithm){
    coordTween.base.call(this, method, start, end, algorithm);
    this.$value = $.coord.zero();
}
coordTween.prototype = {
    $exec: function(){
        var method = this.$method,
            current = this.$current,
            end = this.$end;
        var valueX = this.$algorithm.calculate(current.x(), end.x(), this.$value.x());
        var valueY = this.$algorithm.calculate(current.y(), end.y(), this.$value.y()),
            value = $.coord(valueX, valueY),
            diff = end.abs().subtract(current.abs());
        
        if((Math.abs(valueX) < .1) && (diff.x() < 1) &&
           (Math.abs(valueY) < .1) && (diff.y() < 1)) {
            method(end);
            this.stop()._onEnd.notify();
            return;
        }
        this.$current = current.add(value);
        this.$value = value;
        method(this.$current);
    }
}
$.ext(coordTween, abstractTween);

var numberTween = function(method, start, end, algorithm){
    numberTween.base.call(this, method, start, end, algorithm);
}
numberTween.prototype = {
    $exec: function(){
        var method = this.$method,
            current = this.$current,
            end = this.$end,
            value = this.$algorithm.calculate(current, end, this.$value);

        if((Math.abs(value) < .1) &&
           (Math.abs(end - current) < 1)) {
            method(end);
            this.stop().$done();
            return;
        }
        this.$current = current + value;
        this.$value = value;
        method(this.$current);
    }
}
$.ext(numberTween, abstractTween);

$.tween = function(method, start, end, algorithm){
    return ($.isNumber(start) && $.isNumber(end))
        ? new numberTween(method, start, end, algorithm)
        : new coordTween(method, start, end, algorithm);
}

function cell(dom, cIdx, cKey, rIdx, rKey, value) {
    cell.base.call(this, dom);
    this.id($.uid("jsx-cell"))
        .cIdx(cIdx)
        .cKey(cKey)
        .rIdx(rIdx)
        .rKey(rKey)
        .value(value);
}
cell.prototype = {
    id: function(id){ return this.property("id", id); },
    value: function(value){ return this.property("value", value); },
    cIdx: function(cIdx){
        if($.exists(cIdx)) this.dom().cIdx = cIdx;
        return this.property("cIdx", cIdx);
    },
    rIdx: function(rIdx){
        if($.exists(rIdx)) this.dom().rIdx = rIdx;
        return this.property("rIdx", rIdx);
    },
    cKey: function(cKey){
        if($.exists(cKey)) this.dom().cKey = cKey;
        return this.property("cKey", cKey);
    },
    rKey: function(rKey){
        if($.exists(rKey)) this.dom().rKey = rKey;
        return this.property("rKey", rKey);
    }
}
$.ext(cell, $.dom.Class);
$.cell = function(dom, cIdx, cKey, rIdx, rKey, value){
    return new cell(dom, cIdx, cKey, rIdx, rKey, value);
}
$.cell.Class = cell;

function column(dom, col, index, key, value) {
    column.base.call(this, dom);
    this.id($.uid())
        .col(col)
        .index(index)
        .key(key)
        .value(value);
        
    this._cells = $.hash();
}
column.prototype = {
    id: function(id){ return this.property("id", id); },
    col: function(col){ return this.property("col", col); },
    value: function(value){
        if($.exists(value)) this.content(value);
        return this.property("value", value);
    },
    index: function(index){
        if($.exists(index)) this.dom().cIdx = index;
        return this.property("index", index);
    },
    key: function(key){
        if($.exists(key)) this.dom().cKey = key;
        return this.property("key", key);
    },
    findCell: function(key){ return this._cells.find(key); },
    listCells: function(){ return this._cells.listValues(); },
    addCell: function(cell){
        this._cells.add(cell.rKey(), cell);
        return this;
    },
    removeCell: function(cell){
        var cells = this._cells;
        cells.remove(cell.rKey());
        if(cells.isEmpty()) {
            $.dom(this._col).detach();
            this.detach();
        }
        return this;
    },
}
$.ext(column, $.dom.Class);
$.column = function(dom, col, index, key, value){ return new column(dom, col, index, key, value); }
$.column.Class = column;



function draggableRowDecorator(table) {
    $.cast(this, table);
    
    this._dri = new $.iterator(this.rows.listValues());
    this.helper = $.create({"tr":{"class":"ku-table-dragRow-helper"}});
    $.slider(this.helper, null, null, null, null, null, "dragger", "vertical");
    this._isMoving = false;
    this._hitPoint;
    this._moveDom;
    
    function getPoint(dom) { return $.cast($.coord.parse($.findOffset(this.dom)), $.point);}
    
    this._dri.foreach(function(c){
        $.evt.add(c.dom, "mouseover", function(){
            if(!this._isMoving) return;
            var d = c.dom,
                b = this.body,
                h = this.helper,
                hp = this._hitPoint,
                p = getPoint(d);
            
            if(!d.nextSibling) b.appendChild(h);
            else if(p.isAbove(hp))b.insertBefore(h, d);
            else b.insertBefore(h, d.nextSibling);
            
            this._hitPoint = p;
        }, this);
        
        $.dnd(c.dom,
            function(){
                this.helper = c.dom;
                this._isMoving = true;
                this._hitPoint = getPoint(c.dom);
                this._moveDom = c.dom;
                this.body.insertBefore(this.helper, c.dom);
                $.ku.css.addClass(this.body, "ku-table-draggableRow-dragging");
                $.ku.css.addClass(this._moveDom, "ku-table-draggableRow-moveDom");
            },
            null,
            function(){
                $.ku.css.removeClass(this.body, "ku-table-draggableRow-dragging");
                $.ku.css.removeClass(this._moveDom, "ku-table-draggableRow-moveDom");
                $.ku.swapDom(this.helper, this._moveDom);
                this._isMoving = false;
                this._moveDom = null;
                this.format();
            }, this);
        
    }, this);
}

$.draggableRowDecorator = function(table){ return new draggableRowDecorator(table); }

function sizableColumnDecorator(table) {
    $.cast(this, table);
    
    this._sci = new $.iterator(this.columns.listValues());
    
    this._sci.foreach(function(c){
        var D = c.dom,
            s = $.create({"a":{"class":"ku-table-col-sizer"}});
        
        new $.slider(D, s, null, null, null, null, "sizer", "horizontal");
        
        D.appendChild(s);
    });
}

function sortableColumnDecorator(table) {
    $.cast(this, table);
    
    this._isAsc = false;
    this._asc = new $.sorter(sorter.strategy.asc);
    this._des = new $.sorter(sorter.strategy.des);

    this._sortci = new $.iterator(this.columns.listValues());
    this._sortci.foreach(function(c){
        
        var iCell = new $.iterator(c.cells.listValues()),
            sd = $.create({"a":{"class":"ku-table-col-sorter"}});
        c.dom.appendChild(sd);
            
        $.evt.add(sd, "click", function(){
            var cells = [],
                ia = this._isAsc,
                s = (ia) ? this._asc : this._des,
                f = "ku-table-col-sorter-{0}",
                a = $.str.format(f, "asc"),
                d = $.str.format(f, "dec"),
                cl = (ia) ? a : d;
                
            iCell.foreach(function(C){ cells[cells.length] = C.dom; });
            this._isAsc = !this._isAsc;
            
            var v = s.sort(cells), l = v.length, b = this.body;
            $.clearNode(b);
            
            while(l--) b.appendChild(this.rows.find(v[i].rIdx).dom);
            
            $.ku.css.removeClass(sd, a);
            $.ku.css.removeClass(sd, d);
            $.ku.css.addClass(sd, cl);
            
            this.format();
        }, this);
    }, this);
}

function table_factory(){
    table_factory.base.call(this);
}
table_factory.prototype = {
    table: function(table){ return this.set("table", table);  },
    createColumn: function(index, key, value) {
        var col = $.create({col:{}}),
            dom = $.create({th:{"ku-key":key}, content: $.create({"span":{"class":"ku-table-head-content"}, content:value}) });
        return $.column(dom, col, index, key, value);
    },
    createRow: function(index, key) {
        var dom = $.create({tr:{"class":"ku-table-row"}});
        return $.row(dom, index, key);
    },
    createCell: function(value, cIdx, cKey, rIdx, rKey) {
        var table = this._table,
            dom = $.create({td:{"class":"ku-table-cell"}, content: value}),
            cell = $.cell(dom,cIdx, cKey, rIdx, rKey, value)
                     .onclick(function() { table.selectCell(cell); }, this);
        return cell;
    }
}
$.ext(table_factory, $.Class);

function row(dom, index, key) {
    row.base.call(this, dom);
    this.id($.uid())
        .index(index)
        .key(key);
    this._cells = $.hash();
}
row.prototype = {
    id: function(id){ return this.property("id", id); },
    index: function(index){
        if($.exists(index)) this.dom().rIdx = index;
        return this.property("index", index);
    },
    key: function(key){
        if($.exists(key)) this.dom().rKey = key;
        return this.property("key", key);
    },
    findCell: function(key){ return this._cells.find(key); },
    listCells: function(){ return this._cells.listValues(); },
    addCell: function(cell){
        this._dom.appendChild(cell.dom());
        this._cells.add(cell.cKey(), cell);
        return this;
    },
    removeCell: function(cell){
        this._dom.removeChild(cell.dom());
        this._cells.remove(cell.cKey());
        return this;
    }
}
$.ext(row, $.dom.Class);
$.row = function(dom, index, key, value){ return new row(dom, index, key, value); }
$.row.Class = row;

function table(factory) {
    var dom = $.create({"table":{"class":"ku-table", "cellspacing":0}});
    table.base.call(this, dom);
    
    var colgroup = $.create({"colgroup":{"class":"ku-table-colgroup"}}),
        caption = $.create({"caption":{"class":"ku-table-caption"}}),
        head = $.create({"thead":{"class":"ku-table-head"}}),
        headRow = $.create({"tr":{"class":"ku-table-head-row"}}),
        body = $.create({"tbody":{"class":"ku-table-body"}}),
        foot = $.create({"tfoot":{"class":"ku-table-foot"}});

    this._columns = new $.hash();
    this._rows = new $.hash();
    this._cells = new $.hash();
    this._onCellSelect = $.observer();
    
    this.appendChild(colgroup).colgroup(colgroup)
        .appendChild(caption).caption(caption)
        .appendChild(head).head(head)
        .appendChild(headRow).headRow(headRow)
        .appendChild(body).body(body)
        .appendChild(foot).foot(foot)
        .factory(factory || new table_factory())
        .head().appendChild(this.headRow());
}

table.prototype = {
    title: function(title){
        if($.isString(title)) this.caption().innerHTML = title;
        else if($.exists(title)) this.caption().appendChild(title);
        return this.property("title", title);
    },
    factory: function(factory){ return this.property("factory", factory.table(this)); },
    caption: function(caption){ return this.property("caption", caption); },
    colgroup: function(colgroup){ return this.property("colgroup", colgroup); },
    head: function(head){ return this.property("head", head); },
    headRow: function(headRow){ return this.property("headRow", headRow); },
    body: function(body){ return this.property("body", body); },
    foot: function(foot){ return this.property("foot", foot); },
    listColumns: function(){ return this._columns.listValues(); },
    listRows: function(){ return this._rows.listValues(); },
    listCells: function(){ return this._cells.listValues(); },
    selectCell: function(cell) { this._onCellSelect.notify(cell); return this; },
    onCellSelect: function(f, s) { this._onCellSelect.add(f, s); return this; },

    addColumn: function(key, obj, value) {
        var columns = this._columns,
            rows = this._rows;

        if(columns.containsKey(key)) return this._updateColumn(key, obj, value);
        else return this._addColumn(key, obj, value);
    },
    _addColumn: function(key, obj, value){
        var column = this._factory.createColumn($.uid(), key, value);
        this._columns.add(column.key(), column);
        this._rows.listValues().each(function(row){
            this.addCell(row, column, obj[row.key()]);
        }, this);
        this._colgroup.appendChild(column.col());
        this._headRow.appendChild(column.dom());
        return this;
    },
    _updateColumn: function(key, obj, value){
        var column = this._columns.find(key);
        this._rows.listValues().each(function(row){
            this.findCell(row.key(), column.key()).value(obj[row.key()]);
        }, this);
        if($.exists(value)) column.value(value);
        return this;
    },
    findColumn: function(key){ return this._columns.find(key); },
    removeColumn: function(key){
        var rows = this._rows,
            column = this.findColumn(key);
        if(!$.exists(column)) return this;
        rows.listValues().each(function(row){
            this.removeCell(column.findCell(row.key()));
        }, this);
        this._columns.remove(column.key());
        return this;
    },
    addRow: function(key, obj) {
        var rows = this._rows,
            columns = this._columns;

        if(rows.containsKey(key)) return this._updateRow(key, obj);
        else return this._addRow(key, obj);
    },
    _addRow: function(key, obj){
        var row = this._factory.createRow($.uid(), key);
        this._rows.add(row.key(), row);
        this._columns.listValues().each(function(column){
            this.addCell(row, column, obj[column.key()])
        }, this);
        this.body().appendChild(row.dom());
        return this;
    },
    _updateRow: function(key, obj){
        var row = this._rows.find(key);
        this._columns.listValues().each(function(column){
            this.findCell(row.key(), column.key()).value(obj[column.key()]);
        }, this);
        return this;
    },
    findRow: function(key){ return this._rows.find(key); },
    removeRow: function(key){
        var columns = this._columns,
            row = this.findRow(key);
        if(!$.exists(row)) return this;
        columns.listValues().each(function(column){
            this.removeCell(row.findCell(column.key()));
        }, this);
        this._rows.remove(row.key());
        return this;
    },
    addCell: function(row, column, value){
        var cell = this._factory.createCell(value, column.index(), column.key(), row.index(), row.key());
        column.addCell(cell);
        row.addCell(cell);
        this._cells.add(cell.id(), cell);
        return this;
    },
    findCellById: function(id){ return this._cells.find(id); },
    findCell: function(rowKey, colKey){
        var cells = this._cells.listValues(), value;
        cells.each(function(cell){
            if((cell.rKey() == rowKey) &&
               (cell.cKey() == colKey)) {
                value = cell;
                cells.quit();
            }
        });
        return value;
    },
    removeCell: function(cell){
        this._cells.remove(cell.id());
        this._columns.find(cell.cKey()).removeCell(cell);
        this._rows.find(cell.rKey()).removeCell(cell);
        return this;
    },
    format: function(){
        var i = 0,
            e = "ku-table-row-even",
            o = "ku-table-row-odd",
            cn = function(){ (i % 2 == 0) ? e : o; };
        this._rows.each(function(row){
            row.removeClass(e)
               .removeClass(o)
               .addClass(cn());
            i++;
        });
    },
    toObject: function(){
        return { "title": this.title(),
                 "columns": this._columns.toObject(),
                 "rows": this._rows.toObject() }
    }
}
$.ext(table, $.dom.Class);
$.table = function(factory){ return new table(factory); }
$.table.Class = table;

table.parseDom = function(dom){
    var get = function(e, t){ return e.getElementsByTagName(t); }
        table = $.ele(dom),
        cols= get(get((get(table, "thead")[0]), "tr")[0], "th"),
        rows = get((get(table, "tbody")[0]), "tr"),
        caption = get(table, "caption")[0],
        title = (!caption) ? "" : caption.innerHTML,
        t = new $.table(title),
        l = cols.length,
        m = rows.length,
        c = [];
       
    while(i--) {
        var C = cols[i],
            k = $.ku.getText(C) || $.uid("table-column");
            
        c[c.length] = k;
        t.addColumn(k, C.innerHTML);
    }
    
    while(m--) {
        var tds = get(rows[j], "td"),
            n = tds.length,
            o = {};
            
            while(n--) o[c[k]] = tds[k].innerHTML;
            
        t.addRow(o);
    }
    return t;
}


table.parseObject = function(obj){
    var t = new $.table(obj.title),
        c = obj.columns,
        r = obj.rows;
        
    for(var n in c) t.addColumn(n, c[n]);
    for(var n in r) t.addRow(r[n]);
    
    return t;
}


var calendar = function() {
    calendar.base.call(this, $.create({"div":{"class":"ku-calendar"}}));

    var sheetContainerDom = $.create({"div":{"class":"ku-sheet"}});

    this._sheetContainer = $.dom(sheetContainerDom);
    this._onShowDates = $.observer();
    this._onShowMonths = $.observer();
    this._onShowYears = $.observer();
    this._onSelect = $.observer();
    this._sheet;

    this.dayPoint($.dayPoint.today())
        .localization($.ku.localization["en"])
        .sheetFactory($.clickableSheetFactory())
        .dom().appendChild(sheetContainerDom);
}
calendar.prototype = {
    dayPoint: function(dayPoint){ return this.property("dayPoint", dayPoint); },
    localization: function(localization){ return this.property("localization", localization); },
    sheetFactory: function(sheetFactory){ return this.set("sheetFactory", sheetFactory); },

    isShowingDates: function(){ return this._isShowingDates; },
    isShowingMonths: function(){ return this._isShowingMonths; },
    isShowingYears: function(){ return this._isShowingYears; },

    nextDay: function(){ this.dayPoint(this.dayPoint().nextDay()); return this; },
    prevDay: function(){ this.dayPoint(this.dayPoint().prevDay()); return this; },
    nextMonth: function(){ this.dayPoint(this.dayPoint().nextMonth()); return this; },
    prevMonth: function(){ this.dayPoint(this.dayPoint().prevMonth()); return this; },
    nextYear: function(){ this.dayPoint(this.dayPoint().nextYear()); return this; },
    prevYear: function(){ this.dayPoint(this.dayPoint().prevYear());return this; },

    showDates: function(){ return this._showSheet("createDatesheet")._currentView(false, false, true); },
    showMonths: function(){ return this._showSheet("createMonthsheet")._currentView(false, true, false); },
    showYears: function(){ return this._showSheet("createYearsheet")._currentView(true, false, false); },

    findCell: function(dayPoint) { return this._sheet.findCell(dayPoint); },
    each: function(f, s){ this._sheet.each(f, s); return this;},
    select: function(dayPoint){ this._sheet.select(dayPoint); return this; },
    onSelect: function(f, s) { this._onSelect.add(f, s); return this; },
    onShowDates: function(f, s) { this._onShowDates.add(f, s); return this; },
    onShowMonths: function(f, s) { this._onShowMonths.add(f, s); return this; },
    onShowYears: function(f, s) { this._onShowYears.add(f, s); return this; },
    _currentView: function(years, months, dates){
        this._isShowingYears = years;
        this._isShowingMonths = months;
        this._isShowingDates = dates;

        if(years) this._onShowYears.notify();
        if(months) this._onShowYears.notify();
        if(dates) this._onShowDates.notify();

        return this;
    },
    _showSheet: function(type){
        var currentSheet = this._sheet;
        if($.exists(currentSheet)) currentSheet.destroy();

        var sheet = this._sheetFactory[type](this.dayPoint(), this._localization)
                        .onSelect(this._onSelect.notify, this._onSelect);
        this._sheetContainer.clear().appendChild(sheet.dom());
        this._sheet = sheet;
        return this;
    }
}
$.ext(calendar, $.dom.Class);
$.calendar = function(){ return new calendar(); }

var calendarControlsDecorator = function(calendar) {
    calendarControlsDecorator.base.call(this, $.create({"div":{"class":"ku-calendar-controls"}}));

    this._calendar = calendar;

    var title = $.dom($.create({"div":{"class":"ku-calendar-title"}})),
        month = $.dom($.create({"button":{"class":"ku-calendar-month"}}))
                    .onclick(this.showMonths, this),
        year = $.dom($.create({"button":{"class":"ku-calendar-year"}}))
                    .onclick(this.showYears, this, this),
        prevButton = $.dom($.create({"button":{"class":"ku-calendar-prevButton"}}))
                        .onclick(function(){ this._prevAction(); }, this),
        nextButton = $.dom($.create({"button":{"class":"ku-calendar-nextButton"}}))
                        .onclick(function(){ this._nextAction(); }, this);

    $.dom(this.dom())
        .appendChild(title
                        .appendChild(month.dom())
                        .appendChild(year.dom())
                        .dom())
        .appendChild(prevButton.dom())
        .appendChild(nextButton.dom())
        .appendChild(calendar.dom());

    this._title = title;
    this._month = month;
    this._year = year;
    this._prevButton = prevButton;
    this._nextButton = nextButton;
    this._prevAction;
    this._nextAction;
    this.onSelect(this._displayDates, this);
}
calendarControlsDecorator.prototype = {
    dayPoint: function(dayPoint){
        var calendar = this._calendar;
        if(!$.exists(dayPoint)) return calendar.dayPoint();
        calendar.dayPoint(dayPoint);
        return this;
    },
    localization: function(localization){
        var calendar = this._calendar;
        if(!$.exists(localization)) return calendar.localization();
        calendar.localization(localization);
        return this;
    },
    sheetFactory: function(sheetFactory){
        this._calendar.sheetFactory(sheetFactory);
        return this;
    },
    nextDay: function(){  this._calendar.nextDay(); return this; },
    prevDay: function(){  this._calendar.prevDay(); return this; },
    nextMonth: function(){ this._calendar.nextMonth(); return this; },
    prevMonth: function(){ this._calendar.prevMonth(); return this; },
    nextYear: function(){  this._calendar.nextYear(); return this; },
    prevYear: function(){  this._calendar.prevYear(); return this; },

    showDates: function(){
        var calendar = this._calendar,
            locale = calendar.localization().month.name,
            dayPoint = calendar.dayPoint();
        calendar.showDates();
        this._month.html(locale[dayPoint.month()]);
        this._year.html(dayPoint.year());
        this._prevAction = this._prevMonth;
        this._nextAction = this._nextMonth;
        return this;
    },
    showMonths: function(){
        this._calendar.showMonths();
        var action = function(){ return; }
        this._prevAction = action;
        this._nextAction = action;
        return this;
    },
    showYears: function(){
        this._calendar.showYears();
        this._prevAction = this._prevYears;
        this._nextAction = this._nextYears;
        return this;
    },
    findCell: function(dayPoint){ return this._calendar.findCell(dayPoint); },
    each: function(f, s){ this._calendar.each(f, s); return this; },
    select: function(dayPoint){  this._calendar.select(dayPoint); return this; },
    onSelect: function(f, s) {  this._calendar.onSelect(f, s); return this; },
    onShowDates: function(f, s) {  this._calendar.onShowDates(f, s); return this; },
    onShowMonths: function(f, s) {  this._calendar.onShowMonths(f, s); return this; },
    onShowYears: function(f, s) {  this._calendar.onShowYears(f, s); return this; },
    _prevMonth: function() {
        this.prevMonth().showDates();
    },
    _nextMonth: function() {
        this.nextMonth().showDates();
    },
    _prevYears: function() {
        this.dayPoint(this.dayPoint().add(-12, 0, 0)).showYears();
    },
    _nextYears: function() {
        this.dayPoint(this.dayPoint().add(12, 0, 0)).showYears();
    },
    _displayDates: function(cell){
        var calendar = this._calendar,
            showingDates = calendar.isShowingDates(),
            showingMonths = calendar.isShowingMonths(),
            showingYears = calendar.isShowingYears(),
            dayPoint = calendar.dayPoint(),
            value = cell.value(),
            newValue;

        if(showingYears) newValue = $.dayPoint(value.year(), dayPoint.month(), dayPoint.date());
        if(showingMonths) newValue = $.dayPoint(dayPoint.year(), value.month(), dayPoint.date());
        if(showingDates) newValue = value;
        this.dayPoint(newValue);

        if(showingYears ||
           showingMonths ||
           (dayPoint.month() != value.month())) this.showDates();
    }
}
$.ext(calendarControlsDecorator, $.dom.Class);
$.calendarControlsDecorator = function(calendar){ return new calendarControlsDecorator(calendar); }

function clickableSheetFactory() { }
clickableSheetFactory.prototype = {
    createDatesheet: function(dayPoint, localization) {
        return $.datesheet(dayPoint, localization, $.table($.clickableDateSheetTableFactory(dayPoint, localization)));
    },
    createMonthsheet: function(dayPoint, localization) {
        return $.monthsheet(dayPoint, localization, $.table($.clickableMonthSheetTableFactory(dayPoint, localization)));
    },
    createYearsheet: function(dayPoint, localization) {
        return $.yearsheet(dayPoint, localization, $.table($.clickableYearSheetTableFactory(dayPoint, localization)));
    }
}
$.clickableSheetFactory = function(){ return new clickableSheetFactory(); }

function abstractDatesheetTableFactory(dayPoint, localization){
    abstractDatesheetTableFactory.base.call(this);
    this._dayPoint = dayPoint;
    this._localization = localization;
}
abstractDatesheetTableFactory.prototype = {
    $setCellAction: function(cell) { return cell; },
    table: function(table){
        this.$table = table;
        return this.set("table", table);
    },
    createColumn: function(index, key, value) {
        var index = this._table.listColumns().count(),
            col = $.create({col:{}}),
            dom = $.create({th:{"ku-key":key}, content: $.create({"span":{"class":"ku-table-head-content"}, content:value}) });
        return $.column(dom, col, index, key, value);
    },
    createRow: function(index, key) {
        var index = this._table.listRows().count(),
            cl = (index % 2 == 0)
                ? "ku-table-row ku-table-row-even"
                : "ku-table-row ku-table-row-odd";
            dom = $.create({tr:{"class":cl}});
        return $.row(dom, index, key);
    },
    createCell: function(value, cIdx, cKey, rIdx, rKey) {
        var table = this._table,
            today = $.dayPoint.today(),
            dom = $.create({td:{"class":$.str.format("ku-date-day-{0} ku-date-week-{1}", cIdx, rIdx)},
                           content: $.str.format("<span class='ku-datesheet-cell-date'>{0}</span>", value.date())}),
            cell = $.cell(dom, cIdx, cKey, rIdx, rKey, value)
                        .addClass("ku-sheet-date")
                        .id(value.toString());
        
        if(value.isBefore(today)) cell.addClass("ku-datesheet-past");
        if(value.equals(today)) cell.addClass("ku-datesheet-present");
        if(value.isAfter(today)) cell.addClass("ku-datesheet-future");
        if(value.isWeekday()) cell.addClass("ku-datesheet-weekday");
        if(value.isWeekend()) cell.addClass("ku-datesheet-weekend");
        if((value.month() < this._dayPoint.month()) ||
          ((value.month() == 12) && (this._dayPoint.month() == 1)))
            cell.addClass("ku-datesheet-lastMonth");
        if(value.month() == this._dayPoint.month())
            cell.addClass("ku-datesheet-thisMonth");
        if((value.month() > this._dayPoint.month()) ||
           ((value.month() == 1) && (this._dayPoint.month() == 12)))
            cell.addClass("ku-datesheet-nextMonth");
                    
        return this.$setCellAction(cell);
    }
}
$.ext(abstractDatesheetTableFactory, $.Class);

function abstractMonthsheetTableFactory(dayPoint, localization){
    abstractMonthsheetTableFactory.base.call(this);
    this._dayPoint = dayPoint;
    this._localization = localization;
}
abstractMonthsheetTableFactory.prototype = {
    $setCellAction: function(cell) { return cell; },
    table: function(table){
        this.$table = table;
        return this.set("table", table);
    },
    createColumn: function(index, key, value) {
        var index = this._table.listColumns().count(),
            col = $.create({col:{}}),
            dom = $.create({th:{"ku-key":key}, content: $.create({"span":{"class":"ku-table-head-content"}, content:value}) });
        return $.column(dom, col, index, key, value);
    },
    createRow: function(index, key) {
        var index = this._table.listRows().count(),
            cl = (index % 2 == 0)
                ? "ku-table-row ku-table-row-even"
                : "ku-table-row ku-table-row-odd";
            dom = $.create({tr:{"class":cl}});
        return $.row(dom, index, key);
    },
    createCell: function(value, cIdx, cKey, rIdx, rKey) {
        var dom = $.create({td:{"class":$.str.format("ku-month", cIdx, rIdx)},
                           content: this._localization.month.abbr[value.month()]}),
            cell = $.cell(dom, cIdx, cKey, rIdx, rKey, value)
                        .addClass("ku-sheet-month")
                        .id(value.month().toString());

        return this.$setCellAction(cell);
    }
}
$.ext(abstractMonthsheetTableFactory, $.Class);

function abstractYearsheetTableFactory(dayPoint, localization){
    abstractYearsheetTableFactory.base.call(this);
    this._dayPoint = dayPoint;
    this._localization = localization;
}
abstractYearsheetTableFactory.prototype = {
    $setCellAction: function(cell) { return cell; },
    table: function(table){
        this.$table = table;
        return this.set("table", table);
    },
    createColumn: function(index, key, value) {
        var index = this._table.listColumns().count(),
            col = $.create({col:{}}),
            dom = $.create({th:{"ku-key":key}, content: $.create({"span":{"class":"ku-table-head-content"}, content:value}) });
        return $.column(dom, col, index, key, value);
    },
    createRow: function(index, key) {
        var index = this._table.listRows().count(),
            cl = (index % 2 == 0)
                ? "ku-table-row ku-table-row-even"
                : "ku-table-row ku-table-row-odd";
            dom = $.create({tr:{"class":cl}});
        return $.row(dom, index, key);
    },
    createCell: function(value, cIdx, cKey, rIdx, rKey) {
        var dom = $.create({td:{"class":$.str.format("ku-year", cIdx, rIdx)},
                           content: value.year()}),
            cell = $.cell(dom, cIdx, cKey, rIdx, rKey, value)
                        .addClass("ku-sheet-year")
                        .id(value.year().toString());

        return this.$setCellAction(cell);
    }
}
$.ext(abstractYearsheetTableFactory, $.Class);

function clickableDateSheetTableFactory(dayPoint, localization){
    clickableDateSheetTableFactory.base.call(this, dayPoint, localization);
}
clickableDateSheetTableFactory.prototype = {
    $setCellAction: function(cell) {
        return cell.onclick(function() { this.$table.selectCell(cell); }, this);
    }
}
$.ext(clickableDateSheetTableFactory, abstractDatesheetTableFactory);
$.clickableDateSheetTableFactory = function(dayPoint, localization){
    return new clickableDateSheetTableFactory(dayPoint, localization);
}

function clickableMonthSheetTableFactory(dayPoint, localization){
    clickableMonthSheetTableFactory.base.call(this, dayPoint, localization);
}
clickableMonthSheetTableFactory.prototype = {
    $setCellAction: function(cell) {
        return cell.onclick(function() { this.$table.selectCell(cell); }, this);
    }
}
$.ext(clickableMonthSheetTableFactory, abstractMonthsheetTableFactory);
$.clickableMonthSheetTableFactory = function(dayPoint, localization){
    return new clickableMonthSheetTableFactory(dayPoint, localization);
}

function clickableYearSheetTableFactory(dayPoint, localization){
    clickableYearSheetTableFactory.base.call(this, dayPoint, localization);
}
clickableYearSheetTableFactory.prototype = {
    $setCellAction: function(cell) {
        return cell.onclick(function() { this.$table.selectCell(cell); }, this);
    }
}
$.ext(clickableYearSheetTableFactory, abstractYearsheetTableFactory);
$.clickableYearSheetTableFactory = function(dayPoint, localization){
    return new clickableYearSheetTableFactory(dayPoint, localization);
}

var abstractSheet = function(dom, localization) {
    abstractSheet.base.call(this, dom);

    this.localization(localization);
    this._onSelect = $.observer();
}
abstractSheet.prototype = {
    $findCell: function(dayPoint){ return null; },
    localization: function(localization) {
        return this.property("localization", localization);
    },
    each: function(f, s) { this.$sheet.listCells().each(f, s); return this; },
    findCell: function(dayPoint){ return this.$findCell(dayPoint); },
    selectCell: function(cell){
        if(!$.exists(cell)) return this;
        this._onSelect.notify(cell);
        return this;
    },
    select: function(dayPoint) {
        return this.selectCell(this.findCell(dayPoint));
    },
    onSelect: function(f, s) { this._onSelect.add(f, s); return this; },
    destroy: function() {
        this.$sheet.listCells().each(function(cell){
            if($.exists(cell.deallocate)) cell.deallocate();
            cell.clearEvents();
            return this;
        });
    }
}
$.ext(abstractSheet, $.dom.Class);

var datesheet = function(dayPoint, localization, table) {

    this._firstDateOfSheet = datesheet_findFirstDateOfSheet(dayPoint);
    this.$sheet = table.onCellSelect(this.selectCell, this);

    datesheet.base.call(this, this.$sheet.dom(), localization);

    datesheet_createColumns(this);
    datesheet_createRows(this);
}
datesheet.prototype = {
    $findCell: function(dayPoint){
        return this.$sheet.findCellById(dayPoint.toString());
    }
}
$.ext(datesheet, abstractSheet);
$.datesheet = function(dayPoint, localization, tbl){
    return (new datesheet(dayPoint, localization, tbl));
}

function datesheet_findFirstDateOfSheet(dayPoint){
    var firstDayOfMonth = dayPoint.firstDayOfMonth(),
        currentDay = dayPoint.firstDayOfMonth(),
        secondIteration = false;
    while(currentDay.day() > 0 || !secondIteration) {
        if(currentDay.day() == 0) secondIteration = true;
        currentDay = currentDay.prevDay();
    }
    return currentDay;
}
function datesheet_createColumns(sheet){
    var days = sheet.localization().day.abbr,
        tbl = sheet.$sheet,
        numberOfDays = 7,
        i = 0;

    while(i < numberOfDays) {
        var day = days[i];
        tbl.addColumn(day, {}, day);
        i++;
    }
}
function datesheet_createRows(sheet) {
    var tbl = sheet.$sheet,
        currentDate = sheet._firstDateOfSheet,
        i = 0;
    while(i < 7){
        var week = datesheet_createRow(sheet, currentDate);
        currentDate = currentDate.add(0, 0, 7);
        tbl.addRow($.uid(), week);
        i++;
    }
}  
function datesheet_createRow(sheet, dayPoint) {
    var currentDay = dayPoint, row = {};
    sheet.$sheet.listColumns().each(function(column){
         row[column.key()] = currentDay;
         currentDay = currentDay.nextDay();
    });
    return row;
}

var monthsheet = function(dayPoint, localization, table) {

    this._firstDateOfSheet = monthsheet_findFirstDateOfSheet(dayPoint);
    this.$sheet = table.onCellSelect(this.selectCell, this);

    monthsheet.base.call(this, this.$sheet.dom(), localization);

    monthsheet_createColumns(this);
    monthsheet_createRows(this);
}
monthsheet.prototype = {
    $findCell: function(dayPoint){
        return this.$sheet.findCellById(dayPoint.month());
    }
}
$.ext(monthsheet, abstractSheet);
$.monthsheet = function(dayPoint, localization, tbl){
    return (new monthsheet(dayPoint, localization, tbl));
}

function monthsheet_findFirstDateOfSheet(dayPoint){
    return $.dayPoint(dayPoint.year(), 1, dayPoint.date());
}
function monthsheet_createColumns(sheet){
    var months = sheet.localization().month.abbr,
        tbl = sheet.$sheet,
        numberOfMonths = 4,
        i = 1;
        
    while(i <= numberOfMonths) {
        tbl.addColumn(i, null, "");
        i++;
    }
}
function monthsheet_createRows(sheet) {
    var tbl = sheet.$sheet,
        currentDate = sheet._firstDateOfSheet,
        i = 1;
    while(i <= 3){
        var months = monthsheet_createRow(sheet, currentDate);
        currentDate = currentDate.add(0, 4, 0);
        tbl.addRow($.uid(), months);
        i++;
    }
}  
function monthsheet_createRow(sheet, dayPoint) {
    var currentDay = dayPoint, row = {};
    sheet.$sheet.listColumns().each(function(column){
         row[column.key()] = currentDay;
         currentDay = currentDay.nextMonth();
    });
    return row;
}

var yearsheet = function(dayPoint, localization, table) {

    this._firstDateOfSheet = yearsheet_findFirstDateOfSheet(dayPoint);
    this.$sheet = table.onCellSelect(this.selectCell, this);

    yearsheet.base.call(this, this.$sheet.dom(), localization);

    yearsheet_createColumns(this);
    yearsheet_createRows(this);
}
yearsheet.prototype = {
    $findCell: function(dayPoint){
        return this.$sheet.findCellById(dayPoint.year());
    }
}
$.ext(yearsheet, abstractSheet);
$.yearsheet = function(dayPoint, localization, tbl){
    return (new yearsheet(dayPoint, localization, tbl));
}

function yearsheet_findFirstDateOfSheet(dayPoint){
    return dayPoint.add(-12, 0, 0);
}
function yearsheet_createColumns(sheet){
    var months = sheet.localization().month.abbr,
        tbl = sheet.$sheet,
        numberOfYears = 5,
        i = 0;
        
    while(i < numberOfYears) {
        tbl.addColumn(i, null, "");
        i++;
    }
}
function yearsheet_createRows(sheet) {
    var tbl = sheet.$sheet,
        currentDate = sheet._firstDateOfSheet,
        i = 0;
    while(i < 5){
        var years = yearsheet_createRow(sheet, currentDate);
        currentDate = currentDate.add(5, 0, 0);
        tbl.addRow($.uid(), years);
        i++;
    }
}  
function yearsheet_createRow(sheet, dayPoint) {
    var currentDay = dayPoint, row = {};
    sheet.$sheet.listColumns().each(function(column){
         row[column.key()] = currentDay;
         currentDay = currentDay.nextYear();
     });
    return row;
}

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

var dndScreen = function() {
    this._targets = $.hash();
    this._droppers = $.hash();
    this._onHit = $.observer();
    this._lastKnownCoord;

    this._helper = $.sprite($.create({"div":{"class":"ku-dndScreen-helper"}}))
                        .onGrab(function(e) {
                            var periph = $.touch().canRead(e) ? $.touch() : $.mouse();
                            this._lastKnownCoord = periph.documentCoord(e);
                        }, this)
                        .onDrag(function(e) {
                            var periph = $.touch().canRead(e) ? $.touch() : $.mouse();
                            this._lastKnownCoord = periph.documentCoord(e);
                        }, this)
                        .onDrop(function(e){ this._drop(e); }, this);
    this._currentDropper;
}
dndScreen.prototype = {
    addTarget: function(target) {
        this._targets.add(target.id(), target);
        return this;
    },
    removeTarget: function(target) {
        this._targets.remove(target.id(), target);
        return this;
    },
    addDropper: function(dropper) {
        var mouseEventId = $.uid("dropperEvent"),
            touchEventId = $.uid("dropperEvent");

        function action(e){
            this._currentDropper = dropper;
            this.activateHelper(e, dropper);
        }
        dropper
            .mouseEventId(mouseEventId)
            .touchEventId(touchEventId)
            .handle()
            .onmousedown(action, this, mouseEventId)
            .ontouchstart(action, this, touchEventId);

        this._droppers.add(dropper.id(), dropper);
    },
    removeDropper: function(dropper) {
        dropper.handle()
            .removeEvent(dropper.touchEventId())
            .removeEvent(dropper.mouseEventId());
        this._droppers.remove(dropper.id());
    },
    activateHelper: function(e, dropper) {
        this._helper.appendTo(document.body)
            .pinTo(dropper.offset().subtract(dropper.scrollOffset()).add($.window().scrollOffset()))
            .content(dropper.cloneNode())
            .grab(e)
    },
    deactivateHelper: function() {
        this._helper.html("").detach();
        this._currentDropper = undefined;
    },
    clearTargets: function() {
        this._targets.clear();
        return this;
    },
    clearDroppers: function() {
        var droppers = this._droppers;
        droppers.listValues().each(function(dropper){
            this.removeDropper(dropper);
        }, this);
        return this;
    },
    clearAll: function() {
        this.clearTargets().clearDroppers();
        return this;
    },
    clearListeners: function() {
        this._onHit.clear();
        return this;
    },
    onHit: function(f, s) {
        this._onHit.add(f, s);
        return this;
    },
    _drop: function(e){
        var hitTarget = this._findHitTarget(e),
            dropper = this._currentDropper;
        if($.exists(hitTarget) && $.exists(dropper))
            this._onHit.notify(hitTarget, dropper);
        this.deactivateHelper();
    },
    _findHitTarget: function(e){
        var targets = this._targets.listValues(),
            periph = $.touch().canRead(e) ? $.touch() : $.mouse(),
            hitTarget = null,
            coord;

        try { coord = periph.documentCoord(e); }
        catch(e) { coord = this._lastKnownCoord}

        targets.each(function(target){
            if(!target.contains(coord)) return;
            hitTarget = target;
            targets.quit();
        });
        return hitTarget;
    }
}
$.dndScreen = function(){ return new dndScreen(); }

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

function abstractCheckbox(dom){
    abstractCheckbox.base.call(this, dom);
    this._isinvalid = false;
    this._keyup = $.uid();
    this._$dom = $.dom(this.dom());
    this.onInvalid(this.invalidate, this)
        .onIsValid(this.validate, this);
}
abstractCheckbox.prototype = {
    $clear: function(){ return this.value("").validate(); },
    tooltip: function(tooltip){ return this.set("tooltip", tooltip); },
    invalidate: function(){
        if(this._isinvalid) return this;
        this._isinvalid = true;
        this._$dom
            .addClass("ku-field-error")
            .onchange(this.isValid, this, this._keyup);
        var tt = this._tooltip;
        if($.exists(tt)) tt.show().rightOf(this.dom());
        return this;
    },
    validate: function(){
        if(!this._isinvalid) return this;
        this._isinvalid = false;
        this._$dom
            .removeClass("ku-field-error")
            .removeEvent(this._keyup);
        var tt = this._tooltip;
        if($.exists(tt)) tt.hide();
        return this;
    }
}
$.ext(abstractCheckbox, $.checkbox.Class);

function abstractField(dom){
    abstractField.base.call(this, dom);
    this._isinvalid = false;
    this._keyupid = $.uid();
    this._$dom = $.dom(this.dom());
    this.onInvalid(this.invalidate, this)
        .onIsValid(this.validate, this);
}
abstractField.prototype = {
    $clear: function(){ return this.value("").validate(); },
    tooltip: function(tooltip){ return this.set("tooltip", tooltip); },
    watermark: function(watermark){ return this.set("watermark", watermark); },
    invalidate: function(){
        if(this._isinvalid) return this;
        this._isinvalid = true;
        this._$dom
            .addClass("ku-field-error")
            .onkeyup(this.isValid, this, this._keyupid);
        var tt = this._tooltip;
        if($.exists(tt)) tt.show().rightOf(this.dom());
        return this;
    },
    validate: function(){
        if(!this._isinvalid) return this;
        this._isinvalid = false;
        this._$dom
            .removeClass("ku-field-error")
            .removeEvent(this._keyupid);
        var tt = this._tooltip;
        if($.exists(tt)) tt.hide();
        return this;
    }
}
$.ext(abstractField, $.field.Class);

function abstractSelect(dom){
    abstractSelect.base.call(this, dom);
    this._isinvalid = false;
    this._keyup = $.uid();
    this._$dom = $.dom(this.dom());
    this.onInvalid(this.invalidate, this)
        .onIsValid(this.validate, this);
}
abstractSelect.prototype = {
    $clear: function(){ return this.value("").validate(); },
    tooltip: function(tooltip){ return this.set("tooltip", tooltip); },
    invalidate: function(){
        if(this._isinvalid) return this;
        this._isinvalid = true;
        this._$dom
            .addClass("ku-field-error")
            .onchange(this.isValid, this, this._keyup);
        var tt = this._tooltip;
        if($.exists(tt)) tt.show().rightOf(this.dom());
        return this;
    },
    validate: function(){
        if(!this._isinvalid) return this;
        this._isinvalid = false;
        this._$dom
            .removeClass("ku-field-error")
            .removeEvent(this._keyup);
        var tt = this._tooltip;
        if($.exists(tt)) tt.hide();
        return this;
    }
}
$.ext(abstractSelect, $.select.Class);

function checkboxField(dom){
    checkboxField.base.call(this, dom);
    this.tooltip($.tooltip().message("Invalid"));
}
$.ext(checkboxField, abstractCheckbox);
$.fields.checkbox = function(dom){ return new checkboxField(dom); }

function dayPointField(dom){
    dayPointField.base.call(this, dom);
    this._id = $.uid("field");
    this._isShow = false;
    this._calendar = $.calendarControlsDecorator($.calendar())
                        .onSelect(function(date){
                            this.value(date.value().toString()).validate();
                            //this.dom().select();
                            this.hideCalendar();
                        }, this)
                        .showDates();
    this._calContainer = $.tooltip()
                        .pointer($.sprite($.create({"div":{"class":"ku-dayPointField-tooltip-pointer"}})).hide().dragOff())
                        .tooltip($.sprite($.create({"div":{"class":"ku-dayPointField-tooltip"}})).hide().dragOff())
                        .message(this._calendar.dom());

    this._$dom = $.dom(this.dom())
        .onfocus(this._focusAction, this)
        .onkeyup(this._keyupAction, this)
        .onkeydown(this._keydownAction, this);

        this.spec($.fields.specs.date)
            .tooltip($.tooltip().message("Enter a valid date."));
}
dayPointField.prototype = {
    $read: function(){ return ($.dayPoint.tryParse(this.dom().value) || "").toString(); },
    $write: function(value){ this.dom().value = ($.dayPoint.tryParse(value) || value).toString(); },
    showCalendar: function(){
        if(this._isShow) return;
        this._isShow = true;
        this._calContainer.show().at(this.dom(), ["below", "above"]);
        $.window().onmouseup(this._hideCalendar, this, this._id);
		return this;
    },
    hideCalendar: function(e){
        this._calContainer.hide();
        this._calendar.detach();
        $.window().remove(this._id);
        this._isShow = false;
		return this;
    },
    _hideCalendar: function(e) {
        var cal = this._calendar,
            ctl = cal.offset(),
            cbr = ctl.add(cal.outerDims()),
            inp = this._$dom,
            itl = inp.offset(),
            ibr = itl.add(inp.outerDims()),
            calendar = $.rectangle(ctl, cbr),
            input = $.rectangle(itl, ibr),
            mouse = $.mouse().documentCoord(e);

        if(calendar.contains(mouse) ||
           input.contains(mouse)) return this;

        this.hideCalendar();
		return this;
    },
    _focusAction: function(e) {
		this.showCalendar(); 
		return this;
	},
    _keyupAction: function(e) { 
		this.showCalendar(); 
		return this; 
	},
    _keydownAction: function(e) {
        var key = $.key.parse(e),
            tab = $.key(9),
            tabShift = $.key(9, false, false, true);
        if (key.equals(tab) || key.equals(tabShift))
        this.hideCalendar(); 
		return this;
    }
}
$.ext(dayPointField, abstractField);
$.fields.dayPoint = function(dom){ return new dayPointField(dom); }

function emailField(dom){
    emailField.base.call(this, dom);
    this.spec($.fields.specs.email)
        .tooltip($.tooltip().message("Enter a valid email address."));
}
emailField.prototype = {
    $read: function(){ return this.dom().value; },
    $write: function(value){ this.dom().value = value; }
}
$.ext(emailField, abstractField);
$.fields.email = function(dom){ return new emailField(dom); }

function field(dom){
    field.base.call(this, dom);
    this.tooltip($.tooltip().message("Invalid"));
}
$.ext(field, abstractField);
$.fields.field = function(dom){ return new field(dom); }

function moneyField(dom){
    moneyField.base.call(this, dom);
    this.spec($.fields.specs.currency)
        .tooltip($.tooltip().message("Enter a valid money amount."));
    $.dom(this.dom()).onblur(function(){ this.value(this.value()); }, this);
}
moneyField.prototype = {
    $read: function(){
        var value = this.dom().value;
        return ($.money.canParse(value))
            ? $.money.parse(value).value()
            : value;
    },
    $write: function(value){ this.dom().value = $.money.tryParse(value) || value; }
}
$.ext(moneyField, abstractField);
$.fields.money = function(dom){ return new moneyField(dom); }

function phoneField(dom){
    phoneField.base.call(this, dom);
    this.spec($.fields.specs.phone)
        .tooltip($.tooltip().message("Enter a valid phone number including area code."));
    $.dom(this.dom()).onblur(function(){ this.value(this.value()); }, this);
}
phoneField.prototype = {
    $read: function(){ return this.dom().value.replace(/[^\d]/g, ""); },
    $write: function(value){
        this.dom().value = (function(v, f) {
                var a = v.replace(/[^\d]/g, "").split(/\B/), i = 0, l = a.length,
                    rv = (l < 11) ? f.replace(/^#\s/, "") : f;
                while(i < l) { rv = rv.replace("#", a[i]); i++; }
                return (/#/.test(rv)) ? value : rv;
            })(value, "# (###) ###-####");
    }
}
$.ext(phoneField, abstractField);
$.fields.phone = function(dom, format){ return new phoneField(dom, format); }

function selectField(dom){
    selectField.base.call(this, dom);
    this.tooltip($.tooltip().message("Invalid"));
}
$.ext(selectField, abstractSelect);
$.fields.select = function(dom){ return new selectField(dom); }

function highlighter(){ }
highlighter.prototype = {
    highlight: function(selection, color){
        var range = selection.getRangeAt(0);
        try {
            document.designMode = "on";
                selection.removeAllRanges();
                selection.addRange(range);

                if (!document.execCommand("HiliteColor", false, color))
                    document.execCommand("BackColor", false, color);

            document.designMode = "off";
        }
        catch(e) {
            try {
                range = document.selection.createRange();
                range.execCommand("BackColor", false, color);
            }
            catch(ex){ /*Fail*/ }
        }
    },
    clear: function(){ }
}
$.highlighter = function(){ return new highlighter(); }

function keyboard(){
    this._onKeyPressed = $.observer();
    keyboard.base.call(this, $.create({div:{"class":"ku-keyboard"}}));
}
keyboard.prototype = {
    addKey: function(code){
        $.onScreenKey(code)
            .addClass($.str.format("ku-keyboard-key ku-key-{0}", code))
            .onPress(this._onKeyPressed.notify, this._onKeyPressed)
            .appendTo(this.dom());
        return this;
    },
    onKeyPressed: function(f, s){
        this._onKeyPressed.add(f, s);
		return this;
    }
}
$.ext(keyboard, $.dom.Class);
$.onScreenKeyboard = function(){ return new keyboard(); }

function key(code){
    if(!$.isNumber(code))
        $.exception("arg", $.str.format("Invalid argument code:{0}", code));

    this._value = $.key(code);
    this._onPress = $.observer();
    this._onRelease = $.observer();

    key.base.call(this, $.create({button:{"class":"ku-keyboard-key"}, content: this._value.toString()}));

    this.onmousedown(function() { this._onPress.notify(this._value); }, this)
        .ontouchstart(function() { this._onPress.notify(this._value); }, this)
        .onmouseup(function() { this._onRelease.notify(this._value); }, this)
        .ontouchend(function() { this._onRelease.notify(this._value); }, this)
}
key.prototype = {
    onPress: function(f, s){
        this._onPress.add(f, s);
        return this;
    },
    onRelease: function(f, s){
        this._onRelease.add(f, s);
        return this;
    }
}
$.ext(key, $.dom.Class);
$.onScreenKey = function(code){ return new key(code); }

function scrubber (dom){
    scrubber.base.call(this, dom);
    //need a dragger constrained to the x or y coord
    //this class should return to someone the degree to which it has moved
    //This class needs an upper and lower bound
    //  How far it is allowed to move
    //  It will be allowed to move from left 0 to left dist-dim(x|y)
}
scrubber.prototype = {
    value: function(){ /*What does this mean?*/},
    ratio: function(){ return this.minValue()/this.maxValue(); },
    minValue: function(minValue){ this.get("minValue", minValue); },
    maxValue: function(maxValue){ this.get("maxValue", maxValue); }
}
$.ext(scrubber, $.dom.Class);

function scrubline (){

}
scrubline.prototype = {

}

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

var abstractTooltipStrategy = function(tooltip, multiplier){
    this.$offset = 0;
    this.$multiplier = multiplier;
    this._tooltip = tooltip;
    this.overlap(0);
}
abstractTooltipStrategy.prototype = {
    $above: function(context, pointer, tooltip){ return; },
    $below: function(context, pointer, tooltip){ return; },
    $leftOf: function(context, pointer, tooltip){ return; },
    $rightOf: function(context, pointer, tooltip){ return; },
    overlap: function(overlap){ return this.set("overlap", overlap); },
    above: function(dom){
        var tooltip = this._tooltip,
            context = tooltip.context(dom).context(),
            pointer = tooltip.pointer(),
            content = tooltip.tooltip();
            
        this.$offset = this._overlap;   
        this.$above(context, pointer, content);
        return this;
    },
    below: function(dom){
        var tooltip = this._tooltip,
            context = tooltip.context(dom).context(),
            pointer = tooltip.pointer(),
            content = tooltip.tooltip();
            
        this.$offset = this._overlap;   
        this.$below(context, pointer, content);
        return this;
    },
    leftOf: function(dom){
        var tooltip = this._tooltip,
            context = tooltip.context(dom).context(),
            pointer = tooltip.pointer(),
            content = tooltip.tooltip();
            
        this.$offset = this._overlap;   
        this.$leftOf(context, pointer, content);
        return this;
    },
    rightOf: function(dom){
        var tooltip = this._tooltip,
            context = tooltip.context(dom).context(),
            pointer = tooltip.pointer(),
            content = tooltip.tooltip();
            
        this.$offset = this._overlap;   
        this.$rightOf(context, pointer, content);
        return this;
    }
}
$.ext(abstractTooltipStrategy, $.Class);

var tooltipStrategyCenter = function(tooltip, multiplier){
    tooltipStrategyCenter.base.call(this, tooltip, .5);
}
tooltipStrategyCenter.prototype = {
    $above: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .subtract(pointer.outerHeight())
                    .add($.coord(context.outerDims().subtract(pointer.outerDims()).x() * this.$multiplier, 0)));
        
        tooltip.pinTo(pointer.offset()
            .subtract(tooltip.outerHeight())
            .add($.coord(0, this.$offset))
            .add($.coord(pointer.outerDims().subtract(tooltip.outerDims()).x() * this.$multiplier, 0)));
        
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $below: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .add(context.outerHeight())
                    .add($.coord(context.outerDims().subtract(pointer.outerDims()).x() * this.$multiplier, 0)));
    
        tooltip.pinTo(pointer.offset()
            .add(pointer.outerHeight())
            .subtract($.coord(0, this.$offset))
            .add($.coord(pointer.outerDims().subtract(tooltip.outerDims()).x() * this.$multiplier, 0)));
 
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $leftOf: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .subtract(pointer.outerWidth())
                    .add($.coord(0, context.outerDims().subtract(pointer.outerDims()).y() * this.$multiplier)));
     
        tooltip.pinTo(pointer.offset()
            .subtract(tooltip.outerWidth())
            .add($.coord(this.$offset, 0))
            .add($.coord(0, pointer.outerDims().subtract(tooltip.outerDims()).y() * this.$multiplier)));
   
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $rightOf: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .add(context.outerWidth())
                    .add($.coord(0, context.outerDims().subtract(pointer.outerDims()).y() * this.$multiplier)));
                
        tooltip.pinTo(pointer.offset()
            .add(pointer.outerWidth())
            .subtract($.coord(this.$offset, 0))
            .add($.coord(0, pointer.outerDims().subtract(tooltip.outerDims()).y() * this.$multiplier)));

        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    }
}
$.ext(tooltipStrategyCenter,
      abstractTooltipStrategy);

var tooltipStrategyLeftJustify = function(tooltip, multiplier){
    tooltipStrategyLeftJustify.base.call(this, tooltip, 0);
}
tooltipStrategyLeftJustify.prototype = {
    $above: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .subtract(pointer.outerHeight())
                    .add($.coord(this.$offset, 0))
                    .add($.coord(context.outerDims().subtract(pointer.outerDims()).x() * this.$multiplier, 0)));

        tooltip.pinTo(pointer.offset()
            .subtract(tooltip.outerHeight())
            .add($.coord(-this.$offset, this.$offset))
            .add($.coord(pointer.outerDims().subtract(tooltip.outerDims()).x() * this.$multiplier, 0)));

        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $below: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .add(context.outerHeight())
                    .add($.coord(this.$offset, 0))
                    .add($.coord(context.outerDims().subtract(pointer.outerDims()).x() * this.$multiplier, 0)));
        
        tooltip.pinTo(pointer.offset()
            .add(pointer.outerHeight())
            .subtract($.coord(this.$offset, this.$offset))
            .add($.coord(pointer.outerDims().subtract(tooltip.outerDims()).x() * this.$multiplier, 0)));
        
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $leftOf: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .subtract(pointer.outerWidth())
                    .add($.coord(0, this.$offset))
                    .add($.coord(0, context.outerDims().subtract(pointer.outerDims()).y() * this.$multiplier)));

        tooltip.pinTo(pointer.offset()
            .subtract(tooltip.outerWidth())
            .add($.coord(this.$offset, -this.$offset))
            .add($.coord(0, pointer.outerDims().subtract(tooltip.outerDims()).y() * this.$multiplier)));
        
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $rightOf: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .add(context.outerWidth())
                    .add($.coord(0, this.$offset))
                    .add($.coord(0, context.outerDims().subtract(pointer.outerDims()).y() * this.$multiplier)));
        
        tooltip.pinTo(pointer.offset()
            .add(pointer.outerWidth())
            .subtract($.coord(this.$offset, this.$offset))
            .add($.coord(0, pointer.outerDims().subtract(tooltip.outerDims()).y() * this.$multiplier)));

        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    }
}
$.ext(tooltipStrategyLeftJustify,
      abstractTooltipStrategy);

var tooltipStrategyRightJustify = function(tooltip, multiplier){
    tooltipStrategyRightJustify.base.call(this, tooltip, 1);
}
tooltipStrategyRightJustify.prototype = {
    $above: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .subtract(pointer.outerHeight())
                    .add($.coord(-this.$offset, 0))
                    .add($.coord(context.outerDims().subtract(pointer.outerDims()).x() * this.$multiplier, 0)));
                
        tooltip.pinTo(pointer.offset()
            .subtract(tooltip.outerHeight())
            .add($.coord(this.$offset, this.$offset))
            .add($.coord(pointer.outerDims().subtract(tooltip.outerDims()).x() * this.$multiplier, 0)));
          
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $below: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .add(context.outerHeight())
                    .add($.coord(-this.$offset, 0))
                    .add($.coord(context.outerDims().subtract(pointer.outerDims()).x() * this.$multiplier, 0)));
            
        tooltip.pinTo(pointer.offset()
            .add(pointer.outerHeight())
            .add($.coord(this.$offset, -this.$offset))
            .add($.coord(pointer.outerDims().subtract(tooltip.outerDims()).x() * this.$multiplier, 0)));
               
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $leftOf: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .subtract(pointer.outerWidth())
                    .add($.coord(0, -this.$offset))
                    .add($.coord(0, context.outerDims().subtract(pointer.outerDims()).y() * this.$multiplier)));
        
        tooltip.pinTo(pointer.offset()
            .subtract(tooltip.outerWidth())
            .add($.coord(this.$offset, this.$offset))
            .add($.coord(0, pointer.outerDims().subtract(tooltip.outerDims()).y() * this.$multiplier)));
                
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $rightOf: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .add(context.outerWidth())
                    .add($.coord(0, -this.$offset))
                    .add($.coord(0, context.outerDims().subtract(pointer.outerDims()).y() * this.$multiplier)));
               
        tooltip.pinTo(pointer.offset()
            .add(pointer.outerWidth())
            .add($.coord(-this.$offset, this.$offset))
            .add($.coord(0, pointer.outerDims().subtract(tooltip.outerDims()).y() * this.$multiplier)));
                         
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    }
}
$.ext(tooltipStrategyRightJustify,
      abstractTooltipStrategy);

var tooltip = function(){
    tooltip.base.call(this);
    this.pointer($.sprite($.create({"div":{"class":"ku-tooltip-pointer"}})).hide().dragOff().to())
        .tooltip($.sprite($.create({"div":{"class":"ku-tooltip"}})).hide().dragOff().to())
        .leftJustify();

    this._id = $.uid("tip");
    this._onShow = $.observer();
    this._onHide = $.observer();
}
tooltip.prototype = {
    calibrate: function(calibrate){ return this.property("calibrate", calibrate); },
    pointer: function(pointer){ return this.property("pointer", pointer); },
    tooltip: function(tooltip){ return this.property("tooltip", tooltip); },
    strategy: function(strategy){ return this.property("strategy", strategy); },
    message: function(message){ return this.property("message", message); },
    context: function(context){
        var ctxt = ($.exists(context)) ? $.dom(context) : context;
        return this.property("context", ctxt);
    },
    center: function(){ return this.strategy(new tooltipStrategyCenter(this)); },
    leftJustify: function(){ return this.strategy(new tooltipStrategyLeftJustify(this)); },
    rightJustify: function(){ return this.strategy(new tooltipStrategyRightJustify(this)); },
    onShow: function(f, s) { this._onShow.add(f, s); return this; },
    onHide: function(f, s) { this._onHide.add(f, s); return this; },
    show: function(message){
        var m = message || this._message, v = m || "";
        this._pointer.fadeTo(0).appendTo(document.body).show()
        this._tooltip.fadeTo(0).appendTo(document.body).html("").content(v).show();
        this._onShow.notify();
        return this;
    },
    hide: function(){
        this._pointer.hide().detach();
        this._tooltip.hide().detach();
        this._onHide.notify();
        return this;
    },
    at: function(dom, pref){
        var w = $.window(),
            d = $.dom(dom),
            A = $.coord.zero(),
            B = w.dims(),
            a = d.offset()
            b = a.add(d.outerDims()),
            C = this._tooltip.outerDims(),
            bPlusC = b.add(C),
            aLessC = a.subtract(C),
            rightOf = !bPlusC.isRightOf(B),
            below = !bPlusC.isBelow(B),
            leftOf = !aLessC.isLeftOf(A),
            above = !aLessC.isAbove(A),
            prefer = {
                "rightOf": rightOf,
                "below": below,
                "leftOf": leftOf,
                "above": above
            };
        if(prefer[pref[0]]) return this[pref[0]](dom);
        if(prefer[pref[1]]) return this[pref[1]](dom);
        if(prefer[pref[2]]) return this[pref[2]](dom);
        if(prefer[pref[3]]) return this[pref[3]](dom);
        return this.rightOf(dom);
    },
    above: function(dom){ return this._locate(dom, "bottom", "above"); },
    below: function(dom){ return this._locate(dom, "top", "below"); },
    leftOf: function(dom){ return this._locate(dom, "right", "leftOf"); },
    rightOf: function(dom){ return this._locate(dom, "left", "rightOf"); },
    _locate: function(dom, overlap, position){
        this.strategy().overlap(tooltip_calculateOverlap(this, overlap))[position](dom);
        tooltip_setClass(this, position);
        this._pointer.fadeTo(100);
        this._tooltip.fadeTo(100);
        return this;
    }
}
$.ext(tooltip, $.Class);
$.tooltip = function(){ return new tooltip(); }

function tooltip_calculateOverlap(tooltip, side){
    var b = tooltip.tooltip().style($.str.format("border-{0}-width", side));
    return $.ku.style.toNumber(b)
}
function tooltip_setClass(tooltip, position){
    var format = "ku-{0}",
        positions = ["above", "below", "leftOf", "rightOf"],
        pointer = tooltip.pointer();
        
    for(var n in positions)
        pointer.removeClass($.str.format(format, positions[n]));
    pointer.addClass($.str.format(format, position));
}

function droptarget(dom) {
    this._target = $.sprite(dom).dragOff();
    this._helper = $.sprite($.create({div:{"class":"ku-droptarget-helper",
                        style:"position:absolute;"},content:"helper"})).fadeTo(30).hide();
    
    this._observer = $.observer();
}

droptarget.prototype = {
    add: function(dom, func, scope) {
        this._observer.add($.uid("drop"), evtId);
    },
    remove: function(id) {
        
    },
    _hits: function(e){
        var m = $.mouse().documentCoord(e),
            tl = this.tl, br = this.br;
        return m.isRightOf(tl) && m.isBelow(tl) &&
               m.isLeftOf(br) && m.isAbove(br);
    }
}
$.ext(droptarget, $.dom.Class);
$.droptarget = function(dom){ return new droptarget(dom); }

function file(tabDom, contentDom){
    file.base.call(this);
    var tab = $.dom(tabDom).addClass("ku-file-tab").onclick(this.invoke, this),
        content = $.dom(contentDom).addClass("ku-file-content"),
        active = "ku-file-active";
        
    this.onActive(function(){
            tab.addClass(active);
            content.addClass(active);
        })
        .onInactive(function(){
            tab.removeClass(active);
            content.removeClass(active);
        });
}
file.prototype = { }
$.ext(file, $.toggle.Class);

function tablessFile(contentDom){
    tablessFile.base.call(this);
    var content = $.dom(contentDom).addClass("ku-file-content"),
        active = "ku-file-active";
        
    this.onActive(function(){
            content.addClass(active);
        })
        .onInactive(function(){
            content.removeClass(active);
        });
}
tablessFile.prototype = { }
$.ext(tablessFile, $.toggle.Class);

$.file = function(tabDom, contentDom) {
    return ($.exists(tabDom))
        ? new file(tabDom, contentDom)
        : new tablessFile(contentDom);
} 

function fileCabinet(){
    fileCabinet.base.call(this);
    this.mutuallyExclusive();
}
fileCabinet.prototype = { }
$.ext(fileCabinet, $.toggleset.Class);
$.fileCabinet = function(){ return new fileCabinet(); }

$.mouseLogger = function(){
    var dom = $.create({"div":{style:{position:"absolute"}}});
    return {
        on: function(){
            document.body.appendChild(dom);
            this.__con = new $.sprite(dom);
            this.__evt = $.evt.add(document, "mousemove", function(e){
                var f = $.str.build("Document:&nbsp;{0}<br/>Page:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{1}",
                                    "<br/>Screen:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{2}",
                                    "<br/>Client:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{3}",
                                    "<br/>Target:&nbsp;{4}"),
                    d = $.mouse().documentCoord(e),
                    p = $.mouse().pageCoord(e),
                    s = $.mouse().screenCoord(e),
                    c = $.mouse().clientCoord(e),
                    t = $.mouse().target(e);
                this.__con
                    .pinTo($.mouse().documentCoord(e).add($.coord(10, 10)))
                    .html($.str.format(f,d.toString(),p.toString(),s.toString(),c.toString(),t));
            }, this);
        },
        off:function(){
            document.body.removeChild(dom);
            var e = this.__evt, c = this.__con;
            if($.exists(e)) $.evt.remove(e);
            if($.exists(c)) c.destroy();
        }
    }
}

function projectile(dom){
    projectile.base.call(this, dom);
    this._velocityId = $.uid("projectile");
    this._flyId = $.uid("projectile");
    
    this.gravity($.vector(0, .5))
        .friction(.98)
        .velocity($.vector.zero())
        .lowerBound($.coord.zero())
        .upperBound($.window.dims())
        .lastCoord(this.offset())
        .onDrop(function(){ projectile_toss(this, this._velocityId, this._flyId); }, this)
        .onGrab(function(){
            this.velocity($.vector.zero());
            $.timeline().remove(this._flyId)
                .add(function(){ projectile_calculateVelocity(this); }, this, this._velocityId);
        }, this);
}
projectile.prototype = {
    gravity: function(gravity){ return this.property("gravity", gravity); },
    friction: function(friction){ return this.property("friction", friction); },
    velocity: function(velocity){ return this.property("velocity", velocity); },
    lowerBound: function(lowerBound){ return this.property("lowerBound", lowerBound); },
    upperBound: function(upperBound){ return this.property("upperBound", upperBound); },
    lastCoord: function(lastCoord){ return this.property("lastCoord", lastCoord); },
    stop: function(){ $.timeline().remove(this._velocityId).remove(this._flyId); return this; }
}
$.ext(projectile, $.sprite.Class);
$.projectile = function(dom){ return new projectile(dom); }

function projectile_calculateVelocity(projectile){
        projectile.velocity(projectile.offset().distanceFrom(projectile.lastCoord()));
        projectile.lastCoord(projectile.offset());
}
function projectile_toss(projectile, vid, fid){
    $.timeline().remove(vid).add(function(){ projectile_fly(this); }, projectile, fid);
}
function projectile_fly(projectile){
    var v = projectile.velocity(),
        o = projectile.boundedOffset(),
        d = projectile.outerDims(),
        od = o.add(d),
        lower = projectile.lowerBound(),
        upper = projectile.upperBound(),
        hitsX = (o.isAbove(lower) && (v.y() <= 0)) || (od.isBelow(upper) && (v.y() >= 0)),
        hitsY = (o.isLeftOf(lower) && (v.x() <= 0)) || (od.isRightOf(upper) && (v.x() >= 0)),
        hitFriction = (hitsX || hitsY) ? .8 : 1,
        reflection = hitsX ? $.vector(0, 1) : hitsY ? $.vector(1, 0) : $.vector.zero(),
        vel = v.add(projectile.gravity()).scale(projectile.friction()).scale(hitFriction).reflect(reflection),
        isMoving = vel.magnatude() > 1 || o.isAbove(upper.add(d).add($.coord(0, 10))),
        velocity = isMoving ? vel : $.vector.zero(),
        pos = isMoving ? o.add(velocity) : $.coord(o.x(), upper.subtract(d).y());
    
    projectile.velocity(velocity).pinTo(pos);
}

function responsebox() {
    var dom = $.create({"div":{"class":"ku-responsebox"}}),
        evtId = $.uid("responsebox");
    responsebox.base.call(this, dom);
    

    this._contentDom = $.sprite($.create({"div":{"class":"ku-responsebox-content"}})).fadeTo(0).dragOff().force(.4).ease();
    this._onOpen = $.observer();
    this._onClose = $.observer();
    this._onCalibrate = $.observer();
    this._onWindowResize = $.observer();
    this._onContentChanged = $.observer();
    this._closeSize = $.coord.zero();
    this._isOpen = false;

    this.force(.8).mu(.5).appendChild(this._contentDom.dom())
        .positionStrategy(function(){ return $.window().scrollCenter(); })
        .bounds(document.body).to();

    $.window().onresize(function(){ this._onWindowResize.notify(); }, this, evtId);
}
responsebox.prototype = {
    content: function(content){
        this._contentDom.content(content);
        this._onContentChanged.notify();
        return this;
    },
    disableWindow: function(){ $.window().disable(); return this; },
    enableWindow: function(){ $.window().enable(); return this; },
    positionStrategy: function(positionStrategy){ return this.property("positionStrategy", positionStrategy); },
    openSize: function(openSize){ return this.property("openSize", openSize); },
    bounds: function(bounds){ return this.property("bounds", bounds); },
    onOpen: function(f, s, id){ this._onOpen.add(f, s, id); return this; },
    onClose: function(f, s, id){ this._onClose.add(f, s, id); return this; },
    onCalibrate: function(f, s, id){ this._onCalibrate.add(f, s, id); return this; },
    onWindowResize: function(f, s, id){ this._onWindowResize.add(f, s, id); return this; },
    onContentChanged: function(f, s, id){ this._onContentChanged.add(f, s, id); return this; },
    removeListener: function(id){
        this._onOpen.remove(id);
        this._onClose.remove(id);
        this._onCalibrate.remove(id);
        this._onContentChanged.remove(id);
    },
    calibrate: function() {
        return this.pinTo(responsebox_calculateLocation(this), function(){ this._onCalibrate.notify(); }, this);
    },
    recalibrate: function(){
        this.clear().ease();
        var size = this.openSize() || this._contentDom.outerDims();
        return this.growTo(size, this.calibrate, this);
    },
    transition: function(content){
        this._contentDom.clear().fadeTo(0, function() {
            this.clear().ease().content(content);
                var size = this.openSize() || this._contentDom.outerDims();
                this.growTo(size, function(){
                    this.pinTo(responsebox_calculateLocation(this), function() {
                        this._contentDom.fadeTo(100, function(){ this.redraw(); }, this);
                   }, this);
                }, this);
        }, this);
        return this;
    },
    open: function(latency){
        this.clear().to()
            .fadeTo(100, function() { this._contentDom.fadeTo(0); }, this)
            .appendTo(this.bounds());

        this._onOpen.notify();

        var box = this;
        if(latency) setTimeout(function(){ responsebox_open(box); }, latency);
        else responsebox_open(box);
    },
    close: function(){
        this._contentDom.ease().fadeTo(0, function(){
            this.ease().growTo(this._closeSize, function(){
                this.detach();
                this._onClose.notify();
            }, this);
        }, this);
        return this;
    }
}
$.ext(responsebox, $.sprite.Class);
$.responsebox = function(){ return new responsebox(); }

function responsebox_calculateLocation(box){
    var pos = box._positionStrategy().subtract(box.outerDims().half()),
        coord = $.window().scrollOffset(),
        x = (pos.isLeftOf(coord)) ? coord.x() : pos.x(),
        y = (pos.isAbove(coord)) ? coord.y() : pos.y();
    return $.coord(x, y);
}

function responsebox_open(box) {
    var contentDom = box._contentDom,
        size = box.openSize() || contentDom.outerDims();
    box.growTo(size, function(){
        this.pinTo(responsebox_calculateLocation(this), function() {
            contentDom.fadeTo(100);
        }, box);
    }, box);
}

function scrubber(dom){
    scroller.base.call(this, dom);
    
    var scrubber = $.create({div:{"class":"ku-scrubber-scrub"}}),
        scrubline = $.create({div:{"class":"ku-scrubber-scrubline"}});
    
    this._scrubber = $.sprite(scrubber);
    this._scrubline = $.sprite(scrubline).appendChild(scrubber).dragOff();
}
scrubber.prototype = {
    scrollPanel: function(scrollPanel){ return this.property("scrollPanel", scrollPanel); },
    onScrub: function(f, s, id){ this._scrubber.onDrag(f, s, id); }
}
$.ext(scrubber, $.sprite.Class);
$.scrubber = function(dom){ return new scrubber(dom); }

function scrollPanel(dom){
    scrollPanel.base.call(this, dom);
    var div = $.create({div:{}});
    this._content = $.sprite(div)
        .addClass("ku-scrollPanel-content")
        .onGrab(function(){
            var c = this._content;
            c.dragOffset(c.layoutDims())
        }, this)
        .onDrop(function(){
            var c = this._content;
            this.scrollTo(c.boundedOffset().add(c.layoutDims()));
        }, this);
        
    this.appendChild(div).addClass("ku-scrollPanel").dragOff();
}
scrollPanel.prototype = {
    min: function(){ return $.coord.zero(); },
    max: function(){ return this.get("max"); },
    content: function(content){
        var rv, c = this._content;
        if($.isString(content)) rv =  c.html(content).pinTo($.coord.zero());
        else rv =  c.clear().appendChild(content).pinTo($.coord.zero());
        this._max = scrollPanel_calculateMax(this);
        return rv;
    },
    constrainX: function(){ this._content.constrainX(); return this; },
    unconstrainX: function(){ this._content.unconstrainX(); return this; },
    constrainY: function(){ this._content.constrainY(); return this; },
    unconstrainY: function(){ this._content.unconstrainY(); return this; },
    scrollTo: function(coord){
        if(!$.exists(coord)) return this;
        var min = this.min(),
            max = this.max() || min,
            x = coord.x(),
            y = coord.y();
            
        if(coord.isRightOf(min)) x = min.x();
        if(coord.isLeftOf(max)) x = max.x();
        if(coord.isBelow(min)) y = min.y();
        if(coord.isAbove(max)) y = max.y();
        
        this._content.to().pinTo($.coord(x, y));
        return this;
    },
    scroller: function(scroller){ this.set("scroller", scroller.scrollPanel(this)); },
    displayScroller: function(){ },
    hideScroller: function(){ }
}
$.ext(scrollPanel, $.sprite.Class);
$.scrollPanel = function(dom){ return new scrollPanel(dom); }

function scrollPanel_calculateMax(scrollPanel){
    var coord = scrollPanel._content.outerDims().subtract(scrollPanel.innerDims()),
        z = $.coord.zero(),
        x = coord.isLeftOf(z) ? z.x() : coord.x(),
        y = coord.isAbove(z) ? z.y() : coord.y();
    return scrollPanel.min().subtract($.coord(x, y));
}

})($);
