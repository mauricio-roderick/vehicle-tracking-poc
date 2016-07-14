'use strict';

var validator = require('mongoose-validator');

exports.nameValidator = [
	validator({
		validator: 'isLength',
		arguments: [3, 50],
		message: 'Name should be at least {ARGS[0]} up to {ARGS[1]} characters in length.'
	})
];