'use strict';

var mongoose           = require('mongoose'),
	Schema             = mongoose.Schema,
	botPresetValidator = require('./validators/bot-preset.validator');

var BotPresetSchema = new Schema({
	name: {
		type: String,
		trim: true,
		unique: true,
		required: 'Please specify a descriptive name for this preset.',
		validate: botPresetValidator.nameValidator
	},
	user_id: {
		type: String,
		trim: true,
		index: true //from accounts
	},
	timestamp: {
		type: Date
	},
	dataset: Schema.Types.Mixed
});

mongoose.model('BotPreset', BotPresetSchema, 'botpresets');