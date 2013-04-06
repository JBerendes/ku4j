dndState.dropped = function(){
    dndState.dropped.base.call(this, dndState);
}

dndState.dropped.prototype = {
    grab: function(e){
        $.evt.mute(e);
        var context = this.context(),
            periph = $.touch().canRead(e) ? $.touch() : $.mouse(),
            hitCoord = periph.documentCoord(e)
                        .subtract(context.offset());

        context.document()
            .ontouchmove(context.drag, context, $.uid())
            .ontouchend(context.drop, context, $.uid())
            .onmousemove(context.drag, context, $.uid())
            .onmouseup(context.drop, context, $.uid());

        context
            .disableSelect()
            .addClass("ku-dragger-grabbed")
            .hitSize(context.outerDims())
            .hitCoord(hitCoord)
            .hitOffset(context.offset())
            .hitScrollOffset(context.scrollOffset())
            .hitBoundedOffet(context.boundedOffset())
            .actor().to(context.dragCoord(e));

        this.state("grabbed");
    },
    drag: function(){ return; },
    drop: function(){ return; }
}
$.ext(dndState.dropped, $.abstractState);