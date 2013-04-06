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