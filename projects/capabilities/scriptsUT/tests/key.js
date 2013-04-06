$(function(){
    function notOk(s, m) {equal(s,false,m);}
    
    module("key Test");
    
    var key1 = { which:1, keyCode:1, altKey: false, ctrlKey: false, shiftKey: false },
        key2 = { which:1, keyCode:1, altKey: true, ctrlKey: false, shiftKey: false },
        key3 = { which:1, keyCode:1, altKey: false, ctrlKey: true, shiftKey: false },
        key4 = { which:1, keyCode:1, altKey: false, ctrlKey: false, shiftKey: true },
        key5 = { which:1, keyCode:1, altKey: true, ctrlKey: true, shiftKey: false },
        key6 = { which:1, keyCode:1, altKey: true, ctrlKey: false, shiftKey: true },
        key7 = { which:1, keyCode:1, altKey: false, ctrlKey: true, shiftKey: true },
        key8 = { which:1, keyCode:1, altKey: true, ctrlKey: true, shiftKey: true },
        key9 = { which:2, keyCode:2, altKey: true, ctrlKey: true, shiftKey: true };
    
    test("create", function() {
        ok($.key(1, false, false, false));
        ok($.key(1, true, false, false));
        ok($.key(1, false, true, false));
        ok($.key(1, false, false, true));
        ok($.key(1, true, true, false));
        ok($.key(1, true, false, true));
        ok($.key(1, false, true, true));
        ok($.key(1, true, true, true));
        ok($.key(0, true, true, true));
        
        raises(function(){ $.key(null); });
        raises(function(){ $.key(undefined); });
        raises(function(){ $.key(NaN); });
        raises(function(){ $.key(""); });
        raises(function(){ $.key("A"); });
        raises(function(){ $.key("1"); });
        raises(function(){ $.key([]); });
        raises(function(){ $.key({}); });
        raises(function(){ $.key(function(){}); });
    });
    test("canParse", function() {
        ok($.key.canParse(key1));
        ok($.key.canParse(key2));
        ok($.key.canParse(key3));
        ok($.key.canParse(key4));
        ok($.key.canParse(key5));
        ok($.key.canParse(key6));
        ok($.key.canParse(key7));
        ok($.key.canParse(key8));
        ok($.key.canParse(key9));
        
        notOk($.key.canParse(null));
        notOk($.key.canParse(undefined));
        notOk($.key.canParse(""));
        notOk($.key.canParse([]));
        notOk($.key.canParse({}));
        notOk($.key.canParse(function(){ }));
    });
    test("parse", function() {
        ok($.key.parse(key1));
        ok($.key.parse(key2));
        ok($.key.parse(key3));
        ok($.key.parse(key4));
        ok($.key.parse(key5));
        ok($.key.parse(key6));
        ok($.key.parse(key7));
        ok($.key.parse(key8));
        ok($.key.parse(key9));
        
        raises(function(){ $.key.parse(null); });
        raises(function(){ $.key.parse(undefined); });
        raises(function(){ $.key.parse(""); });
        raises(function(){ $.key.parse([]); });
        raises(function(){ $.key.parse({}); });
        raises(function(){ $.key.parse(function(){ }); });
    });
    test("tryParse", function() {
        ok($.key.tryParse(key1));
        ok($.key.tryParse(key2));
        ok($.key.tryParse(key3));
        ok($.key.tryParse(key4));
        ok($.key.tryParse(key5));
        ok($.key.tryParse(key6));
        ok($.key.tryParse(key7));
        ok($.key.tryParse(key8));
        ok($.key.tryParse(key9));
        
        equal($.key.tryParse(null), null);
        equal($.key.tryParse(undefined), null);
        equal($.key.tryParse(""), null);
        equal($.key.tryParse([]), null);
        equal($.key.tryParse({}), null);
        equal($.key.tryParse(function(){ }), null);
    });
});