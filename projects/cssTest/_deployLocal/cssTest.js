var $, cssTest;
(function(){
    var loader = document.createElement("div");
    loader.className = "cssTest-loader",
    loader.innerHTML = "Loading CssTest...";
    _step = 0;

    function showLoader(){ document.body.appendChild(loader); }
    function removeLoader(){ document.body.removeChild(loader); }
    function step(){
        _step++;
        loader.innerHTML = "Loading CssTest - Step " + _step + " of 5...";
        if(_step == 5) removeLoader();
    }
    showLoader();
    function link(uri){
        var l=d.createElement('link');
        l.setAttribute('rel', 'stylesheet');
        l.setAttribute('type', 'text/css');
        l.setAttribute('href', uri);
        return l;
    };
    function script(uri){
        var s=d.createElement('script');
        s.setAttribute('language', 'javascript');
        s.setAttribute('type', 'text/javascript');
        s.setAttribute('src', uri);
        s.setAttribute('defer', 'defer');
        return s;
    };
    function load(n, s) {
        if(s()) {
            h.appendChild(n);
            step();
        }
        else setTimeout(function(){ load(n, s); }, 100);
    };
    var d=document,
        h=d.documentElement.getElementsByTagName('head')[0],
        p='http://test.kodmunki.com/kodmunki/test/tools/cssTest/',
        i = 0, f = [
            function(){ load(link(p + 'styles.css'), function(){ return true; }); },
            function(){ load(script(p + 'jquery.js'), function(){ return true; }); },
            function(){ load(script(p + 'ku4j-min.js'), function(){ return !/undefined/.test(typeof $); }); },
            function(){ load(script(p + 'ku4j-cssTest-min.js'), function(){ return (!/undefined/.test(typeof $)) && ($.dto != undefined); }); },
            function(){ load(script(p + 'cssTestApp.js'), function(){ return !/undefined/.test(typeof cssTest); }); }
        ], l = f.length;
    while(i<l){ f[i](); i++; }
})();