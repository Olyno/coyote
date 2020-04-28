const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs-extra');
const { logSuccess } = require('./logs');

if (require('electron-squirrel-startup')) {
	app.quit();
}

logSuccess('App started');

let mainWindow;

fs.ensureDirSync('assets/servers');
fs.ensureDirSync('assets/profile');

function createWindow () {
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		},
		icon: 'public/images/favicon.png'
	});

	mainWindow.setMenuBarVisibility(false);

	mainWindow.loadFile('public/index.html');

	mainWindow.on('closed', () => {
		logSuccess('Main window closed');
		mainWindow = null
    });
    
    logSuccess('Main window created');
    
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
})

app.on('activate', () => {
	if (mainWindow === null) createWindow();
})

ipcMain.on('fullscreen', () => {
    mainWindow.maximize();
    logSuccess('App in fullscreen mode.');
});