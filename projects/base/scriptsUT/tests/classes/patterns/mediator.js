$(function(){
    function notOk(s, m) {equal(!!s,false,m);}
    module("mediator Test");

    test("create", function() {
        ok($.mediator());
    });

    var mediator = $.mediator(), test1, test2, test3;

    test("methods", function() {
        mediator
            .subscribe("method.a", function(value){ test1 = value; }, null, "1")
            .subscribe("method.a", function(value){ test2 = value; }, null, "2")
            .subscribe("method.b", function(value){ test3 = value; }, null, "1");

        mediator.notify("value1");

        equal(test1, "value1");
        equal(test2, "value1");
        equal(test3, "value1");

        mediator.notify("value2", "method.b");

        equal(test1, "value1");
        equal(test2, "value1");
        equal(test3, "value2");

        //unsubscribe
        mediator.unsubscribe("method.a", "2");
        mediator.notify("value3");

        equal(test1, "value3");
        equal(test2, "value1");
        equal(test3, "value3");

        //clear
        ok(mediator.clear().isEmpty());

    });
});