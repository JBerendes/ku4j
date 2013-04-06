$(function(){
    function notOk(s, m) {equal(s,false,m);}
    module("iterator Test");
    test("create", function() {
        ok($.iterator());
    });
    
    test("property subject", function(){
        var iterator = $.iterator(),
            array = [1,2,3,4,5],
            obj = {"one":1, "two":2, "three":3, "four":4, "five":5},
            list = $.list(array),
            hash = $.hash(obj);
        
        function test(iterator){
            ok(iterator.current());
            ok(iterator.next());
            ok(iterator.prev());
            iterator.each(function(c){
                equal(iterator.current(), c);
            })
        }
            
        test(iterator.subject(array));
        test(iterator.subject(obj));
        test(iterator.subject(list));
        test(iterator.subject(hash));
    });
    
    test("methods", function() {
        var arr = [1, 2, 3],
            obj = { "a": 1, "b": 2, "c": 3 },
            chk = [0,1,2,3,4,5],
            arrayIterator1 = new $.iterator([1,2,3,4,5]),
            arrayIterator2 = new $.iterator(arr);
    
        function runTests1(t, it) {
            ok(it.hasNext());
            notOk(it.hasPrev());
            equal(1, it.current());
            equal(2, it.next());
            equal(1, it.prev());
            equal(1, it.current());
            
            it.each(function(c){ equal(c, chk[c]); });
        }
        
        function runTests2(t, it) {
            equal(1, it.current());
            notOk($.exists(it.prev()));
            equal(2, it.next());
            ok(it.hasNext());
            ok(it.hasPrev());
            equal(3, it.next());
            notOk($.exists(it.next()));
        }
        
        runTests1("arrayIterator1", arrayIterator1);
        runTests2("arrayIterator2", arrayIterator2);
    });
});