'use strict';

var Menu = require('menu'),
menuTemplate = [
	{
		label: 'Edit',
		submenu: [
			{
				label: 'Undo',
				accelerator: 'CmdOrCtrl+Z',
				role: 'undo'
			},
			{
				label: 'Redo',
				accelerator: 'Shift+CmdOrCtrl+Z',
				role: 'redo'
			},
			{
				type: 'separator'
			},
			{
				label: 'Cut',
				accelerator: 'CmdOrCtrl+X',
				role: 'cut'
			},
			{
				label: 'Copy',
				accelerator: 'CmdOrCtrl+C',
				role: 'copy'
			},
			{
				label: 'Paste',
				accelerator: 'CmdOrCtrl+V',
				role: 'paste'
			},
			{
				label: 'Paste and Match Style',
				accelerator: 'Shift+Command+V',
				role: 'pasteandmatchstyle'
			},
			{
				label: 'Delete',
				role: 'delete'
			},
			{
				label: 'Select All',
				accelerator: 'CmdOrCtrl+A',
				role: 'selectall'
			},
		]
	},
	{
		label: 'View',
		submenu: [
			{
				label: 'Reload',
				accelerator: 'CmdOrCtrl+R',
				click(item, focusedWindow) {
					if (focusedWindow) focusedWindow.reload();
				}
			},
			{
				label: 'Toggle Full Screen',
				accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
				click(item, focusedWindow) {
					if (focusedWindow)
						focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
				}
			},
			{
				label: 'Toggle Developer Tools',
				accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
				click(item, focusedWindow) {
					if (focusedWindow)
						focusedWindow.webContents.toggleDevTools();
				}
			},
		]
	},
	{
		label: 'Window',
		role: 'window',
		submenu: [
			{
				label: 'Minimize',
				accelerator: 'CmdOrCtrl+M',
				role: 'minimize'
			},
			{
				label: 'Close',
				accelerator: 'CmdOrCtrl+W',
				role: 'close'
			},
		]
	},
	{
		label: 'Help',
		role: 'help',
		submenu: [
			{
			label: 'Learn More',
			click() { require('electron').shell.openExternal('http://electron.atom.io'); }
			},
		]
	},
];

// ElectronConfig.prototype.constructor = ElectronConfig;
// module.exports = ElectronConfig;

exports.setAppMenu = () => {
	let appMenu = new Menu();

	menuTemplate = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(menuTemplate);
};






