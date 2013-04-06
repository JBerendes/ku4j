function highlighter(){ }
highlighter.prototype = {
    highlight: function(selection, color){
        var range = selection.getRangeAt(0);
        try {
            document.designMode = "on";
                selection.removeAllRanges();
                selection.addRange(range);

                if (!document.execCommand("HiliteColor", false, color))
                    document.execCommand("BackColor", false, color);

            document.designMode = "off";
        }
        catch(e) {
            try {
                range = document.selection.createRange();
                range.execCommand("BackColor", false, color);
            }
            catch(ex){ /*Fail*/ }
        }
    },
    clear: function(){ }
}
$.highlighter = function(){ return new highlighter(); }