$(function(){
    function notOk(s, m) {equal(s,false,m);}
    
    module("ele Test");
    
    test("$.ele", function() {
        equal($.ele(""), null);
        equal($.ele(null), null);
        equal($.ele(undefined), null);
        
        ok($.ele("node"));
        ok($.ele(document.getElementById("node")));
    });
});