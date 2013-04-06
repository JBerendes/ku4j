function mouse(){ }
mouse.prototype = {
    from: function(e){
        return ($.exists(e.relatedTarget)) ? e.relatedTarget : e.fromElement;
    },
    target: function(e) {
        return (e.srcElement) ? e.srcElement : e.target;
    },
    clientCoord: function(e) {
        if (!$.exists(e.clientX)) return null;
        return new $.coord(e.clientX, e.clientY);
    },
    documentCoord: function(e) {
        if ($.exists(this.pageCoord(e))) return this.pageCoord(e);
        var d = document.documentElement;
        return new $.coord(e.clientX + d.scrollLeft, e.clientY + d.scrollTop);
    },
    pageCoord: function(e) {
        if (!$.exists(e.pageX)) return null;
        return new $.coord(e.pageX, e.pageY);
    },
    screenCoord: function(e) {
        return new $.coord(e.screenX, e.screenY);
    },
    selection: function(){
        if ($.exists(window.getSelection)) return window.getSelection();
        if ($.exists(document.getSelection)) return document.getSelection();
        if ($.exists(document.selection) &&
            $.exists(document.selection.createRange))
                return document.selection.createRange().text;

        if ($.exists(document.activeElement) &&
            $.exists(document.activeElement.selectionStart)) {

            var start = document.activeElement.selectionStart,
                end = document.activeElement.selectionEnd;

            return document.activeElement.value.substring(start, end);
        }
        return null;
    },
    clearSelection: function(){
        var selection = this.selection();
        try{ selection.removeAllRanges(); }
        catch(e){ selection.empty(); }
        return this;
    }
}
$.ext(mouse, $.Class);
var mouse_instance = new mouse();
$.mouse = function(){ return mouse_instance; }