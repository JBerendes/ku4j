function sorter(strategy) { this._strategy = strategy; }

sorter.prototype = {
    sort: function(value) { return this.$sort(value, this._strategy); },
    strategy: {
        asc: function(a, b) {
            var v1 = this._findSortValue(a), v2 = this._findSortValue(b);
            if (!isNaN(v1) && !isNaN(v2)) return (v1 - v2);
            return ((v1 > v2) || !isNaN(v2)) ? 1 : ((v1 < v2) || !isNaN(v1)) ? -1 : 0;
        },
        des: function(a, b) {
            var v1 = this._findSortValue(a), v2 = this._findSortValue(b);
            if (!isNaN(v1) && !isNaN(v2)) return (v2 - v1);
            return ((v1 < v2) || !isNaN(v1)) ? 1 : ((v1 > v2) || !isNaN(v2)) ? -1 : 0;
        }
    },
    $sort: function(values, func) {
        var me = this;
        return values.sort(function(a, b) { return func.apply(me, arguments); });
    },
    _findSortValue: function(value) {
        var v = ($.exists(value.getValue))
            ? value.getValue()
            : ($.exists(value.value))
                ? value.value
                : ($.exists(value.nodeName))
                    ? $.getText(value)
                    : value;
                    
        if ($.isString(v)) {
            if (v.indexOf("$") != -1) return $.money.parse(v).value;
            if (/\d{1,2}\/\d{1,2}\/(\d{2}|\d{2,4})/.test(v)) return new Date(v);
            if (/\d{3}-\d{2}-\d{4}/.test(v)) return $.ssn.parse(v);
            if (v.indexOf(".") != -1 && !isNaN(parseFloat(v))) return parseFloat(v);
            if (v.search(/([a-z]|[A-Z])+/) == -1 && !isNaN(parseInt(v))) return parseInt(v);
        }
        return v;
    }
}