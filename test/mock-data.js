'use strict';

var request = require('request'),
	async = require('async'),
	Chance = require('chance'),
	chance = new Chance(Math.random()),
	config = require('../config/config.json'),
	mapData = require('../config/geojson.json'),
	gosafeJSON = require('../config/gosafe.json'),
	demo = require('../config/config').demo;


