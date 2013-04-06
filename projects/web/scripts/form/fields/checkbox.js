function checkbox(dom){
    checkbox.base.call(this, dom);
}
checkbox.prototype = {
    $read: function(){
        var d = this.dom();
        return (d.checked) ? d.value : "";
    },
    $write: function(value){
        var d = this.dom();
        d.checked = (d.value == value);
    },
    $clear: function(){ this.uncheck(); return this; },
    check: function(){ this.dom().checked = true; return this; },
    uncheck: function(){ this.dom().checked = false; return this; }
}
$.ext(checkbox, field);
$.checkbox = function(dom){ return new checkbox(dom); }
$.checkbox.Class = checkbox;