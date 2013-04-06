function dndDragCoordStrategy(context){
    this._context = context;
}
dndDragCoordStrategy.prototype = {
    findCoord: function(e){
        var context = this._context,
            periph = $.touch().canRead(e) ? $.touch() : $.mouse();

        return periph.documentCoord(e)
            .subtract(context.hitCoord())
            .subtract(context.hitOffset())
            .add(context.hitBoundedOffet());
    }
}

function dndSizeCoordStrategy(context){
    this._context = context;
}
dndSizeCoordStrategy.prototype = {
    findCoord: function(e){
        var context = this._context,
            periph = $.touch().canRead(e) ? $.touch() : $.mouse();
        return context.hitSize()
            .add(periph.documentCoord(e)
                    .subtract(context.hitCoord())
                    .subtract(context.hitOffset()));
    }
}

function dndScrollCoordStrategy(context){
    this._context = context;
}
dndScrollCoordStrategy.prototype = {
    findCoord: function(e){
        var context = this._context,
            periph = $.touch().canRead(e) ? $.touch() : $.mouse();

        return context.hitCoord()
            .add(context.hitOffset())
            .subtract(periph.documentCoord(e))
            .add(context.hitScrollOffset());
    }
}