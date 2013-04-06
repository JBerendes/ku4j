function toggleset_mutuallyExclusive() {
    toggleset_mutuallyExclusive.base.call(this);
    this.value;
}
toggleset_mutuallyExclusive.prototype = {
    context: function(context){ return this.property("context", context); },
    invoke: function(toggle){
        var context = this.context();
        context.each(function(t){
            var b = (t === toggle);
             t.isActive(b);
        });
    }
}
$.ext(toggleset_mutuallyExclusive, $.Class);