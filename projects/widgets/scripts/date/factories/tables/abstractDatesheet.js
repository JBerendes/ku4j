function abstractDatesheetTableFactory(dayPoint, localization){
    abstractDatesheetTableFactory.base.call(this);
    this._dayPoint = dayPoint;
    this._localization = localization;
}
abstractDatesheetTableFactory.prototype = {
    $setCellAction: function(cell) { return cell; },
    table: function(table){
        this.$table = table;
        return this.set("table", table);
    },
    createColumn: function(index, key, value) {
        var index = this._table.listColumns().count(),
            col = $.create({col:{}}),
            dom = $.create({th:{"ku-key":key}, content: $.create({"span":{"class":"ku-table-head-content"}, content:value}) });
        return $.column(dom, col, index, key, value);
    },
    createRow: function(index, key) {
        var index = this._table.listRows().count(),
            cl = (index % 2 == 0)
                ? "ku-table-row ku-table-row-even"
                : "ku-table-row ku-table-row-odd";
            dom = $.create({tr:{"class":cl}});
        return $.row(dom, index, key);
    },
    createCell: function(value, cIdx, cKey, rIdx, rKey) {
        var table = this._table,
            today = $.dayPoint.today(),
            dom = $.create({td:{"class":$.str.format("ku-date-day-{0} ku-date-week-{1}", cIdx, rIdx)},
                           content: $.str.format("<span class='ku-datesheet-cell-date'>{0}</span>", value.date())}),
            cell = $.cell(dom, cIdx, cKey, rIdx, rKey, value)
                        .addClass("ku-sheet-date")
                        .id(value.toString());
        
        if(value.isBefore(today)) cell.addClass("ku-datesheet-past");
        if(value.equals(today)) cell.addClass("ku-datesheet-present");
        if(value.isAfter(today)) cell.addClass("ku-datesheet-future");
        if(value.isWeekday()) cell.addClass("ku-datesheet-weekday");
        if(value.isWeekend()) cell.addClass("ku-datesheet-weekend");
        if((value.month() < this._dayPoint.month()) ||
          ((value.month() == 12) && (this._dayPoint.month() == 1)))
            cell.addClass("ku-datesheet-lastMonth");
        if(value.month() == this._dayPoint.month())
            cell.addClass("ku-datesheet-thisMonth");
        if((value.month() > this._dayPoint.month()) ||
           ((value.month() == 1) && (this._dayPoint.month() == 12)))
            cell.addClass("ku-datesheet-nextMonth");
                    
        return this.$setCellAction(cell);
    }
}
$.ext(abstractDatesheetTableFactory, $.Class);