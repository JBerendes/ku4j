var monthsheet = function(dayPoint, localization, table) {

    this._firstDateOfSheet = monthsheet_findFirstDateOfSheet(dayPoint);
    this.$sheet = table.onCellSelect(this.selectCell, this);

    monthsheet.base.call(this, this.$sheet.dom(), localization);

    monthsheet_createColumns(this);
    monthsheet_createRows(this);
}
monthsheet.prototype = {
    $findCell: function(dayPoint){
        return this.$sheet.findCellById(dayPoint.month());
    }
}
$.ext(monthsheet, abstractSheet);
$.monthsheet = function(dayPoint, localization, tbl){
    return (new monthsheet(dayPoint, localization, tbl));
}

function monthsheet_findFirstDateOfSheet(dayPoint){
    return $.dayPoint(dayPoint.year(), 1, dayPoint.date());
}
function monthsheet_createColumns(sheet){
    var months = sheet.localization().month.abbr,
        tbl = sheet.$sheet,
        numberOfMonths = 4,
        i = 1;
        
    while(i <= numberOfMonths) {
        tbl.addColumn(i, null, "");
        i++;
    }
}
function monthsheet_createRows(sheet) {
    var tbl = sheet.$sheet,
        currentDate = sheet._firstDateOfSheet,
        i = 1;
    while(i <= 3){
        var months = monthsheet_createRow(sheet, currentDate);
        currentDate = currentDate.add(0, 4, 0);
        tbl.addRow($.uid(), months);
        i++;
    }
}  
function monthsheet_createRow(sheet, dayPoint) {
    var currentDay = dayPoint, row = {};
    sheet.$sheet.listColumns().each(function(column){
         row[column.key()] = currentDay;
         currentDay = currentDay.nextMonth();
    });
    return row;
}