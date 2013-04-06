function moneyField(dom){
    moneyField.base.call(this, dom);
    this.spec($.fields.specs.currency)
        .tooltip($.tooltip().message("Enter a valid money amount."));
    $.dom(this.dom()).onblur(function(){ this.value(this.value()); }, this);
}
moneyField.prototype = {
    $read: function(){
        var value = this.dom().value;
        return ($.money.canParse(value))
            ? $.money.parse(value).value()
            : value;
    },
    $write: function(value){ this.dom().value = $.money.tryParse(value) || value; }
}
$.ext(moneyField, abstractField);
$.fields.money = function(dom){ return new moneyField(dom); }