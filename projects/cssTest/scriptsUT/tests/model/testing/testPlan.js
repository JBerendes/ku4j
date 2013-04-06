$(function() {
    function notOk(s, m) { equal(s, false, m); }
    
    module("cssTest.model.testing.testPlan");
    test("create", function() {
        ok(new cssTest.model.testing.testPlan());
    });

    var suite1 = (new cssTest.model.testing.suite()).name("one")
                    .test(".test-dom", { "top":"10px" }, "A")
                    .test(".test-dom", { "position":"absolute" }, "B"),
        suite2 = (new cssTest.model.testing.suite()).name("two")
                    .test(".test-dom", { "color":"#000" }, "C")
                    .test(".test-dom", { "font-size":"12px" }, "D");

    test("add", function() {
        var testPlan = (new cssTest.model.testing.testPlan()).add(suite1).add(suite2);
        equal(plan.listSuites().count(), 2);
    });

    var plan = (new cssTest.model.testing.testPlan()).add(suite1).add(suite2);

    test("findSuite", function() {
        var suiteTest1 = plan.findSuite("one"),
            suiteTest2 = plan.findSuite("two");

        equal(suiteTest1.name(), "one");
        equal(suiteTest2.name(), "two");
    });

    test("listSuites", function() {
        equal(plan.listSuites().count(), 2);
    });
    test("run", function() {
        plan.run("one").each(function(result){
            ok(result.isPass());
        });

        plan.run("two").each(function(result){
            ok(result.isFail());
        });
    });
});