function column(dom, col, index, key, value) {
    column.base.call(this, dom);
    this.id($.uid())
        .col(col)
        .index(index)
        .key(key)
        .value(value);
        
    this._cells = $.hash();
}
column.prototype = {
    id: function(id){ return this.property("id", id); },
    col: function(col){ return this.property("col", col); },
    value: function(value){
        if($.exists(value)) this.content(value);
        return this.property("value", value);
    },
    index: function(index){
        if($.exists(index)) this.dom().cIdx = index;
        return this.property("index", index);
    },
    key: function(key){
        if($.exists(key)) this.dom().cKey = key;
        return this.property("key", key);
    },
    findCell: function(key){ return this._cells.find(key); },
    listCells: function(){ return this._cells.listValues(); },
    addCell: function(cell){
        this._cells.add(cell.rKey(), cell);
        return this;
    },
    removeCell: function(cell){
        var cells = this._cells;
        cells.remove(cell.rKey());
        if(cells.isEmpty()) {
            $.dom(this._col).detach();
            this.detach();
        }
        return this;
    },
}
$.ext(column, $.dom.Class);
$.column = function(dom, col, index, key, value){ return new column(dom, col, index, key, value); }
$.column.Class = column;