(function() {
	var translateKeys = function(keys, callback) {
		if(_.isArray(keys)) {
			callback(_.map(keys, firebaseCodec.encode).join('/'));
		} else if(_.isPlainObject(keys)) {
			_.forEach(keys, function(v, k) {
				callback(firebaseCodec.encode(k) + '/' + firebaseCodec.encode(v));
			});
		} else {
			callback(firebaseCodec.encode(keys));
		}
	};


	Firebase.prototype.index = function(keys) {
		var ref = this;
		var index = this.parent().meta('index');
		if(arguments.length) {
			translateKeys(keys, function(key) {
				index.child(key).set(ref.name());
			});
			return this;
		} else {
			return index;
		}
	};


	Firebase.prototype.lookup = function(keys, callback, context) {
		var ref = this;
		var index = this.meta('index');
		translateKeys(keys, function(key) {
			index.child(key).once('value', function(snapshot) {
				if(snapshot.val() === null) {
					callback.call(context, null);
				} else {
					ref.child(snapshot.val()).once('value', callback, context);
				}
			});
		});
	};
})();
