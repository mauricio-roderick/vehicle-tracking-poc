'use strict';

var request = require('request'),
	async = require('async'),
	Chance = require('chance'),
	chance = new Chance(Math.random()),
	mapData = require('./map-data.json'),
	config = require('../config/config').gateway,
	requestData = {
		'device': '567827489028376',
		'is_data': true,
		'event_id': '82',
		'gps': true,
		'fix_flag': 'A',
		'satellite_no': '8',
		'protocol': '*GS16',
		'dtm': '2013-02-28T23:58:33.000Z',
		'lat_dir': 'N',
		'lng_dir': 'E',
		'speed': 0,
		'azimuth': 0,
		'altitude': 37,
		'hdop': 0.85,
		'vdop': 0.35
	};

async.forEachOf(mapData.features, (feature, key, done) => {
	let url = `http://${config.instance}.reekoh.com:${config.port}/${config.topic}`,
		d = new Date();

	requestData.coordinates = feature.geometry.coordinates;
	requestData.dtm = d.toJSON();
	requestData.mock_id = chance.hash();
	
	request.post({
		url: url,
		json: requestData
	}, (err, response, body) => {
		console.log(body);
		done();
	});

}, function (err) {
	if (err) console.error(err);

	console.log('Done adding records.');
});
