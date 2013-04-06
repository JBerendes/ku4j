$(function() {
    function notOk(s, m) { equal(s, false, m); }
    
    module("cssTest.model.capability.test");
    test("create", function() {
        raises(function(){ new cssTest.model.testing.test(); });
        raises(function(){ new cssTest.model.testing.test(null, null, null); });
        raises(function(){ new cssTest.model.testing.test(undefined, undefined, undefined); });
        raises(function(){ new cssTest.model.testing.test("", "", ""); });
        
        raises(function(){ new cssTest.model.testing.test(null, { "top":"10px" }, "name"); });
        ok(new cssTest.model.testing.test(".test-dom", null, "name"));
        ok(new cssTest.model.testing.test(".test-dom", { "top":"10px" }, null));
        ok(new cssTest.model.testing.test(".test-dom", { "top":"10px" }));
        
        raises(function(){ new cssTest.model.testing.test(undefined, { "top":"10px" }, "name"); });
        ok(new cssTest.model.testing.test(".test-dom", undefined, "name"));
        ok(new cssTest.model.testing.test(".test-dom", { "top":"10px" }, undefined));
        ok(new cssTest.model.testing.test(".test-dom", { "top":"10px" }));
        
        raises(function(){ new cssTest.model.testing.test("", { "top":"10px" }, "name"); });
        ok(new cssTest.model.testing.test(".test-dom", "", "name"));
        ok(new cssTest.model.testing.test(".test-dom", { "top":"10px" }, ""));
        ok(new cssTest.model.testing.test(".test-dom", { "top":"10px" }));
        
        ok(new cssTest.model.testing.test(".test-dom", { "top":"10px" }, "name"));
    });
    
    var myTest = new cssTest.model.testing.test(".test-dom", { "top":"10px" }, "name");
    test("name", function() {
        equal(myTest.name(), "name");
    });
    test("evaluate", function() {
        equal(myTest.result(), undefined);
        
        myTest.evaluate();
        notEqual(myTest.result(), undefined);
    });
    test("result", function() {
        var result = myTest.result();
        ok(result);
        ok(result.isPass());
        notOk(result.isFail());
    });
});