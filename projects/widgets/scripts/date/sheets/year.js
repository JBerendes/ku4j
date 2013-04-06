var yearsheet = function(dayPoint, localization, table) {

    this._firstDateOfSheet = yearsheet_findFirstDateOfSheet(dayPoint);
    this.$sheet = table.onCellSelect(this.selectCell, this);

    yearsheet.base.call(this, this.$sheet.dom(), localization);

    yearsheet_createColumns(this);
    yearsheet_createRows(this);
}
yearsheet.prototype = {
    $findCell: function(dayPoint){
        return this.$sheet.findCellById(dayPoint.year());
    }
}
$.ext(yearsheet, abstractSheet);
$.yearsheet = function(dayPoint, localization, tbl){
    return (new yearsheet(dayPoint, localization, tbl));
}

function yearsheet_findFirstDateOfSheet(dayPoint){
    return dayPoint.add(-12, 0, 0);
}
function yearsheet_createColumns(sheet){
    var months = sheet.localization().month.abbr,
        tbl = sheet.$sheet,
        numberOfYears = 5,
        i = 0;
        
    while(i < numberOfYears) {
        tbl.addColumn(i, null, "");
        i++;
    }
}
function yearsheet_createRows(sheet) {
    var tbl = sheet.$sheet,
        currentDate = sheet._firstDateOfSheet,
        i = 0;
    while(i < 5){
        var years = yearsheet_createRow(sheet, currentDate);
        currentDate = currentDate.add(5, 0, 0);
        tbl.addRow($.uid(), years);
        i++;
    }
}  
function yearsheet_createRow(sheet, dayPoint) {
    var currentDay = dayPoint, row = {};
    sheet.$sheet.listColumns().each(function(column){
         row[column.key()] = currentDay;
         currentDay = currentDay.nextYear();
     });
    return row;
}