$.str = {
	build: function() { return "".concat.apply(new String(), arguments); },
	format: function() {
		var a = arguments, s = a[0], l = a.length,  A, S;
		for (i = 1; i < l; i++) {
		    A = a[i];
		    S = ($.isNull(A)) ? "null" : ($.isUndefined(A)) ? "undefined" : A.toString();
			s = s.replace(RegExp("\\{" + (i - 1) + "\\}", "g"), S);
		}
		return s;
	},
	parse: function(){
	    return String.fromCharCode.apply(String, arguments);
	},
	trim: function(s) {
		return $.str.trimStart($.str.trimEnd(s));
	},
	trimStart: function(s) {
		if(!$.isString(s)) throw new Error("Cannot trim non-string values");
		return ($.exists(s.replace))
			? s.replace(/^\s*\b/, "") : s;
	},
	trimEnd: function(s) {
		if(!$.isString(s)) throw new Error("Cannot trim non-string values");
		return ($.exists(s.replace))
			? s.replace(/\b\s*$/, "") : s;
	}
}