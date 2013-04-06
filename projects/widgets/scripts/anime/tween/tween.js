$.tween = function(method, start, end, algorithm){
    return ($.isNumber(start) && $.isNumber(end))
        ? new numberTween(method, start, end, algorithm)
        : new coordTween(method, start, end, algorithm);
}