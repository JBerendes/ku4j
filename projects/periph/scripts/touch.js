function touch(){ }
touch.prototype = {
    canRead: function(e){ return $.exists(e.touches); },
    from: function(e){
        var t = e.touches[0];
        return ($.exists(t.relatedTarget)) ? t.relatedTarget : t.fromElement;
    },
    target: function(e) {
        var t = e.touches[0];
        return (t.srcElement) ? t.srcElement : t.target;
    },
    clientCoord: function(e) {
        var t = e.touches[0];
        if (!$.exists(t.clientX)) return null;
        return new $.coord(t.clientX, t.clientY);
    },
    documentCoord: function(e) {
        var t = e.touches[0];
        if ($.exists(this.pageCoord(e))) return this.pageCoord(e);
        var d = document.documentElement;
        return new $.coord(t.clientX + d.scrollLeft, t.clientY + d.scrollTop);
    },
    pageCoord: function(e) {
        var t = e.touches[0];
        if (!$.exists(t.pageX)) return null;
        return new $.coord(t.pageX, t.pageY);
    },
    screenCoord: function(e) {
        var t = e.touches[0];
        return new $.coord(t.screenX, t.screenY);
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
$.ext(touch, $.Class);
var touch_instance = new touch();
$.touch = function(){ return touch_instance; }