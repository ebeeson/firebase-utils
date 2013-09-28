/**
 * Terribly abusive Firebase utility extensions by Erik Beeson.
 * 
 * Originally released to Public Domain September 2013; respectful attribution appreciated.
 * 
 * Depends on `_` (I use lodash)
 */



/**
 * Constants for event names to aid code completion and minification.
 */
var FirebaseEvents = {
	VALUE: 'value',
	CHILD_ADDED: 'child_added',
	CHILD_CHANGED: 'child_changed',
	CHILD_REMOVED: 'child_removed',
	CHILD_MOVED: 'child_removed'
};


/**
 * Overload `child` to accept multiple arguments which get joined by '/' to create the final path.
 */
Firebase.prototype.child = (function(_super) {
	return function() {
		return arguments.length > 1 ? _super.call(this, Array.prototype.slice.call(arguments, 0).join('/')) : _super.apply(this, arguments);
	};
})(Firebase.prototype.child);


/**
 * Overload `on` to optionally accept an object mapping event names to callback functions.
 * 
 * Also makes the `child_` prefix optional.
 */
Firebase.prototype.on = (function(_super) {
	var eventNameMap = {
		added: FirebaseEvents.CHILD_ADDED,
		changed: FirebaseEvents.CHILD_CHANGED,
		removed: FirebaseEvents.CHILD_REMOVED,
		moved: FirebaseEvents.CHILD_MOVED
	};
	return function(events) {
		if(_.isPlainObject(events) && arguments.length == 1) {
			_.forEach(events, function(callback, e) {
				_super.call(this, eventNameMap[e] || e, callback);
			});
			return this;
		} else {
			return _super.apply(this, arguments);
		}
	};
})(Firebase.prototype.on);


/**
 * Add event handler registration methods for common events to aid code completion.
 */
_.forEach({
	onValue: FirebaseEvents.VALUE,
	onChildAdded: FirebaseEvents.CHILD_ADDED,
	onChildChanged: FirebaseEvents.CHILD_CHANGED,
	onChildRemoved: FirebaseEvents.CHILD_REMOVED,
	onChildMoved: FirebaseEvents.CHILD_MOVED
}, function(eventName, key) {
	Firebase.prototype[key] = _.partial(Firebase.prototype.on, eventName);
	Firebase.prototype[key + 'Once'] = _.partial(Firebase.prototype.once, eventName);
});


/**
 * A replacement for `new Firebase(url)` that returns an object that should act identically
 * to using `new`, but that is itself also a function that is equivalent to calling `.child`.
 * 
 * For example, before:
 * 
 * ```
 * var firebase = new Firebase(url);
 * firebase.on('value', ...);
 * firebase.child('foo').on('child_added', ...);
 * ```
 * 
 * After:
 * 
 * ```
 * var firebase = $firebase(url);
 * firebase.on('value', ...);
 * firebase('foo').on('child_added', ...);
 * ```
 * 
 * The original Firebase instance is available via the `_ref` attribute of the returned function.
 * 
 * Accepts either a `Firebase` instance or a URL which will be used to create a new `Firebase` instance.
 */
var $firebase = function(urlOrRef) {
	var ref = _.isString(urlOrRef) ? new Firebase(urlOrRef) : urlOrRef;
	return _.assign(_.bind(Firebase.prototype.child, ref), Firebase.prototype, {_ref: ref}, function(objectValue, sourceValue) {
		return _.isFunction(sourceValue) ? _.bind(sourceValue, ref) : sourceValue;
	});
};
