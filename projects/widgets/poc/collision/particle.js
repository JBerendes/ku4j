function particle(dom){
    particle.base.call(this, dom);
}
particle.prototype = {

}
$.ext(particle, $.sprite.Class);
$.particle = function(dom){ return new particle(dom); }