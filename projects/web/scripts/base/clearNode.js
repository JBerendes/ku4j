$.clearNode = function(dom) {
    var e = $.ele(dom);
    if(!e) return;
    
    while (e.hasChildNodes()) e.removeChild(e.firstChild);
}