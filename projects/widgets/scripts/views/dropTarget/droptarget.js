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