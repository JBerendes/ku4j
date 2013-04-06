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