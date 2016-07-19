'use strict';

var request = require('request'),
	async = require('async'),
	Chance = require('chance'),
	chance = new Chance(Math.random()),
	mapData = require('../config/geojson-2.json'),
	demo = require('../config/config').demo,	
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
	let url = `http://${demo.instance}.reekoh.com:${demo.http_port}/${demo.topic}`,
		d = new Date(),
		name_prefix_params = {
			length: 3,
			pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		},
		name_prefix = chance.string(name_prefix_params),
		name_num_params = {
			min: 100, 
			max: 999
		},
		name_num = chance.integer(name_num_params);


	requestData.coordinates = feature.geometry.coordinates;
	requestData.dtm = d.toJSON();
	requestData.speed = chance.integer({min: 5, max: 20});
	requestData.device_info = {
		_id: chance.hash(),
		name: `${name_prefix} ${name_num}`
	};
	
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
