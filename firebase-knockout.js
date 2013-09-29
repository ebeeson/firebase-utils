/**
 * Terribly abusive Firebase utility extensions for KnockoutJS by Erik Beeson.
 * 
 * Originally released to Public Domain September 2013; respectful attribution appreciated.
 */

/**
 * Extend Firebase to generate a knockoutjs observable bound to the value of this ref.
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
