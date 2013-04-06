var $ku = {
    css: {
        addClass: function(dom, classname) {
            var d = $.ele(dom), cn = d.className;
            if ($.ku.css.hasClass(dom, classname)) return;
            d.className += (/^[^\s]/.test(cn)) ? (" " + classname) : classname;
        },
        hasClass: function(dom, classname) {
            if (!$.exists(classname)) return false;
            return (new RegExp(classname)).test(($.ele(dom)).className);
        },
        removeClass: function(dom, classname) {
            var d = $.ele(dom), cn = d.className;
            if (!$.ku.css.hasClass(dom, classname)) return;
            d.className = $.str.trim(cn.replace(new RegExp("(^|\\s)" + classname + "(?![\\w\\-])"), ""));
        }
    },
    getText: function(dom) {
        var d = $.ele(dom);
        return d.textContent || d.innerText;
    },
    quirks: {
        setOpacity: function(dom, o){
            var O = o/100;
            dom.style["opacity"] = O;
            dom.style["-moz-opacity"] = O;
            dom.style["-webkit-opacity"] = O;
            dom.style["filter"] = $.str.format("alpha(opacity={0})", o);
        },
        clearOpacity: function(dom){
            $.ku.style.set(dom, {opacity:null, "-moz-opacity":null, "-webkit-opacity":null, filter: null});
        }
    },
    ready: function(func, isLazy) { _funcs[_funcs.length] = { f: func, b: isLazy || false }; },
    redraw: function(dom) {
        var d = $.ele(dom) || document.documentElement,
            cd = d.style.display || "";
        d.style.display = "none";
        var os = d.offsetHeight;
        d.style.display = cd;
    },
    style: {
        set: function(dom, s, value){
            var d = $.ele(dom);
            function getKey(n){ return (/\-/.test(n)) ? n.replace(/\-\w/, n.charAt(n.indexOf("-")+1).toUpperCase()) : n}
            if($.isString(s)){
                try{ d.style[getKey(s)] = value; }
                catch(e){  }
            }
            for(var n in s) {
                var key = getKey(n);
                if(/opacity/i.test(key)){ $.ku.quirks.setOpacity(dom, s[n]); continue; }
                try { d.style[key] = s[n]; }
                catch(e) { continue; }
            }
        },
        get: function(dom, style){
            var node = $.ele(dom);

            function getStyle(d, s){
                var key = (/\-/.test(s)) ? s.replace(/\-\w/, s.charAt(s.indexOf("-")+1).toUpperCase()) : s;
                try { return window.getComputedStyle(d, null).getPropertyValue(s); }
                catch(e){
                    return ($.exists(d.currentStyle)) ? d.currentStyle[s]
                           : ($.exists(d.style)) ? d.style[key] : "";
                }
            }

            if(/opacity/i.test(style)) {
                var opacity = getStyle(node, style);
                if($.exists(opacity)) return parseFloat(opacity) * 100;
                else {
                    var filter = /alpha\(opacity=\d+(\.\d+)?\)/i.exec(node.style.filter);
                    if(!$.exists(filter)) return 100;
                    var number = /\d+(\.\d+)?/i.exec(filter[0]);
                    if(!$.exists(number)) return 100;
                    return parseFloat(number[0]);
                }
            }
            return getStyle(node, style)
        },
        toNumber: function(v){ return parseFloat(this.stripUnit(v)); },
        stripUnit: function(v){ return ($.exists(v) && $.exists(v.replace)) ? v.replace(/[^\-\.\d]/g, "") : v; },
        getUnit: function(v){ return v.match(/[^\-\.\d]{2}/)[0]; }
    },
    swapDom: function(dom, forDom){
        var d = $.ele(dom)
            f = $.ele(forDom);
        d.parentNode.replaceChild(f, d);
    }
}
$.ku = $ku;