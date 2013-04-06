(function($){
if(!$) $ = {};
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

$.ext = function(sub, sup) {
    if(!sub || !sup) return null;
    var proto = function() { };
    proto.prototype = sup.prototype;
    sub.base = sup;
    sub.prototype = $.obj.merge(sub.prototype, new proto());
    sub.prototype.constructor = sub;
    return sub;
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
        for (n in o) r[r.length] = n;
        return r;
    },
    values: function(o) {
        var r = [];
        for (n in o) r[r.length] = o[n];
        return r;
    },
    count: function(o){
        var c = 0;
        for(n in o) c++;
        return c;
    },
    hasProp: function(obj, prop){
        return ($.exists(obj.hasOwnProperty))
            ? obj.hasOwnProperty(prop)
            : false;
    },
    merge:function(obj1, obj2){
        var mergee = $.replicate(obj2);
        for (n in obj1) mergee[n] = obj1[n];
        return mergee;
    },
    meld:function(obj1, obj2){
        var meldee = $.replicate(obj2);
        for (n in obj1) {
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
                ? {} : value,
        v;
    for (n in value) {
        v = value[n];
        result[n] = (($.isArray(v)) ||
                     ($.isObject(v)))
                        ? $.replicate(v) : v;
    }
    return result;
}

$.str = {
	build: function() { return "".concat.apply(new String(), arguments); },
	format: function() {
		var a = arguments, s = a[0], l = a.length,  A, S;
		for (i = 1; i < l; i++) {
		    A = a[i];
		    S = ($.isNull(A)) ? "null" : ($.isUndefined(A)) ? "undefined" : A.toString();
			s = s.replace(RegExp("\\{" + (i - 1) + "\\}", "g"), S);
		}
		return s;
	},
	parse: function(){
	    return String.fromCharCode.apply(String, arguments);
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

kodmunki = {};

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

function hash(obj) {
    hash.base.call(this);
    var o = (!$.exists(obj) || !obj.toObject) ? obj : obj.toObject();
    this.$h = ($.exists(o)) ? o : {};
    this._count = 0;
    for (n in this.$h) { this._count++; }
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
        for (n in h) delete h[n];
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
        for (n in h) if(h[n] == v) return n;
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
        var h = this._hash, k;
        if (!this.contains(item)) return this;
        
        k = h.findKey(item);
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
                var i = 0, method, m;
                while(caller && (i < 10)){
                    method = caller.toString().replace(/[\n\t\r\s]+/g, " ").substring(0, 100);
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
        var s = scp || this;
            this.reset();
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
    for(n in obj) array.push({"key":n, "value":obj[n]});
    return array;
}
$.ext(iterator, $.Class);
$.iterator = function(subject){ return new iterator(subject); }
$.iterator.Class = iterator;

function mediator() {
    mediator.base.call(this);
    this._observers = new $.hash();
}
mediator.prototype = {
    subscribe: function(name, method, scope, id) {
        var observers = this._observers;
        if(observers.containsKey(name)) observers.find(name).add(method, scope, id);
        else observers.add(name, $.observer().add(method, scope, id));

        return this;
    },
    unsubscribe: function(name, id) {
        var observers = this._observers;
        if(observers.containsKey(name)) observers.find(name).remove(id);
        return this;
    },
    notify: function() {
        var args = $.list.parseArguments(arguments),
            firstArg = args.find(0),
            isFirstArgData = !this._observers.containsKey(firstArg),
            isFilteredCall = !isFirstArgData || (args.count() > 1),
            data = isFirstArgData ? firstArg : null,
            nameList = args.remove(0);

        return (isFilteredCall)
            ? this._notify(data, nameList)
            : this._notifyAll(data);

        return this;
    },
    clear: function(){
        this._observers
            .each(function(o){ o.value.clear(); })
            .clear();
        return this;
    },
    isEmpty: function(){
        return this._observers.isEmpty();
    },
    _notifyAll: function(data){
        this._observers.listValues().each(function(o){ o.notify(data); });
        return this;
    },
    _notify: function(data, list) {
        var o = this._observers;
        list.each(function(name){
            try { o.find(name).notify(data); }
            catch(e){ return; }
        });
        return this;
    }
}
$.ext(mediator, $.Class);
$.mediator = function() { return new mediator(); }
$.mediator.Class = mediator;

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

function trueSpec() { trueSpec.base.call(this); }
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

function profiler(){ }
profiler.prototype = {
    profile: function(func, args){
        var i = 1000, s = (new Date()).getTime();
        while(i--) func.apply(func, args);
        return ((new Date()).getTime() - s) / 1000;
    }
}
$.profiler = function(){ return new profiler(); }

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
                value = /[\dA-F]{2}/i.test(h) ? h : "0" + h;
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
    add: function(years, months, days) {
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

$.dayPoint = function(year, month, date, hours, minutes, seconds, milliseconds){
    if(!($.isDate(year) ||
         ($.isNumber(year) &&
          $.isNumber(month) &&
          $.isNumber(date)))) return null;
    return new dayPoint(year, month, date, hours, minutes, seconds, milliseconds);
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
        if (!($.isDate(v) || this.canParse(v))) return null;

        var D = new Date(v),
            y = D.getFullYear(),
            m = D.getMonth() + 1,
            d = D.getDate(),
            h = D.getHours(),
            M = D.getMinutes(),
            s = D.getSeconds(),
            ms = D.getMilliseconds();

        return $.dayPoint(y, m, d, h, M, s, ms);
}
$.dayPoint.tryParse = function(v){
    return $.dayPoint.canParse(v)
        ? $.dayPoint.parse(v)
        : null;
}

var dayPoint_assumeNow;

$.dayPoint.assumeNow = function(dayPoint) { dayPoint_assumeNow = $.dayPoint.parse(dayPoint); }
$.dayPoint.today = function() { return dayPoint_assumeNow || $.dayPoint.parse(new Date()); }

function dayPoint_findDaysInMonth(month, year) {
    var m = month, y = year;
    if (m == 2) return (dayPoint_isLeapYear(y)) ? 29 : 28;
    return (((m < 8) && ($.isEven(m))) || ((m > 7) && ($.isOdd(m)))) ? 30 : 31;
}
function dayPoint_isLeapYear(year) {
    var y = year.toString().split(/\B/),
        d = parseFloat($.str.build(y[y.length - 2], y[y.length - 1]));
    return (d % 4 == 0);
}
function dayPoint_createDay(dp, d, m, y) {
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
    },
    toString: function(){ return $.str.parse(this._code); }
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

function rectangle (topLeft, bottomRight){
    rectangle.base.call(this);
    this._topLeft = topLeft;
    this._bottomRight = bottomRight
}
rectangle.prototype = {
    topLeft: function() { return this.get("topLeft"); },
    bottomRight: function() { return this.get("bottomRight"); },
    contains: function(coord) {
        var t = this._topLeft,
            b = this._bottomRight;

        return t.isAbove(coord) &&
                t.isLeftOf(coord) &&
                b.isRightOf(coord) &&
                b.isBelow(coord);
    }
}
$.ext(rectangle, $.Class);
$.rectangle = function(topLeft, bottomRight){ return new rectangle(topLeft, bottomRight); }

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

function dto(obj) {
    dto.base.call(this, obj);
}
dto.prototype = {
    name: function(name){ return this.set("name", name); },
    toJson: function() { return $.json.serialize(this.$h); },
    toQueryString: function() { return $.queryString.serialize(this.$h); },
    saveAs: function(name) {
        if(!name) throw $.exception("arg", "$.dto.saveAs requires a name");
        $.cookie(name).save(this.$h);
        this._name = name;
        return this;
    },
    save: function(){
        var name = this._name || $.uid("dto");
        this.saveAs(name);
        return name;
    },
    erase: function(){
        var name = this._name;
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
    try { return new dto($.cookie.deserialize($.cookie.find(name))).name(name); }
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
    map: function(map){ return this.set("map", map);s },
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
    },
    selection: function(){
        if ($.exists(window.getSelection)) return window.getSelection();
        if ($.exists(document.getSelection)) return document.getSelection();
        if ($.exists(document.selection) &&
            $.exists(document.selection.createRange))
                return document.selection.createRange().text;

        if ($.exists(document.activeElement) &&
            $.exists(document.activeElement.selectionStart)) {

            var start = document.activeElement.selectionStart,
                end = document.activeElement.selectionEnd;

            return document.activeElement.value.substring(start, end);
        }
        return null;
    },
    clearSelection: function(){
        var selection = this.selection();
        try{ selection.removeAllRanges(); }
        catch(e){ selection.empty(); }
        return this;
    }
}
$.ext(mouse, $.Class);
var mouse_instance = new mouse();
$.mouse = function(){ return mouse_instance; }

function touch(){ }
touch.prototype = {
    canRead: function(e){ return $.exists(e.touches); },
    from: function(e){
        var t = e.touches[0];
        return ($.exists(t.relatedTarget)) ? t.relatedTarget : t.fromElement;
    },
    target: function(e) {
        var t = e.touches[0];
        return (t.srcElement) ? t.srcElement : t.target;
    },
    clientCoord: function(e) {
        var t = e.touches[0];
        if (!$.exists(t.clientX)) return null;
        return new $.coord(t.clientX, t.clientY);
    },
    documentCoord: function(e) {
        var t = e.touches[0];
        if ($.exists(this.pageCoord(e))) return this.pageCoord(e);
        var d = document.documentElement;
        return new $.coord(t.clientX + d.scrollLeft, t.clientY + d.scrollTop);
    },
    pageCoord: function(e) {
        var t = e.touches[0];
        if (!$.exists(t.pageX)) return null;
        return new $.coord(t.pageX, t.pageY);
    },
    screenCoord: function(e) {
        var t = e.touches[0];
        return new $.coord(t.screenX, t.screenY);
    },
    selection: function(){
        if ($.exists(window.getSelection)) return window.getSelection();
        if ($.exists(document.getSelection)) return document.getSelection();
        if ($.exists(document.selection) &&
            $.exists(document.selection.createRange))
                return document.selection.createRange().text;

        if ($.exists(document.activeElement) &&
            $.exists(document.activeElement.selectionStart)) {

            var start = document.activeElement.selectionStart,
                end = document.activeElement.selectionEnd;

            return document.activeElement.value.substring(start, end);
        }
        return null;
    },
    clearSelection: function(){
        var selection = this.selection();
        try{ selection.removeAllRanges(); }
        catch(e){ selection.empty(); }
        return this;
    }
}
$.ext(touch, $.Class);
var touch_instance = new touch();
$.touch = function(){ return touch_instance; }

})($);
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
(function($){
if(!$) $ = {};
$.ku.equations = {
    cycle: function(p, xa, xm, ya, ym){
        return new $.coord(
            this.sin(p.x, xa, xm),
            this.cos(p.y, ya, ym));
    },
    cos: function(n, a, m){
        return n + Math.cos(a) * m;  
    },
    cosH: function(p, a, m){
        return new $.coord(this.cos(p.x, a, m), p.y);
    },
    cosV: function(p, a, m){
        return new $.coord(p.x, this.cos(p.y, a, m));
    },
    sin: function(n, a, m){
        return n + Math.sin(a) * m;  
    },
    sinH: function(p, a, m){
        return new $.coord(this.sin(p.x, a, m), p.y);
    },
    sinV: function(p, a, m){
        return new $.coord(p.x, this.sin(p.y, a, m));
    }
}   

$.anime = {
    algorithms: {
        ease: { }
    }
}

var easeLinear = function(ease){
    this._ease = ease || .1;
}
easeLinear.prototype = {
    calculate: function(current, end){ return (end - current) * this._ease; }
}
$.anime.algorithms.ease.linear = function(ease){ return new easeLinear(ease); }

var jump = function(){ }
jump.prototype = { calculate: function(current, end){ return end-current; } }
$.anime.algorithms.jump = function(){ return new jump(); }

var spring = function(spring, mu){
    this._spring = spring || .4;
    this._mu = mu || .6;
}
spring.prototype = {
    calculate: function(current, end, velocity){
        var spring = this._spring,
            v = velocity,
            mu = this._mu,
            distance = end - current,
            acceleration = distance * spring;
            
        v += acceleration;
        v *= mu;
        return v;
    }
}
$.anime.algorithms.spring = function(force, mu){
    return new spring(force, mu);
}

function dndDragCoordStrategy(context){
    this._context = context;
}
dndDragCoordStrategy.prototype = {
    findCoord: function(e){
        var context = this._context,
            periph = $.touch().canRead(e) ? $.touch() : $.mouse();

        return periph.documentCoord(e)
            .subtract(context.hitCoord())
            .subtract(context.hitOffset())
            .add(context.hitBoundedOffet());
    }
}

function dndSizeCoordStrategy(context){
    this._context = context;
}
dndSizeCoordStrategy.prototype = {
    findCoord: function(e){
        var context = this._context,
            periph = $.touch().canRead(e) ? $.touch() : $.mouse();
        return context.hitSize()
            .add(periph.documentCoord(e)
                    .subtract(context.hitCoord())
                    .subtract(context.hitOffset()));
    }
}

function dndScrollCoordStrategy(context){
    this._context = context;
}
dndScrollCoordStrategy.prototype = {
    findCoord: function(e){
        var context = this._context,
            periph = $.touch().canRead(e) ? $.touch() : $.mouse();

        return context.hitCoord()
            .add(context.hitOffset())
            .subtract(periph.documentCoord(e))
            .add(context.hitScrollOffset());
    }
}

var dndState = {};

function dndContext(dom){
    dndContext.base.call(this, dom);
    
    this._mouseEvt = $.uid("dragger");
    this._touchEvt = $.uid("toucher");
    this._documentBody = $.dom(document.body);
    this._onGrab = $.observer();
    this._onDrag = $.observer();
    this._onDrop = $.observer();
    this._constrainX = false;
    this._constrainY = false;
    this._boundX = 0;
    this._boundY = 0;
    this._lastPoint = $.coord.zero();
    this._bearing = $.vector.zero();
    this._document = $.dom(document);

    this.state(new dndState.dropped())
        .dragger()
        .dragOffset($.coord.zero())
        .ontouchstart(this.grab, this, this._touchEvt)
        .onmousedown(this.grab, this, this._mouseEvt);
}
dndContext.prototype = {
    document: function(){ return this._document; },
    hitSize: function(hitSize){ return this.property("hitSize", hitSize); },
    hitCoord: function(hitCoord){ return this.property("hitCoord", hitCoord); },
    hitOffset: function(hitOffset){ return this.property("hitOffset", hitOffset); },
    dragOffset: function(dragOffset){ return this.property("dragOffset", dragOffset); },
    hitScrollOffset: function(hitScrollOffset){ return this.property("hitScrollOffset", hitScrollOffset); },
    hitBoundedOffet: function(hitBoundedOffet){ return this.property("hitBoundedOffet", hitBoundedOffet); },
    actor: function(){ return this.get("actor"); },
    strategy: function(){ return this.get("strategy"); },
    bearing: function(){ return this.get("bearing"); },
    
    bearingUp: function(){ return this.bearing().y() < 0; },
    bearingDown: function(){ return this.bearing().y() > 0; },
    bearingLeft: function(){ return this.bearing().x() < 0; },
    bearingRight: function(){ return this.bearing().x() > 0; },
    
    constrainX: function(){
        if(this._constrainX) return this;
        this._constrainX = true;
        this._boundX = this.boundedOffset().x();
        return this;
    },
    unconstrainX: function(){
        this._constrainX = false;
    },
    constrainY: function(){
        if(this._constrainY) return this;
        this._constrainY = true;
        this._boundY = this.boundedOffset().y();
        return this;
    },
    unconstrainY: function(){
        this._constrainY = false;
    },
    state: function(state) { return this.set("state", state.context(this)); },
    dragCoord: function(e){
        var c = this.strategy().findCoord(e),
            os = this.dragOffset(),
            x = (this._constrainX) ? this._boundX : c.x() + os.x(),
            y = (this._constrainY) ? this._boundY : c.y() + os.y(),
            coord = $.coord(x, y);
        this._bearing = coord.distanceFrom(this._lastPoint);
        this._lastPoint = coord;
        return coord;
    },
    dragger: function(){
        return this.set("actor", $.pinner(this.dom()))
                   .set("strategy", new dndDragCoordStrategy(this))
                   ._setType("dragger");
    },
    sizer: function(){
        return this.set("actor", $.sizer(this.dom()))
                   .set("strategy", new dndSizeCoordStrategy(this))
                   ._setType("sizer");
    },
    scroller: function(){
        return this.set("actor", $.scroller(this.dom()))
                   .set("strategy", new dndScrollCoordStrategy(this))
                   ._setType("scroller");
    },
    grab: function(e){
        this._onGrab.notify(e);
        this._state.grab(e);
        return this;
    },
    drag: function(e){ 
        this._onDrag.notify(e);
        this._state.drag(e);
        return this;
    },
    drop: function(e){ 
        this._onDrop.notify(e);
        this._state.drop(e);
        this._bearing = $.vector.zero();
        return this;
    },
    onGrab: function(f, s, id){ this._onGrab.add(f, s, id); return this; },
    onDrag: function(f, s, id){ this._onDrag.add(f, s, id); return this; },
    onDrop: function(f, s, id){ this._onDrop.add(f, s, id); return this; },
    destroy: function(){
        this._onGrab.clear();
        this._onDrag.clear();
        this._onDrop.clear();
        this.removeEvent(this._mouseEvt).removeEvent(this._touchEvt);
    },
    disableSelect: function(target){
		document.onselectstart = function() { return false; }
        if(!$.exists(window.getSelection)) return this;
		this._mouseDisableId = $.uid("disable");
		this._touchDisableId = $.uid("disable");

		function disable() { window.getSelection().removeAllRanges(); }
        this._documentBody
            .onmousemove(disable, null, this._mouseDisableId)
            .ontouchmove(disable, null, this._touchDisableId);
        return this;
    },
    enableSelect: function(){
        document.onselectstart = null;
		var m = this._mouseDisableId,
		    t = this._touchDisableId,
            d = this._documentBody;
		if($.exists(m)) d.removeEvent(m)
		if($.exists(t)) d.removeEvent(t);
		this._mouseDisableId = null;
		this._touchDisableId = null;

        return this;
    },
    _setType: function(type){
        this._clearType().addClass($.str.format("ku-dragger-{0}", type));
        return this;
    },
    _clearType: function(){
        this.removeClass("ku-dragger-dragger")
            .removeClass("ku-dragger-sizer")
            .removeClass("ku-dragger-scoller");
        return this;
    }
}
$.ext(dndContext, $.dom.Class);

$.dnd = function(dom){ return new dndContext(dom); }

dndState.dropped = function(){
    dndState.dropped.base.call(this, dndState);
}

dndState.dropped.prototype = {
    grab: function(e){
        $.evt.mute(e);
        var context = this.context(),
            periph = $.touch().canRead(e) ? $.touch() : $.mouse(),
            hitCoord = periph.documentCoord(e)
                        .subtract(context.offset());

        context.document()
            .ontouchmove(context.drag, context, $.uid())
            .ontouchend(context.drop, context, $.uid())
            .onmousemove(context.drag, context, $.uid())
            .onmouseup(context.drop, context, $.uid());

        context
            .disableSelect()
            .addClass("ku-dragger-grabbed")
            .hitSize(context.outerDims())
            .hitCoord(hitCoord)
            .hitOffset(context.offset())
            .hitScrollOffset(context.scrollOffset())
            .hitBoundedOffet(context.boundedOffset())
            .actor().to(context.dragCoord(e));

        this.state("grabbed");
    },
    drag: function(){ return; },
    drop: function(){ return; }
}
$.ext(dndState.dropped, $.abstractState);

dndState.grabbed = function(){
    dndState.grabbed.base.call(this, dndState);
}

dndState.grabbed.prototype = {
    grab: function(){ return; },
    drag: function(e){
        $.evt.mute(e);
        var context = this.context();
        context.actor().to(context.dragCoord(e));
        this.context().redraw();
    },
    drop: function(e){
        this.context()
            .enableSelect()
            .removeClass("ku-dragger-grabbed")
            .document().clearEvents();

        this.state("dropped");
    }
}
$.ext(dndState.grabbed, $.abstractState);

function abstractMover(dom) {
    abstractMover.base.call(this, dom);
    this._onEnd = $.observer();
    this.linear();
}

abstractMover.prototype = {
    $to: function(value){ return; }, 
    $moveTo: function(value) { return; },
    $done: function(){ this._onEnd.notify(); return this; },
    algorithm: function(algorithm){ this.$algorithm = algorithm; return this; },
    
    linear: function(f){ return this.algorithm($.anime.algorithms.ease.linear(f)); },
    spring: function(f, m){ this.algorithm($.anime.algorithms.spring(f, m)); },
    
    stop: function(){
        if(!$.exists(this.$tween)) return this;
        this.$tween.stop();
        return this;
    },
    to: function(value) { this.stop().$to(value).$done(); return this; },
    moveTo: function(value) { this.stop().$moveTo(value); return this; },
    onEnd: function(f, s){
        if(!$.exists(f)) return this;
        this._onEnd.add(f, s);
        return this;
    }
}
$.ext(abstractMover, $.dom.Class);

function fader(dom) {
    $.dom(dom).addClass("ku-fader");
    fader.base.call(this, dom);
}
fader.prototype = {
    $to: function(value){
        var d = this.dom(),
            dom = $.dom(d);
        dom.style("opacity", value * .01);
        return this;
    },
    $moveTo: function(value){
        var d = this.dom(),
            dom = $.dom(d),
            start = dom.style("opacity") || 1;
        
        this.$tween = $.tween(function(value){
                dom.style("opacity", value * .01);
            }, start, value, this.$algorithm)
            .onEnd(this.$done, this)
            .start(d);
    }
}
$.ext(fader, abstractMover);
$.fader = function(dom){ return new fader(dom); }

function fitter(dom) {
    $.dom(dom).addClass("ku-fitter");
    fitter.base.call(this, dom);
}
fitter.prototype = {
    $to: function(value){
        var d = this.dom(),
            dom = $.dom(d);
        dom.style("width", value.x() + "px");
        dom.style("height", value.y() + "px");
        return this;
    },
    $moveTo: function(coord) {
        var d = this.dom(),
            dom = $.dom(d),
            start = dom.outerDims();
        
        this.$tween = $.tween(function(value){
                dom.style("width", value.x() + "px");
                dom.style("height", value.y() + "px");
            }, start, fitter_findFitCoord(this, coord), this.$algorithm)
            .onEnd(this.$done, this)
            .start(d);
    }
}
$.ext(fitter, abstractMover);

function fitter_findFitCoord(fitter, coord){
    var fitRatio = coord.y() / coord.x(),
        dom = $.dom(fitter.dom()),
        dims = dom.outerDims(),
        fitterAspect = dims.y() / dims.x(),
        aspectRatio = isNaN(fitterAspect) ? 1 : fitterAspect,
        x = dims.x(),
        y = dims.y();
    
    //I am wider than the location
    if((aspectRatio < fitRatio) ||
       (aspectRatio == fitRatio)) {
            x = coord.x();
            y = coord.x() * fitterAspect;
    }
    //I am taller than the location       
    if(aspectRatio > fitRatio) {
        x = coord.y() / fitterAspect;
        y = coord.y();
    }
    return $.coord(x, y);
}

$.fitter = function(dom){ return new fitter(dom);}

function pinner(dom) {
    $.dom(dom).addClass("ku-pinner");
    pinner.base.call(this, dom);
}
pinner.prototype = {
    $to: function(value){
        var d = this.dom(),
            dom = $.dom(d);
        dom.style("left", value.x() + "px");
        dom.style("top", value.y() + "px");
        return this;
    },
    $moveTo: function(coord) {
        var d = this.dom(),
            dom = $.dom(d),
            offset = dom.offset(),
            p = $.findOffset(d.parentNode),
            parentOffset = ($.coord.canParse(p)) ? $.coord.parse(p) : $.coord.zero(),
            start = offset.subtract(parentOffset);
        
        this.$tween = $.tween(function(value){
                dom.style("left", value.x() + "px");
                dom.style("top", value.y() + "px");
            }, start, coord, this.$algorithm)
            .onEnd(this.$done, this)
            .start(d);
    }
}
$.ext(pinner, abstractMover);
$.pinner = function(dom){ return new pinner(dom); }

function scroller(dom) {
    $.dom(dom).addClass("ku-scoller");
    scroller.base.call(this, dom);
}
scroller.prototype = {
    $to: function(value){
        var d = this.dom(),
            dom = $.dom(d);
        dom.style("scrollLeft", value.x());
        dom.style("scrollTop", value.y());
        return this;
    },
    $moveTo: function(coord) {
        var d = this.dom(),
            dom = $.dom(d),
            offset = dom.scrollOffset(),
            p = $.findOffset(d.parentNode),
            parentOffset = ($.coord.canParse(p)) ? $.coord.parse(p) : $.coord.zero(),
            start = offset.subtract(parentOffset);
        
        this.$tween = $.tween(function(value){
                dom.style("scrollLeft", value.x());
                dom.style("scrollTop", value.y());
            }, start, coord, this.$algorithm)
            .onEnd(this.$done, this)
            .start(d);
    }
}
$.ext(scroller, abstractMover);
$.scroller = function(dom){ return new scroller(dom); }

function sizer(dom) {
    $.dom(dom).addClass("ku-sizer");
    sizer.base.call(this, dom);
}
sizer.prototype = {
    $to: function(value){
        var d = this.dom(),
            dom = $.dom(d);
        dom.style("width", value.x() + "px");
        dom.style("height", value.y() + "px");
        return this;
    },
    $moveTo: function(coord) {
        var d = this.dom(),
            dom = $.dom(d),
            start = dom.outerDims();
        
        this.$tween = $.tween(function(value){
                dom.style("width", value.x() + "px");
                dom.style("height", value.y() + "px");
            }, start, coord, this.$algorithm)
            .onEnd(this.$done, this)
            .start(d);
    }
}
$.ext(sizer, abstractMover);
$.sizer = function(dom, ease, mu){ return new sizer(dom, ease, mu);}

function styler(dom, prop) {
    $.dom(dom).addClass("ku-styler");
    styler.base.call(this, dom);
    this._prop = prop;
}
styler.prototype = {
    $moveTo: function(value) {
        var d = this.dom(),
            dom = $.dom(d),
            p = this._prop,
            val = dom.style(p),
            s = $.ku.style,
            unit = s.getUnit(val) || "",
            start = s.toNumber(val);
        
        this.$tween = $.tween(function(value){
                dom.style(p, value + unit);
            }, start, value, this.$algorithm)
            .onEnd(this.$done, this)
            .start(d);
    }
}
$.ext(styler, abstractMover);
$.styler = function(dom, prop){ return new styler(dom, prop); }

function timeline(fps, state){
    timeline.base.call(this, state);
    this._listeners = $.observer();
    this._ticks = 0;
    this.fps(fps || 30);
}
timeline.prototype = {
    fps: function(fps){
        this._interval = 1000/fps;
        return this.property("fps", fps);
    },
    interval: function(){ return this.get("interval"); },
    listeners: function(){ return this.get("listeners"); },
    ticks: function(){ return this.get("ticks"); },
    start: function(){
        this._state.start();
        return this;
    },
    stop: function(){
        this._state.stop();
        return this;
    },
    add: function(func, scope, id, wait){
        var me = this,
            w = wait || 1,
            _id = id || $.uid("timeline"),
            stall = function() {
                if(!me._ticks % w == 0) return;
                func(); f = func;
            },
            f = (!wait) ? func : stall;
        this._listeners.add(f, scope, _id);
        return this;
    },
    remove: function(id){
        this._listeners.remove(id);
        return this;
    },
    clear: function(){ this._listeners.clear(); return this; },
    tick: function(){ this._ticks++; return this; }
}
$.ext(timeline, $.abstractContext);
$.timeline = function(){ return timeline_instance; }

timeline.started = function(){ timeline.started.base.call(this, timeline); }
timeline.started.prototype = {
    start: function(){ return; },
    stop: function(){
        clearTimeout(ku_timeline);
        ku_timeline = null;
        this.state("stopped");
    }
}
$.ext(timeline.started, $.abstractState)

timeline.stopped = function(){ timeline.stopped.base.call(this, timeline); }
timeline.stopped.prototype = {
    start: function(){
        var c = this.context(),
            i = c.interval(),
            t = function(){
                c.tick().listeners().notify();
                ku_timeline = setTimeout(t, i);
            }; 
        t();
        this.state("started");    
    },
    stop: function(){ return; }
}
$.ext(timeline.stopped, $.abstractState)

var timeline_instance = new timeline(30, new timeline.stopped()).start();

var abstractTween = function(method, start, end, algorithm){
    this.$method = method;
    this.$current = start;
    this.$end = end;
    this.$algorithm = algorithm;
    this.$value = 0;
    this._onEnd = $.observer();
    this._id = $.uid("tween");
}
abstractTween.prototype = {
    $exec: function(){ return; },
    $done: function(){ this._onEnd.notify(); },
    start: function(){
        $.timeline().add(this.$exec, this, this._id);
        return this;
    },
    stop: function(){
        $.timeline().remove(this._id);
        return this;
    },
    onEnd: function(f, s){ this._onEnd.add(f, s); return this; },
    clear: function(){
        this._onEnd.clear();
        return this;
    }
}
$.ext(abstractTween, $.Class);

var coordTween = function(method, start, end, algorithm){
    coordTween.base.call(this, method, start, end, algorithm);
    this.$value = $.coord.zero();
}
coordTween.prototype = {
    $exec: function(){
        var method = this.$method,
            current = this.$current,
            end = this.$end;
        var valueX = this.$algorithm.calculate(current.x(), end.x(), this.$value.x());
        var valueY = this.$algorithm.calculate(current.y(), end.y(), this.$value.y()),
            value = $.coord(valueX, valueY),
            diff = end.abs().subtract(current.abs());
        
        if((Math.abs(valueX) < .1) && (diff.x() < 1) &&
           (Math.abs(valueY) < .1) && (diff.y() < 1)) {
            method(end);
            this.stop()._onEnd.notify();
            return;
        }
        this.$current = current.add(value);
        this.$value = value;
        method(this.$current);
    }
}
$.ext(coordTween, abstractTween);

var numberTween = function(method, start, end, algorithm){
    numberTween.base.call(this, method, start, end, algorithm);
}
numberTween.prototype = {
    $exec: function(){
        var method = this.$method,
            current = this.$current,
            end = this.$end,
            value = this.$algorithm.calculate(current, end, this.$value);

        if((Math.abs(value) < .1) &&
           (Math.abs(end - current) < 1)) {
            method(end);
            this.stop().$done();
            return;
        }
        this.$current = current + value;
        this.$value = value;
        method(this.$current);
    }
}
$.ext(numberTween, abstractTween);

$.tween = function(method, start, end, algorithm){
    return ($.isNumber(start) && $.isNumber(end))
        ? new numberTween(method, start, end, algorithm)
        : new coordTween(method, start, end, algorithm);
}

function cell(dom, cIdx, cKey, rIdx, rKey, value) {
    cell.base.call(this, dom);
    this.id($.uid("jsx-cell"))
        .cIdx(cIdx)
        .cKey(cKey)
        .rIdx(rIdx)
        .rKey(rKey)
        .value(value);
}
cell.prototype = {
    id: function(id){ return this.property("id", id); },
    value: function(value){ return this.property("value", value); },
    cIdx: function(cIdx){
        if($.exists(cIdx)) this.dom().cIdx = cIdx;
        return this.property("cIdx", cIdx);
    },
    rIdx: function(rIdx){
        if($.exists(rIdx)) this.dom().rIdx = rIdx;
        return this.property("rIdx", rIdx);
    },
    cKey: function(cKey){
        if($.exists(cKey)) this.dom().cKey = cKey;
        return this.property("cKey", cKey);
    },
    rKey: function(rKey){
        if($.exists(rKey)) this.dom().rKey = rKey;
        return this.property("rKey", rKey);
    }
}
$.ext(cell, $.dom.Class);
$.cell = function(dom, cIdx, cKey, rIdx, rKey, value){
    return new cell(dom, cIdx, cKey, rIdx, rKey, value);
}
$.cell.Class = cell;

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



function draggableRowDecorator(table) {
    $.cast(this, table);
    
    this._dri = new $.iterator(this.rows.listValues());
    this.helper = $.create({"tr":{"class":"ku-table-dragRow-helper"}});
    $.slider(this.helper, null, null, null, null, null, "dragger", "vertical");
    this._isMoving = false;
    this._hitPoint;
    this._moveDom;
    
    function getPoint(dom) { return $.cast($.coord.parse($.findOffset(this.dom)), $.point);}
    
    this._dri.foreach(function(c){
        $.evt.add(c.dom, "mouseover", function(){
            if(!this._isMoving) return;
            var d = c.dom,
                b = this.body,
                h = this.helper,
                hp = this._hitPoint,
                p = getPoint(d);
            
            if(!d.nextSibling) b.appendChild(h);
            else if(p.isAbove(hp))b.insertBefore(h, d);
            else b.insertBefore(h, d.nextSibling);
            
            this._hitPoint = p;
        }, this);
        
        $.dnd(c.dom,
            function(){
                this.helper = c.dom;
                this._isMoving = true;
                this._hitPoint = getPoint(c.dom);
                this._moveDom = c.dom;
                this.body.insertBefore(this.helper, c.dom);
                $.ku.css.addClass(this.body, "ku-table-draggableRow-dragging");
                $.ku.css.addClass(this._moveDom, "ku-table-draggableRow-moveDom");
            },
            null,
            function(){
                $.ku.css.removeClass(this.body, "ku-table-draggableRow-dragging");
                $.ku.css.removeClass(this._moveDom, "ku-table-draggableRow-moveDom");
                $.ku.swapDom(this.helper, this._moveDom);
                this._isMoving = false;
                this._moveDom = null;
                this.format();
            }, this);
        
    }, this);
}

$.draggableRowDecorator = function(table){ return new draggableRowDecorator(table); }

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

function table_factory(){
    table_factory.base.call(this);
}
table_factory.prototype = {
    table: function(table){ return this.set("table", table);  },
    createColumn: function(index, key, value) {
        var col = $.create({col:{}}),
            dom = $.create({th:{"ku-key":key}, content: $.create({"span":{"class":"ku-table-head-content"}, content:value}) });
        return $.column(dom, col, index, key, value);
    },
    createRow: function(index, key) {
        var dom = $.create({tr:{"class":"ku-table-row"}});
        return $.row(dom, index, key);
    },
    createCell: function(value, cIdx, cKey, rIdx, rKey) {
        var table = this._table,
            dom = $.create({td:{"class":"ku-table-cell"}, content: value}),
            cell = $.cell(dom,cIdx, cKey, rIdx, rKey, value)
                     .onclick(function() { table.selectCell(cell); }, this);
        return cell;
    }
}
$.ext(table_factory, $.Class);

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

function table(factory) {
    var dom = $.create({"table":{"class":"ku-table", "cellspacing":0}});
    table.base.call(this, dom);
    
    var colgroup = $.create({"colgroup":{"class":"ku-table-colgroup"}}),
        caption = $.create({"caption":{"class":"ku-table-caption"}}),
        head = $.create({"thead":{"class":"ku-table-head"}}),
        headRow = $.create({"tr":{"class":"ku-table-head-row"}}),
        body = $.create({"tbody":{"class":"ku-table-body"}}),
        foot = $.create({"tfoot":{"class":"ku-table-foot"}});

    this._columns = new $.hash();
    this._rows = new $.hash();
    this._cells = new $.hash();
    this._onCellSelect = $.observer();
    
    this.appendChild(colgroup).colgroup(colgroup)
        .appendChild(caption).caption(caption)
        .appendChild(head).head(head)
        .appendChild(headRow).headRow(headRow)
        .appendChild(body).body(body)
        .appendChild(foot).foot(foot)
        .factory(factory || new table_factory())
        .head().appendChild(this.headRow());
}

table.prototype = {
    title: function(title){
        if($.isString(title)) this.caption().innerHTML = title;
        else if($.exists(title)) this.caption().appendChild(title);
        return this.property("title", title);
    },
    factory: function(factory){ return this.property("factory", factory.table(this)); },
    caption: function(caption){ return this.property("caption", caption); },
    colgroup: function(colgroup){ return this.property("colgroup", colgroup); },
    head: function(head){ return this.property("head", head); },
    headRow: function(headRow){ return this.property("headRow", headRow); },
    body: function(body){ return this.property("body", body); },
    foot: function(foot){ return this.property("foot", foot); },
    listColumns: function(){ return this._columns.listValues(); },
    listRows: function(){ return this._rows.listValues(); },
    listCells: function(){ return this._cells.listValues(); },
    selectCell: function(cell) { this._onCellSelect.notify(cell); return this; },
    onCellSelect: function(f, s) { this._onCellSelect.add(f, s); return this; },

    addColumn: function(key, obj, value) {
        var columns = this._columns,
            rows = this._rows;

        if(columns.containsKey(key)) return this._updateColumn(key, obj, value);
        else return this._addColumn(key, obj, value);
    },
    _addColumn: function(key, obj, value){
        var column = this._factory.createColumn($.uid(), key, value);
        this._columns.add(column.key(), column);
        this._rows.listValues().each(function(row){
            this.addCell(row, column, obj[row.key()]);
        }, this);
        this._colgroup.appendChild(column.col());
        this._headRow.appendChild(column.dom());
        return this;
    },
    _updateColumn: function(key, obj, value){
        var column = this._columns.find(key);
        this._rows.listValues().each(function(row){
            this.findCell(row.key(), column.key()).value(obj[row.key()]);
        }, this);
        if($.exists(value)) column.value(value);
        return this;
    },
    findColumn: function(key){ return this._columns.find(key); },
    removeColumn: function(key){
        var rows = this._rows,
            column = this.findColumn(key);
        if(!$.exists(column)) return this;
        rows.listValues().each(function(row){
            this.removeCell(column.findCell(row.key()));
        }, this);
        this._columns.remove(column.key());
        return this;
    },
    addRow: function(key, obj) {
        var rows = this._rows,
            columns = this._columns;

        if(rows.containsKey(key)) return this._updateRow(key, obj);
        else return this._addRow(key, obj);
    },
    _addRow: function(key, obj){
        var row = this._factory.createRow($.uid(), key);
        this._rows.add(row.key(), row);
        this._columns.listValues().each(function(column){
            this.addCell(row, column, obj[column.key()])
        }, this);
        this.body().appendChild(row.dom());
        return this;
    },
    _updateRow: function(key, obj){
        var row = this._rows.find(key);
        this._columns.listValues().each(function(column){
            this.findCell(row.key(), column.key()).value(obj[column.key()]);
        }, this);
        return this;
    },
    findRow: function(key){ return this._rows.find(key); },
    removeRow: function(key){
        var columns = this._columns,
            row = this.findRow(key);
        if(!$.exists(row)) return this;
        columns.listValues().each(function(column){
            this.removeCell(row.findCell(column.key()));
        }, this);
        this._rows.remove(row.key());
        return this;
    },
    addCell: function(row, column, value){
        var cell = this._factory.createCell(value, column.index(), column.key(), row.index(), row.key());
        column.addCell(cell);
        row.addCell(cell);
        this._cells.add(cell.id(), cell);
        return this;
    },
    findCellById: function(id){ return this._cells.find(id); },
    findCell: function(rowKey, colKey){
        var cells = this._cells.listValues(), value;
        cells.each(function(cell){
            if((cell.rKey() == rowKey) &&
               (cell.cKey() == colKey)) {
                value = cell;
                cells.quit();
            }
        });
        return value;
    },
    removeCell: function(cell){
        this._cells.remove(cell.id());
        this._columns.find(cell.cKey()).removeCell(cell);
        this._rows.find(cell.rKey()).removeCell(cell);
        return this;
    },
    format: function(){
        var i = 0,
            e = "ku-table-row-even",
            o = "ku-table-row-odd",
            cn = function(){ (i % 2 == 0) ? e : o; };
        this._rows.each(function(row){
            row.removeClass(e)
               .removeClass(o)
               .addClass(cn());
            i++;
        });
    },
    toObject: function(){
        return { "title": this.title(),
                 "columns": this._columns.toObject(),
                 "rows": this._rows.toObject() }
    }
}
$.ext(table, $.dom.Class);
$.table = function(factory){ return new table(factory); }
$.table.Class = table;

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


var calendar = function() {
    calendar.base.call(this, $.create({"div":{"class":"ku-calendar"}}));

    var sheetContainerDom = $.create({"div":{"class":"ku-sheet"}});

    this._sheetContainer = $.dom(sheetContainerDom);
    this._onShowDates = $.observer();
    this._onShowMonths = $.observer();
    this._onShowYears = $.observer();
    this._onSelect = $.observer();
    this._sheet;

    this.dayPoint($.dayPoint.today())
        .localization($.ku.localization["en"])
        .sheetFactory($.clickableSheetFactory())
        .dom().appendChild(sheetContainerDom);
}
calendar.prototype = {
    dayPoint: function(dayPoint){ return this.property("dayPoint", dayPoint); },
    localization: function(localization){ return this.property("localization", localization); },
    sheetFactory: function(sheetFactory){ return this.set("sheetFactory", sheetFactory); },

    isShowingDates: function(){ return this._isShowingDates; },
    isShowingMonths: function(){ return this._isShowingMonths; },
    isShowingYears: function(){ return this._isShowingYears; },

    nextDay: function(){ this.dayPoint(this.dayPoint().nextDay()); return this; },
    prevDay: function(){ this.dayPoint(this.dayPoint().prevDay()); return this; },
    nextMonth: function(){ this.dayPoint(this.dayPoint().nextMonth()); return this; },
    prevMonth: function(){ this.dayPoint(this.dayPoint().prevMonth()); return this; },
    nextYear: function(){ this.dayPoint(this.dayPoint().nextYear()); return this; },
    prevYear: function(){ this.dayPoint(this.dayPoint().prevYear());return this; },

    showDates: function(){ return this._showSheet("createDatesheet")._currentView(false, false, true); },
    showMonths: function(){ return this._showSheet("createMonthsheet")._currentView(false, true, false); },
    showYears: function(){ return this._showSheet("createYearsheet")._currentView(true, false, false); },

    findCell: function(dayPoint) { return this._sheet.findCell(dayPoint); },
    each: function(f, s){ this._sheet.each(f, s); return this;},
    select: function(dayPoint){ this._sheet.select(dayPoint); return this; },
    onSelect: function(f, s) { this._onSelect.add(f, s); return this; },
    onShowDates: function(f, s) { this._onShowDates.add(f, s); return this; },
    onShowMonths: function(f, s) { this._onShowMonths.add(f, s); return this; },
    onShowYears: function(f, s) { this._onShowYears.add(f, s); return this; },
    _currentView: function(years, months, dates){
        this._isShowingYears = years;
        this._isShowingMonths = months;
        this._isShowingDates = dates;

        if(years) this._onShowYears.notify();
        if(months) this._onShowYears.notify();
        if(dates) this._onShowDates.notify();

        return this;
    },
    _showSheet: function(type){
        var currentSheet = this._sheet;
        if($.exists(currentSheet)) currentSheet.destroy();

        var sheet = this._sheetFactory[type](this.dayPoint(), this._localization)
                        .onSelect(this._onSelect.notify, this._onSelect);
        this._sheetContainer.clear().appendChild(sheet.dom());
        this._sheet = sheet;
        return this;
    }
}
$.ext(calendar, $.dom.Class);
$.calendar = function(){ return new calendar(); }

var calendarControlsDecorator = function(calendar) {
    calendarControlsDecorator.base.call(this, $.create({"div":{"class":"ku-calendar-controls"}}));

    this._calendar = calendar;

    var title = $.dom($.create({"div":{"class":"ku-calendar-title"}})),
        month = $.dom($.create({"button":{"class":"ku-calendar-month"}}))
                    .onclick(this.showMonths, this),
        year = $.dom($.create({"button":{"class":"ku-calendar-year"}}))
                    .onclick(this.showYears, this, this),
        prevButton = $.dom($.create({"button":{"class":"ku-calendar-prevButton"}}))
                        .onclick(function(){ this._prevAction(); }, this),
        nextButton = $.dom($.create({"button":{"class":"ku-calendar-nextButton"}}))
                        .onclick(function(){ this._nextAction(); }, this);

    $.dom(this.dom())
        .appendChild(title
                        .appendChild(month.dom())
                        .appendChild(year.dom())
                        .dom())
        .appendChild(prevButton.dom())
        .appendChild(nextButton.dom())
        .appendChild(calendar.dom());

    this._title = title;
    this._month = month;
    this._year = year;
    this._prevButton = prevButton;
    this._nextButton = nextButton;
    this._prevAction;
    this._nextAction;
    this.onSelect(this._displayDates, this);
}
calendarControlsDecorator.prototype = {
    dayPoint: function(dayPoint){
        var calendar = this._calendar;
        if(!$.exists(dayPoint)) return calendar.dayPoint();
        calendar.dayPoint(dayPoint);
        return this;
    },
    localization: function(localization){
        var calendar = this._calendar;
        if(!$.exists(localization)) return calendar.localization();
        calendar.localization(localization);
        return this;
    },
    sheetFactory: function(sheetFactory){
        this._calendar.sheetFactory(sheetFactory);
        return this;
    },
    nextDay: function(){  this._calendar.nextDay(); return this; },
    prevDay: function(){  this._calendar.prevDay(); return this; },
    nextMonth: function(){ this._calendar.nextMonth(); return this; },
    prevMonth: function(){ this._calendar.prevMonth(); return this; },
    nextYear: function(){  this._calendar.nextYear(); return this; },
    prevYear: function(){  this._calendar.prevYear(); return this; },

    showDates: function(){
        var calendar = this._calendar,
            locale = calendar.localization().month.name,
            dayPoint = calendar.dayPoint();
        calendar.showDates();
        this._month.html(locale[dayPoint.month()]);
        this._year.html(dayPoint.year());
        this._prevAction = this._prevMonth;
        this._nextAction = this._nextMonth;
        return this;
    },
    showMonths: function(){
        this._calendar.showMonths();
        var action = function(){ return; }
        this._prevAction = action;
        this._nextAction = action;
        return this;
    },
    showYears: function(){
        this._calendar.showYears();
        this._prevAction = this._prevYears;
        this._nextAction = this._nextYears;
        return this;
    },
    findCell: function(dayPoint){ return this._calendar.findCell(dayPoint); },
    each: function(f, s){ this._calendar.each(f, s); return this; },
    select: function(dayPoint){  this._calendar.select(dayPoint); return this; },
    onSelect: function(f, s) {  this._calendar.onSelect(f, s); return this; },
    onShowDates: function(f, s) {  this._calendar.onShowDates(f, s); return this; },
    onShowMonths: function(f, s) {  this._calendar.onShowMonths(f, s); return this; },
    onShowYears: function(f, s) {  this._calendar.onShowYears(f, s); return this; },
    _prevMonth: function() {
        this.prevMonth().showDates();
    },
    _nextMonth: function() {
        this.nextMonth().showDates();
    },
    _prevYears: function() {
        this.dayPoint(this.dayPoint().add(-12, 0, 0)).showYears();
    },
    _nextYears: function() {
        this.dayPoint(this.dayPoint().add(12, 0, 0)).showYears();
    },
    _displayDates: function(cell){
        var calendar = this._calendar,
            showingDates = calendar.isShowingDates(),
            showingMonths = calendar.isShowingMonths(),
            showingYears = calendar.isShowingYears(),
            dayPoint = calendar.dayPoint(),
            value = cell.value(),
            newValue;

        if(showingYears) newValue = $.dayPoint(value.year(), dayPoint.month(), dayPoint.date());
        if(showingMonths) newValue = $.dayPoint(dayPoint.year(), value.month(), dayPoint.date());
        if(showingDates) newValue = value;
        this.dayPoint(newValue);

        if(showingYears ||
           showingMonths ||
           (dayPoint.month() != value.month())) this.showDates();
    }
}
$.ext(calendarControlsDecorator, $.dom.Class);
$.calendarControlsDecorator = function(calendar){ return new calendarControlsDecorator(calendar); }

function clickableSheetFactory() { }
clickableSheetFactory.prototype = {
    createDatesheet: function(dayPoint, localization) {
        return $.datesheet(dayPoint, localization, $.table($.clickableDateSheetTableFactory(dayPoint, localization)));
    },
    createMonthsheet: function(dayPoint, localization) {
        return $.monthsheet(dayPoint, localization, $.table($.clickableMonthSheetTableFactory(dayPoint, localization)));
    },
    createYearsheet: function(dayPoint, localization) {
        return $.yearsheet(dayPoint, localization, $.table($.clickableYearSheetTableFactory(dayPoint, localization)));
    }
}
$.clickableSheetFactory = function(){ return new clickableSheetFactory(); }

function abstractDatesheetTableFactory(dayPoint, localization){
    abstractDatesheetTableFactory.base.call(this);
    this._dayPoint = dayPoint;
    this._localization = localization;
}
abstractDatesheetTableFactory.prototype = {
    $setCellAction: function(cell) { return cell; },
    table: function(table){
        this.$table = table;
        return this.set("table", table);
    },
    createColumn: function(index, key, value) {
        var index = this._table.listColumns().count(),
            col = $.create({col:{}}),
            dom = $.create({th:{"ku-key":key}, content: $.create({"span":{"class":"ku-table-head-content"}, content:value}) });
        return $.column(dom, col, index, key, value);
    },
    createRow: function(index, key) {
        var index = this._table.listRows().count(),
            cl = (index % 2 == 0)
                ? "ku-table-row ku-table-row-even"
                : "ku-table-row ku-table-row-odd";
            dom = $.create({tr:{"class":cl}});
        return $.row(dom, index, key);
    },
    createCell: function(value, cIdx, cKey, rIdx, rKey) {
        var table = this._table,
            today = $.dayPoint.today(),
            dom = $.create({td:{"class":$.str.format("ku-date-day-{0} ku-date-week-{1}", cIdx, rIdx)},
                           content: $.str.format("<span class='ku-datesheet-cell-date'>{0}</span>", value.date())}),
            cell = $.cell(dom, cIdx, cKey, rIdx, rKey, value)
                        .addClass("ku-sheet-date")
                        .id(value.toString());
        
        if(value.isBefore(today)) cell.addClass("ku-datesheet-past");
        if(value.equals(today)) cell.addClass("ku-datesheet-present");
        if(value.isAfter(today)) cell.addClass("ku-datesheet-future");
        if(value.isWeekday()) cell.addClass("ku-datesheet-weekday");
        if(value.isWeekend()) cell.addClass("ku-datesheet-weekend");
        if((value.month() < this._dayPoint.month()) ||
          ((value.month() == 12) && (this._dayPoint.month() == 1)))
            cell.addClass("ku-datesheet-lastMonth");
        if(value.month() == this._dayPoint.month())
            cell.addClass("ku-datesheet-thisMonth");
        if((value.month() > this._dayPoint.month()) ||
           ((value.month() == 1) && (this._dayPoint.month() == 12)))
            cell.addClass("ku-datesheet-nextMonth");
                    
        return this.$setCellAction(cell);
    }
}
$.ext(abstractDatesheetTableFactory, $.Class);

function abstractMonthsheetTableFactory(dayPoint, localization){
    abstractMonthsheetTableFactory.base.call(this);
    this._dayPoint = dayPoint;
    this._localization = localization;
}
abstractMonthsheetTableFactory.prototype = {
    $setCellAction: function(cell) { return cell; },
    table: function(table){
        this.$table = table;
        return this.set("table", table);
    },
    createColumn: function(index, key, value) {
        var index = this._table.listColumns().count(),
            col = $.create({col:{}}),
            dom = $.create({th:{"ku-key":key}, content: $.create({"span":{"class":"ku-table-head-content"}, content:value}) });
        return $.column(dom, col, index, key, value);
    },
    createRow: function(index, key) {
        var index = this._table.listRows().count(),
            cl = (index % 2 == 0)
                ? "ku-table-row ku-table-row-even"
                : "ku-table-row ku-table-row-odd";
            dom = $.create({tr:{"class":cl}});
        return $.row(dom, index, key);
    },
    createCell: function(value, cIdx, cKey, rIdx, rKey) {
        var dom = $.create({td:{"class":$.str.format("ku-month", cIdx, rIdx)},
                           content: this._localization.month.abbr[value.month()]}),
            cell = $.cell(dom, cIdx, cKey, rIdx, rKey, value)
                        .addClass("ku-sheet-month")
                        .id(value.month().toString());

        return this.$setCellAction(cell);
    }
}
$.ext(abstractMonthsheetTableFactory, $.Class);

function abstractYearsheetTableFactory(dayPoint, localization){
    abstractYearsheetTableFactory.base.call(this);
    this._dayPoint = dayPoint;
    this._localization = localization;
}
abstractYearsheetTableFactory.prototype = {
    $setCellAction: function(cell) { return cell; },
    table: function(table){
        this.$table = table;
        return this.set("table", table);
    },
    createColumn: function(index, key, value) {
        var index = this._table.listColumns().count(),
            col = $.create({col:{}}),
            dom = $.create({th:{"ku-key":key}, content: $.create({"span":{"class":"ku-table-head-content"}, content:value}) });
        return $.column(dom, col, index, key, value);
    },
    createRow: function(index, key) {
        var index = this._table.listRows().count(),
            cl = (index % 2 == 0)
                ? "ku-table-row ku-table-row-even"
                : "ku-table-row ku-table-row-odd";
            dom = $.create({tr:{"class":cl}});
        return $.row(dom, index, key);
    },
    createCell: function(value, cIdx, cKey, rIdx, rKey) {
        var dom = $.create({td:{"class":$.str.format("ku-year", cIdx, rIdx)},
                           content: value.year()}),
            cell = $.cell(dom, cIdx, cKey, rIdx, rKey, value)
                        .addClass("ku-sheet-year")
                        .id(value.year().toString());

        return this.$setCellAction(cell);
    }
}
$.ext(abstractYearsheetTableFactory, $.Class);

function clickableDateSheetTableFactory(dayPoint, localization){
    clickableDateSheetTableFactory.base.call(this, dayPoint, localization);
}
clickableDateSheetTableFactory.prototype = {
    $setCellAction: function(cell) {
        return cell.onclick(function() { this.$table.selectCell(cell); }, this);
    }
}
$.ext(clickableDateSheetTableFactory, abstractDatesheetTableFactory);
$.clickableDateSheetTableFactory = function(dayPoint, localization){
    return new clickableDateSheetTableFactory(dayPoint, localization);
}

function clickableMonthSheetTableFactory(dayPoint, localization){
    clickableMonthSheetTableFactory.base.call(this, dayPoint, localization);
}
clickableMonthSheetTableFactory.prototype = {
    $setCellAction: function(cell) {
        return cell.onclick(function() { this.$table.selectCell(cell); }, this);
    }
}
$.ext(clickableMonthSheetTableFactory, abstractMonthsheetTableFactory);
$.clickableMonthSheetTableFactory = function(dayPoint, localization){
    return new clickableMonthSheetTableFactory(dayPoint, localization);
}

function clickableYearSheetTableFactory(dayPoint, localization){
    clickableYearSheetTableFactory.base.call(this, dayPoint, localization);
}
clickableYearSheetTableFactory.prototype = {
    $setCellAction: function(cell) {
        return cell.onclick(function() { this.$table.selectCell(cell); }, this);
    }
}
$.ext(clickableYearSheetTableFactory, abstractYearsheetTableFactory);
$.clickableYearSheetTableFactory = function(dayPoint, localization){
    return new clickableYearSheetTableFactory(dayPoint, localization);
}

var abstractSheet = function(dom, localization) {
    abstractSheet.base.call(this, dom);

    this.localization(localization);
    this._onSelect = $.observer();
}
abstractSheet.prototype = {
    $findCell: function(dayPoint){ return null; },
    localization: function(localization) {
        return this.property("localization", localization);
    },
    each: function(f, s) { this.$sheet.listCells().each(f, s); return this; },
    findCell: function(dayPoint){ return this.$findCell(dayPoint); },
    selectCell: function(cell){
        if(!$.exists(cell)) return this;
        this._onSelect.notify(cell);
        return this;
    },
    select: function(dayPoint) {
        return this.selectCell(this.findCell(dayPoint));
    },
    onSelect: function(f, s) { this._onSelect.add(f, s); return this; },
    destroy: function() {
        this.$sheet.listCells().each(function(cell){
            if($.exists(cell.deallocate)) cell.deallocate();
            cell.clearEvents();
            return this;
        });
    }
}
$.ext(abstractSheet, $.dom.Class);

var datesheet = function(dayPoint, localization, table) {

    this._firstDateOfSheet = datesheet_findFirstDateOfSheet(dayPoint);
    this.$sheet = table.onCellSelect(this.selectCell, this);

    datesheet.base.call(this, this.$sheet.dom(), localization);

    datesheet_createColumns(this);
    datesheet_createRows(this);
}
datesheet.prototype = {
    $findCell: function(dayPoint){
        return this.$sheet.findCellById(dayPoint.toString());
    }
}
$.ext(datesheet, abstractSheet);
$.datesheet = function(dayPoint, localization, tbl){
    return (new datesheet(dayPoint, localization, tbl));
}

function datesheet_findFirstDateOfSheet(dayPoint){
    var firstDayOfMonth = dayPoint.firstDayOfMonth(),
        currentDay = dayPoint.firstDayOfMonth(),
        secondIteration = false;
    while(currentDay.day() > 0 || !secondIteration) {
        if(currentDay.day() == 0) secondIteration = true;
        currentDay = currentDay.prevDay();
    }
    return currentDay;
}
function datesheet_createColumns(sheet){
    var days = sheet.localization().day.abbr,
        tbl = sheet.$sheet,
        numberOfDays = 7,
        i = 0;

    while(i < numberOfDays) {
        var day = days[i];
        tbl.addColumn(day, {}, day);
        i++;
    }
}
function datesheet_createRows(sheet) {
    var tbl = sheet.$sheet,
        currentDate = sheet._firstDateOfSheet,
        i = 0;
    while(i < 7){
        var week = datesheet_createRow(sheet, currentDate);
        currentDate = currentDate.add(0, 0, 7);
        tbl.addRow($.uid(), week);
        i++;
    }
}  
function datesheet_createRow(sheet, dayPoint) {
    var currentDay = dayPoint, row = {};
    sheet.$sheet.listColumns().each(function(column){
         row[column.key()] = currentDay;
         currentDay = currentDay.nextDay();
    });
    return row;
}

var monthsheet = function(dayPoint, localization, table) {

    this._firstDateOfSheet = monthsheet_findFirstDateOfSheet(dayPoint);
    this.$sheet = table.onCellSelect(this.selectCell, this);

    monthsheet.base.call(this, this.$sheet.dom(), localization);

    monthsheet_createColumns(this);
    monthsheet_createRows(this);
}
monthsheet.prototype = {
    $findCell: function(dayPoint){
        return this.$sheet.findCellById(dayPoint.month());
    }
}
$.ext(monthsheet, abstractSheet);
$.monthsheet = function(dayPoint, localization, tbl){
    return (new monthsheet(dayPoint, localization, tbl));
}

function monthsheet_findFirstDateOfSheet(dayPoint){
    return $.dayPoint(dayPoint.year(), 1, dayPoint.date());
}
function monthsheet_createColumns(sheet){
    var months = sheet.localization().month.abbr,
        tbl = sheet.$sheet,
        numberOfMonths = 4,
        i = 1;
        
    while(i <= numberOfMonths) {
        tbl.addColumn(i, null, "");
        i++;
    }
}
function monthsheet_createRows(sheet) {
    var tbl = sheet.$sheet,
        currentDate = sheet._firstDateOfSheet,
        i = 1;
    while(i <= 3){
        var months = monthsheet_createRow(sheet, currentDate);
        currentDate = currentDate.add(0, 4, 0);
        tbl.addRow($.uid(), months);
        i++;
    }
}  
function monthsheet_createRow(sheet, dayPoint) {
    var currentDay = dayPoint, row = {};
    sheet.$sheet.listColumns().each(function(column){
         row[column.key()] = currentDay;
         currentDay = currentDay.nextMonth();
    });
    return row;
}

var yearsheet = function(dayPoint, localization, table) {

    this._firstDateOfSheet = yearsheet_findFirstDateOfSheet(dayPoint);
    this.$sheet = table.onCellSelect(this.selectCell, this);

    yearsheet.base.call(this, this.$sheet.dom(), localization);

    yearsheet_createColumns(this);
    yearsheet_createRows(this);
}
yearsheet.prototype = {
    $findCell: function(dayPoint){
        return this.$sheet.findCellById(dayPoint.year());
    }
}
$.ext(yearsheet, abstractSheet);
$.yearsheet = function(dayPoint, localization, tbl){
    return (new yearsheet(dayPoint, localization, tbl));
}

function yearsheet_findFirstDateOfSheet(dayPoint){
    return dayPoint.add(-12, 0, 0);
}
function yearsheet_createColumns(sheet){
    var months = sheet.localization().month.abbr,
        tbl = sheet.$sheet,
        numberOfYears = 5,
        i = 0;
        
    while(i < numberOfYears) {
        tbl.addColumn(i, null, "");
        i++;
    }
}
function yearsheet_createRows(sheet) {
    var tbl = sheet.$sheet,
        currentDate = sheet._firstDateOfSheet,
        i = 0;
    while(i < 5){
        var years = yearsheet_createRow(sheet, currentDate);
        currentDate = currentDate.add(5, 0, 0);
        tbl.addRow($.uid(), years);
        i++;
    }
}  
function yearsheet_createRow(sheet, dayPoint) {
    var currentDay = dayPoint, row = {};
    sheet.$sheet.listColumns().each(function(column){
         row[column.key()] = currentDay;
         currentDay = currentDay.nextYear();
     });
    return row;
}

function dndScreenDropper(dom){
    dndScreenDropper.base.call(this, dom);
    this._id = $.uid("dropper");
    this._handle = this;
}
dndScreenDropper.prototype = {
    id: function(id) { return this.get("id"); },
    value: function(value) { return this.property("value", value); },
    handle: function(handle) {
        var hndl;
        if($.exists(handle)) hndl = $.dom(handle);
        return this.property("handle", hndl);
    },
    mouseEventId: function(mouseEventId) { return this.property("mouseEventId", mouseEventId); },
    touchEventId: function(touchEventId) { return this.property("touchEventId", touchEventId); },
}
$.ext(dndScreenDropper, $.dom.Class);
$.dndScreenDropper = function(dom){ return new dndScreenDropper(dom); }

var dndScreen = function() {
    this._targets = $.hash();
    this._droppers = $.hash();
    this._onHit = $.observer();
    this._lastKnownCoord;

    this._helper = $.sprite($.create({"div":{"class":"ku-dndScreen-helper"}}))
                        .onGrab(function(e) {
                            var periph = $.touch().canRead(e) ? $.touch() : $.mouse();
                            this._lastKnownCoord = periph.documentCoord(e);
                        }, this)
                        .onDrag(function(e) {
                            var periph = $.touch().canRead(e) ? $.touch() : $.mouse();
                            this._lastKnownCoord = periph.documentCoord(e);
                        }, this)
                        .onDrop(function(e){ this._drop(e); }, this);
    this._currentDropper;
}
dndScreen.prototype = {
    addTarget: function(target) {
        this._targets.add(target.id(), target);
        return this;
    },
    removeTarget: function(target) {
        this._targets.remove(target.id(), target);
        return this;
    },
    addDropper: function(dropper) {
        var mouseEventId = $.uid("dropperEvent"),
            touchEventId = $.uid("dropperEvent");

        function action(e){
            this._currentDropper = dropper;
            this.activateHelper(e, dropper);
        }
        dropper
            .mouseEventId(mouseEventId)
            .touchEventId(touchEventId)
            .handle()
            .onmousedown(action, this, mouseEventId)
            .ontouchstart(action, this, touchEventId);

        this._droppers.add(dropper.id(), dropper);
    },
    removeDropper: function(dropper) {
        dropper.handle()
            .removeEvent(dropper.touchEventId())
            .removeEvent(dropper.mouseEventId());
        this._droppers.remove(dropper.id());
    },
    activateHelper: function(e, dropper) {
        this._helper.appendTo(document.body)
            .pinTo(dropper.offset().subtract(dropper.scrollOffset()).add($.window().scrollOffset()))
            .content(dropper.cloneNode())
            .grab(e)
    },
    deactivateHelper: function() {
        this._helper.html("").detach();
        this._currentDropper = undefined;
    },
    clearTargets: function() {
        this._targets.clear();
        return this;
    },
    clearDroppers: function() {
        var droppers = this._droppers;
        droppers.listValues().each(function(dropper){
            this.removeDropper(dropper);
        }, this);
        return this;
    },
    clearAll: function() {
        this.clearTargets().clearDroppers();
        return this;
    },
    clearListeners: function() {
        this._onHit.clear();
        return this;
    },
    onHit: function(f, s) {
        this._onHit.add(f, s);
        return this;
    },
    _drop: function(e){
        var hitTarget = this._findHitTarget(e),
            dropper = this._currentDropper;
        if($.exists(hitTarget) && $.exists(dropper))
            this._onHit.notify(hitTarget, dropper);
        this.deactivateHelper();
    },
    _findHitTarget: function(e){
        var targets = this._targets.listValues(),
            periph = $.touch().canRead(e) ? $.touch() : $.mouse(),
            hitTarget = null,
            coord;

        try { coord = periph.documentCoord(e); }
        catch(e) { coord = this._lastKnownCoord}

        targets.each(function(target){
            if(!target.contains(coord)) return;
            hitTarget = target;
            targets.quit();
        });
        return hitTarget;
    }
}
$.dndScreen = function(){ return new dndScreen(); }

function dndScreenTarget(dom){
    dndScreenTarget.base.call(this, dom);
    this._id = $.uid("target");
}
dndScreenTarget.prototype = {
    id: function(id) { return this.get("id"); },
    value: function(value) { return this.property("value", value); },
    contains: function(coord){
        var topLeft = this.offset(),
            bottomRight = topLeft.add(this.outerDims());

        return $.rectangle(topLeft, bottomRight).contains(coord);
    }
}
$.ext(dndScreenTarget, $.dom.Class);
$.dndScreenTarget = function(dom){ return new dndScreenTarget(dom); }

function abstractCheckbox(dom){
    abstractCheckbox.base.call(this, dom);
    this._isinvalid = false;
    this._keyup = $.uid();
    this._$dom = $.dom(this.dom());
    this.onInvalid(this.invalidate, this)
        .onIsValid(this.validate, this);
}
abstractCheckbox.prototype = {
    $clear: function(){ return this.value("").validate(); },
    tooltip: function(tooltip){ return this.set("tooltip", tooltip); },
    invalidate: function(){
        if(this._isinvalid) return this;
        this._isinvalid = true;
        this._$dom
            .addClass("ku-field-error")
            .onchange(this.isValid, this, this._keyup);
        var tt = this._tooltip;
        if($.exists(tt)) tt.show().rightOf(this.dom());
        return this;
    },
    validate: function(){
        if(!this._isinvalid) return this;
        this._isinvalid = false;
        this._$dom
            .removeClass("ku-field-error")
            .removeEvent(this._keyup);
        var tt = this._tooltip;
        if($.exists(tt)) tt.hide();
        return this;
    }
}
$.ext(abstractCheckbox, $.checkbox.Class);

function abstractField(dom){
    abstractField.base.call(this, dom);
    this._isinvalid = false;
    this._keyupid = $.uid();
    this._$dom = $.dom(this.dom());
    this.onInvalid(this.invalidate, this)
        .onIsValid(this.validate, this);
}
abstractField.prototype = {
    $clear: function(){ return this.value("").validate(); },
    tooltip: function(tooltip){ return this.set("tooltip", tooltip); },
    watermark: function(watermark){ return this.set("watermark", watermark); },
    invalidate: function(){
        if(this._isinvalid) return this;
        this._isinvalid = true;
        this._$dom
            .addClass("ku-field-error")
            .onkeyup(this.isValid, this, this._keyupid);
        var tt = this._tooltip;
        if($.exists(tt)) tt.show().rightOf(this.dom());
        return this;
    },
    validate: function(){
        if(!this._isinvalid) return this;
        this._isinvalid = false;
        this._$dom
            .removeClass("ku-field-error")
            .removeEvent(this._keyupid);
        var tt = this._tooltip;
        if($.exists(tt)) tt.hide();
        return this;
    }
}
$.ext(abstractField, $.field.Class);

function abstractSelect(dom){
    abstractSelect.base.call(this, dom);
    this._isinvalid = false;
    this._keyup = $.uid();
    this._$dom = $.dom(this.dom());
    this.onInvalid(this.invalidate, this)
        .onIsValid(this.validate, this);
}
abstractSelect.prototype = {
    $clear: function(){ return this.value("").validate(); },
    tooltip: function(tooltip){ return this.set("tooltip", tooltip); },
    invalidate: function(){
        if(this._isinvalid) return this;
        this._isinvalid = true;
        this._$dom
            .addClass("ku-field-error")
            .onchange(this.isValid, this, this._keyup);
        var tt = this._tooltip;
        if($.exists(tt)) tt.show().rightOf(this.dom());
        return this;
    },
    validate: function(){
        if(!this._isinvalid) return this;
        this._isinvalid = false;
        this._$dom
            .removeClass("ku-field-error")
            .removeEvent(this._keyup);
        var tt = this._tooltip;
        if($.exists(tt)) tt.hide();
        return this;
    }
}
$.ext(abstractSelect, $.select.Class);

function checkboxField(dom){
    checkboxField.base.call(this, dom);
    this.tooltip($.tooltip().message("Invalid"));
}
$.ext(checkboxField, abstractCheckbox);
$.fields.checkbox = function(dom){ return new checkboxField(dom); }

function dayPointField(dom){
    dayPointField.base.call(this, dom);
    this._id = $.uid("field");
    this._isShow = false;
    this._calendar = $.calendarControlsDecorator($.calendar())
                        .onSelect(function(date){
                            this.value(date.value().toString()).validate();
                            //this.dom().select();
                            this.hideCalendar();
                        }, this)
                        .showDates();
    this._calContainer = $.tooltip()
                        .pointer($.sprite($.create({"div":{"class":"ku-dayPointField-tooltip-pointer"}})).hide().dragOff())
                        .tooltip($.sprite($.create({"div":{"class":"ku-dayPointField-tooltip"}})).hide().dragOff())
                        .message(this._calendar.dom());

    this._$dom = $.dom(this.dom())
        .onfocus(this._focusAction, this)
        .onkeyup(this._keyupAction, this)
        .onkeydown(this._keydownAction, this);

        this.spec($.fields.specs.date)
            .tooltip($.tooltip().message("Enter a valid date."));
}
dayPointField.prototype = {
    $read: function(){ return ($.dayPoint.tryParse(this.dom().value) || "").toString(); },
    $write: function(value){ this.dom().value = ($.dayPoint.tryParse(value) || value).toString(); },
    showCalendar: function(){
        if(this._isShow) return;
        this._isShow = true;
        this._calContainer.show().at(this.dom(), ["below", "above"]);
        $.window().onmouseup(this._hideCalendar, this, this._id);
		return this;
    },
    hideCalendar: function(e){
        this._calContainer.hide();
        this._calendar.detach();
        $.window().remove(this._id);
        this._isShow = false;
		return this;
    },
    _hideCalendar: function(e) {
        var cal = this._calendar,
            ctl = cal.offset(),
            cbr = ctl.add(cal.outerDims()),
            inp = this._$dom,
            itl = inp.offset(),
            ibr = itl.add(inp.outerDims()),
            calendar = $.rectangle(ctl, cbr),
            input = $.rectangle(itl, ibr),
            mouse = $.mouse().documentCoord(e);

        if(calendar.contains(mouse) ||
           input.contains(mouse)) return this;

        this.hideCalendar();
		return this;
    },
    _focusAction: function(e) {
		this.showCalendar(); 
		return this;
	},
    _keyupAction: function(e) { 
		this.showCalendar(); 
		return this; 
	},
    _keydownAction: function(e) {
        var key = $.key.parse(e),
            tab = $.key(9),
            tabShift = $.key(9, false, false, true);
        if (key.equals(tab) || key.equals(tabShift))
        this.hideCalendar(); 
		return this;
    }
}
$.ext(dayPointField, abstractField);
$.fields.dayPoint = function(dom){ return new dayPointField(dom); }

function emailField(dom){
    emailField.base.call(this, dom);
    this.spec($.fields.specs.email)
        .tooltip($.tooltip().message("Enter a valid email address."));
}
emailField.prototype = {
    $read: function(){ return this.dom().value; },
    $write: function(value){ this.dom().value = value; }
}
$.ext(emailField, abstractField);
$.fields.email = function(dom){ return new emailField(dom); }

function field(dom){
    field.base.call(this, dom);
    this.tooltip($.tooltip().message("Invalid"));
}
$.ext(field, abstractField);
$.fields.field = function(dom){ return new field(dom); }

function moneyField(dom){
    moneyField.base.call(this, dom);
    this.spec($.fields.specs.currency)
        .tooltip($.tooltip().message("Enter a valid money amount."));
    $.dom(this.dom()).onblur(function(){ this.value(this.value()); }, this);
}
moneyField.prototype = {
    $read: function(){
        var value = this.dom().value;
        return ($.money.canParse(value))
            ? $.money.parse(value).value()
            : value;
    },
    $write: function(value){ this.dom().value = $.money.tryParse(value) || value; }
}
$.ext(moneyField, abstractField);
$.fields.money = function(dom){ return new moneyField(dom); }

function phoneField(dom){
    phoneField.base.call(this, dom);
    this.spec($.fields.specs.phone)
        .tooltip($.tooltip().message("Enter a valid phone number including area code."));
    $.dom(this.dom()).onblur(function(){ this.value(this.value()); }, this);
}
phoneField.prototype = {
    $read: function(){ return this.dom().value.replace(/[^\d]/g, ""); },
    $write: function(value){
        this.dom().value = (function(v, f) {
                var a = v.replace(/[^\d]/g, "").split(/\B/), i = 0, l = a.length,
                    rv = (l < 11) ? f.replace(/^#\s/, "") : f;
                while(i < l) { rv = rv.replace("#", a[i]); i++; }
                return (/#/.test(rv)) ? value : rv;
            })(value, "# (###) ###-####");
    }
}
$.ext(phoneField, abstractField);
$.fields.phone = function(dom, format){ return new phoneField(dom, format); }

function selectField(dom){
    selectField.base.call(this, dom);
    this.tooltip($.tooltip().message("Invalid"));
}
$.ext(selectField, abstractSelect);
$.fields.select = function(dom){ return new selectField(dom); }

function highlighter(){ }
highlighter.prototype = {
    highlight: function(selection, color){
        var range = selection.getRangeAt(0);
        try {
            document.designMode = "on";
                selection.removeAllRanges();
                selection.addRange(range);

                if (!document.execCommand("HiliteColor", false, color))
                    document.execCommand("BackColor", false, color);

            document.designMode = "off";
        }
        catch(e) {
            try {
                range = document.selection.createRange();
                range.execCommand("BackColor", false, color);
            }
            catch(ex){ /*Fail*/ }
        }
    },
    clear: function(){ }
}
$.highlighter = function(){ return new highlighter(); }

function keyboard(){
    this._onKeyPressed = $.observer();
    keyboard.base.call(this, $.create({div:{"class":"ku-keyboard"}}));
}
keyboard.prototype = {
    addKey: function(code){
        $.onScreenKey(code)
            .addClass($.str.format("ku-keyboard-key ku-key-{0}", code))
            .onPress(this._onKeyPressed.notify, this._onKeyPressed)
            .appendTo(this.dom());
        return this;
    },
    onKeyPressed: function(f, s){
        this._onKeyPressed.add(f, s);
		return this;
    }
}
$.ext(keyboard, $.dom.Class);
$.onScreenKeyboard = function(){ return new keyboard(); }

function key(code){
    if(!$.isNumber(code))
        $.exception("arg", $.str.format("Invalid argument code:{0}", code));

    this._value = $.key(code);
    this._onPress = $.observer();
    this._onRelease = $.observer();

    key.base.call(this, $.create({button:{"class":"ku-keyboard-key"}, content: this._value.toString()}));

    this.onmousedown(function() { this._onPress.notify(this._value); }, this)
        .ontouchstart(function() { this._onPress.notify(this._value); }, this)
        .onmouseup(function() { this._onRelease.notify(this._value); }, this)
        .ontouchend(function() { this._onRelease.notify(this._value); }, this)
}
key.prototype = {
    onPress: function(f, s){
        this._onPress.add(f, s);
        return this;
    },
    onRelease: function(f, s){
        this._onRelease.add(f, s);
        return this;
    }
}
$.ext(key, $.dom.Class);
$.onScreenKey = function(code){ return new key(code); }

function scrubber (dom){
    scrubber.base.call(this, dom);
    //need a dragger constrained to the x or y coord
    //this class should return to someone the degree to which it has moved
    //This class needs an upper and lower bound
    //  How far it is allowed to move
    //  It will be allowed to move from left 0 to left dist-dim(x|y)
}
scrubber.prototype = {
    value: function(){ /*What does this mean?*/},
    ratio: function(){ return this.minValue()/this.maxValue(); },
    minValue: function(minValue){ this.get("minValue", minValue); },
    maxValue: function(maxValue){ this.get("maxValue", maxValue); }
}
$.ext(scrubber, $.dom.Class);

function scrubline (){

}
scrubline.prototype = {

}

function sprite(dom){
    var d = dom || $.create({div:{"class":"ku-sprite"}});
    sprite.base.call(this, d);
    this.to().dragOn().force(.4).mu(.8);
	this._isTo;
}
sprite.prototype = {
    force: function(force){ return this.property("force", force); },
    mu: function(mu){ return this.property("mu", mu); },
    algorithm: function(algorithm){ return this.set("algorithm", algorithm); },
    
    to: function(){  this._isTo = true; return this.algorithm($.anime.algorithms.jump()); },
    spring: function(){  this._isTo = false; return this.algorithm($.anime.algorithms.spring(this._force, this._mu)); },
    ease: function(){  this._isTo = false; return this.algorithm($.anime.algorithms.ease.linear(this._force, this._mu)); },
    
    fitTo: function(coord, f, s){ return this._act("fitter", coord, f, s); },
    sizeTo: function(coord, f, s) { return this._act("sizer", coord, f, s); },
    pinTo: function(coord, f, s){ return this._act("pinner", coord, f, s); },
    scrollTo: function(coord, f, s){ return this._act("scroller", coord, f, s); },
    fadeTo: function(nbr, f, s){ return this._act("fader", nbr, f, s); },
    growTo: function(coord, f, s){
        return this.sizeTo(coord)
                   .pinTo(this.boundedOffset()
                        .subtract(coord.subtract(this.outerDims())
                        .half()), f, s);
    },
    _act: function(action, value, f, s){
        var act = $[action](this.dom()).algorithm(this._algorithm),
            _action =  "_" + action,
            currentAction = this[_action];

        if($.exists(currentAction)) currentAction.stop();
        if($.exists(f)) act.onEnd(f, s);

        if(this._isTo) this[_action] = act.to(value);
        else this[_action] = act.moveTo(value);
        return this;
    },
    tween: function(property, value){
        this._styler = $.styler(this.dom(), property).algorithm(this._algorithm).moveTo(value);
        return this;
    },
    clear: function(){
        if($.exists(this._fader)) this._fader.stop();
        if($.exists(this._sizer))this._sizer.stop();
        if($.exists(this._fitter))this._fitter.stop();
        if($.exists(this._pinner))this._pinner.stop();
        if($.exists(this._scroller))this._scroller.stop();
        if($.exists(this._styler))this._styler.stop();
        return this;
    },
    dragHandle: function(dragHandle){ return this.property("dragHandle", dragHandle); },
    dragType: function(dragType){ return this.set("dragType", dragType); },
    dragOffset: function(dragOffset){ this._dnd.dragOffset(dragOffset); return this; },
    dragger: function(){ this._dnd.dragger(); return this; },
    sizer: function(){ this._dnd.sizer(); return this; },
    scroller: function(){ this._dnd.scroller(); return this; },
    dragOn: function(){ this._dnd = $.dnd(this.dom()).onGrab(this.clear, this); return this; },
    dragOff: function(){ this._dnd.destroy(); return this; },
    onGrab: function(f, s, id){ this._dnd.onGrab(f, s, id); return this; },
    onDrag: function(f, s, id){ this._dnd.onDrag(f, s, id); return this; },
    onDrop: function(f, s, id){ this._dnd.onDrop(f, s, id); return this; },
    bearingUp: function(){ return this._dnd.bearingUp(); },
    bearingDown: function(){ return this._dnd.bearingDown(); },
    bearingLeft: function(){ return this._dnd.bearingLeft(); },
    bearingRight: function(){ return this._dnd.bearingRight(); },
    grab: function(e){ this._dnd.grab(e); return this; },
    drag: function(e){ this._dnd.drag(e); return this; },
    drop: function(e){ this._dnd.drop(e); return this; },
    constrainX: function(){ this._dnd.constrainX(); return this; },
    unconstrainX: function(){ this._dnd.unconstrainX(); return this; },
    constrainY: function(){ this._dnd.constrainY(); return this; },
    unconstrainY: function(){ this._dnd.unconstrainY(); return this; }
}
$.ext(sprite, $.dom.Class);
$.sprite = function(dom){ return new sprite(dom); }
$.sprite.Class = sprite;

var abstractTooltipStrategy = function(tooltip, multiplier){
    this.$offset = 0;
    this.$multiplier = multiplier;
    this._tooltip = tooltip;
    this.overlap(0);
}
abstractTooltipStrategy.prototype = {
    $above: function(context, pointer, tooltip){ return; },
    $below: function(context, pointer, tooltip){ return; },
    $leftOf: function(context, pointer, tooltip){ return; },
    $rightOf: function(context, pointer, tooltip){ return; },
    overlap: function(overlap){ return this.set("overlap", overlap); },
    above: function(dom){
        var tooltip = this._tooltip,
            context = tooltip.context(dom).context(),
            pointer = tooltip.pointer(),
            content = tooltip.tooltip();
            
        this.$offset = this._overlap;   
        this.$above(context, pointer, content);
        return this;
    },
    below: function(dom){
        var tooltip = this._tooltip,
            context = tooltip.context(dom).context(),
            pointer = tooltip.pointer(),
            content = tooltip.tooltip();
            
        this.$offset = this._overlap;   
        this.$below(context, pointer, content);
        return this;
    },
    leftOf: function(dom){
        var tooltip = this._tooltip,
            context = tooltip.context(dom).context(),
            pointer = tooltip.pointer(),
            content = tooltip.tooltip();
            
        this.$offset = this._overlap;   
        this.$leftOf(context, pointer, content);
        return this;
    },
    rightOf: function(dom){
        var tooltip = this._tooltip,
            context = tooltip.context(dom).context(),
            pointer = tooltip.pointer(),
            content = tooltip.tooltip();
            
        this.$offset = this._overlap;   
        this.$rightOf(context, pointer, content);
        return this;
    }
}
$.ext(abstractTooltipStrategy, $.Class);

var tooltipStrategyCenter = function(tooltip, multiplier){
    tooltipStrategyCenter.base.call(this, tooltip, .5);
}
tooltipStrategyCenter.prototype = {
    $above: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .subtract(pointer.outerHeight())
                    .add($.coord(context.outerDims().subtract(pointer.outerDims()).x() * this.$multiplier, 0)));
        
        tooltip.pinTo(pointer.offset()
            .subtract(tooltip.outerHeight())
            .add($.coord(0, this.$offset))
            .add($.coord(pointer.outerDims().subtract(tooltip.outerDims()).x() * this.$multiplier, 0)));
        
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $below: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .add(context.outerHeight())
                    .add($.coord(context.outerDims().subtract(pointer.outerDims()).x() * this.$multiplier, 0)));
    
        tooltip.pinTo(pointer.offset()
            .add(pointer.outerHeight())
            .subtract($.coord(0, this.$offset))
            .add($.coord(pointer.outerDims().subtract(tooltip.outerDims()).x() * this.$multiplier, 0)));
 
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $leftOf: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .subtract(pointer.outerWidth())
                    .add($.coord(0, context.outerDims().subtract(pointer.outerDims()).y() * this.$multiplier)));
     
        tooltip.pinTo(pointer.offset()
            .subtract(tooltip.outerWidth())
            .add($.coord(this.$offset, 0))
            .add($.coord(0, pointer.outerDims().subtract(tooltip.outerDims()).y() * this.$multiplier)));
   
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $rightOf: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .add(context.outerWidth())
                    .add($.coord(0, context.outerDims().subtract(pointer.outerDims()).y() * this.$multiplier)));
                
        tooltip.pinTo(pointer.offset()
            .add(pointer.outerWidth())
            .subtract($.coord(this.$offset, 0))
            .add($.coord(0, pointer.outerDims().subtract(tooltip.outerDims()).y() * this.$multiplier)));

        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    }
}
$.ext(tooltipStrategyCenter,
      abstractTooltipStrategy);

var tooltipStrategyLeftJustify = function(tooltip, multiplier){
    tooltipStrategyLeftJustify.base.call(this, tooltip, 0);
}
tooltipStrategyLeftJustify.prototype = {
    $above: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .subtract(pointer.outerHeight())
                    .add($.coord(this.$offset, 0))
                    .add($.coord(context.outerDims().subtract(pointer.outerDims()).x() * this.$multiplier, 0)));

        tooltip.pinTo(pointer.offset()
            .subtract(tooltip.outerHeight())
            .add($.coord(-this.$offset, this.$offset))
            .add($.coord(pointer.outerDims().subtract(tooltip.outerDims()).x() * this.$multiplier, 0)));

        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $below: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .add(context.outerHeight())
                    .add($.coord(this.$offset, 0))
                    .add($.coord(context.outerDims().subtract(pointer.outerDims()).x() * this.$multiplier, 0)));
        
        tooltip.pinTo(pointer.offset()
            .add(pointer.outerHeight())
            .subtract($.coord(this.$offset, this.$offset))
            .add($.coord(pointer.outerDims().subtract(tooltip.outerDims()).x() * this.$multiplier, 0)));
        
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $leftOf: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .subtract(pointer.outerWidth())
                    .add($.coord(0, this.$offset))
                    .add($.coord(0, context.outerDims().subtract(pointer.outerDims()).y() * this.$multiplier)));

        tooltip.pinTo(pointer.offset()
            .subtract(tooltip.outerWidth())
            .add($.coord(this.$offset, -this.$offset))
            .add($.coord(0, pointer.outerDims().subtract(tooltip.outerDims()).y() * this.$multiplier)));
        
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $rightOf: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .add(context.outerWidth())
                    .add($.coord(0, this.$offset))
                    .add($.coord(0, context.outerDims().subtract(pointer.outerDims()).y() * this.$multiplier)));
        
        tooltip.pinTo(pointer.offset()
            .add(pointer.outerWidth())
            .subtract($.coord(this.$offset, this.$offset))
            .add($.coord(0, pointer.outerDims().subtract(tooltip.outerDims()).y() * this.$multiplier)));

        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    }
}
$.ext(tooltipStrategyLeftJustify,
      abstractTooltipStrategy);

