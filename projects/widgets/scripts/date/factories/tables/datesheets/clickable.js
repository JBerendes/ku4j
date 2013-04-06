function clickableDateSheetTableFactory(dayPoint, localization){
    clickableDateSheetTableFactory.base.call(this, dayPoint, localization);
}
clickableDateSheetTableFactory.prototype = {
    $setCellAction: function(cell) {
        return cell.onclick(function() { this.$table.selectCell(cell); }, this);
    }
}
$.ext(clickableDateSheetTableFactory, abstractDatesheetTableFactory);
$.clickableDateSheetTableFactory = function(dayPoint, localization){
    return new clickableDateSheetTableFactory(dayPoint, localization);
}