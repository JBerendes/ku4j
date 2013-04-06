function selectField(dom){
    selectField.base.call(this, dom);
    this.tooltip($.tooltip().message("Invalid"));
}
$.ext(selectField, abstractSelect);
$.fields.select = function(dom){ return new selectField(dom); }