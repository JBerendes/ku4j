$(function() {
    function notOk(s, m) { equal(s, false, m); }
    
    module("cssTest.controllers.cssTest");

    var testPlan = new cssTest.model.testing.testPlan(),
        model = new cssTest.model.cssTest(testPlan),
        loadField = "loadField",
        testField = "testField",
        message = "message",
        form = new cssTest.views.form(loadField, testField, message),
        view = new cssTest.views.cssTest(model, form);

    test("create", function() {
        raises(function(){ new cssTest.controllers.cssTest(); });
        raises(function(){ new cssTest.controllers.cssTest(null, null); });
        raises(function(){ new cssTest.controllers.cssTest(undefined, undefined); });
        ok(new cssTest.controllers.cssTest(model, view));
    });

    var controller = new cssTest.controllers.cssTest(model, view);

    //test("load", function() { });
    //test("save", function() { });
    //test("listSuites", function() { });
    //test("clear", function() { });
});