$(function(){
    function notOk(s, m) {equal(s,false,m);}
    
    module("clearNode Test");
    var node = $.ele("node");
    
    test("null|undefined|empty", function() {
        $.clearNode(null);
        $.clearNode(undefined)
        $.clearNode("");
        
       ok(!$.isNullOrEmpty(node.innerHTML));
    });
    
    test("string|node", function() {
        $.clearNode("node");
        ok($.isNullOrEmpty(node.innerHTML));
        
        node.innerHTML = "node";
        ok(!$.isNullOrEmpty(node.innerHTML));
       
        $.clearNode(node);
        ok($.isNullOrEmpty(node.innerHTML));
    });
});