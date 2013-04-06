$(function(){
    module("image Test");
    test("create", function() {
        expect(1);
        ok($.image("image"));
    });
    test("methods", function() {
        expect(6);
        var image = $.image("image");
        equals(image.height(), 100);
        equals(image.width(), 100);
        
        image.fitTo($.coord(150, 200));
        equals(image.height(), 150);
        equals(image.width(), 150);
        
        image.sizeTo($.coord(150, 70));
        equals(image.height(), 70);
        equals(image.width(), 150);
    });
});