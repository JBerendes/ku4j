$(function() {
    function notOk(s, m) { equal(s, false, m); }

    module("cssTest.views.cssTest");

    var testPlan = new cssTest.model.testing.testPlan(),
        model = new cssTest.model.cssTest(testPlan),
        loadField = "loadField",
        suiteField = "suiteField",
        message = "message",
        form = new cssTest.views.form(loadField, suiteField, message),
        indicator = $.ele("indicator"),
        resultsList = $.ele("resultList"),
        results = new cssTest.views.results(indicator, resultsList)

    test("create", function() {
        ok(new cssTest.views.cssTest(model, form, results));
    });

    var view = new cssTest.views.cssTest(model, form, results);

    test("displayResults", function() {
        var results = $.list()
                    .add(new cssTest.model.capabilities.result())
                    .add(new cssTest.model.capabilities.result());

        view.displayResults(results);
        equal($.dom(resultsList).html(), "<div class=\"cssTest-result-label\"><div>undefined</div></div><div class=\"cssTest-result-label\"><div>undefined</div></div>");
    });

    test("clearResults", function() {
        view.clearResults();
        equal($.dom(resultsList).html(), "");
    });
});