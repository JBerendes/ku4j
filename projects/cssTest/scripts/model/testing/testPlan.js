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