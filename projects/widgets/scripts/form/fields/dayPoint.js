function dayPointField(dom){
    dayPointField.base.call(this, dom);
    this._id = $.uid("field");
    this._isShow = false;
    this._calendar = $.calendarControlsDecorator($.calendar())
                        .onSelect(function(date){
                            this.value(date.value().toString()).validate();
                            //this.dom().select();
                            this.hideCalendar();
                        }, this)
                        .showDates();
    this._calContainer = $.tooltip()
                        .pointer($.sprite($.create({"div":{"class":"ku-dayPointField-tooltip-pointer"}})).hide().dragOff())
                        .tooltip($.sprite($.create({"div":{"class":"ku-dayPointField-tooltip"}})).hide().dragOff())
                        .message(this._calendar.dom());

    this._$dom = $.dom(this.dom())
        .onfocus(this._focusAction, this)
        .onkeyup(this._keyupAction, this)
        .onkeydown(this._keydownAction, this);

        this.spec($.fields.specs.date)
            .tooltip($.tooltip().message("Enter a valid date."));
}
dayPointField.prototype = {
    $read: function(){ return ($.dayPoint.tryParse(this.dom().value) || "").toString(); },
    $write: function(value){ this.dom().value = ($.dayPoint.tryParse(value) || value).toString(); },
    showCalendar: function(){
        if(this._isShow) return;
        this._isShow = true;
        this._calContainer.show().at(this.dom(), ["below", "above"]);
        $.window().onmouseup(this._hideCalendar, this, this._id);
		return this;
    },
    hideCalendar: function(e){
        this._calContainer.hide();
        this._calendar.detach();
        $.window().remove(this._id);
        this._isShow = false;
		return this;
    },
    _hideCalendar: function(e) {
        var cal = this._calendar,
            ctl = cal.offset(),
            cbr = ctl.add(cal.outerDims()),
            inp = this._$dom,
            itl = inp.offset(),
            ibr = itl.add(inp.outerDims()),
            calendar = $.rectangle(ctl, cbr),
            input = $.rectangle(itl, ibr),
            mouse = $.mouse().documentCoord(e);

        if(calendar.contains(mouse) ||
           input.contains(mouse)) return this;

        this.hideCalendar();
		return this;
    },
    _focusAction: function(e) {
		this.showCalendar(); 
		return this;
	},
    _keyupAction: function(e) { 
		this.showCalendar(); 
		return this; 
	},
    _keydownAction: function(e) {
        var key = $.key.parse(e),
            tab = $.key(9),
            tabShift = $.key(9, false, false, true);
        if (key.equals(tab) || key.equals(tabShift))
        this.hideCalendar(); 
		return this;
    }
}
$.ext(dayPointField, abstractField);
$.fields.dayPoint = function(dom){ return new dayPointField(dom); }