$(function() {
    function notOk(s, m) { equal(s, false, m); }
    
    module("cssTest.model.cssTest");

    var suite1 = (new cssTest.model.testing.suite()).name("one")
                    .test(".test-dom", { "top":"10px" }, "A"),
        suite2 = (new cssTest.model.testing.suite()).name("two")
                    .test(".test-dom", { "color":"#000" }, "C")
                    .test(".test-dom", { "font-size":"12px" }, "D"),
        plan = (new cssTest.model.testing.testPlan())
                    .add(suite1).add(suite2);

    test("create", function() {
        ok(new cssTest.model.cssTest());
        ok(new cssTest.model.cssTest(plan));
    });

    var myCssTest = new cssTest.model.cssTest(plan);

    test("suite", function() {
        myCssTest.suite("one");
        equal(myCssTest.currentSuite().name(), "one");

        myCssTest.suite("two");
        equal(myCssTest.currentSuite().name(), "two");

        myCssTest.suite("three");
        equal(myCssTest.currentSuite().name(), "three");
    });
    test("test", function() {
        myCssTest.suite("one");

        var currentSuite = myCssTest.currentSuite();

        equal(currentSuite.testCount(), 1);
        myCssTest.suite("one").test(".test-dom", { "position":"absolute" }, "B");

        equal(currentSuite.testCount(), 2);
    });

    test("load", function() {
        myCssTest.onLoad(function(){
            ok(true, "cssTest.onLoad");
        });
        myCssTest.load("stubs/testSuite.js");
    });
    test("run/onRunComplete", function() {
        myCssTest.onRunComplete(function(results){
            ok(true, "cssTest.onRunComplete");
        });
        myCssTest.run("one");
    });
});