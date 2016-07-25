'use strict';

const favicon = require('serve-favicon');

const config = require('./config/config'),
	BASE_URL = `http://127.0.0.1:${config.port}`;

var electron 		= require('electron'),
	electronApp 	= electron.app,
	BrowserWindow 	= electron.BrowserWindow,
	async 	 		= require('async'),
	mongoose 		= require('mongoose'),
	express  		= require('express'),
	electronConfig  = require('./config/electronConfig'),
	http 	 		= require('http');

electronApp.on('window-all-closed', function() {
	if (process.platform !== 'darwin') {
		electronApp.quit();
	}
});

electronApp.on('ready', function() {
	async.series({
		mongodb: (done) => {
			var db = mongoose.connection;

			db.once('open', () => {
				console.log('Connected to MongoDB Server.');

				require('./app/models/gps.model.js');
				done(null, db);
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
		mainWindow: (done) => {
			let mainWindow = new BrowserWindow({
				title: config.app.title,
				autoHideMenuBar: true,
				webPreferences: {
					nodeIntegration: false
				},
				width: 1024,
				height: 768
			});

			electronConfig.setAppMenu();
			//mainWindow.toggleDevTools();

			done(null, mainWindow);
		},
		expressApp: (done) => {
			let expressApp = express(),
			bodyParser = require('body-parser'),
			consolidate = require('consolidate');

			expressApp.disable('x-powered-by');
			// expressApp.set('showStackError', false);
			expressApp.use(bodyParser.json());
			expressApp.use(bodyParser.urlencoded({
				extended: true
			}));

			expressApp.engine('view.html', consolidate.swig);
			expressApp.set('view engine', 'view.html');
			expressApp.set('views', `${__dirname}/app/views`);
			expressApp.set('view cache', false);

			// Setting the app router and static folder
			expressApp.use(express.static(`${__dirname}/public`));
			expressApp.use(express.static(`${__dirname}/node_modules`));
			
			expressApp.use(function (req, res, next) {
				res.locals.base_url = BASE_URL;
				res.locals.gateway = config.gateway;
				next();
			});

			expressApp.use('/', require('./app/routes/index'));

			// Error handler
			expressApp.use(function (error, req, res, next) {
				if (error.status) {
					res.status(error.status).json({
						message: error.message
					});
				}
				else {
					console.log(error.stack);
					res.status(500).json({
						message: 'An unexpected error has occurred. Please contact support.'
					});
				}
			});

			// Assume 404 since no middleware responded
			expressApp.use((req, res) => {
				res.status(404).json({
					message: `${req.originalUrl} Not Found`
				});
			});
			done(null, expressApp);
		}
	}, (err, result) => {

		var httpServer = http.createServer(result.expressApp);
		httpServer.listen(config.port);
		httpServer.on('error', (error) => {
			console.log(error);
			process.exit();
		});
		httpServer.on('listening', () => {
			console.log(`Server listening on port ${config.port}`);
			result.mainWindow.loadURL(`${BASE_URL}/index`);
		});
		httpServer.once('close', () => {
			console.log('Web Server closed.');
		});

		result.mainWindow.on('closed', function() {
			result.mainWindow = null;
			httpServer.close();
		});
	});
});
