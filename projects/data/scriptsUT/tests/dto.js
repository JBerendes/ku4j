$(function(){
    module("dto Test");
    
    var dto1 = $.dto({"one":1, "two":2, "three":3}),
        dto2 = $.dto($.hash({"one":1, "two":2, "three":3})),
        dto3 = $.dto($.dto({"one":1, "two":2, "three":3}));
    
    test("methods", function() {
        var rep1 = dto1.replicate().add("new", "new"),
            rep2 = dto2.replicate().add("new", "new"),
            rep3 = dto3.replicate().add("new", "new");
        
        equal(3, dto1.count(), "replicate");
        equal(3, dto2.count(), "replicate");
        equal(3, dto3.count(), "replicate");
        
        equal(4, rep1.count(), "replicate");
        equal(4, rep2.count(), "replicate");
        equal(4, rep3.count(), "replicate");
        
        ok(!dto1.containsKey("new"));
        ok(rep1.containsKey("new"));
    });
});