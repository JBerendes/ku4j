$(function(){
    function notOk(s, m) {equal(s,false,m);} 
    module("tooltip");
    test("create", function() {
        ok($.tooltip());
    });
    
    var tooltip = $.tooltip(),
        dom = $("#dom")[0];
        
    test("properties", function() {
        //pointer
        //tooltip.pointer($.create({div:{}, content:"pointer"}));
        tooltip.message("content").show().rightOf(dom)
        //overlap0
        //strategy
        //message
        //context
            
        //center
        //leftJustify
        //rightJustify
    });
    
    test("methods", function() {
        //show
        //hide
        //above
        //below
        //leftOf
        //rightOf
    });
});