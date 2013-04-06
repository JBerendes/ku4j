function draggableRowDecorator(table) {
    $.cast(this, table);
    
    this._dri = new $.iterator(this.rows.listValues());
    this.helper = $.create({"tr":{"class":"ku-table-dragRow-helper"}});
    $.slider(this.helper, null, null, null, null, null, "dragger", "vertical");
    this._isMoving = false;
    this._hitPoint;
    this._moveDom;
    
    function getPoint(dom) { return $.cast($.coord.parse($.findOffset(this.dom)), $.point);}
    
    this._dri.foreach(function(c){
        $.evt.add(c.dom, "mouseover", function(){
            if(!this._isMoving) return;
            var d = c.dom,
                b = this.body,
                h = this.helper,
                hp = this._hitPoint,
                p = getPoint(d);
            
            if(!d.nextSibling) b.appendChild(h);
            else if(p.isAbove(hp))b.insertBefore(h, d);
            else b.insertBefore(h, d.nextSibling);
            
            this._hitPoint = p;
        }, this);
        
        $.dnd(c.dom,
            function(){
                this.helper = c.dom;
                this._isMoving = true;
                this._hitPoint = getPoint(c.dom);
                this._moveDom = c.dom;
                this.body.insertBefore(this.helper, c.dom);
                $.ku.css.addClass(this.body, "ku-table-draggableRow-dragging");
                $.ku.css.addClass(this._moveDom, "ku-table-draggableRow-moveDom");
            },
            null,
            function(){
                $.ku.css.removeClass(this.body, "ku-table-draggableRow-dragging");
                $.ku.css.removeClass(this._moveDom, "ku-table-draggableRow-moveDom");
                $.ku.swapDom(this.helper, this._moveDom);
                this._isMoving = false;
                this._moveDom = null;
                this.format();
            }, this);
        
    }, this);
}

$.draggableRowDecorator = function(table){ return new draggableRowDecorator(table); }