$(function(){
    function notOk(s, m) {equal(s,false,m);}
    module("tooltip");
    test("create", function() {
        ok($.pieChart());
    });
});