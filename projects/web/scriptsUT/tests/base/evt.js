$(function(){
    function notOk(s, m) {equal(s,false,m);}
    
    module("evt Test");

    var eventButton = $.ele("eventButton"),
        testValue = 0,
        eventId = $.evt.add(eventButton, "click", function(){ testValue++; });

    test("add", function() {
        raises(function(){ $.evt.add(); });
        raises(function(){ $.evt.add(""); });
        raises(function(){ $.evt.add("nosuchnode"); });
        raises(function(){ $.evt.add(null); });
        raises(function(){ $.evt.add(undefined); });


    });
    test("fire/remove", function() {
        $.evt.fire(eventId);
        equal(testValue, 1);

        $.evt.fire(eventId);
        equal(testValue, 2);

        $.evt
            .remove(eventId)
            .fire(eventId);

        equal(testValue, 2);

    });
    test("ele", function() {
        var evt1 = { srcElement: "srcElement" },
            evt2 = { target: "target" };

        equal($.evt.ele(evt1), "srcElement");
        equal($.evt.ele(evt2), "target");

    });
    test("mute", function() {
        var preventDefault = false,
            stopPropogation = false;
            evt = {
               preventDefault: function(){ preventDefault = true; },
               stopPropogation: function(){ stopPropogation = true; }
            };

        $.evt.mute(evt);

        ok(preventDefault);
        ok(stopPropogation);
        equal(evt.returnValue, false);
        equal(evt.cancelBubble, true);
    });
});