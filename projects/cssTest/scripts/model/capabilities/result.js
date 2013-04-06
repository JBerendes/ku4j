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