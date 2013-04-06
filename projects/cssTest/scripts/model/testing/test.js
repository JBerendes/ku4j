cssTest.model.testing.test = function(selector, properties, name){
    cssTest.model.testing.test.base.call(this);
    var node = $(selector)[0];
    if(!$.exists(node)) throw $.exception("arg", $.str.format("Test cannot find node with selector: {0}", selector));
    
    this._dom = $.dom(node);
    this._properties = $.hash(properties);
    this._name = name || $.uid("cssTest-test");
    this._result;
}
cssTest.model.testing.test.prototype = {
    name: function(){ return this._name; },
    result: function(){ return this._result; },
    evaluate: function(){
        var dom = this._dom,
            result = new cssTest.model.capabilities.result().name(this._name || $.uid("test"));
        
        this._properties.each(function(prop){
            var test = (cssTest_isOffsetTest(prop))
                        ? cssTest_testOffset(dom, prop, name)
                        : (cssTest_isDimensionTest(prop))
                            ? cssTest_testDimensions(dom, prop, name)
                            : cssTest_testStyle(dom, prop, name);
                            
            if(!test.result) result.fail().addFailMessage(test.message);
            else result.addPassMessage(test.message);
        });
        this._result = result;
        return this;
    }     
},
$.ext(cssTest.model.testing.test, $.Class);

function cssTest_isOffsetTest(prop){ return /^(top|left)$/i.test(prop.key); }
function cssTest_isDimensionTest(prop){ return /^(width|height)$/i.test(prop.key); }

function cssTest_testOffset(dom, prop, name){
    var offset = dom.offset().toPixel(),
        actual = (/left/i.test(prop.key)) ? offset.x() : offset.y();
    return cssTest_test(actual, prop, name);
}
function cssTest_testDimensions(dom, prop, name){
    var dims = dom.innerDims().toPixel(),
        actual = (/width/i.test(prop.key)) ? dims.x() : dims.y();
    return cssTest_test(actual, prop, name);
}
function cssTest_testStyle(dom, prop, name){
    var actual = dom.style(prop.key);
    
    if(/^font\-family$/i.test(prop.key)) actual = actual.replace(/"/g, "").split(",")[0];
    if(/color/i.test(prop.key)) actual = (function(){
        var v = dom.style(prop.key).replace(/[^\d,]/g,"").split(",");
        return (v.length == 3) ? $.color(v[0], v[1], v[2]).toCSS() : v;
    })();
    
    return cssTest_test(actual, prop, name);
}
function cssTest_test(actual, prop, name){
    var test = {};
    test.result = prop.value == actual;
    test.message = test.result
            ? cssTest_testPass(prop.key, prop.value, actual, name)
            : cssTest_testFail(prop.key, prop.value, actual, name);
    return test;
}
function cssTest_testPass(property, expected, actual, name){
    return cssTest_createMessage("PASS", property, expected, actual, name);
}
function cssTest_testFail(property, expected, actual, name){
    return cssTest_createMessage("FAIL", property, expected, actual, name);
}
function cssTest_createMessage(type, property, expected, actual){
    var act = (actual == "") ? "(empty)" : actual
    return $.str.format("{0} | {1}:{2}. Expected: {3}", type, property, act, expected);
}