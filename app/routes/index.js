'use strict';

var express = require('express'),
	async = require('async'),
	request = require('request'),
	moment = require('moment'),
	Chance = require('chance'),
	chance = new Chance(Math.random),
	config = require('../../config/config'),
	demo = config.demo,
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
		
		let params = result;

		res.render('index', params);
	});

	// Gps.aggregate(,
	// function (err, gps) {
	// 	let interval,
	// 		url = `http://${demo.instance}.reekoh.com:${demo.http_port}/${demo.topic}`;

	// 	params.gps = gps;
		
	// 	if(gps.length > 0) {

	// 		gps = gps.map((gpsItem, i) => {
	// 			gpsItem._index = i;
	// 			return gpsItem;
	// 		});

	// 		let curDate = moment();
	// 		let gps_ = gps.map((gpsItem, i) => {
	// 			let date_ = moment(curDate).add(i, 'days'),
	// 			newItem = {
	// 				'Vehicle': gpsItem.device_info.name,
	// 				'Country': chance.pickone(['PH', 'AU', 'CA', 'US']),
	// 				'Speed': gpsItem.speed,
	// 				'Timestamp': date_.toISOString(),
	// 				'Date': date_.format('MMM D'),
	// 			};

	// 			// console.log(newItem);
	// 			return newItem;
	// 		});
	// 		console.log(JSON.stringify(gps_));


	// 		let moveMarkers = function (marker, done){
	// 			let requestData = JSON.parse(JSON.stringify(goSafeJson)),
	// 				increment = chance.floating({
	// 					max: 0.001,
	// 					min: 0.0001
	// 				});

	// 			gps[marker._index].coordinates.lat += chance.bool() ? -(increment) : (increment);
	// 			gps[marker._index].coordinates.lon += chance.bool() ? -(increment) : (increment);

	// 			requestData.dtm = new Date().toJSON();
	// 			requestData.coordinates[1] = marker.coordinates.lat;
	// 			requestData.coordinates[0] = marker.coordinates.lon;
	// 			requestData.speed = chance.integer({min: 5, max: 20});
	// 			requestData.device_info = marker.device_info;

	// 			request.post({
	// 				url: url,
	// 				json: requestData
	// 			}, (err, response, body) => {
	// 				done();
	// 			});
	// 		};

	// 		interval = setInterval(function (){
	// 			async.eachLimit(gps, 10, moveMarkers, () => {
	// 				console.log('Updated full gps list.');
	// 			});
	// 		}, config.mock_interval);
	// 	}
	// 	else {
	// 		console.log('No gps found.');
	// 	}	

	// 	res.render('index', params);
	// });
});

module.exports = router;
