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