var tooltipStrategyRightJustify = function(tooltip, multiplier){
    tooltipStrategyRightJustify.base.call(this, tooltip, 1);
}
tooltipStrategyRightJustify.prototype = {
    $above: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .subtract(pointer.outerHeight())
                    .add($.coord(-this.$offset, 0))
                    .add($.coord(context.outerDims().subtract(pointer.outerDims()).x() * this.$multiplier, 0)));
                
        tooltip.pinTo(pointer.offset()
            .subtract(tooltip.outerHeight())
            .add($.coord(this.$offset, this.$offset))
            .add($.coord(pointer.outerDims().subtract(tooltip.outerDims()).x() * this.$multiplier, 0)));
          
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $below: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .add(context.outerHeight())
                    .add($.coord(-this.$offset, 0))
                    .add($.coord(context.outerDims().subtract(pointer.outerDims()).x() * this.$multiplier, 0)));
            
        tooltip.pinTo(pointer.offset()
            .add(pointer.outerHeight())
            .add($.coord(this.$offset, -this.$offset))
            .add($.coord(pointer.outerDims().subtract(tooltip.outerDims()).x() * this.$multiplier, 0)));
               
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $leftOf: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .subtract(pointer.outerWidth())
                    .add($.coord(0, -this.$offset))
                    .add($.coord(0, context.outerDims().subtract(pointer.outerDims()).y() * this.$multiplier)));
        
        tooltip.pinTo(pointer.offset()
            .subtract(tooltip.outerWidth())
            .add($.coord(this.$offset, this.$offset))
            .add($.coord(0, pointer.outerDims().subtract(tooltip.outerDims()).y() * this.$multiplier)));
                
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    },
    $rightOf: function(context, pointer, tooltip){
        pointer.pinTo(context.offset()
                    .add(context.outerWidth())
                    .add($.coord(0, -this.$offset))
                    .add($.coord(0, context.outerDims().subtract(pointer.outerDims()).y() * this.$multiplier)));
               
        tooltip.pinTo(pointer.offset()
            .add(pointer.outerWidth())
            .add($.coord(-this.$offset, this.$offset))
            .add($.coord(0, pointer.outerDims().subtract(tooltip.outerDims()).y() * this.$multiplier)));
                         
        pointer.fadeTo(100);
        tooltip.fadeTo(100);
        return this;
    }
}
$.ext(tooltipStrategyRightJustify,
      abstractTooltipStrategy);

