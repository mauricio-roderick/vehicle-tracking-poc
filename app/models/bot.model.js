'use strict';

var mongoose     = require('mongoose'),
	Schema       = mongoose.Schema;

var BotSchema = new Schema({
	name: {
		type: String,
		trim: true,
		required: 'Please specify a descriptive name for this bot.'
	},
	user_id: {
		type: String,
		trim: true,
		required: 'Please specify the user which this bot belongs to.'
	},
	instance: {
		type: String,
		trim: true,
		required: 'Please specify the instance to use.'
	},
	port: {
		type: Number,
		required: 'Please specify the port to be used by this bot.'
	},
	protocol: {
		type: String,
		trim: true,
		required: 'Please select the protocol to be used by this bot.'
	},
	topic: {
		type: String,
		trim: true,
		required: 'Please specify the topic to use.'
	},
	frequency: {
		type: Number,
		required: 'Please specify how frequent(ms) this bot will send data.'
	},
	multiplier: {
		type: Number,
		required: 'Please specify how many times this bot will send data.'
	}
});

BotSchema.index({name: 1, user_id: 1}, {unique: true});

mongoose.model('Bot', BotSchema, 'bots');