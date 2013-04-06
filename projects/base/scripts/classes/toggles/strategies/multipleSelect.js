function toggleset_multipleSelect() {
    toggleset_multipleSelect.base.call(this);
    this.value;
}
toggleset_multipleSelect.prototype = {
    context: function(context){ return this.property("context", context); },
    invoke: function(toggle){ toggle.toggle(); }
}
$.ext(toggleset_multipleSelect, $.Class);