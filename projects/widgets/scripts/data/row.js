function row(dom, index, key) {
    row.base.call(this, dom);
    this.id($.uid())
        .index(index)
        .key(key);
    this._cells = $.hash();
}
row.prototype = {
    id: function(id){ return this.property("id", id); },
    index: function(index){
        if($.exists(index)) this.dom().rIdx = index;
        return this.property("index", index);
    },
    key: function(key){
        if($.exists(key)) this.dom().rKey = key;
        return this.property("key", key);
    },
    findCell: function(key){ return this._cells.find(key); },
    listCells: function(){ return this._cells.listValues(); },
    addCell: function(cell){
        this._dom.appendChild(cell.dom());
        this._cells.add(cell.cKey(), cell);
        return this;
    },
    removeCell: function(cell){
        this._dom.removeChild(cell.dom());
        this._cells.remove(cell.cKey());
        return this;
    }
}
$.ext(row, $.dom.Class);
$.row = function(dom, index, key, value){ return new row(dom, index, key, value); }
$.row.Class = row;