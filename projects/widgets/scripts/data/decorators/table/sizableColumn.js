function sizableColumnDecorator(table) {
    $.cast(this, table);
    
    this._sci = new $.iterator(this.columns.listValues());
    
    this._sci.foreach(function(c){
        var D = c.dom,
            s = $.create({"a":{"class":"ku-table-col-sizer"}});
        
        new $.slider(D, s, null, null, null, null, "sizer", "horizontal");
        
        D.appendChild(s);
    });
}