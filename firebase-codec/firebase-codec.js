var firebaseCodec = {
	encode: (function(pattern, replacer) {
		return function(s) { return s.replace(pattern, replacer); };
	})(/[/%\.#\$\[\]]/g, function(c) { return '%' + c.charCodeAt(0).toString(16).toUpperCase(); }),
	encodeFully: function(s) {
		return encodeURIComponent(s).replace('.', '%2E');
	},
	decode: function(s) {
		return decodeURIComponent(s);
	}
};
