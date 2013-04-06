var dndScreen = function() {
    this._targets = $.hash();
    this._droppers = $.hash();
    this._onHit = $.observer();
    this._lastKnownCoord;

    this._helper = $.sprite($.create({"div":{"class":"ku-dndScreen-helper"}}))
                        .onGrab(function(e) {
                            var periph = $.touch().canRead(e) ? $.touch() : $.mouse();
                            this._lastKnownCoord = periph.documentCoord(e);
                        }, this)
                        .onDrag(function(e) {
                            var periph = $.touch().canRead(e) ? $.touch() : $.mouse();
                            this._lastKnownCoord = periph.documentCoord(e);
                        }, this)
                        .onDrop(function(e){ this._drop(e); }, this);
    this._currentDropper;
}
dndScreen.prototype = {
    addTarget: function(target) {
        this._targets.add(target.id(), target);
        return this;
    },
    removeTarget: function(target) {
        this._targets.remove(target.id(), target);
        return this;
    },
    addDropper: function(dropper) {
        var mouseEventId = $.uid("dropperEvent"),
            touchEventId = $.uid("dropperEvent");

        function action(e){
            this._currentDropper = dropper;
            this.activateHelper(e, dropper);
        }
        dropper
            .mouseEventId(mouseEventId)
            .touchEventId(touchEventId)
            .handle()
            .onmousedown(action, this, mouseEventId)
            .ontouchstart(action, this, touchEventId);

        this._droppers.add(dropper.id(), dropper);
    },
    removeDropper: function(dropper) {
        dropper.handle()
            .removeEvent(dropper.touchEventId())
            .removeEvent(dropper.mouseEventId());
        this._droppers.remove(dropper.id());
    },
    activateHelper: function(e, dropper) {
        this._helper.appendTo(document.body)
            .pinTo(dropper.offset().subtract(dropper.scrollOffset()).add($.window().scrollOffset()))
            .content(dropper.cloneNode())
            .grab(e)
    },
    deactivateHelper: function() {
        this._helper.html("").detach();
        this._currentDropper = undefined;
    },
    clearTargets: function() {
        this._targets.clear();
        return this;
    },
    clearDroppers: function() {
        var droppers = this._droppers;
        droppers.listValues().each(function(dropper){
            this.removeDropper(dropper);
        }, this);
        return this;
    },
    clearAll: function() {
        this.clearTargets().clearDroppers();
        return this;
    },
    clearListeners: function() {
        this._onHit.clear();
        return this;
    },
    onHit: function(f, s) {
        this._onHit.add(f, s);
        return this;
    },
    _drop: function(e){
        var hitTarget = this._findHitTarget(e),
            dropper = this._currentDropper;
        if($.exists(hitTarget) && $.exists(dropper))
            this._onHit.notify(hitTarget, dropper);
        this.deactivateHelper();
    },
    _findHitTarget: function(e){
        var targets = this._targets.listValues(),
            periph = $.touch().canRead(e) ? $.touch() : $.mouse(),
            hitTarget = null,
            coord;

        try { coord = periph.documentCoord(e); }
        catch(e) { coord = this._lastKnownCoord}

        targets.each(function(target){
            if(!target.contains(coord)) return;
            hitTarget = target;
            targets.quit();
        });
        return hitTarget;
    }
}
$.dndScreen = function(){ return new dndScreen(); }