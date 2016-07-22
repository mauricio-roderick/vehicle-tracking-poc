'use strict';

var config = {
	app: {
		title: 'Reekoh - GPS Tracking'
	},
	port: 18358,
	demo: {
		ip: '52.91.146.12',
		instance: 'demo1',
		socket_port: 8068,
		topic: 'reekoh/data'
	},
    mongo: {
        local_url: 'mongodb://127.0.0.1:27017/local',
        test_url: 'mongodb://reekohdev:Reekoh2016@ds015398.mlab.com:15398/reekoh-mongo-test',
        url: process.env.MONGO_URL || 'mongodb://reekohdev:Reekoh2016@ds015398.mlab.com:15398/reekoh-mongo-test',
    },
	mock: {
		topology: {
			instance: 'demo1',
			http_port: 8064,
			socket_port: 8065,
			topic: 'reekoh/data'
		},
		movement_interval: 2000,
		days_before_current: 5,
		movement_count: {
			min: 5,
			max: 10
		},
		device_count: {
			min: 2,
			max: 10
		},
		countries: {
			'PH' : {
				border: {
					lat: {
						max: 14.5570,
						min: 14.5145
					},
					lon: {
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
					lon: {
						max: -91.9336,
						min: -113.0713	
					}
				}
			},
			'IN' : {
				border: {
					lat: {
						max: 21.7391,
						min: 19.1348
					},
					lon: {
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
					lon: {
						max: -100.0854,
						min: -103.9307
					}
				}
			},
			'AU' : {
				border: {
					lat: {
						max: -25.8197,
						min: -29.8788
					},
					lon: {
						max: 151.8201,
						min: 145.9204
					}
				}
			}		
		}
	}
};

config.mongo.url = config.mongo.test_url;
module.exports = config;