$.ele = function(o) {
    if(!o) return null;
    return ($.isEvent(o)) ? $.evt.ele(o)
          :($.isString(o)) ? document.getElementById(o)
          :($.exists(o.dom)) ? o.dom : o;
}