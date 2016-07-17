'use strict';

var validator = require('mongoose-validator');

exports.nameValidator = [
	validator({
		validator: 'isLength',
		arguments: [3, 50],
		message: 'Name should be at least {ARGS[0]} up to {ARGS[1]} characters in length.'
	})
];

exports.frequencyValidator = [
	validator({
		validator: 'isInt',
		message: 'Frequency should be a number.'
	})
];

exports.multiplierValidator = [
	validator({
		validator: 'isInt',
		arguments: [0, 10000],
		message: 'Multiplier should not be greater than 10,000.'
	})
];

exports.userIdValidator = [
	validator({
		validator: 'isAlphanumeric',
		message: 'Invalid user ID'
	})
];