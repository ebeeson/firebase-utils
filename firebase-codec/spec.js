describe('firebase-codec tests', function() {
	var reservedCharacters = ['.', '#', '$', '[', ']', '/'];
	var testInputs = [
		'\\/.#%[]$ ~!@(){}',
		'foo.bar',
		'boo[te$st]',
		'\\one #{.\\\\',
		'\\{',
		'%24'
	];

	it('output matches input', function() {
		testInputs.forEach(function(input) {
			var encoded = firebaseCodec.encode(input);
			var decoded = firebaseCodec.decode(encoded);
			expect(decoded).toBe(input);
		});
	});

	it('output matches input (fully)', function() {
		testInputs.forEach(function(input) {
			var encoded = firebaseCodec.encodeFully(input);
			var decoded = firebaseCodec.decode(encoded);
			expect(decoded).toBe(input);
		});
	});

	it('encoded does not contain reserved characters', function() {
		testInputs.forEach(function(input) {
			var encoded = firebaseCodec.encode(input);
			reservedCharacters.forEach(function(c) {
				expect(encoded).not.toContain(c);
			});
		});
	});

	it('fully encoded does not contain reserved characters', function() {
		testInputs.forEach(function(input) {
			var encoded = firebaseCodec.encodeFully(input);
			reservedCharacters.forEach(function(c) {
				expect(encoded).not.toContain(c);
			});
		});
	});
});
