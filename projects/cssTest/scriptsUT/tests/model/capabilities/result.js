$(function() {
    function notOk(s, m) { equal(s, false, m); }
    
    module("cssTest.model.capability.result");
    test("create", function() {
        ok(new cssTest.model.capabilities.result());
    });
    test("isPass", function() {
        var result = new cssTest.model.capabilities.result();
        ok(result.isPass());
        notOk(result.isFail());
    });
    test("isFail", function() {
        var result = new cssTest.model.capabilities.result();
        ok(result.isPass());
        notOk(result.isFail());
        
        result.fail();
        notOk(result.isPass());
        ok(result.isFail());
    });

    var result = new cssTest.model.capabilities.result()
                    .addPassMessage("Pass")
                    .addFailMessage("Fail");
                    
    test("text", function() {
       equal(result.text(), 'Pass\nFail\n');
    });
    test("html", function() {
       equal(result.html(), '<span class="cssTest-pass">Pass</span><span class="cssTest-fail">Fail</span>');
    });
});