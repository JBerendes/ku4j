$(function() {
    function notOk(s, m) { equal(s, false, m); }

    module("cssTest.views.results");

    var indicator = $.ele("indicator"),
        resultsList = $.ele("resultList");

    test("create", function() {
        ok(new cssTest.views.results(indicator, resultsList));
    });

    var results = new cssTest.views.results(indicator, resultsList);

    test("indicate", function() {
        results.indicate(80);
        equal($.dom(indicator).html(), "80");
    });
    test("display", function() {
        var list = $.list()
                .add(new cssTest.model.capabilities.result())
                .add(new cssTest.model.capabilities.result());

        results.display(list);
        equal($.dom(resultsList).html(), "<div class=\"cssTest-result-label\"><div>undefined</div></div><div class=\"cssTest-result-label\"><div>undefined</div></div>");
    });
});