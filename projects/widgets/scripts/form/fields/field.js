function field(dom){
    field.base.call(this, dom);
    this.tooltip($.tooltip().message("Invalid"));
}
$.ext(field, abstractField);
$.fields.field = function(dom){ return new field(dom); }