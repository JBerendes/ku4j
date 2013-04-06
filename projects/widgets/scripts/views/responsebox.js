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