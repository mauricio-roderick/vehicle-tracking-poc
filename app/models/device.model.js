'use strict';

var mongoose     = require('mongoose'),
	Schema       = mongoose.Schema;

var deviceSchema = new Schema({
	name: {
		type: String,
		trim: true
	},
	user_id: {
		type: String,
		trim: true
	},
	instance: {
		type: String,
		trim: true
	},
	port: {
		type: Number
	},
	protocol: {
		type: String,
		trim: true
	},
	topic: {
		type: String,
		trim: true
	},
	frequency: {
		type: Number
	},
	multiplier: {
		type: Number
	}
});

deviceSchema.index({name: 1, user_id: 1}, {unique: true});

mongoose.model('Device', deviceSchema, 'devices');