table.parseDom = function(dom){
    var get = function(e, t){ return e.getElementsByTagName(t); }
        table = $.ele(dom),
        cols= get(get((get(table, "thead")[0]), "tr")[0], "th"),
        rows = get((get(table, "tbody")[0]), "tr"),
        caption = get(table, "caption")[0],
        title = (!caption) ? "" : caption.innerHTML,
        t = new $.table(title),
        l = cols.length,
        m = rows.length,
        c = [];
       
    while(i--) {
        var C = cols[i],
            k = $.ku.getText(C) || $.uid("table-column");
            
        c[c.length] = k;
        t.addColumn(k, C.innerHTML);
    }
    
    while(m--) {
        var tds = get(rows[j], "td"),
            n = tds.length,
            o = {};
            
            while(n--) o[c[k]] = tds[k].innerHTML;
            
        t.addRow(o);
    }
    return t;
}


table.parseObject = function(obj){
    var t = new $.table(obj.title),
        c = obj.columns,
        r = obj.rows;
        
    for(var n in c) t.addColumn(n, c[n]);
    for(var n in r) t.addRow(r[n]);
    
    return t;
}
