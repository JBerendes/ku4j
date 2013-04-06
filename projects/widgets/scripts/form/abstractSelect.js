function abstractSelect(dom){
    abstractSelect.base.call(this, dom);
    this._isinvalid = false;
    this._keyup = $.uid();
    this._$dom = $.dom(this.dom());
    this.onInvalid(this.invalidate, this)
        .onIsValid(this.validate, this);
}
abstractSelect.prototype = {
    $clear: function(){ return this.value("").validate(); },
    tooltip: function(tooltip){ return this.set("tooltip", tooltip); },
    invalidate: function(){
        if(this._isinvalid) return this;
        this._isinvalid = true;
        this._$dom
            .addClass("ku-field-error")
            .onchange(this.isValid, this, this._keyup);
        var tt = this._tooltip;
        if($.exists(tt)) tt.show().rightOf(this.dom());
        return this;
    },
    validate: function(){
        if(!this._isinvalid) return this;
        this._isinvalid = false;
        this._$dom
            .removeClass("ku-field-error")
            .removeEvent(this._keyup);
        var tt = this._tooltip;
        if($.exists(tt)) tt.hide();
        return this;
    }
}
$.ext(abstractSelect, $.select.Class);