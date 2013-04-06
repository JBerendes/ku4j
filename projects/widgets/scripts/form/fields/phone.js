function phoneField(dom){
    phoneField.base.call(this, dom);
    this.spec($.fields.specs.phone)
        .tooltip($.tooltip().message("Enter a valid phone number including area code."));
    $.dom(this.dom()).onblur(function(){ this.value(this.value()); }, this);
}
phoneField.prototype = {
    $read: function(){ return this.dom().value.replace(/[^\d]/g, ""); },
    $write: function(value){
        this.dom().value = (function(v, f) {
                var a = v.replace(/[^\d]/g, "").split(/\B/), i = 0, l = a.length,
                    rv = (l < 11) ? f.replace(/^#\s/, "") : f;
                while(i < l) { rv = rv.replace("#", a[i]); i++; }
                return (/#/.test(rv)) ? value : rv;
            })(value, "# (###) ###-####");
    }
}
$.ext(phoneField, abstractField);
$.fields.phone = function(dom, format){ return new phoneField(dom, format); }