function cell(dom, cIdx, cKey, rIdx, rKey, value) {
    cell.base.call(this, dom);
    this.id($.uid("jsx-cell"))
        .cIdx(cIdx)
        .cKey(cKey)
        .rIdx(rIdx)
        .rKey(rKey)
        .value(value);
}
cell.prototype = {
    id: function(id){ return this.property("id", id); },
    value: function(value){ return this.property("value", value); },
    cIdx: function(cIdx){
        if($.exists(cIdx)) this.dom().cIdx = cIdx;
        return this.property("cIdx", cIdx);
    },
    rIdx: function(rIdx){
        if($.exists(rIdx)) this.dom().rIdx = rIdx;
        return this.property("rIdx", rIdx);
    },
    cKey: function(cKey){
        if($.exists(cKey)) this.dom().cKey = cKey;
        return this.property("cKey", cKey);
    },
    rKey: function(rKey){
        if($.exists(rKey)) this.dom().rKey = rKey;
        return this.property("rKey", rKey);
    }
}
$.ext(cell, $.dom.Class);
$.cell = function(dom, cIdx, cKey, rIdx, rKey, value){
    return new cell(dom, cIdx, cKey, rIdx, rKey, value);
}
$.cell.Class = cell;