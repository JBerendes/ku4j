$(function(){
    function notOk(s, m) {equal(s,false,m);}
    
    module("create Test");
    
    test("null|undefined", function() {
        equal($.create(), null);
        equal($.create(null), null);
        equal($.create(undefined), null);
    });
    
    test("string content", function(){
        var dom = $.create({
                div:{
                    id: "dom1",
                    "class": "css-class js-class",
                    style: {
                        position: "relative",
                        border: "solid 2px #000",
                        "z-index": "1000"
                    }
                },
                content: "Content"
            }), 
            body = document.body;
        
        body.appendChild(dom);
        ok(document.getElementById("dom1"));
    });
    
    test("dom content", function(){
        var dom = $.create({
                div:{
                    id: "dom2",
                    "class": "css-class js-class",
                    style: {
                        position: "relative",
                        border: "solid 2px #000",
                        "z-index": "1000"
                    }
                },
                content: document.createElement("div").appendChild(document.createTextNode("Text"))
            }), 
            body = document.body;
            
        body.appendChild(dom);
        ok(document.getElementById("dom2"));
    });
    
    test("ku4jDom content", function(){
        var dom = $.create({
                div:{
                    id: "dom3",
                    "class": "css-class js-class",
                    style: {
                        position: "relative",
                        border: "solid 2px #000",
                        "z-index": "1000"
                    }
                },
                content: $.create({div:{}, content:"Text"})
            }), 
            body = document.body;
        
        body.appendChild(dom);
        ok(document.getElementById("dom3"));
    });
});