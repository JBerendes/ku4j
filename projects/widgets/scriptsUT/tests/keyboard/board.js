$(function(){
    function notOk(s, m) {equal(s,false,m);}

    module("key Test");

    test("create", function() {
        ok($.onScreenKeyboard());
    });
});