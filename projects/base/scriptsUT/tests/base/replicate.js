$(function(){
    module("replicate Test");
    
    test("methods", function() {
        var array = [1,2,3],
            date = new Date(),
            obj = {"1":1,"2":2,"3":3};
            
        ok($.replicate(null) ==  null);
        ok($.replicate(undefined) == undefined);
        
        ok(array[0] == $.replicate(array)[0], "cloneArray");
        ok(date.valueof == $.replicate(date).valueof, "cloneDate");
        ok(obj["1"] == $.replicate(obj)["1"], "cloneObject");
    });
});