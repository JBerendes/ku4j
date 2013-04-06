$(function(){
    module("uid Test");
    test("create", function() {
        expect(2);
        ok(/uid\d+/.test($.uid()));
        ok(/myID\d+/.test($.uid("myID")));
    });
});