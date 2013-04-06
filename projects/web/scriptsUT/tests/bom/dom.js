$(function(){
    function notOk(s, m) {equal(s,false,m);}
    
    module("dom Test");
    
    test("create", function() {
        raises(function(){ $.dom(null) });
        raises(function(){ $.dom(undefined) });
        raises(function(){ $.dom("") });
        raises(function(){ $.dom("nonExistant") });
        
        ok($.dom("node"));
        ok($.dom(document.getElementById("node")));
        ok($.dom($("#node")[0]));
    });
});