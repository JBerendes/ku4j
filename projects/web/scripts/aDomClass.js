$.DomClass = function(dom){
    $.DomClass.base.call(this);
    this.dom($.refcheck(dom, $.str.format("$.DomClass requires valid DOM node.")));
}
$.DomClass.prototype = {
    dom: function(dom){ return this.property("dom", dom); }
}
$.ext($.DomClass, $.Class);