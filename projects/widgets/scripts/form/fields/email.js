function emailField(dom){
    emailField.base.call(this, dom);
    this.spec($.fields.specs.email)
        .tooltip($.tooltip().message("Enter a valid email address."));
}
emailField.prototype = {
    $read: function(){ return this.dom().value; },
    $write: function(value){ this.dom().value = value; }
}
$.ext(emailField, abstractField);
$.fields.email = function(dom){ return new emailField(dom); }