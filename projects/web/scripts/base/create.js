$.create = function(x) {
    if(!x) return null;
    
    var o = ($.isString(x)) ? { x: {}} : x, E, attr;
    for (var n in o) {
        if (n == "content") continue;
        E = document.createElement(n);
        attrs = o[n];
    }
    for (var n in attrs) {
        var v = attrs[n];
        if(/class/i.test(n)){
            $.ku.css.addClass(E, v);
            continue;
        }
        if(/style/i.test(n)){
             $.ku.style.set(E, v);
            continue;
        }
        E.setAttribute(n, v);
    }
    try {
        var c = o.content;
        if(!c) return E;    
            
        var i = (!c) ? 1 : c.length;
        
        if($.exists(c.nodeName)) {
            E.appendChild(c);
            return E;
        }
        if (!$.isArray(c)) {
            E.innerHTML += c;
            return E;
        }
        while (i--) {
            var C = c[i];
            if ($.isString(C) || !isNaN(C)) {
                E.innerHTML += C;
                continue;
            }
            var o = (C.hasOwnProperty("appendChild"))
                ? C
                : $.create(C);
            E.appendChild(o);
        }
    }
    catch (e) { }
    finally { return E; }
}