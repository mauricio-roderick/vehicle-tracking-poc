'use strict';

var request = require('request'),
	fs = require('fs'),
	mongoose = require('mongoose'),
	mongoId = mongoose.Types.ObjectId,
	async = require('async'),
	moment = require('moment'),
	Chance = require('chance'),
	chance = new Chance(),
	configPath = './config',
	PowerBITask = require('./lib/powerBITask'),
	config = require(`${configPath}/config.js`),
	gosafeJSON = require(`${configPath}/gosafe.json`),
	mock = config.mock_data,
	demo = config.demo,
	dataImportFile = `import-${ moment().format('YYYY-MM-DD') }.json`,
	countryDevices = {},
	data = [],
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
}

var generateDeviceMovement = (device) => {
	let deviceMovement = [],
		ctr = chance.integer(mock.movement_count),
		deviceData;

	device.date.hour(1);

	for(; ctr > 0; ctr--) {
		let timestamp = device.date.add('30', 'seconds');

		if(importType == 'pbi')
		{
			deviceData = {
				"Vehicle": device.name,
				"Country": device.country,
				"Speed": 16,
				"Timestamp": timestamp.toISOString(),
				"Date": timestamp.format('MMM D')
			}
		}
		else {
			deviceData = {
				test: 123
			}
		}

		deviceMovement.push(deviceData);
	}

	return deviceMovement;
}

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
		dataByCountry = [],
		platesArray = [];

	countryDevices[country] = [];

	for(let ctr = numOfMarkers; ctr > 0; ctr--) {
		let plate = generatePlateName();

		while(platesArray.indexOf(plate) > -1) {
			plate = generatePlateName();
		}

		countryDevices[country].push({
			_id: new mongoId,
			name: plate,
		});
	}

	while(startDate.isBefore(curDate)) {
		let numOfDevices = chance.integer(numOfDevicesPerDay),
			devices = chance.pickset(countryDevices[country], numOfDevices);
		
		devices.forEach((device) => {
			device.country = country;
			device.date = startDate;
			
			let deviceMovement = generateDeviceMovement(device);

			data = data.concat(deviceMovement);
			dataByCountry = dataByCountry.concat(deviceMovement);
			console.log(device.name)
			console.log(device.date.toDate())
		}) 

		startDate.add(1, 'day');
	}

	next();

}, (err) => {

	let dataClone = JSON.parse(JSON.stringify(data)),
		batchData = [];
	
	async.waterfall([
		(next) => {
			async.whilst(
			    function () { return (dataClone.length > 0); },
			    function (cb) {
			        batchData.push(dataClone.splice(0, 100));
			        cb();
			    },
			    function (err) {
			        next(err);
			    }
			);
		},
		(next) => {
			if (importType === 'pbi') {
				let pbiOptions = {
					'tenant': 'reekoh.com',
					'username': 'demo@reekoh.com',
					'password': 'Dunu6897',
					'client_id': 'a52311aa-21d0-4065-acca-beb9420e5640',
					'client_secret': 'htThkxpBwMQgFDfUcqHFaXOunIaTSWM04a+s/LUF9qk=',
					'dataset': 'ac008b86-24ff-4bed-8177-5c6b4412fa4d',
					'table': 'GPS'
				},
				powerBITask = new PowerBITask(pbiOptions);

				powerBITask.init(function (bpiError) {
					if(bpiError) {
						return next(bpiError);
					} 

					async.eachLimit(batchData, 2, (batchItem, cb) => {
						powerBITask.send(batchItem, function (error) {
							cb(error);
						});
					}, (err) => {
						next(err);
					})
				});
			}
			else {
				next();
			}
		},
		(next) => {
			if (importType === 'mongo') {
				next();
			}
			else {
				next();
			}
		}
	], (err) => {
		if(err) {
			console.error(err);
		}
		
		fs.writeFile(dataImportFile, JSON.stringify(data), (err) => {
			if (err) throw err;
			
			console.log(`Import file created - ${dataImportFile}`);
		});
		
		console.log('Done importing data');
	})
});

