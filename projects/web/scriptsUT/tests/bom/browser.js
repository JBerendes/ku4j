$(function(){
    function notOk(s, m) {equal(s,false,m);}

    module("browser Test");

    var browser = $.ku.browser.Class;
    test("create", function() {
        ok(new browser());
        ok(new browser(undefined));
        ok(new browser(null));
        ok(new browser(""));
        ok(new browser(0));
        ok(new browser([]));
        ok(new browser({}));
        ok(new browser({ userAgent: undefined }));
        ok(new browser({ userAgent: null }));
        ok(new browser({ userAgent: "" }));
        ok(new browser({ userAgent: 0 }));
        ok(new browser({ userAgent: [] }));
        ok(new browser({ userAgent: {} }));
    });

    test("isIE", function() {
        var navigator = {
                userAgent: "MSIE/8.0.7.623",
                appVersion: "8.0.7 Version IE 8",
                platform: "Computer-platform"
            },
            b = new browser(navigator);

        ok(b.isIE(), "isIE");
        notOk(b.isNetscape(), "isNetscape");
        notOk(b.isFirefox(), "isFirefox");
        notOk(b.isOpera(), "isOpera");
        notOk(b.isSafari(), "isSafari");
        notOk(b.isChrome(), "isChrome");
        notOk(b.isUnknown(), "isUnknown");

        equal(b.platform(), "Computer-platform", "platform");
        equal(b.version(), "8.0.7.623", "version");
        equal(b.fullVersion(), "8.0.7 Version IE 8", "fullVersion");
        equal(b.canRotate (), "", "canRotate");
    });
    test("isNetscape", function() {
        var navigator = {
              userAgent: "Netscape/7.9.1",
              appVersion: "7.9 Netscape",
              platform: "Some-computer"
          },
          b = new browser(navigator);

        notOk(b.isIE(), "isIE");
        ok(b.isNetscape(), "isNetscape");
        notOk(b.isFirefox(), "isFirefox");
        notOk(b.isOpera(), "isOpera");
        notOk(b.isSafari(), "isSafari");
        notOk(b.isChrome(), "isChrome");
        notOk(b.isUnknown(), "isUnknown");

        equal(b.platform(), "Some-computer", "platform");
        equal(b.version(), "7.9.1", "version");
        equal(b.fullVersion(), "7.9 Netscape", "fullVersion");
        equal(b.canRotate(), "", "canRotate");
    });
    test("isFirefox", function() {
        var navigator = {
                userAgent: "Mozilla/8 Firefox/12.0",
                appVersion: "8-12",
                platform: "PLATFORM"
            },
            b = new browser(navigator);

        notOk(b.isIE(), "isIE");
        notOk(b.isNetscape(), "isNetscape");
        ok(b.isFirefox(), "isFirefox");
        notOk(b.isOpera(), "isOpera");
        notOk(b.isSafari(), "isSafari");
        notOk(b.isChrome(), "isChrome");
        notOk(b.isUnknown(), "isUnknown");

        equal(b.platform(), "PLATFORM", "platform");
        equal(b.version(), "12.0", "version");
        equal(b.fullVersion(), "8-12", "fullVersion");
        equal(b.canRotate(), "", "canRotate");
    });
    test("isOpera", function() {
       var navigator = {
               userAgent: "Opera",
               appVersion: "8",
               platform: "go-go"
           },
           b = new browser(navigator);

       notOk(b.isIE(), "isIE");
       notOk(b.isNetscape(), "isNetscape");
       notOk(b.isFirefox(), "isFirefox");
       ok(b.isOpera(), "isOpera");
       notOk(b.isSafari(), "isSafari");
       notOk(b.isChrome(), "isChrome");
       notOk(b.isUnknown(), "isUnknown");

       equal(b.platform(), "go-go", "platform");
       equal(b.version(), "", "version");
       equal(b.fullVersion(), "8", "fullVersion");
       equal(b.canRotate(), "", "canRotate");
    });
    test("isSafari", function() {
        var navigator = {
                userAgent: "Safari/8 Version/12",
                appVersion: "100000 ABCDE",
                platform: "go-go"
            },
            b = new browser(navigator);

        notOk(b.isIE(), "isIE");
        notOk(b.isNetscape(), "isNetscape");
        notOk(b.isFirefox(), "isFirefox");
        notOk(b.isOpera(), "isOpera");
        ok(b.isSafari(), "isSafari");
        notOk(b.isChrome(), "isChrome");
        notOk(b.isUnknown(), "isUnknown");

        equal(b.platform(), "go-go", "platform");
        equal(b.version(), "12", "version");
        equal(b.fullVersion(), "100000 ABCDE", "fullVersion");
        equal(b.canRotate(), "", "canRotate");
    });
    test("isChrome", function() {
        var navigator = {
                userAgent: "Chrome/12.0 Safari/583.7",
                appVersion: "APP-Version",
                platform: "CHROME"
            },
            b = new browser(navigator);

        notOk(b.isIE(), "isIE");
        notOk(b.isNetscape(), "isNetscape");
        notOk(b.isFirefox(), "isFirefox");
        notOk(b.isOpera(), "isOpera");
        notOk(b.isSafari(), "isSafari");
        ok(b.isChrome(), "isChrome");
        notOk(b.isUnknown(), "isUnknown");

        equal(b.platform(), "CHROME", "platform");
        equal(b.version(), "12.0", "version");
        equal(b.fullVersion(), "APP-Version", "fullVersion");
        equal(b.canRotate(), "", "canRotate");
    });
    test("isUnkown", function() {
        var navigator = {
                userAgent: "",
                appVersion: "",
                platform: ""
            },
            b = new browser(navigator);

        notOk(b.isIE(), "isIE");
        notOk(b.isNetscape(), "isNetscape");
        notOk(b.isFirefox(), "isFirefox");
        notOk(b.isOpera(), "isOpera");
        notOk(b.isSafari(), "isSafari");
        notOk(b.isChrome(), "isChrome");
        ok(b.isUnknown(), "isUnknown");

        equal(b.platform(), "", "platform");
        equal(b.version(), "", "version");
        equal(b.fullVersion(), "", "fullVersion");
        equal(b.canRotate(), "", "canRotate");
    });
});