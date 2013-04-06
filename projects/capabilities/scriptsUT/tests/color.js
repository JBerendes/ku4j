$(function(){
    function notOk(s, m) {equal(s,false,m);}
    
    module("color Test");
    
    test("create", function(){
        raises(function(){ $.color(); });
        raises(function(){ $.color(null, null, null); });
        raises(function(){ $.color(undefined, undefined, undefined); });
        raises(function(){ $.color("", "", ""); });
        raises(function(){ $.color("a", "a", "a"); });
        raises(function(){ $.color("-1", "-1", "-1"); });
        raises(function(){ $.color("256", "256", "256"); });
        raises(function(){ $.color(-1, -1, -1); });
        raises(function(){ $.color(256, 256, 256); });
        
        ok($.color("0", "0", "0"));
        ok($.color("255", "255", "255"));
        ok($.color(0, 0, 0));
        ok($.color(255, 255, 255));
    });
    
    test("canParse", function(){
        notOk($.color.canParse(-1));
        notOk($.color.canParse(16777216));
        notOk($.color.canParse("-1"));
        notOk($.color.canParse("16777216"));
        notOk($.color.canParse("#0"));
        notOk($.color.canParse("#G"));
        notOk($.color.canParse("#000"));
        notOk($.color.canParse("#FFF"));
        notOk($.color.canParse("#GGGGGG"));
        notOk($.color.canParse("#G00000"));
        notOk($.color.canParse("#00000G"));
        notOk($.color.canParse(0x1000000));
        
        ok($.color.canParse("0"));
        ok($.color.canParse("16777215"));
        ok($.color.canParse(0));
        ok($.color.canParse(16777215));
        ok($.color.canParse(0x000000));
        ok($.color.canParse(0xffffff));
        ok($.color.canParse("#000000"));
        ok($.color.canParse("#FFFFFF"));
    });
    
    test("parse", function(){
        notOk($.exists($.color.parse("#0")));
        notOk($.exists($.color.parse("#G")));
        notOk($.exists($.color.parse("#000")));
        notOk($.exists($.color.parse("#FFF")));
        notOk($.exists($.color.parse("#GGGGGG")));
        notOk($.exists($.color.parse("#G00000")));
        notOk($.exists($.color.parse("#00000G")));
        notOk($.exists($.color.parse(-1)));
        notOk($.exists($.color.parse(16777216)));
        notOk($.exists($.color.parse("-1")));
        notOk($.exists($.color.parse("16777216")));
        notOk($.exists($.color.parse(0x1000000)));
        
        ok($.color.parse("0"));
        ok($.color.parse("16777215"));
        ok($.color.parse(0));
        ok($.color.parse(16777215));
        ok($.color.parse(0x000000));
        ok($.color.parse(0xffffff));
        ok($.color.parse("#000000"));
        ok($.color.parse("#FFFFFF"));
        ok($.color.parse("rgb(0,0,0)"));
        ok($.color.parse("rgb(0, 0, 0)"));
        ok($.color.parse("rgb(255,255,255)"));
        ok($.color.parse("rgb(255, 255, 255)"));
    });
    
    test("equals", function(){
        notOk($.color(0, 0, 0).equals($.color(255, 255, 255)));
        notOk($.color(255, 255, 254).equals($.color(255, 255, 255)));
        notOk($.color.parse("#000000").equals($.color.parse(0xffffff)));
        notOk($.color.parse("#ffffff").equals($.color.parse(0x000000)));
        notOk($.color.parse("#ffffff").equals($.color.parse("rgb(0,0,0)")));
        
        ok($.color(0, 0, 0).equals($.color(0, 0, 0)));
        ok($.color(255, 255, 255).equals($.color(255, 255, 255)));
        ok($.color.parse("#ffffff").equals($.color.parse(0xffffff)));
        ok($.color.parse("#000000").equals($.color.parse(0x000000)));
        ok($.color.parse("#ffffff").equals($.color.parse("rgb(255,255,255)")));
    });
    
    test("add", function(){
        ok($.color(10, 20, 30).add($.color(30, 20, 10)).equals($.color(40, 40, 40)));
    });
    
    test("toHex", function(){
        equal($.color(0, 0, 0).toHex(), "0x000000");
        equal($.color(255, 255, 255).toHex(), "0xffffff");
    });
    test("toCSS", function(){
        equal($.color(0, 0, 0).toCSS(), "#000000");
        equal($.color(255, 255, 255).toCSS(), "#ffffff");

        equal($.color.parse("#ff0134").toCSS(), "#ff0134");
        equal($.color.parse("#ff0904").toCSS(), "#ff0904");
        equal($.color.parse("#0f0a03").toCSS(), "#0f0a03");
        equal($.color.parse("#f010a0").toCSS(), "#f010a0");
    });
    test("toRGB", function(){
        equal($.color(0, 0, 0).toRGB(), "rgb(0,0,0)");
        equal($.color(255, 255, 255).toRGB(), "rgb(255,255,255)");
    });
    test("toNumber", function(){
        equal($.color(0, 0, 0).toNumber(), 0);
        equal($.color(255, 255, 255).toNumber(), 16777215);
    });
});