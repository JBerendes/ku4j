function projectile(dom){
    projectile.base.call(this, dom);
    this._velocityId = $.uid("projectile");
    this._flyId = $.uid("projectile");
    
    this.gravity($.vector(0, .5))
        .friction(.98)
        .velocity($.vector.zero())
        .lowerBound($.coord.zero())
        .upperBound($.window.dims())
        .lastCoord(this.offset())
        .onDrop(function(){ projectile_toss(this, this._velocityId, this._flyId); }, this)
        .onGrab(function(){
            this.velocity($.vector.zero());
            $.timeline().remove(this._flyId)
                .add(function(){ projectile_calculateVelocity(this); }, this, this._velocityId);
        }, this);
}
projectile.prototype = {
    gravity: function(gravity){ return this.property("gravity", gravity); },
    friction: function(friction){ return this.property("friction", friction); },
    velocity: function(velocity){ return this.property("velocity", velocity); },
    lowerBound: function(lowerBound){ return this.property("lowerBound", lowerBound); },
    upperBound: function(upperBound){ return this.property("upperBound", upperBound); },
    lastCoord: function(lastCoord){ return this.property("lastCoord", lastCoord); },
    stop: function(){ $.timeline().remove(this._velocityId).remove(this._flyId); return this; }
}
$.ext(projectile, $.sprite.Class);
$.projectile = function(dom){ return new projectile(dom); }

function projectile_calculateVelocity(projectile){
        projectile.velocity(projectile.offset().distanceFrom(projectile.lastCoord()));
        projectile.lastCoord(projectile.offset());
}
function projectile_toss(projectile, vid, fid){
    $.timeline().remove(vid).add(function(){ projectile_fly(this); }, projectile, fid);
}
function projectile_fly(projectile){
    var v = projectile.velocity(),
        o = projectile.boundedOffset(),
        d = projectile.outerDims(),
        od = o.add(d),
        lower = projectile.lowerBound(),
        upper = projectile.upperBound(),
        hitsX = (o.isAbove(lower) && (v.y() <= 0)) || (od.isBelow(upper) && (v.y() >= 0)),
        hitsY = (o.isLeftOf(lower) && (v.x() <= 0)) || (od.isRightOf(upper) && (v.x() >= 0)),
        hitFriction = (hitsX || hitsY) ? .8 : 1,
        reflection = hitsX ? $.vector(0, 1) : hitsY ? $.vector(1, 0) : $.vector.zero(),
        vel = v.add(projectile.gravity()).scale(projectile.friction()).scale(hitFriction).reflect(reflection),
        isMoving = vel.magnatude() > 1 || o.isAbove(upper.add(d).add($.coord(0, 10))),
        velocity = isMoving ? vel : $.vector.zero(),
        pos = isMoving ? o.add(velocity) : $.coord(o.x(), upper.subtract(d).y());
    
    projectile.velocity(velocity).pinTo(pos);
}