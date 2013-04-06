(function($){
if(!$) $ = {};
kodmunki = {};
var _fps = 30,
    _liveEvents = {},
    _funcs = [],
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
    },
    field = {} 
$.Class = function(){ }
$.Class.prototype = {
    get: function(p){ return this["_"+p]; },
    set: function(p, v){ this["_"+p] = v; return this; },
    property: function(p, v){
        return ($.isUndefined(v))
            ? this.get(p)
            : this.set(p, v);
    }
} 
function profiler(){ }
profiler.prototype = {
    profile: function(func, args){
        var f = func, i = 1000, s = (new Date()).getTime();
        while(i--) func.apply(func, args);
        return ((new Date()).getTime() - s) / 1000;
    }
}
$.profiler = function(){ return new profiler(); } 
$.isArray = function(x) { return x instanceof Array; }
$.isBool = function(x) { return (/boolean/i.test(typeof (x))); }
$.isDate = function(x) { return x instanceof Date; }
$.isEm = function(x) { return (/\d+em/i.test(x)); }
$.isEvent = function(x) { try { return x instanceof Event; } catch(e){ return x === window.event; }}
$.isNumber = function(x) { return (/number/i.test(typeof (x))) && !isNaN(x); }
$.isObject = function(x) { return $.exists(x) && (/object/i.test(typeof (x))); }
$.isFunction = function(x) { return (x instanceof Function); }
$.isPercent = function(x) { return (/\d+%/.test(x)); }
$.isPixel = function(x) { return (/\d+px/.test(x)); }
$.isString = function(x) { return (/string/i.test(typeof (x))) || x instanceof String; }
$.isZero = function(n) { return n === 0; }
$.isEven = function(n) { return ($.isNullOrEmpty(n) || $.isDate(n)) ? false : (isNaN(n) ? false : ($.isZero(n) ? false : n % 2 === 0)); }
$.isOdd = function(n) { return ($.isNullOrEmpty(n) || $.isDate(n)) ? false : (isNaN(n) ? false : ($.isZero(n) ? false : !$.isEven(n))); }
$.isNull = function(x) { return x === null; }
$.isUndefined = function(x) { return (/undefined/i.test(typeof (x))); }
$.isEmpty = function(s) { return $.isString(s) && $.isZero(s.split(/\B/).length); }
$.isNullOrEmpty = function(s) { return !$.exists(s) || $.isEmpty(s); }
$.exists = function(x) { return (x !== null) && (!$.isUndefined(x)); }
$.xor = function(a, b) { return !a != !b; }
$.isDecendentOf = function(dom, test){
    var d = $.ele(dom),
        a = $.ele(test);
    if((!d || !a) || (d == a)) return false;
    do { if(d == a) return true; }
    while(d = d.parentNode);
    return false;
} 
$.math = {
    round: function(n, d){
        var p = d || 0,
            m = Math.pow(10, -p);
        return Math.round(parseFloat((n * m).toFixed(Math.abs(p)))) / m;
    },
    roundUp: function(n, d){
        var p = d || 0,
            r = 5 * (Math.pow(10, p - 1));
        return $.math.round(n + r, d);
    },
    roundDown: function(n, d){
        var p = d || 0,
            r = 5 * (Math.pow(10, p - 1));        
        return $.math.round(n - r, d);
    },
    factorial: function(n){
        var v = n, i = n;
        while(i--) if(!!i) v *= i;
        return v;
    },
    divide: function(a, b){
        var isValid = $.isNumber(a) && $.isNumber(b) && !$.isZero(b); 
        if(!isValid)
            throw new Error($.str.format("Invalid division. value: {0}/{1} | type: {2}/{3}",
                                         a, b, typeof a, typeof b));
        return a / b;
    }
} 
$.obj = {
    keys: function(o) {
        var r = [];
        for (var n in o) r[r.length] = n;
        return r;
    },
    values: function(o) {
        var r = [];
        for (var n in o) r[r.length] = o[n];
        return r;
    },
    count: function(o){
        var c = 0;
        for(var n in o) c++;
        return c;
    },
    hasProp: function(obj, prop){
        return ($.exists(obj.hasOwnProperty))
            ? obj.hasOwnProperty(prop)
            : false;
    },
    merge:function(obj1, obj2){
        var mergee = $.replicate(obj2);
        for (var n in obj1) mergee[n] = obj1[n];
        return mergee;
    },
    meld:function(obj1, obj2){
        var meldee = $.replicate(obj2);
        for (var n in obj1) {
            if($.exists(meldee[n])) continue;
            meldee[n] = obj1[n];
        }
        return meldee;
    }
} 
$.replicate = function(value) {
    var result = ($.isDate(value))
        ? new Date(value)
        : ($.isArray(value))
            ? []
            : ($.isObject(value))
                ? {} : value;
                
    for (var n in value) {
        var v = value[n];
        result[n] = (($.isArray(v)) ||
                     ($.isObject(v)))
                        ? $.replicate(v) : v;
    }
    return result;
} 
$.str = {
	build: function() { return "".concat.apply(new String(), arguments); },
	format: function() {
		var a = arguments, s = a[0], l = a.length;
		for (var i = 1; i < l; i++) {
			var A = a[i],
				S = ($.isNull(A)) ? "null" : ($.isUndefined(A)) ? "undefined" : A.toString(),
				s = s.replace(RegExp("\\{" + (i - 1) + "\\}", "g"), S);
		}
		return s;
	},
	trim: function(s) {
		return $.str.trimStart($.str.trimEnd(s));
	},
	trimStart: function(s) {
		if(!$.isString(s)) throw new Error("Cannot trim non-string values");
		return ($.exists(s.replace))
			? s.replace(/^\s*\b/, "") : s;
	},
	trimEnd: function(s) {
		if(!$.isString(s)) throw new Error("Cannot trim non-string values");
		return ($.exists(s.replace))
			? s.replace(/\b\s*$/, "") : s;
	}
} 
$.uid = function(str) {
	var s = str || "kuid", u = Math.random().toString().replace(/\b\.\b/, "");
	return $.str.format("{0}{1}", s, u);
} 
$.ext = function(sub, sup) {
    if(!sub || !sup) return null;
    var proto = function() { }
    proto.prototype = sup.prototype;
    sub.base = sup;
    sub.prototype = $.obj.merge(sub.prototype, new proto());
    sub.prototype.constructor = sub;
    return sub;
} 
function lock(isLocked) {
    lock.base.call(this);
    this._isLocked = isLocked || false;
}
lock.prototype = {
    isLocked: function(){ return this.get("isLocked"); },
    lock: function() { this._isLocked = true; },
    unlock: function() { this._isLocked = false; }
}
$.ext(lock, $.Class);
$.lock = function(isLocked){return new lock(isLocked);}
$.lock.Class = lock; 
$.kulog = function(){
    try { console.log.apply(console, arguments); }
    catch(e){ alert(Array.prototype.slice.call(arguments).join("\n")); }
}

$.refcheck = function(member, message){
    if(!$.exists(member)) throw $.exception("null", message);
    return member;
}

$.exception = function(type, message){
    var types = {
            "generic" : {
                type: "GENERIC EXCEPTION",
                message: "Generic exeption. Use $.exeption(\"[null|arg]\") for more detail."
            },
            "operation" : {
                type: "OPERATION EXCEPTION",
                message: "Invalid operation."
            },
            "null" : {
                type: "REFERENCE EXCEPTION",
                message: "Invalid reference to type null or undefined."
            },
            "arg" : {
                type: "ARGUMENT EXCEPTION",
                message: "Invalid argument"
            }
        },
        caller = arguments.callee.caller,
        ku4jTrace = "",
        browserTrace = "",
        typ = ($.exists(types[type])) ? types[type] : types.generic,
        msg = ($.exists(message)) ? " - " + message : "";
        
        (function(){
            try{ generate.exeception; }
            catch(e){
                browserTrace = ($.exists(e.stack)) ? e.stack.replace(/generate is.+/, ""): "[Unavailable]";
                var i = 0;
                while(caller && (i < 10)){
                    var method = caller.toString().replace(/[\n\t\r\s]+/g, " ").substring(0, 100),
                        m = method
                            .replace(/\W/g, "a")
                            .replace(/\s/g, "")
                            .replace(/.*base\.js:216/, "")
                            .split(/\B/)
                            .length > 99
                                ? method + "..."
                                : method;
                    ku4jTrace += $.str.format("<kuidx[{0}]>:{1}\n", i, m);
                    caller = caller.caller;
                    i++;
                }
            }
        })();
    return new exception(typ.type, typ.message + msg, browserTrace, ku4jTrace);
}

var exception = function(type, info, browserTrace, ku4jTrace){
    this._type = type;
    this._info = info || "";
    this._browserTrace = browserTrace;
    this._ku4jTrace = ku4jTrace;
}
exception.prototype = {
    message: "",
    type: function(){ return this._type; },
    info: function(){ return this._info; },
    browserTrace: function(){ return this._browserTrace; },
    ku4jTrace: function(){ return this._ku4jTrace; },
    toString: function(){
        var format = "EXCEPTION: {0}: {1}\n\nBowser stack trace:\n{2}\n\nku4j stack:\n{3}";
        return $.str.format(format, this._type, this._info, this._browserTrace, this._ku4jTrace);
    },
    toObject: function(){
        return {
            type: this._type,
            message: this._info,
            browserTrace: this._browserTrace,
            ku4jTrace: this._ku4jTrace
        }
    }
}

/*
//IE
LOG: message 
LOG: description 
LOG: number 
LOG: name 
 
//firefox
fileName
lineNumber
 
//Safari
message
line
sourceId
expressionBeginOffset
expressionCaretOffset
expressionEndOffset
name
*/ 
function hash(obj) {
    hash.base.call(this);
    var o = (!$.exists(obj) || !obj.toObject) ? obj : obj.toObject();
    this.$h = ($.exists(o)) ? o : {};
    this._count = 0;
    for (var n in this.$h) { this._count++; }
}

hash.prototype = {
    count: function(){ return this.get("count"); },
    add: function(k, v) {
        if (!$.exists(k) || this.containsKey(k)) return this;
        this.$h[k] = v;
        this._count++;
        return this;
    },
    clear: function() {
        var h = this.$h;
        for (var n in h) delete h[n];
        this._count = 0;
        return this;
    },
    find: function(k) {
        if (!$.exists(k)) return null;
        return this.$h[k];
    },
    findKey: function(v){
        if (!$.exists(v)) return null;
        var h = this.$h;
        for (var n in h) if(h[n] == v) return n;
        return null;
    },
    findValue: function(k) { return this.find(k) },
    quit: function(){ this._iterator.quit(); return this;},
    each: function(f, s) {
        var scp = s || this;
        this._iterator = $.iterator(this.toObject());
        this._iterator.each(f, scp);
        return this;
    },
    isEmpty: function() { return this._count < 1; },
    listKeys: function() {
        return new $.list($.obj.keys(this.$h));
    },
    listValues: function() {
        return new $.list($.obj.values(this.$h));
    },
    containsKey: function(k) {
        if (!$.exists(k)) return false;
        return $.exists(this.$h[k]);
    },
    containsValue: function(v) {
        var a = $.obj.values(this.$h), i = a.length;
        while(i--) { if(a[i] == v) return true; }
        return false;
    },
    merge: function(obj){
        return hash_combine(this, obj, "merge");
    },
    meld: function(obj){
        return hash_combine(this, obj, "meld");
    },
    remove: function(k) {
        var h = this.$h;
        if (!$.exists(k) || !$.exists(h[k])) return this;
        delete h[k]; 
        this._count--;
        return this;
    },
    replicate: function(){
        return $.hash($.replicate(this.$h));
    },
    toObject: function() { return this.$h; },
    update: function(k, v) {
        if(!$.exists(k)) return this;
        if(!this.containsKey(k)) this._count++;
        this.$h[k] = v;
        return this;
    }
}
$.ext(hash, $.Class);

function hash_combine(hash, obj, m) {
    var o = (!obj.toObject) ? obj : obj.toObject();
    hash.$h = $.obj[m](o, hash.$h);
    hash._count = $.obj.count(hash.$h);
    return hash;
}

$.hash = function(obj){ return new hash(obj); }
$.hash.Class = hash; 
function list(a) {
    list.base.call(this);
    this._keys = [];
    this._hash = $.hash();
    this._count = this._keys.length;
    
    if(!$.exists(a)) return;
    var i = 0, l = a.length;
    while(i < l) { this.add(a[i]); i++; }
}
list.prototype = {
    count: function(){ return this.get("count"); },
    add: function(item) {
        var k = this._keys, id = $.uid(); 
        k[k.length] = id;
        
        this._hash.add(id, item); 
        this._count = this._keys.length;
        return this;
    },
    clear: function() {
        this._hash.clear();
        this._keys = [];
        this._count = this._keys.length;
        return this;
    },
    contains: function(item) { return this._hash.containsValue(item); },
    find: function(index) {
        var k = this._keys;
        return ($.exists(k[index])) ? this._hash.find(k[index]) : null;
    },
    quit: function(){ this._iterator.quit(); return this;},
    each: function(f, s) {
        var scp = s || this;
        this._iterator = $.iterator(this.toArray());
        this._iterator.each(f, scp);
        return this;
    },
    isEmpty: function() { return this._count < 1; },
    remove: function(item) {
        var h = this._hash;
        if (!this.contains(item)) return this;
        
        var k = h.findKey(item);
        this._keys.splice(k, 1);
        h.remove(k);
        this._count = h.count();
        return this;
    },
    toArray: function() {
        var value = [];
        this._hash.each(function(kv){ value.push(kv.value); });
        return value;
    } 
}
$.ext(list, $.Class);

$.list = function(a){ return new list(a); }
$.list.Class = list;

$.list.parseArguments = function(a){
    return new list(Array.prototype.slice.call(a));
} 
$.abstractContext = function(state) {
    $.abstractContext.base.call(this);
    this.state(state);
}
$.abstractContext.prototype = {
    state: function(state) {
        if(!$.exists(state)) return this._state;
        return this.set("state", state.context(this));
    }
}
$.ext($.abstractContext, $.Class); 
$.abstractState = function(states) {
    $.abstractState.base.call(this);
    this.states(states);
}
$.abstractState.prototype = {
    context: function(context) { return this.property("context", context); },
    states: function(states) { return this.set("states", states); },
    state: function(state) {
        var c = this._context;
        c.state(new this._states[state](c));
        return this;
    }
}
$.ext($.abstractState, $.Class); 
$.abstractVisitor = function() { }
$.abstractVisitor.prototype = {
    $visit: function(){ throw new Error("visit method is abstract an must be defined."); },
    subject: function(subject) { return this.property("subject", $.replicate(subject)); },
    visit: function() { return this.$visit(); }
} 
function iterator(subject) {
    iterator.base.call(this);
    this.$current = 0;
    this._quit = false; 
    this.subject(subject);
}
iterator.prototype = {
    $hasNext: function() { return $.exists(this._subject[this.$current + 1]); },
    $hasPrev: function() { return $.exists(this._subject[this.$current - 1]); },
    $each: function(func, scp) {
        var s = scp || this; this.reset();
        do { func.call(s, this.current()); }
        while (this.next() && (!this._quit));
        this._end = false;
        this.reset();
    },
    $exec: function(n) {
        var s = this._subject, o = s[n];
        if (!$.exists(o)) return null;
        this.$current = n;
        return o;
    },
    subject: function(subject) {
        var subj =
             ($.isArray(subject)) ? subject
            :($.isObject(subject)) ? iterator_createKvArray(subject)
            : subject;
        
        if(!$.isUndefined(subject)) this.reset();
        this.$subject = subj;
        return this.property("subject", subj);
    },
    current: function() { return this.$exec(this.$current); },
    next: function() { return this.$exec(this.$current + 1); },
    prev: function() { return this.$exec(this.$current - 1); },
    hasNext: function() { return this.$hasNext(); },
    hasPrev: function() { return this.$hasPrev(); },
    reset: function() { this.$current = 0; return this;},
    
    quit: function(){ return this.set("quit", true); },
    each: function(func, scp) {
        if (this._subject.length < 1) return this;
        this.$each(func, scp);
        return this;
    }
}
function iterator_createKvArray (obj) {
    var array = [];
    for(var n in obj) array.push({"key":n, "value":obj[n]});
    return array;
}
$.ext(iterator, $.Class);
$.iterator = function(subject){ return new iterator(subject); }
$.iterator.Class = iterator; 
function observer() {
    observer.base.call(this);
    this._methods = new $.hash();
}
observer.prototype = { 
    add: function(method, scope, id) {
        var mid = id || $.uid("observerMethod"), scp = scope || this;
        this._methods.add(mid, { m: method, s: scp });
        return this;
    },
    remove: function(id) {
        this._methods.remove(id);
        return this;
    },
    clear: function(){
        this._methods.clear();
        return this;
    },
    notify: function() {
        var it = new $.iterator(this._methods.listValues().toArray()), a = arguments;
        it.each(function(c) { $.refcheck(c.m).apply(c.s, a); });
        return this;
    },
    isEmpty: function(){ return this._methods.isEmpty(); }
}
$.ext(observer, $.Class);
$.observer = function() { return new observer(); }
$.observer.Class = observer 
function rolodex(subj) {
    rolodex.base.call(this, subj);
}
rolodex.prototype = {
    $hasNext: function() {
	var s = this.$subject,
	    l = s.length - 1,
	    c = this.$current,
	    n = c + 1,
	    t = (n > l) ? 0 : n;
	return $.exists(s[t]);
    },
    $hasPrev: function() {
        var s = this.$subject,
	    l = s.length - 1,
	    c = this.$current,
	    n = c + 1,
	    t = (n < 0) ? l : n;
	return $.exists(s[t]);
    },
    $each: function(func, scp) {
	var s = scp || this; this.reset();
	do { func.call(scp, this.current()); } 
	    while (this.next() && (this.$current > 0)); this.reset();
    },
    $exec: function(n) {
	var s = this.$subject, l = (s.length - 1);
	this.$current = (n > l) ? 0 : ((n < 0) ? l : n);
	return s[this.$current];
    }
}
$.ext(rolodex, $.iterator.Class);
$.rolodex = function(subj){ return new rolodex(subj); }
$.rolodex.Class = rolodex; 
function sorter(strategy) { this._strategy = strategy; }

sorter.prototype = {
    sort: function(value) { return this.$sort(value, this._strategy); },
    strategy: {
        asc: function(a, b) {
            var v1 = this._findSortValue(a), v2 = this._findSortValue(b);
            if (!isNaN(v1) && !isNaN(v2)) return (v1 - v2);
            return ((v1 > v2) || !isNaN(v2)) ? 1 : ((v1 < v2) || !isNaN(v1)) ? -1 : 0;
        },
        des: function(a, b) {
            var v1 = this._findSortValue(a), v2 = this._findSortValue(b);
            if (!isNaN(v1) && !isNaN(v2)) return (v2 - v1);
            return ((v1 < v2) || !isNaN(v1)) ? 1 : ((v1 > v2) || !isNaN(v2)) ? -1 : 0;
        }
    },
    $sort: function(values, func) {
        var me = this;
        return values.sort(function(a, b) { return func.apply(me, arguments); });
    },
    _findSortValue: function(value) {
        var v = ($.exists(value.getValue))
            ? value.getValue()
            : ($.exists(value.value))
                ? value.value
                : ($.exists(value.nodeName))
                    ? $.getText(value)
                    : value;
                    
        if ($.isString(v)) {
            if (v.indexOf("$") != -1) return $.money.parse(v).value;
            if (/\d{1,2}\/\d{1,2}\/(\d{2}|\d{2,4})/.test(v)) return new Date(v);
            if (/\d{3}-\d{2}-\d{4}/.test(v)) return $.ssn.parse(v);
            if (v.indexOf(".") != -1 && !isNaN(parseFloat(v))) return parseFloat(v);
            if (v.search(/([a-z]|[A-Z])+/) == -1 && !isNaN(parseInt(v))) return parseInt(v);
        }
        return v;
    }
} 
function abstractSpec() { }
abstractSpec.prototype = {
    $isSatisfiedBy: function(v) { return; },
    isSatisfiedBy: function(v) {return this.$isSatisfiedBy(v);},
    and: function(spec) { return new andSpec(this, spec); },
    or: function(spec) { return new orSpec(this, spec); },
    xor: function(spec) { return new xorSpec(this, spec); },
    not: function() { return new notSpec(this); }
}

function andSpec (a, b) {
    andSpec.base.call(this);
    this.$1 = a;
    this.$2 = b;
}
andSpec.prototype.$isSatisfiedBy = function(c) {
    return this.$1.isSatisfiedBy(c) &&
            this.$2.isSatisfiedBy(c);
}
$.ext(andSpec, abstractSpec);

function orSpec(a, b) {
    orSpec.base.call(this);
    this.$1 = a;
    this.$2 = b;
}
orSpec.prototype.$isSatisfiedBy = function(candidate) {
    return this.$1.isSatisfiedBy(candidate) ||
            this.$2.isSatisfiedBy(candidate);
}

$.ext(orSpec, abstractSpec);

function xorSpec(a, b) {
    xorSpec.base.call(this);
    this.$1 = a;
    this.$2 = b;
}
xorSpec.prototype.$isSatisfiedBy = function(candidate) {
    return $.xor(this.$1.isSatisfiedBy(candidate),
                 this.$2.isSatisfiedBy(candidate));
}
$.ext(xorSpec, abstractSpec);

function trueSpec() { s.base.call(this); }
trueSpec.prototype.$isSatisfiedBy = function(candidate) { return true; }
$.ext(trueSpec, abstractSpec);

function falseSpec() { falseSpec.base.call(this); }
falseSpec.prototype.$isSatisfiedBy = function(candidate) { return false; }
$.ext(falseSpec, abstractSpec);

function notSpec(s) {
    notSpec.base.call(this);
    this._s = s;
}
notSpec.prototype.$isSatisfiedBy = function(candidate) {
    return !this._s.isSatisfiedBy(candidate);
}
$.ext(notSpec, abstractSpec);



function spec(func){
    spec.base.call(this);
    this.$isSatisfiedBy = func;
}
$.ext(spec, abstractSpec);

$.spec = function(func){
    return new spec(func);
} 
function toggle() {
    toggle.base.call(this);
    this._onActive = $.observer();
    this._onInactive = $.observer();
    this._isActive = false;
}
toggle.prototype = {
    value: function(value){ return this.property("value", value); },
    toggleset: function(toggleset){ return this.property("toggleset", toggleset); },
    isActive: function(isActive) {
        if($.exists(isActive)) {
            if(isActive) this._onActive.notify();
            else this._onInactive.notify();
        }
        return this.property("isActive", isActive);
    },
    toggle: function(){ return this.isActive(!this.isActive());},
    invoke: function() {
        var ts = this._toggleset;
        if ($.exists(ts)) ts.invoke(this);
        else this.toggle();
        return this;
    },
    onActive: function(f, s) { this._onActive.add(f, s); return this;},
    onInactive: function(f, s) { this._onInactive.add(f, s); return this;}
}
$.ext(toggle, $.Class);
$.toggle = function(){ return new toggle(); }
$.toggle.Class = toggle; 
function toggleset() {
    toggleset.base.call(this);
    this._toggles = $.list();
    this._onInvoke = $.observer();
    this.multipleSelect();
}
toggleset.prototype = {
    isEmpty: function(){ return this._toggles.isEmpty(); },
    strategy: function(strategy){
        if($.exists(strategy)) strategy.context(this);
        return this.property("strategy", strategy);
    },
    multipleSelect: function(){ return this.strategy(new toggleset_multipleSelect()); },
    mutuallyExclusive: function(){ return this.strategy(new toggleset_mutuallyExclusive()); },
    invoke: function(toggle) {
        this.strategy().invoke(toggle);
        return this;
    },
    add: function(toggle) {
        this._toggles.add(toggle.toggleset(this));
        return this;
    },
    remove: function(toggle) {
        this._toggles.remove(toggle);;
        return this;
    },
    onInvoke: function(f, s, id) { this._onInvoke.add(f, s, id); return this;},
    each: function(f, s){ this._toggles.each(f, s); return this; }
}
$.ext(toggleset, $.Class);
$.toggleset = function(){ return new toggleset(); }
$.toggleset.Class = toggleset; 
function toggleset_multipleSelect() {
    toggleset_multipleSelect.base.call(this);
    this.value;
}
toggleset_multipleSelect.prototype = {
    context: function(context){ return this.property("context", context); },
    invoke: function(toggle){ toggle.toggle(); }
}
$.ext(toggleset_multipleSelect, $.Class); 
function toggleset_mutuallyExclusive() {
    toggleset_mutuallyExclusive.base.call(this);
    this.value;
}
toggleset_mutuallyExclusive.prototype = {
    context: function(context){ return this.property("context", context); },
    invoke: function(toggle){
        var context = this.context();
        context.each(function(t){
            var b = (t === toggle);
             t.isActive(b);
        });
    }
}
$.ext(toggleset_mutuallyExclusive, $.Class); 
})($);
 
