$(function(){
    module("toggle Test");
    test("create", function() {
        expect(4);
        ok($.toggle());
        ok($.toggle(true));
        ok($.toggle(true, null, null));
        ok($.toggle(true, null, "myValue"));
    });
    
    test("methods", function(){
        var toggle = $.toggle();
        equal(toggle.isActive(), false);
        
        toggle.onActive(function(){ ok(true, "addOnActive"); })
        toggle.onActive(function(){ ok(true, "addOnInactive"); })
        
        equal(toggle.isActive(), false);
        
        ok(toggle.isActive(true));
        ok(toggle.isActive(false));
    });
});