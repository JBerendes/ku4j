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
