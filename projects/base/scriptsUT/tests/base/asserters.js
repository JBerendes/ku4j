$(function(){
    function notOk(s, m) {equal(s,false,m);} 
    module("Asserter Test");
    test("isArray", function() {
        expect(2);
        ok($.isArray([]));
        ok($.isArray(new Array()));
    });
    
    test("isNotArray", function() {
        expect(13);
        notOk($.isArray(null));
        notOk($.isArray(undefined));
        notOk($.isArray(true));
        notOk($.isArray(false));
        notOk($.isArray(""));
        notOk($.isArray(new String()));
        notOk($.isArray(0));
        notOk($.isArray(new Number()));
        notOk($.isArray(new Date()));
        notOk($.isArray({}));
        notOk($.isArray(new Object()));
        notOk($.isArray(function() { } ));
        notOk($.isArray(new Function()));
    });
    
    test("isBool", function() {
        expect(2);
        ok($.isBool(true));
        ok($.isBool(false));
    });
    
    test("isNotBool", function() {
        expect(13);
        notOk($.isBool(null));
        notOk($.isBool(undefined));
        notOk($.isBool([]));
        notOk($.isBool(new Array()));
        notOk($.isBool(""));
        notOk($.isBool(new String()));
        notOk($.isBool(0));
        notOk($.isBool(new Number()));
        notOk($.isBool(new Date()));
        notOk($.isBool({}));
        notOk($.isBool(new Object()));
        notOk($.isBool(function() { } ));
        notOk($.isBool(new Function()));
    });
    
    test("isDate", function() {
        expect(1);
        ok($.isDate(new Date()));
    });
    
    test("isNotDate", function() {
        expect(14);
        notOk($.isDate(null));
        notOk($.isDate(undefined));
        notOk($.isDate(true));
        notOk($.isDate(false));
        notOk($.isDate([]));
        notOk($.isDate(new Array()));
        notOk($.isDate(""));
        notOk($.isDate(new String()));
        notOk($.isDate(0));
        notOk($.isDate(new Number()));
        notOk($.isDate({}));
        notOk($.isDate(new Object()));
        notOk($.isDate(function() { } ));
        notOk($.isDate(new Function()));
    });

    test("isNumber", function() {
        expect(2);
        ok($.isNumber(0));
        notOk($.isNumber(new Number()));
    });
    
    test("isNotNumber", function() {
        expect(12);
        notOk($.isNumber(null));
        notOk($.isNumber(undefined));
        notOk($.isNumber(true));
        notOk($.isNumber(false));
        notOk($.isNumber([]));
        notOk($.isNumber(new Array()));
        notOk($.isNumber(""));
        notOk($.isNumber(new String()));
        notOk($.isNumber({}));
        notOk($.isNumber(new Object()));
        notOk($.isNumber(function() { } ));
        notOk($.isNumber(new Function()));
    });
    
    test("isObject", function() {
        expect(6);
        ok($.isObject([]));
        ok($.isObject(new Array()));
        ok($.isObject(new String()));
        ok($.isObject(new Number()));
        ok($.isObject({}));
        ok($.isObject(new Object()));
    });
    
    test("isNotObject", function() {
        expect(8);
        notOk($.isObject(null));
        notOk($.isObject(undefined));
        notOk($.isObject(true));
        notOk($.isObject(false));
        notOk($.isObject(""));
        notOk($.isObject(0));
        notOk($.isObject(function() { } ));
        notOk($.isObject(new Function()));
    });
    
    test("isFunction", function() {
        expect(2);
        ok($.isFunction(function() { }));
        ok($.isFunction(new Function()));
    });
    
    test("isNotFunction", function() {
        notOk($.isFunction(null));
        notOk($.isFunction(undefined));
        notOk($.isFunction(true));
        notOk($.isFunction(false));
        notOk($.isFunction([]));
        notOk($.isFunction(new Array()));
        notOk($.isFunction(""));
        notOk($.isFunction(new String()));
        notOk($.isFunction(0));
        notOk($.isFunction(new Number()));
        notOk($.isFunction({}));
        notOk($.isFunction(new Object()));
    });
    
    test("isString", function() {
        expect(2);
        ok($.isString(""));
        ok($.isString(new String()));
    });
    
    test("isNotString", function() {
        notOk($.isString(null));
        notOk($.isString(undefined));
        notOk($.isString(true));
        notOk($.isString(false));
        notOk($.isString([]));
        notOk($.isString(new Array()));
        notOk($.isString(0));
        notOk($.isString(new Number()));
        notOk($.isString({}));
        notOk($.isString(new Object()));
        notOk($.isString(function() { } ));
        notOk($.isString(new Function()));
    });
    
    test("isUndefined", function() {
        expect(1);
        ok($.isUndefined(undefined));
    });
    
    test("isNotUndefined", function() {
        notOk($.isUndefined(null));
        notOk($.isUndefined(true));
        notOk($.isUndefined(false));
        notOk($.isUndefined([]));
        notOk($.isUndefined(new Array()));
        notOk($.isUndefined(""));
        notOk($.isUndefined(new String()));
        notOk($.isUndefined(0));
        notOk($.isUndefined(new Number()));
        notOk($.isUndefined({}));
        notOk($.isUndefined(new Object()));
        notOk($.isUndefined(function() { } ));
        notOk($.isUndefined(new Function()));
    });
    
    test("isEmpty", function() {
        expect(4);
        ok($.isNullOrEmpty(null));
        ok($.isNullOrEmpty(undefined));
        ok($.isNullOrEmpty(""));
        ok($.isNullOrEmpty(new String()));
    });
    
    test("isNotEmpty", function() {
        expect(7);
        notOk($.isNullOrEmpty("null"));
        notOk($.isNullOrEmpty("undefined"));
        notOk($.isNullOrEmpty(" "));
        notOk($.isNullOrEmpty("a"));
        notOk($.isNullOrEmpty(" a "));
        notOk($.isNullOrEmpty("1"));
        notOk($.isNullOrEmpty(" 1 "));
    });
    
    test("isNullOrEmpty", function() {
        expect(4);
        ok($.isNullOrEmpty(null));
        ok($.isNullOrEmpty(undefined));
        ok($.isNullOrEmpty(""));
        ok($.isNullOrEmpty(new String()));
    });
    
    test("isNotNullOrEmpty", function() {
        expect(11);
        notOk($.isNullOrEmpty(true));
        notOk($.isNullOrEmpty(false));
        notOk($.isNullOrEmpty([]));
        notOk($.isNullOrEmpty(new Array()));
        notOk($.isNullOrEmpty(0));
        notOk($.isNullOrEmpty(new Number()));
        notOk($.isNullOrEmpty(new Date()));
        notOk($.isNullOrEmpty({}));
        notOk($.isNullOrEmpty(new Object()));
        notOk($.isNullOrEmpty(function() { } ));
        notOk($.isNullOrEmpty(new Function()));
    });
    
    test("exists", function() {
        expect(12);
        ok($.exists(true));
        ok($.exists(false));
        ok($.exists([]));
        ok($.exists(new Array()));
        ok($.exists(""));
        ok($.exists(new String()));
        ok($.exists(0));
        ok($.exists(new Number()));
        ok($.exists({}));
        ok($.exists(new Object()));
        ok($.exists(function() { } ));
        ok($.exists(new Function()));
    });
    
    test("notExists", function() {
        expect(2);
        notOk($.exists(null));
        notOk($.exists(undefined));
    });
    
    test("xor", function() {
        expect(2);
        ok($.xor(true, false));
        ok($.xor(false, true));
    });
    
    test("xor", function() {
        expect(2);
        notOk($.xor(false, false));
        notOk($.xor(true, true));
    });
});