$(function() {
    function notOk(s, m) { equal(s, false, m); }
    
    module("cssTest.persistence.cache");
    test("create", function() {
        ok(new cssTest.persistence.cache(new cssTest.model.cssTest()));
    });
    test("erase", function() {
        (new cssTest.persistence.cache(new cssTest.model.cssTest())).erase();
        equal($.dto.serialize("CSSTEST_CACHE"), null);
    });
    if(!$.ku.browser().isChrome) {
        test("save", function() {
            var cache = new cssTest.persistence.cache(new cssTest.model.cssTest());
            cache.save("url1").save("url2");
            equal($.dto.serialize("CSSTEST_CACHE").count(), 2);
        });
    }
    if(!$.ku.browser().isChrome)  {
        test("listUris", function() {
            if($.ku.browser().isChrome) return;
            var cache = new cssTest.persistence.cache(new cssTest.model.cssTest());
            equal(cache.listUris().count(), 2);
        });
    }
});