var tooltip = function(){
    tooltip.base.call(this);
    this.pointer($.sprite($.create({"div":{"class":"ku-tooltip-pointer"}})).hide().dragOff().to())
        .tooltip($.sprite($.create({"div":{"class":"ku-tooltip"}})).hide().dragOff().to())
        .leftJustify();

    this._id = $.uid("tip");
    this._onShow = $.observer();
    this._onHide = $.observer();
}
tooltip.prototype = {
    calibrate: function(calibrate){ return this.property("calibrate", calibrate); },
    pointer: function(pointer){ return this.property("pointer", pointer); },
    tooltip: function(tooltip){ return this.property("tooltip", tooltip); },
    strategy: function(strategy){ return this.property("strategy", strategy); },
    message: function(message){ return this.property("message", message); },
    context: function(context){
        var ctxt = ($.exists(context)) ? $.dom(context) : context;
        return this.property("context", ctxt);
    },
    center: function(){ return this.strategy(new tooltipStrategyCenter(this)); },
    leftJustify: function(){ return this.strategy(new tooltipStrategyLeftJustify(this)); },
    rightJustify: function(){ return this.strategy(new tooltipStrategyRightJustify(this)); },
    onShow: function(f, s) { this._onShow.add(f, s); return this; },
    onHide: function(f, s) { this._onHide.add(f, s); return this; },
    show: function(message){
        var m = message || this._message, v = m || "";
        this._pointer.fadeTo(0).appendTo(document.body).show()
        this._tooltip.fadeTo(0).appendTo(document.body).html("").content(v).show();
        this._onShow.notify();
        return this;
    },
    hide: function(){
        this._pointer.hide().detach();
        this._tooltip.hide().detach();
        this._onHide.notify();
        return this;
    },
    at: function(dom, pref){
        var w = $.window(),
            d = $.dom(dom),
            A = $.coord.zero(),
            B = w.dims(),
            a = d.offset()
            b = a.add(d.outerDims()),
            C = this._tooltip.outerDims(),
            bPlusC = b.add(C),
            aLessC = a.subtract(C),
            rightOf = !bPlusC.isRightOf(B),
            below = !bPlusC.isBelow(B),
            leftOf = !aLessC.isLeftOf(A),
            above = !aLessC.isAbove(A),
            prefer = {
                "rightOf": rightOf,
                "below": below,
                "leftOf": leftOf,
                "above": above
            };
        if(prefer[pref[0]]) return this[pref[0]](dom);
        if(prefer[pref[1]]) return this[pref[1]](dom);
        if(prefer[pref[2]]) return this[pref[2]](dom);
        if(prefer[pref[3]]) return this[pref[3]](dom);
        return this.rightOf(dom);
    },
    above: function(dom){ return this._locate(dom, "bottom", "above"); },
    below: function(dom){ return this._locate(dom, "top", "below"); },
    leftOf: function(dom){ return this._locate(dom, "right", "leftOf"); },
    rightOf: function(dom){ return this._locate(dom, "left", "rightOf"); },
    _locate: function(dom, overlap, position){
        this.strategy().overlap(tooltip_calculateOverlap(this, overlap))[position](dom);
        tooltip_setClass(this, position);
        this._pointer.fadeTo(100);
        this._tooltip.fadeTo(100);
        return this;
    }
}
$.ext(tooltip, $.Class);
$.tooltip = function(){ return new tooltip(); }

