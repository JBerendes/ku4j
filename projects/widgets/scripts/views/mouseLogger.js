$.mouseLogger = function(){
    var dom = $.create({"div":{style:{position:"absolute"}}});
    return {
        on: function(){
            document.body.appendChild(dom);
            this.__con = new $.sprite(dom);
            this.__evt = $.evt.add(document, "mousemove", function(e){
                var f = $.str.build("Document:&nbsp;{0}<br/>Page:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{1}",
                                    "<br/>Screen:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{2}",
                                    "<br/>Client:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{3}",
                                    "<br/>Target:&nbsp;{4}"),
                    d = $.mouse().documentCoord(e),
                    p = $.mouse().pageCoord(e),
                    s = $.mouse().screenCoord(e),
                    c = $.mouse().clientCoord(e),
                    t = $.mouse().target(e);
                this.__con
                    .pinTo($.mouse().documentCoord(e).add($.coord(10, 10)))
                    .html($.str.format(f,d.toString(),p.toString(),s.toString(),c.toString(),t));
            }, this);
        },
        off:function(){
            document.body.removeChild(dom);
            var e = this.__evt, c = this.__con;
            if($.exists(e)) $.evt.remove(e);
            if($.exists(c)) c.destroy();
        }
    }
}