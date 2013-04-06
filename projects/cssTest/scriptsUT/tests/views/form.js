$(function() {
    function notOk(s, m) { equal(s, false, m); }

    module("cssTest.views.form");

    var loadField = $.ele("loadField"),
        suiteField = $.ele("suiteField"),
        message = "message";

    test("create", function() {
        ok(new cssTest.views.form(loadField, suiteField, message));
    });

    var form = new cssTest.views.form(loadField, suiteField, message);

    test("read/write", function() {
        $("#loadField").val("url");
        $("#suiteField").val("one");

        var dto = form.read();
        equal(dto.find("load"), "url");
        equal(dto.find("suite"), "one");
    });
    test("notify", function() {
        var msg = "My notification.";

        form.notify(msg);
        equal($("#" + message).html(), msg);
    });
    test("clear", function() {
        form.clear();

        var dto = form.read(),
            b = $.ku.browser();
        if(b.isFirefox || b.isSafari) {
            equal(dto.find("load"), "");
            equal(dto.find("suite"), "one");
        }
        else {
            equal(dto.find("load"), "");
            equal(dto.find("suite"), "");
        }

    });
});