function table_factory(){
    table_factory.base.call(this);
}
table_factory.prototype = {
    table: function(table){ return this.set("table", table);  },
    createColumn: function(index, key, value) {
        var col = $.create({col:{}}),
            dom = $.create({th:{"ku-key":key}, content: $.create({"span":{"class":"ku-table-head-content"}, content:value}) });
        return $.column(dom, col, index, key, value);
    },
    createRow: function(index, key) {
        var dom = $.create({tr:{"class":"ku-table-row"}});
        return $.row(dom, index, key);
    },
    createCell: function(value, cIdx, cKey, rIdx, rKey) {
        var table = this._table,
            dom = $.create({td:{"class":"ku-table-cell"}, content: value}),
            cell = $.cell(dom,cIdx, cKey, rIdx, rKey, value)
                     .onclick(function() { table.selectCell(cell); }, this);
        return cell;
    }
}
$.ext(table_factory, $.Class);