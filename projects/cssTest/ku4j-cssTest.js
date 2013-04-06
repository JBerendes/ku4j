(function($){
if(!$) $ = {};
cssTest = {
    model:{
        capabilities:{ },
        testing:{ }
    },
    persistence: { },
    views:{ },
    controllers:{ }
}

cssTest.controllers.cssTest = function(model, view){
    this._model = model;
    this._view = view.controller(this);
}
cssTest.controllers.cssTest.prototype = {
    //Methods called by XSS scripts
    suite: function(name){
        this._model.suite(name);
        return this;
    },
    test: function(selector, tests, name) {
        return this._model.test(selector, tests, name);
        return this;
    },
    run: function(){
        this._model.run(this._view.readSuite());
    },

    //Methods called by application scripts
    load: function(uri){
        this._model.load(this._view.readUri());
        return this;
    },
    clear: function(){
        this._view.clear();
        return this;
    },
    save: function(){
        this._model.save();
        return this;
    },
    close: function() {
        cssTest.controllers = null;
        this._model.close();
        return this;
    }
}

cssTest.model.capabilities.result = function(){
    cssTest.model.capabilities.result.base.call(this);
    this._type = "pass";
    this._text = "";
    this._html = "";
}
cssTest.model.capabilities.result.prototype = {
    isPass: function(){ return /pass/i.test(this._type); },
    isFail: function(){ return !this.isPass(); },
    fail: function(){ this._type = "fail"; return this; },
    
    text: function(text){ return this.get("text", text); },
    html: function(html){ return this.get("html", html); },
    name: function(name){ return this.property("name", name); },
    
    addPassMessage: function(msg){
        this._addMessage(msg, $.str.format('<span class="cssTest-pass">{0}</span>', msg));
        return this;
    },
    addFailMessage: function(msg){
        this._addMessage(msg, $.str.format('<span class="cssTest-fail">{0}</span>', msg));
        return this;
    },
    _addMessage: function(text, html){
        this._text += text + "\n";
        this._html += html;
    }
}
$.ext(cssTest.model.capabilities.result, $.Class);

cssTest.model.cssTest = function(testPlan){
    this._onSuiteSet = $.observer();
    this._onSuiteAdded = $.observer();
    this._onLoad = $.observer();
    this._onRunComplete = $.observer();
    this._onClose = $.observer();
    this._onError = $.observer();

    this._testPlan = testPlan;
    this._currentSuite;
}
cssTest.model.cssTest.prototype = {
    currentSuite: function(){ return this.get("currentSuite"); },
    suite: function(name) {
        var plan = this._testPlan,
            aSuite = plan.findSuite(name),
            aSuiteExists = $.exists(aSuite),
            suite = (aSuiteExists) ? aSuite : (new cssTest.model.testing.suite()).name(name);

        if(!aSuiteExists) {
            this._testPlan.add(suite);
            this._onSuiteAdded.notify(suite);
        }
        this._currentSuite = suite;
        this._onSuiteSet.notify(suite);
        return this;
    },
    test: function(selector, test , name){
        var suite = this._currentSuite;
        if(!$.exists(suite)) $.exception("null", $.str.format("Current suite is {0}", typeof this._currentSuite));
        suite.test(selector, test , name);
        return this;
    },
    load: function(uri){
        if($.isNullOrEmpty(uri)) {
            this._onError.notify("Enter a path to or location of a test suite");
            return this;
        }
        $.service().xss().uri(uri).call();
        this._onLoad.notify(uri);
        return this;
    },
    run: function(suiteName){
        var results = this._testPlan.run(suiteName);
        this._onRunComplete.notify(results);
        return this;
    },
    close: function(){
        cssTest.model = null;
        CSSTESTLOADED = false;
        this._onClose.notify();
    },
    onSuiteSet: function(f, s){ this._onSuiteSet.add(f, s); return this; },
    onLoad: function(f, s){ this._onLoad.add(f, s); return this; },
    onSuiteAdded: function(f, s){ this._onSuiteAdded.add(f, s); return this; },
    onRunComplete: function(f, s){ this._onRunComplete.add(f, s); return this; },
    onClose: function(f, s){ this._onClose.add(f, s); return this; },
    onError: function(f, s){ this._onError.add(f, s); return this; }
}
$.ext(cssTest.model.cssTest, $.Class)

cssTest.model.testing.suite = function(){
    cssTest.model.testing.suite.base.call(this);
    this._tests = $.list();
    this._results;
}
cssTest.model.testing.suite.prototype = {
    name: function(name){ return this.property("name", name); },
    testCount: function(){ return this._tests.count(); },
    results: function(){ return this._results; },
    test: function(selector, properties, name){
        this._tests.add(new cssTest.model.testing.test(selector, properties, name))
        return this;
    },
    execute: function(){
        var results = $.list();
        this._tests.each(function(test){
            results.add(test.evaluate().result());
        });
        this._results = results;
        return this;
    }
}
$.ext(cssTest.model.testing.suite, $.Class);

cssTest.model.testing.test = function(selector, properties, name){
    cssTest.model.testing.test.base.call(this);
    var node = $(selector)[0];
    if(!$.exists(node)) throw $.exception("arg", $.str.format("Test cannot find node with selector: {0}", selector));
    
    this._dom = $.dom(node);
    this._properties = $.hash(properties);
    this._name = name || $.uid("cssTest-test");
    this._result;
}
cssTest.model.testing.test.prototype = {
    name: function(){ return this._name; },
    result: function(){ return this._result; },
    evaluate: function(){
        var dom = this._dom,
            result = new cssTest.model.capabilities.result().name(this._name || $.uid("test"));
        
        this._properties.each(function(prop){
            var test = (cssTest_isOffsetTest(prop))
                        ? cssTest_testOffset(dom, prop, name)
                        : (cssTest_isDimensionTest(prop))
                            ? cssTest_testDimensions(dom, prop, name)
                            : cssTest_testStyle(dom, prop, name);
                            
            if(!test.result) result.fail().addFailMessage(test.message);
            else result.addPassMessage(test.message);
        });
        this._result = result;
        return this;
    }     
},
$.ext(cssTest.model.testing.test, $.Class);

function cssTest_isOffsetTest(prop){ return /^(top|left)$/i.test(prop.key); }
function cssTest_isDimensionTest(prop){ return /^(width|height)$/i.test(prop.key); }

function cssTest_testOffset(dom, prop, name){
    var offset = dom.offset().toPixel(),
        actual = (/left/i.test(prop.key)) ? offset.x() : offset.y();
    return cssTest_test(actual, prop, name);
}
function cssTest_testDimensions(dom, prop, name){
    var dims = dom.innerDims().toPixel(),
        actual = (/width/i.test(prop.key)) ? dims.x() : dims.y();
    return cssTest_test(actual, prop, name);
}
function cssTest_testStyle(dom, prop, name){
    var actual = dom.style(prop.key);
    
    if(/^font\-family$/i.test(prop.key)) actual = actual.replace(/"/g, "").split(",")[0];
    if(/color/i.test(prop.key)) actual = (function(){
        var v = dom.style(prop.key).replace(/[^\d,]/g,"").split(",");
        return (v.length == 3) ? $.color(v[0], v[1], v[2]).toCSS() : v;
    })();
    
    return cssTest_test(actual, prop, name);
}
function cssTest_test(actual, prop, name){
    var test = {};
    test.result = prop.value == actual;
    test.message = test.result
            ? cssTest_testPass(prop.key, prop.value, actual, name)
            : cssTest_testFail(prop.key, prop.value, actual, name);
    return test;
}
function cssTest_testPass(property, expected, actual, name){
    return cssTest_createMessage("PASS", property, expected, actual, name);
}
function cssTest_testFail(property, expected, actual, name){
    return cssTest_createMessage("FAIL", property, expected, actual, name);
}
function cssTest_createMessage(type, property, expected, actual){
    var act = (actual == "") ? "(empty)" : actual
    return $.str.format("{0} | {1}:{2}. Expected: {3}", type, property, act, expected);
}

cssTest.model.testing.testPlan = function(){
    this._suites = $.dto();
}
cssTest.model.testing.testPlan.prototype = {
    findSuite: function(name){  return this._suites.find(name); },
    listSuites: function(){ return this._suites.listValues(); },
    add: function(suite){
        this._suites.add(suite.name(), suite);
        return this;
    },
    run: function(suiteName){
        var suite = this._suites.find(suiteName);
        return ($.exists(suite))
            ? suite.execute().results()
            : null;
    }
}
$.ext(cssTest.model.testing.testPlan, $.Class);

cssTest.persistence.cache = function(model){
    this._name = "CSSTEST_CACHE";
    this._dto = $.dto.serialize(this._name) || $.dto().name(this._name);
    this._model = model
        .onLoad(this.save, this);
}
cssTest.persistence.cache.prototype = {
    listUris: function(){ return this._dto.listValues(); },
    save: function(uri){
        var dto = this._dto;
        dto.add(dto.count() + 1, uri).save();
        return this;
    },
    erase: function(){
        this._dto.erase();
        return this;
    }
}
$.ext(cssTest.persistence.cache, $.Class);

cssTest.views.cssTest = function(model, form, results){
    this._model = model
        .onSuiteAdded(this.addSuite, this)
        .onRunComplete(this.displayResults, this)
        .onClose(this.close, this)
        .onError(this._onError, this);

    this._form = form;
    this._results = results;
}
cssTest.views.cssTest.prototype = {
    controller: function(controller){ return this.set("controller", controller); },
    readUri: function(){ return this._form.read().find("load"); },
    readSuite: function(){ return this._form.read().find("suite"); },
    addSuite: function(suite){
        this._form.addSuite(suite);
    },
    displayResults: function(results){
        this._results.display(results);
        return this;
    },
    clearResults: function(){ return this._results.clear(); },
    close: function(){
        this._form.clear();
        this._results.clear();
        $.dom($(".cssTest-hud")[0]).detach();
        cssTest = null;
    }
}
$.ext(cssTest.views.cssTest, $.Class);

cssTest.views.form = function(loadField, suiteField, message){
    this._select = $.select(suiteField);
    this._form = $.form()
        .add("load", $.field(loadField))
        .add("suite", this._select);

    this._message = $.dom(message);
}
cssTest.views.form.prototype = {
    read: function(){ return this._form.read(); },
    write: function(dto){
        this._form.write(dto);
        return this;
    },
    addSuite: function(suite){
        var name = suite.name();
        this._select.addOption(name, name);
        return this;
    },
    notify: function(message){
        this._message.html(message);
        return this;
    },
    clearMessage: function(){
        this._message.clear();
        return this;
    },
    clear: function(){
        this._form.clear();
        return this.clearMessage();
    }
}


cssTest.views.results = function(indicator, resultsList){
    this._indicator = $.dom(indicator);
    this._resultsList = $.dom(resultsList);
}
cssTest.views.results.prototype = {
    indicate: function(number){
        this._indicator.html(number);
        return this;
    },
    display: function(results){
        var resultsHtml = "";
        this._pass();
        results.each(function(result){
            resultsHtml += '<div class="cssTest-result-label"><div>' + result.name() + "</div>";
            resultsHtml += result.html();
            resultsHtml += "</div>";
            if(result.isFail()) this._fail();
        }, this);
        this._resultsList.html(resultsHtml);
        return this;
    },
    clear: function(){
        this._resultsList.html("");
        return this;
    },
    _pass: function(){
        this._indicator.removeClass("fail");
        this._indicator.addClass("pass");
    },
    _fail: function(){
        this._indicator.removeClass("pass");
        this._indicator.addClass("fail");
    }
}
$.ext(cssTest.views.results, $.Class);

})($);
