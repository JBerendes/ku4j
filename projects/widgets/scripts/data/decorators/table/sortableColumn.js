function sortableColumnDecorator(table) {
    $.cast(this, table);
    
    this._isAsc = false;
    this._asc = new $.sorter(sorter.strategy.asc);
    this._des = new $.sorter(sorter.strategy.des);

    this._sortci = new $.iterator(this.columns.listValues());
    this._sortci.foreach(function(c){
        
        var iCell = new $.iterator(c.cells.listValues()),
            sd = $.create({"a":{"class":"ku-table-col-sorter"}});
        c.dom.appendChild(sd);
            
        $.evt.add(sd, "click", function(){
            var cells = [],
                ia = this._isAsc,
                s = (ia) ? this._asc : this._des,
                f = "ku-table-col-sorter-{0}",
                a = $.str.format(f, "asc"),
                d = $.str.format(f, "dec"),
                cl = (ia) ? a : d;
                
            iCell.foreach(function(C){ cells[cells.length] = C.dom; });
            this._isAsc = !this._isAsc;
            
            var v = s.sort(cells), l = v.length, b = this.body;
            $.clearNode(b);
            
            while(l--) b.appendChild(this.rows.find(v[i].rIdx).dom);
            
            $.ku.css.removeClass(sd, a);
            $.ku.css.removeClass(sd, d);
            $.ku.css.addClass(sd, cl);
            
            this.format();
        }, this);
    }, this);
}