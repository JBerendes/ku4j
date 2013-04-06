$(function(){
    function notOk(s, m) {equal(s,false,m);}
    
    module("obj Test");
    
    var obj1 = {"one":1, "two":2, "three":3 },
        obj2 = {"three":7, "four":4, "five":5, "six":6 };
    
    test("keys", function(){
        var keys = $.obj.keys(obj1),
            test = ["one", "two", "three"],
            i = 0, l = test.length;
            
        while(i < l) { equal(keys[i], test[i]); i++; }
    });
    
    test("values", function(){
        var values = $.obj.values(obj1),
            test = [1, 2, 3],
            i = 0, l = test.length;
            
        while(i < l) { equal(values[i], test[i]); i++; }
    });
    
    test("count", function(){
        equal($.obj.count(obj1), 3);
        equal($.obj.count(obj2), 4);
    });
    
    test("hasProp", function(){
        ok($.obj.hasProp(obj1, "one"));
        ok($.obj.hasProp(obj1, "two"));
        ok($.obj.hasProp(obj1, "three"));
        notOk($.obj.hasProp(obj1, "four"));
    });

    test("merge", function(){
        var merge = $.obj.merge(obj1, obj2);
        
        equal($.obj.count(merge), 6);
        equal($.obj.count(obj1), 3);
        equal($.obj.count(obj2), 4);
        
        equal(merge.one, obj1.one);
        equal(merge.six, obj2.six);
        equal(merge.three, obj1.three)
    });

    test("meld", function(){
        var meld = $.obj.meld(obj1, obj2);
        
        equal($.obj.count(meld), 6);
        equal($.obj.count(obj1), 3);
        equal($.obj.count(obj2), 4);
        
        equal(meld.one, obj1.one);
        equal(meld.six, obj2.six);
        equal(meld.three, obj2.three)
    });
});