$(function(){
    function notOk(s, m) {equal(s,false,m);}
    
    module("calendar Test");
    
    var calendar = $.calendar();
    
    test("create", function() {
        ok($.calendar());
    });

    var calendar = $.calendar().appendTo($(".calendar")[0]);

    test("name", function() {
        equal(calendar.name(), undefined);
        calendar.name("myCalendar");
        equal(calendar.name(), "myCalendar");
    });
    test("showDates", function() {
        calendar.showDates();
        var dom = $(".calendar").find(".ku-calendar")[0];
        ok(dom);
    });
    test("dayPoint", function() {
        var dayPoint = $.dayPoint(2012,12,12);
        ok($.dayPoint.today().equals(calendar.dayPoint()));
        ok(dayPoint.equals(calendar.dayPoint(dayPoint).dayPoint()));
    });
    test("nextAction", function() { });
    test("prevAction", function() { });
    test("selectionPolicy", function() { });
    test("onDateSelected", function() { });
    test("onDateDeselected", function() { });
    test("nextMonth", function() { });
    test("prevMonth", function() { });
    test("nextYear", function() { });
    test("prevYear", function() { });
    test("selectDate", function() { });
    test("deselectDate", function() { });

    test("clear", function() { });
    test("read", function() { });
    test("write", function() { });
    test("saveAs", function() { });
    test("save", function() { });
    test("erase", function() { });
});
/*
    name: function(name){ return this.property("name", name); },
    dayPoint: function(dayPoint){ return this.property("dayPoint", dayPoint); },
    nextAction: function(nextAction){ return this.property("nextAction", nextAction); },
    prevAction: function(prevAction){ return this.property("prevAction", prevAction); },
    selectionPolicy: function(selectionPolicy){ return this.property("selectionPolicy", selectionPolicy); },
    onDateSelected: function(f, s){ this._onDateSelected.add(f, s); return this;},
    onDateDeselected: function(f, s){ this._onDateDeselected.add(f, s); return this;},
    nextMonth: function(){ this.dayPoint(this.dayPoint().nextMonth()).showDates(); },
    prevMonth: function(){ this.dayPoint(this.dayPoint().prevMonth()).showDates(); },
    nextYear: function(){ this.dayPoint(this.dayPoint().nextYear()).showDates(); },
    prevYear: function(){ this.dayPoint(this.dayPoint().prevYear()).showDates();},
    selectDate: function(date){},
    deselectDate: function(date){},
    //showYears: function(){ }
    //showMonths: function(){ }
    showDates: function(){},
    clear: function(){},
    read: function(){ return $.dto(this._selectedDates.toObject()); },
    write: function(dto){},
    saveAs: function(name){},
    save: function(){},
    erase: function(){}
*/
