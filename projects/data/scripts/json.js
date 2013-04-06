$.json = {
	serialize: function(obj) {
		if ($.isNull(obj)) return null;
		if ($.isUndefined(obj)) return undefined;
		if (!$.isArray(obj) && !$.isObject(obj))
			return obj.toString();
		var r = [],
			f = ($.isArray(obj)) ? "[{0}]" : "{{0}}";
		for (var n in obj) {
			var o = obj[n];
			if ($.isFunction(o)) continue;
			 var   v = ($.isNumber(o))
					? o
					: ($.isString(o))
						? '"' + o + '"'
						: $.json.serialize(o); 
			r[r.length] = (($.isObject(obj) && !$.isArray(obj))
				? ("\"" + n + "\"" + ":")
				: "") + v;
		}
		return $.str.format(f, r);
	},
	deserialize: function(str) {
		if ($.isObject(str)) return str;
		if ($.isString(str))
			try { return eval("(" + str + ")"); }
		catch (e) { return str; }
		return undefined;
	}
}