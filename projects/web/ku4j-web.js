(function($){
if(!$) $ = {};
$.DomClass = function(dom){
    $.DomClass.base.call(this);
    this.dom($.refcheck(dom, $.str.format("$.DomClass requires valid DOM node.")));
}
$.DomClass.prototype = {
    dom: function(dom){ return this.property("dom", dom); }
}
$.ext($.DomClass, $.Class);

var response = function() { }
response.prototype = {

}
$.ext(response, $.Class);

function service(){
    service.base.call(this);
    this._processId = $.uid("svc");
    this._onSuccess = $.observer();
    this._onError = $.observer();
    this._onComplete = $.observer();
    this._lock = $.lock();
    this._isLocal = false;
    
    this.GET().text().xhr().async().unlock();
}
service.prototype = {
    processId: function(){ return this.get("processId"); },
    verb: function(verb){ return this.property("verb", verb); },
    callType: function(callType){ return this.property("callType", callType); },
    responseType: function(responseType){ return this.property("responseType", responseType); },
    uri: function(uri){ return this.property("uri", uri); },
    maxAttempts: function(maxAttempts){ return this.property("maxAttempts", maxAttempts); },
    isLocal: function(isLocal){ return this.property("isLocal", isLocal); },
    strategy: function(strategy){
        if($.exists(strategy)) strategy.context(this);
        return this.property("strategy", strategy);
    },
    isAsync: function(){ return /ASYNC/i.test(this.callType()); },
    isPost: function(){ return /POST/i.test(this.verb()); },
    isLocked: function(){ return this._lock.isLocked(); },
    isBusy: function(){ return this._isBusy; },
    
    onSuccess: function(f, s, id){ this._onSuccess.add(f, s, id); return this; },
    onError: function(f, s, id){ this._onError.add(f, s, id); return this; },
    onComplete: function(f, s, id){ this._onComplete.add(f, s, id); return this; },    
    removeListener: function(id){
        this._onSuccess.add(id);
        this._onError.add(id);
        this._onComplete.add(id);
        return this;
    },
    clearListeners: function(){
         this._onSuccess.clear();
        this._onError.clear();
        this._onComplete.clear();
        return this;
    },
    OPTIONS: function(){ return this.verb("OPTIONS"); },
    GET: function(){ return this.verb("GET"); },
    HEAD: function(){ return this.verb("HEAD"); },
    POST: function(){ return this.verb("POST"); },
    PUT: function(){ return this.verb("PUT"); },
    DELETE: function(){ return this.verb("DELETE"); },
    TRACE: function(){ return this.verb("TRACE"); },
    CONNECT: function(){ return this.verb("CONNECT"); },
    
    xhr: function(){ return this.strategy(new xhr()); },
    xss: function(){ return this.strategy(new xss()); },
    sync: function(){ return this.callType("sync"); },
    async: function(){ return this.callType("async"); },
    text: function(){ return this.responseType("responseText"); },
    xml: function(){ return this.responseType("responseXML"); },
    
    success: function(response){ this._onSuccess.notify(response, this._processId); return this; },
    error: function(response){ this._onError.notify(response, this._processId); return this; },
    complete: function(response){
        this._onComplete.notify(response, this._processId);
        this._isBusy = false;
        return this;
    },
    
    lock: function(){ this._lock.lock(); return this; },
    unlock: function(){ this._lock.unlock(); return this; },
    
    abort: function(){
        if(!this._isBusy) return this;
        this.strategy().abort();
        return this;
    },
    call: function(params){
        if(this.isLocked()) return this;
        this._isBusy = true;
        this.strategy().call(params);
        return this;
    }
}
$.ext(service, $.Class);
$.service = function(){ return new service(); }

$.service.noCache = function(dto) {
    var noCache = $.dto({"noCache": $.uid()});
    if(!$.exists(dto)) return noCache;
    return dto.merge(noCache);
}

function xhr(){
    xhr.base.call(this);
    this._isOk = function(status){ return /[23]\d{2}/.test(status) || this.context().isLocal(); }
    this._isAborted = function(status){ return !/\d{3}/.test(status); }
    this._attempts = 0;
}
xhr.prototype = {
    context: function(context){ return this.property("context", context); },
    abort: function(){
        try { this._xhr.abort(); }
        catch(e){ /*Fail*/ }
    },
    call: function(params){
        this._xhr = xhr_createXhr();
        var context = this.context(),
            isPost = context.isPost(),
            xhr = this._xhr,
            paramsExist = $.exists(params);
            format = (isPost || !paramsExist) ? "{0}" : "{0}?{1}",
            postParams = (isPost) ? params : null,
            paramLength = (paramsExist) ? params.length : 0;
            me = this;
            
        if(!$.exists(xhr)) context.error(new Error("Ajax not supported")); 
        xhr.open(context.verb(), $.str.format(format, context.uri(), params), context.isAsync());
        
        if(isPost){
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Content-length", paramLength);
            xhr.setRequestHeader("Connection", "close");
        }

        xhr.onreadystatechange = function(){
            if(xhr.readyState > 3) {
                var response = xhr[context.responseType()],
                    status = xhr.status;
                if(me._isAborted(status)) return;
                if(me._isOk(status)){
                    context.success(response).complete(response);
                    return;
                }
                if(me._attempts < context.maxAttempts()) {
                    me.call(params);
                    return;
                }
                context.error(response).complete(response);
            }
        }
        xhr.send(postParams);
    }
}
$.ext(xhr, $.Class);

function xhr_createXhr(){
    return ($.exists(XMLHttpRequest))
        ? new XMLHttpRequest()
        : ($.exists(window.ActiveXObject))
            ? (function(){
                    var v = ["MSXML2.Http6.0", "MSXML2.Http5.0", "MSXML2.Http4.0", "MSXML2.Http3.0", "MSXML2.Http"];
                    for(var n in v) {
                        try{ return new ActiveXObject(v[n]); }
                        catch(e){ }
                    }
                    return null;
                })()
            : null;
}

function xss(){
    xhr.base.call(this);
    this._head = document.documentElement.getElementsByTagName("head")[0];
}
xss.prototype = {
    context: function(context){ return this.property("context", context); },
    abort: function(){
        try { this._head.removeChild(this._script); }
        catch(e){ /*Fail*/ }
    },
    call: function(params){
        var context = this.context(),
            head = document.documentElement.getElementsByTagName("head")[0],
            format = "{0}?ku4jXssOnSuccess=kodmunki.{1}&ku4jXssOnError=kodmunki.{2}&ku4jXssOnComplete=kodmunki.{3}{4}",
            procId = context.processId(),
            success = procId + "_success",
            error = procId + "_error",
            complete = procId + "_complete",
            parameters = ($.exists(params)) ? "&" + params : "",
            location = $.str.format(format, context.uri(), success, error, complete, parameters);
            
        this._script = $.create({script:{src:location, language:"javascript", type:"text/javascript"}});

        kodmunki[success] = function(){ context.success.apply(context, arguments); };
        kodmunki[error] = function(){ context.error.apply(context, arguments); };
        kodmunki[complete] = function(){ context.complete.apply(context, arguments); };
            
        this._head.appendChild(this._script);
    }
}
$.ext(xss, $.Class);

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

$.clearNode = function(dom) {
    var e = $.ele(dom);
    if(!e) return;
    
    while (e.hasChildNodes()) e.removeChild(e.firstChild);
}

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

$.ele = function(o) {
    if(!o) return null;
    return ($.isEvent(o)) ? $.evt.ele(o)
          :($.isString(o)) ? document.getElementById(o)
          :($.exists(o.dom)) ? o.dom : o;
}

var domEvent = function(dom, evt, action, scope, bubbles){
    this.dom = dom;
    this.evt = evt;
    this.action = action;
    this.scope = scope;
    this.bubbles = bubbles;
}
$.evt = {
    add: function(dom, evt, action, scope, bubbles) {
        var d = $.refcheck($.ele(dom), $.str.format("argument dom == {0} at $.evt.add", dom)),
            e = evt,
            s = scope || d,
            b = bubbles || false,
            a = function() { action.apply(s, arguments); };
            
        if ($.exists(d.addEventListener))
            d.addEventListener(e, a, b);
        else if ($.exists(d.attachEvent))
            d.attachEvent("on" + e, a);
        else
            d["on" + e] = a;

        return new domEvent(d, e, a, s, b);
    },
    remove: function(domEvt) {
        var d = domEvt.dom,
            e = domEvt.evt,
            s = domEvt.scope,
            b = domEvt.bubbles,
            a = domEvt.action;
            
        if (d.removeEventListener)
            d.removeEventListener(e, a, b);
        else if (d.detachEvent)
            d.detachEvent("on" + e, a);
        else
            d["on" + e] = null;

        return this;
    },
    ele: function(e){
        try { return (e.srcElement) ? e.srcElement : e.target; }
        catch(e) { return null; }
    },
    mute: function(e) {
        if ($.exists(e.preventDefault)) e.preventDefault();
        if ($.exists(e.stopPropogation)) e.stopPropogation();
        e.returnValue = false;
        e.cancelBubble = true;
        return this;
    }
}

$.findOuterDims = function(dom) {
    var d = $.ele(dom);
    return { width: d.offsetWidth, height: d.offsetHeight };
},
$.findInnerDims = function(dom) {
    var d = $.ele(dom);
    return { width: d.clientWidth, height: d.clientHeight };
},
$.findOffset = function(dom) {
    var d = $.ele(dom), x = 0, y = 0;
    if(!d) return null;
    do {
        x += d.offsetLeft;
        y += d.offsetTop;
    }
    while ((function(){
        try { d = d.offsetParent; }
        catch(e) { d = null; }
        return $.exists(d);
    })());
    return { left: x, top: y };
}
$.findBoundedOffset = function(dom){
    var d = $.ele(dom);
    if(!d) return null;
    return{ left: d.offsetLeft, top: d.offsetTop }
},
$.findScrollDims = function(dom) {
    var d = $.ele(dom);
    return { width: d.scrollWidth, height: d.scrollHeight };
}

$.findScrollOffset = function(dom) {
    var d = $.ele(dom), x = 0, y = 0;
    if(!d) return null;
    do {
        x += d.scrollLeft || 0;
        y += d.scrollTop || 0;
    }
    while ((function(){
        try { d = d.parentNode; }
        catch(e) { d = null; }
        return $.exists(d);
    })());
    return { left: x, top: y };
}

var browser = function(navigator) {
    this._navigator = navigator;

    agents = {
        _isIE: "MSIE",
        _isNetscape: "Netscape",
        _isFirefox: "Firefox",
        _isOpera: "Opera",
        _isSafari: "Safari",
        _isChrome: "Chrome"
    };

    this._isIE = false;
    this._isNetscape = false;
    this._isFirefox = false;
    this._isOpera = false;
    this._isSafari = false;
    this._isChrome = false;
    this._isUnknown = true;
    this._version = "";

    if(!$.isObject(navigator)) return;

    var navigator = this._navigator,
        userAgent = navigator.userAgent;

    function isAgentTest(testValue) {
        return !$.isNullOrEmpty(userAgent) &&
               (new RegExp(testValue,"i")).test(userAgent);
    }

    function findVersion(testValue) {
        try {
            var version = (new RegExp("Version\\/(\\d+\\.?){1,}","i")).exec(userAgent),
                name = (new RegExp(testValue + "\\/(\\d+\\.?){1,}","i")).exec(userAgent),
                ver = $.exists(version) ? version : name;
            return (new RegExp("(\\d+\\.?){1,}")).exec(ver[0])[0];
        }
        catch(e) { return ""; }
    }

    var n, result, testValue;
    for(n in agents) {
        testValue = agents[n];
        result = isAgentTest(testValue);

        if(!result) continue;

        this[n] = result;
        this._version = findVersion(testValue);
        this._isUnknown = false;
    }

    this._fullVersion = navigator.appVersion;
    this._platform = navigator.platform;
    this._allInfo =  this._fullVersion + this._platform;
}
browser.prototype = {
    isIE: function() { return this._isIE; },
    isNetscape: function() { return this._isNetscape; },
    isFirefox: function() { return this._isFirefox; },
    isOpera: function() { return this._isOpera; },
    isSafari: function() { return this._isSafari && !this._isChrome; },
    isChrome: function() { return this._isChrome; },
    isUnknown: function() { return this._isUnknown; },
    platform: function(){ return this._platform; },
    fullVersion: function(){ return this._fullVersion; },
    version: function() { return this._version; }
}
var browser_instance;
$.ku.browser = function(){
    if ($.exists(browser_instance)) return browser_instance;
    browser_instance = new browser(navigator);
    return browser_instance;
 }
$.ku.browser.Class = browser;

var dom = function(query) {
    dom.base.call(this, $.ele(query));
	
	var display = this.style("display") || "block";
    this._display = (/none/i.test(display)) ? "block" : display;
    this._liveEvents = $.hash();
}
dom.prototype = {
	attribute: function(key, value){
		var d = this.dom();
		if($.isUndefined(value)) return d.getAttribute(key);
		d.setAttribute(key, value);
		return this;
	},
    addClass: function(value){
        $.ku.css.addClass(this.dom(), value);
        return this;
    },
    removeClass: function(value){
        $.ku.css.removeClass(this.dom(), value);
        return this;
    },
    hasClass: function(value){
        $.ku.css.hasClass(this.dom(), value);
        return this;
    },
    style: function(property, value){
        if($.isString(property) && !$.exists(value))
            return $.ku.style.get(this.dom(), property);
        $.ku.style.set(this.dom(), property, value);
        return this;
    },
    value: function(value){
        if(!$.exists(value)) return this.dom().value;
        this.dom().value = value;
        return this;
    },
    content: function(content){
        if(!$.exists(content) ) return this;
        if($.isNumber(content) || $.isString(content)) return this.html(content);
        return this.appendChild(content);
    },
    cloneNode: function(deep){
        return this._dom.cloneNode(deep||true);
    },
    html: function(value){
        if(!$.exists(value)) return this.dom().innerHTML;
        this.dom().innerHTML = value;
        return this;
    },
    text: function(value){
        if(!$.exists(value)) return $.ku.getText(this.dom());
        $.ku.setText(this.dom(), value);
        return this;
    },
    prependChild: function(dom){
        var _dom = this.dom(),
            firstChild = _dom.firstChild;

        if($.exists(firstChild)) _dom.insertBefore(dom, firstChild);
        else _dom.appendChild(dom);

        return this;
    },
    appendChild: function(dom){
        this.dom().appendChild(dom);
        return this;
    },
    removeChild: function(dom){
        this.dom().removeChild(dom);
        return this;
    },
    insertBefore: function(dom){
        dom.parentNode.insertBefore(this.dom(), dom);
        return this;
    },
    insertAfter: function(dom){
        if($.exists(dom.nextSibling))
            dom.parentNode.insertBefore(this.dom(), dom.nextSibling);
        else dom.parentNode.appendChild(this.dom());
        return this;
    },
    appendTo: function(dom){
        dom.appendChild(this.dom());
        return this;
    },
    detach: function(){
        try {
            var d = this.dom();
            d.parentNode.removeChild(d);
        }
        catch(e){ }
        finally{ return this; }
    },
    innerDims: function(value){
        if(!$.exists(value))
            return $.coord.parse($.findInnerDims(this.dom()));
        
        var p = value.toPixel()
        this.style({"width": p.x(), "height": p.y()})
        return this;
    },
    outerDims: function(value){
        if(!$.exists(value)) return $.coord.parse($.findOuterDims(this.dom()));
        var outer = this.outerDims().subtract(this.innerDims());
        return this.innerDims(value.subtract(outer));
    },
    innerWidth: function(value){
        var d = this.innerDims();
        if(!$.exists(value)) return $.coord(d.x(), 0);
        return this.innerDims($.coord(value, d.y()));
    },
    innerHeight: function(value){
        var d = this.innerDims();
        if(!$.exists(value)) return $.coord(0, d.y());
        return this.innerDims($.coord(d.x(), value));
    },
    outerWidth: function(value){
        var d = this.outerDims();
        if(!$.exists(value)) return $.coord(d.x(), 0);
        return this.outerDims($.coord(value, d.y()));
    },
    outerHeight: function(value){
        var d = this.outerDims();
        if(!$.exists(value)) return $.coord(0, d.y());
        return this.outerDims($.coord(d.x(), value));
    },
    boundedOffset: function(){
        return $.coord.parse($.findBoundedOffset(this.dom()));
    },
    layoutDims: function(){
        var p = this.dom().parentNode;
        if(!$.exists(p)) return $.coord.zero();
        var d = $.dom(p);
        return d.outerDims().subtract(d.innerDims()).half();
    },
    offset: function(){
        return $.coord.parse($.findOffset(this.dom()));
    },
    center: function(){
        return this.offset().add(this.outerDims().half());
    },
    scrollDims: function(){
        return $.coord.parse($.findScrollDims(this.dom()));
    },
    scrollOffset: function(){
        return $.coord.parse($.findScrollOffset(this.dom()));
    },
    clear: function(){
        $.clearNode(this.dom());
        return this;
    },
    redraw: function(){
        $.ku.redraw(this.dom());
        return this;
    },
    swap: function(other){
        $.ku.swapDom(this.dom, other.dom);
        return other;
    },
    show: function(){
       this.style({display: this._display});
       return this;
    },
    hide: function(){
        this.style({display: "none"});
        return this;
    },
    isVisible: function(){
        var tl = this.offset(),
            br = this.offset().add(this.innerDims());
        
        return $.exists(this.dom().parentNode) &&
            !/NONE|^$/i.test(this.style("display")) &&
            $.window().scrollOffset().isLeftOf(br) &&
            $.window().scrollOffset().isAbove(br) &&
            $.window().scrollDims().isRightOf(tl) &&
            $.window().scrollDims().isBelow(tl);
    },
    onmouseover: function(act, scp, id){ return this._addEvent("mouseover", act, scp, id);  },
    onmouseout: function(act, scp, id){ return this._addEvent("mouseout", act, scp, id);  },
    onmousedown: function(act, scp, id){ return this._addEvent("mousedown", act, scp, id);  },
    onmouseup: function(act, scp, id){ return this._addEvent("mouseup", act, scp, id);  },
    onmousemove: function(act, scp, id){ return this._addEvent("mousemove", act, scp, id);  },
    onclick: function(act, scp, id){ return this._addEvent("click", act, scp, id);  },
    ondoubleclick: function(act, scp, id){ return this._addEvent("dblclick", act, scp, id);  },
    onkeydown: function(act, scp, id){ return this._addEvent("keydown", act, scp, id);  },
    onkeyup: function(act, scp, id){ return this._addEvent("keyup", act, scp, id);  },
    onkeypress: function(act, scp, id){ return this._addEvent("keypress", act, scp, id);  },
    onblur: function(act, scp, id){ return this._addEvent("blur", act, scp, id);  },
    onchange: function(act, scp, id){ return this._addEvent("change", act, scp, id);  },
    onerror: function(act, scp, id){ return this._addEvent("error", act, scp, id);  },
    onfocus: function(act, scp, id){ return this._addEvent("focus", act, scp, id);  },
    onload: function(act, scp, id){ return this._addEvent("load", act, scp, id);  },
    onresize: function(act, scp, id){ return this._addEvent("resize", act, scp, id);  },
    onscroll: function(act, scp, id){ return this._addEvent("scroll", act, scp, id);  },
    onselect: function(act, scp, id){ return this._addEvent("select", act, scp, id);  },
    onresize: function(act, scp, id){ return this._addEvent("resize", act, scp, id);  },
    onunload: function(act, scp, id){ return this._addEvent("unload", act, scp, id);  },
    onorientationchange: function(act, scp, id){ return this._addEvent("orientationchange", act, scp, id);  },
    ontouchstart: function(act, scp, id){ return this._addEvent("touchstart", act, scp, id);  },
    ontouchend: function(act, scp, id){ return this._addEvent("touchend", act, scp, id);  },
    ontouchmove: function(act, scp, id){ return this._addEvent("touchmove", act, scp, id);  },
    removeEvent: function(id) {
        var evt = this._liveEvents.find(id);
        if(!$.exists(evt)) return this;
        return this._removeEvent(evt, id);
    },
    clearEvents: function(){
        this._liveEvents.listValues().each(function(evt) { this._removeEvent(evt); }, this);
         return this;
    },
    _addEvent: function(type, act, scp, id) {
        var ID = id || $.uid("evt"), liveEvents = this._liveEvents;
        if(liveEvents.containsKey(ID)) return this;
        liveEvents.add(ID, $.evt.add(this.dom(), type, act, scp));
        return this;
    },
    _removeEvent: function(evt, id){
        $.evt.remove(evt);
        this._liveEvents.remove(id);
        return this;
    }
}
$.ext(dom, $.DomClass)
$.dom = function(query){ return new dom(query); }
$.dom.Class = dom;

function kuWindow() {
    kuWindow.base.call(this);
    this._body = $.dom(document.body);
}
kuWindow.prototype = {
    isDisabled: function(){ return this.get("disabled"); },
    isPortrait:function(){ return this.orientation.isLandscape();  },
    isLandscape:function(){ return Math.abs(window.orientation) == 90; },
    disable: function() {
        this._disabled = true;
        document.body.appendChild(window_disableDom);
        return this;
    },
    enable: function() {
        if(!this.isDisabled()) return this;
        document.body.removeChild(window_disableDom);
        this._disabled = false;
        return this;
    },
    dims: function() {
        var  x = window.innerWidth || document.documentElement.clientWidth,
            y = window.innerHeight || document.documentElement.clientHeight;
        return $.coord(x, y);
    },
    center: function() {
        return this.dims().divide($.coord(2, 2));
    },
    scrollOffset: function() {
        var docEle = document.documentElement,
            body = document.body,
            x = Math.max(docEle.scrollLeft, body.scrollLeft),
            y = Math.max(docEle.scrollTop, body.scrollTop);
        return $.coord(x,y);
    },
    scrollDims: function() {
        var docEle = document.documentElement,
            body = document.body,
            x = Math.max(docEle.scrollWidth, body.scrollWidth),
            y = Math.max(docEle.scrollHeight, body.scrollHeight);
        return $.coord(x,y);
    },
    scrollCenter: function() {
        return this.center().add(this.scrollOffset());
    },
    contains: function(coord){
        var topLeft = this.scrollOffset(),
            bottomRight = this.scrollDims();
            
        return !(coord.isAbove(topLeft) ||
                 coord.isLeftOf(topLeft) ||
                 coord.isRightOf(bottomRight) ||
                 coord.isBelow(bottomRight));
    },
    redraw: function(){
        $.ku.redraw(document.body);
        $.ku.redraw(document.documentElement);
        return this;
    },

    onmousedown: function(act, scp, id){ return this._body.onmousedown(act, scp, id);  },
    onmouseup: function(act, scp, id){ return this._body.onmouseup(act, scp, id);  },
    ontouchstart: function(act, scp, id){ return this._body.ontouchstart(act, scp, id);  },
    ontouchend: function(act, scp, id){ return this._body.ontouchend(act, scp, id);  },
    onclick: function(act, scp, id){ return this._body.onclick(act, scp, id);  },
    ondoubleclick: function(act, scp, id){ return this._body.ondoubleclick(act, scp, id);  },
    onkeydown: function(act, scp, id){ return this._body.onkeydown(act, scp, id);  },
    onkeyup: function(act, scp, id){ return this._body.onkeyup(act, scp, id);  },

    scrollTo: function(coord) { window.scrollTo(coord.x, coord.y); return this; },
    onresize: function(func, scp, id) { window_onresize.add(func, scp, id); return this; },
    onscroll: function(func, scp, id) { window_onscroll.add(func, scp, id); return this; },
    onspin: function(func, scp, id) { window_onspin.add(func, scp, id); return this; },
    remove: function(id){
        window_onresize.remove(id);
        window_onscroll.remove(id);
        window_onspin.remove(id);
        this._body.removeEvent(id);
        return this;
    }
}
$.ext(kuWindow, $.Class);
var window_lastDims = $.coord.zero(),
    window_lastScroll,
    window_disableDom = $.create({div:{"class":"ku-window-disabled"}}),
    window_onresize = $.observer(), 
    window_onscroll = $.observer(),
    window_onspin = $.observer();


var window_popup = function(){ }
window_popup.prototype = {
    uri: function(uri){ return this.property("uri", uri); },
    offset: function(offset){ return this.property("offset", offset); },
    dims: function(dims){ return this.property("dims", dims); },

    channelmode: function(channelmode){ return this.property("channelmode", channelmode); },
    directories: function(directories){ return this.property("directories", directories); },
    fullscreen: function(fullscreen){ return this.property("fullscreen", fullscreen); },
    location: function(location){ return this.property("location", location); },
    menubar: function(menubar){ return this.property("menubar", menubar); },
    scrollbars: function(scrollbars){ return this.property("scrollbars", scrollbars); },
    titlebar: function(titlebar){ return this.property("titlebar", titlebar); },
    toolbar: function(toolbar){ return this.property("toolbar", toolbar); },
    open: function(){ }
}
$.ext(window_popup, $.Class);

var window_instance;
$.window = function(){
    if ($.exists(window_instance)) return window_instance;
    $.evt.add(window, "resize", function(){ window_onresize.notify(); });
    $.evt.add(window,"scroll",function(){ window_onscroll.notify(); });
    $.evt.add(window,"orientationchange",function(){ window_onspin.notify(); });
    window_instance = new kuWindow();
    return window_instance;
 }

function abstractField(){
    abstractField.base.call(this);
    this._onIsValid = $.observer();
    this._onInvalid = $.observer();
    this.spec($.spec(function(){ return true; }))
        .optional();
}
abstractField.prototype = {
    $read: function(){ return; },
    $write: function(){ return; },
    $clear: function(){ return; },
    value: function(value){
        if(!$.exists(value)) return this.$read();
        this.$write(value);
        return this;
    },
    clear: function(){ return this.$clear(); },
    optional: function(){ this._optionSpec = $.fields.specs.optional; this._operand = "or"; return this; },
    required: function(){ this._optionSpec = $.fields.specs.required; this._operand = "and"; return this; },
    spec: function(spec){ return this.property("spec", spec); },
    isValid: function(){
        var b = this._optionSpec[this._operand](this.spec()).isSatisfiedBy(this.value()),
            o = (b) ? this._onIsValid : this._onInvalid;
        o.notify(this);
        return b;
    },
    isEmpty: function(){ return $.isEmpty(this.value()); },
    onIsValid: function(f, s, id){ this._onIsValid.add(f, s, id); return this; },
    onInvalid: function(f, s, id){ this._onInvalid.add(f, s, id); return this; }
 }
$.ext(abstractField, $.Class);

function field(dom){
    field.base.call(this);

    var d = $.ele(dom);
    this.dom($.refcheck(d, $.str.format("$.DomClass requires valid DOM node.")))
        .spec($.spec(function(){ return true; }))
        .optional();
}
field.prototype = {
    $read: function(){ return this.dom().value },
    $write: function(value){ this.dom().value = value; },
    $clear: function(){ this.dom().value = ""; return this; },
    dom: function(dom){ return this.property("dom", dom); }
 }
$.ext(field, abstractField);
$.field = function(dom){ return new field(dom); }
$.field.Class = field;

function checkbox(dom){
    checkbox.base.call(this, dom);
}
checkbox.prototype = {
    $read: function(){
        var d = this.dom();
        return (d.checked) ? d.value : "";
    },
    $write: function(value){
        var d = this.dom();
        d.checked = (d.value == value);
    },
    $clear: function(){ this.uncheck(); return this; },
    check: function(){ this.dom().checked = true; return this; },
    uncheck: function(){ this.dom().checked = false; return this; }
}
$.ext(checkbox, field);
$.checkbox = function(dom){ return new checkbox(dom); }
$.checkbox.Class = checkbox;

function radioset(){
    radioset.base.call(this);
    this._radios = $.list();
}
radioset.prototype = {
    $read: function(){
        var rv = [];
        this._radios.each(function(r){ if(r.checked) rv.push(r.value); });
        return rv.toString();
    },
    $write: function(value){
        var v = ($.isString(value)) ? value.split(",") : value,
            vlist = $.list(v);
        this._radios.each(function(r){ r.checked = vlist.contains(r.value); });
    },
    $clear: function(){
        this._radios.each(function(r){ r.checked = false; });
    },
    add: function(dom){
        this._radios.add(dom);
        return this;
    },
    listNodes: function(){ return this._radios; } 
}
$.ext(radioset, abstractField);
$.radioset = function(){ return new radioset(); }
$.radioset.Class = radioset;

function select(dom){
    select.base.call(this, dom);
    this._opts = function(){ return $.list(this.dom().options); }
    if(this.dom().multiple) this.multiple();
    else this.single();
}
select.prototype = {
    $read: function(){
        var rv = [];
        this._opts().each(function(opt){ if(opt.selected) rv.push(opt.value); });
        return rv.toString();
    },
    $write: function(value){
        return (this._multiple) ? select_writeMultiple(this, value) : select_writeSingle(this, value);
    },

    multiple: function(){ this._multiple = true; return this; },
    single: function(){ this._multiple = false; return this; },
	addOptgroup: function(){
		this.dom().appendChild(document.createElement('optgroup'));
		return this;
	},
    addOption: function(k, v, index, isOptGroup){
        var dom = this.dom(),
            option = document.createElement('option'),
            idx = index || null,
            opt = ($.exists(idx)) ? dom.options[idx] : null;
        option.text = k;
        option.value = v;
		
		if(isOptGroup) 
			dom.getElementsByTagName("optgroup")[index].appendChild(option)
		else {
			try { dom.add(option, opt); }
			catch(ex) { dom.add(option, idx); }
		}
        return this;
    },
    removeOption: function(index){
      this.dom().remove(index);
      return this;
    }
}
$.ext(select, field);
$.select = function(dom){ return new select(dom); }
$.select.Class = select;

function select_writeSingle(select, value){
    select._opts().each(function(opt){
        opt.selected = (opt.value == value);
    });
    return select;
}
function select_writeMultiple(select, value){
    var v = ($.isString(value)) ? value.split(",") : value,
        vlist = $.list(v);
    select._opts().each(function(opt){
        opt.selected = vlist.contains(opt.value);
    });
    return select;
}

function form(){
    form.base.call(this);
    this._onSubmit = $.observer();
    this._fields = $.hash();
}
form.prototype = {
    $submit: function(){ return; },
    name: function(name){ return this.property("name", name); },
    fields: function(){ return this._fields; },
    listFields: function(){ return this._fields.listValues(); },
    findField: function(name){ return this._fields.findValue(name); },
    isEmpty: function(){
        var v = true;
        this._fields.listValues().each(function(f){ if(!f.isEmpty()) v = false; });
        return v;
    },
    isValid: function(){
        var v = true;
        this._fields.listValues().each(function(f){ if(!f.isValid()) v = false; });
        return v;
    },
    submit: function(){
        var values = this.read();
        this._onSubmit.notify(this);
        this.$submit(values);
    },
    onSubmit: function(f, s, id){ this._onSubmit.add(f, s, id); return this; },
    add: function(n, f){ this._fields.add(n, f); return this; },
    remove: function(n){ this._fields.remove(n); return this; },
    clear: function(){
        this._fields.each(function(f){ f.value.clear(); });
        return this;
    },
    read: function(){
        var dto = $.dto();
        this._fields.each(function(o){
            var k = o.key, v = o.value;
            if($.exists(v.read)) dto.merge(v.read());
            if($.exists(v.value)) dto.add(k, v.value());
        });
        return dto;
    },
    write: function(dto){
        if(!$.exists(dto)) return this;
        this._fields.each(function(o) {
            var field = o.value;
            if($.exists(field.write)) field.write(dto);
            if($.exists(field.value)) field.value(dto.find(o.key));
        });
        return this;
    },
    saveAs: function(name){
        this.read().saveAs(name);
        this._name = name;
        return this;
    },
    save: function(){
        var name = this._name || $.uid("form");
        this.saveAs(name);
        return name;
    },
    erase: function(){
        var name = this._name;
        if($.exists(name)) $.dto.serialize(name).erase();
        return this;
    },
    load: function(name){
        if($.isString(name)) this._name = name;
        var n = this._name;
        return ($.exists(n)) ? this.write($.dto.serialize(n)) : this;
    }
}
$.ext(form, $.Class);
$.form = function() { return new form(); }
$.form.Class = form;

$.fields = {
    specs: (function(){
        var value = {};
        try {
            value.required = $.spec(function(v){ return (!$.isNullOrEmpty(v)) && /^.+$/.test(v); }),
            value.optional = $.spec(function(v){ return $.isNullOrEmpty(v); }),
            
            value.currency = $.spec(function(v){ return /^[\w\$]?(\d+|(\d{1,3}(,\d{3})*))(\.\d{2})?$/.test(v); });
            value.date = $.spec(function(v){ return /^\d{1,2}\/\d{1,2}\/(\d{2}|\d{4})$/.test(v); });
            value.alpha = $.spec(function(v){ return /^[A-Za-z]+$/.test(v); });
            value.numeric = $.spec(function(v){ return /^\d+$/.test(v); });
            value.alphaNumeric = $.spec(function(v){ return /^[A-Za-z\d]+$/.test(v); });
            value.phone = $.spec(function(v){ return /^\d{10,11}|(((1\s)?\(\d{3}\)\s?)|((1\-)?\d{3}\-))\d{3}\-\d{4}$/.test(v); });
            value.ssn = $.spec(function(v){ return /^(\d{9}|(\d{3}\-\d{2}\-\d{4}))$/.test(v); });
            value.email = $.spec(function(v){ return /^\w+(\.\w+)?@\w+(\.\w+)?\.[A-Za-z0-9]{2,}$/.test(v); });
        }
        catch(e) { }
        finally { return value; }
    })()
};

$.ku.localization = {
    en:{
        day:{
            name:{
                0:"Sunday",
                1:"Monday",
                2:"Tuesday",
                3:"Wednesday",
                4:"Thursday",
                5:"Friday",
                6:"Saturday"
            },
            abbr:{
                0:"Sun",
                1:"Mon",
                2:"Tue",
                3:"Wed",
                4:"Thu",
                5:"Fri",
                6:"Sat"
            }
        },
        month:{
            name:{
                1:"January",
                2:"February",
                3:"March",
                4:"April",
                5:"May",
                6:"June",
                7:"July",
                8:"August",
                9:"September",
                10:"October",
                11:"November",
                12:"December"
            },
            abbr:{
                1:"Jan",
                2:"Feb",
                3:"Mar",
                4:"Apr",
                5:"May",
                6:"Jun",
                7:"Jul",
                8:"Aug",
                9:"Sep",
                10:"Oct",
                11:"Nov",
                12:"Dec"
            }
        }
    },
    sp:{
        day:{
            name:{
                0:"domingo",
                1:"lunes",
                2:"martes",
                3:"mi&#0233;rcoles",
                4:"jueves",
                5:"viernes",
                6:"sábado"
            },
            abbr:{
                0:"dom",
                1:"lun",
                2:"mar",
                3:"mi&#0233;",
                4:"jue",
                5:"vie",
                6:"s&#0225;b"
            }
        },
        month:{
            name:{
                1:"enero",
                2:"febrero",
                3:"marzo",
                4:"abril",
                5:"mayo",
                6:"junio",
                7:"julio",
                8:"agosto",
                9:"septiembre",
                10:"octubre",
                11:"noviembre",
                12:"diciembre"
            },
            abbr:{
                1:"ene",
                2:"feb",
                3:"mar",
                4:"abr",
                5:"may",
                6:"jun",
                7:"jul",
                8:"ago",
                9:"sep",
                10:"oct",
                11:"nov",
                12:"dic"
            }
        }
    }
}

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

})($);
