$(function() {
    function notOk(s, m) { equal(s, false, m); }
    
    module("cssTest.model.testing.suite");
    test("create", function() {
        ok(new cssTest.model.testing.suite());
    });

    var suite = new cssTest.model.testing.suite(new cssTest.model.testing.testPlan());

    test("name", function() {
        suite.name("suiteName");
        ok(suite.name(), "suiteName");
    });
    test("test", function() {
        suite.test("#qunit-header", {
            "padding-right": "0px",
            "color": "#8699a4",
            "background-color": "#dd3349",
            "font-weight": "normal",
            "border-bottom-right-radius": "0px",
            "border-bottom-left-radius": "0px"
        }, "myTest");

        suite.execute().results().each(function(result){
            ok(result.isPass());
        })
    });
    //test("execute", function() { });
    //test("results", function() { });
});