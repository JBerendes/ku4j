$(function(){
    module("hash Test");
    test("create", function() {
        expect(1);
        ok($.hash());
    });
    test("methods", function() {
        expect(27);
        var hash = $.hash();
    
        ok(hash.isEmpty());       
           
        hash.add("one", 1);
        equal(1, hash.count(), "add(\"one\",1)"); 
        
        hash.add("two", 2);
        equal(2, hash.count(), "add(\"two\",2)");
        hash.add("two", 3);
        equal(2, hash.count(), "add duplicate");
        equal(2, hash.find("two"), "find(\"two\")");
        
        hash.meld($.hash({"three":3}));
        equal(3, hash.count(), "meld");
        hash.meld({"three":4});
        equal(3, hash.findValue("three"), "meld duplicate");
        
        hash.merge({"three":4});
        equal(4, hash.findValue("three"), "merge duplicate");
        hash.merge($.hash({"three":5}));
        equal(5, hash.findValue("three"), "merge duplicate");
        
        ok(hash.containsKey("one"), "containsKey(\"one\")");
        equal(2, hash.find("two"), "find(\"two\")");
        equal("two", hash.findKey(2), "findKey(2)");
        equal(2, hash.findValue("two"), "findValue(\"two\")");
        equal(3, hash.listKeys().count(), "listKeys()");
        equal(3, hash.listValues().count(), "listValues()");
        
        var rep = hash.replicate().add("new", "new");
        equal(3, hash.count(), "replicate");
        equal(4, rep.count(), "replicate");
        
        ok(!hash.containsKey("new"));
        ok(rep.containsKey("new"));
        
        hash.each(function(v){ ok($.isObject(v), "foreach"); });
        
        hash.remove("one");
        equal(2, hash.count(), "remove()");
        
        hash.update("two", 3);
        equal(2, hash.count(), "update two");
        equal(3, hash.find("two"), "find(\"two\")");
        equal(2, hash.count());
        
        hash.clear();
        equal(0, hash.count(), "clear()");
    });
});