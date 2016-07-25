'use strict';

exports.setAppMenu = function (app) {
	var Menu = require('menu');

	var menuTemplate = [{
		label: 'Application',
		submenu: [{
			label: 'Quit',
			accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Alt+F4',
			click: function () {
				app.quit();
			}
		}]
	}, {
		label: 'View',
		submenu: [{
			label: 'Reload',
			accelerator: 'CmdOrCtrl+R',
			click(item, focusedWindow) {
				if (focusedWindow) focusedWindow.reload();
			}
		}, {
			label: 'Toggle Full Screen',
			accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
			click(item, focusedWindow) {
				if (focusedWindow)
					focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
			}
		}]
	}, {
		label: 'Window',
		role: 'window',
		submenu: [{
			label: 'Minimize',
			accelerator: 'CmdOrCtrl+M',
			role: 'minimize'
		}, {
			label: 'Close',
			accelerator: 'CmdOrCtrl+W',
			role: 'close'
		}]
	}];

	Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
};