function tooltip_calculateOverlap(tooltip, side){
    var b = tooltip.tooltip().style($.str.format("border-{0}-width", side));
    return $.ku.style.toNumber(b)
}
function tooltip_setClass(tooltip, position){
    var format = "ku-{0}",
        positions = ["above", "below", "leftOf", "rightOf"],
        pointer = tooltip.pointer();
        
    for(var n in positions)
        pointer.removeClass($.str.format(format, positions[n]));
    pointer.addClass($.str.format(format, position));
}

function droptarget(dom) {
    this._target = $.sprite(dom).dragOff();
    this._helper = $.sprite($.create({div:{"class":"ku-droptarget-helper",
                        style:"position:absolute;"},content:"helper"})).fadeTo(30).hide();
    
    this._observer = $.observer();
}

droptarget.prototype = {
    add: function(dom, func, scope) {
        this._observer.add($.uid("drop"), evtId);
    },
    remove: function(id) {
        
    },
    _hits: function(e){
        var m = $.mouse().documentCoord(e),
            tl = this.tl, br = this.br;
        return m.isRightOf(tl) && m.isBelow(tl) &&
               m.isLeftOf(br) && m.isAbove(br);
    }
}
$.ext(droptarget, $.dom.Class);
$.droptarget = function(dom){ return new droptarget(dom); }

