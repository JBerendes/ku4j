dndState.grabbed = function(){
    dndState.grabbed.base.call(this, dndState);
}

dndState.grabbed.prototype = {
    grab: function(){ return; },
    drag: function(e){
        $.evt.mute(e);
        var context = this.context();
        context.actor().to(context.dragCoord(e));
        this.context().redraw();
    },
    drop: function(e){
        this.context()
            .enableSelect()
            .removeClass("ku-dragger-grabbed")
            .document().clearEvents();

        this.state("dropped");
    }
}
$.ext(dndState.grabbed, $.abstractState);