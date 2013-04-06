$(function(){
    module("lock Test");
    test("create", function() {
        expect(1);
        ok($.lock());
    });
    test("mothods", function() {
        expect(2);
        var lock = $.lock();
        
        lock.lock();
        equal(lock.isLocked(), true);
        
        lock.unlock();
        equal(lock.isLocked(), false);
    });
});