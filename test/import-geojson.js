'use strict';

var request = require('request'),
	async = require('async'),
	Chance = require('chance'),
	chance = new Chance(Math.random()),
	mapData = require('../config/geojson.json'),
	gosafeJSON = require('../config/gosafe.json'),
	demo = require('../config/config').demo;

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


	gosafeJSON.coordinates = feature.geometry.coordinates;
	gosafeJSON.dtm = d.toJSON();
	gosafeJSON.speed = chance.integer({min: 5, max: 20});
	gosafeJSON.device_info = {
		_id: chance.hash(),
		name: `${name_prefix} ${name_num}`
	};
	
	request.post({
		url: url,
		json: gosafeJSON
	}, (err, response, body) => {
		console.log(body);
		done();
	});

}, function (err) {
	if (err) console.error(err);

	console.log('Done adding records.');
});
