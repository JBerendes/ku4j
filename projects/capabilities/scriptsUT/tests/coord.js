$(function(){
    function notOk(s, m) {equal(s,false,m);}
    
    module("coord Test");
    
    test("create", function(){
        raises(function(){ $.coord(null, null); });
        raises(function(){ $.coord(undefined, undefined); });
        raises(function(){ $.coord("", ""); });
        raises(function(){ $.coord("1", "1"); });
        raises(function(){ $.coord("a", "a"); });
        
        ok($.coord(0, 0));
        ok($.coord(1, 1));
        ok($.coord(-1, -1));
    });
    
    var zero = $.coord.zero(),
        pOne = $.coord(1, 1),
        pTwo = $.coord(2, 2),
        nOne = $.coord(-1, -1),
        nTwo = $.coord(-2, -2);
    
    test("equals", function(){ 
        ok(pTwo.equals(pTwo));
        ok(nTwo.equals(nTwo));
        ok(zero.equals(zero));
    });
    test("add", function(){
        ok(pOne.add(pOne).equals(pTwo));
        ok(nOne.add(nOne).equals(nTwo));
        ok(pOne.add(nOne).equals(zero));
    });
    test("subtract", function(){
        ok(pTwo.subtract(pOne).equals(pOne));
        ok(nOne.subtract(nOne).equals(zero));
        ok(pOne.subtract(nOne).equals(pTwo));
    });
    test("multiply", function(){
        ok(pTwo.multiply(pOne).equals(pTwo));
        ok(nTwo.multiply(nOne).equals(pTwo));
        ok(pOne.multiply(zero).equals(zero));
    });
    test("divide", function(){ 
        ok(pTwo.divide(pOne).equals(pTwo));
        ok(nTwo.divide(nOne).equals(pTwo));
        ok(nTwo.divide(pTwo).equals(nOne));
    });
    test("round", function(){
        var nHigh = $.coord(-1.4, -1.4),
            nLow = $.coord(-1.6, -1.6),
            pHigh = $.coord(1.6, 1.6),
            pLow = $.coord(1.4, 1.4);
            
        ok(nHigh.round().equals(nOne));
        ok(nLow.round().equals(nTwo));
        ok(pHigh.round().equals(pTwo));
        ok(pLow.round().equals(pOne));
    });
    test("isAbove", function(){ 
        notOk(pOne.isAbove(zero));
        ok(pOne.isAbove(pTwo));
    });
    test("isBelow", function(){ 
        ok(pOne.isBelow(zero));
        notOk(pOne.isBelow(pTwo));
    });
    test("isLeftOf", function(){ 
        notOk(pOne.isLeftOf(zero));
        ok(pOne.isLeftOf(pTwo));
    });
    test("isRightOf", function(){ 
        ok(pOne.isRightOf(zero));
        notOk(pOne.isRightOf(pTwo));
    });
    test("distanceFrom", function(){
        ok(pTwo.distanceFrom(pOne).equals($.vector(1, 1)));
    });
    test("distanceTo", function(){
        ok(pTwo.distanceTo(pOne).equals($.vector(-1, -1)));
    });
    test("half", function(){
        ok(pTwo.half().equals(pTwo.divide(pTwo)));
    });
    test("value", function(){
        equal(pTwo.value().x, 2);
        equal(pTwo.value().y, 2);
    });
    test("toEm", function(){
        equal(pTwo.toEm().x(), "2em");
        equal(pTwo.toEm().y(), "2em");
    });
    test("toPixel", function(){ 
        equal(pTwo.toPixel().x(), "2px");
        equal(pTwo.toPixel().y(), "2px");
    });
    test("toString", function(){
        equal(pTwo.toString(), "(2,2)");
    });
});