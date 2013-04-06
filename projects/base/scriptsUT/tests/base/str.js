$(function(){
    
    module("str Test");
    test("build", function() {
        expect(5);
        equal($.str.build(null), "null");
        equal($.str.build(undefined), "undefined");
        equal($.str.build("","",""), "");
        equal($.str.build(" "," "," "), "   ");
        equal($.str.build("a","b","c"), "abc");
    });
    
    test("format", function() {
        expect(5);
        equal($.str.format(null), null);
        equal($.str.format(undefined), undefined);
        equal($.str.format(""), "");
        equal($.str.format("{0}{1}{2}","1","2","3"), "123");
        equal($.str.format("{0}{0}{1}","1","2","3"), "112");
    });
    
    test("trimStart", function() {
        expect(4);
        raises(function() { $.str.trimStart(null); });
        raises(function() { $.str.trimStart(undefined); });
        equal($.str.trimStart(""), "");
        equal($.str.trimStart(" string"), "string");
    });
    
    test("trimEnd", function() {
        expect(4);
        raises(function() { $.str.trimEnd(null); });
        raises(function() { $.str.trimEnd(undefined); });
        equal($.str.trimEnd(""), "");
        equal($.str.trimEnd("string "), "string");
    });
    
    test("trim", function() {
        expect(4);
        raises(function() { $.str.trim(null); });
        raises(function() { $.str.trim(undefined); });
        equal($.str.trim(""), "");
        equal($.str.trim(" string "), "string");
    });

});