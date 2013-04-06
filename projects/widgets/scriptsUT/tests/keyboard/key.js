$(function(){
    function notOk(s, m) {equal(s,false,m);}

    module("key Test");

    test("create", function() {
        raises(function(){$.onScreenKey();});
        ok($.onScreenKey(65));
    });
});