function file(tabDom, contentDom){
    file.base.call(this);
    var tab = $.dom(tabDom).addClass("ku-file-tab").onclick(this.invoke, this),
        content = $.dom(contentDom).addClass("ku-file-content"),
        active = "ku-file-active";
        
    this.onActive(function(){
            tab.addClass(active);
            content.addClass(active);
        })
        .onInactive(function(){
            tab.removeClass(active);
            content.removeClass(active);
        });
}
file.prototype = { }
$.ext(file, $.toggle.Class);

function tablessFile(contentDom){
    tablessFile.base.call(this);
    var content = $.dom(contentDom).addClass("ku-file-content"),
        active = "ku-file-active";
        
    this.onActive(function(){
            content.addClass(active);
        })
        .onInactive(function(){
            content.removeClass(active);
        });
}
tablessFile.prototype = { }
$.ext(tablessFile, $.toggle.Class);

$.file = function(tabDom, contentDom) {
    return ($.exists(tabDom))
        ? new file(tabDom, contentDom)
        : new tablessFile(contentDom);
} 

function fileCabinet(){
    fileCabinet.base.call(this);
    this.mutuallyExclusive();
}
fileCabinet.prototype = { }
$.ext(fileCabinet, $.toggleset.Class);
$.fileCabinet = function(){ return new fileCabinet(); }

