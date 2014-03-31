Firebase.prototype.meta = function(key, value) {
	var ref = this.root().child('_').child(this.path.toString()).child('_');
	if(arguments.length == 0) {
		return ref;
	} else if(arguments.length == 1) {
		return ref.child(key);
	} else if(arguments.length == 2) {
		ref.child(key).set(value);
	} else {
		throw new Error('Firebase.prototype.meta: unexpected arguments');
	}
};
