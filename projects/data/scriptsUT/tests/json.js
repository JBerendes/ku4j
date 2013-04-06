$(function(){
	var str = '{"a":null,"b":undefined,"man":{"sex":"m","age":25,"married":true,"children":["Tom","Dick","Jane"],"contact":{"home":9998887777}}}'
	var obj = {a:null, b:undefined, man:{sex:"m", age:25, married:true, children:["Tom","Dick","Jane"], contact:{"home":9998887777}}}
	
	module("uid Test");
	test("serialize", function() {
	    expect(1);
	    equal($.json.serialize(obj), str);
	});
	test("deserialize", function() {
	    expect(2);
	    var man = $.json.deserialize(str);
	    equal(man.man.sex, "m");
	    equal(man.man.age, 25);
	});
});