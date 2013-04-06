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
