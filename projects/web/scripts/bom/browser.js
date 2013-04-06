var browser = function(navigator) {
    this._navigator = navigator;

    agents = {
        _isIE: "MSIE",
        _isNetscape: "Netscape",
        _isFirefox: "Firefox",
        _isOpera: "Opera",
        _isSafari: "Safari",
        _isChrome: "Chrome"
    };

    this._isIE = false;
    this._isNetscape = false;
    this._isFirefox = false;
    this._isOpera = false;
    this._isSafari = false;
    this._isChrome = false;
    this._isUnknown = true;
    this._version = "";

    if(!$.isObject(navigator)) return;

    var navigator = this._navigator,
        userAgent = navigator.userAgent;

    function isAgentTest(testValue) {
        return !$.isNullOrEmpty(userAgent) &&
               (new RegExp(testValue,"i")).test(userAgent);
    }

    function findVersion(testValue) {
        try {
            var version = (new RegExp("Version\\/(\\d+\\.?){1,}","i")).exec(userAgent),
                name = (new RegExp(testValue + "\\/(\\d+\\.?){1,}","i")).exec(userAgent),
                ver = $.exists(version) ? version : name;
            return (new RegExp("(\\d+\\.?){1,}")).exec(ver[0])[0];
        }
        catch(e) { return ""; }
    }

    var n, result, testValue;
    for(n in agents) {
        testValue = agents[n];
        result = isAgentTest(testValue);

        if(!result) continue;

        this[n] = result;
        this._version = findVersion(testValue);
        this._isUnknown = false;
    }

    this._fullVersion = navigator.appVersion;
    this._platform = navigator.platform;
    this._allInfo =  this._fullVersion + this._platform;
}
browser.prototype = {
    isIE: function() { return this._isIE; },
    isNetscape: function() { return this._isNetscape; },
    isFirefox: function() { return this._isFirefox; },
    isOpera: function() { return this._isOpera; },
    isSafari: function() { return this._isSafari && !this._isChrome; },
    isChrome: function() { return this._isChrome; },
    isUnknown: function() { return this._isUnknown; },
    platform: function(){ return this._platform; },
    fullVersion: function(){ return this._fullVersion; },
    version: function() { return this._version; }
}
var browser_instance;
$.ku.browser = function(){
    if ($.exists(browser_instance)) return browser_instance;
    browser_instance = new browser(navigator);
    return browser_instance;
 }
$.ku.browser.Class = browser;