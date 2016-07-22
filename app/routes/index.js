'use strict';

var express = require('express'),
	async = require('async'),
	request = require('request'),
	moment = require('moment'),
	Chance = require('chance'),
	chance = new Chance(Math.random),
	config = require('../../config/config'),
	demo = config.demo,
	mock = config.mock,
	goSafeJson = require('../../config/gosafe.json'),
	router = express.Router();
	
var mongoose = require('mongoose'),
	Gps = mongoose.model('Gps');

router.get('/index', function(req, res, next) {
	let groupId = '$device_info._id',
		aggrePipeline = [
			{ 
				$match: {
					'device_info.mock_id' : {
						$exists: false
					}
				}
			},
			{ 
				$sort: { 
					timestamp: 1
				} 
			},
			{
				$group: {
					_id: '$device_info._id',
					device_info: { $first: '$device_info' },
					coordinates: { $first: '$coordinates' },
					timestamp: { $first: '$timestamp' },
					address: { $first: '$address' },
					weather: { $first: '$weather' },
					speed: { $first: '$speed' },
				}
			}
		];

	async.series({
		devices: (next) => {
			Gps.aggregate(aggrePipeline, (err, real_devices) => {
				next(err, real_devices);
			});
		},
		mockDevices: (next) => {
			aggrePipeline[0]['$match']['device_info.mock_id']['$exists'] = true;
			aggrePipeline[2]['$group']['_id'] = '$device_info.mock_id';

			Gps.aggregate(aggrePipeline, (err, mock_devices) => {
				next(err, mock_devices);
			});
		}
	},
	(err, result) => {
		if(err) {
			console.log(err);
			return res.send('Hoaa! A chalenge!');
		}
		
		let params = result,
			url = `http://${mock.topology.instance}.reekoh.com:${mock.topology.http_port}/${mock.topology.topic}`,
			deviceMarkers = [],
			interval,
			moveDevice = function (marker, done){

				let increment = chance.floating({
						max: 0.001,
						min: 0.0001
					});

				marker.device = marker.device_info._id;
				marker.coordinates.lat += chance.bool() ? -(increment) : (increment);
				marker.coordinates.lon += chance.bool() ? -(increment) : (increment);
				marker.timestamp = new Date().toJSON();
				marker.speed = chance.integer({min: 20, max: 30});

				delete marker._id;
				deviceMarkers[marker.mock_id] = marker;

				request.post({
					url: url,
					json: marker
				}, (err, response, body) => {
					
					done();
				});
			};

		if(result.mockDevices.length) {
			interval = setInterval(function (){
				async.eachLimit(result.mockDevices, 1, moveDevice, () => {
					console.log('Updated device locations.');
				});
			}, config.mock.movement_interval);
		} else {
			console.log('No mock devices found');
		}


		params.mock = mock;
		params.demo = demo;

		res.render('index', params);
	});
	
});

module.exports = router;
