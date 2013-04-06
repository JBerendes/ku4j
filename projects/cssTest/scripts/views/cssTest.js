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