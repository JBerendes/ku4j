$(function(){
    function notOk(s, m) {equal(s,false,m);}
    
    var class1 = function(prop){ this.property = "property1"; this.prop = prop}
    class1.prototype.method = new function(){ return; }
    
    module("ext Test");
    test("extends", function() {
        expect(4);
        var class2 = function(){
            class2.base.call(this, "prop2");
            this.property = "property2";
        }
        $.ext(class2, class1);
        
        var instance = new class2();
        
        ok(instance instanceof class2);
        ok($.exists(instance.method));
        ok(instance.property == "property2");
        ok(instance.prop == "prop2");
    });
});