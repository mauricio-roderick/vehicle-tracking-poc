'use strict';

var express = require('express'),
	async = require('async'),
	router = express.Router();
	
var mongoose = require('mongoose'),
	Gps = mongoose.model('Gps');

router.get('/index', function(req, res, next) {
	let params = {};

	Gps.aggregate([
		{ 
			$sort: { 
				timestamp: -1
			} 
		},
		{
			$group: {
				_id: {
					device: '$device',
					mock_id: '$mock_id'
				},
				device: { $first: '$device' },
				coordinates: { $first: '$coordinates' },
				mock_id: { $first: '$mock_id' },
				timestamp: { $first: '$timestamp' },
			}
		}
	],
	function (err, gps) {
		params.gps = gps;

		var ctr = 0;

		function moveMarkers(){
			var markers = gps;
			
			async.forever(
				function(next) {
					let increment = 0.001,
						marker = markers.shift();

					console.log(marker.mock_id);
					
					markers.push(marker);
					setTimeout(next, 2000);
				},
				function(err) {
					
				}
			);
		}

		setTimeout(moveMarkers, 2000);
		
		res.render('index', params);
	});
});

module.exports = router;
