function field(dom){
    field.base.call(this);

    var d = $.ele(dom);
    this.dom($.refcheck(d, $.str.format("$.DomClass requires valid DOM node.")))
        .spec($.spec(function(){ return true; }))
        .optional();
}
field.prototype = {
    $read: function(){ return this.dom().value },
    $write: function(value){ this.dom().value = value; },
    $clear: function(){ this.dom().value = ""; return this; },
    dom: function(dom){ return this.property("dom", dom); }
 }
$.ext(field, abstractField);
$.field = function(dom){ return new field(dom); }
$.field.Class = field;