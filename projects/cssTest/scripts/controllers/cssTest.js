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