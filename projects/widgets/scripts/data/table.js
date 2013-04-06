function table(factory) {
    var dom = $.create({"table":{"class":"ku-table", "cellspacing":0}});
    table.base.call(this, dom);
    
    var colgroup = $.create({"colgroup":{"class":"ku-table-colgroup"}}),
        caption = $.create({"caption":{"class":"ku-table-caption"}}),
        head = $.create({"thead":{"class":"ku-table-head"}}),
        headRow = $.create({"tr":{"class":"ku-table-head-row"}}),
        body = $.create({"tbody":{"class":"ku-table-body"}}),
        foot = $.create({"tfoot":{"class":"ku-table-foot"}});

    this._columns = new $.hash();
    this._rows = new $.hash();
    this._cells = new $.hash();
    this._onCellSelect = $.observer();
    
    this.appendChild(colgroup).colgroup(colgroup)
        .appendChild(caption).caption(caption)
        .appendChild(head).head(head)
        .appendChild(headRow).headRow(headRow)
        .appendChild(body).body(body)
        .appendChild(foot).foot(foot)
        .factory(factory || new table_factory())
        .head().appendChild(this.headRow());
}

table.prototype = {
    title: function(title){
        if($.isString(title)) this.caption().innerHTML = title;
        else if($.exists(title)) this.caption().appendChild(title);
        return this.property("title", title);
    },
    factory: function(factory){ return this.property("factory", factory.table(this)); },
    caption: function(caption){ return this.property("caption", caption); },
    colgroup: function(colgroup){ return this.property("colgroup", colgroup); },
    head: function(head){ return this.property("head", head); },
    headRow: function(headRow){ return this.property("headRow", headRow); },
    body: function(body){ return this.property("body", body); },
    foot: function(foot){ return this.property("foot", foot); },
    listColumns: function(){ return this._columns.listValues(); },
    listRows: function(){ return this._rows.listValues(); },
    listCells: function(){ return this._cells.listValues(); },
    selectCell: function(cell) { this._onCellSelect.notify(cell); return this; },
    onCellSelect: function(f, s) { this._onCellSelect.add(f, s); return this; },

    addColumn: function(key, obj, value) {
        var columns = this._columns,
            rows = this._rows;

        if(columns.containsKey(key)) return this._updateColumn(key, obj, value);
        else return this._addColumn(key, obj, value);
    },
    _addColumn: function(key, obj, value){
        var column = this._factory.createColumn($.uid(), key, value);
        this._columns.add(column.key(), column);
        this._rows.listValues().each(function(row){
            this.addCell(row, column, obj[row.key()]);
        }, this);
        this._colgroup.appendChild(column.col());
        this._headRow.appendChild(column.dom());
        return this;
    },
    _updateColumn: function(key, obj, value){
        var column = this._columns.find(key);
        this._rows.listValues().each(function(row){
            this.findCell(row.key(), column.key()).value(obj[row.key()]);
        }, this);
        if($.exists(value)) column.value(value);
        return this;
    },
    findColumn: function(key){ return this._columns.find(key); },
    removeColumn: function(key){
        var rows = this._rows,
            column = this.findColumn(key);
        if(!$.exists(column)) return this;
        rows.listValues().each(function(row){
            this.removeCell(column.findCell(row.key()));
        }, this);
        this._columns.remove(column.key());
        return this;
    },
    addRow: function(key, obj) {
        var rows = this._rows,
            columns = this._columns;

        if(rows.containsKey(key)) return this._updateRow(key, obj);
        else return this._addRow(key, obj);
    },
    _addRow: function(key, obj){
        var row = this._factory.createRow($.uid(), key);
        this._rows.add(row.key(), row);
        this._columns.listValues().each(function(column){
            this.addCell(row, column, obj[column.key()])
        }, this);
        this.body().appendChild(row.dom());
        return this;
    },
    _updateRow: function(key, obj){
        var row = this._rows.find(key);
        this._columns.listValues().each(function(column){
            this.findCell(row.key(), column.key()).value(obj[column.key()]);
        }, this);
        return this;
    },
    findRow: function(key){ return this._rows.find(key); },
    removeRow: function(key){
        var columns = this._columns,
            row = this.findRow(key);
        if(!$.exists(row)) return this;
        columns.listValues().each(function(column){
            this.removeCell(row.findCell(column.key()));
        }, this);
        this._rows.remove(row.key());
        return this;
    },
    addCell: function(row, column, value){
        var cell = this._factory.createCell(value, column.index(), column.key(), row.index(), row.key());
        column.addCell(cell);
        row.addCell(cell);
        this._cells.add(cell.id(), cell);
        return this;
    },
    findCellById: function(id){ return this._cells.find(id); },
    findCell: function(rowKey, colKey){
        var cells = this._cells.listValues(), value;
        cells.each(function(cell){
            if((cell.rKey() == rowKey) &&
               (cell.cKey() == colKey)) {
                value = cell;
                cells.quit();
            }
        });
        return value;
    },
    removeCell: function(cell){
        this._cells.remove(cell.id());
        this._columns.find(cell.cKey()).removeCell(cell);
        this._rows.find(cell.rKey()).removeCell(cell);
        return this;
    },
    format: function(){
        var i = 0,
            e = "ku-table-row-even",
            o = "ku-table-row-odd",
            cn = function(){ (i % 2 == 0) ? e : o; };
        this._rows.each(function(row){
            row.removeClass(e)
               .removeClass(o)
               .addClass(cn());
            i++;
        });
    },
    toObject: function(){
        return { "title": this.title(),
                 "columns": this._columns.toObject(),
                 "rows": this._rows.toObject() }
    }
}
$.ext(table, $.dom.Class);
$.table = function(factory){ return new table(factory); }
$.table.Class = table;