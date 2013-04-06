var datesheet = function(dayPoint, localization, table) {

    this._firstDateOfSheet = datesheet_findFirstDateOfSheet(dayPoint);
    this.$sheet = table.onCellSelect(this.selectCell, this);

    datesheet.base.call(this, this.$sheet.dom(), localization);

    datesheet_createColumns(this);
    datesheet_createRows(this);
}
datesheet.prototype = {
    $findCell: function(dayPoint){
        return this.$sheet.findCellById(dayPoint.toString());
    }
}
$.ext(datesheet, abstractSheet);
$.datesheet = function(dayPoint, localization, tbl){
    return (new datesheet(dayPoint, localization, tbl));
}

function datesheet_findFirstDateOfSheet(dayPoint){
    var firstDayOfMonth = dayPoint.firstDayOfMonth(),
        currentDay = dayPoint.firstDayOfMonth(),
        secondIteration = false;
    while(currentDay.day() > 0 || !secondIteration) {
        if(currentDay.day() == 0) secondIteration = true;
        currentDay = currentDay.prevDay();
    }
    return currentDay;
}
function datesheet_createColumns(sheet){
    var days = sheet.localization().day.abbr,
        tbl = sheet.$sheet,
        numberOfDays = 7,
        i = 0;

    while(i < numberOfDays) {
        var day = days[i];
        tbl.addColumn(day, {}, day);
        i++;
    }
}
function datesheet_createRows(sheet) {
    var tbl = sheet.$sheet,
        currentDate = sheet._firstDateOfSheet,
        i = 0;
    while(i < 7){
        var week = datesheet_createRow(sheet, currentDate);
        currentDate = currentDate.add(0, 0, 7);
        tbl.addRow($.uid(), week);
        i++;
    }
}  
function datesheet_createRow(sheet, dayPoint) {
    var currentDay = dayPoint, row = {};
    sheet.$sheet.listColumns().each(function(column){
         row[column.key()] = currentDay;
         currentDay = currentDay.nextDay();
    });
    return row;
}