$.mouseLogger = function(){
    var dom = $.create({"div":{style:{position:"absolute"}}});
    return {
        on: function(){
            document.body.appendChild(dom);
            this.__con = new $.sprite(dom);
            this.__evt = $.evt.add(document, "mousemove", function(e){
                var f = $.str.build("Document:&nbsp;{0}<br/>Page:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{1}",
                                    "<br/>Screen:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{2}",
                                    "<br/>Client:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{3}",
                                    "<br/>Target:&nbsp;{4}"),
                    d = $.mouse().documentCoord(e),
                    p = $.mouse().pageCoord(e),
                    s = $.mouse().screenCoord(e),
                    c = $.mouse().clientCoord(e),
                    t = $.mouse().target(e);
                this.__con
                    .pinTo($.mouse().documentCoord(e).add($.coord(10, 10)))
                    .html($.str.format(f,d.toString(),p.toString(),s.toString(),c.toString(),t));
            }, this);
        },
        off:function(){
            document.body.removeChild(dom);
            var e = this.__evt, c = this.__con;
            if($.exists(e)) $.evt.remove(e);
            if($.exists(c)) c.destroy();
        }
    }
}

function projectile(dom){
    projectile.base.call(this, dom);
    this._velocityId = $.uid("projectile");
    this._flyId = $.uid("projectile");
    
    this.gravity($.vector(0, .5))
        .friction(.98)
        .velocity($.vector.zero())
        .lowerBound($.coord.zero())
        .upperBound($.window.dims())
        .lastCoord(this.offset())
        .onDrop(function(){ projectile_toss(this, this._velocityId, this._flyId); }, this)
        .onGrab(function(){
            this.velocity($.vector.zero());
            $.timeline().remove(this._flyId)
                .add(function(){ projectile_calculateVelocity(this); }, this, this._velocityId);
        }, this);
}
projectile.prototype = {
    gravity: function(gravity){ return this.property("gravity", gravity); },
    friction: function(friction){ return this.property("friction", friction); },
    velocity: function(velocity){ return this.property("velocity", velocity); },
    lowerBound: function(lowerBound){ return this.property("lowerBound", lowerBound); },
    upperBound: function(upperBound){ return this.property("upperBound", upperBound); },
    lastCoord: function(lastCoord){ return this.property("lastCoord", lastCoord); },
    stop: function(){ $.timeline().remove(this._velocityId).remove(this._flyId); return this; }
}
$.ext(projectile, $.sprite.Class);
$.projectile = function(dom){ return new projectile(dom); }

