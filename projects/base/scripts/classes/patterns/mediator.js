function mediator() {
    mediator.base.call(this);
    this._observers = new $.hash();
}
mediator.prototype = {
    subscribe: function(name, method, scope, id) {
        var observers = this._observers;
        if(observers.containsKey(name)) observers.find(name).add(method, scope, id);
        else observers.add(name, $.observer().add(method, scope, id));

        return this;
    },
    unsubscribe: function(name, id) {
        var observers = this._observers;
        if(observers.containsKey(name)) observers.find(name).remove(id);
        return this;
    },
    notify: function() {
        var args = $.list.parseArguments(arguments),
            firstArg = args.find(0),
            isFirstArgData = !this._observers.containsKey(firstArg),
            isFilteredCall = !isFirstArgData || (args.count() > 1),
            data = isFirstArgData ? firstArg : null,
            nameList = args.remove(0);

        return (isFilteredCall)
            ? this._notify(data, nameList)
            : this._notifyAll(data);

        return this;
    },
    clear: function(){
        this._observers
            .each(function(o){ o.value.clear(); })
            .clear();
        return this;
    },
    isEmpty: function(){
        return this._observers.isEmpty();
    },
    _notifyAll: function(data){
        this._observers.listValues().each(function(o){ o.notify(data); });
        return this;
    },
    _notify: function(data, list) {
        var o = this._observers;
        list.each(function(name){
            try { o.find(name).notify(data); }
            catch(e){ return; }
        });
        return this;
    }
}
$.ext(mediator, $.Class);
$.mediator = function() { return new mediator(); }
$.mediator.Class = mediator;