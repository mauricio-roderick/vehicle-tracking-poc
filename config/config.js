'use strict';

module.exports = {
	app: {
		title: 'Reekoh - GPS Tracking'
	},
	port: 18358,
	demo: {
		instance: 'demo1',
		http_port: 8056,
		tcp_port: 8056,
		topic: 'reekoh/data'
	},
	mock_data: {
		deviceCount: 50,
		countries: {
			'PH' : {
				border: {
					lat: {
						max: 14.5570,
						min: 14.5145
					},
					lng: {
						max: 121.0614,
						min: 121.0019
					}
				}
			},
			'US' : {
				border: {
					lat: {
						max: 44.3081,
						min: 33.1743
					},
					lng: {
						max: -91.9336,
						min: -113.0713	
					}
				}
			},
			'IN' : {
				border: {
					lat: {
						max: 21.7391,
						min: 	19.1348
					},
					lng: {
						max: 82.5073,
						min: 78.4644
					}
				}
			},
			'MX' : {
				border: {
					lat: {
						max: 24.2970,
						min: 21.4224
					},
					lng: {
						max: -100.0854,
						min: -103.9307
					}
				}
			}
		}
	}
	mock_interval: 10000,
    mongo: {
        local_url: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/local',
        test_url: process.env.MONGO_URL || 'mongodb://reekohdev:Reekoh2016@ds015398.mlab.com:15398/reekoh-mongo-test',
        url: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/local',
    }
};
