$.ku.equations = {
    cycle: function(p, xa, xm, ya, ym){
        return new $.coord(
            this.sin(p.x, xa, xm),
            this.cos(p.y, ya, ym));
    },
    cos: function(n, a, m){
        return n + Math.cos(a) * m;  
    },
    cosH: function(p, a, m){
        return new $.coord(this.cos(p.x, a, m), p.y);
    },
    cosV: function(p, a, m){
        return new $.coord(p.x, this.cos(p.y, a, m));
    },
    sin: function(n, a, m){
        return n + Math.sin(a) * m;  
    },
    sinH: function(p, a, m){
        return new $.coord(this.sin(p.x, a, m), p.y);
    },
    sinV: function(p, a, m){
        return new $.coord(p.x, this.sin(p.y, a, m));
    }
}   