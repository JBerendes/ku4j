$.math = {
    round: function(n, d){
        var p = d || 0,
            m = Math.pow(10, -p);
        return Math.round(parseFloat((n * m).toFixed(Math.abs(p)))) / m;
    },
    roundUp: function(n, d){
        var p = d || 0,
            r = 5 * (Math.pow(10, p - 1));
        return $.math.round(n + r, d);
    },
    roundDown: function(n, d){
        var p = d || 0,
            r = 5 * (Math.pow(10, p - 1));        
        return $.math.round(n - r, d);
    },
    factorial: function(n){
        var v = n, i = n;
        while(i--) if(!!i) v *= i;
        return v;
    },
    divide: function(a, b){
        var isValid = $.isNumber(a) && $.isNumber(b) && !$.isZero(b); 
        if(!isValid)
            throw new Error($.str.format("Invalid division. value: {0}/{1} | type: {2}/{3}",
                                         a, b, typeof a, typeof b));
        return a / b;
    }
}