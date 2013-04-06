var calendarControlsDecorator = function(calendar) {
    calendarControlsDecorator.base.call(this, $.create({"div":{"class":"ku-calendar-controls"}}));

    this._calendar = calendar;

    var title = $.dom($.create({"div":{"class":"ku-calendar-title"}})),
        month = $.dom($.create({"button":{"class":"ku-calendar-month"}}))
                    .onclick(this.showMonths, this),
        year = $.dom($.create({"button":{"class":"ku-calendar-year"}}))
                    .onclick(this.showYears, this, this),
        prevButton = $.dom($.create({"button":{"class":"ku-calendar-prevButton"}}))
                        .onclick(function(){ this._prevAction(); }, this),
        nextButton = $.dom($.create({"button":{"class":"ku-calendar-nextButton"}}))
                        .onclick(function(){ this._nextAction(); }, this);

    $.dom(this.dom())
        .appendChild(title
                        .appendChild(month.dom())
                        .appendChild(year.dom())
                        .dom())
        .appendChild(prevButton.dom())
        .appendChild(nextButton.dom())
        .appendChild(calendar.dom());

    this._title = title;
    this._month = month;
    this._year = year;
    this._prevButton = prevButton;
    this._nextButton = nextButton;
    this._prevAction;
    this._nextAction;
    this.onSelect(this._displayDates, this);
}
calendarControlsDecorator.prototype = {
    dayPoint: function(dayPoint){
        var calendar = this._calendar;
        if(!$.exists(dayPoint)) return calendar.dayPoint();
        calendar.dayPoint(dayPoint);
        return this;
    },
    localization: function(localization){
        var calendar = this._calendar;
        if(!$.exists(localization)) return calendar.localization();
        calendar.localization(localization);
        return this;
    },
    sheetFactory: function(sheetFactory){
        this._calendar.sheetFactory(sheetFactory);
        return this;
    },
    nextDay: function(){  this._calendar.nextDay(); return this; },
    prevDay: function(){  this._calendar.prevDay(); return this; },
    nextMonth: function(){ this._calendar.nextMonth(); return this; },
    prevMonth: function(){ this._calendar.prevMonth(); return this; },
    nextYear: function(){  this._calendar.nextYear(); return this; },
    prevYear: function(){  this._calendar.prevYear(); return this; },

    showDates: function(){
        var calendar = this._calendar,
            locale = calendar.localization().month.name,
            dayPoint = calendar.dayPoint();
        calendar.showDates();
        this._month.html(locale[dayPoint.month()]);
        this._year.html(dayPoint.year());
        this._prevAction = this._prevMonth;
        this._nextAction = this._nextMonth;
        return this;
    },
    showMonths: function(){
        this._calendar.showMonths();
        var action = function(){ return; }
        this._prevAction = action;
        this._nextAction = action;
        return this;
    },
    showYears: function(){
        this._calendar.showYears();
        this._prevAction = this._prevYears;
        this._nextAction = this._nextYears;
        return this;
    },
    findCell: function(dayPoint){ return this._calendar.findCell(dayPoint); },
    each: function(f, s){ this._calendar.each(f, s); return this; },
    select: function(dayPoint){  this._calendar.select(dayPoint); return this; },
    onSelect: function(f, s) {  this._calendar.onSelect(f, s); return this; },
    onShowDates: function(f, s) {  this._calendar.onShowDates(f, s); return this; },
    onShowMonths: function(f, s) {  this._calendar.onShowMonths(f, s); return this; },
    onShowYears: function(f, s) {  this._calendar.onShowYears(f, s); return this; },
    _prevMonth: function() {
        this.prevMonth().showDates();
    },
    _nextMonth: function() {
        this.nextMonth().showDates();
    },
    _prevYears: function() {
        this.dayPoint(this.dayPoint().add(-12, 0, 0)).showYears();
    },
    _nextYears: function() {
        this.dayPoint(this.dayPoint().add(12, 0, 0)).showYears();
    },
    _displayDates: function(cell){
        var calendar = this._calendar,
            showingDates = calendar.isShowingDates(),
            showingMonths = calendar.isShowingMonths(),
            showingYears = calendar.isShowingYears(),
            dayPoint = calendar.dayPoint(),
            value = cell.value(),
            newValue;

        if(showingYears) newValue = $.dayPoint(value.year(), dayPoint.month(), dayPoint.date());
        if(showingMonths) newValue = $.dayPoint(dayPoint.year(), value.month(), dayPoint.date());
        if(showingDates) newValue = value;
        this.dayPoint(newValue);

        if(showingYears ||
           showingMonths ||
           (dayPoint.month() != value.month())) this.showDates();
    }
}
$.ext(calendarControlsDecorator, $.dom.Class);
$.calendarControlsDecorator = function(calendar){ return new calendarControlsDecorator(calendar); }