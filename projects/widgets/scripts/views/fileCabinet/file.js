function file(tabDom, contentDom){
    file.base.call(this);
    var tab = $.dom(tabDom).addClass("ku-file-tab").onclick(this.invoke, this),
        content = $.dom(contentDom).addClass("ku-file-content"),
        active = "ku-file-active";
        
    this.onActive(function(){
            tab.addClass(active);
            content.addClass(active);
        })
        .onInactive(function(){
            tab.removeClass(active);
            content.removeClass(active);
        });
}
file.prototype = { }
$.ext(file, $.toggle.Class);

function tablessFile(contentDom){
    tablessFile.base.call(this);
    var content = $.dom(contentDom).addClass("ku-file-content"),
        active = "ku-file-active";
        
    this.onActive(function(){
            content.addClass(active);
        })
        .onInactive(function(){
            content.removeClass(active);
        });
}
tablessFile.prototype = { }
$.ext(tablessFile, $.toggle.Class);

$.file = function(tabDom, contentDom) {
    return ($.exists(tabDom))
        ? new file(tabDom, contentDom)
        : new tablessFile(contentDom);
} 