'use strict';

var request = require('request'),
	fs = require('fs'),
	mongoose = require('mongoose'),
	MongoId = mongoose.Types.ObjectId,
	async = require('async'),
	moment = require('moment'),
	Chance = require('chance'),
	chance = new Chance(),
	configPath = '../config',
	PowerBITask = require('./powerBITask'),
	config = require(`${configPath}/config.js`),
	gosafeJSON = require(`${configPath}/gosafe.json`),
	mongoDbItem = require(`${configPath}/mongoDbItem.json`),
	mock = config.mock,
	demo = config.demo,
	dataImportFile = `import-${ moment().format('YYYY-MM-DD') }.json`,
	countryDevices = {},
	data = [],
	powerBiData = [],
	mongoDbData = [],
	importType = (process.argv.length >= 3) ? process.argv[2] : '';

var generatePlateName = () => {
	let platePrefixParams = {
			length: 3,
			pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		},
		platePrefix = chance.string(platePrefixParams),
		plateNumParams = {
			min: 100, 
			max: 999
		},
		plateNum = chance.integer(plateNumParams),
		plate = `${platePrefix} ${plateNum}`;

	return plate;
};

var generateDeviceMovement = (device) => {
	let deviceMovement = {
			pbi: [],
			mongo: []
		},
		ctr = chance.integer(mock.movement_count),
		pbi, mongo;

	device.date.hour(1);

	for(; ctr > 0; ctr--) {
		let timestamp = device.date.add('30', 'seconds');

		pbi = {
			'Vehicle': device.name,
			'Country': device.country,
			'Speed': 16,
			'Timestamp': timestamp.toISOString(),
			'Date': timestamp.format('MMM D')
		};

		deviceMovement.pbi.push(pbi);
		
		mongo = JSON.parse(JSON.stringify(mongoDbItem));
		mongo.device_info.mock_id = device.mock_id;
		mongo.device_info.metadata.plate = device.name;
		mongo.device_info.name = device.name;
		mongo.address.country = device.country;
		mongo.timestamp = timestamp.toISOString();
		mongo.speed = chance.floating({
			min: 20,
			max: 30,
			fixed: 2
		});
		mongo.coordinates = {
			lat: chance.floating(mock.countries[device.country].border.lat),
			lon: chance.floating(mock.countries[device.country].border.lon)
		};

		delete mongo._id;

		deviceMovement.mongo.push(mongo);
	}

	return deviceMovement;
};

async.eachLimit(Object.keys(mock.countries), 1, (country, next) => {
	let numOfMarkers = chance.integer(mock.device_count),
		numOfDevicesPerDay = {
				min: Math.floor(parseInt(numOfMarkers) / 2),
				max: numOfMarkers
		},
		curDate = moment(),
		startDate = moment(curDate).subtract(mock.days_before_current, 'days'),
		countryImportFile = `${country}-${ moment().format('YYYY-MM-DD') }.json`,
		datadataImportFile = `${ moment().format('YYYY-MM-DD') }.json`,
		platesArray = [];

	countryDevices[country] = [];

	for(let ctr = numOfMarkers; ctr > 0; ctr--) {
		let plate = generatePlateName();

		while(platesArray.indexOf(plate) > -1) {
			plate = generatePlateName();
		}

		countryDevices[country].push({
			mock_id: new MongoId(),
			name: plate,
		});
	}

	let mockDeviceMovement = (device) => {
		device.country = country;
		device.date = startDate;
		
		let deviceMovement = generateDeviceMovement(device);

		powerBiData = powerBiData.concat(deviceMovement.pbi);
		mongoDbData = mongoDbData.concat(deviceMovement.mongo);
	};

	while(startDate.isBefore(curDate)) {
		let numOfDevices = chance.integer(numOfDevicesPerDay),
			devices = chance.pickset(countryDevices[country], numOfDevices);
		
		devices.forEach(mockDeviceMovement);

		startDate.add(1, 'day');
	}

	next();

}, (err) => {

	let pbiDataClone = JSON.parse(JSON.stringify(powerBiData)),
		mongoDataClone = JSON.parse(JSON.stringify(mongoDbData)),
		pbiBatchData = [],
		mongoBatchData = [],
		itemsPerBatch = 50,
		powerBITask;
	
	async.waterfall([
		(next) => {
			async.whilst(
			    () => { return (pbiDataClone.length > 0); },
			    (cb) => {
			        pbiBatchData.push(pbiDataClone.splice(0, itemsPerBatch));
			        mongoBatchData.push(mongoDataClone.splice(0, itemsPerBatch));
			        cb();
			    },
			    (err) => {
			        next(err);
			    }
			);
		},
		(next) => {
			let pbiOptions = {
				'tenant': 'reekoh.com',
				'username': 'demo@reekoh.com',
				'password': 'Dunu6897',
				'client_id': 'a52311aa-21d0-4065-acca-beb9420e5640',
				'client_secret': 'htThkxpBwMQgFDfUcqHFaXOunIaTSWM04a+s/LUF9qk=',
				'dataset': 'ac008b86-24ff-4bed-8177-5c6b4412fa4d',
				'table': 'GPS'
			};

			powerBITask = new PowerBITask(pbiOptions);

			powerBITask.init(function (bpiError) {
				if(bpiError) {
					return next(bpiError);
				} 

				powerBITask.clearTable((err) => {
					if(! err) {
						console.log('Removed Power Bi records');
					}

					next(err);
				});
			});
		},
		(next) => {
			async.eachLimit(pbiBatchData, 2, (batchItem, cb) => {
				powerBITask.send(batchItem, function (error) {
					cb(error);
				});
			}, (err) => {
				if(! err) {
					console.log('Created Powerbi records.');
				}
				next(err);
			});
		},
		(next) => {
			let mongoose = require('mongoose'),
				db = mongoose.connection;

			db.once('open', () => {
				console.log('Connected to MongoDB Server.');
				require('../app/models/gps.model.js');
				
				let gpsModel = mongoose.model('Gps');
				gpsModel.remove({}, (err) => {
					console.log('Removed mongoDb records');
					next(err, gpsModel);
				});
			});

			db.once('close', () => {
				mongoose.disconnect(() => {
					console.log('MongoDB Connection Closed.');
				});
			});

			console.log('Connecting to MongoDB Server...');

			let connectWithRetry = () => {
				mongoose.connect(config.mongo.url, {}, (error) => {
					if (error) {
						console.error('Failed to connect to mongo on startup - retrying in 5 sec', error);
						setTimeout(connectWithRetry, 5000);
					}
				});
			};

			connectWithRetry();
		},
		(gpsModel, next) => {
			async.eachLimit(mongoBatchData, 1, (batchItem, cb) => {
				gpsModel.collection.insert(batchItem, { ordered: true }, () => {
					cb();
				});
			}, (err) => {
				if(! err) {
					console.log('Mongo Db & Powerbi records.');
				}
				next(err);
			});
		}
	], (err) => {
		if(err) {
			console.error(err);
		}
		
		// fs.writeFile(dataImportFile, JSON.stringify(data), (err) => {
		// 	if (err) throw err;
			
		// 	console.log(`Import file created - ${dataImportFile}`);
		// });
		
		console.log(`Done importing ${powerBiData.length} records`);
	});	
});

