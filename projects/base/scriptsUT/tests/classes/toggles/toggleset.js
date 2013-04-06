$(function(){
    function notOk(s, m) {equal(s,false,m);}
    module("toggleset Test");
    
    test("create", function() { ok($.toggleset()); });
    
    var toggleset = $.toggleset(),
        toggle1 = $.toggle().onActive(function(){ testVar = 1; }),
        toggle2 = $.toggle().onActive(function(){ testVar = 2; }),
        toggle3 = $.toggle().onActive(function(){ testVar = 3; }),
        testVar = 0;
    
    test("add", function(){
        toggleset
            .add(toggle1)
            .add(toggle2)
            .add(toggle3);
        
        notOk(toggleset.isEmpty());
    });
    
    test("mutuallyExclusive", function(){
        toggleset.mutuallyExclusive();
        
        toggle1.invoke();
        notOk(toggle2.isActive());
        notOk(toggle3.isActive());
        ok(toggle1.isActive());
        equal(testVar, 1);
        
        toggle2.invoke();
        notOk(toggle1.isActive());
        notOk(toggle3.isActive());
        ok(toggle2.isActive());
        equal(testVar, 2);
        
        toggle3.invoke();
        notOk(toggle1.isActive());
        notOk(toggle2.isActive());
        ok(toggle3.isActive());
        equal(testVar, 3);
    });
    
    test("multipleSelect", function(){
        toggleset.multipleSelect();
        
        toggle1.invoke();
        notOk(toggle2.isActive());
        ok(toggle3.isActive());
        ok(toggle1.isActive());
        equal(testVar, 1);
        
        toggle2.invoke();
        ok(toggle1.isActive());
        ok(toggle3.isActive());
        ok(toggle2.isActive());
        equal(testVar, 2);
        
        toggle3.invoke();
        ok(toggle1.isActive());
        ok(toggle2.isActive());
        notOk(toggle3.isActive());
        equal(testVar, 2);
    });
});