function clickableYearSheetTableFactory(dayPoint, localization){
    clickableYearSheetTableFactory.base.call(this, dayPoint, localization);
}
clickableYearSheetTableFactory.prototype = {
    $setCellAction: function(cell) {
        return cell.onclick(function() { this.$table.selectCell(cell); }, this);
    }
}
$.ext(clickableYearSheetTableFactory, abstractYearsheetTableFactory);
$.clickableYearSheetTableFactory = function(dayPoint, localization){
    return new clickableYearSheetTableFactory(dayPoint, localization);
}