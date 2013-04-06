function abstractYearsheetTableFactory(dayPoint, localization){
    abstractYearsheetTableFactory.base.call(this);
    this._dayPoint = dayPoint;
    this._localization = localization;
}
abstractYearsheetTableFactory.prototype = {
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
        var dom = $.create({td:{"class":$.str.format("ku-year", cIdx, rIdx)},
                           content: value.year()}),
            cell = $.cell(dom, cIdx, cKey, rIdx, rKey, value)
                        .addClass("ku-sheet-year")
                        .id(value.year().toString());

        return this.$setCellAction(cell);
    }
}
$.ext(abstractYearsheetTableFactory, $.Class);