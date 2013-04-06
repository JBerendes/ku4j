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