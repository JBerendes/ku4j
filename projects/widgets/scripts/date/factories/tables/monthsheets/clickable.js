function clickableMonthSheetTableFactory(dayPoint, localization){
    clickableMonthSheetTableFactory.base.call(this, dayPoint, localization);
}
clickableMonthSheetTableFactory.prototype = {
    $setCellAction: function(cell) {
        return cell.onclick(function() { this.$table.selectCell(cell); }, this);
    }
}
$.ext(clickableMonthSheetTableFactory, abstractMonthsheetTableFactory);
$.clickableMonthSheetTableFactory = function(dayPoint, localization){
    return new clickableMonthSheetTableFactory(dayPoint, localization);
}