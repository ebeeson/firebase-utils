/**
 * Terribly abusive Firebase utility extensions for KnockoutJS by Erik Beeson.
 * 
 * Originally released to Public Domain September 2013; respectful attribution appreciated.
 */

/**
 * Extend Firebase to generate a KnockoutJS observable bound to the value of this ref.
 * 
 * This probably only makes sense to use on primitive values.
 * 
 * This actually returns a `computed observable` that proxies writes to Firebase.
 */
Firebase.prototype.asObservable = function() {
	var observable = ko.observable();
	this.on('value', function(snapshot) {
		observable(snapshot.val());
	});
	return ko.computed({
		read: observable,
		write: Firebase.prototype.set,
		owner: this
	});
};


/**
 * Extend Firebase to generate a KnockoutJS observableArray bound to the children of this ref.
 * 
 * This probably only makes sense to use on a collection of primitive values.
 * 
 * Each array element is actually a `computed observable` that proxies writes to Firebase.
 */
Firebase.prototype.asObservableArray = function() {
	var observableArray = ko.observableArray();

	this.on('child_added', function(snapshot) {
		var ref = snapshot.ref();
		var observable = ko.observable(snapshot.val());
		var computed = ko.computed({
			read: observable,
			write: Firebase.prototype.set,
			owner: ref
		});
		observableArray.push(computed);
		ref.on('value', function(snapshot) {
			var value = snapshot.val();
			if(value === null) {
				observableArray.remove(computed);
			} else {
				observable(value);
			}
		});
	});

	return observableArray;
};
