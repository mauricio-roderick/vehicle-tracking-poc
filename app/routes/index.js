'use strict';

var express = require('express'),
	async = require('async'),
	request = require('request'),
	Chance = require('chance'),
	chance = new Chance(Math.random),
	config = require('../../config/config'),
	goSafeJson = require('../../config/go-safe-json.json'),
	router = express.Router();
	
var mongoose = require('mongoose'),
	Gps = mongoose.model('Gps');

router.get('/index', function(req, res, next) {
	let params = {},
	demo = config.demo;

	Gps.aggregate([
		{
			$project: {
		        is_mock: {
		        	$cmp: ['$device_info._id', '$device']
		        },
		        device: 1,
		        device_info: 1,
				coordinates: 1,
				timestamp: 1,
				address: 1,
				weather: 1,
		    }
		},
		{ 
			$match: {
				'is_mock' : {
					$ne: 0
				}
			}
		},
		{ 
			$sort: { 
				timestamp: -1
			} 
		},
		{
			$group: {
				_id: {
					device: '$device',
					mock_id: '$device_info._id'
				},
				device: { $first: '$device' },
				device_info: { $first: '$device_info' },
				coordinates: { $first: '$coordinates' },
				timestamp: { $first: '$timestamp' },
				address: { $first: '$address' },
				weather: { $first: '$weather' },
			}
		}
	],
	function (err, gps) {
		let interval,
			url = `http://${demo.instance}.reekoh.com:${demo.port}/${demo.topic}`;

		if(gps.length > 0) {
			params.gps = gps;

			gps = gps.map((gpsItem, i) => {
				gpsItem._index = i;
				return gpsItem;
			});

			let moveMarkers = function (marker, done){
				let requestData = JSON.parse(JSON.stringify(goSafeJson)),
					increment = chance.floating({
						max: 0.001,
						min: 0.0001
					});

				gps[marker._index].coordinates.lat += chance.bool() ? -(increment) : (increment);
				gps[marker._index].coordinates.lon += chance.bool() ? -(increment) : (increment);

				requestData.dtm = new Date().toJSON();
				requestData.coordinates[1] = marker.coordinates.lat;
				requestData.coordinates[0] = marker.coordinates.lon;
				requestData.device_info = marker.device_info;

				request.post({
					url: url,
					json: requestData
				}, (err, response, body) => {
					done();
				});
			};

			interval = setInterval(function (){
				async.eachLimit(gps, 10, moveMarkers, () => {
					console.log('Updated full gps list.');
				});
			}, config.mock_interval);
		}
		else {
			console.log('No gps found.');
		}	

		res.render('index', params);
	});
});

module.exports = router;