function projectile_calculateVelocity(projectile){
        projectile.velocity(projectile.offset().distanceFrom(projectile.lastCoord()));
        projectile.lastCoord(projectile.offset());
}
function projectile_toss(projectile, vid, fid){
    $.timeline().remove(vid).add(function(){ projectile_fly(this); }, projectile, fid);
}
function projectile_fly(projectile){
    var v = projectile.velocity(),
        o = projectile.boundedOffset(),
        d = projectile.outerDims(),
        od = o.add(d),
        lower = projectile.lowerBound(),
        upper = projectile.upperBound(),
        hitsX = (o.isAbove(lower) && (v.y() <= 0)) || (od.isBelow(upper) && (v.y() >= 0)),
        hitsY = (o.isLeftOf(lower) && (v.x() <= 0)) || (od.isRightOf(upper) && (v.x() >= 0)),
        hitFriction = (hitsX || hitsY) ? .8 : 1,
        reflection = hitsX ? $.vector(0, 1) : hitsY ? $.vector(1, 0) : $.vector.zero(),
        vel = v.add(projectile.gravity()).scale(projectile.friction()).scale(hitFriction).reflect(reflection),
        isMoving = vel.magnatude() > 1 || o.isAbove(upper.add(d).add($.coord(0, 10))),
        velocity = isMoving ? vel : $.vector.zero(),
        pos = isMoving ? o.add(velocity) : $.coord(o.x(), upper.subtract(d).y());
    
    projectile.velocity(velocity).pinTo(pos);
}

