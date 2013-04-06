var  _funcs = [],
    _loaded = function() {
        var s = [],
            ll = this.lazyLoad;
            
        function try1(){
            var f = _funcs, i = f.length;
            while (i--) {
                var ff = f[i],
                    F = ff.f,
                    B = ff.b
                try { F(); }
                catch(e) { if(B && ll) s[s.length] = F; };
            }
        };
        
        function try2(){
            var i = s.length;
            while (i--) {
                var F = s[i];
                try { F(); }
                catch(e) { throw new Error(e); }
            }
        };
        try1();
        if(ll) try2();
    };
    
if($.ku.browser().isIE)
    document.onreadystatechange = function() {
        if (/complete|loaded/.test(document.readyState)) _loaded();
    }
else $.evt.add(document, "DOMContentLoaded", _loaded, $);