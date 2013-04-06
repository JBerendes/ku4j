var domEvent = function(dom, evt, action, scope, bubbles){
    this.dom = dom;
    this.evt = evt;
    this.action = action;
    this.scope = scope;
    this.bubbles = bubbles;
}
$.evt = {
    add: function(dom, evt, action, scope, bubbles) {
        var d = $.refcheck($.ele(dom), $.str.format("argument dom == {0} at $.evt.add", dom)),
            e = evt,
            s = scope || d,
            b = bubbles || false,
            a = function() { action.apply(s, arguments); };
            
        if ($.exists(d.addEventListener))
            d.addEventListener(e, a, b);
        else if ($.exists(d.attachEvent))
            d.attachEvent("on" + e, a);
        else
            d["on" + e] = a;

        return new domEvent(d, e, a, s, b);
    },
    remove: function(domEvt) {
        var d = domEvt.dom,
            e = domEvt.evt,
            s = domEvt.scope,
            b = domEvt.bubbles,
            a = domEvt.action;
            
        if (d.removeEventListener)
            d.removeEventListener(e, a, b);
        else if (d.detachEvent)
            d.detachEvent("on" + e, a);
        else
            d["on" + e] = null;

        return this;
    },
    ele: function(e){
        try { return (e.srcElement) ? e.srcElement : e.target; }
        catch(e) { return null; }
    },
    mute: function(e) {
        if ($.exists(e.preventDefault)) e.preventDefault();
        if ($.exists(e.stopPropogation)) e.stopPropogation();
        e.returnValue = false;
        e.cancelBubble = true;
        return this;
    }
}