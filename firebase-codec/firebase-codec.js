var firebaseCodec = (function() {
	var escapes = (function(values) {
		return function(initial, map) {
			var i = values.length, result = initial;
			while(i--) result = map(result, values[i]) || initial;
			return result;
		};
	})([['\\', '\\'], ['.', '%'], ['#', '^'], ['$', '&'], ['[', '{'], [']', '}'] ]);

	return {
		encode: (function() {
			var regexp = new RegExp('[' + escapes('', function(pattern, v) { return pattern + '\\' + v[0]; }) + ']', 'g');
			var characterMap = escapes({}, function(map, v) { map[v[0]] = v[1]; });
			return function(s) { return s.replace(regexp, function(c) { return '\\' + characterMap[c]; }); };
		})(),
		decode: (function() {
			var regexp = new RegExp('\\\\[' + escapes('', function(pattern, v) { return pattern + '\\' + v[1]; }) + ']', 'g');
			var characterMap = escapes({}, function(map, v) { map['\\' + v[1]] = v[0]; });
			return function(s) { return s.replace(regexp, function(c) { return characterMap[c]; }); };
		})()
	}
})();
