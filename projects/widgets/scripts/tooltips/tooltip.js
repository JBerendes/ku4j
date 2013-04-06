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