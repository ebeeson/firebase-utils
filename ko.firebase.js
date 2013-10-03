/**
 * Terribly abusive Firebase utility extensions for KnockoutJS by Erik Beeson.
 * 
 * Originally released to Public Domain September 2013; respectful attribution appreciated.
 */


ko.firebase = ko.firebase || {};


/**
 * Return an observable (technically a (Writable Computed Observable)[http://knockoutjs.com/documentation/computedObservables.html#writeable_computed_observables]) that has the value of the given ref and sets the ref on write.
 * 
 * Optionally takes an initial value (probably unnecessary).
 * 
 * Adds an `off` method that unbinds the Firebase `value` event handler and a `_ref` property with the original Firebase ref.
 */
ko.firebase.observable = function(ref, value) {
 	var observable = ko.observable(value);
 	var computed = ko.computed({
		read: observable,
		write: Firebase.prototype.set,
		owner: ref
	});
	var handler = function(snapshot) { observable(snapshot.val()); };
	ref.on('value', handler);
	computed.off = function() {
		ref.off('value', handler);
	};
	computed._ref = ref;
	return computed;
};


/**
 * Return an observableArray of `ko.firebase.observable` instances.
 * 
 * Adds an `off` method that unbinds the Firebase `child_added` event handler (and ) and a `_ref` property with the original Firebase ref.
 */
ko.firebase.observableArray = function(ref) {
	var observableArray = ko.observableArray();
	var handler = function(snapshot) {
		var ref = snapshot.ref();
		var observable = ko.firebase.observable(ref, snapshot.val());
		observableArray.push(observable);
		ref.on('value', function(snapshot) {
			if(snapshot.val() === null) {
				observableArray.remove(observable);
				observable.off();
			}
		});
	};
	ref.on('child_added', handler);
	observableArray.off = function() {
		ref.off('child_added', handler);
		observableArray().forEach(function(observable) { observable.off(); });
	};
	// todo throw error if observableArray is modified directly
	return observableArray;
};


/**
 * Extend Firebase to generate a KnockoutJS observable bound to the value of this ref.
 * 
 * This probably only makes sense to use on primitive values.
 * 
 * This actually returns a `computed observable` that proxies writes to Firebase.
 */
Firebase.prototype.asObservable = function() {
	return ko.firebase.observable(this);
};


/**
 * Extend Firebase to generate a KnockoutJS observableArray bound to the children of this ref.
 * 
 * This probably only makes sense to use on a collection of primitive values.
 * 
 * Each array element is actually a `computed observable` that proxies writes to Firebase.
 */
Firebase.prototype.asObservableArray = function() {
	return ko.firebase.observableArray(this);
};
