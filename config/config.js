'use strict';

module.exports = {
	app: {
		title: 'Reekoh - GPS Tracking'
	},
	port: 18358,
	gateway: {
		instance: 'demo1',
		port: 8056,
		topic: 'reekoh/data'
	},
    mongo: {
        url: process.env.MONGO_URL || 'mongodb://reekohdev:Reekoh2016@ds015398.mlab.com:15398/reekoh-mongo-test',
    }
};