(function($){
if(!$) $ = {};
function color(r, g, b) {
    function value(value){
        var val = parseInt(value);
        if(!($.isNumber(val) && val >= 0 && val <= 255))
            throw $.exception("arg", $.str.format("at $.color({0},{1},{2})", r, g, b));
        return val;
    }
    this._red = value(r);
    this._green = value(g);
    this._blue = value(b);
}

color.prototype = {
    red: function(){ return this._red; },
    green: function(){ return this._green; },
    blue: function(){ return this._blue; },
    add: function(other) {
        function v(n){ return (n > 255) ? 255 : n; }
        var r = v(this.red() + other.red()),
            g = v(this.green() + other.green()),
            b = v(this.blue() + other.blue());
        return $.color(r, g, b);
    },
    subtract: function(other) {
        function v(n){ return Math.abs(n); }
        var r = v(this.red() - other.red()),
            g = v(this.green() - other.green()),
            b = v(this.blue() - other.blue());
        return $.color(r, g, b);
    },
    multiply: function(other) {
        function v(n){ return (n > 255) ? 255 : n; }
        var r = v(this.red() * other.red()),
            g = v(this.green() * other.green()),
            b = v(this.blue() * other.blue());
        return $.color(r, g, b);
    },
    divide: function(other) {
        function v(n){ return isNaN(n) ? 0 : n; }
        var r = v(this.red() / other.red()),
            g = v(this.green() / other.green()),
            b = v(this.blue() / other.blue());
        return $.color(r, g, b);
    },
    and: function(other) {
        function v(n){ return isNaN(n) ? 0 : n; }
        var r = v(this.red() && other.red()),
            g = v(this.green() && other.green()),
            b = v(this.blue() && other.blue());
        return $.color(r, g, b);
    },
    or: function(other) {
        function v(n){ return isNaN(n) ? 0 : n; }
        var r = v(this.red() || other.red()),
            g = v(this.green()|| other.green()),
            b = v(this.blue() || other.blue());
        return $.color(r, g, b);
    },
    mix: function(other){
        function v(c1, c2){
            var c3 =  parseInt(c1 + (Math.abs(c1 - c2) / 2));
            return c3 > 255 ? 255 : c3 < 0 ? 0 : c3;
        }
        return $.color(v(this.red(), other.red()),
                       v(this.green(), other.green()),
                       v(this.blue(), other.blue()));
    },
    equals: function(other) {
        return (this.red() == other.red()) &&
                (this.green() == other.green()) &&
                (this.blue() == other.blue());
    },
    toHex: function(unit){
        function v(v){
            var h = (new Number(v)).toString(16),
                value = /[\dA-F]{2}/i.test(h) ? h : h + h;
            return value;
        }
        var u = unit || "0x";
        return $.str.format("{0}{1}{2}{3}", u, v(this.red()), v(this.green()), v(this.blue()));
    },
    toCSS: function() { return this.toHex("#"); },
    toRGB: function() { return $.str.format("rgb({0},{1},{2})", this.red(), this.green(), this.blue()); },
    toNumber: function() { return parseInt(this.toHex()); }
}
$.ext(color, $.Class);
$.color = function(r, g, b) { return new color(r, g, b); }

$.color.canParse = function(value){
    if($.isString(value) && /\D/.test(value))
        return /^[#(0x)][\dA-F]{6}$/i.test(value) ||
                /^rgb\(\d{1,3}\,\s?\d{1,3}\,\s?\d{1,3}\)$/i.test(value);
    var val = parseInt(value);
    return $.isNumber(val) && val >= 0 && val <= 16777215;
},
$.color.parse = function(v) {
    if(v instanceof color) return v;
    var val = parseInt(v);
    if ($.isNumber(val) && val >= 0 && val <= 16777215) return color_parseNumber(val); 
    if (/^#[\dA-F]{6}$/i.test(v)) return color_parseCss(v);
    if (/^0x[\dA-F]{6}$/i.test(v)) return color_parseEcma(v);
    if (/^rgb/.test(v)) return color_parseRgb(v);
    return null;
}
function color_parseNumber(value) { return color_parseEcma((new Number(value)).toString(16)); }
function color_parseRgb(value) { 
    var v = value.replace(/[rgb\(\)\s]/g, "").split(",");
    return $.color(v[0], v[1], v[2]);
}
function color_parseCss(value) { return color_parseHex(/^#/, value) }
function color_parseEcma(value) { return color_parseHex(/^0x/, value) }
function color_parseHex(regex, value) {
    var val = value.replace(regex, "");
    return color_createFromHex(val.substr(0,2),val.substr(2,2),val.substr(4,2));
}
function color_createFromHex(r, g, b) {
    function v(value){ return $.isNullOrEmpty(value) ? 0 : $.str.format("0x{0}", value); }
    return $.color(parseInt(v(r)),parseInt(v(g)),parseInt(v(b))); 
}
 
function coord(x, y) {
    if (!$.isNumber(x) || !$.isNumber(y))
        throw $.exception("arg", $.str.format("at $.coord({0},{1})", x, y));
        
    coord.base.call(this);
    this.x(x).y(y);
}

coord.prototype = {
    x: function(x){ return this.property("x", x); },
    y: function(y){ return this.property("y", y); },
    abs: function(){
        return $.coord(Math.abs(this._x), Math.abs(this._y));
    },
    add: function(other) {
        var x = this._x + other.x(),
            y = this._y + other.y();
        return $.coord(x,y);
    },
    divide: function(other) {
        var x = this._x / other.x(),
            y = this._y / other.y();
        return $.coord(x, y);
    },
    equals: function(other) {
        return (other instanceof coord) &&
            ((this._x === other.x()) && (this._y === other.y()));
    },
    multiply: function(other) {
        var x = this._x * other.x(),
            y = this._y * other.y();
        return $.coord(x, y);
    },
    subtract: function(other) {
        var x = this._x - other.x(),
            y = this._y - other.y();
        return $.coord(x, y);
    },
    round: function(decimal){
        var d = decimal || 0;
        return $.coord($.math.round(this.x(), d), $.math.round(this.y(), d));
    },
    isAbove: function(other) { return this.y() < other.y(); },
    isBelow: function(other) { return this.y() > other.y(); },
    isLeftOf: function(other) { return this.x() < other.x(); },
    isRightOf: function(other) { return this.x() > other.x(); },
    distanceFrom: function(other) { return new $.vector(this.x() - other.x(), this.y() - other.y()); },
    distanceTo: function(other) { return this.distanceFrom(other).invert(); },
    half: function(){ return this.divide($.coord(2, 2)); },
    value: function() { return { x: this._x, y: this._y }; },
    toEm: function() { return coord_toUnit(this, "em"); },
    toPixel: function() { return coord_toUnit(this, "px"); },
    toString: function() { return $.str.format("({0},{1})", this._x, this._y); }    
}
$.ext(coord, $.Class);

function coord_toUnit(coord, unit) {
    return {
        x: function() { return coord.x() + unit; },
        y: function() { return coord.y() + unit; }
    }
}

$.coord = function(x, y) { return new coord(x, y); }
$.coord.Class = coord;
$.coord.zero = function(){ return $.coord(0,0); }
$.coord.canParse = function(o){
    try{
        if (("left" in o) && ("top" in o))
            return !isNaN(o.left) && !isNaN(o.top);
        if (("width" in o) && ("height" in o))
            return !isNaN(o.width) && !isNaN(o.height);
        return false;
    }
    catch(e) { return false; }
}
$.coord.random = function(seedx, seedy){
    var x = seedx * Math.random(), y = seedy * Math.random(seedy);
    return $.coord(x, y);
}
$.coord.parse = function(o) {
    if (("left" in o) && ("top" in o)) return $.coord(o.left, o.top);
    if (("width" in o) && ("height" in o)) return $.coord(o.width, o.height);
    return null;
}
$.coord.tryParse = function(o){
    return $.coord.canParse(o)
        ? $.coord.parse(o)
        : null;
} 
function dayPoint(year, month, date, hours, minutes, seconds, milliseconds) {
    if ((month < 1) || (month > 12)) throw new $.exception("arg", "Invalid month at $.dayPoint");
    if ((date < 1) || (date > dayPoint_findDaysInMonth(month, year))) throw new $.exception("arg", "Invalid date at $.dayPoint");
    
    this._value = (arguments.length >= 3)
        ? new Date(year, month - 1, date, hours || 0, minutes || 0, seconds || 0, milliseconds || 0)
        : new Date();
        
    var v = this._value;
    function formatTime(t){ return t < 10 ? "0" + t : "" + t; }
    
    this._day = v.getDay();
    this._date = date;
    this._month = month;
    this._year = year;
    this._hour = formatTime(v.getHours());
    this._minute = formatTime(v.getMinutes());
    this._second = formatTime(v.getSeconds());
    this._millisecond = formatTime(v.getMilliseconds());
    
    var d = this._day;
    this._isWeekday = d > 0 && d < 6;
    this._isWeekend = !this._isWeekday;
}

dayPoint.prototype = {
    value: function(){ return this._value; },
    day: function(){ return this._day; },
    date: function(){ return this._date; },
    month: function(){ return this._month; },
    year: function(){ return this._year; },
    hour: function(){ return this._hour; },
    minute: function(){ return this._minute; },
    second: function(){ return this._second; },
    millisecond: function(){ return this._millisecond; },
    isWeekday: function(){ return this._isWeekday; },
    isWeekend: function(){ return this._isWeekend; },
    
    equals: function(other) { return this._value == other.value(); },
    nextDay: function() { return dayPoint_createDay(this, 1, 0, 0); },
    prevDay: function() { return dayPoint_createDay(this, -1, 0, 0); },
    nextMonth: function() { return dayPoint_createDay(this, 0, 1, 0); },
    prevMonth: function() { return dayPoint_createDay(this, 0, -1, 0); },
    nextYear: function() { return dayPoint_createDay(this, 0, 0, 1); },
    prevYear: function() { return dayPoint_createDay(this, 0, 0, -1); },
    add: function(years, days, months) {
        function a(x, n, method) {
            var d = x, c = n;
            while(c--) d = d[method]();
            return d;
        }
        var b = years < 0,
            abs = Math.abs,
            y = abs(years),
            d = abs(days),
            m = abs(months),
            ym = b ? "prevYear" : "nextYear",
            dm = b ? "prevDay" : "nextDay",
            mm = b ? "prevMonth" : "nextMonth";
        return a(a(a(this, y, ym), m, mm), d, dm);
    },
    firstDayOfMonth: function() { return new dayPoint(this._year, this._month, 1); },
    lastDayOfMonth: function() { return new dayPoint(this._year, this._month, dayPoint_findDaysInMonth(this._month, this._year)); },
    isBefore: function(other) { return !(this.isAfter(other) || this.equals(other)); },
    isAfter: function(other) {
        var ty = this._year,
            oy = other.year(),
            tm = this._month,
            om = other.month();
        if (ty > oy) return true;
        if ((ty == oy) && (tm > om)) return true;
        if ((ty == oy) && (tm == om) && (this._date > other.date())) return true;
        return false;
    },
    equals: function(other) {
        return (this._year == other.year()) && (this._month == other.month()) && (this._date == other.date());
    },
    toString: function() {
        var y = this._year, m = this._month, d = this._date,
            f = (m < 10 && d < 10) ? "0{1}/0{2}/{0}" : 
                (m < 10) ? "0{1}/{2}/{0}" :
                (d < 10) ? "{1}/0{2}/{0}" : "{1}/{2}/{0}";
        return $.str.format(f, y, m, d);
    },
    toDate: function() { return this.value(); }
}

$.dayPoint = function(year, month, date){
    if(!($.isDate(year) ||
         ($.isNumber(year) &&
          $.isNumber(month) &&
          $.isNumber(date)))) return null;
    return new dayPoint(year, month, date);
}
$.dayPoint.canParse = function(v) {
    return ($.isString(v) ||
            $.isNumber(v) ||
            $.isDate(v))
        ? !isNaN(new Date(v).valueOf())
        : false;
}
$.dayPoint.parse = function(v) {
        if (v instanceof dayPoint) return v;
        if ($.isDate(v)) return $.dayPoint(v.getFullYear(), v.getMonth() + 1, v.getDate());
        else if (this.canParse(v)) {
            var D = new Date(v), y = D.getFullYear(), m = D.getMonth() + 1, d = D.getDate();
            return $.dayPoint(y, m, d);
        }
        return null;
}
$.dayPoint.tryParse = function(v){
    return $.dayPoint.canParse(v)
        ? $.dayPoint.parse(v)
        : null;
}

var dayPoint_assumeNow;

$.dayPoint.assumeNow = function(dayPoint) { dayPoint_assumeNow = $.dayPoint.parse(dayPoint); }
$.dayPoint.today = function() { return dayPoint_assumeNow || $.dayPoint.parse(new Date()); }

dayPoint_findDaysInMonth = function(month, year) {
    var m = month, y = year;
    if (m == 2) return (dayPoint_isLeapYear(y)) ? 29 : 28;
    return (((m < 8) && ($.isEven(m))) || ((m > 7) && ($.isOdd(m)))) ? 30 : 31;
}
dayPoint_isLeapYear = function(year) {
    var y = year.toString().split(/\B/),
        d = parseFloat($.str.build(y[y.length - 2], y[y.length - 1]));
    return (d % 4 == 0);
}
dayPoint_createDay = function(dp, d, m, y) {
    var tm = dp.month(), ty = dp.year(), td = dp.date(), ld = dayPoint_findDaysInMonth(tm, ty),
        dd = d, mm = m, yy = y, date = td + dd, month = tm + mm, year = ty + yy;

    if ((td + dd) > ld) { date = 1; month = (tm + (mm + 1)); }
    if ((td + dd) < 1) { var pm = dp.prevMonth(), date = dayPoint_findDaysInMonth(pm.month(), pm.year()); (month = tm + (mm-1)); }

    if ((month) > 12) { month = 1; year = (ty + (yy + 1)); }
    if ((month) < 1) { month = 12; year = (ty + (yy - 1)); }

    var dim = dayPoint_findDaysInMonth(month, year);
    date = (date > dim) ? dim : date;
    
    return new dayPoint(year, month, date);
} 
function key(code, alt, ctrl, shift) {
    if(!$.isNumber(code)) throw $.exception("arg", $.str.format("Invalid parameter: code {0}", code));
    this._code = code;
    this.alt(alt || false)
        .ctrl(ctrl || false)
        .shift(shift || false);
}
key.prototype = {
    code: function(code){ return this.property("code", code); },
    alt: function(alt){ return this.property("alt", alt); },
    ctrl: function(ctrl){ return this.property("ctrl", ctrl); },
    shift: function(shift){ return this.property("shift", shift); },
    equals: function(other) {
        return this._code == other.code() &&
               this._alt == other.alt() &&
               this._ctrl == other.ctrl() &&
               this._shift == other.shift();
    }
}
$.ext(key, $.Class);
$.key = function(code, alt, ctrl, shift) { return new key(code, alt, ctrl, shift); }
$.key.canParse = function(e) { return $.isNumber(key_getCode(e)); }
$.key.parse = function(e) {
    try { return new key(key_getCode(e), e.altKey, e.ctrlKey, e.shiftKey); }
    catch(e){ throw $.exception("arg"); }
}
$.key.tryParse = function(o){ return $.key.canParse(o) ? $.key.parse(o) : null; }
function key_getCode(e) {
    try { return ($.exists(e.which)) ? e.which : event.keyCode; }
    catch(e) { return null; }
} 
function money(amt, type) {
    if (isNaN(amt)) throw new $.exception("arg", $.str.format("$.money requires a number. Passed {0}", amt));
    var x = amt.toString().split(/\./), d = x[0], c = x[1];
    function cents(c) { return (amt < 0) ? -c : c; }
    
    this._cents = ($.exists(c)) ? cents(parseFloat("." + c)) : 0;
    this._dollars = parseInt(d);
    this._type = type || "$";
    this._value = amt;
}
money.prototype = {
    cents: function(){ return this._cents; },
    dollars: function(){ return this._dollars; },
    type: function(){ return this._type; },
    value: function(){ return this._value; },
    
    add: function(other) {
        money_checkType(this, other);
        return new money(this._value + other.value());
    },
    divide: function(value) {
        if(!$.isNumber(value))
            throw new Error();
        return new money(this._value / value);
    },
    equals: function(other) {
        return (this.isOfType(other)) && (this._value == other.value());
    },
    isOfType: function(other) {
        return this._type == other.type();
    },
    isGreaterThan: function(other) {
        money_checkType(this, other);
        return this._value > other.value();
    },
    isLessThan: function(other) {
        money_checkType(this, other);
        return this._value < other.value();
    },
    multiply: function(value) {
        if(!$.isNumber(value))
            throw new Error();
        return new money(this._value * value);
    },
    round: function() {
        return new money($.math.round(this.value, -2));
    },
    roundDown: function() {
        return new money($.math.roundDown(this.value, -2));
    },
    roundUp: function() {
        return new money($.math.roundUp(this.value, -2));
    },
    subtract: function(other) {
        money_checkType(this, other);
        return new money(this._value - other.value());
    },
    toString: function() {
        var format = (this.value < 0) ? "({0}{1}.{2})" : "{0}{1}.{2}";
        return $.str.format(format, this._type, money_formatDollars(this), money_formatCents(this));
    }
}
$.money = function(number, type){ return new money(number, type); }
$.money.zero = function() { return $.money(0); }
$.money.isMoney = function(o) { return o instanceof money; }
$.money.canParse = function(v){
    try {
        $.money.parse(v);
        return true;
    }
    catch(e){ return false; }
}
$.money.parse = function(str) {
    if($.isNumber(str)) return $.money(str);
    var b = /(\(.*\))|(\-)/.test(str),
        i = (b) ? 1 : 0,
        u = str.match(/[^\d\.\,\-]/g) || [],
        U = $.exists(u[i]) ? u[i] : "$",
        n = parseFloat(str.replace(/[^\d\.]/g, "")),
        v = (b) ? -n : n;
    return $.money(v, U);
}
$.money.tryParse = function(o){
    return $.money.canParse(o)
        ? $.money.parse(o)
        : null;
}

money_checkType = function(money, other) {
    if (!money.isOfType(other)) throw new $.exception("operation","Invalid operation on non-conforming currencies.");
}
money_formatDollars = function(money) {
    var dollars = money.dollars(),
        anount = (money.cents() >= .995) ? (dollars + 1) : dollars,
        s = anount.toString(),
        d = s.replace(/\-/, "").split(/\B/).reverse(),
        l = d.length,
        b = l > 3,
        i = 0,
        a = [];
    while (i < l) {
        a[a.length] = d[i]; i++;
        if (!$.exists(d[i])) break; 
        if ((i % 3 == 0) && b) a[a.length] = ",";
    }
    return $.str.build.apply(this, a.reverse());
}
money_formatCents = function(money) {
    var C = $.math.round(money.cents(), -3),
        s = C.toString(),
        c = s.replace(/\-|(0\.)/g, "").concat("0").split(/\B/), l = c.length;
    if ($.isZero(l) || C >= .995) return "00";
    if (l < 2) return "0" + c[0];
    return (parseInt(c[2]) > 4) ? c[0] + (parseInt(c[1]) + 1) : c[0] + c[1];
} 
function vector(x, y) {
    if (!$.isNumber(x) || !$.isNumber(y))
        throw $.exception("args", $.str.format("at $.vector({0},{1})", x, y));
    
    vector.base.call(this, x, y);
    
    this._lengthSquared = vector_calculateLengthSquared(this, x, y);
    this._length = vector_calculateLength(this, this._lengthSquared);
    this._unitNormalX = vector_calculateUnitNormal(this, x);
    this._unitNormalY = vector_calculateUnitNormal(this, y);
}

vector.prototype = {
    magnatude: function(){ return this.get("length"); },
    equals: function(other) {
        return (other instanceof vector) &&
            ((this._x === other.x()) && (this._y === other.y()));
    },
    normal: function() { return $.vector(this._unitNormalX, this._unitNormalY); },
    invert: function() { return $.vector(this.x() * -1, this.y() * -1); },
    norm: function() { return $.vector(Math.abs(this.x()), Math.abs(this.y())); },
    perpendicular: function(){ return $.vector(this.y() * -1, this.x()); },
    isZero: function() { return this.x() == 0 && this.y() == 0; },
    add: function(vector) { return $.vector(this.x() + vector.x(), this.y() + vector.y()); },
    dot: function(vector) { return (this.x() * vector.x()) + (this.y() * vector.y()); },
    perpendicularAtTo: function(vector) {
        var p = vector.add(this.projectionOfOnto(vector).invert());
        return $.vector(p.x(), p.y());
    },
    projectionOfOnto: function(vector) {
        var p = vector.normal().scale(this.dot(vector.normal()));
        return $.vector(p.x(), p.y());
    },
    scale: function(scalar) {
        return $.vector((this.x() * scalar), (this.y() * scalar));
    },
    unitNormalDot: function(vector) {
        return (this.normal().x() * vector.normal().x()) +
                (this.normal().y() * vector.normal().y());
    },
    reflect: function(incident){
        if(incident.isZero()) return this;
        var inorm = incident.normal()
        return this.add(inorm.scale(2*(inorm.dot(this))).invert());
    },
    round: function(decimal){
        var d = decimal || 0;
        return $.vector($.math.round(this.x(), d), $.math.round(this.y(), d));
    }
}
$.ext(vector, $.coord.Class);

function vector_calculateLength (v, lengthSquared) {
    if (v.isZero()) return 0;
    return Math.sqrt(lengthSquared);
}
function vector_calculateLengthSquared(v, x, y) {
    if (v.isZero()) return 0;
    return Math.pow(x, 2) + Math.pow(y, 2)
}
function vector_calculateUnitNormal (v, scalar) {
   if (v.isZero()) return 0;
   return scalar / v.magnatude();
}

$.vector = function(x, y) { return new vector(x, y); }
$.vector.Class = vector;
$.vector.zero = function() { return $.vector(0,0); }
$.vector.random = function(seedx, seedy){
    var x = seedx * Math.random(), y = seedy * Math.random();
    return $.vector(x, y);
} 
})($);
 
(function($){
if(!$) $ = {};
function cookie() { cookie.base.call(this); }
cookie.prototype = {
	name: function(name) { return this.property("name", name); },
	expires: function(expires) { return this.property("expires", expires); },
	domain: function(domain) { return this.property("domain", domain); },
	path: function(path) { return this.property("path", path); },
	isSecure: function(isSecure) { return this.property("isSecure", isSecure); },
	erase: function() {
		this.expires(new Date("1/1/2000"));
		this.save();
		return this;
	},
	save: function(obj) {
		document.cookie = $.cookie.serialize(obj,
						     { name: this._name,
						       expires: this._expires,
						       path: this._path,
						       domain: this._domain,
						       isSecure: this._isSecure } );
		return this;
	}
}
$.ext(cookie, $.Class);

$.cookie = function(params){
	var p = params || {},
	    o = ($.isString(p))
		? cookie_defaultParams.replicate().merge({name:p}).toObject()
		: cookie_defaultParams.replicate().merge(p).toObject();
	return  (new cookie())
			.name(o.name)
			.expires(o.expires)
			.path(o.path)
			.domain(o.domain)
			.isSecure(o.isSecure);
}

$.cookie.erase = function(name){
	$.cookie.load(name).erase();
}

$.cookie.load = function(name){
	var o = ($.isObject(name)) ? name : { name: name };
	    p = cookie_defaultParams.replicate().merge(o).toObject()
	return $.cookie(p);
}

$.cookie.find = function(name){
	var c = document.cookie.split("; "), i = c.length;
	while (i--) {
		var cke = c[i].split("=");
		if (cke[0] === name) return c[i];
	}
	return null;
}

$.cookie.serialize = function(obj, params) {
	var pms = params || {},
		o = cookie_defaultParams.replicate().merge(pms).toObject(),
		n = o.name,
		e = o.expires,
		p = o.path,
		d = o.domain,
		s = o.isSecure,
		I = cookie_buildInfoPair(n, escape($.json.serialize(obj))),
		E = ($.isDate(e)) ? cookie_buildInfoPair("; expires", e.toGMTString()) : "",
		P = (!p) ? "" : cookie_buildInfoPair("; path", escape(p)),
		D = (!d) ? "" : cookie_buildInfoPair("; domain", escape(d)),
		S = (!s) ? "" : "; secure";
		
	return I + E + P + D + S;
}

$.cookie.deserialize = function(cookie) {
    try {
        var ck = (/;/.test(cookie))
            ? cookie.substring(0, cookie.search(";")).split("=")
            : cookie.split("="),
            kv = { key: ck[0], value: ck[1] };
        return $.json.deserialize(unescape(kv.value));
    }
    catch(e){ throw $.exception("arg", $.str.format("Cannot deserialize {0}", cookie)); }
}

var cookie_defaultParams = $.hash({name:$.uid("COOKIE"),
				expires: $.dayPoint.today().nextYear().toDate(),
				path:"/",
				domain:null,
				isSecure:false });
	
var cookie_buildInfoPair = function(k, v) { return k + "=" + v; }; 
function dto(obj, name) {
    dto.base.call(this, obj);
    this._name = name;
}
 
dto.prototype = {
    toJson: function() { return $.json.serialize(this.$h); },
    toQueryString: function() { return $.queryString.serialize(this.$h); },
    saveAs: function(name) {
        if(!name) throw $.exception("arg", "$.dto.saveAs requires a name");
        $.cookie(name).save(this.$h);
        this._name = name;
        return this;
    },
    save: function(){
        var name = $.uid("dto");
        this.saveAs(name);
        return name;
    },
    erase: function(){
        var name = this._name;
        console.log(name)
        if($.exists(name)) $.cookie.erase(name);
        return this;
    },
    replicate: function(){ return $.dto($.replicate(this.$h)); }
}
$.ext(dto, $.hash.Class);

$.dto = function(obj){ return new dto(obj); }
$.dto.parseJson = function(str) { return $.dto($.json.deserialize(str)); }
$.dto.parseQueryString = function(str) { return $.dto($.queryString.deserialize(str)); }
$.dto.serialize = function(name) {
    try { return new dto($.cookie.deserialize($.cookie.find(name)), name) }
    catch(e) { return null; }
} 
$.json = {
	serialize: function(obj) {
		if ($.isNull(obj)) return null;
		if ($.isUndefined(obj)) return undefined;
		if (!$.isArray(obj) && !$.isObject(obj))
			return obj.toString();
		var r = [],
			f = ($.isArray(obj)) ? "[{0}]" : "{{0}}";
		for (var n in obj) {
			var o = obj[n];
			if ($.isFunction(o)) continue;
			 var   v = ($.isNumber(o))
					? o
					: ($.isString(o))
						? '"' + o + '"'
						: $.json.serialize(o); 
			r[r.length] = (($.isObject(obj) && !$.isArray(obj))
				? ("\"" + n + "\"" + ":")
				: "") + v;
		}
		return $.str.format(f, r);
	},
	deserialize: function(str) {
		if ($.isObject(str)) return str;
		if ($.isString(str))
			try { return eval("(" + str + ")"); }
		catch (e) { return str; }
		return undefined;
	}
} 
$.queryString = {
	serialize: function(obj) {
		var r = "",
			e = encodeURIComponent;
		for (var n in obj)
			r += $.str.format("&{0}={1}", e(n), e($.json.serialize(obj[n])));
		return r.replace(/^\&/, "");
	},
	deserialize: function(str) {
		var q = str.replace(/.*\?/, ""), o = {}, kvs = q.split("&");
		if(!/\??\w+=\w+/.test(str)) return null;
		for (var n in kvs) {
			var d = decodeURIComponent, kv = (kvs[n]).split("=");
			o[d(kv[0])] = $.json.deserialize(d(kv[1]));
		}
		return o;
	}
} 
})($);
 
(function($){
if(!$) $ = {};
var keyboard_Map = $.hash({
    1: "MOUSE_LEFT",
    2: "",
    3: "MOUSE_RIGHT",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "BACKSPACE",
    9: "TAB",
    10: "",
    11: "",
    12: "",
    13: "ENTER",
    14: "",
    15: "",
    16: "SHIFT",
    17: "CTRL",
    18: "ALT",
    19: "",
    20: "CAPS",
    21: "",
    22: "",
    23: "",
    24: "",
    25: "",
    26: "",
    27: "ESC",
    28: "",
    29: "",
    30: "",
    31: "",
    32: "SPACE",
    33: "PAGEUP", 
    34: "PAGEDOWN",
    35: "END",
    36: "HOME",
    37: "LEFT",
    38: "UP",
    39: "RIGHT",
    40: "DOWN",
    41: ")",
    42: "*",
    43: "+",
    44: ",",
    45: "-",
    46: ".",
    47: "/",
    48: "0", 
    49: "1", 
    50: "2", 
    51: "3", 
    52: "4", 
    53: "5", 
    54: "6", 
    55: "7", 
    56: "8", 
    57: "9", 
    58: ":",
    59: ";", 
    60: "<",
    61: "=", 
    62: ">",
    63: "?",
    64: "@",
    65: "a", 
    66: "b",
    67: "c",
    68: "d",
    69: "e",
    70: "f",
    71: "g",
    72: "h",
    73: "i",
    74: "j",
    75: "k",
    76: "l",
    77: "m",
    78: "n",
    79: "o",
    80: "p",
    81: "q",
    82: "r",
    83: "s",
    84: "t",
    85: "u",
    86: "v",
    87: "w",
    88: "x",
    89: "y",
    90: "z",
    91: "[",
    92: "\\",
    93: "]",
    94: "^",
    95: "_",
    96: "0", 
    97: "1", 
    98: "2",
    99: "3",
    100: "4",
    101: "5", 
    102: "6",
    103: "7", 
    104: "8", 
    105: "9", 
    106: "*", 
    107: "=", 
    108: "l", 
    109: "-",
    110: "n", 
    111: "o", 
    112: "p",
    113: "F2", 
    114: "F3", 
    115: "F4", 
    116: "F5", 
    117: "F6", 
    118: "F7",
    119: "F8", 
    120: "F9", 
    121: "F10", 
    122: "F11",  
    123: "F12",
    124: "|",
    125: "}",
    126: "~",
    127: "",
    128: "",
    129: "",
    130: "",
    131: "",
    132: "",
    133: "",
    134: "",
    135: "",
    136: "",
    137: "",
    138: "",
    139: "",
    140: "",
    141: "",
    142: "",
    143: "",
    144: "",
    145: "",
    146: "",
    147: "",
    148: "",
    149: "",
    150: "",
    151: "",
    152: "",
    153: "",
    154: "",
    155: "",
    156: "",
    157: "",
    158: "",
    159: "",
    160: "",
    161: "",
    162: "",
    163: "",
    164: "",
    165: "",
    166: "",
    167: "",
    168: "",
    169: "",
    170: "",
    171: "",
    172: "",
    173: "",
    174: "",
    175: "",
    176: "",
    177: "",
    178: "",
    179: "",
    180: "",
    181: "",
    182: "",
    183: "",
    184: "",
    185: "",
    186: "",
    187: "",
    188: ",",
    189: "",
    190: ".",
    191: "/",
    192: "`",
    193: "",
    194: "",
    195: "",
    196: "",
    197: "",
    198: "",
    199: "",
    200: "",
    201: "",
    202: "",
    203: "",
    204: "",
    205: "",
    206: "",
    207: "",
    208: "",
    209: "",
    210: "",
    211: "",
    212: "",
    213: "",
    214: "",
    215: "",
    216: "",
    217: "",
    218: "",
    219: "[", 
    220: "\\", 
    221: "]",
    222: "",
    223: "",
    224: "",
    225: "",
    226: "",
    227: "",
    228: "",
    229: "",
    230: "",
    231: "",
    232: "",
    233: "",
    234: "",
    235: "",
    236: "",
    237: "",
    238: "",
    239: "",
    240: "",
    241: "",
    242: "",
    243: "",
    244: "",
    245: "",
    246: "",
    247: "",
    248: "",
    249: "",
    250: "",
    251: "",
    252: "",
    253: "",
    254: "",
    255: ""
}); 
function keyboard(){
    this._hotKeys = $.hash();
    this._map = $.hash(keyboard_Map);
}
keyboard.prototype = {
    findCode: function(symbol){
        var key = this._map.findKey(symbol),
            code = parseInt(key);
            
        return isNaN(code) ? null : code;
    },
    findKey: function(code) { return this._map.findValue(code); }
}
$.ext(keyboard, $.Class);
var keyboard_instance = new keyboard();
$.keyboard = function(){ return keyboard_instance; } 
function mouse(){ }
mouse.prototype = {
    from: function(e){
        return ($.exists(e.relatedTarget)) ? e.relatedTarget : e.fromElement;
    },
    target: function(e) {
        return (e.srcElement) ? e.srcElement : e.target;
    },
    clientCoord: function(e) {
        if (!$.exists(e.clientX)) return null;
        return new $.coord(e.clientX, e.clientY);
    },
    documentCoord: function(e) {
        if ($.exists(this.pageCoord(e))) return this.pageCoord(e);
        var d = document.documentElement;
        return new $.coord(e.clientX + d.scrollLeft, e.clientY + d.scrollTop);
    },
    pageCoord: function(e) {
        if (!$.exists(e.pageX)) return null;
        return new $.coord(e.pageX, e.pageY);
    },
    screenCoord: function(e) {
        return new $.coord(e.screenX, e.screenY);
    }
}
$.ext(mouse, $.Class);
var mouse_instance = new mouse();
$.mouse = function(){ return mouse_instance; } 
})($);
 
