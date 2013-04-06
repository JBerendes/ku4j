function abstractField(dom){
    abstractField.base.call(this, dom);
    this._isinvalid = false;
    this._keyupid = $.uid();
    this._$dom = $.dom(this.dom());
    this.onInvalid(this.invalidate, this)
        .onIsValid(this.validate, this);
}
abstractField.prototype = {
    $clear: function(){ return this.value("").validate(); },
    tooltip: function(tooltip){ return this.set("tooltip", tooltip); },
    watermark: function(watermark){ return this.set("watermark", watermark); },
    invalidate: function(){
        if(this._isinvalid) return this;
        this._isinvalid = true;
        this._$dom
            .addClass("ku-field-error")
            .onkeyup(this.isValid, this, this._keyupid);
        var tt = this._tooltip;
        if($.exists(tt)) tt.show().rightOf(this.dom());
        return this;
    },
    validate: function(){
        if(!this._isinvalid) return this;
        this._isinvalid = false;
        this._$dom
            .removeClass("ku-field-error")
            .removeEvent(this._keyupid);
        var tt = this._tooltip;
        if($.exists(tt)) tt.hide();
        return this;
    }
}
$.ext(abstractField, $.field.Class);