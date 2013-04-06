var abstractSheet = function(dom, localization) {
    abstractSheet.base.call(this, dom);

    this.localization(localization);
    this._onSelect = $.observer();
}
abstractSheet.prototype = {
    $findCell: function(dayPoint){ return null; },
    localization: function(localization) {
        return this.property("localization", localization);
    },
    each: function(f, s) { this.$sheet.listCells().each(f, s); return this; },
    findCell: function(dayPoint){ return this.$findCell(dayPoint); },
    selectCell: function(cell){
        if(!$.exists(cell)) return this;
        this._onSelect.notify(cell);
        return this;
    },
    select: function(dayPoint) {
        return this.selectCell(this.findCell(dayPoint));
    },
    onSelect: function(f, s) { this._onSelect.add(f, s); return this; },
    destroy: function() {
        this.$sheet.listCells().each(function(cell){
            if($.exists(cell.deallocate)) cell.deallocate();
            cell.clearEvents();
            return this;
        });
    }
}
$.ext(abstractSheet, $.dom.Class);