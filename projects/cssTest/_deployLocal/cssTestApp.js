(function(){
    var controls = $.str.build(
        '<div class="cssTest-controlSet">',
            '<label for="loadField">URL: </label>',
            '<input id="loadField" class="cssTest-field cssTest-field-load" type="text" />',
            '<button id="loadButton" class="cssTest-button" onclick="$.cssTest.load(); return false;">load</button>',
            '</div>',
            '<div class="cssTest-controlSet">',
                '<select id="testField" class="cssTest-field cssTest-field-suite"></select>',
                '<button id="testButton"  class="cssTest-button" onclick="$.cssTest.run(); return false;">run</button>',
            '</div>',
            '<div id="message" class="cssTest-message"></div>',
            '<div id="indicator" class="cssTest-indicator"></div>',
            '<div id="resultList" class="cssTest-resultList"></div>',
            '<div id="cssTest-copyright" class="cssTest-copyright">',
                'Copyright &#169; 2012 <img src="http://test.kodmunki.com/kodmunki/test/tools/cssTest/modelus.jpg" class="cssTest-copyright-logo" />. All rights reserved.',
                '<span class="cssTest-quit" onclick="$.cssTest.close(); return false;">Quit</span>',
            '</div>',
        '</div>'),

        hud = $.create({div:{"class":"cssTest-hud"},content:controls});

    document.body.appendChild(hud);

    var testPlan = new cssTest.model.testing.testPlan(),
        model = new cssTest.model.cssTest(testPlan),
        cache = new cssTest.persistence.cache(model),
        form = new cssTest.views.form($.ele("loadField"), $.ele("testField"), $.ele("message")),
        results = new cssTest.views.results($.ele("indicator"), $.ele("resultList")),
        view = new cssTest.views.cssTest(model, form, results);

    $.cssTest = new cssTest.controllers.cssTest(model, view);

    cache.listUris().each(function(uri){ model.load(uri); });
})();