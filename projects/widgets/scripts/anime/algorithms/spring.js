var spring = function(spring, mu){
    this._spring = spring || .4;
    this._mu = mu || .6;
}
spring.prototype = {
    calculate: function(current, end, velocity){
        var spring = this._spring,
            v = velocity,
            mu = this._mu,
            distance = end - current,
            acceleration = distance * spring;
            
        v += acceleration;
        v *= mu;
        return v;
    }
}
$.anime.algorithms.spring = function(force, mu){
    return new spring(force, mu);
}