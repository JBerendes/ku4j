$(function(){
    
    var True = $.spec(function(v){return v == true;}),
        False = $.spec(function(v){return v == false;});
        
    function notOk(s, m) {equal(s,false,m);} 
    
    module("spec Test");
    test("create", function() {
        expect(1);
        ok($.spec(function(v){return v == true;}));
    });
    
    test("and", function() {
        expect(8);
        ok(True.and(True).isSatisfiedBy(true));
        notOk(True.and(True).isSatisfiedBy(false));
        notOk(False.and(False).isSatisfiedBy(true));
        ok(False.and(False).isSatisfiedBy(false));
        notOk(True.and(False).isSatisfiedBy(true));
        notOk(True.and(False).isSatisfiedBy(false));
        notOk(False.and(True).isSatisfiedBy(true));
        notOk(False.and(True).isSatisfiedBy(false));
    });
    
    test("or", function() {
        expect(8);
        ok(True.or(True).isSatisfiedBy(true));
        notOk(True.or(True).isSatisfiedBy(false));
        notOk(False.or(False).isSatisfiedBy(true));
        ok(False.or(False).isSatisfiedBy(false));
        ok(True.or(False).isSatisfiedBy(true));
        ok(True.or(False).isSatisfiedBy(false));
        ok(False.or(True).isSatisfiedBy(true));
        ok(False.or(True).isSatisfiedBy(false));
    });
    
    test("xor", function() {
        expect(8);
        notOk(True.xor(True).isSatisfiedBy(true));
        notOk(True.xor(True).isSatisfiedBy(false));
        notOk(False.xor(False).isSatisfiedBy(true));
        notOk(False.xor(False).isSatisfiedBy(false));
        ok(True.xor(False).isSatisfiedBy(true));
        ok(True.xor(False).isSatisfiedBy(false));
        ok(False.xor(True).isSatisfiedBy(true));
        ok(False.xor(True).isSatisfiedBy(false));
    });
    
    test("not", function() {
        expect(4);
        notOk(True.not().isSatisfiedBy(true));
        ok(True.not().isSatisfiedBy(false));
        ok(False.not().isSatisfiedBy(true));
        notOk(False.not().isSatisfiedBy(false));
    });
});