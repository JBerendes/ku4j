function kuWindow() {
    kuWindow.base.call(this);
    this._body = $.dom(document.body);
}
kuWindow.prototype = {
    isDisabled: function(){ return this.get("disabled"); },
    isPortrait:function(){ return this.orientation.isLandscape();  },
    isLandscape:function(){ return Math.abs(window.orientation) == 90; },
    disable: function() {
        this._disabled = true;
        document.body.appendChild(window_disableDom);
        return this;
    },
    enable: function() {
        if(!this.isDisabled()) return this;
        document.body.removeChild(window_disableDom);
        this._disabled = false;
        return this;
    },
    dims: function() {
        var  x = window.innerWidth || document.documentElement.clientWidth,
            y = window.innerHeight || document.documentElement.clientHeight;
        return $.coord(x, y);
    },
    center: function() {
        return this.dims().divide($.coord(2, 2));
    },
    scrollOffset: function() {
        var docEle = document.documentElement,
            body = document.body,
            x = Math.max(docEle.scrollLeft, body.scrollLeft),
            y = Math.max(docEle.scrollTop, body.scrollTop);
        return $.coord(x,y);
    },
    scrollDims: function() {
        var docEle = document.documentElement,
            body = document.body,
            x = Math.max(docEle.scrollWidth, body.scrollWidth),
            y = Math.max(docEle.scrollHeight, body.scrollHeight);
        return $.coord(x,y);
    },
    scrollCenter: function() {
        return this.center().add(this.scrollOffset());
    },
    contains: function(coord){
        var topLeft = this.scrollOffset(),
            bottomRight = this.scrollDims();
            
        return !(coord.isAbove(topLeft) ||
                 coord.isLeftOf(topLeft) ||
                 coord.isRightOf(bottomRight) ||
                 coord.isBelow(bottomRight));
    },
    redraw: function(){
        $.ku.redraw(document.body);
        $.ku.redraw(document.documentElement);
        return this;
    },

    onmousedown: function(act, scp, id){ return this._body.onmousedown(act, scp, id);  },
    onmouseup: function(act, scp, id){ return this._body.onmouseup(act, scp, id);  },
    ontouchstart: function(act, scp, id){ return this._body.ontouchstart(act, scp, id);  },
    ontouchend: function(act, scp, id){ return this._body.ontouchend(act, scp, id);  },
    onclick: function(act, scp, id){ return this._body.onclick(act, scp, id);  },
    ondoubleclick: function(act, scp, id){ return this._body.ondoubleclick(act, scp, id);  },
    onkeydown: function(act, scp, id){ return this._body.onkeydown(act, scp, id);  },
    onkeyup: function(act, scp, id){ return this._body.onkeyup(act, scp, id);  },

    scrollTo: function(coord) { window.scrollTo(coord.x, coord.y); return this; },
    onresize: function(func, scp, id) { window_onresize.add(func, scp, id); return this; },
    onscroll: function(func, scp, id) { window_onscroll.add(func, scp, id); return this; },
    onspin: function(func, scp, id) { window_onspin.add(func, scp, id); return this; },
    remove: function(id){
        window_onresize.remove(id);
        window_onscroll.remove(id);
        window_onspin.remove(id);
        this._body.removeEvent(id);
        return this;
    }
}
$.ext(kuWindow, $.Class);
var window_lastDims = $.coord.zero(),
    window_lastScroll,
    window_disableDom = $.create({div:{"class":"ku-window-disabled"}}),
    window_onresize = $.observer(), 
    window_onscroll = $.observer(),
    window_onspin = $.observer();


var window_popup = function(){ }
window_popup.prototype = {
    uri: function(uri){ return this.property("uri", uri); },
    offset: function(offset){ return this.property("offset", offset); },
    dims: function(dims){ return this.property("dims", dims); },

    channelmode: function(channelmode){ return this.property("channelmode", channelmode); },
    directories: function(directories){ return this.property("directories", directories); },
    fullscreen: function(fullscreen){ return this.property("fullscreen", fullscreen); },
    location: function(location){ return this.property("location", location); },
    menubar: function(menubar){ return this.property("menubar", menubar); },
    scrollbars: function(scrollbars){ return this.property("scrollbars", scrollbars); },
    titlebar: function(titlebar){ return this.property("titlebar", titlebar); },
    toolbar: function(toolbar){ return this.property("toolbar", toolbar); },
    open: function(){ }
}
$.ext(window_popup, $.Class);

var window_instance;
$.window = function(){
    if ($.exists(window_instance)) return window_instance;
    $.evt.add(window, "resize", function(){ window_onresize.notify(); });
    $.evt.add(window,"scroll",function(){ window_onscroll.notify(); });
    $.evt.add(window,"orientationchange",function(){ window_onspin.notify(); });
    window_instance = new kuWindow();
    return window_instance;
 }