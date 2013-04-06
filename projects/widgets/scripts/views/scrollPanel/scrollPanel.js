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