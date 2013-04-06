var calendar = function() {
    calendar.base.call(this, $.create({"div":{"class":"ku-calendar"}}));

    var sheetContainerDom = $.create({"div":{"class":"ku-sheet"}});

    this._sheetContainer = $.dom(sheetContainerDom);
    this._onShowDates = $.observer();
    this._onShowMonths = $.observer();
    this._onShowYears = $.observer();
    this._onSelect = $.observer();
    this._sheet;

    this.dayPoint($.dayPoint.today())
        .localization($.ku.localization["en"])
        .sheetFactory($.clickableSheetFactory())
        .dom().appendChild(sheetContainerDom);
}
calendar.prototype = {
    dayPoint: function(dayPoint){ return this.property("dayPoint", dayPoint); },
    localization: function(localization){ return this.property("localization", localization); },
    sheetFactory: function(sheetFactory){ return this.set("sheetFactory", sheetFactory); },

    isShowingDates: function(){ return this._isShowingDates; },
    isShowingMonths: function(){ return this._isShowingMonths; },
    isShowingYears: function(){ return this._isShowingYears; },

    nextDay: function(){ this.dayPoint(this.dayPoint().nextDay()); return this; },
    prevDay: function(){ this.dayPoint(this.dayPoint().prevDay()); return this; },
    nextMonth: function(){ this.dayPoint(this.dayPoint().nextMonth()); return this; },
    prevMonth: function(){ this.dayPoint(this.dayPoint().prevMonth()); return this; },
    nextYear: function(){ this.dayPoint(this.dayPoint().nextYear()); return this; },
    prevYear: function(){ this.dayPoint(this.dayPoint().prevYear());return this; },

    showDates: function(){ return this._showSheet("createDatesheet")._currentView(false, false, true); },
    showMonths: function(){ return this._showSheet("createMonthsheet")._currentView(false, true, false); },
    showYears: function(){ return this._showSheet("createYearsheet")._currentView(true, false, false); },

    findCell: function(dayPoint) { return this._sheet.findCell(dayPoint); },
    each: function(f, s){ this._sheet.each(f, s); return this;},
    select: function(dayPoint){ this._sheet.select(dayPoint); return this; },
    onSelect: function(f, s) { this._onSelect.add(f, s); return this; },
    onShowDates: function(f, s) { this._onShowDates.add(f, s); return this; },
    onShowMonths: function(f, s) { this._onShowMonths.add(f, s); return this; },
    onShowYears: function(f, s) { this._onShowYears.add(f, s); return this; },
    _currentView: function(years, months, dates){
        this._isShowingYears = years;
        this._isShowingMonths = months;
        this._isShowingDates = dates;

        if(years) this._onShowYears.notify();
        if(months) this._onShowYears.notify();
        if(dates) this._onShowDates.notify();

        return this;
    },
    _showSheet: function(type){
        var currentSheet = this._sheet;
        if($.exists(currentSheet)) currentSheet.destroy();

        var sheet = this._sheetFactory[type](this.dayPoint(), this._localization)
                        .onSelect(this._onSelect.notify, this._onSelect);
        this._sheetContainer.clear().appendChild(sheet.dom());
        this._sheet = sheet;
        return this;
    }
}
$.ext(calendar, $.dom.Class);
$.calendar = function(){ return new calendar(); }