function responsebox() {
    var dom = $.create({"div":{"class":"ku-responsebox"}}),
        evtId = $.uid("responsebox");
    responsebox.base.call(this, dom);
    

    this._contentDom = $.sprite($.create({"div":{"class":"ku-responsebox-content"}})).fadeTo(0).dragOff().force(.4).ease();
    this._onOpen = $.observer();
    this._onClose = $.observer();
    this._onCalibrate = $.observer();
    this._onWindowResize = $.observer();
    this._onContentChanged = $.observer();
    this._closeSize = $.coord.zero();
    this._isOpen = false;

    this.force(.8).mu(.5).appendChild(this._contentDom.dom())
        .positionStrategy(function(){ return $.window().scrollCenter(); })
        .bounds(document.body).to();

    $.window().onresize(function(){ this._onWindowResize.notify(); }, this, evtId);
}
responsebox.prototype = {
    content: function(content){
        this._contentDom.content(content);
        this._onContentChanged.notify();
        return this;
    },
    disableWindow: function(){ $.window().disable(); return this; },
    enableWindow: function(){ $.window().enable(); return this; },
    positionStrategy: function(positionStrategy){ return this.property("positionStrategy", positionStrategy); },
    openSize: function(openSize){ return this.property("openSize", openSize); },
    bounds: function(bounds){ return this.property("bounds", bounds); },
    onOpen: function(f, s, id){ this._onOpen.add(f, s, id); return this; },
    onClose: function(f, s, id){ this._onClose.add(f, s, id); return this; },
    onCalibrate: function(f, s, id){ this._onCalibrate.add(f, s, id); return this; },
    onWindowResize: function(f, s, id){ this._onWindowResize.add(f, s, id); return this; },
    onContentChanged: function(f, s, id){ this._onContentChanged.add(f, s, id); return this; },
    removeListener: function(id){
        this._onOpen.remove(id);
        this._onClose.remove(id);
        this._onCalibrate.remove(id);
        this._onContentChanged.remove(id);
    },
    calibrate: function() {
        return this.pinTo(responsebox_calculateLocation(this), function(){ this._onCalibrate.notify(); }, this);
    },
    recalibrate: function(){
        this.clear().ease();
        var size = this.openSize() || this._contentDom.outerDims();
        return this.growTo(size, this.calibrate, this);
    },
    transition: function(content){
        this._contentDom.clear().fadeTo(0, function() {
            this.clear().ease().content(content);
                var size = this.openSize() || this._contentDom.outerDims();
                this.growTo(size, function(){
                    this.pinTo(responsebox_calculateLocation(this), function() {
                        this._contentDom.fadeTo(100, function(){ this.redraw(); }, this);
                   }, this);
                }, this);
        }, this);
        return this;
    },
    open: function(latency){
        this.clear().to()
            .fadeTo(100, function() { this._contentDom.fadeTo(0); }, this)
            .appendTo(this.bounds());

        this._onOpen.notify();

        var box = this;
        if(latency) setTimeout(function(){ responsebox_open(box); }, latency);
        else responsebox_open(box);
    },
    close: function(){
        this._contentDom.ease().fadeTo(0, function(){
            this.ease().growTo(this._closeSize, function(){
                this.detach();
                this._onClose.notify();
            }, this);
        }, this);
        return this;
    }
}
$.ext(responsebox, $.sprite.Class);
$.responsebox = function(){ return new responsebox(); }

function responsebox_calculateLocation(box){
    var pos = box._positionStrategy().subtract(box.outerDims().half()),
        coord = $.window().scrollOffset(),
        x = (pos.isLeftOf(coord)) ? coord.x() : pos.x(),
        y = (pos.isAbove(coord)) ? coord.y() : pos.y();
    return $.coord(x, y);
}

function responsebox_open(box) {
    var contentDom = box._contentDom,
        size = box.openSize() || contentDom.outerDims();
    box.growTo(size, function(){
        this.pinTo(responsebox_calculateLocation(this), function() {
            contentDom.fadeTo(100);
        }, box);
    }, box);
}

function scrubber(dom){
    scroller.base.call(this, dom);
    
    var scrubber = $.create({div:{"class":"ku-scrubber-scrub"}}),
        scrubline = $.create({div:{"class":"ku-scrubber-scrubline"}});
    
    this._scrubber = $.sprite(scrubber);
    this._scrubline = $.sprite(scrubline).appendChild(scrubber).dragOff();
}
scrubber.prototype = {
    scrollPanel: function(scrollPanel){ return this.property("scrollPanel", scrollPanel); },
    onScrub: function(f, s, id){ this._scrubber.onDrag(f, s, id); }
}
$.ext(scrubber, $.sprite.Class);
$.scrubber = function(dom){ return new scrubber(dom); }

function scrollPanel(dom){
    scrollPanel.base.call(this, dom);
    var div = $.create({div:{}});
    this._content = $.sprite(div)
        .addClass("ku-scrollPanel-content")
        .onGrab(function(){
            var c = this._content;
            c.dragOffset(c.layoutDims())
        }, this)
        .onDrop(function(){
            var c = this._content;
            this.scrollTo(c.boundedOffset().add(c.layoutDims()));
        }, this);
        
    this.appendChild(div).addClass("ku-scrollPanel").dragOff();
}
scrollPanel.prototype = {
    min: function(){ return $.coord.zero(); },
    max: function(){ return this.get("max"); },
    content: function(content){
        var rv, c = this._content;
        if($.isString(content)) rv =  c.html(content).pinTo($.coord.zero());
        else rv =  c.clear().appendChild(content).pinTo($.coord.zero());
        this._max = scrollPanel_calculateMax(this);
        return rv;
    },
    constrainX: function(){ this._content.constrainX(); return this; },
    unconstrainX: function(){ this._content.unconstrainX(); return this; },
    constrainY: function(){ this._content.constrainY(); return this; },
    unconstrainY: function(){ this._content.unconstrainY(); return this; },
    scrollTo: function(coord){
        if(!$.exists(coord)) return this;
        var min = this.min(),
            max = this.max() || min,
            x = coord.x(),
            y = coord.y();
            
        if(coord.isRightOf(min)) x = min.x();
        if(coord.isLeftOf(max)) x = max.x();
        if(coord.isBelow(min)) y = min.y();
        if(coord.isAbove(max)) y = max.y();
        
        this._content.to().pinTo($.coord(x, y));
        return this;
    },
    scroller: function(scroller){ this.set("scroller", scroller.scrollPanel(this)); },
    displayScroller: function(){ },
    hideScroller: function(){ }
}
$.ext(scrollPanel, $.sprite.Class);
$.scrollPanel = function(dom){ return new scrollPanel(dom); }

function scrollPanel_calculateMax(scrollPanel){
    var coord = scrollPanel._content.outerDims().subtract(scrollPanel.innerDims()),
        z = $.coord.zero(),
        x = coord.isLeftOf(z) ? z.x() : coord.x(),
        y = coord.isAbove(z) ? z.y() : coord.y();
    return scrollPanel.min().subtract($.coord(x, y));
}

})($);
(function($){
if(!$) $ = {};
function chart(dom) {
    chart.base.call(this, dom);
    this.dragOff().value(0);
}
chart.prototype = {
    value: function(value) { return this.property("value", value); },
    display: function(perspective){ perspective.display(this); return this; }
}
$.ext(chart, $.sprite.Class);
$.chart = function(dom) { return new chart(dom); }

function abstractPerspective(dom){
    abstractPerspective.base.call(this, dom);
}
abstractPerspective.prototype = {
    $draw: function(chart) { return },
    $clear: function(){ return; },
    display: function(chart) {
        chart.to().fadeTo(0, function(){
            $.clearNode(chart.dom());
            this.appendTo(chart.dom());
            chart.fadeTo(100, function(){ this.$draw(chart); }, this);
        }, this);
    }
}
$.ext(abstractPerspective, $.dom.Class);
$.abstractPerspective = function(){ return new abstractPerspective(); }

function circlePerspective(){
    circlePerspective.base.call(this, $.create({"canvas":{}}));
    this._context = this.dom().getContext("2d");
}
circlePerspective.prototype = {
    $draw: function(chart) {
        var me = this,
            context = this._context,
            value = chart.value(),
            dom = this.dom(),
            start = -.5 * Math.PI,
            end = this._skillValues[chart.value()],
            dims = chart.outerDims(),
            x = dims.x(),
            y = dims.y(),
            radius = x / 2,
            gradient = context.createRadialGradient(radius/2, radius/2, 2, radius, radius, radius);

        dom.width = x;
        dom.height = y;

        gradient.addColorStop(0, "#afa");
        gradient.addColorStop(.7, "#3a3");
        gradient.addColorStop(1.0, "#0a0");

        function display(value) {

            context.clearRect(0, 0, x, y);

            context.beginPath();
            context.strokeStyle = "#ccc";
            context.arc(radius, radius, radius, 0, 2 * Math.PI);
            context.closePath();
            context.stroke();

            context.beginPath();
            context.fillStyle = gradient;
            context.arc(radius, radius, radius, start, value);
            context.lineTo(radius, radius);
            context.fill();
            context.closePath();
        }
        $.tween(display, start, end, $.anime.algorithms.ease.linear(.3))
            .onEnd(function(){ display(end); })
            .start();

        return this;
    },
    _skillValues: [ -.5 * Math.PI, 0, .5 * Math.PI, Math.PI, 1.5 * Math.PI ]
}
$.ext(circlePerspective, abstractPerspective);
$.circlePerspective = function(){ return new circlePerspective(); }

function inputPerspective(){
    inputPerspective.base.call(this, $.create({"input":{}}));
}
inputPerspective.prototype = {
    $draw: function(chart) {
        this.onblur(function(){
                var v = parseInt(this.dom().value),
                    value = (isNaN(v) || v < 0 || v > 4) ? 0 : v;
                chart.value(value).display($.circlePerspective());
            }, this)
            .appendTo(chart)
            .dom().select();
    }
}
$.ext(inputPerspective, abstractPerspective);
$.inputPerspective = function(radius){ return new inputPerspective(radius); }

function rectanglePerspective(){
    rectanglePerspective.base.call(this, $.create({"canvas":{}}));
    this._context = this.dom().getContext("2d");
}
rectanglePerspective.prototype = {
    $draw: function(chart){
        var context = this._context,
            value = chart.value(),
            dims = chart.outerDims(),
            dom = this.dom(),
            x = dims.x(),
            y = dims.y(),
            color;

        switch (value) {
            case 1: color = "#cfc"; break;
            case 2: color = "#8c8"; break;
            case 3: color = "#6b6"; break;
            case 4: color = "#080"; break;
            default: color = "#fff"; break;
        }

        dom.width = x;
        dom.height = y;

        context.clearRect(0, 0, x, y);

        context.beginPath();
        context.strokeStyle = "#ccc";
        context.rect(0, 0, x, y);
        context.closePath();
        context.stroke();

        context.beginPath();
        context.fillStyle = color
        context.rect(0, 0, x, y);
        context.closePath();
        context.fill();
    }
}
$.ext(rectanglePerspective, abstractPerspective);
$.rectanglePerspective = function(){ return new rectanglePerspective(); }

})($);
(function($){
if(!$) $ = {};


function media(dom) {
    media.base.call(this, dom);

    this._onPlayheadChanged = $.observer();

    this._addEvent("timeupdate", function() { this._onPlayheadChanged.notify(this); }, this, $.uid());
}
media.prototype = {
    play: function(value) { this._dom.play(); return this; },
    pause: function() { this._dom.pause(); return this; },
    load: function()  { this._dom.load(); return this; },

    duration: function() { return this._dom.duration; },
    remaining: function() { return this.duration() - this.playhead()},
    playhead: function(seconds) {
        if(!$.exists(seconds)) return this._dom.currentTime;
        this._dom.currentTime = seconds;
        return this;
    },

    onPlayheadChanged: function(m, s){
        this._onPlayheadChanged.add(m, s);
        return this;
    }
}
$.ext(media, $.sprite.Class);
$.media = function(dom) { return new media(dom); }





})($);
