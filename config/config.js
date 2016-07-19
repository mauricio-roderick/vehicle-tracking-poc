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
	mock_interval: 10000,
    mongo: {
        local_url: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/local',
        url: process.env.MONGO_URL || 'mongodb://reekohdev:Reekoh2016@ds015398.mlab.com:15398/reekoh-mongo-test'
    }
};
