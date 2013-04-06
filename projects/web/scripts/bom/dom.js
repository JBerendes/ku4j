var dom = function(query) {
    dom.base.call(this, $.ele(query));
	
	var display = this.style("display") || "block";
    this._display = (/none/i.test(display)) ? "block" : display;
    this._liveEvents = $.hash();
}
dom.prototype = {
	attribute: function(key, value){
		var d = this.dom();
		if($.isUndefined(value)) return d.getAttribute(key);
		d.setAttribute(key, value);
		return this;
	},
    addClass: function(value){
        $.ku.css.addClass(this.dom(), value);
        return this;
    },
    removeClass: function(value){
        $.ku.css.removeClass(this.dom(), value);
        return this;
    },
    hasClass: function(value){
        $.ku.css.hasClass(this.dom(), value);
        return this;
    },
    style: function(property, value){
        if($.isString(property) && !$.exists(value))
            return $.ku.style.get(this.dom(), property);
        $.ku.style.set(this.dom(), property, value);
        return this;
    },
    value: function(value){
        if(!$.exists(value)) return this.dom().value;
        this.dom().value = value;
        return this;
    },
    content: function(content){
        if(!$.exists(content) ) return this;
        if($.isNumber(content) || $.isString(content)) return this.html(content);
        return this.appendChild(content);
    },
    cloneNode: function(deep){
        return this._dom.cloneNode(deep||true);
    },
    html: function(value){
        if(!$.exists(value)) return this.dom().innerHTML;
        this.dom().innerHTML = value;
        return this;
    },
    text: function(value){
        if(!$.exists(value)) return $.ku.getText(this.dom());
        $.ku.setText(this.dom(), value);
        return this;
    },
    prependChild: function(dom){
        var _dom = this.dom(),
            firstChild = _dom.firstChild;

        if($.exists(firstChild)) _dom.insertBefore(dom, firstChild);
        else _dom.appendChild(dom);

        return this;
    },
    appendChild: function(dom){
        this.dom().appendChild(dom);
        return this;
    },
    removeChild: function(dom){
        this.dom().removeChild(dom);
        return this;
    },
    insertBefore: function(dom){
        dom.parentNode.insertBefore(this.dom(), dom);
        return this;
    },
    insertAfter: function(dom){
        if($.exists(dom.nextSibling))
            dom.parentNode.insertBefore(this.dom(), dom.nextSibling);
        else dom.parentNode.appendChild(this.dom());
        return this;
    },
    appendTo: function(dom){
        dom.appendChild(this.dom());
        return this;
    },
    detach: function(){
        try {
            var d = this.dom();
            d.parentNode.removeChild(d);
        }
        catch(e){ }
        finally{ return this; }
    },
    innerDims: function(value){
        if(!$.exists(value))
            return $.coord.parse($.findInnerDims(this.dom()));
        
        var p = value.toPixel()
        this.style({"width": p.x(), "height": p.y()})
        return this;
    },
    outerDims: function(value){
        if(!$.exists(value)) return $.coord.parse($.findOuterDims(this.dom()));
        var outer = this.outerDims().subtract(this.innerDims());
        return this.innerDims(value.subtract(outer));
    },
    innerWidth: function(value){
        var d = this.innerDims();
        if(!$.exists(value)) return $.coord(d.x(), 0);
        return this.innerDims($.coord(value, d.y()));
    },
    innerHeight: function(value){
        var d = this.innerDims();
        if(!$.exists(value)) return $.coord(0, d.y());
        return this.innerDims($.coord(d.x(), value));
    },
    outerWidth: function(value){
        var d = this.outerDims();
        if(!$.exists(value)) return $.coord(d.x(), 0);
        return this.outerDims($.coord(value, d.y()));
    },
    outerHeight: function(value){
        var d = this.outerDims();
        if(!$.exists(value)) return $.coord(0, d.y());
        return this.outerDims($.coord(d.x(), value));
    },
    boundedOffset: function(){
        return $.coord.parse($.findBoundedOffset(this.dom()));
    },
    layoutDims: function(){
        var p = this.dom().parentNode;
        if(!$.exists(p)) return $.coord.zero();
        var d = $.dom(p);
        return d.outerDims().subtract(d.innerDims()).half();
    },
    offset: function(){
        return $.coord.parse($.findOffset(this.dom()));
    },
    center: function(){
        return this.offset().add(this.outerDims().half());
    },
    scrollDims: function(){
        return $.coord.parse($.findScrollDims(this.dom()));
    },
    scrollOffset: function(){
        return $.coord.parse($.findScrollOffset(this.dom()));
    },
    clear: function(){
        $.clearNode(this.dom());
        return this;
    },
    redraw: function(){
        $.ku.redraw(this.dom());
        return this;
    },
    swap: function(other){
        $.ku.swapDom(this.dom, other.dom);
        return other;
    },
    show: function(){
       this.style({display: this._display});
       return this;
    },
    hide: function(){
        this.style({display: "none"});
        return this;
    },
    isVisible: function(){
        var tl = this.offset(),
            br = this.offset().add(this.innerDims());
        
        return $.exists(this.dom().parentNode) &&
            !/NONE|^$/i.test(this.style("display")) &&
            $.window().scrollOffset().isLeftOf(br) &&
            $.window().scrollOffset().isAbove(br) &&
            $.window().scrollDims().isRightOf(tl) &&
            $.window().scrollDims().isBelow(tl);
    },
    onmouseover: function(act, scp, id){ return this._addEvent("mouseover", act, scp, id);  },
    onmouseout: function(act, scp, id){ return this._addEvent("mouseout", act, scp, id);  },
    onmousedown: function(act, scp, id){ return this._addEvent("mousedown", act, scp, id);  },
    onmouseup: function(act, scp, id){ return this._addEvent("mouseup", act, scp, id);  },
    onmousemove: function(act, scp, id){ return this._addEvent("mousemove", act, scp, id);  },
    onclick: function(act, scp, id){ return this._addEvent("click", act, scp, id);  },
    ondoubleclick: function(act, scp, id){ return this._addEvent("dblclick", act, scp, id);  },
    onkeydown: function(act, scp, id){ return this._addEvent("keydown", act, scp, id);  },
    onkeyup: function(act, scp, id){ return this._addEvent("keyup", act, scp, id);  },
    onkeypress: function(act, scp, id){ return this._addEvent("keypress", act, scp, id);  },
    onblur: function(act, scp, id){ return this._addEvent("blur", act, scp, id);  },
    onchange: function(act, scp, id){ return this._addEvent("change", act, scp, id);  },
    onerror: function(act, scp, id){ return this._addEvent("error", act, scp, id);  },
    onfocus: function(act, scp, id){ return this._addEvent("focus", act, scp, id);  },
    onload: function(act, scp, id){ return this._addEvent("load", act, scp, id);  },
    onresize: function(act, scp, id){ return this._addEvent("resize", act, scp, id);  },
    onscroll: function(act, scp, id){ return this._addEvent("scroll", act, scp, id);  },
    onselect: function(act, scp, id){ return this._addEvent("select", act, scp, id);  },
    onresize: function(act, scp, id){ return this._addEvent("resize", act, scp, id);  },
    onunload: function(act, scp, id){ return this._addEvent("unload", act, scp, id);  },
    onorientationchange: function(act, scp, id){ return this._addEvent("orientationchange", act, scp, id);  },
    ontouchstart: function(act, scp, id){ return this._addEvent("touchstart", act, scp, id);  },
    ontouchend: function(act, scp, id){ return this._addEvent("touchend", act, scp, id);  },
    ontouchmove: function(act, scp, id){ return this._addEvent("touchmove", act, scp, id);  },
    removeEvent: function(id) {
        var evt = this._liveEvents.find(id);
        if(!$.exists(evt)) return this;
        return this._removeEvent(evt, id);
    },
    clearEvents: function(){
        this._liveEvents.listValues().each(function(evt) { this._removeEvent(evt); }, this);
         return this;
    },
    _addEvent: function(type, act, scp, id) {
        var ID = id || $.uid("evt"), liveEvents = this._liveEvents;
        if(liveEvents.containsKey(ID)) return this;
        liveEvents.add(ID, $.evt.add(this.dom(), type, act, scp));
        return this;
    },
    _removeEvent: function(evt, id){
        $.evt.remove(evt);
        this._liveEvents.remove(id);
        return this;
    }
}
$.ext(dom, $.DomClass)
$.dom = function(query){ return new dom(query); }
$.dom.Class = dom;