'use strict';

var mongoose     = require('mongoose'),
	Schema       = mongoose.Schema;

var gpsSchema = new Schema({
	device_info: {
		type: Schema.Types.Mixed
	},
	device_data: {
		type: Schema.Types.Mixed
	},
	address: {
		country: {
			type: String
		},
		city: {
			type: String
		},
		baranggay: {
			type: String
		},
		street: {
			type: String
		},
		postal_code: {
			type: String
		}
	},
	weather: {
		temperature: {
			type: Number
		},
		humidity: {
			type: Number
		},
		windSpeed: {
			type: Number
		},
		summary: {
			type: String
		},
		precip_intensity: {
			type: String
		}
	},
	timestamp: {
		type: Date,
		default: Date.now
	}
});

// gpsSchema.index({name: 1, user_id: 1}, {unique: true});
gpsSchema.path('timestamp').expires('7d');

mongoose.model('Gps', gpsSchema, 'ccdGps');